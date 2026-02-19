import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// Remove MotionLink, use motion.a instead
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18, mass: 0.8 },
  },
};

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Can't find the answer you're looking for? Reach out to our team directly.",
  faqs = [],
}) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs.length) return null;

  return (
    <section className="w-full bg-[#EEF1FC] py-24 font-poppins overflow-hidden">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.9 }}
          >
            <h2 className="text-[24px] sm:text-[36px] lg:text-[44px] font-bold text-[#1A1A1A]">
              {title}
            </h2>

            <p className="mt-2 sm:mt-[16px] text-[#2B2B2B] text-[16px] sm:text-base max-w-md">
              {subtitle}
            </p>

            <motion.a
              href="/contactus"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="
                inline-flex items-center justify-center
                font-semibold text-sm sm:text-base sm:mt-[24px]
                px-6 py-2.5
                rounded-full
                shadow-[0_10px_24px_rgba(0,0,0,0.18)]
                hover:scale-[1.03] active:scale-[0.99]
                transition-transform
                bg-[#0037CA] text-white hover:bg-[#235bf5]
                no-underline
              "
            >
              Contact Support
            </motion.a>
          </motion.div>

          {/* RIGHT ACCORDION */}
          <LayoutGroup>
            <div className="space-y-4">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#E6EAF2]"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between px-3 sm:px-6 py-3 text-left"
                    >
                      <span
                        className={`font-semibold text-sm sm:text-base transition-colors ${
                          isOpen ? "text-[#0037CA]" : "text-[#2B2B2B]"
                        }`}
                      >
                        {item.q}
                      </span>

                      <motion.span
                        animate={{
                          rotate: isOpen ? 180 : 0,
                          scale: isOpen ? 1.05 : 1,
                          backgroundColor: isOpen ? "#0037CA" : "#ffffff",
                        }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className={`flex h-7 w-9 sm:w-7 items-center justify-center rounded-full
                          ${isOpen ? "border-transparent" : "border border-[#E6EAF2]"}
                        `}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4 text-white" />
                        ) : (
                          <Plus className="h-4 w-4 text-[#2B2B2B]" />
                        )}
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false} mode="sync">
                      {isOpen && (
                        <motion.div
                          key="content"
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            height: { type: "spring", stiffness: 120, damping: 22 },
                            opacity: { duration: 0.18 },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 pb-3 text-[#2B2B2B] text-sm leading-relaxed">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </motion.div>
    </section>
  );
}