// eslint-disable-next-line no-unused-vars
import { ArrowDown2, TickCircle, CloseCircle } from "iconsax-react";
import AppButton from "../../shared/ui/buttons/AppButton";
import Button from "../../shared/ui/buttons/Button";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../shared/context/NotificationContext";
import {
  useCreateTinkoffLinkMutation,
  useGetSubscriptionDetailsQuery,
  useChangeSubscriptionMutation,
  useRenewSubscriptionMutation,
  useRestoreSubscriptionMutation,
  useApplyPromoCodeMutation,
} from "./api/api";
import { SubscriptionSkeleton } from "./components/SubscriptionSkeleton";
import { CardsModal } from "./components/CardsModal";
import PromoCodeModal from "./components/PromoCodeModal";
import { decodeData } from "./helpers/helper";

export default function SubscriptionPlan() {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.subscription",
  });
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.isAuthenticated || user?.isGuest) {
      showNotification(
        t("notifications.authRequired"),
        t("notifications.pleaseLogin"),
        "error"
      );
      navigate("/signin");
    }
  }, [navigate, showNotification, t]);

  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    useGetSubscriptionDetailsQuery();
  const decodedData = decodeData(subscriptionData, t);
  const [billingPeriod, setBillingPeriod] = useState("month");
  const [userSelectedPeriod, setUserSelectedPeriod] = useState(false);

  useEffect(() => {
    if (!userSelectedPeriod && decodedData?.current_plan?.period) {
      setBillingPeriod(decodedData.current_plan.period);
    }
  }, [decodedData, userSelectedPeriod]);

  // const [expandedPlans, setExpandedPlans] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [nextPlan, setNextPlan] = useState(null);
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCardsModalOpen, setIsCardsModalOpen] = useState(false);

  const [changeSubscription] = useChangeSubscriptionMutation();
  const [createTinkoffLink, { isLoading: isCreatingLink }] =
    useCreateTinkoffLinkMutation();
  const [renewSubscription] = useRenewSubscriptionMutation();
  const [restoreSubscription] = useRestoreSubscriptionMutation();
  const [applyPromoCode] = useApplyPromoCodeMutation();

  // const handlePlanToggle = () => {
  //   setExpandedPlans(!expandedPlans);
  // };

  const handleBillingPeriodChange = (period) => {
    if (period !== billingPeriod) {
      setBillingPeriod(period);
      setUserSelectedPeriod(true);
    }
  };

  const handleUpgradePlan = async (subscription_type) => {
    const planData = decodedData?.available_plans?.find((p) => p.type === subscription_type);
    
    // Если план неактивен, показываем уведомление
    if (!planData?.active) {
      showNotification(
        t("notifications.planNotAvailable"),
        t("notifications.planComingSoon"),
        "error"
      );
      return;
    }

    setSelectedPlan(subscription_type);

    if (!decodedData?.current_plan?.type) {
      setIsPromoCodeModalOpen(true);
    } else {
      const isPlayprofiCom = window.location.hostname === "playprofi.com";
      const paymentResponse = await createTinkoffLink({
        subscription_type,
        period: billingPeriod,
        payment_provider: isPlayprofiCom ? "stripe" : "tinkoff",
      }).unwrap();

      if (paymentResponse?.payment_url) {
        window.location.href = paymentResponse.payment_url;
      }
      if (paymentResponse?.success === true) {
        showNotification(
          t("notifications.changeSuccess"),
          t("notifications.pageWillReload"),
          "success",
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    }
  };

  const handleRenewSubscription = async () => {
    try {
      const response = await renewSubscription().unwrap();

      if (response?.status === "success") {
        showNotification(
          t("notifications.renewSuccess"),
          t("notifications.pageWillReload"),
          "success",
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Ошибка при обновлении подписки:", error);
      showNotification(
        t("notifications.renewError"),
        t("notifications.tryAgain"),
        "error",
      );
    }
  };

  const handleRestoreSubscription = async () => {
    try {
      await restoreSubscription().unwrap();
      showNotification(
        t("notifications.restoreSuccess"),
        t("notifications.pageWillReload"),
        "success",
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Ошибка при возобновлении подписки:", error);
      showNotification(
        t("notifications.restoreError"),
        t("notifications.tryAgain"),
        "error",
      );
    }
  };

  const handlePromoCodeApply = async (promoCode) => {
    try {
      if (!promoCode || !selectedPlan || !billingPeriod) {
        showNotification(
          t("notifications.promoError"),
          t("notifications.tryAgain"),
          "error",
        );
        return;
      }
      let response;
      try {
        response = await applyPromoCode({
          code: promoCode,
          subscription_type: selectedPlan,
          period: billingPeriod,
        }).unwrap();
      } catch (error) {
        if (error.status === 400) {
          showNotification(
            t("notifications.promoErrorUsed"),
            t("notifications.tryAgainAnotherCode"),
            "error",
          );
          return;
        } else {
          showNotification(
            t("notifications.promoError"),
            t("notifications.tryAgain"),
            "error",
          );
          return;
        }
      }
      if (response?.subscription) {
        setIsPromoCodeModalOpen(false);
        showNotification(
          t("notifications.changeSuccess"),
          t("notifications.pageWillReload"),
          "success",
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (response.success) {
        showNotification(
          t("notifications.promoApplied"),
          t("notifications.redirectingToPayment"),
          "success",
        );
        setIsPromoCodeModalOpen(false);
        const isPlayprofiCom = window.location.hostname === "playprofi.com";
        const paymentResponse = await createTinkoffLink({
          subscription_type: selectedPlan,
          period: billingPeriod,
          payment_provider: isPlayprofiCom ? "stripe" : "tinkoff",
          promo_code_id: response.promo_code_id,
        }).unwrap();

        if (paymentResponse?.payment_url) {
          window.location.href = paymentResponse.payment_url;
        }
      }
    } catch {
      showNotification(
        t("notifications.promoError"),
        t("notifications.tryAgain"),
        "error",
      );
    } finally {
      setIsPromoCodeModalOpen(false);
    }
  };

  const handlePromoCodeSkip = async () => {
    if (!selectedPlan || !billingPeriod) {
      showNotification(
        t("notifications.promoError"),
        t("notifications.tryAgain"),
        "error",
      );
      return;
    }
    const isPlayprofiCom = window.location.hostname === "playprofi.com";
    const paymentResponse = await createTinkoffLink({
      subscription_type: selectedPlan,
      period: billingPeriod,
      payment_provider: isPlayprofiCom ? "stripe" : "tinkoff",
    }).unwrap();

    if (paymentResponse?.payment_url) {
      window.location.href = paymentResponse.payment_url;
    }
    if (paymentResponse?.success === true) {
      setIsPromoCodeModalOpen(false);
      showNotification(
        t("notifications.changeSuccess"),
        t("notifications.pageWillReload"),
        "success",
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const renderPlanFeatures = (plan) => {
    const planData = decodedData?.available_plans?.find((p) => p.type === plan);
    if (!planData) return null;

    return planData.features.map((feature, index) => (
      <div key={index} className="flex items-start gap-2">
        {feature.available ? (
          <TickCircle
            variant="Bulk"
            size="20"
            className="mt-0.5 shrink-0 text-main-accent"
          />
        ) : (
          <CloseCircle
            variant="Bulk"
            size="20"
            className="mt-0.5 shrink-0 text-red-700"
          />
        )}
        <span
          className={`text-sm ${!feature.available ? "text-supporting line-through" : ""}`}
        >
          {feature.text}
        </span>
      </div>
    ));
  };

  const getPlanPrice = (plan) => {
    // Для доступных планов используем prices
    const planData = decodedData?.available_plans?.find((p) => p.type === plan);
    if (!planData) return t("free");
    // Если план неактивен, возвращаем прочерк
    if (!planData.active) return "-";

    const price = planData.prices[billingPeriod];
    const monthlyPrice = planData.prices.month;
    const yearlyPrice = planData.prices.year;

    if (billingPeriod === "year") {
      if (yearlyPrice === 0) {
        return t("free");
      }
      return (
        <div className="flex items-baseline space-x-2">
          <span className="ml-2 text-3xl text-supporting line-through">
            ₽{monthlyPrice}
          </span>
          <span className="text-3xl text-main-accent">₽{yearlyPrice}</span>
        </div>
      );
    }

    return price === 0 ? t("free") : `₽${price}`;
  };

  const getYearlyTotal = (plan) => {
    // Проверяем, является ли план текущей или следующей подпиской
    if (decodedData?.current_plan?.type === plan) {
      return decodedData.current_plan.price === 0
        ? t("free")
        : `₽${decodedData.current_plan.price}`;
    }
    if (decodedData?.next_plan?.type === plan) {
      return decodedData.next_plan.price === 0
        ? t("free")
        : `₽${decodedData.next_plan.price}`;
    }

    // Для доступных планов используем prices
    const planData = decodedData?.available_plans?.find((p) => p.type === plan);
    if (!planData) return t("free");

    const yearlyPrice = planData.prices.year;
    return yearlyPrice === 0 ? t("free") : `₽${yearlyPrice}`;
  };

  const getButtonText = (planType) => {
    // Если есть следующий план и это текущий активный план
    if (
      (nextPlan || decodedData?.next_plan) &&
      decodedData?.current_plan?.type === planType
    ) {
      return t("resumePlan");
    }
    // Если это следующий план
    if (
      nextPlan?.type === planType ||
      decodedData?.next_plan?.type === planType
    ) {
      return t("active");
    }
    // Если это текущий активный план без следующего плана
    if (decodedData?.current_plan?.type === planType) {
      return t("active");
    }
    // Если это бесплатный план и нет активной подписки
    if (
      planType === "free" &&
      !decodedData?.current_plan?.type &&
      !nextPlan &&
      !decodedData?.next_plan
    ) {
      return t("active");
    }
    return t("upgradePlan");
  };

  if (isLoadingSubscription) {
    return <SubscriptionSkeleton />;
  }

  if (!decodedData?.available_plans?.length) {
    console.log("No plans available");
    return <div>Нет доступных планов</div>;
  }

  const renderNextPlanInfo = () => {
    if (!decodedData?.next_subscription) return null;

    const nextPlan = decodedData.next_subscription;
    const price = nextPlan.price;
    const activeFrom = nextPlan.start_date;

    return (
      <div className="mt-4 space-y-2 rounded-lg bg-dark-coal p-4">
        <h3 className="text-sm font-medium text-main-accent">
          {t("nextPlan")}
        </h3>
        <div className="space-y-2 text-center text-sm text-supporting">
          <p>
            <span>{t(`plans.${nextPlan.type}.title`)}</span> /{" "}
            <span>
              ₽ {price} / {new Date(activeFrom).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const handleCancelPlan = async () => {
    try {
      await changeSubscription({
        subscription_type: "free",
        period: billingPeriod,
      }).unwrap();
      showNotification(
        t("notifications.cancelSuccess"),
        t("notifications.pageWillReload"),
        "success",
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Ошибка при отмене подписки:", error);
      showNotification(
        t("notifications.cancelError"),
        t("notifications.tryAgain"),
        "error",
      );
    }
  };

  return (
    <div className="flex h-full flex-col items-center gap-2 py-10 text-white">
      <div className="w-full max-w-7xl space-y-3 rounded-2xl bg-dark-coal p-3">
        <div className="flex items-center justify-between">
          <h1 className="py-1 text-xl font-medium">{t("title")}</h1>
          <div className="flex gap-3">
            {decodedData?.current_plan?.type &&
              decodedData?.current_plan?.type !== "free" && (
                <AppButton
                  text={t("cancelPlan")}
                  bgColor="dark-supporting"
                  action={() => handleCancelPlan()}
                />
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Usage Details */}
          <div className="flex flex-col justify-between space-y-4 rounded-lg bg-dark-graphite p-5">
            <div className="space-y-5">
              <h2 className="text-lg">{t("usageDetails")}</h2>

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-supporting">
                  <span className="bg-dark-graphite">
                    {t("remainingTokens")}
                  </span>
                  <span>{decodedData?.current_plan?.tokens || 0} Tokens</span>
                </div>
              </div>
            </div>
            {decodedData?.current_plan?.type && (
              <>
                <p className="text-sm text-supporting">{t("renewPlan")}</p>
                <Button
                  variant="main-filled"
                  type="submit"
                  onClick={handleRenewSubscription}
                >
                  {t("upgrade")} - {decodedData?.current_plan?.price} ₽
                </Button>
              </>
            )}
          </div>

          {/* Basic Plan Features */}
          <div className="space-y-4 rounded-lg bg-dark-graphite p-5">
            <h2 className="text-lg">{t("basicPlanFeatures")}</h2>

            <div className="space-y-1 text-supporting">
              {renderPlanFeatures(decodedData?.current_plan?.type || "free")}
            </div>
          </div>

          {/* Billing & Payment */}
          <div className="flex flex-col justify-between space-y-4 rounded-lg bg-dark-graphite p-5">
            <div className="space-y-5">
              <h2 className="text-lg">{t("billingPayment")}</h2>

              <div className="space-y-1 text-supporting">
                <div className="flex justify-between text-sm">
                  <span className="bg-dark-graphite">{t("price")}</span>
                  <span>
                    ₽ {decodedData?.current_plan?.price || 0} /{" "}
                    {decodedData?.current_plan?.period || "month"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="bg-dark-graphite">{t("billingPeriod")}</span>
                  <span>{decodedData?.current_plan?.period || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="bg-dark-graphite">{t("renewalDate")}</span>
                  <span>
                    {decodedData?.current_plan?.end_date
                      ? new Date(
                          decodedData.current_plan.end_date,
                        ).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            {renderNextPlanInfo()}
            {decodedData?.current_plan?.type && (
              <AppButton
                variant="outline"
                text={t("editBilling")}
                bgColor="dark-supporting"
                action={() => setIsCardsModalOpen(true)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl space-y-2 pb-10">
        {/* Billing Toggle */}
        <div className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-dark-coal px-3 py-2 text-supporting">
          <p className="py-2 text-xl font-medium text-white">Изменить план</p>
          <div className="flex gap-2">
            <AppButton
              variant="outline"
              text={t("monthlyBilling")}
              bgColor="dark-graphite"
              active={billingPeriod === "month"}
              action={() => handleBillingPeriodChange("month")}
              className={billingPeriod === "month" ? "text-black" : ""}
            />
            <AppButton
              variant="outline"
              text={t("yearlyBilling")}
              bgColor="dark-graphite"
              active={billingPeriod === "year"}
              // action={() => handleBillingPeriodChange("year")}
              action={() => {
                showNotification(
                  t("notifications.comingSoon"),
                  t("notifications.comingSoonText"),
                  "error",
                );
              }}
              className={billingPeriod === "year" ? "text-black" : ""}
            />
          </div>
        </div>

        {/* Plan Options */}
        <div className="grid h-fit grid-cols-1 gap-2 md:grid-cols-3">
          {decodedData?.available_plans?.map((plan) => (
            <div
              key={plan.type}
              className="flex flex-col space-y-5 rounded-2xl bg-dark-coal px-7 py-5"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-bold">
                  {t(`plans.${plan.type}.title`)}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-baseline text-supporting">
                    {typeof getPlanPrice(plan.type) === "string" ? (
                      <span className="text-3xl text-main-accent">
                        {getPlanPrice(plan.type)}
                      </span>
                    ) : (
                      getPlanPrice(plan.type)
                    )}
                    <span className="ml-1">
                      / {t(`periods.${billingPeriod}`)}
                    </span>
                  </div>
                  <p className="text-sm">
                    {billingPeriod === "year" ? (
                      <span>
                        <span className="text-main-accent">
                          {getYearlyTotal(plan.type)}
                        </span>{" "}
                        {t("billedYearly")}
                      </span>
                    ) : (
                      t("billedMonthly")
                    )}
                  </p>
                </div>
              </div>
              <div className="h-fit space-y-5">
                {decodedData?.current_plan?.type === plan.type ? (
                  <Button
                    variant="main-filled"
                    type="submit"
                    onClick={handleRestoreSubscription}
                    disabled={isCreatingLink}
                  >
                    {getButtonText(plan.type)}
                  </Button>
                ) : (
                  <AppButton
                    text={getButtonText(plan.type)}
                    bgColor="dark-supporting"
                    action={() => handleUpgradePlan(plan.type)}
                  />
                )}
                {/* <div
                  className="flex cursor-pointer items-center justify-center text-xs text-supporting"
                  onClick={() => handlePlanToggle(plan.type)}
                >
                  <span>{t("planInfo")}</span>
                  <ArrowDown2
                    size="14"
                    className={`ml-1 transition-transform duration-300 ${expandedPlans ? "rotate-180" : ""}`}
                  />
                </div> */}
                <div className={`space-y-2 overflow-auto transition-all`}>
                  {renderPlanFeatures(plan.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardsModal
        isOpen={isCardsModalOpen}
        onClose={() => setIsCardsModalOpen(false)}
      />

      <PromoCodeModal
        isOpen={isPromoCodeModalOpen}
        onClose={() => setIsPromoCodeModalOpen(false)}
        onApply={handlePromoCodeApply}
        onSkip={handlePromoCodeSkip}
      />
    </div>
  );
}
