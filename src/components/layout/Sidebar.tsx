"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Brain, MessageCircle, Mic, Map, User, LogOut, Zap, Flame, GraduationCap, Users, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { href: ROUTES.LEARN, label: "Từ vựng", icon: BookOpen },
  { href: ROUTES.GRAMMAR, label: "Ngữ pháp", icon: GraduationCap },
  { href: ROUTES.QUIZ, label: "Quiz", icon: Brain },
  { href: ROUTES.CHAT, label: "AI Chat", icon: MessageCircle },
  { href: ROUTES.SPEAKING, label: "Speaking", icon: Mic },
  { href: ROUTES.ROADMAP, label: "Lộ trình", icon: Map },
  { href: ROUTES.COMMUNITY, label: "Cộng đồng", icon: Users },
  { href: ROUTES.PROFILE, label: "Hồ sơ", icon: User },
];

interface SidebarProps {
  /** Sidebar mở dạng drawer trên mobile/tablet (< lg). Trên desktop luôn hiển thị. */
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout(); // BE xoá httpOnly cookie
    } catch {
      // Kể cả lỗi vẫn cứ logout ở FE để user không bị kẹt
    }
    logout();
    toast.success("Đã đăng xuất");
    onClose?.();
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      {/* Overlay — chỉ hiện trên mobile/tablet khi drawer mở */}
      {open && <div className="fixed inset-0 bg-ink-navy-dark/60 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={cn(
          "w-64 h-screen bg-ink-navy border-r-[1.5px] border-ink-navy-dark flex flex-col fixed left-0 top-0 z-50 transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:z-30",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <Link href={ROUTES.LEARN} className="flex items-center gap-3 min-w-0" onClick={onClose}>
            <div className="w-9 h-9 bg-airmail rounded-md flex items-center justify-center shadow-stamp-sm flex-shrink-0">
              <span className="text-lg">🌐</span>
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-postcard text-sm leading-none truncate">AI Language</p>
              <p className="text-xs text-postcard/50 mt-0.5">Platform</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 -mr-1.5 rounded-md text-postcard/50 hover:bg-white/10 hover:text-postcard flex-shrink-0" aria-label="Đóng menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 mx-3 mt-3 bg-white/5 border border-white/10 rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-airmail rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-postcard text-sm font-semibold">{user.displayName?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-postcard truncate">{user.displayName}</p>
                <p className="text-xs text-postcard/50 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 border-l-[3px]",
                  active ? "bg-white/10 text-postcard border-airmail" : "text-postcard/60 border-transparent hover:bg-white/5 hover:text-postcard",
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-airmail" : "text-postcard/40")} />
                {label}
                {href === ROUTES.CHAT && <span className="ml-auto text-xs bg-gold-foil text-ink-navy px-1.5 py-0.5 rounded-full font-semibold">AI</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-md font-mono">
            <div className="flex items-center gap-1.5 text-gold-foil">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-semibold">0 ngày</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-airmail">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold">0 XP</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-postcard/60 hover:bg-airmail/20 hover:text-airmail transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
