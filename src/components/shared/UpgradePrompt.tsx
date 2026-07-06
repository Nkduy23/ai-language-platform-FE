// Premium upgrade CTA
// Modal gợi ý nâng cấp Premium/Pro — hiện khi hết lượt Free hoặc bấm tính năng bị khoá
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import type { CheckoutGateway } from "@/types";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  reason?: string; // vd: "Bạn đã dùng hết 10 tin nhắn miễn phí hôm nay"
}

export default function UpgradePrompt({ open, onClose, reason }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "pro">("premium");
  const [gateway, setGateway] = useState<CheckoutGateway>("stripe");

  const { data: plans } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: subscriptionsApi.getPlans,
    enabled: open,
  });

  const checkoutMutation = useMutation({
    mutationFn: () => subscriptionsApi.checkout(selectedPlan, gateway),
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: () => toast.error("Không tạo được link thanh toán, thử lại nhé"),
  });

  const paidPlans = plans?.filter((p) => p.plan !== "FREE") ?? [];

  return (
    <Modal open={open} onClose={onClose} title="Nâng cấp gói" size="lg">
      {reason && <p className="text-sm text-slate-500 mb-4">{reason}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {paidPlans.map((p) => {
          const key = p.plan.toLowerCase() as "premium" | "pro";
          return (
            <button
              key={p.plan}
              onClick={() => setSelectedPlan(key)}
              className={cn("text-left rounded-xl border-2 p-4 transition-colors", selectedPlan === key ? "border-brand bg-brand/5" : "border-surface-border")}
            >
              <p className="font-semibold text-slate-900">{p.plan}</p>
              <p className="text-2xl font-bold text-brand my-1">
                {p.priceVnd.toLocaleString("vi-VN")}đ<span className="text-sm text-slate-400 font-normal">/tháng</span>
              </p>
              <ul className="space-y-1 mt-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setGateway("stripe")}
          className={cn("flex-1 rounded-lg border px-3 py-2 text-sm", gateway === "stripe" ? "border-brand bg-brand/5 text-brand" : "border-surface-border text-slate-600")}
        >
          💳 Thẻ quốc tế (Stripe)
        </button>
        <button
          onClick={() => setGateway("vnpay")}
          className={cn("flex-1 rounded-lg border px-3 py-2 text-sm", gateway === "vnpay" ? "border-brand bg-brand/5 text-brand" : "border-surface-border text-slate-600")}
        >
          🏦 VNPay (ATM/QR)
        </button>
      </div>

      <Button fullWidth loading={checkoutMutation.isPending} onClick={() => checkoutMutation.mutate()}>
        Thanh toán {selectedPlan.toUpperCase()}
      </Button>
    </Modal>
  );
}
