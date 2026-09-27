"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import parity from "../JourneyParity.module.css";
import { BottomNav } from "../components/JourneyUI";
import { DEFAULT_DRAFT, getDraft, type TripDraft } from "../lib/tripSession";

export default function MorePage() {
  const [draft, setDraft] = useState<TripDraft>(DEFAULT_DRAFT);

  useEffect(() => {
    setDraft(getDraft());
  }, []);

  const storageLabel =
    draft.storage === "cloud"
      ? "Ullalu Cloud · paid"
      : draft.storage === "device"
        ? "This device"
        : "Google Drive";

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <header className={parity.simpleHeader}>
            <Link className={styles.wordmark} href="/">Ullalu</Link>
            <span className={styles.headerNote}>Your travel workspace.</span>
          </header>

          <div className={styles.titleBlock}>
            <h1>More</h1>
            <p>Storage, privacy and app settings.</p>
          </div>

          <div className={styles.moreList}>
            <Link className={styles.moreRow} href="/new-trip/storage">
              <span className={styles.moreRowIcon} aria-hidden="true">☁</span>
              <span>
                <strong>Trip storage</strong>
                <span>{storageLabel}</span>
              </span>
              <span aria-hidden="true">›</span>
            </Link>

            <div className={styles.moreRow}>
              <span className={styles.moreRowIcon} aria-hidden="true">⇩</span>
              <span>
                <strong>Export & backup</strong>
                <span>.ullalu export will be connected with persistence</span>
              </span>
              <span aria-hidden="true">›</span>
            </div>

            <div className={styles.moreRow}>
              <span className={styles.moreRowIcon} aria-hidden="true">🔒</span>
              <span>
                <strong>Privacy</strong>
                <span>Trips are private unless you explicitly share or publish them</span>
              </span>
              <span aria-hidden="true">›</span>
            </div>

            <div className={styles.moreRow}>
              <span className={styles.moreRowIcon} aria-hidden="true">◉</span>
              <span>
                <strong>Offline cache</strong>
                <span>Keep the active trip available while travelling</span>
              </span>
              <span aria-hidden="true">›</span>
            </div>

            <div className={styles.moreRow}>
              <span className={styles.moreRowIcon} aria-hidden="true">?</span>
              <span>
                <strong>About Ullalu</strong>
                <span>Visual time planning for travel</span>
              </span>
              <span aria-hidden="true">›</span>
            </div>
          </div>

          <section className={styles.completedPanel}>
            <h2>Current draft</h2>
            <p><strong>{draft.name || "Untitled trip"}</strong></p>
            <p>{draft.startingPlace || "Starting place"} → {draft.endingPlace || "Ending place"}</p>
          </section>
        </div>
        <BottomNav active="more" />
      </section>
    </main>
  );
}
