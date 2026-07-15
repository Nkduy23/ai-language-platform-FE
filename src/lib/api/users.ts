// Users API — profile, progress, streak
import apiClient from "./client";
import type { UserMe, UserProgress } from "@/types";

export const usersApi = {
  getMe: async () => {
    const res = await apiClient.get<UserMe>("/users/me");
    return res.data;
  },

  updateProfile: async (data: Partial<{ displayName: string; avatarUrl: string; dailyGoalMin: number; timezone: string }>) => {
    const res = await apiClient.patch("/users/me", data);
    return res.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await apiClient.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getProgress: async () => {
    const res = await apiClient.get<UserProgress>("/users/me/progress");
    return res.data;
  },

  getStreak: async () => {
    const res = await apiClient.get<{ streakDays: number; totalXp: number; lastActiveAt: string | null }>("/users/me/streak");
    return res.data;
  },
};
