import { useState, useRef, useCallback } from "react";
import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import { uid } from "../../../../config/sectionDefaults";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";
import VideoUpload from "../../../../components/editor/controls/VideoUpload";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Nunito",
  "DM Sans",
  "Space Grotesk",
  "Playfair Display",
  "Merriweather",
  "Cormorant Garamond",
  "Lora",
];

const ANCHOR_OPTIONS = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "center-left", label: "Center Left" },
  { value: "center", label: "Center" },
  { value: "center-right", label: "Center Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

const ANCHOR_DOT_POS = {
  "top-left": { left: "0%", top: "0%" },
  "top-center": { left: "50%", top: "0%" },
  "top-right": { left: "100%", top: "0%" },
  "center-left": { left: "0%", top: "50%" },
  center: { left: "50%", top: "50%" },
  "center-right": { left: "100%", top: "50%" },
  "bottom-left": { left: "0%", top: "100%" },
  "bottom-center": { left: "50%", top: "100%" },
  "bottom-right": { left: "100%", top: "100%" },
};

function extractYouTubeId(url) {
  if (!url) return "";
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return m ? m[1] : "";
}

/* ─── Prebuilt presets ─── */
const PRESETS = [
  {
    id: "elevate-bottom-left",
    name: "Elevate (Bottom Left)",
    emoji: "🏢",
    preview: "linear-gradient(135deg,#1e293b,#0f172a)",
    config: {
      bgMediaType: "image",
      overlay: {
        enabled: true,
        type: "solid",
        color: "rgba(0,0,0,0.45)",
      },
      minHeight: 480,
      minHeightMobile: 360,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 6,
          y: 60,
          width: 30,
          anchor: "top-left",
          zIndex: 2,
          text: "● Elevate.",
          fontSize: 13,
          fontWeight: 600,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.3,
          textAlign: "left",
          bg: "rgba(255,255,255,0.12)",
          padding: "6px 14px",
          borderRadius: 100,
          display: "inline",
        },
        {
          id: 2,
          type: "text",
          x: 6,
          y: 70,
          width: 70,
          anchor: "top-left",
          zIndex: 2,
          text: "Developing Your Vision,\nBuilding Exceptional User Experiences.",
          fontSize: 42,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.2,
          textAlign: "left",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
      ],
    },
  },
  {
    id: "centered-cta",
    name: "Centered CTA",
    emoji: "🎯",
    preview: "linear-gradient(135deg,#1e1b4b,#312e81)",
    config: {
      bgMediaType: "gradient",
      bgGradient: {
        from: "#1e1b4b",
        to: "#312e81",
        direction: "to bottom right",
        intensity: 100,
      },
      overlay: { enabled: false },
      minHeight: 440,
      minHeightMobile: 360,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 50,
          y: 38,
          width: 60,
          anchor: "top-center",
          zIndex: 2,
          text: "Build Something Remarkable",
          fontSize: 40,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.2,
          textAlign: "center",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
        {
          id: 2,
          type: "text",
          x: 50,
          y: 56,
          width: 50,
          anchor: "top-center",
          zIndex: 2,
          text: "A clean, focused message that speaks directly to your audience.",
          fontSize: 16,
          fontWeight: 400,
          color: "rgba(255,255,255,0.75)",
          fontFamily: "Inter",
          lineHeight: 1.5,
          textAlign: "center",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
        {
          id: 3,
          type: "button",
          x: 50,
          y: 72,
          anchor: "top-center",
          zIndex: 2,
          label: "Get Started",
          url: "#",
          bg: "#ffffff",
          color: "#1e1b4b",
          fontSize: 14,
          fontWeight: 700,
          padding: "13px 32px",
          borderRadius: 100,
          style: "filled",
        },
      ],
    },
  },
  {
    id: "split-right-text",
    name: "Split Right Text",
    emoji: "📐",
    preview: "linear-gradient(135deg,#0f172a,#1e293b)",
    config: {
      bgMediaType: "image",
      overlay: {
        enabled: true,
        type: "gradient",
        gradientFrom: "rgba(0,0,0,0.1)",
        gradientTo: "rgba(0,0,0,0.75)",
        gradientDirection: "to left",
      },
      minHeight: 520,
      minHeightMobile: 400,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 56,
          y: 30,
          width: 38,
          anchor: "top-left",
          zIndex: 2,
          text: "Crafted For Modern Teams",
          fontSize: 36,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.25,
          textAlign: "left",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
        {
          id: 2,
          type: "text",
          x: 56,
          y: 52,
          width: 36,
          anchor: "top-left",
          zIndex: 2,
          text: "Powerful tools, thoughtfully designed, built to scale with you.",
          fontSize: 15,
          fontWeight: 400,
          color: "rgba(255,255,255,0.7)",
          fontFamily: "Inter",
          lineHeight: 1.6,
          textAlign: "left",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
        {
          id: 3,
          type: "button",
          x: 56,
          y: 68,
          anchor: "top-left",
          zIndex: 2,
          label: "Learn More →",
          url: "#",
          bg: "#2563eb",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          padding: "12px 26px",
          borderRadius: 8,
          style: "filled",
        },
      ],
    },
  },
  {
    id: "minimal-corner",
    name: "Minimal Corner",
    emoji: "✦",
    preview: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    config: {
      bgMediaType: "solid",
      bg: "#f8fafc",
      overlay: { enabled: false },
      minHeight: 360,
      minHeightMobile: 280,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 6,
          y: 80,
          width: 50,
          anchor: "bottom-left",
          zIndex: 2,
          text: "Quiet confidence, clearly stated.",
          fontSize: 24,
          fontWeight: 600,
          color: "#0f172a",
          fontFamily: "Inter",
          lineHeight: 1.3,
          textAlign: "left",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
      ],
    },
  },
  {
    id: "video-loop-bold",
    name: "Video Loop Bold",
    emoji: "🎬",
    preview: "linear-gradient(135deg,#000000,#1e293b)",
    config: {
      bgMediaType: "video",
      overlay: {
        enabled: true,
        type: "gradient",
        gradientFrom: "rgba(0,0,0,0.2)",
        gradientTo: "rgba(0,0,0,0.85)",
        gradientDirection: "to bottom",
      },
      minHeight: 560,
      minHeightMobile: 420,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 50,
          y: 78,
          width: 70,
          anchor: "top-center",
          zIndex: 2,
          text: "Motion Tells The Story",
          fontSize: 44,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.15,
          textAlign: "center",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
      ],
    },
  },
  {
    id: "badge-heading-twobtn",
    name: "Badge + Two Buttons",
    emoji: "🚀",
    preview: "linear-gradient(135deg,#0f172a,#312e81)",
    config: {
      bgMediaType: "gradient",
      bgGradient: {
        from: "#0f172a",
        to: "#312e81",
        direction: "to bottom right",
        intensity: 100,
      },
      overlay: { enabled: false },
      minHeight: 460,
      minHeightMobile: 380,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 6,
          y: 28,
          width: 30,
          anchor: "top-left",
          zIndex: 2,
          text: "🚀 New Release",
          fontSize: 12,
          fontWeight: 600,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.3,
          textAlign: "left",
          bg: "rgba(255,255,255,0.1)",
          padding: "6px 14px",
          borderRadius: 100,
          display: "inline",
        },
        {
          id: 2,
          type: "text",
          x: 6,
          y: 40,
          width: 60,
          anchor: "top-left",
          zIndex: 2,
          text: "Build Faster.\nShip With Confidence.",
          fontSize: 44,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.2,
          textAlign: "left",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
        },
        {
          id: 3,
          type: "button",
          x: 6,
          y: 75,
          anchor: "top-left",
          zIndex: 2,
          label: "Get Started Free",
          url: "#",
          bg: "#2563eb",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 700,
          padding: "13px 28px",
          borderRadius: 10,
          style: "filled",
        },
        {
          id: 4,
          type: "button",
          x: 26,
          y: 75,
          anchor: "top-left",
          zIndex: 2,
          label: "Watch Demo",
          url: "#",
          bg: "#ffffff",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          padding: "13px 28px",
          borderRadius: 10,
          style: "outline",
        },
      ],
    },
  },
];

