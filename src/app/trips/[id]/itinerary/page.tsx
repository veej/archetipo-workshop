import { redirect, forbidden } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { getItineraryStops } from "@/lib/itinerary";
import { TripShell } from "@/components/trips/trip-shell";
import { ItineraryTab } from "@/components/trips/itinerary-tab";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ItineraryPage({ params }: Props) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const data = await getItineraryStops(id, user.id);
  if (!data) forbidden();

  return (
    <TripShell tripId={id} trip={data.trip} role={data.role} activeTab="itinerary">
      <ItineraryTab tripId={id} data={data} />
    </TripShell>
  );
}
