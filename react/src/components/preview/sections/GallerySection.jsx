import { useState } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { resolveUrl } from "../../../utils/resolveUrl";
import { SectionBadge, SectionHeading } from "./AboutSection";
import { loadFont } from "../../../utils/fontLoader";

const getBg = (c) =>
  c.bgType === "gradient"
    ? `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`
    : c.bg || "#fff";

export default function GallerySection({ config: c, navId }) {
  loadFont(c.headingFont);
  const ref = useScrollAnimation(c.animation);
  const [lightbox, setLightbox] = useState(null);
  const images = c.images || [];
  const cols = c.columns || 3;

  return (
    <section
      id={navId}
      style={{
        background: getBg(c),
        paddingTop: c.paddingY || 80,
        paddingBottom: c.paddingY || 80,
        paddingLeft: c.paddingX || 32,
        paddingRight: c.paddingX || 32,
      }}
    >
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        {(c.heading || c.badge?.show) && (
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <SectionBadge badge={c.badge} />
            <SectionHeading c={c} />
          </div>
        )}
        <div style={{ columns: cols, gap: c.gap || 12 }}>
          {images.map((img, i) => (
            <div
              key={img.id || i}
              data-anim
              style={{
                breakInside: "avoid",
                marginBottom: c.gap || 12,
                borderRadius: c.borderRadius || 12,
                overflow: "hidden",
                cursor: c.lightbox ? "zoom-in" : "default",
                position: "relative",
              }}
              onClick={() => c.lightbox && img.url && setLightbox(img)}
            >
              {img.url ? (
                <img
                  src={resolveUrl(img.url)}
                  alt={img.alt || "gallery"}
                  style={{
                    width: "100%",
                    display: "block",
                    borderRadius: c.borderRadius || 12,
                    transition:
                      c.hoverEffect === "zoom" ? "transform 0.4s ease" : "none",
                  }}
                  onMouseEnter={(e) =>
                    c.hoverEffect === "zoom" &&
                    (e.currentTarget.style.transform = "scale(1.04)")
                  }
                  onMouseLeave={(e) =>
                    c.hoverEffect === "zoom" &&
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ) : (
                <div
                  style={{
                    height: 160,
                    background: "#e2e8f0",
                    borderRadius: c.borderRadius || 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  No image
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={resolveUrl(lightbox.url)}
            alt={lightbox.alt || ""}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 12,
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </section>
  );
}
