import Link from "next/link";
import styles from "../JourneyFlow.module.css";

export type SignatureKind = "travel" | "activity" | "free" | "reservation" | "rest" | "buffer";

export type SignatureSegment = {
  kind: SignatureKind;
  flex?: number;
};

export function AppHeader({ backHref = "/", note, menu = false }: { backHref?: string; note?: string; menu?: boolean }) {
  return (
    <header className={styles.appHeader}>
      <Link className={styles.backButton} href={backHref} aria-label="Back">←</Link>
      <Link className={styles.wordmark} href="/">Ullalu</Link>
      {menu ? (
        <button className={styles.menuButton} type="button" aria-label="More options">•••</button>
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
  if (kind === "drive") {
    return (
      <svg className={styles.storageSvg} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M11.2 4.7h9.3l7 12.1H18.2Z" fill="#34a853" />
        <path d="m11.2 4.7-7 12.1 4.7 8.1 9.3-16.1Z" fill="#fbbc04" />
        <path d="M8.9 24.9h14l4.6-8.1h-9.3Z" fill="#4285f4" />
      </svg>
    );
  }

  if (kind === "cloud") {
    return (
      <svg className={styles.storageSvg} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M9.1 24.2h13.4a5.4 5.4 0 0 0 .8-10.7A8 8 0 0 0 8 12.1a6.1 6.1 0 0 0 1.1 12.1Z" stroke="#2384df" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={styles.storageSvg} viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
