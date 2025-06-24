import CustomTooltip from "../../title/CustomTitle";
import { IconComponent } from "../../icon/Icon";

/**
 * Универсальная иконка-кнопка с тултипом
 * @param {Object} props
 * @param {React.Component} props.icon - Иконка (React-компонент, например Heart, Trash)
 * @param {Function} props.onClick - Callback по клику
 * @param {string} [props.tooltipContent="Button"] - Текст для подсказки
 * @param {string} [props.hoverColor="text-main-accent"] - Цвет при ховере
 */
const CardButton = ({ icon, action, tooltipContent, hoverColor, data }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    action(data);
  };

  return (
    <CustomTooltip tooltipContent={tooltipContent}>
      <IconComponent
        icon={icon}
        variant="Bulk"
        size={20}
        className={`hover:${hoverColor} hidden rounded-md bg-dark-supporting p-1 text-supporting backdrop-blur-md transition-colors duration-500 group-hover:block`}
        onClick={handleClick}
      />
    </CustomTooltip>
  );
};

export default CardButton;
