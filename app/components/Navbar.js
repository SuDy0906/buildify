"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "hero", label: "HOME", menuLabel: "Home" },
  { id: "capabilities", label: "SERVICES", menuLabel: "Services" },
  { id: "team", label: "OUR TEAM", menuLabel: "Our Team" },
  { id: "cta", label: "CONTACT US", menuLabel: "Contact Us" },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [dotLeft, setDotLeft] = useState(0);
  const pillRef = useRef(null);
  const linkRefs = useRef({});
  const mobileNavRef = useRef(null);

  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeId);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const updateDotPosition = useCallback(() => {
    const pill = pillRef.current;
    const link = linkRefs.current[activeId];
    if (!pill || !link) return;
    const pillRect = pill.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setDotLeft(linkRect.left - pillRect.left + linkRect.width / 2);
  }, [activeId]);

  useEffect(() => {
    const syncActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.38;
      let current = NAV_ITEMS[0].id;

      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) current = id;
      }

      setActiveId(current);
    };

    syncActiveSection();
    window.addEventListener("scroll", syncActiveSection, { passive: true });
    window.addEventListener("resize", syncActiveSection);
    return () => {
      window.removeEventListener("scroll", syncActiveSection);
      window.removeEventListener("resize", syncActiveSection);
    };
  }, []);

  useEffect(() => {
    updateDotPosition();
    window.addEventListener("resize", updateDotPosition);
    return () => window.removeEventListener("resize", updateDotPosition);
  }, [updateDotPosition]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setNavOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const closeMenu = () => setNavOpen(false);
    window.addEventListener("scroll", closeMenu, { passive: true });
    return () => window.removeEventListener("scroll", closeMenu);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-50 w-full">
      <div className="site-header-inner">
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="site-brand cursor-pointer"
        >
          <span className="site-brand-desktop">buildify tech services</span>
          <span className="site-brand-mobile">
            <span className="site-brand-line">buildify</span>
            <span className="site-brand-line">tech services</span>
          </span>
        </button>

        <nav ref={pillRef} className="nav-pill nav-desktop-only" aria-label="Main">
          <span
            className="nav-pill-dot"
            style={{ transform: `translateX(${dotLeft}px) translateX(-50%)` }}
            aria-hidden="true"
          />
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              ref={(el) => {
                linkRefs.current[item.id] = el;
              }}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`nav-pill-link cursor-pointer ${
                activeId === item.id ? "nav-pill-link--active" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="site-header-actions">
          <button
            type="button"
            onClick={() => scrollTo("cta")}
            className="nav-cta-pill nav-desktop-only cursor-pointer"
          >
            Start Building
          </button>

          <div className="mobile-header-pills nav-mobile-only" ref={mobileNavRef}>
            <div className="mobile-nav-pill-wrap">
              <button
                type="button"
                onClick={() => setNavOpen((o) => !o)}
                className="mobile-nav-pill cursor-pointer"
                aria-expanded={navOpen}
                aria-haspopup="listbox"
                aria-label="Open navigation menu"
              >
                <span className="mobile-nav-pill-label" aria-live="polite">
                  <span
                    className="mobile-nav-label-track"
                    style={{
                      transform: `translateY(-${safeActiveIndex * 100}%)`,
                    }}
                  >
                    {NAV_ITEMS.map((item) => (
                      <span key={item.id} className="mobile-nav-label-item">
                        {item.label}
                      </span>
                    ))}
                  </span>
                </span>
                <span
                  className={`material-symbols-outlined mobile-nav-chevron ${
                    navOpen ? "mobile-nav-chevron--open" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              <div
                className={`mobile-nav-dropdown ${navOpen ? "mobile-nav-dropdown--open" : ""}`}
                role="listbox"
                aria-hidden={!navOpen}
              >
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={activeId === item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`mobile-nav-dropdown-item cursor-pointer ${
                      activeId === item.id ? "mobile-nav-dropdown-item--active" : ""
                    }`}
                  >
                    {item.menuLabel}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollTo("cta")}
              className="mobile-start-pill cursor-pointer"
            >
              Start Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
