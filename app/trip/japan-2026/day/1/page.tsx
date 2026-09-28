"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "../../../../JourneyFlow.module.css";
import DayCard, { type DayCardSegmentKind, type DayNavigationItem } from "../../../../components/DayCard";
import { AppHeader, BottomNav, SuggestionIcon } from "../../../../components/JourneyUI";
import {
  DEFAULT_DRAFT,
  DEFAULT_TRIP_DAYS,
  durationLabel,
  freeTimeLabel,
  getDraft,
  getTripDays,
  iconForKind,
  minutesBetween,
  saveDay1Segments,
  saveTripDays,
  type PlannerDay,
  type PlannerSegment,
  type TripDraft,
} from "../../../../lib/tripSession";

const itemTypes = [
  ["place", "Place / Activity", "Add somewhere you want to spend time", "activity"],
  ["transport", "Transport", "Add movement between places", "travel"],
  ["reservation", "Reservation", "Add something fixed in time", "reservation"],
  ["rest", "Hotel / Rest", "Add hotel, sleep or rest time", "rest"],
  ["buffer", "Buffer", "Add waiting, security or overhead", "buffer"],
] as const;

type EditorState = {
  id?: string;
  kind: DayCardSegmentKind;
  title: string;
  start: string;
  end: string;
  detail: string;
};

const blankEditor: EditorState = {
  kind: "activity",
  title: "",
  start: "10:00",
  end: "11:00",
  detail: "",
};

function shortDate(date: string) {
  const parts = date.replace(",", "").split(" ");
  return parts.slice(-2).join(" ").toUpperCase();
}

