import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import { ActionGlyph, AppHeader, BottomNav, Signature, TripArt, sampleSignature } from "../components/JourneyUI";

const planning = [
  ["Europe Summer", "Jun 2027", "3 of 14 days planned", "europe"],
  ["Sri Lanka", "Dec 2026", "0 of 10 days planned", "srilanka"],
] as const;

const upcoming = [
  ["Singapore", "12 Nov – 16 Nov 2026", "singapore"],
  ["New Zealand", "Feb 2027", "newzealand"],
] as const;

export default function TripsPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader showBack={false} action="search" />

          <div className={`${styles.titleBlock} ${styles.libraryTitle}`}>
            <h1>My Trips</h1>
            <p>All your journeys in one place.</p>
          </div>

          <div className={`${styles.tabs} ${styles.libraryTabs}`}>
            <span className={`${styles.tab} ${styles.tabActive}`}>Planning 2</span>
            <span className={styles.tab}>Upcoming 2</span>
            <span className={styles.tab}>Completed 3</span>
          </div>

          <section className={styles.tripListSection}>
            <h2>Planning</h2>
            {planning.map(([name, date, progress, art]) => (
              <article className={styles.libraryCard} key={name}>
                <div className={styles.libraryCopy}>
                  <strong>{name}</strong>
                  <span>{date}</span>
                  <Signature segments={sampleSignature.slice(0, 4)} />
                  <small>{progress}</small>
                </div>
                <TripArt kind={art} className={styles.libraryArt} />
              </article>
            ))}
          </section>

          <section className={styles.tripListSection}>
            <h2>Upcoming</h2>
            {upcoming.map(([name, date, art]) => (
              <article className={styles.libraryCard} key={name}>
                <div className={styles.libraryCopy}>
                  <strong>{name}</strong>
                  <span>{date}</span>
                  <Signature segments={sampleSignature.slice(0, 5)} />
                </div>
                <TripArt kind={art} className={styles.libraryArt} />
              </article>
            ))}
          </section>

          <section className={styles.tripListSection}>
            <h2>Completed</h2>
            <Link href="/trip/thailand-2025" className={`${styles.libraryCard} ${styles.completedLibraryCard}`}>
              <div className={styles.libraryCopy}>
                <strong>Thailand 2025</strong>
                <span>12 Jan – 20 Jan 2025</span>
                <Signature segments={sampleSignature} />
              </div>
              <TripArt kind="thailand" className={styles.libraryArt} />
              <div className={styles.completedActions}>
                <span><ActionGlyph kind="question" />3 questions</span>
                <span><ActionGlyph kind="share" />Share</span>
                <span><ActionGlyph kind="reuse" />Reuse</span>
              </div>
            </Link>
          </section>
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
