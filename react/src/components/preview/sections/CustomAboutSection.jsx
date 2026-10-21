import { useState, useEffect, useRef } from "react";
import { loadFont } from "../../../utils/fontLoader";

function blendWithWhite(hex, intensity) {
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
}

function blendRgbaWithWhite(color, intensity) {
  try {
    let r, g, b, baseAlpha;

    if (color.startsWith("#")) {
      const h = color.replace("#", "");
      r = parseInt(h.substring(0, 2), 16);
      g = parseInt(h.substring(2, 4), 16);
      b = parseInt(h.substring(4, 6), 16);
      baseAlpha = 1;
    } else {
      const m = color.match(
        /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/,
      );
      if (!m) return color;
      r = +m[1];
      g = +m[2];
      b = +m[3];
      baseAlpha = m[4] !== undefined ? +m[4] : 1;
    }

    const alpha = baseAlpha * intensity; // fade out fully as intensity → 0
    return `rgba(${r},${g},${b},${alpha})`;
  } catch {
    return color;
  }
}

const resolveUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "")}${url}`;
};
function extractYouTubeId(url) {
  if (!url) return "";
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return m ? m[1] : "";
}

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

function getBgStyle(c) {
  if (c.bgMediaType === "gradient" && c.bgGradient) {
    const { from, to, direction, intensity } = c.bgGradient;
    const op = (intensity ?? 100) / 100;
    return {
      background: `linear-gradient(${direction || "to bottom right"}, ${blendWithWhite(from, op)}, ${blendWithWhite(to, op)})`,
    };
  }
  if (c.bgMediaType === "solid") {
    return { background: c.bg || "#0f172a" };
  }
  if (c.bgMediaType === "image" && c.bgImage) {
    return {
      backgroundImage: `url(${resolveUrl(c.bgImage)})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return { background: c.bg || "#0f172a" };
}

function OverlayLayer({ overlay }) {
  if (!overlay?.enabled) return null;
  const op = (overlay.intensity ?? 100) / 100;
  const bg =
    overlay.type === "gradient"
      ? `linear-gradient(${overlay.gradientDirection || "to top"}, ${blendRgbaWithWhite(overlay.gradientFrom || "rgba(0,0,0,0.7)", op)}, ${blendRgbaWithWhite(overlay.gradientTo || "rgba(0,0,0,0.05)", op)})`
      : blendRgbaWithWhite(overlay.color || "rgba(0,0,0,0.45)", op);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        pointerEvents: "none",
      }}
    />
  );
}

function Block({ block, bp }) {
  loadFont(block.fontFamily);
  const hidden = bp === "mobile" ? block.hiddenMobile : block.hidden;
  if (hidden) return null;

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

  if (block.type === "text") {
    return (
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
  }

  if (block.type === "button") {
    return (
      <div style={wrapperStyle}>
        <a
          href={block.url || "#"}
          target={block.url?.startsWith("http") ? "_blank" : "_self"}
          rel="noreferrer"
          style={{
            display: "inline-block",
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
  }

  if (block.type === "image") {
    return (
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
  }

  return null;
}
function YouTubeBg({ url, fallbackImage }) {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return fallbackImage ? (
      <img
        src={resolveUrl(fallbackImage)}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
    ) : null;
  }
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <iframe
        src={src}
        title="background video"
        allow="autoplay; encrypted-media"
        frameBorder="0"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "177.78vh", // 16:9 oversized to always cover container
          height: "100vh",
          minWidth: "100%",
          minHeight: "100%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
export default function CustomAboutSection({ config: c, navId }) {
  const bp = useBreakpoint();
  const videoRef = useRef(null);

  const minHeight =
    bp === "mobile" ? (c.minHeightMobile ?? 360) : (c.minHeight ?? 480);

  const blocks = c.blocks || [];

  return (
    <section
      id={navId}
      style={{
        position: "relative",
        minHeight,
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Background layer */}
      {/* Background layer */}
      {c.bgMediaType === "video" && c.bgVideo ? (
        c.bgVideoSource === "youtube" ? (
          <YouTubeBg url={c.bgVideo} fallbackImage={c.bgFallbackImage} />
        ) : (
          <>
            {c.bgFallbackImage && (
              <img
                src={resolveUrl(c.bgFallbackImage)}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
              />
            )}
            <video
              ref={videoRef}
              src={resolveUrl(c.bgVideo)}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            />
          </>
        )
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            ...getBgStyle(c),
          }}
        />
      )}

      <OverlayLayer overlay={c.overlay} />

      {/* Blocks layer */}
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
          <Block key={b.id} block={b} bp={bp} />
        ))}
      </div>
    </section>
  );
}
