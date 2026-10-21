import { resolveUrl } from "../../../utils/resolveUrl";
import { loadFont } from "../../../utils/fontLoader";

const getBg = (c) =>
  c.bgType === "gradient"
    ? `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`
    : c.bgType === "image" && c.bgImage
      ? `url(${resolveUrl(c.bgImage)})`
      : c.bg || "#0f172a";

const SocialSVGs = {
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  ),
  instagram: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  youtube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  ),
  tiktok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
    </svg>
  ),
};

const EmailIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.1 2.18 2 2 0 012.09 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function FooterSection({ config: c, navId }) {
  loadFont(c.headingFont);
  loadFont(c.bodyFont);

  const align = c.layout?.align || "left"; // "left" | "center" | "right"
  const variant = c.layout?.variant || "columns"; // "columns" | "stacked" | "minimal" | "magazine"

  const bgStyle = {
    background: getBg(c),
    backgroundSize: c.bgType === "image" ? "cover" : undefined,
    backgroundPosition: c.bgType === "image" ? "center" : undefined,
    paddingTop: c.paddingY ?? 64,
    paddingBottom: c.paddingY ?? 64,
    paddingLeft: c.paddingX ?? 48,
    paddingRight: c.paddingX ?? 48,
    position: "relative",
    overflow: "hidden",
  };

  const headingFont = `'${c.headingFont || "Inter"}', sans-serif`;
  const bodyFont = `'${c.bodyFont || "Inter"}', sans-serif`;

  const accent = c.accentColor || "#6366f1";
  const headingColor = c.headingColor || "#ffffff";
  const textColor = c.textColor || "rgba(255,255,255,0.6)";
  const linkColor = c.linkColor || "rgba(255,255,255,0.55)";
  const linkHoverColor = c.linkHoverColor || "#ffffff";
  const dividerColor = c.dividerColor || "rgba(255,255,255,0.08)";

  const textAlignStyle =
    align === "center" ? "center" : align === "right" ? "right" : "left";
  const justifyContent =
    align === "center"
      ? "center"
      : align === "right"
        ? "flex-end"
        : "flex-start";

  /* ── Shared sub-components ── */
  const ContactBlock = () => (
    <div style={{ marginTop: 16 }}>
      {c.contactEmail && (
        <a
          href={`mailto:${c.contactEmail}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: textColor,
            textDecoration: "none",
            marginBottom: 8,
            justifyContent,
          }}
        >
          <span style={{ color: accent }}>
            <EmailIcon />
          </span>
          {c.contactEmail}
        </a>
      )}
      {c.contactPhone && (
        <a
          href={`tel:${c.contactPhone}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: textColor,
            textDecoration: "none",
            marginBottom: 8,
            justifyContent,
          }}
        >
          <span style={{ color: accent }}>
            <PhoneIcon />
          </span>
          {c.contactPhone}
        </a>
      )}
      {c.contactAddress && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 13,
            color: textColor,
            marginBottom: 8,
            justifyContent,
          }}
        >
          <span style={{ color: accent, marginTop: 2 }}>
            <MapPinIcon />
          </span>
          <span>{c.contactAddress}</span>
        </div>
      )}
    </div>
  );

  const SocialsBlock = () =>
    c.showSocials && c.socials?.length > 0 ? (
      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent }}>
        {c.socials
          .filter((s) => s.url)
          .map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius:
                  c.socialShape === "circle"
                    ? "50%"
                    : c.socialShape === "square"
                      ? 4
                      : 8,
                background: c.socialBg || "rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.socialIconColor || "rgba(255,255,255,0.5)",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = c.socialBgHover || accent;
                e.currentTarget.style.color = c.socialIconHoverColor || "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  c.socialBg || "rgba(255,255,255,0.07)";
                e.currentTarget.style.color =
                  c.socialIconColor || "rgba(255,255,255,0.5)";
              }}
            >
              {SocialSVGs[s.platform] || s.platform[0].toUpperCase()}
            </a>
          ))}
      </div>
    ) : null;

  const NewsletterBlock = () =>
    c.showNewsletter ? (
      <div style={{ marginTop: 20 }}>
        {c.newsletterLabel && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: headingColor,
              marginBottom: 8,
              fontFamily: headingFont,
              textAlign: textAlignStyle,
            }}
          >
            {c.newsletterLabel}
          </div>
        )}
        {c.newsletterSubtext && (
          <div
            style={{
              fontSize: 12,
              color: textColor,
              marginBottom: 10,
              textAlign: textAlignStyle,
            }}
          >
            {c.newsletterSubtext}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 0,
            maxWidth: 340,
            margin: align === "center" ? "0 auto" : "0",
          }}
        >
          <input
            type="email"
            placeholder={c.newsletterPlaceholder || "Enter your email"}
            style={{
              flex: 1,
              padding: "9px 14px",
              fontSize: 13,
              border: `1px solid ${dividerColor}`,
              borderRight: "none",
              borderRadius: "6px 0 0 6px",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              outline: "none",
            }}
          />
          <button
            style={{
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 600,
              background: accent,
              color: "#fff",
              border: "none",
              borderRadius: "0 6px 6px 0",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {c.newsletterBtnText || "Subscribe"}
          </button>
        </div>
      </div>
    ) : null;

  const AwardsBlock = () =>
    c.showAwards && c.awards?.length > 0 ? (
      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent,
        }}
      >
        {c.awards.map((a) => (
          <div
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${dividerColor}`,
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            {a.icon && <span style={{ fontSize: 16 }}>{a.icon}</span>}
            <span style={{ fontSize: 11, fontWeight: 600, color: textColor }}>
              {a.label}
            </span>
          </div>
        ))}
      </div>
    ) : null;

  const LogosBlock = () =>
    c.showPartnerLogos && c.partnerLogos?.length > 0 ? (
      <div style={{ marginBottom: 40 }}>
        {c.partnerLogosLabel && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: textColor,
              marginBottom: 14,
              textAlign: textAlignStyle,
            }}
          >
            {c.partnerLogosLabel}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent,
          }}
        >
          {c.partnerLogos
            .filter((l) => l.imageUrl)
            .map((l) => (
              <img
                key={l.id}
                src={resolveUrl(l.imageUrl)}
                alt={l.alt || ""}
                title={l.alt || ""}
                style={{
                  height: l.height || 28,
                  opacity: c.partnerLogosOpacity ?? 0.5,
                  filter: c.partnerLogosGrayscale ? "grayscale(1)" : "none",
                  transition: "opacity 0.2s",
                  objectFit: "contain",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = c.partnerLogosOpacity ?? 0.5)
                }
              />
            ))}
        </div>
        <div style={{ height: 1, background: dividerColor, marginTop: 32 }} />
      </div>
    ) : null;

  const MapBlock = () =>
    c.showMap && c.mapEmbedUrl ? (
      <div
        style={{
          marginTop: 16,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${dividerColor}`,
        }}
      >
        <iframe
          src={c.mapEmbedUrl}
          width={c.mapWidth || "100%"}
          height={c.mapHeight || 180}
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location"
        />
      </div>
    ) : null;

  const BrandBlock = ({ maxWidth } = {}) => (
    <div style={{ textAlign: textAlignStyle }}>
      {/* Primary logo */}
      {c.logo?.useImage && c.logo?.imageUrl ? (
        <img
          src={resolveUrl(c.logo.imageUrl)}
          style={{
            height: c.logo.imageHeight || 36,
            marginBottom: 14,
            display: "block",
            margin: align === "center" ? "0 auto 14px" : "0 0 14px",
          }}
          alt="logo"
        />
      ) : (
        <div
          style={{
            fontSize: c.logo?.fontSize || 22,
            fontWeight: c.logo?.fontWeight || 700,
            color: c.logo?.color || "#fff",
            marginBottom: 12,
            fontFamily: headingFont,
          }}
        >
          {c.logo?.text || "Brand"}
        </div>
      )}
      {c.tagline && (
        <p
          style={{
            fontSize: 14,
            color: c.taglineColor || textColor,
            lineHeight: 1.7,
            maxWidth: maxWidth || 280,
            margin: align === "center" ? "0 auto 16px" : "0 0 16px",
            fontFamily: bodyFont,
          }}
        >
          {c.tagline}
        </p>
      )}
      <ContactBlock />
      <SocialsBlock />
      <AwardsBlock />
      <NewsletterBlock />
      <MapBlock />
    </div>
  );

  const LinkColumnsBlock = () => (
    <>
      {(c.columns || []).map((col) => (
        <div
          key={col.id}
          style={{ flex: 1, minWidth: 120, textAlign: textAlignStyle }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: col.headingColor || headingColor,
              marginBottom: 16,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              fontFamily: headingFont,
            }}
          >
            {col.heading}
          </div>
          {(col.links || []).map((link) => (
            <a
              key={link.id}
              href={link.url || "#"}
              style={{
                display: "block",
                fontSize: 13.5,
                color: linkColor,
                textDecoration: "none",
                marginBottom: 10,
                lineHeight: 1.5,
                fontFamily: bodyFont,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = linkHoverColor)
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
            >
              {link.label}
            </a>
          ))}
        </div>
      ))}
    </>
  );

  const BottomBar = () => (
    <div
      style={{
        borderTop: `1px solid ${dividerColor}`,
        paddingTop: 24,
        marginTop: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "space-between",
        flexWrap: "wrap",
        gap: 12,
        textAlign: textAlignStyle,
      }}
    >
      <span
        style={{
          fontSize: 12.5,
          color: c.copyrightColor || "rgba(255,255,255,0.4)",
          fontFamily: bodyFont,
        }}
      >
        {c.copyright ||
          `© ${new Date().getFullYear()} Brand. All rights reserved.`}
      </span>
      {c.legalLinks?.length > 0 && (
        <div
          style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent }}
        >
          {c.legalLinks.map((l) => (
            <a
              key={l.id}
              href={l.url || "#"}
              style={{
                fontSize: 12.5,
                color: c.copyrightColor || "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontFamily: bodyFont,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = linkHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  c.copyrightColor || "rgba(255,255,255,0.4)")
              }
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );

  /* ── Layout Variants ── */
  const renderLayout = () => {
    if (variant === "minimal") {
      return (
        <div style={{ textAlign: textAlignStyle }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent,
              gap: 32,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            {c.logo?.useImage && c.logo?.imageUrl ? (
              <img
                src={resolveUrl(c.logo.imageUrl)}
                style={{ height: c.logo.imageHeight || 30 }}
                alt="logo"
              />
            ) : (
              <span
                style={{
                  fontSize: c.logo?.fontSize || 20,
                  fontWeight: 700,
                  color: c.logo?.color || "#fff",
                  fontFamily: headingFont,
                }}
              >
                {c.logo?.text || "Brand"}
              </span>
            )}
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent,
              }}
            >
              {(c.columns || [])
                .flatMap((col) => col.links || [])
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url || "#"}
                    style={{
                      fontSize: 13,
                      color: linkColor,
                      textDecoration: "none",
                      fontFamily: bodyFont,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = linkHoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = linkColor)
                    }
                  >
                    {link.label}
                  </a>
                ))}
            </div>
            <SocialsBlock />
          </div>
          <BottomBar />
        </div>
      );
    }

    if (variant === "stacked") {
      return (
        <div style={{ textAlign: "center" }}>
          <BrandBlock maxWidth={420} />
          <div
            style={{
              height: 1,
              background: dividerColor,
              margin: "40px auto",
              maxWidth: 480,
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 40,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            <LinkColumnsBlock />
          </div>
          <BottomBar />
        </div>
      );
    }

    if (variant === "magazine") {
      return (
        <div>
          <LogosBlock />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1px 2fr",
              gap: 0,
              marginBottom: 48,
            }}
          >
            <div style={{ paddingRight: 48 }}>
              <BrandBlock />
            </div>
            <div style={{ background: dividerColor }} />
            <div style={{ paddingLeft: 48 }}>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <LinkColumnsBlock />
              </div>
            </div>
          </div>
          <BottomBar />
        </div>
      );
    }

    // default: "columns"
    return (
      <>
        <LogosBlock />
        <div
          style={{
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <div style={{ flex: 2, minWidth: 220 }}>
            <BrandBlock />
          </div>
          <LinkColumnsBlock />
        </div>
        <BottomBar />
      </>
    );
  };

  return (
    <footer id={navId} style={bgStyle}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>{renderLayout()}</div>
    </footer>
  );
}
