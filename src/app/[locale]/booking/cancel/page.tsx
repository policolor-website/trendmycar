"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowRight, RotateCcw } from "lucide-react";

export default function CancelPage() {
  const t = useTranslations("Booking");
  const tNav = useTranslations("Nav");

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6 pt-32 pb-16" style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
        animate={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="glass rounded-2xl p-12 max-w-lg w-full text-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-cream mb-4">
          {t("cancelTitle")}
        </h1>
        <p className="text-ash mb-8 leading-relaxed">
          {t("cancelDesc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            <RotateCcw size={18} /> {t("tryAgain")}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 glass text-white font-semibold rounded-lg hover:border-electric/50 transition-colors"
          >
            {tNav("home")}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
