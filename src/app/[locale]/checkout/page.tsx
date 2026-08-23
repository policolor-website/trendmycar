"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowLeft, User, Mail, Phone, Lock, MapPin, Clock, Calendar, Car, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface BookingData {
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  vehicle: string;
  extraInfo: string;
  priceResult: any;
  createdAt: string;
}

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [mode, setMode] = useState<"guest" | "login" | "register">("guest");
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("trendmydrive_booking");
    if (!data) {
      router.push("/");
      return;
    }
    setBooking(JSON.parse(data));

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData.session?.user) {
        setUser(sessionData.session.user);
        setForm({
          fullName: sessionData.session.user.user_metadata?.full_name || "",
          email: sessionData.session.user.email || "",
          phone: sessionData.session.user.user_metadata?.phone || "",
          password: "",
        });
      }
    });
  }, [router]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const price = booking.priceResult?.price;
  const route = booking.priceResult?.route;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If already logged in, skip validation
    if (!user) {
      if (mode === "guest") {
        if (!form.fullName || !form.email || !form.phone) {
          setError(t("fillAllFields"));
          return;
        }
      } else {
        if (!form.email || !form.password) {
          setError(t("fillEmailPassword"));
          return;
        }
        if (mode === "register" && (!form.fullName || !form.phone)) {
          setError(t("fillNamePhone"));
          return;
        }
      }
    }

    setLoading(true);

    try {
      let userId: string | null = user?.id ?? null;

      if (!user) {
        if (mode === "login") {
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });
          if (authError) throw new Error(authError.message);
          userId = data.user?.id ?? null;
        } else if (mode === "register") {
          const { data, error: authError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { full_name: form.fullName, phone: form.phone } },
          });
          if (authError) throw new Error(authError.message);
          userId = data.user?.id ?? null;
        }
      }

      // Insert booking into Supabase
      const price = booking.priceResult?.price;
      const route = booking.priceResult?.route;

      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: userId,
        guest_name: user ? null : (mode === "guest" ? form.fullName : null),
        guest_email: user ? user.email : form.email,
        guest_phone: user ? null : (mode === "guest" ? form.phone : null),
        origin: booking.origin,
        destination: booking.destination,
        pickup_date: booking.date || null,
        pickup_time: booking.time || null,
        vehicle: booking.vehicle,
        passengers: booking.passengers,
        extra_info: booking.extraInfo || null,
        distance: route?.distance || null,
        duration: route?.duration || null,
        price: price?.total || null,
        currency: "EUR",
        status: "pending",
      });

      if (bookingError) {
        console.error("[checkout] Booking insert error:", bookingError);
      }

      // Clear localStorage
      localStorage.removeItem("trendmydrive_booking");

      // TODO: Stripe checkout — redirect to /api/checkout
      // For now, redirect to dashboard if logged in, or confirmation page
      if (userId) {
        router.push("/dashboard");
      } else {
        router.push("/checkout?status=confirmed");
      }
    } catch (err: any) {
      setError(err.message || t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ash hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> {t("backToHome")}
        </Link>

        <h1 className="font-display text-4xl font-bold text-white mb-2">{t("title")}</h1>
        <p className="text-ash mb-10">{t("description")}</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT — Booking summary (read-only) */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-white/60" />
                {t("yourBooking")}
              </h2>

              {/* Route */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("pickup")}</p>
                    <p className="text-sm text-white">{route?.startAddress || booking.origin}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("destination")}</p>
                    <p className="text-sm text-white">{route?.endAddress || booking.destination}</p>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar size={12} /> {t("date")}
                  </p>
                  <p className="text-sm text-white">{booking.date || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Clock size={12} /> {t("time")}
                  </p>
                  <p className="text-sm text-white">{booking.time || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Car size={12} /> {t("vehicle")}
                  </p>
                  <p className="text-sm text-white">{booking.vehicle}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("passengers")}</p>
                  <p className="text-sm text-white">{booking.passengers}</p>
                </div>
              </div>

              {/* Route stats */}
              {route && (
                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("distance")}</p>
                    <p className="text-sm text-white">{route.distance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("duration")}</p>
                    <p className="text-sm text-white">{route.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("rate")}</p>
                    <p className="text-sm text-white">€{price?.perKm}/km</p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-ash uppercase tracking-wide">{t("total")}</span>
                <span className="font-display text-4xl font-bold text-white">€{price?.total}</span>
              </div>

              {/* Extra info */}
              {booking.extraInfo && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50 uppercase tracking-wide mb-2">{t("extraInfo")}</p>
                  <p className="text-sm text-ash">{booking.extraInfo}</p>
                </div>
              )}
            </div>

            {/* Map */}
            {route && (
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <iframe
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?saddr=${encodeURIComponent(route.startAddress)}&daddr=${encodeURIComponent(route.endAddress)}&output=embed`}
                  title="Route map"
                />
              </div>
            )}
          </div>

          {/* RIGHT — Guest / Login / Register / Logged in */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-electric/20 flex items-center justify-center">
                      <User size={24} className="text-electric" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs text-ash">{t("signedIn")}</p>
                    </div>
                  </div>
                  <p className="text-xs text-ash mb-5">
                    {t("signedInDesc")}
                  </p>
                </>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex gap-1 mb-6 bg-ink/50 rounded-lg p-1">
                    <button
                      onClick={() => setMode("guest")}
                      className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        mode === "guest" ? "bg-white text-ink" : "text-ash hover:text-white"
                      }`}
                    >
                      {t("guest")}
                    </button>
                    <button
                      onClick={() => setMode("login")}
                      className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        mode === "login" ? "bg-white text-ink" : "text-ash hover:text-white"
                      }`}
                    >
                      {tNav("login")}
                    </button>
                    <button
                      onClick={() => setMode("register")}
                      className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        mode === "register" ? "bg-white text-ink" : "text-ash hover:text-white"
                      }`}
                    >
                      {tNav("register")}
                    </button>
                  </div>

                  {mode === "guest" && (
                    <p className="text-xs text-ash mb-5">
                      {t("guestDesc")}
                    </p>
                  )}
                  {mode === "login" && (
                    <p className="text-xs text-ash mb-5">
                      {t("loginDesc")}
                    </p>
                  )}
                  {mode === "register" && (
                    <p className="text-xs text-ash mb-5">
                      {t("registerDesc")}
                    </p>
                  )}
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name — guest + register (not for logged in) */}
                {!user && (mode === "guest" || mode === "register") && (
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("fullName")}</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder={t("fullNamePlaceholder")}
                        className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder:text-stone focus:border-electric/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email — all modes (not for logged in) */}
                {!user && (
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("emailLabel")}</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t("emailPlaceholder")}
                        className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder:text-stone focus:border-electric/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Phone — guest + register (not for logged in) */}
                {!user && (mode === "guest" || mode === "register") && (
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("phoneLabel")}</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder={t("phonePlaceholder")}
                        className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder:text-stone focus:border-electric/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Password — login + register (not for logged in) */}
                {!user && mode !== "guest" && (
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("passwordLabel")}</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder:text-stone focus:border-electric/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-3 border border-red-400/20">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-ink font-semibold rounded-lg py-4 hover:bg-white/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  ) : (
                    <>
                      {t("continueToPayment")} <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              <p className="text-xs text-stone flex items-center gap-2">
                <Lock size={12} /> {t("securePayment")}
              </p>
              <p className="text-xs text-stone flex items-center gap-2">
                <CheckCircle2 size={12} /> {t("freeCancellation")}
              </p>
              <p className="text-xs text-stone flex items-center gap-2">
                <Clock size={12} /> {t("support")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
