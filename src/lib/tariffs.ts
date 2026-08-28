// ============================================
// TRENDMYDRIVE — TARIFFS
// Single source of truth for all pricing
// ============================================

export type VehicleClass = "E-Class" | "V-Class" | "S-Class";
export type RideType = "local" | "external";

export interface VehicleTariff {
  name: string;
  local: {
    perHour: number; // € per hour (same-city rides)
    minimumHours: number; // minimum billable hours
  };
  external: {
    perKm: number; // € per km (cross-city rides)
  };
}

export const VEHICLE_TARIFFS: Record<VehicleClass, VehicleTariff> = {
  "E-Class": {
    name: "Mercedes E-Class",
    local: { perHour: 120, minimumHours: 1 },
    external: { perKm: 2.3 },
  },
  "V-Class": {
    name: "Mercedes V-Class",
    local: { perHour: 135, minimumHours: 1 },
    external: { perKm: 2.6 },
  },
  "S-Class": {
    name: "Mercedes S-Class",
    local: { perHour: 145, minimumHours: 1 },
    external: { perKm: 2.5 },
  },
};

// Surcharges
export const NIGHT_SURCHARGE = 0.25; // +25% between 22:00-06:00
export const AIRPORT_FEE = 8; // +€8 if pickup/destination is an airport
export const PRICE_ROUND_TO = 5; // round final price to nearest 5€

// ============================================
// München — base of operations
// ============================================

// München city center coordinates
export const MUNICH_CENTER = { lat: 48.1371, lng: 11.5754 };

// Booking radius rules
export const PICKUP_RADIUS_LONG_DISTANCE_KM = 100;   // when destination > 150km from München
export const PICKUP_RADIUS_SHORT_DISTANCE_KM = 1500;  // when destination ≤ 150km from München
export const DESTINATION_THRESHOLD_KM = 150;          // threshold that switches pickup radius

/**
 * Haversine distance between two coordinates in km.
 */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Given a destination's coordinates, returns the allowed pickup radius from München.
 * - Destination > 150km from München → pickup within 100km of München (we drive you far, but you start near base)
 * - Destination ≤ 150km from München → pickup within 1500km of München (we pick you up from anywhere in Europe to bring you close)
 */
export function getPickupRadiusForDestination(destLat: number, destLng: number): {
  radiusKm: number;
  destDistanceFromMunich: number;
  rule: "long-distance" | "short-distance";
} {
  const destDistanceFromMunich = haversineKm(
    MUNICH_CENTER.lat,
    MUNICH_CENTER.lng,
    destLat,
    destLng
  );
  if (destDistanceFromMunich > DESTINATION_THRESHOLD_KM) {
    return {
      radiusKm: PICKUP_RADIUS_LONG_DISTANCE_KM,
      destDistanceFromMunich,
      rule: "long-distance",
    };
  }
  return {
    radiusKm: PICKUP_RADIUS_SHORT_DISTANCE_KM,
    destDistanceFromMunich,
    rule: "short-distance",
  };
}

// ============================================
// City extraction & comparison
// ============================================

/**
 * Extracts the city name from a Google Maps address string.
 * Google Maps returns addresses like:
 *   "Munich Airport, Terminalstraße, 85326 Hallbergmoos, Germany"
 *   "Some Street 1, 80331 München, Germany"
 * We extract the city from the component before the country.
 */
export function extractCity(address: string): string {
  if (!address) return "";
  const parts = address.split(",").map((p) => p.trim());
  // Remove country (last part) and postal code from each part
  const withoutCountry = parts.slice(0, -1);
  // Find the part that contains a postal code followed by city name
  // Format: "80331 München" or "85326 Hallbergmoos"
  for (const part of withoutCountry) {
    const match = part.match(/^\d{4,6}\s+(.+)$/);
    if (match) {
      return match[1].trim().toLowerCase();
    }
  }
  // Fallback: use the second-to-last part (usually city)
  if (withoutCountry.length >= 2) {
    return withoutCountry[withoutCountry.length - 1].toLowerCase();
  }
  return withoutCountry[0]?.toLowerCase() || "";
}

/**
 * Normalizes city names for comparison.
 * Handles common variations: Munich = München = Munchen
 */
const CITY_ALIASES: Record<string, string> = {
  munich: "munchen",
  münchen: "munchen",
  munchen: "munchen",
  muc: "munchen",
  berlin: "berlin",
  frankfurt: "frankfurt",
  hamburg: "hamburg",
  cologne: "koln",
  köln: "koln",
  bonn: "bonn",
  dusseldorf: "dusseldorf",
  düsseldorf: "dusseldorf",
  stuttgart: "stuttgart",
};

export function normalizeCity(city: string): string {
  const lower = city.toLowerCase().trim();
  return CITY_ALIASES[lower] || lower;
}

/**
 * Determines if a ride is local (same city) or external (different cities).
 */
export function determineRideType(
  startAddress: string,
  endAddress: string
): RideType {
  const startCity = normalizeCity(extractCity(startAddress));
  const endCity = normalizeCity(extractCity(endAddress));
  if (!startCity || !endCity) return "external";
  return startCity === endCity ? "local" : "external";
}

// ============================================
// Price calculation
// ============================================

export interface PriceInput {
  vehicle: VehicleClass;
  rideType: RideType;
  distanceKm: number;
  durationMin: number;
  time?: string; // "HH:MM" format
  isAirport: boolean;
}

export interface PriceBreakdown {
  rideType: RideType;
  base: number; // always 0 now (no base fare)
  distance: number | null; // € for external rides
  hours: number | null; // billable hours for local rides
  hourlyRate: number | null; // €/h for local
  perKm: number | null; // €/km for external
  nightSurcharge: string | null; // "+25%" or null
  airportFee: number | null; // 8 or null
  total: number; // final price in €
}

export function calculatePrice(input: PriceInput): PriceBreakdown {
  const tariff = VEHICLE_TARIFFS[input.vehicle];
  let price = 0;
  let hours: number | null = null;
  let distanceCost: number | null = null;

  if (input.rideType === "local") {
    // Local: hourly rate, minimum 1 hour
    const realHours = input.durationMin / 60;
    hours = Math.max(realHours, tariff.local.minimumHours);
    price = hours * tariff.local.perHour;
  } else {
    // External: per km
    distanceCost = input.distanceKm * tariff.external.perKm;
    price = distanceCost;
  }

  // Night surcharge
  let isNight = false;
  if (input.time) {
    const hour = parseInt(input.time.split(":")[0]);
    if (hour >= 22 || hour < 6) {
      price *= 1 + NIGHT_SURCHARGE;
      isNight = true;
    }
  }

  // Airport fee
  if (input.isAirport) {
    price += AIRPORT_FEE;
  }

  // Round to nearest 5€
  const total = Math.round(price / PRICE_ROUND_TO) * PRICE_ROUND_TO;

  return {
    rideType: input.rideType,
    base: 0,
    distance: distanceCost !== null ? Math.round(distanceCost) : null,
    hours: hours !== null ? Math.round(hours * 10) / 10 : null,
    hourlyRate: input.rideType === "local" ? tariff.local.perHour : null,
    perKm: input.rideType === "external" ? tariff.external.perKm : null,
    nightSurcharge: isNight ? `+${NIGHT_SURCHARGE * 100}%` : null,
    airportFee: input.isAirport ? AIRPORT_FEE : null,
    total,
  };
}
