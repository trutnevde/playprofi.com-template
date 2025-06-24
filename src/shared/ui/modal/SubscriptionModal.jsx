import { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { ArrowDown2, TickCircle, CloseCircle } from "iconsax-react";
import AppButton from "../buttons/AppButton";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetSubscriptionDetailsQuery } from "../../../pages/subscription-page/api/api";
import { decodeData } from "../../../pages/subscription-page/helpers/helper";
import { useSubscriptionModal } from "../../context/SubscriptionModalContext";

export default function SubscriptionModal() {
  const { t } = useTranslation("translation", {
    keyPrefix: "app.subscription",
  });
  const [billingPeriod, setBillingPeriod] = useState("month");
  const [expandedPlans, setExpandedPlans] = useState(false);
  const popupRef = useRef(null);
  const { isOpen, closeModal } = useSubscriptionModal();

  const { data: subscriptionData } = useGetSubscriptionDetailsQuery();
  const decodedData = decodeData(subscriptionData, t);

  const handlePlanToggle = () => {
    setExpandedPlans(!expandedPlans);
  };

  const handleBillingPeriodChange = (period) => {
    setBillingPeriod(period);
  };

  const handleButtonClick = () => {
    window.location.href = '/app/subscriptions';
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
    const planData = decodedData?.available_plans?.find((p) => p.type === plan);
    if (!planData) return "Free";
    if (!planData.active) return "-";

    const price = planData.prices[billingPeriod];
    const monthlyPrice = planData.prices.month;
    const yearlyPrice = planData.prices.year;

    if (billingPeriod === "year") {
      if (yearlyPrice === 0) {
        return "Free";
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

    return price === 0 ? "Free" : `₽${price}`;
  };

  const getYearlyTotal = (plan) => {
    const planData = decodedData?.available_plans?.find((p) => p.type === plan);
    if (!planData) return "Free";

    const yearlyPrice = planData.prices.year;
    return yearlyPrice === 0 ? "Free" : `₽${yearlyPrice}`;
  };

  // Блокировка скролла + закрытие кликом вне модалки
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        closeModal();
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, closeModal]);

  if (!decodedData?.available_plans?.length) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        ref={popupRef}
        className={`relative h-4/6 w-8/12 max-w-full text-white transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <p className="absolute -top-20 left-1/2 -translate-x-1/2 text-5xl font-semibold">
          {t("titleModal")}
        </p>
        <p className="absolute -top-3 left-1/2 -translate-x-1/2 text-base text-supporting">
          {t("titleModalDescription")}
        </p>
        <div className="flex size-full flex-col rounded-lg p-6">
          <div className="space-y-2">
            {/* Billing Toggle */}
            <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl bg-dark-coal p-2 text-supporting">
              <AppButton
                variant="outline"
                text={t("monthlyBilling")}
                bgColor="dark-graphite"
                active={billingPeriod === "month" ? true : false}
                action={() => handleBillingPeriodChange("month")}
                className={billingPeriod === "month" ? "text-black" : ""}
              />
              {/* <AppButton
                variant="outline"
                text={t("yearlyBilling")}
                bgColor="dark-graphite"
                active={billingPeriod === "year" ? true : false}
                // action={() => handleBillingPeriodChange("year")}
                
                className={billingPeriod === "year" ? "text-black" : ""}
              /> */}
            </div>

            {/* Plan Options */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {decodedData?.available_plans?.map((plan) => (
                <div key={plan.type} className="space-y-5 rounded-2xl bg-dark-coal px-7 py-5">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">
                      {plan.name || t(`plans.${plan.type}.title`)}
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
                        <span className="ml-1">/ {t(`periods.${billingPeriod}`)}</span>
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
                  <div className="space-y-2">
                    <AppButton
                      variant="outline"
                      text={decodedData?.current_plan?.type === plan.type ? t("active") : t("moreDetails")}
                      bgColor="dark-graphite"
                      className={`w-full ${decodedData?.current_plan?.type === plan.type ? "bg-main-accent text-black" : "bg-teal-400 text-black hover:bg-teal-500"}`}
                      action={handleButtonClick}
                    />

                    <div
                      className="flex cursor-pointer items-center justify-center text-xs text-supporting"
                      onClick={() => handlePlanToggle(plan.type)}
                    >
                      <span>{t("planInfo")}</span>
                      {/* <ArrowDown2
                        size="14"
                        className={`ml-1 transition-transform duration-300 ${expandedPlans ? "rotate-180" : ""}`}
                      /> */}
                    </div>
                    <div
                      className={`space-y-2 transition-all duration-300 ease-in-out`}
                    >
                      {renderPlanFeatures(plan.type)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
