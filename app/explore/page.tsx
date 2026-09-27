"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import parity from "../JourneyParity.module.css";
import { BottomNav, Signature, TripArt, sampleSignature } from "../components/JourneyUI";
import { DEFAULT_DRAFT, saveDraft } from "../lib/tripSession";

const itineraries = [
  {
    title: "Tokyo in 5 unhurried days",
    meta: "5 days · Tokyo",
    note: "Neighbourhoods, museums and generous free-time blocks.",
    art: "japan" as const,
    destination: "Tokyo",
  },
  {
    title: "Singapore long weekend",
    meta: "4 days · Singapore",
    note: "Food, architecture and short travel hops.",
    art: "singapore" as const,
    destination: "Singapore",
  },
  {
    title: "New Zealand South Island",
    meta: "10 days · South Island",
    note: "A road-trip rhythm with buffers for weather and scenery.",
    art: "newzealand" as const,
    destination: "Queenstown",
  },
];

export default function ExplorePage() {
  const router = useRouter();

  function useItinerary(destination: string, title: string) {
    saveDraft({
      ...DEFAULT_DRAFT,
      name: `${title} — copy`,
      startDate: "",
      endDate: "",
      startingPlace: "",
      endingPlace: destination,
      returnToStart: false,
    });
    router.push("/new-trip");
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <header className={parity.simpleHeader}>
            <Link className={styles.wordmark} href="/">Ullalu</Link>
            <span className={styles.headerNote}>Ideas worth adapting.</span>
          </header>

          <div className={styles.titleBlock}>
            <h1>Explore itineraries</h1>
            <p>Browse examples, then make the time geometry your own.</p>
          </div>

          <div className={styles.exploreGrid}>
            {itineraries.map((trip) => (
              <article className={styles.exploreCard} key={trip.title}>
                <div className={styles.exploreCardArt}>
                  <TripArt kind={trip.art} className={parity.tripArt} />
                </div>
                <div className={styles.exploreCardBody}>
                  <strong>{trip.title}</strong>
                  <p>{trip.note}</p>
                  <Signature segments={sampleSignature} />
                  <div className={styles.exploreMeta}>
                    <span>{trip.meta}</span>
                    <span>Public example</span>
                  </div>
                  <button type="button" onClick={() => useItinerary(trip.destination, trip.title)}>
                    Use this itinerary
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <BottomNav active="explore" />
      </section>
    </main>
  );
}
