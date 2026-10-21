import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onToggle }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <style>{`
        .db-nav {
          height: 52px; display: flex; align-items: center; gap: 10px;
          padding: 0 16px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(37,99,235,0.1);
          flex-shrink: 0; position: relative; z-index: 50;
        }
        .nav-toggle {
          width: 30px; height: 30px; border: none;
          background: rgba(37,99,235,0.07); border-radius: 7px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background 0.15s;
        }
        .nav-toggle:hover { background: rgba(37,99,235,0.14); }
        .nav-toggle i { font-size: 16px; color: #2563eb; }
        .nav-breadcrumb { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #94a3b8; }
        .nav-breadcrumb span:last-child { color: #0f172a; font-weight: 500; }
        .nav-search {
          margin-left: auto; display: flex; align-items: center; gap: 7px;
          background: rgba(241,245,249,0.8); border: 1px solid rgba(37,99,235,0.1);
          border-radius: 8px; padding: 5px 10px;
        }
        .nav-search i { font-size: 13px; color: #94a3b8; }
        .nav-search input {
          border: none; background: transparent; font-size: 12px;
          color: #0f172a; outline: none; width: 140px;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .nav-search input::placeholder { color: #94a3b8; }
        @media(max-width:600px){ .nav-search { display: none; } }
        .nav-actions { display: flex; align-items: center; gap: 6px; }
        .nav-icon-btn {
          width: 30px; height: 30px; border-radius: 7px;
          background: rgba(241,245,249,0.8); border: 1px solid rgba(37,99,235,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; transition: background 0.15s;
        }
        .nav-icon-btn:hover { background: rgba(37,99,235,0.07); }
        .nav-icon-btn i { font-size: 15px; color: #64748b; }
        .notif-dot {
          position: absolute; top: 5px; right: 5px;
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444; border: 1.5px solid #fff;
        }
        .avatar-wrap { position: relative; }
        .avatar {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; cursor: pointer;
          border: 1.5px solid rgba(37,99,235,0.3); user-select: none;
        }
        .avatar-dd {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(37,99,235,0.12); border-radius: 12px;
          padding: 6px; min-width: 180px; z-index: 200;
          box-shadow: 0 8px 32px rgba(37,99,235,0.12); display: none;
        }
        .avatar-dd.open { display: block; }
        .dd-header { padding: 8px 10px; border-bottom: 1px solid rgba(37,99,235,0.08); margin-bottom: 4px; }
        .dd-header p { font-size: 12px; font-weight: 600; color: #0f172a; }
        .dd-header span { font-size: 11px; color: #94a3b8; }
        .dd-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px; cursor: pointer;
          font-size: 12px; color: #374151; transition: background 0.15s;
          font-family: 'Inter', system-ui, sans-serif;
          border: none; background: none; width: 100%; text-align: left;
        }
        .dd-item:hover { background: rgba(37,99,235,0.06); }
        .dd-item i { font-size: 14px; color: #94a3b8; }
        .dd-item.danger { color: #dc2626; }
        .dd-item.danger i { color: #dc2626; }
        .dd-divider { height: 1px; background: rgba(37,99,235,0.08); margin: 4px 0; }
      `}</style>

      <header className="db-nav">
        <button className="nav-toggle" onClick={onToggle}>
          <i className="ti ti-menu-2" />
        </button>
        <div className="nav-breadcrumb">
          <span>Home</span>
          <i className="ti ti-chevron-right" style={{ fontSize: 11 }} />
          <span>Dashboard</span>
        </div>
        <div className="nav-search">
          <i className="ti ti-search" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="nav-actions">
          <div className="nav-icon-btn">
            <i className="ti ti-bell" />
            <span className="notif-dot" />
          </div>
          <div className="nav-icon-btn">
            <i className="ti ti-mail" />
          </div>
          <div className="avatar-wrap" ref={dropdownRef}>
            <div className="avatar" onClick={() => setDropdownOpen((p) => !p)}>
              AD
            </div>
            <div className={`avatar-dd${dropdownOpen ? " open" : ""}`}>
              <div className="dd-header">
                <p>Admin User</p>
                <span>admin@example.com</span>
              </div>
              <button className="dd-item">
                <i className="ti ti-user" /> My Profile
              </button>
              <button className="dd-item">
                <i className="ti ti-settings" /> Settings
              </button>
              <button className="dd-item">
                <i className="ti ti-help" /> Help
              </button>
              <div className="dd-divider" />
              <button className="dd-item danger" onClick={logout}>
                <i className="ti ti-logout" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
