import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { templateApi } from "../../api/templateApi";
import FrontendLayout from "./FrontendLayout";
import PageRenderer from "./PageRenderer";

export default function Index() {
  const [data, setData] = useState(null); // { navbars, pages }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await templateApi.getActive();
        const raw = res.data.data;
        // Handle old shape migration
        if (raw?.pages && raw?.navbars) {
          setData(raw);
        } else {
          // Old shape: { sections }
          const sections = raw?.sections || [];
          const navbarSection = sections.find((s) => s.type === "navbar");
          const otherSections = sections.filter((s) => s.type !== "navbar");
          const nb = {
            id: "nb_main",
            name: "Main Navbar",
            config: navbarSection?.config || {},
          };
          const homePage = {
            id: "pg_home",
            label: "Home",
            slug: "/",
            navbarId: "nb_main",
            sections: otherSections,
          };
          setData({ navbars: [nb], pages: [homePage] });
        }
      } catch {
        setData({ navbars: [], pages: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return null;
  if (!data || data.pages.length === 0)
    return <div style={{ padding: 40, color: "#94a3b8" }}>No pages found.</div>;

  const { navbars, pages } = data;

  return (
    <Routes>
      <Route element={<FrontendLayout pages={pages} navbars={navbars} />}>
        {/* Home page */}
        <Route index element={<PageRenderer pages={pages} />} />
        {/* All other pages */}
        {pages
          .filter((p) => p.slug !== "/")
          .map((p) => (
            <Route
              key={p.id}
              path={p.slug.replace(/^\//, "")}
              element={<PageRenderer pages={pages} />}
            />
          ))}
        {/* 404 fallback */}
        <Route path="*" element={<PageRenderer pages={pages} />} />
      </Route>
    </Routes>
  );
}
