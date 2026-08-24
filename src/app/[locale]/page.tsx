"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Plane,
  Car,
  Calendar,
  Users,
  ShieldCheck,
  UserCheck,
  Radar,
  MapPin,
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";
import BuildingHero3D from "@/components/building-hero-3d";
import PlacesInput from "@/components/places-input";
import { brand } from "@/lib/brand";

// ============================================
// CONTENT — structured for easy i18n extraction
// All text here will be moved to messages/en.json
// ============================================

const howItWorks = [
  { icon: MapPin, titleKey: "step1Title", descKey: "step1Desc" },
  { icon: Star, titleKey: "step2Title", descKey: "step2Desc" },
  { icon: Car, titleKey: "step3Title", descKey: "step3Desc" },
];

const whyUs = [
  { icon: ShieldCheck, titleKey: "feature1Title", descKey: "feature1Desc" },
  { icon: UserCheck, titleKey: "feature2Title", descKey: "feature2Desc" },
  { icon: Radar, titleKey: "feature3Title", descKey: "feature3Desc" },
];

const whyUsImages = [
  "/fleet/bento-b.webp",
  "/fleet/chauffeur-driven-passenger-1.webp",
  "/fleet/bento-tall.webp",
];

const services = [
  {
    icon: Plane,
    titleKey: "airportTitle" as const,
    descKey: "airportDesc" as const,
    image: "/fleet/chauffeur-driven-passenger-1.webp",
    href: "/services/airport-transfer",
  },
  {
    icon: Car,
    titleKey: "chauffeurTitle" as const,
    descKey: "chauffeurDesc" as const,
    image: "/fleet/off-limousine.webp",
    href: "/services/chauffeur",
  },
  {
    icon: Calendar,
    titleKey: "dayToursTitle" as const,
    descKey: "dayToursDesc" as const,
    image: "/fleet/gal-1.webp",
    href: "/services/day-tours",
  },
  {
    icon: Users,
    titleKey: "groupTitle" as const,
    descKey: "groupDesc" as const,
    image: "/fleet/bento-wide.webp",
    href: "/services/group-transfer",
  },
];

const fleet = [
  { name: "Mercedes S-Class", class: "First Class Limousine", passengers: 3, luggage: 3, image: "/fleet/veh-s-klasse.webp" },
  { name: "Mercedes E-Class", class: "Business Class Limousine", passengers: 3, luggage: 3, image: "/fleet/veh-e-klasse.webp" },
  { name: "Mercedes V-Class", class: "Business Van", passengers: 7, luggage: 7, image: "/fleet/veh-v-klasse.webp" },
];

const routes = [
  { name: "Munich Airport MUC", distance: "40 km", time: "45 min" },
  { name: "Tegernsee", distance: "55 km", time: "1 hr" },
  { name: "Garmisch / Zugspitze", distance: "90 km", time: "1.5 hr" },
  { name: "Memmingen Airport", distance: "110 km", time: "1.5 hr" },
  { name: "Neuschwanstein", distance: "120 km", time: "2 hr" },
  { name: "Salzburg", distance: "145 km", time: "1.5 hr" },
  { name: "Innsbruck", distance: "160 km", time: "2 hr" },
  { name: "Nuremberg", distance: "170 km", time: "1.75 hr" },
];

const testimonials = [] as { initials: string; name: string; location: string; text: string }[];

const faqItems = [] as { q: string; a: string }[];

