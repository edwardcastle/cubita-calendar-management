"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/domain/countries";
import { STATUS_OPTIONS, STATUS_LABELS } from "@/lib/domain/status";
import { cn } from "@/lib/utils";

type Artist = { id: string; name: string };

export function FiltersSheet({ artists }: { artists: Artist[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);

  function toggle(key: string, value: string) {
    const current = new Set(sp.getAll(key));
    if (current.has(value)) current.delete(value);
    else current.add(value);
    const next = new URLSearchParams(sp);
    next.delete(key);
    [...current].forEach((v) => next.append(key, v));
    router.replace(`${pathname}?${next.toString()}`);
  }

  function clear() {
    router.replace(pathname);
    setOpen(false);
  }

  const selectedArtists = new Set(sp.getAll("artist"));
  const selectedStatuses = new Set(sp.getAll("status"));
  const selectedCountries = new Set(sp.getAll("country"));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" className="h-9" />}>
        <SlidersHorizontal className="w-4 h-4" />
      </SheetTrigger>
      <SheetContent side="right" className="space-y-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <section className="space-y-2">
          <h4 className="text-xs uppercase text-muted-foreground">Artista</h4>
          <div className="flex flex-wrap gap-2">
            {artists.map((a) => (
              <button
                key={a.id}
                onClick={() => toggle("artist", a.id)}
                type="button"
                className={cn(
                  "px-3 py-1 rounded-full border text-sm",
                  selectedArtists.has(a.id) && "bg-primary text-primary-foreground"
                )}
              >
                {a.name}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="text-xs uppercase text-muted-foreground">Estado</h4>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => toggle("status", s)}
                type="button"
                className={cn(
                  "px-3 py-1 rounded-full border text-sm",
                  selectedStatuses.has(s) && "bg-primary text-primary-foreground"
                )}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="text-xs uppercase text-muted-foreground">País</h4>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => toggle("country", c.code)}
                type="button"
                className={cn(
                  "px-3 py-1 rounded-full border text-sm",
                  selectedCountries.has(c.code) && "bg-primary text-primary-foreground"
                )}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>
        </section>

        <Button variant="outline" className="w-full" onClick={clear} type="button">
          Limpiar
        </Button>
      </SheetContent>
    </Sheet>
  );
}
