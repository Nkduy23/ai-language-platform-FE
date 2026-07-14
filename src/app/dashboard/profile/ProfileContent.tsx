// Profile page — thông tin tài khoản, tiến trình, quản lý subscription
"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Flame, Award, Crown, Bell, Camera } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import UpgradePrompt from "@/components/shared/UpgradePrompt";
import { usersApi } from "@/lib/api/users";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { useAuthStore } from "@/store/authStore";
import { usePushNotifications } from "@/lib/hooks/usePushNotifications";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [showUpgrade, setShowUpgrade] = useState(!!searchParams.get("upgrade"));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSupported: pushSupported, isSubscribed: pushSubscribed, loading: pushLoading, subscribe: subscribePush, unsubscribe: unsubscribePush } = usePushNotifications();

  const { data: profile } = useQuery({ queryKey: ["users-me"], queryFn: usersApi.getMe });
  const { data: streak } = useQuery({ queryKey: ["users-streak"], queryFn: usersApi.getStreak });
  const { data: subscription } = useQuery({
    queryKey: ["subscription-current"],
    queryFn: subscriptionsApi.getCurrent,
    retry: false,
  });
  const queryClient = useQueryClient();

  const avatarMutation = useMutation({
    mutationFn: (file: File) => usersApi.uploadAvatar(file),
    onSuccess: () => {
      toast.success("Đã cập nhật ảnh đại diện!");
      queryClient.invalidateQueries({ queryKey: ["users-me"] });
    },
    onError: () => toast.error("Upload ảnh thất bại, thử lại nhé"),
  });

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  const plan = subscription?.plan ?? "FREE";
  const avatarUrl = profile?.profile?.avatarUrl;

  return (
    <DashboardLayout title="Hồ sơ" description="Thông tin tài khoản và tiến trình">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="flex items-center gap-4">
          <button onClick={handleAvatarClick} className="relative w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center overflow-hidden shrink-0 group">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-brand" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-5 h-5 text-postcard" />
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{user?.displayName ?? user?.email}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <Badge variant={plan === "FREE" ? "default" : "success"}>{plan}</Badge>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-gold-foil" />
            <div>
              <p className="text-xl font-bold font-mono text-ink-navy">{streak?.streakDays ?? 0}</p>
              <p className="text-xs text-slate-500">Ngày streak</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <Award className="w-6 h-6 text-airmail" />
            <div>
              <p className="text-xl font-bold font-mono text-ink-navy">{streak?.totalXp ?? 0}</p>
              <p className="text-xs text-slate-500">Tổng XP</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-gold-foil" /> Gói hiện tại: {plan}
            </h3>
          </div>
          {subscription?.expiresAt && <p className="text-xs text-slate-500 mb-3">Hết hạn: {new Date(subscription.expiresAt).toLocaleDateString("vi-VN")}</p>}
          {plan === "FREE" && <Button onClick={() => setShowUpgrade(true)}>Nâng cấp Premium/Pro</Button>}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-brand" /> Thông báo đẩy
              </h3>
              <p className="text-xs text-slate-500 mt-1">{pushSupported ? "Nhận nhắc nhở streak, câu trả lời cộng đồng... ngay trên trình duyệt" : "Trình duyệt này không hỗ trợ thông báo đẩy"}</p>
            </div>
            {pushSupported && (
              <Button variant={pushSubscribed ? "outline" : "primary"} size="sm" loading={pushLoading} onClick={() => (pushSubscribed ? unsubscribePush() : subscribePush())}>
                {pushSubscribed ? "Tắt" : "Bật"}
              </Button>
            )}
          </div>
        </Card>
      </div>

      <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </DashboardLayout>
  );
}
