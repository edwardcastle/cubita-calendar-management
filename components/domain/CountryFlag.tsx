import { findCountry } from "@/lib/domain/countries";

export function CountryFlag({ code, showName = true }: { code: string; showName?: boolean }) {
  const c = findCountry(code);
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span aria-hidden>{c.flag}</span>
      {showName && <span>{c.name}</span>}
    </span>
  );
}
