import { NextRequest, NextResponse } from "next/server";
import {
  VEHICLE_TARIFFS,
  determineRideType,
  calculatePrice,
  getPickupRadiusForDestination,
  haversineKm,
  MUNICH_CENTER,
  type VehicleClass,
} from "@/lib/tariffs";

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

    const tariff = VEHICLE_TARIFFS[vehicle as VehicleClass];
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

    // Validate pickup is within allowed radius of München based on destination distance
    const destLat = leg.end_location.lat;
    const destLng = leg.end_location.lng;
    const pickupLat = leg.start_location.lat;
    const pickupLng = leg.start_location.lng;
    const pickupInfo = getPickupRadiusForDestination(destLat, destLng);
    const pickupDistFromMunich = haversineKm(
      MUNICH_CENTER.lat,
      MUNICH_CENTER.lng,
      pickupLat,
      pickupLng
    );
    if (pickupDistFromMunich > pickupInfo.radiusKm) {
      return NextResponse.json(
        { error: "pickup_outside_radius" },
        { status: 400 }
      );
    }

    // Determine ride type: local (same city) or external (different cities)
    const rideType = determineRideType(leg.start_address, leg.end_address);

    // Check if airport is involved
    const lowerOrigin = origin.toLowerCase();
    const lowerDest = destination.toLowerCase();
    const isAirport =
      lowerOrigin.includes("airport") ||
      lowerDest.includes("airport") ||
      lowerOrigin.includes("flughafen") ||
      lowerDest.includes("flughafen") ||
      lowerOrigin.includes("muc") ||
      lowerDest.includes("muc");

    // Calculate price using shared tariff logic
    const breakdown = calculatePrice({
      vehicle: vehicle as VehicleClass,
      rideType,
      distanceKm,
      durationMin,
      time: time || undefined,
      isAirport,
    });

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
      rideType, // "local" | "external"
      price: {
        total: breakdown.total,
        currency: "EUR",
        breakdown: {
          base: breakdown.base,
          distance: breakdown.distance,
          hours: breakdown.hours,
          hourlyRate: breakdown.hourlyRate,
          perKm: breakdown.perKm,
          nightSurcharge: breakdown.nightSurcharge,
          airportFee: breakdown.airportFee,
        },
        vehicle: tariff.name,
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
