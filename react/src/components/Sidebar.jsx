import { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: "layout-dashboard",
    section: "Main",
    path: "/dashboard",
  },
  {
    label: "Templates",
    icon: "template",
    section: "Main",
    path: "/create/template",
  },
  // {
  //   label: "Orders",
  //   icon: "shopping-cart",
  //   section: "Main",
  //   // path: "/orders",
  //   children: [{ label: "All Orders", path: "/orders/all" }],
  // },
];

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [openSubs, setOpenSubs] = useState({});

  function toggleSub(label) {
    setOpenSubs((p) => ({ ...p, [label]: !p[label] }));
  }

  // Navigate helper — swap with useNavigate() if using React Router
  const navigate = useNavigate();

  const sections = [...new Set(menuItems.map((m) => m.section))];

  return (
    <>
      <style>{`
        .db-sidebar {
          width: 220px; flex-shrink: 0;
          background: #ffffff;
          border-right: 1px solid rgba(37,99,235,0.12);
          display: flex; flex-direction: column;
          transition: width 0.25s ease;
          overflow: hidden; z-index: 100;
        }
        .db-sidebar.collapsed { width: 0; overflow: hidden; }
        @media(max-width:768px){
          .db-sidebar {
            position: fixed; left: 0; top: 0; bottom: 0;
            width: 220px !important;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .db-sidebar.collapsed { width: 220px !important; transform: translateX(-100%); }
          .db-sidebar.mobile-open { transform: translateX(0) !important; }
        }
        .sb-logo {
          display: flex; align-items: center; gap: 10px;
          padding: 0 16px; height: 52px; flex-shrink: 0;
          border-bottom: 1px solid rgba(37,99,235,0.08);
        }
        .sb-logo-icon {
          width: 28px; height: 28px; border-radius: 7px; background: #2563eb;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sb-logo-icon i { color: #fff; font-size: 14px; }
        .sb-logo-text { font-size: 13px; font-weight: 600; color: #0f172a; white-space: nowrap; }
        .sb-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 0; }
        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.2); border-radius: 2px; }
        .sb-section-label {
          font-size: 9px; font-weight: 600; color: #94a3b8;
          letter-spacing: 1.2px; text-transform: uppercase;
          padding: 8px 16px 2px; white-space: nowrap;
        }
        .sb-item {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 16px; cursor: pointer;
          transition: background 0.15s; position: relative; white-space: nowrap;
        }
        .sb-item:hover { background: rgba(37,99,235,0.06); }
        .sb-item.active { background: rgba(37,99,235,0.1); }
        .sb-item.active::before {
          content: ''; position: absolute; left: 0; top: 4px; bottom: 4px;
          width: 3px; border-radius: 0 3px 3px 0; background: #2563eb;
        }
        .sb-item i.main-icon { font-size: 16px; color: #64748b; flex-shrink: 0; width: 20px; text-align: center; }
        .sb-item.active i.main-icon { color: #2563eb; }
        .sb-item-label { font-size: 12.5px; color: #374151; font-weight: 500; }
        .sb-item.active .sb-item-label { color: #2563eb; }
        .sb-badge {
          margin-left: auto; background: #2563eb; color: #fff;
          font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 8px; flex-shrink: 0;
        }
        .sb-chevron { margin-left: auto; font-size: 12px; color: #94a3b8; transition: transform 0.2s; flex-shrink: 0; }
        .sb-chevron.open { transform: rotate(180deg); }
        .sb-submenu { overflow: hidden; max-height: 0; transition: max-height 0.25s ease; }
        .sb-submenu.open { max-height: 200px; }
        .sb-sub-item {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 16px 5px 44px; cursor: pointer;
          font-size: 12px; color: #64748b;
          transition: color 0.15s, background 0.15s;
        }
        .sb-sub-item:hover { color: #2563eb; background: rgba(37,99,235,0.04); }

        /* ── Route badge ── */
        .sb-route {
          font-size: 10px; color: #94a3b8; font-family: monospace;
          margin-left: auto; white-space: nowrap; padding-left: 6px;
        }
        .sb-item.active .sb-route { color: #93c5fd; }
        .sb-sub-route {
          font-size: 10px; color: #cbd5e1; font-family: monospace;
          margin-left: auto; padding-right: 12px; white-space: nowrap;
        }
      `}</style>

      <aside
        className={`db-sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}
      >
        <div className="sb-logo">
          <div className="sb-logo-icon">
            <i className="ti ti-bolt" />
          </div>
          <span className="sb-logo-text">AdminPro</span>
        </div>

        <nav className="sb-nav">
          {sections.map((section) => (
            <div key={section}>
              <div className="sb-section-label">{section}</div>
              {menuItems
                .filter((m) => m.section === section)
                .map((item) => (
                  <div key={item.label}>
                    <div
                      className={`sb-item${activeItem === item.label ? " active" : ""}`}
                      onClick={() => {
                        setActiveItem(item.label);
                        if (item.children) {
                          toggleSub(item.label);
                        } else {
                          navigate(item.path);
                        }
                      }}
                    >
                      <i className={`ti ti-${item.icon} main-icon`} />
                      <span className="sb-item-label">{item.label}</span>

                      {/* Route label — hidden when there's a chevron */}

                      {item.badge && (
                        <span className="sb-badge">{item.badge}</span>
                      )}
                      {item.children && (
                        <i
                          className={`ti ti-chevron-down sb-chevron${openSubs[item.label] ? " open" : ""}`}
                        />
                      )}
                    </div>

                    {item.children && (
                      <div
                        className={`sb-submenu${openSubs[item.label] ? " open" : ""}`}
                      >
                        {item.children.map((child) => (
                          <div
                            className="sb-sub-item"
                            key={child.label}
                            onClick={() => navigate(child.path)}
                          >
                            <i
                              className="ti ti-circle-dot"
                              style={{ fontSize: 9 }}
                            />
                            {child.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