export default function DayComposerPage() {
  const [draft, setDraft] = useState<TripDraft>(DEFAULT_DRAFT);
  const [days, setDays] = useState<PlannerDay[]>(DEFAULT_TRIP_DAYS);
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(2);
  const addDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(getDraft());
    const loadedDays = getTripDays();
    setDays(loadedDays);

    const requestedDay = Number(new URLSearchParams(window.location.search).get("day"));
    if (Number.isFinite(requestedDay) && requestedDay >= 1 && requestedDay <= loadedDays.length) {
      setDayIndex(requestedDay - 1);
      setSelectedIndex(undefined);
    }
  }, []);

  const currentDay = days[dayIndex] ?? days[0] ?? DEFAULT_TRIP_DAYS[0];
  const segments = currentDay.segments;
  const freeTime = useMemo(() => freeTimeLabel(segments), [segments]);

  function changeDay(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= days.length) return;
    setDayIndex(nextIndex);
    setSelectedIndex(undefined);
    setEditor(null);
    addDialogRef.current?.close();
  }

  function commitSegments(updated: PlannerSegment[]) {
    const updatedDays = days.map((day, index) => (
      index === dayIndex
        ? { ...day, segments: updated, planned: updated.length > 0, route: day.route === "Not planned yet" ? "Plan this day" : day.route }
        : day
    ));
    setDays(updatedDays);
    saveTripDays(updatedDays);
    if (currentDay.day === 1) saveDay1Segments(updated);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function openAddDialog() {
    setEditor(null);
    const dialog = addDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  function chooseItemType(kind: DayCardSegmentKind) {
    const item = itemTypes.find((entry) => entry[3] === kind);
    setEditor({
      ...blankEditor,
      kind,
      title: item ? item[1].replace("Place / Activity", "Activity") : "",
    });
  }

  function openEdit(segment: PlannerSegment) {
    setEditor({
      id: segment.id,
      kind: segment.kind,
      title: segment.title,
      start: segment.start,
      end: segment.end.replace(" +1", ""),
      detail: segment.detail,
    });
    const dialog = addDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;

    const minutes = minutesBetween(editor.start, editor.end);
    const next: PlannerSegment = {
      id: editor.id ?? `segment-${Date.now()}`,
      kind: editor.kind,
      icon: iconForKind(editor.kind),
      title: editor.title.trim() || "Untitled item",
      duration: durationLabel(minutes),
      start: editor.start,
      end: editor.end,
      detail: editor.detail.trim() || "No details yet",
      weight: Math.max(.25, minutes / 60),
      width: Math.max(132, Math.min(184, 122 + minutes / 8)),
    };

    const updated = editor.id
      ? segments.map((segment) => segment.id === editor.id ? next : segment)
      : [...segments, next];

    updated.sort((a, b) => a.start.localeCompare(b.start));
    commitSegments(updated);
    setEditor(null);
    addDialogRef.current?.close();
    setSelectedIndex(Math.max(0, updated.findIndex((segment) => segment.id === next.id)));
  }

  function removeSegment(id: string) {
    const updated = segments.filter((segment) => segment.id !== id);
    commitSegments(updated);
    setSelectedIndex(undefined);
  }

  const dayNavigation: DayNavigationItem[] = [
    {
      label: "PREVIOUS",
      date: dayIndex > 0 ? shortDate(days[dayIndex - 1].date) : "—",
      disabled: dayIndex === 0,
      onClick: () => changeDay(dayIndex - 1),
    },
    {
      label: `DAY ${currentDay.day}`,
      date: shortDate(currentDay.date),
      active: true,
      onClick: () => setSelectedIndex(undefined),
    },
    {
      label: "NEXT",
      date: dayIndex < days.length - 1 ? shortDate(days[dayIndex + 1].date) : "—",
      disabled: dayIndex >= days.length - 1,
      onClick: () => changeDay(dayIndex + 1),
    },
  ];

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trip/japan-2026" menu />

          <div className={styles.tripHead}>
            <div>
              <h1>{draft.name || "Japan 2026"}</h1>
              <p>Build Day {currentDay.day} · {currentDay.date}</p>
            </div>
            {saved ? <span className={styles.savedPill}>Saved</span> : null}
          </div>

          <div className={styles.composerCardWrap}>
            <DayCard
              mode="planning"
              dayLabel={currentDay.date.toUpperCase()}
              route={currentDay.route}
              subtitle={currentDay.subtitle || "Start shaping this day."}
              freeTime={freeTime}
              segments={segments}
              selectedIndex={selectedIndex}
              onSelectSegment={setSelectedIndex}
              dayNavigation={dayNavigation}
              note={currentDay.day === 1 ? "Immigration may take time." : undefined}
            />
          </div>

          <div className={styles.dayActionRow}>
            <button
              className={styles.dayActionButton}
              type="button"
              onClick={openAddDialog}
            >
              <span aria-hidden="true">＋</span>
              <strong>Add item</strong>
            </button>
          </div>

          <div className={styles.composerSectionHead}>
            <p className={styles.sectionLabel}>ACTIVITIES FOR THE DAY</p>
          </div>

          <div className={styles.composerItems}>
            {segments.length ? segments.map((segment, index) => (
              <article
                className={`${styles.composerItem} ${selectedIndex === index ? styles.composerItemSelected : ""}`}
                key={segment.id}
                onClick={() => setSelectedIndex(index)}
              >
                <span className={styles.composerItemIcon} aria-hidden="true">{segment.icon}</span>
                <span className={styles.composerItemCopy}>
                  <strong>{segment.title}</strong>
                  <span>{segment.start}–{segment.end} · {segment.duration}</span>
                  <small>{segment.detail}</small>
                </span>
                <span className={styles.composerItemActions}>
                  <button type="button" onClick={(event) => { event.stopPropagation(); openEdit(segment); }}>Edit</button>
                  <button type="button" onClick={(event) => { event.stopPropagation(); removeSegment(segment.id); }} aria-label={`Delete ${segment.title}`}>×</button>
                </span>
              </article>
            )) : (
              <div className={styles.emptyState}>Nothing planned yet. Add the first item to shape this day.</div>
            )}
          </div>

          <div className={styles.freeTime}>
            <span>Calculated free time today</span>
            <strong>{freeTime}</strong>
          </div>

          <Link className={styles.primaryButton} href="/trip/japan-2026">
            Done with Day {currentDay.day} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <BottomNav active="trips" />
      </section>

      <dialog
        ref={addDialogRef}
        className={styles.addItemDialog}
        onCancel={() => setEditor(null)}
        onClose={() => setEditor(null)}
      >
        <div className={styles.sheetHandle} aria-hidden="true" />
        <div className={styles.composerSheetHead}>
          <div>
            <small>{editor ? (editor.id ? "EDIT ITEM" : "ADD ITEM") : "ADD ITEM"}</small>
            <h2>{editor ? (editor.id ? editor.title : "Add to this day") : "What are you adding?"}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditor(null);
              addDialogRef.current?.close();
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {editor ? (
          <form className={styles.sheetForm} onSubmit={saveEditor}>
            <div className={styles.field}>
              <label htmlFor="item-kind">Type</label>
              <select
                id="item-kind"
                className={styles.input}
                value={editor.kind}
                onChange={(event) => setEditor({ ...editor, kind: event.target.value as DayCardSegmentKind })}
              >
                <option value="activity">Place / Activity</option>
                <option value="travel">Transport</option>
                <option value="reservation">Reservation</option>
                <option value="rest">Hotel / Rest</option>
                <option value="buffer">Buffer</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="item-title">Title</label>
              <input
                id="item-title"
                className={styles.input}
                value={editor.title}
                onChange={(event) => setEditor({ ...editor, title: event.target.value })}
                placeholder="e.g. TeamLab Borderless"
                required
              />
            </div>

            <div className={styles.composerTimeGrid}>
              <div className={styles.field}>
                <label htmlFor="item-start">Start</label>
                <input id="item-start" type="time" className={styles.input} value={editor.start} onChange={(event) => setEditor({ ...editor, start: event.target.value })} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="item-end">End</label>
                <input id="item-end" type="time" className={styles.input} value={editor.end} onChange={(event) => setEditor({ ...editor, end: event.target.value })} required />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="item-detail">Details</label>
              <input
                id="item-detail"
                className={styles.input}
                value={editor.detail}
                onChange={(event) => setEditor({ ...editor, detail: event.target.value })}
                placeholder="Location, booking, transport, notes…"
              />
            </div>

            <button className={styles.primaryButton} type="submit">
              {editor.id ? "Save changes" : "Add to day"}
            </button>
          </form>
        ) : (
          <div className={styles.itemTypeGrid}>
            {itemTypes.map(([iconKind, title, detail, segmentKind]) => (
              <button type="button" key={title} onClick={() => chooseItemType(segmentKind)}>
                <span className={styles.itemTypeIcon}><SuggestionIcon kind={iconKind} /></span>
                <strong>{title}</strong>
                <span>{detail}</span>
              </button>
            ))}
          </div>
        )}
      </dialog>
    </main>
  );
}
