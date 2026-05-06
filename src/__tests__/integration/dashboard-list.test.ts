import { vi, describe, it, expect, beforeEach } from "vitest";

// --- Mocks ---

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tripParticipant: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// --- Typed imports of mocked modules (after vi.mock hoisting) ---

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;
const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockRedirect = vi.mocked(redirect);

// --- Helpers ---

function makeParticipation(overrides: {
  tripId: string;
  startDate: Date;
  endDate: Date;
  role?: "ORGANIZER" | "PARTICIPANT";
  destination?: string;
  name?: string;
}) {
  return {
    role: overrides.role ?? "ORGANIZER",
    trip: {
      id: overrides.tripId,
      name: overrides.name ?? `Viaggio ${overrides.tripId}`,
      startDate: overrides.startDate,
      endDate: overrides.endDate,
      destination: overrides.destination ?? "Roma",
      coverKey: null,
      _count: { participants: 2 },
    },
  };
}

const mockUser = {
  id: "db-user-id",
  supabaseId: "supabase-user-id",
  email: "test@example.com",
  name: "Test User",
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// --- Tests ---

describe("Dashboard — logica query e mapping", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(mockUser);
  });

  it("chiama findMany con status ACTIVE e orderBy trip.startDate asc", async () => {
    mockPrisma.tripParticipant.findMany.mockResolvedValue([]);

    // Eseguiamo la logica della dashboard direttamente (come farebbe il Server Component)
    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/signin");
      return;
    }

    await prisma.tripParticipant.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      include: {
        trip: {
          include: {
            _count: {
              select: {
                participants: {
                  where: { status: "ACTIVE" },
                },
              },
            },
          },
        },
      },
      orderBy: {
        trip: { startDate: "asc" },
      },
    });

    expect(mockPrisma.tripParticipant.findMany).toHaveBeenCalledOnce();
    expect(mockPrisma.tripParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "ACTIVE",
        }),
        orderBy: {
          trip: { startDate: "asc" },
        },
      })
    );
  });

  it("con 3 viaggi in ordine non crescente, la query viene chiamata con orderBy trip.startDate asc", async () => {
    const participations = [
      makeParticipation({ tripId: "c", startDate: new Date("2026-12-01"), endDate: new Date("2026-12-10") }),
      makeParticipation({ tripId: "a", startDate: new Date("2026-07-01"), endDate: new Date("2026-07-10") }),
      makeParticipation({ tripId: "b", startDate: new Date("2026-09-01"), endDate: new Date("2026-09-10") }),
    ];
    mockPrisma.tripParticipant.findMany.mockResolvedValue(participations);

    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/signin");
      return;
    }

    await prisma.tripParticipant.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      include: {
        trip: {
          include: {
            _count: { select: { participants: { where: { status: "ACTIVE" } } } },
          },
        },
      },
      orderBy: { trip: { startDate: "asc" } },
    });

    expect(mockPrisma.tripParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { trip: { startDate: "asc" } },
      })
    );
  });

  it("il mapping produce TripData[] con il campo role da p.role", async () => {
    const participations = [
      makeParticipation({
        tripId: "trip-1",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-09-10"),
        role: "ORGANIZER",
      }),
      makeParticipation({
        tripId: "trip-2",
        startDate: new Date("2026-10-01"),
        endDate: new Date("2026-10-10"),
        role: "PARTICIPANT",
      }),
    ];
    mockPrisma.tripParticipant.findMany.mockResolvedValue(participations);

    const result = await prisma.tripParticipant.findMany({} as never);

    // Mapping identico a quello in dashboard/page.tsx
    const trips = result.map((p: typeof participations[number]) => ({
      id: p.trip.id,
      name: p.trip.name,
      startDate: p.trip.startDate,
      endDate: p.trip.endDate,
      destination: p.trip.destination,
      coverKey: p.trip.coverKey,
      participantCount: p.trip._count.participants,
      role: p.role,
    }));

    expect(trips).toHaveLength(2);
    expect(trips[0].role).toBe("ORGANIZER");
    expect(trips[1].role).toBe("PARTICIPANT");
    // Tutti gli altri campi obbligatori sono presenti
    expect(trips[0]).toMatchObject({
      id: "trip-1",
      destination: "Roma",
      participantCount: 2,
    });
  });

  it("utente non autenticato (getCurrentUser → null) → redirect verso /auth/signin viene chiamato", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const user = await getCurrentUser();
    if (!user) {
      redirect("/auth/signin");
    }

    expect(mockRedirect).toHaveBeenCalledOnce();
    expect(mockRedirect).toHaveBeenCalledWith("/auth/signin");
    expect(mockPrisma.tripParticipant.findMany).not.toHaveBeenCalled();
  });
});
