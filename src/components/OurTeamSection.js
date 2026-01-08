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

// Create a duplicated array for seamless looping
const createLoopingCards = () => {
  return [...teamMembers, ...teamMembers, ...teamMembers];
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 15 }
  }
};

export default function OurTeamSection() {
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const [loopingCards] = useState(createLoopingCards());
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

  // Auto-scroll animation for mobile
  useEffect(() => {
    if (!isMobile || !sliderRef.current) return;

    const slider = sliderRef.current;
    const totalCards = loopingCards.length;
    const singleLoopDistance = teamMembers.length * cardWidth;
    let currentPosition = 0;
    let isAnimating = false;

    const animateScroll = () => {
      if (isAnimating) return;
      isAnimating = true;

      // Reset to middle section when reaching near the end
      if (currentPosition >= singleLoopDistance * 2) {
        currentPosition -= singleLoopDistance;
        slider.scrollLeft = currentPosition;
      }

      currentPosition += 0.5; // Adjust speed here (lower = slower)

      slider.scrollTo({
        left: currentPosition,
        behavior: 'auto'
      });

      isAnimating = false;
      animationRef.current = requestAnimationFrame(animateScroll);
    };

    // Start from the middle section for seamless looping
    currentPosition = singleLoopDistance;
    slider.scrollLeft = currentPosition;

    animationRef.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile, loopingCards.length]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF5EB] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-[40px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 className="text-3xl sm:text-4xl lg:text-[64px] font-bold text-[#1F2937] mb-2">
            Our Expert Team
          </motion.h2>
          <motion.p className="text-[14px] lg:text-lg text-[#2B2B2B] max-w-7xl lg:pt-[24px] mx-auto leading-relaxed">
            We love what we do and we do it with passion. We value the experimentation of the message and smart incentives.
          </motion.p>
        </motion.div>

        {/* Desktop Layout */}
        <motion.div
          className="hidden lg:grid lg:grid-cols-[432px_1fr] gap-8 max-w-[1256px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* LEFT: Big Pooja card (full height) */}
          <motion.div
            className="w-full lg:w-[432px] h-[614px] relative overflow-hidden rounded-2xl border-1 border-[#FA9F43] flex justify-center items-start"
            variants={itemVariants}
          >
            <img
              src={teamMembers[0].image}
              alt={teamMembers[0].name}
              className="lg:w-[416px] lg:h-[504px] object-cover rounded-xl mt-2"
              loading="lazy"
            />
            {/* Name overlay */}
            <div className="absolute bottom-2 left-6 right-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{teamMembers[0].name}</h3>
              <p className="text-base">{teamMembers[0].role}</p>
            </div>
          </motion.div>

          {/* RIGHT: Grid of small cards with equal sizing */}
          <div className="space-y-8">
            {/* TOP ROW: 3 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {teamMembers.slice(1, 4).map((member) => (
                <motion.div
                  key={member.name}
                  className="relative overflow-hidden rounded-2xl border-1 border-[#FA9F43] w-full h-[291px] flex justify-center items-start"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="lg:w-[222px] lg:h-[185px] mt-2 rounded-xl"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-4 right-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{member.name}</h3>
                    <p className="text-sm">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* BOTTOM ROW: 2 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {teamMembers.slice(4, 6).map((member) => (
                <motion.div
                  key={member.name}
                  className="relative overflow-hidden rounded-2xl border-1 border-[#FA9F43] w-full h-[291px] flex justify-center items-start"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="lg:w-[222px] lg:h-[185px] mt-2 rounded-xl"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-4 right-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{member.name}</h3>
                    <p className="text-sm">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile Slider */}
        <div className="lg:hidden">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {loopingCards.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                className="flex-shrink-0 mx-2 snap-center"
                style={{ width: `${cardWidth}px` }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* All cards same size on mobile */}
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
              </motion.div>
            ))}
          </div>
          
          {/* Scroll indicator dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {teamMembers.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-[#FA9F43] opacity-30"
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}