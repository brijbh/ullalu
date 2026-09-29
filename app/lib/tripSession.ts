import type { DayCardSegment, DayCardSegmentKind } from "../components/DayCard";

export type TripDraft = {
  name: string;
  startDate: string;
  endDate: string;
  startingPlace: string;
  endingPlace: string;
  returnToStart: boolean;
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
  calculatedFreeTime: PlannerSegment[];
  note?: string;
};

export const DEFAULT_DRAFT: TripDraft = {
  name: "",
  startDate: "",
  endDate: "",
  startingPlace: "",
  endingPlace: "",
  returnToStart: false,
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function toDateInputValue(value: string) {
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
  if (hours > 24 || (hours === 24 && minutes !== 0) || minutes > 59) return null;
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

export type TripReference = { id: string; kind: "photo" | "link" | "file"; title: string; uri: string; note?: string };
export type TripReservation = { id: string; title: string; confirmation?: string; itemId?: string; day?: number; note?: string; references: TripReference[] };
export type TripAlert = { id: string; level: "info" | "warning" | "urgent"; message: string; day?: number; itemId?: string; dismissed?: boolean };
export type TripNote = { id: string; text: string; day?: number; itemId?: string };
export type SavedTrip = {
  format: "ullalu.trip";
  version: 1;
  id: string;
  createdAt: string;
  updatedAt: string;
  metadata: TripDraft;
  days: PlannerDay[];
  notes: TripNote[];
  reservations: TripReservation[];
  references: TripReference[];
  alerts: TripAlert[];
};
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
    calculatedFreeTime: [],
  }));
}

export function randomSuffix() {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createTripDocument(draft: TripDraft): SavedTrip {
  const days = createTripDays(draft);
  const slug = draft.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "trip";
  const now = new Date().toISOString();
  return {
    format: "ullalu.trip", version: 1, id: `${slug}-${randomSuffix()}`,
    createdAt: now, updatedAt: now, metadata: draft, days,
    notes: [], reservations: [], references: [], alerts: [],
  };
}

export function calculatedFreeTime(day: PlannerDay) {
  return withCalculatedFreeTime(day.segments).filter((item) => item.kind === "free");
}

export function tripDayPath(id: string, day: number) {
  return `/trip/${encodeURIComponent(id)}/day/${day}`;
}
