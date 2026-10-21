import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { templateApi } from "../../../api/templateApi";
import NavbarPreview from "../../../components/preview/NavbarPreview";
import SectionRenderer from "../../../components/preview/sections/SectionRenderer";
import {
  createSection,
  createPage,
  createNavbarEntry,
  uid,
} from "../../../config/sectionDefaults";

import NavbarPanel from "./panels/NavbarPanel";
import HeroPanel from "./panels/HeroPanel";
import AboutPanel from "./panels/AboutPanel";
import FeaturesPanel from "./panels/FeaturesPanel";
import CarouselPanel from "./panels/CarouselPanel";
import TestimonialsPanel from "./panels/TestimonialsPanel";
import TeamPanel from "./panels/TeamPanel";
import StatsPanel from "./panels/StatsPanel";
import CtaPanel from "./panels/CtaPanel";
import GalleryPanel from "./panels/GalleryPanel";
import PricingPanel from "./panels/PricingPanel";
import FaqPanel from "./panels/FaqPanel";
import ContactPanel from "./panels/ContactPanel";
import FooterPanel from "./panels/FooterPanel";
import NavbarManagerPanel from "./panels/NavbarManagerPanel";
import SpacerPanel from "./panels/SpacerPanel";
import CustomAboutPanel from "./panels/CustomAboutPanel";
import AnimatedHeroPanel from "./panels/AnimatedHeroPanel"; // ADD THIS LINE

const PANEL_MAP = {
  navbar: NavbarPanel,
  hero: HeroPanel,
  about: AboutPanel,
  features: FeaturesPanel,
  carousel: CarouselPanel,
  testimonials: TestimonialsPanel,
  team: TeamPanel,
  stats: StatsPanel,
  cta: CtaPanel,
  gallery: GalleryPanel,
  pricing: PricingPanel,
  faq: FaqPanel,
  contact: ContactPanel,
  footer: FooterPanel,
  spacer: SpacerPanel,
  customAbout: CustomAboutPanel,
  animatedHero: AnimatedHeroPanel, // ADD THIS LINE
};

const SECTION_TYPES = [
  { type: "hero", icon: "★", label: "Hero" },
  // { type: "animatedHero", icon: "🌊", label: "Animated Hero" }, // ADD THIS LINE

  { type: "about", icon: "◎", label: "About" },
  { type: "customAbout", icon: "🖼", label: "Custom About" },
  { type: "features", icon: "⊞", label: "Features" },
  { type: "carousel", icon: "▷", label: "Carousel" },
  { type: "testimonials", icon: "❝", label: "Testimonials" },
  { type: "team", icon: "👥", label: "Team" },
  { type: "stats", icon: "#", label: "Stats" },
  { type: "cta", icon: "→", label: "CTA" },
  { type: "gallery", icon: "⊡", label: "Gallery" },
  { type: "pricing", icon: "$", label: "Pricing" },
  { type: "faq", icon: "?", label: "FAQ" },
  { type: "contact", icon: "✉", label: "Contact" },
  { type: "footer", icon: "—", label: "Footer" },
  { type: "spacer", icon: "↕", label: "Spacer" },
];

// ── Migrate old data shape to new ────────────────────────────────────────────
function migrateData(data) {
  if (!data) return { navbars: [], pages: [] };
  // Already new shape
  if (data.pages && data.navbars) return data;
  // Old shape: { sections: [...] }
  const oldSections = data.sections || [];
  const navbarSection = oldSections.find((s) => s.type === "navbar");
  const otherSections = oldSections.filter((s) => s.type !== "navbar");
  const nb = createNavbarEntry("Main Navbar");
  if (navbarSection) nb.config = navbarSection.config;
  const homePage = createPage("Home");
  homePage.navbarId = nb.id;
  homePage.sections = otherSections;
  return { navbars: [nb], pages: [homePage] };
}

