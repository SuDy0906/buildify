"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const INTERACTIVE =
  'a, button, input:not([type="hidden"]), textarea, select, label, [role="button"], [data-cursor-hover], .cursor-pointer';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ring = ringRef.current;
    if (!ring) return;

    const canUseCustomCursor = () =>
      window.matchMedia("(pointer: fine)").matches;

    const applyTransform = () => {
      ring.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e) => {
      if (e.target.closest(INTERACTIVE)) setHovering(true);
    };

    const onOut = (e) => {
      const from = e.target.closest(INTERACTIVE);
      const to = e.relatedTarget?.closest?.(INTERACTIVE);
      if (from && !to) setHovering(false);
    };

    const onDown = () => ring.classList.add("custom-cursor--pressed");
    const onUp = () => ring.classList.remove("custom-cursor--pressed");

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      applyTransform();
      rafId.current = requestAnimationFrame(tick);
    };

    const enable = () => {
      setActive(true);
      document.documentElement.classList.add("custom-cursor-active");
      applyTransform();
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseover", onOver);
      document.addEventListener("mouseout", onOut);
      window.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
      rafId.current = requestAnimationFrame(tick);
    };

    const disable = () => {
      setActive(false);
      setHovering(false);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      ring.classList.remove("custom-cursor--pressed");
    };

    const mq = window.matchMedia("(pointer: fine)");
    const onMqChange = () => {
      disable();
      if (canUseCustomCursor()) enable();
    };

    if (canUseCustomCursor()) enable();

    mq.addEventListener("change", onMqChange);

    return () => {
      mq.removeEventListener("change", onMqChange);
      disable();
    };
  }, [mounted]);

  const ring = (
    <div
      ref={ringRef}
      className={`custom-cursor${active ? " custom-cursor--active" : ""}${hovering ? " custom-cursor--hover" : ""}`}
      aria-hidden="true"
    />
  );

  if (!mounted) return null;

  return createPortal(ring, document.body);
}
