# Ullalu

Ullalu is a visual time planner for travel. The first prototype validates the core **Day Strip** geometry: duration-weighted segments, minimum readable widths, semantic colors, persistent time information, and a travel-line treatment for movement.

## Run locally

From `C:\dev\ullalu`:

```powershell
git pull
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

To open Ullalu on another device connected to the same home network, find the
computer's IPv4 address with `ipconfig` and open
`http://<that-IPv4-address>:3000` on the other device. Keep the development
server running. If the connection times out, allow Node.js through Windows
Defender Firewall on private networks and confirm that both devices are on
the same network (not a guest network).

## Local trip documents

A trip is a versioned `ullalu.trip` JSON document (`app/lib/tripSession.ts`). It contains metadata, days with authored itinerary items and calculated free time, notes, reservations, photo/link/file references, and alerts. Free time is derived on every write; it is not an editable itinerary item. Day notes and reservation items are synchronized into the document collections. Reference records contain URIs, not embedded photo bytes.

Documents and the creation draft live in IndexedDB (`app/lib/tripStore.ts`). Existing `ullalu:trips` localStorage data and the current session draft migrate on first open; old keys are removed only after a successful write. Each document can be downloaded as `.ullalu` from its trip overview or from **More** for the active trip. **More → Import trip** loads a backup, assigns a new ID if it would collide, and opens it.

The production build registers a service worker that caches the app shell and visited routes. Saving a trip also warms its overview and day routes in the background. Open the app once online and allow its routes to cache before travelling offline. Browser storage is specific to each browser profile and origin (including LAN address versus localhost); keep `.ullalu` backups for recovery or moving between devices. Weather and other remote data may be unavailable offline. Service workers require localhost or HTTPS, so use `npm run build && npm run start` on localhost to verify offline navigation; development mode does not register one.
