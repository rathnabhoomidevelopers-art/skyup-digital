
import { motion } from "framer-motion";

export default function WhatMakesUsDifferentSection() {
  const cards = [
    {
      title: "Customized Strategies",
      desc: "Tailored solutions to meet your unique business goals and target audience.",
      Icon: "/images/cta_blue_1.svg",
    },
    {
      title: "Creative Excellence",
      desc: "Innovative designs and branding that make your business stand out.",
      Icon: "/images/cta_blue_2.svg",
    },
    {
      title: "Data-Driven Approach",
      desc: "Insights and analytics guide every decision for measurable results.",
      Icon: "/images/cta_blue_3.svg",
    },
    {
      title: "Proven Expertise",
      desc: "Experienced team delivering consistent growth and impactful outcomes.",
      Icon: "/images/cta_blue_4.svg",
    },
    {
      title: "Transparent Reporting",
      desc: "Clear, honest reports keep you informed and confident in every step.",
      Icon: "/images/cta_blue_5.svg",
    },
  ];

  const viewport = { once: true, amount: 0.25 };

  const wrap = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.06 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 85, damping: 18, mass: 0.9 },
    },
  };

  return (
    <section className="w-full font-poppins bg-white py-14 sm:py-16 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.9 }}
          className="text-center text-[24px] sm:text-[36px] lg:text-[44px] font-bold text-slate-900"
        >
          What Makes Us <span className="text-[#0037CA]">Different</span>
        </motion.h2>

        {/* Desktop layout: 3 + 2 centered */}
        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-10 hidden lg:block"
        >
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-10">
            {cards.slice(0, 3).map((c) => (
              <MotionCard key={c.title} {...c} align="left" variants={fadeUp} />
            ))}
          </div>

          {/* Row 2 (centered) */}
          <div className="mt-10 flex justify-center gap-10">
            {cards.slice(3).map((c) => (
              <div key={c.title} className="w-[360px]">
                <MotionCard {...c} align="left" variants={fadeUp} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile/Tablet layout: stacked */}
        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-8 lg:hidden space-y-5"
        >
          {cards.map((c) => (
            <MotionCard key={c.title} {...c} align="center" variants={fadeUp} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MotionCard({ title, desc, Icon, align = "left", variants }) {
  const isCenter = align === "center";

  return (
    <motion.div
      variants={variants}
      whileHover={{
        y: -6,
        scale: 1.01,
        boxShadow: "0_22px_60px_rgba(0,0,0,0.10)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="
        bg-white rounded-2xl
        shadow-[0_18px_50px_rgba(0,0,0,0.08)]
        border border-slate-100
        px-7 py-8
      "
    >
      {/* Icon badge */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={[
          "w-11 h-11 rounded-xl flex items-center justify-center",
          isCenter ? "mx-auto" : "",
        ].join(" ")}
      >
        <motion.div
          initial={{ rotate: -8, scale: 0.95, opacity: 0.9 }}
          whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
        >
          {typeof Icon === "string" ? (
            <img
              src={Icon}
              alt={`${title} icon`}
              className="w-11 h-11"
              loading="lazy"
            />
          ) : (
            <Icon className="w-5 h-5 text-[#0037CA]" />
          )}
        </motion.div>
      </motion.div>

      <h3
        className={[
          "mt-3 text-[20px] font-bold text-slate-900",
          isCenter ? "text-center" : "text-left",
        ].join(" ")}
      >
        {title}
      </h3>

      <p
        className={[
          "mt-3 text-[15px] leading-relaxed text-slate-900",
          isCenter ? "text-center" : "text-left",
        ].join(" ")}
      >
        {desc}
      </p>
    </motion.div>
  );
}
