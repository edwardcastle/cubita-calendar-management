"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { COUNTRIES } from "@/lib/domain/countries";
import { STATUS_OPTIONS, STATUS_LABELS } from "@/lib/domain/status";
import { createEvent, updateEvent, type ActionResult } from "@/lib/actions/events";

type Artist = { id: string; name: string };

type Defaults = {
  id?: string;
  artist_id?: string;
  event_date?: string;
  show_time?: string | null;
  soundcheck_time?: string | null;
  timezone?: string;
  status?: (typeof STATUS_OPTIONS)[number];
  country_code?: string;
  city?: string | null;
  venue_name?: string;
  festival_name?: string | null;
  fee_amount?: number | null;
  fee_currency?: string | null;
  promoter_name?: string | null;
  promoter_email?: string | null;
  promoter_phone?: string | null;
  notes?: string | null;
};

type Props = {
  mode: "create" | "edit";
  artists: Artist[];
  defaults?: Defaults;
};

export function EventForm({ mode, artists, defaults = {} }: Props) {
  const action = mode === "create" ? createEvent : updateEvent;
  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-6 pb-32">
      {mode === "edit" && <input type="hidden" name="id" value={defaults.id} />}

      <Card className="p-4 space-y-4">
        <h3 className="text-sm font-medium">Show</h3>
        <div className="space-y-2">
          <Label htmlFor="artist_id">Artista</Label>
          <select
            id="artist_id"
            name="artist_id"
            required
            defaultValue={defaults.artist_id ?? ""}
            className="w-full h-10 rounded-md border bg-background px-3"
          >
            <option value="" disabled>
              Elegir…
            </option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="event_date">Fecha</Label>
            <Input
              id="event_date"
              name="event_date"
              type="date"
              required
              defaultValue={defaults.event_date}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              name="status"
              defaultValue={defaults.status ?? "possible"}
              className="w-full h-10 rounded-md border bg-background px-3"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="show_time">Hora show</Label>
            <Input
              id="show_time"
              name="show_time"
              type="time"
              defaultValue={defaults.show_time ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="soundcheck_time">Soundcheck</Label>
            <Input
              id="soundcheck_time"
              name="soundcheck_time"
              type="time"
              defaultValue={defaults.soundcheck_time ?? ""}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Zona horaria</Label>
          <Input
            id="timezone"
            name="timezone"
            defaultValue={defaults.timezone ?? "UTC"}
            placeholder="Europe/Madrid"
          />
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="text-sm font-medium">Ubicación</h3>
        <div className="space-y-2">
          <Label htmlFor="country_code">País</Label>
          <select
            id="country_code"
            name="country_code"
            required
            defaultValue={defaults.country_code ?? ""}
            className="w-full h-10 rounded-md border bg-background px-3"
          >
            <option value="" disabled>
              Elegir país…
            </option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" name="city" defaultValue={defaults.city ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue_name">Local / venue</Label>
          <Input id="venue_name" name="venue_name" required defaultValue={defaults.venue_name ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="festival_name">Festival</Label>
          <Input id="festival_name" name="festival_name" defaultValue={defaults.festival_name ?? ""} />
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="text-sm font-medium">Dinero</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="fee_amount">Caché</Label>
            <Input
              id="fee_amount"
              name="fee_amount"
              inputMode="decimal"
              defaultValue={defaults.fee_amount != null ? String(defaults.fee_amount) : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee_currency">Moneda</Label>
            <Input
              id="fee_currency"
              name="fee_currency"
              maxLength={3}
              defaultValue={defaults.fee_currency ?? ""}
              placeholder="EUR"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="text-sm font-medium">Promotor</h3>
        <div className="space-y-2">
          <Label htmlFor="promoter_name">Nombre</Label>
          <Input id="promoter_name" name="promoter_name" defaultValue={defaults.promoter_name ?? ""} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="promoter_email">Email</Label>
            <Input
              id="promoter_email"
              name="promoter_email"
              type="email"
              defaultValue={defaults.promoter_email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="promoter_phone">Teléfono</Label>
            <Input
              id="promoter_phone"
              name="promoter_phone"
              type="tel"
              defaultValue={defaults.promoter_phone ?? ""}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          defaultValue={defaults.notes ?? ""}
        />
      </Card>

      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="fixed bottom-16 inset-x-0 px-4 pb-3 pt-3 bg-background/95 backdrop-blur border-t z-30">
        <Button type="submit" disabled={pending} className="w-full h-12">
          {pending ? "Guardando…" : mode === "create" ? "Crear fecha" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
