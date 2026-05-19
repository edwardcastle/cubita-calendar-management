import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function ArtistsPage() {
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

  const { data: artists } = await supabase
    .from("artists")
    .select("id, name, slug, user_id")
    .order("name", { ascending: true });

  return (
    <section className="px-4 py-6 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Artistas</h2>
        <Link href="/artists/new" className={buttonVariants({ size: "sm", className: "h-9" })}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo
        </Link>
      </header>

      {!artists || artists.length === 0 ? (
        <Card className="p-8 text-center space-y-3">
          <UserPlus className="mx-auto w-10 h-10 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">No tienes artistas aún.</p>
          <Link href="/artists/new" className={buttonVariants()}>Crear primer artista</Link>
        </Card>
      ) : (
        <ul className="space-y-2">
          {artists.map((a) => (
            <li key={a.id}>
              <Link href={`/artists/${a.slug}`} className="block">
                <Card className="p-4 flex items-center justify-between">
                  <span className="font-medium">{a.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.user_id ? "Vinculado" : "Sin invitar"}
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
