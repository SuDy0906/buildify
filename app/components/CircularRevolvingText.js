"use client";

const ACCENT_FILL = {
  primary: "#cfbcff",
  secondary: "#cdc0e9",
};

/**
 * Designation label on a circular path, slowly revolving with a soft glow.
 */
export default function CircularRevolvingText({ text, accent = "primary", ringId }) {
  const pathId = `team-ring-path-${ringId ?? "default"}`;
  const fill = ACCENT_FILL[accent] ?? ACCENT_FILL.primary;
  const label = `${text.toUpperCase()} \u2022 ${text.toUpperCase()} \u2022 ${text.toUpperCase()} \u2022 `;

  return (
    <div className={`team-ring-wrap team-ring-wrap--${accent}`} aria-hidden="true">
      <svg
        className="team-ring-text"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id={pathId}
            d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
            fill="none"
          />
        </defs>
        <text fill={fill} className="team-ring-text__glyphs">
          <textPath href={`#${pathId}`} xlinkHref={`#${pathId}`} startOffset="0%">
            {label}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
