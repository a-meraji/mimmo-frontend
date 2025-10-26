"use client";

/**
 * Optimized Flag Component using inline SVG
 * This approach is performance-optimized and ensures consistent rendering across all platforms
 * No external images needed - all flags are embedded as optimized SVG paths
 */

const FlagSVGs = {
  IR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#239F40" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#DA0000" />
    </svg>
  ),
  US: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#B22234" />
      <path
        d="M0 0h36v2.77H0zm0 5.54h36v2.77H0zm0 5.54h36v2.77H0zm0 5.54h36v2.77H0z"
        fill="#FFF"
      />
      <rect width="14.4" height="12.92" fill="#3C3B6E" />
    </svg>
  ),
  GB: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#012169" />
      <path d="M0 0l36 24M36 0L0 24" stroke="#FFF" strokeWidth="4.8" />
      <path d="M0 0l36 24M36 0L0 24" stroke="#C8102E" strokeWidth="2.88" />
      <path d="M18 0v24M0 12h36" stroke="#FFF" strokeWidth="8" />
      <path d="M18 0v24M0 12h36" stroke="#C8102E" strokeWidth="4.8" />
    </svg>
  ),
  DE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#000" />
      <rect y="8" width="36" height="8" fill="#D00" />
      <rect y="16" width="36" height="8" fill="#FFCE00" />
    </svg>
  ),
  FR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#002395" />
      <rect x="12" width="12" height="24" fill="#FFF" />
      <rect x="24" width="12" height="24" fill="#ED2939" />
    </svg>
  ),
  IT: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#009246" />
      <rect x="12" width="12" height="24" fill="#FFF" />
      <rect x="24" width="12" height="24" fill="#CE2B37" />
    </svg>
  ),
  ES: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#AA151B" />
      <rect y="6" width="36" height="12" fill="#F1BF00" />
    </svg>
  ),
  TR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#E30A17" />
      <circle cx="14" cy="12" r="6" fill="#FFF" />
      <circle cx="15.5" cy="12" r="4.8" fill="#E30A17" />
      <path
        d="M20 9l1.5 4.5h4.7l-3.8 2.8 1.5 4.5-3.9-2.8-3.9 2.8 1.5-4.5-3.8-2.8h4.7z"
        fill="#FFF"
      />
    </svg>
  ),
  AE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#00732F" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#000" />
      <rect width="9" height="24" fill="#FF0000" />
    </svg>
  ),
  SA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#165B33" />
      <text
        x="18"
        y="14"
        fontSize="10"
        fill="#FFF"
        textAnchor="middle"
        fontWeight="bold"
      >
        🗡️
      </text>
    </svg>
  ),
  IQ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#CE1126" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#000" />
    </svg>
  ),
  AF: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#000" />
      <rect x="12" width="12" height="24" fill="#D32011" />
      <rect x="24" width="12" height="24" fill="#009E49" />
    </svg>
  ),
  PK: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#01411C" />
      <rect width="9" height="24" fill="#FFF" />
      <circle
        cx="22"
        cy="12"
        r="5"
        fill="none"
        stroke="#FFF"
        strokeWidth="1.2"
      />
      <path
        d="M26 9l1.2 3.6h3.8l-3.1 2.2 1.2 3.6-3.1-2.2-3.1 2.2 1.2-3.6-3.1-2.2h3.8z"
        fill="#FFF"
      />
    </svg>
  ),
  RU: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FFF" />
      <rect y="8" width="36" height="8" fill="#0039A6" />
      <rect y="16" width="36" height="8" fill="#D52B1E" />
    </svg>
  ),
  CN: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#DE2910" />
      <path
        d="M8 6l1 3h3l-2.5 1.8 1 3L8 12l-2.5 1.8 1-3L4 9h3z"
        fill="#FFDE00"
      />
    </svg>
  ),
  JP: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <circle cx="18" cy="12" r="6" fill="#BC002D" />
    </svg>
  ),
  KR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <circle cx="18" cy="12" r="6" fill="#C60C30" />
      <circle
        cx="18"
        cy="12"
        r="6"
        fill="#003478"
        clipPath="circle(3 at 15 12)"
      />
    </svg>
  ),
  IN: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FF9933" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#138808" />
      <circle
        cx="18"
        cy="12"
        r="3"
        fill="none"
        stroke="#000080"
        strokeWidth="0.6"
      />
    </svg>
  ),
  AU: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#012169" />
      <path d="M0 0l7.2 4.8M7.2 0L0 4.8" stroke="#FFF" strokeWidth="1" />
      <path d="M0 0l7.2 4.8M7.2 0L0 4.8" stroke="#C8102E" strokeWidth="0.6" />
      <path d="M3.6 0v4.8M0 2.4h7.2" stroke="#FFF" strokeWidth="1.6" />
      <path d="M3.6 0v4.8M0 2.4h7.2" stroke="#C8102E" strokeWidth="1" />
    </svg>
  ),
  BR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#009B3A" />
      <path d="M18 4L32 12L18 20L4 12Z" fill="#FEDF00" />
      <circle cx="18" cy="12" r="5" fill="#002776" />
    </svg>
  ),
  MX: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#006847" />
      <rect x="12" width="12" height="24" fill="#FFF" />
      <rect x="24" width="12" height="24" fill="#CE1126" />
    </svg>
  ),
  AR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#74ACDF" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <circle
        cx="18"
        cy="12"
        r="3"
        fill="#F6B40E"
        stroke="#843511"
        strokeWidth="0.4"
      />
    </svg>
  ),
  EG: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#CE1126" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#000" />
    </svg>
  ),
  ZA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <path d="M0 0l12 12L0 24z" fill="#000" />
      <path d="M0 0l12 12L0 24z" fill="#007A4D" />
      <rect y="0" width="36" height="7" fill="#DE3831" />
      <rect y="17" width="36" height="7" fill="#002395" />
    </svg>
  ),
  MA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#C1272D" />
      <path
        d="M18 8l1.5 4.5h4.7l-3.8 2.8 1.5 4.5-3.9-2.8-3.9 2.8 1.5-4.5-3.8-2.8h4.7z"
        fill="none"
        stroke="#006233"
        strokeWidth="1"
      />
    </svg>
  ),
  DZ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="18" height="24" fill="#006233" />
      <rect x="18" width="18" height="24" fill="#FFF" />
      <circle cx="20" cy="12" r="4" fill="#D21034" />
      <circle cx="21" cy="12" r="3" fill="#FFF" />
      <path
        d="M23 10l1 3h3l-2.5 1.8 1 3-2.5-1.8-2.5 1.8 1-3-2.5-1.8h3z"
        fill="#D21034"
      />
    </svg>
  ),
  TN: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#E70013" />
      <circle cx="18" cy="12" r="6" fill="#FFF" />
      <circle cx="19" cy="12" r="5" fill="#E70013" />
      <path
        d="M23 10l1 3h3l-2.5 1.8 1 3-2.5-1.8-2.5 1.8 1-3-2.5-1.8h3z"
        fill="#E70013"
      />
    </svg>
  ),
  NL: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#AE1C28" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#21468B" />
    </svg>
  ),
  BE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#000" />
      <rect x="12" width="12" height="24" fill="#FAE042" />
      <rect x="24" width="12" height="24" fill="#ED2939" />
    </svg>
  ),
  CH: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FF0000" />
      <path d="M18 7v10M13 12h10" stroke="#FFF" strokeWidth="3" />
    </svg>
  ),
  AT: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#ED2939" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#ED2939" />
    </svg>
  ),
  DK: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#C8102E" />
      <path d="M12 0v24M0 12h36" stroke="#FFF" strokeWidth="3" />
    </svg>
  ),
  SE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#006AA7" />
      <path d="M12 0v24M0 12h36" stroke="#FECC00" strokeWidth="3" />
    </svg>
  ),
  NO: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#EF2B2D" />
      <path d="M12 0v24M0 12h36" stroke="#FFF" strokeWidth="4" />
      <path d="M12 0v24M0 12h36" stroke="#002868" strokeWidth="2" />
    </svg>
  ),
  PT: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="14.4" height="24" fill="#006600" />
      <rect x="14.4" width="21.6" height="24" fill="#FF0000" />
    </svg>
  ),
  IE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#169B62" />
      <rect x="12" width="12" height="24" fill="#FFF" />
      <rect x="24" width="12" height="24" fill="#FF883E" />
    </svg>
  ),
  FI: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <path d="M12 0v24M0 9h36v6H0z" fill="#003580" />
    </svg>
  ),
  CZ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#FFF" />
      <rect y="12" width="36" height="12" fill="#D7141A" />
      <path d="M0 0l18 12L0 24z" fill="#11457E" />
    </svg>
  ),
  PL: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#FFF" />
      <rect y="12" width="36" height="12" fill="#DC143C" />
    </svg>
  ),
  GR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#0D5EAF" />
      <path
        d="M0 0h36v2.67H0zm0 5.33h36v2.67H0zm0 5.34h36v2.67H0zm0 5.33h36V21H0z"
        fill="#FFF"
      />
    </svg>
  ),
  UA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#0057B7" />
      <rect y="12" width="36" height="12" fill="#FFD700" />
    </svg>
  ),
  AZ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#00B5E2" />
      <rect y="8" width="36" height="8" fill="#E30A17" />
      <rect y="16" width="36" height="8" fill="#00AF66" />
    </svg>
  ),
  GE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <path d="M18 0v24M0 12h36" stroke="#FF0000" strokeWidth="3" />
    </svg>
  ),
  AM: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#D90012" />
      <rect y="8" width="36" height="8" fill="#0033A0" />
      <rect y="16" width="36" height="8" fill="#F2A800" />
    </svg>
  ),
  KG: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#EE1C25" />
      <circle cx="18" cy="12" r="6" fill="#FFEF00" />
    </svg>
  ),
  UZ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="7" fill="#1EB53A" />
      <rect y="7" width="36" height="2" fill="#FFF" />
      <rect y="9" width="36" height="2" fill="#CE1126" />
      <rect y="11" width="36" height="2" fill="#FFF" />
      <rect y="13" width="36" height="11" fill="#0099B5" />
    </svg>
  ),
  TJ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#CC0000" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#006600" />
    </svg>
  ),
  TM: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#00843D" />
      <rect width="9" height="24" fill="#D22730" />
    </svg>
  ),
  MY: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <path
        d="M0 0h36v1.71H0zm0 3.43h36v1.71H0zm0 3.43h36v1.71H0zm0 3.43h36v1.71H0zm0 3.43h36v1.71H0zm0 3.43h36v1.71H0zm0 3.43h36V24H0z"
        fill="#CC0001"
      />
      <rect width="14.4" height="12" fill="#010066" />
    </svg>
  ),
  ID: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#FF0000" />
      <rect y="12" width="36" height="12" fill="#FFF" />
    </svg>
  ),
  PH: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#0038A8" />
      <rect y="12" width="36" height="12" fill="#CE1126" />
      <path d="M0 0l18 12L0 24z" fill="#FFF" />
    </svg>
  ),
  SG: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#ED2939" />
      <rect y="12" width="36" height="12" fill="#FFF" />
      <circle cx="10" cy="7" r="4" fill="#FFF" />
      <circle cx="11.5" cy="7" r="3.2" fill="#ED2939" />
    </svg>
  ),
  TH: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="4" fill="#A51931" />
      <rect y="4" width="36" height="4" fill="#FFF" />
      <rect y="8" width="36" height="8" fill="#2D2A4A" />
      <rect y="16" width="36" height="4" fill="#FFF" />
      <rect y="20" width="36" height="4" fill="#A51931" />
    </svg>
  ),
  VN: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#DA251D" />
      <path
        d="M18 7l2 6h6l-5 3.6 2 6-5-3.6-5 3.6 2-6-5-3.6h6z"
        fill="#FFFF00"
      />
    </svg>
  ),
  CA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="9" height="24" fill="#FF0000" />
      <rect x="9" width="18" height="24" fill="#FFF" />
      <rect x="27" width="9" height="24" fill="#FF0000" />
      <path d="M18 8l1 3 3-1-1 3 3 1-3 1 1 3-3-1-1 3-1-3-3 1 1-3-3-1 3-1-1-3 3 1z" fill="#FF0000" />
    </svg>
  ),
  NZ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#00247D" />
      <path d="M0 0l7.2 4.8M7.2 0L0 4.8" stroke="#FFF" strokeWidth="1" />
      <path d="M0 0l7.2 4.8M7.2 0L0 4.8" stroke="#CC142B" strokeWidth="0.6" />
      <path d="M3.6 0v4.8M0 2.4h7.2" stroke="#FFF" strokeWidth="1.6" />
      <path d="M3.6 0v4.8M0 2.4h7.2" stroke="#CC142B" strokeWidth="1" />
    </svg>
  ),
  IL: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect y="3" width="36" height="2" fill="#0038B8" />
      <rect y="19" width="36" height="2" fill="#0038B8" />
      <path d="M18 8l3.5 2-1.5 3.5 3.5-1.5 2 3.5v-4l3.5-1.5h-4V6l-2 3.5-3.5-1.5 1.5 3.5z" fill="none" stroke="#0038B8" strokeWidth="0.8" />
    </svg>
  ),
  JO: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#000" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#007A3D" />
      <path d="M0 0l12 12L0 24z" fill="#CE1126" />
    </svg>
  ),
  LB: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect y="0" width="36" height="6" fill="#ED1C24" />
      <rect y="18" width="36" height="6" fill="#ED1C24" />
      <path d="M18 8l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#00A850" />
    </svg>
  ),
  SY: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#CE1126" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#000" />
    </svg>
  ),
  YE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#CE1126" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#000" />
    </svg>
  ),
  OM: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect width="9" height="24" fill="#FF0000" />
      <rect y="0" width="36" height="8" fill="#FFF" />
      <rect y="8" width="36" height="8" fill="#EE1C25" />
      <rect y="16" width="36" height="8" fill="#009A44" />
    </svg>
  ),
  QA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#8D1B3D" />
      <rect width="10" height="24" fill="#FFF" />
    </svg>
  ),
  BH: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#CE1126" />
      <rect width="10" height="24" fill="#FFF" />
    </svg>
  ),
  KW: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#007A3D" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#CE1126" />
      <path d="M0 0l11 12L0 24z" fill="#000" />
    </svg>
  ),
  BD: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#006A4E" />
      <circle cx="16" cy="12" r="6" fill="#F42A41" />
    </svg>
  ),
  LK: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFBE29" />
      <rect width="9" height="24" fill="#00534E" />
      <rect x="9" width="2" height="24" fill="#FF7800" />
    </svg>
  ),
  NP: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <path d="M4 2l8 10-8 10V2z" fill="#DC143C" stroke="#003893" strokeWidth="1.5" />
    </svg>
  ),
  MM: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FECB00" />
      <rect y="8" width="36" height="8" fill="#34B233" />
      <rect y="16" width="36" height="8" fill="#EA2839" />
      <path d="M18 6l2 6h6l-5 3.6 2 6-5-3.6-5 3.6 2-6-5-3.6h6z" fill="#FFF" />
    </svg>
  ),
  KH: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="6" fill="#032EA1" />
      <rect y="6" width="36" height="12" fill="#E00025" />
      <rect y="18" width="36" height="6" fill="#032EA1" />
    </svg>
  ),
  LA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#CE1126" />
      <rect y="6" width="36" height="12" fill="#002868" />
      <circle cx="18" cy="12" r="5" fill="#FFF" />
    </svg>
  ),
  HK: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#DE2910" />
      <path d="M18 8l1 3 3-1-1 3 3 1-3 1 1 3-3-1-1 3-1-3-3 1 1-3-3-1 3-1-1-3 3 1z" fill="#FFF" />
    </svg>
  ),
  TW: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FE0000" />
      <rect width="18" height="12" fill="#000095" />
      <circle cx="9" cy="6" r="4" fill="#FFF" />
    </svg>
  ),
  RO: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#002B7F" />
      <rect x="12" width="12" height="24" fill="#FCD116" />
      <rect x="24" width="12" height="24" fill="#CE1126" />
    </svg>
  ),
  BG: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FFF" />
      <rect y="8" width="36" height="8" fill="#00966E" />
      <rect y="16" width="36" height="8" fill="#D62612" />
    </svg>
  ),
  HU: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#CE2939" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#477050" />
    </svg>
  ),
  SK: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FFF" />
      <rect y="8" width="36" height="8" fill="#0B4EA2" />
      <rect y="16" width="36" height="8" fill="#EE1C25" />
    </svg>
  ),
  HR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FF0000" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#171796" />
    </svg>
  ),
  RS: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#C6363C" />
      <rect y="8" width="36" height="8" fill="#0C4076" />
      <rect y="16" width="36" height="8" fill="#FFF" />
    </svg>
  ),
  NG: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#008751" />
      <rect x="12" width="12" height="24" fill="#FFF" />
      <rect x="24" width="12" height="24" fill="#008751" />
    </svg>
  ),
  KE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="7" fill="#000" />
      <rect y="7" width="36" height="2" fill="#FFF" />
      <rect y="9" width="36" height="6" fill="#BB0000" />
      <rect y="15" width="36" height="2" fill="#FFF" />
      <rect y="17" width="36" height="7" fill="#006600" />
    </svg>
  ),
  ET: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#078930" />
      <rect y="8" width="36" height="8" fill="#FCDD09" />
      <rect y="16" width="36" height="8" fill="#DA121A" />
    </svg>
  ),
  GH: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#CE1126" />
      <rect y="8" width="36" height="8" fill="#FCD116" />
      <rect y="16" width="36" height="8" fill="#006B3F" />
      <path d="M18 8l1.5 4.5h4.7l-3.8 2.8 1.5 4.5-3.9-2.8-3.9 2.8 1.5-4.5-3.8-2.8h4.7z" fill="#000" />
    </svg>
  ),
  CL: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect y="12" width="36" height="12" fill="#D52B1E" />
      <rect width="12" height="12" fill="#0039A6" />
      <path d="M6 4l1 3h3l-2.5 1.8 1 3-2.5-1.8-2.5 1.8 1-3L2 7h3z" fill="#FFF" />
    </svg>
  ),
  PE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#D91023" />
      <rect x="12" width="12" height="24" fill="#FFF" />
      <rect x="24" width="12" height="24" fill="#D91023" />
    </svg>
  ),
  CO: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#FCD116" />
      <rect y="12" width="36" height="6" fill="#003893" />
      <rect y="18" width="36" height="6" fill="#CE1126" />
    </svg>
  ),
  VE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FFCC00" />
      <rect y="8" width="36" height="8" fill="#00247D" />
      <rect y="16" width="36" height="8" fill="#CF142B" />
    </svg>
  ),
  EC: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#FFDD00" />
      <rect y="12" width="36" height="6" fill="#034EA2" />
      <rect y="18" width="36" height="6" fill="#ED1C24" />
    </svg>
  ),
  UY: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect y="0" width="36" height="2.7" fill="#0038A8" />
      <rect y="5.4" width="36" height="2.7" fill="#0038A8" />
      <rect y="10.8" width="36" height="2.7" fill="#0038A8" />
      <rect y="16.2" width="36" height="2.7" fill="#0038A8" />
      <rect y="21.6" width="36" height="2.4" fill="#0038A8" />
      <rect width="14" height="13" fill="#FFF" />
    </svg>
  ),
  PY: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#D52B1E" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#0038A8" />
    </svg>
  ),
  BO: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#D52B1E" />
      <rect y="8" width="36" height="8" fill="#FFD700" />
      <rect y="16" width="36" height="8" fill="#007A33" />
    </svg>
  ),
  CR: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect y="0" width="36" height="4" fill="#002B7F" />
      <rect y="8" width="36" height="8" fill="#CE1126" />
      <rect y="20" width="36" height="4" fill="#002B7F" />
    </svg>
  ),
  PA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect width="18" height="12" fill="#FFF" />
      <rect x="18" width="18" height="12" fill="#D21034" />
      <rect y="12" width="18" height="12" fill="#0000AB" />
      <rect x="18" y="12" width="18" height="12" fill="#FFF" />
      <path d="M9 3l1 3h3l-2.5 1.8 1 3-2.5-1.8-2.5 1.8 1-3L5 6h3z" fill="#0000AB" />
      <path d="M27 15l1 3h3l-2.5 1.8 1 3-2.5-1.8-2.5 1.8 1-3-2.5-1.8h3z" fill="#D21034" />
    </svg>
  ),
  GT: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#4997D0" />
      <rect x="12" width="12" height="24" fill="#FFF" />
      <rect x="24" width="12" height="24" fill="#4997D0" />
    </svg>
  ),
  HN: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#0073CF" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#0073CF" />
      <path d="M12 10l1 2h2l-1.5 1.5 0.5 2-1.5-1-1.5 1 0.5-2-1.5-1.5h2z" fill="#0073CF" />
      <path d="M18 10l1 2h2l-1.5 1.5 0.5 2-1.5-1-1.5 1 0.5-2-1.5-1.5h2z" fill="#0073CF" />
      <path d="M24 10l1 2h2l-1.5 1.5 0.5 2-1.5-1-1.5 1 0.5-2-1.5-1.5h2z" fill="#0073CF" />
    </svg>
  ),
  SV: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#0F47AF" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#0F47AF" />
    </svg>
  ),
  NI: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#0067C6" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#0067C6" />
    </svg>
  ),
  CU: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#002A8F" />
      <rect y="0" width="36" height="4.8" fill="#002A8F" />
      <rect y="4.8" width="36" height="4.8" fill="#FFF" />
      <rect y="9.6" width="36" height="4.8" fill="#002A8F" />
      <rect y="14.4" width="36" height="4.8" fill="#FFF" />
      <rect y="19.2" width="36" height="4.8" fill="#002A8F" />
      <path d="M0 0l18 12L0 24z" fill="#CF142B" />
      <path d="M8 10l1 3h3l-2.5 1.8 1 3-2.5-1.8-2.5 1.8 1-3L4 13h3z" fill="#FFF" />
    </svg>
  ),
  DO: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <rect width="36" height="11" fill="#002D62" />
      <rect y="13" width="36" height="11" fill="#CE1126" />
      <rect x="15" width="6" height="24" fill="#FFF" />
    </svg>
  ),
  HT: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="12" fill="#00209F" />
      <rect y="12" width="36" height="12" fill="#D21034" />
    </svg>
  ),
  BZ: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#003F87" />
      <rect y="3" width="36" height="18" fill="#FFF" />
      <rect y="4.5" width="36" height="15" fill="#CE1126" />
      <circle cx="18" cy="12" r="6" fill="#FFF" />
    </svg>
  ),
  IS: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#02529C" />
      <path d="M12 0v24M0 12h36" stroke="#FFF" strokeWidth="4" />
      <path d="M12 0v24M0 12h36" stroke="#DC1E35" strokeWidth="2" />
    </svg>
  ),
  LU: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#ED2939" />
      <rect y="8" width="36" height="8" fill="#FFF" />
      <rect y="16" width="36" height="8" fill="#00A1DE" />
    </svg>
  ),
  LT: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FDB913" />
      <rect y="8" width="36" height="8" fill="#006A44" />
      <rect y="16" width="36" height="8" fill="#C1272D" />
    </svg>
  ),
  LV: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#9E3039" />
      <rect y="9" width="36" height="6" fill="#FFF" />
    </svg>
  ),
  EE: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#0072CE" />
      <rect y="8" width="36" height="8" fill="#000" />
      <rect y="16" width="36" height="8" fill="#FFF" />
    </svg>
  ),
  SI: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="8" fill="#FFF" />
      <rect y="8" width="36" height="8" fill="#0000FF" />
      <rect y="16" width="36" height="8" fill="#FF0000" />
    </svg>
  ),
  BA: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#002395" />
      <path d="M0 0l36 24H0z" fill="#FCD116" />
      <path d="M6 4l1 2h2l-1.5 1.5 0.5 2-1.5-1-1.5 1 0.5-2L4 6h2z" fill="#FFF" />
      <path d="M10 8l1 2h2l-1.5 1.5 0.5 2-1.5-1-1.5 1 0.5-2L9 10h2z" fill="#FFF" />
      <path d="M14 12l1 2h2l-1.5 1.5 0.5 2-1.5-1-1.5 1 0.5-2-1.5-1.5h2z" fill="#FFF" />
    </svg>
  ),
  MK: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#D20000" />
      <circle cx="18" cy="12" r="6" fill="#FFE600" />
      <circle cx="18" cy="12" r="4" fill="#D20000" />
    </svg>
  ),
  AL: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#E41E20" />
      <path d="M18 8l2 4-3 2 3 2-2 4-2-4 3-2-3-2z" fill="#000" />
    </svg>
  ),
  ME: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#C40308" />
      <path d="M16 8h4v8h-4z" fill="#D4AF37" />
    </svg>
  ),
  MD: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="12" height="24" fill="#003DA5" />
      <rect x="12" width="12" height="24" fill="#FFD200" />
      <rect x="24" width="12" height="24" fill="#CC092F" />
    </svg>
  ),
  BY: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="16" fill="#CE1720" />
      <rect y="16" width="36" height="8" fill="#00AB66" />
      <rect width="6" height="24" fill="#FFF" />
    </svg>
  ),
  MT: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="18" height="24" fill="#FFF" />
      <rect x="18" width="18" height="24" fill="#CF142B" />
    </svg>
  ),
  CY: () => (
    <svg viewBox="0 0 36 24" className="w-full h-full" aria-hidden="true">
      <rect width="36" height="24" fill="#FFF" />
      <path d="M18 8l3 6-3 6-3-6z" fill="#D57800" />
      <path d="M14 16l2-2 2 2 2-2 2 2" stroke="#5E9A3E" strokeWidth="1" fill="none" />
    </svg>
  ),
};

