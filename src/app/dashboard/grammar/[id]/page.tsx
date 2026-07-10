"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { apiClient } from "@/lib/api/client";
import { API_ROUTES } from "@/lib/constants/routes";
import type { GrammarLesson } from "@/types";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

export default function GrammarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["grammar-lesson", id],
    queryFn: async () => {
      const res = await apiClient.get(API_ROUTES.GRAMMAR_LESSON(id));
      return res.data as GrammarLesson;
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => apiClient.post(API_ROUTES.GRAMMAR_COMPLETE(id)),
    onSuccess: (res) => {
      toast.success(`Hoàn thành! +${res.data.xpEarned} XP ⚡`, { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["grammar-lesson", id] });
      queryClient.invalidateQueries({ queryKey: ["grammar-lessons"] });

      // Auto navigate sang bài tiếp theo nếu có
      if (lesson?.navigation?.next) {
        setTimeout(() => {
          router.push(`/dashboard/grammar/${lesson.navigation!.next!.id}`);
        }, 1500);
      }
    },
    onError: () => toast.error("Không thể cập nhật tiến trình"),
  });

  const isCompleted = lesson?.progress?.status === "COMPLETED";

  if (isLoading) {
    return (
      <DashboardLayout>
        <SkeletonCard />
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12">
          <p className="text-slate-500">Không tìm thấy bài học</p>
          <Link href="/dashboard/grammar">
            <Button variant="outline" className="mt-4">
              Quay lại
            </Button>
          </Link>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back */}
      <Link href="/dashboard/grammar" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <Badge level={lesson.level}>{lesson.level}</Badge>
            <span className="text-sm text-slate-400">
              {lesson.language.flag} {lesson.language.name}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Đã hoàn thành
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <Card className="mb-6">
        <div className="prose prose-slate prose-sm sm:prose-base max-w-none">
          <MarkdownContent content={lesson.content} />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Prev */}
        {lesson.navigation?.prev ? (
          <Link href={`/dashboard/grammar/${lesson.navigation.prev.id}`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Bài trước
            </Button>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Complete + Next */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-first sm:order-none">
          {!isCompleted && (
            <Button onClick={() => completeMutation.mutate()} loading={completeMutation.isPending} className="gap-2 w-full sm:w-auto">
              <CheckCircle className="w-4 h-4" />
              Đánh dấu hoàn thành
            </Button>
          )}

          {lesson.navigation?.next && (
            <Link href={`/dashboard/grammar/${lesson.navigation.next.id}`} className="w-full sm:w-auto">
              <Button variant={isCompleted ? "primary" : "outline"} size="sm" className="gap-2 w-full sm:w-auto">
                Bài tiếp theo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Simple markdown renderer ─────────────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Gom TOÀN BỘ khối bảng liên tiếp (mọi dòng bắt đầu bằng "|") thành 1 table duy nhất,
    // thay vì tạo 1 <table> riêng cho từng dòng (bug cũ khiến cột lệch nhau).
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(<MarkdownTable key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h2 key={i} className="text-xl font-bold text-slate-900 mt-6 mb-3">
          {line.slice(2)}
        </h2>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={i} className="text-base font-semibold text-slate-800 mt-5 mb-2">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("### ")) {
      blocks.push(
        <h4 key={i} className="text-sm font-semibold text-slate-700 mt-4 mb-1">
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith(">")) {
      blocks.push(
        <blockquote key={i} className="border-l-4 border-brand pl-4 py-1 bg-blue-50 rounded-r-lg italic text-slate-600">
          {renderInline(line.slice(1).trim())}
        </blockquote>,
      );
    } else if (line.startsWith("```")) {
      // Code block marker — skip
    } else if (line.trim() === "") {
      blocks.push(<div key={i} className="h-2" />);
    } else {
      blocks.push(<p key={i}>{renderInline(line)}</p>);
    }
    i++;
  }

  return <div className="space-y-3 text-sm leading-relaxed text-slate-700">{blocks}</div>;
}

// Render 1 khối bảng markdown hoàn chỉnh (header + separator + data rows) thành 1 <table> duy nhất
function MarkdownTable({ lines }: { lines: string[] }) {
  const parseCells = (line: string) =>
    line
      .split("|")
      .filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1) // bỏ phần tử rỗng đầu/cuối do split theo "|"
      .map((c) => c.trim());

  const isSeparator = (line: string) => /^\|[\s:|-]+\|$/.test(line.trim());

  const headerLine = lines[0];
  const bodyLines = lines.slice(1).filter((l) => !isSeparator(l));

  const headerCells = parseCells(headerLine);
  const bodyRows = bodyLines.map(parseCells);

  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headerCells.map((cell, i) => (
              <th key={i} className="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-700">
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-slate-200 px-3 py-2 text-left">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-brand">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
