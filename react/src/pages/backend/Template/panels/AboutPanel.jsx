import { useState } from "react";
import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { ABOUT_PRESETS } from "../../../../config/aboutPresets";
import { uid } from "../../../../config/sectionDefaults";

const FONTS = [
  "Inter",
  "Plus Jakarta Sans",
  "Poppins",
  "Montserrat",
  "Raleway",
  "Syne",
  "Outfit",
  "DM Sans",
];

const VARIANTS = [
  { value: "image-left", label: "Image Left" },
  { value: "image-right", label: "Image Right" },
  { value: "image-top", label: "Image Top" },
  { value: "image-bottom", label: "Image Bottom" },
  { value: "centered", label: "Centered" },
  { value: "timeline", label: "Timeline" },
];

const ANIMATED_BG_PRESETS = [
  { id: "particles", name: "Particles", thumb: "✨" },
  { id: "orbs", name: "Floating Orbs", thumb: "🔵" },
  { id: "mesh", name: "Gradient Mesh", thumb: "🌈" },
  { id: "grid", name: "Pulse Grid", thumb: "▦" },
  { id: "stars", name: "Starfield", thumb: "⭐" },
  { id: "waves", name: "Smooth Waves", thumb: "🌊" },
];

const GALLERY_STYLE_PRESETS = [
  {
    id: "classic-dark",
    name: "Classic Dark",
    thumb: "⚫",
    style: {
      mode: "fade",
      arrowStyle: "circle",
      dotStyle: "dots",
      theme: "dark",
    },
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    thumb: "⚪",
    style: {
      mode: "fade",
      arrowStyle: "minimal",
      dotStyle: "lines",
      theme: "light",
    },
  },
  {
    id: "brand-accent",
    name: "Brand Accent",
    thumb: "🔵",
    style: {
      mode: "fade",
      arrowStyle: "circle",
      dotStyle: "dots",
      theme: "accent",
    },
  },
  {
    id: "cinema-stack",
    name: "Cinema Stack",
    thumb: "🎬",
    style: {
      mode: "coverflow",
      arrowStyle: "square",
      dotStyle: "numbers",
      theme: "light",
    },
  },
  {
    id: "showcase-3d",
    name: "Showcase 3D",
    thumb: "🖼️",
    style: {
      mode: "coverflow",
      arrowStyle: "circle",
      dotStyle: "dots",
      theme: "accent",
    },
  },
  {
    id: "clean-fade",
    name: "Clean Fade",
    thumb: "✨",
    style: {
      mode: "fade",
      arrowStyle: "none",
      dotStyle: "numbers",
      theme: "dark",
    },
  },
];

const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "#94a3b8",
      textTransform: "uppercase",
      margin: "18px 0 10px",
    }}
  >
    {children}
  </div>
);

const Divider = () => (
  <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0" }} />
);

const TABS = ["Style", "Content", "Media", "Advanced"];

