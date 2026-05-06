import { vi, describe, it, expect, beforeEach } from "vitest";
import { createTrip } from "@/app/actions/trips";

// --- Mocks ---

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// --- Typed imports of mocked modules (after vi.mock hoisting) ---

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const mockCreateClient = vi.mocked(createClient);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;
const mockRevalidatePath = vi.mocked(revalidatePath);

// --- Helpers ---

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

function setupAuthenticatedUser() {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "supabase-user-id" } },
      }),
    },
  } as never);

  mockPrisma.user.findUnique.mockResolvedValue({ id: "db-user-id" } as never);
}

function setupSuccessfulTransaction(tripId = "trip-e2e-001") {
  mockPrisma.$transaction.mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) =>
    cb({
      trip: {
        create: vi.fn().mockResolvedValue({ id: tripId }),
      },
      tripParticipant: {
        create: vi.fn().mockResolvedValue({}),
      },
    })
  );
}

// --- E2E Acceptance Criteria Tests ---

describe("US-001: Creazione Viaggio — Scenari Acceptance Criteria", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  describe("Scenario 1 — Creazione valida", () => {
    beforeEach(() => {
      setupAuthenticatedUser();
      setupSuccessfulTransaction("trip-e2e-001");
    });

    it("l'utente vede la nuova trip card comparire in lista dopo il salvataggio", async () => {
      const fd = makeFormData({
        name: "Viaggio a Lisbona",
        startDate: "2026-09-01",
        endDate: "2026-09-10",
        destination: "Lisbona",
      });

      const result = await createTrip(fd);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tripId).toBe("trip-e2e-001");
      }
    });

    it("la dashboard viene aggiornata (revalidatePath chiamata) così la lista riflette il nuovo viaggio", async () => {
      const fd = makeFormData({
        name: "Viaggio a Lisbona",
        startDate: "2026-09-01",
        endDate: "2026-09-10",
        destination: "Lisbona",
      });

      await createTrip(fd);

      expect(mockRevalidatePath).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    });

    it("il viaggio viene persistito nel DB tramite transazione atomica", async () => {
      const fd = makeFormData({
        name: "Viaggio a Lisbona",
        startDate: "2026-09-01",
        endDate: "2026-09-10",
        destination: "Lisbona",
      });

      await createTrip(fd);

      expect(mockPrisma.$transaction).toHaveBeenCalledOnce();
    });
  });

  // ---------------------------------------------------------------------------
  describe("Scenario 2 — Data fine precedente a data inizio", () => {
    beforeEach(() => {
      setupAuthenticatedUser();
    });

    it("l'utente vede un errore inline sulla data di fine senza che il viaggio venga creato", async () => {
      const fd = makeFormData({
        name: "Viaggio a Berlino",
        startDate: "2026-09-20",
        endDate: "2026-09-15",
        destination: "Berlino",
      });

      const result = await createTrip(fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.endDate).toBeTruthy();
        expect(result.errors.endDate).toMatch(/data di fine/i);
      }
    });

    it("nessun dato viene scritto nel DB quando la data di fine è antecedente a quella di inizio", async () => {
      const fd = makeFormData({
        name: "Viaggio a Berlino",
        startDate: "2026-09-20",
        endDate: "2026-09-15",
        destination: "Berlino",
      });

      await createTrip(fd);

      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it("solo il campo endDate riporta un errore, gli altri campi validi non ne mostrano", async () => {
      const fd = makeFormData({
        name: "Viaggio a Berlino",
        startDate: "2026-09-20",
        endDate: "2026-09-15",
        destination: "Berlino",
      });

      const result = await createTrip(fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.endDate).toBeTruthy();
        expect(result.errors.name).toBeUndefined();
        expect(result.errors.startDate).toBeUndefined();
        expect(result.errors.destination).toBeUndefined();
      }
    });
  });

  // ---------------------------------------------------------------------------
  describe("Scenario 3 — Campi obbligatori mancanti", () => {
    beforeEach(() => {
      setupAuthenticatedUser();
    });

    it("l'utente vede un messaggio di errore per ogni campo obbligatorio lasciato vuoto", async () => {
      const fd = makeFormData({});

      const result = await createTrip(fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.name).toBeTruthy();
        expect(result.errors.startDate).toBeTruthy();
        expect(result.errors.endDate).toBeTruthy();
        expect(result.errors.destination).toBeTruthy();
      }
    });

    it("non viene effettuata alcuna scrittura nel DB quando il form è vuoto", async () => {
      const fd = makeFormData({});

      await createTrip(fd);

      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it("tutti e quattro i campi obbligatori restituiscono un messaggio di errore specifico", async () => {
      const fd = makeFormData({});

      const result = await createTrip(fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(Object.keys(result.errors)).toEqual(
          expect.arrayContaining(["name", "startDate", "endDate", "destination"])
        );
      }
    });
  });

  // ---------------------------------------------------------------------------
  describe("Scenario 4 — Utente non autenticato", () => {
    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      } as never);
    });

    it("l'utente non autenticato riceve un errore di autenticazione anziché accedere al form di creazione", async () => {
      const fd = makeFormData({
        name: "Viaggio a Tokyo",
        startDate: "2026-11-01",
        endDate: "2026-11-15",
        destination: "Tokyo",
      });

      const result = await createTrip(fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors._form).toBeTruthy();
        expect(result.errors._form).toBe("Non autenticato.");
      }
    });

    it("nessuna query al DB viene eseguita per utenti non autenticati", async () => {
      const fd = makeFormData({
        name: "Viaggio a Tokyo",
        startDate: "2026-11-01",
        endDate: "2026-11-15",
        destination: "Tokyo",
      });

      await createTrip(fd);

      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("l'errore di autenticazione è l'unico errore restituito (nessun errore di validazione campo)", async () => {
      const fd = makeFormData({
        name: "Viaggio a Tokyo",
        startDate: "2026-11-01",
        endDate: "2026-11-15",
        destination: "Tokyo",
      });

      const result = await createTrip(fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(Object.keys(result.errors)).toEqual(["_form"]);
      }
    });
  });
});
