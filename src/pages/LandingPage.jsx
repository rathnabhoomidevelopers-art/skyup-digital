import { useState, useEffect } from "react";
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Phone,
  Building2,
  TrendingUp,
  Layers,
  Megaphone,
  Search,
  Share2,
  MessageCircle,
  LayoutTemplate,
  RefreshCw,
  Database,
  BarChart3,
  Quote,
  Star,
  ChevronDown,
  Menu,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

/* ══════════════════════════════════════════
   BACKEND CONFIG
   Replace API_BASE with your deployed Vercel URL.
   The lead form POSTs to `${API_BASE}/add-contact`.
══════════════════════════════════════════ */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://skyup-backend-3k9s.onrender.com";; // ← paste your prod URL here (no trailing slash)

/* ══════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    footer a { color: #E6E5E5; }
footer a:hover { color: #ffffff; }

  html { scroll-behavior: smooth; }
  a { text-decoration: none; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fiu  { animation: fadeInUp 0.6s ease both; }
  .delay-1 { animation-delay: 0.08s; }
  .delay-2 { animation-delay: 0.18s; }
  .delay-3 { animation-delay: 0.28s; }
  .delay-4 { animation-delay: 0.38s; }

  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .faq-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, opacity 0.35s ease; opacity: 0; }
  .faq-body.open { max-height: 400px; opacity: 1; }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mobile-menu-enter { animation: slideDown 0.2s ease both; }

  @keyframes headerIn {
    from { opacity: 0; transform: translateY(-40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .header-animate { animation: headerIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }

  .gradient-text {
    background: linear-gradient(90deg, #0037CA, #1F6BFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .animated-gradient-text {
    background: linear-gradient(-45deg, #0037CA, #1F6BFF, #3B82F6, #0037CA);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientMove 5s ease-in-out infinite;
  }
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .service-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,55,202,0.15); }
  .service-card:hover .service-icon { background: #0037CA !important; color: white !important; }

  .why-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,55,202,0.10); }
  .why-card:hover .why-icon { background: #0037CA !important; color: white !important; }

  .stat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,55,202,0.12); }

  .testi-avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 800;
    border: 4px solid white;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    position: absolute;
    top: -36px; left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .faq-item { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
  .faq-item.open { border-color: #0037CA !important; box-shadow: 0 4px 16px rgba(0,55,202,0.08); }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #0037CA;
    box-shadow: 0 0 0 3px rgba(0,55,202,0.12);
  }

  .btn-primary { position: relative; overflow: hidden; transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,55,202,0.30); }
  .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-primary::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.12);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .btn-primary:hover::after { transform: scaleX(1); }

  .gold-rule { display: inline-block; height: 3px; width: 36px; border-radius: 2px; background: #C8973A; }

  .process-line::before {
    content: '';
    position: absolute;
    top: 26px; left: 52px; right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(0,55,202,0.15), rgba(200,151,58,0.50), rgba(0,55,202,0.15));
  }

  .step-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px; height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0037CA 0%, #1F6BFF 100%);
    color: white;
    font-size: 16px;
    font-weight: 800;
    box-shadow: 0 6px 20px rgba(0,55,202,0.35);
    letter-spacing: -0.02em;
  }

  .hero-img-wrap { position: relative; }
  .hero-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(0,55,202,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  @keyframes floatBadge {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .float-badge { animation: floatBadge 3s ease-in-out infinite; }

  @media (max-width: 768px) {
    .process-line::before { display: none; }
  }
`;

/* ══════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════ */
const C = {
  brand: "#0037CA",
  brandHover: "#0452da",
  brandDark: "#00164F",
  brandMid: "#FFF8F0",
  navy: "#FFF8F0",
  cream: "#ecf1ff",
  creamBorder: "#D8DCF0",
  gold: "#C8973A",
  muted: "#5B5F73",
  subtle: "#9A9AA8",
  orange: "#FA9F43",
};

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const NAV_LINKS = [
  { to: "#home", label: "Home" },
  { to: "#about", label: "About Us" },
  { to: "#services", label: "Services" },
  { to: "#process", label: "Process" },
  { to: "#testimonials", label: "Testimonials" },
  { to: "#faq", label: "FAQ" },
];

const SOCIAL_LINKS_NAV = [
  {
    iconSrc: "https://www.skyupdigitalsolutions.com/images/FB.svg",
    href: "https://www.facebook.com/profile.php?id=61584820941998",
    label: "Facebook",
  },
  {
    iconSrc: "https://www.skyupdigitalsolutions.com/images/Insta.svg",
    href: "https://www.instagram.com/skyupdigitalsolutions/",
    label: "Instagram",
  },
  {
    iconSrc: "https://www.skyupdigitalsolutions.com/images/Twitter.svg",
    href: "https://www.linkedin.com/company/110886969",
    label: "LinkedIn",
  },
  {
    iconSrc: "https://www.skyupdigitalsolutions.com/images/YT.svg",
    href: "https://www.youtube.com/@SKYUPDigitalSolutionsBengaluru",
    label: "YouTube",
  },
];

