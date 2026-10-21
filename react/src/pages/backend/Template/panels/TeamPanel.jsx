import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";
import { useState } from "react";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

/* ─── Tab Bar ─────────────────────────────────────────────── */
const TABS = ["Templates", "Layout", "Style", "Members"];
function TabBar({ active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "2px solid #e2e8f0",
        marginBottom: 12,
        gap: 0,
        overflowX: "auto",
      }}
    >
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            flex: 1,
            padding: "8px 4px",
            fontSize: 11,
            fontWeight: active === t ? 700 : 500,
            color: active === t ? "#6366f1" : "#64748b",
            background: "none",
            border: "none",
            borderBottom:
              active === t ? "2px solid #6366f1" : "2px solid transparent",
            marginBottom: -2,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ─── Templates ───────────────────────────────────────────── */
const TEMPLATES = [
  {
    id: "corporate-clean",
    label: "🏢 Corporate Clean",
    thumb: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    patch: {
      bg: "#f8fafc",
      bgType: "solid",
      columns: 4,
      layout: "cards",
      imageShape: "circle",
      imageSize: 88,
      imageEffect: "none",
      cardBg: "#ffffff",
      cardBorderRadius: 16,
      cardPadding: 28,
      cardShadow: true,
      cardBorder: false,
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: false,
      headingColor: "#0f172a",
      subheadingColor: "#64748b",
      nameColor: "#0f172a",
      roleColor: "#6366f1",
      bioColor: "#64748b",
      deptColor: "#94a3b8",
      accentColor: "#6366f1",
      hoverEffect: "lift",
      avatarRingColor: "#e0e7ff",
      animation: { type: "fadeUp" },
    },
  },
  {
    id: "dark-studio",
    label: "🌑 Dark Studio",
    thumb: "linear-gradient(135deg,#0f172a,#1e293b)",
    patch: {
      bg: "#0f172a",
      bgType: "solid",
      columns: 3,
      layout: "cards",
      imageShape: "rounded",
      imageSize: 96,
      imageEffect: "glow",
      cardBg: "#1e293b",
      cardBorderRadius: 20,
      cardPadding: 32,
      cardShadow: false,
      cardBorder: true,
      cardBorderColor: "rgba(99,102,241,0.2)",
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#f1f5f9",
      subheadingColor: "#94a3b8",
      nameColor: "#f1f5f9",
      roleColor: "#818cf8",
      bioColor: "#94a3b8",
      deptColor: "#475569",
      accentColor: "#6366f1",
      hoverEffect: "glow",
      avatarRingColor: "#6366f1",
      animation: { type: "fadeUp" },
    },
  },
  {
    id: "minimal-grid",
    label: "⬜ Minimal Grid",
    thumb: "linear-gradient(135deg,#ffffff,#f1f5f9)",
    patch: {
      bg: "#ffffff",
      bgType: "solid",
      columns: 4,
      layout: "minimal",
      imageShape: "circle",
      imageSize: 72,
      imageEffect: "none",
      cardBg: "transparent",
      cardBorderRadius: 0,
      cardPadding: 20,
      cardShadow: false,
      cardBorder: false,
      showSocials: true,
      showBio: false,
      showDept: false,
      showTag: false,
      headingColor: "#111827",
      subheadingColor: "#6b7280",
      nameColor: "#111827",
      roleColor: "#6b7280",
      bioColor: "#9ca3af",
      accentColor: "#111827",
      hoverEffect: "scale",
      avatarRingColor: "#e5e7eb",
      animation: { type: "fadeUp" },
    },
  },
  {
    id: "gradient-pop",
    label: "🎨 Gradient Pop",
    thumb: "linear-gradient(135deg,#667eea,#764ba2)",
    patch: {
      bg: "#667eea",
      bgType: "gradient",
      bgGradient: { direction: "135deg", from: "#667eea", to: "#764ba2" },
      columns: 3,
      layout: "cards",
      imageShape: "circle",
      imageSize: 96,
      imageEffect: "ring",
      cardBg: "rgba(255,255,255,0.12)",
      cardBorderRadius: 20,
      cardPadding: 32,
      cardShadow: false,
      cardBorder: true,
      cardBorderColor: "rgba(255,255,255,0.2)",
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#fff",
      subheadingColor: "rgba(255,255,255,0.75)",
      nameColor: "#fff",
      roleColor: "rgba(255,255,255,0.85)",
      bioColor: "rgba(255,255,255,0.7)",
      deptColor: "rgba(255,255,255,0.5)",
      accentColor: "#fff",
      hoverEffect: "lift",
      avatarRingColor: "rgba(255,255,255,0.5)",
      animation: { type: "zoomIn" },
    },
  },
  {
    id: "teal-startup",
    label: "🚀 Teal Startup",
    thumb: "linear-gradient(135deg,#f0fdfa,#ccfbf1)",
    patch: {
      bg: "#f0fdfa",
      bgType: "solid",
      columns: 4,
      layout: "cards",
      imageShape: "circle",
      imageSize: 80,
      imageEffect: "float",
      cardBg: "#ffffff",
      cardBorderRadius: 16,
      cardPadding: 24,
      cardShadow: true,
      cardBorder: false,
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#042f2e",
      subheadingColor: "#0f766e",
      nameColor: "#042f2e",
      roleColor: "#0d9488",
      bioColor: "#0f766e",
      deptColor: "#5eead4",
      accentColor: "#0d9488",
      hoverEffect: "lift",
      avatarRingColor: "#99f6e4",
      animation: { type: "slideLeft" },
    },
  },
  {
    id: "neon-dark",
    label: "💜 Neon Dark",
    thumb: "linear-gradient(135deg,#0a0015,#1a003a)",
    patch: {
      bg: "#0a0015",
      bgType: "solid",
      columns: 3,
      layout: "cards",
      imageShape: "circle",
      imageSize: 88,
      imageEffect: "neon",
      cardBg: "#0f0025",
      cardBorderRadius: 18,
      cardPadding: 28,
      cardShadow: false,
      cardBorder: true,
      cardBorderColor: "#a855f740",
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#f3e8ff",
      subheadingColor: "#c084fc",
      nameColor: "#f3e8ff",
      roleColor: "#a855f7",
      bioColor: "#e9d5ff",
      deptColor: "#7c3aed",
      accentColor: "#a855f7",
      hoverEffect: "glow",
      avatarRingColor: "#a855f7",
      neonColor: "#a855f7",
      animation: { type: "fadeUp" },
    },
  },
  {
    id: "warm-agency",
    label: "🔥 Warm Agency",
    thumb: "linear-gradient(135deg,#fff7ed,#ffedd5)",
    patch: {
      bg: "#fff7ed",
      bgType: "solid",
      columns: 4,
      layout: "cards",
      imageShape: "rounded",
      imageSize: 80,
      imageEffect: "none",
      cardBg: "#ffffff",
      cardBorderRadius: 12,
      cardPadding: 24,
      cardShadow: true,
      cardBorder: false,
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#431407",
      subheadingColor: "#9a3412",
      nameColor: "#431407",
      roleColor: "#ea580c",
      bioColor: "#7c2d12",
      deptColor: "#fed7aa",
      accentColor: "#ea580c",
      hoverEffect: "lift",
      avatarRingColor: "#fed7aa",
      animation: { type: "fadeUp" },
    },
  },
  {
    id: "glass-hero",
    label: "🪟 Glass Hero",
    thumb: "linear-gradient(135deg,#1e1b4b,#312e81)",
    patch: {
      bg: "#1e1b4b",
      bgType: "solid",
      columns: 3,
      layout: "spotlight",
      imageShape: "circle",
      imageSize: 120,
      imageEffect: "ring",
      cardBg: "rgba(255,255,255,0.06)",
      cardBorderRadius: 24,
      cardPadding: 36,
      cardShadow: false,
      cardBorder: true,
      cardBorderColor: "rgba(255,255,255,0.12)",
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#ede9fe",
      subheadingColor: "#c4b5fd",
      nameColor: "#ede9fe",
      roleColor: "#a78bfa",
      bioColor: "#c4b5fd",
      deptColor: "#7c3aed",
      accentColor: "#a78bfa",
      hoverEffect: "glow",
      avatarRingColor: "#a78bfa",
      animation: { type: "zoomIn" },
    },
  },
  {
    id: "rose-creative",
    label: "🌸 Rose Creative",
    thumb: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
    patch: {
      bg: "#fff1f2",
      bgType: "solid",
      columns: 4,
      layout: "cards",
      imageShape: "circle",
      imageSize: 88,
      imageEffect: "pulse",
      cardBg: "#ffffff",
      cardBorderRadius: 20,
      cardPadding: 28,
      cardShadow: true,
      cardBorder: false,
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#881337",
      subheadingColor: "#be123c",
      nameColor: "#881337",
      roleColor: "#e11d48",
      bioColor: "#9f1239",
      deptColor: "#fecdd3",
      accentColor: "#e11d48",
      hoverEffect: "lift",
      avatarRingColor: "#fecdd3",
      animation: { type: "fadeUp" },
    },
  },
  {
    id: "horizontal-list",
    label: "📋 Horizontal List",
    thumb: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    patch: {
      bg: "#f8fafc",
      bgType: "solid",
      columns: 1,
      layout: "horizontal",
      imageShape: "circle",
      imageSize: 64,
      imageEffect: "none",
      cardBg: "#ffffff",
      cardBorderRadius: 12,
      cardPadding: 20,
      cardShadow: true,
      cardBorder: false,
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#0f172a",
      subheadingColor: "#64748b",
      nameColor: "#0f172a",
      roleColor: "#6366f1",
      bioColor: "#64748b",
      deptColor: "#94a3b8",
      accentColor: "#6366f1",
      hoverEffect: "lift",
      avatarRingColor: "#e0e7ff",
      animation: { type: "slideLeft" },
    },
  },
  {
    id: "carousel-spotlight",
    label: "🎞️ Carousel Spotlight",
    thumb: "linear-gradient(135deg,#1e1b4b,#4c1d95)",
    patch: {
      bg: "#1e1b4b",
      bgType: "solid",
      layout: "carousel",
      carouselShow: 3,
      cardWidth: 280,
      imageShape: "circle",
      imageSize: 88,
      imageEffect: "ring",
      cardBg: "rgba(255,255,255,0.06)",
      cardBorderRadius: 20,
      cardPadding: 28,
      cardShadow: false,
      cardBorder: true,
      cardBorderColor: "rgba(255,255,255,0.12)",
      showSocials: true,
      showBio: true,
      showDept: true,
      showTag: true,
      headingColor: "#ede9fe",
      subheadingColor: "#c4b5fd",
      nameColor: "#ede9fe",
      roleColor: "#a78bfa",
      bioColor: "#c4b5fd",
      deptColor: "#7c3aed",
      accentColor: "#a78bfa",
      arrowColor: "#a78bfa",
      hoverEffect: "lift",
      avatarRingColor: "#a78bfa",
      animation: { type: "fadeUp" },
    },
  },
  {
    id: "infinite-marquee",
    label: "♾️ Infinite Marquee",
    thumb: "linear-gradient(135deg,#020024,#090979)",
    patch: {
      bg: "#020024",
      bgType: "solid",
      layout: "infinite",
      scrollSpeed: 35,
      cardWidth: 280,
      infiniteMode: "auto-left",
      pauseOnHover: true,
      imageShape: "circle",
      imageSize: 72,
      imageEffect: "none",
      cardBg: "rgba(255,255,255,0.06)",
      cardBorderRadius: 16,
      cardPadding: 22,
      cardShadow: false,
      cardBorder: true,
      cardBorderColor: "rgba(255,255,255,0.12)",
      showSocials: false,
      showBio: true,
      showDept: false,
      showTag: false,
      headingColor: "#e0e7ff",
      subheadingColor: "#818cf8",
      nameColor: "#e0e7ff",
      roleColor: "#818cf8",
      bioColor: "#c7d2fe",
      accentColor: "#818cf8",
      hoverEffect: "none",
      avatarRingColor: "#818cf8",
      animation: { type: "none" },
    },
  },
  {
    id: "infinite-dual-row",
    label: "🔁 Infinite Dual Row",
    thumb: "linear-gradient(135deg,#0c4a6e,#0891b2)",
    patch: {
      bg: "#0c4a6e",
      bgType: "solid",
      layout: "infinite-dual",
      scrollSpeed: 32,
      cardWidth: 260,
      infiniteMode: "auto-left",
      pauseOnHover: true,
      imageShape: "circle",
      imageSize: 64,
      imageEffect: "none",
      cardBg: "rgba(255,255,255,0.07)",
      cardBorderRadius: 16,
      cardPadding: 20,
      cardShadow: false,
      cardBorder: false,
      showSocials: false,
      showBio: true,
      showDept: false,
      showTag: false,
      headingColor: "#e0f2fe",
      subheadingColor: "#7dd3fc",
      nameColor: "#e0f2fe",
      roleColor: "#7dd3fc",
      bioColor: "#bae6fd",
      accentColor: "#38bdf8",
      hoverEffect: "none",
      avatarRingColor: "#38bdf8",
      animation: { type: "none" },
    },
  },
  {
    id: "touch-drag-strip",
    label: "👆 Touch & Drag Strip",
    thumb: "linear-gradient(135deg,#0f172a,#334155)",
    patch: {
      bg: "#0f172a",
      bgType: "solid",
      layout: "infinite",
      infiniteMode: "touch",
      cardWidth: 260,
      cardGap: 20,
      imageShape: "rounded",
      imageSize: 64,
      imageEffect: "none",
      cardBg: "#1e293b",
      cardBorderRadius: 14,
      cardPadding: 20,
      cardShadow: false,
      cardBorder: true,
      cardBorderColor: "rgba(99,102,241,0.2)",
      showSocials: false,
      showBio: true,
      showDept: false,
      showTag: false,
      headingColor: "#f1f5f9",
      subheadingColor: "#94a3b8",
      nameColor: "#f1f5f9",
      roleColor: "#818cf8",
      bioColor: "#94a3b8",
      accentColor: "#6366f1",
      hoverEffect: "none",
      avatarRingColor: "#6366f1",
      animation: { type: "none" },
    },
  },
];

