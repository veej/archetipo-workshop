import { vi, describe, it, expect, beforeEach } from "vitest";
import { generateInviteLink } from "@/app/actions/invites";

// --- Mocks ---

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    tripParticipant: { findFirst: vi.fn() },
    tripInvite: { create: vi.fn() },
  },
}));

// --- Typed imports of mocked modules (after vi.mock hoisting) ---

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const mockCreateClient = vi.mocked(createClient);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;

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

function setupDbUser(id = "db-user-id") {
  mockPrisma.user.findUnique.mockResolvedValue({ id });
}

function setupOrganizer() {
  mockPrisma.tripParticipant.findFirst.mockResolvedValue({
    id: "participant-id",
    tripId: "trip-1",
    userId: "db-user-id",
    role: "ORGANIZER",
    status: "ACTIVE",
  });
}

// --- Tests ---

describe("generateInviteLink — autenticazione", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("restituisce errore se utente non autenticato", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    } as never);

    const result = await generateInviteLink("trip-1");

    expect(result).toEqual({ success: false, error: "Non autenticato." });
  });
});

describe("generateInviteLink — autorizzazione", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticatedUser();
    setupDbUser();
  });

  it("restituisce errore se utente non è ORGANIZER del viaggio", async () => {
    mockPrisma.tripParticipant.findFirst.mockResolvedValue(null);

    const result = await generateInviteLink("trip-1");

    expect(result).toEqual({ success: false, error: "Non autorizzato." });
  });
});

describe("generateInviteLink — successo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticatedUser();
    setupDbUser();
    setupOrganizer();
  });

  it("restituisce success: true con token e expiresAt se ORGANIZER", async () => {
    mockPrisma.tripInvite.create.mockResolvedValue({});

    const result = await generateInviteLink("trip-1");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.token).toBe("string");
      expect(result.token.length).toBeGreaterThan(0);
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
    }
  });

  it("due chiamate consecutive producono token distinti", async () => {
    // tripInvite.create risolve con valori diversi ma il token viene generato
    // dalla funzione stessa con crypto.randomUUID() — basta che create non fallisca
    mockPrisma.tripInvite.create
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    const result1 = await generateInviteLink("trip-1");
    const result2 = await generateInviteLink("trip-1");

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    if (result1.success && result2.success) {
      expect(result1.token).not.toBe(result2.token);
    }
  });
});
