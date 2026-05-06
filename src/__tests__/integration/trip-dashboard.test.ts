import { vi, describe, it, expect, beforeEach } from "vitest";

// --- Mocks ---

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tripParticipant: { findUnique: vi.fn() },
    itineraryStop:   { findMany: vi.fn() },
    document:        { findMany: vi.fn() },
    expense:         { aggregate: vi.fn() },
    expenseParticipant: { aggregate: vi.fn() },
  },
}));

// --- Typed imports ---

import { prisma } from "@/lib/prisma";
import { getTripDashboard } from "@/lib/trips";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;

// --- Helpers ---

const TRIP_ID  = "trip-123";
const USER_ID  = "user-abc";

const mockTrip = {
  id: TRIP_ID,
  name: "Tokyo 2026",
  destination: "Tokyo, Giappone",
  startDate: new Date("2026-08-15"),
  endDate:   new Date("2026-08-28"),
  coverKey: "tokyo",
};

function setupParticipant(overrides: { status?: string; role?: string } = {}) {
  mockPrisma.tripParticipant.findUnique.mockResolvedValue({
    trip: mockTrip,
    status: overrides.status ?? "ACTIVE",
    role:   overrides.role   ?? "PARTICIPANT",
  });
}

function setupEmptyData() {
  mockPrisma.itineraryStop.findMany.mockResolvedValue([]);
  mockPrisma.document.findMany.mockResolvedValue([]);
  mockPrisma.expense.aggregate.mockResolvedValue({ _sum: { amount: null } });
  mockPrisma.expenseParticipant.aggregate.mockResolvedValue({ _sum: { amount: null } });
}

// --- Tests ---

describe("getTripDashboard — autorizzazione", () => {
  beforeEach(() => vi.clearAllMocks());

  it("non-partecipante (findUnique → null) → restituisce null", async () => {
    mockPrisma.tripParticipant.findUnique.mockResolvedValue(null);

    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result).toBeNull();
  });

  it("trip inesistente (findUnique → null) → restituisce null", async () => {
    // Indistinguibile dal caso non-partecipante: non riveliamo se il trip esiste
    mockPrisma.tripParticipant.findUnique.mockResolvedValue(null);

    const result = await getTripDashboard("trip-che-non-esiste", USER_ID);

    expect(result).toBeNull();
  });

  it("partecipante con status DEACTIVATED → restituisce null", async () => {
    setupParticipant({ status: "DEACTIVATED" });

    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result).toBeNull();
  });
});

describe("getTripDashboard — dati viaggio vuoto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupParticipant();
    setupEmptyData();
  });

  it("restituisce todayStops: [] quando non ci sono tappe oggi", async () => {
    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result).not.toBeNull();
    expect(result!.todayStops).toEqual([]);
  });

  it("restituisce recentDocuments: [] quando non ci sono documenti", async () => {
    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result!.recentDocuments).toEqual([]);
  });

  it("restituisce balance: 0 quando non ci sono spese", async () => {
    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result!.balance).toBe(0);
  });

  it("restituisce le informazioni del viaggio correttamente", async () => {
    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result!.trip).toMatchObject({
      id: TRIP_ID,
      name: "Tokyo 2026",
      destination: "Tokyo, Giappone",
    });
  });

  it("restituisce il ruolo del partecipante", async () => {
    setupParticipant({ role: "ORGANIZER" });
    setupEmptyData();

    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result!.role).toBe("ORGANIZER");
  });
});

describe("getTripDashboard — calcolo saldo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupParticipant();
    mockPrisma.itineraryStop.findMany.mockResolvedValue([]);
    mockPrisma.document.findMany.mockResolvedValue([]);
  });

  it("saldo positivo quando l'utente ha pagato più di quanto deve", async () => {
    mockPrisma.expense.aggregate.mockResolvedValue({ _sum: { amount: 100 } });
    mockPrisma.expenseParticipant.aggregate.mockResolvedValue({ _sum: { amount: 30 } });

    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result!.balance).toBe(70);
  });

  it("saldo negativo quando l'utente deve più di quanto ha pagato", async () => {
    mockPrisma.expense.aggregate.mockResolvedValue({ _sum: { amount: null } });
    mockPrisma.expenseParticipant.aggregate.mockResolvedValue({ _sum: { amount: 45 } });

    const result = await getTripDashboard(TRIP_ID, USER_ID);

    expect(result!.balance).toBe(-45);
  });
});

describe("getTripDashboard — query parameters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupParticipant();
    setupEmptyData();
  });

  it("itineraryStop.findMany è chiamato con il tripId corretto", async () => {
    await getTripDashboard(TRIP_ID, USER_ID);

    expect(mockPrisma.itineraryStop.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ tripId: TRIP_ID }) })
    );
  });

  it("document.findMany è chiamato con take: 3", async () => {
    await getTripDashboard(TRIP_ID, USER_ID);

    expect(mockPrisma.document.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3 })
    );
  });

  it("document.findMany è ordinato per createdAt desc", async () => {
    await getTripDashboard(TRIP_ID, USER_ID);

    expect(mockPrisma.document.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "desc" } })
    );
  });

  it("expense.aggregate filtra per paidById = userId", async () => {
    await getTripDashboard(TRIP_ID, USER_ID);

    expect(mockPrisma.expense.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ paidById: USER_ID }),
      })
    );
  });
});
