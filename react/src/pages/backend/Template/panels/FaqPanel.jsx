import { useState } from "react";
import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

/* ─── Presets ─────────────────────────────────────────────────────────────── */
const PRESETS = [
  {
    id: "clean",
    label: "Clean",
    thumb: "⬜",
    config: {
      variant: "accordion",
      align: "center",
      bg: "#ffffff",
      bgType: "solid",
      accentColor: "#2563eb",
      borderColor: "#e2e8f0",
      headingColor: "#0f172a",
      bodyColor: "#64748b",
      iconStyle: "plus",
      itemRadius: 12,
      itemShadowHover: true,
      animPreset: "fadeUp",
      particles: false,
    },
  },
  {
    id: "dark",
    label: "Dark",
    thumb: "⬛",
    config: {
      variant: "accordion",
      align: "center",
      bg: "#0f172a",
      bgType: "solid",
      accentColor: "#38bdf8",
      borderColor: "#1e293b",
      headingColor: "#f1f5f9",
      bodyColor: "#94a3b8",
      iconStyle: "chevron",
      itemRadius: 10,
      itemShadowHover: true,
      animPreset: "fadeUp",
      particles: true,
      particleColor: "#38bdf8",
      particleCount: 30,
    },
  },
  {
    id: "gradient",
    label: "Gradient",
    thumb: "🌈",
    config: {
      variant: "accordion",
      align: "left",
      bgType: "gradient",
      bgGradient: { direction: "135deg", from: "#667eea", to: "#764ba2" },
      accentColor: "#fbbf24",
      borderColor: "rgba(255,255,255,0.2)",
      headingColor: "#ffffff",
      bodyColor: "rgba(255,255,255,0.8)",
      iconStyle: "arrow",
      itemRadius: 16,
      itemShadowHover: false,
      animPreset: "slideLeft",
      particles: true,
      particleColor: "#ffffff",
      particleCount: 20,
    },
  },
  {
    id: "minimal",
    label: "Minimal",
    thumb: "➖",
    config: {
      variant: "accordion",
      align: "left",
      bg: "#fafafa",
      bgType: "solid",
      accentColor: "#111827",
      borderColor: "#f3f4f6",
      headingColor: "#111827",
      bodyColor: "#6b7280",
      iconStyle: "dash",
      itemRadius: 0,
      itemShadowHover: false,
      animPreset: "fadeIn",
      particles: false,
    },
  },
  {
    id: "card",
    label: "Cards",
    thumb: "🃏",
    config: {
      variant: "grid",
      align: "center",
      bg: "#f8fafc",
      bgType: "solid",
      accentColor: "#7c3aed",
      borderColor: "#ede9fe",
      headingColor: "#1e1b4b",
      bodyColor: "#6b7280",
      iconStyle: "circle",
      itemRadius: 20,
      itemShadowHover: true,
      animPreset: "zoomIn",
      particles: false,
    },
  },
  {
    id: "neon",
    label: "Neon",
    thumb: "💜",
    config: {
      variant: "accordion",
      align: "center",
      bg: "#09090b",
      bgType: "solid",
      accentColor: "#a855f7",
      borderColor: "#3f3f46",
      headingColor: "#fafafa",
      bodyColor: "#a1a1aa",
      iconStyle: "plus",
      itemRadius: 8,
      itemShadowHover: true,
      animPreset: "fadeUp",
      particles: true,
      particleColor: "#a855f7",
      particleCount: 40,
    },
  },
];

const ICON_STYLES = [
  { value: "plus", label: "+ / ×" },
  { value: "chevron", label: "❯ Chevron" },
  { value: "arrow", label: "↓ Arrow" },
  { value: "dash", label: "— Dash" },
  { value: "circle", label: "◉ Circle" },
];

const ANIM_PRESETS = [
  { value: "none", label: "None" },
  { value: "fadeIn", label: "Fade In" },
  { value: "fadeUp", label: "Fade Up" },
  { value: "fadeDown", label: "Fade Down" },
  { value: "slideLeft", label: "Slide Left" },
  { value: "slideRight", label: "Slide Right" },
  { value: "zoomIn", label: "Zoom In" },
  { value: "flipUp", label: "Flip Up" },
  { value: "stagger", label: "Stagger" },
];

const TABS = ["Presets", "Layout", "Style", "Items", "Animation", "BG FX"];

