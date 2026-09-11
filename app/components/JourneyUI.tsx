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

export function MountainFooter({ text }: { text: string }) {
  return (
    <div className={styles.mountainFooter} aria-hidden="true">
      <p>{text}</p>
      <div className={styles.mountains}>
        <span className={styles.mountainBack} />
        <span className={styles.mountainMid} />
        <span className={styles.mountainFront} />
      </div>
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
