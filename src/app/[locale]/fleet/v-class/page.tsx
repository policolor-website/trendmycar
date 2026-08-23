"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowLeft, Users, Briefcase, Check, ChevronDown } from "lucide-react";

const galleryImages = [
  "/fleet/v-class-2.webp",
  "/fleet/v-class-3.webp",
  "/fleet/v-class-4.webp",
  "/fleet/v-class-5.webp",
  "/fleet/v-class-6.webp",
  "/fleet/v-class-1.webp",
];

export default function VClassPage() {
  const t = useTranslations("FleetPages");
  const tFleet = useTranslations("Fleet");

  const features = t.raw("vClass.features") as string[];
  const specs = t.raw("vClass.specs") as { label: string; value: string }[];
  const faqs = t.raw("vClass.faq") as { question: string; answer: string }[];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 text-sm text-ash hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} /> {tFleet("badge")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
                {t("vClass.badge")}
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-cream leading-tight mb-6">
                {t("vClass.title")} <span className="neon-text">{t("vClass.highlight")}</span>
              </h1>
              <p className="text-base text-ash leading-relaxed mb-8">
                {t("vClass.description")}
              </p>
              <div className="flex items-center gap-6 text-sm text-white/70 mb-8">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-white/50" />
                  <span>7 {tFleet("passengers")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-white/50" />
                  <span>7 {tFleet("luggage")}</span>
                </div>
              </div>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {tFleet("bookNow")} <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <img
                src="/fleet/v-class-1.webp"
                alt="Mercedes V-Class"
                className="w-full h-full object-cover bw-image"
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ perspective: "1200px" }}>
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-xl group aspect-square"
              >
                <img
                  src={img}
                  alt={`Mercedes V-Class ${i + 2}`}
                  className="w-full h-full object-cover bw-image group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 mb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-8">
              {t("vClass.featuresTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ perspective: "1200px" }}>
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 glass rounded-xl p-5">
                  <Check size={20} className="text-white/70 shrink-0 mt-0.5" />
                  <span className="text-sm text-ash leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specs */}
      <section className="px-6 mb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-8">
              {t("vClass.specsTitle")}
            </h2>
            <div className="glass rounded-2xl divide-y divide-white/10">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-4">
                  <span className="text-sm text-ash">{spec.label}</span>
                  <span className="text-sm text-white font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 mb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-8">
              {t("vClass.faqTitle")}
            </h2>
            <div className="space-y-3" style={{ perspective: "1200px" }}>
              {faqs.map((faq, i) => (
                <div key={i} className="glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm md:text-base text-white font-medium">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-white/50 shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === i ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-5 text-sm text-ash leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6">
        <motion.div
          initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center glass rounded-2xl p-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
            {t("vClass.ctaTitle")}
          </h2>
          <p className="text-base text-ash leading-relaxed mb-8">
            {t("vClass.ctaDescription")}
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            {tFleet("bookNow")} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
