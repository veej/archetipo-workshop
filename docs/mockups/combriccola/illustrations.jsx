// 2D Airbnb-style flat illustrations for TravelHub destinations & empty states.
// Simple geometric shapes, warm palette, matching brand mood.

function LisbonIllustration({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lx-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD2B8"/>
          <stop offset="1" stopColor="#F8B6A0"/>
        </linearGradient>
        <linearGradient id="lx-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9D5DA"/>
          <stop offset="1" stopColor="#7FB8C0"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#lx-sky)"/>
      {/* Sun */}
      <circle cx="320" cy="70" r="28" fill="#FFE9C8" opacity="0.9"/>
      {/* Distant hills */}
      <path d="M0 160 Q60 130 120 145 T240 140 T400 150 L400 240 L0 240 Z" fill="#E89A82" opacity="0.55"/>
      {/* Buildings — pastel rowhouses */}
      <g>
        <rect x="20"  y="120" width="40" height="80" fill="#F4D3B5"/>
        <rect x="60"  y="105" width="46" height="95" fill="#EDB69A"/>
        <rect x="106" y="115" width="34" height="85" fill="#F8E1C7"/>
        <rect x="140" y="95"  width="50" height="105" fill="#E8A07F"/>
        <rect x="190" y="110" width="38" height="90" fill="#F4D3B5"/>
        <rect x="228" y="100" width="44" height="100" fill="#D9876B"/>
        <rect x="272" y="120" width="36" height="80" fill="#F8E1C7"/>
        <rect x="308" y="108" width="42" height="92" fill="#E8A07F"/>
        <rect x="350" y="118" width="40" height="82" fill="#EDB69A"/>
        {/* Windows */}
        <g fill="#29261b" opacity="0.55">
          <rect x="30"  y="135" width="6" height="8"/><rect x="44"  y="135" width="6" height="8"/>
          <rect x="30"  y="155" width="6" height="8"/><rect x="44"  y="155" width="6" height="8"/>
          <rect x="70"  y="120" width="6" height="8"/><rect x="86"  y="120" width="6" height="8"/>
          <rect x="70"  y="140" width="6" height="8"/><rect x="86"  y="140" width="6" height="8"/>
          <rect x="70"  y="160" width="6" height="8"/><rect x="86"  y="160" width="6" height="8"/>
          <rect x="116" y="130" width="6" height="8"/><rect x="128" y="130" width="6" height="8"/>
          <rect x="150" y="110" width="7" height="9"/><rect x="170" y="110" width="7" height="9"/>
          <rect x="150" y="135" width="7" height="9"/><rect x="170" y="135" width="7" height="9"/>
          <rect x="150" y="160" width="7" height="9"/><rect x="170" y="160" width="7" height="9"/>
          <rect x="200" y="125" width="6" height="8"/><rect x="214" y="125" width="6" height="8"/>
          <rect x="200" y="150" width="6" height="8"/><rect x="214" y="150" width="6" height="8"/>
          <rect x="238" y="115" width="6" height="9"/><rect x="254" y="115" width="6" height="9"/>
          <rect x="238" y="140" width="6" height="9"/><rect x="254" y="140" width="6" height="9"/>
          <rect x="238" y="165" width="6" height="9"/><rect x="254" y="165" width="6" height="9"/>
          <rect x="282" y="135" width="6" height="8"/><rect x="294" y="135" width="6" height="8"/>
          <rect x="316" y="120" width="6" height="9"/><rect x="332" y="120" width="6" height="9"/>
          <rect x="316" y="145" width="6" height="9"/><rect x="332" y="145" width="6" height="9"/>
          <rect x="358" y="130" width="6" height="8"/><rect x="372" y="130" width="6" height="8"/>
          <rect x="358" y="150" width="6" height="8"/><rect x="372" y="150" width="6" height="8"/>
        </g>
        {/* Rooftops */}
        <g fill="#A04A33">
          <polygon points="20,120 60,120 60,114 20,114"/>
          <polygon points="60,105 106,105 106,99 60,99"/>
          <polygon points="106,115 140,115 140,109 106,109"/>
          <polygon points="140,95 190,95 190,89 140,89"/>
          <polygon points="190,110 228,110 228,104 190,104"/>
          <polygon points="228,100 272,100 272,94 228,94"/>
          <polygon points="272,120 308,120 308,114 272,114"/>
          <polygon points="308,108 350,108 350,102 308,102"/>
          <polygon points="350,118 390,118 390,112 350,112"/>
        </g>
      </g>
      {/* Tagus river */}
      <rect x="0" y="200" width="400" height="40" fill="url(#lx-water)"/>
      <path d="M0 210 Q40 206 80 210 T160 210 T240 210 T320 210 T400 210" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <path d="M0 222 Q40 218 80 222 T160 222 T240 222 T320 222 T400 222" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.4"/>
      {/* Tram */}
      <g transform="translate(60 175)">
        <rect width="44" height="20" rx="3" fill="#E8C44A"/>
        <rect x="3" y="3" width="10" height="8" fill="#F8E1C7"/>
        <rect x="16" y="3" width="10" height="8" fill="#F8E1C7"/>
        <rect x="29" y="3" width="10" height="8" fill="#F8E1C7"/>
        <circle cx="10" cy="22" r="3" fill="#29261b"/>
        <circle cx="34" cy="22" r="3" fill="#29261b"/>
      </g>
    </svg>
  );
}

