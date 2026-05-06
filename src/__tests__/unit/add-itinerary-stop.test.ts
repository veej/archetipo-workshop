import { vi, describe, it, expect, beforeEach } from "vitest";

// --- Mocks ---

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    tripParticipant: { findUnique: vi.fn() },
    itineraryStop: { create: vi.fn() },
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// --- Typed imports after mocks ---

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { addItineraryStop } from "@/app/actions/itinerary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCreateClient = createClient as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRevalidatePath = revalidatePath as any;

// --- Constants ---

const TRIP_ID = "trip-123";
const SUPABASE_USER_ID = "supabase-uid-abc";
const DB_USER_ID = "db-user-uuid-abc";

// --- Helpers ---

function makeFormData(fields: Record<string, string> = {}): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

function setupAuthUser(supabaseUserId: string | null = SUPABASE_USER_ID) {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: supabaseUserId ? { id: supabaseUserId } : null },
      }),
    },
  });
}

function setupDbUser(userId: string | null = DB_USER_ID) {
  mockPrisma.user.findUnique.mockResolvedValue(
    userId ? { id: userId } : null
  );
}

function setupParticipation(overrides: { role?: string; status?: string } | null = {}) {
  mockPrisma.tripParticipant.findUnique.mockResolvedValue(
    overrides === null
      ? null
      : {
          role: overrides.role ?? "ORGANIZER",
          status: overrides.status ?? "ACTIVE",
        }
  );
}

// --- Tests ---

describe("addItineraryStop — autenticazione e autorizzazione", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.itineraryStop.create.mockResolvedValue({});
  });

  it("utente non autenticato (supabase user null) → errore Non autenticato", async () => {
    setupAuthUser(null);

    const result = await addItineraryStop(TRIP_ID, null, makeFormData());

    expect(result).toEqual({
      success: false,
      errors: { _form: "Non autenticato." },
    });
  });

  it("utente DB non trovato (user.findUnique → null) → errore Utente non trovato", async () => {
    setupAuthUser();
    setupDbUser(null);

    const result = await addItineraryStop(TRIP_ID, null, makeFormData());

    expect(result).toEqual({
      success: false,
      errors: { _form: "Utente non trovato nel database." },
    });
  });

  it("partecipante con ruolo PARTICIPANT → errore Solo gli organizzatori", async () => {
    setupAuthUser();
    setupDbUser();
    setupParticipation({ role: "PARTICIPANT" });

    const result = await addItineraryStop(TRIP_ID, null, makeFormData());

    expect(result).toEqual({
      success: false,
      errors: { _form: "Solo gli organizzatori possono aggiungere tappe." },
    });
  });

  it("partecipante con status DEACTIVATED → errore Solo gli organizzatori", async () => {
    setupAuthUser();
    setupDbUser();
    setupParticipation({ role: "ORGANIZER", status: "DEACTIVATED" });

    const result = await addItineraryStop(TRIP_ID, null, makeFormData());

    expect(result).toEqual({
      success: false,
      errors: { _form: "Solo gli organizzatori possono aggiungere tappe." },
    });
  });

  it("partecipante non trovato (tripParticipant.findUnique → null) → errore Solo gli organizzatori", async () => {
    setupAuthUser();
    setupDbUser();
    setupParticipation(null);

    const result = await addItineraryStop(TRIP_ID, null, makeFormData());

    expect(result).toEqual({
      success: false,
      errors: { _form: "Solo gli organizzatori possono aggiungere tappe." },
    });
  });
});

describe("addItineraryStop — validazione campi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthUser();
    setupDbUser();
    setupParticipation();
    mockPrisma.itineraryStop.create.mockResolvedValue({});
  });

  it("campo name mancante → errore sul campo name", async () => {
    const fd = makeFormData({ date: "2026-08-20" });

    const result = await addItineraryStop(TRIP_ID, null, fd);

    expect(result).toEqual({
      success: false,
      errors: { name: "Il nome della tappa è obbligatorio." },
    });
  });

  it("campo name solo spazi → errore sul campo name", async () => {
    const fd = makeFormData({ name: "   ", date: "2026-08-20" });

    const result = await addItineraryStop(TRIP_ID, null, fd);

    expect(result).toEqual({
      success: false,
      errors: { name: "Il nome della tappa è obbligatorio." },
    });
  });

  it("campo date mancante → errore sul campo date", async () => {
    const fd = makeFormData({ name: "Visita al Colosseo" });

    const result = await addItineraryStop(TRIP_ID, null, fd);

    expect(result).toEqual({
      success: false,
      errors: { date: "Seleziona un giorno del viaggio." },
    });
  });

  it("sia name che date mancanti → errori su entrambi i campi", async () => {
    const fd = makeFormData();

    const result = await addItineraryStop(TRIP_ID, null, fd);

    expect(result).toMatchObject({
      success: false,
      errors: expect.objectContaining({
        name: expect.any(String),
        date: expect.any(String),
      }),
    });
  });
});

describe("addItineraryStop — successo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthUser();
    setupDbUser();
    setupParticipation();
    mockPrisma.itineraryStop.create.mockResolvedValue({});
  });

  it("dati validi (name + date, organizzatore) → { success: true }", async () => {
    const fd = makeFormData({ name: "Visita al Colosseo", date: "2026-08-20" });

    const result = await addItineraryStop(TRIP_ID, null, fd);

    expect(result).toEqual({ success: true });
  });

  it("itineraryStop.create è chiamato con i dati corretti", async () => {
    const fd = makeFormData({
      name: "Visita al Colosseo",
      date: "2026-08-20",
      time: "10:30",
      address: "Piazza del Colosseo, Roma",
      notes: "Portare acqua",
    });

    await addItineraryStop(TRIP_ID, null, fd);

    expect(mockPrisma.itineraryStop.create).toHaveBeenCalledWith({
      data: {
        tripId: TRIP_ID,
        name: "Visita al Colosseo",
        date: new Date(2026, 7, 20),
        time: "10:30",
        address: "Piazza del Colosseo, Roma",
        notes: "Portare acqua",
      },
    });
  });

  it("campi opzionali omessi → salvati come null", async () => {
    const fd = makeFormData({ name: "Arrivo hotel", date: "2026-08-20" });

    await addItineraryStop(TRIP_ID, null, fd);

    expect(mockPrisma.itineraryStop.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        time: null,
        address: null,
        notes: null,
      }),
    });
  });

  it("revalidatePath è chiamato con il percorso corretto dopo la creazione", async () => {
    const fd = makeFormData({ name: "Colosseo", date: "2026-08-20" });

    await addItineraryStop(TRIP_ID, null, fd);

    expect(mockRevalidatePath).toHaveBeenCalledWith(`/trips/${TRIP_ID}/itinerary`);
  });

  it("revalidatePath NON è chiamato in caso di errore di validazione", async () => {
    const fd = makeFormData({ date: "2026-08-20" }); // name mancante

    await addItineraryStop(TRIP_ID, null, fd);

    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
