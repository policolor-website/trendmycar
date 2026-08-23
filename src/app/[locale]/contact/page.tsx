"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin, Clock, Send, Users, Luggage, ArrowRight } from "lucide-react";
import { brand } from "@/lib/brand";

const fleet = [
  { name: "Mercedes S-Class", classKey: "fleetSClass", passengers: 3, luggage: 3, image: "/fleet/veh-s-klasse.webp" },
  { name: "Mercedes E-Class", classKey: "fleetEClass", passengers: 3, luggage: 3, image: "/fleet/veh-e-klasse.webp" },
  { name: "Mercedes V-Class", classKey: "fleetVClass", passengers: 7, luggage: 7, image: "/fleet/veh-v-klasse.webp" },
];

export default function ContactPage() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Nav");
  const tFleet = useTranslations("Fleet");
  const tFooter = useTranslations("Footer");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
              {t("badge")}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-cream leading-tight mb-6">
              {t("title")}
            </h1>
            <p className="text-base text-ash leading-relaxed max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact info + Form */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-cream mb-6">
                {t("infoTitle")}
              </h2>
              <div className="space-y-4">
                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-electric/20 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-electric" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-cream mb-1">{t("addressLabel")}</h3>
                      <p className="text-sm text-ash">{brand.address}</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-electric/20 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-electric" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-cream mb-1">{t("phoneLabel")}</h3>
                      <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-sm text-ash hover:text-white transition-colors">{brand.phone}</a>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-electric/20 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-electric" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-cream mb-1">{t("emailLabel")}</h3>
                      <a href={`mailto:${brand.email}`} className="text-sm text-ash hover:text-white transition-colors">{brand.email}</a>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-electric/20 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-electric" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-cream mb-1">{t("hoursLabel")}</h3>
                      <p className="text-sm text-ash">{tFooter("availability")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-cream mb-6">
                {t("formTitle")}
              </h2>
              {submitted ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-electric/20 flex items-center justify-center mx-auto mb-6">
                    <Send size={24} className="text-electric" />
                  </div>
                  <h3 className="font-display text-xl text-cream mb-2">{t("sent")}</h3>
                  <p className="text-ash">{t("sentDesc")}</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="glass rounded-2xl p-8 space-y-5"
                >
                  <div>
                    <label className="block text-sm text-ash mb-2">{t("fullName")} *</label>
                    <input type="text" required className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-electric/50 focus:outline-none transition-colors" placeholder={t("fullNamePlaceholder")} />
                  </div>
                  <div>
                    <label className="block text-sm text-ash mb-2">{t("email")} *</label>
                    <input type="email" required className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-electric/50 focus:outline-none transition-colors" placeholder={t("emailPlaceholder")} />
                  </div>
                  <div>
                    <label className="block text-sm text-ash mb-2">{t("phone")} *</label>
                    <input type="tel" required className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-electric/50 focus:outline-none transition-colors" placeholder={t("phonePlaceholder")} />
                  </div>
                  <div>
                    <label className="block text-sm text-ash mb-2">{t("serviceType")}</label>
                    <select className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-electric/50 focus:outline-none transition-colors">
                      <option value="" className="bg-ink">{t("serviceTypePlaceholder")}</option>
                      <option value="airport" className="bg-ink">{t("serviceAirport")}</option>
                      <option value="chauffeur" className="bg-ink">{t("serviceChauffeur")}</option>
                      <option value="diplomatic" className="bg-ink">{t("serviceDiplomatic")}</option>
                      <option value="group" className="bg-ink">{t("serviceGroup")}</option>
                      <option value="dayTours" className="bg-ink">{t("serviceDayTours")}</option>
                      <option value="event" className="bg-ink">{t("serviceEvent")}</option>
                      <option value="fair" className="bg-ink">{t("serviceFair")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-ash mb-2">{t("message")} *</label>
                    <textarea required rows={4} className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-electric/50 focus:outline-none transition-colors resize-none" placeholder={t("messagePlaceholder")} />
                  </div>
                  <button type="submit" className="w-full py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                    {t("send")} <Send size={16} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
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
                className="glass rounded-2xl overflow-hidden group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover bw-image group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
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

          <div className="text-center mt-10">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              {tNav("bookNow")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
