// Service-specific landing page copy for Google Ads relevancy score.
// Each variant swaps hero, offer, FAQ, meta tags, offer amount, form default,
// and reorders the services grid so the promoted service leads.

// Baseline services list — the "Soffit, Fascia & Gutters" service was added
// so we can support that variant. Every variant filters/reorders this list.
export const ALL_SERVICES = [
  { key: "shingles",   title: "Shingles",           icon: "Home",     text: "Architectural & 3-tab asphalt shingles installed to manufacturer spec." },
  { key: "roof-repair",title: "Roof Repair",        icon: "Wrench",   text: "Leaks, missing shingles, flashing, valleys — fixed properly the first time." },
  { key: "flat-roof",  title: "Flat Roofs",         icon: "Hammer",   text: "Modified bitumen and TPO membrane systems for low-slope roofs." },
  { key: "metal-roof", title: "Metal Roofs",        icon: "Shield",   text: "Standing seam and metal panel roofs built to last 40+ years." },
  { key: "soffit",     title: "Soffit, Fascia & Gutters", icon: "Home", text: "Seamless aluminum eavestrough, leaf guards, colour-matched soffit & fascia." },
  { key: "emergency",  title: "Emergency Repairs",  icon: "CloudRain",text: "Storm damage and active leaks — same-day GTA response." },
];

// Helper to build a variant. Any field that's undefined falls back to the
// general values in DEFAULT_VARIANT.
export const GENERAL_VARIANT = {
  slug: "/",
  serviceKey: "",              // no pre-select on the general page
  pageTitle: "Roofing Monkeys | Roofing Services in the Greater Toronto Area",
  metaDescription: "Roofing Monkeys — Professional roofing in the Greater Toronto Area. Shingles, roof repair, flat roofs, metal roofs & emergency repairs. Get $1,500 OFF your new roof!",
  heroBadge: "$1,500 OFF Your New Roof — Limited Time",
  heroH1: "Trusted Roofing in the Greater Toronto Area — Done Right, Done Fast",
  heroSubtitle: "Shingles, flat roofs, metal roofs, repairs and 24/7 emergency service from a fully licensed and insured GTA roofing crew you can actually trust.",
  heroBullets: [
    "Asphalt Shingles, Metal & Flat Roof Specialists",
    "Free On-Site Estimate — No Pressure, No Obligation",
    "Most Roofs Completed in 1–3 Days",
    "Workmanship Warranty + Manufacturer Warranty",
  ],
  servicesEyebrow: "Our Services",
  servicesH2: "Roofing Services Across the GTA",
  servicesSubtitle: "From a single missing shingle to a full strip-and-replace, our crews handle every kind of Toronto roof.",
  offerEyebrow: "Limited Time Offer",
  offerH2: "Get $1,500 Off Your New Roof",
  offerBody: "Available for GTA homeowners who book a free consultation this month. Cannot be combined with other offers.",
  offerCta: "Check Availability",
  processH2: "How Your Roofing Project Works",
  finalCtaH2: "Ready to Upgrade Your Roof?",
  finalCtaBody: "Book your free consultation now and lock in your $1,500 savings.",
  primaryServiceKey: null,     // no reorder; keep default services order
  faqItems: [
    { question: "How long does a new roof installation take?", answer: "Most residential roof replacements in the Greater Toronto Area are completed in 1–3 days, depending on the size of the home, roof complexity and weather. Flat roof and metal roof projects may take a little longer. We give you a clear timeline before we start." },
    { question: "Do you offer financing options?", answer: "Yes — we offer flexible financing options so you don't have to pay everything up front. During your free in-home estimate we'll walk you through the available plans and find a monthly payment that fits your budget." },
    { question: "What does a new roof cost in the GTA?", answer: "Roof costs in Toronto and the surrounding GTA depend on roof size, slope, materials (asphalt shingles, metal, flat membrane) and how much underlying repair is needed. We provide free, no-obligation, written estimates — and you get $1,500 OFF your new roof when you book a consultation through this page." },
    { question: "Do you handle emergency roof repairs?", answer: "Yes. Storm damage, leaks and missing shingles can't wait. Roofing Monkeys offers same-day and next-day emergency roof repair across the Greater Toronto Area. Call us directly for the fastest response." },
    { question: "Are you licensed and insured?", answer: "Absolutely. Roofing Monkeys is a fully licensed and insured GTA roofing contractor with WSIB coverage. Every job is backed by a workmanship warranty in addition to the manufacturer's material warranty." },
  ],
};

