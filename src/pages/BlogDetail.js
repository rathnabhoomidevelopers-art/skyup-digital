import { ChevronLeft, Linkedin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BLOGS } from "../data/blogs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactCTAContainer from "../components/ContactCTAContainer";
import { motion } from "framer-motion";
import { Facebook, Youtube, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[""''"'`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function BlogDetail() {
  const { slug } = useParams();
  const blog = BLOGS.find((b) => b.slug === slug);

  const sections = blog?.sections?.length
    ? blog.sections
    : [
        {
          type: "p",
          text: "Content not added yet. Add sections in src/data/blogs.js",
        },
      ];

  // Build TOC from h2 and h3 headings
  const toc = useMemo(() => {
    const used = new Map();
    const items = [];

    sections.forEach((s) => {
      if ((s.type !== "h2" && s.type !== "h3") || !s.text) return;

      const base = slugify(s.text);
      const count = (used.get(base) || 0) + 1;
      used.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;

      items.push({
        id,
        text: s.text,
        level: s.type, // 'h2' or 'h3'
      });
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
          .sort(
            (a, b) =>
              (b.intersectionRatio || 0) - (a.intersectionRatio || 0),
          )[0];

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
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Blog not found.</h1>
        <Link to="/blog" className="text-blue-600 hover:underline">
          <ChevronLeft className="inline" /> Go back
        </Link>
      </div>
    );
  }

  const canonicalUrl = `https://www.skyupdigitalsolutions.com/blog/${slug}`;

  return (
    <div>
      <Helmet>
        <title>{blog.seo?.title || blog.title}</title>
        <meta
          name="description"
          content={blog.seo?.description || blog.excerpt}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <Header />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main content - 8 cols */}
          <div className="lg:col-span-8">
            {/* Blog content */}
            <div className="mx-auto max-w-3xl">
              {/* back */}
              <Link
                to="/blog"
                className="mb-6 inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Blog
              </Link>

              {/* category */}
              <div className="mb-4">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800">
                  {blog.category}
                </span>
              </div>

              {/* title */}
              <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                {blog.title}
              </h1>

              {/* meta */}
              <div className="mb-8 flex items-center space-x-4 text-sm text-slate-600">
                <span>{blog.author}</span>
                <span>•</span>
                <span>{blog.date}</span>
              </div>

              {/* hero image */}
              <img
                src={blog.image}
                alt={blog.title}
                className="mb-8 w-full rounded-lg"
              />

              {/* content */}
              <div className="prose prose-lg max-w-none">
                {(() => {
                  const used = new Map();

                  return sections.map((s, i) => {
                    // Handle h2
                    if (s.type === "h2") {
                      const base = slugify(s.text || "");
                      const count = (used.get(base) || 0) + 1;
                      used.set(base, count);
                      const id = count === 1 ? base : `${base}-${count}`;

                      return (
                        <h2
                          key={i}
                          id={id}
                          className="mb-4 mt-8 scroll-mt-24 text-3xl font-bold text-slate-900"
                        >
                          {s.text}
                        </h2>
                      );
                    }

                    // Handle h3
                    if (s.type === "h3") {
                      const base = slugify(s.text || "");
                      const count = (used.get(base) || 0) + 1;
                      used.set(base, count);
                      const id = count === 1 ? base : `${base}-${count}`;

                      return (
                        <h3
                          key={i}
                          id={id}
                          className="mb-3 mt-6 scroll-mt-24 text-2xl font-semibold text-slate-900"
                        >
                          {s.text}
                        </h3>
                      );
                    }

                    if (s.type === "quote") {
                      return (
                        <blockquote
                          key={i}
                          className="my-6 border-l-4 border-blue-500 bg-blue-50 p-4 italic text-slate-700"
                        >
                          {s.text}
                        </blockquote>
                      );
                    }

                    if (s.type === "image") {
                      return (
                        <figure key={i} className="my-8">
                          <img
                            src={s.src}
                            alt={s.alt || ""}
                            className="w-full rounded-lg"
                          />
                          {s.caption ? (
                            <figcaption className="mt-2 text-center text-sm text-slate-600">
                              {s.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      );
                    }

                    if (s.type === "p_with_link") {
                      return (
                        <p key={i} className="mb-4 text-slate-700">
                          {s.textBefore}{" "}
                          
                            <a href={s.link}
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {s.linkText}
                          </a>{" "}
                          {s.textAfter}
                        </p>
                      );
                    }

                    if (s.type === "ul") {
                      return (
                        <ul key={i} className="mb-4 list-disc pl-6 text-slate-700">
                          {s.text.map((item, idx) => (
                            <li key={idx} className="mb-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    return (
                      <p key={i} className="mb-4 text-slate-700">
                        {s.text}
                      </p>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Right Table of Contents (desktop only) - 4 cols */}
          {toc.length > 0 && (
            <div className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-24">
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
                    TABLE OF CONTENTS
                  </h3>
                  <nav className="space-y-1">
                    {toc.map((t) => {
                      const isActive = t.id === activeId;
                      const isH2 = t.level === "h2";

                      return (
                        <button
                          key={t.id}
                          onClick={() => scrollToId(t.id)}
                          className={[
                            "w-full text-left rounded-lg px-2 py-1.5 text-[14px] leading-snug transition",
                            isH2 ? "font-semibold" : "pl-4", // Indent h3
                            isActive
                              ? "bg-[#EEF1FF] text-[#0B3BFF] font-semibold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                          ].join(" ")}
                        >
                          {t.text}
                        </button>
                      );
                    })}
                  </nav>
                  <p className="mt-4 text-xs text-slate-500">
                    💡 Tip: Click a heading to jump.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContactCTAContainer
        title={
          <>
            Looking for Digital Marketing Experts in{" "}
            <span className="text-blue-600">Bangalore</span>?
          </>
        }
        subtitle="Our team can implement every strategy discussed here and help your business scale—fast and effectively."
      />

      <Footer />

      {/* WhatsApp floating button */}
      
        href="https://wa.me/918867867775"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:bg-green-600"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
