// Login page
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthPassportPanel from "@/components/shared/AuthPassportPanel";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants/routes";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data);
      setUser(res.user);
      toast.success(`Chào mừng trở lại, ${res.user.displayName}!`);
      router.push(res.user.role === "ADMIN" ? "/admin" : ROUTES.DASHBOARD);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Đăng nhập thất bại";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-postcard">
      <AuthPassportPanel title="Tiếp tục hành trình học ngoại ngữ của bạn" subtitle="Đăng nhập để giữ streak, XP và tiến trình học đã đóng dấu từ trước." />

      {/* Right — Form */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center md:hidden mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-airmail rounded-md mb-4 shadow-stamp">
              <span className="text-2xl">🌐</span>
            </div>
          </div>

          <h1 className="text-2xl mb-1">Đăng nhập</h1>
          <p className="text-ink-muted mb-8 text-sm">Tiếp tục hành trình học ngoại ngữ</p>

          <div className="bg-postcard rounded-md shadow-stamp border-[1.5px] border-paper-line p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input label="Email" type="email" placeholder="email@example.com" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} {...register("email")} />

              <div className="relative">
                <Input
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register("password")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-ink-muted hover:text-ink-navy">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
                Đăng nhập
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-[1.5px] border-paper-line" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-postcard px-3 text-ink-muted">Chưa có tài khoản?</span>
              </div>
            </div>

            <Link href={ROUTES.REGISTER}>
              <Button variant="outline" fullWidth>
                Đăng ký miễn phí
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-ink-muted mt-6">Học tiếng Anh · Tiếng Trung · Tiếng Nhật cùng AI</p>
        </div>
      </div>
    </div>
  );
}
