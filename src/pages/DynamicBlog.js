import React, { useState, useMemo, useCallback } from "react";
import {
  Trash2,
  Plus,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Layout,
  List,
  Sparkles,
  Settings,
  Upload,
  Send,
  Facebook,
  Youtube,
  MessageCircle,
  Linkedin,
  ChevronLeft,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";

// ✅ FIX 1: Use environment variable instead of hardcoded localhost
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3500";

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[""''"'`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const Label = ({ children, sub }) => (
  <label className="block mb-1">
    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
      {children}
    </span>
    {sub && (
      <span className="text-[10px] text-[#0037CA] ml-1 font-normal normal-case tracking-normal">
        {sub}
      </span>
    )}
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800
      placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0037CA]/30
      focus:border-[#0037CA] transition-all ${props.className || ""}`}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800
      placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0037CA]/30
      focus:border-[#0037CA] transition-all resize-none ${props.className || ""}`}
  />
);

const Select = ({ label, sub, value, onChange, options }) => (
  <div>
    {label && <Label sub={sub}>{label}</Label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700
        focus:outline-none focus:ring-2 focus:ring-[#0037CA]/30 focus:border-[#0037CA]
        transition-all cursor-pointer appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
      }}
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  </div>
);

const SectionHead = ({ children }) => (
  <div className="flex items-center gap-2 pt-1 pb-0.5">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
      {children}
    </span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

const ContentEditable = ({
  html,
  onChange,
  className,
  style,
  tagName: Tag = "div",
  ...rest
}) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.innerHTML = html || "";
    }
  }, [html]);

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={className}
      style={style}
      onBlur={(e) => onChange(e.currentTarget.innerHTML)}
      {...rest}
    />
  );
};

