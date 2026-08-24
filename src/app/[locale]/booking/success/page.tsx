"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Car } from "lucide-react";

function SuccessContent() {
  const t = useTranslations("Booking");
  const tNav = useTranslations("Nav");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Verify the session
      fetch("/api/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setVerified(data.success);
          setVerifying(false);
        })
        .catch(() => {
          setVerifying(false);
        });
    } else {
      setVerifying(false);
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6 pt-32 pb-16" style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 45, rotateY: 15, z: -600, scale: 1.8, filter: "blur(20px)" }}
        animate={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="glass rounded-2xl p-12 max-w-lg w-full text-center"
      >
        {verifying ? (
          <>
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6" />
            <p className="text-ash">{t("verifying")}</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
            <h1 className="font-display text-3xl font-bold text-cream mb-4">
              {t("successTitle")}
            </h1>
            <p className="text-ash mb-8 leading-relaxed">
              {t("successDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-ink font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {tNav("dashboard")} <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 glass text-white font-semibold rounded-lg hover:border-electric/50 transition-colors"
              >
                {tNav("home")}
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
