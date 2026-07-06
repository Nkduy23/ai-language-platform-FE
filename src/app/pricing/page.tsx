// Trang bảng giá công khai — chọn plan rồi chuyển sang checkout (yêu cầu đăng nhập)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants/routes";

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
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Chọn gói phù hợp với bạn</h1>
        <p className="text-slate-500 mb-12">Học Anh, Trung, Nhật cùng AI — nâng cấp bất cứ lúc nào</p>

        {isLoading ? (
          <p className="text-slate-400">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans?.map((p) => (
              <div key={p.plan} className={`rounded-2xl border p-6 text-left ${p.plan === "PREMIUM" ? "border-brand shadow-lg scale-105" : "border-surface-border"}`}>
                {p.plan === "PREMIUM" && <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full">Phổ biến nhất</span>}
                <h3 className="text-lg font-bold text-slate-900 mt-2">{p.plan}</h3>
                <p className="text-3xl font-bold text-slate-900 my-3">
                  {p.priceVnd === 0 ? "Miễn phí" : `${p.priceVnd.toLocaleString("vi-VN")}đ`}
                  {p.priceVnd > 0 && <span className="text-sm text-slate-400 font-normal">/tháng</span>}
                </p>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Button fullWidth variant={p.plan === "PREMIUM" ? "primary" : "secondary"} onClick={() => handleSelectPlan(p.plan)}>
                  {p.plan === "FREE" ? "Bắt đầu miễn phí" : `Chọn ${p.plan}`}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
