import { redirect, forbidden } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { getTripDashboard } from "@/lib/trips";
import { TripShell } from "@/components/trips/trip-shell";
import { TripDashboard } from "@/components/trips/trip-dashboard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TripDashboardPage({ params }: Props) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const data = await getTripDashboard(id, user.id);
  if (!data) forbidden();

  const todayLabel = new Date().toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Rome",
  });

  return (
    <TripShell tripId={id} trip={data.trip} role={data.role} activeTab="overview">
      <TripDashboard tripId={id} data={data} todayLabel={todayLabel} />
    </TripShell>
  );
}