const CHECKLIST = [
  "Real Estate Lead Generation Specialists",
  "Google Ads & Meta Ads Campaign Management",
  "Conversion-Focused Landing Pages",
  "Lead Tracking & CRM Integration",
];

const BUDGET_OPTIONS = [
  "Under ₹50,000 / month",
  "₹50,000 – ₹1,00,000 / month",
  "₹1,00,000 – ₹3,00,000 / month",
  "₹3,00,000+ / month",
];

const STATS = [
  { value: "1,000 +", label: "Property Enquiries Generated" },
  { value: "3 - 5X", label: "Avg Return on Ad Spend" },
  { value: "30 +", label: "Real Estate Projects Scaled" },
  { value: "< 7 Days", label: "To First Qualified Lead" },
];

const WHY_US = [
  {
    Icon: Building2,
    title: "Built for Real Estate",
    desc: "Every strategy is built around property types, buyer intent, and local market dynamics — not generic, one-size-fits-all templates.",
  },
  {
    Icon: TrendingUp,
    title: "Performance Over Vanity Metrics",
    desc: "We focus on enquiries, site visits, and sales opportunities — not just likes, clicks, or impressions.",
  },
  {
    Icon: Layers,
    title: "Full-Funnel Lead Management",
    desc: "From the first ad click to CRM-tracked follow-up, every lead is captured, nurtured, and accounted for.",
  },
  {
    Icon: ShieldCheck,
    title: "Transparent, Data-Backed Reporting",
    desc: "Know exactly where your budget goes and what it brings back, with clear weekly and monthly reports.",
  },
];

const SERVICES = [
  {
    Icon: Megaphone,
    title: "Meta Ads for Real Estate",
    desc: "Generate targeted property enquiries through Facebook and Instagram. High-converting, audience-focused campaigns that attract buyers, investors, and NRI prospects.",
  },
  {
    Icon: Search,
    title: "Google Ads Lead Generation",
    desc: "Reach high-intent property buyers actively searching for residential, commercial, villa, apartment, and plotted development projects.",
  },
  {
    Icon: Share2,
    title: "Social Media Management",
    desc: "Build trust and increase project visibility with professionally managed content — posts, reels, project updates, and promotional campaigns.",
  },
  {
    Icon: MessageCircle,
    title: "WhatsApp Marketing",
    desc: "Nurture and convert leads through personalised WhatsApp campaigns — brochures, offers, site visit invitations, and follow-ups.",
  },
  {
    Icon: LayoutTemplate,
    title: "Real Estate Landing Pages",
    desc: "Conversion-focused landing pages designed for property campaigns — built to capture enquiries, schedule site visits, and improve lead quality.",
  },
  {
    Icon: RefreshCw,
    title: "Remarketing Campaigns",
    desc: "Reconnect with buyers who visited your site or engaged with your ads, and stay top-of-mind until they're ready to decide.",
  },
  {
    Icon: Database,
    title: "Lead Tracking & CRM Integration",
    desc: "Track every lead from enquiry to sale with CRM integration and conversion tracking — complete visibility into campaign performance.",
  },
  {
    Icon: BarChart3,
    title: "Strategy & Performance Reporting",
    desc: "Transparent reporting, campaign insights, and data-driven recommendations to reduce cost per lead and maximise marketing ROI.",
  },
];

const PROCESS = [
  {
    title: "Market Research & Audience Targeting",
    desc: "We study your project, pricing, location, and competitors to define exactly who your ideal buyers are.",
  },
  {
    title: "Google & Meta Ads Campaign Setup",
    desc: "We launch targeted Search, Display, and Social campaigns built to reach high-intent property seekers.",
  },
  {
    title: "Lead Capture Landing Page",
    desc: "Every campaign drives traffic to a conversion-focused landing page designed to turn visitors into enquiries.",
  },
  {
    title: "WhatsApp & Lead Follow-up",
    desc: "New leads are followed up instantly through WhatsApp and call workflows so no enquiry goes cold.",
  },
  {
    title: "Tracking & Optimisation",
    desc: "We track every rupee spent and continuously optimise campaigns to lower cost-per-lead and improve quality.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Their PPC strategy generated consistent leads, improved cost control, and provided clear performance insights, boosting confidence in ad spend.",
    name: "Amit R",
    role: "Founder",
    initials: "AR",
    avatar: null,
  },
  {
    quote:
      "SKYUP built a fast, user-friendly website that drives lead generation, with a design and structure that encourages visitor action.",
    name: "Ravi K",
    role: "CEO",
    initials: "RK",
    avatar: null,
  },
  {
    quote:
      "Working with SKYUP boosted our online presence with SEO and content marketing, improving rankings and website traffic quickly.",
    name: "Sanya M",
    role: "Marketing Director",
    initials: "SM",
    avatar: null,
  },
  {
    quote:
      "Their structured lead generation delivers consistent, qualified enquiries through a transparent, reliable process aligned with sales goals.",
    name: "Neha S",
    role: "Business Head",
    initials: "NS",
    avatar: null,
  },
];

