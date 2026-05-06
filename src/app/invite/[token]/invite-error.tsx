"use client";

import Link from "next/link";

interface InviteErrorProps {
  reason: "expired" | "invalid";
}

const config = {
  expired: {
    iconBg: "#FBF1DD",
    iconColor: "#B8761E",
    heading: "Link di invito scaduto",
    subtext:
      "Questo link è scaduto. Chiedi all'organizzatore del viaggio di generarne uno nuovo.",
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 15 15" />
      </svg>
    ),
  },
  invalid: {
    iconBg: "#FCE9E6",
    iconColor: "#C44A40",
    heading: "Link non valido",
    subtext:
      "Questo link non è riconosciuto. Verifica di averlo copiato correttamente o chiedi all'organizzatore un nuovo link.",
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

export default function InviteError({ reason }: InviteErrorProps) {
  const { iconBg, iconColor, heading, subtext, icon } = config[reason];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        @keyframes card-enter {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes icon-pop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .invite-card-animated {
          animation: card-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-brand-animated {
          animation: card-enter 0.5s 0.05s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-icon-animated {
          animation: icon-pop 0.4s 0.12s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .invite-heading-animated {
          animation: card-enter 0.5s 0.16s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-subtext-animated {
          animation: card-enter 0.5s 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-cta-animated {
          animation: card-enter 0.5s 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-divider-animated {
          animation: card-enter 0.5s 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-footer-animated {
          animation: card-enter 0.5s 0.33s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-tagline-animated {
          animation: card-enter 0.5s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .invite-cta-btn:hover {
          background: #2E2D2C !important;
          box-shadow: 0 4px 16px rgba(27,26,25,0.22) !important;
        }

        .invite-cta-btn:active {
          transform: translateY(0.5px);
        }

        .invite-footer-link-span:hover {
          text-decoration: underline;
        }

        .invite-bg-decor::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 900px 600px at 50% -10%, rgba(229,90,78,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 600px 400px at 80% 80%, rgba(184,118,30,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 500px 400px at 10% 70%, rgba(42,111,219,0.04) 0%, transparent 60%);
        }

        .invite-bg-decor::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(27,26,25,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%);
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#FAFAF7",
          color: "#1B1A19",
          fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          lineHeight: "1.5",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 20px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background */}
        <div
          className="invite-bg-decor"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
        >
          {/* Concentric rings */}
          <div
            style={{
              position: "absolute",
              borderRadius: "50%",
              border: "1px solid rgba(229,90,78,0.08)",
              width: "600px",
              height: "600px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              borderRadius: "50%",
              border: "1px solid rgba(229,90,78,0.04)",
              width: "900px",
              height: "900px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              borderRadius: "50%",
              border: "1px solid rgba(229,90,78,0.025)",
              width: "1200px",
              height: "1200px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        {/* Card */}
        <div
          className="invite-card-animated"
          style={{
            position: "relative",
            background: "#FFFFFF",
            border: "1px solid #E8E4DE",
            borderRadius: "24px",
            boxShadow: "0 24px 64px rgba(20,16,12,0.12), 0 8px 24px rgba(20,16,12,0.06)",
            width: "100%",
            maxWidth: "420px",
            overflow: "hidden",
          }}
        >
          {/* Accent stripe */}
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #E55A4E 0%, #E8846A 50%, #F0A882 100%)",
            }}
          />

          {/* Card body */}
          <div
            style={{
              padding: "32px 32px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Brand mark */}
            <div
              className="invite-brand-animated"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: "#E55A4E",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                  boxShadow: "0 6px 16px -4px rgba(229,90,78,0.50)",
                  flexShrink: 0,
                }}
              >
                C
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "16px",
                  letterSpacing: "-0.025em",
                  color: "#1B1A19",
                }}
              >
                Combriccola
              </span>
            </div>

            {/* State icon */}
            <div
              className="invite-icon-animated"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                marginBottom: "20px",
                backgroundColor: iconBg,
                color: iconColor,
              }}
            >
              {icon}
            </div>

            {/* Heading */}
            <h2
              className="invite-heading-animated"
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: 0,
                fontSize: "21px",
                marginBottom: "10px",
              }}
            >
              {heading}
            </h2>

            {/* Subtext */}
            <p
              className="invite-subtext-animated"
              style={{
                fontSize: "14px",
                color: "#6E6A66",
                lineHeight: "1.6",
                maxWidth: "300px",
                marginBottom: "28px",
                margin: "0 0 28px",
              }}
            >
              {subtext}
            </p>

            {/* CTA button */}
            <Link
              href="/auth/signin"
              className="invite-cta-animated invite-cta-btn"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "9px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                borderRadius: "12px",
                background: "#1B1A19",
                color: "white",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(27,26,25,0.18)",
                transition: "background 0.14s, transform 0.07s, box-shadow 0.14s",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Accedi a Combriccola
            </Link>

            {/* Divider */}
            <div
              className="invite-divider-animated"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                margin: "16px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#E8E4DE" }} />
              <span style={{ fontSize: "11.5px", color: "#A09C97", fontWeight: 500 }}>
                oppure
              </span>
              <div style={{ flex: 1, height: "1px", background: "#E8E4DE" }} />
            </div>

            {/* Footer link */}
            <p
              className="invite-footer-animated"
              style={{ fontSize: "13px", color: "#6E6A66", fontWeight: 500, margin: 0 }}
            >
              Non hai un account?{" "}
              <Link
                href="/auth/signin"
                className="invite-footer-link-span"
                style={{ color: "#E55A4E", fontWeight: 600 }}
              >
                Registrati gratuitamente
              </Link>
            </p>
          </div>
        </div>

        {/* Below-card tagline */}
        <p
          className="invite-tagline-animated"
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#A09C97",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            margin: "24px 0 0",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Combriccola non condivide mai i tuoi dati
        </p>
      </div>
    </>
  );
}
