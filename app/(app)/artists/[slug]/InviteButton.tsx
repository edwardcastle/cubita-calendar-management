"use client";

import { useState, useActionState } from "react";
import { UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteArtist, type ActionResult } from "@/lib/actions/artists";

export function InviteButton({ artistId }: { artistId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionResult | undefined, FormData>(
    inviteArtist,
    undefined
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" />}>
        <UserPlus className="w-4 h-4 mr-1" /> Invitar
      </SheetTrigger>
      <SheetContent side="bottom" className="space-y-4">
        <SheetHeader>
          <SheetTitle>Invitar artista por email</SheetTitle>
        </SheetHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="artist_id" value={artistId} />
          <div className="space-y-2">
            <Label htmlFor="email">Email del artista</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
          {state && state.ok && state.message && (
            <p className="text-sm text-emerald-600">{state.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Enviando…" : "Enviar invitación"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
