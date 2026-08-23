"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowLeft, Check, ChevronDown } from "lucide-react";
import { brand } from "@/lib/brand";

interface ServicePageLayoutProps {
  serviceKey: string;
  image: string;
}

export default function ServicePageLayout({ serviceKey, image }: ServicePageLayoutProps) {
  const t = useTranslations("ServicePages");
  const tNav = useTranslations("Nav");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = t.raw(`${serviceKey}.features`) as string[];
  const includes = t.raw(`${serviceKey}.includes`) as { label: string; value: string }[];
  const faqs = t.raw(`${serviceKey}.faq`) as { question: string; answer: string }[];

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-ash hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} /> {t("allServices")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 block">
                {t(`${serviceKey}.badge`)}
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-cream leading-tight mb-6">
                {t(`${serviceKey}.title`)} <span className="neon-text">{t(`${serviceKey}.highlight`)}</span>
              </h1>
              <p className="text-base text-ash leading-relaxed mb-8">{t(`${serviceKey}.description`)}</p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {t("bookNow")} <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]"
            >
              <img
                src={image}
                alt={t(`${serviceKey}.title`)}
                className="w-full h-full object-cover bw-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-xl p-6 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-electric/20 flex items-center justify-center shrink-0">
                  <Check size={20} className="text-electric" />
                </div>
                <p className="text-sm text-ash leading-relaxed pt-2">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="px-6 mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-cream mb-8 text-center">
            {t("whatsIncluded")}
          </h2>
          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {includes.map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-white/50 uppercase tracking-wide mb-2">{item.label}</p>
                  <p className="text-sm text-white font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-cream mb-8 text-center">
            {t("faqTitle")}
          </h2>
          <div className="space-y-3">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
            {t("readyToBook")}
          </h2>
          <p className="text-ash mb-8">{t("readyToBookDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              {t("bookNow")} <ArrowRight size={18} />
            </Link>
            <a
              href={`tel:${brand.phone.replace(/\./g, "")}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:border-electric/50 transition-colors"
            >
              {t("callUs")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