// Utility to merge a partial variant onto the general defaults.
const build = (v) => ({ ...GENERAL_VARIANT, ...v });

export const SHINGLES_VARIANT = build({
  slug: "/shingles",
  serviceKey: "shingles",
  primaryServiceKey: "shingles",
  pageTitle: "Shingle Roof Installation & Replacement Toronto | Roofing Monkeys",
  metaDescription: "New asphalt shingle roof installation and full replacement across the Greater Toronto Area. GAF, IKO & BP shingles, 25–50 yr manufacturer warranty. $1,500 OFF this month.",
  heroBadge: "$1,500 OFF Your New Shingle Roof — Limited Time",
  heroH1: "New Shingle Roof in the GTA — Installed in 1–3 Days",
  heroSubtitle: "Full asphalt-shingle installation and roof replacement across Toronto and the GTA. Architectural shingles from GAF, IKO and BP, installed by a licensed Roofing Monkeys crew with a workmanship warranty on top of the manufacturer's warranty.",
  heroBullets: [
    "Architectural Asphalt Shingles (GAF, IKO, BP)",
    "Full Tear-Off, Deck Prep & Ice & Water Shield",
    "25–50 Year Manufacturer Warranty",
    "Most Shingle Roofs Completed in 1–3 Days",
  ],
  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services We Offer",
  servicesSubtitle: "Shingle roofs are our bread and butter — but we also handle flat roofs, metal roofs, repairs and more.",
  offerH2: "Get $1,500 Off Your New Shingle Roof",
  offerBody: "Book a free on-site shingle roof estimate this month and lock in $1,500 OFF your new roof. GTA homeowners only.",
  processH2: "How Your Shingle Roof Project Works",
  finalCtaH2: "Ready for a Brand-New Shingle Roof?",
  finalCtaBody: "Book your free shingle roof estimate now and lock in your $1,500 savings.",
  faqItems: [
    { question: "How long does a shingle roof installation take?", answer: "Most residential shingle roof replacements in the GTA are done in 1–3 days. Larger or more complex roofs may take a fourth day. We give you a firm timeline in writing before we start." },
    { question: "Which shingle brands do you install?", answer: "Our GTA crews install architectural asphalt shingles from GAF, IKO and BP. During your free estimate we'll walk you through the colour lines that fit your home and the manufacturer warranty options (typically 25–50 years)." },
    { question: "How much does a new shingle roof cost in Toronto?", answer: "Shingle roof pricing in the GTA depends on roof size, pitch, layers to tear off, ventilation and shingle line. Most single-family homes fall into a predictable range and every quote we give is free, written and no-obligation — with $1,500 OFF when you book through this page." },
    { question: "Do you tear off the old shingles or roof over them?", answer: "We strongly recommend a full tear-off. It exposes any rotten sheathing, gives us a chance to install fresh ice & water shield + underlayment, and gets you the full manufacturer warranty. We only roof over an existing layer in very specific cases we'll discuss on-site." },
    { question: "Are you licensed and insured for shingle roofing?", answer: "Yes — Roofing Monkeys is fully licensed, WSIB-covered, and carries full liability insurance. Every shingle roof we install comes with a Roofing Monkeys workmanship warranty on top of the manufacturer's material warranty." },
  ],
});

