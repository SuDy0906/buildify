"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CTA_CHIP_STORAGE_KEY,
  CTA_DEFAULT_COPY,
  VALUE_PROPS,
} from "../lib/valueProps";

const CHIPS = VALUE_PROPS.map(({ id, chipLabel, copy }) => ({
  id,
  label: chipLabel,
  copy,
}));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DOT_SPACING = 36;
const CONNECT_RADIUS = 140;

export default function CTASection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);

  const [selectedChip, setSelectedChip] = useState(null);
  const [copyText, setCopyText] = useState(CTA_DEFAULT_COPY);
  const [inView, setInView] = useState(false);
  const [hoveringCard, setHoveringCard] = useState(false);

  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const buildDotGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const rect = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(rect.width / DOT_SPACING) + 1;
    const rows = Math.ceil(rect.height / DOT_SPACING) + 1;
    const offsetX = (rect.width - (cols - 1) * DOT_SPACING) / 2;
    const offsetY = (rect.height - (rows - 1) * DOT_SPACING) / 2;

    const dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: offsetX + c * DOT_SPACING,
          y: offsetY + r * DOT_SPACING,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const rect = card.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!mouseRef.current.active) return;

    const { x: mx, y: my } = mouseRef.current;
    const dots = dotsRef.current;

    dots.forEach((dot) => {
      const dx = dot.x - mx;
      const dy = dot.y - my;
      const dist = Math.hypot(dx, dy);

      if (dist < CONNECT_RADIUS) {
        const alpha = (1 - dist / CONNECT_RADIUS) * 0.45;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(207, 188, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.moveTo(mx, my);
        ctx.lineTo(dot.x, dot.y);
        ctx.stroke();
      }

      const dotAlpha = dist < CONNECT_RADIUS ? 0.35 + (1 - dist / CONNECT_RADIUS) * 0.5 : 0.12;
      ctx.beginPath();
      ctx.fillStyle = `rgba(207, 188, 255, ${dotAlpha})`;
      ctx.arc(dot.x, dot.y, dist < CONNECT_RADIUS ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.beginPath();
    ctx.fillStyle = "rgba(207, 188, 255, 0.9)";
    ctx.arc(mx, my, 4, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const tick = useCallback(() => {
    drawCanvas();
    rafRef.current = requestAnimationFrame(tick);
  }, [drawCanvas]);

  const startCanvasLoop = useCallback(() => {
    if (rafRef.current) return;
    buildDotGrid();
    rafRef.current = requestAnimationFrame(tick);
  }, [buildDotGrid, tick]);

  const stopCanvasLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mouseRef.current.active = false;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(CTA_CHIP_STORAGE_KEY);
    const match = VALUE_PROPS.find((p) => p.id === stored);
    if (match) {
      setSelectedChip(match.id);
      setCopyText(match.copy);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const onResize = () => {
      if (mouseRef.current.active) buildDotGrid();
    };

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onEnter = () => {
      setHoveringCard(true);
      mouseRef.current.active = true;
      startCanvasLoop();
    };

    const onLeave = () => {
      setHoveringCard(false);
      stopCanvasLoop();
    };

    window.addEventListener("resize", onResize);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("resize", onResize);
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
      stopCanvasLoop();
    };
  }, [buildDotGrid, startCanvasLoop, stopCanvasLoop]);

  const handleChipClick = (chip) => {
    setSelectedChip(chip.id);
    setCopyText(chip.copy);
    sessionStorage.setItem(CTA_CHIP_STORAGE_KEY, chip.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (success) return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setShake(true);
      setTimeout(() => setShake(false), 520);
      return;
    }

    setSuccess(true);
    window.location.href = `mailto:contact@buildify.tech?subject=Buildify%20callback%20request&body=Email:%20${encodeURIComponent(trimmed)}%0A%0AInterest:%20${encodeURIComponent(selectedChip || "general")}`;
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="zoom-section py-20 md:py-28 lg:py-32 px-6 md:px-10 lg:px-16 relative z-10 overflow-hidden"
    >
      <div
        ref={cardRef}
        className={`cta-card max-w-[1280px] mx-auto rounded-2xl text-center relative p-8 sm:p-12 md:p-20 lg:p-28 transition-all duration-700 ${
          inView ? "cta-card--in-view" : ""
        } ${hoveringCard ? "cta-card--hover" : ""}`}
      >
        <canvas
          ref={canvasRef}
          className="cta-canvas absolute inset-0 w-full h-full pointer-events-none z-[1] rounded-2xl"
          aria-hidden="true"
        />

        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none z-0" />

        <div className="relative z-10 space-y-8">
          <h2
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.2,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Build?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
              Let&apos;s talk.
            </span>
          </h2>

          <p
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: "clamp(16px, 2vw, 18px)",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
            key={selectedChip ?? "default"}
            className={`text-[#cbc4d2] max-w-2xl mx-auto cta-copy ${
              selectedChip ? "cta-copy--active cta-copy--animate" : ""
            }`}
          >
            {copyText}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`cta-chip cursor-pointer ${
                  selectedChip === chip.id ? "cta-chip--active" : ""
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {success ? (
            <div className="cta-success flex flex-col items-center gap-3 pt-2">
              <span className="cta-success-icon material-symbols-outlined">check_circle</span>
              <p
                style={{ fontFamily: '"Geist", sans-serif', fontSize: "16px" }}
                className="text-primary font-medium"
              >
                You&apos;re on the list — we&apos;ll reach out shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={`cta-form flex flex-col sm:flex-row gap-3 max-w-xl mx-auto w-full pt-2 ${
                shake ? "cta-form--shake" : ""
              }`}
              noValidate
            >
              <div
                className={`cta-input-wrap flex-1 ${emailFocused ? "cta-input-wrap--focused" : ""}`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@company.com"
                  className="cta-input w-full cursor-text"
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="cta-submit cursor-pointer shrink-0">
                Get a callback
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
          )}

          <div className="cta-buttons flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 pt-2">
            <a
              className="bg-primary text-on-primary font-bold px-8 md:px-14 py-4 md:py-5 rounded-xl shadow-[0_0_30px_rgba(207,188,255,0.3)] hover:shadow-[0_0_50px_rgba(207,188,255,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer w-full sm:w-auto justify-center"
              href="mailto:contact@buildify.tech"
            >
              Connect with an Expert
              <span className="material-symbols-outlined">bolt</span>
            </a>
            <a
              href="#capabilities"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
              className="border border-primary/30 text-primary px-8 md:px-12 py-4 md:py-5 rounded-xl hover:bg-primary/10 transition-all duration-300 cursor-pointer w-full sm:w-auto justify-center text-center"
            >
              View Case Studies
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
