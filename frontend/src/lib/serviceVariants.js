// Service-specific landing page copy for Google Ads relevancy score.
// Each variant swaps hero, offer, FAQ, meta tags, offer amount, form default,
// and reorders the services grid so the promoted service leads.
//
// IMPORTANT: every claim in this file must be real. No invented reviews,
// statistics, response times, certifications, guarantees or awards.

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

// Baseline variant. Any field missing on a specific variant falls back here.
export const GENERAL_VARIANT = {
  slug: "/",
  serviceKey: "",
  pageTitle: "Toronto & GTA Roofing Company | Roofing Monkeys",
  metaDescription: "Roofing Monkeys is a licensed and insured Toronto roofing company serving the entire GTA. Shingles, flat roofs, soffit/fascia/gutters, roof repair and emergency service. $1,500 OFF new roofs.",

  // Above-the-fold
  serviceLabel: "Roofing in Toronto & the GTA",
  heroBadge: "$1,500 OFF Your New Roof — Limited Time",
  heroH1: "Toronto & GTA Roofing — Done Right, Done Once",
  heroSubtitle: "Roofing Monkeys is a licensed and insured Toronto roofing company serving homeowners across the entire GTA — from shingle replacements to flat roofs, soffit and fascia, and emergency repairs.",
  heroBullets: [
    "Shingles, Flat Roofs, Metal, Soffit & Emergency Repairs",
    "Toronto & Greater Toronto Area — Free On-Site Estimate",
    "Workmanship Warranty + Manufacturer Material Warranty",
    "Licensed, WSIB-Covered & Fully Insured",
  ],

  // CTAs
  primaryCta: "Get My Free Roofing Estimate",
  secondaryCta: "Call Roofing Monkeys",
  phoneFirst: false,               // when true, call CTA takes priority over form
  formTagline: "Takes 30 seconds • No obligation",

  // Services grid
  servicesEyebrow: "Our Services",
  servicesH2: "Roofing Services Across Toronto & the GTA",
  servicesSubtitle: "From a full shingle replacement to a flat roof, soffit-fascia-gutter package or an emergency leak — pick the service you need and we'll take it from there.",
  primaryServiceKey: null,

  // Offer section
  offerEyebrow: "Limited Time Offer",
  offerH2: "Get $1,500 Off Your New Roof",
  offerBody: "Book a free on-site estimate this month and lock in $1,500 OFF a new roof. Available to homeowners across Toronto and the GTA.",
  offerCta: "Get My Free Roofing Estimate",

  // Process section
  processH2: "How Your Roofing Project Works With Roofing Monkeys",

  // About/details section (new — service-specific body copy for Google & humans)
  aboutH2: "About Roofing Monkeys",
  aboutParagraphs: [
    "Roofing Monkeys is a Toronto-based roofing company serving the Greater Toronto Area. Our crews handle every part of the roofline — asphalt shingles, flat roofs, metal roofs, soffit and fascia, seamless eavestrough, and emergency roof repair — so you deal with one licensed and insured team from estimate to final clean-up.",
    "Every roof starts with a free on-site inspection and a written, no-obligation quote. If you move forward, we walk you through the exact scope of work, the materials we recommend, and the timeline before we book you in. Most residential roofs in the GTA are completed in one to three days.",
    "Roofing Monkeys is fully licensed, WSIB-covered and carries liability insurance, and every roof we install is backed by our workmanship warranty on top of the manufacturer's material warranty. When you're ready to move forward, use the form on this page or call us directly.",
  ],

  // Final CTA
  finalCtaH2: "Ready to Get Your Roof Done Right?",
  finalCtaBody: "Book your free on-site estimate now and lock in your $1,500 savings on a new roof.",

  // FAQ
  faqItems: [
    { question: "What roofing services do you offer in Toronto?", answer: "We handle asphalt shingle replacement and repair, flat roofs (modified bitumen and TPO), metal roofs, soffit and fascia, seamless eavestrough, leaf guards, and 24/7 emergency roof repair — everywhere across Toronto and the GTA." },
    { question: "How long does a new roof take to install?", answer: "Most residential shingle roofs in the GTA are completed in 1–3 days. Flat roofs and larger or more complex roofs may take a little longer. You'll get a firm timeline in writing before we start." },
    { question: "Do you offer financing?", answer: "Yes — we offer flexible financing options so you don't have to pay everything up front. During your free on-site estimate we'll walk you through the plans available and find a monthly payment that fits your budget." },
    { question: "How much does a new roof cost in the GTA?", answer: "Roof cost depends on the size of the home, slope, materials, ventilation, and how much underlying repair is needed. Every estimate we give is free, written and no-obligation — and you get $1,500 OFF a new roof when you book through this page." },
    { question: "Are you licensed and insured?", answer: "Yes — Roofing Monkeys is fully licensed, WSIB-covered, and carries full liability insurance. Every job is backed by a workmanship warranty in addition to the manufacturer's material warranty." },
  ],
};

