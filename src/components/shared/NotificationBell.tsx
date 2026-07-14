// Chuông thông báo — dropdown danh sách notification, đánh dấu đã đọc
"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import { notificationsApi } from "@/lib/api/notifications";
import { cn } from "@/lib/utils/cn";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.list,
    refetchInterval: 60_000, // poll mỗi phút — chưa có WebSocket/push realtime
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
        <Bell className="w-5 h-5 text-ink-muted" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-airmail rounded-full" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-80 bg-postcard rounded-md border-[1.5px] border-surface-border shadow-stamp z-40 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2.5 border-b-[1.5px] border-surface-border">
              <span className="text-sm font-semibold text-ink-navy">Thông báo</span>
              {unreadCount > 0 && (
                <button onClick={() => markAllMutation.mutate()} className="text-xs text-airmail hover:underline">
                  Đánh dấu đã đọc hết
                </button>
              )}
            </div>

            {!data || data.data.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-8">Chưa có thông báo nào</p>
            ) : (
              data.data.map((n) => (
                <Link
                  key={n.id}
                  href={n.link ?? "#"}
                  onClick={() => !n.isRead && markReadMutation.mutate(n.id)}
                  className={cn("block px-4 py-3 border-b border-surface-border last:border-0 hover:bg-postcard-dark", !n.isRead && "bg-airmail/5")}
                >
                  <p className="text-sm font-medium text-ink-navy">{n.title}</p>
                  {n.body && <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{n.body}</p>}
                  <p className="text-xs text-ink-muted/70 mt-1">{new Date(n.createdAt).toLocaleDateString("vi-VN")}</p>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
