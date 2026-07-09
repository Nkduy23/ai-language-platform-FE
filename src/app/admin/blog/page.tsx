// Admin — quản lý Blog CMS
"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, EyeOff } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { adminApi } from "@/lib/api/admin";
import type { LanguageCode } from "@/types";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", language: "EN" as LanguageCode });

  const { data } = useQuery({ queryKey: ["admin-blog"], queryFn: () => adminApi.listAllBlogPosts() });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createBlogPost(form),
    onSuccess: () => {
      toast.success("Đã tạo bài viết (bản nháp)");
      setShowCreate(false);
      setForm({ title: "", excerpt: "", content: "", language: "EN" });
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      adminApi.updateBlogPost(id, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Blog CMS</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Bài viết mới
        </Button>
      </div>

      <div className="space-y-3">
        {(data as any)?.data?.map((post: any) => (
          <Card key={post.id} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand font-medium">{post.language}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${post.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {post.isPublished ? "Đã đăng" : "Nháp"}
                </span>
              </div>
              <p className="font-medium text-slate-900 mt-1">{post.title}</p>
              <p className="text-xs text-slate-400">/{post.slug}</p>
            </div>
            <button
              onClick={() => togglePublishMutation.mutate({ id: post.id, isPublished: !post.isPublished })}
              className="text-slate-400 hover:text-brand"
              title={post.isPublished ? "Ẩn bài viết" : "Đăng bài"}
            >
              {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </Card>
        ))}
        {(data as any)?.data?.length === 0 && <p className="text-slate-400 text-sm">Chưa có bài viết nào.</p>}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Bài viết mới" size="lg">
        <div className="space-y-3">
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value as LanguageCode })}
            className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm"
          >
            <option value="EN">🇺🇸 English</option>
            <option value="ZH">🇨🇳 Chinese</option>
            <option value="JA">🇯🇵 Japanese</option>
          </select>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Tiêu đề"
            className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm"
          />
          <input
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Mô tả ngắn (excerpt)"
            className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Nội dung bài viết..."
            rows={8}
            className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm resize-none"
          />
          <Button
            fullWidth
            disabled={!form.title || !form.excerpt || !form.content}
            loading={createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            Tạo bài viết (bản nháp)
          </Button>
        </div>
      </Modal>
    </div>
  );
}
