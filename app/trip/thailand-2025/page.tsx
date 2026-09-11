import Link from "next/link";
import styles from "../../JourneyFlow.module.css";
import { ActionGlyph, AppHeader, TripArt } from "../../components/JourneyUI";

const actions = [
  ["calendar", "View itinerary"],
  ["question", "3 questions"],
  ["share", "Share this trip"],
  ["reuse", "Reuse this itinerary"],
  ["settings", "Trip settings"],
] as const;

export default function ThailandTripPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trips" menu />

          <div className={styles.completedHero}>
            <div>
              <h1>Thailand 2025</h1>
              <p>12 Jan – 20 Jan 2025</p>
              <p>Bangkok · Chiang Mai · Phuket</p>
            </div>
            <TripArt kind="thailand" className={styles.completedHeroArtSvg} />
          </div>

          <div className={styles.tabs}>
            <span className={`${styles.tab} ${styles.tabActive}`}>Overview</span>
            <span className={styles.tab}>Days</span>
            <span className={styles.tab}>Photos</span>
            <span className={styles.tab}>Questions</span>
          </div>

          <div className={styles.completedSummary}>
            <div className={styles.completedSummaryLabels}>
              <span>9 days</span><span>9 planned</span><span>0 to plan</span>
            </div>
            <div className={styles.completedProgress} />
          </div>

          <div className={styles.actionList}>
            {actions.map(([kind, label]) => (
              <Link href="#" className={styles.actionRow} key={label}>
                <span className={styles.actionIcon}><ActionGlyph kind={kind} /></span>
                <span>{label}</span>
                <span className={styles.rowChevron} aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
