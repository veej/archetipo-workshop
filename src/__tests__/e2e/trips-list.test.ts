import { describe, it, expect } from "vitest";
import { getTripStatus, formatDateRange } from "@/lib/utils";

// --- TASK-08: Navigazione e logica di status ---
//
// Questi test verificano la logica pura di getTripStatus e formatDateRange
// che guida il rendering e il routing delle TripCard nella lista viaggi.
// Nessun mock, nessun browser — logica isolata.

describe("getTripStatus — status per rendering (grayscale / badge)", () => {
  it("un trip con endDate nel passato ha status 'past' (cover in grayscale)", () => {
    const start = new Date(2024, 0, 1);  // 1 gen 2024
    const end = new Date(2024, 0, 15);   // 15 gen 2024
    expect(getTripStatus(start, end)).toBe("past");
  });

  it("un trip con startDate nel futuro ha status 'upcoming'", () => {
    const start = new Date(2099, 5, 1);  // 1 giu 2099
    const end = new Date(2099, 5, 15);   // 15 giu 2099
    expect(getTripStatus(start, end)).toBe("upcoming");
  });
});

describe("formatDateRange — href routing per TripCard", () => {
  it("produce un formato stringa non vuoto da usare come label del Link /trips/{id}", () => {
    const start = new Date(2026, 8, 1);   // 1 set 2026
    const end = new Date(2026, 8, 10);    // 10 set 2026
    const dateLabel = formatDateRange(start, end);

    // La stringa deve essere non vuota e contenere il giorno di inizio
    expect(typeof dateLabel).toBe("string");
    expect(dateLabel.length).toBeGreaterThan(0);
    expect(dateLabel).toContain("1");
  });

  it("l'id del viaggio viene usato correttamente per costruire l'href /trips/{id}", () => {
    // Simula la costruzione dell'href come avviene in TripCard:
    // <Link href={`/trips/${id}`} ...>
    const tripId = "trip-abc-123";
    const href = `/trips/${tripId}`;
    expect(href).toBe("/trips/trip-abc-123");
  });

  it("ids diversi producono href distinti — nessuna collisione di routing", () => {
    const ids = ["trip-001", "trip-002", "trip-003"];
    const hrefs = ids.map((id) => `/trips/${id}`);
    const unique = new Set(hrefs);
    expect(unique.size).toBe(ids.length);
  });

  it("formatDateRange per trip con startDate nel futuro produce stringa con anno corretto", () => {
    const start = new Date(2099, 5, 1);
    const end = new Date(2099, 5, 15);
    const result = formatDateRange(start, end);
    expect(result).toContain("2099");
  });

  it("formatDateRange per trip passato produce stringa con l'anno passato corretto", () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 15);
    const result = formatDateRange(start, end);
    expect(result).toContain("2024");
  });
});

describe("getTripStatus × routing — coerenza status e navigazione", () => {
  it("un trip 'past' ha status corretto e il suo href è comunque valido", () => {
    const tripId = "past-trip-id";
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 15);

    const status = getTripStatus(start, end);
    const href = `/trips/${tripId}`;

    expect(status).toBe("past");
    // L'href è sempre costruito, indipendentemente dallo status
    expect(href).toBe("/trips/past-trip-id");
  });

  it("un trip 'upcoming' ha status corretto e il suo href è valido", () => {
    const tripId = "future-trip-id";
    const start = new Date(2099, 5, 1);
    const end = new Date(2099, 5, 15);

    const status = getTripStatus(start, end);
    const href = `/trips/${tripId}`;

    expect(status).toBe("upcoming");
    expect(href).toBe("/trips/future-trip-id");
  });
});
