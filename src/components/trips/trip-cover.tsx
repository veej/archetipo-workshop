// Server component — no state, no interactivity needed
import {
  CoverIllustration,
  COVER_KEYS,
  type CoverKey,
} from "./cover-illustrations";

interface TripCoverProps {
  coverKey: string | null;
  height?: number;
}

function PlaceholderSvg() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F6F4F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#A09C97"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    </div>
  );
}

export function TripCover({ coverKey, height = 168 }: TripCoverProps) {
  const isValidKey = (key: string | null): key is CoverKey =>
    key !== null && (COVER_KEYS as readonly string[]).includes(key);

  return (
    <div
      style={{
        width: "100%",
        height,
        overflow: "hidden",
        display: "block",
        position: "relative",
      }}
    >
      {isValidKey(coverKey) ? (
        <CoverIllustration name={coverKey} idPrefix="tc" />
      ) : (
        <PlaceholderSvg />
      )}
    </div>
  );
}
