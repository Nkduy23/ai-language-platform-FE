// Navbar dùng chung cho các trang marketing (home, /marketing/english, /chinese, /japanese, /blog)
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout(); // BE xoá httpOnly cookie
    } catch {
      // Kể cả lỗi vẫn cứ logout ở FE để user không bị kẹt
    }
    logout();
    toast.success("Đã đăng xuất");
    router.push(ROUTES.HOME);
  };

  return (
    <nav className="border-b-[1.5px] border-paper-line sticky top-0 bg-postcard/90 backdrop-blur z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-airmail rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-base">🌐</span>
          </div>
          <span className="font-display font-bold text-ink-navy text-sm sm:text-base truncate">AI Language</span>
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link href={ROUTES.DASHBOARD} className="hidden sm:flex items-center gap-2 min-w-0 pr-1">
              <div className="w-7 h-7 bg-airmail rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-postcard text-xs font-semibold">{user.displayName?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-ink-navy truncate max-w-[120px]">{user.displayName}</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD}
              className="text-xs sm:text-sm bg-airmail text-postcard font-medium px-3 sm:px-4 py-2 rounded-md hover:bg-airmail-dark transition-colors whitespace-nowrap shadow-stamp-sm"
            >
              Vào học ngay
            </Link>
            <button onClick={handleLogout} className="p-2 rounded-md text-ink-muted hover:bg-postcard-dark hover:text-airmail transition-colors flex-shrink-0" aria-label="Đăng xuất" title="Đăng xuất">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link href={ROUTES.LOGIN} className="text-xs sm:text-sm text-ink-muted hover:text-ink-navy font-medium px-2.5 sm:px-4 py-2 whitespace-nowrap">
              Đăng nhập
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="text-xs sm:text-sm bg-airmail text-postcard font-medium px-3 sm:px-4 py-2 rounded-md hover:bg-airmail-dark transition-colors whitespace-nowrap shadow-stamp-sm"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
