import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send as SendIcon } from "lucide-react";

const HeroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const primaryBtnRef = useRef(null);
  const secondaryBtnRef = useRef(null);

  const [auditOpen, setAuditOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    if (formStatus.message) setFormStatus({ type: "", message: "" });
  };

  const validate = () => {
    const next = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s]{8,15}$/;

    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!emailRegex.test(form.email.trim())) next.email = "Enter a valid email";

    if (!form.mobile.trim()) next.mobile = "Phone is required";
    else if (!phoneRegex.test(form.mobile.trim()))
      next.mobile = "Enter a valid phone number";

    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message.trim()) next.message = "Message is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://skyup-backend.vercel.app"; 

  const onSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    setSubmitting(true);
    setFormStatus({ type: "", message: "" });

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    const res = await fetch(`${API_BASE}/add-contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to submit");
    }

    setFormStatus({
      type: "success",
      message: data?.message || "Submitted successfully!",
    });

    setForm({
      name: "",
      email: "",
      mobile: "",
      subject: "",
      message: "",
    });

  } catch (err) {
    setFormStatus({
      type: "error",
      message: err?.message || "Something went wrong. Please try again.",
    });
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    if (!auditOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setAuditOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [auditOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, { opacity: 0, y: 40, duration: 0.8 })
        .from(subtitleRef.current, { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
        .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(
          [primaryBtnRef.current, secondaryBtnRef.current],
          { opacity: 0, y: 15, duration: 0.4, stagger: 0.1 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative overflow-hidden text-white">
        <style>{`
          .animated-gradient-text {
            background: linear-gradient(-45deg, #60A5FA, #60A5FA, #FA9F43, #60A5FA);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientMove 6s ease-in-out infinite;
          }

          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        <video
          src="/videos/digital-marketing-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/80" />

        <div className="relative flex min-h-[60vh] md:min-h-[65vh] lg:min-h-[80vh] w-full items-center">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-8 lg:py-16 sm:px-6 lg:px-16">
            <div className="space-y-6 text-center flex flex-col items-center">
              <h1
                ref={titleRef}
                className="hero-title animated-gradient-text text-balance font-poppins font-bold text-[24px] sm:text-[64px] md:text-5xl lg:text-6xl lg:leading-tight"
              >
                Digital Growth Designed to Create Real Impact
              </h1>

              <p
                ref={subtitleRef}
                className="font-poppins text-[12px] text-white sm:text-[18px] leading-relaxed w-full md:w-10/12 lg:w-8/12"
              >
                Your trusted Digital Marketing Agency in Bangalore, helping brands grow with smart strategy and measurable results.
              </p>

              <div
                ref={ctaRef}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 pt-3"
              >
                <Link
                  to="/contactus"
                  ref={primaryBtnRef}
                  className="w-[200px] h-[50px] sm:w-[200px] sm:h-[60px] font-poppins inline-flex items-center justify-center rounded-full px-4 py-3 sm:px-5 sm:py-4 md:px-4 md:py-2 text-base sm:text-sm md:text-lg font-semibold shadow-sm bg-blue-700 text-white no-underline"
                >
                  Get Started
                </Link>

                <button
                  type="button"
                  ref={secondaryBtnRef}
                  onClick={() => setAuditOpen(true)}
                  className="w-[200px] h-[50px] sm:w-[200px] sm:h-[60px] font-poppins inline-flex items-center justify-center rounded-full px-4 py-3 sm:px-5 sm:py-3 md:px-4 md:py-2 text-base sm:text-sm md:text-lg font-semibold shadow-sm bg-white text-blue-900 border border-blue-700 no-underline"
                >
                  Get Free Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ MODAL + FORM */}
      <AnimatePresence>
        {auditOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] flex sm:items-center items-start justify-center p-3 sm:p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuditOpen(false)}
            />

            {/* Modal Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden my-3 sm:my-0 max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)]"
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b">
                <div>
                  <h3 className="text-[18px] sm:text-[22px] font-bold text-slate-900">
                    Get Free Audit
                  </h3>
                  <p className="mt-1 text-[13px] sm:text-[14px] text-slate-600">
                    Share your details and we’ll get back with an audit report.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAuditOpen(false)}
                  className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 transition"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-slate-700" />
                </button>
              </div>

              {/* Body */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto max-h-[calc(100vh-210px)] sm:max-h-[70vh]">
                <form onSubmit={onSubmit} className="mt-0 space-y-4">
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

                  {formStatus.message ? (
                    <div
                      className={[
                        "rounded-lg px-3 py-2 text-[13px]",
                        formStatus.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200",
                      ].join(" ")}
                    >
                      {formStatus.message}
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
              </div>

              <div className="px-5 sm:px-6 py-4 border-t bg-slate-50">
                <p className="text-[12px] text-slate-500">
                  By submitting, you agree to be contacted by SkyUp Digital Solutions.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;

/* Field component (so "Field is not defined" error is fixed) */
function Field({ label, type = "text", value, onChange, error }) {
  return (
    <div>
      <label className="block text-[12px] sm:text-[16px] font-bold text-[#0B3BFF] tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={[
          "mt-2 w-full rounded-lg bg-white border px-3 py-2 text-[13px]",
          "text-slate-700 placeholder:text-slate-400 outline-none",
          error ? "border-red-400" : "border-[#E5EAF6]",
          "focus:border-[#0B3BFF] focus:ring-2 focus:ring-[#0B3BFF]/15",
        ].join(" ")}
      />
      {error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
}
