import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GLBackground from "../../../three/GLBackground";
import { loadFont } from "../../../utils/fontLoader";

gsap.registerPlugin(ScrollTrigger);

const resolveUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "")}${url}`;
};

function useBreakpoint() {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const calc = () => setBp(window.innerWidth < 640 ? "mobile" : "desktop");
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return bp;
}

const ANCHOR_TRANSFORMS = {
  "top-left": "translate(0, 0)",
  "top-center": "translate(-50%, 0)",
  "top-right": "translate(-100%, 0)",
  "center-left": "translate(0, -50%)",
  center: "translate(-50%, -50%)",
  "center-right": "translate(-100%, -50%)",
  "bottom-left": "translate(0, -100%)",
  "bottom-center": "translate(-50%, -100%)",
  "bottom-right": "translate(-100%, -100%)",
};

/* ── Per-block animated wrapper ──────────────────────────────────────────
   anim shape on a block:
   {
     enabled: bool,
     trigger: "scroll-progress" | "scroll-in" | "none",
     from: { x, y, scale, rotate, opacity },   // starting state
     to:   { x, y, scale, rotate, opacity },   // resting / end state
     ease: "power2.out" etc,
     duration: seconds (only used for scroll-in),
     delay: seconds (only used for scroll-in),
   }
   "scroll-progress" ties the tween directly to scroll position through
   the section (scrub). "scroll-in" plays once when the block enters view.
   ─────────────────────────────────────────────────────────────────────── */
function AnimatedBlockWrapper({ block, bp, sectionRef, children }) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    const sectionEl = sectionRef.current;
    if (!el || !sectionEl) return;
    const a = block.anim;
    if (!a || !a.enabled || a.trigger === "none") return;

    const from = a.from || {};
    const to = a.to || {};

    gsap.set(el, {
      x: from.x ?? 0,
      y: from.y ?? 0,
      scale: from.scale ?? 1,
      rotate: from.rotate ?? 0,
      opacity: from.opacity ?? 1,
    });

    let tween;
    if (a.trigger === "scroll-document") {
      // Driven by scroll progress across the ENTIRE document, not just
      // this section. Used for persistent floating elements (e.g. the
      // hero pill that shrinks into a docked CTA as the whole page scrolls).
      tween = gsap.to(el, {
        x: to.x ?? 0,
        y: to.y ?? 0,
        scale: to.scale ?? 1,
        rotate: to.rotate ?? 0,
        opacity: to.opacity ?? 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    } else if (a.trigger === "scroll-progress") {
      tween = gsap.to(el, {
        x: to.x ?? 0,
        y: to.y ?? 0,
        scale: to.scale ?? 1,
        rotate: to.rotate ?? 0,
        opacity: to.opacity ?? 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    } else if (a.trigger === "scroll-in") {
      tween = gsap.to(el, {
        x: to.x ?? 0,
        y: to.y ?? 0,
        scale: to.scale ?? 1,
        rotate: to.rotate ?? 0,
        opacity: to.opacity ?? 1,
        ease: a.ease || "power2.out",
        duration: a.duration ?? 0.8,
        delay: a.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }

    return () => {
      if (tween?.scrollTrigger) tween.scrollTrigger.kill();
      tween?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.anim, block.id, bp]);

  const hidden = bp === "mobile" ? block.hiddenMobile : block.hidden;
  if (hidden) return null;

  return <div ref={elRef}>{children}</div>;
}

function Block({ block, bp, sectionRef }) {
  loadFont(block.fontFamily);

  const transform = ANCHOR_TRANSFORMS[block.anchor || "top-left"];
  const wrapperStyle = {
    position: "absolute",
    left: `${block.x ?? 0}%`,
    top: `${block.y ?? 0}%`,
    width: block.width ? `${block.width}%` : "auto",
    transform,
    zIndex: block.zIndex ?? 1,
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  let inner = null;

  if (block.type === "text") {
    inner = (
      <div style={wrapperStyle}>
        <div
          style={{
            display: block.display || "block",
            fontSize: block.fontSize ?? 16,
            fontWeight: block.fontWeight ?? 400,
            color: block.color || "#ffffff",
            fontFamily: `'${block.fontFamily || "Inter"}', sans-serif`,
            lineHeight: block.lineHeight ?? 1.4,
            textAlign: block.textAlign || "left",
            background: block.bg || "transparent",
            padding: block.padding || "0",
            borderRadius: block.borderRadius ?? 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {block.text}
        </div>
      </div>
    );
  } else if (block.type === "button") {
    inner = (
      <div style={wrapperStyle}>
        <a
          href={block.url || "#"}
          target={block.url?.startsWith("http") ? "_blank" : "_self"}
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: block.fontSize ?? 14,
            fontWeight: block.fontWeight ?? 600,
            color: block.color || "#ffffff",
            fontFamily: `'${block.fontFamily || "Inter"}', sans-serif`,
            background:
              block.style === "outline" ? "transparent" : block.bg || "#2563eb",
            border:
              block.style === "outline"
                ? `2px solid ${block.bg || "#2563eb"}`
                : "none",
            padding: block.padding || "12px 28px",
            borderRadius: block.borderRadius ?? 8,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {block.label || "Button"}
        </a>
      </div>
    );
  } else if (block.type === "image") {
    inner = (
      <div style={wrapperStyle}>
        <img
          src={resolveUrl(block.src)}
          alt={block.alt || ""}
          style={{
            display: "block",
            width: "100%",
            height: block.height ? block.height : "auto",
            objectFit: block.objectFit || "cover",
            borderRadius: block.borderRadius ?? 0,
            boxShadow: block.shadow ? "0 12px 40px rgba(0,0,0,0.25)" : "none",
          }}
        />
      </div>
    );
  } else if (block.type === "shape") {
    inner = (
      <div style={wrapperStyle}>
        <div
          style={{
            width: block.shapeWidth ?? 200,
            height: block.shapeHeight ?? 80,
            background: block.bg || "#dc2626",
            borderRadius: block.borderRadius ?? 999,
            boxShadow: block.shadow ? "0 20px 60px rgba(0,0,0,0.35)" : "none",
          }}
        />
      </div>
    );
  } else if (block.type === "floatingCta") {
    // Normal in-flow block — scrolls with its section like any other
    // block (uses the same wrapperStyle/anchor positioning as text,
    // button, image, shape). The pill itself never animates — it's
    // static, centered, dead still. ONLY the white circle inside it
    // moves: slides left/right AND scales up, both scrubbed to scroll
    // position through THIS section.
    return (
      <div style={wrapperStyle}>
        <CtaPillWithSlidingCircle block={block} sectionRef={sectionRef} />
      </div>
    );
  }

  if (!inner) return null;

  return (
    <AnimatedBlockWrapper block={block} bp={bp} sectionRef={sectionRef}>
      {inner}
    </AnimatedBlockWrapper>
  );
}

/* ── Pill with a circle that slides AND scales based on scroll ──────────
   The red bar (text + track) is completely static — no animation, no
   AnimatedBlockWrapper, nothing. Only the circle moves:
     - slides left/right, scrubbed 1:1 across the section's visible
       scroll-through range (top-of-section hits top-of-viewport, to
       bottom-of-section hits top-of-viewport — i.e. exactly the scroll
       distance during which this section is the one passing by)
     - scales from circleSize up to circleSizeEnd, as one rigid unit
       (transform: scale, computed from the size ratio — never animates
       width/height directly), over a SHORTER chunk of that same range
       so it finishes faster than the slide
   Both use scrub: true, so they reverse cleanly on scroll-up too.
   ─────────────────────────────────────────────────────────────────────── */
function CtaPillWithSlidingCircle({ block, sectionRef }) {
  const circleRef = useRef(null);

  const baseSize = block.circleSize ?? 76;
  const endSize = block.circleSizeEnd ?? baseSize * 1.4;
  const scaleTo = endSize / baseSize;

  useEffect(() => {
    const circle = circleRef.current;
    const sectionEl = sectionRef.current;
    if (!circle || !sectionEl) return;

    const travel = block.circleTravel ?? (block.pillWidth ?? 380) * 0.5;
    // 0–1, fraction of the section's scroll-through range over which the
    // scale-up completes. 0.4 = done by 40% of the way through — visibly
    // faster than the slide, which always runs the full range.
    const scaleSpeed = block.circleScaleSpeed ?? 0.4;

    gsap.set(circle, { x: -travel / 2, scale: 1 });

    // This range matches exactly the scroll distance during which the
    // section is passing through the viewport — start as soon as its
    // top reaches the top of the screen, end once its bottom does too.
    const slideTween = gsap.to(circle, {
      x: travel / 2,
      ease: "none",
      scrollTrigger: {
        trigger: sectionEl,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    const scaleTween = gsap.to(circle, {
      scale: scaleTo,
      ease: "none",
      scrollTrigger: {
        trigger: sectionEl,
        start: "top top",
        end: `top+=${Math.max(50, sectionEl.offsetHeight * scaleSpeed)} top`,
        scrub: true,
      },
    });

    return () => {
      [slideTween, scaleTween].forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    block.circleTravel,
    block.pillWidth,
    block.circleSize,
    block.circleSizeEnd,
    block.circleScaleSpeed,
    block.id,
  ]);

  return (
    <a
      href={block.url || "#"}
      target={block.url?.startsWith("http") ? "_blank" : "_self"}
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: block.gap ?? 16,
        width: block.pillWidth ?? 380,
        height: block.pillHeight ?? 96,
        background: block.bg || "#dc2626",
        borderRadius: block.borderRadius ?? 999,
        padding: block.padding || "0 10px 0 28px",
        boxShadow: block.shadow ? "0 16px 50px rgba(0,0,0,0.35)" : "none",
        textDecoration: "none",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.1,
          flex: 1,
          minWidth: 0,
          fontFamily: `'${block.fontFamily || "Inter"}', sans-serif`,
        }}
      >
        {block.eyebrow && (
          <span
            style={{
              fontSize: block.eyebrowSize ?? 13,
              fontWeight: 500,
              color: block.eyebrowColor || "rgba(255,255,255,0.85)",
              whiteSpace: "nowrap",
            }}
          >
            {block.eyebrow}
          </span>
        )}
        <span
          style={{
            fontSize: block.fontSize ?? 36,
            fontWeight: block.fontWeight ?? 700,
            color: block.color || "#ffffff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {block.label || "Get Started"}
        </span>
      </span>
      <span
        ref={circleRef}
        style={{
          flexShrink: 0,
          width: baseSize,
          height: baseSize,
          borderRadius: "50%",
          background: block.circleBg || "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={block.iconColor || "#0f172a"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
        {block.subLabel && (
          <span
            style={{
              fontSize: block.subLabelSize ?? 10,
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: block.subLabelColor || "#9ca3af",
              whiteSpace: "nowrap",
            }}
          >
            {block.subLabel}
          </span>
        )}
      </span>
    </a>
  );
}

export default function AnimatedHeroSection({ config: c, navId }) {
  const bp = useBreakpoint();
  const sectionRef = useRef(null);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && sectionRef.current?.contains(st.trigger)) st.kill();
      });
    };
  }, []);

  const minHeight =
    bp === "mobile" ? (c.minHeightMobile ?? 480) : (c.minHeight ?? 640);

  const blocks = c.blocks || [];

  return (
    <section
      ref={sectionRef}
      id={navId}
      style={{
        position: "relative",
        minHeight,
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
        background: c.fallbackBg || "#0f172a",
      }}
    >
      <GLBackground
        texture={c.glTexture || "waves"}
        colorA={c.glColorA || "#0f172a"}
        colorB={c.glColorB || "#1e3a5f"}
        speed={c.glSpeed ?? 1}
        density={c.glDensity ?? 1}
        opacity={c.glOpacity ?? 1}
        interactive={c.glInteractive !== false}
      />

      {c.overlay?.enabled && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              c.overlay.type === "gradient"
                ? `linear-gradient(${c.overlay.gradientDirection || "to top"}, ${c.overlay.gradientFrom || "rgba(0,0,0,0.6)"}, ${c.overlay.gradientTo || "rgba(0,0,0,0.05)"})`
                : c.overlay.color || "rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: c.maxWidthInner ?? 1200,
          margin: "0 auto",
          zIndex: 1,
        }}
      >
        {blocks.map((b) => (
          <Block key={b.id} block={b} bp={bp} sectionRef={sectionRef} />
        ))}
      </div>
    </section>
  );
}
