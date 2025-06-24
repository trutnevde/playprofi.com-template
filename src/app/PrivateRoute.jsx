import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Если пользователь не авторизован, перенаправляем на главную
  if (!user?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Если пользователь гость и пытается зайти на страницу подписок
  if (user?.isGuest && window.location.pathname === "/app/subscriptions") {
    return <Navigate to="/signin" replace />;
  }

  // В остальных случаях разрешаем доступ
  return <Outlet />;
};

export default PrivateRoute;
