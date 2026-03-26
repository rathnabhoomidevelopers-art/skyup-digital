import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Trash2, Plus, Image as ImageIcon, Link as LinkIcon, Type, List,
  Settings, Upload, Send, Facebook, Youtube, MessageCircle, Instagram,
  ChevronLeft, Eye, EyeOff, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle, Loader, X, LogIn, LogOut, Edit3, Search, ArrowLeft,
  Zap, Twitter, Linkedin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BLOGS } from "../data/blogs";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const slugify = (str = "") =>
  str.toLowerCase().trim()
    .replace(/[""''"`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const CL_CLOUD  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CL_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const compressAndUpload = (file, { maxW = 1400, quality = 0.82 } = {}) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxW) { height = Math.round((height * maxW) / width); width = maxW; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error("Canvas compression failed"));
        const form = new FormData();
        form.append("file", blob, file.name.replace(/\.[^.]+$/, ".webp"));
        form.append("upload_preset", CL_PRESET);
        try {
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CL_CLOUD}/image/upload`,
            { method: "POST", body: form }
          );
          const data = await res.json();
          if (!res.ok) {
            const msg = data?.error?.message || `HTTP ${res.status}`;
            return reject(new Error(`Cloudinary: ${msg}`));
          }
          resolve(data.secure_url);
        } catch (e) { reject(e); }
      }, "image/webp", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Image load failed")); };
    img.src = objectUrl;
  });

// Font weight helpers
const FONT_WEIGHT_OPTIONS = [
  { value: "font-normal",    label: "Normal",   css: "400" },
  { value: "font-medium",    label: "Medium",   css: "500" },
  { value: "font-semibold",  label: "Semibold", css: "600" },
  { value: "font-bold",      label: "Bold",     css: "700" },
];

const FW_DEFAULT_HEADING = "font-bold";
const FW_DEFAULT_PARA    = "font-normal";

// ─── sectionToElement ─────────────────────────────────────────────────────────
const sectionToElement = (s) => {
  const base = { id: Date.now() + Math.random() };
  if (s.type === "p")                return { ...base, type: "p",                text: s.text,  fontWeight: s.fontWeight || FW_DEFAULT_PARA };
  if (s.type === "h2")               return { ...base, type: "h2",               text: s.text,  fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h3")               return { ...base, type: "h3",               text: s.text,  fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h4")               return { ...base, type: "h4",               text: s.text,  fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h5")               return { ...base, type: "h5",               text: s.text,  fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h6")               return { ...base, type: "h6",               text: s.text,  fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "quote")            return { ...base, type: "quote",            text: s.text };
  if (s.type === "ul")               return { ...base, type: "ul",               text: s.text };
  if (s.type === "ol")               return { ...base, type: "ol",               text: s.text };
  if (s.type === "table")            return { ...base, type: "table",            headers: s.headers || [], rows: s.rows || [], themed: s.themed || false };
  if (s.type === "image")            return { ...base, type: "image",            src: s.src, caption: s.caption || "" };
  if (s.type === "p_with_link")      return { ...base, type: "p_with_link",      textBefore: s.textBefore || "", linkText: s.linkText || "", href: s.href || "", textAfter: s.textAfter || "", fontWeight: s.fontWeight || FW_DEFAULT_PARA };
  if (s.type === "p_with_bold")      return { ...base, type: "p_with_bold",      parts: s.parts || [], fontWeight: s.fontWeight || FW_DEFAULT_PARA };
  if (s.type === "p_with_link_bold") return { ...base, type: "p_with_link_bold", partsBefore: s.partsBefore || [], linkText: s.linkText || "", href: s.href || "", partsAfter: s.partsAfter || [], fontWeight: s.fontWeight || FW_DEFAULT_PARA };
  if (s.type === "h2_with_link")     return { ...base, type: "h2_with_link",     textBefore: s.textBefore || "", linkText: s.linkText || "", href: s.href || "", textAfter: s.textAfter || "", fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h3_with_link")     return { ...base, type: "h3_with_link",     textBefore: s.textBefore || "", linkText: s.linkText || "", href: s.href || "", textAfter: s.textAfter || "", fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h4_with_link")     return { ...base, type: "h4_with_link",     textBefore: s.textBefore || "", linkText: s.linkText || "", href: s.href || "", textAfter: s.textAfter || "", fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h5_with_link")     return { ...base, type: "h5_with_link",     textBefore: s.textBefore || "", linkText: s.linkText || "", href: s.href || "", textAfter: s.textAfter || "", fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  if (s.type === "h6_with_link")     return { ...base, type: "h6_with_link",     textBefore: s.textBefore || "", linkText: s.linkText || "", href: s.href || "", textAfter: s.textAfter || "", fontWeight: s.fontWeight || FW_DEFAULT_HEADING };
  return { ...base, type: "p", text: s.text || "", fontWeight: FW_DEFAULT_PARA };
};

// ─── toSections ───────────────────────────────────────────────────────────────
const toSections = (elements) =>
  elements.map((el) => {
    const fw = el.fontWeight || undefined;
    if (el.type === "p")                return { type: "p",                text: el.text,  ...(fw && { fontWeight: fw }) };
    if (el.type === "h2")               return { type: "h2",               text: el.text,  ...(fw && { fontWeight: fw }) };
    if (el.type === "h3")               return { type: "h3",               text: el.text,  ...(fw && { fontWeight: fw }) };
    if (el.type === "h4")               return { type: "h4",               text: el.text,  ...(fw && { fontWeight: fw }) };
    if (el.type === "h5")               return { type: "h5",               text: el.text,  ...(fw && { fontWeight: fw }) };
    if (el.type === "h6")               return { type: "h6",               text: el.text,  ...(fw && { fontWeight: fw }) };
    if (el.type === "quote")            return { type: "quote",            text: el.text };
    if (el.type === "ul")               return { type: "ul",               text: el.text };
    if (el.type === "ol")               return { type: "ol",               text: el.text };
    if (el.type === "table")            return { type: "table",            headers: el.headers, rows: el.rows, themed: el.themed };
    if (el.type === "image")            return { type: "image",            src: el.src, caption: el.caption };
    if (el.type === "p_with_link")      return { type: "p_with_link",      textBefore: el.textBefore, linkText: el.linkText, href: el.href, textAfter: el.textAfter, ...(fw && { fontWeight: fw }) };
    if (el.type === "p_with_bold")      return { type: "p_with_bold",      parts: el.parts, ...(fw && { fontWeight: fw }) };
    if (el.type === "p_with_link_bold") return { type: "p_with_link_bold", partsBefore: el.partsBefore, linkText: el.linkText, href: el.href, partsAfter: el.partsAfter, ...(fw && { fontWeight: fw }) };
    if (el.type === "h2_with_link")     return { type: "h2_with_link",     textBefore: el.textBefore, linkText: el.linkText, href: el.href, textAfter: el.textAfter, ...(fw && { fontWeight: fw }) };
    if (el.type === "h3_with_link")     return { type: "h3_with_link",     textBefore: el.textBefore, linkText: el.linkText, href: el.href, textAfter: el.textAfter, ...(fw && { fontWeight: fw }) };
    if (el.type === "h4_with_link")     return { type: "h4_with_link",     textBefore: el.textBefore, linkText: el.linkText, href: el.href, textAfter: el.textAfter, ...(fw && { fontWeight: fw }) };
    if (el.type === "h5_with_link")     return { type: "h5_with_link",     textBefore: el.textBefore, linkText: el.linkText, href: el.href, textAfter: el.textAfter, ...(fw && { fontWeight: fw }) };
    if (el.type === "h6_with_link")     return { type: "h6_with_link",     textBefore: el.textBefore, linkText: el.linkText, href: el.href, textAfter: el.textAfter, ...(fw && { fontWeight: fw }) };
    return { type: "p", text: el.text || "" };
  });

// ─── createElement ────────────────────────────────────────────────────────────
const createElement = (type) => {
  const base = { id: Date.now() + Math.random(), type };
  switch (type) {
    case "p":                return { ...base, text: "Write your paragraph here…",         fontWeight: FW_DEFAULT_PARA };
    case "h2":               return { ...base, text: "Section Heading",                    fontWeight: FW_DEFAULT_HEADING };
    case "h3":               return { ...base, text: "Sub-section Heading",                fontWeight: FW_DEFAULT_HEADING };
    case "h4":               return { ...base, text: "H4 Heading",                         fontWeight: FW_DEFAULT_HEADING };
    case "h5":               return { ...base, text: "H5 Heading",                         fontWeight: FW_DEFAULT_HEADING };
    case "h6":               return { ...base, text: "H6 Heading",                         fontWeight: FW_DEFAULT_HEADING };
    case "quote":            return { ...base, text: "An insightful quote goes here…" };
    case "ul":               return { ...base, text: ["First point", "Second point", "Third point"] };
    case "ol":               return { ...base, text: ["Step one", "Step two", "Step three"] };
    case "table":            return { ...base, headers: ["Column 1", "Column 2", "Column 3"], rows: [["Row 1A", "Row 1B", "Row 1C"], ["Row 2A", "Row 2B", "Row 2C"]], themed: false };
    case "image":            return { ...base, src: "", caption: "" };
    case "p_with_link":      return { ...base, textBefore: "Learn more about", linkText: "digital marketing", href: "https://skyupdigitalsolutions.com/services", textAfter: "services we offer.", fontWeight: FW_DEFAULT_PARA };
    case "p_with_bold":      return { ...base, parts: [{ text: "Normal text here. ", bold: false }, { text: "Bold text here.", bold: true }], fontWeight: FW_DEFAULT_PARA };
    case "p_with_link_bold": return { ...base, partsBefore: [{ text: "Read more about ", bold: false }], linkText: "digital marketing", href: "https://skyupdigitalsolutions.com/services", partsAfter: [{ text: " to ", bold: false }, { text: "grow your business.", bold: true }], fontWeight: FW_DEFAULT_PARA };
    case "h2_with_link":     return { ...base, textBefore: "", linkText: "Section Heading with Link", href: "https://skyupdigitalsolutions.com", textAfter: "", fontWeight: FW_DEFAULT_HEADING };
    case "h3_with_link":     return { ...base, textBefore: "", linkText: "Sub-section Heading with Link", href: "https://skyupdigitalsolutions.com", textAfter: "", fontWeight: FW_DEFAULT_HEADING };
    case "h4_with_link":     return { ...base, textBefore: "", linkText: "H4 Heading with Link", href: "https://skyupdigitalsolutions.com", textAfter: "", fontWeight: FW_DEFAULT_HEADING };
    case "h5_with_link":     return { ...base, textBefore: "", linkText: "H5 Heading with Link", href: "https://skyupdigitalsolutions.com", textAfter: "", fontWeight: FW_DEFAULT_HEADING };
    case "h6_with_link":     return { ...base, textBefore: "", linkText: "H6 Heading with Link", href: "https://skyupdigitalsolutions.com", textAfter: "", fontWeight: FW_DEFAULT_HEADING };
    default: return base;
  }
};

// ─── Heading size map ─────────────────────────────────────────────────────────
const HEADING_SIZE = {
  h2: "text-[20px] sm:text-[24px]",
  h3: "text-[16px] sm:text-[18px]",
  h4: "text-[15px] sm:text-[16px]",
  h5: "text-[13px] sm:text-[14px]",
  h6: "text-[12px] sm:text-[13px]",
};

const BRAND   = "#0057FF";
const ACCENT  = "#00C2FF";
const DARK    = "#0A0F1E";
const SURFACE = "#F0F6FF";

const Label = ({ children }) => (
  <label className="block mb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
    {children}
  </label>
);
const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800
      placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20
      focus:border-[#0057FF] transition-all ${className}`}
  />
);
const Textarea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800
      placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20
      focus:border-[#0057FF] transition-all resize-none ${className}`}
  />
);
const SectionDivider = ({ children }) => (
  <div className="flex items-center gap-2 py-1">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">{children}</span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

// ─── Font Weight Picker ───────────────────────────────────────────────────────
const FontWeightPicker = ({ value, onChange }) => (
  <div>
    <Label>Font Weight</Label>
    <div className="flex gap-1.5">
      {FONT_WEIGHT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 rounded-lg border text-[11px] transition-all ${
            value === opt.value
              ? "bg-[#0057FF] text-white border-[#0057FF] font-semibold"
              : "bg-white text-slate-500 border-slate-200 hover:border-[#0057FF] hover:text-[#0057FF]"
          }`}
          style={{ fontWeight: opt.css }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

// ─── Element type definitions ─────────────────────────────────────────────────
const ELEMENT_TYPES = [
  { type: "p",                icon: Type,      label: "Paragraph" },
  { type: "h2",               icon: Type,      label: "H2" },
  { type: "h3",               icon: Type,      label: "H3" },
  { type: "h4",               icon: Type,      label: "H4" },
  { type: "h5",               icon: Type,      label: "H5" },
  { type: "h6",               icon: Type,      label: "H6" },
  { type: "quote",            icon: Type,      label: "Quote" },
  { type: "ul",               icon: List,      label: "Bullets" },
  { type: "ol",               icon: List,      label: "Numbered" },
  { type: "table",            icon: List,      label: "Table" },
  { type: "image",            icon: ImageIcon, label: "Image" },
  { type: "p_with_link",      icon: LinkIcon,  label: "Para+Link" },
  { type: "p_with_bold",      icon: Type,      label: "Bold Para" },
  { type: "p_with_link_bold", icon: LinkIcon,  label: "Bold+Link" },
  { type: "h2_with_link",     icon: LinkIcon,  label: "H2+Link" },
  { type: "h3_with_link",     icon: LinkIcon,  label: "H3+Link" },
  { type: "h4_with_link",     icon: LinkIcon,  label: "H4+Link" },
  { type: "h5_with_link",     icon: LinkIcon,  label: "H5+Link" },
  { type: "h6_with_link",     icon: LinkIcon,  label: "H6+Link" },
];

const RenderParts = ({ parts = [], className = "font-semibold text-[#0A0F1E]" }) =>
  parts.map((part, i) =>
    part.bold
      ? <strong key={i} className={className}>{part.text}</strong>
      : <span key={i}>{part.text}</span>
  );

// ─── Preview section renderer ─────────────────────────────────────────────────
function PreviewSection({ s, usedH3 }) {
  const fw = s.fontWeight || FW_DEFAULT_HEADING;

  // Generic heading renderer for h2–h6
  const renderHeading = (tag, sizeClass, text, defaultFw) => {
    const base = slugify(text || "");
    const count = (usedH3.get(base) || 0) + 1;
    usedH3.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    return React.createElement(tag, {
      id,
      className: `scroll-mt-28 ${sizeClass} ${s.fontWeight || defaultFw} text-[#0A0F1E]`,
    }, text);
  };

  const renderHeadingWithLink = (tag, sizeClass, defaultFw) => {
    const base = slugify(s.linkText || "");
    const count = (usedH3.get(base) || 0) + 1;
    usedH3.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    return React.createElement(tag, {
      id,
      className: `scroll-mt-28 ${sizeClass} ${s.fontWeight || defaultFw} text-[#0A0F1E]`,
    }, [
      s.textBefore ? s.textBefore.trimEnd() + " " : "",
      <a key="link" href={s.href} target="_blank" rel="noopener noreferrer"
        className="text-[#0057FF] hover:opacity-80 underline underline-offset-2 decoration-[#0057FF]/40 transition-opacity">
        {s.linkText}
      </a>,
      s.textAfter ? " " + s.textAfter.trimStart() : "",
    ]);
  };

  if (s.type === "h2") return renderHeading("h2", HEADING_SIZE.h2, s.text, FW_DEFAULT_HEADING);
  if (s.type === "h3") return renderHeading("h3", HEADING_SIZE.h3, s.text, FW_DEFAULT_HEADING);
  if (s.type === "h4") return renderHeading("h4", HEADING_SIZE.h4, s.text, FW_DEFAULT_HEADING);
  if (s.type === "h5") return renderHeading("h5", HEADING_SIZE.h5, s.text, FW_DEFAULT_HEADING);
  if (s.type === "h6") return renderHeading("h6", HEADING_SIZE.h6, s.text, FW_DEFAULT_HEADING);
  if (s.type === "h2_with_link") return renderHeadingWithLink("h2", HEADING_SIZE.h2, FW_DEFAULT_HEADING);
  if (s.type === "h3_with_link") return renderHeadingWithLink("h3", HEADING_SIZE.h3, FW_DEFAULT_HEADING);
  if (s.type === "h4_with_link") return renderHeadingWithLink("h4", HEADING_SIZE.h4, FW_DEFAULT_HEADING);
  if (s.type === "h5_with_link") return renderHeadingWithLink("h5", HEADING_SIZE.h5, FW_DEFAULT_HEADING);
  if (s.type === "h6_with_link") return renderHeadingWithLink("h6", HEADING_SIZE.h6, FW_DEFAULT_HEADING);

  if (s.type === "quote")
    return (
      <div className="rounded-xl border border-[#B8D4FF] bg-[#EFF6FF] px-4 py-4 text-[13px] sm:text-[14px] text-slate-700">
        <div className="border-l-4 border-[#0057FF] pl-3 italic leading-relaxed" dangerouslySetInnerHTML={{ __html: s.text }} />
      </div>
    );

  if (s.type === "table") {
    const themed = s.themed;
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-[13px] sm:text-[14px] text-slate-700 border-collapse">
          <thead>
            <tr>
              {(s.headers || []).map((h, i) => (
                <th key={i} className="text-left px-4 py-3 font-bold border border-slate-200 text-[#0A0F1E]"
                  style={{ background: themed ? "#DBEAFE" : "#ffffff" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(s.rows || []).map((row, ri) => (
              <tr key={ri} style={{ background: themed ? (ri % 2 === 0 ? "#EFF6FF" : "#DBEAFE") : "#ffffff" }}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5 border border-slate-200">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (s.type === "image")
    return (
      <figure className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
        {s.src
          ? <img src={s.src} alt={s.caption || "Blog image"} className="w-full h-auto" />
          : <div className="w-full h-40 flex items-center justify-center text-slate-400 text-sm">No image uploaded</div>
        }
        {s.caption && <figcaption className="px-4 py-3 text-[12px] text-slate-500">{s.caption}</figcaption>}
      </figure>
    );

  if (s.type === "ul")
    return (
      <ul className="list-disc list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-600">
        {(s.text || []).map((item, i) => (
          <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    );

  if (s.type === "ol")
    return (
      <ol className="list-decimal list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-600">
        {(s.text || []).map((item, i) => (
          <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ol>
    );

  if (s.type === "p_with_link")
    return (
      <p className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${s.fontWeight || FW_DEFAULT_PARA}`}>
        {s.textBefore ? s.textBefore.trimEnd() + " " : ""}
        <a href={s.href} className="text-[#0057FF] underline underline-offset-2 hover:opacity-80">{s.linkText}</a>
        {s.textAfter ? " " + s.textAfter.trimStart() : ""}
      </p>
    );

  if (s.type === "p_with_bold")
    return (
      <p className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${s.fontWeight || FW_DEFAULT_PARA}`}>
        <RenderParts parts={s.parts} />
      </p>
    );

  if (s.type === "p_with_link_bold")
    return (
      <p className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${s.fontWeight || FW_DEFAULT_PARA}`}>
        <RenderParts parts={s.partsBefore} />
        {" "}
        <a href={s.href} className="text-[#0057FF] font-semibold underline underline-offset-2 hover:opacity-80">{s.linkText}</a>
        {" "}
        <RenderParts parts={s.partsAfter} />
      </p>
    );

  return (
    <p
      className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${s.fontWeight || FW_DEFAULT_PARA}`}
      dangerouslySetInnerHTML={{ __html: s.text }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function LoginScreen() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (!result.success) setError(result.message || "Login failed. Check your credentials.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "linear-gradient(135deg, #0A0F1E 0%, #0D1B3E 50%, #0A1628 100%)",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        .skyup-glow { box-shadow: 0 0 40px rgba(0,87,255,0.25), 0 0 80px rgba(0,194,255,0.1); }
        .skyup-btn-glow:hover { box-shadow: 0 4px 20px rgba(0,87,255,0.5); }
      `}</style>
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(rgba(0,87,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,87,255,0.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 skyup-glow"
            style={{ background: "linear-gradient(135deg, #0057FF, #00C2FF)" }}>
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            SkyUp Blog Builder
          </h1>
          <p className="text-sm text-blue-300 mt-1">Sign in to create &amp; edit blogs</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-7 skyup-glow"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-sm mb-5">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label><span className="text-blue-300">Email address</span></Label>
              <input
                type="email" value={form.email} autoFocus
                placeholder="blogger@skyupdigitalsolutions.com"
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm rounded-lg text-white placeholder:text-white/25 focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                onFocus={e => e.target.style.borderColor = "#0057FF"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </div>
            <div>
              <Label><span className="text-blue-300">Password</span></Label>
              <input
                type="password" value={form.password} placeholder="••••••••"
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm rounded-lg text-white placeholder:text-white/25 focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                onFocus={e => e.target.style.borderColor = "#0057FF"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed skyup-btn-glow"
              style={{ background: loading ? "#0057FF99" : "linear-gradient(135deg,#0057FF,#00C2FF)" }}>
              {loading ? <><Loader size={15} className="animate-spin" /> Signing in…</> : <><LogIn size={15} /> Sign In</>}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-white/30 mt-4">Authorized SkyUp team members only</p>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// BLOG PICKER
// ═════════════════════════════════════════════════════════════════════════════
function BlogPicker({ onSelect }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const filtered = BLOGS.filter(
    (b) =>
      b.title?.toLowerCase().includes(query.toLowerCase()) ||
      b.slug?.toLowerCase().includes(query.toLowerCase()) ||
      b.category?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F5F8FF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');`}</style>
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0057FF,#00C2FF)" }}>
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-slate-800 leading-none block"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Blog Builder</span>
            <span className="text-[10px] text-slate-400">SkyUp Digital Solutions</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "#EFF6FF", color: "#0057FF" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0057FF]" />
            {user?.email || "Logged in"}
          </div>
          <button onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:border-red-300 hover:text-red-500 transition-all">
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-[#0A0F1E] mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What would you like to do?</h2>
        <p className="text-sm text-slate-500 mb-8">Create a new blog post, or select an existing one to edit.</p>
        <button onClick={() => onSelect(null)}
          className="w-full mb-8 flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-[#0057FF]/30
            bg-[#EFF6FF] hover:border-[#0057FF] hover:bg-[#DBEAFE] transition-all group text-left">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#0057FF,#00C2FF)" }}>
            <Plus size={22} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-[#0057FF] text-base">Create new blog</div>
            <div className="text-sm text-slate-500 mt-0.5">Start fresh with a blank canvas</div>
          </div>
        </button>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Edit existing ({BLOGS.length} blogs)</h3>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search blogs…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0057FF] transition-all w-44" />
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map((blog) => (
            <button key={blog.id} onClick={() => onSelect(blog)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0057FF] hover:shadow-md transition-all group text-left">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                {blog.heroImage || blog.image
                  ? <img src={blog.heroImage || blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-slate-300" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 text-sm truncate group-hover:text-[#0057FF] transition-colors">{blog.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#EFF6FF", color: "#0057FF" }}>{blog.category}</span>
                  <span className="text-[11px] text-slate-400 truncate">{blog.slug}</span>
                </div>
              </div>
              <Edit3 size={14} className="text-slate-300 group-hover:text-[#0057FF] flex-shrink-0 transition-colors" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No blogs match "{query}"</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// BLOG EDITOR
// ═════════════════════════════════════════════════════════════════════════════
function BlogEditor({ editingBlog, onBack }) {
  const { token, user, logout } = useAuth();
  const isEditMode = !!editingBlog;

  const [elements, setElements]             = useState([]);
  const [selectedId, setSelectedId]         = useState(null);
  const [showAddMenu, setShowAddMenu]       = useState(false);
  const [insertAfterIdx, setInsertAfterIdx] = useState(null);
  const [hoveredInsert, setHoveredInsert]   = useState(null);
  const [showSettings, setShowSettings]     = useState(false);
  const [previewMode, setPreviewMode]       = useState(false);
  const [publishStatus, setPublishStatus]   = useState(null);
  const [publishMsg, setPublishMsg]         = useState("");
  const [activeTocId, setActiveTocId]       = useState(null);

  const [meta, setMeta] = useState({
    title: "", headline: "", description: "", keywords: "",
    slug: "", category: "Digital Marketing",
    author: "SkyUp Digital Solutions",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    heroImage: "", imageAlt: "", tags: "",
  });

  useEffect(() => {
    if (!editingBlog) return;
    setMeta({
      title:       editingBlog.title       || editingBlog.headline || "",
      headline:    editingBlog.headline    || editingBlog.title    || "",
      description: editingBlog.description || "",
      keywords:    editingBlog.Keywords    || editingBlog.keywords || "",
      slug:        editingBlog.slug        || "",
      category:    editingBlog.category    || "Digital Marketing",
      author:      editingBlog.author      || "SKYUP",
      date:        editingBlog.date        || "",
      heroImage:   editingBlog.heroImage   || editingBlog.image    || "",
      imageAlt:    editingBlog.imageAlt    || editingBlog.title    || "",
      tags:        (editingBlog.tags || []).join(", "),
    });
    const els = (editingBlog.sections || []).map(sectionToElement);
    setElements(els);
  }, [editingBlog]);

  const selectedEl = elements.find((el) => el.id === selectedId) || null;

  // ── TOC ──────────────────────────────────────────────────────────────────
  const TOC_HEADING_TYPES = new Set(["h2","h3","h4","h5","h6","h2_with_link","h3_with_link","h4_with_link","h5_with_link","h6_with_link"]);

  const toc = useMemo(() => {
    const used = new Map();
    return elements
      .filter((el) => TOC_HEADING_TYPES.has(el.type) && (el.text || el.linkText))
      .map((el) => {
        const rawText = el.text || el.linkText;
        const base = slugify(rawText);
        const count = (used.get(base) || 0) + 1;
        used.set(base, count);
        return {
          id:    count === 1 ? base : `${base}-${count}`,
          text:  rawText,
          level: el.type.startsWith("h2") ? "h2" : el.type.startsWith("h3") ? "h3" : el.type.startsWith("h4") ? "h4" : el.type.startsWith("h5") ? "h5" : "h6",
        };
      });
  }, [elements]);

  const addElement = useCallback((type) => {
    const el = createElement(type);
    setElements((prev) => {
      const next = [...prev];
      if (insertAfterIdx === -1) return [el, ...next];
      if (insertAfterIdx !== null) { next.splice(insertAfterIdx + 1, 0, el); return next; }
      return [...next, el];
    });
    setSelectedId(el.id);
    setShowAddMenu(false);
    setInsertAfterIdx(null);
  }, [insertAfterIdx]);

  const updateEl = useCallback(
    (id, patch) => setElements((p) => p.map((el) => el.id === id ? { ...el, ...patch } : el)), []);

  const deleteEl = useCallback((id) => {
    setElements((p) => p.filter((el) => el.id !== id));
    setSelectedId(null);
  }, []);

  const moveEl = useCallback((id, dir) => {
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const addListItem = (id) => updateEl(id, { text: [...(elements.find((e) => e.id === id)?.text || []), "New item"] });
  const updateItem  = (id, idx, val) => updateEl(id, { text: elements.find((e) => e.id === id).text.map((t, i) => i === idx ? val : t) });
  const deleteItem  = (id, idx) => updateEl(id, { text: elements.find((e) => e.id === id).text.filter((_, i) => i !== idx) });

  const [heroUploading, setHeroUploading]       = useState(false);
  const [contentUploading, setContentUploading] = useState(null);

  const handleHeroUpload = async (file) => {
    if (!file) return;
    setHeroUploading(true);
    try {
      const url = await compressAndUpload(file, { maxW: 1400, quality: 0.82 });
      setMeta((p) => ({ ...p, heroImage: url }));
    } catch (e) { alert("Hero image upload failed: " + e.message); }
    finally { setHeroUploading(false); }
  };

  const handleContentImageUpload = async (id, file) => {
    if (!file) return;
    setContentUploading(id);
    try {
      const url = await compressAndUpload(file, { maxW: 1200, quality: 0.80 });
      updateEl(id, { src: url });
    } catch (e) { alert("Image upload failed: " + e.message); }
    finally { setContentUploading(null); }
  };

  const exportBlogData = () => {
    const sections = toSections(elements);
    const title    = meta.headline || meta.title;
    const slug     = meta.slug || slugify(title) || `blog-${Date.now()}`;
    const tagsArr  = meta.tags ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    return {
      id:          isEditMode ? editingBlog.id : Date.now(),
      slug,
      category:    meta.category,
      title:       meta.title || title,
      headline:    title,
      description: meta.description,
      date:        meta.date,
      Keywords:    meta.keywords,
      author:      meta.author,
      image:       meta.heroImage,
      heroImage:   meta.heroImage,
      coverImage:  meta.heroImage,
      imageAlt:    meta.imageAlt || title,
      tags:        tagsArr,
      sections,
    };
  };

  const downloadJSON = () => {
    const d = exportBlogData();
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `blog-${d.slug}.json`,
    });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const GH_TOKEN  = import.meta.env.VITE_GH_TOKEN;
  const GH_REPO   = import.meta.env.VITE_GH_REPO || "rathnabhoomidevelopers-art/skyup-digital";
  const GH_BRANCH = import.meta.env.VITE_GH_BRANCH || "main";
  const GH_FILE   = "src/data/blogs.js";

  const publishBlog = async () => {
    if (!meta.headline && !meta.title) {
      alert("Please add a headline first (open ⚙ Settings)."); setShowSettings(true); return;
    }
    if (elements.length === 0) { alert("Please add at least one content block."); return; }
    setPublishStatus("loading");
    setPublishMsg("Fetching blogs.js from GitHub…");
    try {
      const fileRes = await fetch(
        `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}?ref=${GH_BRANCH}`,
        { headers: { Authorization: `token ${GH_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
      );
      if (!fileRes.ok) throw new Error(`GitHub fetch failed: ${fileRes.status} ${fileRes.statusText}`);
      const fileData = await fileRes.json();
      const sha = fileData.sha;
      const binary = atob(fileData.content.replace(/\n/g, ""));
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
      const currentContent = new TextDecoder("utf-8").decode(bytes);
      const stripped = currentContent
        .replace(/^[\s\S]*?export\s+const\s+BLOGS\s*=\s*/, "")
        .replace(/;?\s*$/, "")
        .trim();
      // eslint-disable-next-line no-new-func
      const blogsArray = new Function(`return ${stripped}`)();
      const nextId = Math.max(0, ...blogsArray.map(b => Number(b.id) || 0)) + 1;
      const blogData = exportBlogData();
      let newBlogsArray;
      if (isEditMode) {
        setPublishMsg("Updating existing blog entry…");
        const idx = blogsArray.findIndex(b => String(b.id) === String(editingBlog.id));
        if (idx === -1) throw new Error(`Could not find blog with id ${editingBlog.id} in blogs.js`);
        newBlogsArray = [...blogsArray];
        newBlogsArray[idx] = { ...blogData, id: editingBlog.id };
      } else {
        setPublishMsg("Inserting new blog entry…");
        newBlogsArray = [{ ...blogData, id: nextId }, ...blogsArray];
      }
     function toJsValue(val, indent = 0) {
  const pad = "  ".repeat(indent);
  const pad1 = "  ".repeat(indent + 1);

  if (val === null || val === undefined) return "null";
  if (typeof val === "boolean" || typeof val === "number") return String(val);
  if (typeof val === "string") return JSON.stringify(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    // Flat arrays of primitives stay on one line
    const allPrim = val.every(v => typeof v !== "object" || v === null);
    if (allPrim) return `[${val.map(v => toJsValue(v, 0)).join(", ")}]`;
    const items = val.map(v => `${pad1}${toJsValue(v, indent + 1)}`).join(",\n");
    return `[\n${items}\n${pad}]`;
  }

  if (typeof val === "object") {
    const keys = Object.keys(val);
    if (keys.length === 0) return "{}";
    const entries = keys.map(k => {
      const safe = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
      return `${pad1}${safe}: ${toJsValue(val[k], indent + 1)}`;
    });
    return `{\n${entries.join(",\n")}\n${pad}}`;
  }

  return JSON.stringify(val);
}

const entriesStr = newBlogsArray
  .map(b => `  ${toJsValue(b, 1)}`)
  .join(",\n");
const newContent = `export const BLOGS = [\n${entriesStr}\n];\n`;
      setPublishMsg("Committing to GitHub…");
      const commitMessage = isEditMode ? `update blog: ${blogData.slug}` : `add blog: ${blogData.slug}`;
      const putRes = await fetch(
        `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${GH_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: commitMessage,
            content: btoa(unescape(encodeURIComponent(newContent))),
            sha,
            branch: GH_BRANCH,
          }),
        }
      );
      if (!putRes.ok) {
        const err = await putRes.json();
        throw new Error(err.message || `Commit failed: ${putRes.status}`);
      }
      setPublishStatus("success");
      setPublishMsg(isEditMode
        ? `✅ Blog updated on GitHub! Deployment will trigger shortly.`
        : `✅ Blog published to GitHub! Deployment will trigger shortly.`
      );
    } catch (e) {
      setPublishStatus("error");
      setPublishMsg(e.message || "Unknown error occurred.");
    }
  };

  const progress = [
    { label: "Headline",    done: !!(meta.headline || meta.title) },
    { label: "Hero image",  done: !!meta.heroImage },
    { label: "Slug",        done: !!meta.slug },
    { label: `${elements.length} block${elements.length !== 1 ? "s" : ""}`, done: elements.length > 0 },
    { label: "Description", done: !!meta.description },
  ];

  // ── Parts editor ─────────────────────────────────────────────────────────
  const PartsEditor = ({ parts, onChange, label = "Parts" }) => (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {(parts || []).map((part, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={part.text}
              className="flex-1"
              placeholder="Text…"
              onChange={(e) => onChange(parts.map((p, pi) => pi === i ? { ...p, text: e.target.value } : p))}
            />
            <button
              onClick={() => onChange(parts.map((p, pi) => pi === i ? { ...p, bold: !p.bold } : p))}
              title={part.bold ? "Click to unbold" : "Click to bold"}
              className={`shrink-0 px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                part.bold
                  ? "bg-[#0057FF] text-white border-[#0057FF]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-[#0057FF] hover:text-[#0057FF]"
              }`}
            >B</button>
            <button
              onClick={() => onChange(parts.filter((_, pi) => pi !== i))}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded border border-red-100 text-red-400 hover:bg-red-50 transition-all"
            ><X size={10} /></button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...(parts || []), { text: "New text", bold: false }])}
        className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs hover:border-[#0057FF] hover:text-[#0057FF] transition-all"
      ><Plus size={11} /> Add part</button>
    </div>
  );

  // ── Heading-with-link editor (reusable) ───────────────────────────────────
  const HeadingWithLinkEditor = ({ el, tag }) => (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg leading-snug">
        <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Preview</span>
        {React.createElement(tag, {
          className: `${HEADING_SIZE[tag]} ${el.fontWeight || FW_DEFAULT_HEADING} text-[#0A0F1E]`
        }, [
          el.textBefore ? <span key="b">{el.textBefore.trimEnd()}{" "}</span> : null,
          <span key="l" className="text-[#0057FF] underline underline-offset-1">{el.linkText || "Link text"}</span>,
          el.textAfter ? <span key="a">{" "}{el.textAfter.trimStart()}</span> : null,
        ])}
      </div>
      <FontWeightPicker value={el.fontWeight || FW_DEFAULT_HEADING} onChange={(fw) => updateEl(el.id, { fontWeight: fw })} />
      <div>
        <Label>Text before link <span className="text-slate-300">(optional)</span></Label>
        <Input value={el.textBefore || ""} placeholder="e.g. Learn about" onChange={(e) => updateEl(el.id, { textBefore: e.target.value })} />
      </div>
      <div>
        <Label>Link text (the clickable part)</Label>
        <Input value={el.linkText || ""} placeholder="e.g. Digital Marketing" onChange={(e) => updateEl(el.id, { linkText: e.target.value })} />
      </div>
      <div>
        <Label>URL</Label>
        <Input value={el.href || ""} placeholder="https://…" onChange={(e) => updateEl(el.id, { href: e.target.value })} />
      </div>
      <div>
        <Label>Text after link <span className="text-slate-300">(optional)</span></Label>
        <Input value={el.textAfter || ""} placeholder="e.g. for your business" onChange={(e) => updateEl(el.id, { textAfter: e.target.value })} />
      </div>
    </div>
  );

  // ── Builder element renderer ──────────────────────────────────────────────
  const renderBuilder = (el, idx) => {
    const isSelected = selectedId === el.id;
    const ring = `cursor-pointer rounded-lg transition-all outline-none ${
      isSelected
        ? "ring-2 ring-[#0057FF] ring-offset-2"
        : "hover:ring-2 hover:ring-[#00C2FF] hover:ring-offset-1"}`;
    const pick = (e) => { e.stopPropagation(); setSelectedId(el.id); };
    const fw = el.fontWeight || FW_DEFAULT_HEADING;

    const InsertZone = ({ after }) => {
      const key = after ? idx : idx - 0.5;
      return (
        <div onMouseEnter={() => setHoveredInsert(key)} onMouseLeave={() => setHoveredInsert(null)}>
          <button
            className={`w-full flex items-center gap-2 py-1 text-[11px] font-semibold text-[#0057FF] transition-opacity
              ${hoveredInsert === key ? "opacity-100" : "opacity-0"}`}
            onClick={(e) => { e.stopPropagation(); setInsertAfterIdx(after ? idx : idx - 1); setShowAddMenu(true); }}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0057FF60] to-transparent" />
            <Plus size={11} /> Insert here
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0057FF60] to-transparent" />
          </button>
        </div>
      );
    };

    // Generic heading builder
    const buildHeading = (tag, sizeClass) =>
      React.createElement(tag, {
        className: `${sizeClass} ${fw} text-[#0A0F1E] ${ring}`,
        onClick: pick,
        contentEditable: true,
        suppressContentEditableWarning: true,
        onBlur: (e) => updateEl(el.id, { text: e.currentTarget.innerText }),
      }, el.text);

    const buildHeadingWithLink = (tag, sizeClass) => (
      React.createElement(tag, { className: `${sizeClass} ${fw} ${ring}`, onClick: pick }, [
        el.textBefore && <span key="b" className="text-[#0A0F1E]">{el.textBefore.trimEnd()}{" "}</span>,
        <span key="l" className="text-[#0057FF] underline underline-offset-2 decoration-[#0057FF]/40">{el.linkText || `${tag.toUpperCase()} Link`}</span>,
        el.textAfter && <span key="a" className="text-[#0A0F1E]">{" "}{el.textAfter.trimStart()}</span>,
      ])
    );

    let content;

    if (el.type === "h2") content = buildHeading("h2", HEADING_SIZE.h2);
    else if (el.type === "h3") content = buildHeading("h3", HEADING_SIZE.h3);
    else if (el.type === "h4") content = buildHeading("h4", HEADING_SIZE.h4);
    else if (el.type === "h5") content = buildHeading("h5", HEADING_SIZE.h5);
    else if (el.type === "h6") content = buildHeading("h6", HEADING_SIZE.h6);
    else if (el.type === "h2_with_link") content = buildHeadingWithLink("h2", HEADING_SIZE.h2);
    else if (el.type === "h3_with_link") content = buildHeadingWithLink("h3", HEADING_SIZE.h3);
    else if (el.type === "h4_with_link") content = buildHeadingWithLink("h4", HEADING_SIZE.h4);
    else if (el.type === "h5_with_link") content = buildHeadingWithLink("h5", HEADING_SIZE.h5);
    else if (el.type === "h6_with_link") content = buildHeadingWithLink("h6", HEADING_SIZE.h6);

    else if (el.type === "quote")
      content = (
        <div className={`rounded-xl border border-[#B8D4FF] bg-[#EFF6FF] px-4 py-4 ${ring}`} onClick={pick}>
          <div className="border-l-4 border-[#0057FF] pl-3 italic text-[13px] text-slate-700 leading-relaxed"
            contentEditable suppressContentEditableWarning
            onBlur={(e) => updateEl(el.id, { text: e.currentTarget.innerText })}>{el.text}</div>
        </div>
      );

    else if (el.type === "image")
      content = (
        <figure className={`rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 ${ring}`} onClick={pick}>
          {el.src
            ? <img src={el.src} alt={el.caption || ""} className="w-full h-auto" />
            : <div className="w-full h-40 flex flex-col items-center justify-center text-slate-400 gap-2">
                <ImageIcon size={24} className="opacity-40" />
                <p className="text-sm">Select block → upload image in panel</p>
              </div>
          }
          {el.caption && <figcaption className="px-4 py-3 text-[12px] text-slate-500">{el.caption}</figcaption>}
        </figure>
      );

    else if (el.type === "table")
      content = (
        <div className={`overflow-x-auto rounded-xl border border-slate-200 ${ring}`} onClick={pick}>
          <table className="w-full text-[13px] sm:text-[14px] text-slate-700 border-collapse">
            <thead>
              <tr>
                {(el.headers || []).map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-bold border border-slate-200 text-[#0A0F1E]"
                    style={{ background: el.themed ? "#DBEAFE" : "#ffffff" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(el.rows || []).map((row, ri) => (
                <tr key={ri} style={{ background: el.themed ? (ri % 2 === 0 ? "#EFF6FF" : "#DBEAFE") : "#ffffff" }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 border border-slate-200">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    else if (el.type === "ul" || el.type === "ol") {
      const Tag = el.type;
      const cls = el.type === "ul" ? "list-disc" : "list-decimal";
      content = (
        <Tag className={`${cls} list-outside pl-5 space-y-1 text-[13px] sm:text-[14px] text-slate-600 ${ring}`} onClick={pick}>
          {(el.text || []).map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
        </Tag>
      );
    }

    else if (el.type === "p_with_link")
      content = (
        <p className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${el.fontWeight || FW_DEFAULT_PARA} ${ring}`} onClick={pick}>
          {el.textBefore ? el.textBefore.trimEnd() + " " : ""}
          <span className="text-[#0057FF] underline underline-offset-2">{el.linkText || "link"}</span>
          {el.textAfter ? " " + el.textAfter.trimStart() : ""}
        </p>
      );

    else if (el.type === "p_with_bold")
      content = (
        <p className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${el.fontWeight || FW_DEFAULT_PARA} ${ring}`} onClick={pick}>
          <RenderParts parts={el.parts} />
        </p>
      );

    else if (el.type === "p_with_link_bold")
      content = (
        <p className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${el.fontWeight || FW_DEFAULT_PARA} ${ring}`} onClick={pick}>
          <RenderParts parts={el.partsBefore} />
          {" "}
          <span className="text-[#0057FF] font-semibold underline underline-offset-2">{el.linkText || "link"}</span>
          {" "}
          <RenderParts parts={el.partsAfter} />
        </p>
      );

    else
      content = (
        <div className="space-y-1">
          {selectedId === el.id && (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg w-fit"
              onMouseDown={(e) => e.preventDefault()}>
              <button title="Bold selected text"
                onMouseDown={(e) => { e.preventDefault(); document.execCommand("bold"); }}
                className="px-2 py-0.5 rounded text-xs font-bold text-slate-600 hover:bg-[#EFF6FF] hover:text-[#0057FF] transition-all border border-transparent hover:border-[#0057FF]/20"
              ><strong>B</strong></button>
              <button title="Remove bold"
                onMouseDown={(e) => { e.preventDefault(); document.execCommand("removeFormat"); }}
                className="px-2 py-0.5 rounded text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent"
              >✕ bold</button>
            </div>
          )}
          <p
            className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${el.fontWeight || FW_DEFAULT_PARA} ${ring}`}
            onClick={pick}
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: el.text }}
            onBlur={(e) => updateEl(el.id, { text: e.currentTarget.innerHTML })}
          />
        </div>
      );

    return (
      <React.Fragment key={el.id}>
        {idx === 0 && <InsertZone after={false} />}
        <div onClick={(e) => e.stopPropagation()}>{content}</div>
        <InsertZone after={true} />
      </React.Fragment>
    );
  };

  // ── Element editor (right panel) ──────────────────────────────────────────
  const renderEditor = () => {
    if (!selectedEl)
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <Type size={32} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {elements.length > 0 ? "Click a block to edit it" : "Add a content block to start"}
          </p>
        </div>
      );

    const el = selectedEl;
    const isHeadingWithLink = ["h2_with_link","h3_with_link","h4_with_link","h5_with_link","h6_with_link"].includes(el.type);
    const isPlainHeading    = ["h2","h3","h4","h5","h6"].includes(el.type);
    const isPara            = ["p","p_with_link","p_with_bold","p_with_link_bold"].includes(el.type);
    const headingTag        = isPlainHeading ? el.type : isHeadingWithLink ? el.type.replace("_with_link","") : null;

    return (
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 panel-scroll">
        {/* Block header */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase"
            style={{ background: "#EFF6FF", color: "#0057FF" }}>{el.type}</span>
          <div className="flex gap-1.5">
            <button onClick={() => moveEl(el.id, -1)} title="Move up"
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-[#0057FF] hover:text-[#0057FF] flex items-center justify-center text-xs transition-all">↑</button>
            <button onClick={() => moveEl(el.id, 1)} title="Move down"
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-[#0057FF] hover:text-[#0057FF] flex items-center justify-center text-xs transition-all">↓</button>
            <button onClick={() => deleteEl(el.id)}
              className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* ── Plain headings h2–h6 ── */}
        {isPlainHeading && (
          <div className="space-y-3">
            <div>
              <Label>Content</Label>
              <Textarea value={el.text} rows={2}
                onChange={(e) => updateEl(el.id, { text: e.target.value })}
                placeholder="Type your heading…" />
            </div>
            <FontWeightPicker value={el.fontWeight || FW_DEFAULT_HEADING} onChange={(fw) => updateEl(el.id, { fontWeight: fw })} />
          </div>
        )}

        {/* ── Heading with link h2–h6 ── */}
        {isHeadingWithLink && <HeadingWithLinkEditor el={el} tag={headingTag} />}

        {/* ── plain paragraph ── */}
        {el.type === "p" && (
          <div className="space-y-3">
            <div>
              <Label>Content</Label>
              <Textarea
                value={el.text
                  .replace(/<strong>/gi, "**")
                  .replace(/<\/strong>/gi, "**")
                  .replace(/<[^>]+>/g, "")}
                rows={4}
                onChange={(e) => {
                  const html = e.target.value.replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>");
                  updateEl(el.id, { text: html });
                }}
                placeholder="Type content… Use **word** to bold"
              />
              <p className="text-[10px] text-slate-400 leading-snug mt-1">
                Wrap in <code className="bg-slate-100 px-1 rounded">**double asterisks**</code> to <strong>bold</strong>.
              </p>
            </div>
            <FontWeightPicker value={el.fontWeight || FW_DEFAULT_PARA} onChange={(fw) => updateEl(el.id, { fontWeight: fw })} />
          </div>
        )}

        {/* ── quote ── */}
        {el.type === "quote" && (
          <div>
            <Label>Content</Label>
            <Textarea value={el.text} rows={3}
              onChange={(e) => updateEl(el.id, { text: e.target.value })}
              placeholder="Type your quote…" />
          </div>
        )}

        {/* ── p_with_link ── */}
        {el.type === "p_with_link" && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Preview</span>
              <span className={el.fontWeight || FW_DEFAULT_PARA}>
                {el.textBefore ? el.textBefore.trimEnd() + " " : ""}
                <span className="text-[#0057FF] underline">{el.linkText}</span>
                {el.textAfter ? " " + el.textAfter.trimStart() : ""}
              </span>
            </div>
            <FontWeightPicker value={el.fontWeight || FW_DEFAULT_PARA} onChange={(fw) => updateEl(el.id, { fontWeight: fw })} />
            <div>
              <Label>Text before link</Label>
              <Input value={(el.textBefore || "").replace(/<strong>/gi,"**").replace(/<\/strong>/gi,"**").replace(/<[^>]+>/g,"")}
                placeholder="e.g. Learn more about"
                onChange={(e) => updateEl(el.id, { textBefore: e.target.value.replace(/\*\*(.+?)\*\*/gs,"<strong>$1</strong>") })} />
            </div>
            <div><Label>Link text</Label>
              <Input value={el.linkText || ""} onChange={(e) => updateEl(el.id, { linkText: e.target.value })} />
            </div>
            <div><Label>URL</Label>
              <Input value={el.href || ""} placeholder="https://…" onChange={(e) => updateEl(el.id, { href: e.target.value })} />
            </div>
            <div>
              <Label>Text after link</Label>
              <Input value={(el.textAfter || "").replace(/<strong>/gi,"**").replace(/<\/strong>/gi,"**").replace(/<[^>]+>/g,"")}
                placeholder="e.g. to grow your business."
                onChange={(e) => updateEl(el.id, { textAfter: e.target.value.replace(/\*\*(.+?)\*\*/gs,"<strong>$1</strong>") })} />
            </div>
          </div>
        )}

        {/* ── p_with_bold ── */}
        {el.type === "p_with_bold" && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800 leading-relaxed">
              Preview:{" "}
              <span className={el.fontWeight || FW_DEFAULT_PARA}>
                {(el.parts || []).map((part, i) =>
                  part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>
                )}
              </span>
            </div>
            <FontWeightPicker value={el.fontWeight || FW_DEFAULT_PARA} onChange={(fw) => updateEl(el.id, { fontWeight: fw })} />
            <PartsEditor parts={el.parts} label="Parts (toggle B to bold each segment)"
              onChange={(newParts) => updateEl(el.id, { parts: newParts })} />
          </div>
        )}

        {/* ── p_with_link_bold ── */}
        {el.type === "p_with_link_bold" && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800 leading-relaxed">
              Preview:{" "}
              <span className={el.fontWeight || FW_DEFAULT_PARA}>
                {(el.partsBefore || []).map((part, i) =>
                  part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>
                )}
                {" "}
                <span className="text-[#0057FF] font-semibold underline">{el.linkText}</span>
                {" "}
                {(el.partsAfter || []).map((part, i) =>
                  part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>
                )}
              </span>
            </div>
            <FontWeightPicker value={el.fontWeight || FW_DEFAULT_PARA} onChange={(fw) => updateEl(el.id, { fontWeight: fw })} />
            <PartsEditor parts={el.partsBefore} label="Parts before link"
              onChange={(newParts) => updateEl(el.id, { partsBefore: newParts })} />
            <div><Label>Link text</Label>
              <Input value={el.linkText || ""} onChange={(e) => updateEl(el.id, { linkText: e.target.value })} />
            </div>
            <div><Label>URL</Label>
              <Input value={el.href || ""} placeholder="https://…" onChange={(e) => updateEl(el.id, { href: e.target.value })} />
            </div>
            <PartsEditor parts={el.partsAfter} label="Parts after link"
              onChange={(newParts) => updateEl(el.id, { partsAfter: newParts })} />
          </div>
        )}

        {/* ── image ── */}
        {el.type === "image" && (
          <div className="space-y-3">
            <div>
              <Label>Upload image</Label>
              <input type="file" accept="image/*" disabled={contentUploading === el.id}
                onChange={(e) => handleContentImageUpload(el.id, e.target.files[0])} />
              {contentUploading === el.id && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#0057FF] font-semibold">
                  <Loader size={12} className="animate-spin" /> Compressing &amp; uploading to Cloudinary…
                </div>
              )}
              {contentUploading !== el.id && el.src && (
                <img src={el.src} alt="" className="mt-2 w-full h-28 object-cover rounded-lg border border-slate-100" />
              )}
            </div>
            <div><Label>Caption / alt text</Label>
              <Input value={el.caption || ""} placeholder="Describe the image for SEO…"
                onChange={(e) => updateEl(el.id, { caption: e.target.value })} />
            </div>
          </div>
        )}

        {/* ── table ── */}
        {el.type === "table" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
              <div>
                <div className="text-[12px] font-semibold text-slate-700">Themed style</div>
                <div className="text-[10px] text-slate-400">Blue-tinted header rows</div>
              </div>
              <button onClick={() => updateEl(el.id, { themed: !el.themed })}
                className={`relative w-10 h-5 rounded-full transition-all ${el.themed ? "bg-[#0057FF]" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${el.themed ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Column Headers</Label>
                <button onClick={() => updateEl(el.id, { headers: [...(el.headers || []), "New Column"], rows: (el.rows || []).map(r => [...r, ""]) })}
                  className="text-[10px] text-[#0057FF] font-semibold flex items-center gap-0.5 hover:opacity-70">
                  <Plus size={10} /> Col
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(el.headers || []).map((h, hi) => (
                  <div key={hi} className="flex gap-1 items-center flex-1 min-w-[80px]">
                    <Input value={h} placeholder={`Col ${hi + 1}`}
                      onChange={(e) => updateEl(el.id, { headers: el.headers.map((hh, i) => i === hi ? e.target.value : hh) })} />
                    {(el.headers || []).length > 1 && (
                      <button onClick={() => updateEl(el.id, {
                        headers: el.headers.filter((_, i) => i !== hi),
                        rows: (el.rows || []).map(r => r.filter((_, i) => i !== hi))
                      })} className="shrink-0 w-5 h-5 flex items-center justify-center rounded border border-red-100 text-red-400 hover:bg-red-50">
                        <X size={9} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Rows</Label>
                <button onClick={() => updateEl(el.id, { rows: [...(el.rows || []), (el.headers || []).map(() => "")] })}
                  className="text-[10px] text-[#0057FF] font-semibold flex items-center gap-0.5 hover:opacity-70">
                  <Plus size={10} /> Row
                </button>
              </div>
              <div className="space-y-2">
                {(el.rows || []).map((row, ri) => (
                  <div key={ri} className="flex gap-1 items-center">
                    <span className="text-[10px] text-slate-400 w-4 shrink-0 text-right">{ri + 1}</span>
                    {row.map((cell, ci) => (
                      <Input key={ci} value={cell} placeholder={el.headers?.[ci] || `Col ${ci + 1}`}
                        className="flex-1 min-w-0"
                        onChange={(e) => updateEl(el.id, { rows: el.rows.map((r, i) => i === ri ? r.map((c, j) => j === ci ? e.target.value : c) : r) })} />
                    ))}
                    <button onClick={() => updateEl(el.id, { rows: el.rows.filter((_, i) => i !== ri) })}
                      className="shrink-0 w-6 h-6 flex items-center justify-center rounded border border-red-100 text-red-400 hover:bg-red-50">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ul / ol ── */}
        {(el.type === "ul" || el.type === "ol") && (
          <div>
            <Label>List items</Label>
            <div className="space-y-1.5">
              {(el.text || []).map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-[11px] text-slate-400 w-4 text-right shrink-0">{idx + 1}.</span>
                  <Input value={item} onChange={(e) => updateItem(el.id, idx, e.target.value)} />
                  <button onClick={() => deleteItem(el.id, idx)}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded border border-red-100 text-red-400 hover:bg-red-50 transition-all">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addListItem(el.id)}
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs hover:border-[#0057FF] hover:text-[#0057FF] transition-all">
              <Plus size={11} /> Add item
            </button>
          </div>
        )}
      </div>
    );
  };

  const displayTitle = meta.headline || meta.title;

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        .panel-scroll::-webkit-scrollbar { width: 3px; }
        .panel-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        input[type="file"] {
          font-size: 12px; color: #64748b; border: 1.5px dashed #cbd5e1;
          border-radius: 8px; padding: 8px 12px; width: 100%; background: #f8fafc;
          cursor: pointer; transition: border-color .2s;
        }
        input[type="file"]:hover { border-color: #0057FF; }
        [contenteditable]:focus { outline: none; }
        .btn-publish {
          background: linear-gradient(135deg, #0057FF 0%, #00C2FF 100%);
          color: #fff; border: none; padding: 11px 20px; border-radius: 10px;
          font-weight: 700; font-size: 13px; cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .25s; box-shadow: 0 4px 14px rgba(0,87,255,.3);
          font-family: 'DM Sans', sans-serif;
        }
        .btn-publish:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,87,255,.45); }
        .btn-publish:disabled { opacity: .55; cursor: not-allowed; }
        .btn-ghost {
          background: white; color: #374151; border: 1.5px solid #e2e8f0;
          padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .2s; font-family: 'DM Sans', sans-serif; flex: 1;
        }
        .btn-ghost:hover { border-color: #0057FF; color: #0057FF; background: #EFF6FF; }
        .chip {
          background: white; border: 1.5px solid #e2e8f0; color: #475569;
          padding: 8px 6px; border-radius: 8px; font-size: 11px; font-weight: 600;
          cursor: pointer; display: flex; flex-direction: column; align-items: center;
          gap: 3px; transition: all .2s; text-align: center;
        }
        .chip:hover { border-color: #0057FF; color: #0057FF; background: #EFF6FF; }
        .preview-topbar {
          background: linear-gradient(90deg, #0057FF, #00C2FF); padding: 12px 24px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50; box-shadow: 0 2px 12px rgba(0,87,255,.3);
        }
      `}</style>

      <div className={`grid min-h-screen ${previewMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[360px_1fr]"}`}>

        {/* ─── LEFT PANEL ──────────────────────────────────── */}
        {!previewMode && (
          <div className="bg-white border-r border-slate-200 flex flex-col panel-scroll overflow-y-auto shadow-sm"
            style={{ maxHeight: "100vh", position: "sticky", top: 0 }}>

            {/* Panel header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={onBack} title="Back to picker"
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#0057FF] hover:text-[#0057FF] transition-all">
                    <ArrowLeft size={14} />
                  </button>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#0057FF,#00C2FF)" }}>
                    {isEditMode ? <Edit3 size={14} className="text-white" /> : <Zap size={14} className="text-white" />}
                  </div>
                  <div>
                    <h1 className="text-[14px] font-bold text-slate-800 leading-none"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {isEditMode ? "Edit Blog" : "New Blog"}
                    </h1>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-none truncate max-w-[140px]">
                      {isEditMode ? editingBlog.slug : "SkyUp Digital Solutions"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPreviewMode(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-[#EFF6FF] transition-all">
                    <Eye size={12} /> Preview
                  </button>
                  <button onClick={() => setShowSettings((v) => !v)}
                    className={`p-1.5 rounded-lg border text-xs transition-all ${showSettings ? "bg-[#EFF6FF] border-[#0057FF] text-[#0057FF]" : "border-slate-200 text-slate-500 hover:border-[#0057FF]"}`}>
                    <Settings size={14} />
                  </button>
                </div>
              </div>

              {isEditMode && (
                <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "#EFF6FF", color: "#0057FF", border: "1px solid #BFDBFE" }}>
                  <Edit3 size={11} /> Editing — changes will update the existing blog
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-3">
                {progress.map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${done ? "bg-[#0057FF]" : "bg-slate-200"}`} />
                    <span className="text-[10px] text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <div className="border-b border-slate-100 bg-slate-50/60">
                <div className="px-5 py-4 space-y-3">
                  <SectionDivider>SEO & Meta</SectionDivider>
                  <div>
                    <Label>Page title ({"<title>"} tag)</Label>
                    <Input value={meta.title} placeholder="Top Digital Marketing Tips in Bangalore"
                      onChange={(e) => setMeta((p) => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Meta description</Label>
                    <Textarea value={meta.description} rows={2} placeholder="Brief description for search results…"
                      onChange={(e) => setMeta((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Keywords</Label>
                      <Input value={meta.keywords} placeholder="SEO, digital marketing"
                        onChange={(e) => setMeta((p) => ({ ...p, keywords: e.target.value }))} /></div>
                    <div><Label>Tags (comma-separated)</Label>
                      <Input value={meta.tags} placeholder="SEO, PPC, Social"
                        onChange={(e) => setMeta((p) => ({ ...p, tags: e.target.value }))} /></div>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3 border-t border-slate-100">
                  <SectionDivider>Blog Details</SectionDivider>
                  <div>
                    <Label>Headline (H1 on page)</Label>
                    <Input value={meta.headline} placeholder="Your compelling headline…"
                      onChange={(e) => setMeta((p) => ({
                        ...p, headline: e.target.value,
                        slug: p.slug || slugify(e.target.value),
                      }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>URL Slug</Label>
                      <Input value={meta.slug} placeholder="my-blog-post"
                        onChange={(e) => setMeta((p) => ({ ...p, slug: slugify(e.target.value) }))} /></div>
                    <div><Label>Category</Label>
                      <Input value={meta.category}
                        onChange={(e) => setMeta((p) => ({ ...p, category: e.target.value }))} /></div>
                    <div><Label>Author</Label>
                      <Input value={meta.author}
                        onChange={(e) => setMeta((p) => ({ ...p, author: e.target.value }))} /></div>
                    <div><Label>Date</Label>
                      <Input value={meta.date}
                        onChange={(e) => setMeta((p) => ({ ...p, date: e.target.value }))} /></div>
                  </div>
                  <div>
                    <Label>Hero image</Label>
                    <input type="file" accept="image/*" disabled={heroUploading}
                      onChange={(e) => handleHeroUpload(e.target.files[0])} />
                    {heroUploading && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#0057FF] font-semibold">
                        <Loader size={12} className="animate-spin" /> Compressing &amp; uploading to Cloudinary…
                      </div>
                    )}
                    {!heroUploading && meta.heroImage && (
                      <div className="mt-2 relative">
                        <img src={meta.heroImage} alt="hero" className="w-full h-24 object-cover rounded-lg border border-slate-100" />
                        <button onClick={() => setMeta((p) => ({ ...p, heroImage: "" }))}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                      </div>
                    )}
                  </div>
                  <div><Label>Hero image alt text</Label>
                    <Input value={meta.imageAlt} placeholder="Digital marketing team Bangalore"
                      onChange={(e) => setMeta((p) => ({ ...p, imageAlt: e.target.value }))} /></div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 space-y-3">
                  <SectionDivider>Save & Publish</SectionDivider>
                  <button onClick={downloadJSON} className="btn-ghost w-full"><Upload size={12} /> Download JSON</button>
                  <button onClick={publishBlog} disabled={publishStatus === "loading"} className="btn-publish">
                    {publishStatus === "loading"
                      ? <><Loader size={14} className="animate-spin" /> {publishMsg || "Publishing…"}</>
                      : <><Send size={14} /> {isEditMode ? "Update Blog on GitHub" : "Publish to GitHub"}</>
                    }
                  </button>
                  {publishStatus === "success" && (
                    <div className="flex items-center gap-2 text-[#0057FF] bg-[#EFF6FF] border border-blue-200 rounded-lg px-3 py-2 text-xs font-medium">
                      <CheckCircle size={13} /> {publishMsg}
                    </div>
                  )}
                  {publishStatus === "error" && (
                    <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs font-medium">
                      <AlertCircle size={13} className="mt-0.5 shrink-0" /> {publishMsg}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">{user?.email}</span>
                    <button onClick={logout} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-red-500 transition-colors">
                      <LogOut size={10} /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add block */}
            <div className="px-5 py-4 border-b border-slate-100">
              <button onClick={() => { setShowAddMenu((v) => !v); setInsertAfterIdx(null); }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-semibold text-sm text-white hover:opacity-90 transition-all shadow-sm"
                style={{ background: "linear-gradient(135deg,#0057FF,#00C2FF)" }}>
                <span className="flex items-center gap-2"><Plus size={15} /> Add Content Block</span>
                {showAddMenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showAddMenu && (
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {ELEMENT_TYPES.map(({ type, icon: Icon, label }) => (
                    <button key={type} onClick={() => addElement(type)} className="chip">
                      <Icon size={13} /><span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {renderEditor()}
          </div>
        )}

        {/* ─── CANVAS / PREVIEW ────────────────────────────── */}
        <div className="bg-white overflow-y-auto" onClick={() => !previewMode && setSelectedId(null)}>
          {previewMode && (
            <div className="preview-topbar">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full animate-pulse bg-white" />
                <span className="text-white font-bold text-sm">
                  {isEditMode ? "Edit Preview" : "Live Preview"} — BlogDetail Layout
                </span>
              </div>
              <button onClick={() => setPreviewMode(false)}
                className="flex items-center gap-2 bg-white/15 border border-white/25 text-white px-4 py-1.5 rounded-lg hover:bg-white/25 transition-all text-xs font-semibold">
                <EyeOff size={13} /> Back to Editor
              </button>
            </div>
          )}

          <section className="w-full bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="relative">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex overflow-x-hidden">

                {/* Social sidebar */}
                <div className="hidden lg:block w-[80px] mr-6">
                  <div className="sticky top-64 flex flex-col gap-4">
                    {[
                      { Icon: Facebook,  hover: "hover:bg-[#1877F2]", href: "https://www.facebook.com/skyupdigitalsolutions" },
                      { Icon: Twitter,   hover: "hover:bg-[#1DA1F2]", href: "https://twitter.com/skyupdigital" },
                      { Icon: Instagram, hover: "hover:bg-[#E1306C]", href: "https://www.instagram.com/skyupdigitalsolutions" },
                      { Icon: Linkedin,  hover: "hover:bg-[#0077B5]", href: "https://www.linkedin.com/company/skyupdigitalsolutions" },
                    ].map(({ Icon, hover, href }, i) => (
                      <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-[#8A8A8A] ${hover} hover:text-white transition`}
                        style={{ background: "#EFF6FF" }}>
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Blog content */}
                <div className="flex-1 min-w-0 w-0 max-w-4xl">
                  <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-700 cursor-default">
                    <span className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center">
                      <ChevronLeft className="h-4 w-4" />
                    </span>
                    Back to Blog
                  </span>

                  <div className="mt-4">
                    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{ background: "#EFF6FF", color: "#0057FF" }}>
                      {meta.category || "Category"}
                    </span>
                  </div>

                  <h1 className="mt-3 text-[22px] sm:text-[28px] font-bold text-[#0A0F1E] leading-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {displayTitle || <span className="text-slate-300 italic font-normal text-xl">Your headline appears here…</span>}
                  </h1>

                  <div className="mt-2 text-[12px] text-slate-500 flex items-center gap-3">
                    <span>{meta.author}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{meta.date}</span>
                  </div>

                  <div className="mt-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
                    {meta.heroImage
                      ? <img src={meta.heroImage} alt={meta.imageAlt || displayTitle || "Blog hero"} className="w-full h-[210px] sm:h-full object-cover" />
                      : <div className="w-full h-[210px] flex flex-col items-center justify-center gap-2 text-slate-400">
                          <ImageIcon size={28} className="opacity-30" />
                          <p className="text-sm">Hero image — upload in ⚙ Settings</p>
                        </div>
                    }
                  </div>

                  <div className="mt-6 space-y-5">
                    {elements.length === 0
                      ? (
                        <div className="text-center py-20 text-slate-300">
                          <Type size={48} className="mx-auto mb-3 opacity-40" />
                          <p className="text-slate-400 text-base font-medium">No content blocks yet</p>
                          <p className="text-slate-300 text-sm mt-1">Add blocks using the panel on the left</p>
                        </div>
                      )
                      : previewMode
                        ? (() => {
                            const usedH3 = new Map();
                            return elements.map((el, i) => {
                              let s;
                              const fw = el.fontWeight;
                              if (el.type === "image") {
                                s = { type: "image", src: el.src, caption: el.caption };
                              } else if (el.type === "p_with_link") {
                                s = { type: "p_with_link", textBefore: el.textBefore, linkText: el.linkText, href: el.href, textAfter: el.textAfter, fontWeight: fw };
                              } else if (el.type === "p_with_bold") {
                                s = { type: "p_with_bold", parts: el.parts, fontWeight: fw };
                              } else if (el.type === "p_with_link_bold") {
                                s = { type: "p_with_link_bold", partsBefore: el.partsBefore, linkText: el.linkText, href: el.href, partsAfter: el.partsAfter, fontWeight: fw };
                              } else if (el.type === "table") {
                                s = { type: "table", headers: el.headers, rows: el.rows, themed: el.themed };
                              } else if (el.type === "ul" || el.type === "ol") {
                                s = { type: el.type, text: el.text };
                              } else {
                                s = { type: el.type, text: el.text, fontWeight: fw,
                                  ...(el.textBefore !== undefined && { textBefore: el.textBefore }),
                                  ...(el.linkText !== undefined && { linkText: el.linkText }),
                                  ...(el.href !== undefined && { href: el.href }),
                                  ...(el.textAfter !== undefined && { textAfter: el.textAfter }),
                                };
                              }
                              return <PreviewSection key={i} s={s} usedH3={usedH3} />;
                            });
                          })()
                        : elements.map((el, idx) => renderBuilder(el, idx))
                    }
                  </div>
                </div>

                {/* Table of Contents sidebar */}
                {toc.length > 0 && (
                  <aside className="hidden lg:block w-[260px] ml-8 flex-shrink-0">
                    <div className="sticky top-10">
                      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
                        <div className="px-5 pt-5 pb-3">
                          <p className="text-[15px] font-extrabold text-[#0A0F1E] tracking-wide uppercase">
                            Table of Contents
                          </p>
                        </div>
                        <div className="px-3 pb-2 max-h-[320px] overflow-y-auto"
                          style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
                          <style>{`
                            .toc-scroll::-webkit-scrollbar { width: 4px; }
                            .toc-scroll::-webkit-scrollbar-track { background: transparent; }
                            .toc-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                          `}</style>
                          <div className="toc-scroll space-y-0.5">
                            {toc.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setActiveTocId(t.id);
                                  const heading = document.getElementById(t.id);
                                  if (heading) heading.scrollIntoView({ behavior: "smooth", block: "start" });
                                }}
                                className={`w-full text-left rounded-lg px-3 py-2.5 text-[13px] leading-snug transition-all
                                  ${["h3","h4","h5","h6"].includes(t.level) ? "pl-5" : ""}
                                  ${["h4","h5","h6"].includes(t.level) ? "pl-7 text-[12px]" : ""}
                                  ${activeTocId === t.id
                                    ? "bg-[#EFF6FF] text-[#0057FF] font-semibold"
                                    : "text-slate-700 hover:bg-slate-50 hover:text-[#0057FF]"
                                  }`}
                              >
                                {t.text}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="px-5 py-3 border-t border-slate-100">
                          <p className="text-[11px] text-slate-400 italic">Tip: Click a heading to jump.</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                )}

              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function DynamicBlog() {
  const { isAuthenticated, loading } = useAuth();
  const [screen, setScreen]           = useState("picker");
  const [editingBlog, setEditingBlog] = useState(null);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader size={28} className="animate-spin" style={{ color: "#0057FF" }} />
          <span className="text-sm">Verifying session…</span>
        </div>
      </div>
    );

  if (!isAuthenticated) return <LoginScreen />;

  if (screen === "picker")
    return (
      <BlogPicker
        onSelect={(blog) => {
          setEditingBlog(blog);
          setScreen("editor");
        }}
      />
    );

  return (
    <BlogEditor
      editingBlog={editingBlog}
      onBack={() => { setScreen("picker"); setEditingBlog(null); }}
    />
  );
}
