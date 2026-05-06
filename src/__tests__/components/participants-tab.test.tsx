import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { TripParticipant, User } from "@prisma/client";

// --- Mocks ---

vi.mock("next/navigation", () => ({
  useParams: vi.fn().mockReturnValue({ id: "trip-123" }),
}));

vi.mock("@/app/actions/invites", () => ({
  generateInviteLink: vi.fn(),
}));

// --- Typed import after mocks ---

import { ParticipantsTab } from "@/components/trips/participants-tab";

// --- Types ---

type ParticipantWithUser = TripParticipant & {
  user: Pick<User, "id" | "name" | "email" | "image">;
};

// --- Helper ---

let _participantCounter = 0;

function makeParticipant(overrides: Partial<ParticipantWithUser> = {}): ParticipantWithUser {
  _participantCounter += 1;
  return {
    id: `participant-${_participantCounter}`,
    tripId: "trip-123",
    userId: `user-${_participantCounter}`,
    role: "PARTICIPANT",
    status: "ACTIVE",
    createdAt: new Date("2026-01-15T10:00:00Z"),
    user: {
      id: `user-${_participantCounter}`,
      name: `Utente ${_participantCounter}`,
      email: `utente${_participantCounter}@example.com`,
      image: null,
    },
    ...overrides,
    user: {
      id: `user-${_participantCounter}`,
      name: `Utente ${_participantCounter}`,
      email: `utente${_participantCounter}@example.com`,
      image: null,
      ...(overrides.user ?? {}),
    },
  };
}

// --- Tests ---

describe("ParticipantsTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _participantCounter = 0;
  });

  // 1. Senza link attivo — ORGANIZER vede "Nessun link di invito attivo"
  it("senza link attivo mostra messaggio e pulsante Genera per ORGANIZER", () => {
    const orgParticipant = makeParticipant({ role: "ORGANIZER" });

    render(
      <ParticipantsTab
        participants={[orgParticipant]}
        activeInvite={null}
        currentUserRole="ORGANIZER"
      />
    );

    expect(screen.getByText("Nessun link di invito attivo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /genera link di invito/i })).toBeInTheDocument();
  });

  // 2. Con link attivo — ORGANIZER vede URL e pulsanti Copia e Rigenera
  it("con link attivo mostra token, pulsante Copia e pulsante Rigenera per ORGANIZER", () => {
    const orgParticipant = makeParticipant({ role: "ORGANIZER" });

    render(
      <ParticipantsTab
        participants={[orgParticipant]}
        activeInvite={{ token: "tok123", expiresAt: new Date(Date.now() + 3600000) }}
        currentUserRole="ORGANIZER"
      />
    );

    // Token is in a readonly input — use getByDisplayValue
    expect(screen.getByDisplayValue(/tok123/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copia/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rigenera/i })).toBeInTheDocument();
  });

  // 3. PARTICIPANT non vede la sezione link
  it("PARTICIPANT non vede la sezione Link di invito", () => {
    const participant = makeParticipant({ role: "PARTICIPANT" });

    render(
      <ParticipantsTab
        participants={[participant]}
        activeInvite={null}
        currentUserRole="PARTICIPANT"
      />
    );

    expect(screen.queryByText("Link di invito")).not.toBeInTheDocument();
  });

  // 4. Partecipanti attivi mostrati con badge corretto
  it("mostra badge Organizzatore e Partecipante per i partecipanti attivi", () => {
    const organizer = makeParticipant({
      role: "ORGANIZER",
      user: { id: "u1", name: "Alice Rossi", email: "alice@example.com", image: null },
    });
    const participant = makeParticipant({
      role: "PARTICIPANT",
      user: { id: "u2", name: "Bob Bianchi", email: "bob@example.com", image: null },
    });

    render(
      <ParticipantsTab
        participants={[organizer, participant]}
        activeInvite={null}
        currentUserRole="ORGANIZER"
      />
    );

    expect(screen.getByText("Organizzatore")).toBeInTheDocument();
    expect(screen.getByText("Partecipante")).toBeInTheDocument();
  });

  // M4 — click "Copia" → pulsante diventa "Copiato!"
  it("click sul pulsante Copia aggiorna il testo a Copiato!", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const orgParticipant = makeParticipant({ role: "ORGANIZER" });

    render(
      <ParticipantsTab
        participants={[orgParticipant]}
        activeInvite={{ token: "tok-copy", expiresAt: new Date(Date.now() + 3600000) }}
        currentUserRole="ORGANIZER"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /copia/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copiato!/i })).toBeInTheDocument();
    });
  });

  // 5. Partecipanti disattivati mostrati sotto separatore
  it("mostra il separatore Disattivati quando ci sono partecipanti disattivati", () => {
    const activeP = makeParticipant({
      status: "ACTIVE",
      user: { id: "u1", name: "Carlo Verdi", email: "carlo@example.com", image: null },
    });
    const deactivatedP = makeParticipant({
      status: "DEACTIVATED",
      user: { id: "u2", name: "Diana Neri", email: "diana@example.com", image: null },
    });

    render(
      <ParticipantsTab
        participants={[activeP, deactivatedP]}
        activeInvite={null}
        currentUserRole="ORGANIZER"
      />
    );

    expect(screen.getByText("Disattivati")).toBeInTheDocument();
  });
});
