"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../JourneyFlow.module.css";
import DayCard, { findCurrentSegment, type DayNavigationItem } from "../components/DayCard";
import { AppHeader, BottomNav } from "../components/JourneyUI";
import { dateForDay, freeTimeLabel, withCalculatedFreeTime, type SavedTrip } from "../lib/tripSession";
import { getTrip, getActiveTrip } from "../lib/tripStore";

function localISO() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function TodayPage() {
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [today, setToday] = useState("");
  const [nowMinutes, setNowMinutes] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [anchorIndex, setAnchorIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    let mounted = true;
    const requestedId = new URLSearchParams(window.location.search).get("trip");
    (requestedId ? getTrip(requestedId) : getActiveTrip()).then((loaded) => {
      if (!mounted) return;
      setTrip(loaded ?? null);
      const current = localISO();
      setToday(current);
      setNowMinutes(new Date().getHours() * 60 + new Date().getMinutes());
      if (loaded) {
        const index = loaded.days.findIndex((_, position) => dateForDay(loaded.metadata.startDate, position + 1) === current);
        const anchor = index >= 0 ? index : current < loaded.metadata.startDate ? 0 : loaded.days.length - 1;
        setAnchorIndex(anchor);
        setDayIndex(anchor);
      }
    });
    const timer = window.setInterval(() => {
      const now = new Date();
      setToday(localISO());
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    }, 30_000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, []);

  const day = trip?.days[dayIndex];
  const displayed = useMemo(() => day ? withCalculatedFreeTime(day.segments) : [], [day]);
  const isToday = !!trip && dateForDay(trip.metadata.startDate, dayIndex + 1) === today;
  const currentIndex = isToday ? findCurrentSegment(displayed, nowMinutes) : -1;
  const tripIsLive = !!trip && today >= trip.metadata.startDate && today <= trip.metadata.endDate;
  const liveNav: DayNavigationItem[] = [
    { label: "YESTERDAY", date: trip?.days[anchorIndex - 1]?.date ?? "—", active: dayIndex === anchorIndex - 1, disabled: anchorIndex === 0, onClick: () => selectDay(anchorIndex - 1) },
    { label: "NOW", date: trip?.days[anchorIndex]?.date ?? "—", active: dayIndex === anchorIndex, onClick: () => selectDay(anchorIndex) },
    { label: "TOMORROW", date: trip?.days[anchorIndex + 1]?.date ?? "—", active: dayIndex === anchorIndex + 1, disabled: anchorIndex >= (trip?.days.length ?? 0) - 1, onClick: () => selectDay(anchorIndex + 1) },
  ];
  const nav: DayNavigationItem[] = tripIsLive ? liveNav : [
    { label: "PREVIOUS", date: trip?.days[dayIndex - 1]?.date ?? "—", disabled: dayIndex === 0, onClick: () => selectDay(dayIndex - 1) },
    { label: `DAY ${day?.day ?? 1}`, date: day?.date ?? "—", active: true },
    { label: "NEXT", date: trip?.days[dayIndex + 1]?.date ?? "—", disabled: dayIndex >= (trip?.days.length ?? 0) - 1, onClick: () => selectDay(dayIndex + 1) },
  ];

  function selectDay(index: number) {
    if (!trip || index < 0 || index >= trip.days.length) return;
    setDayIndex(index);
    setSelectedIndex(undefined);
  }

  if (!trip || !day) return <main className={styles.screen}><div className={styles.emptyState}>No trip to show yet. <Link href="/new-trip">Plan a trip</Link></div></main>;

  return (
    <main className={styles.screen}>
      <section className={styles.phonePage}>
        <div className={styles.content}>
          <AppHeader backHref={`/trip/${trip.id}`} note={trip.metadata.endingPlace} />
          <div className={styles.liveDayHeader}>
            <div><h1>{trip.metadata.name}</h1><p>Day {day.day} · {day.date}{isToday ? " · Today" : ""}</p></div>
          </div>
          <div className={styles.composerCardWrap}>
            <DayCard
              key={`${trip.id}-${day.day}`}
              mode={tripIsLive ? "live" : today < trip.metadata.startDate ? "upcoming" : "planning"}
              dayLabel={day.date.toUpperCase()}
              route={day.route}
              subtitle={day.subtitle || "Your day is ready to shape."}
              freeTime={freeTimeLabel(day.segments)}
              segments={displayed}
              selectedIndex={selectedIndex}
              onSelectSegment={setSelectedIndex}
              dayNavigation={nav}
              liveNow={isToday}
              note={day.note}
            />
          </div>
          <div className={styles.dayActionRow}>
            <Link className={styles.dayActionButton} href={`/trip/${trip.id}/day/${day.day}`}><span aria-hidden="true">＋</span><strong>Add or edit items</strong></Link>
          </div>
          <div className={styles.composerSectionHead}><p className={styles.sectionLabel}>ACTIVITIES FOR THE DAY</p></div>
          <div className={styles.liveAgenda}>
            {displayed.map((segment, index) => (
              <button type="button" key={`${segment.start}-${segment.title}-${index}`}
                className={`${styles.liveAgendaRow} ${(selectedIndex ?? currentIndex) === index ? styles.agendaSelected : ""} ${isToday && currentIndex === index ? styles.liveAgendaCurrent : ""}`}
                onClick={() => setSelectedIndex(index)}>
                <span className={styles.liveAgendaTime}>{segment.start}</span>
                <span className={styles.liveAgendaIcon} aria-hidden="true">{segment.icon}</span>
                <span className={styles.liveAgendaCopy}><strong>{segment.title}</strong><span>{segment.detail}</span></span>
                <span className={styles.liveAgendaDuration}>{segment.duration}</span>
              </button>
            ))}
            {!displayed.length ? <div className={styles.emptyState}>Nothing planned yet. <Link href={`/trip/${trip.id}/day/${day.day}`}>Plan this day</Link></div> : null}
          </div>
        </div>
        <BottomNav active="home" />
      </section>
    </main>
  );
}
