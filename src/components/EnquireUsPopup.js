import { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "vike/client/router";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://skyup-backend-3k9s.onrender.com";

const FIELDS = [
  { name: "name",   label: "FULL NAME",     type: "text",  placeholder: "Your name",       required: true },
  { name: "email",  label: "EMAIL ADDRESS", type: "email", placeholder: "you@email.com",   required: true },
  { name: "phone",  label: "PHONE NUMBER",  type: "tel",   placeholder: "+91 98765 43210", required: true },
];

const initial = { name: "", email: "", phone: "" };

export default function EnquireUsPopup() {
  const [isOpen, setIsOpen]       = useState(false);
  const [form, setForm]           = useState(initial);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState(null);

  // Auto-open after 3 seconds on page load
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setApiError(null);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      e.phone = "Enter a valid 10-digit phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setApiError(null);
    setLoading(true);

    try {
      // Map popup fields → backend's /add-contact schema
      const payload = {
        name:    form.name.trim(),
        email:   form.email.trim(),
        mobile:  form.phone.trim(),   // backend expects "mobile"
        subject: "Enquiry",           // sensible default
        message: "",                  // optional in popup context
      };

      await axios.post(`${API_BASE}/add-contact`, payload);

      // Close popup and redirect to thank-you page (same as contact form)
      setIsOpen(false);
      navigate(
        `/thankyou?name=${encodeURIComponent(form.name)}&phone=${encodeURIComponent(form.phone)}`
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setForm(initial);
    setErrors({});
    setApiError(null);
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#F0F4FF] p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="font-serif text-3xl font-bold text-black mb-2 leading-tight">
          Enquire Us
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <label className="block text-[14px] font-bold text-[#2D3FE0] uppercase tracking-widest mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={[
                  "w-full bg-white rounded-lg px-4 py-3 text-sm text-gray-900 outline-none transition",
                  "placeholder:text-gray-400 border",
                  errors[field.name]
                    ? "border-red-400 focus:ring-2 focus:ring-red-300"
                    : "border-transparent focus:ring-2 focus:ring-[#2D3FE0]",
                ].join(" ")}
              />
              {errors[field.name] && (
                <p className="mt-1 text-[11px] text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {apiError && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full flex items-center justify-center gap-2 bg-[#2D3FE0] hover:bg-[#1E2FB8] disabled:opacity-70 text-white font-bold text-sm py-4 rounded-lg transition tracking-wide"
          >
            {!loading && (
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
            {loading ? "Sending…" : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}