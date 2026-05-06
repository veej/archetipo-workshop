"use client";

import Link from "next/link";
import { TripCover } from "./trip-cover";
import { formatDateRange, getTripStatus, getBalanceDisplayInfo } from "@/lib/utils";
import type { TripDashboardData } from "@/lib/trips";
import type { DocumentCategory } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TripDashboardProps {
  tripId: string;
  data: TripDashboardData;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DOC_CATEGORY_CONFIG: Record<
  DocumentCategory,
  { label: string; iconBg: string; iconColor: string }
> = {
  FLIGHT:  { label: "Volo",         iconBg: "#FCE9E6", iconColor: "#E55A4E" },
  HOTEL:   { label: "Hotel",        iconBg: "#E4EDFB", iconColor: "#2A6FDB" },
  BOOKING: { label: "Prenotazione", iconBg: "#FBF1DD", iconColor: "#B8761E" },
  OTHER:   { label: "Altro",        iconBg: "#F6F4F0", iconColor: "#6E6A66" },
};

const BALANCE_CHIP_STYLE: Record<
  "negative" | "positive" | "zero",
  { background: string; color: string }
> = {
  negative: { background: "#FCE9E6", color: "#C44A40" },
  positive: { background: "#E5F2EC", color: "#2F8A5F" },
  zero:     { background: "#F6F4F0", color: "#6E6A66" },
};

const BALANCE_AMOUNT_COLOR: Record<"negative" | "positive" | "zero", string> = {
  negative: "#C44A40",
  positive: "#2F8A5F",
  zero:     "#6E6A66",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTripStatusBadge(startDate: Date, endDate: Date): {
  label: string;
  bg: string;
  color: string;
} {
  const status = getTripStatus(startDate, endDate);
  switch (status) {
    case "ongoing":  return { label: "In corso", bg: "#FCE9E6", color: "#C94A40" };
    case "upcoming": return { label: "In arrivo", bg: "#E4EDFB", color: "#2A6FDB" };
    case "past":     return { label: "Concluso",  bg: "#F6F4F0", color: "#6E6A66" };
  }
}

function formatDocDate(date: Date): string {
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Section helpers ──────────────────────────────────────────────────────────

function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12.5,
        fontWeight: 600,
        color: "#E55A4E",
        textDecoration: "none",
        transition: "color .12s",
      }}
    >
      {children}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TripDashboard({ tripId, data }: TripDashboardProps) {
  const { trip, role, todayStops, recentDocuments, balance } = data;
  const statusBadge = getTripStatusBadge(trip.startDate, trip.endDate);
  const dateLabel = formatDateRange(trip.startDate, trip.endDate);
  const balanceInfo = getBalanceDisplayInfo(balance);
  const chipStyle = BALANCE_CHIP_STYLE[balanceInfo.variant];

  const todayLabel = new Date().toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <style>{`body { background: #FAFAF7 !important; }`}</style>

      <div
        style={{
          padding: "28px 32px 56px",
          maxWidth: 1240,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* ── Trip Hero ── */}
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            background: "#FFFFFF",
            border: "1px solid #E8E4DE",
            borderRadius: 16,
            boxShadow: "0 1px 2px rgba(20,16,12,0.04)",
            minHeight: 188,
          }}
        >
          {/* Cover */}
          <div
            style={{ width: 256, flexShrink: 0, overflow: "hidden", position: "relative" }}
          >
            <TripCover coverKey={trip.coverKey} height={240} />
          </div>

          {/* Info */}
          <div
            style={{
              flex: 1,
              padding: "20px 24px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              borderLeft: "1px solid #E8E4DE",
            }}
          >
            {/* Breadcrumb */}
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "#6E6A66",
                fontWeight: 500,
                marginBottom: 4,
                textDecoration: "none",
                transition: "color .12s",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              I miei viaggi
            </Link>

            {/* Name */}
            <h1
              style={{
                fontSize: 28,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                fontFamily:
                  "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 700,
                color: "#1B1A19",
                margin: 0,
              }}
            >
              {trip.name}
            </h1>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 13,
                  color: "#6E6A66",
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
                  <path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {trip.destination}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 13,
                  color: "#6E6A66",
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
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {dateLabel}
              </div>
            </div>

            {/* Footer: badge + edit button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: "auto",
                paddingTop: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "3px 8px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 999,
                  background: statusBadge.bg,
                  color: statusBadge.color,
                  whiteSpace: "nowrap",
                }}
              >
                {statusBadge.label}
              </span>

              {role === "ORGANIZER" && (
                // TODO: collegare a /trips/${tripId}/edit quando la feature di modifica sarà implementata
                <button
                  disabled
                  style={{
                    marginLeft: "auto",
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
                    cursor: "not-allowed",
                    opacity: 0.5,
                    fontFamily: "inherit",
                    transition: "background .12s",
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
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Modifica
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Trip Navigation ── */}
        <div
          style={{
            margin: "16px 0 24px",
            background: "#FFFFFF",
            border: "1px solid #E8E4DE",
            borderRadius: 10,
            boxShadow: "0 1px 2px rgba(20,16,12,0.04)",
            display: "flex",
            alignItems: "stretch",
            overflow: "hidden",
          }}
        >
          {/* Active tab: Panoramica */}
          <div
            style={{
              padding: "11px 18px",
              fontSize: 13,
              fontWeight: 600,
              color: "#C94A40",
              position: "relative",
              whiteSpace: "nowrap",
            }}
          >
            Panoramica
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 14,
                right: 14,
                height: 2,
                borderRadius: "2px 2px 0 0",
                background: "#E55A4E",
              }}
            />
          </div>

          {[
            { label: "Itinerario",   href: `/trips/${tripId}/itinerary` },
            { label: "Documenti",    href: `/trips/${tripId}/documents` },
            { label: "Spese",        href: `/trips/${tripId}/expenses` },
            { label: "Partecipanti", href: `/trips/${tripId}/participants` },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "11px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "#6E6A66",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "color .12s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Dashboard Layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 18,
            alignItems: "start",
          }}
        >
          {/* ─ Left: Oggi ─ */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DE",
              borderRadius: 10,
              boxShadow: "0 1px 2px rgba(20,16,12,0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px 12px",
                borderBottom: "1px solid #E8E4DE",
              }}
            >
              <h2
                style={{
                  fontSize: 13.5,
                  fontFamily:
                    "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  margin: 0,
                  color: "#1B1A19",
                }}
              >
                Oggi
              </h2>
              <span style={{ fontSize: 12, color: "#6E6A66", fontWeight: 500 }}>
                {todayLabel}
              </span>
            </div>

            <div style={{ padding: "16px 18px", flex: 1 }}>
              {todayStops.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "28px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#A09C97", marginBottom: 10 }}>
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                    </svg>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily:
                        "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                      color: "#1B1A19",
                      marginBottom: 4,
                    }}
                  >
                    Nessuna tappa per oggi
                  </div>
                  <p style={{ fontSize: 12, color: "#6E6A66", maxWidth: 210, lineHeight: 1.45 }}>
                    Non ci sono tappe programmate per oggi. Controlla l&apos;itinerario completo.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {todayStops.map((stop, i) => (
                    <div
                      key={stop.id}
                      style={{
                        display: "flex",
                        gap: 14,
                        paddingBottom: i < todayStops.length - 1 ? 22 : 0,
                      }}
                    >
                      {/* Timeline column */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flexShrink: 0,
                          width: 56,
                          paddingTop: 2,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px 8px",
                            fontSize: 11.5,
                            fontWeight: 700,
                            fontVariantNumeric: "tabular-nums",
                            letterSpacing: "0.01em",
                            borderRadius: 6,
                            background: "#F6F4F0",
                            color: "#1B1A19",
                            border: "1px solid #E8E4DE",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {stop.time ?? "—"}
                        </span>
                        {i < todayStops.length - 1 && (
                          <div
                            style={{
                              width: 1.5,
                              flex: 1,
                              background: "#E8E4DE",
                              marginTop: 7,
                              minHeight: 28,
                            }}
                          />
                        )}
                      </div>

                      {/* Stop body */}
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            fontFamily:
                              "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                            color: "#1B1A19",
                            marginBottom: 4,
                          }}
                        >
                          {stop.name}
                        </div>
                        {stop.address && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 12,
                              color: "#6E6A66",
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
                            {stop.address}
                          </div>
                        )}
                        {stop.notes && (
                          <div
                            style={{
                              marginTop: 7,
                              fontSize: 12,
                              color: "#6E6A66",
                              padding: "7px 10px",
                              background: "#FAFAF7",
                              borderRadius: 6,
                              borderLeft: "2px solid #D8D2C8",
                              lineHeight: 1.45,
                            }}
                          >
                            {stop.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                padding: "10px 18px 14px",
                borderTop: "1px solid #E8E4DE",
              }}
            >
              <SectionLink href={`/trips/${tripId}/itinerary`}>
                Vedi itinerario completo
              </SectionLink>
            </div>
          </div>

          {/* ─ Right sidebar ─ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Documenti recenti */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DE",
                borderRadius: 10,
                boxShadow: "0 1px 2px rgba(20,16,12,0.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px 12px",
                  borderBottom: "1px solid #E8E4DE",
                }}
              >
                <h2
                  style={{
                    fontSize: 13.5,
                    fontFamily:
                      "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "#1B1A19",
                  }}
                >
                  Documenti recenti
                </h2>
                {recentDocuments.length > 0 && (
                  <span style={{ fontSize: 12, color: "#6E6A66", fontWeight: 500 }}>
                    {recentDocuments.length} file
                  </span>
                )}
              </div>

              <div style={{ padding: "16px 18px", flex: 1 }}>
                {recentDocuments.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "28px 16px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ color: "#A09C97", marginBottom: 10 }}>
                      <svg
                        width="32"
                        height="32"
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
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily:
                          "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                        color: "#1B1A19",
                        marginBottom: 4,
                      }}
                    >
                      Nessun documento
                    </div>
                    <p style={{ fontSize: 12, color: "#6E6A66", maxWidth: 210, lineHeight: 1.45 }}>
                      Nessun documento ancora. Caricali nella sezione documenti.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {recentDocuments.map((doc) => {
                      const catCfg = DOC_CATEGORY_CONFIG[doc.category];
                      return (
                        <div
                          key={doc.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 11,
                            padding: "9px 11px",
                            borderRadius: 10,
                            border: "1px solid #E8E4DE",
                            background: "#FAFAF7",
                          }}
                        >
                          {/* Category icon */}
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: catCfg.iconBg,
                              color: catCfg.iconColor,
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>

                          {/* Doc info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 12.5,
                                fontWeight: 600,
                                color: "#1B1A19",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginBottom: 3,
                              }}
                            >
                              {doc.name}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "2px 7px",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  borderRadius: 999,
                                  background: catCfg.iconBg,
                                  color: catCfg.iconColor,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {catCfg.label}
                              </span>
                              <span style={{ fontSize: 11, color: "#A09C97" }}>
                                {formatDocDate(doc.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: "10px 18px 14px",
                  borderTop: "1px solid #E8E4DE",
                }}
              >
                <SectionLink href={`/trips/${tripId}/documents`}>
                  {recentDocuments.length === 0 ? "Vai ai documenti" : "Vedi tutti i documenti"}
                </SectionLink>
              </div>
            </div>

            {/* Il mio saldo */}
            {/* Note: il mockup mostra "N spese" nell'header (section-meta), ma richiederebbe
                una query aggiuntiva su ExpenseParticipant non inclusa nel piano US-003.
                Verrà aggiunto quando US-015 (riepilogo saldi) implementerà quella query. */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DE",
                borderRadius: 10,
                boxShadow: "0 1px 2px rgba(20,16,12,0.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "14px 18px 12px",
                  borderBottom: "1px solid #E8E4DE",
                }}
              >
                <h2
                  style={{
                    fontSize: 13.5,
                    fontFamily:
                      "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "#1B1A19",
                  }}
                >
                  Il mio saldo
                </h2>
              </div>

              <div style={{ padding: "16px 18px" }}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "10px 0 4px",
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                      fontSize: 42,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: 5,
                      color: BALANCE_AMOUNT_COLOR[balanceInfo.variant],
                    }}
                  >
                    {balanceInfo.formattedAmount}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#6E6A66", fontWeight: 500 }}
                  >
                    Saldo netto verso il gruppo
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 14,
                      padding: "7px 14px",
                      borderRadius: 10,
                      fontSize: 12.5,
                      fontWeight: 600,
                      background: chipStyle.background,
                      color: chipStyle.color,
                    }}
                  >
                    {balanceInfo.variant === "negative" && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    )}
                    {balanceInfo.variant === "positive" && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    )}
                    {balanceInfo.variant === "zero" && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {balanceInfo.label}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "10px 18px 14px",
                  borderTop: "1px solid #E8E4DE",
                }}
              >
                <SectionLink href={`/trips/${tripId}/expenses`}>
                  Vedi riepilogo spese
                </SectionLink>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
