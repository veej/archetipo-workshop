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

// ─── Helper ───────────────────────────────────────────────────────────────────

function toISODate(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

function formatDateHint(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
  return `Tra il ${fmt(start)} e ${fmt(end)}`;
}

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

  const minDate = toISODate(trip.startDate);
  const maxDate = toISODate(trip.endDate);
  const dateHint = formatDateHint(trip.startDate, trip.endDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 480, padding: 0, overflow: "hidden", borderRadius: 16 }}>
        {/* Header */}
        <DialogHeader style={{ padding: "22px 24px 18px", borderBottom: "1px solid " + T.border }}>
          <DialogTitle style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.025em", color: T.fg }}>
            Aggiungi tappa
          </DialogTitle>
          <DialogDescription style={{ fontSize: 13, color: errors._form ? T.primaryHover : T.fgMuted, marginTop: 3 }}>
            {errors._form ?? `${trip.name}`}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form action={formAction}>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                Nome tappa<span style={{ color: T.primary, marginLeft: 2 }}>*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="es. Volo FCO → LIS, Check-in hotel…"
                style={inputStyle(!!errors.name)}
              />
              <FieldError message={errors.name} />
            </div>

            {/* Date + Time row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Date */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                  Giorno<span style={{ color: T.primary, marginLeft: 2 }}>*</span>
                </label>
                <input
                  name="date"
                  type="date"
                  min={minDate}
                  max={maxDate}
                  defaultValue={defaultDate ?? minDate}
                  style={inputStyle(!!errors.date)}
                />
                <span style={{ fontSize: 11.5, color: T.fgSubtle, fontFamily: T.fontSans }}>{dateHint}</span>
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

            {/* Address */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, fontFamily: T.fontSans }}>
                Indirizzo{" "}
                <span style={{ color: T.fgSubtle, fontWeight: 500 }}>(opzionale)</span>
              </label>
              <input
                name="address"
                type="text"
                placeholder="es. Rua dos Fanqueiros 81, Lisboa"
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
                placeholder="Dettagli utili per il gruppo…"
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
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {isPending ? "Salvataggio…" : "Aggiungi tappa"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
