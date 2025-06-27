import { FaArrowsAlt, FaSyncAlt, FaTrash } from "react-icons/fa";
import { CoverCard } from "./CoverCard";
import MoveUp from "../../../shared/assets/icons/move-up.svg?react";
import Repeat from "../../../shared/assets/icons/repeat.svg?react";
import Trash from "../../../shared/assets/icons/trash.svg?react";

// Группа карточек
export const CoverGroup = ({
  title,
  items = [],
  onRegen,
  onDeleteGroup,
  onDrag,
  onEditCard,
  hideButtons,
  hideTitles,
  showAllItems = true,
}) => {
  // Предполагаем, что в группе все карточки одного aspect
  const firstAspect = items[0]?.aspect;
  const isVertical = firstAspect === "9:16";

  // сюда рендерим либо все items, либо первые 3
  const displayItems = showAllItems ? items : items.slice(0, 3);

  // const colCount = Math.min(3, displayItems.length);
  const colCount = 3;

  return (
    <div className="space-y-3">
      {!hideTitles && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className={`flex space-x-2 ${hideButtons ? "invisible" : ""}`}>
            <button
              onClick={onDrag}
              className="rounded p-1 hover:bg-dark-graphite"
            >
              <MoveUp />
            </button>
            <button
              onClick={onRegen}
              className="rounded p-1 hover:bg-dark-graphite"
            >
              <Repeat />
            </button>
            <button
              onClick={onDeleteGroup}
              className="rounded p-1 hover:bg-dark-graphite"
            >
              <Trash />
            </button>
          </div>
        </div>
      )}
      {/* Карточки: flex для вертикальных, grid для остальных */}
      <div
        className={
          isVertical
            ? "flex gap-4 overflow-x-auto"
            : `grid grid-cols-${colCount} gap-4`
        }
      >
        {displayItems.map((item, i) => (
          <CoverCard
            key={i}
            src={item.src}
            aspect={item.aspect}
            onEdit={() => onEditCard(item.src)}
            loading={item.loading}
          />
        ))}
      </div>
    </div>
  );
};
