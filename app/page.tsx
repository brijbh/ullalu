"use client";

import { useEffect, useRef, useState } from "react";

type SegmentKind = "travel" | "activity" | "free" | "reservation" | "rest";

type FocusSegment = {
  kind: SegmentKind;
  icon: string;
  title: string;
  duration: string;
  start: string;
  end: string;
  detail: string;
  width: number;
  current?: boolean;
};

const overviewSegments = [
  { kind: "rest", weight: 2 },
  { kind: "travel", weight: 0.5 },
  { kind: "activity", weight: 1.5 },
  { kind: "free", weight: 1 },
  { kind: "travel", weight: 0.5 },
  { kind: "activity", weight: 2 },
  { kind: "travel", weight: 0.25 },
  { kind: "free", weight: 1.25 },
  { kind: "reservation", weight: 0.75 },
  { kind: "rest", weight: 3 },
] as const;

const focusSegments: FocusSegment[] = [
  {
    kind: "activity",
    icon: "☕",
    title: "Breakfast",
    duration: "1h",
    start: "08:30",
    end: "09:30",
    detail: "Asakusa",
    width: 132,
  },
  {
    kind: "travel",
    icon: "🚆",
    title: "Train",
    duration: "30m",
    start: "13:30",
    end: "14:00",
    detail: "Asakusa → Ueno",
    width: 126,
  },
  {
    kind: "activity",
    icon: "🏛",
    title: "Ueno Museum",
    duration: "2h",
    start: "14:00",
    end: "16:00",
    detail: "Art and history",
    width: 176,
    current: true,
  },
  {
    kind: "travel",
    icon: "🚶",
    title: "Walk",
    duration: "15m",
    start: "16:00",
    end: "16:15",
    detail: "Ueno → Park",
    width: 116,
  },
  {
    kind: "free",
    icon: "◷",
    title: "Free",
    duration: "45m",
    start: "16:15",
    end: "17:00",
    detail: "Explore nearby",
    width: 122,
  },
  {
    kind: "reservation",
    icon: "🍜",
    title: "Dinner",
    duration: "1h 30m",
    start: "18:30",
    end: "20:00",
    detail: "Reservation",
    width: 154,
  },
];

export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const currentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, []);

  return (
    <main className="page-shell">
      <section
        className={`calendar-card${expanded ? " calendar-card--expanded" : ""}`}
        aria-label="Ullalu Day 4 itinerary"
        onClick={() => setExpanded((value) => !value)}
      >
        <header className="calendar-card__header">
          <div>
            <p className="day-kicker">DAY 4</p>
            <h1>Sun, 13 Sep 2026</h1>
          </div>
          <div className="free-pill" aria-label="2 hours 10 minutes free">
            <span aria-hidden="true">☀</span>
            <strong>2h 10m free</strong>
          </div>
        </header>

        <section className="overview" aria-label="Full-day overview">
          <div className="overview__now" aria-hidden="true">
            <strong>Now</strong>
            <span>14:15</span>
          </div>
          <div className="overview__track">
            {overviewSegments.map((segment, index) => (
              <span
                key={`${segment.kind}-${index}`}
                className={`overview__segment overview__segment--${segment.kind}`}
                style={{ flexGrow: segment.weight }}
              />
            ))}
            <span className="overview__marker" aria-label="Current time 14:15" />
          </div>
          <div className="overview__hours" aria-hidden="true">
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </section>

        <section
          className="focus-strip"
          aria-label="Scrollable itinerary around the current activity"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="focus-strip__rail">
            {focusSegments.map((segment) => (
              <article
                ref={segment.current ? currentRef : undefined}
                key={`${segment.title}-${segment.start}`}
                className={`focus-segment focus-segment--${segment.kind}${segment.current ? " focus-segment--current" : ""}`}
                style={{ width: segment.width }}
                aria-current={segment.current ? "true" : undefined}
              >
                {segment.current ? <span className="focus-segment__current-label">CURRENT</span> : null}
                <span className="focus-segment__icon" aria-hidden="true">{segment.icon}</span>
                <strong className="focus-segment__title">{segment.title}</strong>
                <span className="focus-segment__duration">{segment.duration}</span>
                <span className="focus-segment__detail">{segment.detail}</span>
                <div className="focus-segment__time">
                  <span>{segment.start}</span>
                  <span>{segment.end}</span>
                </div>
                {segment.current ? (
                  <div className="activity-progress" aria-label="Current activity progress">
                    <span className="activity-progress__line"><span /></span>
                    <small>You are here · 14:15</small>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <div className="swipe-hint" aria-hidden="true">
          <span>‹</span>
          <div><i /><i className="is-active" /><i /><i /></div>
          <span>›</span>
        </div>

        <div className="day-insight">
          <span className="day-insight__icon" aria-hidden="true">●</span>
          <div>
            <strong>At Ueno Museum</strong>
            <span>Next: Walk to Ueno Park in 1h 45m</span>
          </div>
          <button
            type="button"
            className="expand-button"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse day" : "Expand day"}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((value) => !value);
            }}
          >
            {expanded ? "⌃" : "⌄"}
          </button>
        </div>

        <div className="expanded-panel" aria-hidden={!expanded}>
          <div className="expanded-panel__grid">
            <div>
              <span className="expanded-panel__label">CURRENT ACTIVITY</span>
              <strong>Ueno Museum</strong>
              <p>14:00–16:00 · Art and history</p>
            </div>
            <div>
              <span className="expanded-panel__label">UP NEXT</span>
              <strong>Walk to Ueno Park</strong>
              <p>16:00–16:15 · 15 minutes</p>
            </div>
          </div>
          <div className="day-totals" aria-label="Day totals">
            <span><strong>3h 10m</strong> travel</span>
            <span><strong>7h 45m</strong> activities</span>
            <span><strong>2h 10m</strong> free</span>
          </div>
          <p className="expanded-panel__note">Busy day · several short movements, but a useful free-time pocket before dinner.</p>
        </div>
      </section>
    </main>
  );
}
