import { createContext, useContext, useState } from "react";
import { FaImage, FaSyncAlt, FaTrash } from "react-icons/fa";

import TextBold from "../../shared/assets/icons/text-bold.svg?react";
import PhotoCog from "../../shared/assets/icons/photo-cog.svg?react";
import EmojiHappy from "../../shared/assets/icons/emoji-happy.svg?react";
import Image from "../../shared/assets/icons/image.svg?react";
import Square from "../../shared/assets/icons/square.svg?react";
import Eraser from "../../shared/assets/icons/eraser.svg?react";
import Sticker from "../../shared/assets/icons/sticker.svg?react";

// Список всех возможных инструментов (кроме crop)
export const TOOL_KEYS = [
  {
    key: "text",
    icon: (
      <span className="text-lg font-bold">
        <TextBold />
      </span>
    ),
    label: "Текст",
    useStroke: false,
  },
  { key: "effects", icon: <PhotoCog />, label: "Эффекты", useStroke: false },
  {
    key: "emoji",
    icon: (
      <span className="text-2xl">
        <EmojiHappy />
      </span>
    ),
    label: "Эмоджи",
    useStroke: false,
  },
  { key: "image", icon: <Image />, label: "Картинка", useStroke: false },
  {
    key: "shapes",
    icon: (
      <span className="text-xl">
        <Square />
      </span>
    ),
    label: "Фигуры",
    useStroke: false,
  },
  { key: "eraser", icon: <Eraser />, label: "Ластик", useStroke: false },
  {
    key: "sticker",
    icon: (
      <span className="text-2xl">
        <Sticker />
      </span>
    ),
    label: "Наклейка",
    useStroke: false,
  },
];

const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
  // активный инструмент (text/effects/…)
  const [activeTool, setActiveTool] = useState(null);
  // активный crop (например, "16:9", "9:16" или "free")
  const [activeCrop, setActiveCrop] = useState("16:9");

  const [onUndo, setOnUndo] = useState(null);
  const [onRedo, setOnRedo] = useState(null);

  // Слои: массив объектов { id, name }
  const [layers, setLayers] = useState([
    { id: 1, name: "Фон" },
    { id: 2, name: "Текст" },
  ]);

  const [activeLayer, setActiveLayer] = useState(null);

  const onToolChange = (key) => {
    setActiveTool(key);
  };

  const onCropChange = (key) => {
    setActiveCrop(key);
  };

  const addLayer = () => {
    const nextId = layers.length ? Math.max(...layers.map((l) => l.id)) + 1 : 1;
    setLayers([...layers, { id: nextId, name: `Слой ${nextId}` }]);
  };

  const removeLayer = (id) => {
    setLayers(layers.filter((l) => l.id !== id));
  };

  return (
    <EditorContext.Provider
      value={{
        activeTool,
        activeCrop,
        onToolChange,
        onCropChange,
        activeLayer,
        layers,
        addLayer,
        removeLayer,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// Хук для потребления контекста
export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be inside EditorProvider");
  return ctx;
};
