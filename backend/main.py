from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Relationship, Session, create_engine, select
from sqlalchemy import Column, JSON
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

# --- Flux config ---
FLUX_API_KEY = os.getenv("FLUX_API_KEY")
FLUX_ENDPOINT = "https://api.bfl.ai/v1/flux-kontext-pro"

async def call_flux(
    prompt: str,
    reference: Optional[str],
    fmt: str,
    mode: str,
    poll_interval: float = 0.5,
) -> List[str]:
    """
    Асинхронно генерирует обложки через Flux API:
      1. POST /flux-kontext-pro → {"id", "polling_url"}
      2. GET polling_url?id=… пока status != Ready
      3. Возвращает список URL изображений
    """
    headers = {
        "accept": "application/json",
        "x-key": FLUX_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "prompt": prompt,
        "aspect_ratio": fmt,
        "mode": mode,
        **({"reference": reference} if reference else {}),
    }

    async with httpx.AsyncClient(timeout=60) as client:
        # 1) отправляем запрос на генерацию
        resp = await client.post(FLUX_ENDPOINT, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        polling_url = data["polling_url"]
        request_id = data["id"]

        # 2) ждём, опрашивая polling_url
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
                # предположим, что API возвращает в поле result.sample список URL
                imgs = pd.get("result", {}).get("sample", [])
                return imgs if isinstance(imgs, list) else [imgs]
            elif status in ("Error", "Failed"):
                raise RuntimeError(f"Flux generation failed: {pd}")

# ── SQLModel ORM models ────────────────────────────────────────────────

# ── Заглушка вместо Flux API ─────────────────────────────────────────────
# async def call_flux(prompt: str, reference: Optional[str], fmt: str, mode: str) -> List[str]:
#     return [
#         "https://placehold.co/600x400?text=Dummy+1",
#         "https://placehold.co/600x400?text=Dummy+2",
#         "https://placehold.co/600x400?text=Dummy+3",
#     ]
# ────────────────────────────────────────────────────────────────────────────


class GeneratedCover(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    prompt: str
    reference: Optional[str] = None
    format: str
    mode: str
    images: List[str] = Field(sa_column=Column(JSON), default_factory=list)

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

class FavoriteTemplate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    src: str
    alt: Optional[str]
    aspect: str

# ── Pydantic request/response schemas ────────────────────────────────────

class GenerateRequest(BaseModel):
    prompt: str
    reference: Optional[str] = None
    format: str
    mode: str

class GenerateResponse(BaseModel):
    group_id: int
    images: List[str]

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
    items: List[Item]

# ── Database setup & seed ────────────────────────────────────────────────

engine = create_engine("sqlite:///./app.db")
SQLModel.metadata.create_all(engine)

def seed_data():
    with Session(engine) as session:
        # Templates
        if not session.exec(select(TemplateGroup)).first():
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
        # Favorites
        if not session.exec(select(FavoriteTemplate)).first():
            for url in [
                "https://placehold.co/130x75?text=Ref+1",
                "https://placehold.co/130x75?text=Ref+2",
                "https://placehold.co/130x75?text=Ref+3",
            ]:
                session.add(FavoriteTemplate(src=url, alt="ref", aspect="16:9"))
        session.commit()

seed_data()

# ── FastAPI application ────────────────────────────────────────────────

app = FastAPI()
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

    images = await call_flux(req.prompt, req.reference, req.format, req.mode)
    gen = GeneratedCover(
        prompt=req.prompt,
        reference=req.reference,
        format=req.format,
        mode=req.mode,
        images=images,
    )
    with Session(engine) as session:
        session.add(gen)
        session.commit()
        session.refresh(gen)

    return {"group_id": gen.id, "images": images}

@app.post("/api/regenerate/{group_id}", response_model=GenerateResponse)
async def regenerate(group_id: int):
    with Session(engine) as session:
        gen = session.get(GeneratedCover, group_id)
        if not gen:
            raise HTTPException(404, "Group not found")
    images = await call_flux(gen.prompt, gen.reference, gen.format, gen.mode)
    with Session(engine) as session:
        gen.images = images
        session.add(gen)
        session.commit()
    return {"group_id": group_id, "images": images}

@app.get("/api/generated", response_model=List[GeneratedGroupOut])
def list_generated():
    with Session(engine) as session:
        gens = session.exec(select(GeneratedCover)).all()

    result: List[GeneratedGroupOut] = []
    for g in gens:
        items = [Item(src=url, alt="", aspect=g.format) for url in g.images]
        result.append(GeneratedGroupOut(
            id=g.id,
            title=g.prompt,
            params=GenerateRequest(
                prompt=g.prompt,
                reference=g.reference,
                format=g.format,
                mode=g.mode
            ),
            orientation=g.format,
            items=items
        ))

    return result

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

@app.get("/api/favorites", response_model=List[Item])
def list_favorites():
    with Session(engine) as session:
        favs = session.exec(select(FavoriteTemplate)).all()
    return [Item(src=f.src, alt=f.alt, aspect=f.aspect) for f in favs]
