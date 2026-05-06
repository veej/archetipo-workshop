import Link from "next/link";
import type { ReactNode } from "react";
import type { TripRole } from "@prisma/client";
import { TripCover } from "./trip-cover";
import { formatDateRange, getTripStatus } from "@/lib/utils";

export type TripTab = "overview" | "itinerary" | "documents" | "expenses" | "participants";

const TABS: { id: TripTab; label: string; href: (id: string) => string }[] = [
  { id: "overview",     label: "Panoramica",    href: (id) => `/trips/${id}` },
  { id: "itinerary",    label: "Itinerario",    href: (id) => `/trips/${id}/itinerary` },
  { id: "documents",    label: "Documenti",     href: (id) => `/trips/${id}/documents` },
  { id: "expenses",     label: "Spese",         href: (id) => `/trips/${id}/expenses` },
  { id: "participants", label: "Partecipanti",  href: (id) => `/trips/${id}/participants` },
];

function getStatusBadge(startDate: Date, endDate: Date): { label: string; bg: string; color: string } {
  const status = getTripStatus(startDate, endDate);
  switch (status) {
    case "ongoing":  return { label: "In corso",  bg: "#FCE9E6", color: "#C94A40" };
    case "upcoming": return { label: "In arrivo", bg: "#E4EDFB", color: "#2A6FDB" };
    case "past":     return { label: "Concluso",  bg: "#F6F4F0", color: "#6E6A66" };
  }
}

interface TripShellProps {
  tripId: string;
  trip: {
    name: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    coverKey: string | null;
  };
  role: TripRole;
  activeTab: TripTab;
  children: ReactNode;
}

export function TripShell({ tripId, trip, role, activeTab, children }: TripShellProps) {
  const statusBadge = getStatusBadge(trip.startDate, trip.endDate);
  const dateLabel = formatDateRange(trip.startDate, trip.endDate);

  return (
    <>
      <style>{`body { background: #FAFAF7 !important; }`}</style>

      <div style={{ padding: "28px 32px 56px", maxWidth: 1240, width: "100%", margin: "0 auto" }}>

        {/* ── Trip Hero ── */}
        <div style={{ display: "flex", overflow: "hidden", background: "#FFFFFF", border: "1px solid #E8E4DE", borderRadius: 16, boxShadow: "0 1px 2px rgba(20,16,12,0.04)", minHeight: 188 }}>
          <div style={{ width: 256, flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <TripCover coverKey={trip.coverKey} height={240} />
          </div>

          <div style={{ flex: 1, padding: "20px 24px 18px", display: "flex", flexDirection: "column", gap: 4, borderLeft: "1px solid #E8E4DE" }}>
            <Link
              href="/dashboard"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6E6A66", fontWeight: 500, marginBottom: 4, textDecoration: "none" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              I miei viaggi
            </Link>

            <h1 style={{ fontSize: 28, lineHeight: 1.08, letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif", fontWeight: 700, color: "#1B1A19", margin: 0 }}>
              {trip.name}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6E6A66" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {trip.destination}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6E6A66" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {dateLabel}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 14 }}>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", fontSize: 11.5, fontWeight: 600, borderRadius: 999, background: statusBadge.bg, color: statusBadge.color, whiteSpace: "nowrap" }}>
                {statusBadge.label}
              </span>
              {role === "ORGANIZER" && (
                <button
                  disabled
                  style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "1px solid #D8D2C8", background: "#FFFFFF", color: "#1B1A19", cursor: "not-allowed", opacity: 0.5, fontFamily: "inherit", transition: "background .12s" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Modifica
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Trip Navigation ── */}
        <div style={{ margin: "16px 0 24px", background: "#FFFFFF", border: "1px solid #E8E4DE", borderRadius: 10, boxShadow: "0 1px 2px rgba(20,16,12,0.04)", display: "flex", alignItems: "stretch", overflow: "hidden" }}>
          {TABS.map(({ id, label, href }) => {
            const isActive = activeTab === id;
            return (
              <Link
                key={id}
                href={href(tripId)}
                style={{
                  padding: "11px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: isActive ? "#C94A40" : "#6E6A66",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  position: "relative",
                  display: "block",
                }}
              >
                {label}
                {isActive && (
                  <div style={{ position: "absolute", bottom: 0, left: 14, right: 14, height: 2, borderRadius: "2px 2px 0 0", background: "#E55A4E" }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Page content ── */}
        {children}
      </div>
    </>
  );
}
