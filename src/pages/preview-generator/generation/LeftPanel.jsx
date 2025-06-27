import { CoverGroup } from "./CoverGroup";
import { FaArrowRight, FaChevronDown } from "react-icons/fa6";
import { FolderTabs } from "../Folders";
import lampCharge from "../../../shared/assets/icons/lamp-charge.svg";
import mouseSquare from "../../../shared/assets/icons/mouse-square.svg";
import penAdd from "../../../shared/assets/icons/pen-add.svg";
import { useState } from "react";
import { orientationOptions } from "../PreviewGeneratorPage";
import StyledSelect from "../../../shared/ui/select/SelectCustom";
import SearchNormal from "../../../shared/assets/icons/search-normal.svg?react";
import IconEdit from "../../../shared/assets/icons/edit-solid.svg?react";
import IconTrash from "../../../shared/assets/icons/bin.svg?react";

export const StepSection = ({ icon, number, children }) => (
  <div className="flex h-20 w-full gap-5 rounded-[20px] bg-dark-coal px-5 pb-5 pt-4 text-supporting">
    <div className="relative flex w-[54px] flex-col items-center justify-end gap-[10px]">
      <div className="absolute -top-4 flex size-[54px] -translate-y-1/2 items-center justify-center rounded-xl bg-dark-graphite">
        <img src={icon} alt="" />
      </div>
      <div className="flex h-5 w-full items-center justify-center rounded-xl bg-dark-graphite pt-0.5 text-base">
        {number}
      </div>
    </div>
    <div>{children}</div>
  </div>
);

export const StepDivider = () => (
  <div className="ml-[43px] h-[85px] w-2 bg-dark-graphite [box-shadow:0px_12px_9.1px_-5px_rgba(0,_0,_0,_0.15)_inset]"></div>
);

