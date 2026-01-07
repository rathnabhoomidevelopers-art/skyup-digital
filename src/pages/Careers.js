// src/pages/Careers.jsx
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { MapPin, Clock, MessageCircleIcon, PhoneIcon } from "lucide-react";
import JobApplicationFormModal from "../components/JobApplicationForm";

const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const smoothSpringFast = { type: "spring", stiffness: 120, damping: 20, mass: 0.8 };

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

const softScale = {
  hidden: { opacity: 0, scale: 0.98, y: 18 },
  show: { opacity: 1, scale: 1, y: 0, transition: smoothSpringFast },
};

const jobs = [
  {
    title: "Graphic Designer",
    desc: "We are looking for a senior-level Graphic Designer to join our team.",
    type: "Full time",
    mode: "On-site",
  },
  {
    title: "Digital Marketing Specialist",
    desc: "We are looking for a Expertised Digital Marketing Specialist to join our team.",
    type: "Full time",
    mode: "On-site",
  },
  {
    title: "SEO Expert",
    desc: "We are looking for a senior-level Product Designer to join our team.",
    type: "Full time",
    mode: "On-site",
  },
];

export function Careers() {
  const [selectedJob, setSelectedJob] = useState("");
  const [showModal, setShowModal] = useState(false);

  const onApply = (jobTitle) => {
    setSelectedJob(jobTitle);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="font-poppins">
      <Helmet>
        <title>Explore Digital Marketing Jobs for Career Growth & Learning</title>
        <meta
          name="description"
          content="Discover exciting Digital Marketing Jobs offering structured learning, career growth, and hands-on industry experience to boost your professional journey."
        />
        <meta
          name="keywords"
          content="Digital marketing Jobs"
        />
        <link rel="canonical" href="https://www.skyupdigitalsolutions.com/careers" />
      </Helmet>
      <Header />

      {/* HERO */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        style={{
          backgroundImage: "url('/images/career_banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-[221px] px-2 lg:h-[332px] flex flex-col items-center bg-[#EEF1FC] justify-center"
      >
        <motion.h1
          variants={fadeUp}
          className="text-center lg:text-[64px] sm:text-[32px] text-[24px] fw-bold"
        >
          <span className="text-[#0037CA]">Join Our Team</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-center text-[12px] sm:w-[824px] sm:text-[14px] mt-3 lg:text-[18px]"
        >
          We’re always looking for curious minds and driven professionals. Join our team to grow your skills, work on exciting projects, and build a career where your ideas truly matter.
        </motion.p>
      </motion.div>

      {/* ✅ INTRODUCING PEOPLE SECTION */}
      <section className="w-full bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerWrap}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            <motion.h2
              variants={fadeLeft}
              className="
                text-center lg:text-left
                text-[22px] sm:text-[28px] lg:text-[44px]
                font-extrabold leading-tight text-[#1A1A1A]
              "
            >
              Recruiting the People
              <br className="hidden lg:block" />&nbsp;
              Who Drive <span className="text-[#0037CA]">Our Growth</span>
            </motion.h2>

            <motion.p
              variants={fadeRight}
              className="
                text-center lg:text-left
                text-[#4B5563]
                text-[12px] sm:text-[14px] lg:text-[15px]
                leading-relaxed
                max-w-2xl mx-auto lg:mx-0
                lg:pt-2
              "
            >
              Behind every great result is an even greater team. Innovators,
              creators, and problem-solvers—working together to push boundaries.
              These are the people turning ideas into real impact every day.
            </motion.p>
          </div>

          <motion.div variants={softScale} className="mt-6 sm:mt-8">
            <div
              className="
                w-full overflow-hidden
                rounded-2xl sm:rounded-3xl
                bg-[#F3F4F6]
                shadow-[0_18px_55px_rgba(15,23,42,0.10)]
              "
            >
              <img
                src="/images/Career.webp"
                alt="Team working"
                className="
                  w-full
                  h-[190px] sm:h-[260px] lg:h-[420px]
                  object-cover
                  grayscale
                "
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ✅ CURRENTLY OPEN POSITIONS */}
      <section className="w-full bg-[#F6F7FF]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerWrap}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
        >
          <motion.h2
            variants={fadeUp}
            className="text-center text-[24px] sm:text-[28px] lg:text-[44px] font-extrabold text-[#1A1A1A]"
          >
            Currently Open Positions
          </motion.h2>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Job Cards */}
            <motion.div variants={staggerWrap} className="space-y-5 sm:mt-10">
              {jobs.map((job, idx) => (
                <motion.div
                  key={idx}
                  variants={softScale}
                  className="
                    rounded-2xl bg-white
                    border border-[#E8ECF7]
                    shadow-[0_14px_40px_rgba(15,23,42,0.06)]
                    p-3
                  "
                >
                  <div className="text-[16px] sm:text-[20px] font-semibold text-[#111827]">
                    {job.title}
                  </div>

                  <p className="mt-1 text-[12px] sm:text-[14px] text-[#2B2B2B] leading-relaxed max-w-[52ch]">
                    {job.desc}
                  </p>

                  <div className="mt-2 flex items-center gap-6 text-[12px] text-[#2B2B2B]">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.mode}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 24 }}
                    className="
                      mt-4 inline-flex items-center justify-center
                      rounded-lg bg-[#0037CA] text-white
                      px-8 py-2 text-[13px] font-semibold
                      hover:bg-[#3e62f3] transition
                    "
                    type="button"
                    onClick={() => onApply(job.title)}
                  >
                    Apply
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={softScale} className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden bg-white shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
                <img
                  src="/images/career2.webp"
                  alt="Open positions"
                  className="w-full h-[700px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ✅ Modal */}
      <JobApplicationFormModal
        show={showModal}
        onClose={closeModal}
        selectedJob={selectedJob}
      />

      {/* Floating WhatsApp + Call buttons */}
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
          className="whatsapp-chat sm:hidden w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
        >
          <MessageCircleIcon className="w-6 h-6 text-white" />
        </a>

        <a
          href="https://wa.me/917090170524"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-chat-gtm hidden sm:inline-flex group no-underline relative items-center bg-white pl-3 pr-[70px] py-3 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-transform"
        >
          <span className="text-slate-800 group-hover:text-green-600 font-semibold text-base whitespace-nowrap transition-colors">
            WhatsApp
          </span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
            <MessageCircleIcon className="w-5 h-5 text-white" />
          </span>
        </a>

        <a
          href="tel:+917090170524"
          className="tel-chat sm:hidden w-12 h-12 rounded-xl bg-[#3B46F6] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
        >
          <PhoneIcon className="w-6 h-6 text-white" />
        </a>

        <a
          href="tel:+917090170524"
          className="tel-chat-gtm hidden sm:inline-flex group no-underline relative items-center bg-white pl-3 pr-[66px] py-3 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-transform"
        >
          <span className="text-slate-800 group-hover:text-[#3B46F6] font-semibold text-base whitespace-nowrap transition-colors">
            +91 8867867775
          </span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#3B46F6] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
            <PhoneIcon className="w-5 h-5 text-white" />
          </span>
        </a>
      </motion.div>

      <Footer />
    </div>
  );
}
