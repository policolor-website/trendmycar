import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { brand } from "@/lib/brand";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");

  return (
    <footer className="bg-ink border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <img
              src="/trendmydrive-logo.webp"
              alt={brand.name}
              className="h-20 w-auto mb-6"
              loading="lazy"
            />
            <p className="text-sm text-ash leading-relaxed mb-6">
              {t("tagline")}
            </p>
            <p className="text-xs text-stone">24/7 — Available across Germany & Europe</p>
          </div>

          {/* Fleet */}
          <div>
            <h4 className="font-display text-lg text-white mb-5">{tNav("fleet")}</h4>
            <ul className="space-y-3">
              <li><Link href="/fleet/s-class" className="text-sm text-ash hover:text-white transition-colors">{tNav("fleetSClass")}</Link></li>
              <li><Link href="/fleet/e-class" className="text-sm text-ash hover:text-white transition-colors">{tNav("fleetEClass")}</Link></li>
              <li><Link href="/fleet/v-class" className="text-sm text-ash hover:text-white transition-colors">{tNav("fleetVClass")}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg text-white mb-5">{tNav("services")}</h4>
            <ul className="space-y-3">
              <li><Link href="/services/airport-transfer" className="text-sm text-ash hover:text-white transition-colors">{tNav("serviceAirport")}</Link></li>
              <li><Link href="/services/chauffeur" className="text-sm text-ash hover:text-white transition-colors">{tNav("serviceChauffeur")}</Link></li>
              <li><Link href="/services/diplomatic" className="text-sm text-ash hover:text-white transition-colors">{tNav("serviceDiplomatic")}</Link></li>
              <li><Link href="/services/group-transfer" className="text-sm text-ash hover:text-white transition-colors">{tNav("serviceGroup")}</Link></li>
              <li><Link href="/services/day-tours" className="text-sm text-ash hover:text-white transition-colors">{tNav("serviceDayTours")}</Link></li>
              <li><Link href="/services/event-transfer" className="text-sm text-ash hover:text-white transition-colors">{tNav("serviceEvent")}</Link></li>
              <li><Link href="/services/fair-transfer" className="text-sm text-ash hover:text-white transition-colors">{tNav("serviceFair")}</Link></li>
              <li><Link href="/services/prices" className="text-sm text-ash hover:text-white transition-colors">{tNav("servicePrices")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-white mb-5">{t("contact")}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-white/50 mt-0.5 shrink-0" />
                <p className="text-sm text-ash">{brand.address}</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-white/50 mt-0.5 shrink-0" />
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-sm text-ash hover:text-white transition-colors">{brand.phone}</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-white/50 mt-0.5 shrink-0" />
                <a href={`mailto:${brand.email}`} className="text-sm text-ash hover:text-white transition-colors">{brand.email}</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-white/50 mt-0.5 shrink-0" />
                <p className="text-sm text-ash">{brand.program}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full mb-8 bg-white/10" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone">
            © {new Date().getFullYear()} {brand.name}. {t("rights")}{" "}
            <span className="text-stone/60">·</span>{" "}
            <a
              href="https://forsite.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/70 transition-colors"
              aria-label="FORSITE.RO — Web Design & Development"
            >
              Created &amp; Designed by FORSITE.RO
            </a>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-stone hover:text-white transition-colors">{tNav("home")}</Link>
            <Link href="/about" className="text-xs text-stone hover:text-white transition-colors">{tNav("about")}</Link>
            <Link href="/contact" className="text-xs text-stone hover:text-white transition-colors">{tNav("contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
