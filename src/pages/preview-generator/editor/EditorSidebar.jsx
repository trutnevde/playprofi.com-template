import React, { useState, useEffect, useRef } from "react";
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
import { FaPlus, FaRedo, FaTrash, FaUndo } from "react-icons/fa";
import { TOOL_KEYS, useEditor } from "../EditorContext";
import { orientationOptions } from "../PreviewGeneratorPage";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import IconUndo from "../../../shared/assets/icons/undo.svg?react";
import IconRedo from "../../../shared/assets/icons/redo.svg?react";
import IconLayers from "../../../shared/assets/icons/layers.svg?react";
import IconShevronUp from "../../../shared/assets/icons/arrow-up-fill.svg?react";
import IconShevronDown from "../../../shared/assets/icons/arrow-down-fill.svg?react";

export function ColorPicker({ value, onChange, className }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`relative mb-4 flex h-9 w-full items-center gap-2 rounded-xl bg-dark-supporting px-2 ${className}`}
    >
      {/* Скрытый нативный input */}
      <input
        ref={inputRef}
        type="color"
        className="invisible hidden w-0"
        value={value}
        onChange={handleInputChange}
      />
      {/* Квадратик с цветом */}
      <button
        type="button"
        onClick={handleClick}
        className="h-6 w-6 flex-shrink-0 rounded border border-white/20"
        style={{ backgroundColor: value }}
        title="Выбрать цвет"
      />
      {/* Отображение и редактирование hex-кода */}
      <input
        type="text"
        className="w-min max-w-24 flex-grow bg-transparent font-mono text-sm text-white outline-none placeholder:text-supporting"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          // простая валидация hex: должен начинаться с #
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
            onChange(v);
          }
        }}
        placeholder="#RRGGBB"
      />
    </div>
  );
}

export function NumberSpinner({ value, onChange, min, max, placeholder }) {
  const handleStep = (delta) => {
    const next = (value || 0) + delta;
    if (
      (min !== undefined && next < min) ||
      (max !== undefined && next > max)
    ) {
      return;
    }
    onChange(next);
  };

  return (
    <div className="inline-flex h-9 items-center rounded-xl bg-dark-graphite">
      <input
        type="number"
        className="w-16 bg-transparent px-2 py-1 text-white outline-none placeholder:text-supporting"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v)) onChange(v);
        }}
        min={min}
        max={max}
      />
      <div className="flex max-h-full w-5 flex-col overflow-hidden rounded-r-xl border-l border-dark-graphite bg-dark-supporting">
        <button
          type="button"
          onClick={() => handleStep(1)}
          className="h-1/2 hover:text-main-accent"
        >
          <IconShevronUp />
        </button>
        <button
          type="button"
          onClick={() => handleStep(-1)}
          className="h-1/2 hover:text-main-accent"
        >
          <IconShevronDown />
        </button>
      </div>
    </div>
  );
}

