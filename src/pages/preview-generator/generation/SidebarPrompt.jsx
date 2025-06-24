import { useState, useRef, useEffect } from "react";
import { FaImage, FaPlus, FaCaretDown, FaVideo } from "react-icons/fa";
import SvgHeart from "../../../shared/components/icons/Heart";

export const SidebarPrompt = ({
  prompt,
  onPromptChange,
  selectedReference,
  onReferenceChange,
  selectedFormat,
  onFormatChange,
  onCreate,
}) => {
  const [isRefMenuOpen, setIsRefMenuOpen] = useState(false);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const refMenuRef = useRef(null);
  const formatMenuRef = useRef(null);

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
      <div className="group flex flex-grow flex-col rounded-xl border-[0.5px] border-white border-opacity-0 bg-dark-graphite transition-colors duration-300 hover:border-opacity-30 has-[:focus]:border-opacity-30">
        {/* Добавление референса + выбор формата */}
        <div className="box-content flex h-8 items-center justify-between gap-2 border-b-[0.5px] border-white border-opacity-30 px-3 py-1 text-sm text-gray">
          {/* Меню "Добавить референс" */}
          <div className="relative" ref={refMenuRef}>
            <button
              className={`h-full cursor-pointer px-2 transition-colors duration-300 ${isRefMenuOpen ? "text-main-accent" : ""}`}
              onClick={() => setIsRefMenuOpen((prev) => !prev)}
            >
              <label
                className={`flex cursor-pointer items-center justify-center gap-2 ${
                  isRefMenuOpen ? "text-main-accent" : ""
                }`}
              >
                <FaImage />
                <span className="transition-colors duration-300 hover:text-main-accent">
                  Добавить референс
                </span>
              </label>
            </button>
            {isRefMenuOpen && (
              <div className="absolute right-0 top-full flex w-max gap-1 rounded-2xl bg-interactive-hover p-3 shadow-lg-hover-card">
                <label className="flex min-w-max cursor-pointer flex-col items-center justify-center rounded-xl bg-dark-coal p-3 text-center text-gray">
                  <FaPlus size={28} className="fill-white opacity-30" />
                  <input type="file" className="hidden" />
                  <p className="leading-normal text-main-accent underline">
                    Выберите файл
                  </p>
                  <p>
                    или
                    <br />
                    перетащите с устройства
                  </p>
                </label>
                <div className="grid max-h-[230px] flex-shrink-0 flex-grow grid-cols-2 gap-1 overflow-y-scroll pr-1">
                  <div className="flex max-w-[128px] flex-col gap-1">
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex max-w-[128px] flex-col gap-1">
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex max-w-[128px] flex-col gap-1">
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex max-w-[128px] flex-col gap-1">
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full overflow-hidden rounded-lg">
                      <img
                        src="https://placehold.co/130x75"
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={formatMenuRef}>
            <button
              className={`flex items-center gap-2 transition-colors duration-300 ${isFormatMenuOpen ? "text-white" : ""}`}
              onClick={() => setIsFormatMenuOpen((prev) => !prev)}
            >
              <span>Формат {selectedFormat}</span>
              <FaCaretDown />
            </button>
            {isFormatMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 flex w-max flex-col overflow-hidden rounded-2xl bg-dark-graphite shadow-lg-hover-card">
                <button
                  className="flex items-center justify-between gap-4 stroke-white px-4 py-3 hover:bg-dark-supporting hover:stroke-main-accent"
                  onClick={() => {
                    onFormatChange("16:9");
                    setIsFormatMenuOpen(false);
                  }}
                >
                  <div className="flex flex-grow flex-col text-left text-sm leading-tight text-white">
                    <span className="block">YouTube. Обложка видео</span>
                    <span className="block">1280×720 (16:9)</span>
                  </div>
                  <svg
                    width="65"
                    height="36"
                    viewBox="0 0 65 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1.25"
                      y="0.5"
                      width="63"
                      height="35"
                      rx="7.5"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </button>
                <button
                  className="preview-format-button flex items-center justify-between gap-4 stroke-white px-4 py-3 hover:bg-dark-supporting hover:stroke-main-accent"
                  onClick={() => {
                    onFormatChange("9:16");
                    setIsFormatMenuOpen(false);
                  }}
                >
                  <div className="flex flex-grow flex-col text-left text-sm leading-tight text-white">
                    <span className="block">YouTube. Обложка видео</span>
                    <span className="block">720×1280 (9:16)</span>
                  </div>
                  <div className="flex justify-end opacity-70">
                    <svg
                      width="25"
                      height="42"
                      viewBox="0 0 25 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.75"
                        y="1"
                        width="23"
                        height="40"
                        rx="8"
                        strokeDasharray="2 2"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Сам запрос */}
        <textarea
          className="flex-grow resize-none bg-transparent p-3 text-sm text-white outline-none placeholder:text-gray"
          placeholder="Напиши запрос"
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
          <SvgHeart />
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
