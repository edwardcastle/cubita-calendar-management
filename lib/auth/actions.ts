"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { env } from "@/lib/env";

const credentialsSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

const magicLinkSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type AuthFormState =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function signInWithPassword(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: error.message };
  redirect("/agenda");
}

export async function signUpManager(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const supabase = await getSupabaseServer();
  // IMPORTANT: never pass `data` (raw_user_meta_data) here. C1 mitigation.
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/callback` },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "Revisa tu email para confirmar la cuenta." };
}

export async function sendMagicLink(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = magicLinkSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Email inválido" };
  }
  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/callback` },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "Enlace mágico enviado. Revisa tu correo." };
}

export async function signOut() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