const build = (v) => ({ ...GENERAL_VARIANT, ...v });

export const SHINGLES_VARIANT = build({
  slug: "/shingles",
  serviceKey: "shingles",
  primaryServiceKey: "shingles",
  pageTitle: "Shingle Roof Installation & Replacement Toronto | Roofing Monkeys",
  metaDescription: "Shingle roof replacement and new asphalt shingle installation across Toronto and the GTA. Free on-site estimate, $1,500 OFF a new shingle roof, workmanship warranty from Roofing Monkeys.",

  serviceLabel: "Shingle Roof Replacement in Toronto & the GTA",
  heroBadge: "$1,500 OFF Your New Shingle Roof",
  heroH1: "Shingle Roof Replacement in Toronto & the GTA — Installed in 1–3 Days",
  heroSubtitle: "Full asphalt shingle roof replacement and new roof installation across Toronto and the GTA. Free on-site estimate, written quote, and a licensed Roofing Monkeys crew from tear-off to final clean-up.",
  heroBullets: [
    "Asphalt Shingle Roof Replacement Across the GTA",
    "Free On-Site Estimate — Written Quote, No Obligation",
    "Most Shingle Roofs Completed in 1–3 Days",
    "Workmanship Warranty + Manufacturer Material Warranty",
  ],

  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services Roofing Monkeys Offers",
  servicesSubtitle: "Shingle roof replacement is what we're best known for — but our GTA crews also handle flat roofs, metal, soffit, fascia, gutters and emergency roof repair.",

  offerH2: "Get $1,500 Off Your New Shingle Roof",
  offerBody: "Book a free on-site shingle roof estimate this month and lock in $1,500 OFF your new asphalt shingle roof. Toronto and GTA homeowners only.",
  offerCta: "Get My Free Shingle Roof Estimate",

  processH2: "How Your Shingle Roof Replacement Works",

  aboutH2: "About Shingle Roof Replacement With Roofing Monkeys",
  aboutParagraphs: [
    "Most Toronto and GTA homes are due for a new asphalt shingle roof somewhere between 15 and 25 years — sooner if you're seeing curling shingles, granule loss in the eavestrough, dark streaks, or interior water stains. Roofing Monkeys handles the full shingle roof replacement from start to finish: booking, tear-off, deck inspection, underlayment and shingle installation, and property clean-up.",
    "Every shingle roof we install starts with a free on-site estimate and a written, no-obligation quote. We walk your roof, check the current ventilation and flashing, and give you real options — architectural asphalt shingles, colour choices, and warranty tiers — before you commit to anything.",
    "On installation day, our crews strip your roof down to the deck, replace any rotten sheathing, install ice & water shield along the eaves and valleys, run breathable synthetic underlayment, and fasten the new shingles to manufacturer spec. Most single-family GTA shingle roofs are done in one to three days, cleaned up with a magnetic sweep for nails before we leave, and backed by our Roofing Monkeys workmanship warranty on top of the shingle manufacturer's material warranty.",
  ],

  finalCtaH2: "Ready for a New Shingle Roof?",
  finalCtaBody: "Book your free on-site shingle roof estimate today and lock in your $1,500 savings.",

  faqItems: [
    { question: "How long does a shingle roof replacement take?", answer: "Most residential shingle roofs in Toronto and the GTA are done in 1–3 days. Larger or more complex roofs may take a fourth day. You'll get a firm timeline in writing before we book you in." },
    { question: "Which shingle brands does Roofing Monkeys install?", answer: "We install architectural asphalt shingles from major manufacturers. During your free estimate we'll walk you through the colour lines available and the manufacturer warranty options that come with each." },
    { question: "How much does a new shingle roof cost in Toronto?", answer: "Shingle roof pricing in the GTA depends on roof size, pitch, layers to tear off, ventilation and shingle line. Every quote we give is free, written and no-obligation — with $1,500 OFF a new shingle roof when you book through this page." },
    { question: "Do you tear off the old shingles or roof over them?", answer: "We strongly recommend a full tear-off. It exposes any rotten sheathing, lets us install fresh ice & water shield and underlayment, and gets you the full manufacturer warranty. We only roof over an existing layer in specific cases we'd discuss on-site." },
    { question: "Are you licensed and insured for shingle roofing?", answer: "Yes — Roofing Monkeys is fully licensed, WSIB-covered, and carries full liability insurance. Every shingle roof we install is backed by our workmanship warranty on top of the manufacturer's material warranty." },
  ],
});

