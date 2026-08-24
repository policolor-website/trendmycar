# TrendMyDrive — Platform Features

## Overview
Premium chauffeur service platform for Germany-wide operations, featuring real-time pricing, Stripe payments, multi-language support, and a 3D interactive hero.

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **3D:** Three.js (Mercedes AMG GT 63 model)
- **Auth & Database:** Supabase (PostgreSQL, RLS, Auth)
- **Payments:** Stripe (Checkout, test mode)
- **i18n:** next-intl (5 languages)
- **Maps:** Google Maps API (Places Autocomplete, Directions, Embed)
- **Icons:** Lucide React

---

## Pages

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage — 3D hero, booking engine, services preview, fleet showcase, testimonials, CTA |
| `/about` | About Us — company story, values, stats |
| `/contact` | Contact — form, phone, email, map |
| `/booking` | Booking engine — full reservation form with price calculator |
| `/booking/success` | Payment success — Stripe verification, 3D animated card |
| `/booking/cancel` | Payment cancelled — retry option, 3D animated card |
| `/checkout` | Checkout — review booking, login/register/guest, Stripe redirect |
| `/fleet` | Fleet overview — 3 vehicle classes with specs |
| `/fleet/s-class` | Mercedes S-Class — First Class Limousine (hero, gallery, features, specs, FAQ) |
| `/fleet/e-class` | Mercedes E-Class — Business Class Limousine (hero, gallery, features, specs, FAQ) |
| `/fleet/v-class` | Mercedes V-Class — Business Van (hero, gallery, features, specs, FAQ) |
| `/services` | Services overview — all 7 service types |
| `/services/airport-transfer` | Airport transfer service page |
| `/services/chauffeur` | Chauffeur hire service page |
| `/services/day-tours` | Day tours service page |
| `/services/diplomatic` | Diplomatic transport service page |
| `/services/event-transfer` | Event transfer service page |
| `/services/fair-transfer` | Fair/exhibition transfer service page |
| `/services/group-transfer` | Group transfer service page |
| `/services/prices` | Pricing overview — per km rates by vehicle class |
| `/login` | Login page |
| `/register` | Registration page |

### Authenticated Pages
| Route | Description |
|-------|-------------|
| `/dashboard` | User dashboard — profile, bookings, saved locations, preferences, stats |

---

## API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/calculate-price` | POST | Calculate trip price (distance, duration, vehicle tariff, night surcharge, airport fee) |
| `/api/places-autocomplete` | GET | Google Places autocomplete for address inputs |
| `/api/checkout` | POST | Create Stripe Checkout session, update booking status |
| `/api/verify-session` | POST | Verify Stripe payment, confirm booking |

---

## Components
| Component | Description |
|-----------|-------------|
| `header.tsx` | Navigation — desktop + mobile menu, language switcher, auth (login/register/logout), Book now button |
| `footer.tsx` | Footer — brand, links, contact, app badges, language list |
| `building-hero-3d.tsx` | Three.js 3D hero — Mercedes AMG GT 63 with scroll-driven door animation |
| `phone-3d.tsx` | 3D phone model for CTA section |
| `chef-3d.tsx` | 3D chef model |
| `chef-3d-wrapper.tsx` | Wrapper for 3D chef with lazy loading |
| `chef-reservation.tsx` | Reservation widget with 3D chef |
| `places-input.tsx` | Google Places autocomplete address input |

---

## Booking Engine
- **Pickup location** — Google Places autocomplete
- **Destination** — Google Places autocomplete
- **Date** — native date picker (dark mode styled)
- **Time** — native time picker (dark mode styled)
- **Vehicle** — dropdown (E-Class, S-Class, V-Class)
- **Get Price** — instant price calculation via Google Maps Directions API
- **Price breakdown** — distance, duration, per-km rate, night surcharge (22:00-06:00 +25%), airport fee (+EUR 8)
- **Route map** — embedded Google Maps showing pickup → destination
- **Extra info** — textarea for special requests
- **Reserve** — saves booking to localStorage, redirects to checkout

