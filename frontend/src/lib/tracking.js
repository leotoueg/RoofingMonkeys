// Front-end tracking & attribution helpers.
// Captures Google Ads / UTM click params on first visit, persists them for the
// session, and ships them with every webhook + GTM dataLayer event.

const STORAGE_KEY = "rm_tracking_v1";

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
export function pushDataLayerEvent(event, data = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const ctx = getTrackingContext();
  window.dataLayer.push({
    event,
    event_id: data.event_id || newEventId(),
    ...ctx,
    ...data,
  });
}
