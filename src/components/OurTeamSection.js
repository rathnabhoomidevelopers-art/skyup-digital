import React, { useRef } from "react";

export default function OurTeamSection() {
  const team = [
    { id: 1, name: "Ahmed Khan", designation: "SEO Specialist", img: "/images/ahmed.png" },
    { id: 2, name: "Rahul Prasad", designation: "Digital Marketing Lead", img: "/images/rahul.png" },
    { id: 3, name: "Shashikant S B", designation: "Full-Stack Developer", img: "/images/shashi.png" },
    { id: 4, name: "Shashank Reddy", designation: "Digital Marketing Executive", img: "/images/shashank.png" },
    { id: 5, name: "Harish Moger", designation: "UI/UX Designer - Level II", img: "/images/harish.png" },
    { id: 6, name: "Md Ahmed", designation: "SEO Specialist", img: "/images/ahmed.png" },
  ];

  const sliderRef = useRef(null);

  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .marquee-animation {
          animation: marquee 16s linear infinite;
          will-change: transform;
        }

        .group:hover .marquee-animation {
          animation-play-state: paused;
        }
      `}</style>

      <section className="w-full sm:h-[600px]">
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#041a5f] via-[#06257a] to-[#0b3aa7]">
          <div className="relative mx-auto text-center max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
            <h2 className="text-white font-poppins font-bold text-4xl md:text-[64px]">
              Our Expert Team
            </h2>
            <br/>
            <p className="mt-2 max-w-[1240px] text-white/80 font-poppins text-sm md:text-[18px]">
              We love what we do and we do it with passion. We value the
              experimentation of the message and smart incentives.
            </p>

            <div className="relative mt-10 overflow-hidden cursor-grab active:cursor-grabbing group">
              {/* w-max is important so the track width equals content width */}
              <div ref={sliderRef} className="flex w-max gap-8 marquee-animation">
                {/* First set */}
                {team.map((m) => (
                  <Slide key={`first-${m.id}`} {...m} />
                ))}
                {/* Second set */}
                {team.map((m) => (
                  <Slide key={`second-${m.id}`} {...m} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Slide({ img, name, designation }) {
  return (
    <div className="h-[320px] w-[280px] md:w-[250px] rounded-4 overflow-hidden flex-shrink-0 hover:scale-105 transition-all duration-300 group relative">
      <img
        src={img}
        alt={name}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => (e.currentTarget.src = "https://placehold.co/800x1000/png")}
      />
      {/* Dark overlay with text - bottom positioned */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        <div className="bg-black/70 backdrop-blur-md border-1 border-white w-[230px] rounded-4  pt-2  flex flex-col items-center ">
          <h3 className="font-bold text-[16px] font-poppins drop-shadow-lg text-white">{name}</h3>
          <p className="text-[14px] opacity-90 font-medium font-poppins text-white">{designation}</p>
        </div>
      </div>

    </div>
  );
}
