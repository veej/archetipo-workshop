import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { getActiveInvite } from "@/lib/invites";
import { getTripInfo } from "@/lib/trips";
import { TripShell } from "@/components/trips/trip-shell";
import { ParticipantsTab } from "@/components/trips/participants-tab";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ParticipantsPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const { id: tripId } = await params;

  const tripInfo = await getTripInfo(tripId, user.id);

  if (!tripInfo) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>403</h1>
        <p>Non hai accesso a questo viaggio.</p>
      </div>
    );
  }

  const [participants, activeInvite] = await Promise.all([
    prisma.tripParticipant.findMany({
      where: { tripId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    getActiveInvite(tripId),
  ]);

  return (
    <TripShell tripId={tripId} trip={tripInfo.trip} role={tripInfo.role} activeTab="participants">
      <ParticipantsTab
        participants={participants}
        activeInvite={activeInvite ?? null}
        currentUserRole={tripInfo.role}
      />
    </TripShell>
  );
}
