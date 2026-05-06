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

    it("invoca l'azione con solo nome e data compilati (senza orario, indirizzo, note)", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({ success: true });

      renderModal();

      const nameInput = screen.getByPlaceholderText(/es\. volo fco/i);
      fireEvent.change(nameInput, { target: { value: "Check-in hotel" } });

      // La data ha già un valore di default (minDate), quindi è già compilata
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

      const nameInput = screen.getByPlaceholderText(/es\. volo fco/i);
      fireEvent.change(nameInput, { target: { value: "Arrivo a Lisbona" } });
      fireEvent.click(screen.getByRole("button", { name: /aggiungi tappa/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("mostra il toast di successo quando l'azione restituisce success: true", async () => {
      vi.mocked(addItineraryStop).mockResolvedValue({ success: true });

      renderModal();

      const nameInput = screen.getByPlaceholderText(/es\. volo fco/i);
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
    it("mostra il titolo 'Aggiungi tappa'", () => {
      renderModal();
      expect(
        screen.getByRole("heading", { name: /aggiungi tappa/i })
      ).toBeInTheDocument();
    });

    it("mostra il nome del viaggio nella descrizione dell'header", () => {
      renderModal();
      expect(screen.getByText("Lisbona 2026")).toBeInTheDocument();
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

    it("il campo data ha min e max vincolati alle date del viaggio", () => {
      renderModal();
      const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
      expect(dateInput).not.toBeNull();
      expect(dateInput.min).toBe("2026-05-22");
      expect(dateInput.max).toBe("2026-05-25");
    });

    it("il campo data ha come valore di default la data di inizio viaggio", () => {
      renderModal();
      const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
      expect(dateInput.defaultValue).toBe("2026-05-22");
    });

    it("accetta una defaultDate personalizzata per il campo data", () => {
      render(
        <AddStopModal
          open={true}
          onOpenChange={vi.fn()}
          tripId={tripId}
          trip={trip}
          defaultDate="2026-05-24"
        />
      );
      const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
      expect(dateInput.defaultValue).toBe("2026-05-24");
    });
  });
});
