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

const Sel = ({ label, value, options, onChange }) => (
  <div
    className="ctrl-row"
    style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
  >
    <span
      style={{ fontSize: 12, color: "#374151", flexShrink: 0, minWidth: 80 }}
    >
      {label}
    </span>
    <select
      className="ctrl-select"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        flex: 1,
        padding: "4px 8px",
        borderRadius: 6,
        border: "1px solid #e2e8f0",
        fontSize: 12,
      }}
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  </div>
);

/* ─── Tabs ─────────────────────────────────────────────────── */
const TABS = ["Layout", "Cards", "Content", "Style", "Items"];

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

/* ─── Prebuilt Templates ───────────────────────────────────── */
const TEMPLATES = [
  {
    id: "aurora_glass",
    label: "🌌 Aurora Glass",
    thumb: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
    patch: {
      bg: "#0f0c29",
      bgType: "solid",
      bgAnimation: "aurora",
      animSpeed: 0.7,
      variant: "carousel",
      carouselShow: 1,
      cardLayout: "bottom-name",
      cardEffect: "glass",
      cardBorderRadius: 20,
      shadow: false,
      cardBg: "rgba(255,255,255,0.08)",
      cardGap: 24,
      cardWidth: 600,
      cardPadding: 36,
      headingColor: "#e2e8f0",
      subheadingColor: "#94a3b8",
      bodyColor: "#cbd5e1",
      nameColor: "#f1f5f9",
      roleColor: "#94a3b8",
      starColor: "#fbbf24",
      quoteColor: "#818cf8",
      showQuoteIcon: true,
      itemAnimation: "fadeUp",
      arrowColor: "#818cf8",
      avatarBorderColor: "#818cf8",
    },
  },
  {
    id: "neon_grid",
    label: "💜 Neon Grid",
    thumb: "linear-gradient(135deg,#0a0015,#1a003a)",
    patch: {
      bg: "#0a0015",
      bgType: "solid",
      bgAnimation: "particles",
      particleColor: "#a855f7",
      particleCount: 50,
      particleConnect: true,
      animSpeed: 0.8,
      variant: "grid",
      columns: 3,
      cardLayout: "standard",
      cardEffect: "neon",
      neonColor: "#a855f7",
      cardBg: "#0f0025",
      cardBorderRadius: 16,
      shadow: false,
      cardBorder: true,
      cardBorderColor: "#a855f740",
      cardGap: 20,
      cardPadding: 24,
      headingColor: "#f3e8ff",
      subheadingColor: "#c084fc",
      bodyColor: "#e9d5ff",
      nameColor: "#f3e8ff",
      roleColor: "#a855f7",
      starColor: "#f59e0b",
      quoteColor: "#a855f7",
      showQuoteIcon: true,
      itemAnimation: "fadeUp",
      avatarFallbackA: "#7c3aed",
      avatarFallbackB: "#a855f7",
      avatarBorderColor: "#a855f7",
    },
  },
  {
    id: "ocean_infinite",
    label: "🌊 Ocean Infinite",
    thumb: "linear-gradient(135deg,#0c4a6e,#0369a1,#0891b2)",
    patch: {
      bg: "#0c4a6e",
      bgType: "solid",
      bgAnimation: "waves",
      waveColor: "rgba(56,189,248,0.12)",
      waveCount: 4,
      animSpeed: 0.5,
      variant: "infinite-dual",
      scrollSpeed: 35,
      cardWidth: 340,
      cardLayout: "bottom-name",
      cardEffect: "glass",
      cardBorderRadius: 18,
      shadow: false,
      cardBg: "rgba(255,255,255,0.07)",
      cardGap: 20,
      cardPadding: 24,
      headingColor: "#e0f2fe",
      subheadingColor: "#7dd3fc",
      bodyColor: "#bae6fd",
      nameColor: "#e0f2fe",
      roleColor: "#7dd3fc",
      starColor: "#fbbf24",
      quoteColor: "#38bdf8",
      showQuoteIcon: true,
      avatarFallbackA: "#0369a1",
      avatarFallbackB: "#0891b2",
      avatarBorderColor: "#38bdf8",
    },
  },
  {
    id: "minimal_white",
    label: "☀️ Minimal White",
    thumb: "linear-gradient(135deg,#ffffff,#f8fafc)",
    patch: {
      bg: "#ffffff",
      bgType: "solid",
      bgAnimation: "none",
      variant: "grid",
      columns: 3,
      cardLayout: "minimal",
      cardEffect: "flat",
      shadow: true,
      cardBg: "#f8fafc",
      cardBorderRadius: 12,
      cardBorder: true,
      cardBorderColor: "#e2e8f0",
      cardGap: 20,
      cardPadding: 24,
      headingColor: "#0f172a",
      subheadingColor: "#64748b",
      bodyColor: "#374151",
      nameColor: "#0f172a",
      roleColor: "#64748b",
      starColor: "#f59e0b",
      quoteColor: "#6366f1",
      showQuoteIcon: false,
      itemAnimation: "fadeUp",
      avatarFallbackA: "#6366f1",
      avatarFallbackB: "#8b5cf6",
    },
  },
  {
    id: "plasma_masonry",
    label: "🔥 Plasma Masonry",
    thumb: "linear-gradient(135deg,#1a0533,#6b21a8,#db2777)",
    patch: {
      bg: "#1a0533",
      bgType: "solid",
      bgAnimation: "plasma",
      animSpeed: 1.2,
      variant: "masonry",
      columns: 3,
      cardLayout: "image-top",
      cardEffect: "glass",
      cardBorderRadius: 20,
      shadow: false,
      cardBg: "rgba(255,255,255,0.06)",
      cardGap: 20,
      cardPadding: 24,
      headingColor: "#fce7f3",
      subheadingColor: "#f9a8d4",
      bodyColor: "#fce7f3",
      nameColor: "#fff",
      roleColor: "#f9a8d4",
      starColor: "#fb7185",
      quoteColor: "#f472b6",
      showQuoteIcon: true,
      itemAnimation: "zoomIn",
      avatarFallbackA: "#be185d",
      avatarFallbackB: "#9d174d",
      avatarBorderColor: "#f472b6",
    },
  },
  {
    id: "magazine_dark",
    label: "📰 Magazine Dark",
    thumb: "linear-gradient(135deg,#0f172a,#1e293b)",
    patch: {
      bg: "#0f172a",
      bgType: "solid",
      bgAnimation: "none",
      variant: "grid",
      columns: 2,
      cardLayout: "magazine",
      cardEffect: "dark",
      cardBorderRadius: 14,
      shadow: true,
      cardBg: "#1e293b",
      cardGap: 24,
      cardPadding: 0,
      headingColor: "#f1f5f9",
      subheadingColor: "#94a3b8",
      bodyColor: "#cbd5e1",
      nameColor: "#f1f5f9",
      roleColor: "#64748b",
      starColor: "#fbbf24",
      quoteColor: "#6366f1",
      showQuoteIcon: true,
      itemAnimation: "slide",
      avatarFallbackA: "#334155",
      avatarFallbackB: "#475569",
    },
  },
  {
    id: "starfield_carousel",
    label: "🌠 Starfield Carousel",
    thumb: "linear-gradient(135deg,#020024,#090979,#00d4ff)",
    patch: {
      bg: "#020024",
      bgType: "solid",
      bgAnimation: "stars",
      particleCount: 140,
      particleColor: "#ffffff",
      animSpeed: 1.0,
      variant: "carousel",
      carouselShow: 3,
      cardWidth: 320,
      cardLayout: "bottom-name",
      cardEffect: "glass",
      cardBorderRadius: 16,
      shadow: false,
      cardBg: "rgba(255,255,255,0.06)",
      cardGap: 20,
      cardPadding: 24,
      headingColor: "#e0e7ff",
      subheadingColor: "#818cf8",
      bodyColor: "#c7d2fe",
      nameColor: "#e0e7ff",
      roleColor: "#818cf8",
      starColor: "#fbbf24",
      quoteColor: "#818cf8",
      showQuoteIcon: true,
      itemAnimation: "flipY",
      arrowColor: "#818cf8",
      avatarFallbackA: "#3730a3",
      avatarFallbackB: "#4f46e5",
      avatarBorderColor: "#818cf8",
    },
  },
  {
    id: "holographic_inline",
    label: "🌈 Holographic",
    thumb: "linear-gradient(135deg,#000428,#004e92)",
    patch: {
      bg: "#000428",
      bgType: "solid",
      bgAnimation: "holographic",
      animSpeed: 0.9,
      variant: "infinite",
      scrollSpeed: 28,
      cardWidth: 360,
      cardLayout: "inline",
      cardEffect: "glass",
      cardBorderRadius: 14,
      shadow: false,
      cardBg: "rgba(255,255,255,0.06)",
      cardGap: 20,
      cardPadding: 24,
      headingColor: "#ffffff",
      subheadingColor: "#a5b4fc",
      bodyColor: "#e0e7ff",
      nameColor: "#fff",
      roleColor: "#a5b4fc",
      starColor: "#fbbf24",
      showQuoteIcon: false,
      avatarBorderColor: "#a5b4fc",
    },
  },
  {
    id: "morphic_3d",
    label: "🔮 Morphic 3D",
    thumb: "linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)",
    patch: {
      bg: "#1e1b4b",
      bgType: "solid",
      bgAnimation: "morphic",
      animSpeed: 0.6,
      variant: "grid",
      columns: 3,
      cardLayout: "bottom-name",
      cardEffect: "3d",
      cardBorderRadius: 18,
      shadow: true,
      cardBg: "#2e2a6e",
      cardGap: 24,
      cardPadding: 28,
      headingColor: "#ede9fe",
      subheadingColor: "#c4b5fd",
      bodyColor: "#ddd6fe",
      nameColor: "#ede9fe",
      roleColor: "#c4b5fd",
      starColor: "#fbbf24",
      quoteColor: "#a78bfa",
      showQuoteIcon: true,
      itemAnimation: "flipY",
      floatCards: true,
      avatarFallbackA: "#5b21b6",
      avatarFallbackB: "#7c3aed",
      avatarBorderColor: "#a78bfa",
    },
  },
  {
    id: "bubbles_triple",
    label: "🫧 Bubbles Triple",
    thumb: "linear-gradient(135deg,#06001a,#1a0050)",
    patch: {
      bg: "#06001a",
      bgType: "solid",
      bgAnimation: "bubbles",
      animSpeed: 0.7,
      variant: "infinite-triple",
      scrollSpeed: 32,
      cardWidth: 320,
      cardLayout: "minimal",
      cardEffect: "glass",
      cardBorderRadius: 16,
      shadow: false,
      cardBg: "rgba(255,255,255,0.05)",
      cardGap: 20,
      cardPadding: 24,
      headingColor: "#f0e6ff",
      subheadingColor: "#c084fc",
      bodyColor: "#e9d5ff",
      nameColor: "#f0e6ff",
      roleColor: "#a855f7",
      starColor: "#f59e0b",
      showQuoteIcon: false,
      avatarFallbackA: "#4a1d96",
      avatarFallbackB: "#6d28d9",
    },
  },
  {
    id: "gradient_flow",
    label: "🎨 Gradient Flow",
    thumb: "linear-gradient(270deg,#667eea,#764ba2,#f093fb)",
    patch: {
      bgType: "gradient",
      bgGradient: {
        from: "#667eea",
        to: "#f093fb",
        mid: "#764ba2",
        direction: "to right",
      },
      bgAnimation: "gradientShift",
      animSpeed: 1.0,
      variant: "carousel",
      carouselShow: 1,
      cardWidth: 640,
      cardLayout: "bottom-name",
      cardEffect: "glass",
      cardBorderRadius: 24,
      shadow: false,
      cardBg: "rgba(255,255,255,0.12)",
      cardGap: 24,
      cardPadding: 40,
      headingColor: "#ffffff",
      subheadingColor: "rgba(255,255,255,0.8)",
      bodyColor: "rgba(255,255,255,0.9)",
      nameColor: "#ffffff",
      roleColor: "rgba(255,255,255,0.7)",
      starColor: "#fbbf24",
      quoteColor: "rgba(255,255,255,0.4)",
      showQuoteIcon: true,
      itemAnimation: "zoomIn",
      arrowColor: "#ffffff",
      avatarBorderColor: "rgba(255,255,255,0.4)",
    },
  },
  {
    id: "clean_saas",
    label: "💼 Clean SaaS",
    thumb: "linear-gradient(135deg,#eff6ff,#eef2ff)",
    patch: {
      bg: "#eff6ff",
      bgType: "solid",
      bgAnimation: "none",
      variant: "grid",
      columns: 3,
      cardLayout: "standard",
      cardEffect: "flat",
      shadow: true,
      cardBg: "#ffffff",
      cardBorderRadius: 16,
      cardBorder: false,
      cardGap: 24,
      cardPadding: 28,
      headingColor: "#1e3a5f",
      subheadingColor: "#475569",
      bodyColor: "#374151",
      nameColor: "#1e3a5f",
      roleColor: "#6366f1",
      starColor: "#f59e0b",
      quoteColor: "#e0e7ff",
      showQuoteIcon: true,
      itemAnimation: "fadeUp",
      avatarFallbackA: "#2563eb",
      avatarFallbackB: "#6366f1",
      avatarBorderColor: "#e0e7ff",
    },
  },
];

