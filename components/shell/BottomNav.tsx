"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "manager" | "artist";

const managerItems = [
  { href: "/agenda", label: "Agenda", icon: CalendarDays, primary: false },
  { href: "/artists", label: "Artistas", icon: Users, primary: false },
  { href: "/events/new", label: "Nuevo", icon: Plus, primary: true },
  { href: "/account", label: "Cuenta", icon: User, primary: false },
];

const artistItems = [
  { href: "/agenda", label: "Agenda", icon: CalendarDays, primary: false },
  { href: "/account", label: "Cuenta", icon: User, primary: false },
];

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = role === "manager" ? managerItems : artistItems;
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 pb-[env(safe-area-inset-bottom)] bg-background/95 backdrop-blur border-t z-40">
      <ul className={cn("grid h-full", role === "manager" ? "grid-cols-4" : "grid-cols-2")}>
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 text-xs",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {primary ? (
                  <span className="w-12 h-12 -mt-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </span>
                ) : (
                  <>
                    <Icon className="w-5 h-5" aria-hidden />
                    <span>{label}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
