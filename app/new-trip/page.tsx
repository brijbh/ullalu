"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../JourneyFlow.module.css";
import { AppHeader, MountainFooter } from "../components/JourneyUI";

type TripDraft = {
  name: string;
  startDate: string;
  endDate: string;
  startingPlace: string;
  endingPlace: string;
  returnToStart: boolean;
};

const initialDraft: TripDraft = {
  name: "Japan 2026",
  startDate: "29 Sep 2026",
  endDate: "12 Oct 2026",
  startingPlace: "Bengaluru (BLR)",
  endingPlace: "Tokyo (NRT)",
  returnToStart: true,
};

export default function NewTripPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<TripDraft>(initialDraft);

  function update<K extends keyof TripDraft>(key: K, value: TripDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function swapPlaces() {
    setDraft((current) => ({
      ...current,
      startingPlace: current.endingPlace,
      endingPlace: current.startingPlace,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sessionStorage.setItem("ullalu:draft-trip", JSON.stringify(draft));
    router.push("/new-trip/storage");
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/" note="A new journey begins here." />

          <div className={styles.titleBlock}>
            <h1>Plan a new journey</h1>
            <p>Tell us the basics.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="trip-name">Trip name</label>
              <input
                id="trip-name"
                className={styles.input}
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="start-date">Start date</label>
              <div className={styles.inputWrap}>
                <input
                  id="start-date"
                  className={styles.input}
                  value={draft.startDate}
                  onChange={(event) => update("startDate", event.target.value)}
                  required
                />
                <span className={styles.inputIcon} aria-hidden="true">▣</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="end-date">End date</label>
              <div className={styles.inputWrap}>
                <input
                  id="end-date"
                  className={styles.input}
                  value={draft.endDate}
                  onChange={(event) => update("endDate", event.target.value)}
                  required
                />
                <span className={styles.inputIcon} aria-hidden="true">▣</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="starting-place">Starting place</label>
              <input
                id="starting-place"
                className={styles.input}
                value={draft.startingPlace}
                onChange={(event) => update("startingPlace", event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="ending-place">Ending place</label>
              <div className={styles.inputWrap}>
                <input
                  id="ending-place"
                  className={styles.input}
                  value={draft.endingPlace}
                  onChange={(event) => update("endingPlace", event.target.value)}
                  required
                />
                <button className={styles.swapButton} type="button" aria-label="Swap starting and ending places" onClick={swapPlaces}>↕</button>
              </div>
            </div>

            <div className={styles.toggleRow}>
              <span>Return to starting place?</span>
              <button
                className={`${styles.toggle} ${draft.returnToStart ? "" : styles.toggleOff}`}
                type="button"
                aria-label={draft.returnToStart ? "Return to starting place enabled" : "Return to starting place disabled"}
                aria-pressed={draft.returnToStart}
                onClick={() => update("returnToStart", !draft.returnToStart)}
              />
            </div>

            <button className={styles.primaryButton} type="submit">
              Continue <span aria-hidden="true">→</span>
            </button>
          </form>

          <MountainFooter text="Same places. A different you." variant="japan" />
        </div>
      </section>
    </main>
  );
}
