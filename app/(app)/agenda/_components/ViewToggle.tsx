"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CalendarRange, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle({ value }: { value: "list" | "month" }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function setView(v: "list" | "month") {
    const next = new URLSearchParams(sp);
    next.set("view", v);
    router.replace(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="inline-flex rounded-md border bg-background p-0.5">
      <button
        onClick={() => setView("list")}
        className={cn("px-3 py-1.5 text-xs rounded", value === "list" && "bg-muted")}
        type="button"
      >
        <List className="inline w-3.5 h-3.5 mr-1" /> Lista
      </button>
      <button
        onClick={() => setView("month")}
        className={cn("px-3 py-1.5 text-xs rounded", value === "month" && "bg-muted")}
        type="button"
      >
        <CalendarRange className="inline w-3.5 h-3.5 mr-1" /> Mes
      </button>
    </div>
  );
}
