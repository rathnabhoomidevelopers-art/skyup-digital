// src/components/WhyTrustSkyUp.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Target,
  Rocket,
  BarChart3,
  ShieldCheck,
  Clock,
} from "lucide-react";

const iconMap = {
  users: Users,
  target: Target,
  rocket: Rocket,
  barChart3: BarChart3,
  shieldCheck: ShieldCheck,
  clock: Clock,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function CardIcon({ icon }) {
  // ✅ If icon is a file path like "/images/cta.svg"
  if (typeof icon === "string" && icon.startsWith("/")) {
    return (
      <img
        src={icon}
        alt="icon"
        className="h-10 w-10"
        loading="lazy"
        draggable={false}
      />
    );
  }

  // ✅ If icon is a lucide key like "target", "rocket" etc
  const LucideIcon = iconMap[icon] || Users;
  return <LucideIcon className="h-6 w-6 text-[#F59E0B]" />;
}

export default function WhyTrustSkyUp({ title, highlight, cards }) {
  const blueText = typeof highlight === "string" ? highlight : highlight?.blue;
  const blackText = typeof highlight === "string" ? "" : highlight?.black;

  return (
    <section className="w-full py-14 font-poppins">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-[24px] sm:text-[40px] font-bold text-[#111827]">
          {title}{" "}
          <span className="text-[#0B3BFF]">{blueText}</span>{" "}
          <span className="text-[#111827]">{blackText}</span>
        </h2>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
        >
          {cards.map((c, idx) => {
            return (
              <motion.div
                key={`${c.title}-${idx}`}
                variants={item}
                whileHover={{
                  y: -4,
                  boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
                }}
                transition={{ duration: 0.18 }}
                className="
                  rounded-[18px] border border-[#FFE2C0] bg-[#FFF8F0]
                  px-3 py-3 cursor-pointer text-center
                  w-full max-w-[300px] h-[200px]
                  sm:max-w-[370px] sm:h-[210px]
                  shadow-[0_10px_30px_rgba(255,226,192,0.05)]
                  mx-auto
                "
              >
                <div className="mx-auto mb-4 inline-flex h-[48px] w-[48px] items-center justify-center rounded-[12px] ">
                  <CardIcon icon={c.icon} />
                </div>

                <h3 className="text-[15px] sm:text-[18px] font-bold text-[#111827]">
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] sm:text-[16px] leading-relaxed text-[#2B2B2B]">
                  {c.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
