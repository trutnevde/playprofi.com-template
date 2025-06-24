import { useGetSubscriptionCardsQuery, useUpdateCardMutation, useDeleteCardMutation, useSetActiveCardMutation } from "../api/api";
import Modal from "../../../shared/ui/modal/Modal";
import { Skeleton } from "../../../shared/ui/skeleton/Skeleton";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../shared/ui/Input/Input";
import Button from "../../../shared/ui/buttons/Button";
import AppButton from "../../../shared/ui/buttons/AppButton";

export const CardsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.subscription.cards",
  });
  const { data: cards, isLoading } = useGetSubscriptionCardsQuery();
  const [updateCard, { isLoading: isUpdating }] = useUpdateCardMutation();
  const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation();
  const [setActiveCard, { isLoading: isSettingActive }] = useSetActiveCardMutation();
  const [newCard, setNewCard] = useState({
    number: "",
    exp_date: "",
    cvv: ""
  });

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      await updateCard(newCard).unwrap();
      setNewCard({ number: "", exp_date: "", cvv: "" });
      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении карты:", error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId).unwrap();
    } catch (error) {
      console.error("Ошибка при удалении карты:", error);
    }
  };

  const handleSetActiveCard = async (cardId) => {
    try {
      await setActiveCard(cardId).unwrap();
    } catch (error) {
      console.error("Ошибка при выборе карты:", error);
    }
  };

  return (
    <Modal isPopupOpen={isOpen} closePopup={onClose} title={t("title")}>
      <div className="space-y-6">
        {/* Форма добавления новой карты */}
        <form onSubmit={handleAddCard} className="space-y-4 rounded-lg">
          <h3 className="text-lg font-medium">{t("addNewCard")}</h3>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder={t("cardNumber")}
              value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
            />
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder={t("expDate")}
                value={newCard.exp_date}
                onChange={(e) => setNewCard({ ...newCard, exp_date: e.target.value })}
              />
              <Input
                type="text"
                placeholder={t("cvv")}
                value={newCard.cvv}
                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
              />
            </div>
            <Button
              type="submit"
              variant="main-filled"
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? t("adding") : t("addCard")}
            </Button>
          </div>
        </form>

        {/* Список карт */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("myCards")}</h3>
          {isLoading ? (
            // Скелетон загрузки
            <div className="space-y-3">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-dark-graphite p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            // Отображение карт
            <div className="space-y-3">
              {cards?.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-lg bg-dark-graphite p-4"
                >
                  <div className="space-y-1">
                    <p className="text-white">{card.pan}</p>
                    <p className="text-sm text-supporting">
                      {t("expDate")}: {card.exp_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.is_active ? (
                      <span className="rounded-full bg-main-accent px-2 py-1 text-xs text-dark-coal">
                        {t("usedForPayment")}
                      </span>
                    ) : (
                      <>
                        <AppButton
                          text={t("select")}
                          bgColor="dark-supporting"
                          action={() => handleSetActiveCard(card.id)}
                          disabled={isSettingActive}
                        />
                        <AppButton
                          text={t("delete")}
                          bgColor="dark-supporting"
                          action={() => handleDeleteCard(card.id)}
                          disabled={isDeleting}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}; 