import { vi, describe, it, expect, beforeEach } from "vitest";

// --- Mocks ---

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tripParticipant: { findUnique: vi.fn() },
    itineraryStop: { findMany: vi.fn() },
  },
}));

// --- Typed imports ---

import { prisma } from "@/lib/prisma";
import { getItineraryStops } from "@/lib/itinerary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;

// --- Constants ---

const TRIP_ID = "trip-123";
const USER_ID = "user-abc";

const mockTrip = {
  id: TRIP_ID,
  name: "Roma 2026",
  destination: "Roma, Italia",
  startDate: new Date("2026-08-15"),
  endDate: new Date("2026-08-22"),
  coverKey: "roma",
};

// --- Helpers ---

function setupParticipant(overrides: { status?: string; role?: string } = {}) {
  mockPrisma.tripParticipant.findUnique.mockResolvedValue({
    trip: mockTrip,
    status: overrides.status ?? "ACTIVE",
    role: overrides.role ?? "PARTICIPANT",
  });
}

function setupEmptyStops() {
  mockPrisma.itineraryStop.findMany.mockResolvedValue([]);
}

// --- Tests ---

describe("getItineraryStops — autorizzazione", () => {
  beforeEach(() => vi.clearAllMocks());

  it("non-partecipante (findUnique → null) → restituisce null", async () => {
    mockPrisma.tripParticipant.findUnique.mockResolvedValue(null);

    const result = await getItineraryStops(TRIP_ID, USER_ID);

    expect(result).toBeNull();
  });

  it("partecipante con status DEACTIVATED → restituisce null", async () => {
    setupParticipant({ status: "DEACTIVATED" });

    const result = await getItineraryStops(TRIP_ID, USER_ID);

    expect(result).toBeNull();
    expect(mockPrisma.itineraryStop.findMany).not.toHaveBeenCalled();
  });
});

describe("getItineraryStops — dati restituiti", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupParticipant();
    setupEmptyStops();
  });

  it("partecipante attivo senza tappe → { stops: [], role, trip }", async () => {
    const result = await getItineraryStops(TRIP_ID, USER_ID);

    expect(result).not.toBeNull();
    expect(result!.stops).toEqual([]);
    expect(result!.role).toBe("PARTICIPANT");
    expect(result!.trip).toMatchObject({ id: TRIP_ID });
  });

  it("restituisce le informazioni del viaggio correttamente", async () => {
    const result = await getItineraryStops(TRIP_ID, USER_ID);

    expect(result!.trip).toMatchObject({
      id: TRIP_ID,
      name: "Roma 2026",
      destination: "Roma, Italia",
    });
  });

  it("restituisce il ruolo del partecipante", async () => {
    setupParticipant({ role: "ORGANIZER" });

    const result = await getItineraryStops(TRIP_ID, USER_ID);

    expect(result!.role).toBe("ORGANIZER");
  });

  it("restituisce le tappe restituite da findMany", async () => {
    const stops = [
      {
        id: "stop-1",
        name: "Visita Colosseo",
        date: new Date("2026-08-16"),
        time: "10:00",
        address: "Piazza del Colosseo",
        notes: null,
      },
      {
        id: "stop-2",
        name: "Cena a Trastevere",
        date: new Date("2026-08-16"),
        time: "20:00",
        address: "Trastevere, Roma",
        notes: "Prenotare",
      },
    ];
    mockPrisma.itineraryStop.findMany.mockResolvedValue(stops);

    const result = await getItineraryStops(TRIP_ID, USER_ID);

    expect(result!.stops).toEqual(stops);
  });
});

describe("getItineraryStops — query parameters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupParticipant();
    setupEmptyStops();
  });

  it("itineraryStop.findMany è chiamato con il tripId corretto", async () => {
    await getItineraryStops(TRIP_ID, USER_ID);

    expect(mockPrisma.itineraryStop.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tripId: TRIP_ID },
      })
    );
  });

  it("itineraryStop.findMany è ordinato per date asc poi time asc", async () => {
    await getItineraryStops(TRIP_ID, USER_ID);

    expect(mockPrisma.itineraryStop.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ date: "asc" }, { time: "asc" }],
      })
    );
  });

  it("tripParticipant.findUnique è chiamato con tripId e userId corretti", async () => {
    await getItineraryStops(TRIP_ID, USER_ID);

    expect(mockPrisma.tripParticipant.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tripId_userId: { tripId: TRIP_ID, userId: USER_ID } },
      })
    );
  });

  it("itineraryStop.findMany NON è chiamato quando il partecipante è null", async () => {
    mockPrisma.tripParticipant.findUnique.mockResolvedValue(null);

    await getItineraryStops(TRIP_ID, USER_ID);

    expect(mockPrisma.itineraryStop.findMany).not.toHaveBeenCalled();
  });
});
