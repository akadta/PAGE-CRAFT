import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { resolveUrl } from "../../../utils/resolveUrl";
import { loadFont } from "../../../utils/fontLoader";

const blendWithWhite = (hex, intensity) => {
  try {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const nr = Math.round(r * intensity + 255 * (1 - intensity));
    const ng = Math.round(g * intensity + 255 * (1 - intensity));
    const nb = Math.round(b * intensity + 255 * (1 - intensity));
    return `rgb(${nr},${ng},${nb})`;
  } catch {
    return hex;
  }
};

const getBg = (c) => {
  if (c.bgType === "gradient") {
    const { from, to, direction, intensity } = c.bgGradient || {};
    const op = (intensity ?? 100) / 100;
    return `linear-gradient(${direction || "to right"}, ${blendWithWhite(from || "#2563eb", op)}, ${blendWithWhite(to || "#7c3aed", op)})`;
  }
  if (c.bgType === "image" && c.bgImage) {
    return `url(${resolveUrl(c.bgImage)}) center/cover no-repeat`;
  }
  return c.bg || "#fff";
};

function AboutImageCarousel({ images, borderRadius, shadow, style = {} }) {
  const valid = (images || []).filter((img) => img?.url);
  const [idx, setIdx] = useState(0);
  const mode = style.mode || "fade";
  const arrowStyle = style.arrowStyle || "circle";
  const dotStyle = style.dotStyle || "dots";
  const theme = style.theme || "dark";

  useEffect(() => {
    if (valid.length <= 1) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % valid.length);
    }, 4000);
    return () => clearInterval(t);
  }, [valid.length]);

  if (valid.length === 0) return null;

  const next = () => setIdx((p) => (p + 1) % valid.length);
  const prev = () => setIdx((p) => (p - 1 + valid.length) % valid.length);

  const themeColors = {
    dark: {
      arrowBg: "rgba(0,0,0,0.5)",
      arrowColor: "#fff",
      dotActive: "#ffffff",
      dotInactive: "rgba(255,255,255,0.5)",
    },
    light: {
      arrowBg: "rgba(255,255,255,0.85)",
      arrowColor: "#0f172a",
      dotActive: "#0f172a",
      dotInactive: "rgba(15,23,42,0.35)",
    },
    accent: {
      arrowBg: "rgba(37,99,235,0.85)",
      arrowColor: "#fff",
      dotActive: "#2563eb",
      dotInactive: "rgba(37,99,235,0.3)",
    },
  };
  const t = themeColors[theme] || themeColors.dark;

  const ArrowBtn = ({ dir, onClick }) => {
    if (arrowStyle === "none") return null;
    const isCircle = arrowStyle === "circle";
    const isSquare = arrowStyle === "square";
    const isMinimal = arrowStyle === "minimal";
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          top: "50%",
          [dir === "prev" ? "left" : "right"]: 10,
          transform: "translateY(-50%)",
          width: isMinimal ? "auto" : 34,
          height: isMinimal ? "auto" : 34,
          borderRadius: isCircle ? "50%" : isSquare ? 6 : 0,
          background: isMinimal ? "transparent" : t.arrowBg,
          border: "none",
          color: t.arrowColor,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMinimal ? 22 : 16,
          zIndex: 3,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {dir === "prev" ? "‹" : "›"}
      </button>
    );
  };

  const Dots = () => {
    if (dotStyle === "none" || valid.length <= 1) return null;
    return (
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: dotStyle === "lines" ? 4 : 6,
          zIndex: 3,
        }}
      >
        {valid.map((_, i) =>
          dotStyle === "numbers" ? (
            <span
              key={i}
              onClick={() => setIdx(i)}
              style={{
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                color: i === idx ? t.dotActive : t.dotInactive,
                padding: "0 3px",
              }}
            >
              {i + 1}
            </span>
          ) : (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width:
                  dotStyle === "lines"
                    ? i === idx
                      ? 22
                      : 14
                    : i === idx
                      ? 18
                      : 6,
                height: dotStyle === "lines" ? 3 : 6,
                borderRadius: dotStyle === "lines" ? 2 : 100,
                border: "none",
                background: i === idx ? t.dotActive : t.dotInactive,
                cursor: "pointer",
                transition: "all 0.25s",
                padding: 0,
              }}
            />
          ),
        )}
      </div>
    );
  };

  if (mode === "coverflow") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: borderRadius || 16,
          //   background: "#0a0a0a",
        }}
      >
        {valid.map((img, i) => {
          const offset = i - idx;
          const abs = Math.abs(offset);
          if (abs > 2) return null;
          return (
            <img
              key={img.id ?? i}
              src={resolveUrl(img.url)}
              alt={img.alt || "about"}
              onClick={() => setIdx(i)}
              style={{
                position: "absolute",
                width: "55%",
                maxHeight: "85%",
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: shadow ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
                cursor: "pointer",
                transform: `translateX(${offset * 60}%) scale(${offset === 0 ? 1 : 0.75}) rotateY(${offset * -15}deg)`,
                zIndex: offset === 0 ? 2 : 1,
                opacity: abs > 1 ? 0 : offset === 0 ? 1 : 0.5,
                transition: "all 0.45s ease",
              }}
            />
          );
        })}
        <ArrowBtn dir="prev" onClick={prev} />
        <ArrowBtn dir="next" onClick={next} />
        <Dots />
      </div>
    );
  }

  // fade mode (default)
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: borderRadius || 16,
        overflow: "hidden",
        boxShadow: shadow ? "0 24px 60px rgba(0,0,0,0.12)" : "none",
      }}
    >
      {valid.map((img, i) => (
        <img
          key={img.id ?? i}
          src={resolveUrl(img.url)}
          alt={img.alt || "about"}
          style={{
            width: "100%",
            display: i === idx ? "block" : "none",
            objectFit: "cover",
          }}
        />
      ))}
      <ArrowBtn dir="prev" onClick={prev} />
      <ArrowBtn dir="next" onClick={next} />
      <Dots />
    </div>
  );
}

