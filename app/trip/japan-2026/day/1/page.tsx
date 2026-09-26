import styles from "../../../../JourneyFlow.module.css";
import DayCard, { type DayCardSegment } from "../../../../components/DayCard";
import { AppHeader, SuggestionIcon } from "../../../../components/JourneyUI";

const suggestions = [
  ["place", "Place / Activity", "Add a place to visit"],
  ["transport", "Transport", "Add transport between places"],
  ["reservation", "Reservation", "Add a booking (restaurant, etc.)"],
  ["rest", "Hotel / Rest", "Add hotel or rest time"],
  ["buffer", "Buffer", "Add free time or buffer"],
] as const;

const planningSegments: DayCardSegment[] = [
  {
    kind: "travel",
    icon: "🚗",
    title: "To BLR Airport",
    duration: "45m",
    start: "06:00",
    end: "06:45",
    detail: "Home → BLR",
    weight: .75,
    width: 138,
  },
  {
    kind: "buffer",
    icon: "🧳",
    title: "Check-in",
    duration: "1h 55m",
    start: "07:30",
    end: "09:25",
    detail: "Security · Terminal 2",
    weight: 1.92,
    width: 142,
  },
  {
    kind: "travel",
    icon: "✈",
    title: "SQ 35",
    duration: "6h 10m",
    start: "09:25",
    end: "15:35",
    detail: "BLR → SIN",
    weight: 6.17,
    width: 184,
  },
  {
    kind: "buffer",
    icon: "🛬",
    title: "Layover",
    duration: "2h 15m",
    start: "15:35",
    end: "17:50",
    detail: "Changi Airport",
    weight: 2.25,
    width: 142,
  },
  {
    kind: "travel",
    icon: "✈",
    title: "SQ 12",
    duration: "6h 20m",
    start: "17:50",
    end: "14:10 +1",
    detail: "SIN → NRT",
    weight: 6.33,
    width: 184,
  },
  {
    kind: "travel",
    icon: "🚆",
    title: "To hotel",
    duration: "1h 10m",
    start: "14:10",
    end: "15:20",
    detail: "NRT → Shinjuku",
    weight: 1.17,
    width: 146,
  },
  {
    kind: "activity",
    icon: "🏨",
    title: "Check-in",
    duration: "15m",
    start: "15:20",
    end: "15:35",
    detail: "Hotel Gracery",
    weight: .25,
    width: 132,
  },
  {
    kind: "free",
    icon: "◷",
    title: "Free time",
    duration: "~1h",
    start: "15:35",
    end: "16:35",
    detail: "Explore nearby",
    weight: 1,
    width: 132,
  },
];

export default function DayComposerPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/new-trip/storage" menu />

          <div className={styles.tripHead}>
            <div>
              <h1>Japan 2026</h1>
              <p>Build Day 1 · Tue, 29 Sep 2026</p>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <DayCard
              mode="planning"
              dayLabel="TUE · 29 SEP"
              route="Bengaluru → Tokyo"
              subtitle="Flight to Tokyo, arrive and rest"
              freeTime="1h"
              segments={planningSegments}
              selectedIndex={2}
              note="Immigration may take time."
            />
          </div>

          <button className={styles.secondaryButton} type="button"><span aria-hidden="true">＋</span> Add to this day</button>

          <p className={styles.sectionLabel}>SUGGESTIONS</p>
          <div className={styles.suggestionList}>
            {suggestions.map(([kind, title, detail]) => (
              <div className={styles.suggestion} key={title}>
                <div className={styles.suggestionIcon}><SuggestionIcon kind={kind} /></div>
                <div>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </div>
                <b className={styles.suggestionArrow} aria-hidden="true">›</b>
              </div>
            ))}
          </div>

          <div className={styles.freeTime}>
            <span>Calculated free time today</span>
            <strong>1h</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
