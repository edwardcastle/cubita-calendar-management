"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword, sendMagicLink, type AuthFormState } from "@/lib/auth/actions";

type Mode = "password" | "magic";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("password");
  const action = mode === "password" ? signInWithPassword : sendMagicLink;
  const [state, formAction, pending] = useActionState<AuthFormState | undefined, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" required />
      </div>
      {mode === "password" && (
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} />
        </div>
      )}
      {state && !state.ok && <p className="text-sm text-destructive" role="alert">{state.error}</p>}
      {state && state.ok && state.message && <p className="text-sm text-emerald-600">{state.message}</p>}
      <Button type="submit" className="w-full h-11" disabled={pending}>
        {pending ? "Procesando…" : mode === "password" ? "Entrar" : "Enviar enlace"}
      </Button>
      <button
        type="button"
        className="text-sm text-muted-foreground underline w-full text-center"
        onClick={() => setMode((m) => (m === "password" ? "magic" : "password"))}
      >
        {mode === "password" ? "Usar enlace mágico" : "Usar contraseña"}
      </button>
    </form>
  );
}
