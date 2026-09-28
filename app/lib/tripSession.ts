import type { DayCardSegment, DayCardSegmentKind } from "../components/DayCard";

export type TripDraft = {
  name: string;
  startDate: string;
  endDate: string;
  startingPlace: string;
  endingPlace: string;
  returnToStart: boolean;
  storage?: "drive" | "cloud" | "device";
};

export type PlannerSegment = DayCardSegment & {
  id: string;
};

export type PlannerDay = {
  day: number;
  date: string;
  route: string;
  subtitle: string;
  planned: boolean;
  segments: PlannerSegment[];
  note?: string;
};

export const DEFAULT_DRAFT: TripDraft = {
  name: "Japan 2026",
  startDate: "2026-09-29",
  endDate: "2026-10-12",
  startingPlace: "Bengaluru (BLR)",
  endingPlace: "Tokyo (NRT)",
  returnToStart: true,
  storage: "device",
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDateInputValue(value: string) {
  if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return "";
  const month = monthNames.findIndex((name) => name.toLowerCase() === match[2].toLowerCase());
  if (month < 0) return "";
  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

export function formatTripDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  const month = monthNames[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month} ${match[1]}` : value;
}

export const DEFAULT_DAY1_SEGMENTS: PlannerSegment[] = [
  { id: "blr-car", kind: "travel", icon: "🚗", title: "To BLR Airport", duration: "45m", start: "06:00", end: "06:45", detail: "Home → BLR", weight: .75, width: 138 },
  { id: "checkin", kind: "buffer", icon: "🧳", title: "Check-in", duration: "1h 55m", start: "07:30", end: "09:25", detail: "Security · Terminal 2", weight: 1.92, width: 142 },
  { id: "sq35", kind: "travel", icon: "✈", title: "SQ 35", duration: "6h 10m", start: "09:25", end: "15:35", detail: "BLR → SIN", weight: 6.17, width: 184 },
  { id: "sin-layover", kind: "buffer", icon: "🛬", title: "Layover", duration: "2h 15m", start: "15:35", end: "17:50", detail: "Changi Airport", weight: 2.25, width: 142 },
  { id: "sq12", kind: "travel", icon: "✈", title: "SQ 12", duration: "6h 20m", start: "17:50", end: "14:10 +1", detail: "SIN → NRT", weight: 6.33, width: 184 },
  { id: "nrt-train", kind: "travel", icon: "🚆", title: "To hotel", duration: "1h 10m", start: "14:10", end: "15:20", detail: "NRT → Shinjuku", weight: 1.17, width: 146 },
  { id: "hotel-checkin", kind: "activity", icon: "🏨", title: "Check-in", duration: "15m", start: "15:20", end: "15:35", detail: "Hotel Gracery", weight: .25, width: 132 },
  { id: "free-evening", kind: "free", icon: "◷", title: "Free time", duration: "~1h", start: "15:35", end: "16:35", detail: "Explore nearby", weight: 1, width: 132 },
];

export const DEFAULT_TRIP_DAYS: PlannerDay[] = [
  { day: 1, date: "Tue, 29 Sep", route: "BLR → Tokyo", subtitle: "Flight to Tokyo, arrive and rest", planned: true, note: "Immigration may take time.", segments: DEFAULT_DAY1_SEGMENTS },
  { day: 2, date: "Wed, 30 Sep", route: "Tokyo", subtitle: "Neighbourhoods and first full day", planned: true, segments: [
    { id: "d2-1", kind: "travel", icon: "🚆", title: "To Shibuya", duration: "25m", start: "09:00", end: "09:25", detail: "Metro", weight: .5 },
    { id: "d2-2", kind: "activity", icon: "📍", title: "Shibuya", duration: "2h", start: "09:30", end: "11:30", detail: "Crossing · shops", weight: 1.5 },
    { id: "d2-3", kind: "free", icon: "◷", title: "Free time", duration: "1h 30m", start: "11:30", end: "13:00", detail: "Lunch", weight: 1.1 },
    { id: "d2-4", kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "18:00", end: "19:30", detail: "Reservation", weight: .7 },
    { id: "d2-5", kind: "rest", icon: "🌙", title: "Rest", duration: "2h", start: "20:00", end: "22:00", detail: "Hotel", weight: 1.4 },
  ] },
  { day: 3, date: "Thu, 1 Oct", route: "Tokyo", subtitle: "Museums and open time", planned: true, segments: [
    { id: "d3-1", kind: "activity", icon: "🏛", title: "Museum", duration: "2h", start: "10:00", end: "12:00", detail: "Ueno", weight: 1.2 },
    { id: "d3-2", kind: "free", icon: "◷", title: "Free time", duration: "2h", start: "12:00", end: "14:00", detail: "Lunch · explore", weight: 1 },
    { id: "d3-3", kind: "activity", icon: "🌳", title: "Park", duration: "1h 30m", start: "14:30", end: "16:00", detail: "Ueno Park", weight: 1.1 },
    { id: "d3-4", kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h", start: "18:30", end: "19:30", detail: "Reserved", weight: .8 },
    { id: "d3-5", kind: "rest", icon: "🌙", title: "Rest", duration: "2h", start: "20:00", end: "22:00", detail: "Hotel", weight: 1.3 },
  ] },
  { day: 4, date: "Fri, 2 Oct", route: "Tokyo → Kyoto", subtitle: "Shinkansen and Kyoto arrival", planned: true, segments: [
    { id: "d4-1", kind: "travel", icon: "🚄", title: "Shinkansen", duration: "2h 15m", start: "09:00", end: "11:15", detail: "Tokyo → Kyoto", weight: 1.2 },
    { id: "d4-2", kind: "activity", icon: "⛩", title: "Fushimi Inari", duration: "2h", start: "14:00", end: "16:00", detail: "Kyoto", weight: 1.2 },
    { id: "d4-3", kind: "free", icon: "◷", title: "Free time", duration: "1h 30m", start: "16:00", end: "17:30", detail: "Explore", weight: 1 },
    { id: "d4-4", kind: "rest", icon: "🌙", title: "Rest", duration: "2h", start: "20:00", end: "22:00", detail: "Hotel", weight: 1.5 },
  ] },
  { day: 5, date: "Sat, 3 Oct", route: "Kyoto", subtitle: "Temples and evening reservation", planned: true, segments: [
    { id: "d5-1", kind: "free", icon: "◷", title: "Slow morning", duration: "1h", start: "08:00", end: "09:00", detail: "Breakfast", weight: 1 },
    { id: "d5-2", kind: "activity", icon: "⛩", title: "Kiyomizu-dera", duration: "2h", start: "10:00", end: "12:00", detail: "Temple", weight: 1.4 },
    { id: "d5-3", kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h 30m", start: "18:30", end: "20:00", detail: "Gion", weight: .8 },
    { id: "d5-4", kind: "rest", icon: "🌙", title: "Rest", duration: "2h", start: "20:30", end: "22:30", detail: "Hotel", weight: 1.4 },
  ] },
  { day: 6, date: "Sun, 4 Oct", route: "Kyoto", subtitle: "Arashiyama and flexible afternoon", planned: true, segments: [
    { id: "d6-1", kind: "activity", icon: "🎋", title: "Arashiyama", duration: "2h", start: "09:00", end: "11:00", detail: "Bamboo grove", weight: 1.2 },
    { id: "d6-2", kind: "free", icon: "◷", title: "Free time", duration: "2h", start: "11:00", end: "13:00", detail: "Lunch", weight: 1 },
    { id: "d6-3", kind: "activity", icon: "📍", title: "Kyoto walk", duration: "2h", start: "14:00", end: "16:00", detail: "Neighbourhoods", weight: 1.1 },
    { id: "d6-4", kind: "reservation", icon: "🍽", title: "Dinner", duration: "1h", start: "18:30", end: "19:30", detail: "Reserved", weight: .7 },
    { id: "d6-5", kind: "rest", icon: "🌙", title: "Rest", duration: "2h", start: "20:00", end: "22:00", detail: "Hotel", weight: 1.5 },
  ] },
  { day: 7, date: "Mon, 5 Oct", route: "Not planned yet", subtitle: "", planned: false, segments: [] },
];

const DRAFT_KEY = "ullalu:draft-trip";
const DAYS_KEY = "ullalu:trip-days";
const DAY1_KEY = "ullalu:japan-2026:day1";

export function getDraft(): TripDraft {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  const value = sessionStorage.getItem(DRAFT_KEY);
  if (!value) return DEFAULT_DRAFT;
  try {
    const draft = { ...DEFAULT_DRAFT, ...(JSON.parse(value) as Partial<TripDraft>) };
    return {
      ...draft,
      startDate: toDateInputValue(draft.startDate),
      endDate: toDateInputValue(draft.endDate),
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export function saveDraft(draft: TripDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getDay1Segments(): PlannerSegment[] {
  if (typeof window === "undefined") return DEFAULT_DAY1_SEGMENTS;
  const value = sessionStorage.getItem(DAY1_KEY);
  if (!value) return DEFAULT_DAY1_SEGMENTS;
  try {
    const parsed = JSON.parse(value) as PlannerSegment[];
    return Array.isArray(parsed) ? parsed : DEFAULT_DAY1_SEGMENTS;
  } catch {
    return DEFAULT_DAY1_SEGMENTS;
  }
}

export function saveDay1Segments(segments: PlannerSegment[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DAY1_KEY, JSON.stringify(segments));
  const days = getTripDays().map((day) => day.day === 1 ? { ...day, segments, planned: segments.length > 0 } : day);
  sessionStorage.setItem(DAYS_KEY, JSON.stringify(days));
}

export function getTripDays(): PlannerDay[] {
  if (typeof window === "undefined") return DEFAULT_TRIP_DAYS;
  const value = sessionStorage.getItem(DAYS_KEY);
  if (!value) {
    const day1 = getDay1Segments();
    return DEFAULT_TRIP_DAYS.map((day) => day.day === 1 ? { ...day, segments: day1 } : day);
  }
  try {
    const parsed = JSON.parse(value) as PlannerDay[];
    return Array.isArray(parsed) ? parsed : DEFAULT_TRIP_DAYS;
  } catch {
    return DEFAULT_TRIP_DAYS;
  }
}

export function saveTripDays(days: PlannerDay[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DAYS_KEY, JSON.stringify(days));
}

export function iconForKind(kind: DayCardSegmentKind) {
  if (kind === "travel") return "🚆";
  if (kind === "activity") return "📍";
  if (kind === "reservation") return "▣";
  if (kind === "rest") return "🏨";
  if (kind === "buffer") return "◷";
  return "◷";
}

export function parseClockMinutes(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function isNextDayTime(start: string, end: string) {
  const startMinutes = parseClockMinutes(start);
  const endMinutes = parseClockMinutes(end);
  if (startMinutes === null || endMinutes === null) return false;
  return end.includes("+1") || endMinutes < startMinutes;
}

export function normalizeEndTime(start: string, end: string) {
  const cleanEnd = end.replace(/\s*\+1\s*$/, "");
  return isNextDayTime(start, cleanEnd) ? `${cleanEnd} +1` : cleanEnd;
}

function intervalForSegment(segment: Pick<PlannerSegment, "start" | "end">) {
  const start = parseClockMinutes(segment.start);
  let end = parseClockMinutes(segment.end);
  if (start === null || end === null) return null;
  if (segment.end.includes("+1") || end < start) end += 24 * 60;
  return { start, end };
}

export function minutesBetween(start: string, end: string) {
  const interval = intervalForSegment({ start, end });
  if (!interval) return 0;
  return Math.max(0, interval.end - interval.start);
}

export function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function sortPlannerSegments(segments: PlannerSegment[]) {
  return [...segments].sort((a, b) => {
    const aStart = parseClockMinutes(a.start) ?? Number.MAX_SAFE_INTEGER;
    const bStart = parseClockMinutes(b.start) ?? Number.MAX_SAFE_INTEGER;
    if (aStart !== bStart) return aStart - bStart;
    return a.end.localeCompare(b.end);
  });
}

export function validatePlannerSegment(
  candidate: Pick<PlannerSegment, "id" | "start" | "end" | "title">,
  segments: PlannerSegment[],
) {
  const start = parseClockMinutes(candidate.start);
  const end = parseClockMinutes(candidate.end);

  if (start === null || end === null) {
    return "Enter a valid start and end time.";
  }

  if (end === start) {
    return "Start and end time cannot be the same.";
  }

  const candidateInterval = intervalForSegment({
    start: candidate.start,
    end: normalizeEndTime(candidate.start, candidate.end),
  });

  if (!candidateInterval) {
    return "Enter a valid start and end time.";
  }

  const conflict = segments
    .filter((segment) => segment.kind !== "free" && segment.id !== candidate.id)
    .find((segment) => {
      const other = intervalForSegment(segment);
      if (!other) return false;
      return candidateInterval.start < other.end && candidateInterval.end > other.start;
    });

  if (!conflict) return null;

  const conflictEnd = normalizeEndTime(conflict.start, conflict.end);
  const candidateEnd = normalizeEndTime(candidate.start, candidate.end);

  if (candidate.start === conflict.start && candidateEnd === conflictEnd) {
    return `That time slot is already used by “${conflict.title}”.`;
  }

  return `This overlaps “${conflict.title}” (${conflict.start}–${conflictEnd}). Adjust one of the times first.`;
}

function clockLabel(minutes: number) {
  const bounded = Math.max(0, Math.min(24 * 60, minutes));
  if (bounded === 24 * 60) return "24:00";
  const hours = Math.floor(bounded / 60);
  const mins = bounded % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function withCalculatedFreeTime(
  segments: PlannerSegment[],
  dayStartMinutes = 6 * 60,
  dayEndMinutes = 24 * 60,
) {
  const authored = sortPlannerSegments(segments.filter((segment) => segment.kind !== "free"));
  const generated: PlannerSegment[] = [];
  let cursor = dayStartMinutes;
  let freeIndex = 0;

  for (const segment of authored) {
    const interval = intervalForSegment(segment);
    if (!interval) continue;

    const visibleStart = Math.max(dayStartMinutes, interval.start);
    const visibleEnd = Math.min(dayEndMinutes, interval.end);

    if (visibleStart > cursor) {
      const freeMinutes = visibleStart - cursor;
      generated.push({
        id: `auto-free-${freeIndex++}-${cursor}-${visibleStart}`,
        kind: "free",
        icon: "◷",
        title: "Free time",
        duration: durationLabel(freeMinutes),
        start: clockLabel(cursor),
        end: clockLabel(visibleStart),
        detail: "Automatically calculated",
        weight: Math.max(.25, freeMinutes / 60),
        width: Math.max(132, Math.min(184, 122 + freeMinutes / 8)),
      });
    }

    cursor = Math.max(cursor, visibleEnd);
  }

  if (cursor < dayEndMinutes) {
    const freeMinutes = dayEndMinutes - cursor;
    generated.push({
      id: `auto-free-${freeIndex}-${cursor}-${dayEndMinutes}`,
      kind: "free",
      icon: "◷",
      title: "Free time",
      duration: durationLabel(freeMinutes),
      start: clockLabel(cursor),
      end: clockLabel(dayEndMinutes),
      detail: "Automatically calculated",
      weight: Math.max(.25, freeMinutes / 60),
      width: Math.max(132, Math.min(184, 122 + freeMinutes / 8)),
    });
  }

  return sortPlannerSegments([...authored, ...generated]);
}

export function freeTimeLabel(segments: PlannerSegment[]) {
  const freeMinutes = withCalculatedFreeTime(segments)
    .filter((segment) => segment.kind === "free")
    .reduce((total, segment) => total + minutesBetween(segment.start, segment.end), 0);
  return durationLabel(freeMinutes);
}

export function signatureFromSegments(segments: PlannerSegment[]) {
  return segments.map((segment) => ({ kind: segment.kind, flex: Math.max(.2, segment.weight ?? 1) }));
}
