"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import {
  eventCreateSchema,
  eventUpdateSchema,
  eventStatusSchema,
} from "@/lib/schemas/event";

type EventStatus = Database["public"]["Enums"]["event_status"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

function dataFromForm(formData: FormData): Record<string, FormDataEntryValue | null> {
  const obj: Record<string, FormDataEntryValue | null> = {};
  formData.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}

export async function createEvent(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = eventCreateSchema.safeParse(dataFromForm(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  // exactOptionalPropertyTypes: map undefined → null for nullable columns,
  // keep status / required strings as-is.
  const p = parsed.data;
  const payload = {
    artist_id: p.artist_id,
    event_date: p.event_date,
    show_time: p.show_time ?? null,
    soundcheck_time: p.soundcheck_time ?? null,
    timezone: p.timezone,
    status: p.status as EventStatus,
    country_code: p.country_code,
    city: p.city ?? null,
    venue_name: p.venue_name,
    festival_name: p.festival_name ?? null,
    fee_amount: p.fee_amount ?? null,
    fee_currency: p.fee_currency ?? null,
    promoter_name: p.promoter_name ?? null,
    promoter_email: p.promoter_email ?? null,
    promoter_phone: p.promoter_phone ?? null,
    notes: p.notes ?? null,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  revalidatePath("/agenda");
  redirect(`/events/${data.id}`);
}

export async function updateEvent(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = eventUpdateSchema.safeParse(dataFromForm(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const { id, ...rest } = parsed.data;
  // Build a typed patch — only include fields explicitly present in parsed.data,
  // mapping empty strings to null for nullable text columns.
  const patch: EventUpdate = {};
  if (rest.artist_id !== undefined) patch.artist_id = rest.artist_id;
  if (rest.event_date !== undefined) patch.event_date = rest.event_date;
  if (rest.show_time !== undefined) patch.show_time = rest.show_time ?? null;
  if (rest.soundcheck_time !== undefined) patch.soundcheck_time = rest.soundcheck_time ?? null;
  if (rest.timezone !== undefined) patch.timezone = rest.timezone;
  if (rest.status !== undefined) patch.status = rest.status as EventStatus;
  if (rest.country_code !== undefined) patch.country_code = rest.country_code;
  if (rest.city !== undefined) patch.city = rest.city ?? null;
  if (rest.venue_name !== undefined) patch.venue_name = rest.venue_name;
  if (rest.festival_name !== undefined) patch.festival_name = rest.festival_name ?? null;
  if (rest.fee_amount !== undefined) patch.fee_amount = rest.fee_amount ?? null;
  if (rest.fee_currency !== undefined) patch.fee_currency = rest.fee_currency ?? null;
  if (rest.promoter_name !== undefined) patch.promoter_name = rest.promoter_name ?? null;
  if (rest.promoter_email !== undefined) patch.promoter_email = rest.promoter_email ?? null;
  if (rest.promoter_phone !== undefined) patch.promoter_phone = rest.promoter_phone ?? null;
  if (rest.notes !== undefined) patch.notes = rest.notes ?? null;

  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("events").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/agenda");
  revalidatePath(`/events/${id}`);
  redirect(`/events/${id}`);
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/agenda");
  redirect("/agenda");
}

export async function changeEventStatus(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = eventStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("events")
    .update({ status: parsed.data.status as EventStatus })
    .eq("id", parsed.data.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/agenda");
  revalidatePath(`/events/${parsed.data.id}`);
  return { ok: true, message: "Estado actualizado" };
}
