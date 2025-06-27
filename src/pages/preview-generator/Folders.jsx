import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import MaClose from "../../shared/assets/icons/material-symbols-close.svg?react";

// Табы папок с возможностью добавления
export function FolderTabs({ tabs, activeKey, onChange, onAdd }) {
  return (
    <div className="flex h-full max-h-8 space-x-3 text-sm">
      {tabs
        .filter((tab) => !tab.hidden) // показываем только табы без флага hidden
        .map((tab) => (
          <button
            key={tab.key}
            className={`rounded-md border border-transparent px-4 transition-colors focus:outline-none ${
              tab.key === activeKey
                ? "border-white bg-dark-graphite text-white"
                : "bg-dark-coal text-supporting"
            } `}
            onClick={() => {
              onChange(tab.key);
            }}
          >
            {tab.label}
          </button>
        ))}
      <button
        className="group flex items-center gap-2 rounded-md px-3 py-2 transition-colors duration-300 active:bg-interactive-hover"
        onClick={onAdd}
      >
        <FaPlus />
        <span className="group-hover:text-main-accent">Создать папку</span>
      </button>
    </div>
  );
}

export function FolderModal({
  mode,
  data,
  onClose,
  onCreate,
  onRename,
  onDelete,
}) {
  const [value, setValue] = useState("");
  const [confirmFullDelete, setConfirmFullDelete] = useState(false);

  useEffect(() => {
    if (mode === "edit") {
      setValue(data.key);
    }
    if (mode === "delete") {
      setConfirmFullDelete(false);
    }
  }, [mode, data]);

  const submit = () => {
    if (mode === "create") onCreate(value);
    if (mode === "edit") onRename(data.key, value);
    if (mode === "delete") onDelete(data.key);
    onClose();
  };

  return (
    <div className="modal absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-[20px] bg-dark-coal p-4 [box-shadow:0px_0px_28px_0px_rgba(32,32,32,1)]">
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl">
            {mode === "create" && "Новая папка"}
            {mode === "edit" && "Переименовать папку"}
            {mode === "delete" && "Удалить папку?"}
          </h3>
          {mode === "create" && (
            <span className="text-sm text-supporting">
              Удобно хранить генерации к разным каналам или темам.
            </span>
          )}
          {mode === "edit" && (
            <span className="text-sm text-supporting">
              Папка {data.key} будет переименована в {value}
            </span>
          )}
          {mode === "delete" && (
            <span className="text-sm text-supporting">
              После удаления папки все обложки будут
              <br /> отображаться в общем списке “Все генерации”.
            </span>
          )}
        </div>
        <button onClick={onClose}>
          <MaClose />
        </button>
      </div>
      {(mode === "create" || mode === "edit") && (
        <div className="h-10">
          <input
            className="border-interactive-active w-full rounded-xl border bg-dark-graphite px-3 py-1 text-white outline-none placeholder:text-supporting"
            value={value}
            placeholder="Напишите название папки"
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
        </div>
      )}
      {mode === "delete" && (
        <div>
          <label
            className="flex cursor-pointer items-center gap-2 text-sm text-supporting"
            onClick={() => setConfirmFullDelete(!confirmFullDelete)}
          >
            <span
              className={`flex size-5 items-center justify-center rounded border ${
                confirmFullDelete
                  ? "border-opacity-0 bg-opacity-40"
                  : "border-opacity-40 bg-opacity-0"
              } border border-supporting bg-supporting transition-colors`}
            >
              {confirmFullDelete && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.811 7.24845C3.587 7.24845 3.363 7.16345 3.192 6.99245L0.819 4.61945C0.477 4.27745 0.477 3.72345 0.819 3.38245C1.161 3.04045 1.714 3.03945 2.056 3.38145L3.811 5.13645L7.939 1.00845C8.281 0.666453 8.834 0.666453 9.176 1.00845C9.518 1.35045 9.518 1.90445 9.176 2.24645L4.43 6.99245C4.259 7.16345 4.035 7.24845 3.811 7.24845"
                    fill="#878787"
                  />
                </svg>
              )}
            </span>
            <span>Удалить папку и все генерации.</span>
          </label>
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <button
          className="active:bg-interactive-active rounded-lg border border-transparent bg-dark-graphite px-4 py-2 text-main-accent transition-colors duration-150 hover:border-main-accent hover:bg-interactive-hover active:border-transparent"
          onClick={onClose}
        >
          Отмена
        </button>
        <button
          className={`rounded-lg bg-main-accent px-4 py-2 text-main-dark transition-colors duration-150 hover:border-main-accent hover:bg-opacity-90 active:border-transparent active:brightness-110 ${mode === "delete" && "bg-red-600"}`}
          onClick={submit}
        >
          {mode === "delete" && "Удалить"}
          {mode === "create" && "Создать"}
          {mode === "edit" && "Сохранить"}
        </button>
      </div>
    </div>
  );
}
