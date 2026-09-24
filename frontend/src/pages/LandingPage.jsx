import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, CheckCircle, Star, Shield, Award, MapPin, Clock, ChevronDown, ChevronUp, Users, Wrench, Calendar, Home, Hammer, CloudRain } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { initTracking, getTrackingContext, pushDataLayerEvent, newEventId, fbqTrack, setServiceContext, buildUserData, toServiceSlug } from "../lib/tracking";
import { GENERAL_VARIANT, ALL_SERVICES } from "../lib/serviceVariants";

const PHONE_NUMBER = "+1 (647) 954-1671";
const PHONE_HREF = "tel:+16479541671";
// Form submission webhook (LeadConnector)
const FORM_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/wNdMd0x1lxovpPbrakSW/webhook-trigger/a98af371-4fca-4209-ba78-63c1ed1d8862";

// Brand assets (self-hosted in /public — no external CDN dependency)
const LOGO_URL = "/brand/logo.jpg";
const LOGO_HERO_URL = "/brand/logo-dark.png";

// Map string icon names in ALL_SERVICES to lucide components
const ICON_MAP = { Home, Wrench, Hammer, Shield, CloudRain };

// GTM helper (delegates to shared tracking module so every event carries
// the first-touch gclid / utm context automatically)
const pushToDataLayer = (event, data = {}) => pushDataLayerEvent(event, data);

// Real Roofing Monkeys project photos (all self-hosted for deploy portability)
const projectImages = [
  { url: "/photos/shingles.jpg", alt: "Roofing Monkeys crew installing shingles", caption: "Shingle installation — Toronto" },
  { url: "/projects/rm-project-2.jpg", alt: "Crew installing IKO Cambridge architectural shingles in the GTA", caption: "IKO Cambridge shingles — GTA" },
  { url: "/projects/rm-project-3.jpg", alt: "Roofer performing shingle tear-off on a wooden roof deck", caption: "Full tear-off & deck prep" },
  { url: "/photos/flatroof.jpg", alt: "Flat roof installation by Roofing Monkeys", caption: "Flat roof replacement" },
  { url: "/projects/rm-project-1.jpg", alt: "Roof replacement job site with Roofing Monkeys dumpster", caption: "Full residential replacement" },
];

// Testimonials - Google Reviews (sourced from public reviews of Roofing Monkeys)
const testimonials = [
  { name: "Marcus T.", location: "Google Review", text: "We went with a full strip and replace. They redid all the flashing and drip edging and put down a membrane over the entire roof before the shingles were fastened. They cleaned up everything around the property and were done in less than 2 days! Really happy with the end product — the house looks great. Highly recommend this company and crew!", rating: 5 },
  { name: "Sarah L.", location: "Google Review", text: "Late this summer I hired Roofing Monkeys to install fascia all around my house and soffits around the porch. The process and work was amazing. Camilo came out super quick to provide a quote and the work was completed faster than anticipated. The price was fair, even beating out some of the competitors.", rating: 5 },
  { name: "David R.", location: "Google Review", text: "He showed me the options and guided me through the process — replacing the gutters, installing leaf guards, fascia, soffits, and even a solar fan. They also removed my chimney with care. That's how they build trust, and we've already booked them again for next year to replace our shingles.", rating: 5 },
  { name: "Jennifer K.", location: "Google Review", text: "Our 3rd floor deck was in very bad condition. Roofing Monkeys offered both deck removal and a new flat roof in one day. The demolition was seamless. Exceptional professional work from start to finish. We highly recommend Roofing Monkeys!", rating: 5 },
  { name: "Michael P.", location: "Google Review", text: "Very honest — they operate with integrity and complete transparency. They explained every step clearly. The quality of their craftsmanship speaks for itself, completed on time and at a fair price. Ask for Christian, he is very knowledgeable.", rating: 5 },
  { name: "Amanda C.", location: "Google Review", text: "Christian and his team at Roofing Monkeys did a fantastic job for us. They had great attention to detail, were very conscientious, and cleaned the site thoroughly. The new roof looks fantastic and we couldn't be happier.", rating: 5 },
  { name: "Robert H.", location: "Google Review", text: "Emergency call after a bad storm took off part of our roof — the Monkeys crew was on site the same day with a tarp and had a permanent repair finished within 48 hours. Lifesavers. Fair price and zero pressure.", rating: 5 },
  { name: "Priya S.", location: "Google Review", text: "Got quotes from three GTA roofers. Roofing Monkeys weren't the cheapest, but they were the most thorough — explained the deck condition, ventilation, ice & water shield. The finished metal roof looks incredible and the warranty is solid.", rating: 5 },
];