export const FLAT_ROOF_VARIANT = build({
  slug: "/flat-roofs",
  serviceKey: "flat-roof",
  primaryServiceKey: "flat-roof",
  pageTitle: "Flat Roof Replacement & Repair Toronto | Roofing Monkeys",
  metaDescription: "Flat roof specialists serving the Greater Toronto Area. Modified bitumen, TPO membrane, torch-on roofing, ponding & drainage fixes. $1,500 OFF flat roof replacement this month.",
  heroBadge: "$1,500 OFF Your New Flat Roof — Limited Time",
  heroH1: "Flat Roof Specialists for Toronto Homes & Commercial Buildings",
  heroSubtitle: "Modified bitumen, TPO membrane and torch-on flat roofing installed by a fully licensed and insured GTA crew. We fix ponding, drainage and leaks that other roofers walked away from.",
  heroBullets: [
    "Modified Bitumen & TPO Membrane Systems",
    "Torch-On Installation by Certified Applicators",
    "Ponding, Drainage & Slope Corrections",
    "Residential, Multi-Unit & Commercial Flat Roofs",
  ],
  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services We Offer",
  servicesSubtitle: "Flat roofs are a specialty — but we also handle shingles, metal roofs, repairs and more across the GTA.",
  offerH2: "Get $1,500 Off Your New Flat Roof",
  offerBody: "Book a free on-site flat roof assessment this month and lock in $1,500 OFF your new flat roof.",
  processH2: "How Your Flat Roof Project Works",
  finalCtaH2: "Ready for a Flat Roof That Actually Lasts?",
  finalCtaBody: "Book your free flat roof assessment now and lock in your $1,500 savings.",
  faqItems: [
    { question: "How long does a flat roof last in Toronto?", answer: "A properly installed modified bitumen or TPO flat roof in the GTA lasts 20–30 years. Life expectancy comes down to installation quality, slope/drainage and how well ponding is addressed — all things we specifically design for." },
    { question: "Modified bitumen vs. TPO — which is better?", answer: "Both are excellent when installed correctly. Modified bitumen (2-ply torch-on) is our most common residential flat-roof system for its durability and Canadian winter performance. TPO is a great choice for larger flat sections and commercial buildings. We'll recommend the right system during the free estimate." },
    { question: "Can you fix a flat roof that keeps leaking?", answer: "Yes. We inspect flashings, seams, penetrations and ponding areas, identify the actual leak source (which is rarely where the water shows up inside), and either repair or recommend a full replacement — always with a clear written quote." },
    { question: "How much does a flat roof cost in the GTA?", answer: "Flat roof pricing depends on square footage, system (modified bitumen vs. TPO), tear-off vs. overlay, insulation and drainage work. Every quote is free, written and no-obligation, with $1,500 OFF a full flat roof replacement when you book through this page." },
    { question: "Are you licensed and insured for flat roofing?", answer: "Yes. Roofing Monkeys is fully licensed, WSIB-covered and carries full liability insurance. Every flat roof we install is backed by our workmanship warranty in addition to the manufacturer's material warranty." },
  ],
});

export const SOFFIT_VARIANT = build({
  slug: "/soffit-fascia-gutters",
  serviceKey: "soffit",
  primaryServiceKey: "soffit",
  pageTitle: "Soffit, Fascia & Gutters Installation Toronto | Roofing Monkeys",
  metaDescription: "Aluminum soffit, fascia and seamless eavestrough installation across the Greater Toronto Area. Colour-matched, leaf guards available, most jobs done in one day. Free GTA quote.",
  heroBadge: "$500 OFF Complete Soffit, Fascia & Gutter Package",
  heroH1: "Aluminum Soffit, Fascia & Seamless Gutters — Installed Across the GTA",
  heroSubtitle: "Colour-matched aluminum soffit and fascia, seamless 5\" and 6\" eavestrough, and leaf guards installed in a single day by a licensed and insured Roofing Monkeys crew.",
  heroBullets: [
    "Seamless 5\" and 6\" Aluminum Eavestrough",
    "Colour-Matched Aluminum Soffit & Fascia",
    "Leaf Guard / Gutter Guard Options",
    "Most Complete Installs Done in One Day",
  ],
  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services We Offer",
  servicesSubtitle: "We handle every part of the roof line — shingles, flat roofs, metal, repairs and emergency service across the GTA.",
  offerEyebrow: "Limited Time Offer",
  offerH2: "Get $500 Off Your Complete Soffit, Fascia & Gutter Package",
  offerBody: "Book a free measure this month and save $500 when you replace soffit, fascia and eavestrough together.",
  offerCta: "Check Availability",
  processH2: "How Your Soffit, Fascia & Gutter Project Works",
  finalCtaH2: "Ready to Refresh Your Roofline?",
  finalCtaBody: "Book your free soffit, fascia and gutter measure and lock in your $500 savings.",
  faqItems: [
    { question: "Do you install seamless eavestrough on site?", answer: "Yes — we roll seamless aluminum eavestrough right at your home in 5\" or 6\" widths, so there are no joints to leak between corners. Standard colours are stocked; special-order colours take a few extra days." },
    { question: "Should soffit, fascia and gutters be replaced together?", answer: "Usually yes. Old, sagging fascia often means the eavestrough behind it is also compromised, and it's the perfect time to redo the soffit ventilation. Bundling saves you a second mobilization fee — which is exactly why we offer a $500 combo discount." },
    { question: "Do you install leaf guards or gutter guards?", answer: "Yes. We offer a few leaf-guard options that stop leaves, pine needles and shingle grit from clogging the eavestrough — especially helpful on GTA homes with mature trees. We'll show you the options during the free measure." },
    { question: "How long does a full soffit, fascia and gutter install take?", answer: "Most single-family GTA homes are completed in one day. Very large homes with complex rooflines may take a second day. We'll give you a firm timeline in the written quote before we start." },
    { question: "Are you licensed and insured for exterior work?", answer: "Yes. Roofing Monkeys is fully licensed, WSIB-covered and carries full liability insurance. Every soffit, fascia and eavestrough install is backed by our workmanship warranty in addition to the manufacturer's material warranty." },
  ],
});

