import { createContext, useContext, useState } from "react";

// Создаём контекст
const NotificationContext = createContext();

// Провайдер контекста
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100); // Прогресс убывания

  // Функция для показа уведомления
  const showNotification = (message, subtext=null, type = "info", duration = 3000) => {
    setNotification({ message, subtext, type });
    setIsVisible(true);
    setProgress(100);

    const intervalTime = 50;
    const decrement = (100 / duration) * intervalTime;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(() => setNotification(null), 500);
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);
  };

  // Функция для закрытия уведомления вручную
  const closeNotification = () => {
    setIsVisible(false);
    setProgress(0);
    setTimeout(() => setNotification(null), 500);
  };

  return (
    <NotificationContext.Provider
      value={{
        notification,
        showNotification,
        isVisible,
        closeNotification,
        progress,
      }} // Передаём progress
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для использования уведомлений
export const useNotification = () => useContext(NotificationContext);
