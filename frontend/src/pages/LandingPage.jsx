import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, CheckCircle, Star, Shield, Award, MapPin, Clock, ChevronDown, ChevronUp, Users, Wrench, Calendar, Home, Hammer, CloudRain } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const PHONE_NUMBER = "+1 (647) 954-1671";
const PHONE_HREF = "tel:+16479541671";
// Form submission webhook (LeadConnector)
const FORM_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/wNdMd0x1lxovpPbrakSW/webhook-trigger/a98af371-4fca-4209-ba78-63c1ed1d8862";

// Brand assets
const LOGO_URL = "https://customer-assets.emergentagent.com/job_roofing-gta/artifacts/4qmsoeue_RMLogo.jpg";
const LOGO_HERO_URL = "https://customer-assets.emergentagent.com/job_roofing-gta/artifacts/i95qpl6g_rmlogohero.png";

// GTM DataLayer helper
const pushToDataLayer = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

// Real Roofing Monkeys project photos
const projectImages = [
  { url: "https://customer-assets.emergentagent.com/job_roofing-gta/artifacts/aane7i05_shingles.jpg", alt: "Roofing Monkeys crew installing shingles", caption: "Shingle installation — Toronto" },
  { url: "/projects/rm-project-2.jpg", alt: "Crew installing IKO Cambridge architectural shingles in the GTA", caption: "IKO Cambridge shingles — GTA" },
  { url: "/projects/rm-project-3.jpg", alt: "Roofer performing shingle tear-off on a wooden roof deck", caption: "Full tear-off & deck prep" },
  { url: "https://customer-assets.emergentagent.com/job_roofing-gta/artifacts/4aa04gmd_flatroof.jpg", alt: "Flat roof installation by Roofing Monkeys", caption: "Flat roof replacement" },
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

// FAQ items
const faqItems = [
  { question: "How long does a new roof installation take?", answer: "Most residential roof replacements in the Greater Toronto Area are completed in 1–3 days, depending on the size of the home, roof complexity and weather. Flat roof and metal roof projects may take a little longer. We give you a clear timeline before we start." },
  { question: "Do you offer financing options?", answer: "Yes — we offer flexible financing options so you don't have to pay everything up front. During your free in-home estimate we'll walk you through the available plans and find a monthly payment that fits your budget." },
  { question: "What does a new roof cost in the GTA?", answer: "Roof costs in Toronto and the surrounding GTA depend on roof size, slope, materials (asphalt shingles, metal, flat membrane) and how much underlying repair is needed. We provide free, no-obligation, written estimates — and you get $1,500 OFF your new roof when you book a consultation through this page." },
  { question: "Do you handle emergency roof repairs?", answer: "Yes. Storm damage, leaks and missing shingles can't wait. Roofing Monkeys offers same-day and next-day emergency roof repair across the Greater Toronto Area. Call us directly for the fastest response." },
  { question: "Are you licensed and insured?", answer: "Absolutely. Roofing Monkeys is a fully licensed and insured GTA roofing contractor with WSIB coverage. Every job is backed by a workmanship warranty in addition to the manufacturer's material warranty." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    projectType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
            timestamp: new Date().toISOString(),
          }),
        });
      }

      // Push GTM dataLayer event (canonical + GA4 standard)
      pushToDataLayer("form_submit", {
        event_category: "Lead",
        event_label: "Lead Form Submission",
        form_name: "lead_capture",
        project_type: formData.projectType,
        page: "landing",
      });
      pushToDataLayer("generate_lead", {
        currency: "CAD",
        value: 0,
        form_name: "lead_capture",
        project_type: formData.projectType,
      });

      // Store form data in sessionStorage for booking page
      sessionStorage.setItem("leadData", JSON.stringify(formData));

      toast.success("Thank you! Redirecting to book your consultation...");

      setTimeout(() => {
        navigate("/booking");
      }, 1000);
    } catch (error) {
      console.error("Webhook error:", error);
      // Still proceed even if webhook fails
      sessionStorage.setItem("leadData", JSON.stringify(formData));
      pushToDataLayer("form_submit", {
        event_category: "Lead",
        event_label: "Lead Form Submission",
        form_name: "lead_capture",
        project_type: formData.projectType,
        page: "landing",
      });
      pushToDataLayer("generate_lead", {
        currency: "CAD",
        value: 0,
        form_name: "lead_capture",
        project_type: formData.projectType,
      });
      toast.success("Thank you! Redirecting to book your consultation...");
      setTimeout(() => {
        navigate("/booking");
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallClick = (sourceLocation = "header") => {
    pushToDataLayer("click_call_button", {
      event_category: "Engagement",
      event_label: "Click to Call",
      phone_number: PHONE_NUMBER,
      page: "landing",
      location: sourceLocation,
    });
    // Also push the GA4-standard contact event so it shows up either way
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
              <div className="offer-badge mb-6">$1,500 OFF Your New Roof — Limited Time</div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Trusted Roofing in the Greater Toronto Area — Done Right, Done Fast
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Shingles, flat roofs, metal roofs, repairs and 24/7 emergency service from a fully licensed and insured GTA roofing crew you can actually trust.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Asphalt Shingles, Metal & Flat Roof Specialists",
                  "Free On-Site Estimate — No Pressure, No Obligation",
                  "Most Roofs Completed in 1–3 Days",
                  "Workmanship Warranty + Manufacturer Warranty",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/95">
                    <CheckCircle className="w-5 h-5 text-[#59C8EE] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="trust-badge">
                  <Shield className="w-4 h-4" /> Licensed &amp; Insured
                </div>
                <div className="trust-badge">
                  <MapPin className="w-4 h-4" /> Greater Toronto Area
                </div>
                <div className="trust-badge">
                  <Star className="w-4 h-4" /> 4.9★ Google Rated
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

              <div className="form-card p-6 md:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#043061] mb-2">Get Your Free Roof Estimate</h3>
                  <p className="text-[#475569]">Takes 30 seconds • No obligation</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-[#0F172A] font-medium">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      data-testid="input-name"
                      className="mt-1 h-12 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-[#0F172A] font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(416) 555-1234"
                      value={formData.phone}
                      onChange={handleInputChange}
                      data-testid="input-phone"
                      className="mt-1 h-12 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#0F172A] font-medium">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      data-testid="input-email"
                      className="mt-1 h-12 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-[#0F172A] font-medium">Property Address</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main St, Toronto, ON"
                      value={formData.address}
                      onChange={handleInputChange}
                      data-testid="input-address"
                      className="mt-1 h-12 border-slate-200 focus:border-[#1D67CD]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#0F172A] font-medium">Service Needed</Label>
                    <Select onValueChange={handleSelectChange} value={formData.projectType}>
                      <SelectTrigger data-testid="select-project-type" className="mt-1 h-12 border-slate-200">
                        <SelectValue placeholder="Select the service you need" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shingles">Shingles (New Roof / Replacement)</SelectItem>
                        <SelectItem value="roof-repair">Roof Repair</SelectItem>
                        <SelectItem value="flat-roof">Flat Roof</SelectItem>
                        <SelectItem value="metal-roof">Metal Roof</SelectItem>
                        <SelectItem value="emergency">Emergency Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="submit-form-button"
                    className="w-full h-14 text-lg font-semibold bg-[#1D67CD] hover:bg-[#1854A8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {isSubmitting ? "Submitting..." : "Get My Free Quote"}
                  </Button>
                </form>

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

      {/* Services Section */}
      <section className="section-padding bg-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4 mb-4">
              Roofing Services Across the GTA
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              From a single missing shingle to a full strip-and-replace, our crews handle every kind of Toronto roof.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Home, title: "Shingles", text: "Architectural & 3-tab asphalt shingles installed to manufacturer spec." },
              { icon: Wrench, title: "Roof Repair", text: "Leaks, missing shingles, flashing, valleys — fixed properly the first time." },
              { icon: Hammer, title: "Flat Roofs", text: "Modified bitumen and TPO membrane systems for low-slope roofs." },
              { icon: Shield, title: "Metal Roofs", text: "Standing seam and metal panel roofs built to last 40+ years." },
              { icon: CloudRain, title: "Emergency Repairs", text: "Storm damage and active leaks — same-day GTA response." },
            ].map((s, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#F9F8FD] border border-[#E2E8F0] hover:border-[#59C8EE] hover:shadow-lg transition-all duration-200"
                data-testid={`service-card-${i}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#1D67CD] flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0F4A9C] mb-2">{s.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="section-padding bg-[#F9F8FD]" data-testid="offer-section">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">Limited Time Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4 mb-4">
            Get $1,500 Off Your New Roof
          </h2>
          <p className="text-lg text-[#475569] mb-6">
            Available for GTA homeowners who book a free consultation this month. Cannot be combined with other offers.
          </p>
          <div className="flex items-center justify-center gap-2 text-[#0F172A] mb-8">
            <Clock className="w-5 h-5 text-[#1D67CD]" />
            <span className="font-medium">Limited availability across the Greater Toronto Area</span>
          </div>
          <Button
            onClick={scrollToForm}
            data-testid="check-availability-button"
            className="btn-cta text-lg px-8"
          >
            Check Availability
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

      {/* Project Showcase Section — auto-scrolling horizontal gallery */}
      <section className="section-padding bg-[#F9F8FD]" data-testid="showcase-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 px-4">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#043061] mt-4 mb-4">
              Recent Roofing Projects
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

      {/* Process Section */}
      <section className="section-padding bg-white" data-testid="process-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-widest text-[#1D67CD] font-semibold">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F4A9C] mt-4">
              How Your Roofing Project Works
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
            {faqItems.map((faq, i) => (
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
            Ready to Upgrade Your Roof?
          </h2>
          <p className="text-lg text-[#475569] mb-8">
            Book your free consultation now and lock in your $1,500 savings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToForm}
              data-testid="final-cta-schedule-button"
              className="btn-cta text-lg px-8"
            >
              Schedule My Free Consultation
            </Button>
            <Button
              onClick={() => handleCallClick("final_cta")}
              data-testid="final-cta-call-button"
              className="btn-blue text-lg px-8 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </Button>
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
          <Button
            onClick={() => handleCallClick("sticky_mobile")}
            data-testid="mobile-call-button"
            className="flex-1 h-12 bg-[#043061] hover:bg-[#021f40] text-white font-semibold rounded-full flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </Button>
          <Button
            onClick={scrollToForm}
            data-testid="mobile-quote-button"
            className="flex-1 h-12 bg-[#1D67CD] hover:bg-[#1854A8] text-white font-semibold rounded-full"
          >
            Get Free Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