export default function DynamicBlog() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState(null); // null = append at end
  const [hoveredInsertIndex, setHoveredInsertIndex] = useState(null);
  const [showMetaSettings, setShowMetaSettings] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [publishStatus, setPublishStatus] = useState(null);
  const [publishMsg, setPublishMsg] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const savedSelectionRef = React.useRef(null); // for inline link at cursor

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const [metaTags, setMetaTags] = useState({
    title: "",
    description: "",
    keywords: "",
    canonical: "",
  });

  const [blogMeta, setBlogMeta] = useState({
    headline: "",
    category: "Technology",
    author: "Admin",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    heroImage: "",
    imageAlt: "",
    slug: "",
  });

  const handleHeadlineChange = (val) => {
    setBlogMeta((p) => ({
      ...p,
      headline: val,
      slug: p.slug || slugify(val),
    }));
  };

  const toc = useMemo(() => {
    const used = new Map();
    return elements
      .filter((el) => (el.type === "heading" || el.type === "h1") && el.content)
      .map((el) => {
        const base = slugify(el.content);
        const count = (used.get(base) || 0) + 1;
        used.set(base, count);
        return {
          id: count === 1 ? base : `${base}-${count}`,
          text: el.content,
        };
      });
  }, [elements]);

  const addElement = (type, atIndex = null) => {
    const el = {
      id: Date.now(),
      type,
      content: type === "image" ? "" : "Edit this content",
      styles: {
        fontSize: type === "h1" ? "text-4xl" : "text-base",
        fontWeight: type === "h1" ? "font-bold" : "font-normal",
        fontFamily: "",
        color: type === "h1" ? "text-[#111827]" : "text-gray-900",
        textTransform: "",
        fontStyle: "",
        textAlign: "text-left",
        textDecoration: "",
        gradient: "",
        layout: type === "div" ? "block" : "",
        gridCols: "",
        gap: "",
        flexDirection: "",
        justifyContent: "",
        alignItems: "",
        border: "",
        borderColor: "",
        rounded: "",
        shadow: "",
        padding: "",
        margin: "",
        width: "w-auto",
        height: "h-auto",
        listStyle:
          type === "ul" ? "list-disc" : type === "ol" ? "list-decimal" : "",
      },
      ...(type === "heading" && { headingLevel: "h3" }),
      ...(type === "anchor" && { href: "https://example.com" }),
      ...(type === "image" && {
        src: "",
        alt: "",
        customWidth: "",
        customHeight: "",
        useCustomSize: false,
      }),
      ...(type === "marquee" && { speed: "normal", direction: "left" }),
      ...((type === "ul" || type === "ol") && { items: ["Item 1", "Item 2"] }),
      ...(type === "dl" && {
        items: [{ term: "Term", definition: "Definition" }],
      }),
    };
    setElements((p) => {
      if (atIndex === -1) return [el, ...p];
      if (atIndex !== null) {
        const next = [...p];
        next.splice(atIndex + 1, 0, el);
        return next;
      }
      return [...p, el];
    });
    setShowAddMenu(false);
    setInsertAtIndex(null);
    setHoveredInsertIndex(null);
    setSelectedId(el.id);
  };

  const updateElement = useCallback(
    (id, updates) =>
      setElements((p) =>
        p.map((el) => (el.id === id ? { ...el, ...updates } : el)),
      ),
    [],
  );

  const updateStyles = useCallback(
    (id, upd) =>
      setElements((p) =>
        p.map((el) =>
          el.id === id ? { ...el, styles: { ...el.styles, ...upd } } : el,
        ),
      ),
    [],
  );

  const deleteElement = (id) => {
    setElements((p) => p.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addListItem = (id) =>
    setElements((p) =>
      p.map((el) =>
        el.id === id
          ? { ...el, items: [...el.items, `Item ${el.items.length + 1}`] }
          : el,
      ),
    );

  const updateListItem = (id, idx, val) =>
    setElements((p) =>
      p.map((el) =>
        el.id === id
          ? { ...el, items: el.items.map((it, i) => (i === idx ? val : it)) }
          : el,
      ),
    );

  const deleteListItem = (id, idx) =>
    setElements((p) =>
      p.map((el) =>
        el.id === id
          ? { ...el, items: el.items.filter((_, i) => i !== idx) }
          : el,
      ),
    );

  const handleImageUpload = (id, file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => updateElement(id, { src: e.target.result });
    r.readAsDataURL(file);
  };

  const handleHeroUpload = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) =>
      setBlogMeta((p) => ({ ...p, heroImage: e.target.result }));
    r.readAsDataURL(file);
  };

  // ✅ FIX 2: Added coverImage and tags to match existing blogs structure
  const exportBlogData = () => {
    const sections = elements.map((el) => {
      if (el.type === "h1") return { type: "h1", text: el.content };
      if (el.type === "heading")
        return {
          type: el.headingLevel === "h2" ? "h2" : "h3",
          text: el.content,
        };
      if (el.type === "paragraph") return { type: "p", text: el.content };
      if (el.type === "quote") return { type: "quote", text: el.content };
      if (el.type === "image")
        return { type: "image", src: el.src, caption: el.alt };
      if (el.type === "ul" || el.type === "ol")
        return { type: el.type, text: el.items };
      if (el.type === "anchor")
        return {
          type: "p_with_link",
          textBefore: "",
          linkText: el.content,
          href: el.href,
          textAfter: "",
        };
      return { type: "p", text: el.content };
    });

    const displayTitle = blogMeta.headline || metaTags.title;
    const slug = blogMeta.slug || slugify(displayTitle) || `blog-${Date.now()}`;

    return {
      id: Date.now(),
      slug,
      headline: displayTitle,
      title: metaTags.title || displayTitle,
      description: metaTags.description,
      Keywords: metaTags.keywords,
      category: blogMeta.category,
      date: blogMeta.date,
      author: blogMeta.author,
      image: blogMeta.heroImage,
      heroImage: blogMeta.heroImage,
      coverImage: blogMeta.heroImage, // ✅ ADDED — matches existing blogs structure
      imageAlt: blogMeta.imageAlt || displayTitle,
      tags: [],                        // ✅ ADDED — prevents rendering errors
      sections,
    };
  };

  const downloadJSON = () => {
    const d = exportBlogData();
    const blob = new Blob([JSON.stringify(d, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-${d.slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyData = () => {
    navigator.clipboard
      .writeText(JSON.stringify(exportBlogData(), null, 2))
      .then(() => alert("Blog data copied to clipboard!"))
      .catch(() => alert("Copy failed — check browser permissions."));
  };

  // ── Auth / Publish ────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError("");
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Email and password are required.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        setShowLoginModal(false);
        setLoginForm({ email: "", password: "" });
        setLoginError("");
        doPublish(data.token);
      } else {
        setLoginError(data.message || "Login failed. Check credentials.");
      }
    } catch (e) {
      setLoginError("Network error: " + e.message);
    }
  };

  const publishBlog = () => {
    const displayTitle = blogMeta.headline || metaTags.title;
    if (!displayTitle) {
      alert(
        "Please add a headline before publishing (Settings → Display Headline).",
      );
      setShowMetaSettings(true);
      return;
    }
    if (elements.length === 0) {
      alert("Please add at least one content block before publishing.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    doPublish(token);
  };

  const doPublish = async (token) => {
    setPublishStatus("loading");
    setPublishMsg("");
    try {
      let blogData = exportBlogData();

      // ── Step 1: Upload hero image to Cloudinary if it's base64 ──
      if (blogData.heroImage?.startsWith("data:")) {
        setPublishMsg("Uploading image to Cloudinary...");

        const imgRes = await fetch(`${API_BASE}/api/upload-blog-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageBase64: blogData.heroImage }),
        });

        const imgData = await imgRes.json();

        if (!imgRes.ok) {
          setPublishStatus("error");
          setPublishMsg(imgData.error || "Image upload failed.");
          return;
        }

        // Replace base64 with Cloudinary URL in all 3 image fields
        blogData = {
          ...blogData,
          image:      imgData.url,
          heroImage:  imgData.url,
          coverImage: imgData.url,
        };
      }

      // ── Step 2: Push blog data to GitHub ────────────────────────
      setPublishMsg("Pushing to GitHub...");

      const res = await fetch(`${API_BASE}/api/publish-blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blogData }),
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("authToken");
        setPublishStatus(null);
        setShowLoginModal(true);
        return;
      }

      setPublishStatus(res.ok ? "success" : "error");
      setPublishMsg(
        data.message ||
          data.error ||
          (res.ok ? "Published successfully!" : "Publish failed."),
      );
    } catch (e) {
      setPublishStatus("error");
      setPublishMsg("Network error: " + e.message);
    }
  };

  // ── Builder render ────────────────────────────────────────────────────────
  const renderBuilderElement = (element) => {
    const {
      id,
      type,
      content,
      styles,
      headingLevel,
      href,
      src,
      alt,
      speed,
      direction,
      items,
    } = element;

    const classNames = Object.entries(styles)
      .filter(([k, v]) => k !== "fontFamily" && Boolean(v))
      .map(([, v]) => v)
      .join(" ");

    const inlineStyle = {};
    if (styles.fontFamily === "poppins")
      inlineStyle.fontFamily = "'Poppins', sans-serif";
    else if (styles.fontFamily === "orbitron")
      inlineStyle.fontFamily = "'Orbitron', monospace";
    else if (styles.fontFamily === "courier")
      inlineStyle.fontFamily = "'Courier Prime', monospace";

    const isSelected = selectedId === id;
    const ring = `transition-all cursor-pointer outline-none ${
      isSelected
        ? "ring-2 ring-[#0037CA] ring-offset-1"
        : "hover:ring-2 hover:ring-[#FA9F42] hover:ring-offset-1"
    }`;
    const pick = (e) => {
      e.stopPropagation();
      setSelectedId(id);
    };

    switch (type) {
      // ── FIX: h1 element type ──────────────────────────────────────────────
      case "h1":
        return (
          <h1
            className={`scroll-mt-28 text-[28px] sm:text-[36px] font-extrabold text-[#111827] leading-tight ${classNames} ${ring}`}
            onClick={pick}
            style={inlineStyle}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateElement(id, { content: e.currentTarget.innerText })
            }
          >
            {content}
          </h1>
        );

      // ── FIX: use ContentEditable wrapper for paragraph to avoid React conflict ──
      case "paragraph":
        return (
          <ContentEditable
            tagName="p"
            id={`para-${id}`}
            html={content}
            onChange={(html) => updateElement(id, { content: html })}
            className={`text-[13px] sm:text-[14px] leading-relaxed text-slate-600 ${classNames} ${ring}`}
            onClick={pick}
            style={inlineStyle}
            onMouseUp={() => {
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                savedSelectionRef.current = { elementId: id, range: sel.getRangeAt(0).cloneRange() };
              }
            }}
            onKeyUp={() => {
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                savedSelectionRef.current = { elementId: id, range: sel.getRangeAt(0).cloneRange() };
              }
            }}
          />
        );

      case "quote":
        return (
          <div
            className={`rounded-xl border border-[#E7E9F5] bg-[#F7F9FF] px-4 py-4 text-[13px] sm:text-[14px] text-slate-700 ${ring}`}
            onClick={pick}
            style={inlineStyle}
          >
            <div
              className="border-l-4 border-[#0B3BFF] pl-3 italic leading-relaxed"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                updateElement(id, { content: e.currentTarget.innerText })
              }
            >
              {content}
            </div>
          </div>
        );

      case "heading": {
        const Tag = headingLevel || "h3";
        const hCls =
          Tag === "h2"
            ? `scroll-mt-28 text-[20px] sm:text-[24px] font-bold text-[#111827] ${classNames}`
            : `scroll-mt-28 text-[16px] sm:text-[18px] font-bold text-[#111827] ${classNames}`;
        return (
          <Tag
            className={`${hCls} ${ring}`}
            onClick={pick}
            style={inlineStyle}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateElement(id, { content: e.currentTarget.innerText })
            }
          >
            {content}
          </Tag>
        );
      }

      case "anchor":
        return (
          <a
            className={`text-[#0B3BFF] font-semibold no-underline hover:opacity-90 block ${ring}`}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              pick(e);
            }}
            style={inlineStyle}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateElement(id, { content: e.currentTarget.innerText })
            }
          >
            {content}
          </a>
        );

      case "div":
        return (
          <div
            className={`${classNames} ${ring}`}
            onClick={pick}
            style={inlineStyle}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateElement(id, { content: e.currentTarget.innerText })
            }
          >
            {content}
          </div>
        );

      case "span":
        return (
          <span
            className={`${classNames} ${ring}`}
            onClick={pick}
            style={inlineStyle}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateElement(id, { content: e.currentTarget.innerText })
            }
          >
            {content}
          </span>
        );

      case "image": {
        if (!src)
          return (
            <div
              className={`rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center ${ring}`}
              onClick={pick}
            >
              <ImageIcon size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-400">
                Select this block → upload image in panel
              </p>
            </div>
          );
        const imgStyle = { ...inlineStyle };
        if (element.useCustomSize) {
          if (element.customWidth) imgStyle.width = `${element.customWidth}px`;
          if (element.customHeight)
            imgStyle.height = `${element.customHeight}px`;
        }
        return (
          <figure
            className={`rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 ${ring}`}
            onClick={pick}
          >
            <img
              src={src}
              alt={alt || ""}
              style={imgStyle}
              className={element.useCustomSize ? "" : "w-full h-auto"}
            />
            {alt && (
              <figcaption className="px-4 py-3 text-[12px] text-slate-500">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      }

      case "marquee":
        return (
          <marquee
            className={`${classNames} ${ring}`}
            scrollamount={speed === "slow" ? 2 : speed === "fast" ? 10 : 6}
            direction={direction}
            onClick={pick}
            style={inlineStyle}
          >
            {content}
          </marquee>
        );

      case "ul":
      case "ol": {
        const Tag = type;
        return (
          <Tag
            className={`list-disc list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-800 ${ring}`}
            onClick={pick}
            style={inlineStyle}
          >
            {(items || []).map((it, i) => (
              <li key={i} className="leading-relaxed">
                {it}
              </li>
            ))}
          </Tag>
        );
      }

      case "dl":
        return (
          <dl
            className={`${classNames} ${ring}`}
            onClick={pick}
            style={inlineStyle}
          >
            {(items || []).map((it, i) => (
              <div key={i} className="mb-2">
                <dt className="font-bold">{it.term}</dt>
                <dd className="ml-4">{it.definition}</dd>
              </div>
            ))}
          </dl>
        );

      default:
        return null;
    }
  };

  // ── Preview render (mirrors BlogDetail exactly) ───────────────────────────
  const renderPreviewElement = (el, i) => {
    if (el.type === "h1") {
      return (
        <h1
          key={i}
          className="scroll-mt-28 text-[28px] sm:text-[36px] font-extrabold text-[#111827] leading-tight"
        >
          {el.content}
        </h1>
      );
    }
    if (el.type === "heading") {
      const Tag = el.headingLevel || "h3";
      const cls =
        Tag === "h2"
          ? "scroll-mt-28 text-[20px] sm:text-[24px] font-bold text-[#111827]"
          : "scroll-mt-28 text-[16px] sm:text-[18px] font-bold text-[#111827]";
      return (
        <Tag key={i} className={cls}>
          {el.content}
        </Tag>
      );
    }
    if (el.type === "quote")
      return (
        <div
          key={i}
          className="rounded-xl border border-[#E7E9F5] bg-[#F7F9FF] px-4 py-4 text-[13px] sm:text-[14px] text-slate-700"
        >
          <div className="border-l-4 border-[#0B3BFF] pl-3 italic leading-relaxed">
            {el.content}
          </div>
        </div>
      );
    if (el.type === "image")
      return (
        <figure
          key={i}
          className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50"
        >
          {el.src ? (
            <img
              src={el.src}
              alt={el.alt || "Blog image"}
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center text-slate-400 text-sm">
              No image
            </div>
          )}
          {el.alt && (
            <figcaption className="px-4 py-3 text-[12px] text-slate-500">
              {el.alt}
            </figcaption>
          )}
        </figure>
      );
    if (el.type === "anchor")
      return (
        <p
          key={i}
          className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600"
        >
          <a
            href={el.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0B3BFF] font-semibold no-underline hover:opacity-90"
          >
            {el.content}
          </a>
        </p>
      );
    if (el.type === "ul" || el.type === "ol") {
      const Tag = el.type;
      return (
        <Tag
          key={i}
          className="list-disc list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-800"
        >
          {(el.items || []).map((it, j) => (
            <li key={j} className="leading-relaxed">
              {it}
            </li>
          ))}
        </Tag>
      );
    }
    if (el.type === "marquee")
      return (
        <marquee key={i} scrollamount={6}>
          {el.content}
        </marquee>
      );
    return (
      <p
        key={i}
        className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: el.content }}
      />
    );
  };

  const displayTitle = blogMeta.headline || metaTags.title;

  // ── Progress checks ───────────────────────────────────────────────────────
  const progressItems = [
    { label: "Title", done: Boolean(blogMeta.headline || metaTags.title) },
    { label: "Image", done: Boolean(blogMeta.heroImage) },
    { label: "Slug", done: Boolean(blogMeta.slug) },
    {
      label: `${elements.length} block${elements.length !== 1 ? "s" : ""}`,
      done: elements.length > 0,
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* <Head>
        <title>{metaTags.title || "Blog Builder"}</title>
        <meta name="description" content={metaTags.description} />
        {metaTags.keywords  && <meta name="keywords"  content={metaTags.keywords} />}
        {metaTags.canonical && <link rel="canonical"  href={metaTags.canonical} />}
      </Head> */}

      {/* <Header /> */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .font-poppins { font-family: 'Poppins', sans-serif; }

        .panel-scroll::-webkit-scrollbar { width: 4px; }
        .panel-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .panel-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

        input[type="file"] {
          font-size: 12px; color: #64748b;
          border: 1.5px dashed #cbd5e1; border-radius: 8px;
          padding: 8px 12px; width: 100%; background: #f8fafc;
          cursor: pointer; transition: border-color .2s;
        }
        input[type="file"]:hover { border-color: #0037CA; }

        .badge {
          display: inline-flex; align-items: center;
          background: #EEF1FF; color: #0037CA;
          padding: 2px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 600;
        }

        .btn-publish {
          background: linear-gradient(135deg, #0037CA 0%, #0B3BFF 100%);
          color: #fff; border: none; padding: 11px 20px;
          border-radius: 10px; font-weight: 600; font-size: 13px;
          cursor: pointer; width: 100%; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          transition: all .25s; box-shadow: 0 4px 14px rgba(0,55,202,.25);
          font-family: 'Poppins', sans-serif;
        }
        .btn-publish:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,55,202,.35); }
        .btn-publish:disabled { opacity: .55; cursor: not-allowed; transform: none; }

        .btn-secondary {
          background: #fff; color: #374151; border: 1.5px solid #e2e8f0;
          padding: 9px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 500; cursor: pointer; flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .2s; font-family: 'Poppins', sans-serif;
        }
        .btn-secondary:hover { border-color: #0037CA; color: #0037CA; background: #EEF1FF; }

        .btn-danger {
          background: #fff5f5; color: #ef4444; border: 1.5px solid #fecaca;
          padding: 6px 10px; border-radius: 7px; cursor: pointer;
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; transition: all .2s; font-family: 'Poppins', sans-serif;
        }
        .btn-danger:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .elem-chip {
          background: #fff; border: 1.5px solid #e2e8f0; color: #475569;
          padding: 8px 6px; border-radius: 8px; font-size: 11px; font-weight: 500;
          cursor: pointer; display: flex; flex-direction: column; align-items: center;
          gap: 4px; transition: all .2s;
        }
        .elem-chip:hover { border-color: #FA9F42; color: #FA9F42; background: #fffaf5; }
        .elem-chip.active { border-color: #0037CA; color: #0037CA; background: #EEF1FF; }

        .preview-bar {
          background: linear-gradient(90deg, #0037CA 0%, #0B3BFF 100%);
          padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
          box-shadow: 0 2px 12px rgba(0,55,202,.25);
        }

        /* Fix: prevent contentEditable outline flash */
        [contenteditable]:focus { outline: none; }

        /* Insert between elements */
        .insert-between-btn {
          opacity: 0; transition: opacity .15s;
          display: flex; align-items: center; justify-content: center;
          gap: 6px; width: 100%; padding: 3px 0; cursor: pointer;
          color: #0037CA; font-size: 11px; font-weight: 600;
          background: none; border: none;
        }
        .insert-between-wrap:hover .insert-between-btn { opacity: 1; }
        .insert-between-line {
          flex: 1; height: 1.5px; background: linear-gradient(90deg, transparent, #0037CA80, transparent);
        }

        .insert-type-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
          padding: 10px; background: white; border: 1.5px solid #e2e8f0;
          border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.1);
          position: absolute; z-index: 100; left: 0; right: 0;
          animation: popIn .15s ease;
        }
        @keyframes popIn { from { opacity:0; transform:scaleY(.92); } to { opacity:1; transform:scaleY(1); } }
      `}</style>

      <div
        className={`grid min-h-screen ${previewMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[380px_1fr]"}`}
      >
        {/* ══════════════════ CONTROL PANEL ══════════════════ */}
        {!previewMode && (
          <div
            className="bg-white border-r border-slate-200 flex flex-col panel-scroll overflow-y-auto shadow-sm"
            style={{ maxHeight: "100vh", position: "sticky", top: 0 }}
          >
            {/* ── Panel Header ── */}
            <div className="px-5 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0037CA] flex items-center justify-center shadow-sm">
                    <Zap size={15} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-[15px] font-bold text-slate-800 leading-none">
                      Blog Builder
                    </h1>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                      SkyUp Digital
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(true)}
                    title="Full BlogDetail preview"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-[#0037CA] hover:text-[#0037CA] hover:bg-[#EEF1FF] transition-all"
                  >
                    <Eye size={13} /> Preview
                  </button>
                  <button
                    onClick={() => setShowMetaSettings((v) => !v)}
                    title="Settings"
                    className={`p-1.5 rounded-lg border text-xs transition-all ${showMetaSettings ? "bg-[#EEF1FF] border-[#0037CA] text-[#0037CA]" : "border-slate-200 text-slate-500 hover:border-[#0037CA] hover:text-[#0037CA]"}`}
                  >
                    <Settings size={15} />
                  </button>
                </div>
              </div>

              {/* Progress indicator — FIX: correct per-field check */}
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                {progressItems.map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full transition-colors ${done ? "bg-green-400" : "bg-slate-200"}`}
                    />
                    <span className="text-[10px] text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Settings Panel ── */}
            {showMetaSettings && (
              <div className="border-b border-slate-100 bg-slate-50/70">
                {/* SEO */}
                <div className="px-5 py-4 space-y-3">
                  <SectionHead>SEO Settings</SectionHead>

                  <div>
                    <Label>
                      Page Title{" "}
                      <span className="text-[10px] text-slate-400 font-normal normal-case">
                        (for &lt;title&gt; tag)
                      </span>
                    </Label>
                    <Input
                      value={metaTags.title}
                      placeholder="My Blog Post Title"
                      onChange={(e) =>
                        setMetaTags((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={metaTags.description}
                      placeholder="Brief description for search engines…"
                      rows={2}
                      onChange={(e) =>
                        setMetaTags((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Keywords</Label>
                      <Input
                        value={metaTags.keywords}
                        placeholder="seo, blog, react"
                        onChange={(e) =>
                          setMetaTags((p) => ({
                            ...p,
                            keywords: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Canonical URL</Label>
                      <Input
                        value={metaTags.canonical}
                        placeholder="https://…"
                        onChange={(e) =>
                          setMetaTags((p) => ({
                            ...p,
                            canonical: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Blog Meta */}
                <div className="px-5 py-4 space-y-3 border-t border-slate-100">
                  <SectionHead>Blog Details</SectionHead>

                  <div>
                    <Label sub="(shown as <h1> on page)">
                      Display Headline
                    </Label>
                    <Input
                      value={blogMeta.headline}
                      placeholder="Your compelling headline here…"
                      onChange={(e) => handleHeadlineChange(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label sub="(auto-generated)">URL Slug</Label>
                      <Input
                        value={blogMeta.slug}
                        placeholder="my-blog-post"
                        onChange={(e) =>
                          setBlogMeta((p) => ({
                            ...p,
                            slug: slugify(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={blogMeta.category}
                        placeholder="Technology"
                        onChange={(e) =>
                          setBlogMeta((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={blogMeta.author}
                        placeholder="Admin"
                        onChange={(e) =>
                          setBlogMeta((p) => ({ ...p, author: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        value={blogMeta.date}
                        placeholder="Jan 15, 2025"
                        onChange={(e) =>
                          setBlogMeta((p) => ({ ...p, date: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Hero Image</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroUpload(e.target.files[0])}
                    />
                    {blogMeta.heroImage && (
                      <div className="mt-2 relative rounded-lg overflow-hidden">
                        <img
                          src={blogMeta.heroImage}
                          alt="hero"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() =>
                            setBlogMeta((p) => ({ ...p, heroImage: "" }))
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-all"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Hero Image Alt Text</Label>
                    <Input
                      value={blogMeta.imageAlt}
                      placeholder="Descriptive alt text for SEO"
                      onChange={(e) =>
                        setBlogMeta((p) => ({ ...p, imageAlt: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Publish actions */}
                <div className="px-5 py-4 border-t border-slate-100 space-y-2">
                  <SectionHead>Publish</SectionHead>

                  <div className="flex gap-2">
                    <button onClick={downloadJSON} className="btn-secondary">
                      <Upload size={12} /> Download JSON
                    </button>
                    <button onClick={copyData} className="btn-secondary">
                      <span className="text-base leading-none">⎘</span> Copy
                    </button>
                  </div>

                  <button
                    onClick={publishBlog}
                    disabled={publishStatus === "loading"}
                    className="btn-publish"
                  >
                    {publishStatus === "loading" ? (
                      <>
                        <Upload size={14} className="animate-spin" />{" "}
                        Publishing…
                      </>
                    ) : (
                      <>
                        <Send size={14} /> Publish &amp; Push to GitHub
                      </>
                    )}
                  </button>

                  {/* ✅ FIX 3: Show step-by-step status while publishing */}
                  {publishStatus === "loading" && publishMsg && (
                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs font-medium">
                      <span>⏳</span> {publishMsg}
                    </div>
                  )}
                  {publishStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs font-medium">
                      <span>✅</span> {publishMsg}
                    </div>
                  )}
                  {publishStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs font-medium">
                      <span>❌</span> {publishMsg}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Add Element ── */}
            <div className="px-5 py-4 border-b border-slate-100">
              <button
                onClick={() => { setShowAddMenu((v) => !v); setInsertAtIndex(null); }}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0037CA] text-white rounded-lg font-semibold text-sm hover:bg-[#0030b5] transition-all shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Plus size={15} /> Add Content Block
                </span>
                {showAddMenu ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>

              {showAddMenu && (
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {[
                    { type: "h1", icon: Type, label: "H1" },
                    { type: "paragraph", icon: Type, label: "Para" },
                    { type: "heading", icon: Type, label: "Heading" },
                    { type: "quote", icon: Type, label: "Quote" },
                    { type: "image", icon: ImageIcon, label: "Image" },
                    { type: "ul", icon: List, label: "Bullet" },
                    { type: "ol", icon: List, label: "Numbered" },
                    { type: "anchor", icon: LinkIcon, label: "Link" },
                    { type: "div", icon: Layout, label: "Div" },
                    { type: "span", icon: Layout, label: "Span" },
                    { type: "dl", icon: List, label: "DL" },
                    { type: "marquee", icon: Sparkles, label: "Ticker" },
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addElement(type, insertAtIndex)}
                      className="elem-chip"
                    >
                      <Icon size={13} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Element Editor ── */}
            {selectedElement ? (
              <div className="px-5 py-4 space-y-4 flex-1">
                {/* Editor header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="badge">{selectedElement.type}</span>
                    <span className="text-[11px] text-slate-400">editing</span>
                  </div>
                  <button
                    onClick={() => deleteElement(selectedElement.id)}
                    className="btn-danger"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>

                {/* Content textarea — shown for all text-based elements except image/list/dl */}
                {!["image", "ul", "ol", "dl"].includes(
                  selectedElement.type,
                ) && (
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={selectedElement.content.replace(/<[^>]*>/g, "")}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          content: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Type your content…"
                    />

                    {selectedElement.type === "paragraph" && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg space-y-2">
                        <p className="text-[11px] font-semibold text-[#0037CA] uppercase tracking-wider">
                          Insert Inline Link
                        </p>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          1. Click inside the paragraph where you want the link<br/>
                          2. Fill in the fields below and click Insert
                        </p>
                        <Input
                          id={`lt-${selectedElement.id}`}
                          placeholder="Link text (e.g. 'click here')"
                        />
                        <Input
                          id={`lu-${selectedElement.id}`}
                          placeholder="URL (https://…)"
                        />
                        <button
                          onClick={() => {
                            const ltEl = document.getElementById(`lt-${selectedElement.id}`);
                            const luEl = document.getElementById(`lu-${selectedElement.id}`);
                            const lt = ltEl?.value?.trim();
                            const lu = luEl?.value?.trim();
                            if (!lt || !lu) {
                              alert("Please enter both link text and URL.");
                              return;
                            }
                            const html = `<a href="${lu}" class="text-[#0B3BFF] font-semibold no-underline hover:opacity-90" target="_blank" rel="noopener noreferrer">${lt}</a>`;
                            // Try to insert at saved cursor position
                            const sel = savedSelectionRef.current;
                            if (sel && sel.elementId === selectedElement.id && sel.range) {
                              try {
                                const range = sel.range;
                                range.deleteContents();
                                const frag = range.createContextualFragment(html);
                                range.insertNode(frag);
                                // Sync the updated DOM back to state
                                const domEl = document.getElementById(`para-${selectedElement.id}`);
                                if (domEl) updateElement(selectedElement.id, { content: domEl.innerHTML });
                                savedSelectionRef.current = null;
                                if (ltEl) ltEl.value = "";
                                if (luEl) luEl.value = "";
                                return;
                              } catch(e) { /* fall through to append */ }
                            }
                            // Fallback: append to end
                            updateElement(selectedElement.id, {
                              content: (selectedElement.content || "") + " " + html,
                            });
                            if (ltEl) ltEl.value = "";
                            if (luEl) luEl.value = "";
                          }}
                          className="btn-secondary w-full justify-center"
                        >
                          <LinkIcon size={11} /> Insert Link at Cursor
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Heading level */}
                {selectedElement.type === "heading" && (
                  <Select
                    label="Heading Level"
                    sub="h2 & h3 appear in TOC"
                    value={selectedElement.headingLevel}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        headingLevel: e.target.value,
                      })
                    }
                    options={[
                      ["h2", "H2 — Section heading (large)"],
                      ["h3", "H3 — Subsection (medium)"],
                      ["h4", "H4"],
                      ["h5", "H5"],
                      ["h6", "H6"],
                    ]}
                  />
                )}

                {/* Anchor URL */}
                {selectedElement.type === "anchor" && (
                  <div>
                    <Label>Link URL</Label>
                    <Input
                      value={selectedElement.href}
                      placeholder="https://example.com"
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          href: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {/* Image */}
                {selectedElement.type === "image" && (
                  <div className="space-y-3">
                    <div>
                      <Label>Upload Image</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(
                            selectedElement.id,
                            e.target.files[0],
                          )
                        }
                      />
                      {selectedElement.src && (
                        <img
                          src={selectedElement.src}
                          alt=""
                          className="mt-2 w-full h-24 object-cover rounded-lg border border-slate-100"
                        />
                      )}
                    </div>
                    <div>
                      <Label>Alt Text / Caption</Label>
                      <Input
                        value={selectedElement.alt || ""}
                        placeholder="Describe the image for SEO & accessibility"
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            alt: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          checked={!!selectedElement.useCustomSize}
                          onChange={(e) =>
                            updateElement(selectedElement.id, {
                              useCustomSize: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-[#0037CA]"
                        />
                        <span className="text-xs font-medium text-slate-600">
                          Custom pixel dimensions
                        </span>
                      </label>
                      {selectedElement.useCustomSize ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Width (px)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={selectedElement.customWidth || ""}
                              placeholder="e.g. 600"
                              onChange={(e) =>
                                updateElement(selectedElement.id, {
                                  customWidth: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Height (px)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={selectedElement.customHeight || ""}
                              placeholder="e.g. 400"
                              onChange={(e) =>
                                updateElement(selectedElement.id, {
                                  customHeight: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            label="Width"
                            value={selectedElement.styles.width}
                            onChange={(e) =>
                              updateStyles(selectedElement.id, {
                                width: e.target.value,
                              })
                            }
                            options={[
                              ["w-auto", "Auto"],
                              ["w-full", "Full"],
                              ["w-3/4", "75%"],
                              ["w-1/2", "50%"],
                              ["w-1/3", "33%"],
                              ["w-1/4", "25%"],
                            ]}
                          />
                          <Select
                            label="Height"
                            value={selectedElement.styles.height}
                            onChange={(e) =>
                              updateStyles(selectedElement.id, {
                                height: e.target.value,
                              })
                            }
                            options={[
                              ["h-auto", "Auto"],
                              ["h-32", "Small"],
                              ["h-48", "Medium"],
                              ["h-64", "Large"],
                              ["h-96", "XL"],
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Marquee */}
                {selectedElement.type === "marquee" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      label="Speed"
                      value={selectedElement.speed}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          speed: e.target.value,
                        })
                      }
                      options={[
                        ["slow", "Slow"],
                        ["normal", "Normal"],
                        ["fast", "Fast"],
                      ]}
                    />
                    <Select
                      label="Direction"
                      value={selectedElement.direction}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          direction: e.target.value,
                        })
                      }
                      options={[
                        ["left", "← Left"],
                        ["right", "→ Right"],
                        ["up", "↑ Up"],
                        ["down", "↓ Down"],
                      ]}
                    />
                  </div>
                )}

                {/* List Items */}
                {(selectedElement.type === "ul" ||
                  selectedElement.type === "ol") && (
                  <div>
                    <Label>List Items</Label>
                    <div className="space-y-1.5">
                      {(selectedElement.items || []).map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-[11px] text-slate-400 w-5 text-right shrink-0">
                            {idx + 1}.
                          </span>
                          <Input
                            value={item}
                            onChange={(e) =>
                              updateListItem(
                                selectedElement.id,
                                idx,
                                e.target.value,
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              deleteListItem(selectedElement.id, idx)
                            }
                            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addListItem(selectedElement.id)}
                      className="mt-2 btn-secondary w-full justify-center text-xs"
                    >
                      <Plus size={11} /> Add Item
                    </button>
                  </div>
                )}

                {/* DL */}
                {selectedElement.type === "dl" && (
                  <div>
                    <Label>Definition Items</Label>
                    <div className="space-y-2">
                      {(selectedElement.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5"
                        >
                          <Input
                            value={item.term}
                            placeholder="Term"
                            onChange={(e) => {
                              const n = selectedElement.items.map((it, i) =>
                                i === idx
                                  ? { ...it, term: e.target.value }
                                  : it,
                              );
                              updateElement(selectedElement.id, { items: n });
                            }}
                          />
                          <Input
                            value={item.definition}
                            placeholder="Definition"
                            onChange={(e) => {
                              const n = selectedElement.items.map((it, i) =>
                                i === idx
                                  ? { ...it, definition: e.target.value }
                                  : it,
                              );
                              updateElement(selectedElement.id, { items: n });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          items: [
                            ...selectedElement.items,
                            { term: "Term", definition: "Definition" },
                          ],
                        })
                      }
                      className="mt-2 btn-secondary w-full justify-center text-xs"
                    >
                      <Plus size={11} /> Add Definition
                    </button>
                  </div>
                )}

                {/* ── Typography ── */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <SectionHead>Typography</SectionHead>

                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      label="Font Size"
                      value={selectedElement.styles.fontSize}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          fontSize: e.target.value,
                        })
                      }
                      options={[
                        "text-xs",
                        "text-sm",
                        "text-base",
                        "text-lg",
                        "text-xl",
                        "text-2xl",
                        "text-3xl",
                        "text-4xl",
                      ].map((o) => [o, o])}
                    />

                    <Select
                      label="Font Weight"
                      value={selectedElement.styles.fontWeight}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          fontWeight: e.target.value,
                        })
                      }
                      options={[
                        ["font-light", "Light"],
                        ["font-normal", "Normal"],
                        ["font-medium", "Medium"],
                        ["font-semibold", "Semi Bold"],
                        ["font-bold", "Bold"],
                        ["font-extrabold", "Extra Bold"],
                      ]}
                    />

                    <Select
                      label="Text Align"
                      value={selectedElement.styles.textAlign}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          textAlign: e.target.value,
                        })
                      }
                      options={[
                        ["text-left", "Left"],
                        ["text-center", "Center"],
                        ["text-right", "Right"],
                        ["text-justify", "Justify"],
                      ]}
                    />

                    <Select
                      label="Style"
                      value={selectedElement.styles.fontStyle}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          fontStyle: e.target.value,
                        })
                      }
                      options={[
                        ["", "Normal"],
                        ["italic", "Italic"],
                      ]}
                    />
                  </div>

                  <Select
                    label="Font Family"
                    value={selectedElement.styles.fontFamily}
                    onChange={(e) =>
                      updateStyles(selectedElement.id, {
                        fontFamily: e.target.value,
                      })
                    }
                    options={[
                      ["", "Default (Poppins)"],
                      ["font-sans", "Sans Serif"],
                      ["font-serif", "Serif"],
                      ["font-mono", "Monospace"],
                      ["poppins", "Poppins"],
                      ["orbitron", "Orbitron"],
                      ["courier", "Courier Prime"],
                    ]}
                  />

                  <Select
                    label="Color"
                    value={selectedElement.styles.color}
                    onChange={(e) =>
                      updateStyles(selectedElement.id, {
                        color: e.target.value,
                        gradient: "",
                      })
                    }
                    options={[
                      ["text-[#111827]", "Dark (Headline)"],
                      ["text-slate-600", "Body Gray"],
                      ["text-slate-500", "Muted"],
                      ["text-[#0037CA]", "Brand Blue"],
                      ["text-[#FA9F42]", "Brand Orange"],
                      ["text-[#0B3BFF]", "Bright Blue"],
                      ["text-red-500", "Red"],
                      ["text-green-600", "Green"],
                      ["text-white", "White"],
                    ]}
                  />

                  <Select
                    label="Transform"
                    value={selectedElement.styles.textTransform}
                    onChange={(e) =>
                      updateStyles(selectedElement.id, {
                        textTransform: e.target.value,
                      })
                    }
                    options={[
                      ["", "None"],
                      ["uppercase", "UPPERCASE"],
                      ["lowercase", "lowercase"],
                      ["capitalize", "Capitalize"],
                    ]}
                  />
                </div>

                {/* ── Spacing & Effects ── */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <SectionHead>Spacing & Effects</SectionHead>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      label="Padding"
                      value={selectedElement.styles.padding}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          padding: e.target.value,
                        })
                      }
                      options={[
                        ["", "None"],
                        ["p-2", "XS"],
                        ["p-4", "SM"],
                        ["p-6", "MD"],
                        ["p-8", "LG"],
                        ["p-10", "XL"],
                      ]}
                    />
                    <Select
                      label="Margin"
                      value={selectedElement.styles.margin}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          margin: e.target.value,
                        })
                      }
                      options={[
                        ["", "None"],
                        ["m-2", "XS"],
                        ["m-4", "SM"],
                        ["m-6", "MD"],
                        ["m-8", "LG"],
                      ]}
                    />
                    <Select
                      label="Border"
                      value={selectedElement.styles.border}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          border: e.target.value,
                        })
                      }
                      options={[
                        ["", "None"],
                        ["border", "Thin"],
                        ["border-2", "Medium"],
                        ["border-4", "Thick"],
                      ]}
                    />
                    <Select
                      label="Rounded"
                      value={selectedElement.styles.rounded}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          rounded: e.target.value,
                        })
                      }
                      options={[
                        ["", "None"],
                        ["rounded", "SM"],
                        ["rounded-lg", "LG"],
                        ["rounded-xl", "XL"],
                        ["rounded-2xl", "2XL"],
                        ["rounded-full", "Full"],
                      ]}
                    />
                    <Select
                      label="Shadow"
                      value={selectedElement.styles.shadow}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          shadow: e.target.value,
                        })
                      }
                      options={[
                        ["", "None"],
                        ["shadow-sm", "XS"],
                        ["shadow", "SM"],
                        ["shadow-md", "MD"],
                        ["shadow-lg", "LG"],
                        ["shadow-xl", "XL"],
                      ]}
                    />
                    {selectedElement.styles.border && (
                      <Select
                        label="Border Color"
                        value={selectedElement.styles.borderColor}
                        onChange={(e) =>
                          updateStyles(selectedElement.id, {
                            borderColor: e.target.value,
                          })
                        }
                        options={[
                          ["", "Default"],
                          ["border-slate-200", "Gray"],
                          ["border-[#0037CA]", "Blue"],
                          ["border-[#FA9F42]", "Orange"],
                          ["border-red-300", "Red"],
                          ["border-green-300", "Green"],
                        ]}
                      />
                    )}
                  </div>
                </div>

                {/* List style */}
                {(selectedElement.type === "ul" ||
                  selectedElement.type === "ol") && (
                  <div className="border-t border-slate-100 pt-4">
                    <Select
                      label="List Style"
                      value={selectedElement.styles.listStyle}
                      onChange={(e) =>
                        updateStyles(selectedElement.id, {
                          listStyle: e.target.value,
                        })
                      }
                      options={
                        selectedElement.type === "ul"
                          ? [
                              ["list-disc", "● Disc"],
                              ["list-circle", "○ Circle"],
                              ["list-square", "■ Square"],
                              ["list-none", "None"],
                            ]
                          : [
                              ["list-decimal", "1. Decimal"],
                              ["list-lower-alpha", "a. Lower Alpha"],
                              ["list-upper-alpha", "A. Upper Alpha"],
                              ["list-lower-roman", "i. Roman"],
                              ["list-upper-roman", "I. Roman"],
                            ]
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                {elements.length > 0 ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                      <Type size={18} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      Select a block to edit
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click any element in the preview
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF1FF] flex items-center justify-center mb-3">
                      <Plus size={22} className="text-[#0037CA]" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">
                      Start building your blog
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click "Add Content Block" above
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ CANVAS / PREVIEW ══════════════════ */}
        <div
          className="bg-white overflow-y-auto"
          onClick={() => !previewMode && setSelectedId(null)}
        >
          {previewMode && (
            <div className="preview-bar">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FA9F42] rounded-full animate-pulse" />
                <span className="text-white font-semibold text-sm">
                  Live Preview — BlogDetail Layout
                </span>
              </div>
              <button
                onClick={() => setPreviewMode(false)}
                className="flex items-center gap-2 bg-white/15 border border-white/25 text-white px-4 py-1.5 rounded-lg hover:bg-white/25 transition-all text-xs font-medium"
              >
                <EyeOff size={13} /> Back to Editor
              </button>
            </div>
          )}

          {/* ── Exact BlogDetail structure ── */}
          <section className="w-full bg-white font-poppins">
            <div className="relative">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex">
                {/* Social sidebar */}
                <div className="hidden lg:block w-[80px] mr-6">
                  <div className="sticky top-64 flex flex-col gap-4">
                    {[
                      { Icon: Facebook, cls: "hover:bg-[#0B3BFF]" },
                      { Icon: MessageCircle, cls: "hover:bg-[#25D366]" },
                      { Icon: Linkedin, cls: "hover:bg-[#1DA1F2]" },
                      { Icon: Youtube, cls: "hover:bg-[#FF0000]" },
                    ].map(({ Icon, cls }, i) => (
                      <span
                        key={i}
                        className={`h-10 w-10 rounded-full bg-[#EEF1FF] flex items-center justify-center text-[#777777] ${cls} hover:text-white transition-colors cursor-default`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blog content */}
                <div className="flex-1 max-w-6xl">
                  <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-700 cursor-default">
                    <span className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center">
                      <ChevronLeft className="h-4 w-4" />
                    </span>
                    Back to Blog
                  </span>

                  {blogMeta.category && (
                    <div className="mt-4">
                      <span className="inline-flex rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-3 py-1 text-[11px] font-semibold">
                        {blogMeta.category}
                      </span>
                    </div>
                  )}

                  <h1 className="mt-3 text-[22px] sm:text-[28px] lg:text-[38px] font-bold text-[#111827] leading-tight">
                    {displayTitle || (
                      <span className="text-slate-300 italic font-normal text-xl">
                        Your headline appears here…
                      </span>
                    )}
                  </h1>

                  <div className="mt-2 text-[12px] text-slate-500 flex items-center gap-3">
                    <span>{blogMeta.author}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{blogMeta.date}</span>
                  </div>

                  <div className="mt-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
                    {blogMeta.heroImage ? (
                      <img
                        src={blogMeta.heroImage}
                        alt={blogMeta.imageAlt || displayTitle}
                        className="w-full h-[210px] sm:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-[210px] flex flex-col items-center justify-center text-slate-400 gap-2">
                        <ImageIcon size={28} className="opacity-30" />
                        <p className="text-sm">
                          Hero image appears here — upload in ⚙ Settings
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-5">
                    {elements.length === 0 ? (
                      <div className="text-center py-20 text-slate-300">
                        <Type size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-slate-400 text-base font-medium">
                          No content blocks yet
                        </p>
                        <p className="text-slate-300 text-sm mt-1">
                          Add elements using the panel on the left
                        </p>
                      </div>
                    ) : previewMode ? (
                      elements.map((el, i) => renderPreviewElement(el, i))
                    ) : (
                      elements.map((el, i) => (
                        <React.Fragment key={el.id}>
                          {/* ── Insert BEFORE first element ── */}
                          {i === 0 && (
                            <div
                              className="insert-between-wrap relative"
                              onMouseEnter={() => setHoveredInsertIndex(-1)}
                              onMouseLeave={() => hoveredInsertIndex === -1 && setHoveredInsertIndex(null)}
                            >
                              <button
                                className="insert-between-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInsertAtIndex(-1);
                                  setShowAddMenu(true);
                                  setShowMetaSettings(true);
                                }}
                              >
                                <span className="insert-between-line" />
                                <Plus size={11} /> Insert Here
                                <span className="insert-between-line" />
                              </button>
                            </div>
                          )}
                          <div onClick={(e) => e.stopPropagation()}>
                            {renderBuilderElement(el)}
                          </div>
                          {/* ── Insert AFTER each element ── */}
                          <div
                            className="insert-between-wrap relative"
                            onMouseEnter={() => setHoveredInsertIndex(i)}
                            onMouseLeave={() => hoveredInsertIndex === i && setHoveredInsertIndex(null)}
                          >
                            <button
                              className="insert-between-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInsertAtIndex(i);
                                setShowAddMenu(true);
                                setShowMetaSettings(true);
                              }}
                            >
                              <span className="insert-between-line" />
                              <Plus size={11} /> Insert Here
                              <span className="insert-between-line" />
                            </button>
                          </div>
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>

                {/* TOC sidebar */}
                {toc.length > 0 && (
                  <aside className="hidden lg:block w-[300px] ml-6">
                    <div className="sticky top-36">
                      <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.06)] p-3">
                        <div className="text-[18px] font-bold text-slate-900 tracking-wide">
                          TABLE OF CONTENTS
                        </div>
                        <div className="mt-2 space-y-1 max-h-[240px] overflow-auto pr-1">
                          {toc.map((t) => (
                            <button
                              key={t.id}
                              className="w-full text-left rounded-lg px-2 py-1.5 text-[14px] leading-snug text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                            >
                              {t.text}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">
                          Auto-generated from h1 / h2 / h3 headings
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

      {/* <Footer /> */}

      {/* ── Login Modal ── */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 border border-slate-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0037CA] flex items-center justify-center shadow-sm">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-slate-800">
                  Sign in to publish
                </h2>
                <p className="text-[11px] text-slate-400">
                  Required to push to GitHub
                </p>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs mb-4">
                <span>❌</span> {loginError}
              </div>
            )}

            <div className="space-y-3 mb-5">
              <div>
                <Label>Email address</Label>
                <Input
                  type="email"
                  value={loginForm.email}
                  placeholder="admin@skyupdigital.com"
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, email: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  autoFocus
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={loginForm.password}
                  placeholder="••••••••"
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, password: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleLogin}
                className="btn-publish flex-1 py-2.5 text-sm rounded-lg"
              >
                Sign in &amp; Publish
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                  setLoginForm({ email: "", password: "" });
                }}
                className="btn-secondary px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}