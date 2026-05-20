"use client";

import { useEffect, useRef } from "react";

export default function ScrollWave() {
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);

  useEffect(() => {
    const path1 = path1Ref.current;
    const path2 = path2Ref.current;
    if (!path1 || !path2) return;

    // Set initial dasharray and dashoffset
    path1.style.strokeDasharray = "1000";
    path1.style.strokeDashoffset = "1000";
    path2.style.strokeDasharray = "1000";
    path2.style.strokeDashoffset = "1000";

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercent = window.scrollY / scrollHeight;

      // Map scroll percentage to strokeDashoffset
      // Begins fully drawn out (1000) and reduces to -1000 at maximum scroll
      const offset = 1000 - scrollPercent * 2000;
      path1.style.strokeDashoffset = offset;
      path2.style.strokeDashoffset = offset * 0.8;

      // Translate wave positions in Y to simulate flow
      const translateY = scrollPercent * 100;
      path1.style.transform = `translateY(${-translateY}px)`;
      path2.style.transform = `translateY(${translateY * 0.5}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    // Initial call to set initial offsets
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="scroll-wave-container">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6750a4" stopOpacity="0" />
            <stop offset="50%" stopColor="#cfbcff" stopOpacity="1" />
            <stop offset="100%" stopColor="#6750a4" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Left Flanking Wave */}
        <path
          ref={path1Ref}
          id="scroll-path"
          className="wave-path"
          d="M 80,0 Q 300,250 80,500 T 80,1000"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="3"
          filter="url(#glow)"
        />
        
        {/* Right Flanking Wave */}
        <path
          ref={path2Ref}
          id="scroll-path-2"
          className="wave-path"
          d="M 920,0 Q 700,250 920,500 T 920,1000"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          strokeOpacity="0.7"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
}
