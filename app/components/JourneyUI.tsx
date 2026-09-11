import Link from "next/link";
import styles from "../JourneyFlow.module.css";

export type SignatureKind = "travel" | "activity" | "free" | "reservation" | "rest" | "buffer";

export type SignatureSegment = {
  kind: SignatureKind;
  flex?: number;
};

export function AppHeader({
  backHref = "/",
  note,
  menu = false,
  showBack = true,
  action,
}: {
  backHref?: string;
  note?: string;
  menu?: boolean;
  showBack?: boolean;
  action?: "menu" | "search";
}) {
  const resolvedAction = action ?? (menu ? "menu" : undefined);

  return (
    <header className={styles.appHeader}>
      {showBack ? (
        <Link className={styles.backButton} href={backHref} aria-label="Back">←</Link>
      ) : (
        <span className={styles.headerSpacer} aria-hidden="true" />
      )}
      <Link className={styles.wordmark} href="/">Ullalu</Link>
      {resolvedAction === "menu" ? (
        <button className={styles.menuButton} type="button" aria-label="More options">•••</button>
      ) : resolvedAction === "search" ? (
        <button className={styles.menuButton} type="button" aria-label="Search">⌕</button>
      ) : (
        <span className={styles.headerNote}>{note || "A new journey begins here."}</span>
      )}
    </header>
  );
}

