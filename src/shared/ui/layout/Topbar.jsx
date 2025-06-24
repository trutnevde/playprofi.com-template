// src/components/Topbar.js
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import FavoriteModal from "../modal/FavoriteModal";
import SubscriptionModal from "../modal/SubscriptionModal";
import LanguageSwitcher from "./utils/LanguageSwitcher";
import { useSubscriptionModal } from "../../context/SubscriptionModalContext";

import SvgIcon from "../icon/SvgIcon";
// import HeartIcon from "../../assets/icons/heart.svg";

const Topbar = ({ t, menuSections, tokens }) => {
  const location = useLocation();

  const { notification, isVisible, progress } = useNotification();
  const { openModal } = useSubscriptionModal();

  // Состояние для модалки избранного
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Открыть/Закрыть окно избранного
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Получаем название страницы из URL
  const pageName = (() => {
    const currentPath = location.pathname;
    
    // Ищем подходящий раздел меню
    for (const section of menuSections) {
      for (const item of section.items) {
        // Проверяем основной пункт меню
        if (currentPath.startsWith(item.link)) {
          return item.name;
        }
        
        // Проверяем подпункты меню
        if (item.sub && currentPath.startsWith(item.sub.link)) {
          return item.sub.name;
        }
      }
    }
    
    return "Home";
  })();

  return (
    <div className="relative mx-7 mt-7 flex items-center justify-between text-white">
      <p className="ml-5 text-xl">{pageName}</p>

      {/* Уведомление */}
      {notification && (
        <div
          className={`fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center justify-between space-x-5 rounded-xl bg-dark-coal px-5 py-3 shadow-md transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}
        >
          {/* SVG с кругом и галочкой */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 42 42"
            className="flex items-center justify-center"
          >
            {/* Фоновый круг (прозрачный) */}
            <circle cx="21" cy="21" r="17" fill="transparent" />

            {/* Внешний круг (изначальный цвет) */}
            <circle
              cx="21"
              cy="21"
              r="17"
              fill="none"
              stroke={notification.type === "error" ? "#371716" : "#007B75"}
              strokeWidth="2"
            />

            {/* Заполняющийся круг */}
            <circle
              cx="21"
              cy="21"
              r="17"
              fill="none"
              stroke={notification.type === "error" ? "#FF3B30" : "#29e4de"}
              strokeWidth="2"
              strokeDasharray="108" // Полный периметр круга
              strokeDashoffset={progress}
              strokeLinecap="butt"
              className="transition-all duration-75"
            />

            {notification.type !== "error" ? (
              <path
                d="M13 21l5 5 9-9"
                fill="none"
                stroke="#29e4de"
                strokeWidth="2"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            ) : (
              /* Крестик (ошибка) */
              <path
                d="M16 16 L26 26 M16 26 L26 16"
                fill="none"
                stroke="#FF3B30"
                strokeWidth="2"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            )}
          </svg>

          {/* Текст уведомления */}
          <p className="min-w-[350px] text-[14px]">
            <span className="font-normal">{notification.message}</span>
            <br />
            <span className="font-light text-supporting">
              {notification.subtext}
            </span>
          </p>

          {/* Кнопка View */}
          {/* <div className="rounded-xl bg-main-dark px-5 py-2 text-main-accent">
            View
          </div> */}
        </div>
      )}

      {/* Модальное окно избранного */}
      <FavoriteModal isPopupOpen={isPopupOpen} closePopup={closePopup} />

      {/* Модальное окно подписки */}
      <SubscriptionModal />

      <div className="mr-3 mt-3 flex items-center space-x-7">
        <p
          className={`cursor-pointer rounded-md bg-dark-coal px-4 py-1 text-[16px] text-main-accent ${
            tokens === 0 ? "animate-pulse" : ""
          }`}
          onClick={openModal}
        >
          {tokens} {t("tokens")}
        </p>

        <SvgIcon
          name="heart"
          size={26}
          className="cursor-pointer text-gray transition-colors duration-300 hover:text-main-accent"
          onClick={openPopup}
        />

        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Topbar;
