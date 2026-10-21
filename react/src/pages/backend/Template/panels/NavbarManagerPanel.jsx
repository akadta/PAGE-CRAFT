import { useState } from "react";
import NavbarPanel from "./NavbarPanel";
import { createNavbarEntry } from "../../../../config/sectionDefaults";

export default function NavbarManagerPanel({ navbars, onChange }) {
  const [activeId, setActiveId] = useState(navbars[0]?.id || null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const activeNavbar = navbars.find((n) => n.id === activeId);

  const addNavbar = () => {
    const n = createNavbarEntry("New Navbar");
    onChange([...navbars, n]);
    setActiveId(n.id);
  };

  const deleteNavbar = (id) => {
    if (navbars.length === 1) return alert("Need at least one navbar.");
    const next = navbars.filter((n) => n.id !== id);
    onChange(next);
    setActiveId(next[0]?.id || null);
  };

  const renameNavbar = (id, name) => {
    onChange(navbars.map((n) => (n.id === id ? { ...n, name } : n)));
  };

  const updateNavbarConfig = (id, patch) => {
    onChange(
      navbars.map((n) =>
        n.id === id
          ? {
              ...n,
              config:
                typeof patch === "function"
                  ? patch(n.config)
                  : { ...n.config, ...patch },
            }
          : n,
      ),
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Navbar selector tabs */}
      <div
        style={{
          padding: "8px 10px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          flexShrink: 0,
        }}
      >
        {navbars.map((n) => (
          <div key={n.id} style={{ position: "relative" }}>
            {renamingId === n.id ? (
              <input
                autoFocus
                value={renameVal}
                onChange={(e) => setRenameVal(e.target.value)}
                onBlur={() => {
                  if (renameVal.trim()) renameNavbar(n.id, renameVal.trim());
                  setRenamingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (renameVal.trim()) renameNavbar(n.id, renameVal.trim());
                    setRenamingId(null);
                  }
                }}
                style={{
                  width: 90,
                  fontSize: 11,
                  padding: "4px 6px",
                  border: "1.5px solid #2563eb",
                  borderRadius: 6,
                  outline: "none",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: `1.5px solid ${activeId === n.id ? "#2563eb" : "#e2e8f0"}`,
                  background: activeId === n.id ? "#eff6ff" : "#f8fafc",
                  cursor: "pointer",
                }}
                onClick={() => setActiveId(n.id)}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: activeId === n.id ? "#2563eb" : "#475569",
                  }}
                >
                  {n.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(n.id);
                    setRenameVal(n.name);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 10,
                    color: "#94a3b8",
                    padding: 0,
                  }}
                  title="Rename"
                >
                  ✎
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNavbar(n.id);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "#cbd5e1",
                    padding: 0,
                    lineHeight: 1,
                  }}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={addNavbar}
          style={{
            padding: "4px 10px",
            border: "1.5px dashed #cbd5e1",
            borderRadius: 6,
            background: "transparent",
            color: "#94a3b8",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          + New
        </button>
      </div>

      {/* Active navbar's panel */}
      {activeNavbar && (
        <div style={{ flex: 1, overflow: "hidden" }}>
          <NavbarPanel
            config={activeNavbar.config}
            onChange={(patch) => updateNavbarConfig(activeId, patch)}
          />
        </div>
      )}
    </div>
  );
}
