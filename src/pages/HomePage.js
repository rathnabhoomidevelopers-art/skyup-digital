import {
  CircleCheckBigIcon,
  Lightbulb,
  Settings,
  CheckCircle2,
  SearchCheckIcon,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import WhatWeDoSection from "../components/WhatWeDoSection";
import TestimonialsSection from "../components/TestimonialsSection";

function HowDoWeWorkSection() {
  const steps = [
    {
      title: "Discover",
      desc: "We analyze your goals, audience, and challenges to craft a tailored strategy for marketing, design, development, and automation.",
      Icon: SearchCheckIcon,
    },
    {
      title: "Plan & Design",
      desc: "Our team creates design concepts, marketing plans, development, and automation workflows, all aligned with your brand and goals.",
      Icon: Lightbulb,
    },
    {
      title: "Execute & Optimize",
      desc: "We execute strategies across design, digital campaigns, websites, and automation while continuously tracking performance.",
      Icon: Settings,
    },
    {
      title: "Deliver & Support",
      desc: "After deployment, we refine results, share insights, and offer ongoing support for long-term success and continuous improvement.",
      Icon: CheckCircle2,
    },
  ];

  const viewport = { once: true, amount: 0.25 };

  const wrap = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 85, damping: 18, mass: 0.9 },
    },
  };

  const pop = { 
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.85 },
    },
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 bg-[#FFF5EB] py-4 font-poppins overflow-hidden">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start"
        >
          <motion.div variants={fadeUp}>
            <div className="text-[#0037CA] font-semibold tracking-wide text-sm sm:text-base">
              HERE ARE THE STEPS
            </div>

            <h2 className="mt-3 font-semibold text-[44px] sm:text-[56px] md:text-[64px] leading-[1.05] text-slate-900">
              How Do We <span className="text-[#0037CA]">Work ?</span>
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-[#2B2B2B] text-base sm:text-lg leading-relaxed max-w-xl lg:pt-2"
          >
            We build a unified digital strategy, integrating Facebook, Instagram, LinkedIn, SEO, and more to connect your brand with the right audience.
          </motion.p>
        </motion.div>

        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="relative mt-10 hidden md:block"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[44px]"
          >
            <div className="mx-auto w-[80%] border-t-2 border-dotted border-[#0037CA]" />
          </motion.div>

          <div className="grid grid-cols-4 gap-8 lg:gap-10">
            {steps.map(({ title, desc, Icon }, idx) => (
              <motion.div
                key={idx}
                variants={pop}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.95, rotate: -6, opacity: 0.9 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ type: "spring", stiffness: 140, damping: 14 }}
                  className="relative z-10 w-[92px] h-[92px] rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex items-center justify-center"
                >
                  <Icon className="w-9 h-9 text-[#FA9F43]" />
                </motion.div>

                <div className="mt-6 text-xl font-semibold text-slate-900">
                  {title}
                </div>

                <p className="mt-3 text-[#2B2B2B] text-base leading-relaxed max-w-[260px]">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-8 md:hidden"
        >
          <motion.div
            variants={pop}
            className="mx-auto w-full max-w-[360px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100"
          >
            {steps.map(({ title, desc, Icon }, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className={`px-5 py-6 text-center ${
                  idx !== steps.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="mx-auto w-[70px] h-[70px] rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex items-center justify-center">
                  <Icon className="w-7 h-7 text-[#FA9F43]" />
                </div>

                <div className="mt-3 text-lg font-semibold text-slate-900">
                  {title}
                </div>

                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function HomePage() {
  const MotionLink = motion(Link);

  const stats = [
    { value: "120+", label: "Brands\nTransformed" },
    { value: "3.2Cr+", label: "Ad Budget\nManaged" },
    { value: "180K+", label: "Qualified Leads\nGenerated" },
    { value: "5+ Years", label: "Combined Team\nExperience" },
    { value: "95%", label: "Client Retention\nRate" },
  ];

  const viewport = { once: true, amount: 0.25 };

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 85, damping: 18, mass: 0.9 },
    },
  };

  const fadeUpSoft = {
    hidden: { opacity: 0, y: 18, scale: 0.99 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 18, mass: 0.9 },
    },
  };

  const wrap = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
  };

  return (
    <div className="w-full">
     <Helmet>
  <title>Digital Marketing Agency in Bangalore | SkyUp Digital</title>
  <meta
    name="description"
    content="Your trusted Digital Marketing Agency in Bangalore, delivering smart strategies, measurable results, and sustainable growth for your brand."
  />
  <meta
    name="keywords"
    content="Digital Marketing Agency in Bangalore."
  />
  <link rel="canonical" href="https://www.skyupdigitalsolutions.com" />
  
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MarketingAgency",
      "@id": "https://www.skyupdigitalsolutions.com",
      "name": "Skyup Digital Solutions",
      "url": "https://www.skyupdigitalsolutions.com/",
      "logo": "https://www.skyupdigitalsolutions.com/images/rbd-logo.webp",
      "description": "Skyup Digital Solutions is a professional digital marketing agency in Bengaluru offering SEO, social media marketing, Google Ads, and website development services.",
      "telephone": "+91-8867867775",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, No 23, 14A, Dasarahalli Main Rd, E Block, Sahakar Nagar, Byatarayanapura",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560092",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 13.0629,
        "longitude": 77.5871
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "19:00"
      },
      "sameAs": [
        "https://www.linkedin.com/company/110886969/",
        "https://www.facebook.com/profile.php?id=61584820941998",
        "https://www.instagram.com/skyupdigitalsolutions/"
      ]
    })}
  </script>
</Helmet>

      <Header />
      <HeroSection />

      <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          className="hidden md:block font-poppins"
        >
          {/* Outer navy strip */}
          <div className="w-full h-[238px] bg-[#00164F] py-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              
              {/* Cards row – GRID (no scroll) */}
              <div className="grid grid-cols-5 gap-8 lg:gap-10">
                {stats.map((s, idx) => (
                  <div
                    key={idx}
                    className="
                      h-[138px] w-[222px]
                      rounded-[18px]
                      bg-gradient-to-b from-[#00164F] to-[#0032B5]
                      shadow-[0_14px_34px_rgba(0,0,0,0.35)]
                      flex flex-col items-center justify-center
                      text-center
                    "
                  >
                    <div className="text-white text-[14px] sm:text-[16px] whitespace-pre-line">
                      {s.label}
                    </div>

                    <div className="mt-2 text-[#FA9F43] text-[30px] sm:text-[35px] font-bold leading-none">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <WhatWeDoSection/>

      {/* GROW BUSINESS BLOCK */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="
          bg-[#EEF1FC] rounded-xl overflow-hidden font-poppins 
          p-6 md:p-10 lg:p-20
        "
      >
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="fw-bold leading-tight text-[32px] md:text-[48px] lg:text-[64px]">
              Grow Your Business with{" "}
              <span className="text-[#0037CA]">Confidence</span>
            </div>

            <div className="text-[#2B2B2B] mt-4 text-[14px] md:text-[16px] lg:text-[18px]">
              Leverage our trained and qualified team to make smarter decisions, optimize performance, and stay ahead of your market
            </div>

            <div className="mt-4 -ms-2 sm:-ms-4 md:-ms-6 lg:-ms-9">
              <ul
                className="
                  grid grid-cols-1 md:grid-cols-2
                  gap-x-8 md:gap-x-12
                  gap-y-0 md:gap-y-2
                  leading-7 md:leading-9
                "
              >
                {[
                  "Trained & Qualified Team",
                  "Optimized Performance",
                  "Stay Ahead of the Market",
                  "Smarter Decisions",
                  "Expert Guidance",
                  "Result-Oriented Approach",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CircleCheckBigIcon className="w-5 h-5 text-blue-700 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-12 col-lg-6 mt-6 lg:mt-4 d-flex justify-content-center">
            <img
              src="/images/Dashboard.webp"
              alt="Dashboard"
              className="img-fluid w-full max-w-[660px]"
            />
          </div>
        </div>
      </motion.div>

      <Carousel/>

      <HowDoWeWorkSection/>
      
      <TestimonialsSection/>

      {/* OUR CLIENTS */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
      </motion.div>
      {/* CTA */}
      <div className="bg-[#FFF8F0]">
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="
            mx-auto 
            text-center
            font-poppins
            px-3 py-8 sm:py-12       
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
      </div>
      {/* FLOATING CONTACT BUTTONS */}
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
    </div>
  );
}
