export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  LEARN_ENGLISH: "/marketing/english",
  LEARN_CHINESE: "/marketing/chinese",
  LEARN_JAPANESE: "/marketing/japanese",
  BLOG: "/marketing/blog",

  DASHBOARD: "/dashboard/learn",
  LEARN: "/dashboard/learn",
  GRAMMAR: "/dashboard/grammar",
  QUIZ: "/dashboard/quiz",
  CHAT: "/dashboard/chat",
  SPEAKING: "/dashboard/speaking",
  ROADMAP: "/dashboard/roadmap",
  PROFILE: "/dashboard/profile",
} as const;

export const API_ROUTES = {
  // Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",

  // Vocabulary
  VOCABULARY: "/vocabulary",
  VOCABULARY_STATS: "/vocabulary/stats",
  VOCABULARY_FAVORITES: "/vocabulary/favorites",
  FLASHCARD_SESSION: "/vocabulary/flashcard/session",
  FLASHCARD_RESULT: (cardId: string) => `/vocabulary/flashcard/${cardId}/result`,
  VOCABULARY_FAVORITE: (id: string) => `/vocabulary/${id}/favorite`,

  // Grammar
  GRAMMAR_LESSONS: "/grammar/lessons",
  GRAMMAR_LESSON: (id: string) => `/grammar/lessons/${id}`,
  GRAMMAR_COMPLETE: (id: string) => `/grammar/lessons/${id}/complete`,
  GRAMMAR_PROGRESS: "/grammar/progress",

  // Quiz
  QUIZ_SESSIONS: "/quiz/sessions",
  QUIZ_SUBMIT: (id: string) => `/quiz/sessions/${id}/submit`,
  QUIZ_HISTORY: "/quiz/sessions",
  QUIZ_SESSION_DETAIL: (id: string) => `/quiz/sessions/${id}`,
  QUIZ_STATS: "/quiz/stats",
} as const;
