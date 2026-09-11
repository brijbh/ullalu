import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import { AppHeader, MountainFooter } from "../components/JourneyUI";

export default function NewTripPage() {
  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/" note="A new journey begins here." />

          <div className={styles.titleBlock}>
            <h1>Plan a new journey</h1>
            <p>Tell us the basics.</p>
          </div>

          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="trip-name">Trip name</label>
              <input id="trip-name" className={styles.input} defaultValue="Japan 2026" />
            </div>

            <div className={styles.field}>
              <label htmlFor="start-date">Start date</label>
              <div className={styles.inputWrap}>
                <input id="start-date" className={styles.input} defaultValue="29 Sep 2026" />
                <span className={styles.inputIcon} aria-hidden="true">▣</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="end-date">End date</label>
              <div className={styles.inputWrap}>
                <input id="end-date" className={styles.input} defaultValue="12 Oct 2026" />
                <span className={styles.inputIcon} aria-hidden="true">▣</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="starting-place">Starting place</label>
              <input id="starting-place" className={styles.input} defaultValue="Bengaluru (BLR)" />
            </div>

            <div className={styles.field}>
              <label htmlFor="ending-place">Ending place</label>
              <div className={styles.inputWrap}>
                <input id="ending-place" className={styles.input} defaultValue="Tokyo (NRT)" />
                <button className={styles.swapButton} type="button" aria-label="Swap places">↕</button>
              </div>
            </div>

            <div className={styles.toggleRow}>
              <span>Return to starting place?</span>
              <button className={styles.toggle} type="button" aria-label="Return to starting place enabled" />
            </div>
          </form>

          <Link className={styles.primaryButton} href="/new-trip/storage">Continue <span aria-hidden="true">→</span></Link>

          <MountainFooter text="Same places. A different you." />
        </div>
      </section>
    </main>
  );
}
