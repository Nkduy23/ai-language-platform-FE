// Admin layout — chặn truy cập nếu không phải role ADMIN
"use client";

import { useEffect } from "react";
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
  const { user, isAuthenticated, authChecked } = useAuthStore();

  useEffect(() => {
    // Chờ /auth/me trả về xong (qua useAuthInit ở providers.tsx) mới quyết định —
    // đảm bảo luôn dùng role MỚI NHẤT từ DB, không phải role cũ cache trong localStorage.
    if (!authChecked) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [authChecked, isAuthenticated, user, router]);

  if (!authChecked || !isAuthenticated || user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-postcard flex">
      <aside className="w-56 bg-ink-navy border-r border-ink-navy-dark p-4 space-y-1">
        <p className="text-xs font-semibold text-postcard/50 px-3 mb-3 uppercase tracking-wide">Admin</p>
        {ADMIN_NAV.map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-postcard/70 hover:bg-white/10 hover:text-postcard transition-colors")}>
            <item.icon className="w-4 h-4" /> {item.label}
          </Link>
        ))}
        <Link href={ROUTES.DASHBOARD} className="block mt-6 px-3 text-xs text-postcard/50 hover:text-airmail">
          ← Về trang chính
        </Link>
      </aside>
      <main className="flex-1 p-8 bg-postcard">{children}</main>
    </div>
  );
}
