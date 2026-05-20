"use client";

import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#141218]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_40px_rgba(207,188,255,0.12)]">
      <div className="flex justify-between items-center max-w-[1280px] mx-auto px-6 md:px-16 h-20">
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-2xl font-bold tracking-tighter text-[#cfbcff] cursor-pointer hover:opacity-85 transition-opacity"
        >
          Buildify Tech Services
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => handleScrollTo("hero")}
            className="text-[#cfbcff] font-bold border-b-2 border-[#cfbcff] pb-1 font-body text-sm transition-colors duration-300"
          >
            Solutions
          </button>
          <button
            onClick={() => handleScrollTo("capabilities")}
            className="text-[#cbc4d2] font-medium font-body text-sm hover:text-[#cfbcff] transition-colors duration-300"
          >
            Architecture
          </button>
          <button
            onClick={() => handleScrollTo("team")}
            className="text-[#cbc4d2] font-medium font-body text-sm hover:text-[#cfbcff] transition-colors duration-300"
          >
            Foundry
          </button>
          <button
            onClick={() => handleScrollTo("cta")}
            className="text-[#cbc4d2] font-medium font-body text-sm hover:text-[#cfbcff] transition-colors duration-300"
          >
            Nexus
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button 
            onClick={() => handleScrollTo("cta")}
            className="bg-[#cfbcff] text-[#381e72] px-6 py-2 rounded-full font-bold scale-95 active:scale-90 hover:bg-[#e0d2ff] hover:shadow-[0_0_20px_rgba(207,188,255,0.3)] transition-all duration-300"
          >
            Start Building
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#cfbcff] flex items-center justify-center p-2 focus:outline-none"
        >
          <span className="material-symbols-outlined text-3xl">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#141218] border-b border-white/10 px-6 py-8 flex flex-col gap-6 animate-fade-in">
          <button
            onClick={() => handleScrollTo("hero")}
            className="text-left text-[#cfbcff] font-bold font-body text-lg border-l-2 border-[#cfbcff] pl-3"
          >
            Solutions
          </button>
          <button
            onClick={() => handleScrollTo("capabilities")}
            className="text-left text-[#cbc4d2] font-medium font-body text-lg hover:text-[#cfbcff] pl-3"
          >
            Architecture
          </button>
          <button
            onClick={() => handleScrollTo("team")}
            className="text-left text-[#cbc4d2] font-medium font-body text-lg hover:text-[#cfbcff] pl-3"
          >
            Foundry
          </button>
          <button
            onClick={() => handleScrollTo("cta")}
            className="text-left text-[#cbc4d2] font-medium font-body text-lg hover:text-[#cfbcff] pl-3"
          >
            Nexus
          </button>
          <button
            onClick={() => handleScrollTo("cta")}
            className="bg-[#cfbcff] text-[#381e72] py-3 rounded-xl font-bold hover:bg-[#e0d2ff] transition-all text-center w-full mt-4"
          >
            Start Building
          </button>
        </div>
      )}
    </nav>
  );
}
