import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftPanel from "./generation/LeftPanel";
import EditorCanvas from "./Editor/EditorCanvas";
import { EditorSidebar } from "./editor/EditorSidebar";
import { SidebarPrompt } from "./generation/SidebarPrompt";
import { EditorProvider } from "./EditorContext";
import { FaPlus } from "react-icons/fa6";
import { FolderModal } from "./Folders";

// Опции форматов
export const orientationOptions = {
  "16:9": {
    label: "16:9",
    fullLabel: "YouTube. Обложка видео\n1280×720 (16:9)",
    className: "aspect-[16/9]",
    preview: <svg width="65" height="36" /* ... */ />,
  },
  "9:16": {
    label: "9:16",
    fullLabel: "YouTube Shorts. Обложка видео\n720×1280 (9:16)",
    className: "aspect-[9/16]",
    preview: <svg width="25" height="42" /* ... */ />,
  },
  square: {
    label: "Квадрат",
    fullLabel: "Квадратный формат\n720×720 (1:1)",
    className: "aspect-1",
    preview: <svg width="36" height="36" /* ... */ />,
  },
};

const PreviewGeneratorPage = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.preview-generator",
  });

  // === State для всех четырёх источников данных ===
  const [generatedGroups, setGeneratedGroups] = useState([]);
  const [templateGroups, setTemplateGroups] = useState([]);
  const [exampleGroups, setExampleGroups] = useState([]);
  const [myTemplateGroups, setMyTemplateGroups] = useState([]);

  // === State для папок (tabs) ===
  const [folders, setFolders] = useState([
    { key: "default", label: "По умолчанию", locked: true, hidden: true },
    { key: "ai", label: "Созданы AI", locked: true, hidden: false },
    { key: "templates", label: "Шаблоны", locked: true, hidden: false },
    { key: "myTemplates", label: "Мои шаблоны", locked: true, hidden: true },
  ]);

  const [activeFolder, setActiveFolder] = useState("default");

  // === Остальные стейты ===
  const [modalMode, setModalMode] = useState(null);
  const [modalData, setModalData] = useState({});
  const [prompt, setPrompt] = useState("");
  const [selectedReference, setSelectedReference] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("16:9");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  const refPromptPanel = useRef();
  const refLeftPanel = useRef();

  // === Загрузка данных при старте ===
  useEffect(() => {
    const safeFetch = async (url, setter) => {
      try {
        const resp = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!resp.ok) {
          console.warn(`Fetch ${url} failed:`, resp.status);
          setter([]);
          return;
        }
        // проверим content-type
        const ct = resp.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          console.warn(`Fetch ${url} did not return JSON, got ${ct}`);
          setter([]);
          return;
        }
        const data = await resp.json();
        setter(data);
      } catch (err) {
        console.error(`Fetch ${url} error:`, err);
        setter([]);
      }
    };

    safeFetch("/prevgen-api/generated", setGeneratedGroups);
    safeFetch("/prevgen-api/templates", setTemplateGroups);
    safeFetch("/prevgen-api/examples", setExampleGroups);
    safeFetch("/prevgen-api/favorites", (favs) => {
      const groups = [
        {
          title: "Избранные",
          items: favs.map((src) => ({ src, alt: "", aspect: "16:9" })),
        },
      ];
      setMyTemplateGroups(groups);
    });
  }, []);

  const getGroups = () => {
    switch (activeFolder) {
      case "default":
        return exampleGroups;
      case "templates":
        return templateGroups;
      case "myTemplates":
        return myTemplateGroups;
      case "ai":
        return generatedGroups;
      default:
        return [];
    }
  };

  // === Генерация нового набора ===
  const handleCreate = async (mode = "ai") => {
    const text = prompt.trim();
    if (!text && mode === "ai") return;

    const fmt = selectedFormat;

    // 1) Вставляем «скелетон» — сразу задаём всем трём карточкам поля src, alt, aspect, loading
    const newGroupSkeleton = {
      id: null,
      title:
        mode === "ai"
          ? text
          : mode === "video"
            ? "По видео"
            : "По фото/объекту",
      params: { prompt: text, reference: selectedReference, format: fmt, mode },
      orientation: fmt,
      items: Array(3).fill({
        src: null,
        alt: "",
        aspect: fmt,
        loading: true,
      }),
    };

    // Кладём эту группу наверх AI-списка
    setGeneratedGroups((prev) => [newGroupSkeleton, ...(prev || [])]);
    setActiveFolder("ai");

    // 2) Делаем реальный запрос
    try {
      const resp = await fetch("/prevgen-api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          reference: selectedReference,
          format: fmt,
          mode,
        }),
      });
      if (!resp.ok) throw new Error(await resp.text());

      const { group_id, images } = await resp.json();

      // 3) Сразу перечитываем все AI-группы с бэка, чтобы получить свежие данные
      const updated = await fetch("/prevgen-api/generated").then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      });

      // Приводим каждый массив URL → валидный объект { src, alt, aspect, loading: false }
      const sanitized = updated.map((g) => ({
        id: g.group_id,
        title: g.title,
        params: g.params,
        items: g.images.map((url) => ({
          src: url,
          alt: "",
          aspect: g.format,
          loading: false,
        })),
      }));

      setGeneratedGroups(sanitized);
      setActiveFolder("ai");
    } catch (err) {
      console.error("Generation error:", err);
      // Здесь можно заменить «скелетон» на группу с ошибкой
      setGeneratedGroups((prev) =>
        prev.map((g, i) =>
          i === 0
            ? {
                ...g,
                items: Array(3).fill({
                  src: null,
                  alt: "",
                  aspect: fmt,
                  loading: false,
                  error: true,
                }),
              }
            : g,
        ),
      );
    }
  };

  // === Регенерация ===
  const handleRegenerate = async (groupId) => {
    await fetch(`/prevgen-api/regenerate/${groupId}`, { method: "POST" });
    const updated = await fetch("/prevgen-api/generated").then((r) => r.json());
    setGeneratedGroups(updated);
  };

  // === 7. Удаление/переименование/создание папки ===
  const openModal = (mode, data = {}) => {
    setModalMode(mode);
    setModalData(data);
  };
  const closeModal = () => setModalMode(null);

  const handleCreateFolder = (label) => {
    const key = label.trim();
    if (!key) return;
    setFolders((f) => [...f, { key, label, locked: false, hidden: false }]);
    closeModal();
    setActiveFolder(key);
  };
  const handleRenameFolder = (key, label) => {
    setFolders((f) => f.map((x) => (x.key === key ? { ...x, label } : x)));
    closeModal();
  };
  const handleDeleteFolder = (key) => {
    setFolders((f) => f.filter((x) => x.key !== key));
    if (activeFolder === key) setActiveFolder("default");
    closeModal();
  };

  // === 8. Рендер ===
  return (
    <EditorProvider>
      <div className="box-border flex h-[calc(100vh-80px)] flex-col overflow-hidden pt-12 font-circe-regular text-main-white">
        <div className="flex h-full items-start gap-x-3">
          {modalMode && (
            <FolderModal
              mode={modalMode}
              data={modalData}
              onClose={closeModal}
              onCreate={handleCreateFolder}
              onRename={handleRenameFolder}
              onDelete={handleDeleteFolder}
            />
          )}
          <div
            ref={refLeftPanel}
            className={`group/leftPanel flex h-full flex-grow flex-col ${editorOpen ? "" : "overflow-y-auto"}`}
          >
            {editorOpen ? (
              <EditorCanvas
                image={editorImage}
                onClose={() => setEditorOpen(false)}
              />
            ) : (
              <LeftPanel
                folders={folders}
                activeFolder={activeFolder}
                onFolderChange={setActiveFolder}
                groups={getGroups()}
                onDeleteGroup={() => {
                  /*...*/
                }}
                onEditCard={(src) => {
                  setEditorImage(src);
                  setEditorOpen(true);
                }}
                onAddFolder={() => openModal("create")}
                onEditFolder={() => openModal("edit", { key: activeFolder })}
                onDeleteFolder={() =>
                  openModal("delete", { key: activeFolder })
                }
              />
            )}
          </div>

          <div
            ref={refPromptPanel}
            className="sticky top-0 flex h-full w-full max-w-[500px] flex-col rounded-[20px] bg-dark-coal p-3"
          >
            {editorOpen && (
              <EditorSidebar
                image={editorImage}
                activeTool={activeTool}
                onToolChange={setActiveTool}
                onClose={() => setEditorOpen(false)}
                references={myTemplateGroups}
              />
            )}
            {activeFolder !== "templates" && !editorOpen && (
              <SidebarPrompt
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedReference={selectedReference}
                onReferenceChange={setSelectedReference}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                onCreate={handleCreate}
                references={myTemplateGroups}
              />
            )}
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default PreviewGeneratorPage;