export const FLAT_ROOF_VARIANT = build({
  slug: "/flat-roofs",
  serviceKey: "flat-roof",
  primaryServiceKey: "flat-roof",
  pageTitle: "Flat Roof Replacement & Repair Toronto | Roofing Monkeys",
  metaDescription: "Flat roof replacement and repair across Toronto and the GTA. Modified bitumen, TPO membrane, torch-on flat roofing and ponding fixes. Free on-site estimate and $1,500 OFF a new flat roof.",

  serviceLabel: "Flat Roof Replacement & Repair in Toronto & the GTA",
  heroBadge: "$1,500 OFF Your New Flat Roof",
  heroH1: "Flat Roof Replacement & Repair in Toronto & the GTA",
  heroSubtitle: "Flat roof specialists serving Toronto and the entire GTA. Modified bitumen, TPO membrane and torch-on flat roofing — installed and repaired by a licensed and insured Roofing Monkeys crew, with a free on-site estimate.",
  heroBullets: [
    "Flat Roof Replacement Across Toronto & the GTA",
    "Modified Bitumen, TPO Membrane & Torch-On Systems",
    "Free On-Site Estimate — Written Quote, No Obligation",
    "Workmanship Warranty + Manufacturer Material Warranty",
  ],

  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services Roofing Monkeys Offers",
  servicesSubtitle: "Flat roofs are a Roofing Monkeys specialty — but our GTA crews also handle shingle roofs, metal roofs, soffit and fascia, gutters and emergency roof repair.",

  offerH2: "Get $1,500 Off Your New Flat Roof",
  offerBody: "Book a free on-site flat roof assessment this month and lock in $1,500 OFF your new flat roof. Toronto and GTA homeowners only.",
  offerCta: "Get My Free Flat Roof Estimate",

  processH2: "How Your Flat Roof Project Works",

  aboutH2: "About Flat Roof Replacement & Repair With Roofing Monkeys",
  aboutParagraphs: [
    "Flat roofs in Toronto and the GTA take a beating — freeze-thaw cycles, snow load, and ponding water all shorten their life. Roofing Monkeys handles residential, multi-unit and small commercial flat roofs across the GTA, from single-spot leak repairs to full flat roof replacements.",
    "Every flat roof project starts with a free on-site assessment and a written, no-obligation quote. We inspect the current membrane, seams, flashings, drains and slope, identify the actual source of any leak (which is rarely where the water shows up inside), and give you honest options — repair vs. full replacement, and the right membrane system for the roof.",
    "On installation, our GTA crews install modified bitumen (2-ply torch-on) or TPO membrane systems, correcting drainage and slope where needed, and finishing with proper flashings and terminations. Every flat roof we install is backed by our Roofing Monkeys workmanship warranty on top of the manufacturer's material warranty, and we're fully licensed, WSIB-covered and insured.",
  ],

  finalCtaH2: "Ready for a Flat Roof That Actually Lasts?",
  finalCtaBody: "Book your free on-site flat roof assessment today and lock in your $1,500 savings.",

  faqItems: [
    { question: "How long does a flat roof last in Toronto?", answer: "A properly installed modified bitumen or TPO flat roof in the GTA typically lasts 20–30 years. Real-world life expectancy comes down to installation quality, drainage and how well ponding is addressed — all things we design for on every install." },
    { question: "Modified bitumen or TPO — which flat roof system is better?", answer: "Both work well when installed properly. Modified bitumen (2-ply torch-on) is our most common residential flat-roof system for its durability in Canadian winters. TPO is a great choice for larger flat sections and light commercial buildings. We'll recommend the right system during the free on-site estimate." },
    { question: "Can Roofing Monkeys fix a flat roof that keeps leaking?", answer: "Yes. We inspect flashings, seams, penetrations and ponding, identify the actual leak source, and either repair or recommend a full replacement — always with a clear, written, no-obligation quote first." },
    { question: "How much does a flat roof replacement cost in the GTA?", answer: "Flat roof pricing depends on square footage, the system (modified bitumen vs. TPO), tear-off vs. overlay, insulation and drainage work. Every quote we give is free, written and no-obligation — with $1,500 OFF a full flat roof replacement when you book through this page." },
    { question: "Are you licensed and insured for flat roofing?", answer: "Yes. Roofing Monkeys is fully licensed, WSIB-covered and carries full liability insurance. Every flat roof we install is backed by our workmanship warranty in addition to the manufacturer's material warranty." },
  ],
});

