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
    role: "SEO Specialist",
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
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Auto-scroll animation for mobile with smooth transition
  useEffect(() => {
    if (!isMobile || !sliderRef.current || !isAutoScrolling) return;

    const slider = sliderRef.current;
    const totalCards = teamMembers.length;
    let currentPosition = currentIndex * cardWidth;
    let lastTime = 0;
    const scrollInterval = 16; // ms between scroll updates (smooth scrolling)
    const totalScrollDistance = totalCards * cardWidth;

    // 2 seconds loop duration
    const scrollSpeed = totalScrollDistance / (2000 / scrollInterval); // Adjusting to 2 seconds

    const animateScroll = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > scrollInterval) {
        if (currentPosition >= totalScrollDistance) {
          // Smoothly reset to first card
          currentPosition = 0;
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          currentPosition += scrollSpeed;
          slider.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
          });
        }
        
        setCurrentIndex(Math.round(currentPosition / cardWidth) % totalCards);
        lastTime = timestamp;
      }

      if (isAutoScrolling) {
        animationRef.current = requestAnimationFrame(animateScroll);
      }
    };

    animationRef.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile, isAutoScrolling, currentIndex]);

  // Manual scroll handlers
  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    
    setIsAutoScrolling(false); // Pause auto-scroll when user interacts
    
    const newIndex = (index + teamMembers.length) % teamMembers.length;
    setCurrentIndex(newIndex);
    
    sliderRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    });

    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  // Handle manual scroll
  const handleManualScroll = () => {
    if (!sliderRef.current) return;
    
    setIsAutoScrolling(false);
    const scrollLeft = sliderRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(newIndex);

    // Resume auto-scroll after 3 seconds of no manual interaction
    clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

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
            className="w-full lg:w-[432px] h-[614px] relative overflow-hidden rounded-2xl border border-[#FA9F43] flex justify-center items-start"
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
                  className="relative overflow-hidden rounded-2xl border border-[#FA9F43] w-full h-[291px] flex justify-center items-start"
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
                  className="relative overflow-hidden rounded-2xl border border-[#FA9F43] w-full h-[291px] flex justify-center items-start"
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
        <div className="lg:hidden relative">
          {/* Cards Slider */}
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
            }}
            onScroll={handleManualScroll}
            onTouchStart={() => setIsAutoScrolling(false)}
            onTouchEnd={() => setTimeout(() => setIsAutoScrolling(true), 3000)}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="flex-shrink-0 mx-2 snap-center"
                style={{ width: `${cardWidth}px` }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => scrollToIndex(index)}
              >
                {/* All cards same size on mobile */}
                <div className="relative overflow-hidden rounded-2xl border border-[#FA9F43] w-full h-[300px] flex flex-col items-center pt-3">
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
