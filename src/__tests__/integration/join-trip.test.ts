import { vi, describe, it, expect, beforeEach } from "vitest";

// --- Mocks ---

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    tripInvite: { findUnique: vi.fn() },
    tripParticipant: { findUnique: vi.fn(), create: vi.fn(), count: vi.fn() },
  },
}));

// --- Typed imports of mocked modules (after vi.mock hoisting) ---

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { joinTripByInvite } from "@/app/actions/invites";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;
const mockCreateClient = vi.mocked(createClient);

// --- Helpers ---

function makeSupabaseClient(supabaseUserId: string | null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: supabaseUserId ? { id: supabaseUserId } : null },
      }),
    },
  };
}

function makeDbUser(id: string = "db-user-id") {
  return { id };
}

function makeInvite(overrides: {
  token: string;
  tripId: string;
  expiresAt: Date;
}) {
  return {
    token: overrides.token,
    tripId: overrides.tripId,
    expiresAt: overrides.expiresAt,
    trip: {
      id: overrides.tripId,
      name: "Viaggio Test",
      destination: "Roma",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-10"),
    },
  };
}

const SUPABASE_USER_ID = "supabase-uid-123";
const DB_USER_ID = "db-user-id-123";
const TRIP_ID = "trip-id-abc";
const TOKEN = "valid-token-xyz";

// --- Tests ---

describe("joinTripByInvite — integrazione", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: authenticated user with a matching DB record
    mockCreateClient.mockResolvedValue(makeSupabaseClient(SUPABASE_USER_ID) as never);
    mockPrisma.user.findUnique.mockResolvedValue(makeDbUser(DB_USER_ID));
  });

  it("rifiuta join per invite scaduto", async () => {
    const expiredDate = new Date(Date.now() - 3_600_000); // 1 hour in the past
    mockPrisma.tripInvite.findUnique.mockResolvedValue(
      makeInvite({ token: TOKEN, tripId: TRIP_ID, expiresAt: expiredDate })
    );

    const result = await joinTripByInvite(TOKEN);

    expect(result).toEqual({ success: false, error: "Invito scaduto." });
    // TripParticipant must not be created for an expired invite
    expect(mockPrisma.tripParticipant.create).not.toHaveBeenCalled();
  });

  it("crea TripParticipant per invite valido", async () => {
    const futureDate = new Date(Date.now() + 86_400_000); // 24 hours in the future
    mockPrisma.tripInvite.findUnique.mockResolvedValue(
      makeInvite({ token: TOKEN, tripId: TRIP_ID, expiresAt: futureDate })
    );
    // No existing participant — first join
    mockPrisma.tripParticipant.findUnique.mockResolvedValue(null);
    mockPrisma.tripParticipant.create.mockResolvedValue({
      tripId: TRIP_ID,
      userId: DB_USER_ID,
      role: "PARTICIPANT",
      status: "ACTIVE",
    });

    const result = await joinTripByInvite(TOKEN);

    expect(result).toEqual({ success: true, tripId: TRIP_ID });
    expect(mockPrisma.tripParticipant.create).toHaveBeenCalledOnce();
    expect(mockPrisma.tripParticipant.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tripId: TRIP_ID,
          userId: DB_USER_ID,
          role: "PARTICIPANT",
          status: "ACTIVE",
        }),
      })
    );
  });

  it("join duplicato è idempotente — count TripParticipant resta 1", async () => {
    const futureDate = new Date(Date.now() + 86_400_000); // 24 hours in the future
    const existingParticipant = {
      tripId: TRIP_ID,
      userId: DB_USER_ID,
      role: "PARTICIPANT",
      status: "ACTIVE",
    };

    mockPrisma.tripInvite.findUnique.mockResolvedValue(
      makeInvite({ token: TOKEN, tripId: TRIP_ID, expiresAt: futureDate })
    );
    // Simulate user already being a participant
    mockPrisma.tripParticipant.findUnique.mockResolvedValue(existingParticipant);

    // Call joinTripByInvite twice with the same user and trip
    const firstResult = await joinTripByInvite(TOKEN);
    const secondResult = await joinTripByInvite(TOKEN);

    // Both calls must succeed
    expect(firstResult).toEqual({ success: true, tripId: TRIP_ID });
    expect(secondResult).toEqual({ success: true, tripId: TRIP_ID });

    // create must never be called — idempotent behaviour returns early on existing participant
    expect(mockPrisma.tripParticipant.create).not.toHaveBeenCalled();

    // The underlying findUnique was called twice (once per joinTripByInvite invocation)
    // but no new record was ever inserted, so logical count stays at 1
    expect(mockPrisma.tripParticipant.findUnique).toHaveBeenCalledTimes(2);
  });
});
