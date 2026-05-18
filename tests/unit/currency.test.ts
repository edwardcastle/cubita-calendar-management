import { describe, it, expect } from "vitest";
import { fmtCurrency } from "@/lib/utils/currency";

describe("fmtCurrency", () => {
  it("formats with currency code", () => {
    // happy-dom may omit thousands separator; match "2500" or "2.500" / "2,500"
    expect(fmtCurrency(2500, "EUR")).toMatch(/2[.,]?500/);
  });
  it("renders em-dash for nulls", () => {
    expect(fmtCurrency(null, "EUR")).toBe("—");
    expect(fmtCurrency(2500, null)).toBe("—");
  });
});