// Country code to ISO mapping
const CountryISOMap = {
  "+98": "IR",
  "+1": "US",
  "+44": "GB",
  "+49": "DE",
  "+33": "FR",
  "+39": "IT",
  "+34": "ES",
  "+90": "TR",
  "+971": "AE",
  "+966": "SA",
  "+964": "IQ",
  "+93": "AF",
  "+92": "PK",
  "+7": "RU",
  "+86": "CN",
  "+81": "JP",
  "+82": "KR",
  "+91": "IN",
  "+61": "AU",
  "+55": "BR",
  "+52": "MX",
  "+54": "AR",
  "+20": "EG",
  "+27": "ZA",
  "+212": "MA",
  "+213": "DZ",
  "+216": "TN",
  "+31": "NL",
  "+32": "BE",
  "+41": "CH",
  "+43": "AT",
  "+45": "DK",
  "+46": "SE",
  "+47": "NO",
  "+351": "PT",
  "+353": "IE",
  "+358": "FI",
  "+420": "CZ",
  "+48": "PL",
  "+30": "GR",
  "+380": "UA",
  "+994": "AZ",
  "+995": "GE",
  "+374": "AM",
  "+996": "KG",
  "+998": "UZ",
  "+992": "TJ",
  "+993": "TM",
  "+60": "MY",
  "+62": "ID",
  "+63": "PH",
  "+65": "SG",
  "+66": "TH",
  "+84": "VN",
  "+64": "NZ",
  "+972": "IL",
  "+962": "JO",
  "+961": "LB",
  "+963": "SY",
  "+967": "YE",
  "+968": "OM",
  "+974": "QA",
  "+973": "BH",
  "+965": "KW",
  "+880": "BD",
  "+94": "LK",
  "+977": "NP",
  "+95": "MM",
  "+855": "KH",
  "+856": "LA",
  "+852": "HK",
  "+886": "TW",
  "+40": "RO",
  "+359": "BG",
  "+36": "HU",
  "+421": "SK",
  "+385": "HR",
  "+381": "RS",
  "+234": "NG",
  "+254": "KE",
  "+251": "ET",
  "+233": "GH",
  "+56": "CL",
  "+51": "PE",
  "+57": "CO",
  "+58": "VE",
  "+593": "EC",
  "+598": "UY",
  "+595": "PY",
  "+591": "BO",
  "+506": "CR",
  "+507": "PA",
  "+502": "GT",
  "+504": "HN",
  "+503": "SV",
  "+505": "NI",
  "+53": "CU",
  "+1809": "DO",
  "+509": "HT",
  "+501": "BZ",
  "+354": "IS",
  "+352": "LU",
  "+370": "LT",
  "+371": "LV",
  "+372": "EE",
  "+386": "SI",
  "+387": "BA",
  "+389": "MK",
  "+355": "AL",
  "+382": "ME",
  "+373": "MD",
  "+375": "BY",
  "+356": "MT",
  "+357": "CY",
};

/**
 * Flag Component - Renders optimized SVG flags
 * @param {string} countryCode - ISO country code (e.g., 'IR', 'US', 'CA')
 * @param {string} className - Additional CSS classes
 * @param {string} size - Size preset: 'sm', 'md', 'lg'
 */
export default function Flag({ countryCode, className = "", size = "md" }) {
  const isoCode = countryCode;
  const FlagComponent = isoCode ? FlagSVGs[isoCode] : null;

  const sizeClasses = {
    sm: "w-6 h-4",
    md: "w-8 h-5",
    lg: "w-10 h-7",
  };

  if (!FlagComponent) {
    // Fallback: simple placeholder
    return (
      <div
        className={`${sizeClasses[size]} ${className} bg-neutral-lighter rounded border border-neutral-gray flex items-center justify-center`}
        role="img"
        aria-label={`Flag for ${countryCode}`}
      >
        <span className="text-xs text-text-gray" aria-hidden="true">
          ?
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded overflow-hidden shadow-sm flex items-center justify-center`}
      role="img"
      aria-label={`Flag for ${countryCode}`}
    >
      <FlagComponent />
    </div>
  );
}

// Export ISO map for use in other components
export { CountryISOMap };
