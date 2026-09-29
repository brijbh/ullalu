import { test } from "node:test";
import assert from "node:assert/strict";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";
import { getActiveTrip, getDraft, getTrip, getTrips, importTrip, parseTripDocument, saveTrip } from "../app/lib/tripStore";
import { freeTimeLabel, type TripDraft } from "../app/lib/tripSession";

class MemoryStorage {
  private entries = new Map<string, string>();
  getItem(key: string) { return this.entries.get(key) ?? null; }
  setItem(key: string, value: string) { this.entries.set(key, value); }
  removeItem(key: string) { this.entries.delete(key); }
}

test("legacy itinerary migrates once and remains a complete local document", async () => {
  Object.assign(globalThis, { indexedDB, IDBKeyRange });
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  Object.assign(globalThis, { localStorage, sessionStorage });
  const draft: TripDraft = {
    name: "Japan", startDate: "2026-10-03", endDate: "2026-10-04",
    startingPlace: "Tokyo", endingPlace: "Kyoto", returnToStart: false,
  };
  localStorage.setItem("ullalu:trips", JSON.stringify([{ id: "japan-old", draft, days: [
    { day: 1, date: "Sat 3 Oct", route: "Hotel", subtitle: "", planned: true, note: "Check in early", segments: [
      { id: "booking", kind: "reservation", title: "Hotel", start: "22:00", end: "05:00 +1", detail: "Booking", duration: "7h", icon: "▣", weight: 7, width: 180 },
    ] },
    { day: 2, date: "Sun 4 Oct", route: "Not planned yet", subtitle: "", planned: false, segments: [] },
  ] }]));
  localStorage.setItem("ullalu:active-trip", "japan-old");
  sessionStorage.setItem("ullalu:draft-trip", JSON.stringify(draft));

  const migrated = await getActiveTrip();
  assert.equal(migrated?.id, "japan-old");
  assert.equal(migrated?.format, "ullalu.trip");
  assert.equal(migrated?.version, 1);
  assert.equal(migrated?.days[0].segments.length, 1);
  assert.ok(migrated?.days[0].calculatedFreeTime.length);
  assert.equal(freeTimeLabel(migrated!.days[0].segments), "16h");
  assert.equal(migrated?.notes[0].text, "Check in early");
  assert.equal(migrated?.reservations[0].itemId, "booking");
  assert.equal((await getDraft()).name, "Japan");
  assert.equal(localStorage.getItem("ullalu:trips"), null);
  assert.equal(sessionStorage.getItem("ullalu:draft-trip"), null);

  const edited = await saveTrip({ ...migrated!, days: migrated!.days.map((day, index) => index === 1 ? { ...day, note: "Morning walk" } : day) });
  assert.equal((await getTrip(edited.id))?.days[1].note, "Morning walk");
  assert.equal((await getTrips()).length, 1);
  assert.equal(parseTripDocument(JSON.parse(JSON.stringify(edited))).notes[1].text, "Morning walk");
  assert.throws(() => parseTripDocument({ ...edited, version: 99 }), /supported/);
  const restored = await importTrip(new File([JSON.stringify(edited)], "japan.ullalu", { type: "application/json" }));
  assert.notEqual(restored.id, edited.id);
  assert.equal(restored.days[0].segments[0].title, "Hotel");
  assert.equal((await getTrips()).length, 2);
  assert.equal((await getTrip(edited.id))?.id, edited.id);
});
