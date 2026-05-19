import { notFound } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/domain/StatusChip";
import { CountryFlag } from "@/components/domain/CountryFlag";
import { getSupabaseServer } from "@/lib/supabase/server";
import { fmtDate, fmtTime } from "@/lib/utils/date";
import { fmtCurrency } from "@/lib/utils/currency";
import { displayStatus } from "@/lib/domain/status";
import { deleteEvent } from "@/lib/actions/events";
import { StatusSheet } from "../_components/StatusSheet";

async function deleteAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await deleteEvent(id);
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  const isManager = profile?.role === "manager";

  const { data: e } = await supabase
    .from("events_view")
    .select("*, artists!inner(name, slug)")
    .eq("id", id)
    .maybeSingle();
  if (!e) notFound();

  const status = displayStatus({
    status: e.status!,
    is_completed: e.is_completed ?? false,
  });

  const artistRel = e.artists as { name: string; slug: string } | null;

  return (
    <section className="px-4 py-6 space-y-5">
      <header className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">
            {fmtDate(e.event_date!, "d 'de' LLLL yyyy")}
          </h2>
          <StatusChip status={status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {artistRel ? (
            <Link href={`/artists/${artistRel.slug}`} className="underline">
              {artistRel.name}
            </Link>
          ) : (
            <span>—</span>
          )}
          {e.festival_name && ` · ${e.festival_name}`}
        </p>
      </header>

      <Card className="p-4 space-y-1 text-sm">
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground">Show</h3>
        <p>Hora: {fmtTime(e.show_time)} · Soundcheck: {fmtTime(e.soundcheck_time)}</p>
        <p>Zona: {e.timezone}</p>
      </Card>

      <Card className="p-4 space-y-1 text-sm">
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground">Ubicación</h3>
        <p><CountryFlag code={e.country_code!} /></p>
        <p>{e.venue_name}{e.city ? `, ${e.city}` : ""}</p>
      </Card>

      {isManager && (
        <Card className="p-4 space-y-1 text-sm">
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground">Dinero</h3>
          <p>{fmtCurrency(e.fee_amount, e.fee_currency)}</p>
        </Card>
      )}

      {(e.promoter_name || e.promoter_email || e.promoter_phone) && (
        <Card className="p-4 space-y-1 text-sm">
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground">Promotor</h3>
          {e.promoter_name && <p>{e.promoter_name}</p>}
          {e.promoter_email && (
            <p>
              <a className="underline" href={`mailto:${e.promoter_email}`}>
                {e.promoter_email}
              </a>
            </p>
          )}
          {e.promoter_phone && (
            <p>
              <a className="underline" href={`tel:${e.promoter_phone}`}>
                {e.promoter_phone}
              </a>
            </p>
          )}
        </Card>
      )}

      {e.notes && (
        <Card className="p-4 space-y-1 text-sm whitespace-pre-wrap">
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground">Notas</h3>
          <p>{e.notes}</p>
        </Card>
      )}

      {isManager && (
        <div className="space-y-2">
          <StatusSheet eventId={e.id!} current={e.status!} />
          <div className="flex gap-2">
            <Link
              href={`/events/${e.id}/edit`}
              className={buttonVariants({ variant: "outline", className: "flex-1" })}
            >
              <Edit className="w-4 h-4 mr-1" /> Editar
            </Link>
            <form action={deleteAction} className="flex-1">
              <input type="hidden" name="id" value={e.id!} />
              <Button type="submit" variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-1" /> Eliminar
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
