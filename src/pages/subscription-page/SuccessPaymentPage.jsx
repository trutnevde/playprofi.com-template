import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TickCircle } from "iconsax-react";
import AppButton from "../../shared/ui/buttons/AppButton";
import { useEffect, useState } from "react";

export default function SuccessPaymentPage() {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.subscription",
  });
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/app/subscriptions", { replace: true });
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-white">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-dark-coal p-8">
        <TickCircle variant="Bulk" size="64" className="text-main-accent" />
        <h1 className="text-2xl font-bold">{t("paymentSuccess.title")}</h1>
        <p className="text-center text-supporting">
          {t("paymentSuccess.description")}
        </p>
        <p className="text-center text-supporting">
          {t("paymentSuccess.redirecting", { seconds: countdown })}
        </p>
        <div className="mt-4 flex w-1/2 gap-4">
          <AppButton
            text={t("paymentSuccess.backToSubscriptions")}
            bgColor="dark-graphite"
            action={() => navigate("/app/subscriptions")}
          />
        </div>
      </div>
    </div>
  );
}