export function BottomNav({ active }: { active: "home" | "trips" | "explore" | "more" }) {
  const items = [
    ["home", "⌂", "Home", "/"],
    ["trips", "▣", "My Trips", "/trips"],
    ["explore", "◈", "Explore", "#"],
    ["more", "•••", "More", "#"],
  ] as const;

  return (
    <nav className={styles.bottomNav} aria-label="Primary navigation">
      {items.map(([key, icon, label, href]) => (
        <Link key={key} href={href} className={`${styles.navItem} ${active === key ? styles.navItemActive : ""}`}>
          <span className={styles.navIcon} aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function Signature({ segments, className = "" }: { segments: SignatureSegment[]; className?: string }) {
  return (
    <div className={`${styles.signature} ${className}`} aria-hidden="true">
      {segments.map((segment, index) => (
        <span key={`${segment.kind}-${index}`} className={styles[`sig_${segment.kind}`]} style={{ flex: segment.flex ?? 1 }} />
      ))}
    </div>
  );
}

export function StorageIcon({ kind }: { kind: "drive" | "cloud" | "device" }) {
  const iconStyle = { width: 28, height: 28, display: "block" };

  if (kind === "drive") {
    return (
      <svg style={iconStyle} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M11.2 4.7h9.3l7 12.1H18.2Z" fill="#34a853" />
        <path d="m11.2 4.7-7 12.1 4.7 8.1 9.3-16.1Z" fill="#fbbc04" />
        <path d="M8.9 24.9h14l4.6-8.1h-9.3Z" fill="#4285f4" />
      </svg>
    );
  }

  if (kind === "cloud") {
    return (
      <svg style={iconStyle} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M9.1 24.2h13.4a5.4 5.4 0 0 0 .8-10.7A8 8 0 0 0 8 12.1a6.1 6.1 0 0 0 1.1 12.1Z" stroke="#2384df" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg style={iconStyle} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="9.5" y="4.3" width="13" height="23.4" rx="2.2" stroke="#173f6d" strokeWidth="2" />
      <path d="M13.1 7.8h5.8M14.1 24.4h3.8" stroke="#173f6d" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SuggestionIcon({ kind }: { kind: "place" | "transport" | "reservation" | "rest" | "buffer" }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

  if (kind === "place") return <svg className={styles.suggestionSvg} {...common}><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg>;
  if (kind === "transport") return <svg className={styles.suggestionSvg} {...common}><rect x="5" y="4" width="14" height="14" rx="3"/><path d="M8 18v2m8-2v2M7.5 8h9M8 14h.01M16 14h.01"/></svg>;
  if (kind === "reservation") return <svg className={styles.suggestionSvg} {...common}><rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M8 3v5m8-5v5M4 10h16M8 14h3"/></svg>;
  if (kind === "rest") return <svg className={styles.suggestionSvg} {...common}><path d="M4 16V9m0 5h16v5m-16 0v-3m16 3v-3M7 9h5a3 3 0 0 1 3 3v2H7Z"/></svg>;
  return <svg className={styles.suggestionSvg} {...common}><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>;
}

export function TripArt({ kind, className = "" }: { kind: "japan" | "singapore" | "newzealand" | "europe" | "srilanka" | "thailand" | "museum"; className?: string }) {
  if (kind === "japan") {
    return (
      <svg className={`${styles.tripArt} ${className}`} viewBox="0 0 150 92" aria-hidden="true">
        <path d="m5 80 42-48 30 48Z" className={styles.artMountain}/>
        <path d="m35 47 12-15 10 15-8-5-7 6Z" className={styles.artSnow}/>
        <path d="M91 78h45M96 69h35M102 59h24M107 49h15" className={styles.artAccent}/>
        <path d="M115 28v50M106 45h18M101 55h28M97 66h36M94 75h42" className={styles.artAccent}/>
        <path d="m115 22 5 7h-10Z" className={styles.artAccent}/>
      </svg>
    );
  }

  if (kind === "singapore") {
    return (
      <svg className={`${styles.tripArt} ${className}`} viewBox="0 0 150 92" aria-hidden="true">
        <path d="M4 78h142" className={styles.artWater}/>
        <path d="M60 76V50h14v26M81 76V42h15v34M103 76V53h14v23" className={styles.artSoft}/>
        <path d="M54 39h72l-8 10H62Z" className={styles.artInk}/>
        <path d="M26 75V48m-9 3h19m-15-8 5-16 6 16" className={styles.artGreen}/>
        <path d="M18 60c6 4 12 4 18 0" className={styles.artGreen}/>
      </svg>
    );
  }

  if (kind === "newzealand") {
    return (
      <svg className={`${styles.tripArt} ${className}`} viewBox="0 0 150 92" aria-hidden="true">
        <path d="M3 78h144" className={styles.artWater}/>
        <path d="m3 73 27-33 20 21 19-38 29 38 19-25 30 37" className={styles.artMountain}/>
        <path d="m55 42 14-19 10 19-9-6-7 7Z" className={styles.artSnow}/>
        <path d="M8 80c19-10 40-7 58 0 21-11 48-10 77 0" className={styles.artGreen}/>
      </svg>
    );
  }

  if (kind === "thailand") {
    return (
      <svg className={`${styles.tripArt} ${className}`} viewBox="0 0 150 92" aria-hidden="true">
        <path d="M8 80h134" className={styles.artWater}/>
        <path d="M48 79h58M55 72h44M61 64h32M66 55h22M70 45h14" className={styles.artAccent}/>
        <path d="M77 18v27M86 31v14M68 31v14M62 44h30M57 55h40M52 64h49M47 72h59" className={styles.artInk}/>
        <path d="m77 12 4 7h-8ZM66 33l5-7 5 7m6 0 5-7 5 7" className={styles.artAccent}/>
      </svg>
    );
  }

  if (kind === "museum") {
    return (
      <svg className={`${styles.tripArt} ${className}`} viewBox="0 0 150 92" aria-hidden="true">
        <path d="M18 76h118M28 69h98M33 42h88v27H33Z" className={styles.artInk}/>
        <path d="M42 46v20m17-20v20m17-20v20m17-20v20m17-20v20" className={styles.artSoft}/>
        <path d="m28 42 49-24 49 24Z" className={styles.artAccent}/>
        <path d="M19 78c15-8 24-9 35-3m42 2c16-8 29-8 43-1" className={styles.artGreen}/>
      </svg>
    );
  }

  return (
    <svg className={`${styles.tripArt} ${className}`} viewBox="0 0 150 92" aria-hidden="true">
      <path d="M4 78h142" className={styles.artWater}/>
      <path d="m7 74 23-20 21 14 22-31 22 24 18-14 31 27" className={styles.artMountain}/>
      <path d="M88 72V50h34v22M93 50l12-12 13 12M99 56h5v7h-5m11-7h5v7h-5" className={styles.artAccent}/>
    </svg>
  );
}

export function ActionGlyph({ kind }: { kind: "calendar" | "question" | "share" | "reuse" | "settings" | "walk" | "list" }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (kind === "calendar") return <svg className={styles.actionSvg} {...common}><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></svg>;
  if (kind === "question") return <svg className={styles.actionSvg} {...common}><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.5 2.5 0 1 1 3.6 2.3c-.9.45-1.4 1-1.4 2.2M12 17h.01"/></svg>;
  if (kind === "share") return <svg className={styles.actionSvg} {...common}><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m7.8 11 8.4-4.8m-8.4 6.8 8.4 4.8"/></svg>;
  if (kind === "reuse") return <svg className={styles.actionSvg} {...common}><rect x="7" y="7" width="12" height="12" rx="2"/><path d="M15 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>;
  if (kind === "settings") return <svg className={styles.actionSvg} {...common}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6.2L14.7 3h-4L10.4 6.2a7 7 0 0 0-1.5.9l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.5.9l.3 3.2h4l.3-3.2a7 7 0 0 0 1.5-.9l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></svg>;
  if (kind === "walk") return <svg className={styles.actionSvg} {...common}><circle cx="12" cy="4" r="2"/><path d="m10 8 3 3 3 1m-5-4-2 5-3 3m7-5-2 5 3 5m-4-6-2 6"/></svg>;
  return <svg className={styles.actionSvg} {...common}><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>;
}

export function MountainFooter({ text, variant = "mountains" }: { text: string; variant?: "mountains" | "japan" }) {
  return (
    <div className={`${styles.mountainFooter} ${variant === "japan" ? styles.mountainFooterJapan : ""}`} aria-hidden="true">
      <p>{text}</p>
      {variant === "japan" ? (
        <svg className={styles.footerIllustration} viewBox="0 0 390 132">
          <path d="M0 118 70 90l42 18 58-62 43 44 45-32 65 60Z" fill="#dfe9ee" />
          <path d="M80 120 142 91l36 23 55-78 43 65 46-29 68 48Z" fill="#cbdde6" opacity=".82" />
          <path d="M258 118h74M268 109h55M276 98h39M282 87h28" className={styles.footerPagoda}/>
          <path d="M296 55v63M286 78h20M280 89h32M274 101h44M267 111h58" className={styles.footerPagoda}/>
          <path d="m296 49 5 7h-10Z" className={styles.footerPagoda}/>
          <path d="M31 117c12-16 21-24 31-31 4 15 14 26 27 31" className={styles.footerInk}/>
        </svg>
      ) : (
        <div className={styles.mountains}>
          <span className={styles.mountainBack} />
          <span className={styles.mountainMid} />
          <span className={styles.mountainFront} />
        </div>
      )}
    </div>
  );
}

export const sampleSignature: SignatureSegment[] = [
  { kind: "travel", flex: 1.4 },
  { kind: "reservation", flex: 0.8 },
  { kind: "activity", flex: 1.6 },
  { kind: "free", flex: 1.2 },
  { kind: "reservation", flex: 0.7 },
  { kind: "rest", flex: 1.5 },
];
