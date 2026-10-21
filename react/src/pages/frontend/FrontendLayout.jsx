import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarPreview from "../../components/preview/NavbarPreview";

export default function FrontendLayout({ pages, navbars }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const currentPage =
    pages.find((p) => {
      if (p.slug === "/" && location.pathname === "/") return true;
      if (p.slug !== "/" && location.pathname === p.slug) return true;
      return false;
    }) || pages[0];

  const navbar = navbars.find((n) => n.id === currentPage?.navbarId);

  const enrichedConfig = navbar
    ? {
        ...navbar.config,
        links: (navbar.config.links || []).map((link) => {
          const matchedPage = pages.find(
            (p) =>
              p.slug === link.url ||
              p.label.toLowerCase() === link.label.toLowerCase(),
          );
          const childMatch = (link.children || []).some((ch) => {
            const childPage = pages.find(
              (p) =>
                p.slug === ch.url ||
                p.label.toLowerCase() === ch.label.toLowerCase(),
            );
            return childPage
              ? childPage.slug === "/"
                ? location.pathname === "/"
                : location.pathname === childPage.slug
              : false;
          });
          return {
            ...link,
            _isActive: matchedPage
              ? matchedPage.slug === "/"
                ? location.pathname === "/"
                : location.pathname === matchedPage.slug
              : childMatch,
            children: (link.children || []).map((ch) => {
              const childPage = pages.find(
                (p) =>
                  p.slug === ch.url ||
                  p.label.toLowerCase() === ch.label.toLowerCase(),
              );
              return {
                ...ch,
                _isActive: childPage
                  ? childPage.slug === "/"
                    ? location.pathname === "/"
                    : location.pathname === childPage.slug
                  : false,
              };
            }),
          };
        }),
      }
    : null;

  // Global click interceptor — capture phase catches all <a> clicks
  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (a.dataset.submenuToggle === "true") return;
      const href = a.getAttribute("href");
      if (!href) return;

      // Hash scroll
      if (href.startsWith("#")) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new Event("navbar:close"));
        const el = document.getElementById(href.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      // Page slug — starts with / but not a backend route
      if (href.startsWith("/")) {
        const isBackend =
          href.startsWith("/dashboard") ||
          href.startsWith("/login") ||
          href.startsWith("/template") ||
          href.startsWith("/create");
        if (!isBackend) {
          e.preventDefault();
          e.stopPropagation();
          window.dispatchEvent(new Event("navbar:close"));
          navigate(href);
          return;
        }
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [pages, navigate]);

  const transparent = navbar?.config?.transparent;
  const height = navbar?.config?.height || 64;

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Inter',system-ui,sans-serif;overflow-x:hidden}
      `}</style>

      {/* Active link + active submenu styles */}
      {enrichedConfig && (
        <style>{`
          ${(enrichedConfig.links || [])
            .filter((l) => l._isActive)
            .map(
              (l) => `
              a[href="${l.url}"] {
                color: ${enrichedConfig.accentColor || "#2563eb"} !important;
                font-weight: 700 !important;
              }
            `,
            )
            .join("")}
          ${(enrichedConfig.links || [])
            .flatMap((l) => l.children || [])
            .filter((ch) => ch._isActive)
            .map(
              (ch) => `
              a[href="${ch.url}"] {
                color: ${enrichedConfig.accentColor || "#2563eb"} !important;
                font-weight: 700 !important;
              }
            `,
            )
            .join("")}
        `}</style>
      )}

      {enrichedConfig && enrichedConfig.navbarStyle !== "floating" && (
        <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
          <NavbarPreview config={enrichedConfig} isMobile={isMobile} />
        </div>
      )}

      <div
        style={{
          position: "relative",
          marginTop: transparent ? `-${height}px` : 0,
        }}
      >
        {enrichedConfig && enrichedConfig.navbarStyle === "floating" && (
          <div
            style={{
              position: "sticky",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              background: "transparent",
              pointerEvents: "none",
              height: 0,
              overflow: "visible",
            }}
          >
            <div style={{ pointerEvents: "auto" }}>
              <NavbarPreview config={enrichedConfig} isMobile={isMobile} />
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </>
  );
}
