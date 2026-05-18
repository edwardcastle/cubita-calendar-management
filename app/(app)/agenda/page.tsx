import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function AgendaPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  const isManager = profile?.role === "manager";

  return (
    <section className="px-4 py-8 text-center space-y-6">
      <CalendarPlus className="mx-auto w-14 h-14 text-muted-foreground" aria-hidden />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          {isManager ? "Aún no tienes fechas agendadas" : "Aún no tienes fechas"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isManager
            ? "Crea tu primer evento para verlo aquí."
            : "Cuando tu manager agende una fecha, aparecerá aquí."}
        </p>
      </div>
      {isManager && (
        <Link href="/events/new" className={buttonVariants({ className: "h-11" })}>
          Crear primera fecha
        </Link>
      )}
    </section>
  );
}
