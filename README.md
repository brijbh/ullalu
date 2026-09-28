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
