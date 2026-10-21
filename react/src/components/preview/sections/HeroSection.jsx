import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { resolveUrl } from "../../../utils/resolveUrl";
import { loadFont } from "../../../utils/fontLoader";

// ── Background color helper ───────────────────────────────────────────────────
const getBg = (cfg) => {
  if (cfg.bgType === "image" && cfg.bgImage) return "none";
  if (cfg.bgType === "gradient" && cfg.bgGradient) return "none";
  return cfg.bg || "#0f172a";
};

// ── Animated Background Canvas ────────────────────────────────────────────────
function AnimatedBg({
  preset,
  color = "#2563eb",
  density = 50,
  speed = 50,
  size = 50,
  glow = 50,
  count = 50,
}) {
  const canvasRef = useRef(null);
  const dF = Math.max(0, Math.min(100, density)) / 50;
  const spF = Math.max(0, Math.min(100, speed)) / 50;
  const szF = Math.max(0, Math.min(100, size)) / 50;
  const gF = Math.max(0, Math.min(100, glow)) / 50;
  const cF = Math.max(0, Math.min(100, count)) / 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf,
      particles = [],
      w,
      h;
    const hex = (color || "#2563eb").replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);
    const init = (n, opts) => {
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        ...opts(),
      }));
    };

    if (preset === "particles") {
      init(Math.round(60 * dF * cF), () => ({
        r: (Math.random() * 2 + 0.5) * szF,
        vx: (Math.random() - 0.5) * 0.4 * spF,
        vy: (Math.random() - 0.5) * 0.4 * spF,
        a: (Math.random() * 0.5 + 0.2) * gF,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          p.x = (p.x + p.vx + w) % w;
          p.y = (p.y + p.vy + h) % h;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.1, p.r), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, p.a)})`;
          ctx.fill();
        });
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "orbs") {
      init(Math.max(1, Math.round(5 * dF * cF)), () => ({
        radius: (Math.random() * 120 + 80) * szF,
        vx: (Math.random() - 0.5) * 0.3 * spF,
        vy: (Math.random() - 0.5) * 0.3 * spF,
        a: (0.08 + Math.random() * 0.08) * gF,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          p.x = ((p.x + p.vx + w + p.radius) % (w + p.radius * 2)) - p.radius;
          p.y = ((p.y + p.vy + h + p.radius) % (h + p.radius * 2)) - p.radius;
          const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          gr.addColorStop(0, `rgba(${r},${g},${b},${Math.min(1, p.a)})`);
          gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = gr;
          ctx.fillRect(
            p.x - p.radius,
            p.y - p.radius,
            p.radius * 2,
            p.radius * 2,
          );
        });
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "mesh") {
      let t = 0;
      const bc = Math.max(1, Math.round(3 * dF * cF));
      const draw = () => {
        t += 0.004 * spF;
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < bc; i++) {
          const cx = w / 2 + Math.sin(t + i * 2) * w * 0.3;
          const cy = h / 2 + Math.cos(t * 0.8 + i * 2) * h * 0.3;
          const rad = Math.max(w, h) * 0.5 * szF;
          const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          gr.addColorStop(
            0,
            `rgba(${r},${g},${b},${Math.min(1, (0.1 - i * 0.02) * gF)})`,
          );
          gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = gr;
          ctx.fillRect(0, 0, w, h);
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "grid") {
      let t = 0;
      const sp = Math.max(10, 50 / szF - dF * 10);
      const draw = () => {
        t += 0.02 * spF;
        ctx.clearRect(0, 0, w, h);
        const pulse = (Math.sin(t) + 1) / 2;
        ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(1, (0.05 + pulse * 0.07) * gF)})`;
        ctx.lineWidth = 1;
        for (let x = 0; x <= w; x += sp) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y <= h; y += sp) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "stars") {
      init(Math.round(80 * dF * cF), () => ({
        r: (Math.random() * 1.5 + 0.3) * szF,
        a: Math.random(),
        spd: (Math.random() * 0.02 + 0.005) * spF,
        dir: Math.random() > 0.5 ? 1 : -1,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          p.a += p.spd * p.dir;
          if (p.a <= 0 || p.a >= 1) p.dir *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.1, p.r), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0, Math.min(1, p.a)) * Math.min(1, 0.6 * gF)})`;
          ctx.fill();
        });
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "waves") {
      let t = 0;
      const lc = Math.max(1, Math.round(3 * dF * cF));
      const draw = () => {
        t += 0.01 * spF;
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < lc; i++) {
          ctx.beginPath();
          const amp = (18 + i * 10) * szF;
          const yO = h * (0.3 + (i % 3) * 0.25);
          for (let x = 0; x <= w; x += 6) {
            const y = yO + Math.sin(x * 0.01 + t + i) * amp;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(1, (0.12 - (i % 3) * 0.025) * gF)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [preset, color, dF, spF, szF, gF, cF]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Hero Button ───────────────────────────────────────────────────────────────
function HeroBtn({ btn }) {
  const pad =
    btn.size === "lg"
      ? "14px 32px"
      : btn.size === "sm"
        ? "8px 18px"
        : "11px 24px";
  const fs = btn.size === "lg" ? 16 : btn.size === "sm" ? 12 : 14;
  const isOutline = btn.style === "outline";
  const isGhost = btn.style === "ghost";
  const baseBg = isOutline || isGhost ? "transparent" : btn.bg;
  const baseColor = isOutline || isGhost ? btn.bg : btn.color;
  const baseBorder = isOutline ? `2px solid ${btn.bg}` : "none";
  return (
    <a
      href={btn.url || "#"}
      style={{
        display: "inline-block",
        padding: pad,
        fontSize: fs,
        fontWeight: 700,
        textDecoration: "none",
        borderRadius: btn.borderRadius || 10,
        background: baseBg,
        color: baseColor,
        border: baseBorder,
        transition: "background 0.2s, color 0.2s, transform 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = btn.hoverBg || btn.bg;
        e.currentTarget.style.color = btn.hoverColor || "#fff";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = baseBg;
        e.currentTarget.style.color = baseColor;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {btn.label}
    </a>
  );
}

// ── Gallery Strip ─────────────────────────────────────────────────────────────
function GalleryStrip({ gallery }) {
  const images = gallery.images || [];
  if (images.length === 0) return null;
  const loopImages = [...images, ...images, ...images];
  const animName =
    (gallery.direction || "left") === "right"
      ? "galleryScrollRight"
      : "galleryScrollLeft";
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <style>{`
        @keyframes galleryScrollLeft { 0% { transform:translateX(0); } 100% { transform:translateX(-33.333%); } }
        @keyframes galleryScrollRight { 0% { transform:translateX(-33.333%); } 100% { transform:translateX(0); } }
        .g-track { display:flex; width:max-content; animation:${animName} ${gallery.speed ?? 40}s linear infinite; }
        .g-track:hover { animation-play-state:${gallery.scrollMode === "both" ? "paused" : "running"}; }
        .g-img { flex-shrink:0; overflow:hidden; transition:transform 0.3s; }
        .g-img:hover { transform:scale(1.03); }
        .g-img img { display:block; transition:filter 0.4s; ${gallery.grayscaleHover ? "filter:grayscale(100%);" : ""} }
        ${gallery.grayscaleHover ? ".g-img:hover img { filter:grayscale(0%); }" : ""}
      `}</style>
      <div className="g-track">
        {loopImages.map((img, i) => (
          <div
            key={i}
            className="g-img"
            style={{
              height: gallery.imageHeight || 200,
              marginRight: gallery.gap || 16,
              borderRadius: gallery.borderRadius || 8,
              boxShadow: gallery.shadow
                ? "0 8px 24px rgba(0,0,0,0.25)"
                : "none",
            }}
          >
            <img
              src={resolveUrl(img.url)}
              alt={img.alt || ""}
              style={{
                height: gallery.imageHeight || 200,
                width: "auto",
                minWidth: 120,
                maxWidth: 400,
                objectFit: gallery.objectFit || "cover",
                borderRadius: gallery.borderRadius || 8,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Carousel ──────────────────────────────────────────────────────────────────
function HeroCarousel({ slides = [], style = {}, c }) {
  const [idx, setIdx] = useState(0);
  const [animClass, setAnimClass] = useState("visible");
  const timerRef = useRef(null);
  const anim = style.animation || "slide";
  const theme = style.theme || "dark";
  const itemsPerView = Number(style.itemsPerView) || 1;
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const totalPages = Math.max(1, Math.ceil(slides.length / itemsPerView));
  const tc =
    {
      dark: {
        arrowBg: "rgba(0,0,0,0.55)",
        arrowColor: "#fff",
        dotActive: "#fff",
        dotInactive: "rgba(255,255,255,0.4)",
      },
      light: {
        arrowBg: "rgba(255,255,255,0.85)",
        arrowColor: "#0f172a",
        dotActive: "#0f172a",
        dotInactive: "rgba(15,23,42,0.3)",
      },
      accent: {
        arrowBg: "rgba(37,99,235,0.85)",
        arrowColor: "#fff",
        dotActive: "#2563eb",
        dotInactive: "rgba(37,99,235,0.3)",
      },
    }[theme] || {};
  const go = (next) => {
    const target = ((next % totalPages) + totalPages) % totalPages;
    setAnimClass("exit");
    setTimeout(() => {
      setIdx(target);
      setAnimClass("enter");
      setTimeout(() => setAnimClass("visible"), 50);
    }, 320);
  };
  useEffect(() => {
    if (!style.autoPlay || slides.length <= 1) return;
    timerRef.current = setInterval(
      () => go(idxRef.current + 1),
      style.interval || 4000,
    );
    return () => clearInterval(timerRef.current);
  }, [style.autoPlay, style.interval, slides.length]);
  const animStyle = () => {
    if (anim === "fade")
      return {
        opacity: animClass === "visible" ? 1 : 0,
        transition: "opacity 0.4s ease",
      };
    if (anim === "zoom")
      return {
        opacity: animClass === "visible" ? 1 : 0,
        transform: animClass === "visible" ? "scale(1)" : "scale(0.92)",
        transition: "all 0.4s ease",
      };
    return {
      opacity: animClass === "visible" ? 1 : 0,
      transform:
        animClass === "visible"
          ? "translateY(0)"
          : animClass === "exit"
            ? "translateY(-20px)"
            : "translateY(20px)",
      transition: "all 0.35s ease",
    };
  };
  const slide = slides[idx] || {};
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingLeft: 48,
        paddingRight: 48,
        paddingBottom: style.showDots ? 48 : 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          ...animStyle(),
          width: style.customWidth ? `${style.slideWidth || 400}px` : "100%",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {slide.badge?.show && (
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: 100,
                background: slide.badge.bg || "#eff6ff",
                color: slide.badge.color || "#2563eb",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              {slide.badge.text}
            </div>
          )}
          {slide.showText !== false && (
            <>
              <h2
                style={{
                  fontSize: c?.headingSize || 56,
                  fontWeight: 800,
                  color: slide.headingColor || "#fff",
                  margin: "0 0 16px",
                  lineHeight: 1.1,
                }}
              >
                {slide.heading}
              </h2>
              {slide.subheading && (
                <p
                  style={{
                    fontSize: c?.subheadingSize || 18,
                    color: slide.subheadingColor || "rgba(255,255,255,0.7)",
                    margin: "0 0 28px",
                    lineHeight: 1.7,
                  }}
                >
                  {slide.subheading}
                </p>
              )}
            </>
          )}
          {slide.image?.show && slide.image?.url && (
            <div
              style={{
                width: "100%",
                aspectRatio: `${style.imageAspectW || 16}/${style.imageAspectH || 9}`,
                borderRadius: style.imageBorderRadius || 16,
                overflow: "hidden",
                boxShadow: style.imageShadow
                  ? "0 32px 80px rgba(0,0,0,0.3)"
                  : "none",
              }}
            >
              <img
                src={resolveUrl(slide.image.url)}
                alt="slide"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
          {(slide.buttons || []).length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {slide.buttons.map((btn) => (
                <HeroBtn key={btn.id} btn={btn} />
              ))}
            </div>
          )}
        </div>
      </div>
      {style.showArrows && slides.length > 1 && (
        <>
          <button
            onClick={() => go(idx - 1)}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: tc.arrowBg,
              border: "none",
              color: tc.arrowColor,
              cursor: "pointer",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <button
            onClick={() => go(idx + 1)}
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: tc.arrowBg,
              border: "none",
              color: tc.arrowColor,
              cursor: "pointer",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </>
      )}
      {style.showDots && totalPages > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === idx ? 20 : 7,
                height: 7,
                borderRadius: 100,
                border: "none",
                background: i === idx ? tc.dotActive : tc.dotInactive,
                cursor: "pointer",
                transition: "all 0.25s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Canvas Block Renderer ─────────────────────────────────────────────────────
function CanvasBlock({ block, headingFont, bodyFont }) {
  // Skip invisible blocks
  if (block.visible === false) return null;

  const textAlign = block.align || "center";
  const marginStyle =
    textAlign === "left"
      ? "0 auto 0 0"
      : textAlign === "right"
        ? "0 0 0 auto"
        : "0 auto";

  const highlight = (text, hl, hlColor) => {
    if (!hl || !text?.includes(hl)) return text;
    return text.split(hl).reduce((acc, part, i, arr) => {
      if (i < arr.length - 1)
        return [
          ...acc,
          part,
          <span key={i} style={{ color: hlColor || "#60a5fa" }}>
            {hl}
          </span>,
        ];
      return [...acc, part];
    }, []);
  };

  switch (block.type) {
    case "heading":
      return (
        <h1
          style={{
            fontSize: block.fontSize || 64,
            fontWeight: block.fontWeight || 800,
            color: block.color || "#fff",
            fontFamily: `'${headingFont || "Inter"}', sans-serif`,
            lineHeight: 1.1,
            margin: "0 0 8px",
            textAlign,
            whiteSpace: "pre-line",
          }}
        >
          {highlight(block.text || "", block.highlight, block.highlightColor)}
        </h1>
      );
    case "subheading":
      return (
        <p
          style={{
            fontSize: block.fontSize || 18,
            color: block.color || "rgba(255,255,255,0.7)",
            fontFamily: `'${bodyFont || "Inter"}', sans-serif`,
            lineHeight: 1.7,
            margin: "0 0 8px",
            maxWidth: block.maxWidth || 640,
            marginLeft: textAlign === "center" ? "auto" : 0,
            marginRight: textAlign === "center" ? "auto" : 0,
            textAlign,
          }}
        >
          {block.text}
        </p>
      );
    case "badge":
      return (
        <div style={{ textAlign }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: block.borderRadius ?? 100,
              background: block.bg || "rgba(99,102,241,0.15)",
              color: block.color || "#818cf8",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {block.text}
          </span>
        </div>
      );
    case "buttons":
      return (
        <div
          style={{
            display: "flex",
            gap: block.gap || 12,
            flexWrap: "wrap",
            justifyContent:
              textAlign === "left"
                ? "flex-start"
                : textAlign === "right"
                  ? "flex-end"
                  : "center",
          }}
        >
          {(block.items || []).map((btn) => (
            <HeroBtn key={btn.id} btn={btn} />
          ))}
        </div>
      );
    case "image":
      if (!block.url) return null;
      return (
        <div style={{ textAlign }}>
          <img
            src={resolveUrl(block.url)}
            alt={block.alt || ""}
            style={{
              width: `${block.width || 100}%`,
              maxWidth: block.maxWidth ? `${block.maxWidth}px` : "700px",
              borderRadius: block.borderRadius ?? 16,
              opacity: (block.opacity ?? 100) / 100,
              boxShadow: block.shadow ? "0 24px 60px rgba(0,0,0,0.35)" : "none",
              display: "inline-block",
            }}
          />
        </div>
      );
    case "richtext":
      return (
        <div
          style={{
            textAlign,
            maxWidth: block.maxWidth || 800,
            margin: marginStyle,
            width: "100%",
          }}
        >
          <div
            className="hero-rich-text"
            dangerouslySetInnerHTML={{ __html: block.html || "" }}
            style={{ color: "inherit", fontFamily: "inherit" }}
          />
        </div>
      );
    case "gallery":
      return <GalleryStrip gallery={block} />;
    case "carousel":
      return (
        <HeroCarousel
          slides={block.slides || []}
          style={block.style || {}}
          c={{ headingSize: 48, subheadingSize: 18 }}
        />
      );
    case "spacer":
      return <div style={{ height: block.height || 40 }} />;
    case "divider":
      return (
        <div style={{ textAlign: "center" }}>
          <hr
            style={{
              border: "none",
              borderTop: `${block.thickness || 1}px ${block.style || "solid"} ${block.color || "rgba(255,255,255,0.15)"}`,
              width: `${block.width || 100}%`,
              margin: "0 auto",
            }}
          />
        </div>
      );
    case "stats":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`,
            gap: 16,
          }}
        >
          {(block.items || []).map((item) => (
            <div
              key={item.id}
              style={{
                background: block.bg || "rgba(255,255,255,0.05)",
                border: `1px solid ${block.borderColor || "rgba(255,255,255,0.1)"}`,
                borderRadius: block.borderRadius || 12,
                padding: "20px 16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: block.valueFontSize || 36,
                  fontWeight: 800,
                  color: block.valueColor || "#fff",
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontSize: block.labelFontSize || 13,
                  color: block.labelColor || "rgba(255,255,255,0.6)",
                  marginTop: 6,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      );
    case "iconrow":
      return (
        <div
          style={{
            display: "flex",
            gap: block.gap || 32,
            justifyContent:
              textAlign === "left"
                ? "flex-start"
                : textAlign === "right"
                  ? "flex-end"
                  : "center",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {(block.items || []).map((item) => (
            <div
              key={item.id}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: block.iconSize || 24 }}>
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: block.labelFontSize || 14,
                  color: block.labelColor || "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

// ── Absolute Block Wrapper ────────────────────────────────────────────────────
function AbsoluteBlock({ block, headingFont, bodyFont }) {
  if (block.visible === false) return null;

  const anchor = block.anchor || "center";
  const x = block.x ?? 50;
  const y = block.y ?? 50;
  const w = block.width ?? 100;
  const z = block.zIndex ?? 1;

  const transformMap = {
    center: "translate(-50%, -50%)",
    "top-left": "translate(0, 0)",
    "top-right": "translate(-100%, 0)",
    "bottom-left": "translate(0, -100%)",
    "bottom-right": "translate(-100%, -100%)",
    "top-center": "translate(-50%, 0)",
    "bottom-center": "translate(-50%, -100%)",
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        zIndex: z,
        transform: transformMap[anchor] || "translate(-50%, -50%)",
        pointerEvents: "auto",
      }}
    >
      <CanvasBlock
        block={block}
        headingFont={headingFont}
        bodyFont={bodyFont}
      />
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function HeroSection({ config: c, navId }) {
  loadFont(c.headingFont);
  loadFont(c.bodyFont);
  const ref = useScrollAnimation(c.animation);
  const isImage = c.bgType === "image" && c.bgImage;
  const isBuilderMode = !!c._builderMode && (c.canvasBlocks || []).length > 0;
  const visibleBlocks = (c.canvasBlocks || []).filter(
    (b) => b.visible !== false,
  );
  const flowBlocks = visibleBlocks.filter(
    (b) => !b.position || b.position === "flow",
  );
  const absoluteBlocks = visibleBlocks.filter((b) => b.position === "absolute");

  return (
    <section
      id={navId}
      style={{
        position: "relative",
        minHeight: `${c.minHeight || 100}vh`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: getBg(c),
        overflow: "hidden",
        paddingTop: c.paddingY || 120,
        paddingBottom: c.paddingY || 120,
        paddingLeft: c.paddingX || 32,
        paddingRight: c.paddingX || 32,
      }}
    >
      <style>{`
.hero-rich-text { color:inherit; overflow-wrap:break-word; word-break:break-word; }
s        .hero-rich-text h1 { font-size:2.5em; font-weight:800; margin:0 0 .5em; }
        .hero-rich-text h2 { font-size:1.8em; font-weight:700; margin:0 0 .5em; }
        .hero-rich-text h3 { font-size:1.3em; font-weight:600; margin:0 0 .4em; }
        .hero-rich-text p { margin:0 0 1em; line-height:1.7; }
        .hero-rich-text strong { font-weight:700; }
        .hero-rich-text em { font-style:italic; }
        .hero-rich-text ul { list-style:disc; padding-left:1.5em; margin:0 0 1em; }
        .hero-rich-text ol { list-style:decimal; padding-left:1.5em; margin:0 0 1em; }
        .hero-rich-text li { margin-bottom:.25em; line-height:1.6; }
        .hero-rich-text a { color:#60a5fa; text-decoration:underline; }
        .hero-rich-text blockquote { border-left:3px solid rgba(255,255,255,0.3); margin:1em 0; padding:.5em 0 .5em 1.2em; color:rgba(255,255,255,0.7); font-style:italic; }
        .hero-rich-text hr { border:none; border-top:1px solid rgba(255,255,255,0.2); margin:1.2em 0; }
        @keyframes scroll-dot { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(10px);opacity:0.3} }
      `}</style>

      {/* Backgrounds */}
      {isImage && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage: `url(${resolveUrl(c.bgImage)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: c.bgImageOverlay || "rgba(0,0,0,0.5)",
              zIndex: 1,
            }}
          />
        </>
      )}
      {c.bgType === "gradient" && c.bgGradient && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: c.bg || "#0f172a",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: `linear-gradient(${c.bgGradient.direction || "to right"}, ${c.bgGradient.from || "#2563eb"}, ${c.bgGradient.to || "#7c3aed"})`,
              opacity: (c.bgGradient.intensity ?? 100) / 100,
            }}
          />
        </>
      )}
      {c.animatedBg?.enabled && (
        <AnimatedBg
          preset={c.animatedBg.preset || "particles"}
          color={c.animatedBg.color}
          density={c.animatedBg.density ?? 50}
          speed={c.animatedBg.speed ?? 50}
          size={c.animatedBg.size ?? 50}
          glow={c.animatedBg.glow ?? 50}
          count={c.animatedBg.count ?? 50}
        />
      )}

      {/* Canvas content */}
      <div
        ref={ref}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {isBuilderMode ? (
          <div style={{ position: "relative" }}>
            {/* Flow blocks */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                width: "100%",
              }}
            >
              {flowBlocks.map((block) => (
                <div key={block.id} style={{ width: "100%" }}>
                  <CanvasBlock
                    block={block}
                    headingFont={c.headingFont}
                    bodyFont={c.bodyFont}
                  />
                </div>
              ))}
            </div>
            {/* Absolute blocks overlaid */}
            {absoluteBlocks.map((block) => (
              <AbsoluteBlock
                key={block.id}
                block={block}
                headingFont={c.headingFont}
                bodyFont={c.bodyFont}
              />
            ))}
          </div>
        ) : (
          // Fallback: plain centered heading for non-canvas mode
          <div style={{ textAlign: "center" }}>
            {c.heading && (
              <h1
                style={{
                  fontSize: c.headingSize || 64,
                  fontWeight: 800,
                  color: c.headingColor || "#fff",
                  fontFamily: `'${c.headingFont || "Inter"}', sans-serif`,
                  lineHeight: 1.1,
                  margin: "0 0 20px",
                }}
              >
                {c.heading}
              </h1>
            )}
            {c.subheading && (
              <p
                style={{
                  fontSize: c.subheadingSize || 18,
                  color: c.subheadingColor || "rgba(255,255,255,0.7)",
                  margin: "0 0 36px",
                  lineHeight: 1.7,
                }}
              >
                {c.subheading}
              </p>
            )}
            {(c.buttons || []).length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {c.buttons.map((btn) => (
                  <HeroBtn key={btn.id} btn={btn} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {c.scrollIndicator && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: 24,
              height: 40,
              borderRadius: 12,
              border: "2px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <div
              style={{
                width: 3,
                height: 8,
                borderRadius: 3,
                background: "rgba(255,255,255,0.8)",
                animation: "scroll-dot 1.5s ease infinite",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
