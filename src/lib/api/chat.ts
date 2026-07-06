// AI Chat API functions
import apiClient from "./client";
import type { ChatSession, ChatMessage, SendMessageResponse, ChatTopic, LanguageCode } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const chatApi = {
  listSessions: async () => {
    const res = await apiClient.get<ChatSession[]>(API_ROUTES.CHAT_SESSIONS);
    return res.data;
  },

  createSession: async (data: { language: LanguageCode; topic: ChatTopic }) => {
    const res = await apiClient.post<ChatSession>(API_ROUTES.CHAT_SESSIONS, data);
    return res.data;
  },

  getMessages: async (sessionId: string) => {
    const res = await apiClient.get<ChatMessage[]>(API_ROUTES.CHAT_MESSAGES(sessionId));
    return res.data;
  },

  sendMessage: async (sessionId: string, content: string) => {
    const res = await apiClient.post<SendMessageResponse>(API_ROUTES.CHAT_MESSAGES(sessionId), { content });
    return res.data;
  },
};
