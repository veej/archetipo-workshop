"use client";

import { useState } from "react";
import type { TripRole } from "@prisma/client";
import type { ItineraryData, ItineraryStop } from "@/lib/itinerary";
import { AddStopModal } from "./add-stop-modal";

// ─── Design tokens (mirrored from mockup shared.css) ─────────────────────────

const T = {
  primary: "#E55A4E",
  primaryHover: "#C94A40",
  primarySoft: "#FCE9E6",
  primaryFg: "#FFFFFF",
  bg: "#FAFAF7",
  surface: "#FFFFFF",
  surface2: "#F6F4F0",
  fg: "#1B1A19",
  fgMuted: "#6E6A66",
  fgSubtle: "#A09C97",
  border: "#E8E4DE",
  borderStrong: "#D8D2C8",
  shadowXs: "0 1px 2px rgba(20,16,12,0.04)",
  shadowSm: "0 1px 3px rgba(20,16,12,0.06), 0 1px 2px rgba(20,16,12,0.04)",
  fontDisplay: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
  fontSans: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  radiusSm: 6,
  radius: 10,
  radiusMd: 12,
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ItineraryTabProps {
  tripId: string;
  data: ItineraryData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODate(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

function getDaysBetween(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  current.setUTCHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setUTCHours(0, 0, 0, 0);
  while (current <= last) {
    days.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return days;
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(new Date(date));
}

function formatDaySidebar(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "numeric" }).format(new Date(date));
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconPlus({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconMapPin({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCalendar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

function IconLock({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconMoreH({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}

// ─── Stop item ────────────────────────────────────────────────────────────────

function StopItem({ stop, isLast }: { stop: ItineraryStop; isLast: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", padding: "14px 18px", borderTop: "1px solid " + T.border }}>
      {/* Time */}
      <div style={{ width: 52, flexShrink: 0, display: "flex", flexDirection: "column", paddingTop: 3 }}>
        {stop.time && (
          <span style={{ fontSize: 13.5, fontWeight: 700, color: T.fg, fontVariantNumeric: "tabular-nums", letterSpacing: "0.01em" }}>
            {stop.time}
          </span>
        )}
      </div>

      {/* Connector */}
      <div style={{ width: 18, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 5, margin: "0 4px" }}>
        <div style={{ width: 6, height: 6, borderRadius: 999, background: T.borderStrong, flexShrink: 0 }} />
        {!isLast && <div style={{ width: 1.5, flex: 1, background: T.border, minHeight: 24, marginTop: 4 }} />}
      </div>

      {/* Generic stop icon */}
      <div style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0, margin: "0 12px 0 2px", background: T.surface2, color: T.fgMuted }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z" /><circle cx="12" cy="10" r="3" />
        </svg>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em", color: T.fg, marginBottom: 3 }}>
          {stop.name}
        </div>
        {stop.address && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: T.fgMuted, marginBottom: 7 }}>
            <IconMapPin />
            {stop.address}
          </div>
        )}
        {stop.notes && (
          <div style={{ fontSize: 12, color: T.fgMuted, background: T.bg, border: "1px solid " + T.border, borderRadius: T.radiusSm, padding: "6px 10px", lineHeight: 1.45 }}>
            {stop.notes}
          </div>
        )}
      </div>

      {/* Menu button */}
      <button style={{ flexShrink: 0, marginLeft: 10, width: 26, height: 26, borderRadius: T.radiusSm, border: "1px solid transparent", background: "transparent", display: "grid", placeItems: "center", color: T.fgSubtle, cursor: "pointer", marginTop: 2 }}>
        <IconMoreH />
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ isOrganizer, onAdd }: { isOrganizer: boolean; onAdd: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 32px", textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: T.radiusMd, border: "2px dashed " + T.borderStrong, display: "grid", placeItems: "center", color: T.fgSubtle, marginBottom: 14 }}>
        <IconCalendar />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T.fontDisplay, marginBottom: 5, color: T.fg }}>
        Nessuna tappa programmata
      </div>
      <p style={{ fontSize: 12.5, color: T.fgMuted, maxWidth: 260, lineHeight: 1.5, marginBottom: 18 }}>
        {isOrganizer ? "Aggiungi una tappa per costruire il piano di questo giorno." : "Nessuna tappa programmata per questo giorno."}
      </p>
      {isOrganizer && (
        <button
          onClick={onAdd}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, borderRadius: T.radiusSm, border: "1px solid " + T.primary, background: T.primary, color: T.primaryFg, cursor: "pointer" }}
        >
          <IconPlus size={13} />
          Aggiungi una tappa
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ItineraryTab({ tripId, data }: ItineraryTabProps) {
  const { stops, role, trip } = data;
  const isOrganizer = role === "ORGANIZER";

  const tripDays = getDaysBetween(trip.startDate, trip.endDate);

  // Group stops by ISO date string
  const stopsByDay = new Map<string, ItineraryStop[]>();
  for (const stop of stops) {
    const key = toISODate(stop.date);
    if (!stopsByDay.has(key)) stopsByDay.set(key, []);
    stopsByDay.get(key)!.push(stop);
  }

  const totalStops = stops.length;

  // Default to first day
  const [selectedDay, setSelectedDay] = useState<string>(() => toISODate(tripDays[0]));
  const [modalOpen, setModalOpen] = useState(false);

  const selectedStops = stopsByDay.get(selectedDay) ?? [];
  const selectedDayIndex = tripDays.findIndex((d) => toISODate(d) === selectedDay);
  const selectedDayDate = tripDays[selectedDayIndex];

  const subtitleText = totalStops === 0
    ? `${tripDays.length} giorni · nessuna tappa ancora`
    : `${tripDays.length} giorni · ${totalStops} ${totalStops === 1 ? "tappa" : "tappe"}`;

  return (
    <>
      <AddStopModal
        key={selectedDay}
        open={modalOpen}
        onOpenChange={setModalOpen}
        tripId={tripId}
        trip={trip}
        defaultDate={selectedDay}
      />

      {/* ── Itinerary header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, letterSpacing: "-0.025em", color: T.fg, margin: 0 }}>
            Itinerario
          </h2>
          <p style={{ marginTop: 3, fontSize: 12.5, color: T.fgMuted, fontWeight: 500 }}>{subtitleText}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isOrganizer ? (
            <button
              onClick={() => setModalOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, borderRadius: T.radiusSm, border: "1px solid " + T.primary, background: T.primary, color: T.primaryFg, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              <IconPlus />
              Nuova tappa
            </button>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: T.radiusSm, fontSize: 12, fontWeight: 600, background: T.surface2, color: T.fgMuted, border: "1px solid " + T.border }}>
              <IconLock />
              Sola lettura
            </span>
          )}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Days sidebar */}
          <aside style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {tripDays.map((day, idx) => {
              const key = toISODate(day);
              const count = stopsByDay.get(key)?.length ?? 0;
              const isActive = key === selectedDay;
              const sidebarLabel = formatDaySidebar(day);
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  style={{
                    padding: "13px 15px",
                    borderRadius: T.radius,
                    border: "1px solid " + (isActive ? T.primary : T.border),
                    background: isActive ? T.primarySoft : T.surface,
                    cursor: "pointer",
                    boxShadow: T.shadowXs,
                    textAlign: "left",
                    transition: "border-color .12s, background .12s",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: isActive ? T.primaryHover : T.fgSubtle, marginBottom: 3 }}>
                    Giorno {idx + 1}
                  </div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.02em", color: T.fg, marginBottom: 3 }}>
                    {sidebarLabel.charAt(0).toUpperCase() + sidebarLabel.slice(1)}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: isActive ? T.primaryHover : T.fgMuted }}>
                    {count === 0 ? "Nessuna tappa" : `${count} ${count === 1 ? "tappa" : "tappe"}`}
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Day panel */}
          <section style={{ flex: 1, minWidth: 0, background: T.surface, border: "1px solid " + T.border, borderRadius: T.radius, boxShadow: T.shadowXs, overflow: "hidden" }}>
            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px 12px", borderBottom: "1px solid " + T.border }}>
              <div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.02em", color: T.fg }}>
                  {formatDayLabel(selectedDayDate).charAt(0).toUpperCase() + formatDayLabel(selectedDayDate).slice(1)}
                </div>
                <div style={{ fontSize: 12, color: T.fgMuted, marginTop: 2, fontWeight: 500 }}>
                  Giorno {selectedDayIndex + 1} di {tripDays.length}
                </div>
              </div>
              {isOrganizer && (
                <button
                  onClick={() => setModalOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600, borderRadius: T.radiusSm, border: "1px solid " + T.border, background: "transparent", color: T.fgMuted, cursor: "pointer" }}
                >
                  <IconPlus size={12} />
                  Tappa
                </button>
              )}
            </div>

            {/* Stops list or empty state */}
            {selectedStops.length === 0 ? (
              <EmptyState isOrganizer={isOrganizer} onAdd={() => setModalOpen(true)} />
            ) : (
              <div>
                {selectedStops.map((stop, idx) => (
                  <StopItem key={stop.id} stop={stop} isLast={idx === selectedStops.length - 1} />
                ))}
              </div>
            )}
          </section>
        </div>
    </>
  );
}
