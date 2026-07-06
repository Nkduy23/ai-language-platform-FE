"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants/routes";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Kiểm tra cả store lẫn localStorage
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken");

    if (!isAuthenticated || !hasToken) {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, isAuthenticated, router]);

  // Tránh flash trước khi check xong
  if (!mounted) return null;

  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  if (!isAuthenticated || !hasToken) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {title && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {description && <p className="text-slate-500 mt-1 text-sm">{description}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
