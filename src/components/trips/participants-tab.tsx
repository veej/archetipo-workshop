"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import type { TripParticipant, User, TripInvite, TripRole } from "@prisma/client";
import { generateInviteLink } from "@/app/actions/invites";

// ─── Types ────────────────────────────────────────────────────────────────────

type ParticipantWithUser = TripParticipant & {
  user: Pick<User, "id" | "name" | "email" | "image">;
};

interface ParticipantsTabProps {
  participants: ParticipantWithUser[];
  activeInvite: Pick<TripInvite, "token" | "expiresAt"> | null;
  currentUserRole: TripRole;
}

// ─── Design tokens (mirrored from mockup) ────────────────────────────────────

const T = {
  primary: "#E55A4E",
  primaryHover: "#C94A40",
  primarySoft: "#FCE9E6",
  bg: "#FAFAF7",
  surface: "#FFFFFF",
  surface2: "#F6F4F0",
  fg: "#1B1A19",
  fgMuted: "#6E6A66",
  fgSubtle: "#A09C97",
  border: "#E8E4DE",
  borderStrong: "#D8D2C8",
  success: "#2F8A5F",
  successSoft: "#E5F2EC",
  fontDisplay: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
  fontSans: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  radiusSm: 6,
  radius: 10,
  shadowXs: "0 1px 2px rgba(20,16,12,0.04)",
} as const;

// ─── Avatar colour palette (deterministic from initials) ─────────────────────

const AVATAR_COLORS = [
  "#D97757", "#6366F1", "#0EA5E9", "#EC4899",
  "#8B5CF6", "#10B981", "#F59E0B", "#EF4444",
];