const AVATAR_EFFECTS = [
  { value: "none", label: "None" },
  { value: "ring", label: "Accent Ring" },
  { value: "glow", label: "Glow" },
  { value: "neon", label: "Neon Pulse" },
  { value: "float", label: "Float" },
  { value: "pulse", label: "Pulse Ring" },
  { value: "shine", label: "Shine Overlay" },
  { value: "gradient-ring", label: "Gradient Ring" },
];

const HOVER_EFFECTS = [
  { value: "none", label: "None" },
  { value: "lift", label: "Lift Up" },
  { value: "scale", label: "Scale" },
  { value: "glow", label: "Glow Border" },
  { value: "tilt", label: "3D Tilt" },
  { value: "flip", label: "Flip (bio back)" },
];

const LAYOUTS = [
  { value: "cards", label: "Cards Grid" },
  { value: "minimal", label: "Minimal" },
  { value: "horizontal", label: "Horizontal List" },
  { value: "spotlight", label: "Spotlight (large)" },
  { value: "hexagon", label: "Hexagon Grid" },
  { value: "carousel", label: "Carousel" },
  { value: "infinite", label: "Infinite Scroll →" },
  { value: "infinite-dual", label: "Infinite Dual Row" },
  { value: "infinite-triple", label: "Infinite Triple Row" },
];

