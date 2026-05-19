"use client";

import { useState, useActionState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { changeEventStatus, type ActionResult } from "@/lib/actions/events";
import { STATUS_OPTIONS, STATUS_LABELS } from "@/lib/domain/status";
import type { Database } from "@/lib/supabase/types";
import { StatusChip } from "@/components/domain/StatusChip";

type EventStatus = Database["public"]["Enums"]["event_status"];

export function StatusSheet({ eventId, current }: { eventId: string; current: EventStatus }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionResult | undefined, FormData>(
    changeEventStatus,
    undefined
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" className="w-full justify-between" />}>
        Cambiar estado <ChevronDown className="w-4 h-4" />
      </SheetTrigger>
      <SheetContent side="bottom" className="space-y-3">
        <SheetHeader>
          <SheetTitle>Cambiar estado</SheetTitle>
        </SheetHeader>
        <ul className="space-y-2">
          {STATUS_OPTIONS.map((s) => (
            <li key={s}>
              <form action={action}>
                <input type="hidden" name="id" value={eventId} />
                <input type="hidden" name="status" value={s} />
                <Button
                  type="submit"
                  variant={current === s ? "default" : "outline"}
                  className="w-full justify-start"
                  disabled={pending}
                >
                  <StatusChip status={s} className="mr-2" /> {STATUS_LABELS[s]}
                </Button>
              </form>
            </li>
          ))}
        </ul>
        {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      </SheetContent>
    </Sheet>
  );
}
