import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import { AppHeader, BottomNav, Signature, sampleSignature } from "../components/JourneyUI";

const planning = [
  ["Europe Summer", "Jun 2027", "3 of 14 days planned"],
  ["Sri Lanka", "Dec 2026", "0 of 10 days planned"],
] as const;

const upcoming = [
  ["Singapore", "12 Nov – 16 Nov 2026"],
  ["New Zealand", "Feb 2027"],
] as const;

export default function TripsPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/" menu />

          <div className={styles.titleBlock}>
            <h1>My Trips</h1>
            <p>All your journeys in one place.</p>
          </div>

          <div className={styles.tabs}>
            <span className={`${styles.tab} ${styles.tabActive}`}>Planning 2</span>
            <span className={styles.tab}>Upcoming 2</span>
            <span className={styles.tab}>Completed 3</span>
            <span className={styles.tab}>Shared</span>
          </div>

          <section className={styles.tripListSection}>
            <h2>Planning</h2>
            {planning.map(([name, date, progress]) => (
              <article className={styles.libraryCard} key={name}>
                <div>
                  <strong>{name}</strong>
                  <span>{date}</span>
                  <Signature segments={sampleSignature.slice(0, 4)} />
                  <span>{progress}</span>
                </div>
                <div className={styles.miniArt} aria-hidden="true" />
              </article>
            ))}
          </section>

          <section className={styles.tripListSection}>
            <h2>Upcoming</h2>
            {upcoming.map(([name, date]) => (
              <article className={styles.libraryCard} key={name}>
                <div>
                  <strong>{name}</strong>
                  <span>{date}</span>
                  <Signature segments={sampleSignature.slice(0, 5)} />
                </div>
                <div className={styles.miniArt} aria-hidden="true" />
              </article>
            ))}
          </section>

          <section className={styles.tripListSection}>
            <h2>Completed</h2>
            <Link href="/trip/thailand-2025" className={styles.libraryCard} style={{ textDecoration: "none", color: "inherit" }}>
              <div>
                <strong>Thailand 2025</strong>
                <span>12 Jan – 20 Jan 2025</span>
                <Signature segments={sampleSignature} />
              </div>
              <div className={styles.miniArt} aria-hidden="true" />
              <div className={styles.completedActions}>
                <span>◉ 3 questions</span>
                <span>↗ Share</span>
                <span>⧉ Reuse</span>
              </div>
            </Link>
          </section>
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
