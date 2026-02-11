// src/pages/Service.jsx
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import ServiceCardsSection from "../components/ServiceCardsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import { Link, useSearchParams } from "react-router-dom";

const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};

const serviceFaqs = [
  {
    q: "How can I get started?",
    a: "Simply contact us, share your requirements, and our team will guide you through the next steps.",
  },
  {
    q: "Do you work with startups as well as established businesses?",
    a: "Absolutely! We work with both startups and established businesses, tailoring our digital marketing strategies to fit your unique goals and growth stage.",
  },
  {
    q: "What makes your digital marketing approach different?",
    a: "Our digital marketing approach is data-driven, customized, and results-focused. We combine creativity with analytics to craft strategies that engage your audience, boost conversions, and maximize ROI.",
  },
  {
    q: "Do you offer branding and creative design services?",
    a: "Yes! We offer comprehensive branding and creative design services as part of our digital marketing solutions, helping your business stand out and connect with your audience effectively.",
  },
  {
    q: "How does AI automation help my business?",
    a: "AI automation streamlines your marketing efforts by analyzing data, optimizing campaigns, and personalizing customer interactions, helping your business save time, increase efficiency, and drive better results.",
  },
  {
    q: "Why should you hire a performance marketing agency for your business?",
    a: "By hiring a performance marketing agency in Bangalore, your business can focus on measurable results such as leads, sales, and ROI. It differs from traditional marketing in that performance marketing lets you pay only for accomplished actions, be it a click, conversion, or a sale. A professional agency uses data-driven strategies, advanced analytics, and optimized ad campaigns to scale growth efficiently.",
  },
  {
    q: "What are the key KPIs of performance marketing services?",
    a: "The major KPIs of performance marketing services include Cost Per Lead (CPL), Cost Per Acquisition (CPA), Click-Through Rate, Conversion Rate, Return on Ad Spend, and Customer Lifetime Value. These KPIs assist businesses in effectively evaluating the performance of marketing campaigns in relation to the marketing budget.",
  },
   {
    q: " How does performance marketing differ from search engine marketing?",
    a: "Where performance marketing covers a range of paid channels from social ads to display ads, affiliate marketing, and influencer marketing, performance is determined by conversions alone. SEM, on the other hand, focuses more on paid search ads including Google Ads, to raise traffic via keywords. Performance marketing is broader in scope with ROI as its key objective, while SEM is solely search-intent focused.",
  },
    {
    q: "How do performance marketing agencies measure campaign success?",
    a: "A performance marketing agency uses real-time tracking tools such as Google Analytics, conversion tracking, heatmaps, and CRMs to measure performance. Success is measured by the response to a campaign, conversion, revenue growth, returns on ad spend, and business impact.",
  },
    {
    q: " How does our performance marketing agency differ from other digital marketing agencies?",
    a: "Our performance marketing company in Bangalore differs from the rest by providing ROI-based marketing strategies, transparent reporting mechanisms, constant optimization of the marketing campaigns, and creating customized marketing campaigns. We differ from other generic marketing agencies by directly linking marketing goals with business objectives.",
  },
    {
    q: " What services does a digital marketing agency in Bangalore offer?",
    a: "A digital marketing agency in Bangalore offers services such as SEO, performance marketing, Google Ads, social media marketing, content marketing, email marketing, website optimization, and conversion rate optimization to help businesses grow online.",
  },
  {
    q: " Why is SEO important for digital marketing success?",
    a: "SEO is important for digital marketing success because it improves website visibility, drives organic traffic, builds brand credibility, and reduces long-term dependency on paid advertising.",
  },
  {
    q: " How important is local SEO for Bangalore-based businesses?",
    a: "Local SEO in Bangalore is crucial for businesses targeting nearby customers. It improves Google Maps visibility, local search rankings, and helps attract location-specific, ready-to-convert customers.",
  },
  {
    q: "Is digital marketing better than traditional marketing?",
    a: "Digital marketing is more cost-effective, measurable, scalable, and targeted compared to traditional marketing, making it a better choice for modern businesses aiming for sustainable growth.",
  },
  {
    q: "What tools do digital marketing agencies use?",
    a: "Digital marketing agencies use tools like Google Analytics, Google Search Console, SEMrush, Ahrefs, Meta Ads Manager, Google Ads, and CRM tools to track, analyze, and optimize campaign performance.",
  },
  
];

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const MotionLink = motion(Link);

export function Service() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";

  return (
    <div className="font-poppins">
      <Helmet>
  <title>
    Results-Driven Digital Marketing Services in Bangalore | SKYUP
  </title>
  <meta
    name="description"
    content="End-to-end Digital Marketing Services in Bangalore to boost visibility, generate quality leads, and achieve sustainable business growth."
  />
  <meta
    name="keywords"
    content="Digital Marketing Services in Bangalore"
  />
  <link
    rel="canonical"
    href="https://www.skyupdigitalsolutions.com/service"
  />
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://www.skyupdigitalsolutions.com/service",
      "name": "Digital Marketing Services in Bangalore",
      "description": "Skyup Digital Solutions provides professional digital marketing services in Bangalore including SEO, social media marketing, Google Ads management, and website development for businesses.",
      "provider": {
        "@type": "MarketingAgency",
        "@id": "https://www.skyupdigitalsolutions.com/service",
        "name": "Skyup Digital Solutions",
        "url": "https://www.skyupdigitalsolutions.com/",
        "logo": "https://www.skyupdigitalsolutions.com/images/rbd-logo.webp",
        "telephone": "+91-8867867775",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2nd Floor, No 23, 14A, Dasarahalli Main Rd, E Block, Sahakar Nagar, Byatarayanapura",
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "postalCode": "560092",
          "addressCountry": "IN"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Bengaluru"
      },
      "serviceType": [
        "Digital Marketing Services",
        "Search Engine Optimization",
        "Social Media Marketing",
        "Google Ads Management",
        "Website Development"
      ],
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceLocation": {
          "@type": "Place",
          "name": "Online and Onsite"
        }
      }
    })}
  </script>
</Helmet>
      <Header />

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        style={{
          backgroundImage: "url('/images/service_banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-[221px] lg:h-[332px] flex flex-col items-center bg-[#EEF1FC] justify-center"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-center lg:text-[64px] sm:text-[32px] text-[24px] fw-bold">
            Our Experts <span className="text-[#0037CA]">Services</span>
          </h1>
        </motion.div>
        
        <motion.p
          variants={fadeUp}
          className="text-center text-[12px] px-3 sm:text-[18px] mt-2 lg:text-[18px]"
        >
          Our team delivers exceptional web development and strategic marketing
          support to help your business reach new heights.
        </motion.p>
      </motion.div>

      {/* Pass the filter to ServiceCardsSection */}
      <ServiceCardsSection initialCategory={categoryFromUrl} />

      <FAQSection faqs={serviceFaqs} />

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
          Serving companies of every scale. Connect with us to start the
          conversation.
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

      {/* Floating WhatsApp + Call buttons */}
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
          <img
            src="/images/whatsapp.svg"
            alt="whatsapp"
            className="w-7 h-7 text-white"
          />
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
            <img
              src="/images/whatsapp.svg"
              alt="whatsapp"
              className="w-7 h-7 text-white"
            />
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
          <img
            src="/images/call.svg"
            alt="call"
            className="w-7 h-7 text-white"
          />
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
            <img
              src="/images/call.svg"
              alt="call"
              className="w-7 h-7 text-white"
            />
          </span>
        </a>
      </motion.div>

      <Footer />
    </div>
  );
}
