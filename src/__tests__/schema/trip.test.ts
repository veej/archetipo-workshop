import { describe, it, expect } from "vitest";
import { TripRole, ParticipantStatus } from "@prisma/client";

describe("TripRole enum", () => {
  it("has the value ORGANIZER", () => {
    expect(TripRole.ORGANIZER).toBe("ORGANIZER");
  });

  it("has the value PARTICIPANT", () => {
    expect(TripRole.PARTICIPANT).toBe("PARTICIPANT");
  });

  it("has exactly two values", () => {
    const values = Object.values(TripRole);
    expect(values).toHaveLength(2);
    expect(values).toEqual(expect.arrayContaining(["ORGANIZER", "PARTICIPANT"]));
  });
});

describe("ParticipantStatus enum", () => {
  it("has the value ACTIVE", () => {
    expect(ParticipantStatus.ACTIVE).toBe("ACTIVE");
  });

  it("has the value DEACTIVATED", () => {
    expect(ParticipantStatus.DEACTIVATED).toBe("DEACTIVATED");
  });

  it("has exactly two values", () => {
    const values = Object.values(ParticipantStatus);
    expect(values).toHaveLength(2);
    expect(values).toEqual(expect.arrayContaining(["ACTIVE", "DEACTIVATED"]));
  });
});

describe("Enum type safety — assegnazione a variabili tipizzate", () => {
  it("TripRole: ORGANIZER è assegnabile a una variabile TripRole senza errori TypeScript", () => {
    const role: TripRole = TripRole.ORGANIZER;
    expect(role).toBe("ORGANIZER");
  });

  it("TripRole: PARTICIPANT è assegnabile a una variabile TripRole senza errori TypeScript", () => {
    const role: TripRole = TripRole.PARTICIPANT;
    expect(role).toBe("PARTICIPANT");
  });

  it("ParticipantStatus: ACTIVE è assegnabile a una variabile ParticipantStatus senza errori TypeScript", () => {
    const status: ParticipantStatus = ParticipantStatus.ACTIVE;
    expect(status).toBe("ACTIVE");
  });

  it("ParticipantStatus: DEACTIVATED è assegnabile a una variabile ParticipantStatus senza errori TypeScript", () => {
    const status: ParticipantStatus = ParticipantStatus.DEACTIVATED;
    expect(status).toBe("DEACTIVATED");
  });
});
