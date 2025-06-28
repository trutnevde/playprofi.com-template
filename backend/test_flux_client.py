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
        "Authorization": f"Bearer {FLUX_API_KEY}",
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
async def main():
    try:
        images = await call_flux(
            prompt="A cat on its back legs running like a human is holding a big silver fish.",
            reference=None,
            fmt="1:1",
            mode="ai",
        )
        print("Generated images:")
        for url in images:
            print(url)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
