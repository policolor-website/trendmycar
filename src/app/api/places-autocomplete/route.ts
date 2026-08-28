import { NextRequest, NextResponse } from "next/server";
import { haversineKm } from "@/lib/tariffs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");
  // Optional radius filter: center lat/lng + radius in meters
  const centerLat = searchParams.get("lat");
  const centerLng = searchParams.get("lng");
  const radiusM = searchParams.get("radius"); // in meters (Google API expects meters)

  if (!input || input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  // Build Google Places Autocomplete URL
  let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&types=geocode&key=${apiKey}`;

  // If we have a center + radius, bias results to that area
  // Google's location bias: results within or near the circle are ranked higher
  if (centerLat && centerLng && radiusM) {
    url += `&location=${centerLat},${centerLng}&radius=${radiusM}&strictbounds`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json(
        { error: data.error_message || data.status },
        { status: 400 }
      );
    }

    let predictions = (data.predictions || []).map((p: any) => ({
      placeId: p.place_id,
      description: p.description,
      lat: p.geometry?.location?.lat,
      lng: p.geometry?.location?.lng,
    }));

    // If we have a center + radius, do a hard filter on actual distance
    // Google's strictbounds + location is a bias, not a hard filter for all results
    if (centerLat && centerLng && radiusM) {
      const centerLatNum = parseFloat(centerLat);
      const centerLngNum = parseFloat(centerLng);
      const radiusKm = parseFloat(radiusM) / 1000;
      predictions = predictions.filter((p: any) => {
        if (!p.lat || !p.lng) return true; // keep if we don't have coords (let API validate later)
        const dist = haversineKm(centerLatNum, centerLngNum, p.lat, p.lng);
        return dist <= radiusKm;
      });
    }

    return NextResponse.json({ predictions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
