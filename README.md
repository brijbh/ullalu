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

## Current prototype

The home page currently renders one dummy Day Card with:

- flight segment
- transfer segment
- free-time segment
- rest segment
- minimum segment width
- duration-based proportional growth
- travel-line visualization
- day insight summary

This is intentionally a visual prototype before Maps, persistence, authentication, AI, or production itinerary editing are added.
