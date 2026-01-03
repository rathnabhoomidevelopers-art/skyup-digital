// src/components/JourneySection.jsx
import React from "react";

export default function JourneySection({ title, subTitle, steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-t from-[#EFF2FB] to-[#FFFFFF] py-12 md:py-16">
      <div className="max-w-[1450px] mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-[36px]">
          <h2 className="text-2xl md:text-[44px] font-bold text-gray-900">
            {title?.split(" ").slice(0, 1).join(" ") || "The"}{" "}
            <span className="text-[#0037CA]">
              {title?.split(" ").slice(1,1).join(" ") || "Journey"}{""}
            </span>&nbsp;
            {title?.split(" ").slice(2).join(" ") || "We Follow"}{""}
          </h2>
          <p className="sm:mt-9 text-sm md:text-[18px] sm:w-[1250px] mx-auto leading-snug text-[#2B2B2B]">
            {subTitle}
          </p>
        </div>

        {/* Mobile marquee (below sm) */}
        <div className="sm:hidden lg:hidden overflow-hidden">
          <div className="marquee">
            <div
              className="marquee-track"
              onTouchStart={(e) => e.currentTarget.classList.add("paused")}
              onTouchEnd={(e) => e.currentTarget.classList.remove("paused")}
            >
              {[...steps, ...steps].map((step, idx) => (
                <div
                  key={`${step.no}-${idx}`}
                  className="min-w-[210px] max-w-[210px] text-left"
                >
                  <div className="mb-2 inline-flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.10)] border border-[#E5E9F5]">
                    <span className="text-[28px] italic text-[#6B7280]">
                      {String(step.no).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-[14px] w-[160px] font-bold text-[#0B3BFF]">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-[12px] w-[200px] text-[#2B2B2B]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Normal grid for tablet/desktop */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-2 ps-4 items-start">
          {steps.map((step) => (
            <div key={step.no} className="text-left">
              <div className="mb-3 inline-flex h-[60px] w-[60px] items-center justify-center rounded-[14px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.10)] border border-[#E5E9F5]">
                <span className="text-[28px] italic text-[#6B7280]">
                  {String(step.no).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-[15px] sm:text-[20px] font-bold text-[#0B3BFF]">
                {step.title}
              </h3>

              <p className="mt-1 text-[13px] sm:text-[14px] leading-relaxed text-[#2B2B2B] max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
