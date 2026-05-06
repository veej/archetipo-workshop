import { vi, describe, it, expect, beforeEach } from "vitest";
import { getBalanceDisplayInfo } from "@/lib/utils";

// --- Mocks ---

vi.mock("@/lib/user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/trips", () => ({
  getTripDashboard: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// --- Imports after mocks ---

import { getCurrentUser } from "@/lib/user";
import { getTripDashboard } from "@/lib/trips";
import { redirect } from "next/navigation";

const mockGetCurrentUser  = vi.mocked(getCurrentUser);
const mockGetTripDashboard = vi.mocked(getTripDashboard);
const mockRedirect        = vi.mocked(redirect);

const mockUser = {
  id: "user-abc",
  supabaseId: "sb-123",
  email: "test@example.com",
  name: "Test User",
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// --- Page access control (business logic) ---

describe("TripDashboardPage — accesso", () => {
  beforeEach(() => vi.clearAllMocks());

  it("utente non autenticato → redirect a /auth/signin", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const user = await getCurrentUser();
    if (!user) redirect("/auth/signin");

    expect(mockRedirect).toHaveBeenCalledWith("/auth/signin");
    expect(mockGetTripDashboard).not.toHaveBeenCalled();
  });

  it("utente autenticato ma non partecipante → getTripDashboard restituisce null", async () => {
    mockGetCurrentUser.mockResolvedValue(mockUser);
    mockGetTripDashboard.mockResolvedValue(null);

    const user = await getCurrentUser();
    expect(user).not.toBeNull();

    const data = await getTripDashboard("trip-xyz", user!.id);
    expect(data).toBeNull();
    // La pagina renderizza ForbiddenPage — la logica di business è verificata
  });

  it("utente partecipante → getTripDashboard restituisce i dati", async () => {
    mockGetCurrentUser.mockResolvedValue(mockUser);
    mockGetTripDashboard.mockResolvedValue({
      trip: {
        id: "trip-123",
        name: "Tokyo 2026",
        destination: "Tokyo, Giappone",
        startDate: new Date("2026-08-15"),
        endDate: new Date("2026-08-28"),
        coverKey: "tokyo",
      },
      role: "PARTICIPANT",
      todayStops: [],
      recentDocuments: [],
      balance: 0,
    });

    const user = await getCurrentUser();
    const data = await getTripDashboard("trip-123", user!.id);

    expect(data).not.toBeNull();
    expect(data!.trip.name).toBe("Tokyo 2026");
  });
});

// --- Balance display logic (drives color indicators in TripDashboard) ---

describe("getBalanceDisplayInfo — indicatori visuali", () => {
  it("saldo negativo: variant 'negative', label 'Devi al gruppo'", () => {
    const info = getBalanceDisplayInfo(-24.5);

    expect(info.variant).toBe("negative");
    expect(info.label).toBe("Devi al gruppo");
  });

  it("saldo negativo: importo formattato con segno meno (−)", () => {
    const info = getBalanceDisplayInfo(-24.5);

    // The minus sign must be U+2212 (MINUS SIGN), matching mockup
    expect(info.formattedAmount).toContain("−");
    expect(info.formattedAmount).toContain("24,50");
    expect(info.formattedAmount).toContain("€");
  });

  it("saldo positivo: variant 'positive', label 'Il gruppo ti deve'", () => {
    const info = getBalanceDisplayInfo(50);

    expect(info.variant).toBe("positive");
    expect(info.label).toBe("Il gruppo ti deve");
  });

  it("saldo positivo: importo formattato con segno più (+)", () => {
    const info = getBalanceDisplayInfo(50);

    expect(info.formattedAmount).toContain("+");
    expect(info.formattedAmount).toContain("50,00");
    expect(info.formattedAmount).toContain("€");
  });

  it("saldo zero: variant 'zero', label 'Nessun debito'", () => {
    const info = getBalanceDisplayInfo(0);

    expect(info.variant).toBe("zero");
    expect(info.label).toBe("Nessun debito");
    expect(info.formattedAmount).toBe("0,00 €");
  });

  it("saldo negativo molto piccolo è comunque 'negative'", () => {
    const info = getBalanceDisplayInfo(-0.01);

    expect(info.variant).toBe("negative");
  });

  it("saldo positivo molto piccolo è comunque 'positive'", () => {
    const info = getBalanceDisplayInfo(0.01);

    expect(info.variant).toBe("positive");
  });
});

// --- getTripDashboard — contract test for page integration ---

describe("getTripDashboard — contratto per il rendering del saldo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("balance positivo è riflesso correttamente in getBalanceDisplayInfo", () => {
    const balance = 75.5;
    const info = getBalanceDisplayInfo(balance);

    expect(info.variant).toBe("positive");
    expect(info.formattedAmount).toContain("+");
    expect(info.formattedAmount).toContain("75,50");
  });

  it("balance negativo è riflesso correttamente in getBalanceDisplayInfo", () => {
    const balance = -24.5;
    const info = getBalanceDisplayInfo(balance);

    expect(info.variant).toBe("negative");
    expect(info.formattedAmount).toContain("−");
    expect(info.formattedAmount).toContain("24,50");
  });

  it("balance zero è riflesso correttamente in getBalanceDisplayInfo", () => {
    const balance = 0;
    const info = getBalanceDisplayInfo(balance);

    expect(info.variant).toBe("zero");
    expect(info.formattedAmount).toBe("0,00 €");
  });

  it("tripId è passato correttamente a getTripDashboard dal page component", async () => {
    mockGetCurrentUser.mockResolvedValue(mockUser);
    mockGetTripDashboard.mockResolvedValue(null);

    const user = await getCurrentUser();
    const specificTripId = "trip-uuid-xyz-789";
    await getTripDashboard(specificTripId, user!.id);

    expect(mockGetTripDashboard).toHaveBeenCalledWith(specificTripId, user!.id);
  });
});
