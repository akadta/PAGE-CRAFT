import { useRef, useState, useEffect } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { resolveUrl } from "../../../utils/resolveUrl";
import { SectionBadge, SectionHeading } from "./AboutSection";
import { loadFont } from "../../../utils/fontLoader";

/* ─── CSS injection ─────────────────────────────────────────── */
const CSS_ID = "__team_css__";
function injectCSS() {
  if (document.getElementById(CSS_ID)) return;
  const s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = `
    @keyframes _tmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes _tmPulse{0%,100%{box-shadow:0 0 0 0 var(--ring,rgba(99,102,241,.5))}70%{box-shadow:0 0 0 12px transparent}}
    @keyframes _tmNeon{0%,100%{box-shadow:0 0 8px 2px var(--neon,#a855f7),0 0 20px 4px var(--neon,#a855f7)}50%{box-shadow:0 0 16px 4px var(--neon,#a855f7),0 0 40px 8px var(--neon,#a855f7)}}
    @keyframes _tmShine{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes _tmSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    @keyframes _tmFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes _tmZoom{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    @keyframes _tmSlide{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}
    @keyframes _tmScrollL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes _tmScrollR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
    @keyframes _tmCarouselIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
    @keyframes _tmCarouselInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}}
    ._tmCard{transition:transform .3s ease, box-shadow .3s ease;}
    ._tmFlipInner{transition:transform .5s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d;position:relative;}
    ._tmFlipCard:hover ._tmFlipInner{transform:rotateY(180deg);}
    ._tmFlipFront,._tmFlipBack{backface-visibility:hidden;-webkit-backface-visibility:hidden;}
    ._tmFlipBack{transform:rotateY(180deg);position:absolute;inset:0;}
    ._tmTrack::-webkit-scrollbar{display:none}
    @media (max-width: 900px){
      ._tmGridResp{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}
    }
    @media (max-width: 600px){
      ._tmGridResp{grid-template-columns:repeat(1,minmax(0,1fr)) !important;}
      ._tmCarouselCard{max-width:100% !important;}
    }
  `;
  document.head.appendChild(s);
}

/* ─── helpers ───────────────────────────────────────────────── */
const getBg = (c) => {
  if (c.bgType === "gradient")
    return `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`;
  if (c.bgType === "image" && c.bgImage)
    return `url(${c.bgImage}) center/cover no-repeat`;
  return c.bg || "#fff";
};

const shapeRadius = (shape) =>
  shape === "circle"
    ? "50%"
    : shape === "hexagon"
      ? "50%"
      : shape === "square"
        ? "4px"
        : "12px";

/* ─── Social Icons ──────────────────────────────────────────── */
const SocialIcons = {
  twitter: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
    </svg>
  ),
  linkedin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  github: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  ),
};

