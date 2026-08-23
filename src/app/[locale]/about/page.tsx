"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ChevronDown, Star, Users, Car, MapPin, Phone, Briefcase, Luggage } from "lucide-react";
import { brand } from "@/lib/brand";

const fleet = [
  { name: "Mercedes S-Class", classKey: "fleetSClass", passengers: 3, luggage: 3, image: "/fleet/veh-s-klasse.webp" },
  { name: "Mercedes E-Class", classKey: "fleetEClass", passengers: 3, luggage: 3, image: "/fleet/veh-e-klasse.webp" },
  { name: "Mercedes V-Class", classKey: "fleetVClass", passengers: 7, luggage: 7, image: "/fleet/veh-v-klasse.webp" },
];

export default function AboutPage() {
  const t = useTranslations("About");
  const tNav = useTranslations("Nav");
  const tFleet = useTranslations("Fleet");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = t.raw("faq") as { question: string; answer: string }[];

  const stats = [
    { value: "1,245+", label: t("statsPassengers"), icon: Users },
    { value: "4.9/5", label: t("statsRating"), desc: t("statsRatingDesc"), icon: Star },
    { value: "100+", label: t("statsDrivers"), icon: Briefcase },
    { value: "20+", label: t("statsCities"), icon: MapPin },
    { value: "120+", label: t("statsVehicles"), icon: Car },
  ];

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
                {t("badge")}
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-cream leading-tight mb-6">
                {t("title")}
              </h1>
              <p className="text-lg text-electric font-medium mb-6">
                {t("subtitle")}
              </p>
              <p className="text-base text-ash leading-relaxed mb-8">
                {t("intro")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
                >
                  {t("ctaBook")} <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 transition-colors"
                >
                  <Phone size={18} /> {t("ctaContact")}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]"
            >
              <img
                src="/fleet/chauffeur-driven-passenger-1.webp"
                alt={t("title")}
                className="w-full h-full object-cover bw-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 mb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4" style={{ perspective: "1200px" }}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
                  whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="glass rounded-xl p-6 text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-electric/20 flex items-center justify-center mx-auto mb-3">
                    <Icon size={20} className="text-electric" />
                  </div>
                  <p className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-ash leading-tight">{stat.label}</p>
                  {stat.desc && (
                    <p className="text-[10px] text-stone mt-1">{stat.desc}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why customers stay */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden h-[350px] md:h-[450px] order-2 lg:order-1"
            >
              <img
                src="/fleet/off-limousine.webp"
                alt={t("whyTitle")}
                className="w-full h-full object-cover bw-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-cream mb-6">
                {t("whyTitle")}
              </h2>
              <p className="text-base text-ash leading-relaxed">
                {t("whyText")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Fleet */}
      <section className="px-6 mb-20">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
            {fleet.map((vehicle, i) => (
              <motion.div
                key={vehicle.name}
                initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
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
        </div>
      </section>

      {/* Journey — where comfort meets class */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl md:text-4xl font-bold text-cream mb-6">
                {t("journeyTitle")}
              </h2>
              <p className="text-base text-ash leading-relaxed mb-8">
                {t("journeyText")}
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 transition-colors"
              >
                {t("learnMore")} <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden h-[350px] md:h-[450px]"
            >
              <img
                src="/fleet/gal-1.webp"
                alt={t("journeyTitle")}
                className="w-full h-full object-cover bw-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 mb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-3 block">
              {t("faqBadge")}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-cream">
              {t("faqTitle")}
            </h2>
          </div>
          <div className="space-y-3" style={{ perspective: "1200px" }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="glass rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm md:text-base text-white font-medium">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-ash transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-ash leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-ash mb-8">{t("ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {t("ctaBook")} <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 transition-colors"
              >
                <Phone size={18} /> {t("ctaContact")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
