import { useState, useRef, useCallback } from "react";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import { uid } from "../../../../config/sectionDefaults";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Space Grotesk",
  "Playfair Display",
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

const TEXTURE_OPTIONS = [
  { value: "ribbon", label: "Ribbon (zybo.in style flow)" },
  { value: "waves", label: "Waves" },
  { value: "noise", label: "Gradient Noise" },
  { value: "particles", label: "Particles" },
];

const TRIGGER_OPTIONS = [
  { value: "none", label: "None (static)" },
  { value: "scroll-progress", label: "Scroll Progress (tied to scroll %)" },
  { value: "scroll-in", label: "Scroll In (plays once on enter)" },
];

const EASE_OPTIONS = [
  { value: "power2.out", label: "Smooth Out" },
  { value: "power3.out", label: "Smooth Out (strong)" },
  { value: "back.out(1.4)", label: "Overshoot" },
  { value: "elastic.out(1,0.5)", label: "Elastic" },
  { value: "none", label: "Linear" },
];

const DEFAULT_ANIM = {
  enabled: false,
  trigger: "none",
  from: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
  to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
  ease: "power2.out",
  duration: 0.8,
  delay: 0,
};

/* ─── Prebuilt presets ───
   Each preset configures GL background + blocks (with anim) in one shot.
   "pill-morph" recreates the zybo.in reveal: a pill that's compact at
   scroll-start and expands/settles as you scroll through the section. */