const LeftPanel = ({
  folders,
  activeFolder,
  onFolderChange,
  onAddFolder,
  groups = [],
  onDeleteGroup,
  onEditCard,
  onEditFolder,
  onDeleteFolder,
}) => {
  const baseClass = "overflow-y-auto pr-3 mt-7";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAspect, setSelectedAspect] = useState("all");

  const orientationSelectOptions = [
    { value: "all", text: "Все форматы" },
    ...Object.entries(orientationOptions).map(([key, { label }]) => ({
      value: key,
      text: `Формат (${label})`,
    })),
  ];

  // для templates — отфильтрованные группы
  const filteredGroups = groups
    .map((group) => {
      const qry = searchQuery.toLowerCase().trim();
      const itemsArray = Array.isArray(group.items) ? group.items : [];
      const items = itemsArray.filter((item) => {
        const inTitle = group.title?.toLowerCase().includes(qry);
        const matchesAspect =
          selectedAspect === "all" || item.aspect === selectedAspect;
        return inTitle && matchesAspect;
      });
      return { ...group, items };
    })
    .filter((group) => Array.isArray(group.items) && group.items.length > 0);

  const groupsToRender = activeFolder === "templates" ? filteredGroups : groups;

  const activeMeta = folders.find((f) => f.key === activeFolder);

  return (
    <>
      <FolderTabs
        tabs={folders}
        activeKey={activeFolder}
        onChange={onFolderChange}
        onAdd={onAddFolder}
      />

      {/* если папка не заблокирована — показываем её шапку с кнопками */}
      {!activeMeta?.locked && (
        <div className="mt-7 flex items-center justify-end">
          <div className="flex h-10 items-center gap-7 rounded-xl bg-dark-graphite px-3 py-2">
            <button
              className="flex items-center gap-2 rounded p-1 hover:text-main-accent"
              onClick={() => onEditFolder(activeMeta.key, activeMeta.label)}
            >
              <IconEdit />
              Переименовать
            </button>
            <button
              className="flex items-center gap-2 rounded p-1 hover:text-main-accent"
              onClick={() => onDeleteFolder(activeMeta.key)}
            >
              <IconTrash className="size-8" />
              Удалить
            </button>
          </div>
        </div>
      )}

      {activeFolder == "default" && (
        <div className={`flex flex-col ${baseClass} space-y-5`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light">Готовые шаблоны</h2>
            <button
              onClick={() => onFolderChange("templates")}
              className="flex h-8 items-center gap-2 rounded-lg bg-main-accent pl-4 pr-3 text-sm font-normal text-dark-coal"
            >
              Посмотреть все шаблоны <FaArrowRight size={24} />
            </button>
          </div>
          {groupsToRender.map((group, gi) => (
            <CoverGroup
              key={gi}
              title={group.title}
              items={group.items}
              onDrag={group.onDrag}
              onRegen={group.onRegen}
              onDeleteGroup={() => onDeleteGroup(gi)}
              onEditCard={onEditCard}
              hideButtons={true}
              hideTitles={true}
            />
          ))}
        </div>
      )}
      {activeFolder === "templates" && (
        <div className={`flex flex-grow flex-col ${baseClass} space-y-4`}>
          {/* Поиск */}
          <div className="flex gap-[10px]">
            <div className="flex-grow-0 overflow-hidden rounded-[20px]">
              <StyledSelect
                options={orientationSelectOptions}
                defaultValue="all"
                value={selectedAspect}
                onChange={setSelectedAspect}
              />
            </div>

            <div className="flex h-full flex-shrink-0 flex-grow gap-6 rounded-[20px] bg-dark-graphite px-8 text-xl font-light">
              <input
                name="templateSearchQuery"
                type="text"
                placeholder="Поиск по темам"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xl font-light text-white outline-none placeholder:text-xl placeholder:font-light placeholder:text-supporting"
              />
              <button>
                <SearchNormal />
              </button>
            </div>
          </div>

          {/* Отрендерить только те группы, где остались items */}
          {groupsToRender.map((group, gi) => (
            <CoverGroup
              key={gi}
              title={group.title}
              items={group.items}
              onDrag={group.onDrag}
              onRegen={group.onRegen}
              onDeleteGroup={() => onDeleteGroup(gi)}
              onEditCard={onEditCard}
              hideButtons={true}
              showAllItems={true} // показываем ВСЕ подходящие карточки
            />
          ))}

          {groupsToRender.length === 0 && (
            <div className="mt-10 flex h-full items-center justify-center text-center text-supporting">
              Шаблоны по запросу «{searchQuery}» не найдены.
            </div>
          )}
        </div>
      )}

      {activeFolder !== "default" && activeFolder !== "templates" && (
        <div className={`h-full space-y-10 ${baseClass}`}>
          {groupsToRender.map((group, gi) => (
            <CoverGroup
              key={gi}
              title={group.title}
              items={group.items}
              onDrag={group.onDrag}
              onRegen={group.onRegen}
              onDeleteGroup={() => onDeleteGroup(gi)}
              onEditCard={onEditCard}
            />
          ))}

          {!groupsToRender.length && (
            <>
              <div className="flex h-full w-full flex-col items-center justify-center">
                {activeFolder !== "ai" && (
                  <h3 className="mb-4 text-[28px]">
                    Создайте первые обложки или переместите готовые из папки
                    “Созданы AI”
                  </h3>
                )}
                <div className="mx-auto flex w-full max-w-[625px] flex-col">
                  <h2 className="px-5 text-4xl text-supporting">
                    Обложки, созданные AI
                  </h2>
                  <div className="mt-[62px] flex flex-col">
                    <StepSection icon={lampCharge} number={1}>
                      Напишите промт для генерации изображения
                    </StepSection>
                    <StepDivider />
                    <StepSection icon={penAdd} number={2}>
                      Загрузите референс
                    </StepSection>
                    <StepDivider />
                    <StepSection icon={mouseSquare} number={3}>
                      Выберите нужный формат генерации
                    </StepSection>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LeftPanel;