function CountUpStat({ value, duration = 1.5 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  // split "1,234+" or "99%" or "$2M" into prefix + number + suffix
  const match = String(value).match(/^([^\d]*)([\d,.]+)(.*)$/);
  const prefix = match?.[1] || "";
  const numStr = match?.[2] || "";
  const suffix = match?.[3] || "";
  const target = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const hasCommas = numStr.includes(",");

  useEffect(() => {
    if (!ref.current || isNaN(target)) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const ms = (duration || 1.5) * 1000;
          const tick = (now) => {
            const progress = Math.min((now - start) / ms, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            const formatted = hasCommas
              ? Math.round(current).toLocaleString()
              : current.toFixed(decimals);
            setDisplay(`${prefix}${formatted}${suffix}`);
            if (progress < 1) requestAnimationFrame(tick);
            else
              setDisplay(
                `${prefix}${hasCommas ? target.toLocaleString() : target.toFixed(decimals)}${suffix}`,
              );
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, prefix, suffix, decimals, hasCommas]);

  return <span ref={ref}>{isNaN(target) ? value : display}</span>;
}

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
  const densityF = Math.max(0, Math.min(100, density)) / 50; // 0 → 0x, 50 → 1x, 100 → 2x
  const speedF = Math.max(0, Math.min(100, speed)) / 50; // speed multiplier
  const sizeF = Math.max(0, Math.min(100, size)) / 50; // size multiplier
  const glowF = Math.max(0, Math.min(100, glow)) / 50; // opacity/glow multiplier
  const countF = Math.max(0, Math.min(100, count)) / 50; // count multiplier

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];
    let w, h;

    const hexToRgb = (hex) => {
      const m = hex.replace("#", "");
      return [
        parseInt(m.substring(0, 2), 16),
        parseInt(m.substring(2, 4), 16),
        parseInt(m.substring(4, 6), 16),
      ];
    };
    const [r, g, b] = hexToRgb(color || "#2563eb");

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const initParticles = (count, opts) => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        ...opts(),
      }));
    };

    if (preset === "particles") {
      initParticles(Math.round(60 * densityF * countF), () => ({
        r: (Math.random() * 2 + 0.5) * sizeF,
        vx: (Math.random() - 0.5) * 0.4 * speedF,
        vy: (Math.random() - 0.5) * 0.4 * speedF,
        a: (Math.random() * 0.5 + 0.2) * glowF,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, p.a)})`;
          ctx.fill();
        });
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "orbs") {
      initParticles(Math.max(1, Math.round(5 * densityF * countF)), () => ({
        radius: (Math.random() * 120 + 80) * sizeF,
        vx: (Math.random() - 0.5) * 0.3 * speedF,
        vy: (Math.random() - 0.5) * 0.3 * speedF,
        a: (0.08 + Math.random() * 0.08) * glowF,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -p.radius) p.x = w + p.radius;
          if (p.x > w + p.radius) p.x = -p.radius;
          if (p.y < -p.radius) p.y = h + p.radius;
          if (p.y > h + p.radius) p.y = -p.radius;
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius,
          );
          grad.addColorStop(0, `rgba(${r},${g},${b},${Math.min(1, p.a)})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
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
      const blobCount = Math.max(1, Math.round(3 * densityF * countF));
      const draw = () => {
        t += 0.004 * speedF;
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < blobCount; i++) {
          const cx = w / 2 + Math.sin(t + i * 2) * w * 0.3;
          const cy = h / 2 + Math.cos(t * 0.8 + i * 2) * h * 0.3;
          const radius = Math.max(w, h) * 0.5 * sizeF;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          grad.addColorStop(
            0,
            `rgba(${r},${g},${b},${Math.min(1, (0.1 - i * 0.02) * glowF)})`,
          );
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "grid") {
      let t = 0;
      const spacing = Math.max(10, 50 / sizeF - densityF * 10);
      const draw = () => {
        t += 0.02 * speedF;
        ctx.clearRect(0, 0, w, h);
        const pulse = (Math.sin(t) + 1) / 2;
        ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(1, (0.05 + pulse * 0.07) * glowF)})`;
        ctx.lineWidth = 1;
        for (let x = 0; x <= w; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y <= h; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "stars") {
      initParticles(Math.round(80 * densityF * countF), () => ({
        r: (Math.random() * 1.5 + 0.3) * sizeF,
        a: Math.random(),
        speed: (Math.random() * 0.02 + 0.005) * speedF,
        dir: Math.random() > 0.5 ? 1 : -1,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          p.a += p.speed * p.dir;
          if (p.a <= 0 || p.a >= 1) p.dir *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0, Math.min(1, p.a)) * Math.min(1, 0.6 * glowF)})`;
          ctx.fill();
        });
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (preset === "waves") {
      let t = 0;
      const lineCount = Math.max(1, Math.round(3 * densityF * countF));
      const draw = () => {
        t += 0.01 * speedF;
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < lineCount; i++) {
          ctx.beginPath();
          const amp = (18 + i * 10) * sizeF;
          const yOff = h * (0.3 + (i % 3) * 0.25);
          for (let x = 0; x <= w; x += 6) {
            const y = yOff + Math.sin(x * 0.01 + t + i) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(1, (0.12 - (i % 3) * 0.025) * glowF)})`;
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
  }, [preset, color, densityF, speedF, sizeF, glowF, countF]);

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

export default function AboutSection({ config: c, navId }) {
  loadFont(c.headingFont);
  loadFont(c.bodyFont);
  const ref = useScrollAnimation(c.animation);
  const isCentered = c.variant === "centered";
  const isLeft = c.variant === "image-left" || !c.variant;
  const isStacked = c.variant === "image-top" || c.variant === "image-bottom";
  const isTop = c.variant === "image-top";
  const hasGallery = (c.images || []).some((img) => img?.url);
  const hasImage = c.image?.url || hasGallery;
  return (
    <section
      id={navId}
      style={{
        background: getBg(c),
        backgroundSize: c.bgType === "image" ? "cover" : undefined,
        backgroundPosition: c.bgType === "image" ? "center" : undefined,
        backgroundRepeat: c.bgType === "image" ? "no-repeat" : undefined,
        backgroundAttachment:
          c.bgType === "image" && c.bgFixed ? "fixed" : undefined,
        paddingTop: c.paddingY || 80,
        paddingBottom: c.paddingY || 80,
        paddingLeft: c.paddingX || 32,
        paddingRight: c.paddingX || 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {c.bgType === "image" && c.bgImage && c.bgOverlayOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: c.bgImageOverlay,
            zIndex: 1,
          }}
        />
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
      <div
        ref={ref}
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2, // was 1
        }}
      >
        {isCentered ? (
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <SectionBadge badge={c.badge} />
            <SectionHeading c={c} />
            <div
              dangerouslySetInnerHTML={{ __html: c.body || "" }}
              style={{
                color: c.bodyColor || "#475569",
                fontSize: c.bodySize || 16,
                lineHeight: 1.8,
                fontFamily: `'${c.bodyFont || "Inter"}',sans-serif`,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: isStacked ? "stretch" : "center",
              gap: isStacked ? 40 : 64,
              flexWrap: isStacked ? "nowrap" : "wrap",
              flexDirection: isStacked
                ? isTop
                  ? "column"
                  : "column-reverse"
                : isLeft
                  ? "row"
                  : "row-reverse",
            }}
          >
            {hasImage && (
              <div
                data-anim
                style={
                  isStacked ? { width: "100%" } : { flex: 1, minWidth: 280 }
                }
              >
                {hasGallery ? (
                  <AboutImageCarousel
                    images={c.images}
                    borderRadius={c.image?.borderRadius}
                    shadow={c.image?.shadow}
                    style={c.galleryStyle}
                  />
                ) : (
                  <img
                    src={resolveUrl(c.image.url)}
                    alt={c.image.alt || "about"}
                    style={{
                      width: "100%",
                      borderRadius: c.image.borderRadius || 16,
                      boxShadow: c.image.shadow
                        ? "0 24px 60px rgba(0,0,0,0.12)"
                        : "none",
                      display: "block",
                    }}
                  />
                )}
              </div>
            )}
            <div
              data-anim
              style={
                isStacked
                  ? { width: "100%", textAlign: c.contentAlign || "left" }
                  : {
                      flex: 1,
                      minWidth: 280,
                      textAlign: c.contentAlign || "left",
                    }
              }
            >
              <SectionBadge badge={c.badge} align={c.contentAlign} />
              <SectionHeading c={c} />
              <div
                dangerouslySetInnerHTML={{ __html: c.body || "" }}
                style={{
                  color: c.bodyColor || "#475569",
                  fontSize: c.bodySize || 16,
                  lineHeight: 1.8,
                  fontFamily: `'${c.bodyFont || "Inter"}',sans-serif`,
                  marginBottom: c.showStats ? 32 : 0,
                }}
              />

              {c.showStats && c.stats?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 32,
                    flexWrap: "wrap",
                    marginBottom: 32,
                    justifyContent:
                      (c.statsAlign || c.contentAlign) === "center"
                        ? "center"
                        : (c.statsAlign || c.contentAlign) === "right"
                          ? "flex-end"
                          : "flex-start",
                  }}
                >
                  {c.stats.map((s) => (
                    <div key={s.id} data-anim>
                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 800,
                          color: c.headingColor || "#0f172a",
                          fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
                        }}
                      >
                        {c.countUpStats ? (
                          <CountUpStat
                            value={s.value}
                            duration={c.countUpDuration}
                          />
                        ) : (
                          s.value
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: c.bodyColor || "#64748b",
                          marginTop: 2,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(c.buttons || []).length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      c.buttonLayout === "column" ? "column" : "row",
                    flexWrap: "wrap",
                    gap: 12,
                    alignItems:
                      (c.buttonAlign || c.contentAlign) === "center"
                        ? "center"
                        : (c.buttonAlign || c.contentAlign) === "right"
                          ? "flex-end"
                          : "flex-start",
                    justifyContent:
                      (c.buttonAlign || c.contentAlign) === "center"
                        ? "center"
                        : (c.buttonAlign || c.contentAlign) === "right"
                          ? "flex-end"
                          : "flex-start",
                  }}
                >
                  {c.buttons.map((btn, idx) => {
                    const baseBg =
                      btn.variant === "filled"
                        ? btn.bg || "#2563eb"
                        : "transparent";
                    const baseColor =
                      btn.variant === "filled"
                        ? btn.color || "#fff"
                        : btn.bg || "#2563eb";
                    const baseBorder =
                      btn.variant === "ghost"
                        ? "none"
                        : `2px solid ${btn.bg || "#2563eb"}`;
                    const hoverBg =
                      btn.hoverBg ||
                      (btn.variant === "filled"
                        ? "#1d4ed8"
                        : btn.bg || "#2563eb");
                    const hoverColor =
                      btn.hoverColor ||
                      (btn.variant === "filled" ? "#fff" : "#fff");
                    return (
                      <a
                        key={idx}
                        href={btn.url || "#"}
                        data-anim
                        style={{
                          display: "inline-block",
                          padding: "11px 26px",
                          borderRadius: btn.borderRadius || 8,
                          background: baseBg,
                          color: baseColor,
                          border: baseBorder,
                          fontWeight: 700,
                          fontSize: 14,
                          textDecoration: "none",
                          transition:
                            "background 0.2s, color 0.2s, border-color 0.2s",
                          width:
                            c.buttonLayout === "column"
                              ? `${c.buttonWidth || 100}%`
                              : "auto",
                          boxSizing: "border-box",
                          textAlign: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = hoverBg;
                          e.currentTarget.style.color = hoverColor;
                          if (btn.variant !== "ghost")
                            e.currentTarget.style.borderColor = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = baseBg;
                          e.currentTarget.style.color = baseColor;
                          if (btn.variant !== "ghost")
                            e.currentTarget.style.borderColor =
                              btn.bg || "#2563eb";
                        }}
                      >
                        {btn.label || "Button"}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionBadge({ badge, align }) {
  if (!badge?.show) return null;
  return (
    <div
      data-anim
      style={{
        display: align === "center" ? "table" : "inline-block",
        margin: align === "center" ? "0 auto 14px" : "0 0 14px",
        padding: "5px 14px",
        borderRadius: 100,
        background: badge.bg || "#eff6ff",
        color: badge.color || "#2563eb",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.4px",
      }}
    >
      {badge.text}
    </div>
  );
}

export function SectionHeading({ c }) {
  return (
    <h2
      data-anim
      style={{
        fontSize: c.headingSize || 42,
        fontWeight: c.headingWeight || 700,
        color: c.headingColor || "#0f172a",
        margin: "0 0 16px",
        fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
        lineHeight: 1.15,
      }}
    >
      {c.heading}
    </h2>
  );
}
