import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// --- Mocks (hoisted before imports) ---

const mockToastSuccess = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useParams: vi.fn().mockReturnValue({ id: "trip-123" }),
}));

vi.mock("@/app/actions/itinerary", () => ({
  addItineraryStop: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: mockToastSuccess },
}));

// --- Typed imports after mocks ---

import { AddStopModal } from "@/components/trips/add-stop-modal";
import { addItineraryStop } from "@/app/actions/itinerary";

// --- Fixtures ---

const trip = {
  name: "Lisbona 2026",
  startDate: new Date("2026-05-22"),
  endDate: new Date("2026-05-25"),
};
const tripId = "trip-123";

function renderModal(onOpenChange = vi.fn()) {
  return render(
    <AddStopModal
      open={true}
      onOpenChange={onOpenChange}
      tripId={tripId}
      trip={trip}
    />
  );
}

// --- Tests ---

describe("AddStopModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Errori di validazione mostrati inline
  describe("errori di validazione", () => {
    it("mostra gli errori inline per nome e data quando l'azione restituisce errori", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({
        success: false,
        errors: {
          name: "Il nome della tappa è obbligatorio.",
          date: "Seleziona un giorno del viaggio.",
        },
      });

      renderModal();

      fireEvent.click(screen.getByRole("button", { name: /aggiungi tappa/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Il nome della tappa è obbligatorio.")
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText("Seleziona un giorno del viaggio.")
      ).toBeInTheDocument();
    });

    it("mostra il messaggio di errore per il campo nome sotto l'input corretto", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({
        success: false,
        errors: { name: "Il nome della tappa è obbligatorio." },
      });

      renderModal();

      fireEvent.click(screen.getByRole("button", { name: /aggiungi tappa/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Il nome della tappa è obbligatorio.")
        ).toBeInTheDocument();
      });

      // L'errore non deve comparire nell'header (description)
      const description = document.querySelector("[data-slot='dialog-description']");
      if (description) {
        expect(description.textContent).not.toContain("Il nome della tappa è obbligatorio.");
      }
    });
  });

  // 2. I campi opzionali non bloccano il submit
  describe("campi opzionali", () => {
    it("il pulsante Aggiungi tappa non è disabilitato all'apertura del modale", () => {
      renderModal();
      const submitButton = screen.getByRole("button", { name: /aggiungi tappa/i });
      expect(submitButton).not.toBeDisabled();
    });

    it("invoca l'azione con solo nome compilato (giorno già selezionato di default)", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({ success: true });

      renderModal();

      const nameInput = screen.getByPlaceholderText(/visita alla torre/i);
      fireEvent.change(nameInput, { target: { value: "Check-in hotel" } });

      fireEvent.click(screen.getByRole("button", { name: /aggiungi tappa/i }));

      await waitFor(() => {
        expect(addItineraryStop).toHaveBeenCalled();
      });
    });

    it("non mostra errori di validazione se non è stato ancora eseguito il submit", () => {
      renderModal();

      expect(
        screen.queryByText("Il nome della tappa è obbligatorio.")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Seleziona un giorno del viaggio.")
      ).not.toBeInTheDocument();
    });
  });

  // 3. Chiusura modale e toast al successo
  describe("successo", () => {
    it("chiama onOpenChange(false) quando l'azione restituisce success: true", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({ success: true });

      const onOpenChange = vi.fn();
      render(
        <AddStopModal
          open={true}
          onOpenChange={onOpenChange}
          tripId={tripId}
          trip={trip}
        />
      );

      const nameInput = screen.getByPlaceholderText(/visita alla torre/i);
      fireEvent.change(nameInput, { target: { value: "Arrivo a Lisbona" } });
      fireEvent.click(screen.getByRole("button", { name: /aggiungi tappa/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("mostra il toast di successo quando l'azione restituisce success: true", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({ success: true });

      renderModal();

      const nameInput = screen.getByPlaceholderText(/visita alla torre/i);
      fireEvent.change(nameInput, { target: { value: "Arrivo a Lisbona" } });
      fireEvent.click(screen.getByRole("button", { name: /aggiungi tappa/i }));

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith("Tappa aggiunta con successo!");
      });
    });

    it("NON chiama onOpenChange(false) quando l'azione restituisce errori", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({
        success: false,
        errors: { name: "Il nome della tappa è obbligatorio." },
      });

      const onOpenChange = vi.fn();
      render(
        <AddStopModal
          open={true}
          onOpenChange={onOpenChange}
          tripId={tripId}
          trip={trip}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /aggiungi tappa/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Il nome della tappa è obbligatorio.")
        ).toBeInTheDocument();
      });

      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });
  });

  // 4. Struttura e rendering di base
  describe("rendering", () => {
    it("mostra il titolo 'Nuova tappa'", () => {
      renderModal();
      expect(
        screen.getByRole("heading", { name: /nuova tappa/i })
      ).toBeInTheDocument();
    });

    it("mostra la descrizione del modal nell'header", () => {
      renderModal();
      expect(
        screen.getByText(/pasto al programma/i)
      ).toBeInTheDocument();
    });

    it("mostra il pulsante Annulla che chiama onOpenChange(false)", () => {
      const onOpenChange = vi.fn();
      render(
        <AddStopModal
          open={true}
          onOpenChange={onOpenChange}
          tripId={tripId}
          trip={trip}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /annulla/i }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("il select giorno contiene le opzioni per tutti i giorni del viaggio", () => {
      renderModal();
      const dateSelect = document.querySelector('select[name="date"]') as HTMLSelectElement;
      expect(dateSelect).not.toBeNull();
      // 4 giorni: 22, 23, 24, 25 maggio
      expect(dateSelect.options).toHaveLength(4);
    });

    it("il select giorno ha come valore di default la data di inizio viaggio", () => {
      renderModal();
      const dateSelect = document.querySelector('select[name="date"]') as HTMLSelectElement;
      expect(dateSelect.value).toBe("2026-05-22");
    });

    it("accetta una defaultDate personalizzata per il select giorno", () => {
      render(
        <AddStopModal
          open={true}
          onOpenChange={vi.fn()}
          tripId={tripId}
          trip={trip}
          defaultDate="2026-05-24"
        />
      );
      const dateSelect = document.querySelector('select[name="date"]') as HTMLSelectElement;
      expect(dateSelect.value).toBe("2026-05-24");
    });

    it("mostra il select categoria con le 5 opzioni previste", () => {
      renderModal();
      const categorySelect = document.querySelector('select[name="category"]') as HTMLSelectElement;
      expect(categorySelect).not.toBeNull();
      // opzione vuota + 5 categorie
      expect(categorySelect.options).toHaveLength(6);
    });
  });
});
