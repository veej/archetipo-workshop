import { vi, describe, it, expect, beforeEach } from "vitest";

// --- Mocks ---

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tripInvite: { findFirst: vi.fn() },
  },
}));

// --- Typed imports of mocked modules (after vi.mock hoisting) ---

import { prisma } from "@/lib/prisma";
import { getActiveInvite } from "@/lib/invites";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;

// --- Tests ---

describe("getActiveInvite — filtro scadenza", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ritorna null quando nessun invite valido esiste (tutti scaduti o assenti)", async () => {
    mockPrisma.tripInvite.findFirst.mockResolvedValue(null);

    const result = await getActiveInvite("trip-1");

    expect(result).toBeNull();
    expect(mockPrisma.tripInvite.findFirst).toHaveBeenCalledOnce();
    expect(mockPrisma.tripInvite.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tripId: "trip-1",
          expiresAt: { gt: expect.any(Date) },
        }),
      })
    );
  });

  it("ritorna token ed expiresAt quando l'invite è nel futuro", async () => {
    const futureDate = new Date(Date.now() + 3_600_000);
    mockPrisma.tripInvite.findFirst.mockResolvedValue({ token: "tok-abc", expiresAt: futureDate });

    const result = await getActiveInvite("trip-1");

    expect(result).not.toBeNull();
    expect(result?.token).toBe("tok-abc");
    expect(result?.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});
