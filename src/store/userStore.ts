// Zustand user preferences store
import { create } from "zustand";
import type { LanguageCode, CefrLevel } from "@/types";

interface UserPreferences {
  learningLang: LanguageCode;
  currentLevel: CefrLevel;
  dailyGoalMin: number;
  streakDays: number;
  totalXp: number;
}

interface UserState {
  preferences: UserPreferences | null;
  setPreferences: (prefs: UserPreferences) => void;
  updateXp: (xpToAdd: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  preferences: null,

  setPreferences: (prefs) => set({ preferences: prefs }),

  updateXp: (xpToAdd) =>
    set((state) => ({
      preferences: state.preferences ? { ...state.preferences, totalXp: state.preferences.totalXp + xpToAdd } : null,
    })),
}));
