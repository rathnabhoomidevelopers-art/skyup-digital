import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import { MoveUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BLOGS } from "../data/blogs";
import { navigate } from "vike/client/router";

const MotionA = motion.a;

const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};
const staggerWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};
const cardAnim = {
  hidden: { opacity: 0, y: 16, scale: 0.985, filter: "blur(6px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.9 },
  },
  exit: {
    opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)",
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

// ── Derive unique filters from blog data (trim to fix trailing spaces) ──
const FILTERS = ["All", ...new Set(BLOGS.map((b) => b.category.trim()))];

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const fromSlug = (slug) => FILTERS.find((f) => toSlug(f) === slug) || "All";

const PAGE_SIZE = 6;

const vikeNavigate = (path) => {
  try {
    navigate(path);
  } catch {
    window.location.href = path;
  }
};

function BlogCard({ blog }) {
  return (
    <motion.button
      type="button"
      onClick={() => vikeNavigate(`/blogs/${blog.slug}`)}
      layout
      variants={cardAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -8, scale: 1.01, boxShadow: "0 22px 60px rgba(15,23,42,0.10)" }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="text-left rounded-2xl bg-white border border-[#E9EEF6] shadow-[0_14px_40px_rgba(15,23,42,0.06)] overflow-hidden w-full"
    >
      {/* Hero image */}
      <div className="w-full h-[180px] sm:h-[200px] overflow-hidden bg-slate-100">
        <img
          src={blog.heroImage || blog.image || blog.coverImage}
          alt={blog.imageAlt || blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        <span className="inline-block text-[11px] sm:text-[12px] font-medium text-[#ff8000]">
          {blog.category.trim()}
        </span>
        <h3 className="mt-1 text-[16px] sm:text-[18px] font-bold text-[#121826] leading-snug line-clamp-2">
          {blog.headline || blog.title}
        </h3>
        <p className="mt-1 text-[13px] sm:text-[14px] leading-relaxed text-[#3B4252] line-clamp-2">
          {blog.description}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
          <span>{blog.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{blog.date}</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F1F3F7] px-3 py-2 text-[13px] font-semibold text-[#0037CA] hover:bg-[#0037CA] hover:text-white transition">
          Read More <MoveUpRight className="h-4 w-4" />
        </div>
      </div>
    </motion.button>
  );
};

export function Blogs() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const filterRef = useRef(null);
  const headerOffset = 90;

  const scrollToFilters = () => {
    const el = filterRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
    requestAnimationFrame(() => requestAnimationFrame(scrollToFilters));
  };

  // trim() both sides to handle trailing spaces in blog data
  const filteredBlogs = useMemo(() =>
    activeFilter === "All"
      ? BLOGS
      : BLOGS.filter((b) => b.category.trim() === activeFilter.trim()),
    [activeFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredBlogs.slice(start, start + PAGE_SIZE);
  }, [filteredBlogs, page]);

  const showPagination = filteredBlogs.length > PAGE_SIZE;

  return (
    <div className="font-poppins">
      <Header />

      {/* ── HERO BANNER ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        style={{
          backgroundImage: "url('/images/blogpage_banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-[221px] sm:h-[400px] flex flex-col items-center bg-[#EEF1FC] justify-center"
      >
        <div className="text-blue-600 font-semibold text-[18px]">Blogs Hub</div>
        <motion.div variants={fadeUp}>
          <h1 className="text-center mt-2 lg:text-[64px] sm:text-[32px] text-[24px] fw-bold">
            Digital Growth <span className="text-[#0037CA]">Insights</span> In Bangalore
          </h1>
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="text-center text-[12px] px-3 sm:text-[18px] mt-2 lg:text-[18px]"
        >
          Clear guidance, practical tips, and market updates—with added strategies for the Bangalore region.
        </motion.p>
      </motion.div>

      {/* ── BLOGS SECTION ── */}
      <section className="w-full bg-[#F7F9FC] font-poppins overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14">

          {/* ── FILTER BAR — exact same design as ServiceCardsSection ── */}
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
                  className="w-full appearance-none rounded-xl bg-white border border-[#E7E9F5] px-4 py-3 pr-10 text-[13px] font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0B3BFF]/30"
                >
                  {FILTERS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#111827]/60 rotate-90" />
              </div>
            </div>

            {/* Desktop/Tablet: Pills — exact same as ServiceCardsSection */}
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

          {/* ── BLOG CARD GRID ── */}
          <motion.div
            key={`${activeFilter}-${page}`}
            variants={grid}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {paginatedBlogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ── PAGINATION — exact same as ServiceCardsSection ── */}
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

      {/* ── CTA SECTION ── */}
      <div className="bg-[#FFF8F0] mt-6 py-1">
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto m-[60px] sm:m-[70px] text-center font-poppins px-3 sm:max-w-[800px]"
        >
          <h2 className="text-[#0037CA] font-bold text-[24px] sm:text-[64px] leading-tight">
            Ready to Grow Faster?
          </h2>
          <p className="mt-3 text-[#2B2B2B] text-[16px] sm:text-[20px] leading-relaxed">
            Serving companies of every scale. Connect with us to start the conversation.
          </p>
          <div className="mt-8 flex justify-center">
            <MotionA
              href="/contactus"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="bg-[#0037CA] text-white font-semibold text-sm sm:text-base px-6 py-2.5 rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:scale-[1.03] active:scale-[0.99] transition-transform inline-flex items-center justify-center no-underline"
            >
              GET STARTED
            </MotionA>
          </div>
        </motion.section>
      </div>

      {/* ── FLOATING BUTTONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
        className="fixed bottom-5 right-4 z-[9999] flex flex-col items-end gap-4 font-poppins"
      >
        <a href="https://wa.me/918867867775" target="_blank" rel="noopener noreferrer"
          className="whatsapp-chat sm:hidden w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
          <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7 text-white" />
        </a>
        <a href="https://wa.me/918867867775" target="_blank" rel="noopener noreferrer"
          className="whatsapp-chat-gtm hidden sm:inline-flex group no-underline relative items-center bg-white pl-3 pr-[70px] py-3 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-transform">
          <span className="text-slate-800 group-hover:text-green-600 font-semibold text-base whitespace-nowrap transition-colors">WhatsApp</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
            <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7 text-white" />
          </span>
        </a>
        <a href="tel:+918867867775"
          className="tel-chat sm:hidden w-12 h-12 rounded-xl bg-[#3B46F6] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
          <img src="/images/call.svg" alt="call" className="w-7 h-7 text-white" />
        </a>
        <a href="tel:+918867867775"
          className="tel-chat-gtm hidden sm:inline-flex group no-underline relative items-center bg-white pl-3 pr-[66px] py-3 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-transform">
          <span className="text-slate-800 group-hover:text-[#3B46F6] font-semibold text-base whitespace-nowrap transition-colors">+91 8867867775</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#3B46F6] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
            <img src="/images/call.svg" alt="call" className="w-7 h-7 text-white" />
          </span>
        </a>
      </motion.div>

      <Footer />
    </div>
  );
}