const PRESETS = [
  {
    id: "pill-morph",
    name: "Pill Morph (zybo.in style)",
    emoji: "💊",
    preview: "linear-gradient(135deg,#9ca3af,#374151)",
    config: {
      glTexture: "ribbon",
      glColorA: "#6b7280",
      glColorB: "#1f2937",
      glSpeed: 0.8,
      glDensity: 1.1,
      glOpacity: 1,
      glInteractive: true,
      fallbackBg: "#374151",
      overlay: { enabled: false },
      minHeight: 640,
      minHeightMobile: 480,
      blocks: [
        {
          id: 1,
          type: "shape",
          x: 50,
          y: 55,
          anchor: "center",
          zIndex: 1,
          hidden: false,
          hiddenMobile: false,
          shapeWidth: 520,
          shapeHeight: 120,
          bg: "#dc2626",
          borderRadius: 999,
          shadow: true,
          anim: {
            enabled: true,
            trigger: "scroll-progress",
            from: { x: 0, y: 0, scale: 0.6, rotate: 0, opacity: 1 },
            to: { x: 0, y: 0, scale: 1.15, rotate: 0, opacity: 1 },
            ease: "none",
          },
        },
        {
          id: 2,
          type: "text",
          x: 50,
          y: 55,
          width: 40,
          anchor: "center",
          zIndex: 2,
          hidden: false,
          hiddenMobile: false,
          text: "Into\nReality",
          fontSize: 48,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.1,
          textAlign: "left",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
          anim: {
            enabled: true,
            trigger: "scroll-progress",
            from: { x: -40, y: 0, scale: 0.8, rotate: 0, opacity: 0.6 },
            to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            ease: "none",
          },
        },
        {
          id: 3,
          type: "text",
          x: 50,
          y: 80,
          width: 50,
          anchor: "top-center",
          zIndex: 2,
          hidden: false,
          hiddenMobile: false,
          text: "Turn Your Ideas",
          fontSize: 56,
          fontWeight: 800,
          color: "#0f172a",
          fontFamily: "Inter",
          lineHeight: 1.1,
          textAlign: "center",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
          anim: {
            enabled: true,
            trigger: "scroll-in",
            from: { x: 0, y: 40, scale: 1, rotate: 0, opacity: 0 },
            to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            ease: "power3.out",
            duration: 0.9,
            delay: 0.1,
          },
        },
      ],
    },
  },
  {
    id: "particle-rise",
    name: "Particle Rise",
    emoji: "✨",
    preview: "linear-gradient(135deg,#1e1b4b,#312e81)",
    config: {
      glTexture: "particles",
      glColorA: "#60a5fa",
      glColorB: "#a78bfa",
      glSpeed: 1,
      glDensity: 1.4,
      glOpacity: 1,
      glInteractive: true,
      fallbackBg: "#1e1b4b",
      overlay: {
        enabled: true,
        type: "gradient",
        gradientFrom: "rgba(15,15,35,0.7)",
        gradientTo: "rgba(15,15,35,0.1)",
        gradientDirection: "to bottom",
      },
      minHeight: 600,
      minHeightMobile: 460,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 50,
          y: 42,
          width: 60,
          anchor: "top-center",
          zIndex: 2,
          hidden: false,
          hiddenMobile: false,
          text: "A Universe of Possibility",
          fontSize: 46,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.2,
          textAlign: "center",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
          anim: {
            enabled: true,
            trigger: "scroll-in",
            from: { x: 0, y: 30, scale: 0.95, rotate: 0, opacity: 0 },
            to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            ease: "power2.out",
            duration: 1,
            delay: 0,
          },
        },
        {
          id: 2,
          type: "button",
          x: 50,
          y: 62,
          anchor: "top-center",
          zIndex: 2,
          hidden: false,
          hiddenMobile: false,
          label: "Explore",
          url: "#",
          bg: "#ffffff",
          color: "#1e1b4b",
          fontSize: 14,
          fontWeight: 700,
          padding: "13px 32px",
          borderRadius: 100,
          style: "filled",
          anim: {
            enabled: true,
            trigger: "scroll-in",
            from: { x: 0, y: 20, scale: 1, rotate: 0, opacity: 0 },
            to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            ease: "back.out(1.4)",
            duration: 0.7,
            delay: 0.25,
          },
        },
      ],
    },
  },
  {
    id: "wave-scale",
    name: "Wave Scale-In",
    emoji: "🌊",
    preview: "linear-gradient(135deg,#0c4a6e,#0369a1)",
    config: {
      glTexture: "waves",
      glColorA: "#0c4a6e",
      glColorB: "#38bdf8",
      glSpeed: 1.1,
      glDensity: 1,
      glOpacity: 1,
      glInteractive: true,
      fallbackBg: "#0c4a6e",
      overlay: { enabled: false },
      minHeight: 600,
      minHeightMobile: 460,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 6,
          y: 38,
          width: 55,
          anchor: "top-left",
          zIndex: 2,
          hidden: false,
          hiddenMobile: false,
          text: "Ride The Current",
          fontSize: 50,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "Inter",
          lineHeight: 1.15,
          textAlign: "left",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
          anim: {
            enabled: true,
            trigger: "scroll-progress",
            from: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            to: { x: 30, y: 0, scale: 1.05, rotate: 0, opacity: 1 },
            ease: "none",
          },
        },
      ],
    },
  },
  {
    id: "noise-fade",
    name: "Noise Fade Minimal",
    emoji: "🌫",
    preview: "linear-gradient(135deg,#111827,#1f2937)",
    config: {
      glTexture: "noise",
      glColorA: "#111827",
      glColorB: "#374151",
      glSpeed: 0.5,
      glDensity: 1.2,
      glOpacity: 1,
      glInteractive: false,
      fallbackBg: "#111827",
      overlay: { enabled: false },
      minHeight: 520,
      minHeightMobile: 400,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 50,
          y: 48,
          width: 60,
          anchor: "center",
          zIndex: 2,
          hidden: false,
          hiddenMobile: false,
          text: "Quiet. Considered. Yours.",
          fontSize: 38,
          fontWeight: 600,
          color: "#f1f5f9",
          fontFamily: "Inter",
          lineHeight: 1.3,
          textAlign: "center",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
          anim: {
            enabled: true,
            trigger: "scroll-in",
            from: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0 },
            to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            ease: "power2.out",
            duration: 1.2,
            delay: 0,
          },
        },
      ],
    },
  },
  {
    id: "floating-cta-morph",
    name: "CTA Pill (sliding circle, zybo.in style)",
    emoji: "📌",
    preview: "linear-gradient(135deg,#9ca3af,#dc2626)",
    config: {
      glTexture: "ribbon",
      glColorA: "#9ca3af",
      glColorB: "#374151",
      glSpeed: 0.7,
      glDensity: 1,
      glOpacity: 1,
      glInteractive: true,
      fallbackBg: "#9ca3af",
      overlay: { enabled: false },
      minHeight: 700,
      minHeightMobile: 520,
      blocks: [
        {
          id: 1,
          type: "text",
          x: 50,
          y: 20,
          width: 60,
          anchor: "top-center",
          zIndex: 2,
          hidden: false,
          hiddenMobile: false,
          text: "Turn Your Ideas",
          fontSize: 54,
          fontWeight: 800,
          color: "#0f172a",
          fontFamily: "Inter",
          lineHeight: 1.1,
          textAlign: "center",
          bg: "transparent",
          padding: "0",
          borderRadius: 0,
          display: "block",
          anim: {
            enabled: true,
            trigger: "scroll-in",
            from: { x: 0, y: 30, scale: 1, rotate: 0, opacity: 0 },
            to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            ease: "power2.out",
            duration: 0.9,
            delay: 0,
          },
        },
        {
          // Normal in-flow block — scrolls away with this section like
          // any other block. Only the white circle inside the pill
          // slides left/right, tracking scroll position through this
          // section (handled automatically, not via the generic anim
          // system below — see circleTravel).
          id: 2,
          type: "floatingCta",
          x: 50,
          y: 55,
          anchor: "center",
          zIndex: 5,
          hidden: false,
          hiddenMobile: false,
          eyebrow: "Into",
          label: "Reality",
          subLabel: "CONNECT",
          url: "#contact",
          bg: "#dc2626",
          color: "#ffffff",
          eyebrowColor: "rgba(255,255,255,0.85)",
          circleBg: "#ffffff",
          iconColor: "#0f172a",
          subLabelColor: "#9ca3af",
          fontFamily: "Inter",
          pillWidth: 460,
          pillHeight: 110,
          circleSize: 92,
          circleSizeEnd: 130,
          fontSize: 40,
          eyebrowSize: 14,
          subLabelSize: 11,
          borderRadius: 999,
          padding: "0 12px 0 32px",
          gap: 18,
          shadow: true,
          circleTravel: 220,
          circleScaleSpeed: 0.4,
          anim: { ...DEFAULT_ANIM },
        },
      ],
    },
  },
];

