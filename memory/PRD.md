# Roofing Monkeys — Landing Page PRD

## Original Problem Statement
Rebrand the high-converting Google Ads landing page (cloned from `leotoueg/Apex-Landing-Page`) for **Roofing Monkeys**, keeping the same structure, layout, and functionality but replacing all content for the new company.

### Company Details
- **Name:** Roofing Monkeys
- **Phone:** +1 (647) 954-1671 (tel:+16479541671)
- **Service Area:** Greater Toronto Area
- **Offer:** $1,500 OFF Your New Roof
- **Services:** Shingles · Roof Repair · Flat Roofs · Metal Roofs · Emergency Repairs

### Brand Colors
- Primary blue: `#1D67CD`
- Accent (light blue): `#59C8EE`
- Secondary surface: `#F9F8FD`
- Deep brand blue (used for headings, dark sections): `#0F4A9C`

## Architecture
- **Frontend:** React 19 + react-router-dom, Tailwind, CRACO, shadcn/ui components, `sonner` toasts, `lucide-react` icons.
- **Backend:** FastAPI with `/api/health`, `/api/lead`, `/api/booking` endpoints (stateless; webhook forwarding optional).
- **Tracking:** Google Tag Manager (`GTM-WH7QQKDC`) + Microsoft Clarity (`w0bf7lchr8`) wired in `public/index.html`. PostHog snippet preserved.
- **Routes:** `/` LandingPage, `/booking` BookingPage. Lead data passed via `sessionStorage.leadData`.

## User Personas
- **Primary:** GTA homeowner clicking a Google Ad for "roof repair" / "new roof Toronto" — needs trust signals, fast quote, easy phone CTA, mobile-first experience.
- **Secondary:** Existing customer / referral looking up the company to verify legitimacy and book.

## Core Requirements (static)
1. Same page structure as original: hero, lead form, services, offer, testimonials, project gallery, process, trust, FAQ, final CTA, footer, sticky mobile CTAs.
2. Booking calendar: next 4 weekdays (Sundays skipped) × time slots 10:00 AM / 2:00 PM / 6:00 PM.
3. GTM + Microsoft Clarity tracking on every page.
4. Sticky mobile CTA bar (Call Now + Get Free Quote).
5. Webhook integration placeholders ready to be wired up later (`FORM_WEBHOOK_URL`, `BOOKING_WEBHOOK_URL`).
6. All interactive elements have `data-testid` attributes.

## What's Been Implemented (2026-01)
- Cloned `Apex-Landing-Page` repo into `/app`, preserved `.env` and `.git`.
- Rebranded all copy → Roofing Monkeys / GTA / Roofing services.
- Initial color system: primary `#1D67CD`, deep `#0F4A9C`, accent `#59C8EE`, surface `#F9F8FD`.
- Updated dark-background color → `#043061` (per user request) on hero, trust section, footer, booking header, mobile call button, trust badges, hero stat cards, and the social-proof chip.
- Real circular Roofing Monkeys logo (`RMLogo.jpg` + `rmlogohero.png`) wired into nav (white bg) and footer (dark bg).
- 8 Google-style review testimonials.
- 5 services cards (Shingles, Roof Repair, Flat Roofs, Metal Roofs, Emergency Repairs).
- 5 FAQ items rewritten for roofing context.
- Hero swapped Wistia video → 3 stat cards in solid `#043061` blocks (4.9★ Google / 500+ Roofs / 1–3 Day Turnaround).
- Social-proof chip added above the lead form (★★★★★ 4.9 on Google · 500+ GTA Roofs · Licensed & Insured) — sits in `#043061` block.
- Project gallery converted to an **auto-scrolling horizontal marquee** (45s linear loop, pause-on-hover, edge fade mask, accessible with `prefers-reduced-motion` fallback) — now holds **5 real Roofing Monkeys photos** (shingles.jpg, flatroof.jpg, plus 3 new photos from Google Drive: full residential replacement, IKO Cambridge install crew, full tear-off with deck prep). Photos resized to 1600px / ~300 KB each and self-hosted at `/projects/`.
- `+1 (647) 954-1671` phone wired into header, footer, all CTAs, sticky mobile bar, and `tel:` href.
- Hero offer badge: "$1,500 OFF Your New Roof — Limited Time".
- Booking page: month-boundary day-selection bug fix (uses index instead of dayNumber).
- Backend `server.py` rebranded; `/api/lead` and `/api/booking` accept the new `address` field.
- Mobile nav polished — brand sub-text hidden under 768px to prevent CTA overflow.
- Full e2e Playwright + pytest tests passed 100% (see `/app/test_reports/iteration_1.json`).

## Prioritized Backlog
### P0 (waiting on user)
- Real logo image asset to replace the RM wordmark.
- Real project photos (5–8) to replace Unsplash placeholders.
- Real form submission webhook URL (`FORM_WEBHOOK_URL` in `LandingPage.jsx`).
- Real booking webhook URL (`BOOKING_WEBHOOK_URL` in `BookingPage.jsx`).

### P1
- Optional: replace stats card with a real "Meet the Team" Wistia / YouTube video once shot.
- Persist leads + bookings to MongoDB so submissions aren't lost if webhook is unreachable.
- Move webhook URLs into env vars instead of hardcoded constants.

### P2
- Split LandingPage into smaller section components (<150 lines each) for maintainability.
- Add `/thank-you` confirmation page for analytics conversion goals.
- Add structured data (JSON-LD LocalBusiness) for SEO.

## Next Tasks
1. Wait for user-provided assets (logo + photos) and webhook URLs.
2. Wire `FORM_WEBHOOK_URL` and `BOOKING_WEBHOOK_URL` once received.
3. Swap placeholder images for real project photos.