export const SOFFIT_VARIANT = build({
  slug: "/soffit-fascia-gutters",
  serviceKey: "soffit",
  primaryServiceKey: "soffit",
  pageTitle: "Soffit, Fascia & Eavestrough Installation Toronto | Roofing Monkeys",
  metaDescription: "Aluminum soffit, fascia and seamless eavestrough installation across Toronto and the GTA. Colour-matched, leaf guards available, most jobs done in one day. Free on-site estimate from Roofing Monkeys.",

  serviceLabel: "Soffit, Fascia & Eavestrough in Toronto & the GTA",
  heroBadge: "$500 OFF Complete Soffit, Fascia & Gutter Package",
  heroH1: "Soffit, Fascia & Eavestrough Installation in Toronto & the GTA",
  heroSubtitle: "Colour-matched aluminum soffit and fascia and seamless eavestrough — installed across Toronto and the GTA by a licensed and insured Roofing Monkeys crew, with a free on-site estimate.",
  heroBullets: [
    "Soffit, Fascia & Seamless Eavestrough Across the GTA",
    "Seamless 5\" and 6\" Aluminum Eavestrough On-Site",
    "Colour-Matched Aluminum Soffit & Fascia",
    "Leaf Guard / Gutter Guard Options Available",
  ],

  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services Roofing Monkeys Offers",
  servicesSubtitle: "We handle every part of the roofline — soffit, fascia and gutters as well as shingle roofs, flat roofs, metal roofs and emergency roof repair across Toronto and the GTA.",

  offerH2: "Get $500 Off Your Complete Soffit, Fascia & Gutter Package",
  offerBody: "Book a free on-site measure this month and save $500 when you replace soffit, fascia and eavestrough together across Toronto and the GTA.",
  offerCta: "Get My Free Soffit, Fascia & Gutter Estimate",

  processH2: "How Your Soffit, Fascia & Gutter Project Works",

  aboutH2: "About Soffit, Fascia & Eavestrough With Roofing Monkeys",
  aboutParagraphs: [
    "Soffit, fascia and eavestrough are the parts of the roofline most Toronto homeowners never think about — until they sag, leak, or stop draining. Roofing Monkeys handles complete soffit and fascia replacement plus seamless aluminum eavestrough across Toronto and the GTA, either on their own or bundled with a new roof.",
    "Every project starts with a free on-site measure and a written, no-obligation quote. We look at the state of the existing fascia (which often means the eavestrough behind it is also compromised), your soffit ventilation, and whether leaf guards make sense for your home — especially useful under mature GTA trees.",
    "On installation day our crews roll seamless 5\" or 6\" aluminum eavestrough right at your home so there are no joints between corners to leak, install colour-matched aluminum soffit and fascia, and finish the job — usually in a single day for a standard single-family home. Every install is backed by our Roofing Monkeys workmanship warranty on top of the material warranty, and we're fully licensed, WSIB-covered and insured.",
  ],

  finalCtaH2: "Ready to Refresh Your Roofline?",
  finalCtaBody: "Book your free soffit, fascia and eavestrough measure and lock in your $500 savings.",

  faqItems: [
    { question: "Does Roofing Monkeys install seamless eavestrough on site?", answer: "Yes — we roll seamless aluminum eavestrough right at your home in 5\" or 6\" widths, so there are no joints to leak between corners. Standard colours are usually stocked; special-order colours take a few extra days." },
    { question: "Should I replace soffit, fascia and eavestrough together?", answer: "Usually yes. Sagging fascia often means the eavestrough behind it is also compromised, and it's the perfect time to redo the soffit ventilation. Bundling everything saves you a second mobilization, which is why we offer a $500 combo discount." },
    { question: "Do you install leaf guards or gutter guards?", answer: "Yes. We offer a few leaf-guard options that stop leaves, pine needles and shingle grit from clogging the eavestrough — especially helpful on GTA homes with mature trees. We'll show you the options during the free on-site measure." },
    { question: "How long does a full soffit, fascia and eavestrough install take?", answer: "Most single-family homes across Toronto and the GTA are completed in one day. Very large homes with complex rooflines may take a second day — we'll give you a firm timeline in the written quote before we start." },
    { question: "Are you licensed and insured for exterior work?", answer: "Yes. Roofing Monkeys is fully licensed, WSIB-covered and carries full liability insurance. Every soffit, fascia and eavestrough install is backed by our workmanship warranty in addition to the manufacturer's material warranty." },
  ],
});

