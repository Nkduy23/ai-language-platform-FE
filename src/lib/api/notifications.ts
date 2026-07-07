// Notifications API — in-app notification center
import apiClient from "./client";
import type { AppNotification } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const notificationsApi = {
  list: async () => {
    const res = await apiClient.get<{ data: AppNotification[]; unreadCount: number }>(API_ROUTES.NOTIFICATIONS);
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await apiClient.patch(API_ROUTES.NOTIFICATION_READ(id));
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch(API_ROUTES.NOTIFICATIONS_READ_ALL);
    return res.data;
  },
};
