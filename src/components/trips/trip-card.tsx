"use client";

import { useState } from "react";
import Link from "next/link";
import { TripCover } from "./trip-cover";
import { formatDateRange, getTripStatus, type TripStatus } from "@/lib/utils";

export interface TripCardProps {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  coverKey: string | null;
  role: "ORGANIZER" | "PARTICIPANT";
  participantCount: number;
}

const STATUS_BADGE: Record<TripStatus, { label: string; bg: string; color: string; border: string }> = {
  ongoing: {
    label: "In corso",
    bg: "rgba(229, 242, 236, 0.92)",
    color: "#2F8A5F",
    border: "rgba(47, 138, 95, 0.2)",
  },
  upcoming: {
    label: "Prossimo",
    bg: "rgba(228, 237, 251, 0.92)",
    color: "#2A6FDB",
    border: "rgba(42, 111, 219, 0.2)",
  },
  past: {
    label: "Concluso",
    bg: "rgba(246, 244, 240, 0.95)",
    color: "#6E6A66",
    border: "rgba(216, 210, 200, 0.3)",
  },
};

export function TripCard({
  id,
  name,
  destination,
  startDate,
  endDate,
  coverKey,
  role,
  participantCount,
}: TripCardProps) {
  const [hovered, setHovered] = useState(false);
  const status = getTripStatus(startDate, endDate);
  const isPast = status === "past";
  const badge = STATUS_BADGE[status];
  const dateLabel = formatDateRange(startDate, endDate);

  return (
    <Link href={`/trips/${id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DE",
          borderRadius: 10,
          boxShadow: hovered
            ? "0 4px 14px rgba(20, 16, 12, 0.08), 0 2px 4px rgba(20, 16, 12, 0.04)"
            : "0 1px 2px rgba(20, 16, 12, 0.04)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "box-shadow .18s ease, transform .18s ease",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Cover with status badge overlay */}
        <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              filter: isPast ? "grayscale(1)" : "none",
              opacity: isPast ? 0.85 : 1,
              transform: hovered ? "scale(1.025)" : "scale(1)",
              transition: "transform .22s ease",
            }}
          >
            <TripCover coverKey={coverKey} height={180} />
          </div>

          {/* Status badge — top-right, frosted glass */}
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backdropFilter: "blur(6px) saturate(140%)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                fontSize: 11.5,
                fontWeight: 600,
                borderRadius: 999,
                whiteSpace: "nowrap",
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
                boxShadow: "0 1px 6px rgba(20,16,12,0.12)",
              }}
            >
              {status === "ongoing" && (
                <svg width="7" height="7" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="4" fill="#2F8A5F" />
                </svg>
              )}
              {badge.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px 16px" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              fontFamily:
                "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "#1B1A19",
              letterSpacing: "-0.015em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: "#6E6A66",
              fontSize: 12.5,
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {destination}
          </div>

          {/* Footer: date range + role badge + participant count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 14,
              gap: 8,
            }}
          >
            <div style={{ fontSize: 12.5, color: "#6E6A66", flexShrink: 0 }}>
              {dateLabel}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Role badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 7px",
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  background: role === "ORGANIZER" ? "#FCE9E6" : "#F6F4F0",
                  color: role === "ORGANIZER" ? "#C94A40" : "#6E6A66",
                  border:
                    role === "ORGANIZER" ? "none" : "1px solid #E8E4DE",
                }}
              >
                {role === "ORGANIZER" ? "Organizzatore" : "Partecipante"}
              </span>
              {/* Participant count */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#6E6A66",
                  fontSize: 12,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="8" r="4" />
                  <path d="M2 21a7 7 0 0 1 14 0" />
                  <circle cx="17" cy="8" r="3" />
                  <path d="M22 19a5 5 0 0 0-5-5" />
                </svg>
                {participantCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
