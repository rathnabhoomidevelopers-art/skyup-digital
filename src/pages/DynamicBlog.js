import React, { useState } from 'react';
import { Trash2, Plus, Move, Edit3, Image as ImageIcon, Link as LinkIcon, Type, Layout, List, Sparkles, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DynamicBlog = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showMetaSettings, setShowMetaSettings] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [metaTags, setMetaTags] = useState({
    title: 'My Blog Title',
    description: 'My blog description',
    keywords: '',
    canonical: ''
  });
  const [blogMeta, setBlogMeta] = useState({
    category: 'Technology',
    author: 'Admin',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    heroImage: '',
    slug: ''
  });

  // Add new element
  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      content: type === 'image' ? '' : 'Edit this content',
      styles: {
        fontSize: 'text-base',
        fontWeight: 'font-normal',
        fontFamily: '',
        color: 'text-gray-900',
        textTransform: '',
        fontStyle: '',
        textAlign: 'text-left',
        textDecoration: '',
        gradient: '',
        layout: type === 'div' ? 'block' : '',
        gridCols: '',
        gap: '',
        flexDirection: '',
        justifyContent: '',
        alignItems: '',
        border: '',
        borderColor: '',
        rounded: '',
        shadow: '',
        padding: '',
        margin: '',
        width: 'w-auto',
        height: 'h-auto',
        listStyle: type === 'ul' ? 'list-disc' : type === 'ol' ? 'list-decimal' : '',
      },
      ...(type === 'heading' && { headingLevel: 'h2' }),
      ...(type === 'anchor' && { href: 'https://example.com' }),
      ...(type === 'image' && { src: '', alt: '', customWidth: '', customHeight: '', useCustomSize: false }),
      ...(type === 'marquee' && { speed: 'normal', direction: 'left' }),
      ...(type === 'list' && { items: ['Item 1', 'Item 2'] }),
      ...(type === 'dl' && { items: [{ term: 'Term', definition: 'Definition' }] }),
    };
    setElements([...elements, newElement]);
    setShowAddMenu(false);
  };

  // Update element
  const updateElement = (id, updates) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  // Update element styles
  const updateStyles = (id, styleUpdates) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, styles: { ...el.styles, ...styleUpdates } } : el
    ));
  };

  // Delete element
  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement?.id === id) setSelectedElement(null);
  };

  // Add list item
  const addListItem = (id) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, items: [...el.items, `Item ${el.items.length + 1}`] } : el
    ));
  };

  // Update list item
  const updateListItem = (id, index, value) => {
    setElements(elements.map(el => 
      el.id === id ? { 
        ...el, 
        items: el.items.map((item, i) => i === index ? value : item) 
      } : el
    ));
  };

  // Delete list item
  const deleteListItem = (id, index) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, items: el.items.filter((_, i) => i !== index) } : el
    ));
  };

  // Handle image upload
  const handleImageUpload = (id, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateElement(id, { src: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Handle hero image upload
  const handleHeroImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setBlogMeta({ ...blogMeta, heroImage: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Export blog data in the format matching your blog structure
  const exportBlogData = () => {
    const sections = elements.map(el => {
      if (el.type === 'paragraph') {
        // Check if paragraph has inline links
        const hasLinks = el.content.includes('<a ');
        if (hasLinks) {
          // For now, export as regular paragraph - you can enhance this later
          return { type: 'p', text: el.content.replace(/<[^>]*>/g, '') };
        }
        return { type: 'p', text: el.content };
      }
      
      if (el.type === 'quote') {
        return { type: 'quote', text: el.content };
      }
      
      if (el.type === 'heading') {
        return { type: 'h3', text: el.content };
      }
      
      if (el.type === 'image') {
        return { type: 'image', src: el.src, caption: el.alt };
      }
      
      if (el.type === 'ul' || el.type === 'ol') {
        return { type: 'ul', text: el.items };
      }
      
      if (el.type === 'anchor') {
        return { type: 'p_with_link', textBefore: '', linkText: el.content, href: el.href, textAfter: '' };
      }
      
      return { type: 'p', text: el.content };
    });

    const blogData = {
      id: Date.now(),
      slug: blogMeta.slug || metaTags.title.toLowerCase().replace(/\s+/g, '-'),
      title: metaTags.title,
      description: metaTags.description,
      Keywords: metaTags.keywords,
      category: blogMeta.category,
      date: blogMeta.date,
      author: blogMeta.author,
      image: blogMeta.heroImage,
      heroImage: blogMeta.heroImage,
      sections: sections
    };

    return blogData;
  };

  // Download blog data as JSON
  const downloadBlogJSON = () => {
    const blogData = exportBlogData();
    const dataStr = JSON.stringify(blogData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blog-${blogData.slug}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy blog data to clipboard
  const copyBlogData = () => {
    const blogData = exportBlogData();
    const dataStr = JSON.stringify(blogData, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert('Blog data copied to clipboard!');
  };

  // Render element based on type
  const renderElement = (element) => {
    const { id, type, content, styles, headingLevel, href, src, alt, speed, direction, items } = element;
    
    // Build className from styles, excluding fontFamily
    const classNames = Object.entries(styles)
      .filter(([key, value]) => key !== 'fontFamily' && Boolean(value))
      .map(([_, value]) => value)
      .join(' ');
    
    // Build inline style for custom font family
    const inlineStyle = {};
    if (styles.fontFamily) {
      if (styles.fontFamily === 'poppins') {
        inlineStyle.fontFamily = "'Poppins', sans-serif";
      } else if (styles.fontFamily === 'orbitron') {
        inlineStyle.fontFamily = "'Orbitron', monospace";
      } else if (styles.fontFamily === 'courier') {
        inlineStyle.fontFamily = "'Courier Prime', monospace";
      }
    }

    const commonProps = {
      className: `${classNames} transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-[#FA9F42] hover:ring-offset-2 ${selectedElement?.id === id ? 'ring-2 ring-[#0037CA] ring-offset-2' : ''}`,
      onClick: (e) => { e.stopPropagation(); setSelectedElement(element); },
      style: inlineStyle
    };

    switch (type) {
      case 'paragraph':
        const paragraphStyle = { ...inlineStyle };
        const paragraphClasses = `${classNames} text-[13px] sm:text-[14px] leading-relaxed text-slate-600`;
        return (
          <p 
            {...commonProps}
            className={paragraphClasses}
            style={paragraphStyle}
            contentEditable 
            suppressContentEditableWarning 
            onBlur={(e) => updateElement(id, { content: e.target.innerHTML })}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      
      case 'quote':
        return (
          <div className="rounded-xl border border-[#E7E9F5] bg-[#F7F9FF] px-4 py-4 text-[13px] sm:text-[14px] text-slate-700 cursor-pointer hover:ring-2 hover:ring-[#FA9F42] hover:ring-offset-2"
            onClick={(e) => { e.stopPropagation(); setSelectedElement(element); }}
            style={inlineStyle}
          >
            <div className="border-l-4 border-[#0B3BFF] pl-3 italic leading-relaxed"
              contentEditable 
              suppressContentEditableWarning 
              onBlur={(e) => updateElement(id, { content: e.target.innerText })}
            >
              {content}
            </div>
          </div>
        );
      
      case 'heading':
        const HeadingTag = headingLevel;
        const headingStyle = { ...inlineStyle };
        const headingClasses = headingLevel === 'h3' 
          ? `${classNames} scroll-mt-28 text-[16px] sm:text-[18px] font-bold text-[#111827]`
          : `${classNames}`;
        return (
          <HeadingTag 
            {...commonProps}
            className={headingClasses}
            style={headingStyle}
            contentEditable 
            suppressContentEditableWarning 
            onBlur={(e) => updateElement(id, { content: e.target.innerText })}
          >
            {content}
          </HeadingTag>
        );
      
      case 'anchor':
        return <a {...commonProps} href={href} target="_blank" rel="noopener noreferrer" contentEditable suppressContentEditableWarning onBlur={(e) => updateElement(id, { content: e.target.innerText })}>{content}</a>;
      
      case 'div':
        return <div {...commonProps} contentEditable suppressContentEditableWarning onBlur={(e) => updateElement(id, { content: e.target.innerText })}>{content}</div>;
      
      case 'span':
        return <span {...commonProps} contentEditable suppressContentEditableWarning onBlur={(e) => updateElement(id, { content: e.target.innerText })}>{content}</span>;
      
      case 'image':
        if (!src) return <div {...commonProps}>No image uploaded</div>;
        const imgStyle = { ...inlineStyle };
        if (element.useCustomSize) {
          if (element.customWidth) imgStyle.width = `${element.customWidth}px`;
          if (element.customHeight) imgStyle.height = `${element.customHeight}px`;
        }
        return (
          <figure 
            className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 cursor-pointer hover:ring-2 hover:ring-[#FA9F42] hover:ring-offset-2"
            onClick={(e) => { e.stopPropagation(); setSelectedElement(element); }}
          >
            <img src={src} alt={alt} style={imgStyle} className={classNames + " w-full h-auto"} />
            {alt && (
              <figcaption className="px-4 py-3 text-[12px] text-slate-500">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      
      case 'marquee':
        return <marquee {...commonProps} scrollamount={speed === 'slow' ? 2 : speed === 'normal' ? 6 : 10} direction={direction}>{content}</marquee>;
      
      case 'ul':
      case 'ol':
        const ListTag = type;
        const listClasses = `${classNames} list-disc list-outside pl-5 space-y-2 text-[13px] sm:text-[14px] text-slate-800`;
        return (
          <ListTag {...commonProps} className={listClasses} style={inlineStyle}>
            {items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ListTag>
        );
      
      case 'dl':
        return (
          <dl {...commonProps}>
            {items.map((item, idx) => (
              <div key={idx} className="mb-2">
                <dt className="font-bold">{item.term}</dt>
                <dd className="ml-4">{item.definition}</dd>
              </div>
            ))}
          </dl>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{ fontFamily: "'Courier Prime', monospace" }}>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        {metaTags.keywords && <meta name="keywords" content={metaTags.keywords} />}
        {metaTags.canonical && <link rel="canonical" href={metaTags.canonical} />}
      </Helmet>
      <Header/>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Courier+Prime:wght@400;700&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        
        * { box-sizing: border-box; }
        
        .retro-border {
          border: 2px solid #00ffff;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1);
        }
        
        .glow-text {
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5);
        }
        
        
        
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        
        .neon-button {
          position: relative;
          background: #0037CA;
          border: 2px solid #0037CA;
          color: #ffffff;
          padding: 0.5rem 1.5rem;
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .neon-button:hover {
          background: #FA9F42;
          border-color: #FA9F42;
          color: #000;
        }
        
        .control-input {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid #00ffff;
          color: #00ffff;
          padding: 0.5rem;
          font-family: 'Courier Prime', monospace;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .control-input:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          background: rgba(0, 0, 0, 0.6);
        }
        
        .control-select {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #00ffff;
          color: #00ffff;
          padding: 0.5rem;
          font-family: 'Courier Prime', monospace;
          width: 100%;
          cursor: pointer;
        }
        
        .control-select:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .grid-bg {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] min-h-screen">
        
        {/* Control Panel */}
        <div className="bg-black/80 backdrop-blur-sm border-r-2 border-cyan-400 overflow-y-auto scan-line" style={{ maxHeight: '100vh' }}>
          {/* Header */}
          <div className="p-6 border-b-2 border-cyan-400 bg-gradient-to-r from-purple-900/50 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold glow-text" style={{ fontFamily: "'Orbitron', monospace" }}>
                BLOG BUILDER
              </h1>
              <button
                onClick={() => setShowMetaSettings(!showMetaSettings)}
                className="bg-purple-900/50 border border-cyan-400 text-cyan-300 p-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white transition-all"
                title="SEO Meta Settings"
              >
                <Settings size={20} />
              </button>
            </div>
            <p className="text-cyan-300 text-sm mt-2">Retro-Futuristic Edition v2.0</p>
          </div>

          {/* Meta Settings Panel */}
          {showMetaSettings && (
            <div className="p-6 border-b border-cyan-400/30 bg-purple-900/20 max-h-[500px] overflow-y-auto">
              <h3 className="text-cyan-300 text-sm font-bold mb-3">SEO META SETTINGS</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={metaTags.title}
                    onChange={(e) => setMetaTags({ ...metaTags, title: e.target.value })}
                    className="control-input text-sm"
                    placeholder="Enter page title"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Meta Description</label>
                  <textarea
                    value={metaTags.description}
                    onChange={(e) => setMetaTags({ ...metaTags, description: e.target.value })}
                    className="control-input text-sm"
                    rows={3}
                    placeholder="Enter meta description"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Keywords</label>
                  <input
                    type="text"
                    value={metaTags.keywords}
                    onChange={(e) => setMetaTags({ ...metaTags, keywords: e.target.value })}
                    className="control-input text-sm"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={metaTags.canonical}
                    onChange={(e) => setMetaTags({ ...metaTags, canonical: e.target.value })}
                    className="control-input text-sm"
                    placeholder="https://example.com/page"
                  />
                </div>
              </div>

              <h3 className="text-cyan-300 text-sm font-bold mb-3 mt-6">BLOG METADATA</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Category</label>
                  <input
                    type="text"
                    value={blogMeta.category}
                    onChange={(e) => setBlogMeta({ ...blogMeta, category: e.target.value })}
                    className="control-input text-sm"
                    placeholder="e.g., Technology, Marketing"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Author</label>
                  <input
                    type="text"
                    value={blogMeta.author}
                    onChange={(e) => setBlogMeta({ ...blogMeta, author: e.target.value })}
                    className="control-input text-sm"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Date</label>
                  <input
                    type="text"
                    value={blogMeta.date}
                    onChange={(e) => setBlogMeta({ ...blogMeta, date: e.target.value })}
                    className="control-input text-sm"
                    placeholder="Jan 15, 2024"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={blogMeta.slug}
                    onChange={(e) => setBlogMeta({ ...blogMeta, slug: e.target.value })}
                    className="control-input text-sm"
                    placeholder="my-blog-post"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Hero Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleHeroImageUpload(e.target.files[0])}
                    className="control-input text-sm"
                  />
                  {blogMeta.heroImage && (
                    <img src={blogMeta.heroImage} alt="Hero" className="mt-2 w-full h-20 object-cover rounded" />
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={downloadBlogJSON}
                  className="flex-1 bg-purple-900/50 border border-cyan-400 text-cyan-300 px-4 py-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white text-sm"
                >
                  Download JSON
                </button>
                <button
                  onClick={copyBlogData}
                  className="flex-1 bg-purple-900/50 border border-cyan-400 text-cyan-300 px-4 py-2 rounded hover:bg-[#FA9F42] hover:border-[#FA9F42] hover:text-black text-sm"
                >
                  Copy Data
                </button>
              </div>
            </div>
          )}

          {/* Add Element Button */}
          <div className="p-6 border-b border-cyan-400/30">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="neon-button w-full flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Element
            </button>

            {showAddMenu && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { type: 'paragraph', icon: Type, label: 'Paragraph' },
                  { type: 'heading', icon: Type, label: 'Heading' },
                  { type: 'quote', icon: Type, label: 'Quote' },
                  { type: 'anchor', icon: LinkIcon, label: 'Link' },
                  { type: 'div', icon: Layout, label: 'Div' },
                  { type: 'span', icon: Layout, label: 'Span' },
                  { type: 'image', icon: ImageIcon, label: 'Image' },
                  { type: 'ul', icon: List, label: 'UL List' },
                  { type: 'ol', icon: List, label: 'OL List' },
                  { type: 'marquee', icon: Sparkles, label: 'Marquee' },
                  { type: 'dl', icon: List, label: 'DL List' },
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => addElement(type)}
                    className="bg-purple-900/50 border border-cyan-400 text-cyan-300 p-3 rounded hover:bg-[#FA9F42] hover:border-[#FA9F42] hover:text-black transition-all flex flex-col items-center gap-1 text-xs"
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Element Controls */}
          {selectedElement && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-cyan-300" style={{ fontFamily: "'Orbitron', monospace" }}>
                  EDIT: {selectedElement.type.toUpperCase()}
                </h2>
                <button
                  onClick={() => deleteElement(selectedElement.id)}
                  className="bg-red-900/50 border border-red-400 text-red-300 p-2 rounded hover:bg-[#FA9F42] hover:border-[#FA9F42] hover:text-black transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Content */}
              {selectedElement.type !== 'image' && selectedElement.type !== 'ul' && selectedElement.type !== 'ol' && selectedElement.type !== 'dl' && (
                <div>
                  <label className="block text-cyan-300 text-sm mb-2">Content</label>
                  <textarea
                    value={selectedElement.content.replace(/<[^>]*>/g, '')}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    className="control-input"
                    rows={selectedElement.type === 'quote' ? 4 : 3}
                  />
                  
                  {selectedElement.type === 'paragraph' && (
                    <div className="mt-3 p-3 bg-purple-900/20 rounded border border-cyan-400/30">
                      <label className="block text-cyan-300 text-xs mb-2 font-bold">INSERT INLINE LINK</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          id={`link-text-${selectedElement.id}`}
                          className="control-input text-sm"
                          placeholder="Link text (e.g., 'click here')"
                        />
                        <input
                          type="text"
                          id={`link-url-${selectedElement.id}`}
                          className="control-input text-sm"
                          placeholder="URL (e.g., https://example.com)"
                        />
                        <button
                          onClick={() => {
                            const linkText = document.getElementById(`link-text-${selectedElement.id}`).value;
                            const linkUrl = document.getElementById(`link-url-${selectedElement.id}`).value;
                            if (linkText && linkUrl) {
                              const currentContent = selectedElement.content;
                              const linkHtml = `<a href="${linkUrl}" class="text-[#0B3BFF] font-semibold no-underline hover:opacity-90" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
                              updateElement(selectedElement.id, { content: currentContent + ' ' + linkHtml });
                              document.getElementById(`link-text-${selectedElement.id}`).value = '';
                              document.getElementById(`link-url-${selectedElement.id}`).value = '';
                            }
                          }}
                          className="bg-purple-900/50 border border-cyan-400 text-cyan-300 px-4 py-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white w-full text-sm"
                        >
                          + Insert Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Heading Level */}
              {selectedElement.type === 'heading' && (
                <div>
                  <label className="block text-cyan-300 text-sm mb-2">Heading Level</label>
                  <select
                    value={selectedElement.headingLevel}
                    onChange={(e) => updateElement(selectedElement.id, { headingLevel: e.target.value })}
                    className="control-select"
                  >
                    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(level => (
                      <option key={level} value={level}>{level.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Anchor URL */}
              {selectedElement.type === 'anchor' && (
                <div>
                  <label className="block text-cyan-300 text-sm mb-2">URL</label>
                  <input
                    type="text"
                    value={selectedElement.href}
                    onChange={(e) => updateElement(selectedElement.id, { href: e.target.value })}
                    className="control-input"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {/* Image Upload */}
              {selectedElement.type === 'image' && (
                <>
                  <div>
                    <label className="block text-cyan-300 text-sm mb-2">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(selectedElement.id, e.target.files[0])}
                      className="control-input"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 text-sm mb-2">Alt Text</label>
                    <input
                      type="text"
                      value={selectedElement.alt}
                      onChange={(e) => updateElement(selectedElement.id, { alt: e.target.value })}
                      className="control-input"
                      placeholder="Image description"
                    />
                  </div>
                  
                  {/* Custom Dimensions */}
                  <div className="p-3 bg-purple-900/20 rounded border border-cyan-400/30">
                    <label className="flex items-center gap-2 text-cyan-300 text-sm mb-3">
                      <input
                        type="checkbox"
                        checked={selectedElement.useCustomSize || false}
                        onChange={(e) => updateElement(selectedElement.id, { useCustomSize: e.target.checked })}
                        className="w-4 h-4"
                      />
                      Use Custom Dimensions (px)
                    </label>
                    
                    {selectedElement.useCustomSize && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Width (px)</label>
                          <input
                            type="number"
                            value={selectedElement.customWidth || ''}
                            onChange={(e) => updateElement(selectedElement.id, { customWidth: e.target.value })}
                            className="control-input text-sm"
                            placeholder="e.g., 300"
                          />
                        </div>
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Height (px)</label>
                          <input
                            type="number"
                            value={selectedElement.customHeight || ''}
                            onChange={(e) => updateElement(selectedElement.id, { customHeight: e.target.value })}
                            className="control-input text-sm"
                            placeholder="e.g., 200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Marquee Controls */}
              {selectedElement.type === 'marquee' && (
                <>
                  <div>
                    <label className="block text-cyan-300 text-sm mb-2">Speed</label>
                    <select
                      value={selectedElement.speed}
                      onChange={(e) => updateElement(selectedElement.id, { speed: e.target.value })}
                      className="control-select"
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cyan-300 text-sm mb-2">Direction</label>
                    <select
                      value={selectedElement.direction}
                      onChange={(e) => updateElement(selectedElement.id, { direction: e.target.value })}
                      className="control-select"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                    </select>
                  </div>
                </>
              )}

              {/* List Items */}
              {(selectedElement.type === 'ul' || selectedElement.type === 'ol') && (
                <div>
                  <label className="block text-cyan-300 text-sm mb-2">List Items</label>
                  {selectedElement.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateListItem(selectedElement.id, idx, e.target.value)}
                        className="control-input flex-1"
                      />
                      <button
                        onClick={() => deleteListItem(selectedElement.id, idx)}
                        className="bg-red-900/50 border border-red-400 text-red-300 px-2 rounded hover:bg-[#FA9F42] hover:border-[#FA9F42] hover:text-black"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem(selectedElement.id)}
                    className="bg-purple-900/50 border border-cyan-400 text-cyan-300 px-4 py-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white w-full mt-2"
                  >
                    + Add Item
                  </button>
                </div>
              )}

              {/* Definition List */}
              {selectedElement.type === 'dl' && (
                <div>
                  <label className="block text-cyan-300 text-sm mb-2">Definition Items</label>
                  {selectedElement.items.map((item, idx) => (
                    <div key={idx} className="mb-3 p-3 bg-purple-900/20 rounded border border-cyan-400/30">
                      <input
                        type="text"
                        value={item.term}
                        onChange={(e) => {
                          const newItems = [...selectedElement.items];
                          newItems[idx].term = e.target.value;
                          updateElement(selectedElement.id, { items: newItems });
                        }}
                        className="control-input mb-2"
                        placeholder="Term"
                      />
                      <input
                        type="text"
                        value={item.definition}
                        onChange={(e) => {
                          const newItems = [...selectedElement.items];
                          newItems[idx].definition = e.target.value;
                          updateElement(selectedElement.id, { items: newItems });
                        }}
                        className="control-input"
                        placeholder="Definition"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newItems = [...selectedElement.items, { term: 'Term', definition: 'Definition' }];
                      updateElement(selectedElement.id, { items: newItems });
                    }}
                    className="bg-purple-900/50 border border-cyan-400 text-cyan-300 px-4 py-2 rounded hover:bg-[#0037CA] hover:border-[#0037CA] hover:text-white w-full"
                  >
                    + Add Definition
                  </button>
                </div>
              )}

              {/* Typography Styles */}
              <div className="border-t border-cyan-400/30 pt-4 mt-4">
                <h3 className="text-cyan-300 text-sm font-bold mb-3">TYPOGRAPHY</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Font Size */}
                  <div className="col-span-2">
                    <label className="block text-cyan-300 text-xs mb-1">Font Size</label>
                    <select
                      value={selectedElement.styles.fontSize}
                      onChange={(e) => updateStyles(selectedElement.id, { fontSize: e.target.value })}
                      className="control-select text-sm"
                    >
                      {['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Weight */}
                  <div className="col-span-2">
                    <label className="block text-cyan-300 text-xs mb-1">Font Weight</label>
                    <select
                      value={selectedElement.styles.fontWeight}
                      onChange={(e) => updateStyles(selectedElement.id, { fontWeight: e.target.value })}
                      className="control-select text-sm"
                    >
                      {['font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'].map(weight => (
                        <option key={weight} value={weight}>{weight}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Family */}
                  <div className="col-span-2">
                    <label className="block text-cyan-300 text-xs mb-1">Font Family</label>
                    <select
                      value={selectedElement.styles.fontFamily}
                      onChange={(e) => updateStyles(selectedElement.id, { fontFamily: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">Default</option>
                      <option value="font-sans" style={{ fontFamily: 'system-ui, sans-serif' }}>Sans Serif</option>
                      <option value="font-serif" style={{ fontFamily: 'serif' }}>Serif</option>
                      <option value="font-mono" style={{ fontFamily: 'monospace' }}>Monospace</option>
                      <option value="poppins" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</option>
                      <option value="orbitron" style={{ fontFamily: 'Orbitron, monospace' }}>Orbitron</option>
                      <option value="courier" style={{ fontFamily: 'Courier Prime, monospace' }}>Courier Prime</option>
                    </select>
                  </div>

                  {/* Font Color */}
                  <div className="col-span-2">
                    <label className="block text-cyan-300 text-xs mb-1">Font Color</label>
                    <select
                      value={selectedElement.styles.color}
                      onChange={(e) => updateStyles(selectedElement.id, { color: e.target.value, gradient: '' })}
                      className="control-select text-sm"
                    >
                      {['text-gray-900', 'text-gray-700', 'text-gray-500', 'text-blue-500', 'text-blue-700', 'text-red-500', 'text-red-700', 'text-green-500', 'text-green-700', 'text-purple-500', 'text-purple-700', 'text-yellow-500', 'text-pink-500', 'text-cyan-500', 'text-white'].map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gradient */}
                  <div className="col-span-2">
                    <label className="block text-cyan-300 text-xs mb-1">Gradient (overrides color)</label>
                    <select
                      value={selectedElement.styles.gradient}
                      onChange={(e) => updateStyles(selectedElement.id, { gradient: e.target.value, color: e.target.value ? 'text-transparent bg-clip-text' : selectedElement.styles.color })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="bg-gradient-to-r from-blue-500 to-green-500">Blue to Green</option>
                      <option value="bg-gradient-to-r from-purple-500 to-pink-500">Purple to Pink</option>
                      <option value="bg-gradient-to-r from-yellow-500 to-red-500">Yellow to Red</option>
                      <option value="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">Rainbow</option>
                      <option value="bg-gradient-to-r from-cyan-500 to-blue-500">Cyan to Blue</option>
                    </select>
                  </div>

                  {/* Font Style */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Style</label>
                    <select
                      value={selectedElement.styles.fontStyle}
                      onChange={(e) => updateStyles(selectedElement.id, { fontStyle: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">Normal</option>
                      <option value="italic">Italic</option>
                    </select>
                  </div>

                  {/* Text Transform */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Transform</label>
                    <select
                      value={selectedElement.styles.textTransform}
                      onChange={(e) => updateStyles(selectedElement.id, { textTransform: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="uppercase">UPPERCASE</option>
                      <option value="lowercase">lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </div>

                  {/* Text Decoration */}
                  <div className="col-span-2">
                    <label className="block text-cyan-300 text-xs mb-1">Decoration</label>
                    <select
                      value={selectedElement.styles.textDecoration}
                      onChange={(e) => updateStyles(selectedElement.id, { textDecoration: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="underline">Underline</option>
                      <option value="line-through">Line Through</option>
                      <option value="no-underline">No Underline</option>
                    </select>
                  </div>

                  {/* Text Align */}
                  <div className="col-span-2">
                    <label className="block text-cyan-300 text-xs mb-1">Alignment</label>
                    <select
                      value={selectedElement.styles.textAlign}
                      onChange={(e) => updateStyles(selectedElement.id, { textAlign: e.target.value })}
                      className="control-select text-sm"
                    >
                      {['text-left', 'text-center', 'text-right', 'text-justify'].map(align => (
                        <option key={align} value={align}>{align}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout Styles (for div/span) */}
              {(selectedElement.type === 'div' || selectedElement.type === 'span') && (
                <div className="border-t border-cyan-400/30 pt-4 mt-4">
                  <h3 className="text-cyan-300 text-sm font-bold mb-3">LAYOUT</h3>
                  
                  <div className="space-y-3">
                    {/* Layout Type */}
                    <div>
                      <label className="block text-cyan-300 text-xs mb-1">Layout Type</label>
                      <select
                        value={selectedElement.styles.layout}
                        onChange={(e) => updateStyles(selectedElement.id, { layout: e.target.value })}
                        className="control-select text-sm"
                      >
                        <option value="block">Block</option>
                        <option value="flex">Flex</option>
                        <option value="grid">Grid</option>
                        <option value="inline-block">Inline Block</option>
                      </select>
                    </div>

                    {/* Grid Columns */}
                    {selectedElement.styles.layout === 'grid' && (
                      <>
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Grid Columns</label>
                          <select
                            value={selectedElement.styles.gridCols}
                            onChange={(e) => updateStyles(selectedElement.id, { gridCols: e.target.value })}
                            className="control-select text-sm"
                          >
                            <option value="">Auto</option>
                            <option value="grid-cols-1">1 Column</option>
                            <option value="grid-cols-2">2 Columns</option>
                            <option value="grid-cols-3">3 Columns</option>
                            <option value="grid-cols-4">4 Columns</option>
                            <option value="grid-cols-5">5 Columns</option>
                            <option value="grid-cols-6">6 Columns</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Gap</label>
                          <select
                            value={selectedElement.styles.gap}
                            onChange={(e) => updateStyles(selectedElement.id, { gap: e.target.value })}
                            className="control-select text-sm"
                          >
                            <option value="">No Gap</option>
                            <option value="gap-1">Gap 1</option>
                            <option value="gap-2">Gap 2</option>
                            <option value="gap-4">Gap 4</option>
                            <option value="gap-6">Gap 6</option>
                            <option value="gap-8">Gap 8</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Flex Options */}
                    {selectedElement.styles.layout === 'flex' && (
                      <>
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Flex Direction</label>
                          <select
                            value={selectedElement.styles.flexDirection}
                            onChange={(e) => updateStyles(selectedElement.id, { flexDirection: e.target.value })}
                            className="control-select text-sm"
                          >
                            <option value="">Row</option>
                            <option value="flex-col">Column</option>
                            <option value="flex-row-reverse">Row Reverse</option>
                            <option value="flex-col-reverse">Column Reverse</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Justify Content</label>
                          <select
                            value={selectedElement.styles.justifyContent}
                            onChange={(e) => updateStyles(selectedElement.id, { justifyContent: e.target.value })}
                            className="control-select text-sm"
                          >
                            <option value="">Start</option>
                            <option value="justify-center">Center</option>
                            <option value="justify-between">Between</option>
                            <option value="justify-around">Around</option>
                            <option value="justify-evenly">Evenly</option>
                            <option value="justify-end">End</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Align Items</label>
                          <select
                            value={selectedElement.styles.alignItems}
                            onChange={(e) => updateStyles(selectedElement.id, { alignItems: e.target.value })}
                            className="control-select text-sm"
                          >
                            <option value="">Stretch</option>
                            <option value="items-center">Center</option>
                            <option value="items-start">Start</option>
                            <option value="items-end">End</option>
                            <option value="items-baseline">Baseline</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-cyan-300 text-xs mb-1">Gap</label>
                          <select
                            value={selectedElement.styles.gap}
                            onChange={(e) => updateStyles(selectedElement.id, { gap: e.target.value })}
                            className="control-select text-sm"
                          >
                            <option value="">No Gap</option>
                            <option value="gap-1">Gap 1</option>
                            <option value="gap-2">Gap 2</option>
                            <option value="gap-4">Gap 4</option>
                            <option value="gap-6">Gap 6</option>
                            <option value="gap-8">Gap 8</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Spacing & Dimensions */}
              <div className="border-t border-cyan-400/30 pt-4 mt-4">
                <h3 className="text-cyan-300 text-sm font-bold mb-3">SPACING & SIZE</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Padding */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Padding</label>
                    <select
                      value={selectedElement.styles.padding}
                      onChange={(e) => updateStyles(selectedElement.id, { padding: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="p-1">P-1</option>
                      <option value="p-2">P-2</option>
                      <option value="p-4">P-4</option>
                      <option value="p-6">P-6</option>
                      <option value="p-8">P-8</option>
                    </select>
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Margin</label>
                    <select
                      value={selectedElement.styles.margin}
                      onChange={(e) => updateStyles(selectedElement.id, { margin: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="m-1">M-1</option>
                      <option value="m-2">M-2</option>
                      <option value="m-4">M-4</option>
                      <option value="m-6">M-6</option>
                      <option value="m-8">M-8</option>
                    </select>
                  </div>

                  {/* Width */}
                  {selectedElement.type === 'image' && !selectedElement.useCustomSize && (
                    <div className="col-span-2">
                      <label className="block text-cyan-300 text-xs mb-1">Width (Tailwind)</label>
                      <select
                        value={selectedElement.styles.width}
                        onChange={(e) => updateStyles(selectedElement.id, { width: e.target.value })}
                        className="control-select text-sm"
                      >
                        <option value="w-auto">Auto</option>
                        <option value="w-full">Full</option>
                        <option value="w-1/2">1/2</option>
                        <option value="w-1/3">1/3</option>
                        <option value="w-1/4">1/4</option>
                        <option value="w-32">32px</option>
                        <option value="w-64">64px</option>
                      </select>
                    </div>
                  )}

                  {/* Height */}
                  {selectedElement.type === 'image' && !selectedElement.useCustomSize && (
                    <div className="col-span-2">
                      <label className="block text-cyan-300 text-xs mb-1">Height (Tailwind)</label>
                      <select
                        value={selectedElement.styles.height}
                        onChange={(e) => updateStyles(selectedElement.id, { height: e.target.value })}
                        className="control-select text-sm"
                      >
                        <option value="h-auto">Auto</option>
                        <option value="h-32">32px</option>
                        <option value="h-64">64px</option>
                        <option value="h-96">96px</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Effects */}
              <div className="border-t border-cyan-400/30 pt-4 mt-4">
                <h3 className="text-cyan-300 text-sm font-bold mb-3">VISUAL EFFECTS</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Border */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Border</label>
                    <select
                      value={selectedElement.styles.border}
                      onChange={(e) => updateStyles(selectedElement.id, { border: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="border">Border</option>
                      <option value="border-2">Border 2</option>
                      <option value="border-4">Border 4</option>
                    </select>
                  </div>

                  {/* Border Color */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Border Color</label>
                    <select
                      value={selectedElement.styles.borderColor}
                      onChange={(e) => updateStyles(selectedElement.id, { borderColor: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">Default</option>
                      <option value="border-gray-300">Gray</option>
                      <option value="border-blue-500">Blue</option>
                      <option value="border-red-500">Red</option>
                      <option value="border-green-500">Green</option>
                      <option value="border-purple-500">Purple</option>
                    </select>
                  </div>

                  {/* Rounded */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Rounded</label>
                    <select
                      value={selectedElement.styles.rounded}
                      onChange={(e) => updateStyles(selectedElement.id, { rounded: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="rounded">Rounded</option>
                      <option value="rounded-lg">Rounded LG</option>
                      <option value="rounded-full">Rounded Full</option>
                    </select>
                  </div>

                  {/* Shadow */}
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">Shadow</label>
                    <select
                      value={selectedElement.styles.shadow}
                      onChange={(e) => updateStyles(selectedElement.id, { shadow: e.target.value })}
                      className="control-select text-sm"
                    >
                      <option value="">None</option>
                      <option value="shadow">Shadow</option>
                      <option value="shadow-md">Shadow MD</option>
                      <option value="shadow-lg">Shadow LG</option>
                      <option value="shadow-xl">Shadow XL</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* List Style */}
              {(selectedElement.type === 'ul' || selectedElement.type === 'ol') && (
                <div className="border-t border-cyan-400/30 pt-4 mt-4">
                  <h3 className="text-cyan-300 text-sm font-bold mb-3">LIST STYLE</h3>
                  
                  <div>
                    <label className="block text-cyan-300 text-xs mb-1">List Style Type</label>
                    <select
                      value={selectedElement.styles.listStyle}
                      onChange={(e) => updateStyles(selectedElement.id, { listStyle: e.target.value })}
                      className="control-select text-sm"
                    >
                      {selectedElement.type === 'ul' ? (
                        <>
                          <option value="list-disc">Disc</option>
                          <option value="list-circle">Circle</option>
                          <option value="list-square">Square</option>
                          <option value="list-none">None</option>
                        </>
                      ) : (
                        <>
                          <option value="list-decimal">Decimal</option>
                          <option value="list-decimal-leading-zero">Decimal (0)</option>
                          <option value="list-lower-alpha">Lower Alpha</option>
                          <option value="list-upper-alpha">Upper Alpha</option>
                          <option value="list-lower-roman">Lower Roman</option>
                          <option value="list-upper-roman">Upper Roman</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedElement && elements.length > 0 && (
            <div className="p-6 text-center text-cyan-400/50">
              Click on an element in the preview to edit it
            </div>
          )}

          {elements.length === 0 && !showAddMenu && (
            <div className="p-6 text-center text-cyan-400/50">
              Click "Add Element" to start building your blog
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="bg-white p-12 overflow-y-auto" onClick={() => setSelectedElement(null)}>
          <div className="max-w-4xl mx-auto bg-white min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Blog Header Section */}
            <div className="mb-8">
              {/* Category Badge */}
              {blogMeta.category && (
                <div className="mb-4">
                  <span className="inline-flex rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-3 py-1 text-[11px] font-semibold">
                    {blogMeta.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-[22px] sm:text-[28px] font-bold text-[#111827] leading-tight">
                {metaTags.title}
              </h1>

              {/* Meta Info */}
              <div className="mt-2 text-[12px] text-slate-500 flex items-center gap-3">
                <span>{blogMeta.author}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{blogMeta.date}</span>
              </div>

              {/* Hero Image */}
              {blogMeta.heroImage && (
                <div className="mt-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
                  <img
                    src={blogMeta.heroImage}
                    alt={metaTags.title}
                    className="w-full h-[210px] sm:h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Blog Content */}
            {elements.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Type size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-xl">Your blog is empty. Add some elements to get started!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {elements.map((element) => (
                  <div key={element.id} className="relative group">
                    {renderElement(element)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default DynamicBlog;