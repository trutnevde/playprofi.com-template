from sqlmodel import Session, create_engine, select
from main import GeneratedGroup, GeneratedImage  # поправьте на свой импорт

# Подключаемся к той же sqlite-базе
engine = create_engine("sqlite:///./app.db")

with Session(engine) as session:
    # 1) Создаём саму группу
    cover = GeneratedGroup(
        prompt="Test group from Picsum",
        reference=None,
        format="16:9",
        mode="manual"  # любое значение, которое вы используете для “ручных” групп
    )
    session.add(cover)
    session.commit()
    session.refresh(cover)

    # 2) Добавляем три картинки
    for idx in range(1, 4):
        src = f"https://picsum.photos/1280/720?random={idx}"
        img = GeneratedImage(
            cover_id=cover.id,
            src=src,
            layers=[  # фон-слой, который нельзя двигать или удалить
                {
                    "id": "bg",
                    "type": "image",
                    "image": src,
                    "x": 0,
                    "y": 0,
                    "visible": True,
                    "lock": True
                }
            ]
        )
        session.add(img)

    session.commit()

    print(f"Создана группа {cover.id} с тремя картинками.")
