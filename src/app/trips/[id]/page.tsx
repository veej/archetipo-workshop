import { redirect, forbidden } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { getTripDashboard } from "@/lib/trips";
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

  return <TripDashboard tripId={id} data={data} />;
}
