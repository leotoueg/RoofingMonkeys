# Roofing Monkeys — Landing Page

Static React SPA (Create React App). Fully self-contained: all tracking, form
submissions and appointment bookings happen client-side, posting directly to
LeadConnector webhooks. No backend required.

## Deploy to Vercel

1. Push this `/frontend` folder as the repo root (or set the "Root Directory"
   in Vercel to `frontend/`).
2. Vercel will auto-detect **Create React App**. The included `vercel.json`
   configures:
   - `yarn install --frozen-lockfile` + `yarn build`
   - Output directory: `build/`
   - SPA rewrites so `/booking` and deep links don't 404 on refresh
   - Long cache headers for `/static/*` and image folders
3. **No environment variables needed.** All third-party IDs are inlined:
   - GTM container: `GTM-W42NGRW8`
   - Meta Pixel: `1310983044526111`
   - Microsoft Clarity: `w0bf7lchr8`
   - PostHog: `phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs`
   - LeadConnector webhooks: constants in `src/pages/LandingPage.jsx` and
     `src/pages/BookingPage.jsx`.

## Local dev

```bash
yarn install
yarn start   # http://localhost:3000
yarn build   # production build in ./build
```

## Where things live

- `src/pages/LandingPage.jsx` — hero, lead form, gallery, services, testimonials, process, trust, FAQ.
- `src/pages/BookingPage.jsx` — Mon–Sat calendar (up to 7 days out), hourly slots 9 AM–6 PM.
- `src/lib/tracking.js` — first-touch gclid/UTM capture, dataLayer helper, Meta Pixel wrapper.
- `public/brand/` — company logo assets.
- `public/photos/`, `public/projects/` — project gallery photos.
- `public/index.html` — GTM, Meta Pixel, Microsoft Clarity and PostHog snippets.

## Attribution & analytics forwarded automatically

Every webhook payload and every GTM/Meta Pixel event carries:
`gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `utm_source`, `utm_medium`,
`utm_campaign`, `utm_term`, `utm_content`, `landing_url`, `referrer`,
`event_id` (UUID for dedup with server-side conversions).