// ── Sortable section item ─────────────────────────────────────────────────────
function SortableItem({ section, active, onClick, onDelete, onReuse }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <div
        className={`ed-section-item${active ? " active" : ""}`}
        onClick={onClick}
      >
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            color: "#cbd5e1",
            fontSize: 12,
            marginRight: 2,
          }}
        >
          ⠿
        </span>
        <div className="ed-section-dot" />
        <span style={{ textTransform: "capitalize", flex: 1 }}>
          {section.type}
        </span>
        <button
          className="ed-section-reuse"
          title="Reuse in another page"
          onClick={(e) => {
            e.stopPropagation();
            onReuse();
          }}
        >
          ⧉
        </button>
        <button
          className="ed-section-del"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────────────────────
export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [navbars, setNavbars] = useState([]);
  const [pages, setPages] = useState([]);
  const [activePageId, setActivePageId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showPreviewFull, setShowPreviewFull] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leftTab, setLeftTab] = useState("pages"); // "pages" | "navbars"
  const [renamingPageId, setRenamingPageId] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [addingPage, setAddingPage] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [reuseSectionId, setReuseSectionId] = useState(null);
  const sectionRefs = useRef({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await templateApi.getOne(id);
        setTemplate(res.data);
        const migrated = migrateData(res.data.data);
        setNavbars(migrated.navbars);
        setPages(migrated.pages);
        if (migrated.pages.length > 0) {
          setActivePageId(migrated.pages[0].id);
          const firstSections = migrated.pages[0].sections;
          if (firstSections.length > 0) setActiveSection(firstSections[0].id);
        }
      } catch {
        navigate("/create/template");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── Auto save ─────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    setSaving(true);
    try {
      await templateApi.update(id, { data: { navbars, pages } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [id, navbars, pages]);

  useEffect(() => {
    if (!template) return;
    const t = setTimeout(() => save(), 2500);
    return () => clearTimeout(t);
  }, [navbars, pages]);

  // ── Active page ───────────────────────────────────────────────────────────
  const activePage = pages.find((p) => p.id === activePageId);
  const sections = activePage?.sections || [];

  const selectSection = (sId) => {
    setActiveSection(sId);
    setTimeout(() => {
      const el = sectionRefs.current[sId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // ── Page operations ───────────────────────────────────────────────────────
  const addPage = (label) => {
    if (!label.trim()) return;
    const p = createPage(label.trim());
    if (navbars.length > 0) p.navbarId = navbars[0].id;
    setPages((prev) => [...prev, p]);
    setActivePageId(p.id);
    setActiveSection(null);
    setAddingPage(false);
    setNewPageName("");
  };

  const deletePage = (pid) => {
    if (pages.length === 1) return alert("Need at least one page.");
    setPages((prev) => {
      const next = prev.filter((p) => p.id !== pid);
      setActivePageId(next[0]?.id || null);
      return next;
    });
    setActiveSection(null);
  };

  const renamePage = (pid, label) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pid
          ? {
              ...p,
              label,
              slug:
                label.toLowerCase() === "home"
                  ? "/"
                  : "/" + label.toLowerCase().replace(/\s+/g, "-"),
            }
          : p,
      ),
    );
  };

  const updatePageNavbar = (pid, navbarId) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pid ? { ...p, navbarId } : p)),
    );
  };

  // ── Section operations ────────────────────────────────────────────────────
  const addSection = (type) => {
    const s = createSection(type);
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId ? { ...p, sections: [...p.sections, s] } : p,
      ),
    );
    selectSection(s.id);
    setAddMenuOpen(false);
  };

  const updateSection = (sectionId, updater) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id !== activePageId
          ? p
          : {
              ...p,
              sections: p.sections.map((s) =>
                s.id !== sectionId
                  ? s
                  : {
                      ...s,
                      config:
                        typeof updater === "function"
                          ? updater(s.config)
                          : { ...s.config, ...updater },
                    },
              ),
            },
      ),
    );
  };

  const deleteSection = (sectionId) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const next = p.sections.filter((s) => s.id !== sectionId);
        setActiveSection(next[0]?.id || null);
        return { ...p, sections: next };
      }),
    );
  };

  const reuseSectionToPage = (sectionId, targetPageId) => {
    const source = sections.find((s) => s.id === sectionId);
    if (!source) return;
    const cloned = {
      ...JSON.parse(JSON.stringify(source)),
      id: uid(),
    };
    setPages((prev) =>
      prev.map((p) =>
        p.id === targetPageId ? { ...p, sections: [...p.sections, cloned] } : p,
      ),
    );
    setReuseSectionId(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const oi = p.sections.findIndex((s) => s.id === active.id);
        const ni = p.sections.findIndex((s) => s.id === over.id);
        return { ...p, sections: arrayMove(p.sections, oi, ni) };
      }),
    );
  };

  // ── Active section panel ──────────────────────────────────────────────────
  const activeS = sections.find((s) => s.id === activeSection);
  const Panel = activeS ? PANEL_MAP[activeS.type] : null;

  // ── Active navbar for this page ───────────────────────────────────────────
  const activeNavbar =
    navbars.find((n) => n.id === activePage?.navbarId) || navbars[0];

  // ── Full preview ──────────────────────────────────────────────────────────
  const previewSections = sections;

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "Inter,sans-serif",
          color: "#94a3b8",
        }}
      >
        Loading editor...
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "100vh",
        fontFamily: "'Inter',sans-serif",
        background: "#f1f5f9",
      }}
    >
      <EditorStyles />

      {/* Full preview overlay */}
      {showPreviewFull && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#fff",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 48,
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setShowPreviewFull(false)}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.1)",
                color: "#e2e8f0",
                borderRadius: 7,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ← Back to Editor
            </button>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>
              Preview — {template?.name} / {activePage?.label}
            </span>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {activeNavbar && (
              <NavbarPreview config={activeNavbar.config} isMobile={false} />
            )}
            {previewSections.map((s) => (
              <SectionRenderer key={s.id} section={s} />
            ))}
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="ed-topbar">
        <button
          className="ed-back-btn"
          onClick={() => navigate("/create/template")}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div className="ed-template-name">{template?.name}</div>

        {/* Page tabs in topbar */}
        <div
          style={{
            display: "flex",
            gap: 4,
            flex: 1,
            overflowX: "auto",
            padding: "0 8px",
          }}
        >
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePageId(p.id);
                setActiveSection(p.sections[0]?.id || null);
              }}
              style={{
                padding: "4px 12px",
                border: "none",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                background:
                  activePageId === p.id ? "#2563eb" : "rgba(255,255,255,0.08)",
                color: activePageId === p.id ? "#fff" : "#94a3b8",
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setAddingPage(true)}
            style={{
              padding: "4px 10px",
              border: "1.5px dashed rgba(255,255,255,0.2)",
              borderRadius: 6,
              background: "transparent",
              color: "#94a3b8",
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Page
          </button>
        </div>

        <div className="ed-preview-toggle">
          {["desktop", "tablet", "mobile"].map((m) => (
            <button
              key={m}
              className={`ed-preview-btn${previewMode === m ? " active" : ""}`}
              onClick={() => setPreviewMode(m)}
            >
              <span style={{ textTransform: "capitalize" }}>
                {m[0].toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        <button
          className="ed-preview-full-btn"
          onClick={() => setShowPreviewFull(true)}
        >
          Preview
        </button>
        <button
          className={`ed-save-btn${saved ? " saved" : ""}`}
          onClick={save}
          disabled={saving}
        >
          {saved ? "✓ Saved" : saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Add page modal */}
      {addingPage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              width: 320,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 12,
                color: "#0f172a",
              }}
            >
              Add New Page
            </div>
            <input
              autoFocus
              className="ctrl-input"
              placeholder="Page name (e.g. About, Services)"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPage(newPageName)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
              Slug will be:{" "}
              <strong>
                /{newPageName.toLowerCase().replace(/\s+/g, "-") || "page-name"}
              </strong>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setAddingPage(false);
                  setNewPageName("");
                }}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => addPage(newPageName)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  border: "none",
                  borderRadius: 8,
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="ed-body">
        {/* Left panel */}
        <div className="ed-left">
          {/* Left tabs: Pages / Navbars */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #f1f5f9",
              flexShrink: 0,
            }}
          >
            {["pages", "navbars"].map((t) => (
              <button
                key={t}
                onClick={() => setLeftTab(t)}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: leftTab === t ? "#2563eb" : "#94a3b8",
                  padding: "8px 4px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  borderBottom: `2px solid ${leftTab === t ? "#2563eb" : "transparent"}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {leftTab === "pages" && (
            <>
              {/* Page settings: navbar picker */}
              {activePage && (
                <div
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #f1f5f9",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: 5,
                    }}
                  >
                    {activePage.label} — Navbar
                  </div>
                  <select
                    value={activePage.navbarId || ""}
                    onChange={(e) =>
                      updatePageNavbar(activePage.id, e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "5px 8px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 6,
                      fontSize: 11,
                      color: "#0f172a",
                      background: "#fafafa",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="">None</option>
                    {navbars.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                  {/* Page actions */}
                  <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                    <button
                      onClick={() => {
                        setRenamingPageId(activePage.id);
                        setRenameVal(activePage.label);
                      }}
                      style={{
                        flex: 1,
                        padding: "4px 0",
                        border: "1px solid #e2e8f0",
                        borderRadius: 5,
                        background: "#fff",
                        fontSize: 10,
                        cursor: "pointer",
                        color: "#475569",
                      }}
                    >
                      ✎ Rename
                    </button>
                    <button
                      onClick={() => deletePage(activePage.id)}
                      style={{
                        flex: 1,
                        padding: "4px 0",
                        border: "1px solid #fee2e2",
                        borderRadius: 5,
                        background: "#fff",
                        fontSize: 10,
                        cursor: "pointer",
                        color: "#dc2626",
                      }}
                    >
                      × Delete
                    </button>
                  </div>
                  {renamingPageId === activePage.id && (
                    <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                      <input
                        autoFocus
                        className="ctrl-input"
                        value={renameVal}
                        onChange={(e) => setRenameVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            renamePage(activePage.id, renameVal);
                            setRenamingPageId(null);
                          }
                          if (e.key === "Escape") setRenamingPageId(null);
                        }}
                        style={{ flex: 1, fontSize: 11 }}
                      />
                      <button
                        onClick={() => {
                          renamePage(activePage.id, renameVal);
                          setRenamingPageId(null);
                        }}
                        style={{
                          padding: "4px 8px",
                          border: "none",
                          borderRadius: 5,
                          background: "#2563eb",
                          color: "#fff",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        ✓
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sections list */}
              <div className="ed-left-header">Sections</div>
              <div className="ed-sections-list">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sections.map((s) => (
                      <SortableItem
                        key={s.id}
                        section={s}
                        active={activeSection === s.id}
                        onClick={() => selectSection(s.id)}
                        onDelete={() => deleteSection(s.id)}
                        onReuse={() => setReuseSectionId(s.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>

              {addMenuOpen ? (
                <div
                  style={{
                    margin: "0 10px 12px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    overflow: "hidden",
                    maxHeight: 320,
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      padding: "6px 12px 4px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Add Section
                  </div>
                  {SECTION_TYPES.map((st) => (
                    <div
                      key={st.type}
                      onClick={() => addSection(st.type)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: 12,
                        color: "#374151",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#eff6ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span
                        style={{ fontSize: 14, width: 18, textAlign: "center" }}
                      >
                        {st.icon}
                      </span>
                      {st.label}
                    </div>
                  ))}
                  <div style={{ padding: "6px 12px 8px" }}>
                    <button
                      onClick={() => setAddMenuOpen(false)}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "none",
                        color: "#94a3b8",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="ed-add-section-btn"
                  onClick={() => setAddMenuOpen(true)}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Section
                </button>
              )}
            </>
          )}

          {leftTab === "navbars" && (
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <NavbarManagerPanel navbars={navbars} onChange={setNavbars} />
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="ed-canvas">
          <div className={`ed-canvas-frame ${previewMode}`}>
            {/* Show active page's navbar */}
            {activeNavbar && (
              <NavbarPreview
                config={activeNavbar.config}
                isMobile={previewMode === "mobile"}
              />
            )}

            {sections.length === 0 ? (
              <div className="ed-empty-canvas">
                <div
                  style={{ fontWeight: 600, color: "#64748b", fontSize: 15 }}
                >
                  No sections yet
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                  Click "Add Section" to start building
                </div>
              </div>
            ) : (
              sections.map((s) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    sectionRefs.current[s.id] = el;
                  }}
                  className={`ed-section-wrapper${activeSection === s.id ? " active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSection(s.id);
                  }}
                >
                  {activeSection === s.id && (
                    <div className="ed-section-label-tag">{s.type}</div>
                  )}
                  <SectionRenderer section={s} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="ed-right">
          {!activeS ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#94a3b8",
                fontSize: 13,
                textAlign: "center",
                padding: 20,
              }}
            >
              Select a section to customize
            </div>
          ) : Panel ? (
            <>
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <div className="ctrl-label">Section ID (for navbar links)</div>
                <input
                  className="ctrl-input"
                  value={activeS.navId || ""}
                  onChange={(e) =>
                    setPages((prev) =>
                      prev.map((p) =>
                        p.id !== activePageId
                          ? p
                          : {
                              ...p,
                              sections: p.sections.map((s) =>
                                s.id === activeSection
                                  ? { ...s, navId: e.target.value }
                                  : s,
                              ),
                            },
                      ),
                    )
                  }
                  placeholder="e.g. about, services"
                />
              </div>
              <Panel
                config={activeS.config}
                onChange={(patch) => updateSection(activeSection, patch)}
                onChangeFn={(fn) => updateSection(activeSection, fn)}
              />
            </>
          ) : (
            <div style={{ padding: 20, color: "#94a3b8", fontSize: 13 }}>
              No panel for "{activeS.type}"
            </div>
          )}
        </div>
      </div>
      {reuseSectionId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              width: 320,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 4,
                color: "#0f172a",
              }}
            >
              ⧉ Reuse Section
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
              Copy{" "}
              <strong style={{ color: "#2563eb" }}>
                {sections.find((s) => s.id === reuseSectionId)?.type}
              </strong>{" "}
              section to which page?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pages
                .filter((p) => p.id !== activePageId)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => reuseSectionToPage(reuseSectionId, p.id)}
                    style={{
                      padding: "10px 14px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 8,
                      background: "#f8fafc",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2563eb";
                      e.currentTarget.style.background = "#eff6ff";
                      e.currentTarget.style.color = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.color = "#374151";
                    }}
                  >
                    📄 {p.label}
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 400,
                        marginLeft: 6,
                      }}
                    >
                      {p.slug}
                    </span>
                  </button>
                ))}
              {pages.filter((p) => p.id !== activePageId).length === 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    textAlign: "center",
                    padding: "12px 0",
                  }}
                >
                  No other pages exist. Create a page first.
                </div>
              )}
            </div>
            <button
              onClick={() => setReuseSectionId(null)}
              style={{
                width: "100%",
                marginTop: 14,
                padding: "8px 0",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
                fontSize: 13,
                color: "#94a3b8",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <EditorStyles />
    </div>
  );
}

function EditorStyles() {
  return (
    <style>{`
    *{box-sizing:border-box}
    html,body,#root{height:100%;margin:0;overflow:hidden}
    .ed-topbar{height:48px;background:#0f172a;display:flex;align-items:center;padding:0 14px;gap:10px;flex-shrink:0;z-index:100;border-bottom:1px solid #1e293b;overflow:hidden}
    .ed-back-btn{border:none;background:rgba(255,255,255,0.08);color:#94a3b8;border-radius:6px;padding:5px 9px;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:11px;flex-shrink:0}
    .ed-back-btn:hover{background:rgba(255,255,255,0.14);color:#e2e8f0}
    .ed-template-name{font-size:12px;font-weight:600;color:#e2e8f0;flex-shrink:0}
    .ed-preview-toggle{display:flex;border-radius:7px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);flex-shrink:0}
    .ed-preview-btn{border:none;background:transparent;color:#94a3b8;padding:4px 10px;font-size:10px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.15s}
    .ed-preview-btn.active{background:#2563eb;color:#fff}
    .ed-save-btn{border:none;background:#2563eb;color:#fff;border-radius:7px;padding:6px 14px;font-size:11px;font-weight:600;cursor:pointer;transition:background 0.2s;flex-shrink:0}
    .ed-save-btn:hover{background:#1d4ed8}
    .ed-save-btn.saved{background:#16a34a}
    .ed-preview-full-btn{border:1px solid rgba(255,255,255,0.15);background:transparent;color:#94a3b8;border-radius:7px;padding:6px 12px;font-size:11px;cursor:pointer;flex-shrink:0}
    .ed-preview-full-btn:hover{color:#e2e8f0}
    .ed-body{display:flex;flex:1;overflow:hidden;min-height:0;height:0}
    .ed-left{width:200px;flex-shrink:0;background:#fff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;overflow:hidden;min-height:0}
    .ed-left-header{padding:6px 12px 4px;font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;flex-shrink:0}
    .ed-sections-list{flex:1;overflow-y:auto;padding:6px 0;min-height:0}
    .ed-section-item{display:flex;align-items:center;gap:6px;padding:7px 12px;cursor:pointer;transition:background 0.15s;font-size:12px;color:#475569;font-weight:500}
    .ed-section-item:hover{background:#f8fafc}
    .ed-section-item.active{background:#eff6ff;color:#2563eb}
    .ed-section-dot{width:6px;height:6px;border-radius:50%;background:#cbd5e1;flex-shrink:0}
    .ed-section-item.active .ed-section-dot{background:#2563eb}
   .ed-section-del{background:none;border:none;cursor:pointer;color:#cbd5e1;font-size:14px;padding:0 2px;line-height:1;opacity:0}
.ed-section-reuse{background:none;border:none;cursor:pointer;color:#cbd5e1;font-size:12px;padding:0 2px;line-height:1;opacity:0;margin-left:auto}
.ed-section-item:hover .ed-section-del{opacity:1}
.ed-section-item:hover .ed-section-reuse{opacity:1}
.ed-section-del:hover{color:#ef4444!important}
.ed-section-reuse:hover{color:#2563eb!important}
    .ed-add-section-btn{margin:6px 12px 10px;border:1.5px dashed #cbd5e1;background:transparent;border-radius:7px;padding:7px;color:#94a3b8;font-size:11px;cursor:pointer;width:calc(100% - 24px);transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:5px;flex-shrink:0}
    .ed-add-section-btn:hover{border-color:#2563eb;color:#2563eb;background:#eff6ff}
    .ed-canvas{flex:1;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;align-items:stretch;background:#f8fafc;min-height:0;position:relative}
    .ed-canvas-frame{background:transparent;overflow:visible;transition:width 0.3s ease}
    .ed-canvas-frame.desktop{width:100%}
    .ed-canvas-frame.tablet{width:768px;margin:16px auto;box-shadow:0 0 0 1px #e2e8f0}
    .ed-canvas-frame.mobile{width:390px;margin:16px auto;box-shadow:0 0 0 1px #e2e8f0}
    .ed-section-wrapper{position:relative;cursor:pointer;border:2px solid transparent;transition:border-color 0.15s}
    .ed-section-wrapper:hover{border-color:rgba(37,99,235,0.25)}
    .ed-section-wrapper.active{border-color:#2563eb}
    .ed-section-label-tag{position:absolute;top:-1px;left:-1px;background:#2563eb;color:#fff;font-size:9px;font-weight:700;padding:2px 7px;border-radius:0 0 6px 0;letter-spacing:0.5px;text-transform:uppercase;z-index:5;pointer-events:none}
    .ed-empty-canvas{display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;color:#94a3b8;text-align:center;gap:12px}
    .ed-right{width:280px;flex-shrink:0;background:#fff;border-left:1px solid #e2e8f0;display:flex;flex-direction:column;overflow-y:auto;min-height:0}
    .ed-right-body{flex:1;overflow-y:auto;padding:12px;min-height:0}
    .ctrl-group{margin-bottom:16px}
    .ctrl-label{font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:7px}
    .ctrl-divider{height:1px;background:#f1f5f9;margin:12px 0}
    .ctrl-input{width:100%;padding:6px 9px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;color:#0f172a;outline:none;transition:border 0.15s;background:#fafafa;font-family:inherit}
    .ctrl-input:focus{border-color:#2563eb;background:#fff}
    `}</style>
  );
}
