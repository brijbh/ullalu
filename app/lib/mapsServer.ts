import { NextResponse } from "next/server";

export function mapsKey() { return process.env.GOOGLE_MAPS_SERVER_KEY; }

export function mapsUnavailable() {
  return NextResponse.json({ error: "Place and route lookup is not configured yet. Add a Google Maps API key." }, { status: 503 });
}

export async function googleJson(url: string, init: RequestInit & { fieldMask?: string } = {}) {
  const { fieldMask, ...rest } = init;
  const response = await fetch(url, {
    ...rest,
    headers: { "X-Goog-Api-Key": mapsKey()!, ...(fieldMask ? { "X-Goog-FieldMask": fieldMask } : {}), ...rest.headers },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google Maps request failed (${response.status}).`);
  return response.json();
}

export function failed(error: unknown) {
  return NextResponse.json({ error: error instanceof Error ? error.message : "Map lookup failed." }, { status: 502 });
}

export function validPlaceId(id: unknown): id is string {
  return typeof id === "string" && /^[a-zA-Z0-9_-]{8,256}$/.test(id);
}
