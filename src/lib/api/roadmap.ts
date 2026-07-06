// Roadmap API — placement test, recommendations, leaderboard, badges
import apiClient from "./client";
import type { PlacementQuestion, PlacementTestResult, RoadmapRecommendation, LeaderboardEntry, BadgeItem, LanguageCode } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const roadmapApi = {
  startPlacementTest: async (language: LanguageCode) => {
    const res = await apiClient.post<{ questions: PlacementQuestion[] }>(API_ROUTES.PLACEMENT_TEST_START, { language });
    return res.data;
  },

  submitPlacementTest: async (language: LanguageCode, answers: { questionId: string; answer: string }[]) => {
    const res = await apiClient.post<PlacementTestResult>(API_ROUTES.PLACEMENT_TEST_SUBMIT, { language, answers });
    return res.data;
  },

  getRecommendations: async () => {
    const res = await apiClient.get<RoadmapRecommendation>(API_ROUTES.ROADMAP_RECOMMENDATIONS);
    return res.data;
  },

  getLeaderboard: async () => {
    const res = await apiClient.get<LeaderboardEntry[]>(API_ROUTES.ROADMAP_LEADERBOARD);
    return res.data;
  },

  getBadges: async () => {
    const res = await apiClient.get<BadgeItem[]>(API_ROUTES.ROADMAP_BADGES);
    return res.data;
  },
};
