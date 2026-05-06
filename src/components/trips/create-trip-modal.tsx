"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createTrip } from "@/app/actions/trips";
import { CoverIllustration, COVER_KEYS } from "./cover-illustrations";

type ActionResult =
  | { success: true; tripId: string }
  | { success: false; errors: Record<string, string> };

// useActionState requires (prevState, formData) => result, but the Server Action
// only uses formData. This wrapper satisfies the signature.
async function createTripAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  return createTrip(formData);
}

interface CreateTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Cover options config ─────────────────────────────────────────────────────

const COVER_OPTIONS = COVER_KEYS.map((key) => ({ key, label: key }));

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11.5,
        color: "#C44A40",
        fontWeight: 500,
        marginTop: 4,
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v5h1" />
      </svg>
      {message}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CreateTripModal({ open, onOpenChange }: CreateTripModalProps) {
  const [state, formAction, isPending] = useActionState(createTripAction, null);
  const [selectedCover, setSelectedCover] = useState<string>("none");

  // Close modal on success
  useEffect(() => {
    if (state?.success === true) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  // Whether to show the date-inversion error banner
  const showDateBanner =
    state?.success === false &&
    !!state.errors?.endDate;

  // Input style helpers
  const inputBase: React.CSSProperties = {
    border: "1px solid #D8D2C8",
    background: "#FFFFFF",
    borderRadius: 6,
    padding: "8px 11px",
    fontSize: 13,
    color: "#1B1A19",
    width: "100%",
    outline: "none",
    transition: "border-color .12s, box-shadow .12s",
    fontFamily: "inherit",
  };

  function inputStyle(hasError?: boolean): React.CSSProperties {
    return {
      ...inputBase,
      ...(hasError
        ? { borderColor: "#C44A40" }
        : {}),
    };
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#1B1A19",
    marginBottom: 4,
    display: "block",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden"
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          width: "min(600px, 92vw)",
          maxWidth: "600px",
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow:
            "0 12px 32px rgba(20, 16, 12, 0.10), 0 4px 12px rgba(20, 16, 12, 0.05)",
        }}
      >
        {/* ── Header ── */}
        <DialogHeader
          style={{
            padding: "22px 24px 14px",
            borderBottom: "1px solid #E8E4DE",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <DialogTitle
              style={{
                fontSize: 18,
                fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#1B1A19",
                lineHeight: 1.2,
              }}
            >
              Crea un nuovo viaggio
            </DialogTitle>
            <DialogDescription
              style={{
                fontSize: 13,
                color: "#6E6A66",
                marginTop: 3,
                lineHeight: 1.4,
              }}
            >
              Configura il tuo hub di gruppo in pochi passi.
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Chiudi"
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              color: "#6E6A66",
              flexShrink: 0,
              transition: "background .12s, color .12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#F6F4F0";
              (e.currentTarget as HTMLButtonElement).style.color = "#1B1A19";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#6E6A66";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </DialogHeader>

        {/* ── Body ── */}
        <form action={formAction}>
          {/* Hidden cover key */}
          <input type="hidden" name="coverKey" value={selectedCover === "none" ? "" : selectedCover} />

          <div style={{ padding: "20px 24px 4px" }}>
            {/* Date inversion banner */}
            {showDateBanner && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  background: "#FCE9E6",
                  border: "1px solid rgba(196, 74, 64, 0.25)",
                  borderRadius: 10,
                  marginBottom: 16,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C44A40"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 1 }}
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8h.01M11 12h1v5h1" />
                </svg>
                <div
                  style={{
                    fontSize: 13,
                    color: "#C44A40",
                    fontWeight: 500,
                    lineHeight: 1.45,
                  }}
                >
                  La data di fine non può essere precedente alla data di inizio.
                  Correggi le date prima di procedere.
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Trip name */}
              <div>
                <label style={labelStyle} htmlFor="ctm-name">
                  Nome del viaggio{" "}
                  <span style={{ color: "#C44A40" }}>*</span>
                </label>
                <input
                  id="ctm-name"
                  name="name"
                  type="text"
                  placeholder="Es. Weekend a Barcellona"
                  style={inputStyle(
                    state?.success === false && !!state.errors?.name
                  )}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#E55A4E";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(229, 90, 78, 0.35)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      state?.success === false && state.errors?.name
                        ? "#C44A40"
                        : "#D8D2C8";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {state?.success === false && (
                  <FieldError message={state.errors?.name} />
                )}
              </div>

              {/* Destination */}
              <div>
                <label style={labelStyle} htmlFor="ctm-destination">
                  Destinazione principale{" "}
                  <span style={{ color: "#C44A40" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      position: "absolute",
                      left: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6E6A66",
                      pointerEvents: "none",
                    }}
                  >
                    <path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <input
                    id="ctm-destination"
                    name="destination"
                    type="text"
                    placeholder="Es. Lisbona, Portogallo"
                    style={{
                      ...inputStyle(
                        state?.success === false && !!state.errors?.destination
                      ),
                      paddingLeft: 33,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#E55A4E";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(229, 90, 78, 0.35)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        state?.success === false && state.errors?.destination
                          ? "#C44A40"
                          : "#D8D2C8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                {state?.success === false && (
                  <FieldError message={state.errors?.destination} />
                )}
              </div>

              {/* Dates — 2-column grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle} htmlFor="ctm-startDate">
                    Data inizio <span style={{ color: "#C44A40" }}>*</span>
                  </label>
                  <input
                    id="ctm-startDate"
                    name="startDate"
                    type="date"
                    style={inputStyle(
                      state?.success === false && !!state.errors?.startDate
                    )}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#E55A4E";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(229, 90, 78, 0.35)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        state?.success === false && state.errors?.startDate
                          ? "#C44A40"
                          : "#D8D2C8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {state?.success === false && (
                    <FieldError message={state.errors?.startDate} />
                  )}
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ctm-endDate">
                    Data fine <span style={{ color: "#C44A40" }}>*</span>
                  </label>
                  <input
                    id="ctm-endDate"
                    name="endDate"
                    type="date"
                    style={inputStyle(
                      state?.success === false && !!state.errors?.endDate
                    )}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#E55A4E";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(229, 90, 78, 0.35)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        state?.success === false && state.errors?.endDate
                          ? "#C44A40"
                          : "#D8D2C8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {state?.success === false && (
                    <FieldError message={state.errors?.endDate} />
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr style={{ height: 1, background: "#E8E4DE", border: "none", margin: 0 }} />

              {/* Cover picker */}
              <div>
                <label style={labelStyle}>
                  Immagine di copertina{" "}
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#6E6A66",
                      marginLeft: 4,
                    }}
                  >
                    (opzionale)
                  </span>
                </label>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#6E6A66",
                    marginBottom: 8,
                  }}
                >
                  Scegli un&apos;illustrazione preset da usare come copertina del
                  viaggio.
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                  }}
                >
                  {/* None option */}
                  <button
                    type="button"
                    onClick={() => setSelectedCover("none")}
                    style={{
                      height: 80,
                      borderRadius: 12,
                      border:
                        selectedCover === "none"
                          ? "2px solid #E55A4E"
                          : "1.5px dashed #D8D2C8",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      cursor: "pointer",
                      color:
                        selectedCover === "none" ? "#C94A40" : "#6E6A66",
                      fontSize: 11.5,
                      fontWeight: 600,
                      background:
                        selectedCover === "none" ? "#FCE9E6" : "transparent",
                      boxShadow:
                        selectedCover === "none"
                          ? "0 0 0 3px rgba(229, 90, 78, 0.35)"
                          : "none",
                      transition: "border-color .12s, background .12s, box-shadow .12s",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    Nessuna
                  </button>

                  {/* Cover illustration options */}
                  {COVER_OPTIONS.map(({ key, label }) => {
                    const isSelected = selectedCover === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedCover(key)}
                        style={{
                          position: "relative",
                          height: 80,
                          borderRadius: 12,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: isSelected
                            ? "2px solid #E55A4E"
                            : "2px solid transparent",
                          boxShadow: isSelected
                            ? "0 0 0 3px rgba(229, 90, 78, 0.35)"
                            : "none",
                          padding: 0,
                          background: "transparent",
                          transition: "border-color .12s, box-shadow .12s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#D8D2C8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                          }
                        }}
                        aria-label={label}
                        aria-pressed={isSelected}
                      >
                        <CoverIllustration name={key} idPrefix="ctm" />
                        {/* Label overlay */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background:
                              "linear-gradient(0deg, rgba(20,16,12,0.7) 0%, rgba(20,16,12,0) 100%)",
                            padding: "10px 8px 7px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "white",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {label}
                        </div>
                        {/* Checkmark badge */}
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: "#E55A4E",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                            }}
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              padding: "16px 24px 22px",
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              borderTop: "1px solid #E8E4DE",
              marginTop: 18,
            }}
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 6,
                border: "1px solid transparent",
                background: "transparent",
                color: "#6E6A66",
                cursor: "pointer",
                transition: "background .12s, color .12s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#F6F4F0";
                (e.currentTarget as HTMLButtonElement).style.color = "#1B1A19";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#6E6A66";
              }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 6,
                border: "1px solid transparent",
                background: isPending ? "#C94A40" : "#E55A4E",
                color: "#FFFFFF",
                cursor: isPending ? "not-allowed" : "pointer",
                opacity: isPending ? 0.7 : 1,
                transition: "background .12s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isPending)
                  (e.currentTarget as HTMLButtonElement).style.background = "#C94A40";
              }}
              onMouseLeave={(e) => {
                if (!isPending)
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
              {isPending ? "Creazione…" : "Crea viaggio"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
