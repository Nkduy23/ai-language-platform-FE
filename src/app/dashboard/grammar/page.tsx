"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { apiClient } from "@/lib/api/client";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { LANGUAGES, CEFR_LEVELS } from "@/lib/constants/app";
import type { GrammarLesson, LanguageCode, CefrLevel } from "@/types";
import { cn } from "@/lib/utils/cn";

export default function GrammarPage() {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("EN");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "">("");

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

  // Group theo level
  const grouped = lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.level]) acc[lesson.level] = [];
      acc[lesson.level].push(lesson);
      return acc;
    },
    {} as Record<string, GrammarLesson[]>,
  );

  const levels = (Object.keys(CEFR_LEVELS) as CefrLevel[]).filter((l) => grouped[l]?.length > 0);

  return (
    <DashboardLayout title="Ngữ pháp" description="Học ngữ pháp theo cấp độ CEFR từ A1 đến C2">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
        {/* Ngôn ngữ */}
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
            <button
              key={code}
              onClick={() => setSelectedLang(code)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                selectedLang === code ? "border-airmail bg-airmail/10 text-airmail" : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span>{LANGUAGES[code].flag}</span>
              <span>{code}</span>
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Cấp độ filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedLevel("")}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              selectedLevel === "" ? "border-airmail bg-airmail/10 text-airmail" : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Tất cả
          </button>
          {(Object.keys(CEFR_LEVELS) as CefrLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                selectedLevel === level ? "border-airmail bg-airmail/10 text-airmail" : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
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
      {!isLoading && lessons.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Chưa có bài học nào</p>
          <p className="text-sm text-slate-400 mt-1">Thử chọn ngôn ngữ hoặc cấp độ khác</p>
        </Card>
      )}

      {/* Lesson list grouped by level */}
      {!isLoading &&
        levels.map((level) => (
          <div key={level} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge level={level} className="text-sm px-3 py-1">
                {level}
              </Badge>
              <span className="text-sm text-slate-400">
                {CEFR_LEVELS[level].description} · {grouped[level].length} bài
              </span>
            </div>

            <div className="space-y-3">
              {grouped[level].map((lesson, idx) => (
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
                      {lesson.progress?.status === "COMPLETED" && <p className="text-xs text-stamp-teal mt-0.5">Đã hoàn thành</p>}
                    </div>

                    <ChevronRight className="w-4 h-4 text-paper-line flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </DashboardLayout>
  );
}
