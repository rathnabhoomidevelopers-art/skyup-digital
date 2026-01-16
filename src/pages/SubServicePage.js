import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SERVICES, DEFAULT_SERVICE_SLUG } from "../data/servicesData";
import Header from "../components/Header";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { MessageSquareDotIcon, CircleCheckBigIcon,} from "lucide-react";
import JourneySection from "../components/JourneySection";
import WhyTrustSkyUp from "../components/WhyTrustSection";

export default function SubServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const MotionLink = motion(Link);

  const data = useMemo(() => {
    return SERVICES[slug] || SERVICES[DEFAULT_SERVICE_SLUG];
  }, [slug]);

  const keywords = `${data.keyword}`;
  const canonicalUrl = `https://www.skyupdigitalsolutions.com/services/${slug}`;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.45, ease: "easeOut" },
    }),
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
    <div>
      <Helmet>
        <title>{data.title}</title>
        <meta
          name="description"
          content={data.description}
        />
        <meta
          name="keywords"
          content={keywords}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <Header />
      <section className="w-full font-poppins">
        {/* HERO */}

      <div
        className="
          relative w-full overflow-hidden
          h-[350px] sm:h-[466px]
          bg-gradient-to-b from-[#F4F7FF] to-[#DCE6FF]
          sm:bg-transparent
        "
      >
        {/* Background image (DESKTOP/TABLET only) */}
        <img
          src={data.heroImage}
          alt={data.heroImageAlt || data.heroTitle}
          className="absolute inset-0 h-full w-full object-cover hidden sm:block"
        />

        

        {/* Content on top */}
        <div
          className="
            relative z-10 mx-auto flex h-full max-w-7xl flex-col
            items-center justify-center text-center
            gap-4 px-4 py-10
            sm:items-start sm:text-left sm:gap-8 sm:px-6 lg:px-10
          "
        >
        <div className="max-w-[721px] sm:h-[361px] sm:mt-2">
          <h1 className="text-[24px] text-start font-bold leading-tight text-[#2B2B2B]
                        sm:w-[730px] sm:text-[56px] lg:text-[60px]">
            {data.heroTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-start
                        sm:mt-6 sm:text-[18px] lg:text-[18px]">
            {data.heroDesc}
          </p>

          <div
            className="
              mt-6 flex flex-col items-center gap-3
              sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4
            "
          >
            <button
              type="button"
              className="
                rounded-full bg-[#0B3BFF]
                w-[220px] h-[44px] text-[14px]
                sm:w-[246px] sm:h-[66px] sm:text-[18px]
                px-4 font-semibold text-white hover:bg-[#0832DB] transition
              "
              onClick={() => navigate('/contactus')}
            >
              {data.primaryCta}
            </button>

            <button
              type="button"
              className="
                flex items-center justify-center gap-2 rounded-full
                border border-[#0B3BFF] bg-white
                w-[220px] h-[44px] text-[14px]
                sm:w-[246px] sm:h-[66px] sm:text-[18px]
                px-4 font-semibold text-[#0B3BFF] hover:bg-[#EEF1FF] transition
              "
              onClick={() => window.open('https://wa.me/919876533210', '_blank')}
            >
              <MessageSquareDotIcon className="h-5 w-5" />
              {data.secondaryCta}
            </button>
          </div>
        </div>
      </div>
    </div>

        {/* WHY CHOOSE US (service-specific features) */}
        <section className="w-full ">
          <div className="mx-auto max-w-[1300px] text-center px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
            <h2 className=" text-left lg:text-center text-[24px] sm:text-[36px] lg:text-[40px] font-bold text-[#111827]">
              {data.whyTitle}
            </h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              {data.features.map((f, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="flex h-[117px] w-[340px] sm:h-[117px] sm:w-[390px] flex-col justify-center rounded-2xl border border-[#E1E7FF] bg-white/90 sm:px-8 px-3 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
                >
                  <span className="inline-flex gap-2 text-[#0037CA]">
                    <CircleCheckBigIcon className="h-6 w-6 " />
                    <h3 className="text-[16px] sm:text-[18px] font-bold">
                      {f.title}
                    </h3>
                  </span>
                  <div className="mt-1 text-[13px] sm:text-[14px] text-start leading-relaxed text-[#2B2B2B]">
                    
                    {f.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <JourneySection
          title={data.journeyTitle}
          subTitle={data.journeySub}
          steps={data.steps}
        />
      </section>

      {/* 🆕 Dynamic Why-Trust section driven by slug */}
      <WhyTrustSkyUp
      title={data.trustTitle || "Why Businesses Trust"}
      highlight={data.trustHighlight || { blue: "SKYUP", black: "" }}
      cards={data.trustCards}
    />

      <FAQSection
        title={data.faqTitle || "Frequently Asked Questions"}
        subtitle={
          data.faqSubTitle ||
          "Can't find the answer you're looking for? Reach out to our team directly."
        }
        faqs={data.faq || []}
      />
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
        sm:max-w-[850px]
      "
    >
        <h2 className="text-[#0037CA] font-bold text-[24px] sm:text-[64px] leading-tight">
          Ready to Grow Faster?
        </h2>

        <p className="mt-3 text-[#2B2B2B] text-[16px] sm:text-[24px] leading-relaxed">
          Reach more customers, maximize ROI, and grow smarter every day.
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

    <Footer/>
    </div>
  );
}
