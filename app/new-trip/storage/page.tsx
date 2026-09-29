"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../JourneyFlow.module.css";
import { AppHeader, BottomNav, MountainFooter, StorageIcon } from "../../components/JourneyUI";
import { createTrip, getDraft } from "../../lib/tripStore";

type StorageChoice = "drive" | "cloud" | "device";

const storageOptions: {
  id: StorageChoice;
  title: string;
  description: string;
  icon: "drive" | "cloud" | "device";
  paid?: boolean;
}[] = [
  {
    id: "device",
    title: "This device",
    description: "Save only to this device",
    icon: "device",
  },
  {
    id: "drive",
    title: "Google Drive",
    description: "Coming later",
    icon: "drive",
  },
  {
    id: "cloud",
    title: "Ullalu Cloud",
    description: "Coming later",
    icon: "cloud",
    paid: true,
  },
];

const storageNotes = {
  device: "This trip stays on this device. You can move or export it later from trip settings.",
};

export default function StorageChoicePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function continueToComposer() {
    if (saving) return;
    setSaving(true);
    try {
      const trip = await createTrip(await getDraft());
      router.push(`/trip/${trip.id}/day/1`);
    } catch (cause) { setError(String(cause)); setSaving(false); }
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/new-trip" note="Your trip. Your way." />

          <div className={styles.titleBlock}>
            <h1>Where do you want to save this trip?</h1>
            <p>Trips are saved on this device. Export a backup whenever you like.</p>
          </div>

          <div className={styles.storageList} role="radiogroup" aria-label="Trip storage location">
            {storageOptions.map((option) => {
              const isSelected = option.id === "device";

              return (
                <button
                  key={option.id}
                  className={`${styles.storageOption} ${isSelected ? styles.storageOptionSelected : ""}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={option.id !== "device"}
                >
                  <span className={styles.storageIcon}>
                    <StorageIcon kind={option.icon} />
                  </span>
                  <span className={styles.storageCopy}>
                    <strong>
                      {option.title}
                      {option.paid ? <span className={styles.paidBadge}>PAID</span> : null}
                    </strong>
                    <span>{option.description}</span>
                  </span>
                  <span className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div className={styles.infoBox} aria-live="polite">
            <span className={styles.infoIcon} aria-hidden="true">i</span>
            <span>{storageNotes.device}</span>
          </div>

          {error ? <p role="alert">Could not save this trip: {error}</p> : null}
          <button className={styles.primaryButton} type="button" disabled={saving} onClick={continueToComposer}>
            {saving ? "Saving…" : "Continue"} <span aria-hidden="true">→</span>
          </button>

          <MountainFooter text="Ideas today. Journeys tomorrow." />
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