// ============================================
// COMPONENT
// ============================================
export default function HomePage() {
  const t = useTranslations("Hero");
  const tBooking = useTranslations("Booking");
  const tFleet = useTranslations("Fleet");
  const tServices = useTranslations("Services");
  const tEasy = useTranslations("EasyBooking");
  const tWhyUs = useTranslations("WhyUs");
  const tCTA = useTranslations("CTA");
  const tRoutes = useTranslations("Routes");
  const tFinalCTA = useTranslations("FinalCTA");
  const tNav = useTranslations("Nav");
  const tTestimonials = useTranslations("Testimonials");

  const testimonialItems = tTestimonials.raw("items") as { initials: string; name: string; location: string; text: string }[];
  const faqItemsData = tWhyUs.raw("faq") as { q: string; a: string }[];

  const [scrollProgress, setScrollProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Booking form state
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

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 4;
      const animRange = heroHeight - window.innerHeight;
      setScrollProgress(Math.max(0, Math.min(1, scrollY / animRange)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDoorsOpen = () => setTextVisible(true);

  const handleGetPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.origin || !bookingForm.destination) {
      setPriceError(tBooking("errorMissingFields"));
      return;
    }
    setPriceLoading(true);
    setPriceError(null);
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
      if (!res.ok) {
        const errorKey = data.error === "outside_germany" ? "errorOutsideGermany" : "errorGeneric";
        setPriceError(tBooking(errorKey as any));
      } else {
        setPriceResult(data);
      }
    } catch {
      setPriceError(tBooking("errorGeneric"));
    } finally {
      setPriceLoading(false);
    }
  };

  const heroTextOpacity = !textVisible
    ? 0
    : scrollProgress < 0.6
      ? 1
      : 1 - ((scrollProgress - 0.6) / 0.2);

  return (
    <main>
      {/* ============================================ */}
      {/* HERO — 3D Car animation */}
      {/* ============================================ */}
      <section className="relative h-[110vh] bg-ink">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Background image behind 3D model */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/background-hero.webp)" }}
          />
          <div className="absolute inset-0 z-0 bg-ink/60" />
          <BuildingHero3D onDoorsOpen={handleDoorsOpen} />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/40 via-transparent to-ink/80 pointer-events-none" />

          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-700"
            style={{ opacity: heroTextOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass"
            >
              <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
              <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white whitespace-nowrap">{t("badge")}</span>
            </motion.div>
          </div>

          <div
            className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-4xl text-center px-6 pointer-events-none transition-opacity duration-700"
            style={{ opacity: heroTextOpacity }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="font-display text-5xl sm:text-7xl md:text-9xl font-bold leading-[0.95] mb-4 flex flex-col items-center"
            >
              <span className="text-white">{brand.name}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white text-sm md:text-lg italic font-normal text-center px-4"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          <div
            className="absolute top-[78%] left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl text-center px-6 pointer-events-none transition-opacity duration-700"
            style={{ opacity: heroTextOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 hover:shadow-[0_4px_30px_rgba(0,128,255,0.15)] transition-all duration-300"
              >
                {t("aboutUs")} <ArrowRight size={18} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 hover:shadow-[0_4px_30px_rgba(0,128,255,0.15)] transition-all duration-300"
              >
                {t("ourServices")} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 transition-opacity duration-700"
            style={{ opacity: textVisible ? 1 : 0 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white">{t("scroll")}</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BOOKING BAR — wide linear form below hero */}
      {/* ============================================ */}
      <section className="bg-canvas px-6 py-4 relative z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 shadow-2xl"
          >
            <form onSubmit={handleGetPrice} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-3">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tBooking("pickup")}</label>
                <PlacesInput
                  value={bookingForm.origin}
                  onChange={(val) => setBookingForm({ ...bookingForm, origin: val })}
                  placeholder={tBooking("pickupPlaceholder")}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tBooking("destination")}</label>
                <PlacesInput
                  value={bookingForm.destination}
                  onChange={(val) => setBookingForm({ ...bookingForm, destination: val })}
                  placeholder={tBooking("destinationPlaceholder")}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tBooking("date")}</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tBooking("time")}</label>
                <input
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-2 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tBooking("vehicle")}</label>
                <select
                  value={bookingForm.vehicle}
                  onChange={(e) => setBookingForm({ ...bookingForm, vehicle: e.target.value })}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors [color-scheme:dark]"
                >
                  <option>E-Class</option>
                  <option>S-Class</option>
                  <option>V-Class</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block invisible">{tBooking("getPrice")}</label>
                <button
                  type="submit"
                  disabled={priceLoading}
                  className="w-full bg-white text-ink font-semibold rounded-lg py-3 hover:bg-white/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {priceLoading ? (
                    <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  ) : (
                    <>{tBooking("getPrice")} <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </form>

            {priceError && (
              <div className="mt-4 text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-3 border border-red-400/20">
                {priceError}
              </div>
            )}

            {priceResult && (
              <>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price details */}
                <div className="glass rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60 uppercase tracking-wide">{tBooking("fixedPrice")}</span>
                    <span className="font-display text-3xl font-bold text-white">
                      €{priceResult.price.total}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-ash">
                    <div className="flex justify-between">
                      <span>{tBooking("distance")}</span>
                      <span className="text-white">{priceResult.route.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{tBooking("duration")}</span>
                      <span className="text-white">{priceResult.route.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{tBooking("vehicle")}</span>
                      <span className="text-white">{priceResult.price.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{tBooking("rate")}</span>
                      <span className="text-white">€{priceResult.price.perKm}/km</span>
                    </div>
                    {priceResult.price.breakdown.nightSurcharge && (
                      <div className="flex justify-between">
                        <span>{tBooking("nightSurcharge")}</span>
                        <span className="text-white">{priceResult.price.breakdown.nightSurcharge}</span>
                      </div>
                    )}
                    {priceResult.price.breakdown.airportFee && (
                      <div className="flex justify-between">
                        <span>{tBooking("airportFee")}</span>
                        <span className="text-white">+€{priceResult.price.breakdown.airportFee}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-stone pt-2 border-t border-white/10">
                    {priceResult.route.startAddress} → {priceResult.route.endAddress}
                  </div>
                </div>
                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-white/10 min-h-[200px]">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "200px" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?saddr=${encodeURIComponent(priceResult.route.startAddress)}&daddr=${encodeURIComponent(priceResult.route.endAddress)}&output=embed`}
                    title="Route map"
                  />
                </div>
              </div>

              {/* Extra info */}
              <div className="mt-4">
                <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">
                  {tBooking("extraInfoLabel")}
                </label>
                <textarea
                  value={bookingForm.extraInfo}
                  onChange={(e) => setBookingForm({ ...bookingForm, extraInfo: e.target.value })}
                  placeholder={tBooking("extraInfoPlaceholder")}
                  rows={2}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-stone focus:border-electric/50 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const bookingData = {
                      ...bookingForm,
                      priceResult,
                      createdAt: new Date().toISOString(),
                    };
                    localStorage.setItem("trendmydrive_booking", JSON.stringify(bookingData));
                    window.location.href = "/checkout";
                  }}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300"
                >
                  {tBooking("reserveNow")} <ArrowRight size={18} />
                </button>
              </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
      {/* ============================================ */}
      {/* FLEET — 5 vehicles (moved below booking bar) */}
      {/* ============================================ */}
      <section className="py-4 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          {/* Mobile header */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="md:hidden text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tFleet("badge")}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              {tFleet("title")} <span className="neon-text">{tFleet("highlight")}</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              {tFleet("description")}
            </p>
          </motion.div>

          {/* Desktop: split layout — text left, stacked cards right */}
          <FleetStackedSection fleet={fleet} />

          {/* Grid — mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fleet.map((vehicle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="relative h-40 overflow-hidden bg-ink/50">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover bw-image"
                  />
                  <div className="absolute inset-0 bg-ink/30" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-cream mb-1">{vehicle.name}</h3>
                  <p className="text-xs text-white/60 uppercase tracking-wide mb-4">{vehicle.class}</p>
                  <div className="flex items-center gap-4 text-xs text-ash">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-electric" /> {vehicle.passengers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane size={14} className="text-electric" /> {vehicle.luggage}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ============================================ */}
      {/* SERVICES — 4 cards with zoom-in on scroll */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tServices("badge")}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              {tServices("title")} <span className="neon-text">{tServices("highlight")}</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              {tServices("description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: "1200px" }}>
            {services.map((srv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link
                  href={srv.href}
                  className="group block glass rounded-2xl overflow-hidden hover:border-electric/30 transition-all duration-500 h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={srv.image}
                      alt={tServices(srv.titleKey)}
                      className="w-full h-full object-cover bw-image group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-electric/20 backdrop-blur-sm flex items-center justify-center">
                        <srv.icon size={20} className="text-electric" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-cream">{tServices(srv.titleKey)}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-ash leading-relaxed mb-4">{tServices(srv.descKey)}</p>
                    <span className="text-white text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      {tServices("learnMore")} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-canvas relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/steps.webp)" }}
        />
        <div className="absolute inset-0 z-0 bg-canvas/60" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tEasy("badge")}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
              {tEasy("title")} <span className="neon-text">{tEasy("highlight")}</span>
            </h2>
            <p className="text-lg text-ash max-w-2xl mx-auto">
              {tEasy("description")}
            </p>
          </motion.div>

          {/* Cinematic step cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass rounded-2xl p-8 relative group"
              >
                {/* Connector line between cards (desktop only) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 md:-right-4 w-8 h-px bg-gradient-to-r from-electric/40 to-transparent z-10" />
                )}

                {/* Big white number */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.6 + 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -top-6 -left-2 font-display text-8xl font-black text-white/90 select-none leading-none"
                >
                  0{i + 1}
                </motion.div>

                <div className="relative z-10 mt-8">
                  <div className="w-14 h-14 rounded-xl bg-electric/10 flex items-center justify-center mb-6 group-hover:bg-electric/20 transition-colors duration-500">
                    <step.icon size={26} className="text-electric" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-cream mb-3">{tEasy(step.titleKey as any)}</h3>
                  <p className="text-sm text-ash leading-relaxed">{tEasy(step.descKey as any)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="text-center mt-12"
          >
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300"
            >
              {tEasy("cta")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRAVEL WITH CONFIDENCE — FAQ left + features right */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tWhyUs("badge")}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              {tWhyUs("title")} <span className="neon-text">{tWhyUs("highlight")}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT — FAQ */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tWhyUs("faqBadge")}</span>
              <h3 className="font-display text-2xl font-bold text-cream mb-8">{tWhyUs("faqTitle")}</h3>
              <div className="space-y-4">
                {faqItemsData.map((item, i) => (
                  <div key={i} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-display text-sm font-bold text-cream pr-4">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-white flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: openFaq === i ? "200px" : "0px" }}
                    >
                      <p className="px-5 pb-5 text-sm text-ash leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — comfort text + 3 features */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tWhyUs("featuresTitle")}</span>
              <h3 className="font-display text-2xl font-bold text-cream mb-6">
                {tWhyUs("featuresSubtitle")} <span className="neon-text">{tWhyUs("featuresHighlight")}</span>
              </h3>
              <p className="text-sm text-ash leading-relaxed mb-10">
                {tWhyUs("featuresDescription")}
              </p>

              <div className="space-y-6">
                {whyUs.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center">
                      <item.icon size={22} className="text-electric" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-cream mb-2">{tWhyUs(item.titleKey as any)}</h4>
                      <p className="text-sm text-ash leading-relaxed">{tWhyUs(item.descKey as any)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA — Book your chauffeur */}
      {/* ============================================ */}
      <section className="py-32 px-6 bg-canvas relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/fleet/cta-experience.webp" alt="" className="w-full h-full object-cover bw-image" />
          <div className="absolute inset-0 bg-ink/50" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            {tCTA("title")}
          </h2>
          <p className="text-lg text-ash mb-10">
            {tCTA("description")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-ink text-white font-semibold rounded-lg border border-white/20 hover:bg-ink/80 hover:border-white/40 transition-colors duration-300 text-lg"
          >
            {tCTA("button")} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS — Google reviews */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tTestimonials("badge")}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              {tTestimonials("title")} <span className="neon-text">{tTestimonials("highlight")}</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              {tTestimonials("description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialItems.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-white fill-white" />
                  ))}
                </div>
                <p className="text-sm text-ash leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{review.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-cream">{review.name}</p>
                    <p className="text-xs text-stone">Google Review · {review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* POPULAR ROUTES — from Munich */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-canvas relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/routes.webp)" }}
        />
        <div className="absolute inset-0 z-0 bg-canvas/60" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">{tRoutes("badge")}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
              {tRoutes("title")} <span className="neon-text">{tRoutes("highlight")}</span>
            </h2>
            <p className="text-lg text-ash mt-4 max-w-2xl mx-auto">
              {tRoutes("description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {routes.map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass rounded-xl p-5 hover:border-electric/20 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-electric" />
                  <h3 className="font-display text-sm font-bold text-cream">{route.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-ash">
                  <span>{route.distance}</span>
                  <span className="text-stone">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {route.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-stone mt-8">
            {tRoutes("disclaimer")}
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA */}
      {/* ============================================ */}
      <section className="py-32 px-6 bg-canvas">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            {tFinalCTA("title")}
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-ink text-white font-semibold rounded-lg border border-white/20 hover:bg-ink/80 hover:border-white/40 transition-colors duration-300 text-lg"
          >
            {tFinalCTA("contact")} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

/* ============================================ */
/* FleetStackedSection — stacked cards scroll  */
/* ============================================ */
function FleetStackedSection({
  fleet,
}: {
  fleet: { name: string; class: string; passengers: number; luggage: number; image: string }[];
}) {
  const tFleet = useTranslations("Fleet");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const n = fleet.length;
  const transitions = Math.max(n - 1, 1);

  return (
    <div
      ref={containerRef}
      className="hidden md:block relative"
      style={{ height: `${transitions * 60}vh` }}
    >
      <div className="sticky top-20 flex items-start gap-12 px-6 max-w-7xl mx-auto">
        {/* Left — text (fixed, stays visible) */}
        <div className="w-[35%] shrink-0 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
              {tFleet("badge")}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream leading-tight">
              {tFleet("title")} <span className="neon-text">{tFleet("highlight")}</span>
            </h2>
            <p className="text-lg text-ash mt-6">
              {tFleet("description")}
            </p>
            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/welcome.webp"
                alt="Welcome to TrendMyDrive"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Right — stacked cards (fixed) */}
        <div className="flex-1 relative h-[55vh] pointer-events-auto">
          {fleet.map((vehicle, i) => (
            <div key={i} className="absolute inset-0 flex flex-col items-center justify-start">
              <FleetStackCard
                vehicle={vehicle}
                index={i}
                total={n}
                transitions={transitions}
                progress={scrollYProgress}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FleetStackCard({
  vehicle,
  index,
  transitions,
  progress,
}: {
  vehicle: { name: string; class: string; passengers: number; luggage: number; image: string };
  index: number;
  total: number;
  transitions: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const tFleet = useTranslations("Fleet");
  // Card 0 is visible from the start at y=0
  // Card i (i>0) slides up from y=offset to y=0 during its segment
  // Hold time: animations complete at 0.8, leaving 20% for last card to stay visible
  const HOLD = 0.2;
  const animRange = 1 - HOLD;
  const segStart = ((index - 1) / transitions) * animRange;
  const segEnd = (index / transitions) * animRange;

  // Entry animation: slide up from below + fade in
  const y = useTransform(progress, [segStart, segEnd], [400, 0]);
  const opacity = useTransform(progress, [segStart, segEnd * 0.9], [0, 1]);

  // Card 0: always at y=0, fully visible
  const finalY = index === 0 ? 0 : y;
  const finalOpacity = index === 0 ? 1 : opacity;

  return (
    <motion.div
      style={{
        y: finalY,
        opacity: finalOpacity,
        zIndex: index,
      }}
      className="w-full max-w-lg"
    >
      <div
        className="glass rounded-3xl overflow-hidden border border-white/10"
        style={{
          boxShadow: "0 25px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(57,255,20,0.05)",
        }}
      >
        {/* Image */}
        <div className="relative h-72 md:h-80 overflow-hidden bg-ink/50">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover bw-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          {/* Class badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-ink/80 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs text-electric uppercase tracking-wider font-semibold">
              {vehicle.class}
            </span>
          </div>
          {/* Vehicle number */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ink/80 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <span className="text-sm font-bold text-white/80">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-cream mb-2">
            {vehicle.name}
          </h3>
          <p className="text-sm text-white/50 uppercase tracking-wide mb-6">{vehicle.class}</p>

          <div className="flex items-center gap-8 text-sm text-ash">
            <span className="flex items-center gap-2">
              <Users size={18} className="text-electric" />
              <span>
                <span className="text-cream font-bold">{vehicle.passengers}</span> {tFleet("passengers")}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <Plane size={18} className="text-electric" />
              <span>
                <span className="text-cream font-bold">{vehicle.luggage}</span> {tFleet("luggage")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
