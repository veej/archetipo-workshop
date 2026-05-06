import { describe, it, expect } from "vitest";
import { formatDateRange } from "@/lib/utils";

describe("formatDateRange", () => {
  it("same-month range: 15–22 lug 2025", () => {
    const result = formatDateRange(new Date(2025, 6, 15), new Date(2025, 6, 22));
    expect(result).toBe("15–22 lug 2025");
  });

  it("cross-month same-year: 28 apr – 3 mag 2025", () => {
    const result = formatDateRange(new Date(2025, 3, 28), new Date(2025, 4, 3));
    expect(result).toBe("28 apr – 3 mag 2025");
  });

  it("cross-year: 28 dic 2025 – 3 gen 2026", () => {
    const result = formatDateRange(new Date(2025, 11, 28), new Date(2026, 0, 3));
    expect(result).toBe("28 dic 2025 – 3 gen 2026");
  });

  it("single-day (start === end): produces start–end format", () => {
    const result = formatDateRange(new Date(2025, 6, 15), new Date(2025, 6, 15));
    expect(result).toBe("15–15 lug 2025");
  });
});
