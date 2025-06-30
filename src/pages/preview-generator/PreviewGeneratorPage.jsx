import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftPanel from "./generation/LeftPanel";
import EditorCanvas from "./Editor/EditorCanvas";
import { EditorSidebar } from "./editor/EditorSidebar";
import { SidebarPrompt } from "./generation/SidebarPrompt";
import { EditorProvider } from "./EditorContext";
import { FolderModal } from "./Folders";
import { usePrevgenData } from "./hooks/usePrevgenData";
import {
  deleteGroup,
  startGeneration,
  regenerateJob,
  fetchGenerationStatus,
  listGenerated,
} from "./api/prevgen";
import MaClose from "../../shared/assets/icons/material-symbols-close.svg?react";
import { uniqueId } from "lodash";

const PreviewGeneratorPage = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.preview-generator",
  });

  // === State для всех четырёх источников данных ===
  const {
    generated,
    templates,
    examples,
    myTemplates,
    tasks,
    setGenerated,
    setTasks,
  } = usePrevgenData();

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
      case "ai": {
        // AI: показываем сначала локальные задачи, затем серверные группы
        const local = tasks
          .filter((t) => t.status !== "ready")
          .map(taskToGroup);
        const server = generated.map(apiGroupToLocal);
        return [...server, ...local];
      }
      default: {
        return [];
      }
    }
  };

  const refreshGenerated = () =>
    listGenerated()
      .then(setGenerated)
      .catch(() => {});

  const refPromptPanel = useRef();
  const refLeftPanel = useRef();

  const taskToGroup = (task) => ({
    id: task.jobId || task.tempId,
    title: task.prompt,
    params: {
      prompt: task.prompt,
      reference: task.reference,
      format: task.format,
      mode: task.mode,
    },
    orientation: task.format,
    items:
      task.status === "ready"
        ? task.result.map((src) => ({
            src,
            alt: "",
            aspect: task.format,
            layers: [
              {
                id: "bg",
                type: "image",
                image: src,
                x: 0,
                y: 0,
                visible: true,
                lock: true,
              },
            ],
          }))
        : Array(3).fill({
            src: null,
            alt: "",
            aspect: task.format,
            loading: true,
            error: task.status === "failed",
          }),
  });

  const apiGroupToLocal = (g) => ({
    id: g.id,
    title: g.title,
    params: g.params,
    orientation: g.orientation,
    items: g.items.map((i) => ({
      src: i.src,
      alt: i.alt,
      aspect: g.orientation,
      layers: i.layers,
    })),
  });

  // === Генерация нового набора ===

  const handleCreate = async (mode = "ai") => {
    const text = prompt.trim();
    if (!text && mode === "ai") return;

    const fmt = selectedFormat;
    const folderKey = activeFolder === "default" ? "ai" : activeFolder;

    // 1) Добавляем новую задачу со статусом pending
    const tempId = uniqueId();
    setTasks((prev) => [
      ...prev,
      {
        tempId,
        prompt: text,
        reference: selectedReference,
        format: fmt,
        mode,
        folderKey,
        status: "pending",
      },
    ]);
    setActiveFolder("ai");

    // Отрисовываем скелетон
    // const skeleton = {
    //   id: null,
    //   title:
    //     mode === "ai"
    //       ? text
    //       : mode === "video"
    //         ? "По видео"
    //         : "По фото/объекту",
    //   params: { prompt: text, reference: selectedReference, format: fmt, mode },
    //   orientation: fmt,
    //   items: Array(3).fill({ src: null, alt: "", aspect: fmt, loading: true }),
    // };
    // setGenerated((prev) => [skeleton, ...(prev || [])]);
    // setActiveFolder("ai");

    try {
      // Инициируем задачу
      const { job_id, status } = await startGeneration({
        prompt: text,
        reference: selectedReference,
        format: fmt,
        mode,
        count: 3,
      });
      if (status !== "pending") {
        throw new Error("Не удалось запустить задачу генерации");
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.tempId === tempId
            ? { ...t, jobId: job_id, status: "in_progress" }
            : t,
        ),
      );

      pollJob(tempId, job_id);

      // Polling статуса
      const timer = setInterval(async () => {
        try {
          console.log("Polling... ", job_id);

          const status = await fetchGenerationStatus(job_id);
          if (status.status === "ready" && Array.isArray(status.result)) {
            clearInterval(timer);
            setTasks((prev) =>
              prev
                .map((t) =>
                  t.tempId === tempId
                    ? { ...t, status: "ready", result: status.result }
                    : t,
                )
                .filter((t) => t.status !== "ready"),
            );
            // Заменяем скелетон на реальный результат
            setGenerated((prev) => {
              return [
                ...prev,
                {
                  id: job_id,
                  title: text,
                  params: {
                    prompt: text,
                    reference: selectedReference,
                    format: fmt,
                    mode,
                  },
                  orientation: fmt,
                  items: status.result.map((src) => ({
                    src,
                    alt: "",
                    aspect: fmt,
                    layers: [
                      {
                        id: "bg",
                        type: "image",
                        image: src,
                        x: 0,
                        y: 0,
                        visible: true,
                        lock: true,
                      },
                    ],
                  })),
                },
              ];
            });
          }
          if (status.status === "failed") {
            clearInterval(timer);
            console.error("Generation failed:", status);
            // Показываем ошибку на скелетоне
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
        } catch (e) {
          clearInterval(timer);
          console.error("Ошибка при опросе статуса:", e);
        }
      }, 1000);
    } catch (err) {
      console.error("Start generation failed:", err);
      // Метим первый элемент как ошибку
      // setGenerated((prev) =>
      //   prev.map((g, i) =>
      //     i === 0
      //       ? {
      //           ...g,
      //           items: Array(3).fill({
      //             src: null,
      //             alt: "",
      //             aspect: fmt,
      //             loading: false,
      //             error: true,
      //           }),
      //         }
      //       : g,
      //   ),
      // );

      setTasks((prev) =>
        prev.map((t) =>
          t.tempId === tempId ? { ...t, status: "failed", error: true } : t,
        ),
      );
    }
  };

  const pollRefs = useRef({});

  const pollJob = (tempId, jobId) => {
    // если уже есть таймер — убираем старый
    clearInterval(pollRefs.current[tempId]);

    const timer = window.setInterval(async () => {
      try {
        const status = await fetchGenerationStatus(jobId);
        if (status.status === "ready" && Array.isArray(status.result)) {
          clearInterval(timer);
          // апдейтим status + результат
          setTasks((prev) =>
            prev.map((t) =>
              t.tempId === tempId
                ? { ...t, status: "ready", result: status.result }
                : t,
            ),
          );
        } else if (status.status === "failed") {
          clearInterval(timer);
          setTasks((prev) =>
            prev.map((t) =>
              t.tempId === tempId ? { ...t, status: "failed", error: true } : t,
            ),
          );
        }
      } catch (e) {
        clearInterval(timer);
        setTasks((prev) =>
          prev.map((t) =>
            t.tempId === tempId ? { ...t, status: "failed", error: true } : t,
          ),
        );
      }
    }, 1000);

    pollRefs.current[tempId] = timer;
  };

  const handleRegenerate = async (tempId, jobId) => {
    const newTempId = uniqueId();
    // рендерим skeleton для нового tempId
    setTasks((prev) => {
      const prevTask = prev.find((t) => t.jobId === jobId);
      const fallback = {
        prompt: "",
        reference: null,
        format: "16:9",
        mode: "ai",
        folderKey: "ai",
      };
      return [
        {
          ...fallback,
          ...prevTask,
          tempId: newTempId,
          jobId: undefined,
          status: "pending",
        },
        ...prev,
      ];
    });

    try {
      const { job_id, status } = await regenerateJob(jobId);
      if (status !== "pending") throw new Error();

      setTasks((prev) =>
        prev.map((t) =>
          t.tempId === newTempId
            ? { ...t, jobId: job_id, status: "in_progress" }
            : t,
        ),
      );

      pollJob(newTempId, job_id);
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.tempId === newTempId ? { ...t, status: "failed", error: true } : t,
        ),
      );
    }
  };

  const handleDelete = async (groupId) => {
    setTasks((prev) => prev.filter((t) => t.jobId !== groupId));
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
