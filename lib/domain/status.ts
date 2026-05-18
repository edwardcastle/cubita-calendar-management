import type { Database } from "@/lib/supabase/types";

export type EventStatus = Database["public"]["Enums"]["event_status"];
export type DisplayStatus = EventStatus | "completed";

export const STATUS_LABELS: Record<DisplayStatus, string> = {
  possible: "Posible",
  hold: "Hold",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

export const STATUS_CLASSES: Record<DisplayStatus, string> = {
  possible:  "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
  hold:      "bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-amber-50",
  confirmed: "bg-emerald-200 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-50",
  cancelled: "bg-rose-200 text-rose-900 dark:bg-rose-700 dark:text-rose-50",
  completed: "bg-sky-200 text-sky-900 dark:bg-sky-700 dark:text-sky-50",
};

export function displayStatus(row: { status: EventStatus; is_completed: boolean }): DisplayStatus {
  return row.is_completed ? "completed" : row.status;
}

export const STATUS_OPTIONS: readonly EventStatus[] = ["possible", "hold", "confirmed", "cancelled"] as const;
