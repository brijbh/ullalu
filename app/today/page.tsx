import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import { AppHeader, BottomNav, Signature, sampleSignature } from "../components/JourneyUI";

export default function TodayPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/" menu />

          <div className={styles.liveHeader}>
            <div>
              <h1>You are in Japan</h1>
              <p>Day 4 · Fri, 2 Oct 2026</p>
            </div>
            <div className={styles.weather}><span aria-hidden="true">☀</span><strong>22°C</strong><span>Tokyo</span></div>
          </div>

          <section className={styles.liveCard}>
            <div className={styles.liveHero}>
              <span className={styles.liveBadge}>LIVE TRIP</span>
              <h2>Ueno Museum</h2>
              <span className={styles.liveTime}>14:00 – 16:00</span>
              <p>Explore art, history and a quieter side of Tokyo.</p>
            </div>

            <div className={styles.nowBlock}>
              <span className={styles.nowLabel}>Now</span>
              <div className={styles.nowSignature}>
                <Signature segments={sampleSignature} />
              </div>
              <div className={styles.timeLabels}>
                <span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
              </div>
            </div>

            <div className={styles.nextRow}>
              <strong>Next</strong>
              <span className={styles.nextIcon} aria-hidden="true">🚶</span>
              <div className={styles.nextCopy}>
                <strong>Walk to Ueno Park</strong>
                <span>16:15 – 17:00</span>
              </div>
              <span aria-hidden="true">›</span>
            </div>

            <Link href="/trip/japan-2026/day/1" className={styles.planRow}>
              <span>☷ &nbsp; View today&apos;s plan</span>
              <span aria-hidden="true">›</span>
            </Link>
          </section>
        </div>
        <BottomNav active="home" />
      </section>
    </main>
  );
}
