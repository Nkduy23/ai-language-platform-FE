// Community Q&A API
import apiClient from "./client";
import type {
  CommunityQuestionSummary,
  CommunityQuestionDetail,
  PaginatedResponse,
  LanguageCode,
} from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const communityApi = {
  listQuestions: async (language?: string, page = 1) => {
    const res = await apiClient.get<PaginatedResponse<CommunityQuestionSummary>>(API_ROUTES.COMMUNITY_QUESTIONS, {
      params: { language, page },
    });
    return res.data;
  },

  getQuestion: async (id: string) => {
    const res = await apiClient.get<CommunityQuestionDetail>(API_ROUTES.COMMUNITY_QUESTION_DETAIL(id));
    return res.data;
  },

  createQuestion: async (data: { language: LanguageCode; title: string; content: string }) => {
    const res = await apiClient.post(API_ROUTES.COMMUNITY_QUESTIONS, data);
    return res.data;
  },

  createAnswer: async (questionId: string, content: string) => {
    const res = await apiClient.post(API_ROUTES.COMMUNITY_ANSWERS(questionId), { content });
    return res.data;
  },

  likeQuestion: async (id: string) => {
    const res = await apiClient.post<{ liked: boolean }>(API_ROUTES.COMMUNITY_LIKE_QUESTION(id));
    return res.data;
  },

  likeAnswer: async (id: string) => {
    const res = await apiClient.post<{ liked: boolean }>(API_ROUTES.COMMUNITY_LIKE_ANSWER(id));
    return res.data;
  },

  bookmark: async (id: string) => {
    const res = await apiClient.post<{ bookmarked: boolean }>(API_ROUTES.COMMUNITY_BOOKMARK(id));
    return res.data;
  },

  acceptAnswer: async (id: string) => {
    const res = await apiClient.patch(API_ROUTES.COMMUNITY_ACCEPT_ANSWER(id));
    return res.data;
  },
};
