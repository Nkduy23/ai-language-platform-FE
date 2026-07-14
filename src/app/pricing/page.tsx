// Trang bảng giá công khai — chọn plan rồi chuyển sang checkout (yêu cầu đăng nhập)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import PostmarkStamp from "@/components/shared/motifs/PostmarkStamp";
import AirmailBorder from "@/components/shared/motifs/AirmailBorder";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: plans, isLoading } = useQuery({ queryKey: ["subscription-plans"], queryFn: subscriptionsApi.getPlans });

  const handleSelectPlan = (plan: string) => {
    if (plan === "FREE") {
      router.push(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER);
      return;
    }
    router.push(isAuthenticated ? `${ROUTES.PROFILE}?upgrade=${plan.toLowerCase()}` : ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-postcard paper-texture">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl mb-3">Chọn gói phù hợp với bạn</h1>
        <p className="text-ink-muted mb-12">Học Anh, Trung, Nhật cùng AI — nâng cấp bất cứ lúc nào</p>

        {isLoading ? (
          <p className="text-ink-muted/70">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans?.map((p) => {
              const isPremium = p.plan === "PREMIUM";
              const isPro = p.plan === "PRO";
              return (
                <div
                  key={p.plan}
                  className={cn(
                    "relative rounded-md p-6 text-left bg-postcard",
                    isPremium && "border-[2.5px] border-gold-foil shadow-stamp-gold scale-105",
                    isPro && "border-[1.5px] border-airmail/40 shadow-stamp",
                    !isPremium && !isPro && "border-[1.5px] border-paper-line",
                  )}
                >
                  {isPro && <AirmailBorder position="all" />}
                  {isPremium && (
                    <PostmarkStamp label="RECOMMENDED •" color="gold-foil" size={64} rotate={10} className="absolute -top-6 -right-4">
                      ★
                    </PostmarkStamp>
                  )}
                  <h3 className="text-lg font-display font-bold text-ink-navy mt-2">{p.plan}</h3>
                  <p className="text-3xl font-display font-bold text-ink-navy my-3">
                    {p.priceVnd === 0 ? "Miễn phí" : `${p.priceVnd.toLocaleString("vi-VN")}đ`}
                    {p.priceVnd > 0 && <span className="text-sm text-ink-muted font-sans font-normal">/tháng</span>}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                        <Check className="w-4 h-4 text-stamp-teal shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button fullWidth variant={isPremium || isPro ? "primary" : "secondary"} onClick={() => handleSelectPlan(p.plan)}>
                    {p.plan === "FREE" ? "Bắt đầu miễn phí" : `Chọn ${p.plan}`}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
