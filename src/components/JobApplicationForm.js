import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://skyup-backend.vercel.app";

const initial = {
  jobTitle: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  linkedin: "",
  portfolio: "",
  resume: null,
};

const MAX_MB = 5;

const Label = ({ children }) => (
  <label className="form-label fw-semibold mb-1">{children}</label>
);

const Input = ({ error, className = "", ...props }) => (
  <>
    <input
      {...props}
      className={["form-control", error ? "is-invalid" : "", className].join(" ")}
    />
    {error ? <div className="invalid-feedback">{error}</div> : null}
  </>
);

export default function JobApplicationFormModal({ show, onClose, selectedJob = "" }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    setForm((p) => ({ ...p, jobTitle: selectedJob || "" }));
    setErrors((p) => ({ ...p, jobTitle: "" }));
  }, [selectedJob, show]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev || ""; };
  }, [show]);

  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    const req = ["jobTitle", "firstName", "lastName", "email", "phone", "street", "city", "state", "zip", "country"];

    req.forEach((k) => {
      if (!String(form[k] || "").trim()) e[k] = "Required";
    });

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.resume) e.resume = "Resume/CV is required";
    if (form.resume) {
      const sizeMB = form.resume.size / (1024 * 1024);
      if (sizeMB > MAX_MB) e.resume = "Max file size is 5MB";
      if (!["application/pdf"].includes(form.resume.type)) e.resume = "Only PDF allowed";
    }

    ["linkedin", "portfolio"].forEach((k) => {
      const v = String(form[k] || "").trim();
      if (!v) return;
      try {
        new URL(v.startsWith("http") ? v : `https://${v}`);
      } catch {
        e[k] = "Enter a valid URL";
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setForm((p) => ({ ...initial, jobTitle: p.jobTitle }));
    setErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("file", form.resume);

      const uploadRes = await axios.post(`${API_BASE}/resume`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { url, public_id } = uploadRes.data;

      const payload = {
        jobTitle: form.jobTitle,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        mobile: form.phone,
        street_address: form.street,
        city: form.city,
        state: form.state,
        zipcode: form.zip,
        country: form.country,
        linkedin: form.linkedin || null,
        portfolio: form.portfolio || null,
        resumeUrl: url,
        resumePublicId: public_id,
      };

      await axios.post(`${API_BASE}/add-users`, payload);

      alert("Application submitted successfully!");
      resetForm();
      onClose?.();

      // Replace navigate("/thankyou") with window.location
      window.location.href = `/thankyou?name=${encodeURIComponent(form.firstName)}&phone=${encodeURIComponent(form.phone)}`;

    } catch (err) {
      console.error("Submit error:", err);
      alert(err?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => {
    if (submitting) return;
    resetForm();
    onClose?.();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => { if (e.target.classList.contains("modal")) onClose?.(); }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content p-4 rounded-4">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Job Application Form</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => onClose?.()}
                disabled={submitting}
              />
            </div>

            <div className="modal-body">
              <div className="alert alert-primary py-2 mb-3">
                <span className="fw-semibold">You are applying for:</span>{" "}
                <span className="fw-bold">{form.jobTitle || "Please select a job"}</span>
                {errors.jobTitle && <div className="text-danger small mt-1">{errors.jobTitle}</div>}
              </div>

              <form onSubmit={onSubmit}>
                <div className="p-3 rounded bg-light">
                  <h6 className="fw-bold mb-1">Personal Information</h6>
                  <p className="text-muted small mb-3">Please provide your contact details</p>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <Label>First Name*</Label>
                      <Input value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} error={errors.firstName} />
                    </div>
                    <div className="col-md-6">
                      <Label>Last Name*</Label>
                      <Input value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} error={errors.lastName} />
                    </div>
                    <div className="col-md-6">
                      <Label>Email Address*</Label>
                      <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} error={errors.email} />
                    </div>
                    <div className="col-md-6">
                      <Label>Phone Number*</Label>
                      <Input inputMode="numeric" value={form.phone} onChange={(e) => setField("phone", e.target.value)} error={errors.phone} />
                    </div>
                    <div className="col-12">
                      <Label>Street Address*</Label>
                      <Input value={form.street} onChange={(e) => setField("street", e.target.value)} error={errors.street} />
                    </div>
                    <div className="col-md-6">
                      <Label>City*</Label>
                      <Input value={form.city} onChange={(e) => setField("city", e.target.value)} error={errors.city} />
                    </div>
                    <div className="col-md-6">
                      <Label>State/Province*</Label>
                      <Input value={form.state} onChange={(e) => setField("state", e.target.value)} error={errors.state} />
                    </div>
                    <div className="col-md-6">
                      <Label>ZIP/Postal Code*</Label>
                      <Input inputMode="numeric" value={form.zip} onChange={(e) => setField("zip", e.target.value)} error={errors.zip} />
                    </div>
                    <div className="col-md-6">
                      <Label>Country*</Label>
                      <Input placeholder="India" value={form.country} onChange={(e) => setField("country", e.target.value)} error={errors.country} />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-light mt-3">
                  <h6 className="fw-bold mb-1">Resume &amp; Additional Information</h6>
                  <p className="text-muted small mb-3">Upload your resume &amp; other details</p>

                  <div className="mb-3">
                    <Label>Resume/CV*</Label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      className={["form-control", errors.resume ? "is-invalid" : ""].join(" ")}
                      onChange={(e) => setField("resume", e.target.files?.[0] || null)}
                    />
                    {errors.resume
                      ? <div className="invalid-feedback d-block">{errors.resume}</div>
                      : <div className="form-text">PDF only, max 5MB</div>
                    }
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <Label>LinkedIn Profile URL</Label>
                      <Input placeholder="https://linkedin.com/in/yourprofile" value={form.linkedin} onChange={(e) => setField("linkedin", e.target.value)} error={errors.linkedin} />
                    </div>
                    <div className="col-md-6">
                      <Label>Portfolio Website URL</Label>
                      <Input placeholder="https://yourportfolio.com" value={form.portfolio} onChange={(e) => setField("portfolio", e.target.value)} error={errors.portfolio} />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-dark" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}