export default function TeamPanel({ config: c, onChange }) {
  const [tab, setTab] = useState("Templates");
  const [expandedMember, setExpandedMember] = useState(null);

  const u = (k, v) => onChange({ [k]: v });
  const ub = (k, v) => onChange({ badge: { ...c.badge, [k]: v } });
  const ui = (id, patch) =>
    onChange({
      items: (c.items || []).map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  const uis = (id, platform, url) =>
    onChange({
      items: (c.items || []).map((i) =>
        i.id === id ? { ...i, socials: { ...i.socials, [platform]: url } } : i,
      ),
    });

  const addItem = () =>
    onChange({
      items: [
        ...(c.items || []),
        {
          id: uid(),
          name: "New Member",
          role: "Role, Dept",
          dept: "",
          tag: "",
          avatar: "",
          bio: "Short bio here.",
          description: "",
          socials: { twitter: "", linkedin: "", github: "" },
        },
      ],
    });
  const delItem = (id) =>
    onChange({ items: (c.items || []).filter((i) => i.id !== id) });

  const applyTemplate = (tpl) =>
    onChange({
      ...tpl.patch,
      badge: c.badge,
      heading: c.heading,
      subheading: c.subheading,
      items: c.items,
    });

  const layout = c.layout || "cards";
  const isInfinite =
    layout === "infinite" ||
    layout === "infinite-dual" ||
    layout === "infinite-triple";
  const isCarousel = layout === "carousel";

  return (
    <div className="ed-right-body">
      <TabBar active={tab} onChange={setTab} />

      {/* ══ TEMPLATES ══ */}
      {tab === "Templates" && (
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
            Applies style only — your members are preserved.
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                style={{
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "none",
                  padding: 0,
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 0 0 2px #6366f1")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ height: 40, background: tpl.thumb }} />
                <div
                  style={{
                    padding: "5px 8px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {tpl.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ LAYOUT ══ */}
      {tab === "Layout" && (
        <div>
          <G>
            <L>Layout Variant</L>
            <SelectControl
              value={layout}
              options={LAYOUTS}
              onChange={(v) => u("layout", v)}
            />
            {(layout === "cards" ||
              layout === "minimal" ||
              layout === "hexagon" ||
              !c.layout) && (
              <RangeControl
                label="Columns"
                value={c.columns || 4}
                min={1}
                max={5}
                onChange={(v) => u("columns", v)}
                unit=""
              />
            )}
          </G>
          <D />

          {/* Carousel-specific */}
          {isCarousel && (
            <>
              <G>
                <L>Carousel Settings</L>
                <RangeControl
                  label="Show at once"
                  value={c.carouselShow ?? 1}
                  min={1}
                  max={4}
                  onChange={(v) => u("carouselShow", v)}
                  unit=""
                />
                <RangeControl
                  label="Card Width"
                  value={c.cardWidth || 320}
                  min={200}
                  max={600}
                  onChange={(v) => u("cardWidth", v)}
                  unit="px"
                />
                <ToggleControl
                  label="Autoplay"
                  value={!!c.autoplay}
                  onChange={(v) => u("autoplay", v)}
                />
                {c.autoplay && (
                  <RangeControl
                    label="Delay"
                    value={c.autoplayDelay || 5000}
                    min={1000}
                    max={15000}
                    onChange={(v) => u("autoplayDelay", v)}
                    unit="ms"
                  />
                )}
                <ColorControl
                  label="Arrow / Dot Color"
                  value={c.arrowColor || c.accentColor || "#6366f1"}
                  onChange={(v) => u("arrowColor", v)}
                />
                <ToggleControl
                  label="Custom Arrows"
                  value={!!c.customArrows}
                  onChange={(v) => u("customArrows", v)}
                />
                {c.customArrows && (
                  <>
                    <input
                      className="ctrl-input"
                      value={c.arrowLeft || "‹"}
                      onChange={(e) => u("arrowLeft", e.target.value)}
                      placeholder="Left symbol"
                      style={{ marginBottom: 5 }}
                    />
                    <input
                      className="ctrl-input"
                      value={c.arrowRight || "›"}
                      onChange={(e) => u("arrowRight", e.target.value)}
                      placeholder="Right symbol"
                      style={{ marginBottom: 5 }}
                    />
                  </>
                )}
              </G>
              <D />
            </>
          )}

          {/* Infinite-specific */}
          {isInfinite && (
            <>
              <G>
                <L>Infinite Scroll Settings</L>
                <RangeControl
                  label="Card Width"
                  value={c.cardWidth || 280}
                  min={180}
                  max={500}
                  onChange={(v) => u("cardWidth", v)}
                  unit="px"
                />
                <RangeControl
                  label="Scroll Speed"
                  value={c.scrollSpeed ?? 30}
                  min={8}
                  max={80}
                  onChange={(v) => u("scrollSpeed", v)}
                  unit="s"
                />
                <SelectControl
                  label="Scroll Mode"
                  value={c.infiniteMode || "auto-left"}
                  options={[
                    { value: "auto-left", label: "Auto → Left" },
                    { value: "auto-right", label: "Auto ← Right" },
                    { value: "touch", label: "Touch & Drag" },
                  ]}
                  onChange={(v) => u("infiniteMode", v)}
                />
                {c.infiniteMode !== "touch" && (
                  <ToggleControl
                    label="Pause on Hover"
                    value={c.pauseOnHover !== false}
                    onChange={(v) => u("pauseOnHover", v)}
                  />
                )}
              </G>
              <D />
            </>
          )}

          <G>
            <L>Card</L>
            <ColorControl
              label="Card Background"
              value={c.cardBg || "#f8fafc"}
              onChange={(v) => u("cardBg", v)}
            />
            <RangeControl
              label="Border Radius"
              value={c.cardBorderRadius || 16}
              min={0}
              max={40}
              onChange={(v) => u("cardBorderRadius", v)}
              unit="px"
            />
            <RangeControl
              label="Padding"
              value={c.cardPadding || 28}
              min={8}
              max={60}
              onChange={(v) => u("cardPadding", v)}
              unit="px"
            />
            <ToggleControl
              label="Shadow"
              value={c.cardShadow !== false}
              onChange={(v) => u("cardShadow", v)}
            />
            <ToggleControl
              label="Border"
              value={!!c.cardBorder}
              onChange={(v) => u("cardBorder", v)}
            />
            {c.cardBorder && (
              <ColorControl
                label="Border Color"
                value={c.cardBorderColor || "#e2e8f0"}
                onChange={(v) => u("cardBorderColor", v)}
              />
            )}
          </G>
          <D />

          {!isInfinite && (
            <>
              <G>
                <L>Hover Effect</L>
                <SelectControl
                  value={c.hoverEffect || "lift"}
                  options={HOVER_EFFECTS}
                  onChange={(v) => u("hoverEffect", v)}
                />
                {c.hoverEffect === "glow" && (
                  <ColorControl
                    label="Glow Color"
                    value={c.accentColor || "#6366f1"}
                    onChange={(v) => u("accentColor", v)}
                  />
                )}
              </G>
              <D />
            </>
          )}

          <G>
            <L>Spacing</L>
            <RangeControl
              label="Padding Y"
              value={c.paddingY || 80}
              min={0}
              max={200}
              onChange={(v) => u("paddingY", v)}
              unit="px"
            />
            <RangeControl
              label="Padding X"
              value={c.paddingX || 32}
              min={0}
              max={120}
              onChange={(v) => u("paddingX", v)}
              unit="px"
            />
            <RangeControl
              label="Card Gap"
              value={c.cardGap || 24}
              min={8}
              max={60}
              onChange={(v) => u("cardGap", v)}
              unit="px"
            />
          </G>
          <D />
          <G>
            <L>Visibility</L>
            <ToggleControl
              label="Show Bio"
              value={c.showBio !== false}
              onChange={(v) => u("showBio", v)}
            />
            <ToggleControl
              label="Show Department"
              value={!!c.showDept}
              onChange={(v) => u("showDept", v)}
            />
            <ToggleControl
              label="Show Tag/Label"
              value={!!c.showTag}
              onChange={(v) => u("showTag", v)}
            />
            <ToggleControl
              label="Show Socials"
              value={!!c.showSocials}
              onChange={(v) => u("showSocials", v)}
            />
            <ToggleControl
              label="Show Description"
              value={c.showDescription !== false}
              onChange={(v) => u("showDescription", v)}
            />
          </G>
          <D />
          {!isInfinite && (
            <G>
              <L>Section Entry Animation</L>
              <AnimationControl
                value={c.animation}
                onChange={(v) => u("animation", v)}
              />
            </G>
          )}
          {!isInfinite && !isCarousel && (
            <G>
              <L>Item Entry Animation</L>
              <SelectControl
                value={c.animation?.type || "fadeUp"}
                options={[
                  { value: "none", label: "None" },
                  { value: "fadeUp", label: "Fade Up" },
                  { value: "zoomIn", label: "Zoom In" },
                  { value: "slideLeft", label: "Slide Left" },
                ]}
                onChange={(v) => u("animation", { ...c.animation, type: v })}
              />
            </G>
          )}
        </div>
      )}

      {/* ══ STYLE ══ */}
      {tab === "Style" && (
        <div>
          <G>
            <L>Background</L>
            <BgControl config={c} onChange={onChange} />
          </G>
          <D />
          <G>
            <L>Badge</L>
            <ToggleControl
              label="Show Badge"
              value={!!c.badge?.show}
              onChange={(v) => ub("show", v)}
            />
            {c.badge?.show && (
              <>
                <input
                  className="ctrl-input"
                  value={c.badge.text || ""}
                  onChange={(e) => ub("text", e.target.value)}
                  placeholder="Badge text"
                  style={{ marginBottom: 5 }}
                />
                <ColorControl
                  label="Bg"
                  value={c.badge.bg}
                  onChange={(v) => ub("bg", v)}
                />
                <ColorControl
                  label="Color"
                  value={c.badge.color}
                  onChange={(v) => ub("color", v)}
                />
              </>
            )}
          </G>
          <D />
          <G>
            <L>Heading</L>
            <input
              className="ctrl-input"
              value={c.heading || ""}
              onChange={(e) => u("heading", e.target.value)}
              placeholder="Section heading"
              style={{ marginBottom: 5 }}
            />
            <input
              className="ctrl-input"
              value={c.subheading || ""}
              onChange={(e) => u("subheading", e.target.value)}
              placeholder="Subheading"
              style={{ marginBottom: 5 }}
            />
            <RangeControl
              label="Heading Size"
              value={c.headingSize || 42}
              min={20}
              max={80}
              onChange={(v) => u("headingSize", v)}
              unit="px"
            />
            <ColorControl
              label="Heading Color"
              value={c.headingColor || "#0f172a"}
              onChange={(v) => u("headingColor", v)}
            />
            <ColorControl
              label="Subheading Color"
              value={c.subheadingColor || "#64748b"}
              onChange={(v) => u("subheadingColor", v)}
            />
          </G>
          <D />
          <G>
            <L>Text Colors</L>
            <ColorControl
              label="Name Color"
              value={c.nameColor || "#0f172a"}
              onChange={(v) => u("nameColor", v)}
            />
            <ColorControl
              label="Role Color"
              value={c.roleColor || "#6366f1"}
              onChange={(v) => u("roleColor", v)}
            />
            <ColorControl
              label="Bio Color"
              value={c.bioColor || "#64748b"}
              onChange={(v) => u("bioColor", v)}
            />
            <ColorControl
              label="Dept Color"
              value={c.deptColor || "#94a3b8"}
              onChange={(v) => u("deptColor", v)}
            />
            <ColorControl
              label="Accent Color"
              value={c.accentColor || "#6366f1"}
              onChange={(v) => u("accentColor", v)}
            />
          </G>
          <D />
          <G>
            <L>Avatar</L>
            <SelectControl
              label="Shape"
              value={c.imageShape || "circle"}
              options={[
                { value: "circle", label: "Circle" },
                { value: "rounded", label: "Rounded" },
                { value: "square", label: "Square" },
                { value: "hexagon", label: "Hexagon" },
              ]}
              onChange={(v) => u("imageShape", v)}
            />
            <RangeControl
              label="Size"
              value={c.imageSize || 80}
              min={40}
              max={160}
              onChange={(v) => u("imageSize", v)}
              unit="px"
            />
            <SelectControl
              label="Effect"
              value={c.imageEffect || "none"}
              options={AVATAR_EFFECTS}
              onChange={(v) => u("imageEffect", v)}
            />
            <ColorControl
              label="Ring / Glow Color"
              value={c.avatarRingColor || "#e0e7ff"}
              onChange={(v) => u("avatarRingColor", v)}
            />
            {c.imageEffect === "neon" && (
              <ColorControl
                label="Neon Color"
                value={c.neonColor || "#a855f7"}
                onChange={(v) => u("neonColor", v)}
              />
            )}
            {c.imageEffect === "gradient-ring" && (
              <>
                <ColorControl
                  label="Ring From"
                  value={c.ringFrom || "#6366f1"}
                  onChange={(v) => u("ringFrom", v)}
                />
                <ColorControl
                  label="Ring To"
                  value={c.ringTo || "#ec4899"}
                  onChange={(v) => u("ringTo", v)}
                />
              </>
            )}
            <ColorControl
              label="Fallback Gradient A"
              value={c.avatarFallbackA || "#6366f1"}
              onChange={(v) => u("avatarFallbackA", v)}
            />
            <ColorControl
              label="Fallback Gradient B"
              value={c.avatarFallbackB || "#8b5cf6"}
              onChange={(v) => u("avatarFallbackB", v)}
            />
          </G>
        </div>
      )}

      {/* ══ MEMBERS ══ */}
      {tab === "Members" && (
        <div>
          {/* Quick Presets */}
          <G>
            <L>Quick Presets</L>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {[
                {
                  label: "Tech Team",
                  items: [
                    {
                      name: "Alex Kim",
                      role: "CTO",
                      dept: "Engineering",
                      tag: "Backend",
                      bio: "10 years building scalable systems.",
                      socials: { twitter: "", linkedin: "", github: "" },
                    },
                    {
                      name: "Sara Chen",
                      role: "Lead Designer",
                      dept: "Product",
                      tag: "UX",
                      bio: "Designing for humans, not screens.",
                      socials: {},
                    },
                    {
                      name: "Marco Russo",
                      role: "Head of Data",
                      dept: "Analytics",
                      tag: "ML",
                      bio: "Turning numbers into decisions.",
                      socials: {},
                    },
                    {
                      name: "Priya Nair",
                      role: "Frontend Lead",
                      dept: "Engineering",
                      tag: "React",
                      bio: "Pixel-perfect and performance-obsessed.",
                      socials: {},
                    },
                  ],
                },
                {
                  label: "Agency",
                  items: [
                    {
                      name: "James O'Brien",
                      role: "Creative Director",
                      dept: "Creative",
                      tag: "Brand",
                      bio: "20 years of award-winning campaigns.",
                      socials: {},
                    },
                    {
                      name: "Leila Hassan",
                      role: "Strategy Lead",
                      dept: "Strategy",
                      tag: "Growth",
                      bio: "Data-driven storyteller.",
                      socials: {},
                    },
                    {
                      name: "Tom Chen",
                      role: "Art Director",
                      dept: "Creative",
                      tag: "Visual",
                      bio: "Where art meets conversion.",
                      socials: {},
                    },
                  ],
                },
                {
                  label: "Startup",
                  items: [
                    {
                      name: "Maya Torres",
                      role: "CEO & Founder",
                      dept: "Leadership",
                      tag: "Vision",
                      bio: "Building the future of work.",
                      socials: {},
                    },
                    {
                      name: "Raj Patel",
                      role: "COO",
                      dept: "Operations",
                      tag: "Scale",
                      bio: "Systems thinker, people leader.",
                      socials: {},
                    },
                    {
                      name: "Lisa Wu",
                      role: "Head of Growth",
                      dept: "Marketing",
                      tag: "GTM",
                      bio: "0 to 1M users, twice.",
                      socials: {},
                    },
                  ],
                },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    onChange({
                      items: preset.items.map((it) => ({
                        ...it,
                        id: uid(),
                        avatar: "",
                        description: "",
                      })),
                    })
                  }
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 20,
                    background: "#fff",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </G>
          <D />

          {/* Member list */}
          {(c.items || []).map((member, i) => {
            const isOpen = expandedMember === member.id;
            return (
              <div
                key={member.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  marginBottom: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: isOpen ? "#f1f5f9" : "transparent",
                  }}
                  onClick={() => setExpandedMember(isOpen ? null : member.id)}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                  >
                    #{i + 1} {member.name}
                  </span>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        delItem(member.id);
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        color: "#cbd5e1",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      ×
                    </button>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: 10 }}>
                    <ImageUpload
                      label="Photo"
                      value={member.avatar}
                      onChange={(v) => ui(member.id, { avatar: v })}
                      height={80}
                    />
                    <input
                      className="ctrl-input"
                      value={member.name || ""}
                      onChange={(e) => ui(member.id, { name: e.target.value })}
                      placeholder="Full Name"
                      style={{ marginBottom: 4 }}
                    />
                    <input
                      className="ctrl-input"
                      value={member.role || ""}
                      onChange={(e) => ui(member.id, { role: e.target.value })}
                      placeholder="Role / Title"
                      style={{ marginBottom: 4 }}
                    />
                    <input
                      className="ctrl-input"
                      value={member.dept || ""}
                      onChange={(e) => ui(member.id, { dept: e.target.value })}
                      placeholder="Department (e.g. Engineering)"
                      style={{ marginBottom: 4 }}
                    />
                    <input
                      className="ctrl-input"
                      value={member.tag || ""}
                      onChange={(e) => ui(member.id, { tag: e.target.value })}
                      placeholder="Tag / Label (e.g. Frontend, Growth)"
                      style={{ marginBottom: 4 }}
                    />
                    <textarea
                      className="ctrl-input"
                      rows={2}
                      value={member.bio || ""}
                      onChange={(e) => ui(member.id, { bio: e.target.value })}
                      placeholder="Short bio"
                      style={{ resize: "vertical", marginBottom: 4 }}
                    />
                    <textarea
                      className="ctrl-input"
                      rows={2}
                      value={member.description || ""}
                      onChange={(e) =>
                        ui(member.id, { description: e.target.value })
                      }
                      placeholder="Longer description (shown on hover/flip)"
                      style={{ resize: "vertical", marginBottom: 4 }}
                    />

                    {/* Per-member avatar override */}
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        marginBottom: 4,
                        letterSpacing: "0.5px",
                      }}
                    >
                      AVATAR OVERRIDE
                    </div>
                    <ColorControl
                      label="Ring Color"
                      value={member.ringColor || ""}
                      onChange={(v) => ui(member.id, { ringColor: v })}
                    />

                    {c.showSocials && (
                      <>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#94a3b8",
                            marginBottom: 4,
                            letterSpacing: "0.5px",
                            marginTop: 6,
                          }}
                        >
                          SOCIALS
                        </div>
                        <input
                          className="ctrl-input"
                          value={member.socials?.twitter || ""}
                          onChange={(e) =>
                            uis(member.id, "twitter", e.target.value)
                          }
                          placeholder="Twitter URL"
                          style={{ marginBottom: 4 }}
                        />
                        <input
                          className="ctrl-input"
                          value={member.socials?.linkedin || ""}
                          onChange={(e) =>
                            uis(member.id, "linkedin", e.target.value)
                          }
                          placeholder="LinkedIn URL"
                          style={{ marginBottom: 4 }}
                        />
                        <input
                          className="ctrl-input"
                          value={member.socials?.github || ""}
                          onChange={(e) =>
                            uis(member.id, "github", e.target.value)
                          }
                          placeholder="GitHub URL"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={addItem}
            style={{
              width: "100%",
              border: "1.5px dashed #cbd5e1",
              background: "transparent",
              borderRadius: 8,
              padding: 8,
              color: "#94a3b8",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            + Add Member
          </button>
        </div>
      )}
    </div>
  );
}
