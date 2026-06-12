// Reusable Button with variants
import { cn } from "@/lib/utils/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark focus:ring-brand",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300",
    outline: "border border-brand text-brand bg-transparent hover:bg-blue-50 focus:ring-brand",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2",
  };

  return (
    <button ref={ref} disabled={disabled || loading} className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
