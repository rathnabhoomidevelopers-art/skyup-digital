import { BLOGS } from "../data/blogs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useCallback } from "react";

const MotionA = motion.a;

const BLOGS_PER_PAGE = 6;

// ─── Pagination hook ──────────────────────────────────────────────────────────
function usePagination(items, perPage) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / perPage);

  const paginated = useMemo(
    () => items.slice((page - 1) * perPage, page * perPage),
    [items, page, perPage]
  );

  const goTo = useCallback(
    (n) => {
      if (n < 1 || n > totalPages) return;
      setPage(n);
      document
        .getElementById("blogs-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [totalPages]
  );

  return { page, totalPages, paginated, goTo };
}

// ─── Pagination UI ────────────────────────────────────────────────────────────
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
    return pages.filter(
      (v, i, a) => !(v === "..." && a[i - 1] === "...")
    );
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 mb-2">
      {/* Prev */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0037CA] hover:text-[#0037CA] disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((num, idx) =>
        num === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="h-9 w-9 flex items-center justify-center text-slate-400 text-[13px]"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={num}
            onClick={() => goTo(num)}
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
        className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0037CA] hover:text-[#0037CA] disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Blog card ────────────────────────────────────────────────────────────────
function BlogCard({ blog, index }) {
  return (
    <motion.a
      href={`/blogs/${blog.slug}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="group flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.09)] transition-shadow no-underline"
    >
      {/* Thumbnail */}
      <div className="overflow-hidden bg-slate-100 h-[200px]">
        <img
          src={blog.heroImage || blog.image}
          alt={blog.imageAlt || blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="inline-flex self-start rounded-full bg-[#EEF1FF] text-[#0037CA] px-2.5 py-0.5 text-[10px] font-semibold">
          {blog.category}
        </span>

        <h3 className="text-[14px] font-bold text-[#111827] leading-snug line-clamp-2 group-hover:text-[#0037CA] transition-colors">
          {blog.headline || blog.title}
        </h3>

        <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {blog.excerpt || blog.description || ""}
        </p>

        <div className="flex items-center gap-2 pt-1 mt-auto text-[11px] text-slate-400">
          <span>{blog.author}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
          <span>{blog.date}</span>
        </div>
      </div>
    </motion.a>
  );
}

// ─── Animations ───────────────────────────────────────────────────────────────
const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};
const staggerWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export function Blogs() {
  const { page, totalPages, paginated, goTo } = usePagination(
    BLOGS,
    BLOGS_PER_PAGE
  );

  return (
    <div className="font-poppins">
      <Header />

      {/* Hero banner */}
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
      </motion.div>

      {/* ── Paginated blog grid ── */}
      <div
        id="blogs-grid"
        className="scroll-mt-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10"
      >
        {/* Header row: count + top pagination */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[13px] text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {(page - 1) * BLOGS_PER_PAGE + 1}–
                {Math.min(page * BLOGS_PER_PAGE, BLOGS.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {BLOGS.length}
              </span>{" "}
              articles
            </p>
          </div>

          <Pagination page={page} totalPages={totalPages} goTo={goTo} />
        </div>

        {/* Cards — AnimatePresence fades out old page, fades in new */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginated.map((blog, idx) => (
              <BlogCard key={blog.slug} blog={blog} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom pagination */}
        <Pagination page={page} totalPages={totalPages} goTo={goTo} />
      </div>

      {/* CTA section */}
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
            Serving companies of every scale. Connect with us to start the
            conversation.
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

      {/* ── Floating WhatsApp + Call ── */}
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
          style={{ width: "52px", height: "52px", transition: "width 0.3s ease", paddingRight: "0" }}
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
            style={{ maxWidth: "0", opacity: "0", overflow: "hidden", transition: "max-width 0.3s ease, opacity 0.3s ease" }}
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
          style={{ width: "52px", height: "52px", transition: "width 0.3s ease" }}
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
            style={{ maxWidth: "0", opacity: "0", overflow: "hidden", transition: "max-width 0.3s ease, opacity 0.3s ease" }}
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