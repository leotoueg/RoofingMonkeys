// Front-end tracking & attribution helpers.
// Captures Google Ads / UTM click params on first visit, persists them for the
// session, and ships them with every webhook + GTM dataLayer event.

const STORAGE_KEY = "rm_tracking_v1";
const SERVICE_KEY = "rm_service_v1";

// Map internal serviceKey (from serviceVariants.js) -> Google Ads slug used
// in campaign / conversion action names. Keep in sync with GTM lookup tables.
const SERVICE_KEY_TO_SLUG = {
  "": "home",
  general: "home",
  shingles: "shingles",
  "flat-roof": "flat-roofs",
  soffit: "soffit-fascia-gutters",
  emergency: "emergency-repairs",
};

export function toServiceSlug(serviceKey) {
  if (!serviceKey) return "home";
  return SERVICE_KEY_TO_SLUG[serviceKey] || "home";
}

// Persist the current variant's service slug so BookingPage (which is not
// route-bound to a variant) can inherit it for conversion segmentation.
export function setServiceContext(serviceKey, slug) {
  try {
    sessionStorage.setItem(
      SERVICE_KEY,
      JSON.stringify({
        service_slug: toServiceSlug(serviceKey),
        page_variant: slug || "/",
        service_key: serviceKey || "",
      })
    );
  } catch {
    /* swallow */
  }
}

export function getServiceContext() {
  try {
    const raw = sessionStorage.getItem(SERVICE_KEY);
    return raw ? JSON.parse(raw) : { service_slug: "home", page_variant: "/", service_key: "" };
  } catch {
    return { service_slug: "home", page_variant: "/", service_key: "" };
  }
}

const TRACKING_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

function safeGetSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeSetSession(obj) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    /* swallow */
  }
}

// Read params from the current URL.
function readUrlParams() {
  if (typeof window === "undefined") return {};
  const out = {};
  try {
    const sp = new URLSearchParams(window.location.search);
    TRACKING_PARAMS.forEach((p) => {
      const v = sp.get(p);
      if (v) out[p] = v;
    });
  } catch {
    /* swallow */
  }
  return out;
}

// Call this once per page mount. Merges URL params into session storage so we
// keep the *first* click attribution even after internal navigation.
export function initTracking() {
  const existing = safeGetSession() || {};
  const fromUrl = readUrlParams();

  const merged = {
    // First-touch values win — never overwrite an existing gclid/utm
    ...fromUrl,
    ...existing,
    // Always refresh the landing URL & referrer of the very first visit
    landing_url: existing.landing_url || (typeof window !== "undefined" ? window.location.href : ""),
    referrer: existing.referrer || (typeof document !== "undefined" ? document.referrer : ""),
  };

  safeSetSession(merged);
  return merged;
}

export function getTrackingContext() {
  return safeGetSession() || {};
}

// Generate a unique event id so GTM / GA4 / Ads can dedupe duplicate fires.
export function newEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

// Single source of truth for dataLayer pushes.
// Every event automatically carries first-touch attribution (gclid/utm),
// service_slug + page_variant (so a single GTM tag can fan out to per-service
// Google Ads conversions via a Lookup Table), and a unique event_id for dedupe.
export function pushDataLayerEvent(event, data = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const ctx = getTrackingContext();
  const svc = getServiceContext();
  window.dataLayer.push({
    event,
    event_id: data.event_id || newEventId(),
    service_slug: svc.service_slug,
    page_variant: svc.page_variant,
    ...ctx,
    ...data,
  });
}

// Build a user_data object for Google Ads Enhanced Conversions.
// GTM's Google Ads conversion tag will hash email/phone client-side when
// "Include user-provided data from your website" is enabled and pointed
// at this variable. Never store hashed values here — pass raw and let
// Google's tag hash them (SHA-256) at fire-time.
export function buildUserData(lead = {}) {
  const email = (lead.email || "").trim().toLowerCase();
  const phone = (lead.phone || "").replace(/[^\d+]/g, "");
  // Normalize to E.164 (Canadian numbers default to +1)
  const phoneE164 = phone
    ? phone.startsWith("+")
      ? phone
      : phone.length === 10
      ? "+1" + phone
      : "+" + phone
    : "";
  const nameParts = (lead.name || "").trim().split(/\s+/);
  const first_name = nameParts[0] || "";
  const last_name = nameParts.slice(1).join(" ") || "";
  return {
    email_address: email,
    phone_number: phoneE164,
    address: {
      first_name,
      last_name,
      street: lead.address || "",
      country: "CA",
    },
  };
}

// Fire a Meta Pixel event safely. Falls back to a no-op if fbq isn't loaded
// (e.g. ad blocker), so callers never need to null-check.
// `eventID` is passed so server-side Conversions API events from
// LeadConnector can dedupe against the browser-side pixel hit.
export function fbqTrack(eventName, params = {}, eventID) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (eventID) {
      window.fbq("track", eventName, params, { eventID });
    } else {
      window.fbq("track", eventName, params);
    }
  } catch (e) {
    /* never block UX on a tracking failure */
  }
}
