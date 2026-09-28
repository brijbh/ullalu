"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import parity from "../JourneyParity.module.css";
import DayCard, { type DayCardSegment, type DayCardSegmentKind, type DayNavigationItem } from "../components/DayCard";
import { BottomNav, SuggestionIcon } from "../components/JourneyUI";
import { durationLabel, iconForKind, minutesBetween } from "../lib/tripSession";

type LiveDay = {
  label: string;
  route: string;
  subtitle: string;
  freeTime: string;
  segments: DayCardSegment[];
};

type NewItem = {
  kind: DayCardSegmentKind;
  title: string;
  start: string;
  end: string;
  detail: string;
};

const itemTypes = [
  ["place", "Place / Activity", "activity"],
  ["transport", "Transport", "travel"],
  ["reservation", "Reservation", "reservation"],
  ["rest", "Hotel / Rest", "rest"],
  ["buffer", "Buffer", "buffer"],
] as const;

const yesterdaySegments: DayCardSegment[] = [
  { kind: "activity", icon: "☕", title: "Breakfast", duration: "1h", start: "08:00", end: "09:00", detail: "Shinjuku", weight: 1, width: 132 },
  { kind: "travel", icon: "🚆", title: "To Asakusa", duration: "35m", start: "09:00", end: "09:35", detail: "Metro", weight: .6, width: 132 },
  { kind: "activity", icon: "⛩", title: "Senso-ji", duration: "2h", start: "10:00", end: "12:00", detail: "Temple · market", weight: 2, width: 160 },
  { kind: "free", icon: "◷", title: "Free time", duration: "2h", start: "12:00", end: "14:00", detail: "Lunch · river walk", weight: 2, width: 150 },
  { kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "18:30", end: "20:00", detail: "Ginza", weight: 1.5, width: 148 },
  { kind: "rest", icon: "🌙", title: "Hotel", duration: "2h", start: "20:00", end: "22:00", detail: "Rest", weight: 2, width: 150 },
];

const nowSegments: DayCardSegment[] = [
  { kind: "activity", icon: "☕", title: "Breakfast", duration: "1h", start: "09:00", end: "10:00", detail: "Ueno", weight: 1, width: 132 },
  { kind: "travel", icon: "🚆", title: "To museum", duration: "25m", start: "10:00", end: "10:25", detail: "Metro · Ueno", weight: .42, width: 132 },
  { kind: "free", icon: "◷", title: "Free time", duration: "1h 35m", start: "10:25", end: "12:00", detail: "Lunch · wander nearby", weight: 1.58, width: 146 },
  { kind: "activity", icon: "🏛", title: "Ueno Museum", duration: "2h", start: "14:00", end: "16:00", detail: "Art · history · galleries", weight: 2, width: 172 },
  { kind: "travel", icon: "🚶", title: "Walk to Ueno Park", duration: "45m", start: "16:15", end: "17:00", detail: "On foot · 1.8 km", weight: .75, width: 142 },
  { kind: "reservation", icon: "🍜", title: "Dinner", duration: "1h 30m", start: "18:00", end: "19:30", detail: "Reservation · Asakusa", weight: 1.5, width: 150 },
  { kind: "rest", icon: "🌙", title: "Evening", duration: "2h 30m", start: "19:30", end: "22:00", detail: "Return to hotel · rest", weight: 2.5, width: 160 },
];

const tomorrowSegments: DayCardSegment[] = [
  { kind: "travel", icon: "🚄", title: "Shinkansen", duration: "2h 15m", start: "09:00", end: "11:15", detail: "Tokyo → Kyoto", weight: 2.25, width: 170 },
  { kind: "buffer", icon: "🧳", title: "Hotel bags", duration: "45m", start: "11:15", end: "12:00", detail: "Drop luggage", weight: .75, width: 132 },
  { kind: "free", icon: "◷", title: "Lunch", duration: "1h 30m", start: "12:00", end: "13:30", detail: "Kyoto Station", weight: 1.5, width: 145 },
  { kind: "activity", icon: "⛩", title: "Fushimi Inari", duration: "2h", start: "14:00", end: "16:00", detail: "Shrine · walk", weight: 2, width: 160 },
  { kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "18:30", end: "20:00", detail: "Gion", weight: 1.5, width: 145 },
  { kind: "rest", icon: "🌙", title: "Rest", duration: "2h", start: "20:00", end: "22:00", detail: "Kyoto hotel", weight: 2, width: 150 },
];

