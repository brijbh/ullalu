"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../../../JourneyFlow.module.css";
import DayCard, { type DayCardSegmentKind } from "../../../../components/DayCard";
import { AppHeader, SuggestionIcon } from "../../../../components/JourneyUI";
import {
  DEFAULT_DAY1_SEGMENTS,
  durationLabel,
  freeTimeLabel,
  getDay1Segments,
  getDraft,
  iconForKind,
  minutesBetween,
  saveDay1Segments,
  type PlannerSegment,
  type TripDraft,
} from "../../../../lib/tripSession";

const suggestions = [
  ["place", "Place / Activity", "Add a place to visit", "activity"],
  ["transport", "Transport", "Add transport between places", "travel"],
  ["reservation", "Reservation", "Add a booking (restaurant, etc.)", "reservation"],
  ["rest", "Hotel / Rest", "Add hotel or rest time", "rest"],
  ["buffer", "Buffer", "Add waiting, security or buffer time", "buffer"],
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

export default function DayComposerPage() {
  const [draft, setDraft] = useState<TripDraft>(getDraft());
  const [segments, setSegments] = useState<PlannerSegment[]>(DEFAULT_DAY1_SEGMENTS);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(getDraft());
    setSegments(getDay1Segments());
  }, []);

  const freeTime = useMemo(() => freeTimeLabel(segments), [segments]);

  function openNew(kind: DayCardSegmentKind) {
    const suggestion = suggestions.find((item) => item[3] === kind);
    setEditor({
      ...blankEditor,
      kind,
      title: suggestion ? suggestion[1].replace("Place / Activity", "Activity").replace("Hotel / Rest", "Hotel / Rest") : "",
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
    setSegments(updated);
    saveDay1Segments(updated);
    setEditor(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  function removeSegment(id: string) {
    const updated = segments.filter((segment) => segment.id !== id);
    setSegments(updated);
    saveDay1Segments(updated);
  }

  function resetDay() {
    setSegments(DEFAULT_DAY1_SEGMENTS);
    saveDay1Segments(DEFAULT_DAY1_SEGMENTS);
  }

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trip/japan-2026" menu />

          <div className={styles.tripHead}>
            <div>
              <h1>{draft.name || "Japan 2026"}</h1>
              <p>Build Day 1 · Tue, 29 Sep 2026</p>
            </div>
            {saved ? <span className={styles.savedPill}>Saved</span> : null}
          </div>

          <div className={styles.composerCardWrap}>
            <DayCard
              mode="planning"
              dayLabel="TUE · 29 SEP"
              route="Bengaluru → Tokyo"
              subtitle="Flight to Tokyo, arrive and rest"
              freeTime={freeTime}
              segments={segments}
              selectedIndex={Math.min(2, Math.max(0, segments.length - 1))}
              note="Immigration may take time."
            />
          </div>

          <button className={styles.secondaryButton} type="button" onClick={() => openNew("activity")}>
            <span aria-hidden="true">＋</span> Add to this day
          </button>

          <p className={styles.sectionLabel}>ADD AN ITEM</p>
          <div className={styles.suggestionList}>
            {suggestions.map(([iconKind, title, detail, segmentKind]) => (
              <button className={styles.suggestionButton} type="button" key={title} onClick={() => openNew(segmentKind)}>
                <span className={styles.suggestionIcon}><SuggestionIcon kind={iconKind} /></span>
                <span className={styles.suggestionCopy}>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </span>
                <b className={styles.suggestionArrow} aria-hidden="true">›</b>
              </button>
            ))}
          </div>

          <div className={styles.composerSectionHead}>
            <p className={styles.sectionLabel}>DAY ITEMS</p>
            <button type="button" onClick={resetDay}>Reset sample</button>
          </div>
          <div className={styles.composerItems}>
            {segments.map((segment) => (
              <article className={styles.composerItem} key={segment.id}>
                <span className={styles.composerItemIcon} aria-hidden="true">{segment.icon}</span>
                <span className={styles.composerItemCopy}>
                  <strong>{segment.title}</strong>
                  <span>{segment.start}–{segment.end} · {segment.duration}</span>
                  <small>{segment.detail}</small>
                </span>
                <span className={styles.composerItemActions}>
                  <button type="button" onClick={() => openEdit(segment)}>Edit</button>
                  <button type="button" onClick={() => removeSegment(segment.id)} aria-label={`Delete ${segment.title}`}>×</button>
                </span>
              </article>
            ))}
          </div>

          <div className={styles.freeTime}>
            <span>Calculated free time today</span>
            <strong>{freeTime}</strong>
          </div>

          <Link className={styles.primaryButton} href="/trip/japan-2026">
            Done with Day 1 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {editor ? (
        <div className={styles.composerOverlay} role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setEditor(null);
        }}>
          <form className={styles.composerSheet} onSubmit={saveEditor}>
            <div className={styles.composerSheetHead}>
              <div>
                <small>{editor.id ? "EDIT ITEM" : "ADD ITEM"}</small>
                <h2>{editor.id ? editor.title : "Add to Day 1"}</h2>
              </div>
              <button type="button" onClick={() => setEditor(null)} aria-label="Close">×</button>
            </div>

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
                <option value="free">Free time</option>
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
        </div>
      ) : null}
    </main>
  );
}
