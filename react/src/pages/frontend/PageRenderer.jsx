import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import SectionRenderer from "../../components/preview/sections/SectionRenderer";

export default function PageRenderer({ pages }) {
  const location = useLocation();

  // Find page matching current slug
  const currentPage =
    pages.find((p) => {
      if (p.slug === "/" && location.pathname === "/") return true;
      if (p.slug !== "/" && location.pathname === p.slug) return true;
      return false;
    }) || pages[0];

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!currentPage) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "#94a3b8",
          fontSize: 16,
        }}
      >
        Page not found
      </div>
    );
  }

  return (
    <>
      {(currentPage.sections || []).map((section) => (
        <div key={section.id} id={section.navId || section.id}>
          <SectionRenderer section={section} />
        </div>
      ))}
    </>
  );
}
