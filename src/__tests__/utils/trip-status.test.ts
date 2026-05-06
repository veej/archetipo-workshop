import { describe, it, expect } from "vitest";
import { getTripStatus, formatDateRange } from "@/lib/utils";

describe("getTripStatus", () => {
  it("restituisce 'past' quando la data di fine è nel passato", () => {
    const start = new Date(2024, 0, 1); // 1 gen 2024
    const end = new Date(2024, 0, 15); // 15 gen 2024
    expect(getTripStatus(start, end)).toBe("past");
  });

  it("restituisce 'ongoing' quando oggi è dentro il range (start passato, end futuro)", () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 3); // 3 giorni fa
    const end = new Date(today);
    end.setDate(today.getDate() + 3); // 3 giorni nel futuro
    expect(getTripStatus(start, end)).toBe("ongoing");
  });

  it("restituisce 'ongoing' quando il viaggio inizia esattamente oggi", () => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(today.getDate() + 5);
    expect(getTripStatus(start, end)).toBe("ongoing");
  });

  it("restituisce 'ongoing' quando il viaggio finisce esattamente oggi", () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 5);
    const end = new Date(today);
    expect(getTripStatus(start, end)).toBe("ongoing");
  });

  it("restituisce 'upcoming' quando la data di inizio è nel futuro", () => {
    const start = new Date(2099, 5, 1); // 1 giu 2099
    const end = new Date(2099, 5, 15); // 15 giu 2099
    expect(getTripStatus(start, end)).toBe("upcoming");
  });
});

describe("getTripStatus × formatDateRange — cross-check viaggio ongoing", () => {
  it("un viaggio ongoing (oggi dentro il range) produce la stringa data corretta", () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 2); // iniziato 2 giorni fa
    const end = new Date(today);
    end.setDate(today.getDate() + 5); // finisce tra 5 giorni

    const status = getTripStatus(start, end);
    expect(status).toBe("ongoing");

    const dateString = formatDateRange(start, end);
    // La stringa deve contenere il giorno di inizio e di fine — verifica struttura minima
    expect(typeof dateString).toBe("string");
    expect(dateString.length).toBeGreaterThan(0);
    // Start day deve comparire nella stringa
    const startDay = start.getDate().toString();
    expect(dateString).toContain(startDay);
  });
});
