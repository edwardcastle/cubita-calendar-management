import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { EventForm } from "../_components/EventForm";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  if (profile?.role !== "manager") redirect("/agenda");

  const { data: artists } = await supabase.from("artists").select("id, name").order("name");

  return (
    <section className="px-4 py-6 space-y-6">
      <h2 className="text-lg font-semibold">Nueva fecha</h2>
      <EventForm
        mode="create"
        artists={artists ?? []}
        defaults={{
          ...(sp.artist !== undefined && { artist_id: sp.artist }),
          status: "possible",
          timezone: "UTC",
        }}
      />
    </section>
  );
}
