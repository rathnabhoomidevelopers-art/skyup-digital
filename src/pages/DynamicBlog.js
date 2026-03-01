import React, { useState, useMemo } from "react";
import {
  Trash2, Plus, Image as ImageIcon, Link as LinkIcon,
  Type, Layout, List, Sparkles, Settings, Upload, Send,
  Facebook, Youtube, MessageCircle, Linkedin, ChevronLeft,
  Eye, EyeOff,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Head } from "vike-react/Head";

const API_BASE = "http://localhost:3500";

// Matches BlogDetail's slugify exactly
const slugify = (str = "") =>
  str.toLowerCase().trim()
    .replace(/[""''"'`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function DynamicBlog() {
  const [elements, setElements]               = useState([]);
  const [selectedId, setSelectedId]           = useState(null);
  const [showAddMenu, setShowAddMenu]         = useState(false);
  const [showMetaSettings, setShowMetaSettings] = useState(false);
  const [showLoginModal, setShowLoginModal]   = useState(false);
  const [publishStatus, setPublishStatus]     = useState(null);
  const [publishMsg, setPublishMsg]           = useState("");
  const [loginForm, setLoginForm]             = useState({ email: "", password: "" });
  const [loginError, setLoginError]           = useState("");
  const [previewMode, setPreviewMode]         = useState(false);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const [metaTags, setMetaTags] = useState({
    title: "My Blog Title",
    description: "My blog description",
    keywords: "",
    canonical: "",
  });

  const [blogMeta, setBlogMeta] = useState({
    headline: "",
    category: "Technology",
    author: "Admin",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    heroImage: "",
    imageAlt: "",
    slug: "",
  });

  // Build live TOC — mirrors BlogDetail logic exactly
  const toc = useMemo(() => {
    const used = new Map();
    return elements
      .filter((el) => el.type === "heading" && el.content)
      .map((el) => {
        const base  = slugify(el.content);
        const count = (used.get(base) || 0) + 1;
        used.set(base, count);
        return { id: count === 1 ? base : `${base}-${count}`, text: el.content };
      });
  }, [elements]);

  // ── Element CRUD ──────────────────────────────────────────────────────────
  const addElement = (type) => {
    const el = {
      id: Date.now(),
      type,
      content: type === "image" ? "" : "Edit this content",
      styles: {
        fontSize: "text-base", fontWeight: "font-normal", fontFamily: "",
        color: "text-gray-900", textTransform: "", fontStyle: "",
        textAlign: "text-left", textDecoration: "", gradient: "",
        layout: type === "div" ? "block" : "", gridCols: "", gap: "",
        flexDirection: "", justifyContent: "", alignItems: "",
        border: "", borderColor: "", rounded: "", shadow: "",
        padding: "", margin: "", width: "w-auto", height: "h-auto",
        listStyle: type === "ul" ? "list-disc" : type === "ol" ? "list-decimal" : "",
      },
      ...(type === "heading"  && { headingLevel: "h3" }),
      ...(type === "anchor"   && { href: "https://example.com" }),
      ...(type === "image"    && { src: "", alt: "", customWidth: "", customHeight: "", useCustomSize: false }),
      ...(type === "marquee"  && { speed: "normal", direction: "left" }),
      ...((type === "ul" || type === "ol") && { items: ["Item 1", "Item 2"] }),
      ...(type === "dl"       && { items: [{ term: "Term", definition: "Definition" }] }),
    };
    setElements((p) => [...p, el]);
    setShowAddMenu(false);
  };

  const updateElement = (id, updates) =>
    setElements((p) => p.map((el) => el.id === id ? { ...el, ...updates } : el));

  const updateStyles = (id, upd) =>
    setElements((p) => p.map((el) =>
      el.id === id ? { ...el, styles: { ...el.styles, ...upd } } : el));

  const deleteElement = (id) => {
    setElements((p) => p.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addListItem    = (id) =>
    setElements((p) => p.map((el) =>
      el.id === id ? { ...el, items: [...el.items, `Item ${el.items.length + 1}`] } : el));

  const updateListItem = (id, idx, val) =>
    setElements((p) => p.map((el) =>
      el.id === id ? { ...el, items: el.items.map((it, i) => i === idx ? val : it) } : el));

  const deleteListItem = (id, idx) =>
    setElements((p) => p.map((el) =>
      el.id === id ? { ...el, items: el.items.filter((_, i) => i !== idx) } : el));

  // ── Image helpers ─────────────────────────────────────────────────────────
  const handleImageUpload = (id, file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => updateElement(id, { src: e.target.result });
    r.readAsDataURL(file);
  };
  const handleHeroUpload = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => setBlogMeta((p) => ({ ...p, heroImage: e.target.result }));
    r.readAsDataURL(file);
  };

  // ── Export — format matches BlogDetail's BLOGS array exactly ──────────────
  const exportBlogData = () => {
    const sections = elements.map((el) => {
      if (el.type === "heading")
        return { type: el.headingLevel === "h2" ? "h2" : "h3", text: el.content };
      if (el.type === "paragraph")
        return { type: "p", text: el.content };
      if (el.type === "quote")
        return { type: "quote", text: el.content };
      if (el.type === "image")
        return { type: "image", src: el.src, caption: el.alt };
      if (el.type === "ul" || el.type === "ol")
        return { type: "ul", text: el.items };
      if (el.type === "anchor")
        return { type: "p_with_link", textBefore: "", linkText: el.content, href: el.href, textAfter: "" };
      return { type: "p", text: el.content };
    });

    const displayTitle = blogMeta.headline || metaTags.title;
    const slug = blogMeta.slug || metaTags.title.toLowerCase().replace(/\s+/g, "-");

    return {
      id: Date.now(),
      slug,
      headline: displayTitle,      // used as <h1> in BlogDetail
      title: metaTags.title,       // used in meta tags / listings
      description: metaTags.description,
      Keywords: metaTags.keywords,
      category: blogMeta.category,
      date: blogMeta.date,
      author: blogMeta.author,
      image: blogMeta.heroImage,
      heroImage: blogMeta.heroImage,
      imageAlt: blogMeta.imageAlt || displayTitle,
      sections,
    };
  };

  const downloadJSON = () => {
    const d = exportBlogData();
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `blog-${d.slug}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(exportBlogData(), null, 2));
    alert("Blog data copied to clipboard!");
  };

  // ── Auth / Publish ────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError("");
    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        setShowLoginModal(false);
        doPublish(data.token);
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (e) {
      setLoginError("Network error: " + e.message);
    }
  };

  const publishBlog = () => {
    const token = localStorage.getItem("authToken");
    if (!token) { setShowLoginModal(true); return; }
    doPublish(token);
  };

  const doPublish = async (token) => {
    setPublishStatus("loading"); setPublishMsg("");
    try {
      const res  = await fetch(`${API_BASE}/api/publish-blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blogData: exportBlogData() }),
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        // Token expired — clear it and re-show login
        localStorage.removeItem("authToken");
        setPublishStatus(null);
        setShowLoginModal(true);
        return;
      }
      setPublishStatus(res.ok ? "success" : "error");
      setPublishMsg(data.message || data.error || "Done");
    } catch (e) {
      setPublishStatus("error");
      setPublishMsg("Network error: " + e.message);
    }
  };

  // ── Render element — builder mode (editable + selection rings) ────────────
  const renderBuilderElement = (element) => {
    const { id, type, content, styles, headingLevel, href, src, alt, speed, direction, items } = element;

    const classNames = Object.entries(styles)
      .filter(([k, v]) => k !== "fontFamily" && Boolean(v))
      .map(([, v]) => v).join(" ");

    const inlineStyle = {};
    if (styles.fontFamily === "poppins")    inlineStyle.fontFamily = "'Poppins', sans-serif";
    else if (styles.fontFamily === "orbitron") inlineStyle.fontFamily = "'Orbitron', monospace";
    else if (styles.fontFamily === "courier")  inlineStyle.fontFamily = "'Courier Prime', monospace";

    const isSelected = selectedId === id;
    const ring = `transition-all cursor-pointer ${isSelected
      ? "ring-2 ring-[#0037CA] ring-offset-2"
      : "hover:ring-2 hover:ring-[#FA9F42] hover:ring-offset-2"}`;
    const pick = (e) => { e.stopPropagation(); setSelectedId(id); };

    switch (type) {
      case "paragraph":
        return (
          <p className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${classNames} ${ring}`}
            onClick={pick} style={inlineStyle}
            contentEditable suppressContentEditableWarning
            onBlur={(e) => updateElement(id, { content: e.target.innerHTML })}
            dangerouslySetInnerHTML={{ __html: content }} />
        );
      case "quote":
        return (
          <div className={`rounded-xl border border-[#E7E9F5] bg-[#F7F9FF] px-4 py-4 text-[13px] sm:text-[14px] text-slate-700 ${ring}`}
            onClick={pick} style={inlineStyle}>
            <div className="border-l-4 border-[#0B3BFF] pl-3 italic leading-relaxed"
              contentEditable suppressContentEditableWarning
              onBlur={(e) => updateElement(id, { content: e.target.innerText })}>
              {content}
            </div>
          </div>
        );
      case "heading": {
        const Tag = headingLevel || "h3";
        const hCls = Tag === "h2"
          ? `scroll-mt-28 text-[20px] sm:text-[24px] font-bold text-[#111827] ${classNames}`
          : `scroll-mt-28 text-[16px] sm:text-[18px] font-bold text-[#111827] ${classNames}`;
        return (
          <Tag className={`${hCls} ${ring}`} onClick={pick} style={inlineStyle}
            contentEditable suppressContentEditableWarning
            onBlur={(e) => updateElement(id, { content: e.target.innerText })}>
            {content}
          </Tag>
        );
      }
      case "anchor":
        return (
          <a className={`text-[#0B3BFF] font-semibold no-underline hover:opacity-90 block ${ring}`}
            href={href} target="_blank" rel="noopener noreferrer"
            onClick={pick} style={inlineStyle}
            contentEditable suppressContentEditableWarning
            onBlur={(e) => updateElement(id, { content: e.target.innerText })}>
            {content}
          </a>
        );
      case "div":
        return (
          <div className={`${classNames} ${ring}`} onClick={pick} style={inlineStyle}
            contentEditable suppressContentEditableWarning
            onBlur={(e) => updateElement(id, { content: e.target.innerText })}>
            {content}
          </div>
        );
      case "span":
        return (
          <span className={`${classNames} ${ring}`} onClick={pick} style={inlineStyle}
            contentEditable suppressContentEditableWarning
            onBlur={(e) => updateElement(id, { content: e.target.innerText })}>
            {content}
          </span>
        );
      case "image": {
        if (!src)
          return (
            <div className={`rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-400 ${ring}`}
              onClick={pick}>
              <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No image — select this element and upload</p>
            </div>
          );
        const imgStyle = { ...inlineStyle };
        if (element.useCustomSize) {
          if (element.customWidth)  imgStyle.width  = `${element.customWidth}px`;
          if (element.customHeight) imgStyle.height = `${element.customHeight}px`;
        }
        return (
          <figure className={`rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 ${ring}`}
            onClick={pick}>
            <img src={src} alt={alt} style={imgStyle}
              className={element.useCustomSize ? "" : "w-full h-auto"} />
            {alt && <figcaption className="px-4 py-3 text-[12px] text-slate-500">{alt}</figcaption>}
          </figure>
        );
      }
      case "marquee":
        return (
          <marquee className={`${classNames} ${ring}`}
            scrollamount={speed === "slow" ? 2 : speed === "fast" ? 10 : 6}
            direction={direction} onClick={pick} style={inlineStyle}>
            {content}
          </marquee>
        );
      case "ul":
      case "ol": {
        const Tag = type;
        return (
          <Tag className={`list-disc list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-800 ${ring}`}
            onClick={pick} style={inlineStyle}>
            {(items || []).map((it, i) => <li key={i} className="leading-relaxed">{it}</li>)}
          </Tag>
        );
      }
      case "dl":
        return (
          <dl className={`${classNames} ${ring}`} onClick={pick} style={inlineStyle}>
            {(items || []).map((it, i) => (
              <div key={i} className="mb-2">
                <dt className="font-bold">{it.term}</dt>
                <dd className="ml-4">{it.definition}</dd>
              </div>
            ))}
          </dl>
        );
      default: return null;
    }
  };

  // ── Render element — preview mode (read-only, matches BlogDetail renderer) ─
  const renderPreviewElement = (el, i) => {
    if (el.type === "heading") {
      const Tag = el.headingLevel || "h3";
      const cls = Tag === "h2"
        ? "scroll-mt-28 text-[20px] sm:text-[24px] font-bold text-[#111827]"
        : "scroll-mt-28 text-[16px] sm:text-[18px] font-bold text-[#111827]";
      return <Tag key={i} className={cls}>{el.content}</Tag>;
    }
    if (el.type === "quote")
      return (
        <div key={i} className="rounded-xl border border-[#E7E9F5] bg-[#F7F9FF] px-4 py-4 text-[13px] sm:text-[14px] text-slate-700">
          <div className="border-l-4 border-[#0B3BFF] pl-3 italic leading-relaxed">{el.content}</div>
        </div>
      );
    if (el.type === "image")
      return (
        <figure key={i} className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
          {el.src
            ? <img src={el.src} alt={el.alt || "Blog image"} className="w-full h-auto" />
            : <div className="w-full h-40 flex items-center justify-center text-slate-400 text-sm">No image uploaded</div>
          }
          {el.alt && <figcaption className="px-4 py-3 text-[12px] text-slate-500">{el.alt}</figcaption>}
        </figure>
      );
    if (el.type === "anchor")
      return (
        <p key={i} className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600">
          <a href={el.href} target="_blank" rel="noopener noreferrer"
            className="text-[#0B3BFF] font-semibold no-underline hover:opacity-90">
            {el.content}
          </a>
        </p>
      );
    if (el.type === "ul" || el.type === "ol") {
      const Tag = el.type;
      return (
        <Tag key={i} className="list-disc list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-800">
          {(el.items || []).map((it, j) => <li key={j} className="leading-relaxed">{it}</li>)}
        </Tag>
      );
    }
    if (el.type === "marquee")
      return <marquee key={i} scrollamount={6}>{el.content}</marquee>;
    // paragraph / div / span / dl / default
    return (
      <p key={i} className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: el.content }} />
    );
  };

  const displayTitle = blogMeta.headline || metaTags.title;

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      style={{ fontFamily: "'Courier Prime', monospace" }}>

      <Head>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        {metaTags.keywords  && <meta name="keywords"  content={metaTags.keywords} />}
        {metaTags.canonical && <link rel="canonical"  href={metaTags.canonical} />}
      </Head>

      <Header />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Courier+Prime:wght@400;700&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .glow-text { text-shadow: 0 0 10px rgba(0,255,255,.8), 0 0 20px rgba(0,255,255,.5); }
        .neon-btn {
          background:#0037CA; border:2px solid #0037CA; color:#fff;
          padding:.5rem 1.5rem; font-family:'Orbitron',monospace; font-weight:700;
          text-transform:uppercase; letter-spacing:2px; cursor:pointer; transition:all .3s;
        }
        .neon-btn:hover { background:#FA9F42; border-color:#FA9F42; color:#000; }
        .ctrl-input {
          background:rgba(0,0,0,.4); border:1px solid #00ffff; color:#00ffff;
          padding:.5rem; font-family:'Courier Prime',monospace; width:100%; transition:all .3s;
        }
        .ctrl-input:focus { outline:none; box-shadow:0 0 10px rgba(0,255,255,.5); background:rgba(0,0,0,.6); }
        .ctrl-select {
          background:rgba(0,0,0,.6); border:1px solid #00ffff; color:#00ffff;
          padding:.5rem; font-family:'Courier Prime',monospace; width:100%; cursor:pointer;
        }
        .ctrl-select:focus { outline:none; box-shadow:0 0 10px rgba(0,255,255,.5); }
        .pub-btn {
          background:linear-gradient(135deg,#10b981,#059669); border:2px solid #10b981; color:#fff;
          padding:.5rem 1.5rem; font-family:'Orbitron',monospace; font-weight:700;
          text-transform:uppercase; letter-spacing:1px; cursor:pointer; transition:all .3s;
          width:100%; display:flex; align-items:center; justify-content:center; gap:.5rem;
        }
        .pub-btn:hover { background:linear-gradient(135deg,#059669,#047857); }
        .pub-btn:disabled { opacity:.5; cursor:not-allowed; }
        .font-poppins { font-family:'Poppins',sans-serif; }
      `}</style>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className={`grid min-h-screen ${previewMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[400px_1fr]"}`}>

        {/* ════════ CONTROL PANEL ════════ */}
        {!previewMode && (
          <div className="bg-black/80 backdrop-blur-sm border-r-2 border-cyan-400 overflow-y-auto"
            style={{ maxHeight: "100vh" }}>

            {/* Panel header */}
            <div className="p-5 border-b-2 border-cyan-400 bg-gradient-to-r from-purple-900/50 to-transparent">
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-2xl font-bold glow-text" style={{ fontFamily: "'Orbitron',monospace" }}>
                  BLOG BUILDER
                </h1>
                <div className="flex gap-2">
                  <button onClick={() => setPreviewMode(true)}
                    title="Full BlogDetail preview"
                    className="bg-purple-900/50 border border-cyan-400 text-cyan-300 p-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white transition-all">
                    <Eye size={17} />
                  </button>
                  <button onClick={() => setShowMetaSettings((v) => !v)}
                    title="Settings & Publish"
                    className="bg-purple-900/50 border border-cyan-400 text-cyan-300 p-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white transition-all">
                    <Settings size={17} />
                  </button>
                </div>
              </div>
              <p className="text-cyan-400 text-xs">Preview matches your live BlogDetail page</p>
            </div>

            {/* ── Settings panel ── */}
            {showMetaSettings && (
              <div className="p-5 border-b border-cyan-400/30 bg-purple-900/20 space-y-3">
                <p className="text-cyan-300 text-xs font-bold tracking-widest">SEO META</p>

                {[
                  { label: "Meta Title",   key: "title",    state: metaTags, setter: setMetaTags, ph: "My Blog Title" },
                  { label: "Keywords",     key: "keywords", state: metaTags, setter: setMetaTags, ph: "seo, blog, react" },
                  { label: "Canonical URL",key: "canonical",state: metaTags, setter: setMetaTags, ph: "https://example.com/slug" },
                ].map(({ label, key, state, setter, ph }) => (
                  <div key={key}>
                    <label className="block text-cyan-300 text-xs mb-1">{label}</label>
                    <input type="text" value={state[key]}
                      onChange={(e) => setter((p) => ({ ...p, [key]: e.target.value }))}
                      className="ctrl-input text-sm" placeholder={ph} />
                  </div>
                ))}

                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Meta Description</label>
                  <textarea value={metaTags.description} rows={2}
                    onChange={(e) => setMetaTags((p) => ({ ...p, description: e.target.value }))}
                    className="ctrl-input text-sm" />
                </div>

                <p className="text-cyan-300 text-xs font-bold tracking-widest pt-1">BLOG METADATA</p>

                <div>
                  <label className="block text-cyan-300 text-xs mb-1">
                    Headline <span className="text-cyan-500 font-normal">(shown as &lt;h1&gt; on page)</span>
                  </label>
                  <input type="text" value={blogMeta.headline}
                    onChange={(e) => setBlogMeta((p) => ({ ...p, headline: e.target.value }))}
                    className="ctrl-input text-sm" placeholder="Your display headline" />
                </div>

                {[
                  { label: "Slug",          key: "slug",     ph: "my-blog-post" },
                  { label: "Category",      key: "category", ph: "Technology" },
                  { label: "Author",        key: "author",   ph: "Admin" },
                  { label: "Date",          key: "date",     ph: "Jan 15, 2025" },
                  { label: "Hero Image Alt",key: "imageAlt", ph: "Alt text for hero image" },
                ].map(({ label, key, ph }) => (
                  <div key={key}>
                    <label className="block text-cyan-300 text-xs mb-1">{label}</label>
                    <input type="text" value={blogMeta[key]}
                      onChange={(e) => setBlogMeta((p) => ({ ...p, [key]: e.target.value }))}
                      className="ctrl-input text-sm" placeholder={ph} />
                  </div>
                ))}

                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Hero Image</label>
                  <input type="file" accept="image/*"
                    onChange={(e) => handleHeroUpload(e.target.files[0])}
                    className="ctrl-input text-sm" />
                  {blogMeta.heroImage && (
                    <img src={blogMeta.heroImage} alt="hero"
                      className="mt-2 w-full h-20 object-cover rounded border border-cyan-400/30" />
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <button onClick={downloadJSON}
                      className="flex-1 bg-purple-900/50 border border-cyan-400 text-cyan-300 px-3 py-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white text-xs transition-all">
                      ⬇ Download JSON
                    </button>
                    <button onClick={copyData}
                      className="flex-1 bg-purple-900/50 border border-cyan-400 text-cyan-300 px-3 py-2 rounded hover:bg-[#FA9F42] hover:border-[#FA9F42] hover:text-black text-xs transition-all">
                      ⎘ Copy JSON
                    </button>
                  </div>
                  <button onClick={publishBlog} disabled={publishStatus === "loading"} className="pub-btn">
                    {publishStatus === "loading"
                      ? <><Upload size={15} className="animate-spin" /> Publishing…</>
                      : <><Send size={15} /> Publish & Push to GitHub</>}
                  </button>
                  {publishStatus === "success" && (
                    <div className="text-green-400 text-xs p-2 bg-green-900/20 rounded border border-green-500/30 text-center">✅ {publishMsg}</div>
                  )}
                  {publishStatus === "error" && (
                    <div className="text-red-400 text-xs p-2 bg-red-900/20 rounded border border-red-500/30 text-center">❌ {publishMsg}</div>
                  )}
                </div>
              </div>
            )}

            {/* ── Add element ── */}
            <div className="p-5 border-b border-cyan-400/30">
              <button onClick={() => setShowAddMenu((v) => !v)}
                className="neon-btn w-full flex items-center justify-center gap-2 text-sm">
                <Plus size={16} /> Add Element
              </button>
              {showAddMenu && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { type: "paragraph", icon: Type,      label: "Para" },
                    { type: "heading",   icon: Type,      label: "Heading" },
                    { type: "quote",     icon: Type,      label: "Quote" },
                    { type: "anchor",    icon: LinkIcon,  label: "Link" },
                    { type: "div",       icon: Layout,    label: "Div" },
                    { type: "span",      icon: Layout,    label: "Span" },
                    { type: "image",     icon: ImageIcon, label: "Image" },
                    { type: "ul",        icon: List,      label: "UL" },
                    { type: "ol",        icon: List,      label: "OL" },
                    { type: "dl",        icon: List,      label: "DL" },
                    { type: "marquee",   icon: Sparkles,  label: "Marquee" },
                  ].map(({ type, icon: Icon, label }) => (
                    <button key={type} onClick={() => addElement(type)}
                      className="bg-purple-900/50 border border-cyan-400 text-cyan-300 p-2 rounded hover:bg-[#FA9F42] hover:border-[#FA9F42] hover:text-black transition-all flex flex-col items-center gap-1 text-xs">
                      <Icon size={14} />{label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Element editor ── */}
            {selectedElement ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-cyan-300" style={{ fontFamily: "'Orbitron',monospace" }}>
                    EDIT: {selectedElement.type.toUpperCase()}
                  </h2>
                  <button onClick={() => deleteElement(selectedElement.id)}
                    className="bg-red-900/50 border border-red-400 text-red-300 p-1.5 rounded hover:bg-red-600 hover:text-white transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Content */}
                {!["image","ul","ol","dl"].includes(selectedElement.type) && (
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Content</label>
                    <textarea value={selectedElement.content.replace(/<[^>]*>/g, "")}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="ctrl-input text-sm" rows={3} />

                    {selectedElement.type === "paragraph" && (
                      <div className="mt-2 p-3 bg-purple-900/20 rounded border border-cyan-400/30 space-y-2">
                        <label className="block text-cyan-300 text-xs font-bold">INSERT INLINE LINK</label>
                        <input type="text" id={`lt-${selectedElement.id}`}
                          className="ctrl-input text-xs" placeholder="Link text" />
                        <input type="text" id={`lu-${selectedElement.id}`}
                          className="ctrl-input text-xs" placeholder="https://..." />
                        <button onClick={() => {
                          const lt = document.getElementById(`lt-${selectedElement.id}`).value;
                          const lu = document.getElementById(`lu-${selectedElement.id}`).value;
                          if (lt && lu) {
                            const html = `<a href="${lu}" class="text-[#0B3BFF] font-semibold no-underline hover:opacity-90" target="_blank" rel="noopener noreferrer">${lt}</a>`;
                            updateElement(selectedElement.id, { content: selectedElement.content + " " + html });
                            document.getElementById(`lt-${selectedElement.id}`).value = "";
                            document.getElementById(`lu-${selectedElement.id}`).value = "";
                          }
                        }} className="bg-purple-900/50 border border-cyan-400 text-cyan-300 px-3 py-1 rounded hover:bg-[#0037CA] hover:text-white w-full text-xs">
                          + Insert Link
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Heading level */}
                {selectedElement.type === "heading" && (
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">
                      Heading Level
                      <span className="text-cyan-500 ml-1 font-normal">(h2 & h3 show in TOC)</span>
                    </label>
                    <select value={selectedElement.headingLevel}
                      onChange={(e) => updateElement(selectedElement.id, { headingLevel: e.target.value })}
                      className="ctrl-select text-sm">
                      {[
                        ["h2", "H2 — Section heading (large)"],
                        ["h3", "H3 — Subsection (medium)"],
                        ["h4", "H4"], ["h5", "H5"], ["h6", "H6"],
                      ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                )}

                {/* Anchor */}
                {selectedElement.type === "anchor" && (
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">URL</label>
                    <input type="text" value={selectedElement.href}
                      onChange={(e) => updateElement(selectedElement.id, { href: e.target.value })}
                      className="ctrl-input text-sm" placeholder="https://example.com" />
                  </div>
                )}

                {/* Image */}
                {selectedElement.type === "image" && (
                  <>
                    <div>
                      <label className="block text-cyan-300 text-xs mb-1">Upload Image</label>
                      <input type="file" accept="image/*"
                        onChange={(e) => handleImageUpload(selectedElement.id, e.target.files[0])}
                        className="ctrl-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-cyan-300 text-xs mb-1">Alt Text / Caption</label>
                      <input type="text" value={selectedElement.alt || ""}
                        onChange={(e) => updateElement(selectedElement.id, { alt: e.target.value })}
                        className="ctrl-input text-sm" placeholder="Describe the image" />
                    </div>
                    <div className="p-3 bg-purple-900/20 rounded border border-cyan-400/30">
                      <label className="flex items-center gap-2 text-cyan-300 text-xs mb-2 cursor-pointer">
                        <input type="checkbox" checked={!!selectedElement.useCustomSize}
                          onChange={(e) => updateElement(selectedElement.id, { useCustomSize: e.target.checked })}
                          className="w-4 h-4" />
                        Custom pixel dimensions
                      </label>
                      {selectedElement.useCustomSize ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-cyan-300 text-xs mb-1">Width (px)</label>
                            <input type="number" min="1" value={selectedElement.customWidth || ""}
                              onChange={(e) => updateElement(selectedElement.id, { customWidth: e.target.value })}
                              className="ctrl-input text-xs" placeholder="e.g. 400" />
                          </div>
                          <div>
                            <label className="block text-cyan-300 text-xs mb-1">Height (px)</label>
                            <input type="number" min="1" value={selectedElement.customHeight || ""}
                              onChange={(e) => updateElement(selectedElement.id, { customHeight: e.target.value })}
                              className="ctrl-input text-xs" placeholder="e.g. 300" />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <label className="block text-cyan-300 text-xs mb-1">Width</label>
                            <select value={selectedElement.styles.width}
                              onChange={(e) => updateStyles(selectedElement.id, { width: e.target.value })}
                              className="ctrl-select text-xs">
                              {["w-auto","w-full","w-3/4","w-1/2","w-1/3","w-1/4"].map((w) => (
                                <option key={w} value={w}>{w}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-cyan-300 text-xs mb-1">Height</label>
                            <select value={selectedElement.styles.height}
                              onChange={(e) => updateStyles(selectedElement.id, { height: e.target.value })}
                              className="ctrl-select text-xs">
                              {["h-auto","h-32","h-48","h-64","h-96"].map((h) => (
                                <option key={h} value={h}>{h}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Marquee */}
                {selectedElement.type === "marquee" && (
                  <>
                    <div>
                      <label className="block text-cyan-300 text-xs mb-1">Speed</label>
                      <select value={selectedElement.speed}
                        onChange={(e) => updateElement(selectedElement.id, { speed: e.target.value })}
                        className="ctrl-select text-sm">
                        {["slow","normal","fast"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-cyan-300 text-xs mb-1">Direction</label>
                      <select value={selectedElement.direction}
                        onChange={(e) => updateElement(selectedElement.id, { direction: e.target.value })}
                        className="ctrl-select text-sm">
                        {["left","right","up","down"].map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* List items */}
                {(selectedElement.type === "ul" || selectedElement.type === "ol") && (
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">List Items</label>
                    {(selectedElement.items || []).map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" value={item}
                          onChange={(e) => updateListItem(selectedElement.id, idx, e.target.value)}
                          className="ctrl-input flex-1 text-sm" />
                        <button onClick={() => deleteListItem(selectedElement.id, idx)}
                          className="bg-red-900/50 border border-red-400 text-red-300 px-2 rounded hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addListItem(selectedElement.id)}
                      className="bg-purple-900/50 border border-cyan-400 text-cyan-300 px-3 py-1 rounded hover:bg-[#0037CA] hover:text-white w-full text-xs transition-all">
                      + Add Item
                    </button>
                  </div>
                )}

                {/* DL */}
                {selectedElement.type === "dl" && (
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Definitions</label>
                    {(selectedElement.items || []).map((item, idx) => (
                      <div key={idx} className="mb-3 p-2 bg-purple-900/20 rounded border border-cyan-400/30">
                        <input type="text" value={item.term}
                          onChange={(e) => {
                            const n = selectedElement.items.map((it, i) => i === idx ? { ...it, term: e.target.value } : it);
                            updateElement(selectedElement.id, { items: n });
                          }}
                          className="ctrl-input mb-2 text-xs" placeholder="Term" />
                        <input type="text" value={item.definition}
                          onChange={(e) => {
                            const n = selectedElement.items.map((it, i) => i === idx ? { ...it, definition: e.target.value } : it);
                            updateElement(selectedElement.id, { items: n });
                          }}
                          className="ctrl-input text-xs" placeholder="Definition" />
                      </div>
                    ))}
                    <button onClick={() => updateElement(selectedElement.id, { items: [...selectedElement.items, { term: "Term", definition: "Definition" }] })}
                      className="bg-purple-900/50 border border-cyan-400 text-cyan-300 px-3 py-1 rounded hover:bg-[#0037CA] hover:text-white w-full text-xs transition-all">
                      + Add
                    </button>
                  </div>
                )}

                {/* Typography */}
                <div className="border-t border-cyan-400/30 pt-3 space-y-2">
                  <p className="text-cyan-300 text-xs font-bold tracking-widest">TYPOGRAPHY</p>

                  {[
                    { label: "Font Size",   key: "fontSize",  opts: ["text-xs","text-sm","text-base","text-lg","text-xl","text-2xl","text-3xl","text-4xl","text-5xl"] },
                    { label: "Font Weight", key: "fontWeight",opts: ["font-thin","font-light","font-normal","font-medium","font-semibold","font-bold","font-extrabold","font-black"] },
                    { label: "Align",       key: "textAlign", opts: ["text-left","text-center","text-right","text-justify"] },
                  ].map(({ label, key, opts }) => (
                    <div key={key}>
                      <label className="block text-cyan-300 text-xs mb-1">{label}</label>
                      <select value={selectedElement.styles[key]}
                        onChange={(e) => updateStyles(selectedElement.id, { [key]: e.target.value })}
                        className="ctrl-select text-xs">
                        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}

                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Font Family</label>
                    <select value={selectedElement.styles.fontFamily}
                      onChange={(e) => updateStyles(selectedElement.id, { fontFamily: e.target.value })}
                      className="ctrl-select text-xs">
                      <option value="">Default (Poppins)</option>
                      <option value="font-sans">Sans Serif</option>
                      <option value="font-serif">Serif</option>
                      <option value="font-mono">Monospace</option>
                      <option value="poppins">Poppins</option>
                      <option value="orbitron">Orbitron</option>
                      <option value="courier">Courier Prime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Color</label>
                    <select value={selectedElement.styles.color}
                      onChange={(e) => updateStyles(selectedElement.id, { color: e.target.value, gradient: "" })}
                      className="ctrl-select text-xs">
                      {["text-gray-900","text-gray-700","text-slate-600","text-slate-800","text-[#111827]","text-[#0B3BFF]","text-blue-500","text-red-500","text-green-500","text-purple-500","text-yellow-500","text-pink-500","text-cyan-500","text-white"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-cyan-300 text-xs mb-1">Style</label>
                      <select value={selectedElement.styles.fontStyle}
                        onChange={(e) => updateStyles(selectedElement.id, { fontStyle: e.target.value })}
                        className="ctrl-select text-xs">
                        <option value="">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-cyan-300 text-xs mb-1">Transform</label>
                      <select value={selectedElement.styles.textTransform}
                        onChange={(e) => updateStyles(selectedElement.id, { textTransform: e.target.value })}
                        className="ctrl-select text-xs">
                        <option value="">None</option>
                        <option value="uppercase">UPPER</option>
                        <option value="lowercase">lower</option>
                        <option value="capitalize">Capital</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Spacing & Effects */}
                <div className="border-t border-cyan-400/30 pt-3 space-y-2">
                  <p className="text-cyan-300 text-xs font-bold tracking-widest">SPACING & EFFECTS</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Padding", key: "padding", opts: ["","p-1","p-2","p-4","p-6","p-8"],       lbls: ["None","p-1","p-2","p-4","p-6","p-8"] },
                      { label: "Margin",  key: "margin",  opts: ["","m-1","m-2","m-4","m-6","m-8"],       lbls: ["None","m-1","m-2","m-4","m-6","m-8"] },
                      { label: "Border",  key: "border",  opts: ["","border","border-2","border-4"],      lbls: ["None","1px","2px","4px"] },
                      { label: "Rounded", key: "rounded", opts: ["","rounded","rounded-lg","rounded-xl","rounded-full"], lbls: ["None","SM","LG","XL","Full"] },
                      { label: "Shadow",  key: "shadow",  opts: ["","shadow","shadow-md","shadow-lg","shadow-xl"], lbls: ["None","SM","MD","LG","XL"] },
                    ].map(({ label, key, opts, lbls }) => (
                      <div key={key}>
                        <label className="block text-cyan-300 text-xs mb-1">{label}</label>
                        <select value={selectedElement.styles[key]}
                          onChange={(e) => updateStyles(selectedElement.id, { [key]: e.target.value })}
                          className="ctrl-select text-xs">
                          {opts.map((o, i) => <option key={o} value={o}>{lbls[i]}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List style */}
                {(selectedElement.type === "ul" || selectedElement.type === "ol") && (
                  <div className="border-t border-cyan-400/30 pt-3">
                    <label className="block text-cyan-300 text-xs mb-1 font-bold tracking-widest">LIST STYLE</label>
                    <select value={selectedElement.styles.listStyle}
                      onChange={(e) => updateStyles(selectedElement.id, { listStyle: e.target.value })}
                      className="ctrl-select text-xs">
                      {(selectedElement.type === "ul"
                        ? [["list-disc","● Disc"],["list-circle","○ Circle"],["list-square","■ Square"],["list-none","None"]]
                        : [["list-decimal","1. Decimal"],["list-lower-alpha","a. Lower"],["list-upper-alpha","A. Upper"],["list-lower-roman","i. Roman"],["list-upper-roman","I. Roman"]]
                      ).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-cyan-400/40 text-sm">
                {elements.length > 0 ? "← Click an element to edit it" : "Click \"Add Element\" to start"}
              </div>
            )}
          </div>
        )}

        {/* ════════ PREVIEW (BlogDetail layout) ════════ */}
        <div className="bg-white overflow-y-auto" onClick={() => !previewMode && setSelectedId(null)}>

          {previewMode && (
            <div className="sticky top-0 z-50 bg-[#0037CA] text-white px-6 py-3 flex items-center justify-between shadow-lg">
              <span className="font-bold text-xs tracking-widest" style={{ fontFamily: "'Orbitron',monospace" }}>
                ◉ PREVIEW — Exact BlogDetail Layout
              </span>
              <button onClick={() => setPreviewMode(false)}
                className="flex items-center gap-2 bg-white/10 border border-white/30 text-white px-4 py-1.5 rounded hover:bg-white/20 transition-all text-xs">
                <EyeOff size={14} /> Back to Editor
              </button>
            </div>
          )}

          {/* ── Exact BlogDetail structure ── */}
          <section className="w-full bg-white font-poppins">
            <div className="relative">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex">

                {/* Left social sidebar */}
                <div className="hidden lg:block w-[80px] mr-6">
                  <div className="sticky top-64 flex flex-col gap-4">
                    {[
                      { Icon: Facebook,       cls: "hover:bg-[#0B3BFF]"  },
                      { Icon: MessageCircle,  cls: "hover:bg-[#25D366]"  },
                      { Icon: Linkedin,       cls: "hover:bg-[#1DA1F2]"  },
                      { Icon: Youtube,        cls: "hover:bg-[#FF0000]"  },
                    ].map(({ Icon, cls }, i) => (
                      <span key={i}
                        className={`h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] ${cls} hover:text-white transition-colors cursor-default`}>
                        <Icon className="h-5 w-5" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blog content area */}
                <div className="flex-1 max-w-6xl">
                  {/* Back */}
                  <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-700 cursor-default">
                    <span className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center">
                      <ChevronLeft className="h-4 w-4" />
                    </span>
                    Back to Blog
                  </span>

                  {/* Category */}
                  {blogMeta.category && (
                    <div className="mt-4">
                      <span className="inline-flex rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-3 py-1 text-[11px] font-semibold">
                        {blogMeta.category}
                      </span>
                    </div>
                  )}

                  {/* Headline h1 */}
                  <h1 className="mt-3 text-[22px] sm:text-[28px] lg:text-[38px] font-bold text-[#111827] leading-tight">
                    {displayTitle || <span className="text-slate-300 italic font-normal text-2xl">Your headline appears here…</span>}
                  </h1>

                  {/* Author + Date */}
                  <div className="mt-2 text-[12px] text-slate-500 flex items-center gap-3">
                    <span>{blogMeta.author}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{blogMeta.date}</span>
                  </div>

                  {/* Hero image */}
                  <div className="mt-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
                    {blogMeta.heroImage
                      ? <img src={blogMeta.heroImage} alt={blogMeta.imageAlt || displayTitle}
                          className="w-full h-[210px] sm:h-full object-cover" />
                      : <div className="w-full h-[210px] flex items-center justify-center text-slate-400 text-sm">
                          Hero image will appear here (upload in ⚙ settings)
                        </div>
                    }
                  </div>

                  {/* Sections */}
                  <div className="mt-6 space-y-5">
                    {elements.length === 0 ? (
                      <div className="text-center py-20 text-gray-400">
                        <Type size={52} className="mx-auto mb-3 opacity-20" />
                        <p className="text-base">No elements yet — add them in the panel</p>
                      </div>
                    ) : previewMode
                      ? elements.map((el, i) => renderPreviewElement(el, i))
                      : elements.map((el) => (
                          <div key={el.id}>{renderBuilderElement(el)}</div>
                        ))
                    }
                  </div>
                </div>

                {/* Right TOC sidebar — exact copy of BlogDetail */}
                {toc.length > 0 && (
                  <aside className="hidden lg:block w-[300px] ml-6">
                    <div className="sticky top-36">
                      <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.06)] p-3">
                        <div className="text-[18px] font-bold text-slate-900 tracking-wide">
                          TABLE OF CONTENTS
                        </div>
                        <div className="mt-2 space-y-1 max-h-[240px] overflow-auto pr-1">
                          {toc.map((t) => (
                            <button key={t.id}
                              className="w-full text-left rounded-lg px-2 py-1.5 text-[14px] leading-snug text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                              {t.text}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">
                          Populated automatically from h2 / h3 headings
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

      <Footer />

      {/* ── Login modal ─────────────────────────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
          <div className="bg-black border-2 border-cyan-400 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-cyan-300 text-xl font-bold mb-1" style={{ fontFamily: "'Orbitron',monospace" }}>
              LOGIN TO PUBLISH
            </h2>
            <p className="text-cyan-500 text-xs mb-5">Required to push blog to GitHub</p>

            {loginError && (
              <div className="text-red-400 text-xs mb-4 p-2 bg-red-900/20 rounded border border-red-500/30">
                ❌ {loginError}
              </div>
            )}

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-cyan-300 text-xs mb-1">Email</label>
                <input type="email" value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="ctrl-input" placeholder="admin@yoursite.com" autoFocus />
              </div>
              <div>
                <label className="block text-cyan-300 text-xs mb-1">Password</label>
                <input type="password" value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="ctrl-input" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleLogin} className="pub-btn flex-1 py-2">
                Login & Publish
              </button>
              <button
                onClick={() => { setShowLoginModal(false); setLoginError(""); setLoginForm({ email: "", password: "" }); }}
                className="flex-1 border border-cyan-400/50 text-cyan-400 px-4 py-2 rounded hover:border-red-400 hover:text-red-400 transition-all text-sm bg-transparent">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}