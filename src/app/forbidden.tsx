export default function ForbiddenPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "48px 24px",
        textAlign: "center",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ color: "#A09C97", marginBottom: 16 }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h1
        style={{
          fontSize: 20,
          fontFamily:
            "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#1B1A19",
          margin: "0 0 8px",
        }}
      >
        Accesso non autorizzato
      </h1>
      <p style={{ fontSize: 14, color: "#6E6A66", maxWidth: 340, margin: 0 }}>
        Non sei un partecipante di questo viaggio o il viaggio non esiste.
      </p>
    </div>
  );
}
