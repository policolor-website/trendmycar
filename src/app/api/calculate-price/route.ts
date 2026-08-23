import { NextRequest, NextResponse } from "next/server";

// ============================================
// Vehicle tariffs (€ per km)
// ============================================
const VEHICLE_TARIFFS: Record<string, { perKm: number; base: number; name: string }> = {
  "S-Class": { perKm: 4.5, base: 15, name: "Mercedes S-Class" },
  "E-Class": { perKm: 3.0, base: 10, name: "Mercedes E-Class" },
  "V-Class": { perKm: 3.5, base: 12, name: "Mercedes V-Class" },
};

// Night surcharge (22:00 - 06:00) = +25%
const NIGHT_SURCHARGE = 0.25;
// Airport fee (if pickup or destination contains "airport")
const AIRPORT_FEE = 8;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, vehicle, time } = body;

    if (!origin || !destination || !vehicle) {
      return NextResponse.json(
        { error: "Missing required fields: origin, destination, vehicle" },
        { status: 400 }
      );
    }

    const tariff = VEHICLE_TARIFFS[vehicle];
    if (!tariff) {
      return NextResponse.json(
        { error: `Invalid vehicle type: ${vehicle}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    // Call Google Maps Directions API
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.routes?.length) {
      return NextResponse.json(
        { error: `Google Maps error: ${data.status} - ${data.error_message || "No route found"}` },
        { status: 400 }
      );
    }

    const leg = data.routes[0].legs[0];
    const distanceKm = leg.distance.value / 1000;
    const durationMin = leg.duration.value / 60;

    // Validate both points are in Germany
    const startInGermany = /germany|deutschland/i.test(leg.start_address);
    const endInGermany = /germany|deutschland/i.test(leg.end_address);
    if (!startInGermany || !endInGermany) {
      return NextResponse.json(
        { error: "outside_germany" },
        { status: 400 }
      );
    }

    // Calculate price
    let price = tariff.base + distanceKm * tariff.perKm;

    // Night surcharge
    let isNight = false;
    if (time) {
      const hour = parseInt(time.split(":")[0]);
      if (hour >= 22 || hour < 6) {
        price *= 1 + NIGHT_SURCHARGE;
        isNight = true;
      }
    }

    // Airport fee
    let isAirport = false;
    const lowerOrigin = origin.toLowerCase();
    const lowerDest = destination.toLowerCase();
    if (
      lowerOrigin.includes("airport") ||
      lowerDest.includes("airport") ||
      lowerOrigin.includes("flughafen") ||
      lowerDest.includes("flughafen") ||
      lowerOrigin.includes("muc") ||
      lowerDest.includes("muc")
    ) {
      price += AIRPORT_FEE;
      isAirport = true;
    }

    // Round to nearest 5€
    price = Math.round(price / 5) * 5;

    return NextResponse.json({
      success: true,
      route: {
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        distance: `${distanceKm.toFixed(1)} km`,
        distanceValue: distanceKm,
        duration: `${Math.round(durationMin)} min`,
        durationValue: durationMin,
        startLocation: leg.start_location,
        endLocation: leg.end_location,
        bounds: data.routes[0].bounds,
      },
      price: {
        total: price,
        currency: "EUR",
        breakdown: {
          base: tariff.base,
          distance: Math.round(distanceKm * tariff.perKm),
          nightSurcharge: isNight ? `+${NIGHT_SURCHARGE * 100}%` : null,
          airportFee: isAirport ? AIRPORT_FEE : null,
        },
        vehicle: tariff.name,
        perKm: tariff.perKm,
      },
    });
  } catch (error) {
    console.error("[calculate-price] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
