"use client";

import { useEffect, useRef } from "react";

export default function Team() {
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

  // 3D Card tilt effect for profile panels
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 35;
    const rotateY = (centerX - x) / 35;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
  };

  return (
    <section
      id="team"
      ref={sectionRef}
      className="zoom-section py-20 bg-[#0f0d13]/30 relative z-10 px-6 md:px-16"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24 space-y-4">
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#e6e0e9]">
            The Minds Behind the Tech
          </h2>
          <p className="font-body text-sm sm:text-base text-[#cbc4d2] max-w-xl mx-auto leading-relaxed">
            Our elite team blends architectural precision with breakthrough innovation.
          </p>
        </div>

        {/* Staggered Profile Panels Container */}
        <div className="flex flex-col gap-12 max-w-5xl mx-auto w-full">
          
          {/* Profile 1 - Left Staggered (Marcus Thorne) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="slide-left glass-card flex flex-col md:flex-row gap-8 p-8 md:p-10 rounded-2xl w-full md:w-[85%] self-start border-l-4 border-l-[#cfbcff]/30"
          >
            {/* Grayscale profile photo */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden shrink-0 border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoPg8ywfdMQ7HZDKYlRLGo2XMViXWWpW0dfFn_fJOUWwpsSRdpA3qE96zaFNMDxwnAtP6z1IupjbgNfaPzJGHZI4dPIRqRSRbSeWNqM-AvLH74var4VeEUxV_5eqcrwb5_waa32fu4zUr_avg4tgtv9rSlnJZ7axUhKwjhS-N4PGpIMJVkLpLpGXWKePoRf7S7dNWVE_GOCoqWjYjSNIS_MhBKiEq1JaXLzOOjpLXR2V_HUBptaBbSpUuh6mTLBWIjVxlZAx0Vuzk"
                alt="Marcus Thorne - Lead Architect"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
            {/* Bio text detail */}
            <div className="flex flex-col justify-center space-y-4">
              <h4 className="font-display text-3xl sm:text-[40px] leading-tight font-semibold text-[#e6e0e9]">
                Marcus Thorne
              </h4>
              <p className="font-sans text-[11px] font-bold tracking-[0.25em] text-[#cfbcff] uppercase">
                Lead Architect
              </p>
              <p className="font-body text-base text-[#cbc4d2] leading-relaxed">
                Spearheading system design and global technical strategy for elite digital deployments, ensuring absolute scalability and architectural integrity.
              </p>
            </div>
          </div>

          {/* Profile 2 - Right Staggered (Elena Vance) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="slide-right glass-card flex flex-col md:flex-row gap-8 p-8 md:p-10 rounded-2xl w-full md:w-[85%] self-end border-r-4 border-r-[#cdc0e9]/30"
          >
            {/* Grayscale profile photo */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden shrink-0 border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out md:order-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_HXFd9vrnLDl7R4LcpcIqXKdwvVECQfkByodTZ1WyHMSBdtlFZiV40tK5XFaPYQ98HWIZUhTK71aMY85TPlxxq7MLlLGxKAtVIQt8OQaHFmnXf53yhJm5kmcTHkznCj3O4TpWD-38YerdhG9TbByM3ApVt4qF5y6fXU_FujGWLF3CX4C3w002739rw01WHsk30By3VNtzi-uWA-pkTSrXFEKd_L0Z4y-BxWVLl7eSgONosLQoga5bdzRpWZweDtWh873f3HzXWdM"
                alt="Elena Vance - ML Specialist"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
            {/* Bio text detail */}
            <div className="flex flex-col justify-center space-y-4 md:text-right md:order-1">
              <h4 className="font-display text-3xl sm:text-[40px] leading-tight font-semibold text-[#e6e0e9]">
                Elena Vance
              </h4>
              <p className="font-sans text-[11px] font-bold tracking-[0.25em] text-[#cdc0e9] uppercase">
                ML Specialist
              </p>
              <p className="font-body text-base text-[#cbc4d2] leading-relaxed">
                Pioneering algorithmic efficiency and neural network integration for enterprise solutions, building the intelligence that powers next-gen products.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
