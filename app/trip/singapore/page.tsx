"use client";

import { useMemo, useState } from "react";
import styles from "../../JourneyFlow.module.css";
import DayCard, { type DayCardSegment, type DayNavigationItem } from "../../components/DayCard";
import { AppHeader, BottomNav, TripArt } from "../../components/JourneyUI";
import parity from "../../JourneyParity.module.css";

type UpcomingDay = {
  label: string;
  route: string;
  subtitle: string;
  freeTime: string;
  segments: DayCardSegment[];
};

const days: UpcomingDay[] = [
  {
    label: "THU · 12 NOV",
    route: "Arrival → Tiong Bahru",
    subtitle: "Check-in, settle down and easy evening",
    freeTime: "2h",
    segments: [
      { kind: "travel", icon: "✈", title: "Arrive SIN", duration: "45m", start: "14:00", end: "14:45", detail: "Immigration · bags", weight: .75, width: 142 },
      { kind: "travel", icon: "🚕", title: "To hotel", duration: "30m", start: "15:00", end: "15:30", detail: "Airport → Tiong Bahru", weight: .5, width: 132 },
      { kind: "rest", icon: "🏨", title: "Hotel", duration: "1h", start: "15:30", end: "16:30", detail: "Check-in · rest", weight: 1, width: 140 },
      { kind: "free", icon: "◷", title: "Free time", duration: "2h", start: "16:30", end: "18:30", detail: "Neighbourhood walk", weight: 2, width: 150 },
      { kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "19:00", end: "20:30", detail: "Tiong Bahru", weight: 1.5, width: 145 },
    ],
  },
  {
    label: "FRI · 13 NOV",
    route: "Marina Bay → Chinatown",
    subtitle: "Gardens, open time and dinner",
    freeTime: "2h",
    segments: [
      { kind: "activity", icon: "☕", title: "Breakfast", duration: "1h", start: "08:00", end: "09:00", detail: "Tiong Bahru", weight: 1, width: 132 },
      { kind: "travel", icon: "🚇", title: "To Gardens", duration: "30m", start: "09:00", end: "09:30", detail: "MRT", weight: .5, width: 132 },
      { kind: "activity", icon: "🌿", title: "Gardens by the Bay", duration: "2h", start: "09:30", end: "11:30", detail: "Cloud Forest · Supertree", weight: 2, width: 170 },
      { kind: "free", icon: "◷", title: "Free time", duration: "2h", start: "11:30", end: "13:30", detail: "Lunch · Marina Bay", weight: 2, width: 150 },
      { kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "18:30", end: "20:00", detail: "Reservation", weight: 1.5, width: 148 },
      { kind: "rest", icon: "🌙", title: "Evening", duration: "2h", start: "20:00", end: "22:00", detail: "Hotel · rest", weight: 2, width: 150 },
    ],
  },
  {
    label: "SAT · 14 NOV",
    route: "Little India → Kampong Glam",
    subtitle: "Markets, food and flexible afternoon",
    freeTime: "2h 30m",
    segments: [
      { kind: "travel", icon: "🚇", title: "To Little India", duration: "25m", start: "09:00", end: "09:25", detail: "MRT", weight: .4, width: 132 },
      { kind: "activity", icon: "📍", title: "Little India", duration: "2h", start: "09:30", end: "11:30", detail: "Market · streets", weight: 2, width: 160 },
      { kind: "free", icon: "◷", title: "Free time", duration: "2h 30m", start: "11:30", end: "14:00", detail: "Lunch · wander", weight: 2.5, width: 160 },
      { kind: "activity", icon: "🕌", title: "Kampong Glam", duration: "2h", start: "15:00", end: "17:00", detail: "Arab Street", weight: 2, width: 160 },
      { kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "18:30", end: "20:00", detail: "Reservation", weight: 1.5, width: 145 },
    ],
  },
];

export default function SingaporeTripPage() {
  const [dayIndex, setDayIndex] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(2);
  const activeDay = days[dayIndex];

  const nav: DayNavigationItem[] = [
    {
      label: "PREVIOUS",
      date: dayIndex > 0 ? days[dayIndex - 1].label.split(" · ")[1] : "—",
      disabled: dayIndex === 0,
      onClick: () => { setDayIndex((value) => Math.max(0, value - 1)); setSelectedIndex(undefined); },
    },
    {
      label: `DAY ${dayIndex + 1}`,
      date: activeDay.label.split(" · ")[1],
      active: true,
      onClick: () => setSelectedIndex(undefined),
    },
    {
      label: "NEXT",
      date: dayIndex < days.length - 1 ? days[dayIndex + 1].label.split(" · ")[1] : "—",
      disabled: dayIndex === days.length - 1,
      onClick: () => { setDayIndex((value) => Math.min(days.length - 1, value + 1)); setSelectedIndex(undefined); },
    },
  ];

  const agendaSelected = useMemo(() => selectedIndex, [selectedIndex]);

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref="/trips" menu />

          <div className={`${styles.tripHead} ${parity.tripHeadIllustrated}`}>
            <div>
              <h1>Singapore</h1>
              <p>12 Nov – 16 Nov 2026</p>
              <p>4 nights · upcoming</p>
            </div>
            <TripArt kind="singapore" className={parity.tripHeadArt} />
          </div>

          <div className={styles.composerCardWrap}>
            <DayCard
              mode="upcoming"
              dayLabel={activeDay.label}
              route={activeDay.route}
              subtitle={activeDay.subtitle}
              freeTime={activeDay.freeTime}
              segments={activeDay.segments}
              selectedIndex={selectedIndex}
              onSelectSegment={setSelectedIndex}
              dayNavigation={nav}
              note="Book any timed-entry attractions before the trip."
            />
          </div>

          <div className={styles.composerSectionHead}>
            <p className={styles.sectionLabel}>ACTIVITIES FOR THE DAY</p>
          </div>
          <div className={styles.liveAgenda}>
            {activeDay.segments.map((segment, index) => (
              <button
                type="button"
                key={`${segment.title}-${index}`}
                className={`${styles.liveAgendaRow} ${agendaSelected === index ? styles.agendaSelected : ""}`}
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
            ))}
          </div>
        </div>
        <BottomNav active="trips" />
      </section>
    </main>
  );
}
