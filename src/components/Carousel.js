import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";

export default function Carousel() {
  const projects = [
    {
      id: 1,
      title: "Ratna Bhoomi Developers Website",
      description:
        "Designed and developed the application using the MERN stack with a custom CRM for lead tracking. Deployed on Hostinger to deliver a seamless, scalable solution.",
      image: "/images/rbd.webp",
      mobileImage: "/images/rbd.webp",
    },
    {
      id: 2,
      title: "Landing page for SLV Golden Towers",
      description:
        "Designed the UI in Figma, developed the application using the MERN stack, and successfully deployed it on Hostinger, ensuring complete client satisfaction.",
      image: "/images/slv.webp",
      mobileImage: "/images/slv.webp",
    },
    {
      id: 3,
      title: "PPC Leads for Northern Lights Project",
      description:
        "Generated qualified buyer leads using data-driven PPC campaigns, optimized keywords, and conversion-focused ad strategies for Northern Lights.",
      image: "/images/northern_lights.webp",
      mobileImage: "/images/northern_lights.webp",
    },
  ];

  const [activeProject, setActiveProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProject = projects[1];

  return (
    <section className="w-full mt-16 mb-8 font-poppins bg-white py-2 md:py-0 md:h-[720px]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        {/* ✅ mobile: content-based height | desktop: fixed + centered */}
        <div className="flex flex-col md:h-[640px] md:justify-center">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-[24px] md:text-[64px] font-bold text-[#2B2B2B] mb-3 md:mb-6">
              Our Recent Works
            </h2>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8 lg:gap-12 xl:gap-14 flex-1 items-center">
            {/* Featured */}
            <div className="col-span-2 relative group h-[533px]">
              <div className="relative h-full rounded-3xl overflow-hidden">
                <img
                  src={activeProject?.image || featuredProject.image}
                  alt={activeProject?.title || featuredProject.title}
                  className="w-full h-[520px] border-1 border-[#FFDEBB] rounded-3xl transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="relative flex justify-center items-center z-10 w-full max-w-2xl md:max-w-4xl lg:max-w-5xl">
                    <div className="text-[#777777] text-base lg:text-lg leading-relaxed p-4 tracking-wide drop-shadow-xl font-light w-[700px] h-[130px] bg-white/90 hover:bg-white/95 cursor-pointer backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-500">
                      <h3 className="text-[#0037CA] font-semibold text-[16px] lg:text-[16px] xl:text-[16px] leading-tight drop-shadow-2xl tracking-tight">
                        {activeProject?.title || featuredProject.title}
                      </h3>
                      <p className="text-[#2B2B2B] text-base lg:text-[14px] xl:text-[14px] leading-relaxed tracking-wide">
                        {activeProject?.description || featuredProject.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side cards - show the other two, NOT the featured */}
            <div className="space-y-8">
              {projects
                .filter((p) => p.id !== featuredProject.id)
                .map((project) => (
                  <div
                    key={project.id}
                    className="h-[240px] lg:h-[250px] rounded-2xl overflow-hidden cursor-pointer relative transition-transform duration-300 hover:-translate-y-2"
                    onMouseEnter={() => setActiveProject(project)}
                    onMouseLeave={() => setActiveProject(null)}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover border-1 border-[#FFDEBB] rounded-2xl transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 p-6 flex items-end justify-center">
                      <h4 className="text-[#0037CA] bg-white/90 font-semibold text-[14px] px-3 py-1 rounded-md shadow-sm backdrop-blur-sm border border-white/50 hover:bg-white/95 transition-all duration-300">
                        {project.title}
                      </h4>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative overflow-x-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {projects.map((project) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <div className="h-[300px] w-[342px] mx-auto rounded-2xl overflow-hidden relative cursor-pointer transition-transform duration-300 hover:-translate-y-2">
                    <img
                      src={project.mobileImage}
                      alt={project.title}
                      className="w-full h-full object-cover border-1 border-[#FFDEBB] rounded-2xl transition-transform duration-700 hover:scale-110"
                    />

                    <div className="absolute inset-0 px-2 flex items-end justify-center">
                      <div className="text-[#0037CA] bg-white/90  px-2 mb-2 py-1 h-[111px] w-[320px] rounded-md shadow-sm backdrop-blur-sm border border-white/50 hover:bg-white/90 transition-all duration-300">
                        <span className="font-semibold text-[14px]">{project.title}</span>
                        <p className="text-[#2B2B2B] mt-1 text-[12px]">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Arrows */}
          <div className="md:hidden flex justify-center gap-4 mt-4">
            <button
              className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center disabled:opacity-40"
              onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
              disabled={currentSlide === 0}
            >
              <ChevronLeftIcon />
            </button>

            <button
              className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center disabled:opacity-40"
              onClick={() =>
                setCurrentSlide((p) => Math.min(projects.length - 1, p + 1))
              }
              disabled={currentSlide === projects.length - 1}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
