// TypeScript type definitions
// ─── Enums ────────────────────────────────────────────────────────────────────

export type LanguageCode = "EN" | "ZH" | "JA";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Plan = "FREE" | "PREMIUM" | "PRO";
export type QuizType = "MULTIPLE_CHOICE" | "FILL_BLANK" | "ARRANGE" | "LISTENING";
export type ChatTopic = "DAILY" | "TRAVEL" | "BUSINESS" | "INTERVIEW";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  displayName: string;
  avatarUrl?: string;
  learningLang: LanguageCode;
  currentLevel: CefrLevel;
  dailyGoalMin: number;
  streakDays: number;
  totalXp: number;
}

export interface UserSubscription {
  plan: Plan;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  expiresAt?: string;
}

export interface UserMe {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  profile: UserProfile;
  subscription: UserSubscription;
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export interface VocabularyCard {
  id: string;
  word: string;
  pronunciation?: string;
  meaningVi: string;
  meaningEn?: string;
  exampleSentence?: string;
  imageUrl?: string;
  level: CefrLevel;
  topicTags?: string[];
  language: Pick<Language, "code" | "name">;
}

export interface FlashcardSession {
  sessionCards: VocabularyCard[];
  total: number;
  newCount: number;
  reviewCount: number;
}

export type FlashcardResult = "know" | "dontknow" | "hard";

// ─── Grammar ──────────────────────────────────────────────────────────────────

export interface GrammarLesson {
  id: string;
  title: string;
  content: string;
  level: CefrLevel;
  orderIndex: number;
  language: Language;
  progress?: {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    score?: number;
    completedAt?: string;
  };
  navigation?: {
    prev?: { id: string; title: string };
    next?: { id: string; title: string };
  };
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  options?: string[];
  audioUrl?: string;
  level: CefrLevel;
}

export interface QuizSessionResponse {
  sessionId: string;
  questions: QuizQuestion[];
  totalQuestions: number;
}

export interface QuizAnswerDetail {
  questionId: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizResult {
  sessionId: string;
  score: number;
  correct: number;
  total: number;
  xpEarned: number;
  grade: string;
  details: QuizAnswerDetail[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp?: string;
  path?: string;
}
