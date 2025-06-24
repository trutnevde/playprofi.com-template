import classNames from "classnames";
import { useSubscriptionModal } from "../../context/SubscriptionModalContext";
import { useNavigate } from "react-router-dom";

const MenuItem = ({
  name,
  icon: Icon,
  notification,
  subtext,
  isCollapsed,
  link,
  isActive,
  available = true,
}) => {
  const { openModal } = useSubscriptionModal();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!available) {
      e.preventDefault(); // отмена перехода
      openModal(); // открыть модалку
    } else if (
      e.button === 0 && // левая кнопка
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault(); // переходим через SPA
      navigate(link);
    }
    // иначе — пусть работает как обычная ссылка (например, Ctrl+Click или ПКМ)
  };

  return (
    <li
      className={classNames(
        "hover:bg-gray-700 group w-full transition-all duration-300",
        {
          "text-main-accent": isActive,
          "text-white": !isActive,
        }
      )}
    >
      <a
        href={link}
        onClick={handleClick}
        onAuxClick={handleClick} // для Ctrl+Click и средней кнопки
        className={classNames("ml-1 flex items-center justify-start p-2", {
          "flex-col": isCollapsed,
        })}
        target="_self" // позволяет при Ctrl+Click — открыть в новой вкладке
        rel="noopener noreferrer"
      >
        {/* Иконка */}
        <div className="flex items-center justify-center rounded-lg bg-dark-coal p-3 transition-colors duration-300 group-hover:text-[#29E4DE]">
          <Icon size={24} variant="Bulk" />
        </div>

        {/* Контейнер для текста */}
        {isCollapsed ? (
          <span className="mt-1 text-center text-[12px] transition-opacity duration-300">
            {name}
          </span>
        ) : (
          <div
            className={classNames(
              "ml-4 flex w-full items-center justify-between overflow-hidden transition-all duration-300",
              {
                "pointer-events-none max-w-0": isCollapsed,
                "pointer-events-auto max-w-xs": !isCollapsed,
              }
            )}
          >
            <div
              className={classNames(
                "transition-opacity duration-300",
                isCollapsed ? "opacity-0 delay-0" : "opacity-100 delay-300"
              )}
            >
              <span className="text-[16px] duration-300 group-hover:text-[#29E4DE]">
                {name}
              </span>
              {subtext && (
                <span className="block text-[12px] duration-300 group-hover:text-[#29E4DE]">
                  {subtext}
                </span>
              )}
            </div>

            {!!notification && (
              <div
                className={classNames(
                  "mr-2 transition-opacity duration-300",
                  isCollapsed ? "opacity-0 delay-0" : "opacity-100 delay-300"
                )}
              >
                <span className="rounded-md bg-[#371716] px-2 py-1 text-xs text-red-500">
                  {notification}
                </span>
              </div>
            )}
          </div>
        )}
      </a>
    </li>
  );
};

export default MenuItem;
