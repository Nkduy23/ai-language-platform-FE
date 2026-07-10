// Profile page — thông tin tài khoản, tiến trình, quản lý subscription
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { User, Flame, Award, Crown } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import UpgradePrompt from "@/components/shared/UpgradePrompt";
import { usersApi } from "@/lib/api/users";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [showUpgrade, setShowUpgrade] = useState(!!searchParams.get("upgrade"));

  const { data: profile } = useQuery({ queryKey: ["users-me"], queryFn: usersApi.getMe });
  const { data: streak } = useQuery({ queryKey: ["users-streak"], queryFn: usersApi.getStreak });
  const { data: subscription } = useQuery({
    queryKey: ["subscription-current"],
    queryFn: subscriptionsApi.getCurrent,
    retry: false,
  });

  const plan = subscription?.plan ?? "FREE";

  return (
    <DashboardLayout title="Hồ sơ" description="Thông tin tài khoản và tiến trình">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 sm:w-7 sm:h-7 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate">{user?.displayName ?? user?.email}</p>
            <p className="text-xs sm:text-sm text-slate-500 truncate">{user?.email}</p>
          </div>
          <Badge variant={plan === "FREE" ? "default" : "success"}>{plan}</Badge>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="flex items-center gap-2 sm:gap-3">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{streak?.streakDays ?? 0}</p>
              <p className="text-xs text-slate-500">Ngày streak</p>
            </div>
          </Card>
          <Card className="flex items-center gap-2 sm:gap-3">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 flex-shrink-0" />
            <div>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{streak?.totalXp ?? 0}</p>
              <p className="text-xs text-slate-500">Tổng XP</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" /> Gói hiện tại: {plan}
            </h3>
          </div>
          {subscription?.expiresAt && <p className="text-xs text-slate-500 mb-3">Hết hạn: {new Date(subscription.expiresAt).toLocaleDateString("vi-VN")}</p>}
          {plan === "FREE" && <Button onClick={() => setShowUpgrade(true)}>Nâng cấp Premium/Pro</Button>}
        </Card>
      </div>

      <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </DashboardLayout>
  );
}
