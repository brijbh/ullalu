import Link from "next/link";
import styles from "../../JourneyFlow.module.css";
import { AppHeader, MountainFooter, StorageIcon } from "../../components/JourneyUI";

export default function StorageChoicePage() {
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
            <div className={styles.storageOption} role="radio" aria-checked="true">
              <span className={styles.storageIcon}><StorageIcon kind="drive" /></span>
              <div className={styles.storageCopy}>
                <strong>Google Drive</strong>
                <span>Save to your Google Drive</span>
              </div>
              <span className={`${styles.radio} ${styles.radioSelected}`} aria-hidden="true" />
            </div>

            <div className={styles.storageOption} role="radio" aria-checked="false">
              <span className={styles.storageIcon}><StorageIcon kind="cloud" /></span>
              <div className={styles.storageCopy}>
                <strong>
                  Ullalu Cloud
                  <span className={styles.paidBadge} style={{ display: "inline-flex", marginTop: 0 }}>PAID</span>
                </strong>
                <span>Save to Ullalu Cloud</span>
              </div>
              <span className={styles.radio} aria-hidden="true" />
            </div>

            <div className={styles.storageOption} role="radio" aria-checked="false">
              <span className={styles.storageIcon}><StorageIcon kind="device" /></span>
              <div className={styles.storageCopy}>
                <strong>This device</strong>
                <span>Save only to this device</span>
              </div>
              <span className={styles.radio} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.infoBox}>
            <span className={styles.infoIcon} aria-hidden="true">i</span>
            <span>Your itineraries, notes and plans are yours. We keep them private.</span>
          </div>

          <Link className={styles.primaryButton} href="/trip/japan-2026/day/1">Continue <span aria-hidden="true">→</span></Link>

          <MountainFooter text="Ideas today. Journeys tomorrow." />
        </div>
      </section>
    </main>
  );
}
