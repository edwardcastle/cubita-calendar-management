import { describe, it, expect } from "vitest";
import { groupByMonth, fmtTime, fmtMonth } from "@/lib/utils/date";

describe("groupByMonth", () => {
  it("groups rows by YYYY-MM, sorted ascending", () => {
    const rows = [
      { event_date: "2026-05-20", id: "b" },
      { event_date: "2026-04-01", id: "a" },
      { event_date: "2026-05-02", id: "c" },
    ];
    const out = groupByMonth(rows);
    expect(out.map((g) => g.monthKey)).toEqual(["2026-04", "2026-05"]);
    expect(out[1]!.items.map((r) => r.id)).toEqual(["b", "c"]);
  });
});

describe("fmtTime", () => {
  it("trims seconds", () => {
    expect(fmtTime("21:00:00")).toBe("21:00");
  });
  it("renders em-dash for null", () => {
    expect(fmtTime(null)).toBe("—");
  });
});

describe("fmtMonth", () => {
  it("returns spanish lowercased month + year", () => {
    expect(fmtMonth("2026-05-01")).toMatch(/mayo 2026/i);
  });
});
