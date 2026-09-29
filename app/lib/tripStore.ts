import {
  DEFAULT_DRAFT, calculatedFreeTime, createTripDocument, createTripDays, toDateInputValue, randomSuffix,
  type PlannerDay, type SavedTrip, type TripDraft,
} from "./tripSession";

const DB_NAME = "ullalu";
const TRIPS = "trips";
const SETTINGS = "settings";
const LEGACY_TRIPS = "ullalu:trips";
const LEGACY_ACTIVE = "ullalu:active-trip";
const LEGACY_DRAFT = "ullalu:draft-trip";
let connection: Promise<IDBDatabase> | undefined;

function request<T>(operation: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    operation.onsuccess = () => resolve(operation.result);
    operation.onerror = () => reject(operation.error);
  });
}

function completed(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("Local storage transaction aborted."));
    transaction.onerror = () => reject(transaction.error ?? new Error("Local storage failed."));
  });
}

function normalizeDay(day: PlannerDay): PlannerDay {
  const segments = day.segments.filter((item) => item.kind !== "free");
  return { ...day, segments, calculatedFreeTime: calculatedFreeTime({ ...day, segments }) };
}

function normalizeTrip(trip: SavedTrip): SavedTrip {
  const days = trip.days.map(normalizeDay);
  const dayNotes = days.filter((day) => day.note?.trim()).map((day) => ({ id: `day-${day.day}`, day: day.day, text: day.note!.trim() }));
  const reservations = days.flatMap((day) => day.segments.filter((item) => item.kind === "reservation").map((item) => {
    const previous = trip.reservations.find((reservation) => reservation.itemId === item.id);
    return { id: previous?.id ?? `reservation-${item.id}`, title: item.title, itemId: item.id,
      day: day.day, confirmation: previous?.confirmation, note: previous?.note, references: previous?.references ?? [] };
  }));
  const { storage: _legacyStorage, ...metadata } = trip.metadata as TripDraft & { storage?: string };
  return { ...trip, metadata, days, notes: [...trip.notes.filter((note) => !note.day || note.itemId), ...dayNotes],
    reservations: [...trip.reservations.filter((item) => !item.itemId), ...reservations], updatedAt: new Date().toISOString() };
}

async function migrate(db: IDBDatabase) {
  // The old keys are retained until this transaction commits. Failed upgrades can retry.
  let oldTrips: Array<{ id: string; draft: TripDraft; days: PlannerDay[] }> = [];
  let active = "";
  let draft: TripDraft | undefined;
  try {
    const raw = localStorage.getItem(LEGACY_TRIPS);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) oldTrips = parsed.filter((item) => item && typeof item.id === "string" && item.draft && Array.isArray(item.days));
    }
    active = localStorage.getItem(LEGACY_ACTIVE) || "";
    const rawDraft = sessionStorage.getItem(LEGACY_DRAFT);
    if (rawDraft) draft = { ...DEFAULT_DRAFT, ...JSON.parse(rawDraft) };
  } catch { /* Corrupt legacy data stays untouched. */ }
  if (!oldTrips.length && !draft) return;
  const tx = db.transaction([TRIPS, SETTINGS], "readwrite");
  const tripStore = tx.objectStore(TRIPS);
  for (const old of oldTrips) {
    const document = createTripDocument({ ...old.draft, startDate: toDateInputValue(old.draft.startDate),
      endDate: toDateInputValue(old.draft.endDate) });
    tripStore.put(normalizeTrip({ ...document, id: old.id, days: old.days }));
  }
  if (active) tx.objectStore(SETTINGS).put(active, "activeTrip");
  if (draft) tx.objectStore(SETTINGS).put(draft, "draft");
  await completed(tx);
  localStorage.removeItem(LEGACY_TRIPS);
  localStorage.removeItem(LEGACY_ACTIVE);
  sessionStorage.removeItem(LEGACY_DRAFT);
}

function database(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB is unavailable in this browser."));
  if (!connection) {
    connection = new Promise<IDBDatabase>((resolve, reject) => {
      const opening = indexedDB.open(DB_NAME, 1);
      opening.onupgradeneeded = () => {
        const db = opening.result;
        db.createObjectStore(TRIPS, { keyPath: "id" });
        db.createObjectStore(SETTINGS);
      };
      opening.onsuccess = () => {
        const db = opening.result;
        db.onversionchange = () => db.close();
        migrate(db).then(() => resolve(db), reject);
      };
      opening.onerror = () => reject(opening.error);
    }).catch((error) => { connection = undefined; throw error; });
  }
  return connection;
}

async function read<T>(store: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await database();
  return request<T | undefined>(db.transaction(store, "readonly").objectStore(store).get(key));
}

async function write(store: string, value: unknown, key?: IDBValidKey) {
  const db = await database();
  const tx = db.transaction(store, "readwrite");
  if (key === undefined) tx.objectStore(store).put(value);
  else tx.objectStore(store).put(value, key);
  await completed(tx);
}

