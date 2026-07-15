"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle, ChevronRight, LayoutGrid, ListOrdered } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { apiClient } from "@/lib/api/client";
import { API_ROUTES } from "@/lib/constants/routes";
import { LANGUAGES, CEFR_LEVELS } from "@/lib/constants/app";
import { groupLessonsByTopic } from "@/lib/utils/grammarTopics";
import type { GrammarLesson, LanguageCode, CefrLevel } from "@/types";
import { cn } from "@/lib/utils/cn";

type GroupMode = "level" | "topic";

export default function GrammarPage() {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("EN");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "">("");
  const [groupMode, setGroupMode] = useState<GroupMode>("level");

  const { data, isLoading } = useQuery({
    queryKey: ["grammar-lessons", selectedLang, selectedLevel],
    queryFn: async () => {
      const res = await apiClient.get(API_ROUTES.GRAMMAR_LESSONS, {
        params: {
          language: selectedLang,
          level: selectedLevel || undefined,
          limit: 50,
        },
      });
      return res.data as { data: GrammarLesson[]; pagination: any };
    },
  });

  const lessons = data?.data ?? [];

  // Group theo level (thứ tự học chuẩn A1→C2)
  const groupedByLevel = lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.level]) acc[lesson.level] = [];
      acc[lesson.level].push(lesson);
      return acc;
    },
    {} as Record<string, GrammarLesson[]>,
  );
  const levels = (Object.keys(CEFR_LEVELS) as CefrLevel[]).filter((l) => groupedByLevel[l]?.length > 0);

  // Group theo chủ đề (thì, câu điều kiện, mệnh đề quan hệ...) — xem grammarTopics.ts
  const groupedByTopic = groupLessonsByTopic(lessons);
  const topics = Object.keys(groupedByTopic).sort((a, b) => groupedByTopic[b].length - groupedByTopic[a].length);

  const renderLessonRow = (lesson: GrammarLesson, idx: number) => (
    <Link key={lesson.id} href={`/dashboard/grammar/${lesson.id}`}>
      <div
        className={cn(
          "flex items-center gap-4 p-4 bg-postcard rounded-md border-[1.5px] transition-all duration-150",
          "hover:border-airmail hover:shadow-card-hover cursor-pointer",
          lesson.progress?.status === "COMPLETED" ? "border-stamp-teal/30" : "border-paper-line",
        )}
      >
        {/* Index */}
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold font-mono",
            lesson.progress?.status === "COMPLETED" ? "bg-stamp-teal/15 text-stamp-teal" : "bg-postcard-dark text-ink-muted",
          )}
        >
          {lesson.progress?.status === "COMPLETED" ? <CheckCircle className="w-5 h-5" /> : idx + 1}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ink-navy truncate">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {groupMode === "topic" && (
              <Badge level={lesson.level} className="text-[10px] px-1.5 py-0">
                {lesson.level}
              </Badge>
            )}
            {lesson.progress?.status === "COMPLETED" && <p className="text-xs text-stamp-teal">Đã hoàn thành</p>}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-paper-line flex-shrink-0" />
      </div>
    </Link>
  );

  return (
    <DashboardLayout title="Ngữ pháp" description="Học ngữ pháp theo cấp độ CEFR từ A1 đến C2">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
        {/* Ngôn ngữ */}
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
            <button
              key={code}
              onClick={() => setSelectedLang(code)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md border-[1.5px] text-sm font-medium transition-all ${
                selectedLang === code ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
              }`}
            >
              <span>{LANGUAGES[code].flag}</span>
              <span>{code}</span>
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-6 bg-paper-line" />

        {/* Cấp độ filter — chỉ áp dụng nghĩa khi xem theo cấp độ, nhưng vẫn lọc dữ liệu chung */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedLevel("")}
            className={`px-3 py-1.5 rounded-md border-[1.5px] text-sm font-medium transition-all ${
              selectedLevel === "" ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
            }`}
          >
            Tất cả
          </button>
          {(Object.keys(CEFR_LEVELS) as CefrLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-1.5 rounded-md border-[1.5px] text-sm font-medium transition-all ${
                selectedLevel === level ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Chuyển đổi cách nhóm bài học */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setGroupMode("level")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            groupMode === "level" ? "bg-ink-navy text-postcard" : "text-ink-muted hover:bg-postcard-dark",
          )}
        >
          <ListOrdered className="w-3.5 h-3.5" /> Theo cấp độ
        </button>
        <button
          onClick={() => setGroupMode("topic")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            groupMode === "topic" ? "bg-ink-navy text-postcard" : "text-ink-muted hover:bg-postcard-dark",
          )}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Theo chủ đề
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && lessons.length === 0 && <EmptyState icon={BookOpen} title="Chưa có bài học nào" description="Thử chọn ngôn ngữ hoặc cấp độ khác xem sao." />}

      {/* Theo cấp độ — thứ tự học chuẩn A1 → C2 */}
      {!isLoading &&
        groupMode === "level" &&
        levels.map((level) => (
          <div key={level} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge level={level} className="text-sm px-3 py-1">
                {level}
              </Badge>
              <span className="text-sm text-ink-muted">
                {CEFR_LEVELS[level].description} · {groupedByLevel[level].length} bài
              </span>
            </div>
            <div className="space-y-3">{groupedByLevel[level].map((lesson, idx) => renderLessonRow(lesson, idx))}</div>
          </div>
        ))}

      {/* Theo chủ đề — thì, câu điều kiện, mệnh đề quan hệ... (xem grammarTopics.ts) */}
      {!isLoading &&
        groupMode === "topic" &&
        topics.map((topic) => (
          <div key={topic} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-display font-semibold text-ink-navy">{topic}</h3>
              <span className="text-sm text-ink-muted">{groupedByTopic[topic].length} bài</span>
            </div>
            <div className="space-y-3">{groupedByTopic[topic].map((lesson, idx) => renderLessonRow(lesson, idx))}</div>
          </div>
        ))}
    </DashboardLayout>
  );
}
