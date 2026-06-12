// formatDate, formatScore helpers
import type { CefrLevel } from "@/types";

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k XP`;
  return `${xp} XP`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${diffDays} ngày trước`;
}

export function getLevelColor(level: CefrLevel): string {
  const colors: Record<CefrLevel, string> = {
    A1: "text-green-600 bg-green-100",
    A2: "text-teal-600 bg-teal-100",
    B1: "text-blue-600 bg-blue-100",
    B2: "text-purple-600 bg-purple-100",
    C1: "text-orange-600 bg-orange-100",
    C2: "text-red-600 bg-red-100",
  };
  return colors[level] ?? "text-gray-600 bg-gray-100";
}

export function getGradeColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}
