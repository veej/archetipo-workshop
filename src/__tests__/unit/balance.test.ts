import { describe, it, expect } from "vitest";
import { computeBalance } from "@/lib/trips";

describe("computeBalance", () => {
  it("nessuna spesa (null, null) → 0", () => {
    expect(computeBalance(null, null)).toBe(0);
  });

  it("solo pagante: ha pagato 100, non deve nulla → +100", () => {
    expect(computeBalance(100, null)).toBe(100);
  });

  it("solo debitore: non ha pagato, deve 50 → -50", () => {
    expect(computeBalance(null, 50)).toBe(-50);
  });

  it("mix: ha pagato 100, deve 75 → +25", () => {
    expect(computeBalance(100, 75)).toBe(25);
  });

  it("mix: ha pagato 30, deve 80 → -50", () => {
    expect(computeBalance(30, 80)).toBe(-50);
  });

  it("pagato e dovuto uguali → 0 (saldo in pareggio)", () => {
    expect(computeBalance(50, 50)).toBe(0);
  });

  it("valori con decimali sono calcolati correttamente", () => {
    expect(computeBalance(100.5, 75.25)).toBeCloseTo(25.25);
  });
});
