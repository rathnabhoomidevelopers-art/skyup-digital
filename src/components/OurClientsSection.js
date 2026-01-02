import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OurClientsSection() {
  const slides = [
    { text: `"75+ Website\nDeveloped"` },
    { text: `"120+ Brands\nTransformed"` },
    { text: `"3.2Cr+ Ad Budget\nManaged"` },
    { text: `"1,80,000+ Qualified\nLeads Generated"` },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  const viewport = { once: true, amount: 0.25 };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 18, mass: 0.9 },
    },
  };

  const slideAnim = {
    initial: { opacity: 0, y: 12, scale: 0.985, filter: "blur(6px)" },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 110, damping: 20, mass: 0.85 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.99,
      filter: "blur(6px)",
      transition: { duration: 0.22, ease: "easeInOut" },
    },
  };

  return (
    <section className="w-full font-poppins bg-[#FF8B1421] overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14">
          {/* Left */}
          <motion.div variants={fadeUp} className="text-start lg:text-left">
            <motion.div
              variants={fadeUp}
              className="text-[#0037CA] font-bold text-[24px]"
            >
              OUR CLIENTS
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mt-4 font-bold text-[34px] sm:text-[44px] lg:text-[64px] leading-tight text-[#1A1A1A]"
            >
              Why Business <br className="hidden sm:block" />
              Like <span className="text-[#0037CA]">SkyUp</span>
            </motion.h2>
          </motion.div>

          {/* Right */}
          <motion.div
            variants={fadeUp}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[520px]">
              {/* Card */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="
                  bg-white rounded-2xl
                  lg:w-[536px] lg:h-[350px]
                  shadow-[0_18px_40px_rgba(0,0,0,0.08)]
                  border border-white/60
                  px-6 sm:px-10 py-10 sm:py-12
                  min-h-[190px] sm:min-h-[210px]
                  flex items-center justify-center
                "
              >
                <div className="text-center w-full">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={active}
                      {...slideAnim}
                      className="text-[#7A7A7A] lg:text-[44px] italic font-poppins font-medium text-[22px] sm:text-[20px] leading-snug whitespace-pre-line"
                    >
                      {slides[active].text}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Indicators */}
              <div className="flex justify-center mt-5 gap-2">
                {slides.map((_, i) => {
                  const isActive = i === active;

                  return (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className="relative h-2 w-2 rounded-full"
                      aria-label={`Go to slide ${i + 1}`}
                    >
                      <motion.span
                        animate={{
                          width: isActive ? 22 : 8,
                          opacity: isActive ? 1 : 0.8,
                          backgroundColor: isActive ? "#0037CA" : "rgba(255,255,255,0.85)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 18,
                        }}
                        className="absolute left-0 top-0 h-2 rounded-full"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
