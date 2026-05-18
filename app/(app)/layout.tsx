import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Header } from "@/components/shell/Header";
import { BottomNav } from "@/components/shell/BottomNav";

export default async function AppLayout({ children }: { children: ReactNode }) {
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
  const role = (profile?.role ?? "artist") as "manager" | "artist";

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header title="Cubita Calendar" />
      <main className="flex-1 pb-20 pt-14">{children}</main>
      <BottomNav role={role} />
    </div>
  );
}
