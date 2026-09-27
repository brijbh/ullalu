"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../JourneyFlow.module.css";
import parity from "../../JourneyParity.module.css";
import { AppHeader, BottomNav, Signature, TripArt } from "../../components/JourneyUI";
import {
  DEFAULT_DRAFT,
  DEFAULT_TRIP_DAYS,
  getDraft,
  getTripDays,
  saveTripDays,
  signatureFromSegments,
  type PlannerDay,
  type TripDraft,
} from "../../lib/tripSession";

export default function TripOverviewPage() {
  const [draft, setDraft] = useState<TripDraft>(DEFAULT_DRAFT);
  const [days, setDays] = useState<PlannerDay[]>(DEFAULT_TRIP_DAYS);

  useEffect(() => {
    setDraft(getDraft());
    setDays(getTripDays());
  }, []);

  const planned = useMemo(() => days.filter((day) => day.planned).length, [days]);
  const total = Math.max(12, days.length);
  const toPlan = Math.max(0, total - planned);

  function addDay() {
    const nextDay = days.length + 1;
    const next: PlannerDay = {
      day: nextDay,
      date: `Day ${nextDay} date`,
      route: "Not planned yet",
      subtitle: "",
      planned: false,
      segments: [],
    };
    const updated = [...days, next];
    setDays(updated);
    saveTripDays(updated);
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/" menu />

          <div className={`${styles.tripHead} ${parity.tripHeadIllustrated}`}>
            <div>
              <h1>{draft.name || "Japan 2026"}</h1>
              <p>{draft.startDate} – {draft.endDate}</p>
              <p>Tokyo · Kyoto · Osaka</p>
            </div>
            <TripArt kind="japan" className={parity.tripHeadArt} />
          </div>

          <div className={styles.overviewStats}>
            <div className={styles.statsLabels}>
              <span>{total} days</span>
              <span>{planned} planned</span>
              <span>{toPlan} to plan</span>
            </div>
            <div className={styles.statsBar}>
              <span style={{ opacity: planned ? 1 : .25 }} />
              <span style={{ opacity: planned ? 1 : .25 }} />
              <span style={{ opacity: toPlan ? 1 : .2 }} />
            </div>
          </div>

          <div className={styles.overviewActions}>
            <Link href="/trip/japan-2026/day/1">Continue Day 1</Link>
            <Link href="/today">Preview live state</Link>
          </div>

          <div className={styles.daysList}>
            {days.map((day) => (
              <Link
                href={day.day === 1 ? "/trip/japan-2026/day/1" : "/trip/japan-2026/day/1"}
                className={styles.dayRow}
                key={day.day}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={styles.dayMeta}>
                  <strong>Day {day.day}</strong>
                  <span>{day.date}</span>
                </div>
                <div className={`${styles.dayRoute} ${day.planned ? "" : styles.dayRouteMuted}`}>
                  {day.planned && day.segments.length ? (
                    <Signature segments={signatureFromSegments(day.segments)} />
                  ) : (
                    <div className={styles.signature}><span className={parity.unplannedBar} /></div>
                  )}
                  <strong>{day.route}</strong>
                </div>
                <span className={parity.rowChevron} aria-hidden="true">›</span>
              </Link>
            ))}
          </div>

          <button className={styles.addDayButton} type="button" onClick={addDay}>＋&nbsp; Add a day</button>
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
