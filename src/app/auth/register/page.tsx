// Register page
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthPassportPanel from "@/components/shared/AuthPassportPanel";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants/routes";

const schema = z
  .object({
    displayName: z.string().min(2, "Tên tối thiểu 2 ký tự").max(50),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(50),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const PERKS = ["Flashcard thông minh với phát âm chuẩn", "Quiz theo cấp độ CEFR A1 → C2", "AI Chat như người bản ngữ thật", "Theo dõi tiến trình học tập"];

export default function RegisterPage() {
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
      const res = await authApi.register({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
      setUser(res.user);
      toast.success("Đăng ký thành công! Chào mừng bạn 🎉");
      router.push(ROUTES.ONBOARDING);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Đăng ký thất bại";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-postcard">
      <AuthPassportPanel
        title={
          <>
            Học ngoại ngữ
            <br />
            <span className="text-airmail italic">cùng AI thông minh</span>
          </>
        }
        subtitle="Tham gia miễn phí và bắt đầu hành trình học tiếng Anh, Trung, Nhật ngay hôm nay."
      >
        <ul className="space-y-3 mt-8">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-sm text-postcard/80">
              <div className="flex-shrink-0 w-5 h-5 bg-stamp-teal/20 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-stamp-teal" />
              </div>
              {perk}
            </li>
          ))}
        </ul>
      </AuthPassportPanel>

      {/* Right — Form */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-airmail rounded-md mb-4 shadow-stamp">
              <span className="text-2xl">🌐</span>
            </div>
          </div>

          <div className="bg-postcard rounded-md shadow-stamp border-[1.5px] border-paper-line p-6 sm:p-8">
            <h1 className="text-xl mb-1">Tạo tài khoản</h1>
            <p className="text-sm text-ink-muted mb-6">Miễn phí, không cần thẻ tín dụng</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Tên hiển thị" placeholder="Nguyễn Văn A" leftIcon={<User className="w-4 h-4" />} error={errors.displayName?.message} {...register("displayName")} />

              <Input label="Email" type="email" placeholder="email@example.com" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} {...register("email")} />

              <div className="relative">
                <Input
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  hint="Tối thiểu 8 ký tự"
                  {...register("password")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-ink-muted hover:text-ink-navy">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-2">
                Đăng ký miễn phí
              </Button>
            </form>

            <p className="text-center text-sm text-ink-muted mt-6">
              Đã có tài khoản?{" "}
              <Link href={ROUTES.LOGIN} className="text-airmail font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
