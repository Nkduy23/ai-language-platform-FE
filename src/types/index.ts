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
  /** Chủ đề ngữ pháp (vd: "Thì động từ", "Câu điều kiện") — optional, BE có thể chưa trả về */
  category?: string;
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

// ─── AI Chat ────────────────────────────────────────────────────────────────

export interface ChatSession {
  id: string;
  topic: ChatTopic;
  startedAt: string;
  endedAt?: string;
  msgCount: number;
  language: Language;
}

export interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
}

export interface GrammarNote {
  errors: GrammarError[];
  suggestions: string[];
  naturalAlternative: string | null;
}

export interface NewWord {
  word: string;
  meaningVi: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "USER" | "ASSISTANT";
  content: string;
  grammarNote?: GrammarNote;
  newWords?: NewWord[];
  createdAt?: string;
}

export interface ChatUsage {
  used: number;
  limit: number;
}

export interface SendMessageResponse {
  message: ChatMessage;
  usage: ChatUsage | null;
}

// ─── AI Speaking ──────────────────────────────────────────────────────────────

export interface SpeakingScores {
  pronunciation: number;
  grammar: number;
  fluency: number;
  vocabulary: number;
}

export interface SpeakingFeedback {
  summary: string;
  details: string[];
  modelAnswer: string;
  modelAudioUrl: string | null;
}

export interface SpeakingResult {
  sessionId: string;
  transcribed: string;
  scores: SpeakingScores;
  feedback: SpeakingFeedback;
}

// ─── Subscriptions (checkout) ─────────────────────────────────────────────────

export type CheckoutGateway = "stripe" | "vnpay";

export interface PlanInfo {
  plan: Plan;
  priceVnd: number;
  features: string[];
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

// ─── Roadmap / Gamification ────────────────────────────────────────────────────

export interface PlacementQuestion {
  id: string;
  level: CefrLevel;
  type: string;
  question: string;
  options?: string[] | null;
  audioUrl?: string | null;
}

export interface PlacementTestResult {
  level: CefrLevel;
  breakdown: Record<CefrLevel, { correct: number; total: number }>;
}

export interface RoadmapRecommendation {
  currentLevel: CefrLevel;
  weakestArea: string | null;
  progressByType: Record<string, { count: number; avgScore: number; totalScore: number }>;
  nextGrammarLesson: { id: string; title: string; level: CefrLevel } | null;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatarUrl?: string | null;
  totalXp: number;
  streakDays: number;
  learningLang: LanguageCode;
}

export interface BadgeItem {
  id: string;
  label: string;
  icon: string;
  achieved: boolean;
}

// ─── Blog ───────────────────────────────────────────────────────────────────

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string | null;
  language: LanguageCode;
  authorName: string;
  publishedAt: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

// ─── Community Q&A ────────────────────────────────────────────────────────────

export interface CommunityAuthor {
  profile: { displayName: string; avatarUrl?: string | null } | null;
}

export interface CommunityQuestionSummary {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  language: Language;
  user: CommunityAuthor;
  _count: { answers: number; likes: number };
  /** BE có thể chưa trả về field này — nếu thiếu, filter "đã giải quyết" sẽ không lọc được */
  hasAcceptedAnswer?: boolean;
}

export interface CommunityAnswerItem {
  id: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  user: CommunityAuthor;
  _count: { likes: number };
}

export interface CommunityQuestionDetail extends CommunityQuestionSummary {
  answers: CommunityAnswerItem[];
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = "STREAK_REMINDER" | "WEEKLY_REPORT" | "COMMUNITY_ANSWER" | "COMMUNITY_LIKE" | "BADGE_EARNED" | "SYSTEM";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  users: { total: number; newLast7Days: number; byPlan: Record<string, number> };
  content: { vocabulary: number; grammar: number; quiz: number; blogPosts: { total: number; published: number } };
  engagement: { communityQuestions: number; chatSessions: number; speakingSessions: number };
}

export interface AdminUserItem {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  profile: { displayName: string; currentLevel: CefrLevel; totalXp: number; streakDays: number } | null;
  subscription: { plan: Plan; status: string } | null;
}
