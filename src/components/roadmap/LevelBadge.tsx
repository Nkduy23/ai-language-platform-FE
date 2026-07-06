// CEFR level badge
// Badge hiển thị CEFR level hiện tại — dùng lại màu từ Badge.tsx cho nhất quán
import type { CefrLevel } from "@/types";
import Badge from "@/components/ui/Badge";

export default function LevelBadge({ level }: { level: CefrLevel }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Badge level={level} className="text-sm px-3 py-1">
        {level}
      </Badge>
    </div>
  );
}
