import { format, parseISO, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

export function fmtDate(input: string | Date, pattern = "EEE d MMM"): string {
  const d = typeof input === "string" ? parseISO(input) : input;
  return format(d, pattern, { locale: es });
}

export function fmtMonth(input: string | Date): string {
  const d = typeof input === "string" ? parseISO(input) : input;
  return format(startOfMonth(d), "LLLL yyyy", { locale: es });
}

export function fmtTime(time: string | null): string {
  if (!time) return "—";
  return time.slice(0, 5);
}

export type Grouped<T> = { monthKey: string; monthLabel: string; items: T[] }[];

export function groupByMonth<T extends { event_date: string }>(rows: T[]): Grouped<T> {
  const map = new Map<string, T[]>();
  for (const r of rows) {
    const key = r.event_date.slice(0, 7); // YYYY-MM
    const arr = map.get(key) ?? [];
    arr.push(r);
    map.set(key, arr);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, items]) => ({
      monthKey,
      monthLabel: fmtMonth(`${monthKey}-01`),
      items,
    }));
}
