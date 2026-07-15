// Community Q&A — danh sách câu hỏi + đăng câu hỏi mới
"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, ThumbsUp, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { communityApi } from "@/lib/api/community";
import type { LanguageCode } from "@/types";
import toast from "react-hot-toast";

export default function CommunityPage() {
  const queryClient = useQueryClient();
  const [showAsk, setShowAsk] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data } = useQuery({ queryKey: ["community-questions"], queryFn: () => communityApi.listQuestions() });

  const createMutation = useMutation({
    mutationFn: () => communityApi.createQuestion({ language, title, content }),
    onSuccess: () => {
      toast.success("Đã đăng câu hỏi!");
      setShowAsk(false);
      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["community-questions"] });
    },
  });

  return (
    <DashboardLayout title="Cộng đồng" description="Hỏi đáp ngữ pháp, chia sẻ kinh nghiệm học">
      <div className="max-w-2xl mx-auto space-y-4">
        <Button onClick={() => setShowAsk(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Đặt câu hỏi
        </Button>

        {data?.data.map((q) => (
          <Link key={q.id} href={`/community/${q.id}`}>
            <Card hover className="cursor-pointer">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-slate-900">{q.title}</h3>
                <span className="text-xs text-brand shrink-0 ml-2">{q.language.code}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">{q.content}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> {q._count.answers} trả lời
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" /> {q._count.likes} thích
                </span>
                <span>{q.user.profile?.displayName ?? "Ẩn danh"}</span>
              </div>
            </Card>
          </Link>
        ))}

        {data?.data.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="Chưa có câu hỏi nào"
            description="Hãy là người đầu tiên đặt câu hỏi cho cộng đồng học ngoại ngữ!"
            action={
              <Button onClick={() => setShowAsk(true)} className="gap-2">
                <MessageSquare className="w-4 h-4" /> Đặt câu hỏi đầu tiên
              </Button>
            }
          />
        )}
      </div>

      <Modal open={showAsk} onClose={() => setShowAsk(false)} title="Đặt câu hỏi mới">
        <div className="space-y-4">
          <LanguageSelector value={language} onChange={setLanguage} />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề câu hỏi..."
            className="w-full rounded-md border-[1.5px] border-surface-border bg-postcard px-3 py-2 text-sm"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mô tả chi tiết câu hỏi của bạn..."
            rows={4}
            className="w-full rounded-md border-[1.5px] border-surface-border bg-postcard px-3 py-2 text-sm resize-none"
          />
          <Button fullWidth disabled={!title.trim() || !content.trim()} loading={createMutation.isPending} onClick={() => createMutation.mutate()}>
            Đăng câu hỏi
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
