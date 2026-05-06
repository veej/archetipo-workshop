"use client";

import { useActionState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addItineraryStop, type AddStopResult } from "@/app/actions/itinerary";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  primary: "#E55A4E",
  primaryHover: "#C94A40",
  primaryFg: "#FFFFFF",
  surface: "#FFFFFF",
  surface2: "#F6F4F0",
  fg: "#1B1A19",
  fgMuted: "#6E6A66",
  fgSubtle: "#A09C97",
  border: "#E8E4DE",
  borderStrong: "#D8D2C8",
  fontSans: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  radiusSm: 6,
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddStopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  trip: {
    name: string;
    startDate: Date;
    endDate: Date;
  };
  defaultDate?: string;
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

function formatDayOption(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(new Date(date));
}

// ─── Category options ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "FLIGHT",        label: "Volo" },
  { value: "ACCOMMODATION", label: "Alloggio" },
  { value: "FOOD",          label: "Cibo" },
  { value: "ACTIVITY",      label: "Attività" },
  { value: "TRANSPORT",     label: "Trasporti" },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span style={{ fontSize: 12, color: T.primaryHover, fontWeight: 500, fontFamily: T.fontSans }}>
      {message}
    </span>
  );
}

function inputStyle(hasError?: boolean): React.CSSProperties {
  return {
    padding: "8px 11px",
    fontSize: 13.5,
    fontFamily: T.fontSans,
    border: `1.5px solid ${hasError ? T.primaryHover : T.border}`,
    borderRadius: T.radiusSm,
    background: T.surface,
    color: T.fg,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    boxShadow: hasError ? "0 0 0 3px rgba(196,74,64,0.12)" : undefined,
    transition: "border-color .12s, box-shadow .12s",
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AddStopModal({ open, onOpenChange, tripId, trip, defaultDate }: AddStopModalProps) {
  const boundAction = useMemo(() => addItineraryStop.bind(null, tripId), [tripId]);
  const [state, formAction, isPending] = useActionState(boundAction, null);

  const errors = state?.success === false ? state.errors : {};

  useEffect(() => {
    if (state?.success === true) {
      toast.success("Tappa aggiunta con successo!");
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  const tripDays = getDaysBetween(trip.startDate, trip.endDate);
  const minDate = toISODate(trip.startDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 480, padding: 0, overflow: "hidden", borderRadius: 16 }}>
        {/* Header */}
        <DialogHeader style={{ padding: "22px 24px 18px", borderBottom: "1px solid " + T.border }}>
          <DialogTitle style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.025em", color: T.fg }}>
            Nuova tappa
          </DialogTitle>
          <DialogDescription style={{ fontSize: 13, color: errors._form ? T.primaryHover : T.fgMuted, marginTop: 3 }}>
            {errors._form ?? "Aggiungi un’attività, un’esperienza o un pasto al programma."}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form action={formAction}>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                Titolo<span style={{ color: T.primary, marginLeft: 2 }}>*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Es. Visita alla Torre di Belém"
                style={inputStyle(!!errors.name)}
              />
              <FieldError message={errors.name} />
            </div>

            {/* Day + Time row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Day select */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                  Giorno<span style={{ color: T.primary, marginLeft: 2 }}>*</span>
                </label>
                <select
                  name="date"
                  defaultValue={defaultDate ?? minDate}
                  style={{ ...inputStyle(!!errors.date), appearance: "auto" }}
                >
                  {tripDays.map((day) => {
                    const val = toISODate(day);
                    const label = formatDayOption(day);
                    return (
                      <option key={val} value={val}>
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                      </option>
                    );
                  })}
                </select>
                <FieldError message={errors.date} />
              </div>

              {/* Time */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                  Orario{" "}
                  <span style={{ color: T.fgSubtle, fontWeight: 500 }}>(opzionale)</span>
                </label>
                <input name="time" type="time" style={inputStyle()} />
              </div>
            </div>

            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                Categoria{" "}
                <span style={{ color: T.fgSubtle, fontWeight: 500 }}>(opzionale)</span>
              </label>
              <select
                name="category"
                defaultValue=""
                style={{ ...inputStyle(), appearance: "auto" }}
              >
                <option value="">— Nessuna —</option>
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                Indirizzo{" "}
                <span style={{ color: T.fgSubtle, fontWeight: 500 }}>(opzionale)</span>
              </label>
              <input
                name="address"
                type="text"
                placeholder="Es. Praça do Império, 1400-206 Lisboa"
                style={inputStyle()}
              />
            </div>

            {/* Notes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                Note{" "}
                <span style={{ color: T.fgSubtle, fontWeight: 500 }}>(opzionale)</span>
              </label>
              <textarea
                name="notes"
                placeholder="Codice prenotazione, dettagli, link…"
                style={{ ...inputStyle(), resize: "vertical", minHeight: 72 }}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 24px 20px", borderTop: "1px solid " + T.border, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, border: "1.5px solid " + T.border, borderRadius: T.radiusSm, background: "transparent", color: T.fgMuted, cursor: "pointer", fontFamily: T.fontSans, transition: "all .12s" }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, borderRadius: T.radiusSm, border: "1px solid " + T.primary, background: isPending ? T.primaryHover : T.primary, color: T.primaryFg, cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1, fontFamily: T.fontSans, transition: "background .12s, opacity .12s" }}
            >
              {isPending ? "Salvataggio…" : "Aggiungi tappa"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
