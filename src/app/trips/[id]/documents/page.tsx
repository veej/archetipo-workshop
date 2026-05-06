import { redirect, forbidden } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { getTripInfo } from "@/lib/trips";
import { TripShell } from "@/components/trips/trip-shell";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TripDocumentsPage({ params }: Props) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const tripInfo = await getTripInfo(id, user.id);
  if (!tripInfo) forbidden();

  return (
    <TripShell tripId={id} trip={tripInfo.trip} role={tripInfo.role} activeTab="documents">
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
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
          Sezione documenti in arrivo
        </div>
        <p style={{ fontSize: 13, color: "#6E6A66", maxWidth: 320, lineHeight: 1.5 }}>
          Qui potrai caricare voli, hotel e prenotazioni del viaggio. La funzionalità sarà
          disponibile a breve.
        </p>
      </div>
    </TripShell>
  );
}
