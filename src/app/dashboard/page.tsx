import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { TripsDashboard, type TripData } from "@/components/trips/trips-dashboard";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const participations = await prisma.tripParticipant.findMany({
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

  const trips: TripData[] = participations.map((p) => ({
    id: p.trip.id,
    name: p.trip.name,
    startDate: p.trip.startDate,
    endDate: p.trip.endDate,
    destination: p.trip.destination,
    coverKey: p.trip.coverKey,
    participantCount: p.trip._count.participants,
  }));

  return (
    <TripsDashboard
      trips={trips}
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
      }}
    />
  );
}
