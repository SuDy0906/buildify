"use client";

import { useEffect, useRef } from "react";

export default function Footer() {
  const brandTextRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!brandTextRef.current) return;
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      
      // Calculate opacity to peak (0.2) when scrolled near bottom
      const opacity = Math.max(0, (scrollPercent - 0.7) * 3); // Starts showing after 70% scroll
      brandTextRef.current.style.opacity = Math.min(0.2, opacity);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer className="w-full relative overflow-hidden pt-40 pb-16 bg-[#050505] z-10">
      {/* Extremely Large Background Text */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none select-none">
        <span
          ref={brandTextRef}
          className="text-[clamp(100px,25vw,400px)] font-display font-bold leading-none tracking-[-0.05em] block text-transparent bg-clip-text bg-gradient-to-t from-[#cfbcff]/30 to-transparent transition-opacity duration-300 ease-out"
          style={{ opacity: 0 }}
        >
          BUILDIFY
        </span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        {/* Subtle Horizontal Divider */}
        <div className="w-full h-px bg-white/5 mb-12"></div>
        
        {/* Bottom copyright row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-body text-[11px] font-semibold tracking-[0.25em] text-[#cbc4d2]/50 uppercase">
            © 2026 BUILDIFY SYSTEMS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-8 md:gap-12">
            <a 
              href="#" 
              className="font-body text-[11px] font-semibold tracking-[0.25em] text-[#cbc4d2]/50 hover:text-[#cfbcff] transition-colors uppercase"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="font-body text-[11px] font-semibold tracking-[0.25em] text-[#cbc4d2]/50 hover:text-[#cfbcff] transition-colors uppercase"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
