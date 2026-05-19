"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusChip } from "@/components/domain/StatusChip";
import {
  displayStatus,
  STATUS_CLASSES,
  type DisplayStatus,
  type EventStatus,
} from "@/lib/domain/status";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  event_date: string;
  status: EventStatus;
  is_completed: boolean | null;
  venue_name: string;
  city: string | null;
  artists: { name: string } | null;
};

export function MonthGrid({ rows, initial }: { rows: Row[]; initial?: string }) {
  const [cursor, setCursor] = useState<Date>(initial ? parseISO(initial) : startOfMonth(new Date()));
  const [dayOpen, setDayOpen] = useState<string | null>(null);
  const x = useMotionValue(0);

  const monthLabel = format(cursor, "LLLL yyyy", { locale: es });
  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) }),
    [cursor]
  );
  // Make Monday=0 (Sun=6 in date-fns getDay default).
  const leadingBlanks = (getDay(startOfMonth(cursor)) + 6) % 7;

  const byDay = useMemo(() => {
    const map = new Map<string, Row[]>();
    rows.forEach((r) => {
      const arr = map.get(r.event_date) ?? [];
      arr.push(r);
      map.set(r.event_date, arr);
    });
    return map;
  }, [rows]);

  const dayEvents = dayOpen ? (byDay.get(dayOpen) ?? []) : [];

  return (
    <div className="px-4 space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setCursor((c) => subMonths(c, 1))} className="p-2" type="button" aria-label="Mes anterior">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-semibold capitalize">{monthLabel}</h3>
        <button onClick={() => setCursor((c) => addMonths(c, 1))} className="p-2" type="button" aria-label="Mes siguiente">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) setCursor((c) => addMonths(c, 1));
          else if (info.offset.x > 60) setCursor((c) => subMonths(c, 1));
        }}
        className="grid grid-cols-7 gap-1"
      >
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`b-${i}`} />
        ))}
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const evs = byDay.get(key) ?? [];
          return (
            <button
              key={key}
              onClick={() => evs.length > 0 && setDayOpen(key)}
              type="button"
              className={cn(
                "aspect-square rounded-md border flex flex-col items-center justify-start p-1 text-xs",
                evs.length > 0 && "bg-card cursor-pointer"
              )}
            >
              <span className="text-foreground">{format(d, "d")}</span>
              <div className="mt-auto flex gap-0.5">
                {evs.slice(0, 2).map((e) => {
                  const s = displayStatus({ status: e.status, is_completed: e.is_completed ?? false });
                  return <span key={e.id} className={cn("w-1.5 h-1.5 rounded-full", dotColor(s))} />;
                })}
                {evs.length > 2 && <span className="text-[10px] leading-none">+{evs.length - 2}</span>}
              </div>
            </button>
          );
        })}
      </motion.div>

      <Sheet open={!!dayOpen} onOpenChange={(o) => !o && setDayOpen(null)}>
        <SheetContent side="bottom" className="space-y-3">
          <SheetHeader>
            <SheetTitle>
              {dayOpen && format(parseISO(dayOpen), "EEEE d 'de' LLLL", { locale: es })}
            </SheetTitle>
          </SheetHeader>
          <ul className="space-y-2">
            {dayEvents.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.id}`} className="block p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{e.artists?.name ?? "—"}</p>
                    <StatusChip
                      status={displayStatus({ status: e.status, is_completed: e.is_completed ?? false })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {e.venue_name}
                    {e.city ? `, ${e.city}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function dotColor(s: DisplayStatus) {
  // Use only the bg- portion of STATUS_CLASSES (no text-).
  return STATUS_CLASSES[s].split(" ").find((c) => c.startsWith("bg-")) ?? "bg-slate-400";
}
