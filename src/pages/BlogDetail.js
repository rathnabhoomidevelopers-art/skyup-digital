import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Linkedin } from "lucide-react";
import { BLOGS } from "../data/blogs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactCTAContainer from "../components/ContactCTAContainer";
import { motion } from "framer-motion";
import { Facebook, Youtube, MessageCircle } from "lucide-react";
import { usePageContext } from "vike-react/usePageContext";

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[""''"'`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// Heading size map — mirrors DynamicBlog
const HEADING_SIZE = {
  h2: "text-[20px] sm:text-[24px]",
  h3: "text-[16px] sm:text-[18px]",
  h4: "text-[15px] sm:text-[16px]",
  h5: "text-[13px] sm:text-[14px]",
  h6: "text-[12px] sm:text-[13px]",
};

export default function BlogDetail() {
  const { routeParams } = usePageContext();
  const slug = routeParams?.slug;

  const blog = BLOGS.find((b) => b.slug === slug);

  const sections = blog?.sections?.length
    ? blog.sections
    : [
        {
          type: "p",
          text: "Content not added yet. Add sections in src/data/blogs.js",
        },
      ];

  const TOC_HEADING_TYPES = new Set([
    "h2","h3","h4","h5","h6",
    "h2_with_link","h3_with_link","h4_with_link","h5_with_link","h6_with_link",
  ]);

  const toc = useMemo(() => {
    const used = new Map();
    const items = [];

    sections.forEach((s) => {
      if (!TOC_HEADING_TYPES.has(s.type)) return;

      const rawText = s.linkText || s.text;
      if (!rawText) return;

      const base = slugify(rawText);
      const count = (used.get(base) || 0) + 1;
      used.set(base, count);

      const id = count === 1 ? base : `${base}-${count}`;
      const tag = s.type.replace("_with_link","");
      items.push({ id, text: rawText, level: tag });
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
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        rootMargin: "-25% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      },
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

  // Helper: resolve font weight class (stored as Tailwind class or legacy)
  const fw = (section, defaultFw = "font-normal") => section.fontWeight || defaultFw;

  return (
    <section className="w-full bg-white font-poppins">
      <Header />
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex">
          {/* Social sidebar */}
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

            <h1 className="mt-3 text-[22px] sm:text-[28px] lg:text-[38px] font-bold text-[#111827] leading-tight">
              {blog.headline}
            </h1>

           <div className="mt-2 text-[12px] text-slate-500 flex items-center gap-3">
              <span>{blog.author}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{blog.date}</span>
            </div>

            {/* Breadcrumb — below author/date, no background */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap text-[12px] text-slate-400">
              <a href="/" className="hover:text-[#0B3BFF] transition-colors no-undeline">Home</a>
              <span className="text-slate-300 text-[10px]">{">>"}</span>
              <a href="/blogs" className="hover:text-[#0B3BFF] transition-colors text-[#0037CA] no-undeline">Blog</a>
              <span className="text-slate-300 text-[10px]">{">>"}</span>
              <span className="text-slate-500 line-clamp-1 max-w-[420px] sm:max-w-[600px]">{blog.title}</span>
            </div>

            <div className="mt-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
              <img
                src={blog.heroImage || blog.image}
                alt={blog.imageAlt || blog.title}
                className="w-full h-[210px] sm:h-full object-cover"
              />
            </div>

            {/* content */}
            <div className="mt-6 space-y-5">
              {(() => {
                const used = new Map();

                // Generic heading renderer for h2–h6
                const renderHeading = (s, i, tag) => {
                  const rawText = s.text || "";
                  const base = slugify(rawText);
                  const count = (used.get(base) || 0) + 1;
                  used.set(base, count);
                  const id = count === 1 ? base : `${base}-${count}`;
                  const sizeClass = HEADING_SIZE[tag] || HEADING_SIZE.h6;
                  const fontWeightClass = fw(s, "font-bold");
                  return React.createElement(tag, {
                    key: i,
                    id,
                    className: `scroll-mt-28 ${sizeClass} ${fontWeightClass} text-[#111827]`,
                    dangerouslySetInnerHTML: { __html: rawText },
                  });
                };

                // Generic heading-with-link renderer
                const renderHeadingWithLink = (s, i, tag) => {
                  const base = slugify(s.linkText || "");
                  const count = (used.get(base) || 0) + 1;
                  used.set(base, count);
                  const id = count === 1 ? base : `${base}-${count}`;
                  const sizeClass = HEADING_SIZE[tag] || HEADING_SIZE.h6;
                  const fontWeightClass = fw(s, "font-bold");
                  return React.createElement(tag, {
                    key: i,
                    id,
                    className: `scroll-mt-28 ${sizeClass} ${fontWeightClass} text-[#111827]`,
                  }, [
                    s.textBefore ? s.textBefore.trimEnd() + " " : "",
                    <a
                      key="link"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B3BFF] no-underline hover:opacity-80 transition-opacity"
                    >
                      {s.linkText}
                    </a>,
                    s.textAfter ? " " + s.textAfter.trimStart() : "",
                  ]);
                };

                return sections.map((s, i) => {
                  // ── h2–h6 plain ──────────────────────────────────────────
                  if (s.type === "h2") return renderHeading(s, i, "h2");
                  if (s.type === "h3") return renderHeading(s, i, "h3");
                  if (s.type === "h4") return renderHeading(s, i, "h4");
                  if (s.type === "h5") return renderHeading(s, i, "h5");
                  if (s.type === "h6") return renderHeading(s, i, "h6");

                  // ── h2–h6 with link ──────────────────────────────────────
                  if (s.type === "h2_with_link") return renderHeadingWithLink(s, i, "h2");
                  if (s.type === "h3_with_link") return renderHeadingWithLink(s, i, "h3");
                  if (s.type === "h4_with_link") return renderHeadingWithLink(s, i, "h4");
                  if (s.type === "h5_with_link") return renderHeadingWithLink(s, i, "h5");
                  if (s.type === "h6_with_link") return renderHeadingWithLink(s, i, "h6");

                  // ── quote ────────────────────────────────────────────────
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

                  // ── image ────────────────────────────────────────────────
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

                  // ── p_with_link ──────────────────────────────────────────
                  if (s.type === "p_with_link") {
                    return (
                      <p
                        key={i}
                        className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${fw(s)}`}
                      >
                        {s.textBefore ? s.textBefore.trimEnd() + " " : ""}
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0B3BFF] font-semibold no-underline hover:opacity-90"
                        >
                          {s.linkText}
                        </a>
                        {s.textAfter ? " " + s.textAfter.trimStart() : ""}
                      </p>
                    );
                  }

                  // ── p_with_bold ──────────────────────────────────────────
                  if (s.type === "p_with_bold") {
                    return (
                      <p
                        key={i}
                        className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${fw(s)}`}
                      >
                        {s.parts.map((part, idx) =>
                          part.bold ? (
                            <strong key={idx} className="font-semibold text-[#111827]">
                              {part.text}
                            </strong>
                          ) : (
                            <span key={idx}>{part.text}</span>
                          ),
                        )}
                      </p>
                    );
                  }

                  // ── p_with_link_bold ─────────────────────────────────────
                  if (s.type === "p_with_link_bold") {
                    return (
                      <p
                        key={i}
                        className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${fw(s)}`}
                      >
                        {s.partsBefore?.map((part, idx) =>
                          part.bold ? (
                            <strong key={idx} className="font-semibold text-[#111827]">
                              {part.text}
                            </strong>
                          ) : (
                            <span key={idx}>{part.text}</span>
                          ),
                        )}
                        {" "}
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0B3BFF] font-semibold no-underline hover:opacity-90"
                        >
                          {s.linkText}
                        </a>
                        {" "}
                        {s.partsAfter?.map((part, idx) =>
                          part.bold ? (
                            <strong key={idx} className="font-semibold text-[#111827]">
                              {part.text}
                            </strong>
                          ) : (
                            <span key={idx}>{part.text}</span>
                          ),
                        )}
                      </p>
                    );
                  }

                  // ── ul ───────────────────────────────────────────────────
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

                  // ── ol ───────────────────────────────────────────────────
                  if (s.type === "ol") {
                    return (
                      <ol
                        key={i}
                        className="list-decimal list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-800"
                      >
                        {s.text.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  // ── table ────────────────────────────────────────────────
                  if (s.type === "table") {
                    return (
                      <div
                        key={i}
                        className="overflow-x-auto rounded-xl border border-slate-200"
                      >
                        <table className="w-full text-[13px] sm:text-[14px] text-slate-700 border-collapse">
                          <thead>
                            <tr>
                              {(s.headers || []).map((h, hi) => (
                                <th
                                  key={hi}
                                  className="text-left px-4 py-3 font-bold border border-slate-200 text-[#111827]"
                                  style={{
                                    background: s.themed ? "#DBEAFE" : "#ffffff",
                                  }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(s.rows || []).map((row, ri) => (
                              <tr
                                key={ri}
                                style={{
                                  background: s.themed
                                    ? ri % 2 === 0
                                      ? "#EFF6FF"
                                      : "#DBEAFE"
                                    : "#ffffff",
                                }}
                              >
                                {row.map((cell, ci) => (
                                  <td
                                    key={ci}
                                    className="px-4 py-2.5 border border-slate-200"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  // ── default paragraph ────────────────────────────────────
                  return (
                    <p
                      key={i}
                      className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${fw(s)}`}
                      dangerouslySetInnerHTML={{ __html: s.text }}
                    />
                  );
                });
              })()}
            </div>
          </div>

          {/* Right Table of Contents */}
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
                      const indentClass =
                        t.level === "h3" ? "pl-4" :
                        t.level === "h4" ? "pl-7" :
                        t.level === "h5" ? "pl-10" :
                        t.level === "h6" ? "pl-12 text-[12px]" : "";
                      return (
                        <button
                          key={t.id}
                          onClick={() => scrollToId(t.id)}
                          className={[
                            "w-full text-left rounded-lg px-2 py-1.5 text-[14px] leading-snug transition",
                            indentClass,
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

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
        className="fixed bottom-5 right-4 z-[9999] flex flex-col items-end gap-4 font-poppins"
      >
        <a
          href="https://wa.me/918867867775"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-chat sm:hidden w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
        >
          <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7" />
        </a>

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
            style={{ maxWidth: "0", opacity: "0", overflow: "hidden", transition: "max-width 0.3s ease, opacity 0.3s ease" }}
          >
            WhatsApp
          </span>
          <span className="absolute right-[4px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)] shrink-0">
            <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7" />
          </span>
        </a>

        <a
          href="tel:+918867867775"
          className="tel-chat sm:hidden w-12 h-12 rounded-xl bg-[#3B46F6] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
        >
          <img src="/images/call.svg" alt="call" className="w-7 h-7" />
        </a>

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
    </section>
  );
}