export default function CustomAboutPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const uo = (k, v) => onChange({ overlay: { ...(c.overlay || {}), [k]: v } });

  const [activeTab, setActiveTab] = useState("templates");
  const [expandedBlockId, setExpandedBlockId] = useState(
    c.blocks?.[0]?.id ?? null,
  );
  const canvasRef = useRef(null);
  const dragState = useRef(null);

  const blocks = c.blocks || [];

  const updateBlock = (id, patch) =>
    onChange({
      blocks: blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });

  const deleteBlock = (id) =>
    onChange({ blocks: blocks.filter((b) => b.id !== id) });

  const addBlock = (type) => {
    const base = {
      id: uid(),
      type,
      x: 10,
      y: 10,
      anchor: "top-left",
      zIndex:
        (blocks.length ? Math.max(...blocks.map((b) => b.zIndex || 1)) : 1) + 1,
      hidden: false,
      hiddenMobile: false,
    };
    let extra = {};
    if (type === "text") {
      extra = {
        width: 40,
        text: "New text",
        fontSize: 20,
        fontWeight: 500,
        color: "#ffffff",
        fontFamily: "Inter",
        lineHeight: 1.4,
        textAlign: "left",
        bg: "transparent",
        padding: "0",
        borderRadius: 0,
        display: "block",
      };
    } else if (type === "button") {
      extra = {
        label: "Click Me",
        url: "#",
        bg: "#2563eb",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 600,
        padding: "12px 28px",
        borderRadius: 8,
        style: "filled",
      };
    } else if (type === "image") {
      extra = {
        width: 25,
        src: "",
        alt: "",
        objectFit: "cover",
        borderRadius: 12,
        shadow: true,
      };
    }
    const b = { ...base, ...extra };
    onChange({ blocks: [...blocks, b] });
    setExpandedBlockId(b.id);
  };

  const applyPreset = (preset) => {
    onChange({
      ...preset.config,
      blocks: JSON.parse(JSON.stringify(preset.config.blocks)),
    });
    setExpandedBlockId(preset.config.blocks?.[0]?.id ?? null);
  };

  /* ── Drag handling on the mini canvas ── */
  const startDrag = (e, blockId) => {
    e.preventDefault();
    e.stopPropagation();
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    dragState.current = { blockId, canvasEl };
    setExpandedBlockId(blockId);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onDragMove, { passive: false });
    window.addEventListener("touchend", onDragEnd);
  };

  const getClientXY = (e) => {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const onDragMove = useCallback(
    (e) => {
      if (!dragState.current) return;
      e.preventDefault();
      const { blockId, canvasEl } = dragState.current;
      const rect = canvasEl.getBoundingClientRect();
      const { x: clientX, y: clientY } = getClientXY(e);
      let px = ((clientX - rect.left) / rect.width) * 100;
      let py = ((clientY - rect.top) / rect.height) * 100;
      px = Math.max(0, Math.min(100, px));
      py = Math.max(0, Math.min(100, py));
      updateBlock(blockId, {
        x: Math.round(px * 10) / 10,
        y: Math.round(py * 10) / 10,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [blocks],
  );

  const onDragEnd = useCallback(() => {
    dragState.current = null;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("touchmove", onDragMove);
    window.removeEventListener("touchend", onDragEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDragMove]);

  const previewBgStyle = (() => {
    if (c.bgMediaType === "gradient" && c.bgGradient) {
      return {
        background: `linear-gradient(${c.bgGradient.direction || "to bottom right"}, ${c.bgGradient.from}, ${c.bgGradient.to})`,
      };
    }
    if (c.bgMediaType === "image" && c.bgImage) {
      return {
        backgroundImage: `url(${c.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (c.bgMediaType === "video") {
      return { background: "#111827" };
    }
    return { background: c.bg || "#0f172a" };
  })();

  const overlayPreviewStyle = (() => {
    if (!c.overlay?.enabled) return null;
    if (c.overlay.type === "gradient") {
      return {
        background: `linear-gradient(${c.overlay.gradientDirection || "to top"}, ${c.overlay.gradientFrom || "rgba(0,0,0,0.7)"}, ${c.overlay.gradientTo || "rgba(0,0,0,0.05)"})`,
      };
    }
    return { background: c.overlay.color || "rgba(0,0,0,0.45)" };
  })();

  const tabs = [
    { id: "templates", label: "Templates" },
    { id: "background", label: "Background" },
    { id: "overlay", label: "Overlay" },
    { id: "blocks", label: "Blocks" },
  ];

  const tabStyle = (id) => ({
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 600,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    background: activeTab === id ? "#2563eb" : "transparent",
    color: activeTab === id ? "#fff" : "#64748b",
  });

  return (
    <div className="ed-right-body">
      {/* Tab Nav */}
      <div
        style={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          padding: "8px 4px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: 10,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            style={tabStyle(t.id)}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TEMPLATES ── */}
      {activeTab === "templates" && (
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#94a3b8",
              marginBottom: 10,
              padding: "0 2px",
            }}
          >
            Applying a preset replaces background, overlay, and blocks. You can
            edit everything after.
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                style={{
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "pointer",
                  padding: 0,
                  background: "none",
                  textAlign: "left",
                }}
              >
                <div style={{ height: 48, background: p.preview }} />
                <div
                  style={{
                    padding: "6px 8px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span>{p.emoji}</span>
                  {p.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── BACKGROUND ── */}
      {activeTab === "background" && (
        <div>
          <G>
            <L>Background Type</L>
            <SelectControl
              value={c.bgMediaType || "image"}
              options={[
                { value: "image", label: "Image" },
                { value: "video", label: "Video (looping)" },
                { value: "solid", label: "Solid Color" },
                { value: "gradient", label: "Gradient" },
              ]}
              onChange={(v) => u("bgMediaType", v)}
            />
          </G>
          <D />

          {c.bgMediaType === "video" && (
            <G>
              <L>Video Source</L>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {["upload", "youtube"].map((t) => (
                  <button
                    key={t}
                    onClick={() => u("bgVideoSource", t)}
                    style={{
                      flex: 1,
                      padding: "5px 0",
                      borderRadius: 6,
                      border: "1.5px solid",
                      borderColor:
                        (c.bgVideoSource || "upload") === t
                          ? "#2563eb"
                          : "#e2e8f0",
                      background:
                        (c.bgVideoSource || "upload") === t
                          ? "#eff6ff"
                          : "#fff",
                      color:
                        (c.bgVideoSource || "upload") === t
                          ? "#2563eb"
                          : "#475569",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {t === "upload" ? "Upload File" : "YouTube"}
                  </button>
                ))}
              </div>

              {(c.bgVideoSource || "upload") === "upload" ? (
                <VideoUpload
                  label="Background Video"
                  value={c.bgVideo}
                  onChange={(v) => u("bgVideo", v)}
                  height={110}
                />
              ) : (
                <input
                  className="ctrl-input"
                  value={c.bgVideo || ""}
                  onChange={(e) => u("bgVideo", e.target.value)}
                  placeholder="YouTube URL, e.g. https://youtube.com/watch?v=..."
                  style={{ marginBottom: 6 }}
                />
              )}

              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  marginTop: 6,
                  marginBottom: 8,
                }}
              >
                Plays muted, looped, autoplay. Use a short, seamless clip for
                best results.
              </div>

              <ImageUpload
                label="Fallback Image (shown before video loads)"
                value={c.bgFallbackImage}
                onChange={(v) => u("bgFallbackImage", v)}
                height={90}
              />
            </G>
          )}

          {c.bgMediaType === "image" && (
            <G>
              <ImageUpload
                label="Background Image"
                value={c.bgImage}
                onChange={(v) => u("bgImage", v)}
                height={110}
              />
            </G>
          )}

          {(c.bgMediaType === "solid" || c.bgMediaType === "gradient") && (
            <G>
              <L>Color / Gradient</L>
              <BgControl config={c} onChange={onChange} />
            </G>
          )}

          <D />
          <G>
            <L>Section Height</L>
            <RangeControl
              label="Desktop Min Height"
              value={c.minHeight ?? 480}
              min={200}
              max={900}
              onChange={(v) => u("minHeight", v)}
              unit="px"
            />
            <RangeControl
              label="Mobile Min Height"
              value={c.minHeightMobile ?? 360}
              min={150}
              max={700}
              onChange={(v) => u("minHeightMobile", v)}
              unit="px"
            />
            <RangeControl
              label="Inner Max Width"
              value={c.maxWidthInner ?? 1200}
              min={600}
              max={1600}
              onChange={(v) => u("maxWidthInner", v)}
              unit="px"
            />
          </G>
        </div>
      )}

      {/* ── OVERLAY ── */}
      {activeTab === "overlay" && (
        <div>
          <G>
            <ToggleControl
              label="Enable Overlay"
              value={!!c.overlay?.enabled}
              onChange={(v) => uo("enabled", v)}
            />
          </G>
          {c.overlay?.enabled && (
            <>
              <D />
              <G>
                <L>Overlay Type</L>
                <SelectControl
                  value={c.overlay.type || "solid"}
                  options={[
                    { value: "solid", label: "Solid Color" },
                    { value: "gradient", label: "Gradient" },
                  ]}
                  onChange={(v) => uo("type", v)}
                />
              </G>
              {c.overlay.type === "solid" ? (
                <G>
                  <ColorControl
                    label="Overlay Color (use alpha for transparency)"
                    value={c.overlay.color || "rgba(0,0,0,0.45)"}
                    onChange={(v) => uo("color", v)}
                  />
                  <RangeControl
                    label="Intensity"
                    value={c.overlay.intensity ?? 100}
                    min={0}
                    max={100}
                    onChange={(v) => uo("intensity", v)}
                    unit="%"
                  />
                </G>
              ) : (
                <G>
                  <ColorControl
                    label="Gradient From"
                    value={c.overlay.gradientFrom || "rgba(0,0,0,0.75)"}
                    onChange={(v) => uo("gradientFrom", v)}
                  />
                  <ColorControl
                    label="Gradient To"
                    value={c.overlay.gradientTo || "rgba(0,0,0,0.05)"}
                    onChange={(v) => uo("gradientTo", v)}
                  />
                  <SelectControl
                    label="Direction"
                    value={c.overlay.gradientDirection || "to top"}
                    options={[
                      { value: "to top", label: "Bottom → Top" },
                      { value: "to bottom", label: "Top → Bottom" },
                      { value: "to right", label: "Left → Right" },
                      { value: "to left", label: "Right → Left" },
                      { value: "to bottom right", label: "Diagonal ↘" },
                      { value: "to bottom left", label: "Diagonal ↙" },
                    ]}
                    onChange={(v) => uo("gradientDirection", v)}
                  />
                  <RangeControl
                    label="Intensity"
                    value={c.overlay.intensity ?? 100}
                    min={0}
                    max={100}
                    onChange={(v) => uo("intensity", v)}
                    unit="%"
                  />
                </G>
              )}
            </>
          )}
        </div>
      )}

      {/* ── BLOCKS ── */}
      {activeTab === "blocks" && (
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
            Drag dots to reposition, or use the X/Y fields below for exact
            placement.
          </div>

          {/* Mini drag canvas */}
          <div
            ref={canvasRef}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              marginBottom: 14,
              userSelect: "none",
              ...previewBgStyle,
            }}
          >
            {overlayPreviewStyle && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  ...overlayPreviewStyle,
                }}
              />
            )}
            {blocks.map((b) => {
              const pos = ANCHOR_DOT_POS[b.anchor || "top-left"];
              const isActive = expandedBlockId === b.id;
              return (
                <div
                  key={b.id}
                  onMouseDown={(e) => startDrag(e, b.id)}
                  onTouchStart={(e) => startDrag(e, b.id)}
                  title={b.type}
                  style={{
                    position: "absolute",
                    left: `${b.x ?? 0}%`,
                    top: `${b.y ?? 0}%`,
                    transform: "translate(-50%, -50%)",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: isActive ? "#2563eb" : "#ffffff",
                    border: `2px solid ${isActive ? "#1d4ed8" : "#2563eb"}`,
                    cursor: "grab",
                    zIndex: 10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    color: isActive ? "#fff" : "#2563eb",
                    fontWeight: 700,
                  }}
                >
                  {b.type === "text" ? "T" : b.type === "button" ? "B" : "I"}
                </div>
              );
            })}
          </div>

          {/* Add block buttons */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <button
              onClick={() => addBlock("text")}
              style={{
                flex: 1,
                border: "1px dashed #cbd5e1",
                background: "none",
                borderRadius: 6,
                padding: "6px 0",
                fontSize: 11,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              + Text
            </button>
            <button
              onClick={() => addBlock("button")}
              style={{
                flex: 1,
                border: "1px dashed #cbd5e1",
                background: "none",
                borderRadius: 6,
                padding: "6px 0",
                fontSize: 11,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              + Button
            </button>
            <button
              onClick={() => addBlock("image")}
              style={{
                flex: 1,
                border: "1px dashed #cbd5e1",
                background: "none",
                borderRadius: 6,
                padding: "6px 0",
                fontSize: 11,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              + Image
            </button>
          </div>

          {/* Block list */}
          {blocks.map((b) => {
            const isOpen = expandedBlockId === b.id;
            return (
              <div
                key={b.id}
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
                    padding: "9px 12px",
                    cursor: "pointer",
                    background: isOpen ? "#f1f5f9" : "transparent",
                  }}
                  onClick={() => setExpandedBlockId(isOpen ? null : b.id)}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                  >
                    {b.type === "text"
                      ? "📝"
                      : b.type === "button"
                        ? "🔘"
                        : "🖼"}{" "}
                    {b.type === "text"
                      ? (b.text || "Text").slice(0, 18)
                      : b.type === "button"
                        ? b.label || "Button"
                        : "Image"}
                  </span>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(b.id);
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
                    {/* Position controls — common to all block types */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 9,
                            color: "#94a3b8",
                            marginBottom: 2,
                          }}
                        >
                          X %
                        </div>
                        <input
                          className="ctrl-input"
                          type="number"
                          value={b.x ?? 0}
                          onChange={(e) =>
                            updateBlock(b.id, { x: +e.target.value })
                          }
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 9,
                            color: "#94a3b8",
                            marginBottom: 2,
                          }}
                        >
                          Y %
                        </div>
                        <input
                          className="ctrl-input"
                          type="number"
                          value={b.y ?? 0}
                          onChange={(e) =>
                            updateBlock(b.id, { y: +e.target.value })
                          }
                        />
                      </div>
                      {b.type !== "button" && (
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 9,
                              color: "#94a3b8",
                              marginBottom: 2,
                            }}
                          >
                            Width %
                          </div>
                          <input
                            className="ctrl-input"
                            type="number"
                            value={b.width ?? 30}
                            onChange={(e) =>
                              updateBlock(b.id, { width: +e.target.value })
                            }
                          />
                        </div>
                      )}
                    </div>

                    <SelectControl
                      label="Anchor Point"
                      value={b.anchor || "top-left"}
                      options={ANCHOR_OPTIONS}
                      onChange={(v) => updateBlock(b.id, { anchor: v })}
                    />
                    <RangeControl
                      label="Layer (z-index)"
                      value={b.zIndex ?? 1}
                      min={1}
                      max={20}
                      onChange={(v) => updateBlock(b.id, { zIndex: v })}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 6,
                        marginBottom: 6,
                      }}
                    >
                      <ToggleControl
                        label="Hide Desktop"
                        value={!!b.hidden}
                        onChange={(v) => updateBlock(b.id, { hidden: v })}
                      />
                      <ToggleControl
                        label="Hide Mobile"
                        value={!!b.hiddenMobile}
                        onChange={(v) => updateBlock(b.id, { hiddenMobile: v })}
                      />
                    </div>

                    <D />

                    {/* ── TEXT block fields ── */}
                    {b.type === "text" && (
                      <>
                        <textarea
                          className="ctrl-input"
                          value={b.text || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { text: e.target.value })
                          }
                          placeholder="Text content (use line breaks as needed)"
                          rows={3}
                          style={{ marginBottom: 6, resize: "vertical" }}
                        />
                        <SelectControl
                          label="Font"
                          value={b.fontFamily || "Inter"}
                          options={GOOGLE_FONTS.map((f) => ({
                            value: f,
                            label: f,
                          }))}
                          onChange={(v) => updateBlock(b.id, { fontFamily: v })}
                        />
                        <RangeControl
                          label="Font Size"
                          value={b.fontSize ?? 20}
                          min={10}
                          max={96}
                          onChange={(v) => updateBlock(b.id, { fontSize: v })}
                          unit="px"
                        />
                        <RangeControl
                          label="Font Weight"
                          value={b.fontWeight ?? 500}
                          min={300}
                          max={900}
                          step={100}
                          onChange={(v) => updateBlock(b.id, { fontWeight: v })}
                        />
                        <RangeControl
                          label="Line Height"
                          value={b.lineHeight ?? 1.4}
                          min={0.9}
                          max={2}
                          step={0.05}
                          onChange={(v) => updateBlock(b.id, { lineHeight: v })}
                        />
                        <ColorControl
                          label="Text Color"
                          value={b.color || "#ffffff"}
                          onChange={(v) => updateBlock(b.id, { color: v })}
                        />
                        <SelectControl
                          label="Text Align"
                          value={b.textAlign || "left"}
                          options={[
                            { value: "left", label: "Left" },
                            { value: "center", label: "Center" },
                            { value: "right", label: "Right" },
                          ]}
                          onChange={(v) => updateBlock(b.id, { textAlign: v })}
                        />
                        <D />
                        <L>Badge / Pill Background (optional)</L>
                        <ColorControl
                          label="Background"
                          value={b.bg || "transparent"}
                          onChange={(v) => updateBlock(b.id, { bg: v })}
                        />
                        <input
                          className="ctrl-input"
                          value={b.padding || "0"}
                          onChange={(e) =>
                            updateBlock(b.id, { padding: e.target.value })
                          }
                          placeholder="Padding e.g. 6px 14px"
                          style={{ marginTop: 4, marginBottom: 4 }}
                        />
                        <RangeControl
                          label="Background Border Radius"
                          value={b.borderRadius ?? 0}
                          min={0}
                          max={100}
                          onChange={(v) =>
                            updateBlock(b.id, { borderRadius: v })
                          }
                          unit="px"
                        />
                        <SelectControl
                          label="Display"
                          value={b.display || "block"}
                          options={[
                            { value: "block", label: "Block (full width)" },
                            {
                              value: "inline",
                              label: "Inline (fits content, e.g. badge)",
                            },
                          ]}
                          onChange={(v) => updateBlock(b.id, { display: v })}
                        />
                      </>
                    )}

                    {/* ── BUTTON block fields ── */}
                    {b.type === "button" && (
                      <>
                        <input
                          className="ctrl-input"
                          value={b.label || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { label: e.target.value })
                          }
                          placeholder="Button label"
                          style={{ marginBottom: 4 }}
                        />
                        <input
                          className="ctrl-input"
                          value={b.url || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { url: e.target.value })
                          }
                          placeholder="Button URL"
                          style={{ marginBottom: 6 }}
                        />
                        <SelectControl
                          label="Style"
                          value={b.style || "filled"}
                          options={[
                            { value: "filled", label: "Filled" },
                            { value: "outline", label: "Outline" },
                          ]}
                          onChange={(v) => updateBlock(b.id, { style: v })}
                        />
                        <ColorControl
                          label="Background / Border Color"
                          value={b.bg || "#2563eb"}
                          onChange={(v) => updateBlock(b.id, { bg: v })}
                        />
                        <ColorControl
                          label="Text Color"
                          value={b.color || "#ffffff"}
                          onChange={(v) => updateBlock(b.id, { color: v })}
                        />
                        <SelectControl
                          label="Font"
                          value={b.fontFamily || "Inter"}
                          options={GOOGLE_FONTS.map((f) => ({
                            value: f,
                            label: f,
                          }))}
                          onChange={(v) => updateBlock(b.id, { fontFamily: v })}
                        />
                        <RangeControl
                          label="Font Size"
                          value={b.fontSize ?? 14}
                          min={10}
                          max={28}
                          onChange={(v) => updateBlock(b.id, { fontSize: v })}
                          unit="px"
                        />
                        <input
                          className="ctrl-input"
                          value={b.padding || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { padding: e.target.value })
                          }
                          placeholder="Padding e.g. 12px 28px"
                          style={{ marginTop: 4, marginBottom: 4 }}
                        />
                        <RangeControl
                          label="Border Radius"
                          value={b.borderRadius ?? 8}
                          min={0}
                          max={100}
                          onChange={(v) =>
                            updateBlock(b.id, { borderRadius: v })
                          }
                          unit="px"
                        />
                      </>
                    )}

                    {/* ── IMAGE block fields ── */}
                    {b.type === "image" && (
                      <>
                        <ImageUpload
                          label="Image"
                          value={b.src}
                          onChange={(v) => updateBlock(b.id, { src: v })}
                          height={100}
                        />
                        <input
                          className="ctrl-input"
                          value={b.alt || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { alt: e.target.value })
                          }
                          placeholder="Alt text"
                          style={{ marginBottom: 6 }}
                        />
                        <SelectControl
                          label="Object Fit"
                          value={b.objectFit || "cover"}
                          options={[
                            { value: "cover", label: "Cover" },
                            { value: "contain", label: "Contain" },
                          ]}
                          onChange={(v) => updateBlock(b.id, { objectFit: v })}
                        />
                        <RangeControl
                          label="Border Radius"
                          value={b.borderRadius ?? 12}
                          min={0}
                          max={100}
                          onChange={(v) =>
                            updateBlock(b.id, { borderRadius: v })
                          }
                          unit="px"
                        />
                        <ToggleControl
                          label="Drop Shadow"
                          value={!!b.shadow}
                          onChange={(v) => updateBlock(b.id, { shadow: v })}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
