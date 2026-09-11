"use client";

import { useEffect, useRef, useState } from "react";

type SegmentKind = "travel" | "activity" | "free" | "reservation" | "rest" | "buffer";

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

type TimelineItem = {
  time: string;
  suffix?: string;
  kind: SegmentKind;
  icon: string;
  title: string;
  meta: string;
  chip?: string;
};

const overviewSegments = [
  { kind: "travel", weight: 1.5 },
  { kind: "buffer", weight: 1.92 },
  { kind: "travel", weight: 6.17 },
  { kind: "buffer", weight: 2.25 },
  { kind: "travel", weight: 6.33 },
  { kind: "travel", weight: 1.17 },
  { kind: "activity", weight: 0.25 },
  { kind: "free", weight: 1 },
  { kind: "rest", weight: 3.41 },
] as const;

const focusSegments: FocusSegment[] = [
  {
    kind: "travel",
    icon: "🚗",
    title: "To BLR Airport",
    duration: "45m",
    start: "06:00",
    end: "06:45",
    detail: "Home → BLR",
    width: 138,
  },
  {
    kind: "buffer",
    icon: "🧳",
    title: "Check-in",
    duration: "1h 55m",
    start: "07:30",
    end: "09:25",
    detail: "Security · Terminal 2",
    width: 142,
  },
  {
    kind: "travel",
    icon: "✈",
    title: "SQ 35",
    duration: "6h 10m",
    start: "09:25",
    end: "15:35",
    detail: "BLR → SIN",
    width: 184,
    current: true,
  },
  {
    kind: "buffer",
    icon: "🛬",
    title: "Layover",
    duration: "2h 15m",
    start: "15:35",
    end: "17:50",
    detail: "Changi Airport",
    width: 142,
  },
  {
    kind: "travel",
    icon: "✈",
    title: "SQ 12",
    duration: "6h 20m",
    start: "17:50",
    end: "14:10 +1",
    detail: "SIN → NRT",
    width: 184,
  },
  {
    kind: "travel",
    icon: "🚆",
    title: "To hotel",
    duration: "1h 10m",
    start: "14:10",
    end: "15:20",
    detail: "NRT → Shinjuku",
    width: 146,
  },
  {
    kind: "activity",
    icon: "🏨",
    title: "Check-in",
    duration: "15m",
    start: "15:20",
    end: "15:35",
    detail: "Hotel Gracery",
    width: 132,
  },
  {
    kind: "free",
    icon: "◷",
    title: "Free time",
    duration: "~1h",
    start: "15:35",
    end: "16:35",
    detail: "Explore nearby",
    width: 132,
  },
];

const timelineItems: TimelineItem[] = [
  {
    time: "06:00",
    kind: "travel",
    icon: "🚗",
    title: "Travel to BLR Airport",
    meta: "Car · 45 min · 32 km",
    chip: "Home → BLR",
  },
  {
    time: "07:30",
    kind: "buffer",
    icon: "🧳",
    title: "Check-in & Security",
    meta: "1h 55m · Kempegowda Int. Airport (BLR)",
  },
  {
    time: "09:25",
    kind: "travel",
    icon: "✈",
    title: "SQ 35   BLR → SIN",
    meta: "6h 10m · Singapore Airlines",
    chip: "Terminal 2",
  },
  {
    time: "15:35",
    kind: "buffer",
    icon: "🛬",
    title: "Layover in Singapore",
    meta: "2h 15m · Changi Airport (SIN)",
  },
  {
    time: "17:50",
    kind: "travel",
    icon: "✈",
    title: "SQ 12   SIN → NRT",
    meta: "6h 20m · Singapore Airlines",
    chip: "Terminal 3",
  },
  {
    time: "14:10",
    suffix: "+1d",
    kind: "travel",
    icon: "🚆",
    title: "Travel to hotel",
    meta: "1h 10m · Train (Narita Express)",
    chip: "NRT → Hotel",
  },
  {
    time: "15:20",
    kind: "activity",
    icon: "🏨",
    title: "Check-in",
    meta: "Hotel Gracery Shinjuku · Shinjuku, Tokyo",
  },
  {
    time: "",
    kind: "free",
    icon: "◷",
    title: "Evening free time",
    meta: "~ 1 hour · Explore nearby / early dinner",
  },
];

