import { useState, useEffect } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { loadFont } from "../../../utils/fontLoader";
import { SectionBadge, SectionHeading } from "./AboutSection";

const getBg = (c) => {
  if (c.bgType === "gradient")
    return `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`;
  return c.bg || "#f8fafc";
};

const cardStyles = {
  elevated: (c) => ({
    background: c.cardBg || "#fff",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    border: "none",
  }),
  bordered: (c) => ({
    background: c.cardBg || "#fff",
    boxShadow: "none",
    border: "1px solid #e2e8f0",
  }),
  flat: (c) => ({
    background: c.cardBg || "#f8fafc",
    boxShadow: "none",
    border: "none",
  }),
  glass: () => ({
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.2)",
  }),
};

// Simple hook to track viewport width
function useViewportWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

export default function FeaturesSection({ config: c, navId }) {
  loadFont(c.headingFont);
  loadFont(c.bodyFont);
  const ref = useScrollAnimation(c.animation);
  const width = useViewportWidth();

  // Responsive column logic
  const baseCols = c.columns || 3;
  let cols = baseCols;
  if (width <= 640) {
    cols = 1;
  } else if (width <= 1024) {
    cols = Math.min(2, baseCols);
  }

  // Responsive spacing
  const isMobile = width <= 640;
  const isTablet = width > 640 && width <= 1024;

  const paddingY = isMobile
    ? (c.paddingY || 80) * 0.5
    : isTablet
      ? (c.paddingY || 80) * 0.75
      : c.paddingY || 80;

  const paddingX = isMobile ? 20 : isTablet ? 24 : c.paddingX || 32;

  const cardPadding = isMobile
    ? Math.max(20, (c.cardPadding || 28) * 0.75)
    : c.cardPadding || 28;

  const gap = isMobile ? 16 : isTablet ? 20 : 24;

  const iconSize = isMobile
    ? Math.max(40, (c.iconSize || 48) * 0.85)
    : c.iconSize || 48;

  return (
    <section
      id={navId}
      style={{
        background: getBg(c),
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
      }}
    >
      <div
        ref={ref}
        style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? 32 : 52,
          }}
        >
          <SectionBadge badge={c.badge} />
          <SectionHeading c={c} />
          {c.subheading && (
            <p
              data-anim
              style={{
                fontSize: isMobile ? 14 : 16,
                color: c.subheadingColor || "#64748b",
                maxWidth: 560,
                margin: "0 auto",
                lineHeight: 1.7,
                padding: isMobile ? "0 8px" : 0,
              }}
            >
              {c.subheading}
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            gap,
          }}
        >
          {(c.items || []).map((item) => {
            const cs = (cardStyles[c.cardStyle] || cardStyles.elevated)(c);
            return (
              <div
                key={item.id}
                data-anim
                style={{
                  ...cs,
                  borderRadius: c.cardBorderRadius || 16,
                  padding: cardPadding,
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  if (isMobile) return;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  if (isMobile) return;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = cs.boxShadow || "";
                }}
              >
                {/* Icon */}
                {item.icon && (
                  <div
                    style={{
                      width: iconSize,
                      height: iconSize,
                      borderRadius:
                        c.iconStyle === "circle"
                          ? "50%"
                          : c.iconStyle === "square"
                            ? 8
                            : 12,
                      background: item.iconBg || "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: iconSize * 0.5,
                      marginBottom: isMobile ? 14 : 18,
                    }}
                  >
                    {item.icon}
                  </div>
                )}

                <h3
                  style={{
                    fontSize: isMobile ? 16 : 17,
                    fontWeight: 700,
                    color: c.headingColor || "#0f172a",
                    margin: "0 0 8px",
                    fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
                    wordBreak: "break-word",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? 13.5 : 14,
                    color: c.bodyColor || "#64748b",
                    lineHeight: 1.7,
                    margin: 0,
                    fontFamily: `'${c.bodyFont || "Inter"}',sans-serif`,
                    wordBreak: "break-word",
                  }}
                >
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
