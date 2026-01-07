import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MapPin,Phone,Mail,SendIcon, MessageSquareDotIcon, MessageCircleIcon, PhoneIcon} from "lucide-react";
import React, { useMemo, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "https://skyup-backend.vercel.app";

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

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  subject: "",
  message: "",
};

export function ContactUs() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
    setStatus({ type: "", message: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.mobile.trim()) e.mobile = "Phone is required";
    if (form.mobile && !/^\d{10}$/.test(form.mobile.replace(/\D/g, ""))) {
      e.mobile = "Enter a valid 10-digit phone number";
    }
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      };

      const res = await axios.post(`${API_BASE}/add-contact`, payload);

      setStatus({ type: "success", message: "Message sent successfully!" });
      setForm(initialForm);
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to send message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-poppins">
      <Helmet>
        <title>Contact Us | SKYUP Digital Solutions</title>
        <meta
          name="description"
          content="Have questions or ready to start? Contact us at SKYUP Digital Solutions to grow your business with expert digital marketing and web solutions."
        />
        <meta
          name="keywords"
          content="Contact us"
        />
        <link rel="canonical" href="https://www.skyupdigitalsolutions.com/contactus" />
      </Helmet>
      <Header />
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        style={{
          backgroundImage: "url('/images/contact_banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-[259px] sm:h-[399px] flex flex-col items-center bg-[#EEF1FC] justify-center"
      >
        <motion.div variants={fadeUp} className="flex justify-center">
          <motion.div
            animate={{ opacity: [1, 0.45, 1] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="
              inline-flex items-center gap-1.5
              px-3 py-1.5 mb-[16px]
              rounded-full
              bg-white/55
              backdrop-blur-md
              border border-white/40
              shadow-[0_8px_24px_rgba(11,59,255,0.12)]
              transition-all
            "
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-[#16A34A]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[#0B3BFF] font-semibold text-[12px] sm:text-[13px] leading-none">
              Ready to Build Something New
            </span>
          </motion.div>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="text-center lg:text-[44px] sm:text-[44px] text-[24px] fw-bold"
        >
          Let’s Talk with
        </motion.h2>

        <motion.h1
          variants={fadeUp}
          className="text-center lg:text-[64px] sm:text-[32px] text-[24px] fw-bold"
        >
          <span className="text-[#0037CA]">SKYUP Digital Solutions</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-center sm:px-0 lg:px-0 px-4 text-[12px] sm:text-[14px] mt-3 lg:text-[18px]"
        >
          Have a vision you want to build? Share it with us. Together, we’ll create
          solutions that drive real growth.
        </motion.p>
      </motion.div>

      <section className="w-full bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerWrap}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            {/* FORM */}
            <motion.div
              variants={fadeLeft}
              className="
                rounded-2xl bg-[#F4F7FF]
                border border-[#DDE6FF]
                shadow-[0_14px_40px_rgba(15,23,42,0.06)]
                p-3 sm:p-6 lg:p-7
              "
            >
              <div className="text-[20px] sm:text-[24px] font-bold tracking-wide text-[#111827]">
                SEND US A MESSAGE
              </div>

              <form onSubmit={onSubmit} className="mt-4 space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 text-[12px] sm:text-[16px] gap-4">
                  <Field
                    label="NAME*"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    error={errors.name}
                  />
                  <Field
                    label="EMAIL*"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 text-[12px] sm:text-[16px] gap-4">
                  <Field
                    label="PHONE*"
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setField("mobile", e.target.value)}
                    error={errors.mobile}
                  />
                  <Field
                    label="SUBJECT*"
                    value={form.subject}
                    onChange={(e) => setField("subject", e.target.value)}
                    error={errors.subject}
                  />
                </div>

                <div>
                  <label className="block text-[12px] sm:text-[16px] font-bold text-[#0B3BFF] tracking-wide">
                    MESSAGE*
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you need..."
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    className={[
                      "mt-2 w-full rounded-lg bg-white border px-3 py-2 text-[13px]",
                      "text-slate-700 placeholder:text-slate-400 outline-none resize-none",
                      errors.message ? "border-red-400" : "border-[#E5EAF6]",
                      "focus:border-[#0B3BFF] focus:ring-2 focus:ring-[#0B3BFF]/15",
                    ].join(" ")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-[12px] text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Status message */}
                {status.message ? (
                  <div
                    className={[
                      "rounded-lg px-3 py-2 text-[13px]",
                      status.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200",
                    ].join(" ")}
                  >
                    {status.message}
                  </div>
                ) : null}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ y: submitting ? 0 : -1 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className={[
                    "w-full rounded-lg py-3 text-[13px] sm:text-[16px] font-semibold",
                    "inline-flex items-center justify-center gap-2 transition",
                    submitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#0B3BFF] text-white hover:bg-[#0832DB]",
                  ].join(" ")}
                >
                  <SendIcon className="w-5 h-5" />
                  {submitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </motion.div>

            {/* INFO CARD */}
            <motion.div
              variants={fadeRight}
              className=" sm:h-[470px] 
                rounded-2xl bg-gradient-to-b from-[#00164F] to-[#0032B5]
                shadow-[0_18px_55px_rgba(15,23,42,0.18)]
                p-6 sm:p-20
                text-white
              "
            >
              <InfoRow
                Icon={MapPin}
                iconColor="text-[#FF8D17]"
                title="OUR OFFICE"
                lines={[
                  "2nd Floor, No 23, E Block, Parindhi,",
                  "14A Dasarahalli Main Rd, Sahakar Nagar,",
                  "Bengaluru, Karnataka 560092",
                ]}
              />

              <div className="mt-6">
                <InfoRow
                  Icon={Phone}
                  iconColor="text-[#FF8D17]"
                  title="PHONE"
                  lines={["+91 8867867775"]}
                  actionText="Chat on Whatsapp"
                  actionHref="https://wa.me/918867867775"
                />
              </div>

              <div className="mt-6">
                <InfoRow
                  Icon={Mail}
                  iconColor="text-[#FF8D17]"
                  title="EMAIL"
                  lines={["contact@skyupdigitalsolutions.com"]}
                />
              </div>
            </motion.div>
          </div>

          <motion.div variants={softScale} className="mt-8 sm:mt-10">
            <div
              className="
                w-full overflow-hidden
                rounded-2xl
                border border-[#E8ECF7]
                shadow-[0_18px_55px_rgba(15,23,42,0.10)]
                bg-slate-100
              "
            >
              <iframe
                title="Bengaluru Map"
                src="https://www.google.com/maps?q=Bengaluru&output=embed"
                className="w-full h-[220px] sm:h-[280px] lg:h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>
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

function Field({ label, placeholder, type = "text", value, onChange, error }) {
  return (
    <div>
      <label className="block text-[12px] sm:text-[16px] font-bold text-[#0B3BFF] tracking-wide">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
          "mt-2 w-full rounded-lg bg-white border px-3 py-2 text-[13px]",
          "text-slate-700 placeholder:text-slate-400 outline-none",
          error ? "border-red-400" : "border-[#E5EAF6]",
          "focus:border-[#0B3BFF] focus:ring-2 focus:ring-[#0B3BFF]/15",
        ].join(" ")}
      />
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

function InfoRow({
  Icon,
  title,
  lines,
  actionText,
  actionHref,
  iconColor = "text-white",
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>

      <div className="min-w-0">
        <div className="text-[18px] font-bold tracking-wide text-[#FA9F43]">
          {title}
        </div>

        <div className="mt-1 text-[12px] sm:text-[16px] text-white/80 leading-relaxed">
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>

        {actionText && actionHref && (
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 gap-2 flex items-center no-underline text-[12px] font-semibold text-[#F6A044] hover:underline"
          >
            <MessageSquareDotIcon className="h-4 w-4" />
            {actionText}
          </a>
        )}
      </div>
    </div>
  );
}