const FAQS = [
  {
    q: "How can digital marketing help my real estate business?",
    a: "Digital marketing helps you reach potential buyers actively looking for properties, generate qualified enquiries, increase site visits, and improve project visibility through targeted online campaigns.",
  },
  {
    q: "Which marketing channels work best for real estate lead generation?",
    a: "Google Ads and Meta Ads are among the most effective channels for generating property enquiries. Combined with landing pages, WhatsApp marketing, and remarketing campaigns, they help attract and convert potential buyers.",
  },
  {
    q: "Do you work with builders, developers, and real estate consultants?",
    a: "Yes. We work with builders, developers, property consultants, plotted development projects, apartment projects, villa projects, and other real estate businesses looking to increase lead generation and sales opportunities.",
  },
  {
    q: "How long does it take to start generating leads?",
    a: "Campaign performance depends on factors such as project location, competition, budget, and market demand. In many cases, qualified enquiries can start coming in within the first few weeks of campaign launch.",
  },
  {
    q: "Can you manage both Google Ads and Meta Ads?",
    a: "Yes. We provide end-to-end campaign management across Google Ads, Facebook, and Instagram to help maximise reach, improve lead quality, and increase conversion opportunities.",
  },
  {
    q: "How do you track lead quality and campaign performance?",
    a: "We implement conversion tracking, lead tracking, and performance reporting to help you understand where your enquiries are coming from and how your campaigns are performing.",
  },
  {
    q: "Do I need a landing page for my real estate project?",
    a: "A dedicated landing page is highly recommended because it focuses on lead generation, improves conversion rates, and helps capture more qualified enquiries compared to sending traffic to a general website.",
  },
  {
    q: "How do I get started?",
    a: "Simply book a free consultation with our team. We will review your project, understand your goals, and recommend a customised digital marketing strategy for your business.",
  },
];

const FOOTER_SERVICES = [
  { label: "Social Media Marketing", to: "#services" },
  { label: "SEO", to: "#services" },
  { label: "Google Ads", to: "#services" },
  { label: "Email Marketing", to: "#services" },
  { label: "Branding", to: "#services" },
  { label: "Web Development", to: "#services" },
  { label: "UI UX Design", to: "#services" },
  { label: "Graphic Design", to: "#services" },
  { label: "AI Automation", to: "#services" },
];

const FOOTER_LINKS = [
  { label: "About Us", to: "#about" },
  { label: "Services", to: "#services" },
  { label: "Process", to: "#process" },
  { label: "Testimonials", to: "#testimonials" },
  { label: "FAQ", to: "#faq" },
  { label: "Contact", to: "#contact" },
  {
    label: "Blogs",
    to: "https://www.skyupdigitalsolutions.com/blogs-difference-between-digital-marketing-and-traditional-marketing",
    external: true,
  },
  {
    label: "Careers",
    to: "https://www.skyupdigitalsolutions.com/careers-digital-marketing-job",
    external: true,
  },
  {
    label: "Privacy Policy",
    to: "https://www.skyupdigitalsolutions.com/privacypolicy",
    external: true,
  },
  {
    label: "Terms & Conditions",
    to: "https://www.skyupdigitalsolutions.com/termscondition",
    external: true,
  },
];

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { rootMargin: "-50px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home");
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.to.replace("#", ""));
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);
  return activeSection;
}

function scrollToSection(e, href, closeMobile) {
  e.preventDefault();
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
  if (closeMobile) closeMobile();
}

