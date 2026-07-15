// AI Speaking API — upload audio (multipart/form-data)
import apiClient from "./client";
import type { SpeakingResult, SpeakingSessionSummary, LanguageCode } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const speakingApi = {
  analyze: async (data: { audioBlob: Blob; language: LanguageCode; prompt?: string }) => {
    const formData = new FormData();
    formData.append("audio", data.audioBlob, "recording.webm");
    formData.append("language", data.language);
    if (data.prompt) formData.append("prompt", data.prompt);

    const res = await apiClient.post<SpeakingResult>(API_ROUTES.SPEAKING_SESSIONS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // BE trả về mảng thẳng, không bọc trong { data, pagination }
  getHistory: async () => {
    const res = await apiClient.get<SpeakingSessionSummary[]>(API_ROUTES.SPEAKING_SESSIONS);
    return res.data;
  },
};
