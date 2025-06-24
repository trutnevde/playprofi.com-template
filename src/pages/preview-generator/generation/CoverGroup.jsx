import { FaArrowsAlt, FaSyncAlt, FaTrash } from "react-icons/fa";
import { CoverCard } from "./CoverCard";

// Группа карточек
export const CoverGroup = ({
  title,
  items,
  orientation,
  onRegen,
  onDeleteGroup,
  onDrag,
  onEditCard,
  hideButtons,
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className={`flex space-x-2 ${hideButtons ? "invisible" : ""}`}>
        <button onClick={onDrag} className="rounded p-1 hover:bg-dark-graphite">
          <FaArrowsAlt />
        </button>
        <button
          onClick={onRegen}
          className="rounded p-1 hover:bg-dark-graphite"
        >
          <FaSyncAlt />
        </button>
        <button
          onClick={onDeleteGroup}
          className="rounded p-1 hover:bg-dark-graphite"
        >
          <FaTrash />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {items.slice(0, 3).map((item, i) => (
        <CoverCard
          key={i}
          src={item.src}
          orientation={orientation}
          onEdit={() => onEditCard(item.src)}
          loading={item.loading}
        />
      ))}
    </div>
  </div>
);
