import { FaDownload, FaEdit, FaHeart } from "react-icons/fa";

// Карточка обложки
export const CoverCard = ({
  src,
  loading,
  orientation,
  onEdit,
  onLike,
  onDownload,
}) => {
  const classes =
    orientation === "vertical" ? "aspect-[9/16]" : "aspect-[16/9]";

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
      className={`group/coverCard relative cursor-pointer rounded-md ${classes}`}
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
        <div className="absolute right-2 top-2 z-30 flex gap-2 opacity-0 transition-opacity duration-300 group-hover/coverCard:opacity-100">
          <CardIcon title={"Добавить в избранное"}>
            <FaHeart size={16} />
          </CardIcon>
          <CardIcon title={"Редактировать"} onClick={onEdit}>
            <FaEdit size={16} />
          </CardIcon>
          <CardIcon title={"Скачать"}>
            <FaDownload size={16} />
          </CardIcon>
        </div>
      )}
    </div>
  );
};
