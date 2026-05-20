"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.remove("exit");
          } else {
            if (entry.boundingClientRect.top < 0) {
              entry.target.classList.add("exit");
            } else {
              entry.target.classList.remove("visible");
              entry.target.classList.remove("exit");
            }
          }
        });
      },
      { threshold: [0, 0.1, 0.5, 0.9] }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleLaunchClick = () => {
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExploreClick = () => {
    document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="zoom-section relative pt-48 pb-20 min-h-screen flex items-center justify-center overflow-hidden z-10 px-6 md:px-16"
    >
      <div className="max-w-4xl text-center space-y-8 flex flex-col items-center">
        {/* Release Version Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#cfbcff]/20 bg-[#cfbcff]/5 mb-4 select-none">
          <span className="led-dot led-pulse"></span>
          <span className="font-sans text-[11px] font-bold tracking-[0.15em] text-[#cfbcff] uppercase">
            STABLE RELEASE V2.4
          </span>
        </div>

        {/* Display Heading */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-[-0.03em] text-[#e6e0e9] max-w-3xl">
          Architecting the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cfbcff] via-[#cdc0e9] to-[#e7c365]">
            Digital Future
          </span>
        </h1>

        {/* Supporting Subheading */}
        <p className="font-body text-base sm:text-lg md:text-xl text-[#cbc4d2] max-w-2xl mx-auto leading-relaxed">
          Elite MVP Creation, Web Development, and ML Workflows engineered for visionary founders and high-growth enterprises.
        </p>

        {/* Interactive Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
          <button 
            onClick={handleLaunchClick}
            className="btn-neon-primary px-10 py-4.5 rounded-xl text-base font-bold transition-all shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:shadow-[0_0_30px_rgba(0,242,255,0.35)]"
          >
            Launch Your Vision
          </button>
          <button 
            onClick={handleExploreClick}
            className="btn-neon-secondary px-10 py-4.5 rounded-xl text-base font-bold transition-all"
          >
            Explore Foundry
          </button>
        </div>
      </div>
    </section>
  );
}