### Vehicle Tariffs
| Vehicle | Per km | Base fare |
|---------|--------|-----------|
| Mercedes E-Class | EUR 3.0 | EUR 10 |
| Mercedes V-Class | EUR 3.5 | EUR 12 |
| Mercedes S-Class | EUR 4.5 | EUR 15 |

---

## Checkout & Payment
1. Review booking details (route, date, vehicle, price)
2. Authentication options:
   - **Login** — existing users
   - **Register** — new users (full name, email, phone, password)
   - **Guest** — one-time booking without account
3. Booking inserted into Supabase with status `pending`
4. Stripe Checkout session created → redirect to Stripe hosted page
5. On success → `/booking/success` — verifies payment, updates status to `confirmed`
6. On cancel → `/booking/cancel` — booking remains `pending`

### Stripe Test Cards
| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0027 6000 3184` | Declined |

---

## Dashboard
- **Profile** — avatar upload, full name, phone, edit/save
- **Member since** — registration date
- **Booking history** — all bookings with status badges (pending, confirmed, completed, cancelled)
- **Saved locations** — add/delete (home, work, airport, custom)
- **Preferences** — preferred vehicle, preferred language
- **Stats** — total distance (km), total bookings
- **Loyalty points** — placeholder (coming soon)
- **Logout** — redirects to `/login`

---

## Authentication
- **Supabase Auth** — email/password
- **Auto profile creation** — trigger on signup creates profile row
- **Session management** — cookie-based, SSR compatible
- **Protected routes** — dashboard requires auth
- **Guest checkout** — bookings without account

---

## Database (Supabase)
### Tables
- `profiles` — user profiles (id, full_name, phone, avatar_url, preferred_vehicle, preferred_language, created_at)
- `bookings` — reservations (origin, destination, date, time, vehicle, passengers, price, status, stripe_payment_id)
- `invoices` — invoice records (booking_id, invoice_number, pdf_url, amount)

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only view/edit their own data
- Guest bookings allowed (user_id = NULL)
- Auto profile creation trigger on auth signup

---

## Internationalization
- **5 languages:** English (base), Deutsch, Français, Italiano, 中文
- **next-intl** with locale-prefixed routes (`/en`, `/de`, `/fr`, `/it`, `/zh`)
- Language switcher in header (desktop + mobile)
- All UI text, booking, fleet, services, dashboard translated
- Translation files: `messages/{en,de,fr,it,zh}.json`

---

## 3D Hero Section
- **Model:** Mercedes AMG GT 63 (`public/mercedes.glb`, Draco+Meshopt compressed)
- **Animation phases:** arriving (slide from left) → doors (scroll-jacked open)
- **Wheels:** Tires rotate on X axis, rims on Y axis
- **Performance:** shadow map auto-update disabled, pixel ratio capped, render loop pauses when off-screen
- **Responsive:** desktop scale 16, mobile scale 12

---

## Brand
- **Name:** TrendMyDrive
- **Tagline:** Premium Chauffeur Service
- **Coverage:** 24/7 — Available across Germany
- **Colors:**
  - Neon green `#39FF14` — titles with glow
  - Electric blue `#0080FF` — icons, badges, details
  - White `#FFFFFF` — body text
  - Dark `#0A0A0A` — background

---

## Environment Variables
```
GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

---

## Deployment
- **Hosting:** Vercel
- **Repo:** github.com/policolor-website/trendmycar
- **Auto-deploy:** on push to `main`
- **Build:** `next build` (Turbopack)

---

## Roadmap (Pending)
- [ ] Avatar/upload in dashboard profile
- [ ] Saved locations (home/work/airport)
- [ ] User preferences (vehicle, language)
- [ ] Member since date display
- [ ] Booking history with vehicle + km
- [ ] Total distance across all bookings
- [ ] Loyalty points / tier system
- [ ] Supabase schema updates (profiles, saved_locations, preferences)
- [ ] Stripe webhooks for async payment confirmation
- [ ] Email notifications (booking confirmation, receipt)
- [ ] Admin panel (manage bookings, fleet, pricing)
- [ ] WhatsApp integration for booking
