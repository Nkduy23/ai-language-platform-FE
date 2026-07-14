// Admin — quản lý người dùng
"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Lock, Unlock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { adminApi } from "@/lib/api/admin";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () => adminApi.listUsers(page, search || undefined),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserActive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <div>
      <h1 className="text-2xl mb-6">Người dùng</h1>

      <div className="relative mb-4 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo email hoặc tên..."
          className="w-full pl-9 pr-3 py-2 rounded-md border-[1.5px] border-surface-border bg-postcard text-sm"
        />
      </div>

      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-xs text-slate-400">
              <th className="px-4 py-3">Người dùng</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">XP / Streak</th>
              <th className="px-4 py-3">Gói</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((u) => (
              <tr key={u.id} className="border-b border-surface-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{u.profile?.displayName ?? "—"}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </td>
                <td className="px-4 py-3">{u.profile?.currentLevel ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.profile?.totalXp ?? 0} XP · {u.profile?.streakDays ?? 0}🔥
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.subscription?.plan === "FREE" || !u.subscription ? "default" : "success"}>{u.subscription?.plan ?? "FREE"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <span className={u.isActive ? "text-stamp-teal" : "text-airmail"}>{u.isActive ? "Hoạt động" : "Đã khoá"}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleMutation.mutate(u.id)} className="text-slate-400 hover:text-brand" title={u.isActive ? "Khoá tài khoản" : "Mở khoá"}>
                    {u.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-md text-sm font-mono ${p === page ? "bg-airmail text-postcard" : "text-ink-muted hover:bg-postcard-dark"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
