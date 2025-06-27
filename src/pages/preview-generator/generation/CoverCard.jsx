import { FaDownload, FaEdit, FaHeart } from "react-icons/fa";
import { orientationOptions } from "../PreviewGeneratorPage";
import IconEdit from "../../../shared/assets/icons/edit.svg?react";
import IconHeart from "../../../shared/assets/icons/heart-outline.svg?react";
import IconDownload from "../../../shared/assets/icons/download-2.svg?react";

// Карточка обложки
export const CoverCard = ({
  src,
  loading,
  aspect = "16:9",
  onEdit,
  onLike,
  onDownload,
}) => {
  // базовый tailwind-класс для aspect
  const baseClass =
    orientationOptions[aspect]?.className ||
    orientationOptions["16:9"].className;

  // для вертикальных: ограничиваем max-width так, чтобы
  // высота равнялась ширине горизонталки (примерно 220px)
  const extra = aspect === "9:16" ? " max-w-[220px]" : "";

  const CardIcon = ({ children, onClick, title }) => {
    return (
      <button
        className="group/cardIcon relative flex size-7 cursor-pointer items-center justify-center rounded-full bg-dark-graphite"
        onClick={onClick}
      >
        {children}
        <span className="absolute top-full mt-[2px] h-7 w-max max-w-max rounded-lg bg-dark-coal px-2 opacity-0 group-hover/cardIcon:opacity-100">
          {title}
        </span>
      </button>
    );
  };

  return (
    <div
      className={`group/coverCard relative cursor-pointer rounded-md ${baseClass}${extra}`}
    >
      <div className="h-full w-full overflow-hidden rounded-[20px]">
        {loading ? (
          <div className="h-full w-full animate-pan-gradient bg-gradient-to-br from-[rgba(25,24,24,1)] to-[rgba(42,41,41,1)]" />
        ) : (
          <img src={src} alt="Обложка" className="h-full w-full object-cover" />
        )}
      </div>

      {/* иконки поверх карточки */}
      {!loading && (
        <div className="absolute right-2 top-2 z-10 flex gap-2 opacity-0 transition-opacity duration-300 group-hover/coverCard:opacity-100">
          <CardIcon title={"Добавить в избранное"}>
            <IconHeart />
          </CardIcon>
          <CardIcon title={"Редактировать"} onClick={onEdit}>
            <IconEdit />
          </CardIcon>
          <CardIcon title={"Скачать"}>
            <IconDownload />
          </CardIcon>
        </div>
      )}
    </div>
  );
};
