import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// --- Mocks ---

vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
  useParams: vi.fn().mockReturnValue({}),
}));

// --- Typed import after mocks ---

import InviteError from "@/app/invite/[token]/invite-error";

// --- Tests ---

describe("InviteError — reason expired", () => {
  it("mostra titolo 'Link di invito scaduto'", () => {
    render(<InviteError reason="expired" />);
    expect(
      screen.getByRole("heading", { name: "Link di invito scaduto" })
    ).toBeInTheDocument();
  });

  it("mostra testo con 'organizzatore'", () => {
    render(<InviteError reason="expired" />);
    expect(screen.getByText(/organizzatore/i)).toBeInTheDocument();
  });

  it("mostra CTA verso /auth/signin", () => {
    render(<InviteError reason="expired" />);
    const ctaLink = screen.getByRole("link", { name: /accedi a combriccola/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/auth/signin");
  });
});

describe("InviteError — reason invalid", () => {
  it("mostra titolo 'Link non valido'", () => {
    render(<InviteError reason="invalid" />);
    expect(
      screen.getByRole("heading", { name: "Link non valido" })
    ).toBeInTheDocument();
  });

  it("mostra testo 'non è riconosciuto'", () => {
    render(<InviteError reason="invalid" />);
    expect(screen.getByText(/non è riconosciuto/i)).toBeInTheDocument();
  });

  it("mostra CTA verso /auth/signin", () => {
    render(<InviteError reason="invalid" />);
    const ctaLink = screen.getByRole("link", { name: /accedi a combriccola/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/auth/signin");
  });
});
