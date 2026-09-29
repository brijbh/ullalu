import { NextResponse } from "next/server";
import { failed, googleJson, mapsKey, mapsUnavailable, validPlaceId } from "../../../lib/mapsServer";
import type { RouteMode } from "../../../lib/tripSession";

const modes: RouteMode[] = ["DRIVE", "WALK", "BICYCLE", "TRANSIT", "TWO_WHEELER"];

export async function POST(request: Request) {
  if (!mapsKey()) return mapsUnavailable();
  let body: { origin?: string; destination?: string; mode?: RouteMode };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid route request." }, { status: 400 }); }
  if (!validPlaceId(body.origin) || !validPlaceId(body.destination) || !modes.includes(body.mode as RouteMode))
    return NextResponse.json({ error: "Choose two places and a transport mode." }, { status: 400 });
  try {
    const data = await googleJson("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      fieldMask: "routes.distanceMeters,routes.duration,routes.routeLabels",
      body: JSON.stringify({ origin: { placeId: body.origin }, destination: { placeId: body.destination },
        travelMode: body.mode, computeAlternativeRoutes: body.mode === "DRIVE" || body.mode === "TWO_WHEELER" }),
    });
    return NextResponse.json({ alternatives: (data.routes ?? []).map((route: {
      distanceMeters?: number; duration?: string; routeLabels?: string[];
    }, index: number) => ({ distanceMeters: route.distanceMeters ?? 0,
      durationSeconds: Math.round(Number.parseFloat(route.duration ?? "0")),
      label: index === 0 ? "Recommended" : `Alternative ${index}` })) });
  } catch (error) { return failed(error); }
}