function avatarColor(name: string | null): string {
  if (!name) return T.fgSubtle;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconLink({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function IconCopy({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function IconCheck({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconRefresh({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6"/>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
      <path d="M3 22v-6h6"/>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
    </svg>
  );
}

function IconPlus({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function IconClock({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function IconStar({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatExpiresAt(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatJoinedAt(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ParticipantsTab({
  participants,
  activeInvite,
  currentUserRole,
}: ParticipantsTabProps) {
  const params = useParams<{ id: string }>();
  const tripId = params.id;

  // Invite state — starts from prop, updated optimistically after generate/regen
  const [invite, setInvite] = useState<Pick<TripInvite, "token" | "expiresAt"> | null>(activeInvite);

  // Origin resolved client-side to avoid SSR mismatch
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  // Async state for server action
  const [isPending, startTransition] = useTransition();

  // Copy-button feedback state
  const [copied, setCopied] = useState(false);

  // Error feedback for server action failures
  const [actionError, setActionError] = useState<string | null>(null);

  const inviteUrl = invite ? `${origin}/invite/${invite.token}` : "";

  async function handleCopy() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: seleziona l'URL dal campo di testo se visibile
      const input = document.querySelector<HTMLInputElement>('input[data-invite-url]');
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }

  function handleGenerateOrRegen() {
    setActionError(null);
    startTransition(async () => {
      const result = await generateInviteLink(tripId);
      if (result.success) {
        setInvite({ token: result.token, expiresAt: result.expiresAt });
        setCopied(false);
        setActionError(null);
      } else {
        setActionError(result.error);
      }
    });
  }

  const activeParticipants = participants.filter((p) => p.status === "ACTIVE");
  const deactivatedParticipants = participants.filter((p) => p.status === "DEACTIVATED");
  const isOrganizer = currentUserRole === "ORGANIZER";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily: T.fontSans,
      }}
    >
      <style>{`
        .invite-copy-btn:hover:not(:disabled) { background: #C94A40 !important; border-color: #C94A40 !important; }
        .invite-regen-btn:hover:not(:disabled) { background: #F6F4F0 !important; color: #1B1A19 !important; }
        .invite-gen-btn:hover:not(:disabled) { background: #C94A40 !important; border-color: #C94A40 !important; }
        .participant-row:hover { background: #FAFAF7 !important; }
      `}</style>
      {/* ── Invite link section (organizer only) ── */}
      {isOrganizer && (
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.radius,
            boxShadow: T.shadowXs,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px 12px",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: invite ? T.primarySoft : T.surface2,
                  color: invite ? T.primary : T.fgMuted,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <IconLink size={15} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontFamily: T.fontDisplay,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    color: T.fg,
                  }}
                >
                  Link di invito
                </div>
                <div style={{ fontSize: 11.5, color: T.fgMuted, marginTop: 1 }}>
                  Solo gli organizzatori possono generare link
                </div>
              </div>
            </div>

            {/* Active / no-link badge */}
            {invite ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 8px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 999,
                  background: T.successSoft,
                  color: T.success,
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3.5" fill="currentColor"/>
                </svg>
                Attivo
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 8px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 999,
                  background: T.surface2,
                  color: T.fgMuted,
                  border: `1px solid ${T.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3.5" fill="currentColor"/>
                </svg>
                Nessun link
              </span>
            )}
          </div>

          {/* Body — active link */}
          {invite ? (
            <div style={{ padding: "16px 18px" }}>
              {/* Link row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    background: copied ? T.successSoft : T.bg,
                    border: `1px solid ${copied ? "rgba(47,138,95,0.3)" : T.border}`,
                    borderRadius: T.radiusSm,
                    padding: "8px 12px",
                    gap: 8,
                    minWidth: 0,
                    transition: "background .15s, border-color .15s",
                  }}
                >
                  <span style={{ flexShrink: 0, color: copied ? T.success : T.fgSubtle }}>
                    <IconLink size={13} />
                  </span>
                  <input
                    type="text"
                    readOnly
                    data-invite-url
                    value={inviteUrl || `…/invite/${invite.token}`}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: T.fg,
                      fontVariantNumeric: "tabular-nums",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      padding: 0,
                      cursor: "default",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* Copy button */}
                <button
                  type="button"
                  className="invite-copy-btn"
                  onClick={handleCopy}
                  disabled={copied}
                  style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: T.radiusSm,
                    border: `1px solid ${copied ? T.success : T.primary}`,
                    background: copied ? T.success : T.primary,
                    color: "white",
                    cursor: copied ? "default" : "pointer",
                    transition: "background .12s, border-color .12s, transform .06s",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                  }}
                >
                  {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                  {copied ? "Copiato!" : "Copia"}
                </button>
              </div>

              {/* Expiry + regen row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11.5,
                    color: T.fgMuted,
                  }}
                >
                  <IconClock size={12} />
                  Scade il{" "}
                  <strong style={{ color: T.fg, marginLeft: 3 }}>
                    {formatExpiresAt(invite.expiresAt)}
                  </strong>
                </div>

                <button
                  type="button"
                  className="invite-regen-btn"
                  onClick={handleGenerateOrRegen}
                  disabled={isPending}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    fontSize: 11.5,
                    fontWeight: 600,
                    borderRadius: 5,
                    border: `1px solid ${T.borderStrong}`,
                    background: "transparent",
                    color: isPending ? T.fgSubtle : T.fgMuted,
                    cursor: isPending ? "not-allowed" : "pointer",
                    transition: "background .12s, color .12s",
                    fontFamily: "inherit",
                  }}
                >
                  <IconRefresh size={11} />
                  {isPending ? "Rigenerazione…" : "Rigenera"}
                </button>
              </div>
              {actionError && (
                <p style={{ fontSize: 12, color: "#C44A40", marginTop: 6, margin: "6px 0 0" }}>{actionError}</p>
              )}
            </div>
          ) : (
            /* Body — no active link */
            <div style={{ padding: "24px 18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: T.bg,
                  border: `1.5px dashed ${T.borderStrong}`,
                  borderRadius: T.radius,
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: T.surface2,
                    color: T.fgSubtle,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconLink size={20} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: T.fontDisplay,
                      color: T.fg,
                      marginBottom: 2,
                    }}
                  >
                    Nessun link di invito attivo
                  </div>
                  <div style={{ fontSize: 12, color: T.fgMuted, lineHeight: 1.4 }}>
                    Genera un link per invitare i tuoi amici senza dover inserire ogni email.
                  </div>
                </div>

                <button
                  type="button"
                  className="invite-gen-btn"
                  onClick={handleGenerateOrRegen}
                  disabled={isPending}
                  style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: T.radiusSm,
                    border: `1px solid ${T.primary}`,
                    background: isPending ? T.primaryHover : T.primary,
                    color: "white",
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.7 : 1,
                    transition: "background .12s, border-color .12s, transform .06s",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                  }}
                >
                  <IconPlus size={13} />
                  {isPending ? "Generazione…" : "Genera link di invito"}
                </button>
              </div>
              {actionError && (
                <p style={{ fontSize: 12, color: "#C44A40", marginTop: 6, margin: "6px 0 0" }}>{actionError}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Participants list ── */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: T.radius,
          boxShadow: T.shadowXs,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px 12px",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <h2
            style={{
              fontSize: 13.5,
              fontFamily: T.fontDisplay,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: T.fg,
              margin: 0,
            }}
          >
            Partecipanti
          </h2>
          <span style={{ fontSize: 12, color: T.fgMuted, fontWeight: 500 }}>
            {activeParticipants.length} {activeParticipants.length === 1 ? "attivo" : "attivi"}
          </span>
        </div>

        {/* Active participants */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {activeParticipants.map((p) => (
            <ParticipantRow key={p.id} participant={p} />
          ))}

          {/* Deactivated separator + rows */}
          {deactivatedParticipants.length > 0 && (
            <>
              <div
                style={{
                  padding: "10px 18px 6px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.fgSubtle,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Disattivati
                </span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>

              {deactivatedParticipants.map((p) => (
                <ParticipantRow key={p.id} participant={p} deactivated />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Participant row sub-component ───────────────────────────────────────────

function ParticipantRow({
  participant,
  deactivated = false,
}: {
  participant: ParticipantWithUser;
  deactivated?: boolean;
}) {
  const { user, role, createdAt: joinedAt } = participant;
  const displayName = user.name ?? user.email;
  const bg = deactivated ? "#A09C97" : avatarColor(user.name);
  const inits = initials(user.name, user.email);

  return (
    <div
      className="participant-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "11px 18px",
        borderBottom: `1px solid ${T.border}`,
        opacity: deactivated ? 0.55 : 1,
        transition: "background .1s",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 12,
          color: "white",
          flexShrink: 0,
          background: bg,
        }}
      >
        {inits}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            fontFamily: T.fontDisplay,
            color: deactivated ? T.fgMuted : T.fg,
            letterSpacing: "-0.01em",
            textDecoration: deactivated ? "line-through" : "none",
          }}
        >
          {displayName}
        </div>
        <div
          style={{
            fontSize: 12,
            color: T.fgMuted,
            marginTop: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.email}
        </div>
      </div>

      {/* Role badge */}
      {deactivated ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            fontSize: 11.5,
            fontWeight: 600,
            borderRadius: 999,
            background: T.surface2,
            color: T.fgMuted,
            border: `1px solid ${T.border}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Disattivato
        </span>
      ) : role === "ORGANIZER" ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            fontSize: 11.5,
            fontWeight: 600,
            borderRadius: 999,
            background: T.primarySoft,
            color: T.primaryHover,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <IconStar size={9} />
          Organizzatore
        </span>
      ) : (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            fontSize: 11.5,
            fontWeight: 600,
            borderRadius: 999,
            background: "#E5F2EC",
            color: "#2F8A5F",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Partecipante
        </span>
      )}

      {/* Joined date */}
      <span
        style={{
          fontSize: 11,
          color: T.fgSubtle,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {deactivated ? "–" : formatJoinedAt(joinedAt)}
      </span>
    </div>
  );
}
