"use client";

import { useEffect } from "react";
import CTASection from "./components/CTASection";
import TeamProfileCard from "./components/TeamProfileCard";
import { TEAM_MEMBERS } from "./lib/team";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";

export default function Home() {
  useEffect(() => {
    // 1. Enhanced Scroll Zoom-and-Fade Transition using IntersectionObserver
    const sectionObserverOptions = {
      threshold: [0, 0.1, 0.3, 0.5, 0.8, 1],
      rootMargin: "0px",
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const rect = entry.boundingClientRect;
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.classList.remove("exit");
        } else {
          if (rect.top < 0) {
            entry.target.classList.add("exit");
          } else {
            entry.target.classList.remove("visible");
            entry.target.classList.remove("exit");
          }
        }
      });
    }, sectionObserverOptions);

    const zoomSections = document.querySelectorAll(".zoom-section");
    zoomSections.forEach((el) => sectionObserver.observe(el));

    // 2. Background Parallax effect
    const handleMouseMove = (e) => {
      const spheres = document.querySelectorAll(".parallax-sphere");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      spheres.forEach((sphere, index) => {
        const speed = (index + 1) * 20;
        const moveX = (x - 0.5) * speed;
        const moveY = (y - 0.5) * speed;
        sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 3. 3D Glass Card Tilt Effect
    const cards = document.querySelectorAll(".glass-card");
    const handleCardMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    };

    const handleCardLeave = (card) => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
    };

    const cardListeners = [];
    cards.forEach((card) => {
      const onMove = (e) => handleCardMove(e, card);
      const onLeave = () => handleCardLeave(card);

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);

      cardListeners.push({ card, onMove, onLeave });
    });

    // 4. Scroll Follower Wave and Footer Watermark Effect
    const wavePath1 = document.getElementById("scroll-path");
    const wavePath2 = document.getElementById("scroll-path-2");
    const footerWatermark = document.getElementById("footer-watermark");

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercent = window.scrollY / scrollHeight;

      const offset = 1000 - scrollPercent * 2000;
      if (wavePath1) wavePath1.style.strokeDashoffset = offset;
      if (wavePath2) wavePath2.style.strokeDashoffset = offset * 0.8;

      const translateY = scrollPercent * 100;
      if (wavePath1) wavePath1.style.transform = `translateY(${-translateY}px)`;
      if (wavePath2) wavePath2.style.transform = `translateY(${translateY * 0.5}px)`;

      if (footerWatermark) {
        footerWatermark.style.opacity = Math.min(0.6, scrollPercent * 1.2);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Initial triggers
    if (wavePath1) {
      wavePath1.style.strokeDasharray = "1000";
      wavePath1.style.strokeDashoffset = "1000";
    }
    if (wavePath2) {
      wavePath2.style.strokeDasharray = "1000";
      wavePath2.style.strokeDashoffset = "1000";
    }
    handleScroll();

    // Cleanup listeners
    return () => {
      zoomSections.forEach((el) => sectionObserver.unobserve(el));
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cardListeners.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Scroll Follower Background */}
      <div id="scroll-wave-container">
        <svg height="100%" preserveAspectRatio="none" viewBox="0 0 1000 1000" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#6750a4" stopOpacity="0"></stop>
              <stop offset="50%" stopColor="#cfbcff" stopOpacity="1"></stop>
              <stop offset="100%" stopColor="#6750a4" stopOpacity="0"></stop>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur result="blur" stdDeviation="8"></feGaussianBlur>
              <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
            </filter>
          </defs>
          <path
            className="wave-path"
            d="M 100,0 Q 400,250 100,500 T 100,1000"
            fill="none"
            filter="url(#glow)"
            id="scroll-path"
            stroke="url(#waveGradient)"
            strokeWidth="3"
          ></path>
          <path
            className="wave-path"
            d="M 900,0 Q 600,250 900,500 T 900,1000"
            fill="none"
            filter="url(#glow)"
            id="scroll-path-2"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            style={{ opacity: 0.7 }}
          ></path>
        </svg>
      </div>

      <Navbar />

      <main className="page-root relative blueprint-grid">
        {/* Background Spheres */}
        <div className="parallax-layer fixed inset-0 pointer-events-none z-0">
          <div className="parallax-sphere absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary rounded-full"></div>
          <div className="parallax-sphere absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-secondary rounded-full"></div>
        </div>

        <HeroSection />

        {/* Services Section */}
        <section id="capabilities" className="zoom-section py-16 md:py-20 relative z-10 px-4 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-10 md:mb-16 text-center md:text-left">
              <h2
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: "clamp(28px, 4vw, 48px)",
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
                className="mb-4"
              >
                Core Capabilities
              </h2>
              <div className="w-24 h-1 bg-primary rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* MVP Creation Card */}
              <div className="glass-card p-6 md:p-10 rounded-xl flex flex-col gap-4 md:gap-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                  <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                </div>
                <h3
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: "clamp(22px, 2.5vw, 32px)",
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}
                >
                  MVP Creation
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                  className="text-[#cbc4d2] leading-relaxed"
                >
                  Rapid prototyping and industrial-grade development to take your vision from blueprint to market dominance in record time.
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                    className="text-primary"
                  >
                    PHASE 01
                  </span>
                  <span className="material-symbols-outlined text-primary cursor-pointer hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>

              {/* Web Development Card */}
              <div className="glass-card p-6 md:p-10 rounded-xl flex flex-col gap-4 md:gap-6">
                <div className="w-14 h-14 rounded-lg bg-tertiary/10 flex items-center justify-center border border-tertiary/20 text-tertiary">
                  <span className="material-symbols-outlined text-4xl">terminal</span>
                </div>
                <h3
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: "clamp(22px, 2.5vw, 32px)",
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}
                >
                  Web Development
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                  className="text-[#cbc4d2] leading-relaxed"
                >
                  Scalable, secure, and visually stunning web architectures built with modern stacks that define technical excellence.
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                    className="text-tertiary"
                  >
                    PHASE 02
                  </span>
                  <span className="material-symbols-outlined text-tertiary cursor-pointer hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>

              {/* ML Workflows Card */}
              <div className="glass-card p-6 md:p-10 rounded-xl flex flex-col gap-4 md:gap-6">
                <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20 text-secondary">
                  <span className="material-symbols-outlined text-4xl">neurology</span>
                </div>
                <h3
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: "clamp(22px, 2.5vw, 32px)",
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}
                >
                  ML Workflows
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                  className="text-[#cbc4d2] leading-relaxed"
                >
                  Integrating advanced machine learning pipelines and intelligent automation to forge smarter, self-optimizing ecosystems.
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                    className="text-secondary"
                  >
                    PHASE 03
                  </span>
                  <span className="material-symbols-outlined text-secondary cursor-pointer hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>

              {/* App Development Card */}
              <div className="glass-card p-6 md:p-10 rounded-xl flex flex-col gap-4 md:gap-6">
                <div className="w-14 h-14 rounded-lg bg-primary-container/10 flex items-center justify-center border border-primary-container/20 text-on-primary-container">
                  <span className="material-symbols-outlined text-4xl">smartphone</span>
                </div>
                <h3
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: "clamp(22px, 2.5vw, 32px)",
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}
                >
                  App Development
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                  className="text-[#cbc4d2] leading-relaxed"
                >
                  iOS and Android experiences with polished UX, offline-ready flows, and store-ready releases built for retention.
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                    className="text-on-primary-container"
                  >
                    PHASE 04
                  </span>
                  <span className="material-symbols-outlined text-on-primary-container cursor-pointer hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>

              {/* Game Development Card */}
              <div className="glass-card p-6 md:p-10 rounded-xl flex flex-col gap-4 md:gap-6">
                <div className="w-14 h-14 rounded-lg bg-tertiary-container/10 flex items-center justify-center border border-tertiary-container/20 text-tertiary-container">
                  <span className="material-symbols-outlined text-4xl">sports_esports</span>
                </div>
                <h3
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: "clamp(22px, 2.5vw, 32px)",
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}
                >
                  Game Development
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                  className="text-[#cbc4d2] leading-relaxed"
                >
                  Playable prototypes through full builds—gameplay systems, multiplayer, and live ops tuned for engagement and scale.
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                    className="text-tertiary-container"
                  >
                    PHASE 05
                  </span>
                  <span className="material-symbols-outlined text-tertiary-container cursor-pointer hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="zoom-section py-16 md:py-20 bg-[#0f0d13]/50 relative z-10 px-4 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: "clamp(26px, 4vw, 48px)",
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
                className="mb-4"
              >
                The Minds Behind the Tech
              </h2>
              <p
                style={{
                  fontFamily: '"Geist", sans-serif',
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
                className="text-[#cbc4d2] max-w-xl mx-auto"
              >
                Our elite team blends architectural precision with breakthrough innovation.
              </p>
            </div>
            <div className="flex flex-col gap-10 md:gap-14 max-w-5xl mx-auto">
              {TEAM_MEMBERS.map((member) => (
                <TeamProfileCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  designation={member.designation}
                  bio={member.bio}
                  image={member.image}
                  imageAlt={member.designation}
                  accent={member.accent}
                  align={member.align}
                  slideClass={member.align === "right" ? "slide-right" : "slide-left"}
                />
              ))}
            </div>
          </div>
        </section>

        <CTASection />

        {/* Footer */}
        <footer className="w-full relative overflow-hidden pt-32 pb-16 bg-transparent">
          {/* Subtle bottom dark gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] pointer-events-none z-0"></div>

          {/* Extremely Large Background Text */}
          <div className="footer-watermark-wrap absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none select-none z-0">
            <span
              id="footer-watermark"
              className="footer-watermark font-display-lg font-bold leading-none text-transparent bg-clip-text bg-gradient-to-t from-primary/50 via-primary/10 to-transparent transition-opacity duration-300"
              style={{ opacity: 0 }}
            >
              BUILDIFY
            </span>
          </div>
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
            {/* Elegant Fading Gradient Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>
            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div
                style={{
                  fontFamily: '"Geist", sans-serif',
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                }}
                className="text-[#cbc4d2]/60 uppercase"
              >
                © 2026 BUILDIFY SYSTEMS. ALL RIGHTS RESERVED.
              </div>
              <div className="flex items-center gap-12">
                <a
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                  }}
                  className="text-[#cbc4d2]/60 hover:text-primary transition-colors uppercase"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                  }}
                  className="text-[#cbc4d2]/60 hover:text-primary transition-colors uppercase"
                  href="#"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
