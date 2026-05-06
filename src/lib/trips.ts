import { prisma } from "@/lib/prisma";
import type { DocumentCategory, TripRole } from "@prisma/client";

export type TodayStop = {
  id: string;
  name: string;
  time: string | null;
  address: string | null;
  notes: string | null;
};

export type RecentDocument = {
  id: string;
  name: string;
  fileKey: string;
  category: DocumentCategory;
  createdAt: Date;
};

export type TripDashboardData = {
  trip: {
    id: string;
    name: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    coverKey: string | null;
  };
  role: TripRole;
  todayStops: TodayStop[];
  recentDocuments: RecentDocument[];
  balance: number;
};

// Exported for unit testing
export function computeBalance(
  paid: number | null,
  owed: number | null
): number {
  return (paid ?? 0) - (owed ?? 0);
}

// UTC start-of-day and end-of-day for "today" comparison.
// This is an MVP approximation — users in non-UTC timezones may see
// a slightly shifted "today" boundary, which is acceptable for now.
function getTodayBounds(): { startOfDay: Date; endOfDay: Date } {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return { startOfDay, endOfDay };
}

export async function getTripDashboard(
  tripId: string,
  userId: string
): Promise<TripDashboardData | null> {
  const participation = await prisma.tripParticipant.findUnique({
    where: { tripId_userId: { tripId, userId } },
    include: { trip: true },
  });

  if (!participation || participation.status !== "ACTIVE") return null;

  const { startOfDay, endOfDay } = getTodayBounds();

  const [todayStops, recentDocuments, paidAgg, owedAgg] = await Promise.all([
    prisma.itineraryStop.findMany({
      where: { tripId, date: { gte: startOfDay, lt: endOfDay } },
      orderBy: [{ time: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, time: true, address: true, notes: true },
    }),
    prisma.document.findMany({
      where: { tripId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        fileKey: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.expense.aggregate({
      where: { tripId, paidById: userId },
      _sum: { amount: true },
    }),
    prisma.expenseParticipant.aggregate({
      where: { expense: { tripId }, userId },
      _sum: { amount: true },
    }),
  ]);

  const { trip } = participation;

  return {
    trip: {
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      coverKey: trip.coverKey,
    },
    role: participation.role,
    todayStops,
    recentDocuments,
    balance: computeBalance(paidAgg._sum.amount, owedAgg._sum.amount),
  };
}
