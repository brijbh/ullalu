import Link from "next/link";
import styles from "../../JourneyFlow.module.css";
import { AppHeader } from "../../components/JourneyUI";

const actions = [
  ["▣", "View itinerary"],
  ["◉", "3 questions"],
  ["↗", "Share this trip"],
  ["⧉", "Reuse this itinerary"],
  ["⚙", "Trip settings"],
] as const;

export default function ThailandTripPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trips" menu />

          <div className={styles.completedHero}>
            <h1>Thailand 2025</h1>
            <p>12 Jan – 20 Jan 2025</p>
            <p>Bangkok · Chiang Mai · Phuket</p>
            <span className={styles.completedHeroArt} aria-hidden="true" />
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
            {actions.map(([icon, label]) => (
              <Link href={label === "View itinerary" ? "/trip/japan-2026" : "#"} className={styles.actionRow} key={label} style={{ textDecoration: "none" }}>
                <span aria-hidden="true">{icon}</span>
                <span>{label}</span>
                <span aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