function TokyoIllustration({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9C9D5"/>
          <stop offset="1" stopColor="#E89AAB"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#tk-sky)"/>
      <circle cx="80" cy="70" r="32" fill="#E84A4A" opacity="0.85"/>
      {/* Mt Fuji */}
      <polygon points="240,200 320,90 400,200" fill="#5B6E8E" opacity="0.7"/>
      <polygon points="285,140 320,90 355,140 340,150 320,135 300,150" fill="#fff" opacity="0.85"/>
      {/* City silhouette */}
      <g fill="#3A3346">
        <rect x="0"   y="160" width="34" height="80"/>
        <rect x="34"  y="140" width="28" height="100"/>
        <rect x="62"  y="155" width="22" height="85"/>
        <rect x="84"  y="125" width="40" height="115"/>
        <rect x="124" y="150" width="26" height="90"/>
        <rect x="150" y="130" width="34" height="110"/>
        <rect x="184" y="160" width="22" height="80"/>
        <rect x="206" y="145" width="30" height="95"/>
      </g>
      {/* Tower */}
      <g transform="translate(195 70)">
        <polygon points="20,0 25,0 35,80 10,80" fill="#E84A4A"/>
        <rect x="14" y="80" width="17" height="50" fill="#E84A4A"/>
        <polygon points="14,130 31,130 38,170 7,170" fill="#E84A4A"/>
      </g>
      {/* Cherry blossoms */}
      <g fill="#FFD0DD">
        <circle cx="350" cy="50" r="4"/><circle cx="356" cy="48" r="4"/><circle cx="354" cy="55" r="4"/>
        <circle cx="40" cy="180" r="3"/><circle cx="46" cy="178" r="3"/><circle cx="44" cy="184" r="3"/>
        <circle cx="380" cy="160" r="3"/><circle cx="386" cy="158" r="3"/>
      </g>
    </svg>
  );
}

function AlpsIllustration({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="al-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE6F0"/>
          <stop offset="1" stopColor="#E8F1F4"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#al-sky)"/>
      <circle cx="320" cy="60" r="22" fill="#FFF4E0" opacity="0.85"/>
      <polygon points="0,200 90,80 160,180 220,110 280,200" fill="#7E92A8"/>
      <polygon points="160,180 220,110 280,200" fill="#5E7388"/>
      <polygon points="220,200 320,90 400,180 400,240 220,240" fill="#90A2B8"/>
      {/* Snow caps */}
      <polygon points="65,120 90,80 115,120 105,128 90,118 78,128" fill="#fff"/>
      <polygon points="200,150 220,110 240,150 232,156 220,148 208,156" fill="#fff"/>
      <polygon points="305,115 320,90 335,115 328,121 320,113 312,121" fill="#fff"/>
      {/* Foreground snow */}
      <path d="M0 210 Q100 195 200 205 T400 200 L400 240 L0 240 Z" fill="#fff"/>
      {/* Pine trees */}
      <g fill="#2F4A3D">
        <polygon points="50,210 60,180 70,210"/>
        <polygon points="80,215 90,190 100,215"/>
        <polygon points="320,215 330,190 340,215"/>
        <polygon points="350,212 360,185 370,212"/>
      </g>
      {/* Cabin */}
      <g transform="translate(140 195)">
        <rect width="40" height="22" fill="#A06A4A"/>
        <polygon points="-4,0 44,0 20,-14" fill="#5B3D2A"/>
        <rect x="16" y="10" width="8" height="12" fill="#3A2A1F"/>
        <rect x="4" y="6" width="6" height="6" fill="#FFE9C8"/>
        <rect x="30" y="6" width="6" height="6" fill="#FFE9C8"/>
      </g>
    </svg>
  );
}

