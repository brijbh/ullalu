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
  name: "",
  startDate: "",
  endDate: "",
  startingPlace: "",
  endingPlace: "",
  returnToStart: false,
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

const DRAFT_KEY = "ullalu:draft-trip";

export function getDraft(): TripDraft {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  try {
    const draft = { ...DEFAULT_DRAFT, ...JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "{}") } as TripDraft;
    return { ...draft, startDate: toDateInputValue(draft.startDate), endDate: toDateInputValue(draft.endDate) };
  } catch { return DEFAULT_DRAFT; }
}

export function saveDraft(draft: TripDraft) {
  if (typeof window !== "undefined") sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
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

export type SavedTrip = { id: string; draft: TripDraft; days: PlannerDay[] };
const TRIPS_KEY = "ullalu:trips";
const ACTIVE_TRIP_KEY = "ullalu:active-trip";
const DAY_MS = 86_400_000;

function dateMillis(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return NaN;
  const millis = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Date(millis).toISOString().slice(0, 10) === value ? millis : NaN;
}

export function tripDayCount(start: string, end: string) {
  const first = dateMillis(start);
  const last = dateMillis(end);
  return Number.isFinite(first) && Number.isFinite(last) && last >= first
    ? Math.floor((last - first) / DAY_MS) + 1 : 0;
}

export function dateForDay(start: string, day: number) {
  return new Date(dateMillis(start) + (day - 1) * DAY_MS).toISOString().slice(0, 10);
}

export function displayDayDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
    .format(new Date(dateMillis(date)));
}

export function createTripDays(draft: TripDraft): PlannerDay[] {
  const count = tripDayCount(draft.startDate, draft.endDate);
  if (!count) throw new Error("Choose valid start and end dates.");
  return Array.from({ length: count }, (_, index) => ({
    day: index + 1,
    date: displayDayDate(dateForDay(draft.startDate, index + 1)),
    route: "Not planned yet",
    subtitle: "",
    planned: false,
    segments: [],
  }));
}

export function getTrips(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const trips = JSON.parse(localStorage.getItem(TRIPS_KEY) || "[]") as SavedTrip[];
    return Array.isArray(trips) ? trips.filter((trip) => trip.id && trip.draft && Array.isArray(trip.days)) : [];
  } catch { return []; }
}

export function getTrip(id: string) {
  return getTrips().find((trip) => trip.id === id);
}

export function getActiveTrip() {
  if (typeof window === "undefined") return undefined;
  return getTrip(localStorage.getItem(ACTIVE_TRIP_KEY) || "") ?? getTrips().at(-1);
}

export function createTrip(draft: TripDraft): SavedTrip {
  const days = createTripDays(draft);
  const slug = draft.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "trip";
  const id = `${slug}-${crypto.randomUUID().slice(0, 8)}`;
  const trip = { id, draft, days };
  localStorage.setItem(TRIPS_KEY, JSON.stringify([...getTrips(), trip]));
  localStorage.setItem(ACTIVE_TRIP_KEY, id);
  return trip;
}

export function saveTrip(trip: SavedTrip) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(getTrips().map((item) => item.id === trip.id ? trip : item)));
  localStorage.setItem(ACTIVE_TRIP_KEY, trip.id);
}

export function tripDayPath(id: string, day: number) {
  return `/trip/${encodeURIComponent(id)}/day/${day}`;
}
