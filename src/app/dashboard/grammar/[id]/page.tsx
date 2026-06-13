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
          <div className="flex items-center gap-3 mb-2">
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
          <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <Card className="mb-6">
        <div className="prose prose-slate max-w-none">
          <MarkdownContent content={lesson.content} />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {/* Prev */}
        {lesson.navigation?.prev ? (
          <Link href={`/dashboard/grammar/${lesson.navigation.prev.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Bài trước
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {/* Complete + Next */}
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <Button onClick={() => completeMutation.mutate()} loading={completeMutation.isPending} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Đánh dấu hoàn thành
            </Button>
          )}

          {lesson.navigation?.next && (
            <Link href={`/dashboard/grammar/${lesson.navigation.next.id}`}>
              <Button variant={isCompleted ? "primary" : "outline"} size="sm" className="gap-2">
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

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-700">
      {lines.map((line, i) => {
        // H1
        if (line.startsWith("# ")) {
          return (
            <h2 key={i} className="text-xl font-bold text-slate-900 mt-6 mb-3">
              {line.slice(2)}
            </h2>
          );
        }
        // H2
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-slate-800 mt-5 mb-2">
              {line.slice(3)}
            </h3>
          );
        }
        // H3
        if (line.startsWith("### ")) {
          return (
            <h4 key={i} className="text-sm font-semibold text-slate-700 mt-4 mb-1">
              {line.slice(4)}
            </h4>
          );
        }
        // Table row
        if (line.startsWith("|")) {
          return <TableRow key={i} line={line} />;
        }
        // Blockquote
        if (line.startsWith(">")) {
          return (
            <blockquote key={i} className="border-l-4 border-brand pl-4 py-1 bg-blue-50 rounded-r-lg italic text-slate-600">
              {renderInline(line.slice(1).trim())}
            </blockquote>
          );
        }
        // Code block marker — skip
        if (line.startsWith("```")) return null;
        // Empty line
        if (line.trim() === "") return <div key={i} className="h-2" />;
        // Normal paragraph
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function TableRow({ line }: { line: string }) {
  const cells = line
    .split("|")
    .filter(Boolean)
    .map((c) => c.trim());
  if (cells.every((c) => c.match(/^[-:]+$/))) return null; // separator row
  const isHeader = line.includes("---"); // heuristic

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <tbody>
          <tr>
            {cells.map((cell, i) => (
              <td key={i} className="border border-slate-200 px-3 py-2 text-left">
                {renderInline(cell)}
              </td>
            ))}
          </tr>
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
