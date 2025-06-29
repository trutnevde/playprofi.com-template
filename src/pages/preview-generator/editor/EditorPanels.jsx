import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { AccordionSelect, ColorPicker, NumberSpinner } from "./EditorSidebar";
import { useEffect, useState } from "react";

import IconStrikenthrough from "../../../shared/assets/icons/letter-strikenthrough.svg?react";
import IconUnderline from "../../../shared/assets/icons/letter-underline.svg?react";
import IconItalic from "../../../shared/assets/icons/letter-italic.svg?react";
import IconBold from "../../../shared/assets/icons/letter-bold.svg?react";
import AlignLeft from "../../../shared/assets/icons/align-left.svg?react";
import AlignCenter from "../../../shared/assets/icons/align-center.svg?react";
import AlignRight from "../../../shared/assets/icons/align-right.svg?react";
import IconSearch from "../../../shared/assets/icons/search-normal.svg?react";

import Effect1 from "../../../shared/assets/image/editor/effects/glitch.png";
import Effect2 from "../../../shared/assets/image/editor/effects/fire.png";
import Effect3 from "../../../shared/assets/image/editor/effects/melting.png";
import Effect4 from "../../../shared/assets/image/editor/effects/fire-2.png";

import Emoji from "../../../shared/assets/image/editor/emoji/image.png";

import Sticker1 from "../../../shared/assets/image/editor/stickers/arrow-1.png";
import Sticker2 from "../../../shared/assets/image/editor/stickers/arrow-2.png";

import Shape1 from "../../../shared/assets/image/editor/shapes/square.svg?react";
import Shape2 from "../../../shared/assets/image/editor/shapes/circle.svg?react";
import Shape3 from "../../../shared/assets/image/editor/shapes/triangle.svg?react";

import IconGem from "../../../shared/assets/icons/gem.svg?react";
import { FaPlus } from "react-icons/fa6";
import { useLayers } from "../hooks/useLayers";
import { uniqueId } from "lodash";

// Текстовый инструмент
export const TextToolPanel = () => {
  const [font, setFont] = useState("Roboto");
  const [fontSize, setFontSize] = useState(120);
  const [align, setAlign] = useState("left");
  const [color, setColor] = useState("#ffffff");

  const fontOptions = [
    { value: "Roboto", label: "Roboto" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
  ];

  return (
    <div className="flex-grow space-y-5 overflow-hidden">
      <div className="flex items-end gap-5">
        <div className="flex flex-grow flex-col">
          <h5 className="mb-2 text-sm">Шрифт</h5>
          <AccordionSelect
            options={fontOptions}
            value={font}
            onChange={setFont}
          />
        </div>
        <NumberSpinner
          value={fontSize}
          onChange={setFontSize}
          min={1}
          placeholder="Размер"
        />
      </div>
      <div className="flex gap-5">
        <div className="mb-4 flex h-9 gap-2 rounded-xl bg-dark-supporting">
          <button className="rounded-xl p-2 hover:bg-white hover:bg-opacity-10">
            <AlignLeft />
          </button>
          <button className="rounded-xl p-2 hover:bg-white hover:bg-opacity-10">
            <AlignCenter />
          </button>
          <button className="rounded-xl p-2 hover:bg-white hover:bg-opacity-10">
            <AlignRight />
          </button>
        </div>
        <div className="mb-4 flex h-9 gap-2 rounded-xl bg-dark-supporting">
          <button className="rounded-xl p-2 hover:bg-white hover:bg-opacity-10">
            <IconBold />
          </button>
          <button className="rounded-xl p-2 hover:bg-white hover:bg-opacity-10">
            <IconItalic />
          </button>
          <button className="rounded-xl p-2 hover:bg-white hover:bg-opacity-10">
            <IconUnderline />
          </button>
          <button className="rounded-xl p-2 hover:bg-white hover:bg-opacity-10">
            <IconStrikenthrough />
          </button>
        </div>
        <ColorPicker value={color} className="pr-0" onChange={setColor} />
      </div>
      <h5 className="mb-2 font-medium">Эффекты</h5>
      <div className="overflow-y-scroll! grid max-h-full grid-cols-3 gap-2">
        {/* здесь ячейки эффектов */}
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect1} className="h-full w-full object-contain" alt="" />
        </div>
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect2} className="h-full w-full object-contain" alt="" />
        </div>
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect3} className="h-full w-full object-contain" alt="" />
        </div>
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect4} className="h-full w-full object-contain" alt="" />
        </div>
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect1} className="h-full w-full object-contain" alt="" />
        </div>
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect2} className="h-full w-full object-contain" alt="" />
        </div>
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect3} className="h-full w-full object-contain" alt="" />
        </div>
        <div className="cursor-pointer overflow-hidden rounded-xl">
          <img src={Effect4} className="h-full w-full object-contain" alt="" />
        </div>
      </div>
    </div>
  );
};

// Эффекты изображения

