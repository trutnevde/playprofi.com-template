import { useState, useEffect } from "react";
import {
  TextToolPanel,
  EffectsToolPanel,
  EmojiToolPanel,
  ShapesToolPanel,
  StickerToolPanel,
  EraserToolPanel,
  ImageOverlayToolPanel,
  BackgroundToolPanel,
} from "./EditorPanels";
import { FaCaretDown, FaPlus, FaRedo, FaTrash, FaUndo } from "react-icons/fa";
import { CROP_ASPECTS, TOOL_KEYS, useEditor } from "../EditorContext";

export const EditorSidebar = ({ image }) => {
  const {
    activeTool,
    activeCrop,
    onToolChange,
    onCropChange,
    activeLayer,
    layers,
    addLayer,
    removeLayer,
    onUndo,
    onRedo,
  } = useEditor();

  const [previewSrc, setPreviewSrc] = useState(null);
  const [layersOpen, setLayersOpen] = useState(true);

  useEffect(() => {
    if (image && typeof image !== "string") {
      const url = URL.createObjectURL(image);
      setPreviewSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewSrc(image);
    }
  }, [image]);

  const toolPanelsMap = {
    text: <TextToolPanel />,
    effects: <EffectsToolPanel />,
    emoji: <EmojiToolPanel />,
    shapes: <ShapesToolPanel />,
    sticker: <StickerToolPanel />,
    eraser: <EraserToolPanel />,
    image: <ImageOverlayToolPanel />,
    background: <BackgroundToolPanel />,
  };

  return (
    <>
      <div className="mx-2 my-2 flex flex-col">
        <div className="flex h-9 justify-between gap-[10px]">
          <div className="flex h-full flex-grow items-center gap-[10px] rounded-xl bg-white bg-opacity-[2%] px-3">
            <span>Crop</span>
            <div className="flex gap-4 stroke-white text-white">
              {CROP_ASPECTS.map((fmt) => (
                <button
                  key={fmt.aspect}
                  className={`flex items-center gap-1 ${
                    activeCrop === fmt.aspect
                      ? "stroke-main-accent text-main-accent"
                      : ""
                  }`}
                  onClick={() => onCropChange(fmt.aspect)}
                >
                  {fmt.icon}
                  <span>
                    {fmt.aspect === "free" ? "Произвольный" : fmt.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onUndo}>
              <FaUndo />
            </button>
            <button onClick={onRedo}>
              <FaRedo />
            </button>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="mb-4 grid grid-cols-4 gap-[10px] p-2">
        {TOOL_KEYS.map((tool) => (
          <button
            key={tool.key}
            onClick={() => onToolChange(tool.key)}
            className={`flex flex-col items-center justify-center rounded-2xl bg-white bg-opacity-[2%] p-3 ${
              activeTool === tool.key
                ? "border-2 border-main-accent"
                : "bg-dark-coal"
            } `}
          >
            {tool.icon}
            <span className="mt-1 text-xs">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Layers Accordion */}
      <div className="mx-2 mt-4">
        <button
          className="flex w-full items-center justify-between rounded-lg bg-dark-coal px-3 py-2 text-sm font-medium"
          onClick={() => setLayersOpen((o) => !o)}
        >
          <span>Слои</span>
          <FaCaretDown
            className={`transition-transform ${layersOpen ? "rotate-180" : ""}`}
          />
        </button>
        {layersOpen && (
          <div className="mt-2 space-y-2 rounded-lg bg-dark-coal p-3">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center justify-between rounded bg-dark-graphite p-2"
              >
                <span>{layer.name}</span>
                <button onClick={() => removeLayer(layer.id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              onClick={addLayer}
              className="flex w-full items-center justify-center gap-2 rounded bg-dark-coal p-2 text-sm"
            >
              <FaPlus /> Добавить слой
            </button>
          </div>
        )}
      </div>

      {/* Панель активного инструмента */}
      <div className="flex-grow overflow-auto rounded bg-dark-coal p-3">
        {toolPanelsMap[activeTool] || null}
      </div>
    </>
  );
};
