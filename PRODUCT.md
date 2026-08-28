# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Business travelers — executives and professionals traveling to/from German airports (MUC, FRA, BER, CGN, HAM, DUS) and European cities. They book ad-hoc or through an assistant, need punctual pickup, and value discretion and comfort.

**Secondary:** Tourists and leisure travelers visiting Germany/Europe who want premium, stress-free transfers and day tours. They book in advance, often for sightseeing routes (Neuschwanstein, Zugspitze, Tegernsee).

**Tertiary:** Corporate accounts — companies with recurring transfer needs, monthly invoicing, and admin-managed booking.

All audiences expect: English-speaking chauffeurs, fixed pricing, flight monitoring, and a Mercedes-only fleet.

## Product Purpose

TrendMyDrive is a premium chauffeur service offering airport transfers, city-to-city journeys, day tours, and group transport across Germany and Europe. It exists to replace unreliable taxi queues and inconsistent ride-sharing with a professional, transparent, and punctual alternative. Success means: a visitor lands in Germany, opens the site, enters their route, gets a fixed price, and arrives at their destination in a Mercedes — on time, every time.

## Positioning

Three pillars no single competitor copies equally:

1. **Premium Mercedes-only fleet** — S-Class, E-Class, V-Class, Sprinter. Quality is consistent because the fleet is single-brand.
2. **Fixed transparent pricing** — the price you see at booking is the price you pay. No surge, no traffic surcharges, no hidden fees.
3. **24/7 availability with flight monitoring** — we track the flight. Early arrival or delay, the chauffeur is there. Available any hour, any day.

## Operating Context

- **Markets:** Germany (primary), Europe (extended routes)
- **Airports served:** Munich (MUC), Frankfurt (FRA), Berlin (BER), Cologne/Bonn (CGN), Hamburg (HAM), Düsseldorf (DUS), Memmingen (FMM)
- **Languages:** English (base), German, French, Italian, Chinese — site must work in all five
- **Booking flow:** Route input (pickup + destination + date + time + vehicle) → fixed price → Stripe checkout → confirmation → ride
- **Payment:** Stripe (test mode integrated, production pending)
- **Auth:** Supabase (email/password, dashboard with booking history)
- **Reference site:** https://heydriver.de/
- **Fleet:** Mercedes S-Class (3 pax), E-Class (3 pax), V-Class (7 pax), Sprinter (20 pax), Coach (50 pax)

## Capabilities and Constraints

- **Next.js 15 App Router** with `next-intl` for 5-language i18n (`/en`, `/de`, `/fr`, `/it`, `/zh`)
- **Three.js 3D hero** — Mercedes AMG GT 63 GLB with scroll-driven animation (Draco+Meshopt compressed, local decoders)
- **Stripe** — checkout integration in test mode; production keys pending
- **Supabase** — auth + booking storage; schema updates needed for saved locations, preferences, loyalty
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations
- **Brand colors are binding:** Neon green `#39FF14` (primary, titles + glow), Electric blue `#0080FF` (secondary, icons + UI details), white text on `#0a0a0a` dark background
- **Text overflow risk:** German text is ~30% longer than English; all 5 languages must fit without breaking layout

## Brand Commitments

- **Name:** TrendMyDrive (formerly Oreviceanu Logistic — rebranding complete)
- **Tagline:** "Premium Chauffeur Service"
- **Voice:** Professional, confident, premium. Not casual, not overly formal. Trust-first.
- **Visual identity:** Dark theme (`#0a0a0a`) with neon green glow on titles and electric blue accents. This is binding — it differentiates from competitor generic-white sites.
- **3D hero:** Mercedes AMG GT 63 is a brand asset, not a placeholder. The scroll animation (slide-in → wheel rotation → door opening) is a signature interaction.
- **Company:** TrendMyDrive GmbH, Munich, Germany
- **Contact:** +49 30 1234 5678, book@trendmydrive.com
- **Hours:** 24/7

## Evidence on Hand

- **Real routes and prices:** Popular routes from Munich (MUC 40km/45min, Tegernsee 55km/1hr, Garmisch 90km/1.5hr, Memmingen 110km/1.5hr, Neuschwanstein 120km/2hr) — confirmed
- **Real fleet specs:** Mercedes S-Class, E-Class, V-Class capacities and classes — confirmed
- **No testimonials yet:** Do not fabricate reviews or customer quotes
- **No real fleet photos yet:** 3D model is the hero asset; per-vehicle photos pending
- **No corporate client logos yet:** Do not fabricate partnerships

## Product Principles

1. **Premium is non-negotiable.** Every touchpoint — from the 3D hero to the booking form to the checkout — must feel like a Mercedes ride. No generic SaaS templates.
2. **Transparency builds trust.** Fixed prices, clear routes, no hidden fees. The UI reflects this: what you see is what you pay.
3. **Five languages, one experience.** EN, DE, FR, IT, ZH must all feel native. Layouts must handle text expansion without breaking.
4. **The 3D hero is the brand signature.** It is not decoration — it is the first impression that separates TrendMyDrive from every taxi-booking site.
5. **Speed matters.** A traveler landing at MUC should be able to book a ride in under 60 seconds. The booking engine is the conversion engine.

## Accessibility & Inclusion

- WCAG 2.1 AA target — the site serves business and leisure travelers across 5 languages
- Color contrast: neon green on dark must meet AA (currently `#39FF14` on `#0a0a0a` passes AAA for large text, AA for normal)
- Multilingual: Chinese (ZH) users must have equal experience — no Latin-only assumptions
- Keyboard navigation: booking form and checkout must be fully keyboard-accessible