const DEFAULT_ITEMS = [
  {
    id: uid(),
    name: "Sarah Johnson",
    role: "CEO, Acme Corp",
    rating: 5,
    avatar: "",
    body: "Absolutely transformed how our team works. The results exceeded every expectation we had going in.",
    bg: "",
  },
  {
    id: uid(),
    name: "Marcus Lee",
    role: "Product Lead, TechStart",
    rating: 5,
    avatar: "",
    body: "The attention to detail is remarkable. I've tried many solutions but this one just clicks perfectly.",
    bg: "",
  },
  {
    id: uid(),
    name: "Priya Patel",
    role: "Founder, GrowthLab",
    rating: 5,
    avatar: "",
    body: "From day one the experience has been seamless. Our conversion rate went up 3x in the first month.",
    bg: "",
  },
];

export default function TestimonialsPanel({ config: c, onChange }) {
  const [tab, setTab] = useState("Layout");
  const u = (k, v) => onChange({ [k]: v });
  const ub = (k, v) => onChange({ badge: { ...c.badge, [k]: v } });
  const ui = (id, patch) =>
    onChange({
      items: (c.items || []).map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  const addItem = () =>
    onChange({
      items: [
        ...(c.items || []),
        {
          id: uid(),
          name: "New Person",
          role: "Role, Company",
          avatar: "",
          rating: 5,
          body: "Add testimonial text here.",
          bg: "",
        },
      ],
    });
  const delItem = (id) =>
    onChange({ items: (c.items || []).filter((i) => i.id !== id) });
  const applyTemplate = (tpl) => {
    const items = c.items?.length ? c.items : DEFAULT_ITEMS;
    onChange({ ...tpl.patch, items });
  };

  const v = c.variant || "carousel";
  const bgAnim = c.bgAnimation || "none";
  const isInfinite =
    v === "infinite" || v === "infinite-dual" || v === "infinite-triple";
  const isCarousel = v === "carousel" || v === "single";

  return (
    <div className="ed-right-body">
      <TabBar active={tab} onChange={setTab} />

      {/* ══════════════════════════════════════════
          TAB 1 — LAYOUT
      ══════════════════════════════════════════ */}
      {tab === "Layout" && (
        <>
          {/* Templates */}
          <G>
            <L>Prebuilt Templates</L>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 6,
              }}
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
                    transition: "box-shadow .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "0 0 0 2px #6366f1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div style={{ height: 36, background: tpl.thumb }} />
                  <div
                    style={{
                      padding: "4px 8px",
                      fontSize: 11,
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    {tpl.label}
                  </div>
                </button>
              ))}
            </div>
          </G>
          <D />

          {/* Variant */}
          <G>
            <L>Variant</L>
            <Sel
              label="Type"
              value={v}
              onChange={(val) => u("variant", val)}
              options={[
                ["carousel", "Carousel"],
                ["grid", "Grid"],
                ["masonry", "Masonry"],
                ["single", "Single (focused)"],
                ["infinite", "Infinite Scroll →"],
                ["infinite-dual", "Infinite Dual Row"],
                ["infinite-triple", "Infinite Triple Row"],
              ]}
            />

            {(v === "grid" || v === "masonry") && (
              <RangeControl
                label="Columns"
                value={c.columns || 3}
                min={1}
                max={4}
                onChange={(val) => u("columns", val)}
                unit=""
              />
            )}

            {isCarousel && (
              <RangeControl
                label="Show at once"
                value={c.carouselShow ?? 1}
                min={1}
                max={4}
                onChange={(val) => u("carouselShow", val)}
                unit=""
              />
            )}

            {isInfinite && (
              <>
                <RangeControl
                  label="Scroll Speed"
                  value={c.scrollSpeed ?? 30}
                  min={8}
                  max={80}
                  onChange={(val) => u("scrollSpeed", val)}
                  unit="s"
                />
                <Sel
                  label="Scroll Mode"
                  value={c.infiniteMode || "auto-left"}
                  onChange={(val) => u("infiniteMode", val)}
                  options={[
                    ["auto-left", "Auto → Left"],
                    ["auto-right", "Auto ← Right"],
                    ["touch", "Touch & Drag"],
                  ]}
                />
                <ToggleControl
                  label="Pause on Hover"
                  value={c.pauseOnHover !== false}
                  onChange={(val) => u("pauseOnHover", val)}
                />
              </>
            )}
          </G>
          <D />

          {/* Sizing */}
          <G>
            <L>Sizing & Spacing</L>
            <RangeControl
              label="Card Width"
              value={c.cardWidth || 340}
              min={240}
              max={700}
              onChange={(val) => u("cardWidth", val)}
              unit="px"
            />
            <RangeControl
              label="Card Gap"
              value={c.cardGap ?? 20}
              min={8}
              max={60}
              onChange={(val) => u("cardGap", val)}
              unit="px"
            />
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
          </G>
          <D />

          {/* Carousel controls */}
          {isCarousel && (
            <>
              <G>
                <L>Carousel Controls</L>
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
                  value={c.arrowColor || "#6366f1"}
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

          {/* Section animation */}
          <G>
            <L>Section Entry Animation</L>
            <AnimationControl
              value={c.animation}
              onChange={(v) => u("animation", v)}
            />
          </G>
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB 2 — CARDS
      ══════════════════════════════════════════ */}
      {tab === "Cards" && (
        <>
          <G>
            <L>Card Layout</L>
            <Sel
              label="Orientation"
              value={c.cardLayout || "standard"}
              onChange={(val) => u("cardLayout", val)}
              options={[
                ["standard", "Standard"],
                ["bottom-name", "Quote top, name bottom"],
                ["image-top", "Image top, text below"],
                ["inline", "Inline (avatar left)"],
                ["minimal", "Minimal"],
                ["magazine", "Magazine"],
              ]}
            />
            <Sel
              label="Card Effect"
              value={c.cardEffect || "flat"}
              onChange={(val) => u("cardEffect", val)}
              options={[
                ["flat", "Flat / Shadow"],
                ["glass", "Glassmorphism"],
                ["dark", "Dark Card"],
                ["3d", "3D Tilt Hover"],
                ["neon", "Neon Glow"],
              ]}
            />
            {c.cardEffect === "neon" && (
              <ColorControl
                label="Neon Color"
                value={c.neonColor || "#6366f1"}
                onChange={(val) => u("neonColor", val)}
              />
            )}
          </G>
          <D />

          <G>
            <L>Card Appearance</L>
            <ColorControl
              label="Background"
              value={c.cardBg || "#ffffff"}
              onChange={(val) => u("cardBg", val)}
            />
            <RangeControl
              label="Radius"
              value={c.cardBorderRadius || 16}
              min={0}
              max={40}
              onChange={(val) => u("cardBorderRadius", val)}
              unit="px"
            />
            <RangeControl
              label="Padding"
              value={c.cardPadding || 28}
              min={12}
              max={60}
              onChange={(val) => u("cardPadding", val)}
              unit="px"
            />
            <ToggleControl
              label="Shadow"
              value={c.shadow !== false}
              onChange={(val) => u("shadow", val)}
            />
            <ToggleControl
              label="Border"
              value={!!c.cardBorder}
              onChange={(val) => u("cardBorder", val)}
            />
            {c.cardBorder && (
              <ColorControl
                label="Border Color"
                value={c.cardBorderColor || "rgba(99,102,241,0.2)"}
                onChange={(val) => u("cardBorderColor", val)}
              />
            )}
            <ToggleControl
              label="Float Animation"
              value={!!c.floatCards}
              onChange={(val) => u("floatCards", val)}
            />
          </G>
          <D />

          <G>
            <L>Item Entry Animation</L>
            <Sel
              label="Animation"
              value={c.itemAnimation || "fadeUp"}
              onChange={(val) => u("itemAnimation", val)}
              options={[
                ["none", "None"],
                ["fadeUp", "Fade Up"],
                ["zoomIn", "Zoom In"],
                ["flipY", "Flip Y (3D)"],
                ["slide", "Slide Left"],
              ]}
            />
          </G>
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB 3 — CONTENT
      ══════════════════════════════════════════ */}
      {tab === "Content" && (
        <>
          {/* Badge */}
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
                  label="Background"
                  value={c.badge.bg || "#ede9fe"}
                  onChange={(v) => ub("bg", v)}
                />
                <ColorControl
                  label="Text"
                  value={c.badge.color || "#6d28d9"}
                  onChange={(v) => ub("color", v)}
                />
              </>
            )}
          </G>
          <D />

          {/* Heading */}
          <G>
            <L>Heading</L>
            <input
              className="ctrl-input"
              value={c.heading || ""}
              onChange={(e) => u("heading", e.target.value)}
              placeholder="Heading"
              style={{ marginBottom: 5 }}
            />
            <RangeControl
              label="Size"
              value={c.headingSize || 42}
              min={20}
              max={80}
              onChange={(v) => u("headingSize", v)}
              unit="px"
            />
            <ColorControl
              label="Color"
              value={c.headingColor || "#0f172a"}
              onChange={(v) => u("headingColor", v)}
            />
            <Sel
              label="Align"
              value={c.headingAlign || "center"}
              onChange={(val) => u("headingAlign", val)}
              options={[
                ["center", "Center"],
                ["left", "Left"],
                ["right", "Right"],
              ]}
            />
          </G>
          <D />

          {/* Subheading */}
          <G>
            <L>Subheading</L>
            <input
              className="ctrl-input"
              value={c.subheading || ""}
              onChange={(e) => u("subheading", e.target.value)}
              placeholder="Subheading"
              style={{ marginBottom: 5 }}
            />
            <ColorControl
              label="Color"
              value={c.subheadingColor || "#64748b"}
              onChange={(v) => u("subheadingColor", v)}
            />
          </G>
          <D />

          {/* Rating */}
          <G>
            <L>Rating</L>
            <ToggleControl
              label="Show Rating"
              value={!!c.showRating}
              onChange={(v) => u("showRating", v)}
            />
            {c.showRating && (
              <>
                <ColorControl
                  label="Star Color"
                  value={c.starColor || "#f59e0b"}
                  onChange={(v) => u("starColor", v)}
                />
                <RangeControl
                  label="Star Size"
                  value={c.starSize || 16}
                  min={10}
                  max={28}
                  onChange={(v) => u("starSize", v)}
                  unit="px"
                />
              </>
            )}
          </G>
          <D />

          {/* Quote */}
          <G>
            <L>Quote Icon</L>
            <ToggleControl
              label="Show Quote Icon"
              value={c.showQuoteIcon !== false}
              onChange={(v) => u("showQuoteIcon", v)}
            />
            {c.showQuoteIcon !== false && (
              <ColorControl
                label="Quote Color"
                value={c.quoteColor || "#6366f1"}
                onChange={(v) => u("quoteColor", v)}
              />
            )}
          </G>
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB 4 — STYLE
      ══════════════════════════════════════════ */}
      {tab === "Style" && (
        <>
          {/* Background */}
          <G>
            <L>Background</L>
            <BgControl config={c} onChange={onChange} />
          </G>
          <D />

          {/* Background Animation */}
          <G>
            <L>Background Animation</L>
            <Sel
              label="Effect"
              value={bgAnim}
              onChange={(val) => u("bgAnimation", val)}
              options={[
                ["none", "None"],
                ["gradientShift", "Gradient Shift"],
                ["particles", "Particles / Constellation"],
                ["waves", "Ocean Waves"],
                ["stars", "Starfield / Hyperspace"],
                ["aurora", "Shader — Aurora"],
                ["holographic", "Shader — Holographic"],
                ["plasma", "Shader — Plasma"],
                ["morphic", "Shader — Morphic Blob"],
                ["bubbles", "Shader — Bubbles"],
              ]}
            />
            {bgAnim !== "none" && (
              <RangeControl
                label="Speed"
                value={c.animSpeed ?? 1}
                min={0.1}
                max={5}
                step={0.1}
                onChange={(val) => u("animSpeed", val)}
                unit="x"
              />
            )}
            {bgAnim === "particles" && (
              <>
                <RangeControl
                  label="Count"
                  value={c.particleCount ?? 55}
                  min={10}
                  max={300}
                  onChange={(val) => u("particleCount", val)}
                />
                <ColorControl
                  label="Color"
                  value={c.particleColor || "rgba(99,102,241,0.6)"}
                  onChange={(val) => u("particleColor", val)}
                />
                <ToggleControl
                  label="Connect Lines"
                  value={c.particleConnect !== false}
                  onChange={(val) => u("particleConnect", val)}
                />
                {c.particleConnect !== false && (
                  <RangeControl
                    label="Connect Dist"
                    value={c.connectDist ?? 130}
                    min={40}
                    max={300}
                    onChange={(val) => u("connectDist", val)}
                    unit="px"
                  />
                )}
              </>
            )}
            {bgAnim === "waves" && (
              <>
                <RangeControl
                  label="Wave Layers"
                  value={c.waveCount ?? 3}
                  min={1}
                  max={8}
                  onChange={(val) => u("waveCount", val)}
                />
                <ColorControl
                  label="Wave Color"
                  value={c.waveColor || "rgba(99,102,241,0.1)"}
                  onChange={(val) => u("waveColor", val)}
                />
              </>
            )}
            {bgAnim === "stars" && (
              <>
                <RangeControl
                  label="Star Count"
                  value={c.particleCount ?? 100}
                  min={20}
                  max={400}
                  onChange={(val) => u("particleCount", val)}
                />
                <ColorControl
                  label="Color"
                  value={c.particleColor || "#ffffff"}
                  onChange={(val) => u("particleColor", val)}
                />
              </>
            )}
          </G>
          <D />

          {/* Text Colors */}
          <G>
            <L>Text Colors</L>
            <ColorControl
              label="Body Text"
              value={c.bodyColor || "#374151"}
              onChange={(v) => u("bodyColor", v)}
            />
            <RangeControl
              label="Body Size"
              value={c.bodySize || 15}
              min={12}
              max={22}
              onChange={(v) => u("bodySize", v)}
              unit="px"
            />
            <ColorControl
              label="Name"
              value={c.nameColor || "#0f172a"}
              onChange={(v) => u("nameColor", v)}
            />
            <ColorControl
              label="Role"
              value={c.roleColor || "#64748b"}
              onChange={(v) => u("roleColor", v)}
            />
          </G>
          <D />

          {/* Avatar */}
          <G>
            <L>Avatar</L>
            <RangeControl
              label="Size"
              value={c.avatarSize || 56}
              min={32}
              max={100}
              onChange={(v) => u("avatarSize", v)}
              unit="px"
            />
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>
                Shape
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { val: "circle", label: "●", title: "Circle", radius: "50%" },
                  {
                    val: "rounded",
                    label: "▪",
                    title: "Rounded",
                    radius: "12px",
                  },
                  { val: "square", label: "■", title: "Square", radius: "0px" },
                ].map((s) => (
                  <button
                    key={s.val}
                    title={s.title}
                    onClick={() => u("avatarShape", s.val)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: s.radius,
                      background:
                        (c.avatarShape || "circle") === s.val
                          ? "#6366f1"
                          : "#e2e8f0",
                      color:
                        (c.avatarShape || "circle") === s.val
                          ? "#fff"
                          : "#64748b",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <ColorControl
              label="Border Color"
              value={c.avatarBorderColor || "#e2e8f0"}
              onChange={(v) => u("avatarBorderColor", v)}
            />
            <ColorControl
              label="Fallback A"
              value={c.avatarFallbackA || "#6366f1"}
              onChange={(v) => u("avatarFallbackA", v)}
            />
            <ColorControl
              label="Fallback B"
              value={c.avatarFallbackB || "#8b5cf6"}
              onChange={(v) => u("avatarFallbackB", v)}
            />
          </G>
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB 5 — ITEMS
      ══════════════════════════════════════════ */}
      {tab === "Items" && (
        <>
          <G>
            <L>Testimonial Items</L>

            {/* Quick presets */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
                Quick presets:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  {
                    label: "SaaS",
                    items: [
                      {
                        name: "Alex Kim",
                        role: "CTO, NexaCloud",
                        rating: 5,
                        body: "Shipped our MVP 3x faster. The dev experience is unmatched.",
                      },
                      {
                        name: "Priya Patel",
                        role: "Founder, DataPulse",
                        rating: 5,
                        body: "Our churn dropped 40% after switching. Best decision this year.",
                      },
                      {
                        name: "Marco Russo",
                        role: "VP Eng, Flexiflow",
                        rating: 5,
                        body: "The API is clean, docs are excellent, and support actually responds.",
                      },
                    ],
                  },
                  {
                    label: "Agency",
                    items: [
                      {
                        name: "James O'Brien",
                        role: "CMO, BrandForge",
                        rating: 5,
                        body: "Every project delivered on time, on budget, and above spec. Rare.",
                      },
                      {
                        name: "Leila Hassan",
                        role: "Director, Luxe Brands",
                        rating: 5,
                        body: "They didn't just design — they thought strategically about our customers.",
                      },
                      {
                        name: "Tom Chen",
                        role: "Owner, FreshMerch",
                        rating: 5,
                        body: "Sales jumped 60% after the rebrand. Worth every penny.",
                      },
                    ],
                  },
                  {
                    label: "eComm",
                    items: [
                      {
                        name: "Sophie Laurent",
                        role: "Shopper",
                        rating: 5,
                        body: "Arrived in 2 days, quality is incredible. I'm ordering again already.",
                      },
                      {
                        name: "Raj Nair",
                        role: "Loyal Customer",
                        rating: 5,
                        body: "The packaging alone made me feel special. Love this brand.",
                      },
                      {
                        name: "Ana Torres",
                        role: "Reviewer",
                        rating: 5,
                        body: "Exactly as described, maybe even better. 5 stars without hesitation.",
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
                          bg: "",
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
            </div>

            {(c.items || []).map((item, i) => (
              <div
                key={item.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
                  >
                    #{i + 1} {item.name}
                  </span>
                  <button
                    onClick={() => delItem(item.id)}
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
                </div>
                <ImageUpload
                  label="Avatar"
                  value={item.avatar}
                  onChange={(v) => ui(item.id, { avatar: v })}
                  height={70}
                />
                <input
                  className="ctrl-input"
                  value={item.name || ""}
                  onChange={(e) => ui(item.id, { name: e.target.value })}
                  placeholder="Name"
                  style={{ marginBottom: 5 }}
                />
                <input
                  className="ctrl-input"
                  value={item.role || ""}
                  onChange={(e) => ui(item.id, { role: e.target.value })}
                  placeholder="Role, Company"
                  style={{ marginBottom: 5 }}
                />
                <textarea
                  className="ctrl-input"
                  rows={3}
                  value={item.body || ""}
                  onChange={(e) => ui(item.id, { body: e.target.value })}
                  placeholder="Testimonial text"
                  style={{ resize: "vertical", marginBottom: 5 }}
                />
                <RangeControl
                  label="Rating"
                  value={item.rating || 5}
                  min={1}
                  max={5}
                  onChange={(v) => ui(item.id, { rating: v })}
                  unit="★"
                />
                <ColorControl
                  label="Card Bg Override"
                  value={item.bg || c.cardBg || "#ffffff"}
                  onChange={(v) => ui(item.id, { bg: v })}
                />
              </div>
            ))}

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
              + Add Testimonial
            </button>
          </G>
        </>
      )}
    </div>
  );
}