export default function AboutPanel({ config: c, onChange }) {
  const [tab, setTab] = useState("Style");
  const u = (k, v) => onChange({ [k]: v });

  const applyPreset = (preset) =>
    onChange((current) => {
      const next = JSON.parse(JSON.stringify(preset.config));
      if (current.images?.length) next.images = current.images;
      if (current.galleryStyle) next.galleryStyle = current.galleryStyle;
      if (current.image?.url) next.image = { ...next.image, ...current.image };
      if (current.animatedBg) next.animatedBg = current.animatedBg;
      return next;
    });

  const ub = (k, v) => onChange({ badge: { ...c.badge, [k]: v } });
  const us = (id, patch) =>
    onChange({
      stats: (c.stats || []).map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1.5px solid #e2e8f0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderBottom:
                tab === t ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              color: tab === t ? "#2563eb" : "#64748b",
              fontWeight: tab === t ? 700 : 500,
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "0 12px 24px", overflowY: "auto", flex: 1 }}>
        {/* ── STYLE TAB ── */}
        {tab === "Style" && (
          <>
            <SectionLabel>Presets</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {ABOUT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "10px 6px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    background: "#fafafa",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "#475569",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#fafafa";
                  }}
                >
                  <span style={{ fontSize: 20 }}>{p.thumb}</span>
                  <span style={{ textAlign: "center", lineHeight: 1.2 }}>
                    {p.name}
                  </span>
                </button>
              ))}
            </div>

            <Divider />
            <SectionLabel>Layout Variant</SectionLabel>
            <SelectControl
              value={c.variant}
              options={VARIANTS}
              onChange={(v) => u("variant", v)}
            />

            <Divider />
            <SectionLabel>Background</SectionLabel>
            <BgControl config={c} onChange={onChange} />

            <Divider />
            <SectionLabel>Animated Background</SectionLabel>
            <ToggleControl
              label="Enable"
              value={!!c.animatedBg?.enabled}
              onChange={(v) => u("animatedBg", { ...c.animatedBg, enabled: v })}
            />
            {c.animatedBg?.enabled && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  {ANIMATED_BG_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        u("animatedBg", { ...c.animatedBg, preset: p.id })
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        padding: "8px 6px",
                        border:
                          (c.animatedBg?.preset || "particles") === p.id
                            ? "1.5px solid #2563eb"
                            : "1px solid #e2e8f0",
                        borderRadius: 8,
                        background:
                          (c.animatedBg?.preset || "particles") === p.id
                            ? "#eff6ff"
                            : "#fafafa",
                        cursor: "pointer",
                        fontSize: 11,
                        color: "#475569",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{p.thumb}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
                <ColorControl
                  label="Color"
                  value={c.animatedBg?.color || "#2563eb"}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, color: v })
                  }
                />
                <RangeControl
                  label="Density"
                  value={c.animatedBg?.density ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, density: v })
                  }
                  unit="%"
                />
                <RangeControl
                  label="Count"
                  value={c.animatedBg?.count ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, count: v })
                  }
                  unit="%"
                />
                <RangeControl
                  label="Size"
                  value={c.animatedBg?.size ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, size: v })
                  }
                  unit="%"
                />
                <RangeControl
                  label="Speed"
                  value={c.animatedBg?.speed ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, speed: v })
                  }
                  unit="%"
                />
                <RangeControl
                  label="Glow / Opacity"
                  value={c.animatedBg?.glow ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, glow: v })
                  }
                  unit="%"
                />
              </>
            )}

            <Divider />
            <SectionLabel>Typography</SectionLabel>
            <SelectControl
              label="Heading Font"
              value={c.headingFont || "Inter"}
              options={FONTS}
              onChange={(v) => u("headingFont", v)}
            />
            <SelectControl
              label="Body Font"
              value={c.bodyFont || "Inter"}
              options={FONTS}
              onChange={(v) => u("bodyFont", v)}
            />

            <Divider />
            <SectionLabel>Spacing</SectionLabel>
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

            <Divider />
            <SectionLabel>Scroll Animation</SectionLabel>
            <AnimationControl
              value={c.animation}
              onChange={(v) => u("animation", v)}
            />
          </>
        )}

        {/* ── CONTENT TAB ── */}
        {tab === "Content" && (
          <>
            <SectionLabel>Badge</SectionLabel>
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
                  value={c.badge.bg}
                  onChange={(v) => ub("bg", v)}
                />
                <ColorControl
                  label="Text Color"
                  value={c.badge.color}
                  onChange={(v) => ub("color", v)}
                />
              </>
            )}

            <Divider />
            <SectionLabel>Heading</SectionLabel>
            <input
              className="ctrl-input"
              value={c.heading || ""}
              onChange={(e) => u("heading", e.target.value)}
              placeholder="Heading text"
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

            <Divider />
            <SectionLabel>Body Text</SectionLabel>
            <textarea
              className="ctrl-input"
              rows={5}
              value={c.body?.replace(/<[^>]+>/g, "") || ""}
              onChange={(e) => u("body", `<p>${e.target.value}</p>`)}
              placeholder="Body text..."
              style={{ resize: "vertical", marginBottom: 5 }}
            />
            <ColorControl
              label="Color"
              value={c.bodyColor || "#475569"}
              onChange={(v) => u("bodyColor", v)}
            />
            <RangeControl
              label="Size"
              value={c.bodySize || 16}
              min={12}
              max={24}
              onChange={(v) => u("bodySize", v)}
              unit="px"
            />

            <Divider />
            <SectionLabel>Alignment</SectionLabel>
            <SelectControl
              label="Content"
              value={c.contentAlign || "left"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => u("contentAlign", v)}
            />
            <SelectControl
              label="Stats"
              value={c.statsAlign || "default"}
              options={[
                { value: "default", label: "Same as Content" },
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => u("statsAlign", v === "default" ? "" : v)}
            />
            <SelectControl
              label="Button"
              value={c.buttonAlign || "default"}
              options={[
                { value: "default", label: "Same as Content" },
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => u("buttonAlign", v === "default" ? "" : v)}
            />

            <Divider />
            <SectionLabel>Stats</SectionLabel>
            <ToggleControl
              label="Show Stats"
              value={!!c.showStats}
              onChange={(v) => u("showStats", v)}
            />
            {c.showStats && (
              <>
                <ToggleControl
                  label="Count-Up Animation"
                  value={!!c.countUpStats}
                  onChange={(v) => u("countUpStats", v)}
                />
                {c.countUpStats && (
                  <RangeControl
                    label="Duration"
                    value={c.countUpDuration || 1.5}
                    min={0.5}
                    max={4}
                    step={0.1}
                    onChange={(v) => u("countUpDuration", v)}
                    unit="s"
                  />
                )}
                {(c.stats || []).map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      gap: 6,
                      marginBottom: 6,
                      alignItems: "center",
                    }}
                  >
                    <input
                      className="ctrl-input"
                      value={s.value}
                      onChange={(e) => us(s.id, { value: e.target.value })}
                      style={{ width: 70 }}
                      placeholder="10+"
                    />
                    <input
                      className="ctrl-input"
                      value={s.label}
                      onChange={(e) => us(s.id, { label: e.target.value })}
                      placeholder="Label"
                    />
                    <button
                      onClick={() =>
                        onChange({
                          stats: (c.stats || []).filter((x) => x.id !== s.id),
                        })
                      }
                      style={{
                        border: "none",
                        background: "none",
                        color: "#cbd5e1",
                        cursor: "pointer",
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    onChange({
                      stats: [
                        ...(c.stats || []),
                        { id: uid(), value: "0+", label: "New Stat" },
                      ],
                    })
                  }
                  style={{
                    width: "100%",
                    border: "1.5px dashed #cbd5e1",
                    background: "transparent",
                    borderRadius: 8,
                    padding: 6,
                    color: "#94a3b8",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  + Add Stat
                </button>
              </>
            )}

            <Divider />
            <SectionLabel>Buttons</SectionLabel>
            {(c.buttons || []).map((btn, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  marginBottom: 6,
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
                    style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}
                  >
                    Button {idx + 1}
                  </span>
                  <button
                    onClick={() =>
                      onChange({
                        buttons: (c.buttons || []).filter((_, i) => i !== idx),
                      })
                    }
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
                  value={btn.label || ""}
                  placeholder="Label"
                  onChange={(e) =>
                    onChange({
                      buttons: (c.buttons || []).map((b, i) =>
                        i === idx ? { ...b, label: e.target.value } : b,
                      ),
                    })
                  }
                  style={{ marginBottom: 5 }}
                />
                <input
                  className="ctrl-input"
                  value={btn.url || ""}
                  placeholder="URL"
                  onChange={(e) =>
                    onChange({
                      buttons: (c.buttons || []).map((b, i) =>
                        i === idx ? { ...b, url: e.target.value } : b,
                      ),
                    })
                  }
                  style={{ marginBottom: 5 }}
                />
                <ColorControl
                  label="Background"
                  value={btn.bg || "#2563eb"}
                  onChange={(v) =>
                    onChange({
                      buttons: (c.buttons || []).map((b, i) =>
                        i === idx ? { ...b, bg: v } : b,
                      ),
                    })
                  }
                />
                <ColorControl
                  label="Text"
                  value={btn.color || "#ffffff"}
                  onChange={(v) =>
                    onChange({
                      buttons: (c.buttons || []).map((b, i) =>
                        i === idx ? { ...b, color: v } : b,
                      ),
                    })
                  }
                />
                <SelectControl
                  label="Style"
                  value={btn.variant || "filled"}
                  options={[
                    { value: "filled", label: "Filled" },
                    { value: "outline", label: "Outline" },
                    { value: "ghost", label: "Ghost" },
                  ]}
                  onChange={(v) =>
                    onChange({
                      buttons: (c.buttons || []).map((b, i) =>
                        i === idx ? { ...b, variant: v } : b,
                      ),
                    })
                  }
                />
                <ColorControl
                  label="Hover BG"
                  value={btn.hoverBg || btn.bg || "#1d4ed8"}
                  onChange={(v) =>
                    onChange({
                      buttons: (c.buttons || []).map((b, i) =>
                        i === idx ? { ...b, hoverBg: v } : b,
                      ),
                    })
                  }
                />
                <ColorControl
                  label="Hover Text"
                  value={btn.hoverColor || btn.color || "#ffffff"}
                  onChange={(v) =>
                    onChange({
                      buttons: (c.buttons || []).map((b, i) =>
                        i === idx ? { ...b, hoverColor: v } : b,
                      ),
                    })
                  }
                />
              </div>
            ))}
            <button
              onClick={() =>
                onChange({
                  buttons: [
                    ...(c.buttons || []),
                    {
                      label: "Button",
                      url: "#",
                      bg: "#2563eb",
                      color: "#fff",
                      variant: "filled",
                    },
                  ],
                })
              }
              style={{
                width: "100%",
                border: "1.5px dashed #cbd5e1",
                background: "transparent",
                borderRadius: 8,
                padding: 6,
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              + Add Button
            </button>
            {(c.buttons || []).length > 0 && (
              <>
                <SelectControl
                  label="Layout"
                  value={c.buttonLayout || "row"}
                  options={[
                    { value: "row", label: "Side by Side" },
                    { value: "column", label: "Stacked" },
                  ]}
                  onChange={(v) => u("buttonLayout", v)}
                />
                {c.buttonLayout === "column" && (
                  <RangeControl
                    label="Button Width"
                    value={c.buttonWidth || 100}
                    min={20}
                    max={100}
                    onChange={(v) => u("buttonWidth", v)}
                    unit="%"
                  />
                )}
                <SelectControl
                  label="Align"
                  value={c.buttonAlign || "default"}
                  options={[
                    { value: "default", label: "Same as Content" },
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                  ]}
                  onChange={(v) => u("buttonAlign", v === "default" ? "" : v)}
                />
              </>
            )}
          </>
        )}

        {/* ── MEDIA TAB ── */}
        {tab === "Media" && (
          <>
            <SectionLabel>Single Image</SectionLabel>
            <ImageUpload
              value={c.image?.url}
              onChange={(v) => u("image", { ...c.image, url: v })}
            />
            <RangeControl
              label="Border Radius"
              value={c.image?.borderRadius || 16}
              min={0}
              max={40}
              onChange={(v) => u("image", { ...c.image, borderRadius: v })}
              unit="px"
            />
            <ToggleControl
              label="Shadow"
              value={!!c.image?.shadow}
              onChange={(v) => u("image", { ...c.image, shadow: v })}
            />

            <Divider />
            <SectionLabel>Image Gallery</SectionLabel>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 8px" }}>
              Gallery replaces single image when set
            </p>
            {(c.images || []).map((img, idx) => (
              <div
                key={img.id ?? idx}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  marginBottom: 6,
                }}
              >
                <ImageUpload
                  value={img.url}
                  onChange={(v) =>
                    onChange({
                      images: (c.images || []).map((x, i) =>
                        i === idx ? { ...x, url: v } : x,
                      ),
                    })
                  }
                />
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <input
                    className="ctrl-input"
                    value={img.alt || ""}
                    onChange={(e) =>
                      onChange({
                        images: (c.images || []).map((x, i) =>
                          i === idx ? { ...x, alt: e.target.value } : x,
                        ),
                      })
                    }
                    placeholder="Alt text"
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() =>
                      onChange({
                        images: (c.images || []).filter((_, i) => i !== idx),
                      })
                    }
                    style={{
                      border: "none",
                      background: "none",
                      color: "#cbd5e1",
                      cursor: "pointer",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                onChange({
                  images: [
                    ...(c.images || []),
                    { id: uid(), url: "", alt: "" },
                  ],
                })
              }
              style={{
                width: "100%",
                border: "1.5px dashed #cbd5e1",
                background: "transparent",
                borderRadius: 8,
                padding: 6,
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              + Add Gallery Image
            </button>

            {(c.images || []).length > 0 && (
              <>
                <Divider />
                <SectionLabel>Gallery Style</SectionLabel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  {GALLERY_STYLE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => u("galleryStyle", p.style)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        padding: "8px 6px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        background: "#fafafa",
                        cursor: "pointer",
                        fontSize: 11,
                        color: "#475569",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2563eb";
                        e.currentTarget.style.background = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.background = "#fafafa";
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{p.thumb}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
                <SelectControl
                  label="Mode"
                  value={c.galleryStyle?.mode || "fade"}
                  options={[
                    { value: "fade", label: "Fade / Crossfade" },
                    { value: "coverflow", label: "3D Coverflow" },
                  ]}
                  onChange={(v) =>
                    u("galleryStyle", { ...c.galleryStyle, mode: v })
                  }
                />
                <SelectControl
                  label="Arrow Style"
                  value={c.galleryStyle?.arrowStyle || "circle"}
                  options={[
                    { value: "circle", label: "Circle" },
                    { value: "square", label: "Square" },
                    { value: "minimal", label: "Minimal" },
                    { value: "none", label: "Hidden" },
                  ]}
                  onChange={(v) =>
                    u("galleryStyle", { ...c.galleryStyle, arrowStyle: v })
                  }
                />
                <SelectControl
                  label="Dot Style"
                  value={c.galleryStyle?.dotStyle || "dots"}
                  options={[
                    { value: "dots", label: "Dots" },
                    { value: "lines", label: "Lines" },
                    { value: "numbers", label: "Numbers" },
                    { value: "none", label: "Hidden" },
                  ]}
                  onChange={(v) =>
                    u("galleryStyle", { ...c.galleryStyle, dotStyle: v })
                  }
                />
                <SelectControl
                  label="Color Theme"
                  value={c.galleryStyle?.theme || "dark"}
                  options={[
                    { value: "dark", label: "Dark" },
                    { value: "light", label: "Light" },
                    { value: "accent", label: "Accent" },
                  ]}
                  onChange={(v) =>
                    u("galleryStyle", { ...c.galleryStyle, theme: v })
                  }
                />
              </>
            )}
          </>
        )}

        {/* ── ADVANCED TAB ── */}
        {tab === "Advanced" && (
          <>
            <SectionLabel>Scroll Animation</SectionLabel>
            <AnimationControl
              value={c.animation}
              onChange={(v) => u("animation", v)}
            />

            <Divider />
            <SectionLabel>Spacing</SectionLabel>
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
          </>
        )}
      </div>
    </div>
  );
}
