// Admin layout — chặn truy cập nếu không phải role ADMIN
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FileText } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

const ADMIN_NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/blog", label: "Blog CMS", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace(ROUTES.DASHBOARD);
      return;
    }
    setChecked(true);
  }, [isAuthenticated, user, router]);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-white border-r border-surface-border p-4 space-y-1">
        <p className="text-xs font-semibold text-slate-400 px-3 mb-3 uppercase tracking-wide">Admin</p>
        {ADMIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100",
            )}
          >
            <item.icon className="w-4 h-4" /> {item.label}
          </Link>
        ))}
        <Link href={ROUTES.DASHBOARD} className="block mt-6 px-3 text-xs text-slate-400 hover:text-brand">
          ← Về trang chính
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
