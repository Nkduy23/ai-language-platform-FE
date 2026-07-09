// useAuthInit — gọi GET /auth/me khi app load để lấy user MỚI NHẤT từ server
// (role, subscription... có thể đã đổi ở DB mà cache cũ trong localStorage không biết)
"use client";

import { useEffect } from "react";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export function useAuthInit() {
  const { setUser, logout, setAuthChecked, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Không có cookie thì thôi, không cần gọi API cho tốn — nhưng vẫn phải thử
    // vì FE không đọc được httpOnly cookie để biết trước có đăng nhập hay không.
    authApi
      .getMe()
      .then((me) => {
        setUser({
          id: me.id,
          email: me.email,
          displayName: me.profile?.displayName ?? me.email,
          avatarUrl: me.profile?.avatarUrl,
          role: me.role as "USER" | "ADMIN",
        });
      })
      .catch(() => {
        // 401 → chưa đăng nhập hoặc cookie hết hạn
        if (isAuthenticated) logout();
      })
      .finally(() => setAuthChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
