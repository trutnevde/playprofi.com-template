export const decodeData = (data, t) => {
    if (!data) return null;

    const decoded = {
      ...data,
      current_plan: data.current_subscription
        ? {
            type: data.current_subscription.type,
            name: data.current_subscription.name,
            price: data.current_subscription.price,
            tokens: data.current_subscription.tokens,
            start_date: data.current_subscription.start_date,
            end_date: data.current_subscription.end_date,
            period: data.current_subscription.period,
            features: data.current_subscription.features?.map((feature) => ({
              text: feature.feature_text,
              available: feature.is_available,
            })),
          }
        : null,
      next_plan: data.next_subscription
        ? {
            type: data.next_subscription.type,
            name: data.next_subscription.name,
            price: data.next_subscription.price,
            tokens: data.next_subscription.tokens,
            period: data.next_subscription.period,
            start_date: data.next_subscription.start_date,
            features: data.next_subscription.features?.map((feature) => ({
              text: feature.feature_text,
              available: feature.is_available,
            })),
          }
        : null,
      available_plans: data.available_plans?.map((plan) => ({
        type: plan.type,
        name: t(`plans.${plan.type}.title`),
        prices: plan.prices,
        tokens: plan.tokens,
        active: plan.active,
        features: plan.features?.map((feature) => ({
          text: feature.feature_text,
          available: feature.is_available,
        })),
      })),
    };
    return decoded;
  };