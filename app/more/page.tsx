"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import parity from "../JourneyParity.module.css";
import { BottomNav } from "../components/JourneyUI";
import { type SavedTrip } from "../lib/tripSession";
import { exportTrip, getActiveTrip, importTrip } from "../lib/tripStore";

export default function MorePage() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => { getActiveTrip().then((value) => setTrip(value ?? null)).catch((error) => setMessage(String(error))); }, []);

  async function handleImport(file?: File) {
    if (!file) return;
    try {
      const imported = await importTrip(file);
      setTrip(imported);
      router.push(`/trip/${encodeURIComponent(imported.id)}?imported=1`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not import this trip."); }
    if (fileInput.current) fileInput.current.value = "";
  }

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
            <div className={styles.moreRow}>
              <span className={styles.moreRowIcon} aria-hidden="true">▣</span>
              <span>
                <strong>Trip storage</strong>
                <span>This device · saved offline</span>
              </span>
              <span aria-hidden="true">›</span>
            </div>

            <button className={styles.moreRow} type="button" disabled={!trip} onClick={() => trip && exportTrip(trip)}>
              <span className={styles.moreRowIcon} aria-hidden="true">⇩</span>
              <span>
                <strong>Export & backup</strong>
                <span>{trip ? `Download ${trip.metadata.name} as .ullalu` : "Create a trip to export it"}</span>
              </span>
              <span aria-hidden="true">›</span>
            </button>

            <button className={styles.moreRow} type="button" onClick={() => fileInput.current?.click()}>
              <span className={styles.moreRowIcon} aria-hidden="true">⇧</span>
              <span><strong>Import trip</strong><span>Open a .ullalu backup on this device</span></span>
              <span aria-hidden="true">›</span>
            </button>
            <input ref={fileInput} type="file" accept=".ullalu,application/json" hidden aria-label="Choose Ullalu trip file" onChange={(event) => void handleImport(event.target.files?.[0])} />
            {message ? <p role="alert">{message}</p> : null}

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
                <span>Trip and app shell available after your first online visit</span>
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
            <h2>Active trip</h2>
            <p><strong>{trip?.metadata.name || "No trip yet"}</strong></p>
            <p>{trip ? `${trip.metadata.startingPlace} → ${trip.metadata.endingPlace}` : "Create or import a trip"}</p>
          </section>
          <p className={styles.weatherAttribution}>Current weather data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></p>
        </div>
        <BottomNav active="more" />
      </section>
    </main>
  );
}
