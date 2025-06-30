import { useState, useRef, useEffect } from "react";
import { FaImage, FaPlus, FaVideo } from "react-icons/fa";
import SvgHeart from "../../../shared/components/icons/Heart";
import { ASPECT_OPTIONS } from "../EditorContext";
import IconGem from "../../../shared/assets/icons/gem.svg?react";

import { Trash } from "iconsax-react";
import { FaChevronDown } from "react-icons/fa6";

function resolveSrc(src) {
  if (typeof src === "string") {
    return src;
  }
  if (src?.default) {
    return src.default;
  }
  if (src?.src) {
    return src.src;
  }
  return "";
}

export const SidebarPrompt = ({
  prompt,
  onPromptChange,
  selectedReference,
  onReferenceChange,
  selectedFormat,
  onFormatChange,
  onCreate,
  references,
}) => {
  const [isRefMenuOpen, setIsRefMenuOpen] = useState(false);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const refMenuRef = useRef(null);
  const formatMenuRef = useRef(null);

  const [previewSrc, setPreviewSrc] = useState(null);

  // Закрыть меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (refMenuRef.current && !refMenuRef.current.contains(e.target)) {
        setIsRefMenuOpen(false);
      }
      if (formatMenuRef.current && !formatMenuRef.current.contains(e.target)) {
        setIsFormatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="group flex h-full flex-grow flex-col rounded-xl border-[0.5px] border-white border-opacity-0 bg-dark-graphite transition-colors duration-300 hover:border-opacity-30 has-[:focus]:border-opacity-30">
        {/* Добавление референса + выбор формата */}
        <div className="box-content flex h-8 items-center justify-between gap-2 border-b-[0.5px] border-white border-opacity-30 px-3 py-1 text-sm text-gray">
          {/* Меню "Добавить референс" */}
          <div className="relative max-h-full" ref={refMenuRef}>
            <button
              className={`h-full max-h-full cursor-pointer px-2 transition-colors duration-300 ${isRefMenuOpen ? "text-main-accent" : ""}`}
              onClick={() => setIsRefMenuOpen((prev) => !prev)}
            >
              <label
                className={`flex max-h-full cursor-pointer items-center justify-center gap-2 overflow-hidden ${
                  isRefMenuOpen ? "text-main-accent" : ""
                }`}
              >
                {(!previewSrc && (
                  <>
                    <FaImage />
                    <span className="transition-colors duration-300 hover:text-main-accent">
                      Добавить референс
                    </span>
                  </>
                )) || (
                  <>
                    <div className="max-h-8 max-w-8 overflow-hidden rounded-sm border border-white/20">
                      <img
                        className="max-h-full max-w-full object-cover"
                        src={previewSrc}
                        alt=""
                      />
                    </div>
                    <span
                      className="max-w-[140px] truncate text-main-accent transition-colors duration-300"
                      title={
                        typeof previewSrc === "string"
                          ? previewSrc
                          : previewSrc.name
                      }
                    >
                      {typeof previewSrc === "string"
                        ? previewSrc.split("/").pop()
                        : previewSrc.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewSrc(null);
                        onReferenceChange && onReferenceChange(null);
                      }}
                      className=""
                      title="Удалить"
                    >
                      <Trash className="hover:fill-white" />
                    </button>
                  </>
                )}
              </label>
            </button>
            {isRefMenuOpen && (
              <div className="absolute right-0 top-full z-40 flex w-max gap-1 rounded-2xl bg-interactive-hover p-3 shadow-lg-hover-card">
                <label className="flex min-w-max cursor-pointer flex-col items-center justify-center rounded-xl bg-dark-coal p-3 text-center text-gray">
                  <FaPlus size={28} className="fill-white opacity-30" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewSrc(url);
                        onReferenceChange && onReferenceChange(file);
                      }
                    }}
                  />
                  <p className="leading-normal text-main-accent underline">
                    Выберите файл
                  </p>
                  <p>
                    или
                    <br />
                    перетащите с устройства
                  </p>
                </label>
                <div className="z-40 grid max-h-[230px] flex-shrink-0 flex-grow grid-cols-2 gap-1 overflow-y-scroll pr-1">
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
                          className="max-w-[128px] cursor-pointer overflow-hidden rounded-lg transition hover:ring-2 hover:ring-main-accent"
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
            )}
          </div>

          <div className="relative" ref={formatMenuRef}>
            <button
              className={`flex items-center gap-2 transition-colors duration-300 ${isFormatMenuOpen ? "text-white" : ""}`}
              onClick={() => setIsFormatMenuOpen((prev) => !prev)}
            >
              <span>Формат ({ASPECT_OPTIONS[selectedFormat].label})</span>
              <FaChevronDown />
            </button>
            {isFormatMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 flex w-max flex-col overflow-hidden rounded-2xl bg-dark-graphite shadow-lg-hover-card">
                {Object.entries(ASPECT_OPTIONS).map(
                  ([key, { fullLabel, preview }]) => {
                    const [title, subtitle] = fullLabel.split("\n");
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onFormatChange(key);
                          setIsFormatMenuOpen(false);
                        }}
                        className="group/promptFormat flex items-center justify-between gap-4 stroke-white px-4 py-3 text-left hover:bg-dark-supporting"
                      >
                        <div className="flex flex-col text-sm leading-tight text-white">
                          <span className="group-hover/promptFormat:text-main-accent">
                            {title}
                          </span>
                          <span className="group-hover/promptFormat:text-main-accent">
                            {subtitle}
                          </span>
                        </div>
                        <div className="flex-shrink-0 stroke-white opacity-70 group-hover/promptFormat:stroke-main-accent">
                          {preview}
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>

        {/* Сам запрос */}
        <textarea
          className="flex-grow resize-none bg-transparent p-3 text-sm text-white outline-none placeholder:text-gray"
          placeholder="Напиши запрос и AI сгенерирует 3 варианта обложки"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>

      {/* Кнопка создания */}
      <button
        className="mb-4 mt-3 flex w-full items-center justify-center rounded-xl bg-main-accent px-6 py-[10px] text-dark-coal"
        onClick={() => onCreate("ai")}
      >
        <span>Создать обложку</span>
        <span className="ml-1 flex items-center gap-1">
          <IconGem />
          30
        </span>
      </button>

      {/* Разделитель */}
      <div className="flex items-center text-supporting">
        <div className="h-px flex-grow bg-supporting"></div>
        <span className="px-4">Или</span>
        <div className="h-px flex-grow bg-supporting"></div>
      </div>

      {/* Создать из видео/фото */}
      <div className="rounded-x mt-4 grid h-full max-h-[140px] grid-cols-2 justify-between gap-3">
        <button
          onClick={() => {
            console.log("Создать из видео");
          }}
          className="flex flex-col items-center justify-center rounded-lg bg-dark-graphite p-4 hover:bg-dark-graphite"
        >
          <FaVideo size={32} />
          <span className="mt-2">Создать из видео</span>
        </button>
        <button
          onClick={() => {
            console.log("Создать по фото");
          }}
          className="flex flex-col items-center justify-center rounded-lg bg-dark-graphite p-4 hover:bg-dark-graphite"
        >
          <FaImage size={32} />
          <span className="mt-2">Создать по фото и объекту</span>
        </button>
      </div>
    </>
  );
};
