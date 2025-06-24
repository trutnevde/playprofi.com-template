import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CloseCircle } from "iconsax-react";
import AppButton from "../../shared/ui/buttons/AppButton";

export default function FailedPaymentPage() {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.subscription",
  });
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-white">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-dark-coal p-8">
        <CloseCircle
          variant="Bulk"
          size="64"
          className="text-red-700"
        />
        <h1 className="text-2xl font-bold">{t("paymentFailed.title")}</h1>
        <p className="text-center text-supporting">
          {t("paymentFailed.description")}
        </p>
        <div className="mt-4 flex gap-4 w-full">
          <AppButton
            text={t("paymentFailed.tryAgain")}
            bgColor="dark-graphite"
            action={() => navigate("/app/subscriptions")}
          />
          <AppButton
            text={t("paymentFailed.contactSupport")}
            bgColor="dark-graphite"
            action={() => navigate("/app/support")}
          />
        </div>
      </div>
    </div>
  );
} 