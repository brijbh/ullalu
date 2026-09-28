"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../JourneyFlow.module.css";
import { AppHeader, BottomNav, MountainFooter, StorageIcon } from "../../components/JourneyUI";

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
    description: "Save to your Google Drive",
    icon: "drive",
  },
  {
    id: "cloud",
    title: "Ullalu Cloud",
    description: "Save to Ullalu Cloud",
    icon: "cloud",
    paid: true,
  },
];

const storageNotes: Record<StorageChoice, string> = {
  drive: "Your trip will live in your own Google Drive. Ullalu only uses the access needed to read and save your itinerary.",
  cloud: "Ullalu Cloud is a paid storage option. You can confirm your plan before cloud storage is activated.",
  device: "This trip stays on this device. You can move or export it later from trip settings.",
};

export default function StorageChoicePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<StorageChoice>("device");

  useEffect(() => {
    const saved = sessionStorage.getItem("ullalu:draft-trip");
    if (saved) {
      try {
        const storage = (JSON.parse(saved) as { storage?: StorageChoice }).storage;
        if (storage === "drive" || storage === "cloud" || storage === "device") setSelected(storage);
      } catch {
        // An older draft should not prevent the device default from appearing.
      }
    }
  }, []);

  function continueToComposer() {
    sessionStorage.setItem("ullalu:trip-storage", selected);

    const draftJson = sessionStorage.getItem("ullalu:draft-trip");
    if (draftJson) {
      try {
        const draft = JSON.parse(draftJson) as Record<string, unknown>;
        sessionStorage.setItem(
          "ullalu:draft-trip",
          JSON.stringify({ ...draft, storage: selected }),
        );
      } catch {
        // Keep storage selection even if an older draft cannot be parsed.
      }
    }

    router.push("/trip/japan-2026/day/1");
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/new-trip" note="Your trip. Your way." />

          <div className={styles.titleBlock}>
            <h1>Where do you want to save this trip?</h1>
            <p>You can change this later in Settings.</p>
          </div>

          <div className={styles.storageList} role="radiogroup" aria-label="Trip storage location">
            {storageOptions.map((option) => {
              const isSelected = selected === option.id;

              return (
                <button
                  key={option.id}
                  className={`${styles.storageOption} ${isSelected ? styles.storageOptionSelected : ""}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(option.id)}
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
            <span>{storageNotes[selected]}</span>
          </div>

          <button className={styles.primaryButton} type="button" onClick={continueToComposer}>
            Continue <span aria-hidden="true">→</span>
          </button>

          <MountainFooter text="Ideas today. Journeys tomorrow." />
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
