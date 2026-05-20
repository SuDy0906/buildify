"use client";

import { useEffect, useRef } from "react";

export default function CTA() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

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

  // 3D Isometric Card Tilt Logic specifically for CTA pane
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 45;
    const rotateY = (centerX - x) / 45;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="zoom-section py-20 px-6 md:px-16 relative z-10 overflow-hidden"
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="max-w-[1280px] mx-auto glass-card rounded-3xl text-center relative p-12 md:p-28 transition-all duration-700 overflow-hidden"
        style={{
          background: "rgba(15, 13, 19, 0.6)",
          backdropFilter: "blur(80px)",
          border: "1px solid rgba(207, 188, 255, 0.15)",
        }}
      >
        {/* Soft Radial Neon Spotlights in Background */}
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-[#cdc0e9]/8 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-[#cfbcff]/8 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#cfbcff]/3 via-transparent to-[#cdc0e9]/3 pointer-events-none"></div>

        <div className="relative z-10 space-y-8 flex flex-col items-center">
          {/* Display Heading */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#e6e0e9] leading-tight">
            Ready to Build?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cfbcff] via-[#cdc0e9] to-[#e7c365]">
              Let's talk.
            </span>
          </h2>

          {/* Core Copy */}
          <p className="font-body text-sm sm:text-base md:text-lg text-[#cbc4d2] max-w-2xl mx-auto leading-relaxed">
            Join the next wave of industry leaders who are transforming their sectors with Buildify. Your digital evolution starts here.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4 w-full sm:w-auto">
            <a
              href="mailto:contact@buildify.tech"
              className="btn-neon-primary px-10 py-4.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:shadow-[0_0_35px_rgba(0,242,255,0.35)] flex items-center justify-center gap-2 select-none w-full sm:w-auto"
            >
              Connect with an Expert{" "}
              <span className="material-symbols-outlined text-xl">bolt</span>
            </a>
            <a
              href="#capabilities"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-neon-secondary px-10 py-4.5 rounded-xl font-bold transition-all w-full sm:w-auto text-center"
            >
              View Case Studies
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
