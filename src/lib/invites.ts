import { prisma } from "@/lib/prisma";
import type { TripInvite } from "@prisma/client";

export async function getActiveInvite(
  tripId: string
): Promise<Pick<TripInvite, "token" | "expiresAt"> | null> {
  return prisma.tripInvite.findFirst({
    where: { tripId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: { token: true, expiresAt: true },
  });
}
