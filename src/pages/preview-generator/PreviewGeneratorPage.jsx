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
import {
  deleteGroup,
  generateGroup,
  listGenerated,
  regenerateGroup,
} from "./api/prevgen";
import MaClose from "../../shared/assets/icons/material-symbols-close.svg?react";

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

    // подготовим скелетон
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
      items: Array(3).fill({ src: null, alt: "", aspect: fmt, loading: true }),
    };

    setGenerated((prev) => [newGroupSkeleton, ...(prev || [])]);
    setActiveFolder("ai");

    try {
      // вместо прямого fetch используем утилиту
      const { group_id, images } = await generateGroup({
        prompt: text,
        reference: selectedReference,
        format: fmt,
        mode,
        count: 3,
      });

      // сразу вставляем полученные картинки вместо скелетона
      setGenerated((prev) => {
        const rest = prev.slice(1); // отрезаем скелетон
        return [
          {
            id: group_id,
            title: text,
            params: {
              prompt: text,
              reference: selectedReference,
              format: fmt,
              mode,
            },
            orientation: fmt,
            items: images.map((img) => ({
              src: img.src,
              alt: img.alt,
              aspect: img.aspect,
              layers: img.layers,
            })),
          },
          ...rest,
        ];
      });
    } catch (err) {
      console.error("Generation failed:", err);
      // показываем ошибку на первом элементе
      setGenerated((prev) =>
        prev.map((g, idx) =>
          idx === 0
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
      <div className="box-border flex h-[calc(100vh-80px)] max-w-full flex-col overflow-hidden pt-12 font-circe-regular text-main-white">
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
            className={`group/leftPanel relative flex h-full flex-col overflow-y-visible ${editorOpen ? "overflow-x-hidden" : "flex-grow"}`}
          >
            {editorOpen ? (
              <>
                <button
                  className="absolute left-0 z-30 -translate-y-[calc(100%+12px)] text-2xl"
                  onClick={() => setEditorOpen(false)}
                >
                  <MaClose />
                </button>
                <EditorCanvas
                  src={editorImage}
                  layers={layers}
                  aspect={activeCrop}
                  onClose={() => setEditorOpen(false)}
                />
              </>
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
              className="sticky top-0 flex h-full w-full max-w-[500px] flex-shrink-0 flex-grow flex-col rounded-[20px] bg-dark-coal p-3"
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