function SicilyIllustration({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE3B8"/>
          <stop offset="1" stopColor="#F4B07A"/>
        </linearGradient>
        <linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56A8B4"/>
          <stop offset="1" stopColor="#356E7A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sc-sky)"/>
      <circle cx="80" cy="70" r="30" fill="#FFD78A"/>
      {/* Etna */}
      <polygon points="220,180 300,80 380,180" fill="#5C4A3D"/>
      <polygon points="270,130 300,80 330,130" fill="#3D3128"/>
      <path d="M295 80 Q298 70 300 65 Q302 70 305 80" stroke="#3D3128" strokeWidth="2" fill="none" opacity="0.6"/>
      {/* Sea */}
      <rect x="0" y="180" width="400" height="60" fill="url(#sc-sea)"/>
      {/* Boat */}
      <g transform="translate(50 195)">
        <polygon points="0,10 50,10 44,20 6,20" fill="#fff"/>
        <rect x="22" y="0" width="2" height="10" fill="#29261b"/>
        <polygon points="24,0 24,9 36,9" fill="#E84A6E"/>
      </g>
      {/* Palm */}
      <g transform="translate(330 130)">
        <rect x="8" y="10" width="4" height="50" fill="#5B3D2A"/>
        <path d="M10 12 Q-5 0 -10 -10" stroke="#3D7A4A" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M10 12 Q25 0 30 -10" stroke="#3D7A4A" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M10 12 Q-2 -2 -8 5"  stroke="#3D7A4A" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M10 12 Q22 -2 28 5"  stroke="#3D7A4A" strokeWidth="6" fill="none" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function AmsterdamIllustration({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="am-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9E5EE"/>
          <stop offset="1" stopColor="#B8CDDB"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#am-sky)"/>
      <circle cx="60" cy="60" r="22" fill="#FFE9C8" opacity="0.7"/>
      {/* Canal houses */}
      <g>
        <rect x="20" y="80" width="36" height="120" fill="#8E5B43"/>
        <rect x="56" y="70" width="40" height="130" fill="#C77A4A"/>
        <rect x="96" y="85" width="34" height="115" fill="#5B3D2A"/>
        <rect x="130" y="65" width="42" height="135" fill="#9B6750"/>
        <rect x="172" y="78" width="38" height="122" fill="#D9876B"/>
        <rect x="210" y="72" width="40" height="128" fill="#7A4A35"/>
        <rect x="250" y="82" width="36" height="118" fill="#A86A4A"/>
        <rect x="286" y="68" width="44" height="132" fill="#604030"/>
        <rect x="330" y="80" width="40" height="120" fill="#C77A4A"/>
        {/* Stepped gables */}
        <g fill="inherit">
          <polygon points="20,80 56,80 50,72 26,72 26,76 20,76"  fill="#8E5B43"/>
          <polygon points="56,70 96,70 90,62 62,62 62,66 56,66"  fill="#C77A4A"/>
          <polygon points="130,65 172,65 165,57 137,57 137,61 130,61" fill="#9B6750"/>
        </g>
        {/* Windows grid */}
        <g fill="#F8E1C7" opacity="0.85">
          {Array.from({length: 9}).map((_, col) => (
            Array.from({length: 4}).map((_, row) => {
              const x = 26 + col * 38 + (col > 0 ? 2 : 0);
              const y = 95 + row * 26;
              return <rect key={`${col}-${row}`} x={x} y={y} width="14" height="14"/>;
            })
          ))}
        </g>
      </g>
      {/* Canal */}
      <rect x="0" y="200" width="400" height="40" fill="#3A5570"/>
      <path d="M0 210 Q40 206 80 210 T160 210 T240 210 T320 210 T400 210" stroke="#A8C0D0" strokeWidth="1.2" fill="none" opacity="0.6"/>
      {/* Bicycle */}
      <g transform="translate(160 195)" stroke="#29261b" strokeWidth="2" fill="none">
        <circle cx="6"  cy="8" r="6" fill="#fff"/>
        <circle cx="26" cy="8" r="6" fill="#fff"/>
        <path d="M6 8 L18 -2 L26 8 M14 -2 L24 -2" />
      </g>
    </svg>
  );
}

function CategoryIcon({ kind, size = 18, color = "currentColor" }) {
  const s = { width: size, height: size, color };
  if (kind === "flight")    return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>;
  if (kind === "hotel")     return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18V6m0 12h18m0 0V10a2 2 0 0 0-2-2H9v10"/><circle cx="6.5" cy="11.5" r="1.5"/></svg>;
  if (kind === "food")      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v8a3 3 0 0 0 6 0V3M8 3v18M16 3a3 3 0 0 0-3 3v6h3v9"/></svg>;
  if (kind === "activity")  return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/></svg>;
  if (kind === "transport") return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16M8 21l-1-4M16 21l1-4"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/></svg>;
  return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>;
}

function destinationIllustration(key, props) {
  if (key === "lisbon")    return <LisbonIllustration {...props}/>;
  if (key === "tokyo")     return <TokyoIllustration {...props}/>;
  if (key === "alps")      return <AlpsIllustration {...props}/>;
  if (key === "sicily")    return <SicilyIllustration {...props}/>;
  if (key === "amsterdam") return <AmsterdamIllustration {...props}/>;
  return <LisbonIllustration {...props}/>;
}

Object.assign(window, { LisbonIllustration, TokyoIllustration, AlpsIllustration, SicilyIllustration, AmsterdamIllustration, CategoryIcon, destinationIllustration });
