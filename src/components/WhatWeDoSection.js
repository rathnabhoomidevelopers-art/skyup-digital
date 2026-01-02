 import { BarChart3, Palette, Code2, Bot, ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Digital Marketing",
    desc: "Grow your brand with expert digital marketing: SEO, Google Ads, social media, and more.",
    button: "View More",
    cardBg: "bg-[#ffff]",
    pillBg: "bg-[#e1e7ff]",
    border: "border-[#dbe2ff]",
    icon: "/images/cta_service_2.svg",
  },
  {
    title: "Design & Branding",
    desc: "Modern brand identities, UI/UX, logos, social media creatives & complete brand systems.",
    button: "View More",
    cardBg: "bg-[#ffff]",
    pillBg: "bg-[#e1e7ff]",
    border: "border-[#ffe0bd]",
    icon: "/images/service_icon_4.svg",
   
  },
  {
    title: "Web Development",
    desc: "We build responsive, high-performance websites that are secure, scalable, and SEO-friendly.",
    button: "View More",
    cardBg: "bg-[#ffff]",
    pillBg: "bg-[#e1e7ff]",
    border: "border-[#dbe2ff]",
    icon: "/images/service_icon_7.svg",
   
  },
  {
    title: "AI-Automation",
    desc: "AI-powered automation that helps businesses work smarter, faster, and more efficiently.",
    button: "View More",
    cardBg: "bg-[#ffff]",
    pillBg: "bg-[#e1e7ff]",
    border: "border-[#ffe0bd]",
    icon: "/images/service_icon_9.svg",
   
  },
];

export default function WhatWeDo() {
  const navigate = useNavigate();

  const onViewMore = (serviceTitle) => {
    // change "/service" if your route is different
    navigate(`/service?category=${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <section className="w-full font-poppins bg-[#F8FAFC] py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Headings */}
        <div className="text-center mb-10">
          <p className="text-[18px] sm:text-[24px] font-bold text-[#0037CA]">
            WHAT WE DO
          </p>
          <h2 className="mt-2 text-[24px] sm:text-[44px] font-bold text-[#111827]">
            Digital Solutions That Work
          </h2>
          <p className="mt-4 mx-auto text-[14px] sm:text-[18px] text-[#2B2B2B]">
            We deliver deeply integrated digital solutions built to solve complex
            challenges and create measurable impact.
          </p>
        </div>

        {/* Cards */}
        <div
          className="
            grid 
            grid-cols-1
            gap-6 
            sm:gap-10
            lg:gap-12                // larger gap on lg+ (1024px+)
            xl:gap-40                // even larger on xl+ (1280px+)
            md:grid-cols-2 
            xl:grid-cols-4 
            justify-items-center
            mx-auto
          "
        >


          {services.map((item) => {
           
            return (
              <div
                key={item.title}
                className={`${item.cardBg} border ${item.border} rounded-3xl 
                  w-full max-w-[340px] h-[300px] sm:w-[304px] sm:h-[345px] 
                  px-6 py-8 
                  flex flex-col justify-center items-center
                  shadow-[0_20px_40px_rgba(15,23,42,0.04)]`}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6">
                  {typeof item.icon === "string" ? (
                    <img
                      src={item.icon}
                      alt={`${item.title} icon`}
                      className="w-12 h-12"
                    />
                  ) : (
                    <item.icon className={`w-11 h-11`} />
                  )}
                </div>


                <h3 className="text-lg font-semibold text-[#111827] mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-[#2B2B2B] mb-3 flex-1 text-center">
                  {item.desc}
                </p>

                <button
                  type="button"
                  onClick={() => onViewMore(item.title)}
                  className={`${item.pillBg} mt-auto inline-flex items-center justify-center rounded-full px-5 py-2 text-md font-semibold text-[#0037CA] tracking-wide shadow-[0_10px_25px_rgba(15,23,42,0.06)]`}
                >
                  {item.button}
                  <span className="ml-2"><ChevronRightIcon className="w-5 h-5"/></span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
