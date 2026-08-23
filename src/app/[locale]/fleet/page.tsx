"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Users, Briefcase } from "lucide-react";

const vehicles = [
  {
    slug: "s-class",
    name: "Mercedes S-Class",
    classKey: "sClassCategory",
    passengers: 3,
    luggage: 3,
    image: "/fleet/veh-s-klasse.webp",
    descKey: "sClassDesc",
  },
  {
    slug: "e-class",
    name: "Mercedes E-Class",
    classKey: "eClassCategory",
    passengers: 3,
    luggage: 3,
    image: "/fleet/veh-e-klasse.webp",
    descKey: "eClassDesc",
  },
  {
    slug: "v-class",
    name: "Mercedes V-Class",
    classKey: "vClassCategory",
    passengers: 7,
    luggage: 7,
    image: "/fleet/veh-v-klasse.webp",
    descKey: "vClassDesc",
  },
];

export default function FleetPage() {
  const t = useTranslations("Fleet");
  const tNav = useTranslations("Nav");

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ash hover:text-white transition-colors mb-8"
          >
            <ArrowRight size={16} className="rotate-180" /> {tNav("home")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
              {t("badge")}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-cream leading-tight mb-6">
              {t("title")} <span className="neon-text">{t("highlight")}</span>
            </h1>
            <p className="text-base text-ash leading-relaxed max-w-2xl mx-auto">
              {t("description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vehicles grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1200px" }}>
            {vehicles.map((vehicle, i) => (
              <motion.div
                key={vehicle.slug}
                initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link
                  href={`/fleet/${vehicle.slug}`}
                  className="group block glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover bw-image group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2 block">
                      {t(vehicle.classKey as any)}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-cream mb-3">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-ash leading-relaxed mb-5">
                      {t(vehicle.descKey as any)}
                    </p>

                    {/* Specs */}
                    <div className="flex items-center gap-6 text-xs text-white/70 mb-5">
                      <div className="flex items-center gap-2">
                        <Users size={15} className="text-white/50" />
                        <span>{vehicle.passengers} {t("passengers")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={15} className="text-white/50" />
                        <span>{vehicle.luggage} {t("luggage")}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-sm text-white font-medium group-hover:gap-3 transition-all">
                      {t("viewDetails")} <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              {t("bookNow")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
