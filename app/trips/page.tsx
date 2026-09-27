"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import parity from "../JourneyParity.module.css";
import { ActionGlyph, BottomNav, Signature, TripArt, sampleSignature } from "../components/JourneyUI";

type TripTab = "planning" | "upcoming" | "completed";

const planning = [
  ["Japan 2026", "29 Sep – 12 Oct 2026", "8 of 12 days planned", "japan", "/trip/japan-2026"],
  ["Europe Summer", "Jun 2027", "3 of 14 days planned", "europe", "#"],
  ["Sri Lanka", "Dec 2026", "0 of 10 days planned", "srilanka", "#"],
] as const;

const upcoming = [
  ["Singapore", "12 Nov – 16 Nov 2026", "singapore", "/trip/singapore"],
  ["New Zealand", "Feb 2027", "newzealand", "#"],
] as const;

const completed = [
  ["Thailand 2025", "12 Jan – 20 Jan 2025", "thailand", "/trip/thailand-2025"],
] as const;

export default function TripsPage() {
  const [tab, setTab] = useState<TripTab>("planning");
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const planningRows = useMemo(() => planning.filter(([name]) => !q || name.toLowerCase().includes(q)), [q]);
  const upcomingRows = useMemo(() => upcoming.filter(([name]) => !q || name.toLowerCase().includes(q)), [q]);
  const completedRows = useMemo(() => completed.filter(([name]) => !q || name.toLowerCase().includes(q)), [q]);

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <header className={parity.simpleHeader}>
            <Link className={styles.wordmark} href="/">Ullalu</Link>
            <button className={styles.menuButton} type="button" aria-label="Search trips" onClick={() => setSearching((value) => !value)}>⌕</button>
          </header>

          <div className={`${styles.titleBlock} ${parity.libraryTitle}`}>
            <h1>My Trips</h1>
            <p>All your journeys in one place.</p>
          </div>

          {searching ? (
            <div className={styles.librarySearch}>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your trips"
                aria-label="Search your trips"
              />
            </div>
          ) : null}

          <div className={`${styles.tabs} ${parity.libraryTabs}`}>
            <button className={`${styles.tabButton} ${tab === "planning" ? styles.tabButtonActive : ""}`} type="button" onClick={() => setTab("planning")}>Planning {planning.length}</button>
            <button className={`${styles.tabButton} ${tab === "upcoming" ? styles.tabButtonActive : ""}`} type="button" onClick={() => setTab("upcoming")}>Upcoming {upcoming.length}</button>
            <button className={`${styles.tabButton} ${tab === "completed" ? styles.tabButtonActive : ""}`} type="button" onClick={() => setTab("completed")}>Completed {completed.length}</button>
          </div>

          {tab === "planning" ? (
            <section className={styles.tripListSection}>
              <h2>Planning</h2>
              {planningRows.map(([name, date, progress, art, href]) => (
                href !== "#" ? (
                  <Link href={href} className={`${styles.libraryCard} ${parity.completedLibraryCard}`} key={name}>
                    <div className={parity.libraryCopy}>
                      <strong>{name}</strong>
                      <span>{date}</span>
                      <Signature segments={sampleSignature.slice(0, 4)} />
                      <small>{progress}</small>
                    </div>
                    <TripArt kind={art} className={parity.libraryArt} />
                  </Link>
                ) : (
                  <article className={styles.libraryCard} key={name}>
                    <div className={parity.libraryCopy}>
                      <strong>{name}</strong>
                      <span>{date}</span>
                      <Signature segments={sampleSignature.slice(0, 4)} />
                      <small>{progress}</small>
                    </div>
                    <TripArt kind={art} className={parity.libraryArt} />
                  </article>
                )
              ))}
              {!planningRows.length ? <div className={styles.emptyState}>No planning trips match “{query}”.</div> : null}
            </section>
          ) : null}

          {tab === "upcoming" ? (
            <section className={styles.tripListSection}>
              <h2>Upcoming</h2>
              {upcomingRows.map(([name, date, art, href]) => (
                href !== "#" ? (
                  <Link href={href} className={`${styles.libraryCard} ${parity.completedLibraryCard}`} key={name}>
                    <div className={parity.libraryCopy}>
                      <strong>{name}</strong>
                      <span>{date}</span>
                      <Signature segments={sampleSignature.slice(0, 5)} />
                      <small>Ready to travel</small>
                    </div>
                    <TripArt kind={art} className={parity.libraryArt} />
                  </Link>
                ) : (
                  <article className={styles.libraryCard} key={name}>
                    <div className={parity.libraryCopy}>
                      <strong>{name}</strong>
                      <span>{date}</span>
                      <Signature segments={sampleSignature.slice(0, 5)} />
                      <small>Ready to travel</small>
                    </div>
                    <TripArt kind={art} className={parity.libraryArt} />
                  </article>
                )
              ))}
              {!upcomingRows.length ? <div className={styles.emptyState}>No upcoming trips match “{query}”.</div> : null}
            </section>
          ) : null}

          {tab === "completed" ? (
            <section className={styles.tripListSection}>
              <h2>Completed</h2>
              {completedRows.map(([name, date, art, href]) => (
                <Link href={href} className={`${styles.libraryCard} ${parity.completedLibraryCard}`} key={name}>
                  <div className={parity.libraryCopy}>
                    <strong>{name}</strong>
                    <span>{date}</span>
                    <Signature segments={sampleSignature} />
                  </div>
                  <TripArt kind={art} className={parity.libraryArt} />
                  <div className={`${styles.completedActions} ${parity.completedActionsRefined}`}>
                    <span><ActionGlyph kind="question" />3 questions</span>
                    <span><ActionGlyph kind="share" />Share</span>
                    <span><ActionGlyph kind="reuse" />Reuse</span>
                  </div>
                </Link>
              ))}
              {!completedRows.length ? <div className={styles.emptyState}>No completed trips match “{query}”.</div> : null}
            </section>
          ) : null}
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
