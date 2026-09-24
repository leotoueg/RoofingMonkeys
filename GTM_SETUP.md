# Roofing Monkeys — Google Tag Manager & Google Ads Conversion Setup

**Container:** `GTM-PKD4WCJV`
**Strategy:** 5 search campaigns (one per service) → 15 Google Ads conversion actions (3 events × 5 services) → 3 GTM conversion tags (via Lookup Tables). Enhanced Conversions ON.

---

## 0. What the site already pushes to `dataLayer`

Every event carries these fields automatically (already coded in `/frontend/src/lib/tracking.js`):

| Field | Example values | Notes |
|---|---|---|
| `event` | `form_submit`, `booking_request`, `call_click` | Canonical trigger names |
| `event_id` | `d22fd328-1869-...` | UUID per event — used for deduplication |
| `service_slug` | `home`, `shingles`, `flat-roofs`, `soffit-fascia-gutters`, `emergency-repairs` | Which landing variant the session started on. Booking + call events inherit this from `sessionStorage` |
| `page_variant` | `/`, `/shingles`, `/flat-roofs`, `/soffit-fascia-gutters`, `/emergency-repairs` | Route path |
| `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid` | `Cj0KCQ...` | First-touch, persisted for the session |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` | `google` / `cpc` / ... | First-touch |
| `landing_url`, `referrer` | full URL | First-touch |
| `user_data` (form_submit + booking_request only) | `{ email_address, phone_number, address: {...} }` | Raw values — GTM will hash them for Enhanced Conversions |

Payload examples:

**form_submit / generate_lead** (fires on landing page form submission)
```js
{
  event: "form_submit",
  event_id: "...",
  service_slug: "shingles",
  page_variant: "/shingles",
  project_type: "shingles",
  form_name: "lead_capture",
  page: "landing",
  user_data: {
    email_address: "john@example.com",
    phone_number: "+16475551234",
    address: { first_name: "John", last_name: "Doe", street: "123 Main St", country: "CA" }
  },
  gclid: "...", utm_campaign: "...", // + all other attribution fields
}
```

**booking_request / book_appointment** (fires on booking page confirmation)
```js
{
  event: "booking_request",
  event_id: "...",
  service_slug: "shingles",
  page_variant: "/shingles",
  project_type: "shingles",
  appointment_date: "Wednesday, March 5, 2026",
  appointment_time: "2:00 PM",
  currency: "CAD",
  value: 0,
  user_data: { ... same as above ... }
}
```

**call_click** (fires on every `tel:` tap — header, hero, form CTA, offer, about, final CTA, footer, sticky mobile bar, booking header, booked-success)
```js
{
  event: "call_click",
  event_id: "...",
  service_slug: "shingles",
  page_variant: "/shingles",
  page: "landing",           // or "booking"
  location: "header",        // or "form_top_call", "sticky_mobile", "final_cta", "footer", "booking_header", etc.
  phone_number: "+1 (647) 954-1671"
}
```

> Legacy event names (`click_call_button`, `phone_call_click`, `book_appointment`, `schedule`) are still pushed alongside for GA4 / Meta compatibility. **Only use the canonical names above in your Google Ads triggers.**

---

## 1. Google Ads — Create 15 Conversion Actions

**Path:** Google Ads → Goals → Summary → **+ New conversion action** → Website → Enter your domain → **Add a conversion action manually**.

Create these 15 actions. **Copy the exact conversion names** — the doc's GTM Lookup Tables reference them.

### Recommended values

The values below are calibrated for a GTA roofing operation using **Maximize Conversions** or **Target CPA** bidding. They represent the *estimated pipeline value per action*, not the sold job value. Google's Smart Bidding uses them to bid the right amount per click. Tune them after ~30 conversions.

| # | Conversion name | Category | Value (CAD) | Count | Attribution model | Click-through window | Primary/Secondary |
|---|---|---|---|---|---|---|---|
| 1 | `Shingles - Booking` | Book appointment | **$450** | One | Data-driven | 30 days | **Primary** |
| 2 | `Shingles - Lead` | Submit lead form | $150 | One | Data-driven | 30 days | Secondary |
| 3 | `Shingles - Call` | Phone call lead | $120 | One | Data-driven | 30 days | Secondary |
| 4 | `Flat Roofs - Booking` | Book appointment | **$400** | One | Data-driven | 30 days | **Primary** |
| 5 | `Flat Roofs - Lead` | Submit lead form | $130 | One | Data-driven | 30 days | Secondary |
| 6 | `Flat Roofs - Call` | Phone call lead | $110 | One | Data-driven | 30 days | Secondary |
| 7 | `SFG - Booking` | Book appointment | **$180** | One | Data-driven | 30 days | **Primary** |
| 8 | `SFG - Lead` | Submit lead form | $60 | One | Data-driven | 30 days | Secondary |
| 9 | `SFG - Call` | Phone call lead | $50 | One | Data-driven | 30 days | Secondary |
| 10 | `Emergency - Booking` | Book appointment | **$300** | One | Data-driven | 7 days | **Primary** |
| 11 | `Emergency - Lead` | Submit lead form | $120 | One | Data-driven | 7 days | Secondary |
| 12 | `Emergency - Call` | Phone call lead | **$250** | One | Data-driven | 7 days | **Primary** (equal weight — emergency is call-first) |
| 13 | `Home - Booking` | Book appointment | $250 | One | Data-driven | 30 days | **Primary** |
| 14 | `Home - Lead` | Submit lead form | $80 | One | Data-driven | 30 days | Secondary |
| 15 | `Home - Call` | Phone call lead | $80 | One | Data-driven | 30 days | Secondary |

**Rationale**
- **Primary = Booking** because it's the highest-intent action (form → picked a slot). Smart Bidding will chase these. Lead + Call are Secondary (observed only) so they don't dilute the signal.
- **Emergency is the exception**: on that page the phone is the CTA, so Call is also Primary and its value is 2x the other services' Call value.
- Shingles/Flat Roofs values are highest because those jobs average $8-20k. Soffit/Fascia/Gutters are lower-ticket ($1-4k).
- **Count = "One"** on all 15 — prevents double-counting if a user submits twice.
- **Attribution = Data-driven** — Google's default; requires no minimum conversions to switch on now.

### During creation, for EACH action:

1. Category → pick as per table above.
2. Value → **Use the same value for each conversion** → enter table value.
3. Count → **One**.
4. Click-through window → 30 days (7 for Emergency).
5. Attribution model → **Data-driven**.
6. Include in "Conversions" column → **Only Booking rows** (the Primary ones). Leave Lead + Call as "Secondary conversions" so they don't affect bidding.
7. Click **Save and continue** → **Use Google Tag Manager** → **copy the Conversion ID (`AW-XXXXXXXXXX`) and Conversion Label (`abc123XYZ`)**. You'll paste both into GTM.

Save the 15 pairs to a scratchpad — you'll need them for §4 Lookup Tables. Format:

```
Shingles - Booking:   AW-XXXXXXXXXX / shingles_book_label
Shingles - Lead:      AW-XXXXXXXXXX / shingles_lead_label
Shingles - Call:      AW-XXXXXXXXXX / shingles_call_label
... (all 15)
```

> **The Conversion ID is the same across all 15** (it's your Google Ads account's ID). Only the **label** changes per action.

---

## 2. Enhanced Conversions — turn on for the account (once)

**Path:** Google Ads → Goals → Summary → click any conversion action → **Diagnostics** tab → **Enhanced Conversions** section → **Turn on** → confirm your data policy → choose **Google Tag Manager** as the setup method.

That's it at the account level. GTM will do the hashing per-tag in §5.

---

## 3. GTM — Built-In Variables & Data Layer Variables

**Path:** GTM (`GTM-PKD4WCJV`) → **Variables**.

### 3a. Enable built-ins

Under **Built-In Variables → Configure**, enable at minimum:
- Page URL, Page Path, Page Hostname
- Click URL, Click Element
- Event (Custom Event name)

### 3b. Create these Data Layer Variables

Click **User-Defined Variables → New → Data Layer Variable**. Leave "Data Layer Version" = **Version 2** for every one.

| Variable name | Data Layer Variable Name | Default |
|---|---|---|
| `DLV - service_slug` | `service_slug` | `home` |
| `DLV - page_variant` | `page_variant` | `/` |
| `DLV - event_id` | `event_id` | (blank) |
| `DLV - project_type` | `project_type` | (blank) |
| `DLV - value` | `value` | `0` |
| `DLV - currency` | `currency` | `CAD` |
| `DLV - gclid` | `gclid` | (blank) |
| `DLV - location` | `location` | (blank) |
| `DLV - phone_number` | `phone_number` | (blank) |
| `DLV - user_data.email_address` | `user_data.email_address` | (blank) |
| `DLV - user_data.phone_number` | `user_data.phone_number` | (blank) |
| `DLV - user_data.address.first_name` | `user_data.address.first_name` | (blank) |
| `DLV - user_data.address.last_name` | `user_data.address.last_name` | (blank) |
| `DLV - user_data.address.street` | `user_data.address.street` | (blank) |
| `DLV - user_data.address.country` | `user_data.address.country` | `CA` |

---

## 4. GTM — Lookup Table Variables (the magic step)

This is what lets **3 tags** fire the correct one of **15 Google Ads conversions**. Create three Lookup Table variables, all keyed on `{{DLV - service_slug}}`.

**Path:** Variables → New → **Lookup Table**.

### 4a. `LT - Booking Conversion Label`
- **Input Variable:** `{{DLV - service_slug}}`
- **Rows:**

| Input | Output |
|---|---|
| `shingles` | `shingles_book_label` *(paste your real label)* |
| `flat-roofs` | `flat_roofs_book_label` |
| `soffit-fascia-gutters` | `sfg_book_label` |
| `emergency-repairs` | `emergency_book_label` |
| `home` | `home_book_label` |

- **Set Default Value:** ☑ → `home_book_label` *(fallback if slug ever unknown)*

### 4b. `LT - Lead Conversion Label`
Same shape, but with your `_lead_label` values from the 15 conversion actions.

### 4c. `LT - Call Conversion Label`
Same shape, with your `_call_label` values.

### 4d. `LT - Conversion Value` (optional — if you want values to vary per service inside GTM instead of at the Google Ads account)

Skip this if you set the value in the Google Ads conversion action (recommended, table §1). Only use this if you want to override.

---

## 5. GTM — Triggers

**Path:** Triggers → New → **Custom Event**.

Create three:

| Trigger name | Event name (exact) | Fires on |
|---|---|---|
| `CE - form_submit` | `form_submit` | All Custom Events |
| `CE - booking_request` | `booking_request` | All Custom Events |
| `CE - call_click` | `call_click` | All Custom Events |

Leave "This trigger fires on" = **All Custom Events**. No filters needed — the events are only pushed at the right moment.

---

## 6. GTM — Google Ads Conversion Tags (3 total)

**Path:** Tags → New → **Google Ads Conversion Tracking**.

### 6a. Tag: `GAds - Lead Form Submit`

| Field | Value |
|---|---|
| **Conversion ID** | Your Google Ads Conversion ID from §1 (e.g. `AW-123456789`) |
| **Conversion Label** | `{{LT - Lead Conversion Label}}` |
| **Conversion Value** | `{{DLV - value}}` *(will be 0 from site — Google uses the action's default value from §1)* |
| **Currency Code** | `{{DLV - currency}}` |
| **Order ID (Transaction ID)** | `{{DLV - event_id}}` *(dedupe key)* |
| **Include user-provided data from your website** | ☑ **Enable** |
| **User Data Variable** | Create inline → **New Variable → User-Provided Data → Manual configuration**:  – Email → `{{DLV - user_data.email_address}}`  – Phone Number → `{{DLV - user_data.phone_number}}`  – First Name → `{{DLV - user_data.address.first_name}}`  – Last Name → `{{DLV - user_data.address.last_name}}`  – Street → `{{DLV - user_data.address.street}}`  – Country → `{{DLV - user_data.address.country}}` |
| **Triggering** | `CE - form_submit` |

### 6b. Tag: `GAds - Appointment Booking`

Identical to 6a, but:
- **Conversion Label:** `{{LT - Booking Conversion Label}}`
- **Triggering:** `CE - booking_request`

### 6c. Tag: `GAds - Call Click`

Identical to 6a, but:
- **Conversion Label:** `{{LT - Call Conversion Label}}`
- **Include user-provided data** → leave OFF (no email/phone captured at call-click time — the tap goes straight to the dialer)
- **Order ID:** `{{DLV - event_id}}`
- **Triggering:** `CE - call_click`

> **Do NOT check "Wait for tags"** — the call_click handler navigates to `tel:` immediately; GTM's transport uses `sendBeacon` and the request will complete after nav.

---

## 7. GTM — Google Ads Conversion Linker (do this once)

**Path:** Tags → New → **Conversion Linker**.

- Name: `Conversion Linker`
- Enable "Enable linking across domains" if you use subdomains (leave off otherwise)
- Trigger: **All Pages**

This stores `gclid` in a first-party cookie so cross-device attribution keeps working. Google Ads conversions won't fire without it.

---

## 8. Publish + Verify

1. GTM → **Submit** → name the version `Roofing Monkeys — Ads conversions v1`.
2. Open the site with `?gtm_debug=x` (GTM Preview / Tag Assistant will do this for you). Recommended: **Google Tag Assistant Companion** Chrome extension.
3. Test each page:

| Page | Action | Expected tag fires |
|---|---|---|
| `/shingles?gclid=test123` | Load page | Conversion Linker + page_view. `service_slug=shingles`. |
| `/shingles` | Tap header phone | `GAds - Call Click` with label = `shingles_call_label` |
| `/flat-roofs` | Tap sticky mobile call bar | `GAds - Call Click` with label = `flat_roofs_call_label` |
| `/emergency-repairs` | Tap hero "Call Now" | `GAds - Call Click` with label = `emergency_call_label` |
| `/soffit-fascia-gutters` | Submit form (test data) | `GAds - Lead Form Submit` with label = `sfg_lead_label`, `user_data` shown as hashed in Tag Assistant |
| `/booking` (after form submit on shingles) | Pick a day/time → Confirm | `GAds - Appointment Booking` with label = `shingles_book_label` |

4. In Google Ads → Goals → check **Diagnostics** on each conversion action. Status should move to **"Recording conversions"** within ~3 hours of the first real fire.

---

## 9. Link Google Ads Campaigns to Their Service's Conversions

Each search campaign should only optimize toward its own service — otherwise your Shingles campaign will start chasing cheap SFG conversions.

**Path per campaign:** Campaign → Settings → **Goals** → Uncheck "Use account-default goals" → **Select conversion goals for this campaign**.

| Search campaign | Set as goals |
|---|---|
| Search - Shingles (GTA) | ☑ `Shingles - Booking` (Primary), ☑ `Shingles - Lead`, ☑ `Shingles - Call` |
| Search - Flat Roofs (GTA) | ☑ `Flat Roofs - Booking`, `Flat Roofs - Lead`, `Flat Roofs - Call` |
| Search - Soffit/Fascia/Gutters | ☑ `SFG - Booking`, `SFG - Lead`, `SFG - Call` |
| Search - Emergency Repairs | ☑ `Emergency - Booking`, `Emergency - Call` (both Primary), `Emergency - Lead` |
| Search - Roofing GTA (generic) | ☑ `Home - Booking`, `Home - Lead`, `Home - Call` |

**Landing pages:**
- Shingles campaign → final URL `https://roofingmonkeys.ca/shingles`
- Flat Roofs → `/flat-roofs`
- SFG → `/soffit-fascia-gutters`
- Emergency → `/emergency-repairs`
- Generic → `/`

