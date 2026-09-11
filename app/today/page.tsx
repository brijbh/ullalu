import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import parity from "../JourneyParity.module.css";
import { ActionGlyph, AppHeader, BottomNav, Signature, TripArt, sampleSignature } from "../components/JourneyUI";

export default function TodayPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader showBack={false} action="menu" />

          <div className={styles.liveHeader}>
            <div>
              <h1>You are in Japan</h1>
              <p>Day 4 · Fri, 2 Oct 2026</p>
            </div>
            <div className={styles.weather}>
              <span className={parity.weatherIcon} aria-hidden="true">☀</span>
              <span className={parity.weatherStack}><strong>22°C</strong><small>Tokyo</small></span>
            </div>
          </div>

          <section className={styles.liveCard}>
            <div className={styles.liveHero}>
              <span className={styles.liveBadge}>LIVE TRIP</span>
              <h2>Ueno Museum</h2>
              <span className={styles.liveTime}>14:00 – 16:00</span>
              <p>Explore art, history and a quieter side of Tokyo.</p>
              <TripArt kind="museum" className={parity.liveHeroArt} />
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
              <span className={parity.nextIconRefine}><ActionGlyph kind="walk" /></span>
              <div className={styles.nextCopy}>
                <strong>Walk to Ueno Park</strong>
                <span>16:15 – 17:00</span>
              </div>
              <span className={parity.rowChevron} aria-hidden="true">›</span>
            </div>

            <Link href="/trip/japan-2026/day/1" className={styles.planRow}>
              <span className={parity.planRowCopy}><ActionGlyph kind="list" />View today&apos;s plan</span>
              <span className={parity.rowChevron} aria-hidden="true">›</span>
            </Link>
          </section>
        </div>
        <BottomNav active="home" />
      </section>
    </main>
  );
}
