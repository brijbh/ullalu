"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "../../JourneyFlow.module.css";
import parity from "../../JourneyParity.module.css";
import { AppHeader, BottomNav, Signature } from "../../components/JourneyUI";
import { formatTripDate, signatureFromSegments, tripDayPath, type SavedTrip } from "../../lib/tripSession";
import { exportTrip, getTrip } from "../../lib/tripStore";

export default function TripOverviewPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  useEffect(() => { getTrip(tripId).then((trip) => setTrip(trip ?? null)); }, [tripId]);
  const days = trip?.days ?? [];
  const planned = useMemo(() => days.filter((day) => day.planned).length, [days]);
  const nextDay = days.find((day) => !day.planned)?.day ?? days.at(-1)?.day ?? 1;

  if (!trip) return <main className={styles.screen}><div className={styles.emptyState}>Trip not found. <Link href="/trips">My Trips</Link></div></main>;

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trips" note={trip.metadata.endingPlace} />
          <div className={`${styles.tripHead} ${parity.tripHeadIllustrated}`}>
            <div>
              <h1>{trip.metadata.name}</h1>
              <p>{formatTripDate(trip.metadata.startDate)} – {formatTripDate(trip.metadata.endDate)}</p>
              <p>{trip.metadata.startingPlace} → {trip.metadata.endingPlace}</p>
            </div>
          </div>
          <div className={styles.overviewStats}>
            <div className={styles.statsLabels}>
              <span>{days.length} days</span><span>{planned} planned</span><span>{days.length - planned} to plan</span>
            </div>
            <div className={styles.statsBar}>
              <span style={{ opacity: planned ? 1 : .25 }} />
              <span style={{ opacity: planned ? 1 : .25 }} />
              <span style={{ opacity: days.length - planned ? 1 : .2 }} />
            </div>
          </div>
          <div className={styles.overviewActions}>
            <Link href={tripDayPath(trip.id, nextDay)}>Continue Day {nextDay}</Link>
            <Link href={`/today?trip=${encodeURIComponent(trip.id)}`}>View live day</Link>
            <button type="button" onClick={() => exportTrip(trip)}>Export .ullalu backup</button>
          </div>
          <div className={styles.daysList}>
            {days.map((day) => (
              <Link href={tripDayPath(trip.id, day.day)} className={styles.dayRow} key={day.day} style={{ textDecoration: "none", color: "inherit" }}>
                <div className={styles.dayMeta}><strong>Day {day.day}</strong><span>{day.date}</span></div>
                <div className={`${styles.dayRoute} ${day.planned ? "" : styles.dayRouteMuted}`}>
                  {day.segments.length ? <Signature segments={signatureFromSegments(day.segments)} /> : <div className={styles.signature}><span className={parity.unplannedBar} /></div>}
                  <strong>{day.route}</strong>
                </div>
                <span className={parity.rowChevron} aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
          <Link className={styles.addDayButton} href={tripDayPath(trip.id, nextDay)}>Plan {planned === days.length ? "a day" : "next day"}</Link>
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
