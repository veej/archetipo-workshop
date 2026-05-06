import { prisma } from "@/lib/prisma";
import type { TripRole, StopCategory } from "@prisma/client";

export type ItineraryStop = {
  id: string;
  name: string;
  date: Date;
  time: string | null;
  category: StopCategory | null;
  address: string | null;
  notes: string | null;
};

export type ItineraryData = {
  stops: ItineraryStop[];
  role: TripRole;
  trip: {
    id: string;
    name: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    coverKey: string | null;
  };
};

export async function getItineraryStops(
  tripId: string,
  userId: string
): Promise<ItineraryData | null> {
  const participation = await prisma.tripParticipant.findUnique({
    where: { tripId_userId: { tripId, userId } },
    include: {
      trip: {
        select: {
          id: true,
          name: true,
          destination: true,
          startDate: true,
          endDate: true,
          coverKey: true,
        },
      },
    },
  });

  if (!participation || participation.status !== "ACTIVE") return null;

  const stops = await prisma.itineraryStop.findMany({
    where: { tripId },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    select: { id: true, name: true, date: true, time: true, category: true, address: true, notes: true },
  });

  return {
    stops,
    role: participation.role,
    trip: participation.trip,
  };
}