const initialDays: LiveDay[] = [
  { label: "THU · 1 OCT", route: "Asakusa → Ginza", subtitle: "Temple, open time and dinner", freeTime: "2h", segments: yesterdaySegments },
  { label: "FRI · 2 OCT", route: "Ueno → Asakusa", subtitle: "Museum, park, dinner and an easy evening", freeTime: "1h 35m", segments: nowSegments },
  { label: "SAT · 3 OCT", route: "Tokyo → Kyoto", subtitle: "Shinkansen, shrine and Gion", freeTime: "1h 30m", segments: tomorrowSegments },
];

export default function TodayPage() {
  const [days, setDays] = useState<LiveDay[]>(initialDays);
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const addDialogRef = useRef<HTMLDialogElement | null>(null);
  const [newItem, setNewItem] = useState<NewItem | null>(null);
  const [photoCount, setPhotoCount] = useState(0);

  const dayArrayIndex = dayOffset + 1;
  const activeDay = days[dayArrayIndex];
  const currentIndex = 3;

  const dayNavigation: DayNavigationItem[] = [
    { label: "YESTERDAY", date: "1 OCT", active: dayOffset === -1, onClick: () => { setDayOffset(-1); setSelectedIndex(undefined); } },
    { label: "NOW", date: "2 OCT", active: dayOffset === 0, onClick: () => { setDayOffset(0); setSelectedIndex(undefined); } },
    { label: "TOMORROW", date: "3 OCT", active: dayOffset === 1, onClick: () => { setDayOffset(1); setSelectedIndex(undefined); } },
  ];

  const highlightedIndex = useMemo(
    () => selectedIndex ?? (dayOffset === 0 ? currentIndex : undefined),
    [selectedIndex, dayOffset],
  );

  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newItem) return;
    const minutes = minutesBetween(newItem.start, newItem.end);
    const newSegment: DayCardSegment = {
      kind: newItem.kind,
      icon: iconForKind(newItem.kind),
      title: newItem.title.trim(),
      duration: durationLabel(minutes),
      start: newItem.start,
      end: newItem.end,
      detail: newItem.detail.trim() || "No details yet",
      weight: Math.max(.25, minutes / 60),
      width: Math.max(132, Math.min(184, 122 + minutes / 8)),
    };

    setDays((current) => current.map((day, index) => (
      index === dayArrayIndex
        ? { ...day, segments: [...day.segments, newSegment].sort((a, b) => a.start.localeCompare(b.start)) }
        : day
    )));
    addDialogRef.current?.close();
    setNewItem(null);
  }

  function chooseItemType(kind: DayCardSegmentKind) {
    setNewItem({ kind, title: "", start: "17:15", end: "18:00", detail: "" });
  }

  function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    setPhotoCount(event.target.files?.length ?? 0);
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <header className={parity.simpleHeader}>
            <Link className={styles.wordmark} href="/">Ullalu</Link>
            <button className={styles.menuButton} type="button" aria-label="More options">•••</button>
          </header>

          <div className={styles.liveDayHeader}>
            <div>
              <h1>You are in Japan</h1>
              <p>Day 4 · Fri, 2 Oct 2026</p>
            </div>
            <div className={styles.weather}>
              <span className={parity.weatherIcon} aria-hidden="true">☀</span>
              <span className={parity.weatherStack}><strong>22°C</strong><small>Tokyo</small></span>
            </div>
          </div>

          <div className={styles.composerCardWrap}>
            <DayCard
              mode="live"
              dayLabel={activeDay.label}
              route={activeDay.route}
              subtitle={activeDay.subtitle}
              freeTime={activeDay.freeTime}
              segments={activeDay.segments}
              selectedIndex={selectedIndex}
              currentIndex={currentIndex}
              onSelectSegment={setSelectedIndex}
              dayNavigation={dayNavigation}
              liveNow={dayOffset === 0}
              nowTime="14:42"
              alert={dayOffset === 0 ? "Only 15 min between Ueno Museum and the walk to Ueno Park." : undefined}
              note={dayOffset === 0 ? "Pick up the museum postcard before leaving." : undefined}
            />
          </div>

          <div className={styles.dayActionRow}>
            <button
              className={styles.dayActionButton}
              type="button"
              onClick={() => {
                const dialog = addDialogRef.current;
                if (dialog && !dialog.open) dialog.showModal();
              }}
            >
              <span aria-hidden="true">＋</span><strong>Add item</strong>
            </button>
            <label className={styles.dayPhotoButton}>
              <span aria-hidden="true">▣</span><strong>Upload photos</strong>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} />
            </label>
          </div>
          {photoCount ? <div className={styles.photoCount}>{photoCount} photo{photoCount === 1 ? "" : "s"} selected for this day</div> : null}

          <div className={styles.composerSectionHead}>
            <p className={styles.sectionLabel}>ACTIVITIES FOR THE DAY</p>
          </div>

          <div className={styles.liveAgenda}>
            {activeDay.segments.map((segment, index) => {
              const isCurrent = dayOffset === 0 && index === currentIndex;
              const isSelected = highlightedIndex === index;
              return (
                <button
                  type="button"
                  key={`${segment.title}-${index}`}
                  className={`${styles.liveAgendaRow} ${isSelected ? styles.agendaSelected : ""} ${isCurrent ? styles.liveAgendaCurrent : ""}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <span className={styles.liveAgendaTime}>{segment.start}</span>
                  <span className={styles.liveAgendaIcon} aria-hidden="true">{segment.icon}</span>
                  <span className={styles.liveAgendaCopy}>
                    <strong>{segment.title}</strong>
                    <span>{segment.detail}</span>
                  </span>
                  <span className={styles.liveAgendaDuration}>{segment.duration}</span>
                </button>
              );
            })}
          </div>
        </div>
        <BottomNav active="home" />
      </section>

      <dialog
        ref={addDialogRef}
        className={styles.addItemDialog}
        aria-label="Add item to this day"
        onClose={() => setNewItem(null)}
      >
        <div className={styles.sheetHandle} aria-hidden="true" />
        <div className={styles.composerSheetHead}>
          <div>
            <small>ADD ITEM</small>
            <h2>{newItem ? "Add to this day" : "What are you adding?"}</h2>
          </div>
          <button type="button" onClick={() => addDialogRef.current?.close()} aria-label="Close">×</button>
        </div>

        {newItem ? (
          <form className={styles.sheetForm} onSubmit={saveItem}>
            <div className={styles.field}>
              <label htmlFor="live-item-kind">Type</label>
              <select id="live-item-kind" className={styles.input} value={newItem.kind} onChange={(event) => setNewItem({ ...newItem, kind: event.target.value as DayCardSegmentKind })}>
                <option value="activity">Place / Activity</option>
                <option value="travel">Transport</option>
                <option value="reservation">Reservation</option>
                <option value="rest">Hotel / Rest</option>
                <option value="buffer">Buffer</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="live-item-title">Title</label>
              <input id="live-item-title" className={styles.input} value={newItem.title} onChange={(event) => setNewItem({ ...newItem, title: event.target.value })} placeholder="e.g. Evening walk" required />
            </div>
            <div className={styles.composerTimeGrid}>
              <div className={styles.field}>
                <label htmlFor="live-item-start">Start</label>
                <input id="live-item-start" type="time" className={styles.input} value={newItem.start} onChange={(event) => setNewItem({ ...newItem, start: event.target.value })} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="live-item-end">End</label>
                <input id="live-item-end" type="time" className={styles.input} value={newItem.end} onChange={(event) => setNewItem({ ...newItem, end: event.target.value })} required />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="live-item-detail">Details</label>
              <input id="live-item-detail" className={styles.input} value={newItem.detail} onChange={(event) => setNewItem({ ...newItem, detail: event.target.value })} placeholder="Location, booking, notes…" />
            </div>
            <button className={styles.primaryButton} type="submit">Add to day</button>
          </form>
        ) : (
          <div className={styles.itemTypeGrid}>
            {itemTypes.map(([iconKind, title, kind]) => (
              <button type="button" key={title} onClick={() => chooseItemType(kind)}>
                <span className={styles.itemTypeIcon}><SuggestionIcon kind={iconKind} /></span>
                <strong>{title}</strong>
                <span>Choose this type, then add its time and details.</span>
              </button>
            ))}
          </div>
        )}
      </dialog>
    </main>
  );
}
