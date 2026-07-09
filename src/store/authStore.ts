// authStore — chỉ lưu user object để hiển thị UI ngay (optimistic), KHÔNG lưu token nữa
// Token nằm trong httpOnly cookie, JS không đọc/ghi được (đúng mục đích bảo mật)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authChecked: boolean; // đã gọi /auth/me để xác thực lại từ server chưa

  setUser: (user: AuthUser) => void;
  setAuthChecked: (checked: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      authChecked: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setAuthChecked: (checked) => set({ authChecked: checked }),

      logout: () => {
        set({ user: null, isAuthenticated: false, authChecked: true });
      },
    }),
    {
      name: "auth-storage",
      // Chỉ persist user để tránh flash "chưa đăng nhập" khi load lại trang.
      // Đây là cache HIỂN THỊ tạm thời — mọi quyết định phân quyền thật đều
      // phải dựa vào kết quả gọi /auth/me mới nhất (xem useAuthInit hook).
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
