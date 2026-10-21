import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { loadFont } from "../../../utils/fontLoader";

const getBg = (c) => {
  if (c.bgType === "gradient")
    return `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`;
  if (c.bgType === "image" && c.bgImage) return "none";
  return c.bg || "#0f172a";
};

export default function CtaSection({ config: c, navId }) {
  loadFont(c.headingFont);
  loadFont(c.bodyFont);
  const ref = useScrollAnimation(c.animation);
  return (
    <section
      id={navId}
      style={{
        background: getBg(c),
        position: "relative",
        paddingTop: c.paddingY || 100,
        paddingBottom: c.paddingY || 100,
        paddingLeft: c.paddingX || 32,
        paddingRight: c.paddingX || 32,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: 700,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          data-anim
          style={{
            fontSize: c.headingSize || 48,
            fontWeight: 800,
            color: c.headingColor || "#fff",
            margin: "0 0 16px",
            fontFamily: `'${c.headingFont || "Plus Jakarta Sans"}',sans-serif`,
            lineHeight: 1.1,
          }}
        >
          {c.heading}
        </h2>
        {c.subheading && (
          <p
            data-anim
            style={{
              fontSize: 18,
              color: c.subheadingColor || "rgba(255,255,255,0.75)",
              margin: "0 0 36px",
              lineHeight: 1.7,
            }}
          >
            {c.subheading}
          </p>
        )}
        {c.buttons?.length > 0 && (
          <div
            data-anim
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {c.buttons.map((btn) => {
              const isOutline = btn.style === "outline";
              return (
                <a
                  key={btn.id}
                  href={btn.url || "#"}
                  style={{
                    display: "inline-block",
                    padding: btn.size === "lg" ? "14px 36px" : "11px 26px",
                    fontSize: btn.size === "lg" ? 16 : 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    borderRadius: btn.borderRadius || 10,
                    background: isOutline ? "transparent" : btn.bg,
                    color: isOutline ? btn.bg : btn.color,
                    border: isOutline ? `2px solid ${btn.bg}` : "none",
                    transition: "opacity 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {btn.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