export function AccordionSelect({ label = "", options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const opts = Array.isArray(options) ? options : [];

  // Закрытие при клике вне
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedOption = opts.find((opt) => opt.value === value);

  return (
    <div
      ref={ref}
      className={`relative rounded-xl border bg-dark-graphite ${
        open ? "border-interactive-active" : "border-transparent"
      }`}
    >
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between gap-4 px-3 text-sm font-medium"
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          {label && `${label}:`} {selectedOption?.label || "—"}
        </span>
        <FaChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute mt-2 space-y-1 overflow-hidden rounded-lg bg-dark-coal shadow-lg-hover-card">
          {opts.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="flex w-full px-3 py-2 text-left text-sm hover:bg-dark-supporting hover:text-main-accent"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const EditorSidebar = ({ image, references }) => {
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
  const [layersOpen, setLayersOpen] = useState(false);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const formatMenuRef = useRef(null);

  useEffect(() => {
    if (image && typeof image !== "string") {
      const url = URL.createObjectURL(image);
      setPreviewSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewSrc(image);
    }
  }, [image]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formatMenuRef.current && !formatMenuRef.current.contains(e.target)) {
        setIsFormatMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toolPanelsMap = {
    text: <TextToolPanel />,
    effects: <EffectsToolPanel />,
    emoji: <EmojiToolPanel />,
    shapes: <ShapesToolPanel />,
    sticker: <StickerToolPanel />,
    eraser: <EraserToolPanel />,
    image: <ImageOverlayToolPanel references={references} />,
    background: <BackgroundToolPanel />,
  };

  return (
    <>
      <div className="mx-2 my-2 flex flex-col space-y-[10px]">
        <div className="flex flex-col">
          <div className="flex h-9 justify-between gap-[10px]">
            <div
              className="relative flex items-center gap-2 rounded-xl bg-white bg-opacity-[2%] px-3 text-sm text-white"
              ref={formatMenuRef}
            >
              <button
                className="flex items-center gap-1"
                onClick={() => setIsFormatMenuOpen((v) => !v)}
              >
                Кадрирование ({orientationOptions[activeCrop].label})
                <FaChevronDown />
              </button>
              {isFormatMenuOpen && (
                <div className="absolute left-0 top-full z-10 mt-2 flex w-max flex-col overflow-hidden rounded-2xl bg-dark-graphite shadow-lg-hover-card">
                  {Object.entries(orientationOptions).map(
                    ([key, { label }]) => (
                      <button
                        key={key}
                        className="px-4 py-2 text-left text-sm text-white hover:bg-dark-supporting hover:text-main-accent"
                        onClick={() => {
                          onCropChange(key);
                          setIsFormatMenuOpen(false);
                        }}
                      >
                        Кадрирование ({label})
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={onUndo}>
                <IconUndo />
              </button>
              <button onClick={onRedo}>
                <IconRedo />
              </button>
            </div>
          </div>
        </div>
        {/* Tools */}
        <div className="grid grid-cols-4 gap-[10px]">
          {TOOL_KEYS.map((tool) => {
            const isActive = activeTool === tool.key;
            return (
              <button
                key={tool.key}
                onClick={() => onToolChange(tool.key)}
                className={`group/tool flex flex-col items-center justify-center rounded-2xl border p-3 transition-colors ${
                  isActive
                    ? "border-main-accent bg-dark-coal text-main-accent"
                    : "border-transparent bg-dark-graphite"
                }`}
              >
                {tool.icon}
                <span
                  className={`mt-1 text-xs ${
                    isActive ? "text-main-accent" : "text-white"
                  }`}
                >
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Layers Accordion */}
        <div
          className={`rounded-xl border bg-dark-graphite ${layersOpen ? "border-interactive-active" : "border-transparent"}`}
        >
          <button
            className="flex h-9 w-full items-center justify-between px-3 text-sm font-medium"
            onClick={() => setLayersOpen((o) => !o)}
          >
            <div className="flex gap-[10px]">
              <IconLayers />
              <span>Слои</span>
            </div>
            <FaChevronDown
              className={`transition-transform ${layersOpen ? "rotate-180" : ""}`}
            />
          </button>
          {layersOpen && (
            <div className="mt-2 space-y-2 rounded-lg p-3">
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
            </div>
          )}
        </div>
      </div>

      {/* Панель активного инструмента */}
      <div className="flex-grow overflow-auto rounded bg-dark-coal p-3">
        {toolPanelsMap[activeTool] || null}
      </div>

      <div className="mt-5 flex h-10 justify-between gap-3">
        <button className="rounded-xl border border-main-accent px-4 text-sm text-main-accent">
          Сделать шаблоном
        </button>
        <button className="flex-grow rounded-xl border border-transparent bg-main-accent px-4 text-sm text-dark-coal">
          Скачать
        </button>
      </div>
    </>
  );
};
