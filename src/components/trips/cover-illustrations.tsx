// Server/shared component — no "use client" needed

export const COVER_KEYS = [
  "tokyo",
  "lisbon",
  "alps",
  "sicily",
  "amsterdam",
] as const;

export type CoverKey = (typeof COVER_KEYS)[number];

interface CoverIllustrationProps {
  name: CoverKey;
  idPrefix: string;
}

export function CoverIllustration({ name, idPrefix }: CoverIllustrationProps) {
  switch (name) {
    case "tokyo":
      return (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id={`${idPrefix}-tk-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F9C9D5" />
              <stop offset="1" stopColor="#E89AAB" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill={`url(#${idPrefix}-tk-sky)`} />
          <circle cx="80" cy="70" r="32" fill="#E84A4A" opacity="0.85" />
          <polygon points="240,200 320,90 400,200" fill="#5B6E8E" opacity="0.7" />
          <polygon
            points="285,140 320,90 355,140 340,150 320,135 300,150"
            fill="#fff"
            opacity="0.85"
          />
          <g fill="#3A3346">
            <rect x="0" y="160" width="34" height="80" />
            <rect x="34" y="140" width="28" height="100" />
            <rect x="62" y="155" width="22" height="85" />
            <rect x="84" y="125" width="40" height="115" />
            <rect x="124" y="150" width="26" height="90" />
            <rect x="150" y="130" width="34" height="110" />
          </g>
          <g transform="translate(195 70)">
            <polygon points="20,0 25,0 35,80 10,80" fill="#E84A4A" />
            <rect x="14" y="80" width="17" height="50" fill="#E84A4A" />
            <polygon points="14,130 31,130 38,170 7,170" fill="#E84A4A" />
          </g>
        </svg>
      );

    case "lisbon":
      return (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id={`${idPrefix}-lx-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFD2B8" />
              <stop offset="1" stopColor="#F8B6A0" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-lx-water`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#A9D5DA" />
              <stop offset="1" stopColor="#7FB8C0" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill={`url(#${idPrefix}-lx-sky)`} />
          <circle cx="320" cy="70" r="28" fill="#FFE9C8" opacity="0.9" />
          <path
            d="M0 160 Q60 130 120 145 T240 140 T400 150 L400 240 L0 240 Z"
            fill="#E89A82"
            opacity="0.55"
          />
          <g>
            <rect x="20" y="120" width="40" height="80" fill="#F4D3B5" />
            <rect x="60" y="105" width="46" height="95" fill="#EDB69A" />
            <rect x="106" y="115" width="34" height="85" fill="#F8E1C7" />
            <rect x="140" y="95" width="50" height="105" fill="#E8A07F" />
            <rect x="190" y="110" width="38" height="90" fill="#F4D3B5" />
            <rect x="228" y="100" width="44" height="100" fill="#D9876B" />
            <rect x="272" y="120" width="36" height="80" fill="#F8E1C7" />
            <rect x="308" y="108" width="42" height="92" fill="#E8A07F" />
          </g>
          <rect x="0" y="200" width="400" height="40" fill={`url(#${idPrefix}-lx-water)`} />
        </svg>
      );

    case "alps":
      return (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id={`${idPrefix}-al-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#CFE6F0" />
              <stop offset="1" stopColor="#E8F1F4" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill={`url(#${idPrefix}-al-sky)`} />
          <circle cx="320" cy="60" r="22" fill="#FFF4E0" opacity="0.85" />
          <polygon points="0,200 90,80 160,180 220,110 280,200" fill="#7E92A8" />
          <polygon points="160,180 220,110 280,200" fill="#5E7388" />
          <polygon
            points="220,200 320,90 400,180 400,240 220,240"
            fill="#90A2B8"
          />
          <polygon
            points="65,120 90,80 115,120 105,128 90,118 78,128"
            fill="#fff"
          />
          <polygon
            points="200,150 220,110 240,150 232,156 220,148 208,156"
            fill="#fff"
          />
          <path
            d="M0 210 Q100 195 200 205 T400 200 L400 240 L0 240 Z"
            fill="#fff"
          />
        </svg>
      );

    case "sicily":
      return (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id={`${idPrefix}-sc-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFE3B8" />
              <stop offset="1" stopColor="#F4B07A" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-sc-sea`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#56A8B4" />
              <stop offset="1" stopColor="#356E7A" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill={`url(#${idPrefix}-sc-sky)`} />
          <circle cx="80" cy="70" r="30" fill="#FFD78A" />
          <polygon points="220,180 300,80 380,180" fill="#5C4A3D" />
          <polygon points="270,130 300,80 330,130" fill="#3D3128" />
          <rect x="0" y="180" width="400" height="60" fill={`url(#${idPrefix}-sc-sea)`} />
        </svg>
      );

    case "amsterdam":
      return (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id={`${idPrefix}-am-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D9E5EE" />
              <stop offset="1" stopColor="#B8CDDB" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill={`url(#${idPrefix}-am-sky)`} />
          <circle cx="60" cy="60" r="22" fill="#FFE9C8" opacity="0.7" />
          <g>
            <rect x="20" y="80" width="36" height="120" fill="#8E5B43" />
            <rect x="56" y="70" width="40" height="130" fill="#C77A4A" />
            <rect x="96" y="85" width="34" height="115" fill="#5B3D2A" />
            <rect x="130" y="65" width="42" height="135" fill="#9B6750" />
            <rect x="172" y="78" width="38" height="122" fill="#D9876B" />
            <rect x="210" y="72" width="40" height="128" fill="#7A4A35" />
            <rect x="250" y="82" width="36" height="118" fill="#A86A4A" />
            <rect x="286" y="68" width="44" height="132" fill="#604030" />
          </g>
          <rect x="0" y="200" width="400" height="40" fill="#3A5570" />
        </svg>
      );
  }
}
