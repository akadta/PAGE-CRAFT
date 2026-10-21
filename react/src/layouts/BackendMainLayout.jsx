import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function BackendMainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleSidebar() {
    if (isMobile) setMobileOpen((p) => !p);
    else setCollapsed((p) => !p);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; overflow: hidden; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #dbeafe; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.2); border-radius: 2px; }
        .db-app { display: flex; height: 100vh; overflow: hidden; }
        .db-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 90; }
        .db-overlay.show { display: block; }
        .db-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .db-content { flex: 1; overflow-y: auto; padding: 14px; }
      `}</style>

      <div className="db-app">
        {/* Mobile overlay */}
        <div
          className={`db-overlay${mobileOpen ? " show" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="db-main">
          <Navbar onToggle={toggleSidebar} />
          <div className="db-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
