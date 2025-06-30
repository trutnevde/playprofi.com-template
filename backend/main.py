from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Relationship, Session, create_engine, select
from enum import Enum as PyEnum
from sqlalchemy import Column, JSON, delete, Enum as SQLEnum
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from typing import List, Optional, Any
import httpx
import asyncio
import logging
import config
import io

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)


class Settings(BaseSettings):
    flux_api_key: str
    flux_endpoint: str = "https://api.bfl.ai/v1/flux-kontext-pro"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

# --- Flux config ---
FLUX_API_KEY = settings.flux_api_key
FLUX_ENDPOINT = settings.flux_endpoint

async def call_single_flux(
    prompt: str, reference: Optional[str], fmt: str, mode: str, poll_interval: float = 0.5
) -> str:
    headers = {
        "accept": "application/json",
        "x-key": config.flux_api_key,
        "Content-Type": "application/json",
    }
    payload = {
        "prompt": prompt,
        "aspect_ratio": fmt,
        "mode": mode,
        **({"reference": reference} if reference else {}),
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(config.flux_endpoint, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        polling_url = data["polling_url"]
        request_id = data["id"]

        # polling
        while True:
            await asyncio.sleep(poll_interval)
            poll = await client.get(
                polling_url,
                headers=headers,
                params={"id": request_id},
            )
            poll.raise_for_status()
            pd = poll.json()
            status = pd.get("status")
            if status == "Ready":
                sample = pd.get("result", {}).get("sample")
                # если API вернул список — берём первый элемент
                if isinstance(sample, list):
                    return sample[0]
                return sample  # предполагаем строку URL
            if status in ("Error", "Failed"):
                raise HTTPException(502, f"Flux generation failed: {pd}")

# 2) Основная функция — делает count последовательных запросов
async def call_flux(
    prompt: str,
    reference: Optional[str],
    fmt: str,
    mode: str,
    count: int = 3,
) -> List[str]:
    images: List[str] = []
    for _ in range(count):
        src = await call_single_flux(prompt, reference, fmt, mode)
        images.append(src)
    return images

async def upload_single_image(client: httpx.AsyncClient, url: str) -> str:
    try:
        # Скачиваем изображение
        response = await client.get(url)
        response.raise_for_status()
        file_bytes = response.content

        # Подготавливаем и отправляем файл
        files = {'file': ('image.png', io.BytesIO(file_bytes), 'image/png')}
        upload_response = await client.post(config.cdn_endpoint, files=files)
        upload_response.raise_for_status()

        # Парсим ответ
        data = upload_response.json()
        print("Ответ от CDN:", data)  # ← временно логируем ответ

        # Попробуем достать ссылку
        variants = (
            data.get("result", {})
            .get("variants", [])
        )
        if not variants:
            raise ValueError("CDN не вернул variants")

        return variants[0]

    except Exception as e:
        print(f"Ошибка при загрузке {url}: {e}")
        return ""


async def upload_to_cdn(urls: List[str]) -> List[str]:
    async with httpx.AsyncClient(timeout=60) as client:
        tasks = [upload_single_image(client, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r]  # отфильтровываем пустые строки


# ── SQLModel ORM models ────────────────────────────────────────────────

# ── Заглушка вместо Flux API ─────────────────────────────────────────────
# async def call_flux(prompt: str, reference: Optional[str], fmt: str, mode: str) -> List[str]:
#     return [
#         "https://placehold.co/600x400?text=Dummy+1",
#         "https://placehold.co/600x400?text=Dummy+2",
#         "https://placehold.co/600x400?text=Dummy+3",
#     ]
# ────────────────────────────────────────────────────────────────────────────

class JobStatus(str, PyEnum):
    pending = "pending"
    in_progress = "in_progress"
    ready = "ready"
    failed = "failed"

class GenerationJob(SQLModel, table=True):
    __tablename__ = "generationjob"

    id: Optional[int] = Field(default=None, primary_key=True)
    prompt: str
    reference: Optional[str] = None
    format: str
    mode: str

    # используем настоящий Enum
    status: JobStatus = Field(
        sa_column=Column(
            SQLEnum(JobStatus, name="jobstatus", create_type=False),
            default=JobStatus.pending,
            nullable=False,
        )
    )

    # хранит JSON‑список URL (или None, если ещё не готово)
    result: Optional[List[str]] = Field(
        default=None,
        sa_column=Column(JSON, nullable=True),
    )

    # текст ошибки, если что‑то упало
    error: Optional[str] = None

class ImageLayer(SQLModel):
    """ DTO для одного слоя — в pydantic‑схеме """
    type: str
    x: float
    y: float
    props: dict

class GeneratedImage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cover_id: int = Field(foreign_key="generatedgroup.id")
    src: str
    layers: Optional[List[Any]] = Field(
        sa_column=Column(JSON, nullable=False), default_factory=list
    )
    cover: Optional["GeneratedGroup"] = Relationship(back_populates="images")

class GeneratedGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    prompt: str
    reference: Optional[str]
    format: str
    mode: str
    images: List[GeneratedImage] = Relationship(
        back_populates="cover",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )

class TemplateGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    items: List["TemplateItem"] = Relationship(back_populates="group")

class TemplateItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    src: str
    alt: Optional[str]
    aspect: str
    group_id: Optional[int] = Field(default=None, foreign_key="templategroup.id")
    group: Optional[TemplateGroup] = Relationship(back_populates="items")

class ExampleGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    items: List["ExampleItem"] = Relationship(back_populates="group")

class ExampleItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    src: str
    alt: Optional[str]
    aspect: str
    group_id: Optional[int] = Field(default=None, foreign_key="examplegroup.id")
    group: Optional[ExampleGroup] = Relationship(back_populates="items")

class MyTemplate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    src: str
    alt: Optional[str]
    aspect: str
    layers: Optional[List[Any]] = Field(
        sa_column=Column(JSON, nullable=False), default_factory=list
    )

# ── Pydantic request/response schemas ────────────────────────────────────

class GenerateRequest(BaseModel):
    prompt: str
    reference: Optional[str] = None
    format: str
    mode: str
    count: int = 3

    @classmethod
    def __get_validators__(cls):
        yield from super().__get_validators__()
        def check_count(v):
            if not (1 <= v <= 10):
                raise ValueError("count must be between 1 and 10")
            return v
        yield check_count

class ImageOut(BaseModel):
    id: int
    src: str
    alt: Optional[str] = ""
    aspect: str
    layers: List[dict] = []

class GenerateResponse(BaseModel):
    group_id: int
    images: List[ImageOut]

class JobResponse(BaseModel):
    job_id: int
    status: JobStatus
    result: Optional[List[str]] = None
    error: Optional[str] = None

class Item(BaseModel):
    src: str
    alt: Optional[str]
    aspect: str

class GroupOut(BaseModel):
    id: int
    title: str
    items: List[Item]

class GeneratedGroupOut(BaseModel):
    id: int
    title: str
    params: GenerateRequest
    orientation: str
    items: List[ImageOut]

# ── Database setup & seed ────────────────────────────────────────────────

engine = create_engine("sqlite:///./app.db")
SQLModel.metadata.create_all(engine)

print("Using database:", engine.url)

def seed_data():
    with Session(engine, expire_on_commit=False) as session:
        exists = session.exec(select(TemplateGroup)).first()

        # Templates
        if not session.exec(select(TemplateGroup)).first():
            if not exists:
                print("Seeding TemplateGroup…")
            for title, (src, alt, aspect, count) in [
                ("Наука", ("https://placehold.co/300x150","Превью","16:9",6)),
                ("Врачи", ("https://placehold.co/300x150","Превью","16:9",2)),
                ("Врачи", ("https://placehold.co/150x300","Превью","9:16",3)),
            ]:
                grp = TemplateGroup(title=title)
                session.add(grp)
                session.commit()
                for _ in range(count):
                    session.add(TemplateItem(src=src, alt=alt, aspect=aspect, group_id=grp.id))
        # Examples
        if not session.exec(select(ExampleGroup)).first():
            grp = ExampleGroup(title="Примеры (Наука)")
            session.add(grp)
            session.commit()
            for _ in range(6):
                session.add(ExampleItem(src="https://placehold.co/300x150", alt="Превью", aspect="16:9", group_id=grp.id))
        # My Templates
        if not session.exec(select(MyTemplate)).first():
            for src in [
                "https://placehold.co/130x75?text=Ref+1",
                "https://placehold.co/130x75?text=Ref+2",
                "https://placehold.co/130x75?text=Ref+3",
            ]:
                session.add(MyTemplate(src=src, alt="ref", aspect="16:9"))
        session.commit()

seed_data()

# ── FastAPI application ────────────────────────────────────────────────

app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate", response_model=JobResponse)
async def generate(req: GenerateRequest, background_tasks: BackgroundTasks):
    job_data = {}
    with Session(engine, expire_on_commit=False) as session:
        job = GenerationJob(
            prompt=req.prompt,
            reference=req.reference,
            format=req.format,
            mode=req.mode,
            status=JobStatus.pending,
        )
        session.add(job)
        session.commit()
        session.refresh(job)
        job_data = {"job_id": job.id, "status": job.status}

    background_tasks.add_task(run_generation, job.id, req.count)

    return JobResponse(**job_data)


@app.get("/api/generate/{job_id}/status", response_model=JobResponse)
def get_status(job_id: int):
    with Session(engine, expire_on_commit=False) as session:
        job = session.get(GenerationJob, job_id)
        if not job:
            raise HTTPException(404, "Job not found")
        return JobResponse(
            job_id=job.id,
            status=job.status,
            result=job.result,
            error=job.error,
        )

@app.post("/api/regenerate/{job_id}", response_model=JobResponse)
async def regenerate(job_id: int, background_tasks: BackgroundTasks):
    with Session(engine, expire_on_commit=False) as session:
        job = session.get(GenerationJob, job_id)
        if not job:
            raise HTTPException(404, "Job not found")

    # создаём новую задачу с теми же параметрами
    new_job = GenerationJob(
        prompt=job.prompt,
        reference=job.reference,
        format=job.format,
        mode=job.mode,
        status=JobStatus.pending,
    )
    with Session(engine, expire_on_commit=False) as session:
        session.add(new_job)
        session.commit()
        session.refresh(new_job)

    background_tasks.add_task(run_generation, new_job.id, len(job.result or []))

    return JobResponse(job_id=new_job.id, status=new_job.status)

async def run_generation(job_id: int, count: int):
    with Session(engine, expire_on_commit=False) as session:
        job = session.get(GenerationJob, job_id)
        job.status = JobStatus.in_progress
        session.commit()

        try:
            # 1) Генерируем изображения через Flux
            flux_urls = await call_flux(job.prompt, job.reference, job.format, job.mode, count)
            # 2) Загружаем их в CDN
            cdn_urls = await upload_to_cdn(flux_urls)

            # 3) Сохраняем группу и связанные изображения
            cover = GeneratedGroup(
                prompt=job.prompt,
                reference=job.reference,
                format=job.format,
                mode=job.mode,
            )
            session.add(cover)
            session.commit()
            session.refresh(cover)

            for src in cdn_urls:
                img = GeneratedImage(
                    cover_id=cover.id,
                    src=src,
                    layers=[{
                        "id": "bg",
                        "type": "image",
                        "image": src,
                        "x": 0,
                        "y": 0,
                        "visible": True,
                        "lock": True,
                    }],
                )
                session.add(img)
            session.commit()

            # 4) Обновляем саму задачу
            job.result = cdn_urls
            job.status = JobStatus.ready
            session.commit()

        except Exception as e:
            job.status = JobStatus.failed
            job.error = str(e)
            session.commit()
            logger.error(f"Job {job_id} failed: {e}", exc_info=True)

from typing import List
from fastapi import HTTPException
from sqlmodel import select, Session
from sqlalchemy.orm import selectinload

@app.get("/api/generated", response_model=List[GeneratedGroupOut])
def list_generated():
    with Session(engine, expire_on_commit=False) as session:
        groups = session.exec(
            select(GeneratedGroup)
            .options(selectinload(GeneratedGroup.images))
        ).all()

        if not groups:
            return []  # или HTTPException(404), если хотите 404 при пустом

        out: List[GeneratedGroupOut] = []
        for grp in groups:
            params = GenerateRequest(
                prompt=grp.prompt,
                reference=grp.reference,
                format=grp.format,
                mode=grp.mode,
                count=len(grp.images),
            )

            items = [
                ImageOut(
                    id=img.id,
                    src=img.src,
                    alt=img.layers[0].get("alt", "") if img.layers else "",
                    aspect=grp.format,
                    layers=img.layers or [],
                )
                for img in grp.images
            ]

            out.append(GeneratedGroupOut(
                id=grp.id,
                title=grp.prompt,          # можно заменить на любое другое поле
                params=params,
                orientation=grp.format,
                items=items,
            ))

        return out


@app.delete("/api/generated/{group_id}", status_code=204)
def delete_generated(group_id: int):
    with Session(engine, expire_on_commit=False) as session:
        gen = session.get(GeneratedGroup, group_id)
        if not gen:
            raise HTTPException(404, "Group not found")
        session.delete(gen)
        session.commit()
    return

@app.get("/api/templates", response_model=List[GroupOut])
def list_templates():
    with Session(engine) as session:
        out: List[GroupOut] = []
        for grp in session.exec(select(TemplateGroup)).all():
            items = session.exec(
                select(TemplateItem).where(TemplateItem.group_id == grp.id)
            ).all()
            out.append(GroupOut(
                id=grp.id,
                title=grp.title,
                items=[Item(src=i.src, alt=i.alt, aspect=i.aspect) for i in items]
            ))
    return out

@app.get("/api/examples", response_model=List[GroupOut])
def list_examples():
    with Session(engine) as session:
        out: List[GroupOut] = []
        for grp in session.exec(select(ExampleGroup)).all():
            items = session.exec(
                select(ExampleItem).where(ExampleItem.group_id == grp.id)
            ).all()
            out.append(GroupOut(
                id=grp.id,
                title=grp.title,
                items=[Item(src=i.src, alt=i.alt, aspect=i.aspect) for i in items]
            ))
    return out

@app.get("/api/my-templates", response_model=List[Item])
def list_my_templates():
    with Session(engine) as session:
        favs = session.exec(select(MyTemplate)).all()
    return [Item(src=f.src, alt=f.alt, aspect=f.aspect) for f in favs]


@app.patch("/api/generated/{group_id}/image/{image_id}/layers", status_code=204)
def update_layers(group_id: int, image_id: int, layers: List[dict]):
    """ Сохраняем на бэке состояние слоёв для конкретного изображения """
    with Session(engine) as session:
        img = session.get(GeneratedImage, image_id)
        if not img or img.cover_id != group_id:
            raise HTTPException(404, "Image not found")
        img.layers = layers
        session.add(img)
        session.commit()
    return


# WebSocket
@app.websocket("/ws/generate/{job_id}")
async def ws_generate(ws: WebSocket, job_id: int):
    await ws.accept()
    while True:
        with Session(engine) as session:
            job = session.get(GenerationJob, job_id)
            if not job:
                await ws.send_json({"error": "Job not found"})
                await ws.close()
                return

            payload = {
                "job_id": job.id,
                "status": job.status,
                "result": job.result,
                "error": job.error,
            }
        await ws.send_json(payload)

        if job.status in (JobStatus.ready, JobStatus.failed):
            await ws.close()
            return

        await asyncio.sleep(1)