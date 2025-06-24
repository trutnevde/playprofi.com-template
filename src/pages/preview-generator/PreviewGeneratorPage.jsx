import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LeftPanel from "./generation/LeftPanel";
import EditorCanvas from "./Editor/EditorCanvas";
import { EditorSidebar } from "./editor/EditorSidebar";
import { SidebarPrompt } from "./generation/SidebarPrompt";
import { EditorProvider } from "./EditorContext";

export const orientationOptions = {
  "16:9": {
    label: "16:9",
    className: "aspect-[16/9]",
  },
  "9:16": {
    label: "9:16",
    className: "aspect-[9/16]",
  },
  free: {
    label: "Произвольный",
    className: "",
  },
};

// Табы папок с возможностью добавления
export const FolderTabs = ({ tabs, activeKey, onChange, onAdd }) => (
  <div className="flex h-full max-h-8 space-x-3 text-sm">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        className={`rounded-md border border-transparent px-4 transition-colors focus:outline-none ${
          tab.key === activeKey
            ? "border-white bg-dark-graphite text-white"
            : "bg-dark-coal text-supporting"
        }`}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}
      </button>
    ))}
    <button className="flex items-center rounded-md px-3 py-2" onClick={onAdd}>
      + Создать папку
    </button>
  </div>
);

const PreviewGeneratorPage = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.preview-generator",
  });

  const [folders, setFolders] = useState([
    { key: "ai", label: "Созданы AI" },
    { key: "templates", label: "Шаблоны" },
  ]);

  const [activeFolder, setActiveFolder] = useState("default");

  const [templateGroups, setTemplateGroups] = useState([
    {
      title: "Врачи",
      items: Array(3).fill({
        src: "https://placehold.co/465x465",
        alt: "Превью",
        aspect: "9:16",
      }),
    },
    {
      title: "Врачи",
      items: Array(3).fill({
        src: "https://placehold.co/300x150",
        alt: "Превью",
        aspect: "16:9",
      }),
    },
    {
      title: "Врачи",
      items: Array(3).fill({
        src: "https://placehold.co/300x150",
        alt: "Превью",
        aspect: "16:9",
      }),
    },
  ]);

  const [tabGroups, setTabGroups] = useState({
    ai: [], // для «Созданы AI»
    templates: templateGroups, // исходные шаблоны из массива groups
    default: templateGroups,
  });

  const [prompt, setPrompt] = useState("");
  const [selectedReference, setSelectedReference] = useState(null);

  const [selectedFormat, setSelectedFormat] = useState("16:9");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  const refPromptPanel = useRef(HTMLDivElement);

  useEffect(() => {
    const resizeContent = () => {
      if (refPromptPanel.current) {
        const headerHeight = refPromptPanel.current.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - headerHeight - 20;

        refPromptPanel.current.style.height = `${availableHeight}px`;
      }
    };
    resizeContent();
    window.addEventListener("resize", resizeContent);
    return () => window.removeEventListener("resize", resizeContent);
  }, []);

  const handleCreate = (mode = "ai") => {
    const fmt = selectedFormat;
    const promptText = prompt.trim();
    if (!promptText && mode === "ai") return;

    const newGroup = {
      title:
        mode === "ai"
          ? promptText
          : mode === "video"
            ? "По видео"
            : "По фото/объекту",
      params: {
        prompt: promptText,
        reference: selectedReference,
        format: selectedFormat,
        mode,
      },
      orientation: fmt,
      items: Array(3).fill({ loading: true }),
    };

    setTabGroups((prev) => ({
      ...prev,
      ai: mode === "ai" ? [newGroup, ...prev.ai] : prev.ai,
    }));
  };

  const handleDeleteGroup = (index) => {
    setTabGroups((prev) => {
      const list = prev[activeFolder].filter((_, i) => i !== index);
      return { ...prev, [activeFolder]: list };
    });
  };

  const handleEditCard = (src) => {
    setEditorImage(src);
    setEditorOpen(true);
  };

  const handleAddFolder = () => {
    const key = `f${folders.length + 1}`;
    setFolders((prev) => [
      ...prev,
      { key, label: `Папка ${folders.length + 1}` },
    ]);
  };

  const activeGroups = activeFolder
    ? tabGroups[activeFolder].map((group) => ({
        ...group,
        onMoveUp: () => {},
        onRegen: () => {},
      }))
    : [];

  return (
    <EditorProvider>
      <div className="mt-12 flex h-full flex-shrink-0 flex-grow flex-col text-main-white">
        <div className="flex items-start gap-x-6">
          <div className="flex-grow">
            {/* Левая часть: canvas или табы + карточки */}
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
                onAddFolder={handleAddFolder}
                groups={activeGroups}
                onDeleteGroup={handleDeleteGroup}
                onEditCard={handleEditCard}
                showGridOnly={
                  activeFolder !== "templates" || activeFolder !== null
                }
              />
            )}
          </div>

          {/* Правая часть: панель редактирования */}
          <div
            ref={refPromptPanel}
            className={`sticky top-6 flex h-[100vh] w-full max-w-[500px] flex-shrink-0 flex-grow flex-col rounded-[20px] bg-dark-coal p-3`}
          >
            {!editorOpen && (
              <SidebarPrompt
                prompt={prompt}
                onPromptChange={setPrompt}
                selectedReference={selectedReference}
                onReferenceChange={setSelectedReference}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                onCreate={handleCreate}
              />
            )}
            {editorOpen && (
              <EditorSidebar
                image={editorImage}
                activeTool={activeTool}
                onToolChange={setActiveTool}
                onClose={() => setEditorOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default PreviewGeneratorPage;
