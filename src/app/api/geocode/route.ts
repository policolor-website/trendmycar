import { NextRequest, NextResponse } from "next/server";
import { getPickupRadiusForDestination, MUNICH_CENTER } from "@/lib/tariffs";

// Geocode an address string → coordinates + pickup radius info
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address || address.length < 2) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      return NextResponse.json(
        { error: data.error_message || data.status || "No results" },
        { status: 400 }
      );
    }

    const result = data.results[0];
    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;

    // Calculate pickup radius based on destination distance from München
    const pickupInfo = getPickupRadiusForDestination(lat, lng);

    return NextResponse.json({
      address: result.formatted_address,
      lat,
      lng,
      distanceFromMunich: Math.round(pickupInfo.destDistanceFromMunich),
      pickupRadiusKm: pickupInfo.radiusKm,
      pickupRadiusM: pickupInfo.radiusKm * 1000,
      rule: pickupInfo.rule,
      munichCenter: MUNICH_CENTER,
    });
  } catch {
    return NextResponse.json({ error: "Failed to geocode" }, { status: 500 });
  }
}
