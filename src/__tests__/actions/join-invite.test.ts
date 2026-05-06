import { vi, describe, it, expect, beforeEach } from "vitest";
import { joinTripByInvite } from "@/app/actions/invites";

// --- Mocks ---

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    tripInvite: { findUnique: vi.fn() },
    tripParticipant: { findUnique: vi.fn(), create: vi.fn() },
  },
}));

// --- Typed imports of mocked modules (after vi.mock hoisting) ---

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const mockCreateClient = vi.mocked(createClient);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;
const mockRevalidatePath = vi.mocked(revalidatePath);

// --- Helpers ---

function setupAuthenticatedUser(supabaseId = "supabase-user-id") {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: supabaseId } },
      }),
    },
  } as never);
}

function setupUnauthenticatedUser() {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
      }),
    },
  } as never);
}

function setupDbUser(id = "db-user-id") {
  mockPrisma.user.findUnique.mockResolvedValue({ id });
}

function setupValidInvite(overrides: Record<string, unknown> = {}) {
  mockPrisma.tripInvite.findUnique.mockResolvedValue({
    token: "valid-token",
    tripId: "trip-1",
    expiresAt: new Date(Date.now() + 86_400_000),
    trip: { id: "trip-1" },
    ...overrides,
  });
}

// --- Tests ---

describe("joinTripByInvite — autenticazione", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("restituisce errore se utente non autenticato", async () => {
    setupUnauthenticatedUser();

    const result = await joinTripByInvite("any-token");

    expect(result).toEqual({ success: false, error: "Non autenticato." });
  });
});

describe("joinTripByInvite — token non trovato", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticatedUser();
    setupDbUser();
    mockPrisma.tripInvite.findUnique.mockResolvedValue(null);
  });

  it("restituisce errore se token non esiste in DB", async () => {
    const result = await joinTripByInvite("nonexistent-token");

    expect(result).toEqual({ success: false, error: "Token non valido." });
  });
});

describe("joinTripByInvite — token scaduto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticatedUser();
    setupDbUser();
  });

  it("restituisce errore se token è scaduto", async () => {
    setupValidInvite({ expiresAt: new Date(Date.now() - 1000) });

    const result = await joinTripByInvite("expired-token");

    expect(result).toEqual({ success: false, error: "Invito scaduto." });
  });
});

describe("joinTripByInvite — join nuovo utente", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticatedUser();
    setupDbUser();
    setupValidInvite();
    mockPrisma.tripParticipant.findUnique.mockResolvedValue(null);
    mockPrisma.tripParticipant.create.mockResolvedValue({
      id: "new-participant-id",
      tripId: "trip-1",
      userId: "db-user-id",
      role: "PARTICIPANT",
      status: "ACTIVE",
    });
  });

  it("crea TripParticipant con role PARTICIPANT quando l'utente non è ancora partecipante", async () => {
    const result = await joinTripByInvite("valid-token");

    expect(mockPrisma.tripParticipant.create).toHaveBeenCalledWith({
      data: {
        tripId: "trip-1",
        userId: "db-user-id",
        role: "PARTICIPANT",
        status: "ACTIVE",
      },
    });
    expect(result).toEqual({ success: true, tripId: "trip-1" });
  });

  it("revalida i percorsi /dashboard e /trips/[tripId] dopo la creazione", async () => {
    await joinTripByInvite("valid-token");

    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/trips/trip-1");
  });
});

describe("joinTripByInvite — idempotenza", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticatedUser();
    setupDbUser();
    setupValidInvite();
  });

  it("restituisce success senza creare duplicato se utente è già PARTICIPANT", async () => {
    mockPrisma.tripParticipant.findUnique.mockResolvedValue({
      id: "existing-participant-id",
      tripId: "trip-1",
      userId: "db-user-id",
      role: "PARTICIPANT",
      status: "ACTIVE",
    });

    const result = await joinTripByInvite("valid-token");

    expect(mockPrisma.tripParticipant.create).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, tripId: "trip-1" });
  });

  it("restituisce success senza creare duplicato se utente è già ORGANIZER", async () => {
    mockPrisma.tripParticipant.findUnique.mockResolvedValue({
      id: "organizer-participant-id",
      tripId: "trip-1",
      userId: "db-user-id",
      role: "ORGANIZER",
      status: "ACTIVE",
    });

    const result = await joinTripByInvite("valid-token");

    expect(mockPrisma.tripParticipant.create).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, tripId: "trip-1" });
  });
});
