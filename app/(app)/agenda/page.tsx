import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { EventStatus } from "@/lib/domain/status";
import { AgendaList } from "./_components/AgendaList";
import { MonthGrid } from "./_components/MonthGrid";
import { ViewToggle } from "./_components/ViewToggle";
import { FiltersSheet } from "./_components/FiltersSheet";

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string | string[];
    artist?: string | string[];
    status?: string | string[];
    country?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const rawView = Array.isArray(sp.view) ? sp.view[0] : sp.view;
  const view: "list" | "month" = rawView === "month" ? "month" : "list";
  const artistIds = toArray(sp.artist);
  const statuses = toArray(sp.status);
  const countries = toArray(sp.country);

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  const isManager = profile?.role === "manager";

  let q = supabase
    .from("events_view")
    .select(
      "id, event_date, show_time, status, is_completed, country_code, city, venue_name, artists!inner(id, name)"
    )
    .order("event_date", { ascending: true });
  if (artistIds.length) q = q.in("artist_id", artistIds);
  if (statuses.length) q = q.in("status", statuses as EventStatus[]);
  if (countries.length) q = q.in("country_code", countries);
  const { data: rows } = await q;

  const { data: artistList } = await supabase
    .from("artists")
    .select("id, name")
    .order("name");

  return (
    <section className="space-y-4">
      <div className="px-4 pt-2 flex items-center justify-between gap-2">
        <ViewToggle value={view} />
        {isManager && <FiltersSheet artists={artistList ?? []} />}
      </div>

      {!rows || rows.length === 0 ? (
        <div className="px-4 py-8 text-center space-y-4">
          <CalendarPlus className="mx-auto w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isManager ? "Aún no tienes fechas agendadas." : "Aún no tienes fechas."}
          </p>
          {isManager && (
            <Link href="/events/new" className={buttonVariants()}>
              Crear primera fecha
            </Link>
          )}
        </div>
      ) : view === "list" ? (
        <AgendaList rows={rows as never} />
      ) : (
        <MonthGrid rows={rows as never} />
      )}
    </section>
  );
}
