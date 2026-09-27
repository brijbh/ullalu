import styles from "../../JourneyFlow.module.css";
import DayCard, { type DayCardSegment } from "../../components/DayCard";
import { AppHeader, TripArt } from "../../components/JourneyUI";
import parity from "../../JourneyParity.module.css";

const segments: DayCardSegment[] = [
  { kind: "activity", icon: "☕", title: "Breakfast", duration: "1h", start: "08:00", end: "09:00", detail: "Tiong Bahru", weight: 1, width: 132 },
  { kind: "travel", icon: "🚇", title: "To Gardens", duration: "30m", start: "09:00", end: "09:30", detail: "MRT", weight: .5, width: 132 },
  { kind: "activity", icon: "🌿", title: "Gardens by the Bay", duration: "2h", start: "09:30", end: "11:30", detail: "Cloud Forest · Supertree", weight: 2, width: 170 },
  { kind: "free", icon: "◷", title: "Free time", duration: "2h", start: "11:30", end: "13:30", detail: "Lunch · Marina Bay", weight: 2, width: 150 },
  { kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "18:30", end: "20:00", detail: "Reservation", weight: 1.5, width: 148 },
  { kind: "rest", icon: "🌙", title: "Evening", duration: "2h", start: "20:00", end: "22:00", detail: "Hotel · rest", weight: 2, width: 150 },
];

export default function SingaporeTripPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trips" menu />

          <div className={`${styles.tripHead} ${parity.tripHeadIllustrated}`}>
            <div>
              <h1>Singapore</h1>
              <p>12 Nov – 16 Nov 2026</p>
              <p>4 nights · upcoming</p>
            </div>
            <TripArt kind="singapore" className={parity.tripHeadArt} />
          </div>

          <div className={styles.composerCardWrap}>
            <DayCard
              mode="upcoming"
              dayLabel="FRI · 13 NOV"
              route="Marina Bay → Chinatown"
              subtitle="Gardens, open time and dinner"
              freeTime="2h"
              segments={segments}
              selectedIndex={2}
              note="Book Cloud Forest entry before the trip."
            />
          </div>

          <div className={styles.completedPanel}>
            <h2>Upcoming state</h2>
            <p>This uses the same canonical Day Card as Planning and Live. There is no NOW marker; the focus is orientation and readiness before the travel day begins.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