/* ─── Tab Button ──────────────────────────────────────────────────────────── */
const TabBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "6px 2px",
      fontSize: 10,
      fontWeight: active ? 700 : 500,
      color: active ? "#2563eb" : "#64748b",
      background: active ? "#eff6ff" : "transparent",
      border: "none",
      borderBottom: active ? "2px solid #2563eb" : "2px solid transparent",
      cursor: "pointer",
      transition: "all 0.15s",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

export default function FaqPanel({ config: c, onChange }) {
  const [tab, setTab] = useState(0);
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
        { id: uid(), question: "New Question?", answer: "Answer goes here." },
      ],
    });
  const delItem = (id) =>
    onChange({ items: (c.items || []).filter((i) => i.id !== id) });

  const applyPreset = (preset) => {
    onChange({ ...c, ...preset.config });
  };

  return (
    <div className="ed-right-body" style={{ padding: 0 }}>
      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
          overflowX: "auto",
        }}
      >
        {TABS.map((t, i) => (
          <TabBtn key={t} active={tab === i} onClick={() => setTab(i)}>
            {t}
          </TabBtn>
        ))}
      </div>

      <div style={{ padding: "12px 12px 24px" }}>
        {/* ── PRESETS ── */}
        {tab === 0 && (
          <G>
            <L>Choose a Preset</L>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginTop: 8,
              }}
            >
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  style={{
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "10px 4px",
                    background: "#f8fafc",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  <span style={{ fontSize: 22 }}>{p.thumb}</span>
                  <span
                    style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}
                  >
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </G>
        )}

        {/* ── LAYOUT ── */}
        {tab === 1 && (
          <>
            <G>
              <L>Variant</L>
              <SelectControl
                value={c.variant || "accordion"}
                options={[
                  { value: "accordion", label: "Accordion" },
                  { value: "grid", label: "Grid Cards" },
                  { value: "tabs", label: "Tabs" },
                  { value: "timeline", label: "Timeline" },
                ]}
                onChange={(v) => u("variant", v)}
              />
            </G>
            <D />
            <G>
              <L>Alignment</L>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {["left", "center", "right"].map((a) => (
                  <button
                    key={a}
                    onClick={() => u("align", a)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      fontSize: 11,
                      fontWeight: 600,
                      border: "1.5px solid",
                      borderColor:
                        (c.align || "center") === a ? "#2563eb" : "#e2e8f0",
                      borderRadius: 6,
                      background:
                        (c.align || "center") === a ? "#eff6ff" : "#fff",
                      color:
                        (c.align || "center") === a ? "#2563eb" : "#64748b",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {a === "left"
                      ? "⬅ Left"
                      : a === "center"
                        ? "↔ Center"
                        : "➡ Right"}
                  </button>
                ))}
              </div>
            </G>
            <D />
            <G>
              <L>Max Width</L>
              <RangeControl
                label="Content Width"
                value={c.maxWidth || 760}
                min={400}
                max={1200}
                onChange={(v) => u("maxWidth", v)}
                unit="px"
              />
            </G>
            <D />
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
                label="Item Gap"
                value={c.itemGap || 10}
                min={0}
                max={40}
                onChange={(v) => u("itemGap", v)}
                unit="px"
              />
            </G>
            <D />
            <G>
              <L>Badge & Heading</L>
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
                    label="Badge Bg"
                    value={c.badge.bg || "#eff6ff"}
                    onChange={(v) => ub("bg", v)}
                  />
                  <ColorControl
                    label="Badge Color"
                    value={c.badge.color || "#2563eb"}
                    onChange={(v) => ub("color", v)}
                  />
                </>
              )}
              <input
                className="ctrl-input"
                value={c.heading || ""}
                onChange={(e) => u("heading", e.target.value)}
                placeholder="Heading"
                style={{ marginBottom: 5 }}
              />
              <input
                className="ctrl-input"
                value={c.subheading || ""}
                onChange={(e) => u("subheading", e.target.value)}
                placeholder="Subheading"
              />
            </G>
          </>
        )}

        {/* ── STYLE ── */}
        {tab === 2 && (
          <>
            <G>
              <L>Background</L>
              <BgControl config={c} onChange={onChange} />
            </G>
            <D />
            <G>
              <L>Colors</L>
              <ColorControl
                label="Accent"
                value={c.accentColor || "#2563eb"}
                onChange={(v) => u("accentColor", v)}
              />
              <ColorControl
                label="Border"
                value={c.borderColor || "#e2e8f0"}
                onChange={(v) => u("borderColor", v)}
              />
              <ColorControl
                label="Heading"
                value={c.headingColor || "#0f172a"}
                onChange={(v) => u("headingColor", v)}
              />
              <ColorControl
                label="Body Text"
                value={c.bodyColor || "#64748b"}
                onChange={(v) => u("bodyColor", v)}
              />
              <ColorControl
                label="Item Bg"
                value={c.itemBg || "#ffffff"}
                onChange={(v) => u("itemBg", v)}
              />
              <ColorControl
                label="Item Bg Open"
                value={c.itemBgOpen || "#fafafa"}
                onChange={(v) => u("itemBgOpen", v)}
              />
              <ColorControl
                label="Subheading"
                value={c.subheadingColor || "#64748b"}
                onChange={(v) => u("subheadingColor", v)}
              />
            </G>
            <D />
            <G>
              <L>Item Style</L>
              <RangeControl
                label="Border Radius"
                value={c.itemRadius ?? 12}
                min={0}
                max={32}
                onChange={(v) => u("itemRadius", v)}
                unit="px"
              />
              <RangeControl
                label="Border Width"
                value={c.itemBorderWidth ?? 1}
                min={0}
                max={4}
                onChange={(v) => u("itemBorderWidth", v)}
                unit="px"
              />
              <RangeControl
                label="Question Size"
                value={c.questionSize || 15}
                min={12}
                max={24}
                onChange={(v) => u("questionSize", v)}
                unit="px"
              />
              <RangeControl
                label="Answer Size"
                value={c.answerSize || 14}
                min={11}
                max={20}
                onChange={(v) => u("answerSize", v)}
                unit="px"
              />
              <ToggleControl
                label="Hover Shadow"
                value={!!c.itemShadowHover}
                onChange={(v) => u("itemShadowHover", v)}
              />
              <ToggleControl
                label="Allow Multiple Open"
                value={!!c.allowMultiOpen}
                onChange={(v) => u("allowMultiOpen", v)}
              />
            </G>
            <D />
            <G>
              <L>Icon Style</L>
              <SelectControl
                value={c.iconStyle || "plus"}
                options={ICON_STYLES}
                onChange={(v) => u("iconStyle", v)}
              />
              <RangeControl
                label="Icon Size"
                value={c.iconSize || 22}
                min={12}
                max={36}
                onChange={(v) => u("iconSize", v)}
                unit="px"
              />
            </G>
          </>
        )}

        {/* ── ITEMS ── */}
        {tab === 3 && (
          <G>
            <L>FAQ Items</L>
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
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
                  >
                    Q{i + 1}
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
                <input
                  className="ctrl-input"
                  value={item.question || ""}
                  onChange={(e) => ui(item.id, { question: e.target.value })}
                  placeholder="Question"
                  style={{ marginBottom: 5 }}
                />
                <textarea
                  className="ctrl-input"
                  rows={3}
                  value={item.answer || ""}
                  onChange={(e) => ui(item.id, { answer: e.target.value })}
                  placeholder="Answer"
                  style={{ resize: "vertical" }}
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
              + Add FAQ
            </button>
          </G>
        )}

        {/* ── ANIMATION ── */}
        {tab === 4 && (
          <>
            <G>
              <L>Scroll Animation</L>
              <AnimationControl
                value={c.animation}
                onChange={(v) => u("animation", v)}
              />
            </G>
            <D />
            <G>
              <L>Item Reveal Preset</L>
              <SelectControl
                value={c.animPreset || "fadeUp"}
                options={ANIM_PRESETS}
                onChange={(v) => u("animPreset", v)}
              />
              <RangeControl
                label="Stagger Delay"
                value={c.staggerDelay || 80}
                min={0}
                max={300}
                onChange={(v) => u("staggerDelay", v)}
                unit="ms"
              />
              <RangeControl
                label="Duration"
                value={c.animDuration || 500}
                min={100}
                max={1200}
                onChange={(v) => u("animDuration", v)}
                unit="ms"
              />
            </G>
            <D />
            <G>
              <L>Open / Close Transition</L>
              <SelectControl
                value={c.expandAnim || "smooth"}
                options={[
                  { value: "smooth", label: "Smooth Slide" },
                  { value: "snap", label: "Instant Snap" },
                  { value: "spring", label: "Spring Bounce" },
                ]}
                onChange={(v) => u("expandAnim", v)}
              />
            </G>
          </>
        )}

        {/* ── BG FX ── */}
        {tab === 5 && (
          <>
            <G>
              <L>Background</L>
              <BgControl config={c} onChange={onChange} />
            </G>

            {/* ADD THIS — Image-specific options, only shown when bgType is image */}
            {c.bgType === "image" && (
              <>
                <D />
                <G>
                  <L>Image Options</L>
                  <SelectControl
                    label="Size"
                    value={c.bgSize || "cover"}
                    options={[
                      { value: "cover", label: "Cover (fill)" },
                      { value: "contain", label: "Contain" },
                      { value: "auto", label: "Auto" },
                      { value: "100% 100%", label: "Stretch" },
                    ]}
                    onChange={(v) => u("bgSize", v)}
                  />
                  <SelectControl
                    label="Position"
                    value={c.bgPosition || "center"}
                    options={[
                      { value: "center", label: "Center" },
                      { value: "top", label: "Top" },
                      { value: "bottom", label: "Bottom" },
                      { value: "left center", label: "Left" },
                      { value: "right center", label: "Right" },
                    ]}
                    onChange={(v) => u("bgPosition", v)}
                  />
                  <ToggleControl
                    label="Fixed / Parallax"
                    value={!!c.bgFixed}
                    onChange={(v) => u("bgFixed", v)}
                  />
                  <ToggleControl
                    label="Repeat"
                    value={c.bgRepeat === "repeat"}
                    onChange={(v) => u("bgRepeat", v ? "repeat" : "no-repeat")}
                  />
                </G>
              </>
            )}
            <D />
            <G>
              <L>Background Particles</L>
              <ToggleControl
                label="Enable Particles"
                value={!!c.particles}
                onChange={(v) => u("particles", v)}
              />
              {c.particles && (
                <>
                  <ColorControl
                    label="Particle Color"
                    value={c.particleColor || "#2563eb"}
                    onChange={(v) => u("particleColor", v)}
                  />
                  <RangeControl
                    label="Count"
                    value={c.particleCount || 30}
                    min={5}
                    max={100}
                    onChange={(v) => u("particleCount", v)}
                    unit=""
                  />
                  <RangeControl
                    label="Size"
                    value={c.particleSize || 3}
                    min={1}
                    max={10}
                    onChange={(v) => u("particleSize", v)}
                    unit="px"
                  />
                  <RangeControl
                    label="Speed"
                    value={c.particleSpeed || 1}
                    min={1}
                    max={5}
                    onChange={(v) => u("particleSpeed", v)}
                    unit="x"
                  />
                  <SelectControl
                    label="Shape"
                    value={c.particleShape || "circle"}
                    options={[
                      { value: "circle", label: "Circle" },
                      { value: "square", label: "Square" },
                      { value: "star", label: "Star" },
                      { value: "ring", label: "Ring" },
                    ]}
                    onChange={(v) => u("particleShape", v)}
                  />
                </>
              )}
            </G>
            <D />
            <G>
              <L>Background Overlay</L>
              <ToggleControl
                label="Enable Overlay"
                value={!!c.bgOverlay}
                onChange={(v) => u("bgOverlay", v)}
              />
              {c.bgOverlay && (
                <>
                  <ColorControl
                    label="Overlay Color"
                    value={c.bgOverlayColor || "rgba(0,0,0,0.4)"}
                    onChange={(v) => u("bgOverlayColor", v)}
                  />
                  <RangeControl
                    label="Opacity"
                    value={c.bgOverlayOpacity ?? 40}
                    min={0}
                    max={100}
                    onChange={(v) => u("bgOverlayOpacity", v)}
                    unit="%"
                  />
                </>
              )}
            </G>
            <D />
            <G>
              <L>Decorative Blobs</L>
              <ToggleControl
                label="Enable Blobs"
                value={!!c.blobs}
                onChange={(v) => u("blobs", v)}
              />
              {c.blobs && (
                <>
                  <ColorControl
                    label="Blob Color"
                    value={c.blobColor || "#a5b4fc"}
                    onChange={(v) => u("blobColor", v)}
                  />
                  <RangeControl
                    label="Blob Opacity"
                    value={c.blobOpacity ?? 20}
                    min={5}
                    max={60}
                    onChange={(v) => u("blobOpacity", v)}
                    unit="%"
                  />
                </>
              )}
            </G>
          </>
        )}
      </div>
    </div>
  );
}
