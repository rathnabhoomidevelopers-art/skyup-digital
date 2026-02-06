import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  PhoneIcon,
  MailIcon,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Footer from "./Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function ThankYou() {
  const location = useLocation();

  const name = location?.state?.name || "";
  const phone = location?.state?.phone || "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen font-poppins w-full ">
      {/* Top brand bar - Mobile optimized */}
      <div className="w-full bg-[#F9ECDE]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <img
            src="/images/rbd-logo.webp"
            alt="SLV Golden Towers"
            className="h-auto w-[140px] sm:w-[180px] md:w-[240px]"
          />

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0037CA] px-4 py-2.5 text-xs font-semibold text-white no-underline hover:bg-[#2058f3] sm:text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main - Fully responsive grid */}
      <motion.main
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-2 py-8 sm:px-6 sm:py-10 md:py-12 lg:grid-cols-[55%_45%] lg:gap-8 lg:py-16"
      >
        {/* Left content - Mobile first */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="order-1 rounded-2xl border border-[#FFEEC3] bg-white p-[12px] shadow-sm sm:order-1 sm:p-8 sm:rounded-3xl md:p-10 lg:p-[24px]"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-1 sm:gap-4">
              <div className="mt-1 flex shrink-0 rounded-xl bg-[#F6F7FF] p-2.5 sm:rounded-2xl sm:p-3">
                <CheckCircle2
                  size={24}
                  className="text-[#0B3BFF] sm:[size:28]"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-brushelva text-[#0B3BFF] font-poppins sm:text-3xl md:text-[44px]">
                  Thank You!
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-700 font-poppins sm:text-base sm:leading-7 md:text-[18px] md:max-w-xl">
                  We have received your enquiry. Our team will contact you shortly with details regarding Digital Marketing services.
                </p>
              </div>
            </div>

            {(name || phone) && (
              <div className="rounded-xl bg-[#FFF7E5] px-2 py-3 text-sm text-slate-700 sm:rounded-2xl sm:px-5 sm:text-base">
                <div className="font-semibold text-[#0F3F3B]">
                  Submitted Details
                </div>
                <div className="mt-1.5 space-y-1 text-sm sm:text-base">
                  {name && (
                    <div>
                      Name: <span className="font-medium">{name}</span>
                    </div>
                  )}
                  {phone && (
                    <div>
                      Phone: <span className="font-medium">{phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-2">
              <InfoPill title="Response time" value="Within 30–60 mins" />
              <InfoPill title="Location" value="Sahakara Nagar, Bengaluru" />
              <InfoPill title="Working hours" value="Mon–Sun 9:30–6:30" />
            </div>

            {/* CTA Buttons - Mobile stacked */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+918867867775"
                className="inline-flex items-center justify-center gap-2 rounded-xl no-underline bg-[#0037CA] px-5 py-3.5 text-sm font-semibold text-[#FFEFC4] hover:bg-[#144de8] sm:px-6 sm:py-3"
              >
                <PhoneIcon size={18} />
                Call Now
              </a>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-1">
                <a
                  href="mailto:contact@skyupdigitalsolutions.com"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border no-underline border-[#0F3F3B] bg-white px-5 py-3.5 text-sm font-semibold text-[#0F3F3B] hover:bg-[#0F3F3B]/5 sm:px-6 sm:py-3"
                >
                  <MailIcon size={18} />
                  Email Us
                </a>

                <Link
                  to="/service"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FA9F43] px-4 no-underline py-3.5 text-sm font-semibold text-white hover:brightness-95 sm:px-2 sm:py-3"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            {/* What happens next - Mobile optimized */}
            <div className="rounded-2xl bg-[#F6F7FF] p-[8px] sm:rounded-3xl sm:p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 sm:text-sm">
                What happens next?
              </div>

              <ul className="mt-3 space-y-2.5 text-sm leading-5 text-slate-700 sm:mt-4 sm:text-base sm:leading-6 sm:space-y-3">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0037CA]" />
                  We confirm your requirement.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0037CA]" />
                  We share brochure + latest pricing + offers (if any).
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0037CA]" />
                  We analyze your business needs.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0037CA]" />
                  We suggest the right digital marketing strategy.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Right card - Mobile stacked below */}
        <motion.aside
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="order-2 rounded-2xl border border-[#FFEEC3]  p-3 shadow-sm sm:rounded-3xl sm:p-6 md:p-8"
        >
          <h2 className="text-xl font-brushelva text-[#0F3F3B] sm:text-2xl md:text-[32px]">
            Quick Contacts
          </h2>

          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            <div className="flex lg:gap-4 mx-4">
              <PhoneIcon size={24} className="text-[#0B3BFF] sm:[size:28]" />
              <a href="tel:+918867867775" className="text-[14px] lg:text-[18px] no-underline text-[#2b2b2b]"> +91 8867867775</a>
            </div>
            <div className="flex lg:gap-4 mx-4">
              <MailIcon size={24} className="text-[#0B3BFF] sm:[size:28]" />
              <a href="mailto:contact@skyupdigitalsolutions.com" className="text-[14px] lg:text-[18px] no-underline text-[#2b2b2b]"> contact@skyupdigitalsolutions.com</a>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-white sm:rounded-3xl">
            <img
              src="/images/Vision_mission.webp"
              alt="SKYUP"
              className="h-[180px] w-full object-cover sm:h-[220px]"
            />
          </div>

          <div className="mt-5 rounded-2xl bg-white p-4 sm:mt-6 sm:rounded-3xl sm:p-5">
            <div className="text-xs font-bold uppercase tracking-[0.05em] text-slate-600 sm:text-sm">
              Address
            </div>
            <p className="mt-2 text-sm leading-5 text-slate-700 sm:text-base sm:leading-6">
              2nd Floor, No 23, 14A, Dasarahalli Main Rd, E Block&nbsp;
              <br className="sm:hidden" />
              Sahakar Nagar, Bengaluru, Karnataka 560092
            </p>
          </div>
        </motion.aside>
      </motion.main>

      {/* Footer strip */}
     <Footer/>

    </div>
  );
}

function InfoPill({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-sm sm:rounded-2xl sm:px-4">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[11px]">
        {title}
      </div>
      <div className="mt-1 text-sm font-semibold text-[#0F3F3B] sm:text-base">
        {value}
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value, href, breakAll }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-xl bg-white px-3 py-3.5 hover:bg-slate-50 shadow-sm sm:gap-4 sm:px-4 sm:py-4 sm:rounded-2xl"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEFC4] text-[#0F3F3B]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-600 sm:text-[13px]">{label}</div>
        <div
          className={`mt-0.5 text-sm font-semibold text-[#0F3F3B] sm:text-[14px] sm:mt-0 ${
            breakAll ? "break-words" : ""
          }`}
        >
          {value}
        </div>
      </div>
    </a>
  );
}
