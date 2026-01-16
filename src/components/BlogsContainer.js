
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BLOGS } from "../data/blogs";


export default function BlogsContainer() {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [page, setPage] = useState(1);

  const pageSize = 9;
  const filtered = useMemo(() => {
    if (activeCategory === "All Posts") return BLOGS;
    return BLOGS.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onFilter = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <section className="w-full bg-white font-poppins">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Filter Bar */}
        {/* <div className="rounded-2xl bg-[#F1EEFF] px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => onFilter(cat)}
                  className={[
                    "rounded-full px-4 py-2 text-[12px] sm:text-[13px] font-semibold",
                    "transition-colors",
                    isActive
                      ? "bg-[#0B3BFF] text-white"
                      : "bg-white text-[#111827] border border-[#E7E9F5] hover:bg-[#EEF1FF]",
                  ].join(" ")}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div> */}

        {/* Blog Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paged.map((b) => (
            <Link
              key={b.id}
              to={`/blog/${b.slug}`}
              className="block no-underline"
            >
              <article className="bg-white rounded-2xl border border-[#EEF1F6] shadow-[0_14px_40px_rgba(15,23,42,0.06)] overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(15,23,42,0.10)] transition-all">
                {/* Image */}
                <div className="p-4">
                  <div className="rounded-xl overflow-hidden bg-[#F3F4F6]">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-[170px] sm:h-[180px] object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 sm:h-[120px]">
                  <span className="inline-flex rounded-full bg-[#EEF1FF] text-[#0B3BFF] px-3 py-1 text-[11px] font-semibold">
                    {b.category}
                  </span>

                  <h3 className="mt-3 text-[15px] sm:text-[16px] font-bold text-[#111827] leading-snug">
                    {b.title}
                  </h3>

                  {/* <div className="mt-3 flex items-center justify-between text-[11px] text-[#6B7280]">
                    <span>{b.date}</span>
                    <span className="flex items-center gap-1">
                      <UserCircle2Icon className="h-4 w-4" />
                      {b.author}
                    </span>
                  </div> */}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {/* <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-8 w-8 px-1 rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F3F4F6] transition"
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </button>

          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
            const p = i + 1;
            const isActive = p === page;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={[
                  "h-8 w-8 rounded-full text-[12px] font-semibold transition",
                  isActive
                    ? "bg-[#0B3BFF] text-white shadow-[0_10px_18px_rgba(11,59,255,0.22)]"
                    : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F3F4F6]",
                ].join(" ")}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 w-8 px-1 rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F3F4F6] transition"
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </button>
        </div> */}
      </div>
    </section>
  );
}
