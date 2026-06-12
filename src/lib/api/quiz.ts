// quiz API functions
import apiClient from "./client";
import type { QuizSessionResponse, QuizResult } from "@/types";
import type { LanguageCode, CefrLevel, QuizType } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const quizApi = {
  createSession: async (data: { language: LanguageCode; level?: CefrLevel; type?: QuizType; questionCount?: number }) => {
    const res = await apiClient.post<QuizSessionResponse>(API_ROUTES.QUIZ_SESSIONS, data);
    return res.data;
  },

  submitSession: async (sessionId: string, answers: Array<{ questionId: string; answer: string }>) => {
    const res = await apiClient.post<QuizResult>(API_ROUTES.QUIZ_SUBMIT(sessionId), { answers });
    return res.data;
  },

  getHistory: async (params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get(API_ROUTES.QUIZ_HISTORY, { params });
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get(API_ROUTES.QUIZ_STATS);
    return res.data;
  },
};
