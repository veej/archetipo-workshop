"use client";

import { useState } from "react";
import { TripCover } from "./trip-cover";
import { CreateTripModal } from "./create-trip-modal";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TripData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  destination: string;
  coverKey: string | null;
  participantCount: number;
}

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

function formatDateRange(start: Date, end: Date): string {
  const startDay = start.toLocaleDateString("it-IT", { day: "numeric" });
  const endFull = end.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  // Show "12–22 ott 2026"
  return `${startDay}–${endFull}`;
}

type BadgeVariant = "default" | "primary" | "info";

interface TripBadge {
  label: string;
  variant: BadgeVariant;
}

function getTripBadge(startDate: Date, endDate: Date): TripBadge {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (end < today) {
    return { label: "Concluso", variant: "default" };
  }
  if (start <= today && today <= end) {
    return { label: "In corso", variant: "primary" };
  }
  const daysUntil = Math.ceil(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntil <= 30) {
    return { label: `Tra ${daysUntil} giorni`, variant: "primary" };
  }
  return { label: "In arrivo", variant: "info" };
}

// ─── Badge Component ──────────────────────────────────────────────────────────

function Badge({ label, variant }: TripBadge) {
  const styles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 8px",
    fontSize: 11.5,
    fontWeight: 600,
    borderRadius: 999,
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  if (variant === "primary") {
    return (
      <span
        style={{
          ...styles,
          background: "#FCE9E6",
          color: "#C94A40",
          border: "1px solid transparent",
        }}
      >
        {label}
      </span>
    );
  }
  if (variant === "info") {
    return (
      <span
        style={{
          ...styles,
          background: "#E4EDFB",
          color: "#2A6FDB",
          border: "1px solid transparent",
        }}
      >
        {label}
      </span>
    );
  }
  // default
  return (
    <span
      style={{
        ...styles,
        background: "#F6F4F0",
        color: "#6E6A66",
        border: "1px solid #E8E4DE",
      }}
    >
      {label}
    </span>
  );
}

// ─── Trip Card ────────────────────────────────────────────────────────────────

function TripCard({ trip }: { trip: TripData }) {
  const [hovered, setHovered] = useState(false);
  const badge = getTripBadge(trip.startDate, trip.endDate);
  const dateLabel = formatDateRange(trip.startDate, trip.endDate);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DE",
        borderRadius: 10,
        boxShadow: hovered
          ? "0 4px 14px rgba(20, 16, 12, 0.08), 0 2px 4px rgba(20, 16, 12, 0.04)"
          : "0 1px 2px rgba(20, 16, 12, 0.04)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition: "box-shadow .15s, transform .15s",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TripCover coverKey={trip.coverKey} />
      <div style={{ padding: "14px 16px 16px" }}>
        {/* Name + badge row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                fontFamily:
                  "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#1B1A19",
              }}
            >
              {trip.name}
            </div>
            <div
              style={{
                color: "#6E6A66",
                fontSize: 12.5,
                marginTop: 3,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {trip.destination}
            </div>
          </div>
          <Badge label={badge.label} variant={badge.variant} />
        </div>

        {/* Meta row: dates + participants */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <div style={{ fontSize: 12.5, color: "#6E6A66" }}>{dateLabel}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#6E6A66",
              fontSize: 12,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="8" r="4" />
              <path d="M2 21a7 7 0 0 1 14 0" />
              <circle cx="17" cy="8" r="3" />
              <path d="M22 19a5 5 0 0 0-5-5" />
            </svg>
            {trip.participantCount}
          </div>
        </div>
      </div>
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
      <div style={{ color: "#A09C97", marginBottom: 16 }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      </div>
      <h3
        style={{
          fontSize: 17,
          fontFamily:
            "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#1B1A19",
          margin: 0,
          marginBottom: 8,
        }}
      >
        Nessun viaggio ancora
      </h3>
      <p
        style={{
          fontSize: 13.5,
          maxWidth: 320,
          color: "#6E6A66",
          marginBottom: 20,
        }}
      >
        Crea il tuo primo viaggio e invita il gruppo — ci vogliono meno di due
        minuti.
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
          {/* Backdrop to close */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 49,
            }}
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
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#FCE9E6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function TripsDashboard({ trips, user }: TripsDashboardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const initials = getInitials(user.name, user.email);

  return (
    <>
      {/* Override body bg */}
      <style>{`
        body { background: #FAFAF7 !important; }
      `}</style>

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
              fontFamily:
                "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
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
            <button
              style={{
                padding: "7px 12px",
                fontSize: 13,
                fontWeight: 600,
                color: "#6E6A66",
                borderRadius: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                transition: "background .12s, color .12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#F6F4F0";
                (e.currentTarget as HTMLButtonElement).style.color = "#1B1A19";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#6E6A66";
              }}
            >
              Inviti
            </button>
          </nav>

          {/* Right: search + avatar */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Search (decorative) */}
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

            {/* Avatar with dropdown */}
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontSize: 28,
                lineHeight: 1.1,
                fontFamily:
                  "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#1B1A19",
                margin: 0,
              }}
            >
              I tuoi viaggi
            </h1>
            <p
              style={{
                color: "#6E6A66",
                marginTop: 6,
                fontSize: 14,
              }}
            >
              Tutto il tuo gruppo, in un unico posto.
            </p>
          </div>
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
              (e.currentTarget as HTMLButtonElement).style.background =
                "#C94A40";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#E55A4E";
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
        </div>

        {/* Filter tabs row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          {/* Tabs (decorative) */}
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
            {["Tutti", "In arrivo", "Passati"].map((tab, i) => (
              <button
                key={tab}
                style={{
                  padding: "6px 12px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: i === 0 ? "#1B1A19" : "#6E6A66",
                  borderRadius: 6,
                  border: "none",
                  background:
                    i === 0
                      ? "#FFFFFF"
                      : "transparent",
                  cursor: "pointer",
                  boxShadow:
                    i === 0
                      ? "0 1px 2px rgba(20, 16, 12, 0.04)"
                      : "none",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                  transition: "color .12s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter button (decorative) */}
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: "1px solid #D8D2C8",
              background: "#FFFFFF",
              color: "#1B1A19",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background .12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#F6F4F0";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#FFFFFF";
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 5h18l-7 9v6l-4-2v-4z" />
            </svg>
            Filtri
          </button>
        </div>

        {/* Content: grid or empty state */}
        {trips.length === 0 ? (
          <EmptyState onNewTrip={() => setModalOpen(true)} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
      <CreateTripModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
