import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { SectionBadge, SectionHeading } from "./AboutSection";
import { loadFont } from "../../../utils/fontLoader";

/* ─── Background helper ───────────────────────────────────────────────────── */
// Replace getBg with this:
const getBg = (c) => {
  if (c.bgType === "gradient")
    return `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from || "#667eea"}, ${c.bgGradient?.to || "#764ba2"})`;
  if (c.bgType === "image") return "none"; // handled via backgroundImage below
  return c.bg || "#ffffff";
};

// Helper for full section style:
const getSectionStyle = (c) => {
  const base = {
    position: "relative",
    paddingTop: c.paddingY || 80,
    paddingBottom: c.paddingY || 80,
    paddingLeft: c.paddingX || 32,
    paddingRight: c.paddingX || 32,
    overflow: "hidden",
  };

  if (c.bgType === "image" && c.bgImage) {
    return {
      ...base,
      backgroundImage: `url(${c.bgImage})`,
      backgroundSize: c.bgSize || "cover",
      backgroundPosition: c.bgPosition || "center",
      backgroundRepeat: c.bgRepeat || "no-repeat",
      backgroundAttachment: c.bgFixed ? "fixed" : "scroll",
    };
  }

  return { ...base, background: getBg(c) };
};

/* ─── Icon renderer ───────────────────────────────────────────────────────── */
function FaqIcon({ style, isOpen, color, size = 22 }) {
  const s = {
    color,
    flexShrink: 0,
    marginLeft: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease",
    fontSize: size,
    lineHeight: 1,
    width: size + 4,
    height: size + 4,
  };

  switch (style) {
    case "chevron":
      return (
        <span
          style={{ ...s, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ❯
        </span>
      );
    case "arrow":
      return (
        <span
          style={{
            ...s,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ↓
        </span>
      );
    case "dash":
      return <span style={{ ...s }}>{isOpen ? "−" : "+"}</span>;
    case "circle":
      return (
        <span
          style={{
            ...s,
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            fontSize: size * 0.6,
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      );
    default: // plus
      return (
        <span
          style={{ ...s, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      );
  }
}

/* ─── Particles canvas ────────────────────────────────────────────────────── */
function ParticlesBg({
  color = "#2563eb",
  count = 30,
  size = 3,
  speed = 1,
  shape = "circle",
}) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * size + 1,
      vx: (Math.random() - 0.5) * speed * 0.5,
      vy: (Math.random() - 0.5) * speed * 0.5,
      o: Math.random() * 0.5 + 0.2,
    }));

    const drawShape = (p) => {
      ctx.beginPath();
      ctx.globalAlpha = p.o;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      if (shape === "square") {
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      } else if (shape === "ring") {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (shape === "star") {
        const sp = 5,
          outer = p.r,
          inner = p.r * 0.4;
        for (let i = 0; i < sp * 2; i++) {
          const angle = (i * Math.PI) / sp - Math.PI / 2;
          const rad = i % 2 === 0 ? outer : inner;
          i === 0
            ? ctx.moveTo(
                p.x + Math.cos(angle) * rad,
                p.y + Math.sin(angle) * rad,
              )
            : ctx.lineTo(
                p.x + Math.cos(angle) * rad,
                p.y + Math.sin(angle) * rad,
              );
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        drawShape(p);
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, count, size, speed, shape]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Decorative blobs ────────────────────────────────────────────────────── */
function Blobs({ color = "#a5b4fc", opacity = 20 }) {
  const o = opacity / 100;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40%",
          paddingBottom: "40%",
          borderRadius: "50%",
          background: color,
          opacity: o,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "35%",
          paddingBottom: "35%",
          borderRadius: "50%",
          background: color,
          opacity: o * 0.7,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ─── Item reveal animation styles ───────────────────────────────────────── */
function getItemAnimStyle(preset, index, delay, duration, visible) {
  if (!visible || preset === "none") return {};
  const d = `${index * (delay || 80)}ms`;
  const dur = `${duration || 500}ms`;
  const base = {
    animationDelay: d,
    animationDuration: dur,
    animationFillMode: "both",
  };
  const map = {
    fadeIn: { animation: `faq-fadeIn ${dur} ease ${d} both` },
    fadeUp: { animation: `faq-fadeUp ${dur} ease ${d} both` },
    fadeDown: { animation: `faq-fadeDown ${dur} ease ${d} both` },
    slideLeft: { animation: `faq-slideLeft ${dur} ease ${d} both` },
    slideRight: { animation: `faq-slideRight ${dur} ease ${d} both` },
    zoomIn: { animation: `faq-zoomIn ${dur} ease ${d} both` },
    flipUp: { animation: `faq-flipUp ${dur} ease ${d} both` },
    stagger: { animation: `faq-fadeUp ${dur} ease ${d} both` },
  };
  return map[preset] || {};
}

/* ─── Grid variant ────────────────────────────────────────────────────────── */
function GridFaq({
  items,
  c,
  animPreset,
  staggerDelay,
  animDuration,
  visible,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: c.itemGap || 16,
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            background: c.itemBg || "#fff",
            border: `${c.itemBorderWidth ?? 1}px solid ${c.borderColor || "#e2e8f0"}`,
            borderRadius: c.itemRadius ?? 12,
            padding: "24px 20px",
            ...getItemAnimStyle(
              animPreset,
              i,
              staggerDelay,
              animDuration,
              visible,
            ),
          }}
        >
          <div
            style={{
              fontSize: 28,
              marginBottom: 10,
              color: c.accentColor || "#2563eb",
            }}
          >
            ❓
          </div>
          <p
            style={{
              fontSize: c.questionSize || 15,
              fontWeight: 700,
              color: c.headingColor || "#0f172a",
              marginBottom: 10,
            }}
          >
            {item.question}
          </p>
          <p
            style={{
              fontSize: c.answerSize || 14,
              color: c.bodyColor || "#64748b",
              lineHeight: 1.75,
            }}
          >
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Tabs variant ────────────────────────────────────────────────────────── */
function TabsFaq({ items, c }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(i)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: `1.5px solid ${active === i ? c.accentColor || "#2563eb" : c.borderColor || "#e2e8f0"}`,
              background:
                active === i ? c.accentColor || "#2563eb" : "transparent",
              color: active === i ? "#fff" : c.headingColor || "#0f172a",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Q{i + 1}
          </button>
        ))}
      </div>
      {items[active] && (
        <div
          style={{
            background: c.itemBgOpen || "#fafafa",
            border: `${c.itemBorderWidth ?? 1}px solid ${c.borderColor || "#e2e8f0"}`,
            borderRadius: c.itemRadius ?? 12,
            padding: "24px 20px",
          }}
        >
          <p
            style={{
              fontSize: c.questionSize || 15,
              fontWeight: 700,
              color: c.headingColor || "#0f172a",
              marginBottom: 12,
            }}
          >
            {items[active].question}
          </p>
          <p
            style={{
              fontSize: c.answerSize || 14,
              color: c.bodyColor || "#64748b",
              lineHeight: 1.75,
            }}
          >
            {items[active].answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Timeline variant ────────────────────────────────────────────────────── */
function TimelineFaq({ items, c }) {
  return (
    <div style={{ position: "relative", paddingLeft: 32 }}>
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 0,
          bottom: 0,
          width: 2,
          background: c.borderColor || "#e2e8f0",
        }}
      />
      {items.map((item, i) => (
        <div key={item.id} style={{ position: "relative", marginBottom: 28 }}>
          <div
            style={{
              position: "absolute",
              left: -26,
              top: 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: c.accentColor || "#2563eb",
              border: "2px solid #fff",
              boxShadow: `0 0 0 3px ${c.accentColor || "#2563eb"}33`,
            }}
          />
          <p
            style={{
              fontSize: c.questionSize || 15,
              fontWeight: 700,
              color: c.headingColor || "#0f172a",
              marginBottom: 6,
            }}
          >
            {item.question}
          </p>
          <p
            style={{
              fontSize: c.answerSize || 14,
              color: c.bodyColor || "#64748b",
              lineHeight: 1.75,
            }}
          >
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Accordion variant ───────────────────────────────────────────────────── */
function AccordionFaq({
  items,
  c,
  animPreset,
  staggerDelay,
  animDuration,
  visible,
}) {
  const [open, setOpen] = useState(new Set());
  const toggle = (id) => {
    setOpen((prev) => {
      const next = c.allowMultiOpen ? new Set(prev) : new Set();
      prev.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandStyle = (isOpen) => {
    if (c.expandAnim === "snap") return { display: isOpen ? "block" : "none" };
    if (c.expandAnim === "spring")
      return {
        maxHeight: isOpen ? 600 : 0,
        overflow: "hidden",
        transition: "max-height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    return {
      maxHeight: isOpen ? 600 : 0,
      overflow: "hidden",
      transition: "max-height 0.35s ease",
    };
  };

  return (
    <>
      {items.map((item, i) => {
        const isOpen = open.has(item.id);
        return (
          <div
            key={item.id}
            style={{
              background: isOpen
                ? c.itemBgOpen || "#fafafa"
                : c.itemBg || "#ffffff",
              border: `${c.itemBorderWidth ?? 1}px solid ${c.borderColor || "#e2e8f0"}`,
              borderRadius: c.itemRadius ?? 12,
              marginBottom: c.itemGap ?? 10,
              overflow: "hidden",
              transition: "box-shadow 0.2s, background 0.2s",
              boxShadow:
                isOpen && c.itemShadowHover
                  ? "0 4px 20px rgba(0,0,0,0.07)"
                  : "none",
              ...getItemAnimStyle(
                animPreset,
                i,
                staggerDelay,
                animDuration,
                visible,
              ),
            }}
          >
            <button
              onClick={() => toggle(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                minHeight: 44,
              }}
            >
              <span
                style={{
                  fontSize: c.questionSize || 15,
                  fontWeight: 600,
                  color: c.headingColor || "#0f172a",
                  flex: 1,
                  lineHeight: 1.4,
                }}
              >
                {item.question}
              </span>
              <FaqIcon
                style={c.iconStyle || "plus"}
                isOpen={isOpen}
                color={c.accentColor || "#2563eb"}
                size={c.iconSize || 22}
              />
            </button>
            <div style={expandStyle(isOpen)}>
              <div
                style={{
                  padding: "4px 20px 18px",
                  fontSize: c.answerSize || 14,
                  color: c.bodyColor || "#64748b",
                  lineHeight: 1.75,
                }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ─── Main Section ────────────────────────────────────────────────────────── */
export default function FaqSection({ config: c, navId }) {
  loadFont(c.headingFont);
  const ref = useScrollAnimation(c.animation);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  const align = c.align || "center";
  const items = c.items || [];

  const textAlign = align;
  const marginAuto =
    align === "center" ? "0 auto" : align === "right" ? "0 0 0 auto" : "0";

  return (
    <>
      <style>{`
        @keyframes faq-fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes faq-fadeUp    { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes faq-fadeDown  { from { opacity: 0; transform: translateY(-24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes faq-slideLeft { from { opacity: 0; transform: translateX(-32px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes faq-slideRight{ from { opacity: 0; transform: translateX(32px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes faq-zoomIn    { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
        @keyframes faq-flipUp    { from { opacity: 0; transform: perspective(400px) rotateX(20deg) } to { opacity: 1; transform: perspective(400px) rotateX(0) } }
        @media (prefers-reduced-motion: reduce) {
          [class*="faq-"] { animation: none !important; }
        }
      `}</style>

      <section id={navId} style={getSectionStyle(c)}>
        {/* BG FX */}
        {c.particles && (
          <ParticlesBg
            color={c.particleColor || "#2563eb"}
            count={c.particleCount || 30}
            size={c.particleSize || 3}
            speed={c.particleSpeed || 1}
            shape={c.particleShape || "circle"}
          />
        )}
        {c.blobs && (
          <Blobs
            color={c.blobColor || "#a5b4fc"}
            opacity={c.blobOpacity ?? 20}
          />
        )}
        {c.bgOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: c.bgOverlayColor || "rgba(0,0,0,0.4)",
              opacity: (c.bgOverlayOpacity ?? 40) / 100,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Content */}
        <div
          ref={ref}
          style={{
            maxWidth: c.maxWidth || 760,
            margin: marginAuto,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign, marginBottom: 44 }}>
            <SectionBadge badge={c.badge} />
            <SectionHeading c={c} />
            {c.subheading && (
              <p
                style={{
                  fontSize: 16,
                  color: c.subheadingColor || "#64748b",
                  marginTop: 8,
                }}
              >
                {c.subheading}
              </p>
            )}
          </div>

          {c.variant === "grid" && (
            <GridFaq
              items={items}
              c={c}
              animPreset={c.animPreset}
              staggerDelay={c.staggerDelay}
              animDuration={c.animDuration}
              visible={visible}
            />
          )}
          {c.variant === "tabs" && <TabsFaq items={items} c={c} />}
          {c.variant === "timeline" && <TimelineFaq items={items} c={c} />}
          {(!c.variant || c.variant === "accordion") && (
            <AccordionFaq
              items={items}
              c={c}
              animPreset={c.animPreset}
              staggerDelay={c.staggerDelay}
              animDuration={c.animDuration}
              visible={visible}
            />
          )}
        </div>
      </section>
    </>
  );
}
