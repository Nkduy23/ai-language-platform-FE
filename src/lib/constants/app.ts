// CEFR levels, languages, topics
import type { LanguageCode, CefrLevel } from "@/types";

export const LANGUAGES: Record<LanguageCode, { name: string; flag: string; locale: string }> = {
  EN: { name: "Tiếng Anh", flag: "🇺🇸", locale: "en-US" },
  ZH: { name: "Tiếng Trung", flag: "🇨🇳", locale: "zh-CN" },
  JA: { name: "Tiếng Nhật", flag: "🇯🇵", locale: "ja-JP" },
};

export const CEFR_LEVELS: Record<CefrLevel, { label: string; color: string; description: string }> = {
  A1: { label: "A1", color: "green", description: "Beginner" },
  A2: { label: "A2", color: "teal", description: "Elementary" },
  B1: { label: "B1", color: "blue", description: "Intermediate" },
  B2: { label: "B2", color: "purple", description: "Upper Intermediate" },
  C1: { label: "C1", color: "orange", description: "Advanced" },
  C2: { label: "C2", color: "red", description: "Mastery" },
};

export const TOPICS = [
  { value: "daily", label: "Hàng ngày" },
  { value: "food", label: "Ẩm thực" },
  { value: "travel", label: "Du lịch" },
  { value: "work", label: "Công việc" },
  { value: "family", label: "Gia đình" },
  { value: "education", label: "Giáo dục" },
  { value: "health", label: "Sức khỏe" },
  { value: "business", label: "Kinh doanh" },
];

export const CHAT_TOPICS = [
  { value: "DAILY", label: "Hội thoại hàng ngày", icon: "☀️" },
  { value: "TRAVEL", label: "Du lịch", icon: "✈️" },
  { value: "BUSINESS", label: "Công việc", icon: "💼" },
  { value: "INTERVIEW", label: "Phỏng vấn", icon: "🎯" },
];

export const FREE_TIER_LIMITS = {
  AI_CHAT_MESSAGES_PER_DAY: 10,
};

export const XP_REWARDS = {
  VOCABULARY_KNOW: 10,
  VOCABULARY_HARD: 5,
  GRAMMAR_COMPLETE: 20,
  QUIZ_PERFECT: 50,
  QUIZ_GOOD: 30,
  DAILY_STREAK: 15,
};