export const EMERGENCY_VARIANT = build({
  slug: "/emergency-repairs",
  serviceKey: "emergency",
  primaryServiceKey: "emergency",
  pageTitle: "24/7 Emergency Roof Repair Toronto | Same-Day Service — Roofing Monkeys",
  metaDescription: "24/7 emergency roof repair in the Greater Toronto Area. Active leaks, storm damage, missing shingles — same-day tarping and permanent repair. Call Roofing Monkeys now.",
  heroBadge: "Same-Day Emergency Roof Response — Free Inspection",
  heroH1: "Emergency Roof Repair in the GTA — On Site Today",
  heroSubtitle: "Active leak, storm damage, missing shingles or tree impact? Roofing Monkeys is a licensed and insured GTA roofing crew that will tarp your roof today and complete a permanent repair fast — with full insurance-claim documentation if you need it.",
  heroBullets: [
    "Same-Day Emergency Tarping Across the GTA",
    "Active Leaks Sealed Within 24 Hours",
    "Storm & Wind Damage — Insurance Claim Support",
    "24/7 Phone Line — Real Roofer, Not a Call Centre",
  ],
  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services We Offer",
  servicesSubtitle: "Beyond emergency repairs, our GTA crews handle full shingle, flat and metal roof replacements — plus soffit, fascia and eavestrough.",
  offerEyebrow: "Emergency Response",
  offerH2: "Free Same-Day Emergency Roof Inspection",
  offerBody: "Book a same-day inspection and we'll tarp any active leak on the spot at no extra charge. If a full repair is needed, you get a written quote before any work starts.",
  offerCta: "Get Emergency Help Now",
  processH2: "How Emergency Roof Repair Works",
  finalCtaH2: "Roof Leaking Right Now?",
  finalCtaBody: "Call our 24/7 line or request a same-day inspection — we can be on site today.",
  faqItems: [
    { question: "How fast can you get to my roof in an emergency?", answer: "Most GTA emergencies get a same-day site visit and temporary tarping. Depending on the time of day and current storm workload, we're typically on-site within 2–6 hours of your call. Overnight emergencies are handled first thing in the morning." },
    { question: "Do you help with insurance claims for storm damage?", answer: "Yes. We photograph the damage, provide an itemized written scope of repair, and can meet your adjuster on-site if that helps move the claim faster. Many of our storm-damage repairs end up fully covered by home insurance." },
    { question: "How much does an emergency roof repair cost?", answer: "Small repairs (a missing patch of shingles, a boot flashing, a sealed nail pop) are often a few hundred dollars. Larger storm damage or interior water damage is quoted case by case — always in writing before any work starts. The same-day inspection is free." },
    { question: "Will you tarp my roof today so it stops leaking?", answer: "Yes — that's the whole point of an emergency response. We install a proper storm tarp (not a blue plastic sheet) that will hold through Toronto weather until a permanent repair is completed within days." },
    { question: "Are you licensed, insured and available at night?", answer: "Fully licensed, WSIB-covered, and insured. Our 24/7 emergency line rings to a real roofer, not a call centre. If it's safe to work at night, we will — otherwise we'll tarp at first light and do the permanent repair as soon as conditions allow." },
  ],
});

export const VARIANTS = {
  general: GENERAL_VARIANT,
  shingles: SHINGLES_VARIANT,
  flatRoofs: FLAT_ROOF_VARIANT,
  soffit: SOFFIT_VARIANT,
  emergency: EMERGENCY_VARIANT,
};
