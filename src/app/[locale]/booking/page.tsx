"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowRight, Users, Luggage, MapPin } from "lucide-react";
import PlacesInput from "@/components/places-input";

const fleet = [
  { name: "Mercedes S-Class", classKey: "fleetSClass", passengers: 3, luggage: 3, image: "/fleet/veh-s-klasse.webp", value: "S-Class" },
  { name: "Mercedes E-Class", classKey: "fleetEClass", passengers: 3, luggage: 3, image: "/fleet/veh-e-klasse.webp", value: "E-Class" },
  { name: "Mercedes V-Class", classKey: "fleetVClass", passengers: 7, luggage: 7, image: "/fleet/veh-v-klasse.webp", value: "V-Class" },
];

export default function BookingPage() {
  const t = useTranslations("Booking");
  const tFleet = useTranslations("Fleet");
  const tNav = useTranslations("Nav");
  const router = useRouter();

  const [bookingForm, setBookingForm] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    passengers: "1",
    vehicle: "E-Class",
    extraInfo: "",
  });
  const [priceResult, setPriceResult] = useState<any>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  const handleGetPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.origin || !bookingForm.destination) {
      setPriceError(t("errorMissingFields"));
      return;
    }
    setPriceError(null);
    setPriceLoading(true);
    setPriceResult(null);
    try {
      const res = await fetch("/api/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: bookingForm.origin,
          destination: bookingForm.destination,
          vehicle: bookingForm.vehicle,
          time: bookingForm.time,
        }),
      });
      const data = await res.json();
      if (data.error) {
        const errorKey = data.error === "outside_germany" ? "errorOutsideGermany" : "errorGeneric";
        setPriceError(t(errorKey as any));
      } else {
        setPriceResult(data);
      }
    } catch {
      setPriceError(t("errorGeneric"));
    }
    setPriceLoading(false);
  };

  const handleReserve = () => {
    const bookingData = {
      ...bookingForm,
      priceResult,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("trendmydrive_booking", JSON.stringify(bookingData));
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
              {t("getPrice")}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-cream leading-tight mb-6">
              {t("reserveNow")}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Booking engine */}
      <section className="px-6 mb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <form onSubmit={handleGetPrice} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-3">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("pickup")}</label>
                <PlacesInput
                  value={bookingForm.origin}
                  onChange={(val) => setBookingForm({ ...bookingForm, origin: val })}
                  placeholder={t("pickupPlaceholder")}
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("destination")}</label>
                <PlacesInput
                  value={bookingForm.destination}
                  onChange={(val) => setBookingForm({ ...bookingForm, destination: val })}
                  placeholder={t("destinationPlaceholder")}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("date")}</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("time")}</label>
                <input
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-2 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("vehicle")}</label>
                <select
                  value={bookingForm.vehicle}
                  onChange={(e) => setBookingForm({ ...bookingForm, vehicle: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                >
                  <option>E-Class</option>
                  <option>S-Class</option>
                  <option>V-Class</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <button
                  type="submit"
                  disabled={priceLoading}
                  className="w-full bg-ink text-white font-semibold rounded-lg py-3 border border-white/20 hover:bg-ink/80 hover:border-white/40 transition-colors duration-300 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {priceLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{t("getPrice")} <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </form>

            {priceError && (
              <div className="mt-4 text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-3">
                {priceError}
              </div>
            )}

            {priceResult && (
              <>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price details */}
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60 uppercase tracking-wide">Fixed price</span>
                      <span className="font-display text-3xl font-bold text-white">
                        €{priceResult.price.total}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-3 mt-3 space-y-2 text-xs text-ash">
                      <div className="flex justify-between">
                        <span>Distance</span>
                        <span className="text-white">{priceResult.route.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span className="text-white">{priceResult.route.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicle</span>
                        <span className="text-white">{priceResult.price.vehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate</span>
                        <span className="text-white">€{priceResult.price.perKm}/km</span>
                      </div>
                      {priceResult.price.breakdown.nightSurcharge && (
                        <div className="flex justify-between">
                          <span>Night surcharge</span>
                          <span className="text-white">{priceResult.price.breakdown.nightSurcharge}</span>
                        </div>
                      )}
                      {priceResult.price.breakdown.airportFee && (
                        <div className="flex justify-between">
                          <span>Airport fee</span>
                          <span className="text-white">+€{priceResult.price.breakdown.airportFee}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-stone pt-2 mt-2 border-t border-white/10">
                      {priceResult.route.startAddress} → {priceResult.route.endAddress}
                    </div>
                  </div>
                  {/* Map */}
                  <div className="glass rounded-xl p-2 overflow-hidden">
                    <iframe
                      className="w-full rounded-lg"
                      style={{ border: 0, minHeight: "200px" }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?saddr=${encodeURIComponent(priceResult.route.startAddress)}&daddr=${encodeURIComponent(priceResult.route.endAddress)}&output=embed`}
                      title="Route map"
                    />
                  </div>
                </div>

                {/* Extra info + Reserve */}
                <div className="mt-4">
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">
                    Extra info — pickup details
                  </label>
                  <textarea
                    value={bookingForm.extraInfo}
                    onChange={(e) => setBookingForm({ ...bookingForm, extraInfo: e.target.value })}
                    placeholder="Gate number, terminal, building entrance, meeting point details..."
                    rows={2}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-stone focus:border-electric/50 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleReserve}
                    className="inline-flex items-center gap-2 px-10 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300"
                  >
                    {t("reserveNow")} <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Our Fleet */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
              {tFleet("badge")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
              {tFleet("title")} <span className="neon-text">{tFleet("highlight")}</span>
            </h2>
            <p className="text-base text-ash leading-relaxed max-w-2xl mx-auto">
              {tFleet("description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleet.map((vehicle, i) => (
              <motion.div
                key={vehicle.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => setBookingForm({ ...bookingForm, vehicle: vehicle.value })}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className={`w-full h-full object-cover bw-image group-hover:scale-105 transition-transform duration-700 ${
                      bookingForm.vehicle === vehicle.value ? "" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  {bookingForm.vehicle === vehicle.value && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-electric flex items-center justify-center">
                      <span className="text-ink text-xs font-bold">✓</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-5">
                    <h3 className="font-display text-lg font-bold text-cream">{vehicle.name}</h3>
                    <p className="text-xs text-ash">{tNav(vehicle.classKey as any)}</p>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-ash">
                    <Users size={16} className="text-electric" />
                    <span>{vehicle.passengers}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ash">
                    <Luggage size={16} className="text-electric" />
                    <span>{vehicle.luggage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
