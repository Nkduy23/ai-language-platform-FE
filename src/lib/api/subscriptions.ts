// Subscriptions API — plans, current, checkout
import apiClient from "./client";
import type { PlanInfo, UserSubscription, CheckoutResponse, CheckoutGateway } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const subscriptionsApi = {
  getPlans: async () => {
    const res = await apiClient.get<PlanInfo[]>(API_ROUTES.SUBSCRIPTION_PLANS);
    return res.data;
  },

  getCurrent: async () => {
    const res = await apiClient.get<UserSubscription>(API_ROUTES.SUBSCRIPTION_CURRENT);
    return res.data;
  },

  checkout: async (plan: "premium" | "pro", gateway: CheckoutGateway) => {
    const res = await apiClient.post<CheckoutResponse>(API_ROUTES.SUBSCRIPTION_CHECKOUT, { plan, gateway });
    return res.data;
  },
};
