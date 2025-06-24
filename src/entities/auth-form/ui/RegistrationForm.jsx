import { useState } from "react";

import DefaultBlock from "../../../shared/ui/default-block/DefaultBlock";
import Input from "../../../shared/ui/Input/Input";
import Button from "../../../shared/ui/buttons/Button";
import PasswordInput from "../../../shared/ui/Input/PasswordInput";

import { FcGoogle } from "react-icons/fc";
import { TbBrandYoutubeFilled, TbChartPieFilled } from "react-icons/tb";
import { BiSolidCoinStack } from "react-icons/bi";
import { HiPencilAlt } from "react-icons/hi";

import { useForm } from "react-hook-form";
import { useNotification } from "../../../shared/context/NotificationContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../../app/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../model/authSlice";

import play_profi from "../../../shared/assets/video/PlayProfi.mp4";

function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { notification, isVisible, showNotification } = useNotification();
  const [signup, { isLoading }] = useSignupMutation();

  const { t } = useTranslation("translation", {
    keyPrefix: "auth",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);
  const password = watch("password");

  const emailValidation = {
    required: t("email-required"),
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: t("email-invalid"),
    },
  };
  const validatePasswords = (e) => {
    setIsPasswordMatching(password === e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      const response = await signup(data).unwrap();
      if (response) {
        const { id, is_admin, token, user } = response;
        const body = {
          user: user,
          userId: id,
          token: token,
          isAuthenticated: true,
          isAdmin: is_admin,
          loading: false,
        };

        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(body));

        dispatch(loginSuccess(body));
        showNotification(`Успешная регистрация`, "Добро пожаловать", "success");
        navigate("/app/home");
      }
    } catch (err) {
      console.log(err);
      if (err.status == 400) {
        showNotification(
          `Пользователь с таким email уже существует`,
          "",
          "error",
        );
      } else {
        showNotification(
          `Ошибка при регистрации, попробуйте позже`,
          "",
          "error",
        );
      }
    }
  };

  const passwordValidation = {
    required: t("password-required"),
    minLength: {
      value: 8,
      message: t("password-min-length"), // Минимум 8 символов
    },
    pattern: {
      value: /^(?=.*\d).{8,}$/, // Регулярное выражение: минимум 8 символов и хотя бы 1 цифра
      message: t("password-must-contain-digit"), // Ошибка, если нет цифры
    },
  };

  const handleLoginNavigate = (e) => {
    e.preventDefault();
    navigate("/signin");
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();

    const clientId =
      "751121048177-6uih11ud7e4ces1pbsb1p3rlup19p57a.apps.googleusercontent.com"; // Замените на ваш CLIENT_ID
    const redirectUri = "https://api.playprofi.com/users/google-login"; // Замените на ваш редирект-URI
    const scope = "openid email profile";
    const responseType = "code";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div className="grid size-full grid-cols-5 gap-5">
      <DefaultBlock className="col-span-3 row-span-3">
        <div className="flex flex-col gap-7 px-10 py-11">
          <Button
            onClick={handleGoogleLogin}
            variant="main-filled"
            bgColor="bg-dark-graphite"
            textColor="text-supporting"
          >
            <FcGoogle size={28} className="mr-2" />{" "}
            {t("buttons.google-sign-up")}
          </Button>
          <div className="flex items-center gap-5 text-main-white">
            <div className="h-px flex-1 bg-gray" />
            {t("or").toUpperCase()}
            <div className="h-px flex-1 bg-gray" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            {/* <Input register={register("name")} placeholder={t("name")} /> */}
            <Input
              register={register("email", emailValidation)}
              placeholder={t("email")}
            />
            {errors.email && (
              <p className="text-red-700">{t("email-invalid")}</p>
            )}
            <PasswordInput
              register={register("password", passwordValidation)}
              placeholder={t("password")}
              type="password"
            />
            {errors.password && (
              <p className="text-red-700">{errors.password.message}</p>
            )}
            <PasswordInput
              register={register("confirmPassword")}
              placeholder={t("confirmPassword")}
              type="password"
              onChange={validatePasswords}
              onPaste={(e) => e.preventDefault()}
            />
            {!isPasswordMatching && (
              <p className="text-red-700">{t("notConfirmPassword")}</p>
            )}
            <Button
              variant="main-filled"
              className="h-[60px] gap-0 disabled:cursor-not-allowed"
              disabled={!isPasswordMatching}
            >
              {isLoading ? (
                <div className="size-5 animate-spin rounded-full border-2 border-main-accent border-t-transparent" />
              ) : (
                <>
                  {t("buttons.become-profi")}
                  <span className="ml-1 p-0 font-bold">Profi!</span>
                </>
              )}
            </Button>
          </form>
          <div className="flex flex-col items-center justify-center text-center text-gray">
            {/*TODO: Как появятся документы сделать тут ссылку наа них */}
            <p className="font-circe-light text-sm">{t("documents")}</p>
            <div className="mt-8 flex flex-col">
              <p className="font-circe-regular">{t("have-account")}</p>
              <Button
                variant="secondary"
                textColor="text-main-accent"
                onClick={handleLoginNavigate}
              >
                {t("buttons.login")}
              </Button>
            </div>
          </div>
        </div>
      </DefaultBlock>
      <DefaultBlock className="col-span-2 row-span-1 flex items-center">
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
      <DefaultBlock className="col-span-2 row-span-2 flex items-center justify-center">
        <div className="flex flex-col gap-7 px-5 py-11 font-circe-light text-xl text-gray">
          <div className="flex items-start gap-4 text-start">
            <div>
              <TbBrandYoutubeFilled size={27} />
            </div>
            <p>{t("youtube-text")}</p>
          </div>
          <div className="flex items-start gap-4 text-start">
            <div>
              <HiPencilAlt size={27} />
            </div>
            <p>{t("pencil-text")}</p>
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

export default RegistrationForm;
