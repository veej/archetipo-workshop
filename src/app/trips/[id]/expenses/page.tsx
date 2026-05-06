import { redirect, forbidden } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { getTripInfo } from "@/lib/trips";
import { TripShell } from "@/components/trips/trip-shell";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TripExpensesPage({ params }: Props) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const tripInfo = await getTripInfo(id, user.id);
  if (!tripInfo) forbidden();

  return (
    <TripShell tripId={id} trip={tripInfo.trip} role={tripInfo.role} activeTab="expenses">
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DE",
          borderRadius: 10,
          boxShadow: "0 1px 2px rgba(20,16,12,0.04)",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#A09C97", marginBottom: 14 }}>
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M3 10h18" />
            <path d="M7 15h4" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily:
              "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
            color: "#1B1A19",
            marginBottom: 6,
          }}
        >
          Sezione spese in arrivo
        </div>
        <p style={{ fontSize: 13, color: "#6E6A66", maxWidth: 320, lineHeight: 1.5 }}>
          Qui potrai registrare le spese del gruppo, dividerle tra i partecipanti e vedere
          il riepilogo dei saldi. La funzionalità sarà disponibile a breve.
        </p>
      </div>
    </TripShell>
  );
}
