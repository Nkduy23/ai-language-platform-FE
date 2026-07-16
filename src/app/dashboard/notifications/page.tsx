// Notification Center — danh sách đầy đủ thông báo (khác với dropdown nhỏ ở Navbar/Sidebar)
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Bell, Flame, MessageSquare, ThumbsUp, Award, Info } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { notificationsApi } from "@/lib/api/notifications";
import type { NotificationType } from "@/types";
import { cn } from "@/lib/utils/cn";

const TYPE_ICON: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  STREAK_REMINDER: { icon: Flame, color: "bg-gold-foil/15 text-gold-foil" },
  WEEKLY_REPORT: { icon: Award, color: "bg-ink-navy/10 text-ink-navy" },
  COMMUNITY_ANSWER: { icon: MessageSquare, color: "bg-airmail/15 text-airmail" },
  COMMUNITY_LIKE: { icon: ThumbsUp, color: "bg-stamp-teal/15 text-stamp-teal" },
  BADGE_EARNED: { icon: Award, color: "bg-gold-foil/15 text-gold-foil" },
  SYSTEM: { icon: Info, color: "bg-postcard-dark text-ink-muted" },
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["notifications"], queryFn: notificationsApi.list });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <DashboardLayout title="Thông báo" description="Toàn bộ thông báo của bạn">
      <div className="max-w-2xl mx-auto space-y-4">
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} loading={markAllMutation.isPending}>
              Đánh dấu tất cả đã đọc ({unreadCount})
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!isLoading && notifications.length === 0 && <EmptyState icon={Bell} title="Chưa có thông báo nào" description="Thông báo về streak, câu trả lời cộng đồng, huy hiệu mới... sẽ xuất hiện ở đây." />}

        {!isLoading &&
          notifications.map((n) => {
            const { icon: Icon, color } = TYPE_ICON[n.type] ?? TYPE_ICON.SYSTEM;
            return (
              <Link
                key={n.id}
                href={n.link ?? "#"}
                onClick={() => !n.isRead && markReadMutation.mutate(n.id)}
                className="block"
              >
                <Card hover className={cn("flex items-start gap-3", !n.isRead && "border-airmail/30 bg-airmail/5")}>
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink-navy">{n.title}</p>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-airmail flex-shrink-0 mt-1.5" />}
                    </div>
                    {n.body && <p className="text-sm text-ink-muted mt-0.5">{n.body}</p>}
                    <p className="text-xs text-ink-muted/70 mt-1.5">{new Date(n.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
      </div>
    </DashboardLayout>
  );
}
