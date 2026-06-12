// vocabulary API functions
import apiClient from "./client";
import type { VocabularyCard, FlashcardSession, FlashcardResult, PaginatedResponse } from "@/types";
import type { LanguageCode, CefrLevel } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const vocabularyApi = {
  getList: async (params: { language?: LanguageCode; level?: CefrLevel; topic?: string; search?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get<PaginatedResponse<VocabularyCard>>(API_ROUTES.VOCABULARY, { params });
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await apiClient.get<VocabularyCard>(`${API_ROUTES.VOCABULARY}/${id}`);
    return res.data;
  },

  startFlashcardSession: async (data: { language: LanguageCode; level?: CefrLevel; topic?: string; cardCount?: number }) => {
    const res = await apiClient.post<FlashcardSession>(API_ROUTES.FLASHCARD_SESSION, data);
    return res.data;
  },

  submitFlashcardResult: async (cardId: string, result: FlashcardResult) => {
    const res = await apiClient.post(API_ROUTES.FLASHCARD_RESULT(cardId), { result });
    return res.data;
  },

  toggleFavorite: async (cardId: string) => {
    const res = await apiClient.post<{ favorited: boolean }>(API_ROUTES.VOCABULARY_FAVORITE(cardId));
    return res.data;
  },

  getFavorites: async (params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<PaginatedResponse<VocabularyCard>>(API_ROUTES.VOCABULARY_FAVORITES, { params });
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get(API_ROUTES.VOCABULARY_STATS);
    return res.data;
  },
};