/* ─── Avatar Component ──────────────────────────────────────── */
function MemberAvatar({ member, c, size }) {
  const effect = c.imageEffect || "none";
  const shape = c.imageShape || "circle";
  const ringColor = member.ringColor || c.avatarRingColor || "#e0e7ff";
  const neonColor = c.neonColor || "#a855f7";
  const sz = size || c.imageSize || 80;

  const imgStyle = {
    width: sz,
    height: sz,
    objectFit: "cover",
    borderRadius: shapeRadius(shape),
    display: "block",
    position: "relative",
    zIndex: 1,
  };

  const fallback = (
    <div
      style={{
        width: sz,
        height: sz,
        borderRadius: shapeRadius(shape),
        background: `linear-gradient(135deg,${c.avatarFallbackA || "#6366f1"},${c.avatarFallbackB || "#8b5cf6"})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 800,
        fontSize: sz * 0.38,
        position: "relative",
        zIndex: 1,
      }}
    >
      {(member.name || "?")[0].toUpperCase()}
    </div>
  );

  const img = member.avatar ? (
    <img src={resolveUrl(member.avatar)} alt={member.name} style={imgStyle} />
  ) : (
    fallback
  );

  /* wrapper styles per effect */
  let wrapStyle = {
    position: "relative",
    display: "inline-block",
    margin: "0 auto",
  };

  if (effect === "ring") {
    wrapStyle = {
      ...wrapStyle,
      padding: 3,
      borderRadius: shapeRadius(shape),
      background: ringColor,
    };
  }
  if (effect === "gradient-ring") {
    wrapStyle = {
      ...wrapStyle,
      padding: 3,
      borderRadius: shapeRadius(shape),
      background: `linear-gradient(135deg,${c.ringFrom || "#6366f1"},${c.ringTo || "#ec4899"})`,
    };
  }
  if (effect === "glow") {
    wrapStyle = { ...wrapStyle, filter: `drop-shadow(0 0 12px ${ringColor})` };
  }
  if (effect === "neon") {
    wrapStyle = {
      ...wrapStyle,
      borderRadius: shapeRadius(shape),
      "--neon": neonColor,
      animation: "_tmNeon 2s ease-in-out infinite",
    };
  }
  if (effect === "float") {
    wrapStyle = { ...wrapStyle, animation: "_tmFloat 3s ease-in-out infinite" };
  }
  if (effect === "pulse") {
    wrapStyle = {
      ...wrapStyle,
      borderRadius: shapeRadius(shape),
      "--ring": ringColor,
      animation: "_tmPulse 2s ease-in-out infinite",
    };
  }
  if (effect === "shine") {
    /* shine overlay via pseudo — do it with a wrapper div */
    return (
      <div
        style={{
          ...wrapStyle,
          borderRadius: shapeRadius(shape),
          overflow: "hidden",
        }}
      >
        {img}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: shapeRadius(shape),
            background:
              "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.35) 50%,transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "_tmShine 2.5s linear infinite",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
    );
  }

  return <div style={wrapStyle}>{img}</div>;
}

/* ─── Hover handlers ────────────────────────────────────────── */
function useHoverHandlers(hoverEffect, accentColor) {
  const onEnter = (e) => {
    const el = e.currentTarget;
    if (hoverEffect === "lift") el.style.transform = "translateY(-6px)";
    if (hoverEffect === "scale") el.style.transform = "scale(1.04)";
    if (hoverEffect === "glow")
      el.style.boxShadow = `0 0 0 2px ${accentColor || "#6366f1"}, 0 8px 32px ${accentColor || "#6366f1"}40`;
    if (hoverEffect === "tilt")
      el.style.transform =
        "perspective(600px) rotateX(4deg) rotateY(-4deg) scale(1.02)";
  };
  const onLeave = (e) => {
    const el = e.currentTarget;
    el.style.transform = "";
    el.style.boxShadow = "";
  };
  return { onMouseEnter: onEnter, onMouseLeave: onLeave };
}

/* ─── Single Member Card ────────────────────────────────────── */
function MemberCard({ member, c, index, layout }) {
  const hover = useHoverHandlers(c.hoverEffect, c.accentColor);
  const isFlip = c.hoverEffect === "flip";
  const delay = `${index * 0.08}s`;

  const animMap = {
    fadeUp: `_tmFadeUp .55s ${delay} both ease-out`,
    zoomIn: `_tmZoom .5s ${delay} both`,
    slideLeft: `_tmSlide .5s ${delay} both`,
    none: "none",
  };
  const entryAnim = animMap[c.animation?.type || "fadeUp"];

  const cardBase = {
    background: c.cardBg || "#ffffff",
    borderRadius: c.cardBorderRadius || 16,
    padding: layout === "horizontal" ? "20px 24px" : c.cardPadding || 28,
    boxShadow: c.cardShadow !== false ? "0 4px 24px rgba(0,0,0,.07)" : "none",
    border: c.cardBorder
      ? `1px solid ${c.cardBorderColor || "#e2e8f0"}`
      : "none",
    animation: entryAnim,
    transition: "transform .3s ease, box-shadow .3s ease",
    width: "100%",
    boxSizing: "border-box",
  };

  const socials = c.showSocials && (
    <div
      style={{
        display: "flex",
        justifyContent: layout === "horizontal" ? "flex-start" : "center",
        gap: 10,
        marginTop: 12,
      }}
    >
      {Object.entries(member.socials || {}).map(([platform, url]) =>
        url ? (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#94a3b8",
              transition: "color 0.2s",
              display: "flex",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = c.accentColor || "#6366f1")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            {SocialIcons[platform]}
          </a>
        ) : null,
      )}
    </div>
  );

  const tag = c.showTag && member.tag && (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 100,
        background: (c.accentColor || "#6366f1") + "18",
        color: c.accentColor || "#6366f1",
        letterSpacing: "0.5px",
        marginBottom: 8,
      }}
    >
      {member.tag}
    </span>
  );

  const dept = c.showDept && member.dept && (
    <div
      style={{
        fontSize: 11,
        color: c.deptColor || "#94a3b8",
        marginBottom: 4,
        fontWeight: 500,
      }}
    >
      {member.dept}
    </div>
  );

  /* FLIP CARD */
  if (isFlip && member.description) {
    return (
      <div
        data-anim
        className="_tmFlipCard"
        style={{
          ...cardBase,
          padding: 0,
          overflow: "hidden",
          perspective: 800,
          minHeight: 220,
          animation: entryAnim,
        }}
      >
        <div className="_tmFlipInner" style={{ minHeight: 220 }}>
          {/* Front */}
          <div
            className="_tmFlipFront"
            style={{
              padding: c.cardPadding || 28,
              textAlign: "center",
              background: c.cardBg || "#fff",
              borderRadius: c.cardBorderRadius || 16,
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <MemberAvatar member={member} c={c} />
            </div>
            {tag}
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: c.nameColor || "#0f172a",
                marginBottom: 2,
              }}
            >
              {member.name}
            </div>
            <div style={{ fontSize: 13, color: c.roleColor || "#6366f1" }}>
              {member.role}
            </div>
            {dept}
          </div>
          {/* Back */}
          <div
            className="_tmFlipBack"
            style={{
              padding: c.cardPadding || 28,
              background: c.accentColor || "#6366f1",
              borderRadius: c.cardBorderRadius || 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                marginBottom: 6,
              }}
            >
              {member.name}
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {member.description}
            </p>
            {socials}
          </div>
        </div>
      </div>
    );
  }

  /* HORIZONTAL layout */
  if (layout === "horizontal") {
    return (
      <div
        data-anim
        className="_tmCard"
        style={{
          ...cardBase,
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
        }}
        {...hover}
      >
        <div style={{ flexShrink: 0 }}>
          <MemberAvatar member={member} c={c} size={c.imageSize || 64} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 2,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: c.nameColor || "#0f172a",
              }}
            >
              {member.name}
            </span>
            {tag}
          </div>
          <div
            style={{
              fontSize: 13,
              color: c.roleColor || "#6366f1",
              marginBottom: 2,
            }}
          >
            {member.role}
          </div>
          {dept}
          {c.showBio !== false && member.bio && (
            <p
              style={{
                fontSize: 13,
                color: c.bioColor || "#64748b",
                lineHeight: 1.6,
                margin: "6px 0 0",
              }}
            >
              {member.bio}
            </p>
          )}
          {c.showDescription !== false && member.description && (
            <p
              style={{
                fontSize: 12,
                color: c.bioColor || "#64748b",
                lineHeight: 1.5,
                margin: "4px 0 0",
                opacity: 0.8,
              }}
            >
              {member.description}
            </p>
          )}
          {socials}
        </div>
      </div>
    );
  }

  /* SPOTLIGHT layout (larger centered) */
  if (layout === "spotlight") {
    return (
      <div
        data-anim
        className="_tmCard"
        style={{ ...cardBase, textAlign: "center" }}
        {...hover}
      >
        <div style={{ margin: "0 auto 16px" }}>
          <MemberAvatar member={member} c={c} size={c.imageSize || 110} />
        </div>
        {tag}
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: c.nameColor || "#0f172a",
            marginBottom: 4,
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontSize: 14,
            color: c.roleColor || "#6366f1",
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          {member.role}
        </div>
        {dept}
        {c.showBio !== false && member.bio && (
          <p
            style={{
              fontSize: 14,
              color: c.bioColor || "#64748b",
              lineHeight: 1.7,
              margin: "10px 0 0",
            }}
          >
            {member.bio}
          </p>
        )}
        {c.showDescription !== false && member.description && (
          <p
            style={{
              fontSize: 13,
              color: c.bioColor || "#64748b",
              lineHeight: 1.6,
              margin: "6px 0 0",
              opacity: 0.75,
            }}
          >
            {member.description}
          </p>
        )}
        {socials}
      </div>
    );
  }

  /* MINIMAL layout */
  if (layout === "minimal") {
    return (
      <div
        data-anim
        className="_tmCard"
        style={{ ...cardBase, textAlign: "center" }}
        {...hover}
      >
        <div style={{ margin: "0 auto 10px" }}>
          <MemberAvatar member={member} c={c} />
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: c.nameColor || "#0f172a",
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: c.roleColor || "#64748b",
            marginTop: 2,
          }}
        >
          {member.role}
        </div>
        {socials}
      </div>
    );
  }

  /* DEFAULT CARDS */
  return (
    <div
      data-anim
      className="_tmCard"
      style={{ ...cardBase, textAlign: "center" }}
      {...hover}
    >
      <div style={{ margin: "0 auto 14px" }}>
        <MemberAvatar member={member} c={c} />
      </div>
      {tag}
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: c.nameColor || "#0f172a",
          marginBottom: 2,
        }}
      >
        {member.name}
      </div>
      <div
        style={{
          fontSize: 13,
          color: c.roleColor || "#6366f1",
          marginBottom: 4,
        }}
      >
        {member.role}
      </div>
      {dept}
      {c.showBio !== false && member.bio && (
        <p
          style={{
            fontSize: 13,
            color: c.bioColor || "#64748b",
            lineHeight: 1.6,
            margin: "8px 0 0",
          }}
        >
          {member.bio}
        </p>
      )}
      {c.showDescription !== false && member.description && (
        <p
          style={{
            fontSize: 12,
            color: c.bioColor || "#64748b",
            lineHeight: 1.5,
            margin: "6px 0 0",
            opacity: 0.75,
          }}
        >
          {member.description}
        </p>
      )}
      {socials}
    </div>
  );
}

/* ─── Infinite Scroll Strip ────────────────────────────────── */
function InfiniteStrip({ items, c, dir = "left" }) {
  const spd = c.scrollSpeed ?? 30;
  const [paused, setPaused] = useState(false);
  const mode = c.infiniteMode || "auto-left";
  const isTouchMode = mode === "touch";

  /* ── touch/drag scroll ── */
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    if (!isTouchMode) return;
    isDragging.current = true;
    trackRef.current.style.cursor = "grabbing";
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };
  const onMouseMove = (e) => {
    if (!isDragging.current || !isTouchMode) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  const doubled = [...items, ...items];
  const actualDir = mode === "auto-right" ? "right" : dir;
  const anim =
    actualDir === "right"
      ? `_tmScrollR ${spd}s linear infinite`
      : `_tmScrollL ${spd}s linear infinite`;

  const cardWidth = c.cardWidth || 280;

  if (isTouchMode) {
    return (
      <div
        ref={trackRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
          cursor: "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="_tmTrack"
          style={{
            display: "flex",
            gap: c.cardGap || 24,
            width: "max-content",
            alignItems: "stretch",
            padding: "8px 0",
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="_tmCarouselCard"
              style={{
                width: cardWidth,
                flexShrink: 0,
                display: "flex",
              }}
            >
              <MemberCard
                member={item}
                c={{ ...c, animation: { type: "none" } }}
                index={0}
                layout={
                  c.layout === "horizontal" ? "cards" : c.layout || "cards"
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ overflow: "hidden", width: "100%", position: "relative" }}
      onMouseEnter={() => c.pauseOnHover !== false && setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(to right,${c.bg || "#f8fafc"},transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(to left,${c.bg || "#f8fafc"},transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: c.cardGap || 24,
          animation: anim,
          animationPlayState: paused ? "paused" : "running",
          width: "max-content",
          alignItems: "stretch",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="_tmCarouselCard"
            style={{
              width: cardWidth,
              flexShrink: 0,
              display: "flex",
            }}
          >
            <MemberCard
              member={item}
              c={{ ...c, animation: { type: "none" } }}
              index={0}
              layout={c.layout === "horizontal" ? "cards" : c.layout || "cards"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Carousel (paged) ─────────────────────────────────────── */
function TeamCarousel({ items, c }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState("right");
  const [animKey, setAnimKey] = useState(0);
  const total = items.length;

  const go = (newIdx, direction) => {
    setDir(direction);
    setAnimKey((k) => k + 1);
    setIdx(newIdx);
  };

  const prev = () => go((idx - 1 + total) % total, "left");
  const next = () => go((idx + 1) % total, "right");

  useEffect(() => {
    if (!c.autoplay) return;
    const t = setInterval(next, c.autoplayDelay || 5000);
    return () => clearInterval(t);
  }, [c.autoplay, c.autoplayDelay, idx]);

  const visible = Math.min(c.carouselShow ?? 1, total);
  const visItems = Array.from(
    { length: visible },
    (_, i) => items[(idx + i) % total],
  );

  const slideAnim =
    dir === "right"
      ? `_tmCarouselIn .5s cubic-bezier(.25,.46,.45,.94) both`
      : `_tmCarouselInR .5s cubic-bezier(.25,.46,.45,.94) both`;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          gap: c.cardGap || 24,
          justifyContent: "center",
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        {visItems.map((item, i) => (
          <div
            key={`${animKey}-${i}`}
            className="_tmCarouselCard"
            style={{
              flex: "1 1 0",
              minWidth: 220,
              maxWidth: c.cardWidth || 320,
              display: "flex",
              animation: slideAnim,
            }}
          >
            <MemberCard
              member={item}
              c={{ ...c, animation: { type: "none" } }}
              index={i}
              layout={c.layout === "horizontal" ? "cards" : c.layout || "cards"}
            />
          </div>
        ))}
      </div>
      {total > visible && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 28,
          }}
        >
          <button
            onClick={prev}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `1.5px solid ${c.arrowColor || c.accentColor || "#6366f1"}`,
              background: "transparent",
              cursor: "pointer",
              color: c.arrowColor || c.accentColor || "#6366f1",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {c.arrowLeft || "‹"}
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                onClick={() => go(i, i > idx ? "right" : "left")}
                style={{
                  width: i === idx ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i === idx
                      ? c.arrowColor || c.accentColor || "#6366f1"
                      : "#cbd5e1",
                  cursor: "pointer",
                  transition: "all .3s",
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `1.5px solid ${c.arrowColor || c.accentColor || "#6366f1"}`,
              background: "transparent",
              cursor: "pointer",
              color: c.arrowColor || c.accentColor || "#6366f1",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {c.arrowRight || "›"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Section ──────────────────────────────────────────── */
export default function TeamSection({ config: c, navId }) {
  loadFont(c.headingFont);
  injectCSS();
  const ref = useScrollAnimation(c.animation);
  const layout = c.layout || "cards";
  const cols = c.columns || 4;
  const items = c.items || [];

  const isInfinite =
    layout === "infinite" ||
    layout === "infinite-dual" ||
    layout === "infinite-triple";
  const isCarousel = layout === "carousel";

  /* grid config per layout */
  const gridStyle =
    layout === "horizontal"
      ? { display: "flex", flexDirection: "column", gap: c.cardGap || 16 }
      : layout === "spotlight"
        ? {
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(cols, 3)}, minmax(0,1fr))`,
            gap: c.cardGap || 32,
          }
        : {
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            gap: c.cardGap || 24,
          };

  return (
    <section
      id={navId}
      style={{
        background: getBg(c),
        paddingTop: c.paddingY || 80,
        paddingBottom: c.paddingY || 80,
        paddingLeft: isInfinite ? 0 : c.paddingX || 32,
        paddingRight: isInfinite ? 0 : c.paddingX || 32,
        overflow: "hidden",
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: isInfinite ? "none" : 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isInfinite ? 40 : 48,
            paddingLeft: isInfinite ? c.paddingX || 32 : 0,
            paddingRight: isInfinite ? c.paddingX || 32 : 0,
          }}
        >
          <SectionBadge badge={c.badge} />
          <SectionHeading c={c} />
          {c.subheading && (
            <p
              data-anim
              style={{
                fontSize: 16,
                color: c.subheadingColor || "#64748b",
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              {c.subheading}
            </p>
          )}
        </div>

        {/* Members grid / carousel / infinite */}
        {isCarousel && <TeamCarousel items={items} c={c} />}

        {layout === "infinite" && (
          <InfiniteStrip items={items} c={c} dir="left" />
        )}

        {layout === "infinite-dual" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: c.cardGap || 20,
            }}
          >
            <InfiniteStrip items={items} c={c} dir="left" />
            <InfiniteStrip items={[...items].reverse()} c={c} dir="right" />
          </div>
        )}

        {layout === "infinite-triple" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: c.cardGap || 20,
            }}
          >
            <InfiniteStrip items={items} c={c} dir="left" />
            <InfiniteStrip items={[...items].reverse()} c={c} dir="right" />
            <InfiniteStrip items={items} c={c} dir="left" />
          </div>
        )}

        {!isCarousel && !isInfinite && (
          <div className="_tmGridResp" style={gridStyle}>
            {items.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                c={c}
                index={i}
                layout={layout}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
