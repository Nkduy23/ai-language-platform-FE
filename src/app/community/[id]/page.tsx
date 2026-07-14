// Community question detail — trả lời, like, bookmark, duyệt câu trả lời hay nhất
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, Bookmark, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { communityApi } from "@/lib/api/community";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

export default function CommunityQuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [answerText, setAnswerText] = useState("");

  const { data: question } = useQuery({
    queryKey: ["community-question", id],
    queryFn: () => communityApi.getQuestion(id),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["community-question", id] });

  const answerMutation = useMutation({
    mutationFn: () => communityApi.createAnswer(id, answerText),
    onSuccess: () => {
      setAnswerText("");
      invalidate();
      toast.success("Đã gửi câu trả lời!");
    },
  });

  const likeQuestionMutation = useMutation({ mutationFn: () => communityApi.likeQuestion(id), onSuccess: invalidate });
  const likeAnswerMutation = useMutation({ mutationFn: (answerId: string) => communityApi.likeAnswer(answerId), onSuccess: invalidate });
  const bookmarkMutation = useMutation({
    mutationFn: () => communityApi.bookmark(id),
    onSuccess: (data) => toast.success(data.bookmarked ? "Đã lưu câu hỏi" : "Đã bỏ lưu"),
  });
  const acceptMutation = useMutation({
    mutationFn: (answerId: string) => communityApi.acceptAnswer(answerId),
    onSuccess: invalidate,
  });

  if (!question) {
    return (
      <DashboardLayout title="Cộng đồng">
        <p className="text-slate-400 text-center py-10">Đang tải...</p>
      </DashboardLayout>
    );
  }

  const isOwner = user?.id === question.userId;

  return (
    <DashboardLayout title="Chi tiết câu hỏi">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-brand font-medium">{question.language.code}</span>
            <span className="text-xs text-slate-400">{question.user.profile?.displayName ?? "Ẩn danh"}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">{question.title}</h1>
          <p className="text-sm text-slate-600 whitespace-pre-wrap mb-4">{question.content}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => likeQuestionMutation.mutate()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand">
              <ThumbsUp className="w-4 h-4" /> {question._count.likes}
            </button>
            <button onClick={() => bookmarkMutation.mutate()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand">
              <Bookmark className="w-4 h-4" /> Lưu
            </button>
          </div>
        </Card>

        <h2 className="text-sm font-semibold text-slate-700">{question.answers.length} câu trả lời</h2>

        {question.answers.map((a) => (
          <Card key={a.id} className={cn(a.isAccepted && "border-2 border-stamp-teal")}>
            {a.isAccepted && (
              <p className="flex items-center gap-1 text-xs text-stamp-teal font-medium mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Câu trả lời hay nhất
              </p>
            )}
            <p className="text-sm text-slate-700 whitespace-pre-wrap mb-2">{a.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{a.user.profile?.displayName ?? "Ẩn danh"}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => likeAnswerMutation.mutate(a.id)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand">
                  <ThumbsUp className="w-3.5 h-3.5" /> {a._count.likes}
                </button>
                {isOwner && !a.isAccepted && (
                  <button onClick={() => acceptMutation.mutate(a.id)} className="text-xs text-stamp-teal hover:underline">
                    Chọn là hay nhất
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}

        <Card>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Viết câu trả lời của bạn..."
            rows={3}
            className="w-full rounded-md border-[1.5px] border-surface-border bg-postcard px-3 py-2 text-sm resize-none mb-3"
          />
          <Button disabled={!answerText.trim()} loading={answerMutation.isPending} onClick={() => answerMutation.mutate()}>
            Gửi trả lời
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
