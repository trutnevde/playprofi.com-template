import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftPanel from "./generation/LeftPanel";
import EditorCanvas from "./Editor/EditorCanvas";
import { EditorSidebar } from "./editor/EditorSidebar";
import { SidebarPrompt } from "./generation/SidebarPrompt";
import { EditorProvider } from "./EditorContext";
import { FaPlus } from "react-icons/fa6";
import { FolderModal } from "./Folders";
import { usePrevgenData } from "./hooks/usePrevgenData";
import { deleteGroup, listGenerated, regenerateGroup } from "./api/prevgen";
import { m } from "framer-motion";

const PreviewGeneratorPage = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.preview-generator",
  });

  // === State для всех четырёх источников данных ===
  const { generated, templates, examples, myTemplates, setGenerated } =
    usePrevgenData();

  // === State для папок (tabs) ===
  const [folders, setFolders] = useState([
    { key: "default", label: "По умолчанию", locked: true, hidden: true },
    { key: "ai", label: "Созданы AI", locked: true, hidden: false },
    { key: "templates", label: "Шаблоны", locked: true, hidden: false },
    { key: "myTemplates", label: "Мои шаблоны", locked: true, hidden: true },
  ]);

  const [activeFolder, setActiveFolder] = useState("default");
  const [modalMode, setModalMode] = useState(null);
  const [modalData, setModalData] = useState({});
  const [prompt, setPrompt] = useState("");
  const [selectedReference, setSelectedReference] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("16:9");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [activeCrop, setActiveCrop] = useState("16:9");
  const [layers, setLayers] = useState([]);

  const getGroups = () => {
    switch (activeFolder) {
      case "default":
        return examples;
      case "templates":
        return templates;
      case "myTemplates":
        return myTemplates;
      case "ai":
        return generated;
      default:
        return [];
    }
  };

  const refreshGenerated = () =>
    listGenerated()
      .then(setGenerated)
      .catch(() => {
        /* noop */
      });

  const refPromptPanel = useRef();
  const refLeftPanel = useRef();

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
    setGenerated((prev) => [newGroupSkeleton, ...(prev || [])]);
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

      // 3) Сразу перечитываем все AI-группы с бэка, чтобы получить свежие данные
      const updated = await fetch("/prevgen-api/generated").then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      });

      setGenerated(updated);
      setActiveFolder("ai");
    } catch (err) {
      console.error("Generation error:", err);
      // Здесь можно заменить «скелетон» на группу с ошибкой
      setGenerated((prev) =>
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

  const handleRegenerate = async (groupId) => {
    await regenerateGroup(groupId);
    await refreshGenerated();
  };

  const handleDelete = async (groupId) => {
    await deleteGroup(groupId);
    await refreshGenerated();
  };

  // === Удаление/переименование/создание папки ===
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
                layers={layers}
                aspect={activeCrop}
                onClose={() => setEditorOpen(false)}
              />
            ) : (
              <LeftPanel
                folders={folders}
                activeFolder={activeFolder}
                onFolderChange={setActiveFolder}
                groups={getGroups()}
                onDeleteGroup={handleDelete}
                onRegenGroup={handleRegenerate}
                onEditCard={(item, groupId) => {
                  setEditorImage(item);
                  setLayers(item.layers || []);
                  setActiveCrop(item.aspect);
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
          {editorOpen && (
            <div
              ref={refPromptPanel}
              className="sticky top-0 flex h-full w-full max-w-[500px] flex-col rounded-[20px] bg-dark-coal p-3"
            >
              <EditorSidebar
                image={editorImage}
                activeTool={activeTool}
                onToolChange={setActiveTool}
                onClose={() => setEditorOpen(false)}
                references={myTemplates}
                layers={layers}
              />
            </div>
          )}
          {activeFolder !== "templates" && !editorOpen && (
            <div
              ref={refPromptPanel}
              className="sticky top-0 flex h-full w-full max-w-[500px] flex-col rounded-[20px] bg-dark-coal p-3"
            >
              <SidebarPrompt
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedReference={selectedReference}
                onReferenceChange={setSelectedReference}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                onCreate={handleCreate}
                references={myTemplates}
              />
            </div>
          )}
        </div>
      </div>
    </EditorProvider>
  );
};

export default PreviewGeneratorPage;
