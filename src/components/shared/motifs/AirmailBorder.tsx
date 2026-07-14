// Diagonal red/navy striped strip, like the border of an international airmail
// envelope. Use as a thin accent on hero sections, feature images, or wrap it
// around Premium/Pro pricing cards.
import { cn } from "@/lib/utils/cn";

interface AirmailBorderProps {
  /** Where the strip sits relative to its container */
  position?: "top" | "bottom" | "left" | "right" | "all";
  thickness?: number;
  className?: string;
}

export default function AirmailBorder({ position = "top", thickness = 8, className }: AirmailBorderProps) {
  if (position === "all") {
    return (
      <div
        className={cn("absolute inset-0 pointer-events-none rounded-md p-[3px] -z-10", className)}
        style={{
          background: "repeating-linear-gradient(45deg, #E8543F 0px, #E8543F 10px, transparent 10px, transparent 20px, #1B2A4C 20px, #1B2A4C 30px, transparent 30px, transparent 40px)",
        }}
      />
    );
  }

  const positionClasses = {
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
    left: "top-0 bottom-0 left-0",
    right: "top-0 bottom-0 right-0",
  };
  const isVertical = position === "left" || position === "right";

  return (
    <div
      className={cn("absolute airmail-border", positionClasses[position], className)}
      style={isVertical ? { width: thickness } : { height: thickness }}
    />
  );
}
