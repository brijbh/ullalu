"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./DayCard.module.css";

export type DayCardMode = "planning" | "upcoming" | "live";
export type DayCardSegmentKind = "travel" | "activity" | "free" | "reservation" | "rest" | "buffer";

export type DayCardSegment = {
  kind: DayCardSegmentKind;
  icon: string;
  title: string;
  duration: string;
  start: string;
  end: string;
  detail: string;
  weight?: number;
  width?: number;
};

export type DayNavigationItem = {
  label: string;
  date: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

type DayCardProps = {
  mode: DayCardMode;
  dayLabel: string;
  route: string;
  subtitle: string;
  freeTime: string;
  segments: DayCardSegment[];
  selectedIndex?: number;
  currentIndex?: number;
  onSelectSegment?: (index: number) => void;
  dayNavigation?: DayNavigationItem[];
  liveNow?: boolean;
  nowTime?: string;
  nowPositionPercent?: number;
  segmentProgressPercent?: number;
  note?: string;
  alert?: string;
};

const kindClass: Record<DayCardSegmentKind, string> = {
  travel: styles.travel,
  activity: styles.activity,
  free: styles.free,
  reservation: styles.reservation,
  rest: styles.rest,
  buffer: styles.buffer,
};

const stateClass: Record<DayCardMode, string> = {
  planning: styles.statePlanning,
  upcoming: styles.stateUpcoming,
  live: styles.stateLive,
};

const stateLabel: Record<DayCardMode, string> = {
  planning: "PLANNING",
  upcoming: "UPCOMING",
  live: "LIVE",
};

function parseTime(value?: string) {
  if (!value) return null;
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function findCurrentSegment(segments: DayCardSegment[], minutes: number, fallback: number) {
  const index = segments.findIndex((segment) => {
    const start = parseTime(segment.start);
    let end = parseTime(segment.end);
    if (start === null || end === null) return false;
    if (segment.end.includes("+1") || end < start) end += 24 * 60;
    let current = minutes;
    if (current < start && end > 24 * 60) current += 24 * 60;
    return current >= start && current < end;
  });
  return index >= 0 ? index : Math.max(0, Math.min(fallback, segments.length - 1));
}

function progressForSegment(segment: DayCardSegment | undefined, minutes: number, fallback: number) {
  if (!segment) return fallback;
  const start = parseTime(segment.start);
  let end = parseTime(segment.end);
  if (start === null || end === null) return fallback;
  if (segment.end.includes("+1") || end < start) end += 24 * 60;
  let current = minutes;
  if (current < start && end > 24 * 60) current += 24 * 60;
  if (current < start || current > end) return fallback;
  return ((current - start) / Math.max(1, end - start)) * 100;
}

function formatMinutes(minutes: number) {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export default function DayCard({
  mode,
  dayLabel,
  route,
  subtitle,
  freeTime,
  segments,
  selectedIndex,
  currentIndex = 0,
  onSelectSegment,
  dayNavigation,
  liveNow = mode === "live",
  nowTime,
  nowPositionPercent,
  segmentProgressPercent = 45,
  note,
  alert,
}: DayCardProps) {
  const initialMinutes = parseTime(nowTime) ?? 12 * 60;
  const [liveMinutes, setLiveMinutes] = useState(initialMinutes);
  const computedCurrentIndex = liveNow
    ? findCurrentSegment(segments, liveMinutes, currentIndex)
    : currentIndex;
  const initialActiveIndex = selectedIndex ?? (liveNow ? computedCurrentIndex : 0);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [expanded, setExpanded] = useState(false);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!liveNow || !nowTime) {
      setLiveMinutes(parseTime(nowTime) ?? 12 * 60);
      return;
    }

    const baseMinutes = parseTime(nowTime) ?? 12 * 60;
    const startedAt = Date.now();
    const tick = () => {
      const elapsedMinutes = Math.floor((Date.now() - startedAt) / 60000);
      setLiveMinutes(baseMinutes + elapsedMinutes);
    };

    tick();
    const timer = window.setInterval(tick, 30000);
    return () => window.clearInterval(timer);
  }, [liveNow, nowTime, dayLabel]);

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setActiveIndex(Math.max(0, Math.min(selectedIndex, Math.max(0, segments.length - 1))));
      return;
    }

    setActiveIndex(liveNow ? computedCurrentIndex : 0);
  }, [selectedIndex, liveNow, computedCurrentIndex, dayLabel, segments.length]);

  useEffect(() => {
    if (expanded || !segments.length) return;
    activeRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, expanded, dayLabel, segments.length]);

  const footerText = alert
    ? `⚠ ${alert}`
    : note
      ? `📝 ${note}`
      : "Add a note for this day";

  const currentTimeLabel = liveNow ? formatMinutes(liveMinutes) : nowTime;
  const markerPosition = liveNow
    ? Math.max(0, Math.min(100, ((liveMinutes - 6 * 60) / (18 * 60)) * 100))
    : Math.max(0, Math.min(100, nowPositionPercent ?? 50));

  const currentSegment = segments[computedCurrentIndex];
  const progress = liveNow
    ? Math.max(0, Math.min(100, progressForSegment(currentSegment, liveMinutes, segmentProgressPercent)))
    : Math.max(0, Math.min(100, segmentProgressPercent));

  const totalWeight = useMemo(
    () => segments.reduce((sum, segment) => sum + (segment.weight ?? 1), 0),
    [segments],
  );

  function selectSegment(index: number) {
    setActiveIndex(index);
    onSelectSegment?.(index);
  }

  return (
    <section className={styles.card} aria-label={`${stateLabel[mode].toLowerCase()} travel day`}>
      <header className={styles.header}>
        <div>
          <div className={styles.kickerRow}>
            <p className={styles.kicker}>{dayLabel}</p>
            <span className={`${styles.state} ${stateClass[mode]}`}>{stateLabel[mode]}</span>
          </div>
          <h2 className={styles.title}>{route}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.freePill}>{freeTime} free</span>
      </header>

      {dayNavigation?.length ? (
        <nav className={styles.dayNavigation} aria-label="Day navigation">
          {dayNavigation.map((item) => (
            <button
              type="button"
              key={`${item.label}-${item.date}`}
              className={`${styles.dayNavItem} ${item.active ? styles.dayNavItemActive : ""}`}
              disabled={item.disabled}
              onClick={item.onClick}
            >
              <strong>{item.label}</strong>
              <span>{item.date}</span>
            </button>
          ))}
        </nav>
      ) : null}

      <section className={styles.overview} aria-label="Full-day time overview">
        {mode === "live" && liveNow && currentTimeLabel ? (
          <div className={styles.now} style={{ left: `${markerPosition}%` }} aria-hidden="true">
            <strong>Now</strong>
            <span>{currentTimeLabel}</span>
          </div>
        ) : null}

        <div className={styles.track}>
          {segments.map((segment, index) => (
            <span
              key={`${segment.title}-overview-${index}`}
              className={`${styles.trackSegment} ${kindClass[segment.kind]}`}
              style={{ flexGrow: segment.weight ?? 1, flexBasis: 0 }}
            />
          ))}
        </div>

        {mode === "live" && liveNow && currentTimeLabel ? (
          <span
            className={styles.marker}
            style={{ left: `${markerPosition}%` }}
            aria-label={`Current time ${currentTimeLabel}`}
          />
        ) : null}

        <div className={styles.hours} aria-hidden="true">
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </section>

      {!expanded ? (
        <>
          {segments.length ? (
            <section className={styles.focusStrip} aria-label="Scrollable itinerary segments">
              <div className={styles.rail}>
                {segments.map((segment, index) => {
                  const active = index === activeIndex;
                  const isLiveCurrent = mode === "live" && liveNow && index === computedCurrentIndex;

                  return (
                    <button
                      ref={active ? activeRef : undefined}
                      key={`${segment.title}-${segment.start}-${segment.end}-${index}`}
                      type="button"
                      className={`${styles.segment} ${kindClass[segment.kind]} ${active ? styles.segmentActive : ""} ${isLiveCurrent ? styles.segmentCurrent : ""}`}
                      style={{ width: segment.width ?? Math.max(132, Math.min(184, 116 + (segment.weight ?? 1) * 24)) }}
                      aria-current={isLiveCurrent ? "true" : undefined}
                      onClick={() => selectSegment(index)}
                    >
                      {isLiveCurrent ? (
                        <span className={`${styles.activeLabel} ${styles.currentLabel}`}>CURRENT</span>
                      ) : active ? (
                        <span className={styles.activeLabel}>SELECTED</span>
                      ) : null}
                      <span className={styles.icon} aria-hidden="true">{segment.icon}</span>
                      <strong className={styles.segmentTitle}>{segment.title}</strong>
                      <span className={styles.duration}>{segment.duration}</span>
                      <span className={styles.detail}>{segment.detail}</span>
                      <span className={styles.times}>
                        <span>{segment.start}</span>
                        <span>{segment.end}</span>
                      </span>

                      {isLiveCurrent ? (
                        <span className={styles.progress} aria-label="Current segment progress">
                          <span className={styles.progressLine}>
                            <span className={styles.progressFill} style={{ width: `${progress}%` }} />
                            <span className={styles.progressDot} style={{ left: `${progress}%` }} />
                          </span>
                          <small>You are here · {currentTimeLabel}</small>
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className={styles.emptyDay}>Nothing planned for this day yet.</div>
          )}

          <button className={styles.footer} type="button" onClick={() => setExpanded(true)}>
            <span className={styles.footerText}>{footerText}</span>
            <span className={styles.chevron} aria-hidden="true">⌄</span>
          </button>
        </>
      ) : (
        <section className={styles.expanded} aria-label="Detailed itinerary inspection">
          <div className={styles.expandedSummary}>
            <div className={`${styles.expandedTrack} ${styles.track}`} aria-label="Day summary">
              {segments.map((segment, index) => (
                <span
                  key={`${segment.title}-summary-${index}`}
                  className={`${styles.trackSegment} ${kindClass[segment.kind]}`}
                  style={{
                    flexGrow: (segment.weight ?? 1) / Math.max(totalWeight, 1),
                    flexBasis: 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.expandedList}>
            {segments.length ? segments.map((segment, index) => {
              const isCurrent = mode === "live" && liveNow && index === computedCurrentIndex;
              return (
                <article
                  key={`${segment.title}-timeline-${index}`}
                  className={`${styles.timelineRow} ${isCurrent ? styles.currentRow : ""}`}
                >
                  <span className={styles.timelineTime}>{segment.start}</span>
                  <span className={`${styles.timelineNode} ${kindClass[segment.kind]}`} aria-hidden="true">
                    {segment.icon}
                  </span>
                  <span className={styles.timelineCopy}>
                    <strong>{segment.title}</strong>
                    <span>{segment.detail} · {segment.duration}</span>
                  </span>
                </article>
              );
            }) : <div className={styles.emptyDay}>Nothing planned for this day yet.</div>}
          </div>

          {(alert || note) ? (
            <div className={styles.messageStack}>
              {alert ? (
                <div className={styles.message}>
                  <strong>⚠ Context alert</strong>
                  <span>{alert}</span>
                </div>
              ) : null}
              {note ? (
                <div className={styles.message}>
                  <strong>📝 Your note</strong>
                  <span>{note}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          <button className={styles.collapse} type="button" onClick={() => setExpanded(false)}>
            Collapse day&nbsp;&nbsp;⌃
          </button>
        </section>
      )}
    </section>
  );
}
