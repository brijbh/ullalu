import { NextResponse } from "next/server";
import { failed, googleJson, mapsKey, mapsUnavailable, validPlaceId } from "../../../../lib/mapsServer";

export async function GET(_request: Request, { params }: { params: Promise<{ placeId: string }> }) {
  if (!mapsKey()) return mapsUnavailable();
  const { placeId } = await params;
  if (!validPlaceId(placeId)) return NextResponse.json({ error: "Invalid place ID." }, { status: 400 });
  try {
    const data = await googleJson(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      fieldMask: "id,displayName,formattedAddress,regularOpeningHours.weekdayDescriptions,googleMapsUri,location",
    });
    return NextResponse.json({ place: { provider: "google", id: data.id, name: data.displayName?.text ?? data.formattedAddress,
      address: data.formattedAddress }, hours: data.regularOpeningHours?.weekdayDescriptions ?? [], mapUrl: data.googleMapsUri,
      location: data.location });
  } catch (error) { return failed(error); }
}