Add `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}&gclid={gclid}` as your **Tracking template** at the account level so all URLs get UTMs (the site captures them automatically).

---

## 10. Bidding Recommendations

- **Weeks 1–2:** Manual CPC with all campaigns at a starting bid roughly 25% under Google's suggested top-of-page bid. Goal is data.
- **Weeks 3+:** Once each campaign has ≥ 15 conversions/30 days:
  - **Shingles / Flat Roofs / Home:** switch to **Maximize Conversion Value** with a tROAS of 200% (i.e. spend $1 to earn back $2 in reported conversion value).
  - **Emergency:** **Maximize Conversions** with a tCPA of $100 (calls only convert if urgent — you want volume).
  - **SFG:** **Maximize Conversions** with a tCPA of $30–40.

Revisit the per-action Value in §1 after the first 30 conversions of each type — you'll have real close rates by then.

---

## 11. Troubleshooting cheat sheet

| Symptom | Fix |
|---|---|
| Tag Assistant shows `service_slug = undefined` | User landed directly on `/booking` without going through a variant. `setServiceContext` only runs on landing pages. This is expected for direct navigation — the Lookup Table default (`home`) will fire the Home conversion. |
| "Enhanced Conversions" status shows "Received user-provided data: No" | The GTM user-data variable isn't reading the nested path. Confirm your DLV names use dot notation exactly: `user_data.email_address`. |
| Call conversions double-count | You forgot to set **Count = "One"** in §1. Edit the Call conversion actions. |
| Booking fires but no `service_slug` | The user cleared their sessionStorage between the form and booking. Rare (private browsing). Falls back to `home`. |
| I want to add a 6th service | 1) Add variant to `serviceVariants.js`, 2) add mapping in `tracking.js` `SERVICE_KEY_TO_SLUG`, 3) create 3 new Google Ads conversion actions, 4) add 3 rows to the 3 Lookup Tables in GTM, 5) publish. No new tags needed. |

---

## 12. One-page summary

- **15** conversion actions in Google Ads (3 events × 5 services)
- **3** conversion tags in GTM (Lead / Booking / Call)
- **3** custom event triggers
- **3** Lookup Table variables map `service_slug` → the correct conversion label
- **1** Conversion Linker tag
- **1** Enhanced Conversions setup at the account level
- **5** campaigns → each targets only its service's goals
