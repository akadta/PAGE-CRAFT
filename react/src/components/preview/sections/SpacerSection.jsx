import { useState, useEffect } from "react";

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

const resolveImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "")}${url}`;
};

const getBg = (c) => {
  if (c.bgType === "gradient" && c.bgGradient) {
    const { from, to, direction, intensity } = c.bgGradient;
    const op = (intensity ?? 100) / 100;
    return `linear-gradient(${direction || "to right"}, ${blendWithWhite(from, op)}, ${blendWithWhite(to, op)})`;
  }
  if (c.bgType === "image" && c.bgImage)
    return `url(${resolveImageUrl(c.bgImage)})`;
  return c.bg || "transparent";
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

export default function SpacerSection({ config: c, navId }) {
  const bp = useBreakpoint();
  const height =
    bp === "mobile" && c.heightMobile != null
      ? c.heightMobile
      : (c.height ?? 60);

  const d = c.divider || {};
  const dividerWidth = d.width ?? 100;
  const dividerAlign = d.align || "center";

  const justify =
    dividerAlign === "left"
      ? "flex-start"
      : dividerAlign === "right"
        ? "flex-end"
        : "center";

  return (
    <div
      id={navId}
      style={{
        height,
        background: getBg(c),
        backgroundSize: c.bgType === "image" ? "cover" : undefined,
        backgroundPosition: c.bgType === "image" ? "center" : undefined,
        backgroundRepeat: c.bgType === "image" ? "no-repeat" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        boxSizing: "border-box",
      }}
    >
      {d.show && (
        <div
          style={{
            width: `${dividerWidth}%`,
            borderTop: `${d.thickness ?? 1}px ${d.style || "solid"} ${d.color || "#e2e8f0"}`,
          }}
        />
      )}
    </div>
  );
}
