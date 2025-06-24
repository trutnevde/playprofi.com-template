import { useState } from "react";
import {
  ArrowDown,
  MessageEdit,
  PlayCircle,
  PauseCircle,
  Trash,
  Copy,
} from "iconsax-react";
// import { useNavigate } from "react-router-dom";
import Waveform from "./Waveform";
import { useNotification } from "../../context/NotificationContext";
import CustomTooltip from "../title/CustomTitle";
import {
  useDeleteVoiceoverMutation,
  useRenameVoiceoverMutation,
} from "../../../pages/voiceover-page/api/api";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusIndicator({ status }) {
  if (status === "pending" || status === "processing") {
    return (
      <div className="flex items-center space-x-2 text-main-accent">
        <div className="size-4 animate-spin rounded-full border-y-2 border-main-accent"></div>
        <span className="text-sm">Обработка...</span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <span className="text-sm">Ошибка обработки</span>
      </div>
    );
  }

  return null;
}

function VoiceoverCard({ voiceovers = [] }) {
  // const navigate = useNavigate();
  const [playingId, setPlayingId] = useState(null);
  const [lastPlayedId, setLastPlayedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const { showNotification } = useNotification();
  const [deleteVoiceover] = useDeleteVoiceoverMutation();
  const [renameVoiceover] = useRenameVoiceoverMutation();

  const handleDownload = async (url, title) => {
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };

  const handleDelete = async (uuid) => {
    try {
      await deleteVoiceover(uuid).unwrap();
      showNotification("Озвучка успешно удалена", "success", "success");
    } catch (error) {
      console.log(error);
      showNotification("Ошибка при удалении озвучки", "error", "error");
    }
  };

  const handleRename = async (uuid) => {
    if (!editTitle.trim()) {
      showNotification("Название не может быть пустым", "error", "error");
      return;
    }

    try {
      await renameVoiceover({ uuid, title: editTitle.trim() }).unwrap();
      showNotification("Название успешно изменено", "success", "success");
    } catch (error) {
      console.log(error);
      showNotification("Ошибка при переименовании", "error", "error");
    } finally {
      setEditingId(null);
    }
  };

  const handleKeyDown = (e, uuid) => {
    if (e.key === "Enter") {
      handleRename(uuid);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {voiceovers.map((vo) => {
        const isPlaying = playingId === vo.id;
        const isCurrent = lastPlayedId === vo.id;
        const isProcessing =
          vo.status === "pending" || vo.status === "processing";
        const isFailed = vo.status === "failed";

        return (
          <div
            key={vo.id}
            className={`flex items-center justify-between rounded-2xl border p-3 transition hover:shadow-lg ${
              isPlaying
                ? "border-main-accent bg-dark-graphite"
                : "border-transparent bg-dark-coal"
            }`}
          >
            {/* Левая часть */}
            <div className="flex min-w-40 max-w-72 items-center space-x-4">
              <div
                className={`flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-dark-graphite transition-transform duration-300 ${
                  isProcessing || isFailed ? "" : "hover:scale-110"
                }`}
                onClick={() => {
                  if (isProcessing || isFailed) return;
                  if (isPlaying) {
                    setPlayingId(null);
                  } else {
                    setPlayingId(vo.id);
                    setLastPlayedId(vo.id);
                  }
                }}
              >
                {isPlaying ? (
                  <PauseCircle
                    size="32"
                    variant="Bold"
                    className="text-main-accent transition-all duration-300 ease-in-out"
                  />
                ) : (
                  <PlayCircle
                    size="32"
                    variant="Bold"
                    className={`text-gray transition-all duration-300 ease-in-out ${
                      isProcessing || isFailed
                        ? "text-supporting"
                        : "hover:text-main-accent"
                    }`}
                  />
                )}
              </div>

              <div className="flex w-full flex-col gap-1 overflow-hidden">
                {editingId === vo.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleRename(vo.id)}
                    onKeyDown={(e) => handleKeyDown(e, vo.id)}
                    className="w-[130px] bg-transparent text-white focus:outline-none focus:ring-0"
                    autoFocus
                  />
                ) : (
                  <p
                    className={`w-[130px] cursor-pointer truncate text-sm font-semibold transition-colors ${
                      isPlaying ? "text-main-accent" : "text-white"
                    }`}
                    onDoubleClick={() => {
                      setEditingId(vo.id);
                      setEditTitle(vo.title || "");
                    }}
                  >
                    {vo.title || "Название озвучки"}
                  </p>
                )}
                <>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="truncate text-xs text-supporting">
                      {vo.createdAt
                        ? formatDate(vo.createdAt)
                        : "Дата не указана"}
                    </p>
                    <CustomTooltip tooltipContent="Скопировать ID">
                      <Copy
                        size="15"
                        variant="Bulk"
                        className="cursor-pointer text-gray transition-colors hover:text-main-accent"
                        onClick={() => {
                          navigator.clipboard.writeText(vo.id);
                          showNotification("ID скопирован", vo.id, "success");
                        }}
                      />
                    </CustomTooltip>
                  </div>
                </>
              </div>
            </div>

            {/* Вейформа */}
            {!isProcessing && !isFailed ? (
              <div className="mx-4 flex flex-1 items-center rounded-xl bg-dark-graphite px-4 py-2">
                <Waveform
                  audioUrl={vo.audioUrl}
                  isActive={isPlaying}
                  onFinish={() => setPlayingId(null)}
                  isCurrent={isCurrent}
                  onPlay={() => {}}
                  onPause={() => {}}
                />
              </div>
            ) : (
              <div className="mx-4 flex h-12 flex-1 items-center justify-center rounded-xl bg-dark-graphite px-4 py-2">
                <StatusIndicator status={vo.status} />
              </div>
            )}

            {/* Правая часть */}
            <div className="flex min-w-[110px] items-center justify-end space-x-4">
              {!isProcessing && !isFailed && (
                <>
                  <ArrowDown
                    size="25"
                    variant="Bulk"
                    className="cursor-pointer text-gray transition-colors hover:text-main-accent"
                    onClick={() => handleDownload(vo.audioUrl, vo.title)}
                  />
                  <MessageEdit
                    size="25"
                    variant="Bulk"
                    className="cursor-pointer text-gray transition-colors hover:text-main-accent"
                    // onClick={() => navigate(`/app/voiceover/${vo.id}`)}
                    onClick={() => {
                      showNotification(
                        "Данная функция ещё в разработке",
                        "error",
                        "error",
                      );
                    }}
                  />
                </>
              )}
              <Trash
                size="25"
                variant="Bulk"
                className="cursor-pointer text-gray transition-colors hover:text-red-500"
                onClick={() => handleDelete(vo.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VoiceoverCard;