export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const currentRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, []);

  const scrollStrip = (direction: -1 | 1) => {
    stripRef.current?.scrollBy({ left: direction * 170, behavior: "smooth" });
  };

  return (
    <main className="page-shell">
      <section
        className={`calendar-card${expanded ? " calendar-card--expanded" : ""}`}
        aria-label="Ullalu travel day itinerary"
        onClick={() => setExpanded(true)}
      >
        <header className="calendar-card__header">
          <div>
            <p className="day-kicker">TUE · 10 SEP</p>
            <h1>Bengaluru → Tokyo</h1>
            <p className="day-subtitle">Flight to Tokyo, arrive and rest</p>
          </div>
          <div className="free-pill" aria-label="1 hour free">
            <span aria-hidden="true">☀</span>
            <strong>1h free</strong>
          </div>
        </header>

        <section className="overview" aria-label="Full-day overview">
          <div className="overview__now" aria-hidden="true">
            <strong>Now</strong>
            <span>12:10</span>
          </div>
          <div className="overview__track">
            {overviewSegments.map((segment, index) => (
              <span
                key={`${segment.kind}-${index}`}
                className={`overview__segment overview__segment--${segment.kind}`}
                style={{ flexGrow: segment.weight }}
              />
            ))}
            <span className="overview__marker" aria-label="Current time 12:10" />
          </div>
          <div className="overview__hours" aria-hidden="true">
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </section>

        {!expanded ? (
          <>
            <section
              ref={stripRef}
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
                      <div className="activity-progress" aria-label="Current segment progress">
                        <span className="activity-progress__line"><span /></span>
                        <small>You are here · 12:10</small>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <div className="scroll-controls" onClick={(event) => event.stopPropagation()}>
              <button type="button" aria-label="Scroll itinerary left" onClick={() => scrollStrip(-1)}>‹</button>
              <span>Swipe or scroll through the day</span>
              <button type="button" aria-label="Scroll itinerary right" onClick={() => scrollStrip(1)}>›</button>
            </div>

            <button className="day-insight" type="button" onClick={() => setExpanded(true)}>
              <span className="day-insight__icon" aria-hidden="true">✈</span>
              <div>
                <strong>On SQ 35 · BLR → SIN</strong>
                <span>Next: 2h 15m layover at Changi</span>
              </div>
              <span className="expand-button" aria-hidden="true">⌄</span>
            </button>
          </>
        ) : (
          <section className="expanded-view" onClick={(event) => event.stopPropagation()}>
            <div className="expanded-summary">
              <div className="expanded-summary__bar" aria-label="Day summary">
                <span className="summary-block summary-block--travel" style={{ flex: 17.25 }}>✈ <strong>17h 15m</strong></span>
                <span className="summary-block summary-block--buffer" style={{ flex: 2.25 }} aria-label="Layover and buffer" />
                <span className="summary-block summary-block--rest" style={{ flex: 5 }}>🛏 <strong>Rest</strong></span>
              </div>
              <div className="expanded-summary__labels">
                <span>09:25</span>
                <span>14:10 (+1d)</span>
                <strong>1h free</strong>
              </div>
            </div>

            <div className="expanded-layout">
              <div className="timeline" aria-label="Detailed itinerary timeline">
                {timelineItems.map((item, index) => (
                  <article className="timeline-row" key={`${item.title}-${index}`}>
                    <div className="timeline-row__time">
                      <strong>{item.time || " "}</strong>
                      {item.suffix ? <span>{item.suffix}</span> : null}
                    </div>
                    <div className={`timeline-row__node timeline-row__node--${item.kind}`}>
                      <span>{item.icon}</span>
                    </div>
                    <div className="timeline-row__content">
                      <strong>{item.title}</strong>
                      <span>{item.meta}</span>
                    </div>
                    {item.chip ? <span className="timeline-row__chip">{item.chip}</span> : null}
                    <button type="button" className="timeline-row__more" aria-label={`More options for ${item.title}`}>•••</button>
                  </article>
                ))}
              </div>

              <aside className="detail-stack" aria-label="Travel day details">
                <section className="route-map-card">
                  <div className="route-map-card__map" aria-label="Route map from Bengaluru to Tokyo">
                    <span className="map-point map-point--blr">● <small>BLR</small></span>
                    <span className="map-route">✈</span>
                    <span className="map-point map-point--nrt">● <small>NRT</small></span>
                  </div>
                  <div className="route-stats">
                    <span><small>Total travel time</small><strong>17h 15m</strong></span>
                    <span><small>Distance</small><strong>~ 7,300 km</strong></span>
                  </div>
                </section>

                <section className="detail-card">
                  <div className="detail-card__title">✈ <strong>Flight details</strong></div>
                  <div className="detail-table">
                    <span>SQ 35</span><span>BLR → SIN</span><span>09:25–15:35</span>
                    <span>SQ 12</span><span>SIN → NRT</span><span>17:50–14:10 (+1d)</span>
                  </div>
                  <button type="button" className="text-link">View booking reference</button>
                </section>

                <section className="detail-card hotel-card">
                  <div className="detail-card__title">🏨 <strong>Hotel</strong></div>
                  <div className="hotel-card__content">
                    <div className="hotel-card__thumb" aria-hidden="true">🏙</div>
                    <div><strong>Hotel Gracery Shinjuku</strong><span>Shinjuku, Tokyo</span></div>
                  </div>
                  <button type="button" className="text-link">View details</button>
                </section>

                <section className="detail-card">
                  <div className="detail-card__title"><span>▤</span><strong>Notes</strong></div>
                  <p>Immigration can take time. Consider eSIM setup at the airport.</p>
                </section>
              </aside>
            </div>

            <button
              type="button"
              className="collapse-button"
              aria-label="Collapse day card"
              onClick={() => setExpanded(false)}
            >
              <span>Collapse day</span>
              <span aria-hidden="true">⌃</span>
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
