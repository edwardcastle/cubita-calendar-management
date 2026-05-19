"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createArtist, type ActionResult } from "@/lib/actions/artists";

export function ArtistForm() {
  const [state, action, pending] = useActionState<ActionResult | undefined, FormData>(
    createArtist,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required minLength={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" name="slug" required pattern="[a-z0-9-]+" placeholder="buena-vista" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <textarea
          id="notes"
          name="notes"
          className="w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full h-11" disabled={pending}>
        {pending ? "Guardando…" : "Crear artista"}
      </Button>
    </form>
  );
}