export const EMERGENCY_VARIANT = build({
  slug: "/emergency-repairs",
  serviceKey: "emergency",
  primaryServiceKey: "emergency",
  pageTitle: "Emergency Roof Repair Toronto & GTA — Same-Day Service | Roofing Monkeys",
  metaDescription: "Emergency roof repair across Toronto and the GTA — same-day tarping and permanent leak repair by a licensed and insured Roofing Monkeys crew. Call now or request an emergency inspection online.",

  serviceLabel: "Emergency Roof Repair in Toronto & the GTA",
  heroBadge: "Emergency Roof Repair — Toronto & GTA",
  heroH1: "Emergency Roof Repair in Toronto & the GTA — Call Roofing Monkeys",
  heroSubtitle: "Active leak, storm damage, missing shingles or tree impact? Roofing Monkeys is a licensed and insured Toronto roofing company handling emergency roof repair across the entire GTA — call now or request an emergency inspection online.",
  heroBullets: [
    "Emergency Roof Repair Across Toronto & the GTA",
    "Active Leaks, Storm Damage, Missing Shingles & Tree Impact",
    "Insurance-Claim Documentation Available",
    "Licensed, WSIB-Covered & Fully Insured",
  ],

  // Emergency page is call-first — the form is a fallback for after-hours or people who can't call.
  primaryCta: "Call Roofing Monkeys Now",
  secondaryCta: "Request Emergency Inspection",
  phoneFirst: true,
  formTagline: "Prefer not to call? Request an inspection and we'll ring you back",

  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services Roofing Monkeys Offers",
  servicesSubtitle: "Beyond emergency roof repair, our GTA crews handle full shingle, flat and metal roof replacements — plus soffit, fascia and eavestrough across Toronto and the GTA.",

  offerEyebrow: "Emergency Response",
  offerH2: "Emergency Roof Leaking? Call Roofing Monkeys Now",
  offerBody: "If your roof is leaking or you've had storm damage, call our line for the fastest response. If you'd rather not call, use the form on this page and we'll ring you back.",
  offerCta: "Call Roofing Monkeys Now",

  processH2: "How Emergency Roof Repair Works",

  aboutH2: "About Emergency Roof Repair With Roofing Monkeys",
  aboutParagraphs: [
    "When a Toronto or GTA roof starts leaking, every hour matters. Water finds its way down through insulation, drywall and flooring — turning a small roof problem into an expensive interior repair. Roofing Monkeys handles emergency roof repair across the entire GTA, from active leaks and storm damage to missing shingles, damaged flashing and tree-impact repairs.",
    "The fastest way to get help is to call us directly — the phone number on this page rings a real Roofing Monkeys team member, not a call centre. If you'd rather not call, you can submit the emergency inspection request form and we'll ring you back to book the site visit.",
    "Once we're on-site, we identify the leak source, stop the water (either with a proper storm tarp or with an immediate permanent repair, depending on conditions), and give you a clear written scope for the follow-up work. If your emergency roof repair is going through home insurance, we can photograph the damage and provide an itemized scope of repair to help move the claim along. We're fully licensed, WSIB-covered and insured, and every emergency repair is backed by our workmanship warranty.",
  ],

  finalCtaH2: "Roof Leaking Right Now?",
  finalCtaBody: "Call Roofing Monkeys for the fastest response — or request an emergency inspection online and we'll ring you back.",

  faqItems: [
    { question: "How fast can Roofing Monkeys get to my roof in an emergency?", answer: "Our fastest response is always a phone call — the number on this page reaches a real Roofing Monkeys team member. Once we've spoken to you we book your site visit as fast as the workload and weather allow." },
    { question: "Do you help with insurance claims for storm damage?", answer: "Yes. We photograph the damage, provide an itemized written scope of repair, and can meet your adjuster on-site if that helps move the claim faster. Many storm-damage roof repairs end up covered by home insurance." },
    { question: "Will Roofing Monkeys tarp my roof so it stops leaking?", answer: "When it's the right call, yes — we install a proper storm tarp that holds through Toronto weather until a permanent repair is done. In some cases we can go straight to a permanent repair on the first visit. We'll walk you through it on the phone before we come out." },
    { question: "How much does an emergency roof repair cost?", answer: "Small repairs — a missing patch of shingles, a boot flashing, a sealed nail pop — are usually a few hundred dollars. Larger storm damage or interior water damage is quoted case by case, always in writing before any work starts." },
    { question: "Are you licensed and insured?", answer: "Yes — Roofing Monkeys is fully licensed, WSIB-covered and carries full liability insurance. Every repair we complete is backed by our workmanship warranty." },
  ],
});

