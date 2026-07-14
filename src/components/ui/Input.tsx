// Input field component
import { cn } from "@/lib/utils/cn";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, hint, leftIcon, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-navy mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">{leftIcon}</div>}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-md border-[1.5px] bg-postcard px-3.5 py-2.5 text-sm text-ink-navy placeholder:text-ink-muted/60",
            "focus:outline-none focus:ring-2 focus:ring-airmail focus:border-transparent",
            "disabled:bg-postcard-dark disabled:cursor-not-allowed",
            "transition-colors duration-150",
            error ? "border-airmail-dark focus:ring-airmail-dark" : "border-paper-line",
            leftIcon && "pl-10",
            className,
          )}
          {...props}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
