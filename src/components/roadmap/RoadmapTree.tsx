// Sơ đồ lộ trình A1→C2, mỗi mốc đọc như 1 con dấu bưu điện đã/chưa đóng
import { cn } from "@/lib/utils/cn";
import type { CefrLevel } from "@/types";

const LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function RoadmapTree({ currentLevel }: { currentLevel: CefrLevel }) {
  const currentIndex = LEVELS.indexOf(currentLevel);

  return (
    <div className="flex items-center justify-between overflow-x-auto">
      {LEVELS.map((level, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={level} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold font-mono flex-shrink-0 transition-all",
                  isCurrent && "border-[2.5px] border-airmail bg-airmail text-postcard scale-110 shadow-stamp-sm",
                  isDone && !isCurrent && "border-2 border-dashed border-stamp-teal bg-stamp-teal/10 text-stamp-teal",
                  !isDone && !isCurrent && "border-2 border-dashed border-paper-line text-ink-muted/50",
                )}
              >
                {level}
              </div>
              {isCurrent && <span className="text-[10px] sm:text-xs text-airmail font-medium whitespace-nowrap">Hiện tại</span>}
            </div>
            {i < LEVELS.length - 1 && <div className={cn("h-0.5 flex-1 mx-0.5 sm:mx-1 min-w-[8px]", i < currentIndex ? "bg-stamp-teal" : "bg-paper-line")} />}
          </div>
        );
      })}
    </div>
  );
}