export const STORM_DAMAGE_VARIANT = build({
  slug: "/storm-damage-repair",
  serviceKey: "storm-damage",
  primaryServiceKey: "emergency",
  pageTitle: "Storm Damage Roof Repair Toronto & GTA — Insurance Claims Welcome | Roofing Monkeys",
  metaDescription: "Storm damage roof repair across Toronto and the GTA. Wind, hail and tree impact repairs, insurance-claim documentation, licensed and insured Roofing Monkeys crews — call now or request an inspection.",

  serviceLabel: "Storm Damage Roof Repair in Toronto & the GTA",
  heroBadge: "Storm Damage Roof Repair — Toronto & GTA",
  heroH1: "Storm Damage Roof Repair in Toronto & the GTA — Insurance Claims Welcome",
  heroSubtitle: "Wind-torn shingles, hail damage, tree impact or a leak that showed up after the last storm? Roofing Monkeys is a licensed and insured Toronto roofing company handling storm damage repairs across the GTA — we photograph the damage, write the scope, and can help move your insurance claim forward.",
  heroBullets: [
    "Wind, Hail & Tree-Impact Roof Repair Across the GTA",
    "Insurance-Claim Photos & Itemized Written Scope",
    "Emergency Tarping Available — Stops the Leak Today",
    "Licensed, WSIB-Covered & Fully Insured",
  ],

  // Phone-first like emergency — storm calls are urgent
  primaryCta: "Call Roofing Monkeys Now",
  secondaryCta: "Request Storm Damage Inspection",
  phoneFirst: true,
  formTagline: "Prefer not to call? Request an inspection and we'll ring you back",

  servicesEyebrow: "Also Available",
  servicesH2: "Other Roofing Services Roofing Monkeys Offers",
  servicesSubtitle: "Beyond storm damage repair, our GTA crews handle full shingle, flat and metal roof replacements — plus soffit, fascia and eavestrough across Toronto and the GTA.",

  offerEyebrow: "Storm Response",
  offerH2: "Roof Damage From the Last Storm? Call Roofing Monkeys",
  offerBody: "If wind, hail or a fallen branch damaged your roof, call our line and we'll schedule a same-week storm damage inspection. If your repair is going through home insurance, we'll photograph the damage on-site and give you a written itemized scope you can hand to your adjuster.",
  offerCta: "Call Roofing Monkeys Now",

  processH2: "How Storm Damage Roof Repair Works",

  aboutH2: "About Storm Damage Roof Repair With Roofing Monkeys",
  aboutParagraphs: [
    "Toronto and the GTA see wind gusts, hail and heavy summer storms every year — and asphalt shingle roofs take the hit. Lifted or torn shingles, dented metal flashing, missing ridge cap, damaged vents and impact from fallen branches are the four most common storm damage repairs we do. Left alone, any of them will eventually turn into a slow interior leak.",
    "The fastest way to get help is to call us directly — the number on this page reaches a real Roofing Monkeys team member, not a call centre. If the roof is actively leaking we can walk you through emergency tarping over the phone before we come out. If you'd rather not call, submit the storm damage inspection request form and we'll ring you back to book the site visit.",
    "Once we're on-site, we document every damaged area with photos, identify what needs to be repaired versus fully replaced, and give you a clear written scope. If your repair is being submitted to home insurance, we can provide the itemized scope of repair your adjuster will need and can meet them on-site if that helps move the claim faster. Every storm damage repair is backed by our workmanship warranty and completed by our licensed, WSIB-covered, fully insured crews.",
  ],

  finalCtaH2: "Storm Damaged Your Roof?",
  finalCtaBody: "Call Roofing Monkeys for the fastest response — or request a storm damage inspection online and we'll ring you back with an appointment.",

  faqItems: [
    { question: "Does home insurance cover storm damage roof repair?", answer: "Most home insurance policies in Ontario cover sudden storm damage — wind, hail, and tree impact are the three most common covered causes. Wear-and-tear is not covered. We can photograph the damage and provide an itemized written scope of repair to help your adjuster process the claim." },
    { question: "How fast can Roofing Monkeys inspect my storm damaged roof?", answer: "Our fastest response is always a phone call — the number on this page reaches a real Roofing Monkeys team member. Once we've spoken to you we book your on-site storm damage inspection as fast as the workload and weather allow." },
    { question: "Will you tarp my roof if it's actively leaking after the storm?", answer: "When it's the right call, yes — we install a proper storm tarp that holds through Toronto weather until the permanent repair is done. In some cases we can go straight to a permanent repair on the first visit. We'll walk you through it on the phone before we come out." },
    { question: "What kinds of storm damage do you repair?", answer: "Wind-lifted or torn shingles, hail-damaged shingles and vents, missing ridge cap and drip edge, damaged step flashing, fallen-branch impact damage, and any leaks that showed up after the storm. If it's on your roofline and the storm caused it, we can fix it." },
    { question: "Are you licensed and insured?", answer: "Yes — Roofing Monkeys is fully licensed, WSIB-covered and carries full liability insurance. Every storm damage repair we complete is backed by our workmanship warranty." },
  ],
});

export const VARIANTS = {
  general: GENERAL_VARIANT,
  shingles: SHINGLES_VARIANT,
  flatRoofs: FLAT_ROOF_VARIANT,
  soffit: SOFFIT_VARIANT,
  emergency: EMERGENCY_VARIANT,
  stormDamage: STORM_DAMAGE_VARIANT,
};