export default function AnimatedHeroPanel({ config: c, onChange }) {
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

  const updateBlockAnim = (id, patch) => {
    const block = blocks.find((b) => b.id === id);
    const anim = { ...DEFAULT_ANIM, ...(block?.anim || {}), ...patch };
    updateBlock(id, { anim });
  };

  const updateBlockAnimVec = (id, key, axis, value) => {
    const block = blocks.find((b) => b.id === id);
    const anim = { ...DEFAULT_ANIM, ...(block?.anim || {}) };
    const vec = { ...(anim[key] || {}), [axis]: value };
    updateBlock(id, { anim: { ...anim, [key]: vec } });
  };

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
      anim: { ...DEFAULT_ANIM },
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
    } else if (type === "shape") {
      extra = {
        shapeWidth: 200,
        shapeHeight: 80,
        bg: "#dc2626",
        borderRadius: 999,
        shadow: true,
      };
    } else if (type === "floatingCta") {
      extra = {
        x: 50,
        y: 50,
        anchor: "center",
        eyebrow: "Into",
        label: "Reality",
        subLabel: "CONNECT",
        url: "#",
        bg: "#dc2626",
        color: "#ffffff",
        circleBg: "#ffffff",
        iconColor: "#0f172a",
        fontFamily: "Inter",
        pillWidth: 420,
        pillHeight: 100,
        circleSize: 84,
        circleSizeEnd: 120,
        fontSize: 36,
        borderRadius: 999,
        padding: "0 12px 0 28px",
        gap: 16,
        shadow: true,
        circleTravel: 180,
        circleScaleSpeed: 0.4,
        anim: { ...DEFAULT_ANIM },
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
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

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

  // No dependency on `blocks` in the closure — reads/writes through refs
  // and always calls onChange with the freshest block list, so dragging
  // never falls behind during a fast mousemove stream.
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
      const nx = Math.round(px * 10) / 10;
      const ny = Math.round(py * 10) / 10;
      const nextBlocks = blocksRef.current.map((b) =>
        b.id === blockId ? { ...b, x: nx, y: ny } : b,
      );
      blocksRef.current = nextBlocks;
      onChange({ blocks: nextBlocks });
    },
    [onChange],
  );

  const onDragEnd = useCallback(() => {
    dragState.current = null;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("touchmove", onDragMove);
    window.removeEventListener("touchend", onDragEnd);
  }, [onDragMove]);

  const previewBgStyle = {
    background: `linear-gradient(135deg, ${c.glColorA || "#0f172a"}, ${c.glColorB || "#1e3a5f"})`,
  };

  const tabs = [
    { id: "templates", label: "Templates" },
    { id: "background", label: "GL Background" },
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
            Applying a preset replaces the GL background and blocks (including
            their animations). Everything stays editable after.
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

      {/* ── GL BACKGROUND ── */}
      {activeTab === "background" && (
        <div>
          <G>
            <L>Texture</L>
            <SelectControl
              value={c.glTexture || "waves"}
              options={TEXTURE_OPTIONS}
              onChange={(v) => u("glTexture", v)}
            />
          </G>
          <D />
          <G>
            <ColorControl
              label="Color A"
              value={c.glColorA || "#0f172a"}
              onChange={(v) => u("glColorA", v)}
            />
            <ColorControl
              label="Color B"
              value={c.glColorB || "#1e3a5f"}
              onChange={(v) => u("glColorB", v)}
            />
          </G>
          <D />
          <G>
            <RangeControl
              label="Animation Speed"
              value={c.glSpeed ?? 1}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) => u("glSpeed", v)}
            />
            <RangeControl
              label="Density"
              value={c.glDensity ?? 1}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) => u("glDensity", v)}
            />
            <RangeControl
              label="Opacity"
              value={c.glOpacity ?? 1}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => u("glOpacity", v)}
            />
          </G>
          <D />
          <G>
            <ToggleControl
              label="Mouse Parallax"
              value={c.glInteractive !== false}
              onChange={(v) => u("glInteractive", v)}
            />
          </G>
          <D />
          <G>
            <L>Fallback Background (shown before WebGL mounts)</L>
            <ColorControl
              label="Fallback Color"
              value={c.fallbackBg || "#0f172a"}
              onChange={(v) => u("fallbackBg", v)}
            />
          </G>
          <D />
          <G>
            <L>Section Height</L>
            <RangeControl
              label="Desktop Min Height"
              value={c.minHeight ?? 640}
              min={300}
              max={1000}
              onChange={(v) => u("minHeight", v)}
              unit="px"
            />
            <RangeControl
              label="Mobile Min Height"
              value={c.minHeightMobile ?? 480}
              min={200}
              max={800}
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
                    value={c.overlay.color || "rgba(0,0,0,0.35)"}
                    onChange={(v) => uo("color", v)}
                  />
                </G>
              ) : (
                <G>
                  <ColorControl
                    label="Gradient From"
                    value={c.overlay.gradientFrom || "rgba(0,0,0,0.6)"}
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
                    ]}
                    onChange={(v) => uo("gradientDirection", v)}
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
            Drag dots to reposition. Click a block to edit content, style, and
            its scroll animation.
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
            {c.overlay?.enabled && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    c.overlay.type === "gradient"
                      ? `linear-gradient(${c.overlay.gradientDirection || "to top"}, ${c.overlay.gradientFrom || "rgba(0,0,0,0.6)"}, ${c.overlay.gradientTo || "rgba(0,0,0,0.05)"})`
                      : c.overlay.color || "rgba(0,0,0,0.35)",
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
                  {b.type === "text"
                    ? "T"
                    : b.type === "button"
                      ? "B"
                      : b.type === "shape"
                        ? "S"
                        : b.type === "floatingCta"
                          ? "📌"
                          : "I"}
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
              onClick={() => addBlock("shape")}
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
              + Shape
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
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <button
              onClick={() => addBlock("floatingCta")}
              style={{
                flex: 1,
                border: "1.5px dashed #dc2626",
                background: "#fef2f2",
                borderRadius: 6,
                padding: "6px 0",
                fontSize: 11,
                fontWeight: 700,
                color: "#dc2626",
                cursor: "pointer",
              }}
              title="Pill button with a circle that slides left/right as you scroll this section"
            >
              📌 + CTA Pill (sliding circle)
            </button>
          </div>

          {/* Block list */}
          {blocks.map((b) => {
            const isOpen = expandedBlockId === b.id;
            const anim = { ...DEFAULT_ANIM, ...(b.anim || {}) };
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
                        : b.type === "shape"
                          ? "▢"
                          : b.type === "floatingCta"
                            ? "📌"
                            : "🖼"}{" "}
                    {b.type === "text"
                      ? (b.text || "Text").slice(0, 18)
                      : b.type === "button"
                        ? b.label || "Button"
                        : b.type === "shape"
                          ? "Shape"
                          : b.type === "floatingCta"
                            ? `${b.label || "CTA Pill"} (sliding circle)`
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
                    {/* Position controls */}
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
                      {(b.type === "text" || b.type === "image") && (
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

                    {/* ── TEXT fields ── */}
                    {b.type === "text" && (
                      <>
                        <textarea
                          className="ctrl-input"
                          value={b.text || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { text: e.target.value })
                          }
                          placeholder="Text content"
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
                      </>
                    )}

                    {/* ── BUTTON fields ── */}
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
                        <ColorControl
                          label="Background"
                          value={b.bg || "#2563eb"}
                          onChange={(v) => updateBlock(b.id, { bg: v })}
                        />
                        <ColorControl
                          label="Text Color"
                          value={b.color || "#ffffff"}
                          onChange={(v) => updateBlock(b.id, { color: v })}
                        />
                      </>
                    )}

                    {/* ── SHAPE fields ── */}
                    {b.type === "shape" && (
                      <>
                        <RangeControl
                          label="Width"
                          value={b.shapeWidth ?? 200}
                          min={20}
                          max={800}
                          onChange={(v) => updateBlock(b.id, { shapeWidth: v })}
                          unit="px"
                        />
                        <RangeControl
                          label="Height"
                          value={b.shapeHeight ?? 80}
                          min={10}
                          max={500}
                          onChange={(v) =>
                            updateBlock(b.id, { shapeHeight: v })
                          }
                          unit="px"
                        />
                        <ColorControl
                          label="Fill Color"
                          value={b.bg || "#dc2626"}
                          onChange={(v) => updateBlock(b.id, { bg: v })}
                        />
                        <RangeControl
                          label="Border Radius"
                          value={b.borderRadius ?? 999}
                          min={0}
                          max={999}
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

                    {/* ── IMAGE fields ── */}
                    {b.type === "image" && (
                      <>
                        <ImageUpload
                          label="Image"
                          value={b.src}
                          onChange={(v) => updateBlock(b.id, { src: v })}
                          height={100}
                        />
                        <ToggleControl
                          label="Drop Shadow"
                          value={!!b.shadow}
                          onChange={(v) => updateBlock(b.id, { shadow: v })}
                        />
                      </>
                    )}

                    {/* ── FLOATING CTA fields ── */}
                    {b.type === "floatingCta" && (
                      <>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#475569",
                            background: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: 6,
                            padding: "6px 8px",
                            marginBottom: 8,
                          }}
                        >
                          This is a normal block — it scrolls away with this
                          section like any other. Only the white circle inside
                          the pill slides left/right, tracking scroll position
                          through THIS section (controlled by "Circle Slide
                          Distance" below, not the generic Scroll Animation
                          section).
                        </div>
                        <input
                          className="ctrl-input"
                          value={b.eyebrow || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { eyebrow: e.target.value })
                          }
                          placeholder="Eyebrow text (e.g. 'Into')"
                          style={{ marginBottom: 4 }}
                        />
                        <input
                          className="ctrl-input"
                          value={b.label || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { label: e.target.value })
                          }
                          placeholder="Main label (e.g. 'Reality')"
                          style={{ marginBottom: 4 }}
                        />
                        <input
                          className="ctrl-input"
                          value={b.subLabel || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { subLabel: e.target.value })
                          }
                          placeholder="Sub label under icon (e.g. 'CONNECT')"
                          style={{ marginBottom: 4 }}
                        />
                        <input
                          className="ctrl-input"
                          value={b.url || ""}
                          onChange={(e) =>
                            updateBlock(b.id, { url: e.target.value })
                          }
                          placeholder="Link URL"
                          style={{ marginBottom: 6 }}
                        />
                        <ColorControl
                          label="Pill Background"
                          value={b.bg || "#dc2626"}
                          onChange={(v) => updateBlock(b.id, { bg: v })}
                        />
                        <ColorControl
                          label="Text Color"
                          value={b.color || "#ffffff"}
                          onChange={(v) => updateBlock(b.id, { color: v })}
                        />
                        <ColorControl
                          label="Circle Background"
                          value={b.circleBg || "#ffffff"}
                          onChange={(v) => updateBlock(b.id, { circleBg: v })}
                        />
                        <ColorControl
                          label="Icon Color"
                          value={b.iconColor || "#0f172a"}
                          onChange={(v) => updateBlock(b.id, { iconColor: v })}
                        />
                        <div style={{ display: "flex", gap: 6 }}>
                          <NumField
                            label="Pill Width"
                            value={b.pillWidth ?? 420}
                            onChange={(v) =>
                              updateBlock(b.id, { pillWidth: v })
                            }
                          />
                          <NumField
                            label="Pill Height"
                            value={b.pillHeight ?? 100}
                            onChange={(v) =>
                              updateBlock(b.id, { pillHeight: v })
                            }
                          />
                        </div>
                        <RangeControl
                          label="Label Font Size"
                          value={b.fontSize ?? 36}
                          min={16}
                          max={64}
                          onChange={(v) => updateBlock(b.id, { fontSize: v })}
                          unit="px"
                        />
                        <ToggleControl
                          label="Drop Shadow"
                          value={!!b.shadow}
                          onChange={(v) => updateBlock(b.id, { shadow: v })}
                        />
                        <D />
                        <L>Circle Size &amp; Animation</L>
                        <div style={{ display: "flex", gap: 6 }}>
                          <NumField
                            label="Start Size"
                            value={b.circleSize ?? 84}
                            onChange={(v) =>
                              updateBlock(b.id, { circleSize: v })
                            }
                          />
                          <NumField
                            label="End Size"
                            value={
                              b.circleSizeEnd ?? (b.circleSize ?? 84) * 1.4
                            }
                            onChange={(v) =>
                              updateBlock(b.id, { circleSizeEnd: v })
                            }
                          />
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#94a3b8",
                            margin: "2px 0 8px",
                          }}
                        >
                          Circle scales as one solid unit from Start Size to End
                          Size (never stretched width vs. height separately).
                        </div>
                        <RangeControl
                          label="Circle Slide Distance"
                          value={b.circleTravel ?? 180}
                          min={0}
                          max={400}
                          onChange={(v) =>
                            updateBlock(b.id, { circleTravel: v })
                          }
                          unit="px"
                        />
                        <div
                          style={{
                            fontSize: 10,
                            color: "#94a3b8",
                            marginTop: 4,
                            marginBottom: 8,
                          }}
                        >
                          The circle starts this many px left of center and
                          slides to this many px right of center as you scroll
                          from the top to the bottom of this section. Set to 0
                          to disable the slide.
                        </div>
                        <RangeControl
                          label="Scale-Up Speed"
                          value={b.circleScaleSpeed ?? 0.4}
                          min={0.1}
                          max={1}
                          step={0.05}
                          onChange={(v) =>
                            updateBlock(b.id, { circleScaleSpeed: v })
                          }
                        />
                        <div
                          style={{
                            fontSize: 10,
                            color: "#94a3b8",
                            marginTop: 4,
                          }}
                        >
                          Lower = circle reaches End Size earlier in the scroll
                          (faster growth). 1.0 = grows at the same pace as the
                          slide, finishing together at the end of the section.
                          0.4 = fully grown by 40% of the way through.
                        </div>
                      </>
                    )}

                    <D />

                    {/* ── ANIMATION (shared across all block types) ── */}
                    <L>Scroll Animation</L>
                    <ToggleControl
                      label="Enable Animation"
                      value={!!anim.enabled}
                      onChange={(v) => updateBlockAnim(b.id, { enabled: v })}
                    />
                    {anim.enabled && (
                      <>
                        <SelectControl
                          label="Trigger"
                          value={anim.trigger}
                          options={TRIGGER_OPTIONS}
                          onChange={(v) =>
                            updateBlockAnim(b.id, { trigger: v })
                          }
                        />

                        {anim.trigger !== "none" && (
                          <>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#94a3b8",
                                margin: "8px 0 4px",
                              }}
                            >
                              FROM (starting state)
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <NumField
                                label="X"
                                value={anim.from.x}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "from", "x", v)
                                }
                              />
                              <NumField
                                label="Y"
                                value={anim.from.y}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "from", "y", v)
                                }
                              />
                              <NumField
                                label="Scale"
                                step={0.05}
                                value={anim.from.scale}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "from", "scale", v)
                                }
                              />
                            </div>
                            <div
                              style={{ display: "flex", gap: 6, marginTop: 6 }}
                            >
                              <NumField
                                label="Rotate"
                                value={anim.from.rotate}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "from", "rotate", v)
                                }
                              />
                              <NumField
                                label="Opacity"
                                step={0.05}
                                value={anim.from.opacity}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "from", "opacity", v)
                                }
                              />
                            </div>

                            <div
                              style={{
                                fontSize: 10,
                                color: "#94a3b8",
                                margin: "10px 0 4px",
                              }}
                            >
                              TO (resting / end state)
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <NumField
                                label="X"
                                value={anim.to.x}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "to", "x", v)
                                }
                              />
                              <NumField
                                label="Y"
                                value={anim.to.y}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "to", "y", v)
                                }
                              />
                              <NumField
                                label="Scale"
                                step={0.05}
                                value={anim.to.scale}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "to", "scale", v)
                                }
                              />
                            </div>
                            <div
                              style={{ display: "flex", gap: 6, marginTop: 6 }}
                            >
                              <NumField
                                label="Rotate"
                                value={anim.to.rotate}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "to", "rotate", v)
                                }
                              />
                              <NumField
                                label="Opacity"
                                step={0.05}
                                value={anim.to.opacity}
                                onChange={(v) =>
                                  updateBlockAnimVec(b.id, "to", "opacity", v)
                                }
                              />
                            </div>

                            {anim.trigger === "scroll-in" && (
                              <div style={{ marginTop: 10 }}>
                                <SelectControl
                                  label="Ease"
                                  value={anim.ease}
                                  options={EASE_OPTIONS}
                                  onChange={(v) =>
                                    updateBlockAnim(b.id, { ease: v })
                                  }
                                />
                                <RangeControl
                                  label="Duration"
                                  value={anim.duration}
                                  min={0.1}
                                  max={3}
                                  step={0.1}
                                  onChange={(v) =>
                                    updateBlockAnim(b.id, { duration: v })
                                  }
                                  unit="s"
                                />
                                <RangeControl
                                  label="Delay"
                                  value={anim.delay}
                                  min={0}
                                  max={2}
                                  step={0.05}
                                  onChange={(v) =>
                                    updateBlockAnim(b.id, { delay: v })
                                  }
                                  unit="s"
                                />
                              </div>
                            )}
                            {anim.trigger === "scroll-progress" && (
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#94a3b8",
                                  marginTop: 8,
                                }}
                              >
                                Tied 1:1 to scroll position through this section
                                — no duration/ease, it scrubs with the
                                scrollbar.
                              </div>
                            )}
                          </>
                        )}
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

function NumField({ label, value, onChange, step = 1 }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 2 }}>
        {label}
      </div>
      <input
        className="ctrl-input"
        type="number"
        step={step}
        value={value ?? 0}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}
