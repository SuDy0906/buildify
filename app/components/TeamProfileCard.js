"use client";

import CircularRevolvingText from "./CircularRevolvingText";

export default function TeamProfileCard({
  id,
  name,
  designation,
  bio,
  image,
  imageAlt,
  accent = "primary",
  align = "left",
  slideClass = "slide-left",
}) {
  const isRight = align === "right";

  return (
    <article
      className={`team-card team-card--${align} team-card--accent-${accent} ${slideClass} team-profile-card w-full md:w-[88%] ${
        isRight ? "self-end" : "self-start"
      }`}
    >
      <div className="team-card__media">
        <CircularRevolvingText text={designation} accent={accent} ringId={id} />
        <div className="team-card__avatar">
          <img alt={imageAlt ?? name} className="team-card__photo" src={image} />
        </div>
      </div>

      <div className="team-card__body">
        <h4 className="team-card__name">{name}</h4>
        <p className="team-card__bio">{bio}</p>
      </div>
    </article>
  );
}
