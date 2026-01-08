// src/components/ServiceCardsSection.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { MoveUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const FILTERS = [
  "All",
  "Digital Marketing",
  "Design & Branding",
  "Web Development",
  "AI-Automation",
];

const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/, "-")
    .replace(/[^a-z0-9-]/g, "");

const fromSlug = (slug) =>
  FILTERS.find((f) => toSlug(f) === slug) || "All";

const PAGE_SIZE = 6;

export default function ServiceCardsSection() {
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const location = useLocation();

  const [activeFilter, setActiveFilter] = useState(() =>
    categorySlug ? fromSlug(categorySlug) : "All"
  );
  const [page, setPage] = useState(1);

  // ✅ scroll-to-filters ref
  const filterRef = useRef(null);
  const headerOffset = 90; // adjust if your header height differs

  const cards = [
    {
      Icon: "/images/service_icon_1.svg",
      slug: "social-media-marketing",
      title: "Social Media Marketing",
      desc: "Transforming online engagement into real business growth.",
      category: "Digital Marketing",
      badge: "Digital Marketing",
    },
    {
      Icon: "/images/service_icon_5.svg",
      slug: "graphic-design",
      title: "Graphic Design",
      desc: "Eye-catching designs for social media, ads, and marketing materials.",
      category: "Design & Branding",
      badge: "Design & Branding",
    },
    {
      Icon: "/images/service_icon_6.svg",
      slug: "ui-ux-design",
      title: "UI UX Design",
      desc: "User-friendly designs that improve experience and increase conversions.",
      category: "Web Development",
      badge: "Web Development",
    },
    {
      Icon: "/images/service_icon_8.svg",
      slug: "ai-automation",
      title: "Automation",
      desc: "Automate repetitive tasks to save time, reduce errors, and improve efficiency.",
      category: "AI-Automation",
      badge: "AI - Automation",
    },
    {
      Icon: "/images/service_icon_7.svg",
      slug: "website-development",
      title: "Website Development",
      desc: "Interactive websites that update content in real-time for a personalized user experience",
      category: "Web Development",
      badge: "Web Development",
    },
    {
      Icon: "/images/service_icon_2.svg",
      slug: "seo",
      title: "SEO",
      desc: "Helps your website rank higher on search engines, attract the right traffic, and turn visitors...",
      category: "Digital Marketing",
      badge: "Digital Marketing",
    },
    {
      Icon: "/images/service_icon_3.svg",
      slug: "email-marketing",
      title: "Email Marketing",
      desc: "Connect with your audience through direct messages that build trust and drive action.",
      category: "Digital Marketing",
      badge: "Digital Marketing",
    },
    {
      Icon: "/images/service_icon_4.svg",
      slug: "branding",
      title: "Branding",
      desc: "We create logos, colors, and visual styles that reflect your brand and make it instantly recognizable.",
      category: "Design & Branding",
      badge: "Design & Branding",
    },
    {
      Icon: "/images/service_icon_9.svg",
      slug: "machine-learning",
      title: "Machine Learning",
      desc: "Engage customers 24/7 with smart chatbots for websites, WhatsApp, and social media",
      category: "AI-Automation",
      badge: "AI - Automation",
    },
    {
      Icon: "/images/service_icon_10.svg",
      slug: "google-ads",
      title: "Google Ads",
      desc: "Reach the right audience instantly and drive leads with targeted Google Ads campaigns.",
      category: "Digital Marketing",
      badge: "Digital Marketing",
    },
  ];

  // smooth scroll to filters (with header offset)
  const scrollToFilters = () => {
    const el = filterRef.current;
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Sync filter with URL slug
  useEffect(() => {
    if (categorySlug) {
      setActiveFilter(fromSlug(categorySlug));
      setPage(1);
    } else {
      setActiveFilter("All");
      setPage(1);
    }
  }, [categorySlug]);

  // Canonical (absolute URL, no query/hash)
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://skyupdigitalsolutions.com";

  const canonicalUrl = `${origin}${location.pathname}`;

  const pageTitle = categorySlug
    ? `Services - ${activeFilter}`
    : "Services";

  // Update URL when user changes filter + don't jump to top + scroll to filters
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);

    if (filter === "All") {
      navigate("/service", { replace: true, preventScrollReset: true });
    } else {
      const slug = toSlug(filter);
      navigate(`/service/category/${slug}`, {
        replace: true,
        preventScrollReset: true,
      });
    }

    // wait for render then scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToFilters);
    });
  };

  // Filtered cards
  const filteredCards = useMemo(() => {
    if (activeFilter === "All") return cards;
    return cards.filter((c) => c.category === activeFilter);
  }, [activeFilter, cards]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedCards = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCards.slice(start, start + PAGE_SIZE);
  }, [filteredCards, page]);

  // Animations
  const grid = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 16, scale: 0.985, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.9 },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.98,
      filter: "blur(6px)",
      transition: { duration: 0.18, ease: "easeOut" },
    },
  };

  const showPagination = filteredCards.length > PAGE_SIZE;

  return (
    <section className="w-full bg-[#F7F9FC] font-poppins overflow-hidden">
      <Helmet prioritizeSeoTags>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        {/* FILTER BAR */}
        <div
          ref={filterRef}
          className="mb-8 rounded-3xl sm:rounded-full border border-[#ded8fa] bg-[#F1EEFF] px-3 py-3 sm:px-4 sm:py-4"
        >
          {/* Mobile: Dropdown */}
          <div className="sm:hidden">
            <label className="block text-[16px] font-semibold text-[#111827] mb-2">
              Filter by category
            </label>

            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="
                  w-full appearance-none
                  rounded-xl bg-white
                  border border-[#E7E9F5]
                  px-4 py-3 pr-10
                  text-[13px] font-semibold text-[#111827]
                  focus:outline-none focus:ring-2 focus:ring-[#0B3BFF]/30
                "
              >
                {FILTERS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#111827]/60 rotate-90" />
            </div>
          </div>

          {/* ✅ Desktop/Tablet: Pills */}
          <div className="hidden sm:flex flex-wrap gap-2 sm:gap-3">
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  className={[
                    "rounded-full px-4 py-2 text-[12px] sm:text-[13px] font-semibold transition-all",
                    isActive
                      ? "bg-[#0B3BFF] text-white"
                      : "bg-white text-[#111827] border border-[#E7E9F5] hover:bg-[#EEF1FF]",
                  ].join(" ")}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* CARD GRID */}
        <motion.div
          key={`${activeFilter}-${page}`}
          variants={grid}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {paginatedCards.map((c) => (
              <Card
                key={c.slug}
                title={c.title}
                desc={c.desc}
                badge={c.badge}
                icon={c.Icon}
                variants={cardAnim}
                onClick={() => navigate(`/services/${c.slug}`)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* PAGINATION */}
        {showPagination && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-2 py-2 text-[12px] sm:text-[13px] font-semibold transition",
                page === 1
                  ? "border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed bg-white"
                  : "border-[#E7E9F5] text-[#111827] bg-white hover:bg-[#EEF1FF]",
              ].join(" ")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                const active = p === page;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={[
                      "h-9 w-9 rounded-full text-[13px] font-semibold transition",
                      active
                        ? "bg-[#0B3BFF] text-white"
                        : "bg-white text-[#111827] border border-[#E7E9F5] hover:bg-[#EEF1FF]",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-2 py-2 text-[12px] sm:text-[13px] font-semibold transition",
                page === totalPages
                  ? "border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed bg-white"
                  : "border-[#E7E9F5] text-[#111827] bg-white hover:bg-[#EEF1FF]",
              ].join(" ")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ title, desc, badge = "Featured Service", icon, variants, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{
        y: -8,
        scale: 1.01,
        boxShadow: "0_22px_60px_rgba(15,23,42,0.10)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="
        text-left
        rounded-2xl bg-white
        border border-[#E9EEF6]
        shadow-[0_14px_40px_rgba(15,23,42,0.06)]
        p-6 sm:p-7 lg:p-8
        min-h-[210px] sm:min-h-[240px]
        w-full
      "
    >
      <div className="h-11 w-11 rounded-xl flex items-center justify-center">
        <img
          src={icon}
          alt=""
          className="h-7 w-7 sm:h-[48px] sm:w-[48px]"
          loading="lazy"
          draggable={false}
        />
      </div>

      <span className="mt-3 inline-block text-[11px] sm:text-[12px] font-medium text-[#ff8000] w-fit">
        {badge}
      </span>

      <h3 className="mt-2 text-[20px] font-bold text-[#121826]">{title}</h3>

      <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-[#3B4252] max-w-[34ch]">
        {desc}
      </p>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F1F3F7] px-3 py-2 text-[14px] font-semibold text-[#0037CA] hover:bg-[#0037CA] hover:text-white transition">
        View More <MoveUpRight className="h-4 w-4" />
      </div>
    </motion.button>
  );
}
