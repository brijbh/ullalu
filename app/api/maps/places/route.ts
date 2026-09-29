import { NextRequest, NextResponse } from "next/server";
import { failed, googleJson, mapsKey, mapsUnavailable } from "../../../lib/mapsServer";

export async function GET(request: NextRequest) {
  if (!mapsKey()) return mapsUnavailable();
  const input = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (input.length < 3 || input.length > 120) return NextResponse.json({ suggestions: [] });
  try {
    const data = await googleJson("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST", headers: { "Content-Type": "application/json" },
      fieldMask: "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text",
      body: JSON.stringify({ input }),
    });
    return NextResponse.json({ suggestions: (data.suggestions ?? []).flatMap((item: {
      placePrediction?: { placeId?: string; text?: { text?: string } };
    }) => item.placePrediction?.placeId && item.placePrediction.text?.text
      ? [{ id: item.placePrediction.placeId, name: item.placePrediction.text.text }] : []) });
  } catch (error) { return failed(error); }
}
