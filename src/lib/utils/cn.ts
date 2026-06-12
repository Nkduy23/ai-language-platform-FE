// cn() - merge Tailwind classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes an toàn, tránh conflict
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
