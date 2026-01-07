import { motion } from "framer-motion";
import FAQSection from "../components/FAQSection";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import Header from "../components/Header";
import WhatMakesUsDifferentSection from "../components/WhatMakesUsDifferentSection";
import { Link } from "react-router-dom";
import {
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";
import OurClientsSection from "../components/OurClientsSection";
import OurTeamSection from "../components/OurTeamSection";

const viewport = { once: true, amount: 0.25 };

// Smooth springs (premium feel)
const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const smoothSpringFast = { type: "spring", stiffness: 120, damping: 20, mass: 0.8 };

// Reusable variants
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -26 },
  show: { opacity: 1, x: 0, transition: smoothSpring },
};

const fadeRight = {
  hidden: { opacity: 0, x: 26 },
  show: { opacity: 1, x: 0, transition: smoothSpring },
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const serviceFaqs = [
  { q: "How do you measure success?", a: "We track key performance indicators (KPIs) such as website traffic, leads, conversions, engagement rates, and overall ROI to ensure campaigns deliver real results." },
  { q: "Do you provide ongoing support?", a: "Yes. We continuously monitor campaigns, optimize strategies, and provide regular reports to ensure consistent growth and long-term success." },
  { q: "How do I get started?", a: "Simply contact us through our website or email, and our team will guide you through a consultation to understand your needs and recommend a strategy." },
  { q: "Which platforms do you focus on?", a: "We manage major platforms including Google, Facebook, Instagram, LinkedIn, YouTube, and more, depending on your audience and goals." },
 ];

const softScale = {
  hidden: { opacity: 0, scale: 0.98, y: 18 },
  show: { opacity: 1, scale: 1, y: 0, transition: smoothSpringFast },
};
 const MotionLink = motion(Link);
export function AboutUS() {
  return (
    <div className="font-poppins">
      <Helmet>
        <title>Top Digital Marketing Company in Bangalore | SkyUp</title>
        <meta
          name="description"
          content="SkyUp is a results-driven Digital Marketing Company in Bangalore offering strategic marketing solutions to boost visibility, leads, and growth."
        />
        <meta
          name="keywords"
          content="Digital Marketing Company in Bangalore."
        />
      </Helmet>

      <Header />

      {/* HERO */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        style={{
          backgroundImage: "url('/images/about_us_banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-[221px] px-2 lg:h-[332px] flex flex-col items-center justify-center relative"
      >


        <motion.h1
          variants={fadeUp}
          className="relative z-10 text-center lg:text-[64px] sm:text-[32px] text-[24px] font-bold"
        >
          We Create
          <span className="text-[#0037CA]">&nbsp;Brands&nbsp;</span>
          That&nbsp;
          <br className="block sm:hidden" />
          Stand Out
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="relative z-10 text-center text-[#2B2B2B] text-[12px] sm:w-[901px] sm:text-[14px] mt-2 lg:text-[18px]"
        >
          As a leading Digital Marketing Company in Bangalore, we create brands that stand out with impactful strategies and creative solutions.
        </motion.p>
      </motion.div>


      {/* WHO WE ARE */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-[100px] py-[90px]">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-[70px] items-center">
          {/* Image */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="w-full max-w-[497px]"
          >
            <motion.img
              src="/images/About_us_1.webp"
              alt="About us"
              className="w-full h-auto rounded-xl"
              initial={{ scale: 1.02 }}
              whileInView={{ scale: 1 }}
              viewport={viewport}
              transition={smoothSpring}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            variants={staggerWrap}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="w-full max-w-[677px] flex flex-col justify-center text-left"
          >
            <motion.h2
              variants={fadeUp}
              className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold leading-tight"
            >
              Who We Are
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-[14px] sm:text-[16px] lg:text-[18px] pt-3 text-[#2B2B2B] leading-relaxed"
            >
              SKYUP Digital Solutions is a modern digital marketing, design, and
              technology agency that helps businesses cut through the noise and scale
              with confidence. For us, digital isn’t just about ads or websites it's
              about building meaningful growth engines that work every day.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-[14px] sm:text-[16px] lg:text-[18px] text-[#2B2B2B] leading-relaxed lg:mt-2"
            >
              We partner with brands of every size to create campaigns that are smart,
              creative, and result-driven.
            </motion.p>

            {/* Stats (staggered) */}
            <motion.div variants={staggerWrap} className="pt-6 grid grid-cols-3 gap-6">
              <motion.div variants={softScale} className="flex flex-col lg:flex-row lg:gap-2  items-start">
                <span className="text-[24px] sm:text-[32px] lg:text-[44px] text-[#0037CA] font-bold leading-none">
                  5+
                </span>
                <span className=" text-[14px] sm:text-[14px] lg:text-[16px] text-[#2B2B2B] leading-snug">
                  Years of <br className="hidden sm:block" /> Experience
                </span>
              </motion.div>

              <motion.div variants={softScale} className="flex flex-col lg:flex-row lg:gap-2 items-start">
                <span className="text-[24px] sm:text-[32px] lg:text-[44px] text-[#0037CA] font-bold leading-none">
                  1K+
                </span>
                <span className=" text-[14px] sm:text-[14px] lg:text-[16px] text-[#2B2B2B] leading-snug">
                  Happy <br className="sm:block" /> Clients
                </span>
              </motion.div>

              <motion.div variants={softScale} className="flex flex-col lg:flex-row lg:gap-2 items-start">
                <span className="text-[24px] sm:text-[32px] lg:text-[44px] text-[#0037CA] font-bold leading-none">
                  95%
                </span>
                <span className=" text-[14px] sm:text-[14px] lg:text-[16px] text-[#2B2B2B] leading-snug">
                  Client <br className="hidden sm:block" /> Retention
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* VISION + MISSION */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="relative flex flex-col lg:flex-row items-center justify-between">
            {/* LEFT CONTENT CARD */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="
                w-full sm:w-[585px]
                bg-[#FFF5EB] border-1 border-[#ffdfc2]
                rounded-[24px] lg:rounded-[28px]
                p-8 sm:p-10 lg:p-12
                z-10 shadow-[0_10px_20px_rgba(0,55,202,0.12)]
              "
            >
              <h4 className="text-[#FF7A00] font-semibold text-[18px] sm:text-[24px] tracking-wide">
                OUR VISION
              </h4>

              <p className="mt-3 text-[#2B2B2B] text-[14px] sm:text-[18px] sm:w-[450px] leading-relaxed">
                To empower businesses to rise and grow by transforming digital
                complexity into clarity and measurable success and to be a trusted
                partner in their growth journey.
              </p>

              <h4 className="mt-5 text-[#FF7A00] font-semibold text-[18px] sm:text-[24px] tracking-wide">
                OUR MISSION
              </h4>

              <p className="mt-3 text-[#2B2B2B] text-[14px] sm:w-[450px] sm:text-[18px] leading-relaxed">
                To deliver high impact digital solutions through creativity,
                technology, and ROI-driven strategies that help our clients win
                customers, build trust, and scale sustainably.
              </p>
            </motion.div>

            {/* RIGHT IMAGE (Desktop only) */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="hidden lg:block max-w-[683px] -ml-10 z-10"
            >
              <motion.img
                src="/images/Vision_mission.webp"
                alt="Vision and Mission"
                className="w-full h-[554px] object-cover rounded-[28px]"
                initial={{ scale: 1.02 }}
                whileInView={{ scale: 1 }}
                viewport={viewport}
                transition={smoothSpring}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS (wrap with soft fade) */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <WhatMakesUsDifferentSection />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
      </motion.div>
      <OurTeamSection/>
      <FAQSection faqs={serviceFaqs} />
      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="
          mx-auto
          m-[60px]
          sm:m-[70px]
          text-center
          font-poppins
          px-3
          sm:max-w-[800px]
        "
      >
        <h2 className="text-[#0037CA] font-bold text-[24px] sm:text-[64px] leading-tight">
          Ready to Grow Faster?
        </h2>

        <p className="mt-3 text-[#2B2B2B] text-[16px] sm:text-[20px] leading-relaxed">
          Serving companies of every scale. Connect with us to start the conversation.
        </p>

        <div className="mt-8 flex justify-center">
          <MotionLink
            to="/contactus"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="
              bg-[#0037CA] text-white
              font-semibold text-sm sm:text-base
              px-6 py-2.5
              rounded-full
              shadow-[0_10px_24px_rgba(0,0,0,0.18)]
              hover:scale-[1.03] active:scale-[0.99]
              transition-transform
              inline-flex items-center justify-center
              no-underline
            "
          >
            GET STARTED
          </MotionLink>
        </div>
      </motion.section>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
        className="fixed bottom-5 right-4 z-[9999] flex flex-col items-end gap-4 font-poppins"
      >
        <a
          href="https://wa.me/917090170524"
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
          <MessageCircleIcon className="w-6 h-6 text-white" />
        </a>

        <a
          href="https://wa.me/917090170524"
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
            <MessageCircleIcon className="w-5 h-5 text-white" />
          </span>
        </a>

        <a
          href="tel:+917090170524"
          className=" tel-chat
            sm:hidden
            w-12 h-12
            rounded-xl
            bg-[#3B46F6]
            flex items-center justify-center
            shadow-[0_12px_30px_rgba(0,0,0,0.25)]
          "
        >
          <PhoneIcon className="w-6 h-6 text-white" />
        </a>

        <a
          href="tel:+917090170524"
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
            <PhoneIcon className="w-5 h-5 text-white" />
          </span>
        </a>
      </motion.div>
      <Footer />
    </div>
  );
}
