import { useState, useMemo, useRef } from "react";
import { BLOGS } from "../data/blogs";

export default function BlogsContainer() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const filterRef = useRef(null);

  const pageSize = 9;

  const FILTERS = ["All", ...new Set(BLOGS.map((b) => b.category.trim()))];

  const filtered = useMemo(() => {
    if (activeCategory === "All") return BLOGS;
    return BLOGS.filter(
      (b) => b.category.trim() === activeCategory.trim()
    );
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onFilterChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <section className="w-full bg-white font-poppins">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10">

        {/* ✅ Filter Section */}
        <div
          ref={filterRef}
          className="mb-8 rounded-3xl sm:rounded-full border border-[#ded8fa] bg-[#F1EEFF] px-3 py-3 sm:px-4 sm:py-4"
        >
          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <label className="block text-[16px] font-semibold text-[#111827] mb-2">
              Filter by category
            </label>

            <select
              value={activeCategory}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full rounded-xl bg-white border border-[#E7E9F5] px-4 py-3 text-[13px] font-semibold text-[#111827]"
            >
              {FILTERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Pills */}
          <div className="hidden sm:flex flex-wrap gap-3">
            {FILTERS.map((filter) => {
              const isActive = filter === activeCategory;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => onFilterChange(filter)}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#0B3BFF] text-white"
                      : "bg-white text-[#111827] border border-[#E7E9F5] hover:bg-[#EEF1FF]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* ✅ Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paged.map((b) => (
            <a
              key={b.id}
              href={`/blog/${b.slug}`}
              className="block no-underline"
            >
              <article className="bg-white rounded-2xl border border-[#EEF1F6] shadow-[0_14px_40px_rgba(15,23,42,0.06)] overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(15,23,42,0.10)] transition-all">
                <div className="p-4">
                  <div className="rounded-xl overflow-hidden bg-[#F3F4F6]">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-[170px] sm:h-[180px] object-cover"
                    />
                  </div>
                </div>
                <div className="px-4 pb-4 sm:h-[120px]">
                  <span className="inline-flex rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-3 py-1 text-[11px] font-semibold">
                    {b.category}
                  </span>
                  <h3 className="mt-3 text-[15px] sm:text-[16px] font-bold text-[#111827] leading-snug">
                    {b.title}
                  </h3>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
