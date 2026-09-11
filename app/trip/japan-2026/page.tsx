import Link from "next/link";
import styles from "../../JourneyFlow.module.css";
import { AppHeader, Signature, sampleSignature } from "../../components/JourneyUI";

const days = [
  ["Day 1", "Tue, 29 Sep", "BLR → Tokyo", sampleSignature],
  ["Day 2", "Wed, 30 Sep", "Tokyo", [{ kind: "travel", flex: 1 }, { kind: "activity", flex: 1.4 }, { kind: "free", flex: 1.1 }, { kind: "reservation", flex: .7 }, { kind: "rest", flex: 1.4 }]],
  ["Day 3", "Thu, 1 Oct", "Tokyo", [{ kind: "activity", flex: 1.2 }, { kind: "free", flex: 1 }, { kind: "activity", flex: 1.1 }, { kind: "reservation", flex: .8 }, { kind: "rest", flex: 1.3 }]],
  ["Day 4", "Fri, 2 Oct", "Tokyo → Kyoto", [{ kind: "travel", flex: 1.2 }, { kind: "activity", flex: 1.2 }, { kind: "free", flex: 1 }, { kind: "rest", flex: 1.5 }]],
  ["Day 5", "Sat, 3 Oct", "Kyoto", [{ kind: "free", flex: 1 }, { kind: "activity", flex: 1.4 }, { kind: "reservation", flex: .8 }, { kind: "rest", flex: 1.4 }]],
  ["Day 6", "Sun, 4 Oct", "Kyoto", [{ kind: "activity", flex: 1.2 }, { kind: "free", flex: 1 }, { kind: "activity", flex: 1.1 }, { kind: "reservation", flex: .7 }, { kind: "rest", flex: 1.5 }]],
] as const;

export default function TripOverviewPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trip/japan-2026/day/1" menu />

          <div className={styles.tripHead}>
            <div>
              <h1>Japan 2026</h1>
              <p>29 Sep – 12 Oct 2026</p>
              <p>Tokyo · Kyoto · Osaka</p>
            </div>
          </div>

          <div className={styles.overviewStats}>
            <div className={styles.statsLabels}><span>12 days</span><span>8 planned</span><span>4 to plan</span></div>
            <div className={styles.statsBar}><span /><span /><span /></div>
          </div>

          <div className={styles.daysList}>
            {days.map(([day, date, route, segments]) => (
              <Link href="/trip/japan-2026/day/1" className={styles.dayRow} key={day} style={{ textDecoration: "none", color: "inherit" }}>
                <div className={styles.dayMeta}><strong>{day}</strong><span>{date}</span></div>
                <div className={styles.dayRoute}><Signature segments={[...segments]} /><strong>{route}</strong></div>
                <span aria-hidden="true">›</span>
              </Link>
            ))}

            <div className={styles.dayRow}>
              <div className={styles.dayMeta}><strong>Day 7</strong><span>Mon, 5 Oct</span></div>
              <div className={`${styles.dayRoute} ${styles.dayRouteMuted}`}>
                <div className={styles.signature}><span style={{ flex: 1, background: "#d9dde1" }} /></div>
                <strong>Not planned yet</strong>
              </div>
              <span aria-hidden="true">›</span>
            </div>
          </div>

          <button className={styles.addDayButton} type="button">＋ Add a day</button>
        </div>
      </section>
    </main>
  );
}
