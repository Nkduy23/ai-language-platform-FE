"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import NotificationBell from "@/components/shared/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants/routes";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, authChecked } = useAuthStore();

  useEffect(() => {
    // Chờ useAuthInit gọi xong /auth/me rồi mới quyết định redirect,
    // tránh đá user ra ngoài trong lúc đang xác thực (cookie httpOnly nên JS
    // không thể tự kiểm tra "có token hay không" như trước nữa).
    if (!authChecked) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [authChecked, isAuthenticated, router]);

  if (!authChecked || !isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between mb-8">
            {title ? (
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {description && <p className="text-slate-500 mt-1 text-sm">{description}</p>}
              </div>
            ) : (
              <div />
            )}
            <NotificationBell />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
