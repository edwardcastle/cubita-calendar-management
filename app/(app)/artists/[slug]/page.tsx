import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Edit } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/domain/StatusChip";
import { CountryFlag } from "@/components/domain/CountryFlag";
import { getSupabaseServer } from "@/lib/supabase/server";
import { fmtDate, fmtTime } from "@/lib/utils/date";
import { displayStatus } from "@/lib/domain/status";
import { InviteButton } from "./InviteButton";

export default async function ArtistDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  if (profile?.role !== "manager") redirect("/agenda");

  const { data: artist } = await supabase
    .from("artists")
    .select("id, name, slug, notes, user_id")
    .eq("slug", slug)
    .maybeSingle();
  if (!artist) notFound();

  const { data: events } = await supabase
    .from("events_view")
    .select("id, event_date, status, is_completed, city, country_code, venue_name, show_time")
    .eq("artist_id", artist.id)
    .order("event_date", { ascending: false })
    .limit(50);

  return (
    <section className="px-4 py-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">{artist.name}</h2>
        <p className="text-xs text-muted-foreground">/{artist.slug}</p>
      </header>

      <div className="flex gap-2">
        {!artist.user_id && <InviteButton artistId={artist.id} />}
        <Link
          href={`/artists/${artist.slug}/edit`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Edit className="w-4 h-4 mr-1" /> Editar
        </Link>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Últimas fechas</h3>
        {!events || events.length === 0 ? (
          <Card className="p-4 text-sm text-muted-foreground">Aún no hay fechas.</Card>
        ) : (
          <ul className="space-y-2">
            {events.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.id}`}>
                  <Card className="p-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {fmtDate(e.event_date!)} · {fmtTime(e.show_time ?? null)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <CountryFlag code={e.country_code!} /> · {e.venue_name}
                        {e.city ? `, ${e.city}` : ""}
                      </p>
                    </div>
                    <StatusChip
                      status={displayStatus({
                        status: e.status!,
                        is_completed: e.is_completed ?? false,
                      })}
                    />
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
