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

type DayCardProps = {
  mode: DayCardMode;
  dayLabel: string;
  route: string;
  subtitle: string;
  freeTime: string;
  segments: DayCardSegment[];
  selectedIndex?: number;
  currentIndex?: number;
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

export default function DayCard({
  mode,
  dayLabel,
  route,
  subtitle,
  freeTime,
  segments,
  selectedIndex = 0,
  currentIndex = 0,
  nowTime,
  nowPositionPercent = 50,
  segmentProgressPercent = 45,
  note,
  alert,
}: DayCardProps) {
  const initialIndex = mode === "live" ? currentIndex : selectedIndex;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [expanded, setExpanded] = useState(false);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setActiveIndex(mode === "live" ? currentIndex : selectedIndex);
  }, [mode, currentIndex, selectedIndex]);

  useEffect(() => {
    if (expanded) return;
    activeRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, expanded]);

  const footerText = alert
    ? `⚠ ${alert}`
    : note
      ? `📝 ${note}`
      : "Add a note for this day";

  const activeLabel = mode === "live" ? "CURRENT" : "SELECTED";
  const markerPosition = Math.max(0, Math.min(100, nowPositionPercent));
  const progress = Math.max(0, Math.min(100, segmentProgressPercent));

  const totalWeight = useMemo(
    () => segments.reduce((sum, segment) => sum + (segment.weight ?? 1), 0),
    [segments],
  );

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

      <section className={styles.overview} aria-label="Full-day time overview">
        {mode === "live" && nowTime ? (
          <div className={styles.now} style={{ left: `${markerPosition}%` }} aria-hidden="true">
            <strong>Now</strong>
            <span>{nowTime}</span>
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

        {mode === "live" && nowTime ? (
          <span
            className={styles.marker}
            style={{ left: `${markerPosition}%` }}
            aria-label={`Current time ${nowTime}`}
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
          <section className={styles.focusStrip} aria-label="Scrollable itinerary segments">
            <div className={styles.rail}>
              {segments.map((segment, index) => {
                const active = index === activeIndex;
                const isLiveCurrent = mode === "live" && index === currentIndex;

                return (
                  <button
                    ref={active ? activeRef : undefined}
                    key={`${segment.title}-${segment.start}`}
                    type="button"
                    className={`${styles.segment} ${kindClass[segment.kind]} ${active ? styles.segmentActive : ""}`}
                    style={{ width: segment.width ?? Math.max(132, Math.min(184, 116 + (segment.weight ?? 1) * 24)) }}
                    aria-current={isLiveCurrent ? "true" : undefined}
                    onClick={() => {
                      if (mode !== "live") setActiveIndex(index);
                    }}
                  >
                    {active ? <span className={styles.activeLabel}>{activeLabel}</span> : null}
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
                        <small>You are here · {nowTime}</small>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

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
                    flexGrow: (segment.weight ?? 1) / totalWeight,
                    flexBasis: 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.expandedList}>
            {segments.map((segment, index) => {
              const isCurrent = mode === "live" && index === currentIndex;
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
            })}
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
