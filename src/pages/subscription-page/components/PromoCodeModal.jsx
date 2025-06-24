import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/ui/modal/Modal";
import Input from "../../../shared/ui/Input/Input";
import Button from "../../../shared/ui/buttons/Button";
import AppButton from "../../../shared/ui/buttons/AppButton";

export default function PromoCodeModal({ isOpen, onClose, onApply, onSkip }) {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.subscription",
  });
  const [promoCode, setPromoCode] = useState("");

  return (
    <Modal isPopupOpen={isOpen} closePopup={onClose} title={t("title")}>
      <p className="mb-4 text-sm text-supporting">
        {t("promoCodeDescription")}
      </p>

      <Input
        type="text"
        placeholder={t("promoCodePlaceholder")}
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />
      <p className="my-4 text-xs text-supporting">
        {t("byClickingButton")}{" "}
        <a
          href="/app/subscriptions/agreement"
          target="_blank"
          rel="noopener noreferrer"
          className="text-main-accent hover:underline"
        >
          {t("termsOfService")}
        </a>
      </p>
      <div className="flex gap-3">
        <Button
          variant="main-filled"
          type="button"
          onClick={() => onApply(promoCode)}
          disabled={promoCode.length === 0}
        >
          {t("applyPromoCode")}
        </Button>
        <AppButton
          text={t("noPromoCode")}
          bgColor="dark-supporting"
          action={onSkip}
        />
      </div>
    </Modal>
  );
}