/* ══════════════════════════════════════════
   SHARED: SectionHeading
══════════════════════════════════════════ */
function SectionHeading({ eyebrow, title, description, center, light }) {
  return (
    <div
      className={`reveal ${center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}`}
    >
      <div
        className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}
      >
        <span className="gold-rule" />
        <span
          style={{
            color: light ? "rgba(255,255,255,0.75)" : C.brand,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        {center && <span className="gold-rule" />}
      </div>

      <h2
        style={{
          fontSize: "clamp(28px, 3.2vw, 42px)",
          fontWeight: 700,
          lineHeight: 1.18,
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "16px",
            lineHeight: 1.8,
            color: light ? "rgba(255,255,255,0.72)" : C.muted,
            maxWidth: "620px",
          }}
          className={center ? "mx-auto" : ""}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   HEADER
══════════════════════════════════════════ */
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();
  const isActive = (to) => activeSection === to.replace("#", "");

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <header
        className="header-animate sticky top-0 left-0 w-full h-20 font-poppins z-50"
        style={{ background: "#F9ECDE" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-3">
            <a href="/" className="flex items-center gap-2 !no-underline">
              <img
                src="/images/rbd-logo.webp"
                alt="SKYUP Logo"
                className="h-10 w-auto sm:h-12 md:h-10 lg:h-12"
                width={192}
                height={55}
                fetchPriority="high"
              />
            </a>
            <nav className="hidden md:flex flex-1 justify-center">
              <div className="inline-flex items-center bg-white rounded-full shadow-sm px-3 py-2 lg:px-4 gap-1 lg:gap-2">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.label}
                    href={l.to}
                    onClick={(e) => scrollToSection(e, l.to)}
                    className="inline-flex items-center justify-center px-3 py-2 lg:px-4 rounded-full font-semibold whitespace-nowrap text-sm transition-all duration-200"
                    style={
                      isActive(l.to)
                        ? {
                            border: `1px solid ${C.brand}`,
                            color: C.brand,
                            background: "white",
                          }
                        : { color: "#374151" }
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </nav>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2">
                {SOCIAL_LINKS_NAV.map(({ iconSrc, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: "white",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                    }}
                  >
                    <img src={iconSrc} alt={label} width={35} height={35} />
                  </a>
                ))}
              </div>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="hidden md:inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors"
                style={{ background: C.brand }}
              >
                Contact Us
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex md:hidden items-center justify-center p-2 rounded-full text-white"
                style={{ background: C.brand }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      {mobileOpen && (
        <div
          className="mobile-menu-enter md:hidden fixed left-0 right-0 top-20 z-[9999] shadow-lg"
          style={{ background: C.cream }}
        >
          <nav className="flex flex-col px-4 pb-4 pt-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.to}
                onClick={(e) =>
                  scrollToSection(e, l.to, () => setMobileOpen(false))
                }
                className="w-full text-left text-sm font-medium px-3 py-2 rounded-md block"
                style={
                  isActive(l.to)
                    ? { background: "white", color: C.brand }
                    : { color: "#111827" }
                }
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-3">
              {SOCIAL_LINKS_NAV.map(({ iconSrc, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200"
                  style={{
                    background: "white",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                  }}
                >
                  <img src={iconSrc} alt={label} width={20} height={20} />
                </a>
              ))}
            </div>
            <a
              href="#contact"
              onClick={(e) =>
                scrollToSection(e, "#contact", () => setMobileOpen(false))
              }
              className="mt-3 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: C.brand }}
            >
              Contact Us
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   HERO — lead form wired to backend POST /add-contact
══════════════════════════════════════════ */
function Hero() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    location: "",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Map form fields onto the backend's contact schema.
    // Required by backend: name, mobile. Optional fields are folded into `message`.
    const extra = [
      form.company && `Company/Builder: ${form.company}`,
      form.location && `Project Location: ${form.location}`,
      form.budget && `Monthly Budget: ${form.budget}`,
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      name: form.name,
      mobile: form.phone.replace(/\D/g, ""), // backend runs parseInt
      email: form.email || "",
      subject: "Real Estate Lead — Homepage Form",
      message: extra || "Homepage consultation request",
    };

    try {
      const res = await fetch(`${API_BASE}/add-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Couldn't reach the server. Please check your connection and try again."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "10px",
    border: `1.5px solid ${C.creamBorder}`,
    padding: "11px 16px",
    fontSize: "14px",
    background: "#FAFBFF",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "Poppins, sans-serif",
  };

  return (
    <section id="home" className="font-poppins" style={{ background: C.cream }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
          {/* ── LEFT ── */}
          <div className="animate-fiu">
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"
              style={{
                color: C.brand,
                fontSize: "12px",
                fontWeight: 600,
                border: `1px solid ${C.creamBorder}`,
              }}
            >
              <MapPin size={13} />
              Real Estate Digital Marketing Agency · Bangalore
            </div>

            <h1
              className="mt-5 font-['inter']"
              style={{
                fontSize: "clamp(36px, 5vw, 50px)",
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Generate More{" "}
              <span className="animated-gradient-text">Qualified</span>
              <br />
              Property Leads
            </h1>

            <p
              className="mt-5"
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: C.muted,
                maxWidth: "500px",
              }}
            >
              SKYUP Digital Solutions helps builders, developers, property
              consultants, and real estate companies attract serious buyers
              through Google Ads, Meta Ads, and performance marketing campaigns.
            </p>

            <ul
              className="mt-6 grid gap-y-3 gap-x-4 sm:grid-cols-2"
              style={{ maxWidth: "500px" }}
            >
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5"
                  style={{ fontSize: "13.5px", fontWeight: 500 }}
                >
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: C.brand }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${C.brand} 0%, #1F6BFF 100%)`,
                  fontSize: "14px",
                }}
              >
                Book Free Strategy Session
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="inline-flex items-center gap-2 font-semibold"
                style={{ fontSize: "14px" }}
              >
                Free Marketing Audit
                <ArrowRight size={15} />
              </a>
            </div>

            <div
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
              style={{ maxWidth: "800px" }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`stat-card animate-fiu delay-${i + 1} rounded-2xl bg-white text-center`}
                  style={{
                    padding: "18px 10px",
                    boxShadow: "0 2px 16px rgba(0,55,202,0.08)",
                    border: `1px solid ${C.creamBorder}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 800,
                      color: C.brand,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {s.value}
                  </div>
                  <p
                    style={{
                      marginTop: "5px",
                      fontSize: "11px",
                      lineHeight: 1.45,
                      color: C.muted,
                      fontWeight: 500,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-5 flex items-center gap-2"
              style={{ fontSize: "12.5px", color: C.subtle }}
            >
              <ShieldCheck
                size={14}
                className="flex-shrink-0"
                style={{ color: C.gold }}
              />
              Trusted by real estate businesses looking to scale their lead
              generation
            </div>
          </div>

          {/* ── RIGHT — Lead Form ── */}
          <div id="consultation" className="animate-fiu delay-2 scroll-mt-24">
            <div
              className="overflow-hidden rounded-3xl bg-white"
              style={{
                boxShadow: "0 12px 56px rgba(0,55,202,0.14)",
                border: `1px solid ${C.creamBorder}`,
              }}
            >
              <div
                style={{
                  height: "4px",
                  background: `linear-gradient(90deg, ${C.brand}, #1F6BFF, ${C.gold})`,
                }}
              />

              <div className="p-7 sm:p-9">
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Request a Free Consultation
                </h2>
                <p
                  style={{
                    marginTop: "6px",
                    fontSize: "14px",
                    color: C.muted,
                    lineHeight: 1.6,
                  }}
                >
                  Get a custom growth plan for your project — we respond within
                  24 hours.
                </p>

                {submitted ? (
                  <div
                    className="mt-8 flex flex-col items-center rounded-2xl px-4 py-12 text-center"
                    style={{ background: C.cream }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 64,
                        height: 64,
                        background: `${C.brand}18`,
                      }}
                    >
                      <CheckCircle2 size={32} style={{ color: C.brand }} />
                    </div>
                    <h3
                      style={{
                        marginTop: "16px",
                        fontSize: "20px",
                        fontWeight: 700,
                      }}
                    >
                      Thanks, {form.name || "there"}!
                    </h3>
                    <p
                      style={{
                        marginTop: "8px",
                        fontSize: "14px",
                        color: C.muted,
                        lineHeight: 1.7,
                      }}
                    >
                      We've received your details. Our team will reach out
                      shortly with your free growth plan.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {[
                      {
                        id: "name",
                        label: "Full Name",
                        type: "text",
                        placeholder: "Your full name",
                        required: true,
                      },
                      {
                        id: "phone",
                        label: "Phone Number",
                        type: "tel",
                        placeholder: "+91 00000 00000",
                        required: true,
                      },
                      {
                        id: "email",
                        label: "Email",
                        type: "email",
                        placeholder: "you@example.com",
                        required: false,
                      },
                      {
                        id: "company",
                        label: "Company / Builder",
                        type: "text",
                        placeholder: "Your company name",
                        required: false,
                      },
                      {
                        id: "location",
                        label: "Project Location",
                        type: "text",
                        placeholder: "e.g., Whitefield, Bangalore",
                        required: false,
                      },
                    ].map(({ id, label, type, placeholder, required }) => (
                      <div key={id}>
                        <label
                          htmlFor={id}
                          style={{
                            display: "block",
                            marginBottom: "5px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {label}
                          {required && (
                            <span style={{ color: C.brand }}> *</span>
                          )}
                        </label>
                        <input
                          id={id}
                          name={id}
                          type={type}
                          required={required}
                          value={form[id]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          style={inputStyle}
                        />
                      </div>
                    ))}

                    <div>
                      <label
                        htmlFor="budget"
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: C.navy,
                          letterSpacing: "0.01em",
                        }}
                      >
                        Monthly Marketing Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        style={inputStyle}
                      >
                        <option value="">Select your budget (optional)</option>
                        {BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#C0392B",
                          lineHeight: 1.5,
                          margin: 0,
                        }}
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{
                        width: "100%",
                        borderRadius: "999px",
                        padding: "14px 24px",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "white",
                        background: `linear-gradient(135deg, ${C.brand} 0%, #1F6BFF 100%)`,
                        border: "none",
                        cursor: "pointer",
                        marginTop: "4px",
                        fontFamily: "Poppins, sans-serif",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {loading ? "Sending..." : "Get My Free Growth Plan →"}
                    </button>

                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: C.subtle,
                      }}
                    >
                      🔒 Your information is never shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
function About() {
  return (
    <section id="about" className="bg-white font-poppins">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Why SKYUP Digital Solutions"
          title="Built for Real Estate Lead Generation, Not Generic Marketing"
          description="From lead generation to conversion tracking, we help real estate businesses attract, nurture, and convert potential buyers through performance-driven digital marketing."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map(({ Icon: Ic, title, desc }, i) => (
            <div
              key={title}
              className=" why-card reveal rounded-2xl p-7 relative overflow-hidden"
              style={{
                border: `1.5px solid ${C.creamBorder}`,
                background: "#F7F8FD",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.gold,
                  opacity: 0.5,
                }}
              />

              <div
                className="why-icon flex items-center justify-center rounded-xl"
                style={{
                  width: 52,
                  height: 52,
                  background: `${C.brand}12`,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <Ic size={24} />
              </div>

              <h3
                style={{
                  marginTop: "20px",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SERVICES
══════════════════════════════════════════ */
function Services() {
  return (
    <section
      id="services"
      className="font-poppins"
      style={{ background: C.cream }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Our Real Estate Marketing Services"
          title="Services Designed to Generate More Qualified Property Leads"
          description="A focused set of services built around one goal: turning ad spend into qualified enquiries, site visits, and sales opportunities for your project."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ Icon: Ic, title, desc }, i) => (
            <div
              key={title}
              className="service-card reveal rounded-2xl bg-white p-7 relative"
              style={{
                boxShadow: "0 2px 16px rgba(0,55,202,0.06)",
                border: `1.5px solid ${C.creamBorder}`,
                transitionDelay: `${(i % 4) * 60}ms`,
              }}
            >
              {/* <span
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: `${C.brand}30`,
                  letterSpacing: "0.05em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span> */}

              <div
                className="service-icon flex items-center justify-center rounded-xl"
                style={{
                  width: 52,
                  height: 52,
                  background: `${C.brand}12`,
                  color: C.brand,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <Ic size={24} />
              </div>

              <h3
                style={{
                  marginTop: "18px",
                  fontSize: "15px",
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "13.5px",
                  lineHeight: 1.75,
                  color: C.muted,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PROCESS
══════════════════════════════════════════ */
function Process() {
  return (
    <section id="process" className="bg-white font-poppins">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Our Process"
          title="How We Generate Property Leads"
          description="A clear five-step workflow that takes your project from audience research to a steady stream of tracked, follow-up-ready enquiries."
        />

        <div className="mt-14 relative">
          <div className="process-line hidden lg:block" />
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-5">
            {PROCESS.map((step, i) => (
              <div
                key={step.title}
                className="reveal relative"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="step-pill relative z-10">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <h3
                  style={{
                    marginTop: "18px",
                    fontSize: "14.5px",
                    fontWeight: 700,

                    lineHeight: 1.4,
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    lineHeight: 1.75,
                    color: C.muted,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      id="testimonials"
      className="font-poppins"
      style={{ background: C.cream }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="text-center reveal mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="gold-rule" />
            <span
              style={{
                color: C.brand,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Testimonial
            </span>
            <span className="gold-rule" />
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.16,
              letterSpacing: "-0.025em",
            }}
          >
            What the people think about us
          </h2>
        </div>

        <div className="grid mt-5 gap-x-6 gap-y-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => {
            const isBlue = i % 2 === 0;
            return (
              <div
                key={t.name}
                className="testi-card reveal mt-3 px-2"
                style={{
                  position: "relative",
                  paddingTop: "44px",
                }}
              >
                <div
                  className="testi-avatar"
                  style={{
                    background: isBlue ? C.brand : "#E8ECF8",
                    color: isBlue ? "#fff" : C.brand,
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "18px",
                    fontWeight: 800,
                  }}
                >
                  {t.initials}
                </div>

                <div
                  style={{
                    borderRadius: "20px",
                    background: isBlue ? C.brand : "#F7F8FD",
                    border: isBlue ? "none" : `1.5px solid ${C.creamBorder}`,
                    padding: "52px 24px 28px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "260px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 18,
                      fontSize: "52px",
                      lineHeight: 1,
                      fontFamily: "Georgia, serif",
                      fontWeight: 900,
                      color: isBlue ? "rgba(255,255,255,0.22)" : `${C.brand}22`,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    "
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "17px",
                      color: isBlue ? "#fff" : C.black,
                      lineHeight: 1.2,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 400,
                      color: isBlue ? "rgba(255,255,255,0.70)" : C.muted,
                      marginTop: "4px",
                    }}
                  >
                    {t.role}
                  </div>

                  <div
                    className="flex items-center justify-center gap-0.5"
                    style={{ marginTop: "14px" }}
                  >
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={13}
                        fill={isBlue ? "rgba(255,255,255,0.90)" : C.gold}
                        stroke="none"
                      />
                    ))}
                  </div>

                  <p
                    style={{
                      marginTop: "14px",
                      fontSize: "14px",
                      lineHeight: 1.75,
                      color: isBlue ? "rgba(255,255,255,0.88)" : C.muted,
                      textAlign: "center",
                    }}
                  >
                    {t.quote}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FAQ
══════════════════════════════════════════ */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? FAQS : FAQS.slice(0, 5);

  return (
    <section id="faq" className="font-poppins">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="lg:w-[320px] lg:flex-shrink-0 lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span
                style={{
                  color: C.brand,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Common Questions
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.2vw, 42px)",
                fontWeight: 700,
                lineHeight: 1.18,
              }}
            >
              Frequently Asked
              <br />
              Questions
            </h2>
            <p
              style={{
                marginTop: "14px",
                fontSize: "15px",
                lineHeight: 1.75,
                color: C.muted,
              }}
            >
              Can't find the answer you're looking for? Reach out to our team
              directly.
            </p>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="btn-primary inline-flex items-center justify-center rounded-full font-semibold text-white"
              style={{
                marginTop: "24px",
                padding: "13px 28px",
                background: `linear-gradient(135deg, ${C.brand} 0%, #1F6BFF 100%)`,
                fontSize: "14px",
              }}
            >
              Contact Support
            </a>
          </div>

          <div className="flex-1 min-w-0">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {visibleFaqs.map((f, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={f.q}
                    className={`faq-item overflow-hidden rounded-2xl bg-white ${isOpen ? "open" : ""}`}
                    style={{
                      border: `1.5px solid ${isOpen ? C.brand : C.creamBorder}`,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-5 text-left"
                      style={{ padding: "20px 24px" }}
                      aria-expanded={isOpen}
                    >
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          lineHeight: 1.45,
                        }}
                      >
                        {f.q}
                      </span>
                      <span
                        style={{
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: isOpen ? C.brand : C.cream,
                          color: isOpen ? "white" : C.black,
                          fontSize: "20px",
                          fontWeight: 300,
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          transition:
                            "transform 0.22s ease, background 0.2s, color 0.2s",
                        }}
                      >
                        +
                      </span>
                    </button>
                    <div className={`faq-body ${isOpen ? "open" : ""}`}>
                      <p
                        style={{
                          padding: "0 24px 20px",
                          fontSize: "14px",
                          lineHeight: 1.8,
                          color: C.muted,
                        }}
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {FAQS.length > 5 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowAll((v) => !v);
                    if (showAll) setOpenIndex(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border bg-white font-semibold"
                  style={{
                    borderColor: C.creamBorder,
                    color: C.brand,
                    padding: "12px 28px",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {showAll ? (
                    <>
                      Show Less{" "}
                      <ChevronDown
                        size={16}
                        style={{ transform: "rotate(180deg)" }}
                      />
                    </>
                  ) : (
                    <>
                      View More ({FAQS.length - 5} more){" "}
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CONTACT / CTA
══════════════════════════════════════════ */
function Contact() {
  return (
    <section
      id="contact"
      className="font-poppins flex text-center"
      style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.brandMid} 100%)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="reveal text-center ">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="gold-rule" />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Get Started Today
            </span>
            <span className="gold-rule" />
          </div>

          <h2
            className="max-w-5xl "
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.14,
              letterSpacing: "-0.015em",
            }}
          >
            Ready to Generate More Qualified Property Leads?
          </h2>

          <p
            style={{
              margin: "20px auto 0",
              maxWidth: "540px",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            Book a free strategy session with our real estate marketing
            specialists and get a customised growth plan for your project.
          </p>

          <div className="my-3 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#consultation"
              onClick={(e) => scrollToSection(e, "#consultation")}
              className="btn-primary inline-flex items-center text-white justify-center rounded-full font-semibold"
              style={{
                background: "blue",
                padding: "16px 36px",
                fontSize: "15px",
              }}
            >
              Book Free Strategy Session
            </a>
            <a
              href="tel:+918867867775"
              className="inline-flex items-center gap-2 rounded-full font-semibold text-white"
              style={{
                border: "1.5px solid rgba(255,255,255,0.30)",
                padding: "16px 32px",
                fontSize: "15px",
                background: "blue",
                transition: "background 0.2s",
              }}
            >
              <Phone size={16} />
              +91 88678 67775
            </a>
          </div>

          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
            style={{ fontSize: "13px" }}
          >
            {[
              "No commitment required",
              "Response within 24 hours",
              "100% confidential",
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <CheckCircle2 size={14} style={{ color: C.gold }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function FooterLogo() {
  return (
    <a href="/" className="flex items-center gap-2 !no-underline">
      <img
        src="/images/SKYUP_Logo_white.webp"
        alt="SkyUp Digital Solutions"
        className="w-[170px] h-auto"
      />
    </a>
  );
}

const FOOTER_SOCIAL = [
  {
    Icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61584820941998",
    label: "Facebook",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/skyupdigitalsolutions/",
    label: "Instagram",
  },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/company/110886969/admin/",
    label: "LinkedIn",
  },
  {
    Icon: Youtube,
    href: "https://www.youtube.com/@SKYUPDigitalSolutionsBengaluru",
    label: "YouTube",
  },
];

function FooterSocial({ gap = "gap-4" }) {
  return (
    <div className={`flex items-center ${gap}`}>
      {FOOTER_SOCIAL.map(({ Icon: Ic, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <Ic
            size={20}
            className="text-white/70 hover:text-white transition-colors"
          />
        </a>
      ))}
    </div>
  );
}

function FooterLink({ item, className }) {
  if (item.external) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {item.label}
      </a>
    );
  }
  return (
    <a
      href={item.to}
      onClick={(e) => scrollToSection(e, item.to)}
      className={className}
    >
      {item.label}
    </a>
  );
}

function Footer() {
  return (
    <footer
      className="w-full text-white font-poppins"
      style={{
        backgroundImage: "linear-gradient(to bottom, #001753, #0037CA)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-8">
        {/* MOBILE */}
        <div className="sm:hidden">
          <a href="#home" onClick={(e) => scrollToSection(e, "#home")}>
            <FooterLogo />
          </a>
          <p className="mt-4 text-white/80 leading-relaxed max-w-sm text-sm">
            <strong className="text-white text-base">
              SkyUp Digital Solutions LLP
            </strong>{" "}
            empowers brands with result-oriented digital marketing, creative
            branding, and smart automation turning visibility into real business
            growth.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold">Services</h3>
              <ul className="mt-3 space-y-2 list-none p-0 m-0">
                {FOOTER_SERVICES.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.to}
                      onClick={(e) => scrollToSection(e, item.to)}
                      className="text-sm text-white/75 hover:text-white block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold">Quick Links</h3>
              <ul className="mt-3 space-y-2 list-none p-0 m-0">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.label}>
                    <FooterLink
                      item={item}
                      className="text-sm text-white/75 hover:text-white block"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-base font-semibold">Contact Us</h3>
            <div className="mt-3 space-y-1.5 text-sm text-white/80">
              <a
                href="https://maps.app.goo.gl/CHpqMiPC1mgjMbYo8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 block"
              >
                Sahakar Nagar, Byatarayanapura, Bengaluru, Karnataka
              </a>
              <div>
                Email:{" "}
                <a
                  href="mailto:contact@skyupdigitalsolutions.com"
                  className="text-white/80"
                >
                  contact@skyupdigitalsolutions.com
                </a>
              </div>
              <div>
                Phone:{" "}
                <a href="tel:+918867867775" className="text-white/80">
                  +91 8867867775
                </a>
              </div>
            </div>
            <FooterSocial gap="gap-5 mt-4" />
          </div>
          <div className="mt-8 border-t border-white/20 pt-4 text-xs text-white/60">
            © 2025 Sky Up Digital Solutions LLP. All Rights Reserved.
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.9fr_1.1fr] gap-y-10 gap-x-14">
          <div>
            <a href="#home" onClick={(e) => scrollToSection(e, "#home")}>
              <FooterLogo />
            </a>
            <p className="mt-4 text-white/75 leading-relaxed max-w-xs text-sm">
              <strong className="text-white">
                SKYUP Digital Solutions LLP
              </strong>{" "}
              empowers brands with result-oriented digital marketing, creative
              branding, and smart automation turning visibility into real
              business growth.
            </p>
          </div>
          <div className="pt-1">
            <h3 className="text-base font-semibold">Services</h3>
            <ul className="mt-4 space-y-2 list-none p-0 m-0">
              {FOOTER_SERVICES.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.to}
                    onClick={(e) => scrollToSection(e, item.to)}
                    className="text-sm text-white/75 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-1">
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 list-none p-0 m-0">
              {FOOTER_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink
                    item={item}
                    className="text-sm text-white/75 hover:text-white"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-1">
            <h3 className="text-base font-semibold">Contact Us</h3>
            <div className="mt-3 space-y-2 text-sm text-white/80">
              <a
                href="https://maps.app.goo.gl/CHpqMiPC1mgjMbYo8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 block"
              >
                Sahakar Nagar, Byatarayanapura, Bengaluru, Karnataka
              </a>
              <div>
                Email:{" "}
                <a
                  href="mailto:contact@skyupdigitalsolutions.com"
                  className="text-white/80"
                >
                  contact@skyupdigitalsolutions.com
                </a>
              </div>
              <div>
                Phone:{" "}
                <a href="tel:+918867867775" className="text-white/80">
                  +91 8867867775
                </a>
              </div>
            </div>
            <FooterSocial gap="gap-4 mt-4" />
          </div>
        </div>

        <div className="hidden sm:block mt-8 border-t border-white/20" />
        <div className="hidden sm:block mt-2 py-3 text-center text-xs text-white/60">
          © 2025 SKYUP Digital Solutions LLP. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════ */
export function LandingPage() {
  useReveal();

  return (
    <div className="font-poppins">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
