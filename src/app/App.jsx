import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Suspense, useState, useEffect, memo } from "react";
import store from "./store.js";
import { Provider } from "react-redux";
import { Navigate } from "react-router-dom";
import { NotificationProvider } from "../shared/context/NotificationContext";
import { TokenProvider } from "../shared/context/TokenContext.jsx";
import { SubscriptionModalProvider } from "../shared/context/SubscriptionModalContext";

import HomePage from "../pages/home-page/HomePage.jsx";
import NotFoundPage from "../pages/not-found-page/NotFoundPage.jsx";

import PrivateRoute from "./PrivateRoute.jsx";

import "./App.css";
import withAuthPage from "../pages/auth-page/AuthPage.jsx";
import LoginForm from "../entities/auth-form/ui/LoginForm.jsx";
import RegistrationForm from "../entities/auth-form/ui/RegistrationForm.jsx";
import ForgetPasswordForm from "../entities/auth-form/ui/ForgetPasswordForm.jsx";
import ResetPasswordForm from "../entities/auth-form/ui/ResetPasswordForm.jsx";
import Layout from "../shared/ui/layout/Layout.jsx";
import logo_pp from "../shared/assets/svg/pp.svg";
import SvgIcon from "../shared/ui/icon/SvgIcon.jsx";
import PreviewGeneratorPage from "../pages/preview-generator/PreviewGeneratorPage.jsx";

const Login = withAuthPage(LoginForm);
const Registration = withAuthPage(RegistrationForm);
const ForgetPassword = withAuthPage(ForgetPasswordForm);
const ResetPassword = withAuthPage(ResetPasswordForm);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
};

const MobilePlaceholder = () => (
  <div className="flex h-screen flex-col items-center justify-center bg-main-dark bg-mobile-plug-bg bg-cover bg-center bg-no-repeat text-center text-xl text-white">
    <div className="mb-10 flex cursor-pointer items-center">
      <img src={logo_pp} className="w-8" alt="logo" />
      <h1 className="ml-5 text-[20px] text-white transition-opacity duration-300">
        PlayProfi
      </h1>
    </div>
    <div className="mx-16 flex flex-col gap-5">
      <div className="rounded-2xl bg-dark-supporting p-10">
        <p className="text-left text-[16px]">Desktop Access Only</p>
        <p className="text-left text-[14px] leading-5 text-supporting">
          Our platform is designed for a seamples and efficient experience on
          personal computers. It leverages capabilities available exclusively on
          these devices. For full access to all features and stable perfomance,
          we recommend using a desktop or laptop computer.
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-dark-supporting p-5">
        <div className="flex size-14 items-center justify-center rounded-xl bg-dark-coal p-3 shadow-inner shadow-lights">
          <SvgIcon
            name="heart"
            size={26}
            className="cursor-pointer text-main-accent transition-colors duration-300"
          />
        </div>
        <p className="text-left text-[14px] leading-5 text-supporting">
          Discover all our platform has to offer and start creating your best
          content!
        </p>
      </div>
    </div>
  </div>
);

const MemoizedLayout = memo(Layout);

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Registration />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/app",
    element: <PrivateRoute />,
    children: [
      {
        element: <MemoizedLayout />,
        children: [
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
          {
            path: "preview-generator",
            element: <PreviewGeneratorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  const isMobile = useIsMobile(); // ✅ Проверяем, мобильный ли экран

  if (isMobile) {
    return <MobilePlaceholder />; // 🚀 Показываем заглушку
  }

  return (
    <Suspense>
      <Provider store={store}>
        <NotificationProvider>
          <SubscriptionModalProvider>
            <TokenProvider>
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center bg-main-dark" />
                }
              >
                <RouterProvider router={router} />
              </Suspense>
            </TokenProvider>
          </SubscriptionModalProvider>
        </NotificationProvider>
      </Provider>
    </Suspense>
  );
}

export default App;