// FAQ items are now supplied by the variant (see /lib/serviceVariants.js).

export default function LandingPage({ variant = GENERAL_VARIANT }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    projectType: variant.serviceKey || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // First-touch attribution + page_view + dynamic <title>/<meta description>
  useEffect(() => {
    initTracking();
    // Persist which service variant this session belongs to so downstream
    // events (booking, call_click on booking page) inherit the same slug.
    setServiceContext(variant.serviceKey || "", variant.slug || "/");
    pushToDataLayer("page_view", {
      page: "landing",
      page_path: variant.slug || "/",
      service_variant: variant.serviceKey || "general",
    });

    if (variant.pageTitle) document.title = variant.pageTitle;
    if (variant.metaDescription) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "description");
        document.head.appendChild(el);
      }
      el.setAttribute("content", variant.metaDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant.slug]);

  // Reorder ALL_SERVICES so the variant's primary service leads.
  const orderedServices = (() => {
    if (!variant.primaryServiceKey) return ALL_SERVICES.filter((s) => s.key !== "soffit").slice(0, 5);
    const primary = ALL_SERVICES.find((s) => s.key === variant.primaryServiceKey);
    const rest = ALL_SERVICES.filter((s) => s.key !== variant.primaryServiceKey).slice(0, 4);
    return primary ? [primary, ...rest] : ALL_SERVICES.slice(0, 5);
  })();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, projectType: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.projectType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    const eventId = newEventId();
    const tracking = getTrackingContext();

    try {
      // Send to webhook (only if configured — otherwise skip cleanly)
      if (FORM_WEBHOOK_URL) {
        await fetch(FORM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            projectType: formData.projectType,
            source: "roofing-monkeys-landing-page",
            formType: "lead_capture",
            event_id: eventId,
            timestamp: new Date().toISOString(),
            page_url: typeof window !== "undefined" ? window.location.href : "",
            ...tracking,
          }),
        });
      }

      // Push GTM dataLayer event (canonical + GA4 standard)
      // service_slug + page_variant are auto-injected by pushDataLayerEvent.
      const userData = buildUserData(formData);
      pushToDataLayer("form_submit", {
        event_category: "Lead",
        event_label: "Lead Form Submission",
        form_name: "lead_capture",
        project_type: formData.projectType,
        page: "landing",
        event_id: eventId,
        user_data: userData,
      });
      pushToDataLayer("generate_lead", {
        currency: "CAD",
        value: 0,
        form_name: "lead_capture",
        project_type: formData.projectType,
        event_id: eventId,
        user_data: userData,
      });

      // Meta Pixel — standard "Lead" event (fires on lead form submit)
      fbqTrack(
        "Lead",
        {
          content_name: "lead_capture_form",
          content_category: formData.projectType,
          currency: "CAD",
          value: 0,
        },
        eventId
      );

      // Store form data in sessionStorage for booking page
      sessionStorage.setItem("leadData", JSON.stringify(formData));

      toast.success("Thank you! Redirecting to book your inspection...");

      setTimeout(() => {
        navigate("/booking");
      }, 1000);
    } catch (error) {
      console.error("Webhook error:", error);
      // Still proceed even if webhook fails
      sessionStorage.setItem("leadData", JSON.stringify(formData));
      const userData = buildUserData(formData);
      pushToDataLayer("form_submit", {
        event_category: "Lead",
        event_label: "Lead Form Submission",
        form_name: "lead_capture",
        project_type: formData.projectType,
        page: "landing",
        event_id: eventId,
        user_data: userData,
      });
      pushToDataLayer("generate_lead", {
        currency: "CAD",
        value: 0,
        form_name: "lead_capture",
        project_type: formData.projectType,
        event_id: eventId,
        user_data: userData,
      });
      toast.success("Thank you! Redirecting to book your inspection...");
      setTimeout(() => {
        navigate("/booking");
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallClick = (sourceLocation = "header") => {
    // Canonical event for Google Ads conversion tag (all tel: taps).
    // service_slug + page_variant auto-attached by pushDataLayerEvent.
    pushToDataLayer("call_click", {
      event_category: "Conversion",
      event_label: "Click to Call",
      phone_number: PHONE_NUMBER,
      page: "landing",
      location: sourceLocation,
    });
    // Legacy events kept for existing GA4 / Meta setups
    pushToDataLayer("click_call_button", {
      event_category: "Engagement",
      event_label: "Click to Call",
      phone_number: PHONE_NUMBER,
      page: "landing",
      location: sourceLocation,
    });
    pushToDataLayer("phone_call_click", {
      phone_number: PHONE_NUMBER,
      page: "landing",
      location: sourceLocation,
    });
    window.location.href = PHONE_HREF;
  };

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* White Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50" data-testid="navbar">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <a href="/" className="brand-logo-img" data-testid="brand-logo" aria-label="Roofing Monkeys home">
            <img src={LOGO_URL} alt="Roofing Monkeys logo" />
            <span className="brand-text">
              <span className="name">Roofing Monkeys</span>
              <span className="sub">Greater Toronto Area</span>
            </span>
          </a>
          <button
            onClick={() => handleCallClick("header")}
            data-testid="header-call-button"
            className="btn-cta flex items-center gap-2 text-sm md:text-base"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">{PHONE_NUMBER}</span>
            <span className="sm:hidden">Call Now</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section relative" data-testid="hero-section">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Content */}
            <div className="text-white animate-fade-in-up">
              <div className="offer-badge mb-4">{variant.heroBadge}</div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                {variant.heroH1}
              </h1>

              <p className="text-base md:text-lg text-white/90 mb-4 leading-relaxed">
                {variant.heroSubtitle}
              </p>

              {/* Hero video (autoplay, muted, loop, playsinline) */}
              <div className="hero-video-wrap mb-5" data-testid="hero-video">
                <video
                  className="hero-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/videos/hero-poster.jpg"
                  aria-label="Roofing Monkeys crew at work"
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                </video>
              </div>

              <ul className="space-y-2 mb-5">
                {variant.heroBullets.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm md:text-base text-white/95">
                    <CheckCircle className="w-5 h-5 text-[#59C8EE] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mb-6">
                <div className="trust-badge text-xs">
                  <Shield className="w-3.5 h-3.5" /> Licensed &amp; Insured
                </div>
                <div className="trust-badge text-xs">
                  <MapPin className="w-3.5 h-3.5" /> Greater Toronto Area
                </div>
                <div className="trust-badge text-xs">
                  <Star className="w-3.5 h-3.5" /> 4.9★ Google Rated
                </div>
              </div>

              {/* Stats / Proof card (was video) */}
              <div className="mt-8 hidden lg:block">
                <p className="text-sm text-white/70 uppercase tracking-widest mb-3">Why GTA Homeowners Trust Us</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="hero-stat-card" data-testid="stat-google">
                    <div className="stat-value">4.9★</div>
                    <div className="stat-label">Google Rating</div>
                  </div>
                  <div className="hero-stat-card" data-testid="stat-roofs">
                    <div className="stat-value">500+</div>
                    <div className="stat-label">Roofs Installed</div>
                  </div>
                  <div className="hero-stat-card" data-testid="stat-turnaround">
                    <div className="stat-value">1–3</div>
                    <div className="stat-label">Day Turnaround</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div id="lead-form" className="animate-fade-in-up animation-delay-200">
              {/* Social-proof chip */}
              <div className="flex justify-center mb-3">
                <div className="social-proof-chip" data-testid="social-proof-chip">
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5" fill="currentColor" />
                    ))}
                  </span>
                  <span className="font-semibold">4.9 on Google</span>
                  <span className="dot" />
                  <span>500+ GTA Roofs</span>
                  <span className="dot" />
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Licensed &amp; Insured</span>
                </div>
              </div>

              <div className="form-card p-5 md:p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-[#043061] mb-1">Get Your Free Roof Estimate</h3>
                  <p className="text-sm text-[#475569]">{variant.formTagline}</p>
                </div>

                {/* On the emergency variant, put the call CTA above the form */}
                {variant.phoneFirst && (
                  <Button
                    onClick={() => handleCallClick("form_top_call")}
                    data-testid="form-top-call-button"
                    className="w-full h-12 mb-3 text-base font-semibold bg-[#043061] hover:bg-[#021f40] text-white rounded-full shadow-lg flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Roofing Monkeys Now
                  </Button>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm text-[#0F172A] font-medium">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      data-testid="input-name"
                      className="mt-1 h-10 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm text-[#0F172A] font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(416) 555-1234"
                      value={formData.phone}
                      onChange={handleInputChange}
                      data-testid="input-phone"
                      className="mt-1 h-10 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm text-[#0F172A] font-medium">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      data-testid="input-email"
                      className="mt-1 h-10 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm text-[#0F172A] font-medium">Property Address</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main St, Toronto, ON"
                      value={formData.address}
                      onChange={handleInputChange}
                      data-testid="input-address"
                      className="mt-1 h-10 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-[#0F172A] font-medium">Service Needed</Label>
                    <Select onValueChange={handleSelectChange} value={formData.projectType}>
                      <SelectTrigger data-testid="select-project-type" className="mt-1 h-10 border-slate-200">
                        <SelectValue placeholder="Select the service you need" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shingles">Shingles (New Roof / Replacement)</SelectItem>
                        <SelectItem value="roof-repair">Roof Repair</SelectItem>
                        <SelectItem value="flat-roof">Flat Roof</SelectItem>
                        <SelectItem value="metal-roof">Metal Roof</SelectItem>
                        <SelectItem value="soffit">Soffit, Fascia &amp; Gutters</SelectItem>
                        <SelectItem value="emergency">Emergency Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="submit-form-button"
                    className="w-full h-12 text-base font-semibold bg-[#1D67CD] hover:bg-[#1854A8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {isSubmitting ? "Submitting..." : (variant.phoneFirst ? variant.secondaryCta : variant.primaryCta)}
                  </Button>
                </form>

                {/* Secondary "call" CTA under the form on non-emergency pages */}
                {!variant.phoneFirst && (
                  <Button
                    onClick={() => handleCallClick("form_secondary_call")}
                    data-testid="form-secondary-call-button"
                    variant="outline"
                    className="w-full h-10 mt-2 text-sm font-semibold border-2 border-[#043061] text-[#043061] bg-transparent hover:bg-[#043061] hover:text-white rounded-full flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Roofing Monkeys
                  </Button>
                )}

                <p className="text-center text-sm text-[#94A3B8] mt-4">
                  Serious inquiries only — limited availability each month.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="mt-12 lg:hidden">
            <p className="text-sm text-white/70 uppercase tracking-widest mb-3">Why GTA Homeowners Trust Us</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="hero-stat-card" style={{padding: "0.9rem"}}>
                <div className="stat-value" style={{fontSize: "1.4rem"}}>4.9★</div>
                <div className="stat-label" style={{fontSize: "0.6rem"}}>Google Rating</div>
              </div>
              <div className="hero-stat-card" style={{padding: "0.9rem"}}>
                <div className="stat-value" style={{fontSize: "1.4rem"}}>500+</div>
                <div className="stat-label" style={{fontSize: "0.6rem"}}>Roofs Installed</div>
              </div>
              <div className="hero-stat-card" style={{padding: "0.9rem"}}>
                <div className="stat-value" style={{fontSize: "1.4rem"}}>1–3</div>
                <div className="stat-label" style={{fontSize: "0.6rem"}}>Day Turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase Section — auto-scrolling horizontal gallery (moved above Services) */}
      <section className="section-padding bg-[#F9F8FD]" data-testid="showcase-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 px-4">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#043061] mt-4 mb-4">
              What we do
            </h2>
            <p className="text-lg text-[#475569]">
              High-quality craftsmanship from real projects across the Greater Toronto Area.
            </p>
          </div>

          <div className="marquee" data-testid="project-marquee" aria-label="Recent roofing projects, auto-scrolling gallery">
            <div className="marquee-track">
              {[...projectImages, ...projectImages].map((img, i) => (
                <figure
                  key={i}
                  className="marquee-card"
                  data-testid={i < projectImages.length ? `project-image-${i}` : undefined}
                  aria-hidden={i >= projectImages.length ? "true" : undefined}
                >
                  <img src={img.url} alt={img.alt} loading="lazy" />
                  <figcaption className="marquee-caption">{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <p className="text-center text-[#475569] mt-8 px-4">
            Every roof is built to handle Toronto's snow, ice and summer storms.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">{variant.servicesEyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4 mb-4">
              {variant.servicesH2}
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              {variant.servicesSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {orderedServices.map((s, i) => {
              const Icon = ICON_MAP[s.icon] || Home;
              const isPrimary = i === 0 && variant.primaryServiceKey;
              return (
                <div
                  key={s.key}
                  className={`p-6 rounded-2xl border transition-all duration-200 ${
                    isPrimary
                      ? "bg-[#043061] border-[#59C8EE] shadow-lg ring-1 ring-[#59C8EE]/30"
                      : "bg-[#F9F8FD] border-[#E2E8F0] hover:border-[#59C8EE] hover:shadow-lg"
                  }`}
                  data-testid={`service-card-${i}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isPrimary ? "bg-[#59C8EE]" : "bg-[#1D67CD]"
                  }`}>
                    <Icon className={`w-6 h-6 ${isPrimary ? "text-[#043061]" : "text-white"}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${isPrimary ? "text-white" : "text-[#0F4A9C]"}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${isPrimary ? "text-white/85" : "text-[#475569]"}`}>{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="section-padding bg-[#F9F8FD]" data-testid="offer-section">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">{variant.offerEyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4 mb-4">
            {variant.offerH2}
          </h2>
          <p className="text-lg text-[#475569] mb-6">
            {variant.offerBody}
          </p>
          <div className="flex items-center justify-center gap-2 text-[#0F172A] mb-8">
            <Clock className="w-5 h-5 text-[#1D67CD]" />
            <span className="font-medium">Limited availability across the Greater Toronto Area</span>
          </div>
          <Button
            onClick={variant.phoneFirst ? () => handleCallClick("offer_section") : scrollToForm}
            data-testid="check-availability-button"
            className="btn-cta text-lg px-8"
          >
            {variant.offerCta}
          </Button>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section-padding bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">Trusted by GTA Homeowners</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                ))}
              </div>
              <span className="text-[#0F172A] font-semibold">4.9 / 5 on Google</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.slice(0, 4).map((testimonial, i) => (
              <div key={i} className="testimonial-card" data-testid={`testimonial-${i}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <p className="text-[#475569] mb-4 leading-relaxed text-sm">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1D67CD] flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{testimonial.name}</p>
                    <p className="text-sm text-[#94A3B8]">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {testimonials.slice(4).map((testimonial, i) => (
              <div key={i + 4} className="testimonial-card" data-testid={`testimonial-${i + 4}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <p className="text-[#475569] mb-4 leading-relaxed text-sm">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1D67CD] flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{testimonial.name}</p>
                    <p className="text-sm text-[#94A3B8]">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-[#F9F8FD]" data-testid="process-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4">
              {variant.processH2}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Request Your Free Estimate", description: "Fill out our quick form or call us. We'll schedule a convenient time to inspect your roof and discuss your goals.", icon: Calendar },
              { step: 2, title: "Custom Plan & Transparent Quote", description: "Our team walks you through the exact scope, materials and timeline — in writing, with no hidden surprises.", icon: Users },
              { step: 3, title: "Professional Installation", description: "Our skilled crews complete your roof quickly and cleanly, then thoroughly clean up the property before they leave.", icon: Wrench },
            ].map((item, i) => (
              <div key={i} className="process-step" data-testid={`process-step-${i}`}>
                <span className="process-number">{item.step}</span>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[#EAF3FC] flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-[#1D67CD]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F4A9C] mb-3">{item.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding bg-[#043061]" data-testid="trust-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose Roofing Monkeys?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "Hundreds of Happy GTA Homeowners", text: "Hundreds of successful roofs installed across Toronto and the Greater Toronto Area." },
              { icon: Shield, title: "Licensed, Insured & WSIB Covered", text: "Full liability and worker coverage for complete peace of mind." },
              { icon: Users, title: "In-House Roofing Crews", text: "No subcontractors. The team that quotes your roof is the team that builds it." },
              { icon: CheckCircle, title: "Clean, Respectful Crews", text: "We protect your landscaping, clean up daily and magnetic-sweep for nails." },
              { icon: Shield, title: "Workmanship + Material Warranty", text: "Workmanship warranty plus manufacturer warranty on every roof we install." },
              { icon: CloudRain, title: "Built for Toronto Weather", text: "Ice & water shield, proper ventilation, snow-load ready — every time." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10" data-testid={`trust-item-${i}`}>
                <item.icon className="w-10 h-10 text-[#59C8EE] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service-specific body copy (About) — helps Google & humans understand the page */}
      <section className="section-padding bg-white" data-testid="about-section">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">Details</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4">
              {variant.aboutH2}
            </h2>
          </div>
          <div className="space-y-5 text-[#475569] leading-relaxed text-base md:text-lg">
            {variant.aboutParagraphs.map((p, i) => (
              <p key={i} data-testid={`about-paragraph-${i}`}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={variant.phoneFirst ? () => handleCallClick("about_section") : scrollToForm}
              data-testid="about-primary-cta"
              className="btn-cta text-base px-6 flex items-center justify-center gap-2"
            >
              {variant.phoneFirst && <Phone className="w-4 h-4" />}
              {variant.phoneFirst ? variant.primaryCta : variant.primaryCta}
            </Button>
            <Button
              onClick={variant.phoneFirst ? scrollToForm : () => handleCallClick("about_section")}
              data-testid="about-secondary-cta"
              variant="outline"
              className="text-base px-6 border-2 border-[#043061] text-[#043061] bg-transparent hover:bg-[#043061] hover:text-white rounded-full flex items-center justify-center gap-2"
            >
              {!variant.phoneFirst && <Phone className="w-4 h-4" />}
              {variant.phoneFirst ? variant.secondaryCta : variant.secondaryCta}
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white" data-testid="faq-section">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {variant.faqItems.map((faq, i) => (
              <div key={i} className="faq-item pb-4" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left py-4"
                  data-testid={`faq-button-${i}`}
                >
                  <span className="text-lg font-semibold text-[#0F172A] pr-4">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-[#1D67CD] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#94A3B8] flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="pb-4 text-[#475569] leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-[#F9F8FD]" data-testid="final-cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mb-4">
            {variant.finalCtaH2}
          </h2>
          <p className="text-lg text-[#475569] mb-8">
            {variant.finalCtaBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {variant.phoneFirst ? (
              <>
                <Button
                  onClick={() => handleCallClick("final_cta")}
                  data-testid="final-cta-call-button"
                  className="btn-cta text-lg px-8 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  {variant.primaryCta}
                </Button>
                <Button
                  onClick={scrollToForm}
                  data-testid="final-cta-schedule-button"
                  className="btn-blue text-lg px-8"
                >
                  {variant.secondaryCta}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={scrollToForm}
                  data-testid="final-cta-schedule-button"
                  className="btn-cta text-lg px-8"
                >
                  {variant.primaryCta}
                </Button>
                <Button
                  onClick={() => handleCallClick("final_cta")}
                  data-testid="final-cta-call-button"
                  className="btn-blue text-lg px-8 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  {variant.secondaryCta}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#043061] py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <a href="/" className="brand-logo-img on-dark" aria-label="Roofing Monkeys">
              <img src={LOGO_HERO_URL} alt="Roofing Monkeys logo" />
              <span className="brand-text">
                <span className="name">Roofing Monkeys</span>
                <span className="sub">Greater Toronto Area</span>
              </span>
            </a>
          </div>
          <p className="text-white/70 mb-4">Roofing Toronto · Mississauga · Vaughan · Brampton · Markham &amp; the rest of the GTA</p>
          <a href={PHONE_HREF} className="text-[#59C8EE] font-semibold text-lg hover:underline" data-testid="footer-phone" onClick={(e) => { e.preventDefault(); handleCallClick("footer"); }}>{PHONE_NUMBER}</a>
          <p className="text-white/50 text-sm mt-6">© {new Date().getFullYear()} Roofing Monkeys. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky Mobile Bar */}
      <div className="sticky-mobile-bar md:hidden" data-testid="sticky-mobile-bar">
        <div className="flex gap-3">
          {variant.phoneFirst ? (
            <>
              <Button
                onClick={() => handleCallClick("sticky_mobile")}
                data-testid="mobile-call-button"
                className="flex-[2] h-12 bg-[#043061] hover:bg-[#021f40] text-white font-semibold rounded-full flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
              <Button
                onClick={scrollToForm}
                data-testid="mobile-quote-button"
                className="flex-1 h-12 bg-[#1D67CD] hover:bg-[#1854A8] text-white font-semibold rounded-full text-sm"
              >
                Request Inspection
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleCallClick("sticky_mobile")}
                data-testid="mobile-call-button"
                className="flex-1 h-12 bg-[#043061] hover:bg-[#021f40] text-white font-semibold rounded-full flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call
              </Button>
              <Button
                onClick={scrollToForm}
                data-testid="mobile-quote-button"
                className="flex-[2] h-12 bg-[#1D67CD] hover:bg-[#1854A8] text-white font-semibold rounded-full text-sm"
              >
                Get Free Estimate
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
