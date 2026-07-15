// Community Q&A — danh sách câu hỏi + đăng câu hỏi mới
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, ThumbsUp, Plus, Search, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { communityApi } from "@/lib/api/community";
import { LANGUAGES } from "@/lib/constants/app";
import type { LanguageCode } from "@/types";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

export default function CommunityPage() {
  const queryClient = useQueryClient();
  const [showAsk, setShowAsk] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Bộ lọc danh sách
  const [filterLang, setFilterLang] = useState<LanguageCode | "">("");
  const [search, setSearch] = useState("");
  const [resolvedOnly, setResolvedOnly] = useState(false);

  const { data } = useQuery({
    queryKey: ["community-questions", filterLang],
    queryFn: () => communityApi.listQuestions(filterLang || undefined),
  });

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

  // Tìm kiếm theo tiêu đề/nội dung + lọc "đã giải quyết" — xử lý phía FE trên
  // trang dữ liệu hiện có (BE list endpoint chưa hỗ trợ full-text search)
  const filtered = useMemo(() => {
    let items = data?.data ?? [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((item) => item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q));
    }
    if (resolvedOnly) {
      items = items.filter((item) => item.hasAcceptedAnswer);
    }
    return items;
  }, [data, search, resolvedOnly]);

  return (
    <DashboardLayout title="Cộng đồng" description="Hỏi đáp ngữ pháp, chia sẻ kinh nghiệm học">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button onClick={() => setShowAsk(true)} className="sm:flex-shrink-0">
            <Plus className="w-4 h-4 mr-1.5" /> Đặt câu hỏi
          </Button>
          <div className="flex-1">
            <Input placeholder="Tìm câu hỏi theo từ khoá..." leftIcon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Lọc theo ngôn ngữ + trạng thái */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterLang("")}
            className={cn(
              "px-3 py-1.5 rounded-md border-[1.5px] text-sm font-medium transition-colors",
              filterLang === "" ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30",
            )}
          >
            Tất cả ngôn ngữ
          </button>
          {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
            <button
              key={code}
              onClick={() => setFilterLang(code)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md border-[1.5px] text-sm font-medium transition-colors",
                filterLang === code ? "border-airmail bg-airmail/10 text-airmail" : "border-surface-border text-ink-muted hover:border-ink-navy/30",
              )}
            >
              <span>{LANGUAGES[code].flag}</span> {code}
            </button>
          ))}

          <div className="hidden sm:block w-px h-5 bg-paper-line mx-1" />

          <button
            onClick={() => setResolvedOnly((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md border-[1.5px] text-sm font-medium transition-colors",
              resolvedOnly ? "border-stamp-teal bg-stamp-teal/10 text-stamp-teal" : "border-surface-border text-ink-muted hover:border-ink-navy/30",
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã giải quyết
          </button>
        </div>

        {filtered.map((q) => (
          <Link key={q.id} href={`/community/${q.id}`}>
            <Card hover className="cursor-pointer">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-ink-navy">{q.title}</h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {q.hasAcceptedAnswer && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-stamp-teal bg-stamp-teal/10 px-1.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Đã giải quyết
                    </span>
                  )}
                  <span className="text-xs text-airmail font-mono">{q.language.code}</span>
                </div>
              </div>
              <p className="text-sm text-ink-muted line-clamp-2 mb-3">{q.content}</p>
              <div className="flex items-center gap-4 text-xs text-ink-muted/70">
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

        {data && filtered.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title={search || resolvedOnly || filterLang ? "Không tìm thấy câu hỏi phù hợp" : "Chưa có câu hỏi nào"}
            description={search || resolvedOnly || filterLang ? "Thử đổi từ khoá hoặc bỏ bớt bộ lọc xem sao." : "Hãy là người đầu tiên đặt câu hỏi cho cộng đồng học ngoại ngữ!"}
            action={
              !(search || resolvedOnly || filterLang) && (
                <Button onClick={() => setShowAsk(true)} className="gap-2">
                  <MessageSquare className="w-4 h-4" /> Đặt câu hỏi đầu tiên
                </Button>
              )
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
