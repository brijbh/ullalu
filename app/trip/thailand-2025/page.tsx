"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../JourneyFlow.module.css";
import parity from "../../JourneyParity.module.css";
import { ActionGlyph, AppHeader, BottomNav, Signature, TripArt, sampleSignature } from "../../components/JourneyUI";
import { DEFAULT_DRAFT, } from "../../lib/tripSession";
import { saveDraft } from "../../lib/tripStore";

type CompletedTab = "overview" | "days" | "photos" | "questions";

const completedDays = [
  ["Day 1", "Bangkok arrival", "Temple area · evening walk"],
  ["Day 2", "Bangkok", "Grand Palace · river · food"],
  ["Day 3", "Bangkok → Chiang Mai", "Flight · old city"],
  ["Day 4", "Chiang Mai", "Temples · night market"],
  ["Day 5", "Chiang Mai", "Flexible day"],
  ["Day 6", "Chiang Mai → Phuket", "Flight · beach"],
  ["Day 7", "Phuket", "Island day"],
  ["Day 8", "Phuket", "Free day · dinner"],
  ["Day 9", "Return", "Airport · home"],
] as const;

const questions = [
  ["Which Bangkok area worked best for walking?", "Riverside was easiest for the first two days."],
  ["Would you keep the Chiang Mai free day?", "Yes — it gave the trip room to breathe."],
  ["Anything to change in Phuket?", "Start the island day earlier to avoid the midday heat."],
] as const;

export default function ThailandTripPage() {
  const router = useRouter();
  const [tab, setTab] = useState<CompletedTab>("overview");
  const [toast, setToast] = useState("");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  async function shareTrip() {
    const shareData = {
      title: "Thailand 2025 · Ullalu",
      text: "Thailand 2025 itinerary — Bangkok, Chiang Mai and Phuket.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard?.writeText(window.location.href);
    showToast("Trip link copied");
  }

  async function reuseTrip() {
    await saveDraft({
      ...DEFAULT_DRAFT,
      name: "Thailand — adapted trip",
      startDate: "",
      endDate: "",
      startingPlace: "",
      endingPlace: "Bangkok",
      returnToStart: true,
    });
    router.push("/new-trip");
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trips" menu />

          <div className={styles.completedHero}>
            <div>
              <h1>Thailand 2025</h1>
              <p>12 Jan – 20 Jan 2025</p>
              <p>Bangkok · Chiang Mai · Phuket</p>
            </div>
            <TripArt kind="thailand" className={parity.completedHeroArtSvg} />
          </div>

          <div className={styles.tabs}>
            {(["overview", "days", "photos", "questions"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.tabButton} ${tab === item ? styles.tabButtonActive : ""}`}
                onClick={() => setTab(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {tab === "overview" ? (
            <>
              <div className={styles.completedSummary}>
                <div className={styles.completedSummaryLabels}>
                  <span>9 days</span><span>9 planned</span><span>0 to plan</span>
                </div>
                <div className={styles.completedProgress} />
              </div>

              <div className={styles.actionList}>
                <button className={styles.actionRow} type="button" onClick={() => setTab("days")}>
                  <span className={parity.actionIcon}><ActionGlyph kind="calendar" /></span>
                  <span>View itinerary</span>
                  <span className={parity.rowChevron} aria-hidden="true">›</span>
                </button>
                <button className={styles.actionRow} type="button" onClick={() => setTab("questions")}>
                  <span className={parity.actionIcon}><ActionGlyph kind="question" /></span>
                  <span>3 questions</span>
                  <span className={parity.rowChevron} aria-hidden="true">›</span>
                </button>
                <button className={styles.actionRow} type="button" onClick={shareTrip}>
                  <span className={parity.actionIcon}><ActionGlyph kind="share" /></span>
                  <span>Share this trip</span>
                  <span className={parity.rowChevron} aria-hidden="true">›</span>
                </button>
                <button className={styles.actionRow} type="button" onClick={reuseTrip}>
                  <span className={parity.actionIcon}><ActionGlyph kind="reuse" /></span>
                  <span>Reuse this itinerary</span>
                  <span className={parity.rowChevron} aria-hidden="true">›</span>
                </button>
                <button className={styles.actionRow} type="button" onClick={() => router.push("/more")}>
                  <span className={parity.actionIcon}><ActionGlyph kind="settings" /></span>
                  <span>Trip settings</span>
                  <span className={parity.rowChevron} aria-hidden="true">›</span>
                </button>
              </div>
            </>
          ) : null}

          {tab === "days" ? (
            <section className={styles.completedPanel}>
              <h2>9 days in Thailand</h2>
              {completedDays.map(([day, route, detail]) => (
                <div className={styles.completedDay} key={day}>
                  <span>
                    <strong>{day} · {route}</strong>
                    <span>{detail}</span>
                  </span>
                  <span style={{ width: 86 }}><Signature segments={sampleSignature.slice(0, 4)} /></span>
                </div>
              ))}
            </section>
          ) : null}

          {tab === "photos" ? (
            <section className={styles.completedPanel}>
              <h2>Trip photos</h2>
              <p>Photo attachment is not connected yet. This space is reserved for the traveller’s own photos and selected trip memories.</p>
              <label className={styles.dayPhotoButton} style={{ width: "100%", marginTop: 12 }}>
                <span aria-hidden="true">▣</span><strong>Upload trip photos</strong>
                <input type="file" accept="image/*" multiple onChange={(event) => showToast(`${event.target.files?.length ?? 0} photo${(event.target.files?.length ?? 0) === 1 ? "" : "s"} selected`)} />
              </label>
            </section>
          ) : null}

          {tab === "questions" ? (
            <section className={styles.completedPanel}>
              <h2>Questions about this trip</h2>
              <p>Answers stay attached to the completed trip so future travellers — or your future self — can reuse the useful context.</p>
              {questions.map(([question, answer]) => (
                <div className={styles.questionCard} key={question}>
                  <strong>{question}</strong>
                  <p>{answer}</p>
                </div>
              ))}
            </section>
          ) : null}
        </div>
        <BottomNav active="trips" />
      </section>
      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </main>
  );
}
