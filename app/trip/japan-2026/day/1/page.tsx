import styles from "../../../../JourneyFlow.module.css";
import { AppHeader, Signature, SuggestionIcon, sampleSignature } from "../../../../components/JourneyUI";

const suggestions = [
  ["place", "Place / Activity", "Add a place to visit"],
  ["transport", "Transport", "Add transport between places"],
  ["reservation", "Reservation", "Add a booking (restaurant, etc.)"],
  ["rest", "Hotel / Rest", "Add hotel or rest time"],
  ["buffer", "Buffer", "Add free time or buffer"],
] as const;

export default function DayComposerPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/new-trip/storage" menu />

          <div className={styles.tripHead}>
            <div>
              <h1>Japan 2026</h1>
              <p>Day 1 · Tue, 29 Sep 2026</p>
            </div>
          </div>

          <div className={styles.dayTimeline}>
            <Signature segments={sampleSignature} />
            <div className={styles.timeLabels}>
              <span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
            </div>
          </div>

          <article className={styles.segmentCard}>
            <span className={styles.segmentIcon} aria-hidden="true">✈</span>
            <div className={styles.segmentCopy}>
              <strong>Travel</strong>
              <span>BLR → NRT (SQ 35)</span>
              <span>01:10 – 09:30 (6h 50m)</span>
            </div>
            <button
              className={styles.moreDots}
              style={{ border: 0, padding: 0, background: "transparent", cursor: "pointer" }}
              type="button"
              aria-label="Travel segment options"
            >•••</button>
          </article>

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
            <span>Free time today</span>
            <strong>2h 30m</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
