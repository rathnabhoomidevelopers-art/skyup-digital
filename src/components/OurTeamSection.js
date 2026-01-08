import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const teamMembers = [
  {
    name: "Pooja S",
    role: "Managing Director",
    image: "/images/pooja_maam.webp",
    big: true
  },
  {
    name: "Md Ahmed",
    role: "Digital Marketing Lead",
    image: "/images/Ahmed.webp"
  },
  {
    name: "Rahulprasad H",
    role: "Digital Marketing Executive",
    image: "/images/Rahul.webp"
  },
  {
    name: "Shashank C Reddy",
    role: "Digital Marketing Executive",
    image: "/images/Shashank.webp"
  },
  {
    name: "Shashikant S B",
    role: "Full Stack Web Developer",
    image: "/images/shashi.webp"
  },
  {
    name: "Harish Moger",
    role: "UI/UX Designer - Level II",
    image: "/images/Harish.webp"
  }
];

export default function OurTeamSection() {
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const autoScrollRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const cardWidth = 300; // Fixed card width for mobile

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll logic for mobile
  useEffect(() => {
    if (!isMobile || !sliderRef.current || !isAutoScrolling) return;

    const slider = sliderRef.current;
    const totalScrollWidth = slider.scrollWidth;
    const totalCards = teamMembers.length;

    const scrollStep = () => {
      if (!slider) return;
      // Smoothly scroll by small increments
      slider.scrollBy({ left: 1, behavior: 'smooth' });
    };

    autoScrollRef.current = setInterval(() => {
      if (slider.scrollLeft + cardWidth >= totalScrollWidth - 1) {
        // Reset to start for seamless loop
        slider.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        scrollStep();
      }
    }, 16); // roughly 60fps

    return () => clearInterval(autoScrollRef.current);
  }, [isMobile, isAutoScrolling]);

  // Handle manual scroll
  const handleManualScroll = () => {
    if (!sliderRef.current) return;
    setIsAutoScrolling(false);
    clearInterval(autoScrollRef.current);
    // Resume auto scroll after 3 seconds of inactivity
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF5EB] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header omitted for brevity */}

        {/* Mobile Slider with snap */}
        <div className="lg:hidden relative">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollBehavior: 'smooth'
            }}
            onScroll={handleManualScroll}
            onTouchStart={() => {
              setIsAutoScrolling(false);
              clearInterval(autoScrollRef.current);
            }}
            onTouchEnd={() => {
              setTimeout(() => setIsAutoScrolling(true), 3000);
            }}
          >
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex-shrink-0 mx-2 snap-center"
                style={{ width: `${cardWidth}px` }}
              >
                <div className="relative overflow-hidden rounded-2xl border-1 border-[#FA9F43] w-full h-[300px] flex flex-col items-center pt-3">
                  <div className="w-[260px] h-[220px] flex justify-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-[215px] object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-4 right-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-700">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Hide scrollbar style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}