export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  LEARN_ENGLISH: "/marketing/english",
  LEARN_CHINESE: "/marketing/chinese",
  LEARN_JAPANESE: "/marketing/japanese",
  BLOG: "/marketing/blog",
  PRICING: "/pricing",

  DASHBOARD: "/dashboard/learn",
  LEARN: "/dashboard/learn",
  GRAMMAR: "/dashboard/grammar",
  QUIZ: "/dashboard/quiz",
  CHAT: "/dashboard/chat",
  SPEAKING: "/dashboard/speaking",
  ROADMAP: "/dashboard/roadmap",
  PROFILE: "/dashboard/profile",
  COMMUNITY: "/community",
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

  // AI Chat
  CHAT_SESSIONS: "/ai-chat/sessions",
  CHAT_MESSAGES: (sessionId: string) => `/ai-chat/sessions/${sessionId}/messages`,

  // AI Speaking
  SPEAKING_SESSIONS: "/ai-speaking/sessions",

  // Subscriptions
  SUBSCRIPTION_PLANS: "/subscriptions/plans",
  SUBSCRIPTION_CURRENT: "/subscriptions/current",
  SUBSCRIPTION_CHECKOUT: "/subscriptions/checkout",

  // Roadmap
  PLACEMENT_TEST_START: "/roadmap/placement-test/start",
  PLACEMENT_TEST_SUBMIT: "/roadmap/placement-test/submit",
  ROADMAP_RECOMMENDATIONS: "/roadmap/recommendations",
  ROADMAP_LEADERBOARD: "/roadmap/leaderboard",
  ROADMAP_BADGES: "/roadmap/badges",

  // Content / Blog
  BLOG_POSTS: "/content/blog",
  BLOG_POST_DETAIL: (slug: string) => `/content/blog/${slug}`,

  // Community
  COMMUNITY_QUESTIONS: "/community/questions",
  COMMUNITY_QUESTION_DETAIL: (id: string) => `/community/questions/${id}`,
  COMMUNITY_ANSWERS: (questionId: string) => `/community/questions/${questionId}/answers`,
  COMMUNITY_LIKE_QUESTION: (id: string) => `/community/questions/${id}/like`,
  COMMUNITY_LIKE_ANSWER: (id: string) => `/community/answers/${id}/like`,
  COMMUNITY_BOOKMARK: (id: string) => `/community/questions/${id}/bookmark`,
  COMMUNITY_ACCEPT_ANSWER: (id: string) => `/community/answers/${id}/accept`,

  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: "/notifications/read-all",
} as const;
