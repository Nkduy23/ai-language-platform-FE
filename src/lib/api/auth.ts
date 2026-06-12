// auth API functions
import apiClient from "./client";
import type { AuthResponse, UserMe } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const authApi = {
  register: async (data: { email: string; password: string; displayName: string }) => {
    const res = await apiClient.post<AuthResponse>(API_ROUTES.REGISTER, data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<AuthResponse>(API_ROUTES.LOGIN, data);
    return res.data;
  },

  logout: async () => {
    await apiClient.post(API_ROUTES.LOGOUT);
  },

  getMe: async () => {
    const res = await apiClient.get<UserMe>(API_ROUTES.ME);
    return res.data;
  },
};
