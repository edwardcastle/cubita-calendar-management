import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export default async function AccountPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return (
    <section className="px-4 py-6 space-y-6">
      <Card className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{profile?.full_name ?? "Sin nombre"}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Rol: {profile?.role ?? "—"}
        </p>
      </Card>
      <form action={signOut}>
        <Button type="submit" variant="destructive" className="w-full h-11">
          Cerrar sesión
        </Button>
      </form>
    </section>
  );
}
