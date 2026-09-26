import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import parity from "../JourneyParity.module.css";
import DayCard, { type DayCardSegment } from "../components/DayCard";
import { BottomNav } from "../components/JourneyUI";

const liveSegments: DayCardSegment[] = [
  {
    kind: "activity",
    icon: "☕",
    title: "Breakfast",
    duration: "1h",
    start: "09:00",
    end: "10:00",
    detail: "Ueno",
    weight: 1,
    width: 132,
  },
  {
    kind: "travel",
    icon: "🚆",
    title: "To museum",
    duration: "25m",
    start: "10:00",
    end: "10:25",
    detail: "Metro · Ueno",
    weight: .42,
    width: 132,
  },
  {
    kind: "free",
    icon: "◷",
    title: "Free time",
    duration: "1h 35m",
    start: "10:25",
    end: "12:00",
    detail: "Lunch · wander nearby",
    weight: 1.58,
    width: 146,
  },
  {
    kind: "activity",
    icon: "🏛",
    title: "Ueno Museum",
    duration: "2h",
    start: "14:00",
    end: "16:00",
    detail: "Art · history · galleries",
    weight: 2,
    width: 172,
  },
  {
    kind: "travel",
    icon: "🚶",
    title: "Walk to Ueno Park",
    duration: "45m",
    start: "16:15",
    end: "17:00",
    detail: "On foot · 1.8 km",
    weight: .75,
    width: 142,
  },
  {
    kind: "reservation",
    icon: "🍜",
    title: "Dinner",
    duration: "1h 30m",
    start: "18:00",
    end: "19:30",
    detail: "Reservation · Asakusa",
    weight: 1.5,
    width: 150,
  },
  {
    kind: "rest",
    icon: "🌙",
    title: "Evening",
    duration: "2h 30m",
    start: "19:30",
    end: "22:00",
    detail: "Return to hotel · rest",
    weight: 2.5,
    width: 160,
  },
];

export default function TodayPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <header className={parity.simpleHeader}>
            <Link className={styles.wordmark} href="/">Ullalu</Link>
            <button className={styles.menuButton} type="button" aria-label="More options">•••</button>
          </header>

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

          <div style={{ marginTop: 18 }}>
            <DayCard
              mode="live"
              dayLabel="FRI · 2 OCT"
              route="Ueno → Asakusa"
              subtitle="Museum, park, dinner and an easy evening"
              freeTime="1h 35m"
              segments={liveSegments}
              currentIndex={3}
              nowTime="14:42"
              nowPositionPercent={55}
              segmentProgressPercent={35}
              alert="Only 15 min between Ueno Museum and the walk to Ueno Park."
              note="Pick up the museum postcard before leaving."
            />
          </div>
        </div>
        <BottomNav active="home" />
      </section>
    </main>
  );
}
