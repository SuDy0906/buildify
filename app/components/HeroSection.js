"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CTA_CHIP_STORAGE_KEY, VALUE_PROPS } from "../lib/valueProps";

const TYPE_MS = 42;
const DELETE_MS = 26;
const PAUSE_MS = 2400;

export default function HeroSection() {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const lineIndexRef = useRef(0);
  const skipAnimationRef = useRef(false);

  const persistChip = useCallback((index) => {
    const prop = VALUE_PROPS[index];
    if (prop) {
      sessionStorage.setItem(CTA_CHIP_STORAGE_KEY, prop.id);
    }
  }, []);

  const goToLine = useCallback(
    (nextIndex) => {
      const idx = (nextIndex + VALUE_PROPS.length) % VALUE_PROPS.length;
      lineIndexRef.current = idx;
      setLineIndex(idx);
      setDisplayed("");
      setIsDeleting(false);
      skipAnimationRef.current = true;
      persistChip(idx);
    },
    [persistChip]
  );

  const advanceLine = useCallback(() => {
    goToLine(lineIndexRef.current + 1);
  }, [goToLine]);

  useEffect(() => {
    persistChip(0);
  }, [persistChip]);

  useEffect(() => {
    const full = VALUE_PROPS[lineIndex].line;

    if (skipAnimationRef.current) {
      skipAnimationRef.current = false;
      return;
    }

    let timeout;

    if (!isDeleting && displayed.length < full.length) {
      timeout = setTimeout(
        () => setDisplayed(full.slice(0, displayed.length + 1)),
        TYPE_MS
      );
    } else if (!isDeleting && displayed.length === full.length) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_MS);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        DELETE_MS
      );
    } else if (isDeleting && displayed.length === 0) {
      const next = (lineIndexRef.current + 1) % VALUE_PROPS.length;
      lineIndexRef.current = next;
      setLineIndex(next);
      setIsDeleting(false);
      persistChip(next);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, lineIndex, persistChip]);

  useEffect(() => {
    lineIndexRef.current = lineIndex;
  }, [lineIndex]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="zoom-section relative pt-16 md:pt-24 pb-20 min-h-screen flex items-center justify-center overflow-hidden z-10 px-6"
    >
      <div className="max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4 select-none">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(207,188,255,1)]" />
          <span
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
            }}
            className="text-primary"
          >
            STABLE RELEASE V2.4
          </span>
        </div>

        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(40px, 7.5vw, 72px)",
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
          className="text-on-surface"
        >
          Architecting the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
            Digital Future
          </span>
        </h1>

        <button
          type="button"
          onClick={advanceLine}
          className="hero-typewriter block w-full max-w-2xl mx-auto cursor-pointer group"
          aria-label="Cycle value proposition. Click to see next."
        >
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(20px, 3.5vw, 32px)",
              lineHeight: 1.3,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
            className="text-primary inline"
          >
            {displayed}
            <span className="hero-typewriter-cursor" aria-hidden="true" />
          </span>
        </button>

        <div className="flex justify-center gap-2 pt-1" role="tablist" aria-label="Value propositions">
          {VALUE_PROPS.map((prop, i) => (
            <button
              key={prop.id}
              type="button"
              role="tab"
              aria-selected={lineIndex === i}
              aria-label={prop.line}
              onClick={() => goToLine(i)}
              className={`hero-typewriter-dot cursor-pointer ${
                lineIndex === i ? "hero-typewriter-dot--active" : ""
              }`}
            />
          ))}
        </div>

        <p
          style={{
            fontFamily: '"Geist", sans-serif',
            fontSize: "17px",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
          className="text-[#cbc4d2]/80 max-w-xl mx-auto hero-subtext"
        >
          Engineered for visionary founders and high-growth enterprises.
        </p>

        <div className="pt-6 flex flex-wrap justify-center gap-6">
          <button
            type="button"
            onClick={() => scrollTo("cta")}
            className="bg-primary text-on-primary font-bold px-10 py-4 rounded-xl shadow-lg neon-glow-cyan hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Launch Your Vision
          </button>
          <button
            type="button"
            onClick={() => scrollTo("capabilities")}
            className="bg-[#211f24] border border-primary/30 text-primary font-bold px-10 py-4 rounded-xl hover:bg-primary/5 transition-all duration-300 cursor-pointer"
          >
            Explore Foundry
          </button>
        </div>
      </div>
    </section>
  );
}
