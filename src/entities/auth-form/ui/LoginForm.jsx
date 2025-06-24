import { useForm } from "react-hook-form";

import Button from "../../../shared/ui/buttons/Button";
import Checkbox from "../../../shared/ui/checkbox/Checkbox";
import Input from "../../../shared/ui/Input/Input";
import DefaultBlock from "../../../shared/ui/default-block/DefaultBlock";

import { FcGoogle } from "react-icons/fc";
import { useNotification } from "../../../shared/context/NotificationContext";
import { TbBrandYoutubeFilled, TbChartPieFilled } from "react-icons/tb";
import { BiSolidCoinStack } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../../shared/ui/Input/PasswordInput";
import { useLoginMutation } from "../../../app/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../model/authSlice";
import { useEffect } from "react";
import play_profi from "../../../shared/assets/video/PlayProfi.mp4";

function LoginForm() {
  const { notification, isVisible, showNotification } = useNotification();
  const navigate = useNavigate();
  const [onLogin] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.isAuthenticated && !storedUser?.isGuest) {
      navigate("/app/home");
    }
  }, [navigate]);

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const name = urlParams.get("name");
  
  if (token) {
    const body = {
      user: name,
      token: token,
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
    };

    localStorage.setItem("user", JSON.stringify(body));
    dispatch(loginSuccess(body));
    showNotification(`Успешная авторизация`, "Добро пожаловать", "success");
    navigate("/app/home");
  }

  const { t } = useTranslation("translation", {
    keyPrefix: "auth",
  });

  const { control, register, handleSubmit } = useForm({
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data) => {
    const result = await onLogin({
      email: data.username,
      password: data.password,
    });
    
    if (result?.error) {
      showNotification(
        `Не верный логин или пароль`,
        "Проверьте правильность введённых данных",
        "error",
      );
      return;
    }
    
    if (result?.data) {
      const { id, is_admin, token, user } = result.data;
      const body = {
        user: user,
        userId: id,
        token: token,
        isAuthenticated: true,
        isAdmin: is_admin,
        loading: false,
      };

      localStorage.setItem("user", JSON.stringify(body));
      dispatch(loginSuccess(body));
      showNotification(`Успешная авторизация`, "Добро пожаловать", "success");
      navigate("/app/home");
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleForgetPassword = (e) => {
    e.preventDefault();
    navigate("/forget-password");
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();

    const clientId =
      "751121048177-6uih11ud7e4ces1pbsb1p3rlup19p57a.apps.googleusercontent.com";

    const currentDomain = window.location.hostname;
    const redirectUri =
      currentDomain === "playprofi.ru"
        ? "https://api.playprofi.com/users/google-login-ru"
        : "https://api.playprofi.com/users/google-login-com";

    const scope = "openid email profile";
    const responseType = "code";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div className="grid size-full grid-cols-7 gap-5">
      <DefaultBlock className="col-span-4 row-span-3">
        <div className="flex flex-col gap-7 px-10 py-11">
          <Button
            onClick={handleGoogleLogin}
            variant="main-filled"
            bgColor="bg-dark-graphite"
            textColor="text-supporting"
          >
            <FcGoogle size={28} className="mr-2" /> {t("buttons.google-login")}
          </Button>
          <div className="flex h-11 items-center gap-5 text-main-white">
            <div className="h-px flex-1 bg-dark-graphite" />
            {t("or").toUpperCase()}
            <div className="h-px flex-1 bg-dark-graphite" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            <Input
              register={register("username")}
              placeholder={`${t("email")} ${t("or")} ${t("username")}`}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(onSubmit)()}
            />
            <PasswordInput
              register={register("password")}
              placeholder={t("password")}
              type="password"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(onSubmit)()}
            />
            <div className="flex justify-between">
              <Checkbox
                control={control}
                name="rememberMe"
                label={t("remember-me")}
              />
              <Button
                variant="secondary"
                textColor="text-main-accent"
                onClick={handleForgetPassword}
                type="button"
              >
                {t("buttons.forget-password")}
              </Button>
            </div>
            <div className="flex gap-7">
              <Button variant="main-filled" type="submit">
                {t("buttons.login")}
              </Button>
              <Button
                variant="main-filled"
                bgColor="bg-dark-graphite"
                textColor="text-white"
                onClick={handleCreateAccount}
                type="button"
              >
                {t("buttons.create-account")}
              </Button>
            </div>
          </form>
        </div>
      </DefaultBlock>
      <DefaultBlock className="col-span-3 row-span-1">
        <video
          src={play_profi}
          autoPlay
          muted
          playsInline
          loop
          className="rounded-3xl p-2"
        >
          <a src="https://www.youtube.com/watch?v=XRfgS6LIMdU">MP4</a>
          video.
        </video>
      </DefaultBlock>
      <DefaultBlock className="col-span-3 row-span-2">
        <div className="flex flex-col gap-7 px-5 py-11 font-circe-light text-xl text-gray">
          <div className="flex items-start gap-4 text-start">
            <div>
              <TbBrandYoutubeFilled size={27} />
            </div>
            <p>{t("youtube-text")}</p>
          </div>
          <div className="flex items-start gap-4 text-start">
            <div>
              <TbChartPieFilled size={27} />
            </div>
            <p>{t("chart-text")}</p>
          </div>
          <div className="flex items-start gap-4 text-start">
            <div>
              <BiSolidCoinStack size={27} />
            </div>
            <p>{t("coins-text")}</p>
          </div>
        </div>
      </DefaultBlock>
    </div>
  );
}

export default LoginForm;
