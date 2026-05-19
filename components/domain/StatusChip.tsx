import { cn } from "@/lib/utils";
import { STATUS_CLASSES, STATUS_LABELS, type DisplayStatus } from "@/lib/domain/status";

export function StatusChip({ status, className }: { status: DisplayStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_CLASSES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
