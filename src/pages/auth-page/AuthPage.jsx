import { useNotification } from "../../shared/context/NotificationContext"; 
import LanguageSwitcher from "../../shared/ui/layout/utils/LanguageSwitcher";

const withAuthPage = (WrappedComponent) => {
  return function AuthPageHOC(props) {
    const { notification, isVisible, progress } = useNotification();
    return (
      <div className="relative h-screen bg-dark-coal">
        <div className="absolute size-full bg-login opacity-60 blur-xl" />
        {/* Уведомление */}
        {notification && (
          <div
            className={`fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center justify-between space-x-5 rounded-xl bg-dark-coal px-5 py-3 shadow-md transition-all duration-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-5 opacity-0"
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
              <span className="font-normal text-white">{notification.message}</span>
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
        <div className="absolute right-10 top-10 z-40">
          <LanguageSwitcher />
        </div>
        <div className="absolute left-1/2 top-1/2 z-40 w-[1000px] -translate-x-1/2 -translate-y-1/2">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default withAuthPage;