export async function getDraft(): Promise<TripDraft> {
  const draft = { ...DEFAULT_DRAFT, ...(await read<TripDraft>(SETTINGS, "draft")) };
  return { ...draft, startDate: toDateInputValue(draft.startDate), endDate: toDateInputValue(draft.endDate) };
}

export async function saveDraft(draft: TripDraft) { await write(SETTINGS, draft, "draft"); }

export async function getTrips(): Promise<SavedTrip[]> {
  const db = await database();
  const trips = await request<SavedTrip[]>(db.transaction(TRIPS, "readonly").objectStore(TRIPS).getAll());
  return trips.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getTrip(id: string): Promise<SavedTrip | undefined> { return read<SavedTrip>(TRIPS, id); }

export async function getActiveTrip(): Promise<SavedTrip | undefined> {
  const active = await read<string>(SETTINGS, "activeTrip");
  return (active ? await getTrip(active) : undefined) ?? (await getTrips()).at(-1);
}

export async function saveTrip(trip: SavedTrip): Promise<SavedTrip> {
  const db = await database();
  const saved = normalizeTrip(trip);
  const tx = db.transaction([TRIPS, SETTINGS], "readwrite");
  tx.objectStore(TRIPS).put(saved);
  tx.objectStore(SETTINGS).put(saved.id, "activeTrip");
  await completed(tx);
  void warmTripRoutes(saved);
  return saved;
}


async function warmTripRoutes(trip: SavedTrip) {
  if (typeof window === "undefined" || !navigator.onLine || !("caches" in window)) return;
  try {
    const cache = await caches.open("ullalu-shell-v1");
    const paths = [`/trip/${encodeURIComponent(trip.id)}`, ...trip.days.map((day) =>
      `/trip/${encodeURIComponent(trip.id)}/day/${day.day}`)];
    for (let index = 0; index < paths.length; index += 3) {
      await Promise.allSettled(paths.slice(index, index + 3).map(async (path) => {
        const response = await fetch(path, { headers: { Accept: "text/html" } });
        if (response.ok) await cache.put(path, response);
      }));
    }
  } catch { /* An offline navigation can still use routes already visited. */ }
}

export async function createTrip(draft: TripDraft): Promise<SavedTrip> {
  const trip = await saveTrip(createTripDocument(draft));
  const db = await database();
  const tx = db.transaction(SETTINGS, "readwrite");
  tx.objectStore(SETTINGS).delete("draft");
  await completed(tx);
  return trip;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseTripDocument(value: unknown): SavedTrip {
  if (!isRecord(value) || value.format !== "ullalu.trip" || value.version !== 1 ||
      typeof value.id !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$/.test(value.id) || !isRecord(value.metadata) ||
      typeof value.metadata.name !== "string" || typeof value.metadata.startDate !== "string" ||
      typeof value.metadata.endDate !== "string" || typeof value.createdAt !== "string" ||
      typeof value.updatedAt !== "string" || !Array.isArray(value.days) ||
      !Array.isArray(value.notes) || !Array.isArray(value.reservations) ||
      !Array.isArray(value.references) || !Array.isArray(value.alerts) ||
      !value.notes.every((note) => isRecord(note) && typeof note.id === "string" && typeof note.text === "string") ||
      !value.reservations.every((entry) => isRecord(entry) && typeof entry.id === "string" && typeof entry.title === "string" && Array.isArray(entry.references)) ||
      !value.references.every((entry) => isRecord(entry) && typeof entry.id === "string" && typeof entry.uri === "string") ||
      !value.alerts.every((alert) => isRecord(alert) && typeof alert.id === "string" && typeof alert.message === "string")) {
    throw new Error("This is not a supported Ullalu trip document.");
  }
  const days = createTripDays(value.metadata as TripDraft);
  if (value.days.length !== days.length || !value.days.every((day, index) =>
    isRecord(day) && day.day === index + 1 && Array.isArray(day.segments) && day.segments.every((item) =>
      isRecord(item) && typeof item.id === "string" && typeof item.title === "string" &&
      typeof item.start === "string" && typeof item.end === "string" &&
      ["activity", "travel", "reservation", "rest", "buffer"].includes(String(item.kind))))) {
    throw new Error("The trip days or itinerary items are invalid.");
  }
  return value as unknown as SavedTrip;
}

export function exportTrip(trip: SavedTrip) {
  const data = JSON.stringify(normalizeTrip(trip), null, 2);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
  link.download = `${trip.id}.ullalu`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 60_000);
}

export async function importTrip(file: File): Promise<SavedTrip> {
  if (file.size > 10 * 1024 * 1024) throw new Error("The trip file is larger than 10 MB.");
  const parsed: unknown = JSON.parse(await file.text());
  const trip = parseTripDocument(parsed);
  // A duplicate backup becomes a separate trip; the existing trip is never overwritten.
  const id = await getTrip(trip.id) ? `${trip.id}-${randomSuffix()}` : trip.id;
  return saveTrip({ ...trip, id });
}
