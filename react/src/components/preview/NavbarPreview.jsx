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

export default function NavbarPreview({ config, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const [mobileOpenSubs, setMobileOpenSubs] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  useEffect(() => {
    if (!config.transparent) return;
    const handler = () =>
      setScrolled(window.scrollY > (config.transparentScrollThreshold || 80));
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [config.transparent, config.transparentScrollThreshold]);
  // ── Font declarations (must come before any JSX that references them) ──
  const navFont = config.fontFamily
    ? `'${config.fontFamily}', sans-serif`
    : "'Inter', sans-serif";
  const logoFont = config.logoFontFamily
    ? `'${config.logoFontFamily}', sans-serif`
    : "'Inter', sans-serif";

  // Load Google Fonts
  const fontsToLoad = [
    ...new Set([config.fontFamily, config.logoFontFamily].filter(Boolean)),
  ];
  fontsToLoad.forEach((font) => {
    const id = `gfont-${font.replace(/\s+/g, "-")}`;
    if (typeof document !== "undefined" && !document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    }
  });

  useEffect(() => {
    if (config.mobileSubmenuDefaultOpen) {
      const allOpen = {};
      config.links.forEach((l) => {
        if (l.hasSubmenu) allOpen[l.id] = true;
      });
      setMobileOpenSubs(allOpen);
    } else {
      setMobileOpenSubs({});
    }
  }, [config.mobileSubmenuDefaultOpen, menuOpen]);

  useEffect(() => {
    const closeAll = () => {
      setMenuOpen(false);
      setSidePanelOpen(false);
      setOpenSub(null);
    };
    window.addEventListener("navbar:close", closeAll);
    return () => window.removeEventListener("navbar:close", closeAll);
  }, []);

  const toggleMenu = () => setMenuOpen((p) => !p);

  const getBg = () => {
    if (config.transparent && !scrolled) return "transparent";
    if (config.bgType === "gradient" && config.bgGradient) {
      const { from, to, direction, intensity } = config.bgGradient;
      const op = (intensity ?? 100) / 100;
      return `linear-gradient(${direction || "to right"}, ${blendWithWhite(from, op)}, ${blendWithWhite(to, op)})`;
    }
    return config.bg;
  };

  const safeHref = (url) =>
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("#") ||
    url.startsWith("/")
      ? url
      : `https://${url}`;

  const isFloating = config.navbarStyle === "floating";
  const isSidePanel = config.navbarStyle === "side-panel";

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: config.height + "px",
    background: getBg(),
    paddingLeft: config.padding.x + "px",
    paddingRight: config.padding.x + "px",
    boxShadow:
      config.shadow && (!config.transparent || scrolled)
        ? "0 2px 16px rgba(0,0,0,0.10)"
        : isFloating
          ? "0 8px 40px rgba(0,0,0,0.18)"
          : "none",
    borderBottom: config.borderBottom
      ? `1px solid ${config.borderColor}`
      : "none",
    backdropFilter: config.backdropBlur ? "blur(14px)" : "none",
    WebkitBackdropFilter: config.backdropBlur ? "blur(14px)" : "none",
    borderRadius: isFloating ? "999px" : config.borderRadius + "px",
    position: isFloating ? "absolute" : config.sticky ? "sticky" : "relative",
    top: isFloating
      ? (config.floatingMarginTop || 20) + "px"
      : config.sticky
        ? 0
        : "auto",
    left: isFloating ? "50%" : "auto",
    transform: isFloating ? "translateX(-50%)" : "none",
    minWidth: isFloating
      ? `min(${config.floatingMaxWidth || 600}px, calc(100vw - 32px))`
      : "auto",
    maxWidth: isFloating ? "calc(100vw - 32px)" : "none",
    width: isFloating ? "auto" : "auto",
    zIndex: 200,
    transition: "background 0.3s ease",
  };

  const logoEl = (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
    >
      {config.logo.useImage && config.logo.imageUrl ? (
        <img
          src={
            config.logo.imageUrl?.startsWith("http")
              ? config.logo.imageUrl
              : `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "")}${config.logo.imageUrl}`
          }
          alt="logo"
          style={{
            height: (config.logo.imageHeight || 36) + "px",
            maxWidth: 160,
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <>
          {config.logo.showIcon && (
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: config.logo.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
          )}
          <span
            style={{
              fontSize: config.logo.fontSize + "px",
              fontWeight: config.logo.fontWeight,
              color: config.logo.color,
              whiteSpace: "nowrap",
              letterSpacing: "-0.3px",
              fontFamily: logoFont,
            }}
          >
            {config.logo.text}
          </span>
        </>
      )}
    </div>
  );

  const buttonsEl = !isMobile && (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {config.buttons.map((btn) => {
        const pad =
          btn.size === "sm"
            ? "6px 14px"
            : btn.size === "lg"
              ? "12px 26px"
              : "9px 20px";
        const fs = btn.size === "sm" ? 12 : btn.size === "lg" ? 15 : 13;
        return (
          <a
            key={btn.id}
            href={safeHref(btn.url)}
            target={btn.url.startsWith("http") ? "_blank" : "_self"}
            rel="noreferrer"
            style={{
              background: btn.style === "filled" ? btn.bg : "transparent",
              color: btn.style === "filled" ? btn.color : btn.bg,
              border: btn.style === "outline" ? `2px solid ${btn.bg}` : "none",
              borderRadius: btn.borderRadius + "px",
              padding: pad,
              fontSize: fs + "px",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              display: "inline-block",
              transition: "opacity 0.2s, transform 0.15s",
              cursor: "pointer",
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
            {btn.label}
          </a>
        );
      })}
    </div>
  );

  const HamburgerIcon = () => {
    const style = config.hamburgerStyle || "slide";
    const color = config.hamburgerColor || "#0f172a";
    return (
      <button
        onClick={
          isSidePanel || isFloating
            ? () => setSidePanelOpen((p) => !p)
            : toggleMenu
        }
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 22,
            height: 18,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "block",
              height: 2.5,
              width: menuOpen && style === "squeeze" ? "60%" : "100%",
              background: color,
              borderRadius: 2,
              transformOrigin: "center",
              transition: "all 0.3s ease",
              transform:
                menuOpen && (style === "spin" || style === "slide")
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              opacity: menuOpen && style === "fade" ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              height: 2.5,
              width: style === "squeeze" ? "80%" : "100%",
              background: color,
              borderRadius: 2,
              transition: "all 0.3s ease",
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
            }}
          />
          <span
            style={{
              display: "block",
              height: 2.5,
              width: menuOpen && style === "squeeze" ? "60%" : "100%",
              background: color,
              borderRadius: 2,
              transformOrigin: "center",
              transition: "all 0.3s ease",
              transform:
                menuOpen && (style === "spin" || style === "slide")
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              opacity: menuOpen && style === "fade" ? 0 : 1,
            }}
          />
        </div>
      </button>
    );
  };

  const hamburgerEl = (isMobile || isSidePanel) && <HamburgerIcon />;

  const renderLinks = (links) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: config.linkSpacing + "px",
      }}
    >
      {links.map((link) => (
        <div
          key={link.id}
          style={{ position: "relative" }}
          onMouseEnter={() =>
            !isMobile && link.hasSubmenu && setOpenSub(link.id)
          }
          onMouseLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setOpenSub(null);
          }}
        >
          <a
            href={safeHref(link.url)}
            target={link.url.startsWith("http") ? "_blank" : "_self"}
            rel="noreferrer"
            style={{
              fontSize: config.linkFontSize + "px",
              fontWeight: config.linkFontWeight,
              color:
                config.transparent && !scrolled
                  ? config.transparentLinkColor || "#ffffff"
                  : config.linkColor,
              textDecoration: "none",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color =
                config.linkHoverColor || config.accentColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color =
                config.transparent && !scrolled
                  ? config.transparentLinkColor || "#ffffff"
                  : config.linkColor)
            }
          >
            {link.label}
            {link.hasSubmenu && (
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </a>
          {link.hasSubmenu && openSub === link.id && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                background: config.submenuBg || "#ffffff",
                paddingTop: 6,
                border: `1px solid ${config.submenuBorderColor || "#e8edf3"}`,
                borderRadius: 12,
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                minWidth: 180,
                overflow: "hidden",
                zIndex: 200,
                animation: "menu-down 0.18s ease",
              }}
            >
              {link.children.map((c) => (
                <a
                  key={c.id}
                  href={safeHref(c.url)}
                  target={c.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    fontSize: 13,
                    color: config.submenuTextColor || "#374151",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                    borderBottom: `1px solid ${config.submenuBorderColor || "#f8fafc"}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      config.submenuHoverBg || config.accentColor + "18";
                    e.currentTarget.style.color =
                      config.submenuHoverColor || config.accentColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color =
                      config.submenuTextColor || "#374151";
                  }}
                >
                  {config.submenuShowBullet !== false && (
                    <span
                      style={{
                        width: config.submenuBulletSize || 6,
                        height: config.submenuBulletSize || 6,
                        borderRadius: "50%",
                        background:
                          config.submenuBulletColor || config.accentColor,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const splitIdx = Math.ceil(config.links.length / 2);
  const leftLinks = config.links.slice(0, splitIdx);
  const rightLinks = config.links.slice(splitIdx);

  const linksEl =
    !isMobile && config.linksPosition !== "split" && renderLinks(config.links);
  const leftLinksEl =
    !isMobile && config.linksPosition === "split" && renderLinks(leftLinks);
  const rightLinksEl =
    !isMobile && config.linksPosition === "split" && renderLinks(rightLinks);

  return (
    <div
      style={{
        fontFamily: navFont,
        position: isFloating ? "relative" : "unset",
        minHeight: isFloating
          ? config.height + (config.floatingMarginTop || 20) + 10 + "px"
          : "auto",
        background: "transparent",
        overflow: isFloating ? "visible" : "unset",
      }}
    >
      <style>{`
        @keyframes menu-down {
          from { opacity: 0; transform: translateY(-8px) translateX(-50%); }
          to   { opacity: 1; transform: translateY(0)  translateX(-50%); }
        }
        @keyframes mobile-menu-down {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes side-panel-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes side-panel-in-left {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

      {/* MAIN NAV BAR */}
      <div style={navStyle}>
        {/* SPLIT layout: leftLinks | logo | rightLinks + buttons */}
        {config.linksPosition === "split" && !isMobile ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {leftLinksEl}
            </div>
            {logoEl}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {rightLinksEl}
              {buttonsEl}
              {hamburgerEl}
            </div>
          </>
        ) : config.logoPosition === "right" ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {config.linksPosition !== "center" && linksEl}
              {buttonsEl}
              {hamburgerEl}
            </div>
            {config.linksPosition === "center" && (
              <div
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
              >
                {linksEl}
              </div>
            )}
            {logoEl}
          </>
        ) : config.logoPosition === "center" ? (
          <>
            <div style={{ width: 40 }} />
            {logoEl}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {linksEl}
              {buttonsEl}
              {hamburgerEl}
            </div>
          </>
        ) : (
          /* DEFAULT: logo left */
          <>
            {logoEl}
            {config.linksPosition === "center" && (
              <div
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
              >
                {linksEl}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {config.linksPosition !== "center" && linksEl}
              {buttonsEl}
              {hamburgerEl}
            </div>
          </>
        )}
      </div>

      {/* STANDARD MOBILE MENU */}
      {isMobile && menuOpen && !isSidePanel && !isFloating && (
        <div
          style={{
            background:
              config.bgType === "gradient"
                ? `linear-gradient(${config.bgGradient?.direction}, ${config.bgGradient?.from}, ${config.bgGradient?.to})`
                : config.bg || "#ffffff",
            position: "relative",
            zIndex: 999,
            borderTop: "1px solid rgba(0,0,0,0.07)",
            padding: "6px 0 16px",
            animation: "mobile-menu-down 0.25s ease",
          }}
        >
          {config.links.map((link) => (
            <div key={link.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <a
                  href={safeHref(link.url)}
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  data-submenu-toggle={link.hasSubmenu ? "true" : undefined}
                  onClick={(e) => {
                    if (link.hasSubmenu) {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileOpenSubs((p) => ({
                        ...p,
                        [link.id]: !p[link.id],
                      }));
                    } else {
                      setMenuOpen(false);
                    }
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 20px",
                    fontSize: 14,
                    color: config.linkColor,
                    textDecoration: "none",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {link.label}
                  {link.hasSubmenu && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{
                        transform: mobileOpenSubs[link.id]
                          ? "rotate(180deg)"
                          : "none",
                        transition: "transform 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </a>
              </div>
              {link.hasSubmenu &&
                mobileOpenSubs[link.id] &&
                link.children.map((c) => (
                  <a
                    key={c.id}
                    href={safeHref(c.url)}
                    target={c.url.startsWith("http") ? "_blank" : "_self"}
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 20px 9px 36px",
                      fontSize: 13,
                      color: config.linkColor,
                      textDecoration: "none",
                      opacity: 0.8,
                    }}
                  >
                    {config.submenuShowBullet !== false && (
                      <span
                        style={{
                          width: config.submenuBulletSize || 4,
                          height: config.submenuBulletSize || 4,
                          borderRadius: "50%",
                          background:
                            config.submenuBulletColor || config.accentColor,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {c.label}
                  </a>
                ))}
            </div>
          ))}
          <div style={{ padding: "10px 20px 0" }}>
            {config.buttons.map((btn) => (
              <a
                key={btn.id}
                href={safeHref(btn.url)}
                target={btn.url.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: btn.style === "filled" ? btn.bg : "transparent",
                  color: btn.style === "filled" ? btn.color : btn.bg,
                  border:
                    btn.style === "outline" ? `2px solid ${btn.bg}` : "none",
                  borderRadius: btn.borderRadius + "px",
                  padding: "11px",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  marginTop: 8,
                }}
              >
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SIDE PANEL OVERLAY */}
      {(isSidePanel || isFloating) && sidePanelOpen && (
        <>
          {/* Dark backdrop */}
          <div
            onClick={() => setSidePanelOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 9998,
            }}
          />
          {/* Panel */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: (config.sidePanelWidth || 340) + "px",
              [config.sidePanelPosition === "left" ? "left" : "right"]: 0,
              marginLeft: config.sidePanelPosition === "left" ? 0 : "auto",
              background: config.sidePanelBg || "#000000",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              justifyContent: config.links.length > 6 ? "flex-start" : "center",
              paddingTop: config.links.length > 6 ? "80px" : "48px",
              paddingBottom: "48px",
              paddingLeft: "40px",
              paddingRight: "40px",
              overflowY: "auto",
              animation:
                config.sidePanelPosition === "left"
                  ? "side-panel-in-left 0.3s ease"
                  : "side-panel-in-right 0.3s ease",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSidePanelOpen(false)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: "none",
                border: "none",
                color: config.sidePanelTextColor || "#fff",
                fontSize: 28,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            {/* Links */}
            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {config.links.map((link) => (
                <div key={link.id}>
                  <a
                    href={safeHref(link.url)}
                    onClick={(e) => {
                      setSidePanelOpen(false);
                      const href = link.url;
                      if (href.startsWith("#")) {
                        e.preventDefault();
                        const el = document.getElementById(href.slice(1));
                        if (el)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }
                    }}
                    style={{
                      fontSize: `clamp(18px, ${(config.sidePanelFontSize || 36) / config.links.length < 20 ? "4vw" : config.sidePanelFontSize || 36}px, ${config.sidePanelFontSize || 36}px)`,
                      fontWeight: 700,
                      color: config.sidePanelTextColor || "#ffffff",
                      textDecoration: "none",
                      display: "block",
                      padding: config.links.length > 6 ? "4px 0" : "8px 0",
                      transition: "color 0.2s, transform 0.2s",
                      fontFamily: navFont,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = config.accentColor;
                      e.currentTarget.style.transform = "translateX(8px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color =
                        config.sidePanelTextColor || "#ffffff";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {link.label}
                  </a>
                  {link.hasSubmenu &&
                    link.children.map((ch) => (
                      <a
                        key={ch.id}
                        href={safeHref(ch.url)}
                        onClick={(e) => {
                          setSidePanelOpen(false);
                          const href = ch.url;
                          if (href.startsWith("#")) {
                            e.preventDefault();
                            const el = document.getElementById(href.slice(1));
                            if (el)
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }
                        }}
                        style={{
                          fontSize: 16,
                          color: config.sidePanelTextColor || "#ffffff",
                          opacity: 0.6,
                          textDecoration: "none",
                          display: "block",
                          padding: "4px 0 4px 16px",
                        }}
                      >
                        — {ch.label}
                      </a>
                    ))}
                </div>
              ))}
            </div>

            {/* Buttons in panel */}
            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {config.buttons.map((btn) => (
                <a
                  key={btn.id}
                  href={safeHref(btn.url)}
                  onClick={() => setSidePanelOpen(false)}
                  style={{
                    background: btn.style === "filled" ? btn.bg : "transparent",
                    color: btn.style === "filled" ? btn.color : btn.bg,
                    border:
                      btn.style === "outline" ? `2px solid ${btn.bg}` : "none",
                    borderRadius: btn.borderRadius + "px",
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  {btn.label}
                </a>
              ))}
            </div>

            {/* Watermark logo in panel background */}
            {config.sidePanelWatermark !== false && (
              <div
                style={{
                  position: "absolute",
                  bottom: 32,
                  right: 24,
                  fontSize: 80,
                  fontWeight: 900,
                  color: config.sidePanelTextColor || "#fff",
                  opacity: 0.05,
                  fontFamily: logoFont,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {config.logo.text}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
