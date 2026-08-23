"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, Lock, User, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { brand } from "@/lib/brand";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });

      if (authError) throw new Error(authError.message);

      // Insert profile
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          email,
          phone,
        });
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || t("registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6 pt-32 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl font-bold text-white">{brand.name}</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-cream mt-8 mb-2">
            {t("registerTitle").split(" ").slice(0, -1).join(" ")} <span className="neon-text">{t("registerTitle").split(" ").slice(-1)[0]}</span>
          </h1>
          <p className="text-sm text-ash">{t("registerSubtitle")}</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("fullName")}</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("phone")}</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("email")}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("password")}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="w-full bg-ink/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-electric text-ink font-semibold rounded-lg hover:bg-electric/80 transition-colors disabled:opacity-50"
            >
              {loading ? t("creatingAccount") : t("createAccount")}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-ash">
              {t("haveAccount")}{" "}
              <Link href="/login" className="text-electric hover:underline">
                {tNav("login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
