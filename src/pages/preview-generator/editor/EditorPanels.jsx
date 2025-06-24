import { FaChevronUp, FaChevronDown } from "react-icons/fa";

// Текстовый инструмент
export const TextToolPanel = () => (
  <div>
    <h5 className="mb-2 font-medium">Шрифты, размер, выравнивание, цвет</h5>
    <select className="mb-2 w-full rounded bg-dark-coal px-2 py-1">
      <option>Arial</option>
      <option>Roboto</option>
      <option>Times New Roman</option>
    </select>
    <input
      type="number"
      placeholder="Размер"
      className="mb-2 w-full rounded bg-dark-coal px-2 py-1"
    />
    <div className="mb-4 flex gap-2">
      <button className="rounded bg-dark-coal px-2 py-1">L</button>
      <button className="rounded bg-dark-coal px-2 py-1">C</button>
      <button className="rounded bg-dark-coal px-2 py-1">R</button>
    </div>
    <input type="color" className="mb-4 h-8 w-full" />
    <h5 className="mb-2 font-medium">Декорации</h5>
    <div className="mb-4 flex gap-2">
      <button className="rounded bg-dark-coal px-2 py-1 font-bold">B</button>
      <button className="rounded bg-dark-coal px-2 py-1 italic">I</button>
      <button className="rounded bg-dark-coal px-2 py-1 underline">U</button>
    </div>
    <h5 className="mb-2 font-medium">Эффекты</h5>
    <div className="grid max-h-40 grid-cols-3 gap-2 overflow-auto">
      {/* здесь ячейки эффектов */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-16 rounded bg-dark-coal" />
      ))}
    </div>
  </div>
);

// Эффекты изображения
export const EffectsToolPanel = () => (
  <div>
    {[
      "Экспозиция",
      "Насыщенность",
      "Контраст",
      "Яркость",
      "Подсветка",
      "Тени",
      "Температура",
      "Резкость",
    ].map((prop) => (
      <div key={prop} className="mb-4">
        <label className="mb-1 block">{prop}</label>
        <input
          type="range"
          min="0"
          max="200"
          defaultValue="100"
          className="w-full"
        />
      </div>
    ))}
  </div>
);

// Emoji
export const EmojiToolPanel = () => (
  <div>
    <input
      type="text"
      placeholder="Поиск эмоджи…"
      className="mb-2 w-full rounded bg-dark-coal px-2 py-1"
    />
    <div className="grid max-h-48 grid-cols-3 gap-2 overflow-auto">
      {/* примеры эмоджи */}
      {["😀", "🎉", "🔥", "❤️", "👍", "😎", "🚀", "✨", "🥳"].map(
        (emoji, i) => (
          <button key={i} className="text-2xl">
            {emoji}
          </button>
        ),
      )}
    </div>
  </div>
);

// Shapes (Фигуры)
export const ShapesToolPanel = () => (
  <div>
    <h5 className="mb-2 font-medium">Выберите фигуру</h5>
    <div className="grid grid-cols-3 gap-2">
      {["rectangle", "circle", "triangle", "star", "polygon", "line"].map(
        (shape) => (
          <button key={shape} className="h-12 rounded bg-dark-coal">
            {shape}
          </button>
        ),
      )}
    </div>
  </div>
);

// Sticker (Наклейки)
export const StickerToolPanel = () => (
  <div>
    <input
      type="text"
      placeholder="Поиск наклеек…"
      className="mb-2 w-full rounded bg-dark-coal px-2 py-1"
    />
    <div className="grid max-h-48 grid-cols-2 gap-2 overflow-auto">
      {/* примеры наклеек */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-16 rounded bg-dark-coal" />
      ))}
    </div>
  </div>
);

// Eraser (Ластик)
export const EraserToolPanel = () => (
  <div>
    <label className="mb-1 block">Размер кисти</label>
    <input
      type="range"
      min="1"
      max="50"
      defaultValue="10"
      className="mb-4 w-full"
    />
    <button className="mb-2 w-full rounded bg-blue-500 py-2 text-white">
      Стереть за 30 💎
    </button>
    <button className="w-full rounded bg-blue-300 py-2 text-white">
      Удалить фон за 20 💎
    </button>
  </div>
);

// Image overlay (Добавить изображение)
export const ImageOverlayToolPanel = () => (
  <div>
    <label className="mb-1 block">Загрузить изображение</label>
    <input type="file" className="mb-2 w-full" />
    <button className="w-full rounded bg-dark-coal py-2">Наложить</button>
  </div>
);

// Background (Фон)
export const BackgroundToolPanel = () => (
  <div>
    <label className="mb-1 block">Цвет фона</label>
    <input type="color" className="mb-4 h-10 w-full border-0 p-0" />
    <label className="mb-1 block">Изображение фона</label>
    <input type="file" className="w-full" />
  </div>
);
