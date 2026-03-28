import BlogsContainer from "../components/BlogsContainer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";

const MotionA = motion.a;
const BLOGS_PER_PAGE = 6;

// ─── Pagination bar ───────────────────────────────────────────────────────────
function Pagination({ page, totalPages, goTo }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (
        (i === page - 2 && page - 2 > 1) ||
        (i === page + 2 && page + 2 < totalPages)
      ) {
        pages.push("...");
      }
    }
    return pages.filter((v, i, a) => !(v === "..." && a[i - 1] === "..."));
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      {/* Prev */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0037CA] hover:text-[#0037CA] disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((num, idx) =>
        num === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="h-9 w-9 flex items-center justify-center text-slate-400 text-[13px] select-none"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={num}
            onClick={() => goTo(num)}
            aria-label={`Go to page ${num}`}
            aria-current={num === page ? "page" : undefined}
            className={[
              "h-9 w-9 rounded-full text-[13px] font-semibold transition",
              num === page
                ? "bg-[#0037CA] text-white border border-[#0037CA]"
                : "border border-slate-200 text-slate-600 hover:border-[#0037CA] hover:text-[#0037CA]",
            ].join(" ")}
          >
            {num}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0037CA] hover:text-[#0037CA] disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Animations (original) ────────────────────────────────────────────────────
const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};
const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export function Blogs() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // BlogsContainer calls this whenever its filtered blog count changes
  const handleTotalPages = useCallback((filteredCount) => {
    setTotalPages(Math.max(1, Math.ceil(filteredCount / BLOGS_PER_PAGE)));
  }, []);

  // BlogsContainer calls this when the category filter changes → reset to page 1
  const handleCategoryChange = useCallback(() => {
    setPage(1);
  }, []);

  const goTo = useCallback(
    (n) => {
      if (n < 1 || n > totalPages) return;
      setPage(n);
      // Scroll back up to the top of the blog grid smoothly
      document
        .getElementById("blogs-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [totalPages]
  );

  return (
    <div className="font-poppins">
      <Header />

      {/* ── Hero banner (original, untouched) ── */}
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
        className="h-[221px] sm:h-[400px] flex flex-col items-center bg-[#EEF1FC] justify-center relative"
      >
        <div className="text-blue-600 font-semibold text-[18px]">Blogs Hub</div>
        <motion.div variants={fadeUp}>
          <h1 className="text-center mt-2 lg:text-[64px] sm:text-[32px] text-[24px] fw-bold">
            Digital Growth <span className="text-[#0037CA]">Insights</span> In
            Bangalore
          </h1>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-center text-[12px] px-3 sm:text-[18px] mt-2 lg:text-[18px]"
        >
          Clear guidance, practical tips, and market updates—with added
          strategies for the Bangalore region.
        </motion.p>

        {/* Breadcrumb — pinned to bottom of banner */}
        <div className="absolute bottom-0 left-0 right-0 px-8 py-2.5 bg-[#0037CA]/10 border-t border-[#0037CA]/10">
          <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-slate-600">
            <a href="/" className="hover:text-[#0037CA] transition-colors">Home</a>
            <span className="text-slate-400 text-[11px]">{">>"}</span>
            <span className="text-[#0037CA] font-semibold">Blog</span>
          </div>
        </div>
      </motion.div>

      {/* ── Blogs section ── */}
      {/*
        id="blogs-section" is the scroll target when a page number is clicked.
        BlogsContainer receives 4 new props:
          - page          → current page number (1-based)
          - perPage       → how many blogs to show (6)
          - onTotalPages  → callback(filteredCount) so this parent can compute totalPages
          - onCategoryChange → callback() to reset page to 1 on filter change
        Everything else inside BlogsContainer (category filter UI, card layout, etc.) stays the same.
      */}
      <div id="blogs-section" className="scroll-mt-4">
        <BlogsContainer
          page={page}
          perPage={BLOGS_PER_PAGE}
          onTotalPages={handleTotalPages}
          onCategoryChange={handleCategoryChange}
        />

        {/* Pagination bar lives here, below the grid */}
        <Pagination page={page} totalPages={totalPages} goTo={goTo} />
      </div>

      {/* ── CTA section (original, untouched) ── */}
      <div className="bg-[#FFF8F0] mt-6 py-1">
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="
            mx-auto
            m-[60px]
            sm:m-[70px]
            text-center
            font-poppins
            px-3
            sm:max-w-[800px]
          "
        >
          <h2 className="text-[#0037CA] font-bold text-[24px] sm:text-[64px] leading-tight">
            Ready to Grow Faster?
          </h2>

          <p className="mt-3 text-[#2B2B2B] text-[16px] sm:text-[20px] leading-relaxed">
            Serving companies of every scale. Connect with us to start the
            conversation.
          </p>

          <div className="mt-8 flex justify-center">
            <MotionA
              href="/contactus"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="
                bg-[#0037CA] text-white
                font-semibold text-sm sm:text-base
                px-6 py-2.5
                rounded-full
                shadow-[0_10px_24px_rgba(0,0,0,0.18)]
                hover:scale-[1.03] active:scale-[0.99]
                transition-transform
                inline-flex items-center justify-center
                no-underline
              "
            >
              GET STARTED
            </MotionA>
          </div>
        </motion.section>
      </div>

      {/* ── Floating WhatsApp + Call (original, untouched) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
        className="fixed bottom-5 right-4 z-[9999] flex flex-col items-end gap-4 font-poppins"
      >
        {/* WhatsApp - Mobile */}
        <a
          href="https://wa.me/918867867775"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-chat sm:hidden w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
        >
          <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7" />
        </a>

        {/* WhatsApp - Desktop */}
        <a
          href="https://wa.me/918867867775"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-chat-gtm hidden sm:inline-flex no-underline relative items-center bg-white rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{
            width: "52px",
            height: "52px",
            transition: "width 0.3s ease",
            paddingRight: "0",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = "190px";
            e.currentTarget.querySelector(".wa-label").style.opacity = "1";
            e.currentTarget.querySelector(".wa-label").style.maxWidth = "120px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = "52px";
            e.currentTarget.querySelector(".wa-label").style.opacity = "0";
            e.currentTarget.querySelector(".wa-label").style.maxWidth = "0";
          }}
        >
          <span
            className="wa-label font-semibold text-base text-slate-800 whitespace-nowrap pl-3"
            style={{
              maxWidth: "0",
              opacity: "0",
              overflow: "hidden",
              transition: "max-width 0.3s ease, opacity 0.3s ease",
            }}
          >
            WhatsApp
          </span>
          <span className="absolute right-[4px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)] shrink-0">
            <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7" />
          </span>
        </a>

        {/* Call - Mobile */}
        <a
          href="tel:+918867867775"
          className="tel-chat sm:hidden w-12 h-12 rounded-xl bg-[#3B46F6] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
        >
          <img src="/images/call.svg" alt="call" className="w-7 h-7" />
        </a>

        {/* Call - Desktop */}
        <a
          href="tel:+918867867775"
          className="tel-chat-gtm hidden sm:inline-flex no-underline relative items-center bg-white rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{
            width: "52px",
            height: "52px",
            transition: "width 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = "220px";
            e.currentTarget.querySelector(".call-label").style.opacity = "1";
            e.currentTarget.querySelector(".call-label").style.maxWidth = "160px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = "52px";
            e.currentTarget.querySelector(".call-label").style.opacity = "0";
            e.currentTarget.querySelector(".call-label").style.maxWidth = "0";
          }}
        >
          <span
            className="call-label font-semibold text-base text-slate-800 whitespace-nowrap pl-3"
            style={{
              maxWidth: "0",
              opacity: "0",
              overflow: "hidden",
              transition: "max-width 0.3s ease, opacity 0.3s ease",
            }}
          >
            +91 8867867775
          </span>
          <span className="absolute right-[4px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#3B46F6] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)] shrink-0">
            <img src="/images/call.svg" alt="call" className="w-7 h-7" />
          </span>
        </a>
      </motion.div>

      <Footer />
    </div>
  );
}
