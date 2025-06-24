import { createContext, useContext, useState } from "react";
import { FaImage, FaSyncAlt, FaTrash } from "react-icons/fa";

// Список всех возможных инструментов (кроме crop)
export const TOOL_KEYS = [
  {
    key: "text",
    icon: <span className="text-lg font-bold">T</span>,
    label: "Текст",
  },
  { key: "effects", icon: <FaSyncAlt />, label: "Эффекты" },
  {
    key: "emoji",
    icon: <span className="text-2xl">😊</span>,
    label: "Эмоджи",
  },
  { key: "image", icon: <FaImage />, label: "Картинка" },
  {
    key: "shapes",
    icon: <span className="text-xl">◻︎</span>,
    label: "Фигуры",
  },
  { key: "eraser", icon: <FaTrash />, label: "Ластик" },
  {
    key: "sticker",
    icon: <span className="text-2xl">📌</span>,
    label: "Наклейка",
  },
  {
    key: "background",
    icon: <span className="text-2xl">🖌</span>,
    label: "Фон",
  },
];

// Опции crop-аспектов
export const CROP_ASPECTS = [
  {
    aspect: "16:9",
    title: "(16:9)",
    icon: (
      <svg
        width="21"
        height="12"
        viewBox="0 0 21 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="20"
          height="11"
          rx="1.5"
          strokeDasharray="4 4"
        />
      </svg>
    ),
  },
  {
    aspect: "9:16",
    title: "(9:16)",
    icon: (
      <svg
        width="9"
        height="16"
        viewBox="0 0 9 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1.33398"
          width="7.5"
          height="13.3333"
          rx="2"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  { aspect: "free", title: "Произвольный", icon: "" },
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
