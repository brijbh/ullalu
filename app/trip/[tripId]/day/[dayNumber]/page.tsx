"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../../JourneyFlow.module.css";
import DayCard, { type DayCardSegmentKind, type DayNavigationItem } from "../../../../components/DayCard";
import { AppHeader, BottomNav, SuggestionIcon } from "../../../../components/JourneyUI";
import {
  getTrip,
  saveTrip,
  tripDayPath,
  type SavedTrip,
  durationLabel,
  freeTimeLabel,
  iconForKind,
  minutesBetween,
  normalizeEndTime,
  sortPlannerSegments,
  validatePlannerSegment,
  withCalculatedFreeTime,
  type PlannerDay,
  type PlannerSegment,
} from "../../../../lib/tripSession";

const itemTypes = [
  ["place", "Place / Activity", "Add somewhere you want to spend time", "activity"],
  ["transport", "Transport", "Add movement between places", "travel"],
  ["reservation", "Reservation", "Add something fixed in time", "reservation"],
  ["rest", "Hotel / Rest", "Add hotel, sleep or rest time", "rest"],
  ["buffer", "Buffer", "Reserve intentional waiting, security or overhead time", "buffer"],
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
  const params = useParams<{ tripId: string; dayNumber: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const days = trip?.days ?? [];
  const dayIndex = Number(params.dayNumber) - 1;
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>();
  const addDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [editorError, setEditorError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setTrip(getTrip(params.tripId) ?? null); }, [params.tripId]);
  useEffect(() => {
    setSelectedSegmentId(undefined);
    setEditor(null);
    setEditorError("");
    addDialogRef.current?.close();
  }, [params.dayNumber]);

  const currentDay = days[dayIndex] ?? { day: dayIndex + 1, date: "", route: "", subtitle: "", planned: false, segments: [] };
  const segments = useMemo(
    () => sortPlannerSegments(currentDay.segments.filter((segment) => segment.kind !== "free")),
    [currentDay.segments],
  );
  const displaySegments = useMemo(() => withCalculatedFreeTime(segments), [segments]);
  const freeTime = useMemo(() => freeTimeLabel(segments), [segments]);
  const selectedIndex = selectedSegmentId
    ? displaySegments.findIndex((segment) => segment.id === selectedSegmentId)
    : undefined;

  function flashSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function changeDay(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= days.length || !trip) return;
    router.push(tripDayPath(trip.id, nextIndex + 1));
  }

  function commitSegments(updated: PlannerSegment[]) {
    const authored = sortPlannerSegments(updated.filter((segment) => segment.kind !== "free"));
    const updatedDays = days.map((day, index) => (
      index === dayIndex
        ? {
            ...day,
            segments: authored,
            planned: authored.length > 0,
            route: authored[0]?.title ?? "Not planned yet",
          }
        : day
    ));

    const updatedTrip = { ...trip!, days: updatedDays };
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    flashSaved();
  }

  function updateDayNote(note: string) {
    const updatedDays = days.map((day, index) => (
      index === dayIndex ? { ...day, note } : day
    ));
    const updatedTrip = { ...trip!, days: updatedDays };
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    flashSaved();
  }

  function openAddDialog() {
    setEditor(null);
    setEditorError("");
    const dialog = addDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  function chooseItemType(kind: DayCardSegmentKind) {
    const item = itemTypes.find((entry) => entry[3] === kind);
    setEditorError("");
    setEditor({
      ...blankEditor,
      kind,
      title: item ? item[1].replace("Place / Activity", "Activity") : "",
    });
  }

  function openEdit(segment: PlannerSegment) {
    setEditorError("");
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

    const validationMessage = validatePlannerSegment(
      {
        id: editor.id ?? "",
        title: editor.title.trim() || "Untitled item",
        start: editor.start,
        end: normalizeEndTime(editor.start, editor.end),
      },
      segments,
    );

    if (validationMessage) {
      setEditorError(validationMessage);
      return;
    }

    const minutes = minutesBetween(editor.start, editor.end);
    const next: PlannerSegment = {
      id: editor.id ?? `segment-${Date.now()}`,
      kind: editor.kind,
      icon: iconForKind(editor.kind),
      title: editor.title.trim() || "Untitled item",
      duration: durationLabel(minutes),
      start: editor.start,
      end: normalizeEndTime(editor.start, editor.end),
      detail: editor.detail.trim() || "No details yet",
      weight: Math.max(.25, minutes / 60),
      width: Math.max(132, Math.min(184, 122 + minutes / 8)),
    };

    const updated = editor.id
      ? segments.map((segment) => segment.id === editor.id ? next : segment)
      : [...segments, next];

    commitSegments(updated);
    setEditor(null);
    setEditorError("");
    addDialogRef.current?.close();
    setSelectedSegmentId(next.id);
  }

  function removeSegment(id: string) {
    commitSegments(segments.filter((segment) => segment.id !== id));
    if (selectedSegmentId === id) setSelectedSegmentId(undefined);
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
      onClick: () => setSelectedSegmentId(undefined),
    },
    {
      label: "NEXT",
      date: dayIndex < days.length - 1 ? shortDate(days[dayIndex + 1].date) : "—",
      disabled: dayIndex >= days.length - 1,
      onClick: () => changeDay(dayIndex + 1),
    },
  ];

  if (!trip || !days[dayIndex]) return <main className={styles.screen}><div className={styles.emptyState}>Trip or day not found. <Link href="/trips">My Trips</Link></div></main>;

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref={`/trip/${trip?.id}`} note={trip?.draft.endingPlace} />

          <div className={styles.tripHead}>
            <div>
              <h1>{trip?.draft.name}</h1>
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
              segments={displaySegments}
              selectedIndex={selectedIndex !== undefined && selectedIndex >= 0 ? selectedIndex : undefined}
              onSelectSegment={(index) => setSelectedSegmentId(displaySegments[index]?.id)}
              dayNavigation={dayNavigation}
              note={currentDay.note}
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
            <span className={styles.timeOrderHint}>Ordered by time</span>
          </div>

          <div className={styles.composerItems}>
            {segments.length ? segments.map((segment) => (
              <article
                className={`${styles.composerItem} ${selectedSegmentId === segment.id ? styles.composerItemSelected : ""}`}
                key={segment.id}
                onClick={() => setSelectedSegmentId(segment.id)}
              >
                <span className={styles.composerItemIcon} aria-hidden="true">{segment.icon}</span>
                <span className={styles.composerItemCopy}>
                  <strong>{segment.title}</strong>
                  <span>{segment.start}–{segment.end} · {segment.duration}</span>
                  <small>{segment.kind === "buffer" ? `Intentional buffer · ${segment.detail}` : segment.detail}</small>
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
            <span>
              <strong>Free time</strong>
              <small>Automatically calculated from open gaps. Buffer is intentional time you add yourself.</small>
            </span>
            <strong>{freeTime}</strong>
          </div>

          <section className={styles.dayNotes} aria-label="Day notes">
            <label htmlFor="day-note">DAY NOTE</label>
            <textarea
              id="day-note"
              value={currentDay.note ?? ""}
              onChange={(event) => updateDayNote(event.target.value)}
              placeholder="Add context for the whole day…"
              rows={3}
            />
            <small>For the whole day. Notes for individual itinerary segments can come later.</small>
          </section>

          <Link className={styles.primaryButton} href={`/trip/${trip?.id}`}>
            Done with Day {currentDay.day} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <BottomNav active="trips" />
      </section>

      <dialog
        ref={addDialogRef}
        className={styles.addItemDialog}
        onCancel={() => {
          setEditor(null);
          setEditorError("");
        }}
        onClose={() => {
          setEditor(null);
          setEditorError("");
        }}
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
              setEditorError("");
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
                onChange={(event) => {
                  setEditorError("");
                  setEditor({ ...editor, kind: event.target.value as DayCardSegmentKind });
                }}
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
                onChange={(event) => {
                  setEditorError("");
                  setEditor({ ...editor, title: event.target.value });
                }}
                placeholder="e.g. TeamLab Borderless"
                required
              />
            </div>

            <div className={styles.composerTimeGrid}>
              <div className={styles.field}>
                <label htmlFor="item-start">Start</label>
                <input
                  id="item-start"
                  type="time"
                  className={styles.input}
                  value={editor.start}
                  onChange={(event) => {
                    setEditorError("");
                    setEditor({ ...editor, start: event.target.value });
                  }}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="item-end">End</label>
                <input
                  id="item-end"
                  type="time"
                  className={styles.input}
                  value={editor.end}
                  onChange={(event) => {
                    setEditorError("");
                    setEditor({ ...editor, end: event.target.value });
                  }}
                  required
                />
              </div>
            </div>

            {editorError ? (
              <p className={styles.editorError} role="alert">{editorError}</p>
            ) : (
              <p className={styles.timeHelp}>Items are placed chronologically. If the end time is earlier than the start, Ullalu treats it as ending the next day. Overlaps are still blocked.</p>
            )}

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

            {editor.kind === "buffer" ? (
              <p className={styles.bufferHelp}>
                Buffer is deliberate protected time. Free Time is calculated automatically from the gaps left in your schedule.
              </p>
            ) : null}

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
