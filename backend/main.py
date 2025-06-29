from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Relationship, Session, create_engine, select
from sqlalchemy import Column, JSON, delete
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, conint, HttpUrl
from pydantic_settings import BaseSettings
from typing import List, Optional, Dict, Any
import httpx
import os
from dotenv import load_dotenv, find_dotenv
import asyncio
import logging
import config
import io
import ast

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
    with Session(engine) as session:
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

@app.post("/api/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    if not req.prompt and req.mode == "ai":
        raise HTTPException(400, "Prompt is required for AI mode")

    flux_urls = await call_flux(req.prompt, req.reference, req.format, req.mode, req.count)

    try:
        cdn_urls = await upload_to_cdn(flux_urls)
    except httpx.HTTPError as e:
        # если загрузка в CDN упала — можно всё равно вернуть оригиналы
        cdn_urls = flux_urls
        logger.warning(f"Upload to CDN failed, using flux urls: {e}")
        # raise HTTPException(502, f"Upload to CDN failed: {e}")

    with Session(engine) as session:
        cover = GeneratedGroup(
            prompt=req.prompt,
            reference=req.reference,
            format=req.format,
            mode=req.mode,
        )
        session.add(cover); session.commit(); session.refresh(cover)

        # создаём связанные записи
        for src in cdn_urls:
            img = GeneratedImage(
                cover_id=cover.id,
                src=src,
                layers=[
                    {
                        "id": "bg",
                        "type": "image",
                        "image": src,
                        "x": 0,
                        "y": 0,
                        "visible": True,
                        "lock": True,
                    }
                ],
            )
            session.add(img)
        session.commit()

        # вытаскиваем их назад
        images = session.exec(
            select(GeneratedImage).where(GeneratedImage.cover_id == cover.id)
        ).all()

    return {
        "group_id": cover.id,
        "images": [
            ImageOut(id=i.id, src=i.src, layers=i.layers, aspect=cover.format) for i in images
        ],
    }

@app.post("/api/regenerate/{group_id}", response_model=GenerateResponse)
async def regenerate(group_id: int):
    with Session(engine) as session:
        cover = session.get(GeneratedGroup, group_id) or HTTPException(404, "Not found")
    flux_urls = await call_flux(cover.prompt, cover.reference, cover.format, cover.mode, cover.count)

    try:
        cdn_urls = await upload_to_cdn(flux_urls)
    except httpx.HTTPError as e:
        # если заливка в CDN упала — можно всё равно вернуть оригиналы
        cdn_urls = flux_urls

        raise HTTPException(502, f"Upload to CDN failed: {e}")

    with Session(engine) as session:
        # удаляем старые
        session.exec(
            delete(GeneratedImage).where(GeneratedImage.cover_id == group_id)
        )
        # вставляем новые, сохраняя пустые слои
        for src in cdn_urls:
            session.add(GeneratedImage(cover_id=group_id, src=src, aspect=cover.format, layers=[
                    {
                        "id": "bg",
                        "type": "image",
                        "image": src,
                        "x": 0,
                        "y": 0,
                        "visible": True,
                        "lock": True,
                    }
                ],))
        session.commit()

        images = session.exec(
            select(GeneratedImage).where(GeneratedImage.cover_id == group_id)
        ).all()

    return {
        "group_id": group_id,
        "images": [ImageOut(id=i.id, src=i.src, layers=i.layers) for i in images],
    }

@app.get("/api/generated", response_model=List[GeneratedGroupOut])
def list_generated():
    with Session(engine) as session:
        stmt = select(GeneratedGroup).options(selectinload(GeneratedGroup.images))
        covers = session.exec(stmt).all()

    result = []
    for cover in covers:
        items = [
            ImageOut(
                id=img.id,
                src=img.src,
                alt="",
                aspect=cover.format,
                layers=img.layers
            )
            for img in cover.images
        ]
        result.append(
            GeneratedGroupOut(
                id=cover.id,
                title=cover.prompt,
                params=GenerateRequest(
                    prompt=cover.prompt,
                    reference=cover.reference,
                    format=cover.format,
                    mode=cover.mode
                ),
                orientation=cover.format,
                items=items
            )
        )
    return result

@app.delete("/api/generated/{group_id}", status_code=204)
def delete_generated(group_id: int):
    with Session(engine) as session:
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