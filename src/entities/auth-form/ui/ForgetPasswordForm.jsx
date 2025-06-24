import DefaultBlock from "../../../shared/ui/default-block/DefaultBlock";
import { useNotification } from "../../../shared/context/NotificationContext";
import Input from "../../../shared/ui/Input/Input";
import { useForm } from "react-hook-form";
import Button from "../../../shared/ui/buttons/Button";
import { useTranslation } from "react-i18next";
import { useForgotPasswordMutation } from "../../../app/api";
import { useNavigate } from "react-router-dom";

const ForgetPasswordForm = () => {
  // eslint-disable-next-line no-unused-vars
  const { notification, isVisible, showNotification } = useNotification();
  const { t } = useTranslation("translation", {
    keyPrefix: "auth.forgot-password",
  });

  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      // showNotification(`Функция временно не доступна`, "", "error");
      showNotification(`Ссылка для восстановления отправлена на почту`, "info", "info");
    } catch (err) {
      console.error("Ошибка:", err);
      showNotification(`Запрашиваемый email не найден`, "error", "error");
    }
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

          {/* Форма */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            <Input
              placeholder={t("email")}
              register={register("email", {
                required: t("email-required"), // Обязательное поле
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("email-invalid"), // Неверный email
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600">Некорректный формат email</p>
            )}

            <Button
              variant="main-filled"
              className="gap-0"
              disabled={isLoading}
            >
              {isLoading ? <div className="size-7 animate-spin rounded-full border-2 border-main-accent border-t-transparent" /> : t("rest-link")}
            </Button>
          </form>

          {/* Кнопка "Назад к входу" */}
          <Button
            variant="secondary"
            textColor="text-gray"
            className="text-sm underline decoration-1"
            onClick={() => navigate("/signin")}
          >
            {t("back-to-login")}
          </Button>
        </div>
      </DefaultBlock>
    </div>
  );
};

export default ForgetPasswordForm;
