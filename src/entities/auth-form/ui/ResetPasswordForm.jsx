import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import DefaultBlock from "../../../shared/ui/default-block/DefaultBlock";
import { useNotification } from "../../../shared/context/NotificationContext";
import Button from "../../../shared/ui/buttons/Button";
import PasswordInput from "../../../shared/ui/Input/PasswordInput";
import { useResetPasswordMutation } from "../../../app/api"; // API-хук

function ResetPasswordForm() {
  // eslint-disable-next-line no-unused-vars
  const { notification, isVisible, showNotification } = useNotification();
  const { t } = useTranslation("translation", {
    keyPrefix: "auth.reset-password",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // useEffect(() => {
  //   if (password !== confirmPassword) {
  //     setError("confirmPassword", {
  //       type: "manual",
  //       message: t("password-mismatch"), // Добавил перевод
  //     });
  //   } else {
  //     clearErrors("confirmPassword");
  //   }
  // }, [password, confirmPassword, setError, clearErrors]);

  const onSubmit = async (data) => {
    if (!token || !email) {
      setError("general", { message: t("invalid-link") });
      return;
    }

    try {
      await resetPassword({
        token,
        email,
        new_password: data.password,
      }).unwrap();

      showNotification(`Пароль успешно изменён`, "", "success");
      navigate("/signin"); // Перенаправление на страницу входа
    } catch (err) {
      showNotification(`Ошибка при смене пароля, попробуйте позже`, "", "error");
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

  const confirmPasswordValidation = {
    required: t("confirm-password-required"),
    validate: (value) => value === password || t("password-mismatch"), // Проверка совпадения паролей
  };

  return (
    <div className="absolute left-1/2 top-1/2 max-w-[526px] -translate-x-1/2 -translate-y-1/2">
      <DefaultBlock>
        <div className="flex flex-col gap-7 px-10 py-11">
          <div>
            <p className="text-2xl text-main-white">{t("title")}</p>
            <p className="mt-3 font-circe-light text-xl text-gray">
              {t("subtitle")}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            <PasswordInput
              placeholder={t("password")}
              register={register("password", passwordValidation)}
            />
            {errors.password && (
              <p className="text-red-700">{errors.password.message}</p>
            )}
            <PasswordInput
              placeholder={t("confirm-password")}
              register={register("confirmPassword", confirmPasswordValidation)}
            />

            {/* Ошибки */}
            {errors.confirmPassword && (
              <span className="text-center text-red-300">
                {errors.confirmPassword.message}
              </span>
            )}
            {error && (
              <span className="text-center text-red-700">
                {t("error-message")}
              </span>
            )}

            <Button
              variant="main-filled"
              className="gap-0 font-circe-regular"
              disabled={isLoading}
            >
              {isLoading ? <div className="size-6 animate-spin rounded-full border-2 border-supporting border-t-transparent" /> : t("reset-password")}
            </Button>
          </form>
        </div>
      </DefaultBlock>
    </div>
  );
}

export default ResetPasswordForm;
