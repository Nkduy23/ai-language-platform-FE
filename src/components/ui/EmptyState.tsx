// Empty state dùng chung — khi user chưa có dữ liệu (chưa học từ nào, chưa có
// câu hỏi cộng đồng nào...). Có 1 con dấu bưu điện làm minh hoạ thay vì để
// trống trơn, đúng tinh thần "chưa có dấu mộc nào ở đây" trong voice & copy
// của skill thiết kế.
import type { LucideIcon } from "lucide-react";
import PostmarkStamp from "@/components/shared/motifs/PostmarkStamp";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4 ${className ?? ""}`}>
      <PostmarkStamp color="ink-navy" size={80} rotate={-8} className="mb-5 opacity-70">
        <Icon className="w-7 h-7" />
      </PostmarkStamp>
      <h3 className="font-display font-semibold text-ink-navy text-base sm:text-lg mb-1.5">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
}
