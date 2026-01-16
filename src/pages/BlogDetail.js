import { ChevronLeft, Linkedin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BLOGS } from "../data/blogs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactCTAContainer from "../components/ContactCTAContainer";
import { motion } from "framer-motion";
import {
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[“”‘’"'`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function BlogDetail() {
  const { slug } = useParams();
  const blog = BLOGS.find((b) => b.slug === slug);

  const sections = blog?.sections?.length
    ? blog.sections
    : [{ type: "p", text: "Content not added yet. Add sections in src/data/blogs.js" }];

  // Build TOC from h3 headings
  const toc = useMemo(() => {
    const used = new Map();
    const items = [];

    sections.forEach((s) => {
      if (s.type !== "h3" || !s.text) return;

      const base = slugify(s.text);
      const count = (used.get(base) || 0) + 1;
      used.set(base, count);

      const id = count === 1 ? base : `${base}-${count}`;
      items.push({ id, text: s.text });
    });

    return items;
  }, [sections]);

  const [activeId, setActiveId] = useState(toc[0]?.id || "");

  // Observe headings and set active section
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
          <Link
            to="/blogs"
            className="text-[#0B3BFF] no-underline font-semibold"
          >
            Go back
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white font-poppins">
      <Header />

      {/* Main scrolling region including side elements and CTA */}
      <div className="relative">
        {/* Content row with left icons, main content, and TOC */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex">

          {/* Left social media icons (desktop only) */}
          <div className="hidden lg:block w-[80px] mr-6">
            <div className="sticky top-64 flex flex-col gap-4">
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] hover:bg-[#0B3BFF] hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
              </a>

              <a
                href="https://wa.me/?text=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] hover:bg-[#25D366] hover:text-white transition"
              >
                <MessageCircle className="h-5 w-5" />
              </a>

              <a
                href="https://www.linkedin.com/in/pooja-s-2480893a0/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] hover:bg-[#1DA1F2] hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href="https://www.youtube.com/@YOURCHANNEL"
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
            {/* back */}
            <Link
              to="/blogs"
              className="inline-flex no-underline items-center gap-2 text-[12px] font-semibold text-slate-700 hover:text-[#0B3BFF] transition"
            >
              <span className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center">
                <ChevronLeft className="h-4 w-4" />
              </span>
              Back&nbsp;to&nbsp;Blog
            </Link>

            {/* category */}
            <div className="mt-4">
              <span className="inline-flex rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-3 py-1 text-[11px] font-semibold">
                {blog.category}
              </span>
            </div>

            {/* title */}
            <div className="mt-3 h1 text-[22px] sm:text-[28px] fw-bold text-[#111827] leading-tight">
              {blog.title}
            </div>

            {/* meta */}
            <div className="mt-2 text-[12px] text-slate-500 flex items-center gap-3">
              <span>{blog.author}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{blog.date}</span>
            </div>

            {/* hero image */}
            <div className="mt-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
              <img
                src={blog.heroImage || blog.image}
                alt={blog.title}
                className="w-full h-[210px] sm:h-full object-cover"
              />
            </div>

            {/* content */}
            <div className="mt-6 space-y-5">
              {(() => {
                const used = new Map();

                return sections.map((s, i) => {
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

          {/* Right Table of Contents (desktop only) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-[300px] ml-6">
              <div className="sticky top-36 ">
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
          className=" whatsapp-chat
            sm:hidden
            w-12 h-12
            rounded-xl
            bg-[#25D366]
            flex items-center justify-center
            shadow-[0_12px_30px_rgba(0,0,0,0.25)]
          "
        >
          <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7 text-white" />
        </a>

        <a
          href="https://wa.me/918867867775"
          target="_blank"
          rel="noopener noreferrer"
          className=" whatsapp-chat-gtm
            hidden sm:inline-flex
            group no-underline relative items-center
            bg-white
            pl-3 pr-[70px] py-3
            rounded-xl
            shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            hover:scale-[1.02] transition-transform
          "
        >
          <span className="text-slate-800 group-hover:text-green-600 font-semibold text-base whitespace-nowrap transition-colors">
            WhatsApp
          </span>

          <span
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              w-11 h-11 rounded-xl
              bg-[#25D366]
              flex items-center justify-center
              shadow-[0_6px_16px_rgba(0,0,0,0.12)]
            "
          >
            <img src="/images/whatsapp.svg" alt="whatsapp" className="w-7 h-7 text-white" />
          </span>
        </a>

        <a
          href="tel:+918867867775"
          className=" tel-chat
            sm:hidden
            w-12 h-12
            rounded-xl
            bg-[#3B46F6]
            flex items-center justify-center
            shadow-[0_12px_30px_rgba(0,0,0,0.25)]
          "
        >
          <img src="/images/call.svg" alt="call" className="w-7 h-7 text-white" />
        </a>

        <a
          href="tel:+918867867775"
          className=" tel-chat-gtm
            hidden sm:inline-flex
            group no-underline relative items-center
            bg-white
            pl-3 pr-[66px] py-3
            rounded-xl
            shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            hover:scale-[1.02] transition-transform
          "
        >
          <span className="text-slate-800 group-hover:text-[#3B46F6] font-semibold text-base whitespace-nowrap transition-colors">
            +91 8867867775
          </span>

          <span
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              w-11 h-11 rounded-xl
              bg-[#3B46F6]
              flex items-center justify-center
              shadow-[0_6px_16px_rgba(0,0,0,0.12)]
            "
          >
            <img src="/images/call.svg" alt="call" className="w-7 h-7 text-white" />
          </span>
        </a>
      </motion.div>

      <Footer />
    </section>
  );
}
