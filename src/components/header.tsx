"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown, Globe, User, LogOut, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { brand } from "@/lib/brand";
import { supabase } from "@/lib/supabase-client";

interface NavItem {
  href: string;
  labelKey: string;
  children?: { href: string; labelKey: string }[];
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  {
    href: "/fleet",
    labelKey: "fleet",
    children: [
      { href: "/fleet", labelKey: "fleetOverview" },
      { href: "/fleet/s-class", labelKey: "fleetSClass" },
      { href: "/fleet/e-class", labelKey: "fleetEClass" },
      { href: "/fleet/v-class", labelKey: "fleetVClass" },
    ],
  },
  {
    href: "/services",
    labelKey: "services",
    children: [
      { href: "/services/airport-transfer", labelKey: "serviceAirport" },
      { href: "/services/chauffeur", labelKey: "serviceChauffeur" },
      { href: "/services/diplomatic", labelKey: "serviceDiplomatic" },
      { href: "/services/group-transfer", labelKey: "serviceGroup" },
      { href: "/services/day-tours", labelKey: "serviceDayTours" },
      { href: "/services/event-transfer", labelKey: "serviceEvent" },
      { href: "/services/fair-transfer", labelKey: "serviceFair" },
      { href: "/services/prices", labelKey: "servicePrices" },
    ],
  },
  { href: "/contact", labelKey: "contact" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "zh", label: "中文" },
];

export default function Header() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("en");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, [pathname]);

  const switchLang = (code: string) => {
    setActiveLang(code);
    setLangOpen(false);
    const currentPath = pathname;
    router.replace(currentPath, { locale: code });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/95 backdrop-blur-md py-3 border-b border-white/10"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo — animated letters */}
        <Link href="/" className="flex flex-col leading-none group min-w-0 shrink relative overflow-hidden rounded-lg py-1">
          <span className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight relative z-10 logo-letters" aria-label={brand.name}>
            {"TrendMyDrive".split("").map((char, i) => (
              <span
                key={i}
                className="logo-letter inline-block"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {char}
              </span>
            ))}
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-white mt-1 relative z-10 logo-tagline" style={{ animationDelay: `2.8s` }}>
            Premium Chauffeur Service
          </span>
          <span className="logo-shine" />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-8"
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {navItems.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.children ? item.labelKey : null)}
            >
              <Link
                href={item.href}
                className={`text-sm tracking-wide transition-colors duration-300 flex items-center gap-1 ${
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {t(item.labelKey)}
                {item.children && <ChevronDown size={14} className="opacity-50" />}
              </Link>

              {/* Dropdown */}
              {item.children && openDropdown === item.labelKey && (
                <div className="absolute top-full left-0 pt-4 -ml-4">
                  <div className="glass rounded-xl py-3 min-w-[240px] shadow-2xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-5 py-2.5 text-sm text-ash hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {t(child.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side — language + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language switcher */}
          <div className="relative" onMouseLeave={() => setLangOpen(false)}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              onMouseEnter={() => setLangOpen(true)}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Globe size={15} />
              <span>{activeLang.toUpperCase()}</span>
              <ChevronDown size={12} className="opacity-50" />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 pt-4">
                <div className="glass rounded-xl py-3 min-w-[140px] shadow-2xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLang(lang.code)}
                      className={`block w-full text-left px-5 py-2 text-sm transition-colors ${
                        activeLang === lang.code
                          ? "text-white"
                          : "text-ash hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/booking"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Phone size={14} />
            <span>{t("bookNow")}</span>
          </Link>

          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <LayoutDashboard size={15} />
                <span>{t("dashboard")}</span>
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <LogOut size={15} />
                <span>{t("logout")}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <User size={15} />
                <span>{t("login")}</span>
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold bg-electric text-ink rounded-lg hover:bg-electric/80 transition-colors"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white hover:text-white transition-colors duration-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-ink/95 mt-3 mx-4 rounded-xl p-6 animate-fade-up border border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.labelKey ? null : item.labelKey)}
                    className="w-full flex items-center justify-between text-white text-base py-3 border-b border-white/5"
                  >
                    <span>{t(item.labelKey)}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${mobileExpanded === item.labelKey ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white hover:text-white text-base block py-3 border-b border-white/5"
                  >
                    {t(item.labelKey)}
                  </Link>
                )}
                {item.children && mobileExpanded === item.labelKey && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="text-ash hover:text-white text-sm block py-2"
                      >
                        {t(child.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Language switcher mobile */}
            <div className="flex items-center gap-3 py-4 border-b border-white/5">
              <Globe size={16} className="text-white/50" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLang(lang.code)}
                  className={`text-sm ${activeLang === lang.code ? "text-white" : "text-ash"}`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Book now - mobile */}
            <Link
              href="/booking"
              className="flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-white text-ink font-semibold rounded-lg text-sm"
            >
              <Phone size={16} /> {t("bookNow")}
            </Link>

            <a
              href={`tel:${brand.phone}`}
              className="flex items-center gap-2 text-white text-sm mt-4 pt-4"
            >
              <Phone size={14} /> {brand.phone}
            </a>

            {/* Auth mobile */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
              {user ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 text-white text-sm">
                    <LayoutDashboard size={16} /> {t("dashboard")}
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push("/login");
                    }}
                    className="flex items-center gap-2 text-ash text-sm ml-auto"
                  >
                    <LogOut size={16} /> {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-2 text-white text-sm">
                    <User size={16} /> {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold bg-electric text-ink rounded-lg ml-auto"
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>

            {/* App download */}
            <a
              href="#"
              className="block mt-6 pt-4 border-t border-white/5 hover:opacity-80 transition-opacity"
              aria-label="Download TrendMyDrive App"
            >
              <img
                src="/trendmydrive-app.webp"
                alt="Download on the App Store and Get it on Google Play"
                className="w-full"
              />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
