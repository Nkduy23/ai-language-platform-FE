// Dashboard wrapper layout
"use client";

import { useEffect } from "react";
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Redirect về login nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Page header */}
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
