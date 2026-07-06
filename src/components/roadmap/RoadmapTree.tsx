// Sơ đồ lộ trình A1→C2, highlight level hiện tại
import { cn } from "@/lib/utils/cn";
import type { CefrLevel } from "@/types";

const LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function RoadmapTree({ currentLevel }: { currentLevel: CefrLevel }) {
  const currentIndex = LEVELS.indexOf(currentLevel);

  return (
    <div className="flex items-center justify-between">
      {LEVELS.map((level, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={level} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2",
                  isCurrent && "border-brand bg-brand text-white scale-110",
                  isDone && !isCurrent && "border-green-500 bg-green-500 text-white",
                  !isDone && !isCurrent && "border-slate-200 text-slate-400",
                )}
              >
                {level}
              </div>
              {isCurrent && <span className="text-xs text-brand font-medium">Hiện tại</span>}
            </div>
            {i < LEVELS.length - 1 && <div className={cn("h-0.5 flex-1 mx-1", i < currentIndex ? "bg-green-500" : "bg-slate-200")} />}
          </div>
        );
      })}
    </div>
  );
}
