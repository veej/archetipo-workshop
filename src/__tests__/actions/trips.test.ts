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

// --- Helper ---

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const validFields = {
  name: "Viaggio a Roma",
  startDate: "2026-09-01",
  endDate: "2026-09-10",
  destination: "Roma",
};

// Default: authenticated user + matching DB user
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

// Default transaction mock: executes the callback and returns the new trip
function setupSuccessfulTransaction(tripId = "trip-123") {
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

// --- Tests ---

describe("createTrip — validazione", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Every validation test needs an authenticated user so we don't short-circuit
    // on the auth check before reaching field validation.
    setupAuthenticatedUser();
  });

  it("restituisce errore se name è mancante", async () => {
    const fd = makeFormData({
      startDate: validFields.startDate,
      endDate: validFields.endDate,
      destination: validFields.destination,
    });

    const result = await createTrip(fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toBeTruthy();
    }
  });

  it("restituisce errore se startDate è mancante", async () => {
    const fd = makeFormData({
      name: validFields.name,
      endDate: validFields.endDate,
      destination: validFields.destination,
    });

    const result = await createTrip(fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.startDate).toBeTruthy();
    }
  });

  it("restituisce errore se endDate è mancante", async () => {
    const fd = makeFormData({
      name: validFields.name,
      startDate: validFields.startDate,
      destination: validFields.destination,
    });

    const result = await createTrip(fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.endDate).toBeTruthy();
    }
  });

  it("restituisce errore se destination è mancante", async () => {
    const fd = makeFormData({
      name: validFields.name,
      startDate: validFields.startDate,
      endDate: validFields.endDate,
    });

    const result = await createTrip(fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.destination).toBeTruthy();
    }
  });

  it("restituisce errore se endDate è precedente a startDate", async () => {
    const fd = makeFormData({
      name: validFields.name,
      startDate: "2026-09-20",
      endDate: "2026-09-15",
      destination: validFields.destination,
    });

    const result = await createTrip(fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.endDate).toBeTruthy();
    }
  });

  it("restituisce errore _form se utente non autenticato", async () => {
    // Override: unauthenticated user
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    } as never);

    const fd = makeFormData(validFields);

    const result = await createTrip(fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors._form).toBeTruthy();
    }
  });
});

describe("createTrip — successo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticatedUser();
    setupSuccessfulTransaction();
  });

  it("crea Trip e TripParticipant in transazione con dati validi", async () => {
    const fd = makeFormData(validFields);

    await createTrip(fd);

    expect(mockPrisma.$transaction).toHaveBeenCalledOnce();
  });

  it("restituisce { success: true, tripId } con dati validi", async () => {
    const fd = makeFormData(validFields);

    const result = await createTrip(fd);

    expect(result).toEqual({ success: true, tripId: "trip-123" });
  });

  it("chiama revalidatePath('/dashboard') dopo creazione", async () => {
    const fd = makeFormData(validFields);

    await createTrip(fd);

    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("imposta coverKey a null se non fornito", async () => {
    const fd = makeFormData(validFields); // no coverKey field

    // Capture the tx object passed to the callback
    let capturedTripCreate: ReturnType<typeof vi.fn> | undefined;

    mockPrisma.$transaction.mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) => {
      const tripCreate = vi.fn().mockResolvedValue({ id: "trip-456" });
      capturedTripCreate = tripCreate;
      return cb({
        trip: { create: tripCreate },
        tripParticipant: { create: vi.fn().mockResolvedValue({}) },
      });
    });

    await createTrip(fd);

    expect(capturedTripCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ coverKey: null }),
      })
    );
  });
});
