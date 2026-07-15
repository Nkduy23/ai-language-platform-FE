// Suy luận "chủ đề ngữ pháp" cho 1 bài học — ưu tiên field category từ BE (nếu
// có), nếu chưa có thì đoán theo từ khoá trong tiêu đề. Đây là fallback tạm
// thời ở FE; khi BE trả về category thật, hàm này sẽ tự động dùng giá trị đó
// thay vì đoán.
import type { GrammarLesson } from "@/types";

const TOPIC_KEYWORDS: { match: RegExp; topic: string }[] = [
  { match: /thì|tense|hiện tại|quá khứ|tương lai/i, topic: "Thì động từ" },
  { match: /điều kiện|conditional|if\s*clause/i, topic: "Câu điều kiện" },
  { match: /quan hệ|relative clause|who|which|that/i, topic: "Mệnh đề quan hệ" },
  { match: /bị động|passive/i, topic: "Câu bị động" },
  { match: /gián tiếp|reported speech|tường thuật/i, topic: "Câu tường thuật" },
  { match: /so sánh|comparative|superlative/i, topic: "So sánh" },
  { match: /giới từ|preposition/i, topic: "Giới từ" },
  { match: /danh từ|noun/i, topic: "Danh từ" },
  { match: /tính từ|adjective/i, topic: "Tính từ" },
  { match: /trạng từ|adverb/i, topic: "Trạng từ" },
  { match: /động từ khuyết thiếu|modal/i, topic: "Động từ khuyết thiếu" },
  { match: /liên từ|conjunction/i, topic: "Liên từ" },
];

const OTHER_TOPIC = "Chủ đề khác";

export function inferGrammarTopic(lesson: Pick<GrammarLesson, "title" | "category">): string {
  if (lesson.category) return lesson.category;
  const found = TOPIC_KEYWORDS.find((t) => t.match.test(lesson.title));
  return found?.topic ?? OTHER_TOPIC;
}

export function groupLessonsByTopic(lessons: GrammarLesson[]): Record<string, GrammarLesson[]> {
  return lessons.reduce(
    (acc, lesson) => {
      const topic = inferGrammarTopic(lesson);
      if (!acc[topic]) acc[topic] = [];
      acc[topic].push(lesson);
      return acc;
    },
    {} as Record<string, GrammarLesson[]>,
  );
}
