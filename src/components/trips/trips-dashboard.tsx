"use client";

import { useState } from "react";
import { CreateTripModal } from "./create-trip-modal";
import { TripCard } from "./trip-card";
import { getTripStatus } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TripData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  destination: string;
  coverKey: string | null;
  participantCount: number;
  role: "ORGANIZER" | "PARTICIPANT";
}

type TabKey = "all" | "ongoing" | "upcoming" | "past";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Tutti" },
  { key: "ongoing", label: "In corso" },
  { key: "upcoming", label: "Prossimi" },
  { key: "past", label: "Passati" },
];

interface TripsDashboardProps {
  trips: TripData[];
  user: { name: string | null; email: string; image: string | null };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

// ─── Avatar Dropdown ──────────────────────────────────────────────────────────

function AvatarDropdown({ initials }: { initials: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          color: "white",
          fontWeight: 700,
          fontSize: 11.5,
          background: "#D97757",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
        }}
        aria-label="Menu utente"
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 49 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "#FFFFFF",
              border: "1px solid #E8E4DE",
              borderRadius: 10,
              boxShadow:
                "0 4px 14px rgba(20, 16, 12, 0.08), 0 2px 4px rgba(20, 16, 12, 0.04)",
              minWidth: 160,
              overflow: "hidden",
              zIndex: 50,
            }}
          >
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#C44A40",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "background .12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#FCE9E6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Esci
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onNewTrip }: { onNewTrip: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 24px",
        textAlign: "center",
        color: "#6E6A66",
        border: "1.5px dashed #D8D2C8",
        borderRadius: 16,
        background: "#FFFFFF",
      }}
    >
      <div style={{ color: "#A09C97", marginBottom: 24 }}>
        <svg
          width="160"
          height="140"
          viewBox="0 0 160 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="74" cy="82" r="46" fill="#F6F4F0" stroke="#E8E4DE" strokeWidth="2" />
          <ellipse cx="74" cy="82" rx="46" ry="18" fill="none" stroke="#D8D2C8" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="74" cy="82" rx="30" ry="46" fill="none" stroke="#D8D2C8" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="74" y1="36" x2="74" y2="128" stroke="#D8D2C8" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="28" y1="82" x2="120" y2="82" stroke="#D8D2C8" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M52 66 Q58 56 68 58 Q76 60 74 70 Q72 78 62 76 Q50 74 52 66Z" fill="#E55A4E" opacity="0.75" />
          <path d="M80 72 Q88 68 94 74 Q98 82 90 86 Q82 88 80 80 Q78 74 80 72Z" fill="#E55A4E" opacity="0.55" />
          <path d="M56 88 Q64 84 70 90 Q72 98 64 98 Q56 98 56 88Z" fill="#E55A4E" opacity="0.45" />
          <circle cx="74" cy="82" r="46" fill="none" stroke="#C8C2BA" strokeWidth="2" />
          <ellipse cx="74" cy="130" rx="22" ry="5" fill="#E8E4DE" />
          <rect x="70" y="125" width="8" height="6" rx="2" fill="#D8D2C8" />
          <g transform="translate(96 14) rotate(28)">
            <path d="M0 12 L32 0 L20 22 Z" fill="#E55A4E" />
            <path d="M0 12 L32 0 L16 16 Z" fill="#C94A40" />
            <line x1="16" y1="16" x2="20" y2="22" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
          </g>
          <path d="M114 30 Q100 18 86 28 Q72 38 80 52" stroke="#E55A4E" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.5" />
          <circle cx="130" cy="52" r="2.5" fill="#E55A4E" opacity="0.6" />
          <circle cx="38" cy="40" r="2" fill="#B8761E" opacity="0.5" />
          <circle cx="22" cy="70" r="1.5" fill="#A09C97" opacity="0.55" />
          <circle cx="140" cy="78" r="2" fill="#2A6FDB" opacity="0.4" />
        </svg>
      </div>
      <h3
        style={{
          fontSize: 17,
          fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#1B1A19",
          margin: 0,
          marginBottom: 8,
        }}
      >
        Non hai ancora nessun viaggio
      </h3>
      <p style={{ fontSize: 13.5, maxWidth: 340, color: "#6E6A66", marginBottom: 24, lineHeight: 1.6 }}>
        Crea il tuo primo viaggio e invita il gruppo — ci vogliono meno di due minuti.
      </p>
      <button
        onClick={onNewTrip}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 6,
          border: "1px solid transparent",
          background: "#E55A4E",
          color: "#FFFFFF",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "background .12s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#C94A40";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#E55A4E";
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Crea il primo viaggio
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TripsDashboard({ trips, user }: TripsDashboardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const initials = getInitials(user.name, user.email);

  const filteredTrips =
    activeTab === "all"
      ? trips
      : trips.filter((t) => getTripStatus(t.startDate, t.endDate) === activeTab);

  const hasTrips = trips.length > 0;

  return (
    <>
      <style>{`body { background: #FAFAF7 !important; }`}</style>

      {/* ── Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(250, 250, 247, 0.92)",
          backdropFilter: "blur(12px) saturate(150%)",
          borderBottom: "1px solid #E8E4DE",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "-0.02em",
              color: "#1B1A19",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "#E55A4E",
                color: "white",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 14,
                boxShadow: "0 6px 14px -4px rgba(229, 90, 78, 0.55)",
                flexShrink: 0,
              }}
            >
              C
            </div>
            <span>Combriccola</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
            <button
              style={{
                padding: "7px 12px",
                fontSize: 13,
                fontWeight: 600,
                color: "#1B1A19",
                borderRadius: 6,
                border: "none",
                background: "#F6F4F0",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              I miei viaggi
            </button>
          </nav>

          {/* Right: search + avatar */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#FFFFFF",
                border: "1px solid #E8E4DE",
                borderRadius: 6,
                padding: "7px 11px",
                width: 240,
                color: "#6E6A66",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Cerca viaggio…"
                readOnly
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flex: 1,
                  color: "#1B1A19",
                  fontSize: 13,
                  fontFamily: "inherit",
                  cursor: "default",
                }}
              />
            </div>
            <AvatarDropdown initials={initials} />
          </div>
        </div>
      </header>

      {/* ── Page ── */}
      <main
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "28px 32px 56px",
          width: "100%",
        }}
      >
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontSize: 28,
                lineHeight: 1.1,
                fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#1B1A19",
                margin: 0,
              }}
            >
              I miei viaggi
            </h1>
            <p style={{ color: "#6E6A66", marginTop: 6, fontSize: 14 }}>
              Tutto il tuo gruppo, in un unico posto.
            </p>
          </div>
          {hasTrips && (
            <button
              onClick={() => setModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 6,
                border: "1px solid transparent",
                background: "#E55A4E",
                color: "#FFFFFF",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                transition: "background .12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#C94A40";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#E55A4E";
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nuovo viaggio
            </button>
          )}
        </div>

        {/* Filter tabs — only when there are trips */}
        {hasTrips && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <div
              style={{
                display: "inline-flex",
                background: "#F6F4F0",
                borderRadius: 9,
                padding: 3,
                gap: 2,
                border: "1px solid #E8E4DE",
              }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: isActive ? "#1B1A19" : "#6E6A66",
                      borderRadius: 6,
                      border: "none",
                      background: isActive ? "#FFFFFF" : "transparent",
                      boxShadow: isActive ? "0 1px 2px rgba(20, 16, 12, 0.04)" : "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "inherit",
                      transition: "color .12s",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        {!hasTrips ? (
          <EmptyState onNewTrip={() => setModalOpen(true)} />
        ) : filteredTrips.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: "#6E6A66",
              fontSize: 14,
              border: "1.5px dashed #D8D2C8",
              borderRadius: 16,
              background: "#FFFFFF",
            }}
          >
            Nessun viaggio in questa categoria.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
      <CreateTripModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
