"use client";

import { useEffect, useRef } from "react";

export default function Capabilities() {
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

  // 3D Isometric Card Tilt Logic
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth angle computation (max tilt of ~10 degrees)
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    card.style.borderColor = "rgba(207, 188, 255, 0.35)";
    card.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(207, 188, 255, 0.08)";
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    card.style.borderColor = "rgba(255, 255, 255, 0.06)";
    card.style.boxShadow = "none";
  };

  const capabilitiesList = [
    {
      phase: "PHASE 01",
      title: "MVP Creation",
      desc: "Rapid prototyping and industrial-grade development to take your vision from blueprint to market dominance in record time.",
      icon: "rocket_launch",
      colorClass: "text-[#cfbcff]",
      bgClass: "bg-[#cfbcff]/10",
      borderClass: "border-[#cfbcff]/20",
    },
    {
      phase: "PHASE 02",
      title: "Web Development",
      desc: "Scalable, secure, and visually stunning web architectures built with modern stacks that define technical excellence.",
      icon: "terminal",
      colorClass: "text-[#e7c365]",
      bgClass: "bg-[#e7c365]/10",
      borderClass: "border-[#e7c365]/20",
    },
    {
      phase: "PHASE 03",
      title: "ML Workflows",
      desc: "Integrating advanced machine learning pipelines and intelligent automation to forge smarter, self-optimizing ecosystems.",
      icon: "neurology",
      colorClass: "text-[#cdc0e9]",
      bgClass: "bg-[#cdc0e9]/10",
      borderClass: "border-[#cdc0e9]/20",
    },
    {
      phase: "PHASE 04",
      title: "App Development",
      desc: "iOS and Android experiences with polished UX, offline-ready flows, and store-ready releases built for retention.",
      icon: "smartphone",
      colorClass: "text-[#e0d2ff]",
      bgClass: "bg-[#6750a4]/10",
      borderClass: "border-[#6750a4]/20",
    },
    {
      phase: "PHASE 05",
      title: "Game Development",
      desc: "Playable prototypes through full builds—gameplay systems, multiplayer, and live ops tuned for engagement and scale.",
      icon: "sports_esports",
      colorClass: "text-[#c9a74d]",
      bgClass: "bg-[#c9a74d]/10",
      borderClass: "border-[#c9a74d]/20",
    },
  ];

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="zoom-section py-20 relative z-10 px-6 md:px-16"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4 text-[#e6e0e9]">
            Core Capabilities
          </h2>
          <div className="w-24 h-1 bg-[#cfbcff] rounded-full mx-auto md:mx-0"></div>
        </div>

        {/* 3-Column Capability Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilitiesList.map((item, idx) => (
            <div
              key={idx}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="glass-card p-10 rounded-2xl flex flex-col gap-8 h-full"
            >
              {/* Icon Container */}
              <div
                className={`w-14 h-14 rounded-xl ${item.bgClass} flex items-center justify-center border ${item.borderClass} ${item.colorClass}`}
              >
                <span className="material-symbols-outlined text-4xl select-none">
                  {item.icon}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-semibold text-[#e6e0e9]">
                  {item.title}
                </h3>
                <p className="font-body text-sm sm:text-base text-[#cbc4d2] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Serialization row */}
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <span className={`font-body text-[11px] font-bold tracking-[0.2em] ${item.colorClass}`}>
                  {item.phase}
                </span>
                <span 
                  className={`material-symbols-outlined ${item.colorClass} cursor-pointer hover:translate-x-2 transition-transform duration-300 text-2xl`}
                >
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
