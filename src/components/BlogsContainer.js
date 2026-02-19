import { useMemo, useState } from "react";
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

        {/* Blog Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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