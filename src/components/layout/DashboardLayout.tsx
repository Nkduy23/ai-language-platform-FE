"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Thanh trên cùng — chỉ hiện trên mobile/tablet, chứa nút mở menu */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-postcard border-b-[1.5px] border-paper-line">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 flex-shrink-0" aria-label="Mở menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-900 text-sm truncate flex-1">{title ?? "AI Language"}</span>
          <NotificationBell />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="hidden lg:flex items-start justify-between mb-8">
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

          {/* Mô tả trang — hiện trên mobile/tablet dưới thanh trên cùng */}
          {description && <p className="lg:hidden text-slate-500 text-sm mb-6">{description}</p>}

          {children}
        </div>
      </main>
    </div>
  );
}
