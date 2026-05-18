"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import {
  artistCreateSchema,
  artistUpdateSchema,
  artistInviteSchema,
} from "@/lib/schemas/artist";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export async function createArtist(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = artistCreateSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const { error } = await supabase
    .from("artists")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      notes: parsed.data.notes ?? null,
      manager_id: user.id,
    });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/artists");
  redirect(`/artists/${parsed.data.slug}`);
}

export async function updateArtist(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = artistUpdateSchema.safeParse({
    name: formData.get("name") ?? undefined,
    slug: formData.get("slug") ?? undefined,
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await getSupabaseServer();
  // Build update payload, converting undefined notes to null for the DB.
  const payload: {
    name?: string;
    slug?: string;
    notes?: string | null;
  } = {};
  if (parsed.data.name !== undefined) payload.name = parsed.data.name;
  if (parsed.data.slug !== undefined) payload.slug = parsed.data.slug;
  if ("notes" in parsed.data) payload.notes = parsed.data.notes ?? null;
  const { error } = await supabase.from("artists").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/artists");
  if (parsed.data.slug) revalidatePath(`/artists/${parsed.data.slug}`);
  return { ok: true, message: "Artista actualizado" };
}

export async function deleteArtist(id: string): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("artists").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/artists");
  redirect("/artists");
}

export async function inviteArtist(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = artistInviteSchema.safeParse({
    artist_id: formData.get("artist_id"),
    email: formData.get("email"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  // Authorization: caller must own the artist (RLS filters the SELECT).
  const supabase = await getSupabaseServer();
  const { data: art } = await supabase
    .from("artists")
    .select("id")
    .eq("id", parsed.data.artist_id)
    .maybeSingle();
  if (!art) return { ok: false, error: "No autorizado" };

  const admin = getSupabaseAdmin();
  const { error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { artist_id: parsed.data.artist_id },
    redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/callback`,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true, message: `Invitación enviada a ${parsed.data.email}` };
}
