import { CoverGroup } from "./CoverGroup";
import { FolderTabs } from "../PreviewGeneratorPage";
import { CoverCard } from "./CoverCard";
import { FaArrowRight } from "react-icons/fa6";

const LeftPanel = ({
  folders,
  activeFolder,
  onFolderChange,
  onAddFolder,
  groups,
  onDeleteGroup,
  onEditCard,
}) => (
  <>
    <FolderTabs
      tabs={folders}
      activeKey={activeFolder}
      onChange={onFolderChange}
      onAdd={onAddFolder}
    />
    {(activeFolder == "default" && (
      <div className="mt-7 flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light">Готовые шаблоны</h2>
          <button
            onClick={() => onFolderChange("templates")}
            className="flex h-8 items-center gap-2 rounded-lg bg-main-accent pl-4 pr-3 text-sm font-normal text-dark-coal"
          >
            Посмотреть все шаблоны <FaArrowRight size={24} />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-5">
          {groups
            .flatMap((group) => group.items)
            .map((item, i) => (
              <CoverCard
                key={i}
                src={item.src}
                onEdit={() => onEditCard(item.src)}
              />
            ))}
        </div>
      </div>
    )) ||
      (activeFolder == "templates" && (
        // Обычное окно — разные группы с заголовками и кнопками
        <div className="mt-7 space-y-10">
          {groups.map((group, gi) => (
            <CoverGroup
              key={gi}
              title={group.title}
              items={group.items}
              orientation={group.orientation}
              onDrag={group.onDrag}
              onRegen={group.onRegen}
              onDeleteGroup={() => onDeleteGroup(gi)}
              onEditCard={onEditCard}
              hideButtons={true}
            />
          ))}
        </div>
      )) || (
        // Обычное окно — разные группы с заголовками и кнопками
        <div className="mt-7 space-y-10">
          {groups.map((group, gi) => (
            <CoverGroup
              key={gi}
              title={group.title}
              items={group.items}
              orientation={group.orientation}
              onDrag={group.onDrag}
              onRegen={group.onRegen}
              onDeleteGroup={() => onDeleteGroup(gi)}
              onEditCard={onEditCard}
            />
          ))}
        </div>
      )}
  </>
);

export default LeftPanel;