const sliderProps = [
  "Экспозиция",
  "Насыщенность",
  "Контраст",
  "Яркость",
  "Подсветка",
  "Тени",
  "Температура",
  "Резкость",
];
export const EffectsToolPanel = () => {
  // инициализируем состояние для каждого слайдера значением 100%
  const [values, setValues] = useState(
    sliderProps.reduce((acc, prop) => ({ ...acc, [prop]: 100 }), {}),
  );

  const handleChange = (prop) => (e) => {
    const v = Number(e.target.value);
    setValues((prev) => ({ ...prev, [prop]: v }));
  };

  return (
    <div>
      {sliderProps.map((prop) => (
        <div key={prop} className="mb-4 flex flex-col items-start gap-3">
          <label className="w-32 text-sm">{prop}</label>
          <div className="flex w-full items-center">
            <input
              type="range"
              min="0"
              max="200"
              value={values[prop]}
              onChange={handleChange(prop)}
              className="hover:bg-gray-500 h-1 flex-grow appearance-none rounded border-supporting bg-supporting outline-none transition"
              style={{
                // кастом стиль для ползунка
                "--thumb-size": "12px",
              }}
            />
            <span className="w-12 text-right text-sm font-light text-supporting">
              {values[prop]}%
            </span>
          </div>
        </div>
      ))}
      {/* Глобальный стиль для ползунков */}
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: var(--thumb-size);
            height: var(--thumb-size);
            background-color: theme("colors.main-accent"); /* main-accent */
            border-radius: 9999px;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          input[type="range"]::-moz-range-thumb {
            width: var(--thumb-size);
            height: var(--thumb-size);
            background-color: theme("colors.main-accent");
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            transition: background-color 0.2s;
          }
        `}
      </style>
    </div>
  );
};

const EMOJI_LIST = new Array(50).fill({
  src: Emoji,
  names: ["grinning", "улыбка"],
});
// Emoji
export const EmojiToolPanel = () => {
  const [query, setQuery] = useState("");

  const filtered = EMOJI_LIST.filter(({ names }) => {
    const q = query.toLowerCase().trim();
    return names.some((name) => name.toLowerCase().includes(q));
  });

  return (
    <div className="flex h-full flex-col space-y-3">
      {/* Поиск остаётся фиксированно сверху */}
      <div className="flex h-9 items-center rounded-xl bg-dark-graphite px-4">
        <input
          type="text"
          placeholder="Найти эмоджи"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-[21px] flex-grow bg-transparent text-supporting outline-none placeholder:text-supporting"
        />
        <button className="ml-2">
          <IconSearch className="size-5 cursor-pointer" />
        </button>
      </div>

      {/* Только эта область скроллится */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-5 gap-2">
          {filtered.map(({ src, names }) => (
            <button
              key={src}
              className="flex flex-col items-center rounded-xl bg-dark-graphite py-2"
            >
              <img src={src} alt={names.join(", ")} className="h-8 w-8" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-5 py-4 text-center text-supporting">
              Эмоджи не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SHAPES = [
  { key: "square", Icon: Shape1, label: "Квадрат" },
  { key: "circle", Icon: Shape2, label: "Круг" },
  { key: "triangle", Icon: Shape3, label: "Треугольник" },
];

// Shapes (Фигуры)
export const ShapesToolPanel = () => (
  <div>
    <h5 className="mb-2 font-medium text-supporting">Выберите фигуру</h5>
    <div className="grid grid-cols-3 gap-2">
      {SHAPES.map(({ key, Icon, label }) => (
        <button
          key={key}
          className="flex aspect-1 flex-col items-center justify-center gap-1 rounded-xl bg-dark-graphite p-5 transition-colors hover:bg-dark-supporting"
          title={label}
          onClick={() => {
            /* сюда можно прокинуть выбранную фигуру */
          }}
        >
          <Icon className="h-full w-full" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

const STICKERS = [
  { src: Sticker1, names: ["Red Arrow", "Красная стрелка"] },
  { src: Sticker2, names: ["Blue Arrow", "Голубая стрелка"] },
];

// Sticker (Наклейки)
export function StickerToolPanel({ groupId, imageId }) {
  const [query, setQuery] = useState("");
  const { layers, init, addLayer, removeLayer, updateLayer } = useLayers(
    groupId,
    imageId,
  );

  // При первой загрузке задаём фоновый слой, если нужно
  useEffect(() => {
    if (layers.length === 0) {
      init([
        {
          id: "bg",
          type: "image",
          props: {
            src: layers[0]?.props?.src || "",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          },
          visible: true,
          lock: true,
        },
      ]);
    }
  }, [layers, init]);

  const filtered = STICKERS.filter(({ names }) =>
    names.some((n) => n.toLowerCase().includes(query.toLowerCase())),
  );

  const onPick = (src) => {
    const layer = {
      id: uniqueId(),
      type: "image",
      props: { src, x: 100, y: 100, width: 150, height: 150 },
      visible: true,
      lock: false,
    };
    addLayer(layer);
  };

  return (
    <div className="flex h-full flex-col space-y-3">
      <div className="flex h-9 items-center rounded-xl bg-dark-graphite px-4">
        <input
          type="text"
          placeholder="Найти наклейку"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-[21px] flex-grow bg-transparent text-supporting outline-none placeholder:text-supporting"
        />
        <button className="ml-2">
          <IconSearch className="size-5 cursor-pointer" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {filtered.map(({ src, names }) => (
            <button
              key={src}
              onClick={() => onPick(src)}
              className="flex items-center justify-center rounded-xl bg-dark-graphite p-2 transition hover:bg-dark-supporting"
            >
              <img
                src={src}
                alt={names.join(", ")}
                className="h-12 w-12 object-contain"
              />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-4 text-center text-supporting">
              Наклейки не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const EraserToolPanel = () => {
  const [size, setSize] = useState(10);
  const [prompt, setPrompt] = useState("");
  const [removeBg, setRemoveBg] = useState(false);

  return (
    <div className="space-y-4 p-4">
      {/* Brush size control */}
      <div>
        <label className="mb-1 block text-sm font-medium text-white">
          Размер ластика
        </label>
        <div className="flex items-center gap-2">
          {/* small preview circle */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="10"
              cy="10"
              r="9.5"
              stroke="white"
              strokeOpacity="0.7"
            />
          </svg>

          <input
            type="range"
            min="1"
            max="50"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="h-1 flex-grow appearance-none rounded bg-supporting accent-main-accent"
          />
          {/* large preview circle */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="24"
              cy="24"
              r="23.5"
              stroke="white"
              strokeOpacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Optional prompt */}
      <div className="flex h-20 items-start rounded-xl bg-dark-graphite px-3 py-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Добавь промт для замены изображения (необязательно)"
          className="flex w-full items-start bg-transparent text-white outline-none placeholder:text-supporting"
        />
      </div>

      {/* Action button */}
      <button
        onClick={() => {
          /* apply eraser logic */
        }}
        className={`flex w-full items-center justify-center gap-2 rounded-lg bg-main-accent px-4 py-2 font-medium text-dark-coal transition hover:bg-opacity-90`}
      >
        Применить ластик <IconGem /> 30
      </button>

      {/* Remove background toggle as a slider */}
      <label className="flex h-9 items-center gap-3">
        <span className="select-none text-sm text-white">Удалить фон</span>
        <div className="relative">
          <input
            type="checkbox"
            checked={removeBg}
            onChange={() => setRemoveBg((v) => !v)}
            className="peer absolute h-6 w-11 cursor-pointer opacity-0"
          />
          <div className="h-9 w-16 rounded-full bg-dark-graphite transition-colors peer-checked:bg-dark-graphite" />
          <div className="bg-interactive-active pointer-events-none absolute left-0.5 top-0.5 h-8 w-8 transform rounded-full transition-transform peer-checked:translate-x-7" />
        </div>
      </label>

      {/* Background removal button */}

      <button
        onClick={() => {
          /* remove background logic */
        }}
        disabled={!removeBg}
        className={`flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 ${removeBg ? "" : "disabled cursor-not-allowed grayscale"}`}
      >
        Удалить <IconGem /> 30
      </button>
    </div>
  );
};

// Image overlay (Добавить изображение)
export const ImageOverlayToolPanel = ({
  references = [],
  onReferenceChange,
  onApply,
}) => {
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewSrc(url);
      onReferenceChange && onReferenceChange(file);
    }
  };

  const handleRefClick = (src) => {
    setPreviewSrc(src);
    onReferenceChange && onReferenceChange(src);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Загрузка собственного файла */}
      <label className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-supporting bg-dark-graphite p-4 text-center">
        <input
          type="file"
          accept="image/*"
          className="mb-1 hidden w-full"
          onChange={handleFileChange}
        />
        <p className="text-sm text-supporting">
          <span className="flex items-center justify-center">
            <FaPlus size={28} />
          </span>
          <span className="text-main-accent underline">Выберите файл</span>
          <br /> или <br /> перетащите с устройства
        </p>
      </label>
      <h3 className="mt-4 text-sm text-white">Избранное</h3>
      {/* Список референсов */}
      <div className="grid grid-cols-2 gap-2 overflow-y-auto">
        {references
          .flatMap((group) => group.items || [])
          .map((item, index) => {
            // Извлекаем строку URL из item.src
            let url = "";
            if (typeof item.src === "string") {
              url = item.src;
            } else if (item.src?.default) {
              url = item.src.default;
            } else if (item.src?.src) {
              url = item.src.src;
            } else {
              console.warn("Не могу распаковать src из", item.src);
            }

            return (
              <div
                key={index}
                className="cursor-pointer overflow-hidden rounded-lg border border-transparent transition hover:border-main-accent hover:ring-2"
                onClick={() => {
                  setPreviewSrc(url);
                  onReferenceChange?.(url);
                  setIsRefMenuOpen(false);
                }}
              >
                <img
                  src={url}
                  className="h-full w-full object-cover"
                  alt={`Ref ${index + 1}`}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

// Background (Фон)
export const BackgroundToolPanel = () => (
  <div>
    <label className="mb-1 block">Цвет фона</label>
    <input type="color" className="mb-4 h-10 w-full border-0 p-0" />
    <label className="mb-1 block">Изображение фона</label>
    <input type="file" className="w-full" />
  </div>
);
