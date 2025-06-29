# migrate_old_images.py
from sqlmodel import Session, select, text
from main import GeneratedGroup, GeneratedImage, engine
from sqlalchemy import text

def migrate():
    with Session(engine) as session:
        covers = session.exec(select(GeneratedGroup)).all()
        for cover in covers:
            # читаем «сырые» URL из старой колонки JSON
            raw_urls = session.execute(
                text("SELECT images FROM generatedcover WHERE id = :id"),
                {"id": cover.id},
            ).scalar_one() or []
            
            # для каждого URL создаём запись в GeneratedImage
            for url in raw_urls:
                session.add(GeneratedImage(cover_id=cover.id, url=url, layers=[]))
        
        session.commit()
        print(f"✓ Migrated {len(covers)} covers into GeneratedImage rows.")

if __name__ == "__main__":
    migrate()
