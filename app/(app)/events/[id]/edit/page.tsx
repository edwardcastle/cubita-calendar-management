import { notFound, redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { EventForm } from "../../_components/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  if (profile?.role !== "manager") redirect("/agenda");

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!event) notFound();

  const { data: artists } = await supabase.from("artists").select("id, name").order("name");

  return (
    <section className="px-4 py-6 space-y-6">
      <h2 className="text-lg font-semibold">Editar fecha</h2>
      <EventForm
        mode="edit"
        artists={artists ?? []}
        defaults={{
          id: event.id,
          artist_id: event.artist_id,
          event_date: event.event_date,
          show_time: event.show_time,
          soundcheck_time: event.soundcheck_time,
          timezone: event.timezone,
          status: event.status,
          country_code: event.country_code,
          city: event.city,
          venue_name: event.venue_name,
          festival_name: event.festival_name,
          fee_amount: event.fee_amount,
          fee_currency: event.fee_currency,
          promoter_name: event.promoter_name,
          promoter_email: event.promoter_email,
          promoter_phone: event.promoter_phone,
          notes: event.notes,
        }}
      />
    </section>
  );
}
