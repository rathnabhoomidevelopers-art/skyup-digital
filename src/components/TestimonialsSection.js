import React, { useEffect, useMemo, useRef, useState } from "react";

export default function TestimonialsSection() {
  const testimonials = useMemo(
    () => [
      {
        id: 1,
        name: "Amit R",
        role: "Founder",
        text:
          "Their  PPC strategy generated consistent leads, improved cost control, and provided clear performance insights, boosting confidence in ad spend. ",
        avatar: "/images/ellipse_1.svg",
        variant: "blue",
      },
      {
        id: 2,
        name: "Ravi K",
        role: "CEO",
        text:
          "SKYUP DIGITAL built a fast, user-friendly website that drives lead generation, with a design and structure that encourages visitor action.",
        avatar: "/images/ellipse_2.svg",
        variant: "white",
      },
      {
        id: 3,
        name: "Sanya M",
        role: "Marketing Director",
        text:
          "Working with SKYUP DIGITAL boosted our online presence with SEO and content marketing, improving rankings, and website traffic quickly.",
        avatar: "/images/ellipse_3.svg",
        variant: "blue",
      },
      {
        id: 4,
        name: "Neha S",
        role: "Business Head",
        text:
          "Their  structured lead generation delivers consistent, qualified enquiries through a transparent, reliable process aligned with sales goals.",
        avatar: "/images/ellipse_4.svg",
        variant: "white",
      },
    ],
    []
  );

  // ✅ Infinite-loop slider setup (mobile)
  const [slideIndex, setSlideIndex] = useState(1); // start at 1 (0 is last-clone)
  const [withTransition, setWithTransition] = useState(true);
  const trackRef = useRef(null);

  // clones: [last, ...all, first]
  const slides = useMemo(() => {
    if (!testimonials.length) return [];
    const first = testimonials[0];
    const last = testimonials[testimonials.length - 1];
    return [last, ...testimonials, first];
  }, [testimonials]);

  const next = () => {
    setWithTransition(true);
    setSlideIndex((v) => v + 1);
  };

  const prev = () => {
    setWithTransition(true);
    setSlideIndex((v) => v - 1);
  };

  const goTo = (i) => {
    // jump to real slide i => in cloned track it is i+1
    setWithTransition(true);
    setSlideIndex(i + 1);
  };

  // ✅ Dot index should follow real testimonials (0..len-1)
  const realIndex = useMemo(() => {
    const n = testimonials.length;
    if (!n) return 0;

    let idx = slideIndex - 1; // slideIndex=1 => real 0
    if (idx < 0) idx = n - 1;
    if (idx >= n) idx = 0;

    return idx;
  }, [slideIndex, testimonials.length]);

  // ✅ Auto-slide every 3000ms
  useEffect(() => {
    const id = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Snap to real slide after reaching clone edges
  const handleTransitionEnd = () => {
    const n = testimonials.length;
    if (!n) return;

    // moved to last clone (index 0) => snap to real last (index n)
    if (slideIndex === 0) {
      setWithTransition(false);
      setSlideIndex(n);
    }

    // moved to first clone (index n+1) => snap to real first (index 1)
    if (slideIndex === n + 1) {
      setWithTransition(false);
      setSlideIndex(1);
    }
  };

  // ✅ Swipe on mobile (works with infinite loop)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let startX = 0;
    let currentX = 0;
    let isDown = false;

    const onDown = (e) => {
      isDown = true;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      currentX = startX;
    };

    const onMove = (e) => {
      if (!isDown) return;
      currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;

      const diff = currentX - startX;

      // swipe threshold
      if (diff < -40) next();
      if (diff > 40) prev();
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);

      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
    };
    // ✅ no dependency needed
  }, []);

  return (
    <section className="w-full bg-white mb-3 font-poppins">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        {/* Heading */}
        <div className="text-center">
          <p className="text-[#5376D5] font-bold text-[16px] sm:text-[24px]">
            Testimonial
          </p>
          <h2 className="mt-2 text-[#343434] font-bold leading-tight text-[34px] md:text-[44px]">
            What the people think about us
          </h2>
        </div>

        {/* Desktop grid (exact 4 cards) */}
        <div className="mt-14 hidden md:grid grid-cols-4 gap-10">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>

        {/* Mobile slider (infinite loop + autoplay) */}
        <div className="mt-10 md:hidden">
          {/* ✅ allow avatar to be visible */}
          <div className="relative overflow-x-hidden overflow-y-visible pt-10">
            <div
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              className="flex"
              style={{
                transform: `translateX(-${slideIndex * 100}%)`,
                transition: withTransition
                  ? "transform 500ms ease-in-out"
                  : "none",
              }}
            >
              {slides.map((t, i) => (
                <div key={`${t.id}-${i}`} className="w-full flex-shrink-0 px-6">
                  <TestimonialCard {...t} mobile />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === realIndex ? "bg-[#0b46ff]" : "bg-[#e6e6e6]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, text, avatar, variant, mobile = false }) {
  const isBlue = variant === "blue";

  return (
    <div className="relative">
      {/* Avatar (top centered, overlaps card) */}
      <div className="absolute left-1/2 -top-7 -translate-x-1/2 z-10">
        <div className="h-14 w-14 rounded-full flex items-center justify-center">
          <img
            src={avatar}
            alt={name}
            className="h-14 w-14 rounded-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Card */}
      <div
        className={[
          "relative rounded-[18px] px-3 pt-12 pb-8 text-center",
          "md:shadow-[0_18px_40px_rgba(0,0,0,0.15)]",
          "max-w-[276px] mx-auto",
          "h-[260px]",
          "md:max-w-none md:w-[276px] md:h-[260px]",
          isBlue ? "bg-[#0037CA] text-white" : "bg-[#f8f8f8] text-[#2B2B2B]",
        ].join(" ")}
      >
        <div className="absolute left-6 top-6">
          <QuoteMark color={isBlue ? "#ffffff" : "#f0d9c9"} />
        </div>

        <h3
          className={`font-semibold text-[18px] ${
            isBlue ? "text-white" : "text-[#2b2b2b]"
          }`}
        >
          {name}
        </h3>

        <p
          className={`mt-1 text-[12px] ${
            isBlue ? "text-white/80" : "text-[#2B2B2B]"
          }`}
        >
          {role}
        </p>

        <p
          className={[
            "text-[14px] leading-6 lg:text-[14px]",
            isBlue ? "text-white/90" : "text-[#2B2B2B]",
          ].join(" ")}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function QuoteMark({ color = "#ffffff" }) {
  return <img src="/images/inverted_comma.svg" alt="quote" />;
}
