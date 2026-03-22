import { ChevronLeft, Linkedin, ChevronRight } from "lucide-react";
import { BLOGS } from "../data/blogs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactCTAContainer from "../components/ContactCTAContainer";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Youtube, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { usePageContext } from "vike-react/usePageContext";

const BLOGS_PER_PAGE = 6;

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[""''"'`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

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
      // Scroll to the "More Articles" heading smoothly
      document
        .getElementById("more-articles")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [totalPages]
  );

  return { page, totalPages, paginated, goTo };
}

// ─── Pagination UI component ──────────────────────────────────────────────────
function Pagination({ page, totalPages, goTo }) {
  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis: always show first, last, current ±1
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      } else if (
        (i === page - 2 && page - 2 > 1) ||
        (i === page + 2 && page + 2 < totalPages)
      ) {
        pages.push("...");
      }
    }
    // Deduplicate consecutive ellipses
    return pages.filter((v, i, a) => !(v === "..." && a[i - 1] === "..."));
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* Prev */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0B3BFF] hover:text-[#0B3BFF] disabled:opacity-30 disabled:cursor-not-allowed transition"
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
                ? "bg-[#0B3BFF] text-white border border-[#0B3BFF]"
                : "border border-slate-200 text-slate-600 hover:border-[#0B3BFF] hover:text-[#0B3BFF]",
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
        className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0B3BFF] hover:text-[#0B3BFF] disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Blog card (used in the paginated grid) ───────────────────────────────────
function BlogCard({ blog, index }) {
  return (
    <motion.a
      href={`/blogs/${blog.slug}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="group flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow no-underline"
    >
      {/* Thumbnail */}
      <div className="overflow-hidden bg-slate-100 h-[180px]">
        <img
          src={blog.heroImage || blog.image}
          alt={blog.imageAlt || blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="inline-flex self-start rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-2.5 py-0.5 text-[10px] font-semibold">
          {blog.category}
        </span>

        <h3 className="text-[14px] font-bold text-[#111827] leading-snug line-clamp-2 group-hover:text-[#0B3BFF] transition-colors">
          {blog.headline || blog.title}
        </h3>

        <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {blog.excerpt || blog.description || ""}
        </p>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 mt-auto">
          <span>{blog.author}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
          <span>{blog.date}</span>
        </div>
      </div>
    </motion.a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BlogDetail() {
  const { routeParams } = usePageContext();
  const slug = routeParams?.slug;

  const blog = BLOGS.find((b) => b.slug === slug);

  // Other blogs excluding the current one — used for the paginated grid
  const otherBlogs = useMemo(
    () => BLOGS.filter((b) => b.slug !== slug),
    [slug]
  );

  const { page, totalPages, paginated, goTo } = usePagination(
    otherBlogs,
    BLOGS_PER_PAGE
  );

  const sections = blog?.sections?.length
    ? blog.sections
    : [
        {
          type: "p",
          text: "Content not added yet. Add sections in src/data/blogs.js",
        },
      ];

  // Build TOC from h2/h3 headings
  const toc = useMemo(() => {
    const used = new Map();
    const items = [];

    sections.forEach((s) => {
      if ((s.type !== "h2" && s.type !== "h3") || !s.text) return;

      const base = slugify(s.text);
      const count = (used.get(base) || 0) + 1;
      used.set(base, count);

      const id = count === 1 ? base : `${base}-${count}`;
      items.push({ id, text: s.text });
    });

    return items;
  }, [sections]);

  const [activeId, setActiveId] = useState(toc[0]?.id || "");

  useEffect(() => {
    if (!toc.length) return;

    const headingEls = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);

    if (!headingEls.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
          )[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        rootMargin: "-25% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    headingEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  if (!blog) {
    return (
      <section className="w-full font-poppins">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 py-10">
          <p className="text-slate-700">Blog not found.</p>
          <a href="/blogs" className="text-[#0B3BFF] no-underline font-semibold">
            Go back
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white font-poppins">
      <Header />

      <div className="relative">
        {/* ── Top section: sidebar + content + TOC ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex">
          {/* Left social share */}
          <div className="hidden lg:block w-[80px] mr-6">
            <div className="sticky top-64 flex flex-col gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61584820941998"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] hover:bg-[#0B3BFF] hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/918867867775"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] hover:bg-[#25D366] hover:text-white transition"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/110886969"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] hover:bg-[#1DA1F2] hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@SKYUPDigitalSolutionsBengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] hover:bg-[#FF0000] hover:text-white transition"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Blog content */}
          <div className="flex-1 max-w-6xl">
            <a
              href="/blogs"
              className="inline-flex no-underline items-center gap-2 text-[12px] font-semibold text-slate-700 hover:text-[#0B3BFF] transition"
            >
              <span className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center">
                <ChevronLeft className="h-4 w-4" />
              </span>
              Back&nbsp;to&nbsp;Blog
            </a>

            <div className="mt-4">
              <span className="inline-flex rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-3 py-1 text-[11px] font-semibold">
                {blog.category}
              </span>
            </div>

            <h1 className="mt-3 text-[22px] sm:text-[28px] lg:text-[38px] fw-bold text-[#111827] leading-tight">
              {blog.headline}
            </h1>

            <div className="mt-2 text-[12px] text-slate-500 flex items-center gap-3">
              <span>{blog.author}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{blog.date}</span>
            </div>

            <div className="mt-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
              <img
                src={blog.heroImage || blog.image}
                alt={blog.imageAlt || blog.title}
                className="w-full h-[210px] sm:h-full object-cover"
              />
            </div>

            {/* Article body */}
            <div className="mt-6 space-y-5">
              {(() => {
                const used = new Map();

                return sections.map((s, i) => {
                  if (s.type === "h2") {
                    const base = slugify(s.text || "");
                    const count = (used.get(base) || 0) + 1;
                    used.set(base, count);
                    const id = count === 1 ? base : `${base}-${count}`;
                    return (
                      <h2
                        key={i}
                        id={id}
                        className="scroll-mt-28 text-[20px] sm:text-[24px] font-bold text-[#111827]"
                      >
                        {s.text}
                      </h2>
                    );
                  }

                  if (s.type === "h3") {
                    const base = slugify(s.text || "");
                    const count = (used.get(base) || 0) + 1;
                    used.set(base, count);
                    const id = count === 1 ? base : `${base}-${count}`;
                    return (
                      <h3
                        key={i}
                        id={id}
                        className="scroll-mt-28 text-[16px] sm:text-[18px] font-bold text-[#111827]"
                      >
                        {s.text}
                      </h3>
                    );
                  }

                  if (s.type === "quote") {
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-[#E7E9F5] bg-[#F7F9FF] px-4 py-4 text-[13px] sm:text-[14px] text-slate-700"
                      >
                        <div className="border-l-4 border-[#0B3BFF] pl-3 italic leading-relaxed">
                          {s.text}
                        </div>
                      </div>
                    );
                  }

                  if (s.type === "image") {
                    return (
                      <figure
                        key={i}
                        className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50"
                      >
                        <img
                          src={s.src}
                          alt={s.caption || "Blog image"}
                          className="w-full h-auto"
                        />
                        {s.caption ? (
                          <figcaption className="px-4 py-3 text-[12px] text-slate-500">
                            {s.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    );
                  }

                  if (s.type === "p_with_link") {
                    return (
                      <p
                        key={i}
                        className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600"
                      >
                        {s.textBefore}
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0B3BFF] font-semibold no-underline hover:opacity-90"
                        >
                          {s.linkText}
                        </a>
                        {s.textAfter}
                      </p>
                    );
                  }

                  if (s.type === "p_with_bold") {
                    return (
                      <p
                        key={i}
                        className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600"
                      >
                        {s.parts.map((part, idx) =>
                          part.bold ? (
                            <strong key={idx} className="font-semibold text-[#111827]">
                              {part.text}
                            </strong>
                          ) : (
                            <span key={idx}>{part.text}</span>
                          )
                        )}
                      </p>
                    );
                  }

                  if (s.type === "p_with_link_bold") {
                    return (
                      <p
                        key={i}
                        className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600"
                      >
                        {s.partsBefore?.map((part, idx) =>
                          part.bold ? (
                            <strong key={idx} className="font-semibold text-[#111827]">
                              {part.text}
                            </strong>
                          ) : (
                            <span key={idx}>{part.text}</span>
                          )
                        )}
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0B3BFF] font-semibold no-underline hover:opacity-90"
                        >
                          {s.linkText}
                        </a>
                        {s.partsAfter?.map((part, idx) =>
                          part.bold ? (
                            <strong key={idx} className="font-semibold text-[#111827]">
                              {part.text}
                            </strong>
                          ) : (
                            <span key={idx}>{part.text}</span>
                          )
                        )}
                      </p>
                    );
                  }

                  if (s.type === "ul") {
                    return (
                      <ul
                        key={i}
                        className="list-disc list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-800"
                      >
                        {s.text.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p
                      key={i}
                      className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600"
                    >
                      {s.text}
                    </p>
                  );
                });
              })()}
            </div>
          </div>

          {/* Right TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-[300px] ml-6">
              <div className="sticky top-36">
                <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.06)] p-3">
                  <div className="text-[18px] font-bold text-slate-900 tracking-wide">
                    TABLE OF CONTENTS
                  </div>

                  <div className="mt-2 space-y-1 max-h-[240px] overflow-auto pr-1">
                    {toc.map((t) => {
                      const isActive = t.id === activeId;
                      return (
                        <button
                          key={t.id}
                          onClick={() => scrollToId(t.id)}
                          className={[
                            "w-full text-left rounded-lg px-2 py-1.5 text-[14px] leading-snug transition",
                            isActive
                              ? "bg-[#EEF1FF] text-[#0B3BFF] font-semibold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                          ].join(" ")}
                        >
                          {t.text}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400">
                    Tip: Click a heading to jump.
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* ── More Articles (paginated) ── */}
        {otherBlogs.length > 0 && (
          <div
            id="more-articles"
            className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-14"
          >
            {/* Divider + heading */}
            <div className="border-t border-slate-100 pt-10 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-bold text-[#111827]">
                  More articles
                </h2>
                <p className="text-[13px] text-slate-400 mt-0.5">
                  Page {page} of {totalPages} &mdash; showing{" "}
                  {(page - 1) * BLOGS_PER_PAGE + 1}–
                  {Math.min(page * BLOGS_PER_PAGE, otherBlogs.length)} of{" "}
                  {otherBlogs.length} articles
                </p>
              </div>

              {/* Top pagination controls (compact) */}
              <Pagination page={page} totalPages={totalPages} goTo={goTo} />
            </div>

            {/* Cards grid — AnimatePresence re-mounts cards on page change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {paginated.map((b, idx) => (
                  <BlogCard key={b.slug} blog={b} index={idx} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Bottom pagination controls */}
            <Pagination page={page} totalPages={totalPages} goTo={goTo} />
          </div>
        )}

        <ContactCTAContainer
          title={
            <>
              Looking for Digital Marketing Experts in{" "}
              <span className="block">Bangalore?</span>
            </>
          }
          subtitle="Our team can implement every strategy discussed here and help your business scale—fast and effectively."
        />
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
          style={{ width: "52px", height: "52px", transition: "width 0.3s ease" }}
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
    </section>
  );
}