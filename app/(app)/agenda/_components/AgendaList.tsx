import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/domain/StatusChip";
import { CountryFlag } from "@/components/domain/CountryFlag";
import { groupByMonth, fmtTime } from "@/lib/utils/date";
import { displayStatus, type EventStatus } from "@/lib/domain/status";

type Row = {
  id: string;
  event_date: string;
  show_time: string | null;
  status: EventStatus;
  is_completed: boolean | null;
  country_code: string;
  city: string | null;
  venue_name: string;
  artists: { name: string } | null;
};

export function AgendaList({ rows }: { rows: Row[] }) {
  const groups = groupByMonth(rows);
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section key={g.monthKey} className="space-y-2">
          <h3 className="sticky top-14 z-10 bg-background/95 backdrop-blur px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b">
            {g.monthLabel}
          </h3>
          <ul className="px-4 space-y-2">
            {g.items.map((e) => {
              const day = e.event_date.slice(-2);
              const status = displayStatus({ status: e.status, is_completed: e.is_completed ?? false });
              return (
                <li key={e.id}>
                  <Link href={`/events/${e.id}`}>
                    <Card className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md border flex flex-col items-center justify-center shrink-0">
                        <span className="text-lg font-semibold leading-none">{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{e.artists?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {e.venue_name}
                          {e.city ? `, ${e.city}` : ""} ·{" "}
                          <CountryFlag code={e.country_code} showName={false} /> · {fmtTime(e.show_time)}
                        </p>
                      </div>
                      <StatusChip status={status} />
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
