import { useState } from "react";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";
import { uid } from "../../../../config/sectionDefaults";
import { uploadVideo } from "../../../../api/uploadApi";
import { resolveUrl } from "../../../../utils/resolveUrl";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

const TABS = ["Settings", "Slides", "Style", "Presets", "Advanced"];
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

/* ── All Display Modes with descriptions ── */
const DISPLAY_MODES = [
  { value: "fullscreen", label: "Fullscreen" },
  { value: "coverflow", label: "Coverflow" },
  { value: "3d-cards", label: "3D Cards Fan" },
  { value: "stack", label: "3D Stack" },
  { value: "cube", label: "Cube Rotate" },
  { value: "filmstrip", label: "Filmstrip" },
  { value: "tilt", label: "Tilt Gallery" },
  { value: "book", label: "Book Flip" },
  { value: "zoom-blur", label: "Zoom Blur" },
  { value: "diagonal", label: "Diagonal Split" },
  { value: "transparent", label: "Avatar Circle" },
];

/* ── Animated BG options ── */
const ANIM_BG_OPTIONS = [
  { value: "none", label: "None" },
  { value: "particles", label: "✨ Floating Particles" },
  { value: "gradient-shift", label: "🌊 Gradient Shift" },
  { value: "stars", label: "⭐ Star Field" },
  { value: "bubbles", label: "🫧 Bubbles" },
  { value: "grid-pulse", label: "⬛ Grid Pulse" },
  { value: "aurora", label: "🌌 Aurora" },
  { value: "matrix", label: "💻 Matrix Rain" },
  { value: "fireworks", label: "🎆 Fireworks" },
];

/* ── Transition options ── */
const TRANSITION_OPTIONS = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "slide-up", label: "Slide Up" },
  { value: "zoom", label: "Zoom" },
  { value: "flip", label: "Flip" },
  { value: "blur", label: "Blur" },
];

/* ══════════════════════════════════════════════════════
   PRESETS — each unique look + own config
══════════════════════════════════════════════════════ */
const PRESETS = [
  {
    key: "cinematic-hero",
    label: "🎬 Cinematic Hero",
    desc: "Full viewport, fade, strong overlay",
    thumb: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",
    config: {
      displayMode: "fullscreen",
      transition: "fade",
      transitionSpeed: 900,
      autoplay: true,
      autoplayDelay: 5000,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "circle",
      arrowBg: "rgba(255,255,255,0.12)",
      arrowColor: "#fff",
      arrowSize: 48,
      showDots: true,
      dotStyle: "pill",
      dotColor: "#fff",
      dotPosition: "bottom",
      showProgress: true,
      progressColor: "#fff",
      showCounter: false,
      heightMode: "full",
      headingWeight: "800",
      textShadow: "strong",
      animatedBg: "none",
      bgColor: "#0f172a",
    },
  },
  {
    key: "coverflow",
    label: "🎠 Coverflow",
    desc: "Rotated side cards, center raised",
    thumb: "linear-gradient(135deg,#fdf2f8 0%,#ede9fe 100%)",
    config: {
      displayMode: "coverflow",
      transition: "fade",
      transitionSpeed: 500,
      autoplay: true,
      autoplayDelay: 4000,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "square",
      arrowBg: "#fff",
      arrowColor: "#374151",
      arrowSize: 42,
      showDots: true,
      dotStyle: "number",
      dotColor: "#374151",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: false,
      heightMode: "min",
      minHeight: 420,
      headingWeight: "700",
      textShadow: "none",
      cardBorderRadius: 16,
      cardGap: 32,
      animatedBg: "none",
      bgColor: "#fdf2f8",
    },
  },
  {
    key: "3d-fan",
    label: "🃏 3D Cards Fan",
    desc: "Perspective fan with depth",
    thumb: "linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%)",
    config: {
      displayMode: "3d-cards",
      transition: "slide",
      transitionSpeed: 500,
      autoplay: true,
      autoplayDelay: 3500,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "circle",
      arrowBg: "rgba(255,255,255,0.2)",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "circle",
      dotColor: "#a78bfa",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: true,
      heightMode: "min",
      minHeight: 520,
      headingWeight: "700",
      textShadow: "soft",
      cardScale: 80,
      cardGap: 40,
      cardBorderRadius: 16,
      animatedBg: "gradient-shift",
      animatedBgColor1: "#1e1b4b",
      animatedBgColor2: "#4c1d95",
      bgColor: "#1e1b4b",
    },
  },
  {
    key: "stack-3d",
    label: "📚 3D Stack",
    desc: "Cards stacked behind with rotation",
    thumb: "linear-gradient(135deg,#064e3b 0%,#065f46 100%)",
    config: {
      displayMode: "stack",
      transition: "zoom",
      transitionSpeed: 550,
      autoplay: true,
      autoplayDelay: 4000,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "circle",
      arrowBg: "rgba(255,255,255,0.15)",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "circle",
      dotColor: "#34d399",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: true,
      heightMode: "min",
      minHeight: 520,
      headingWeight: "700",
      textShadow: "soft",
      cardBorderRadius: 20,
      stackOffset: 14,
      animatedBg: "particles",
      particleColor: "rgba(52,211,153,0.4)",
      particleCount: 30,
      animatedBgColor1: "#064e3b",
      animatedBgColor2: "#065f46",
      bgColor: "#052e16",
    },
  },
  {
    key: "cube-rotate",
    label: "🎲 Cube Rotate",
    desc: "3D cube face transition",
    thumb: "linear-gradient(135deg,#7c3aed 0%,#db2777 100%)",
    config: {
      displayMode: "cube",
      transition: "fade",
      transitionSpeed: 700,
      autoplay: true,
      autoplayDelay: 4500,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "minimal",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "line",
      dotColor: "#f0abfc",
      dotPosition: "bottom",
      showProgress: true,
      progressColor: "#f0abfc",
      showCounter: false,
      heightMode: "full",
      headingWeight: "800",
      textShadow: "strong",
      animatedBg: "aurora",
      bgColor: "#1a0533",
    },
  },
  {
    key: "filmstrip",
    label: "🎞 Filmstrip",
    desc: "Cinema film roll with perforations",
    thumb: "linear-gradient(135deg,#18181b 0%,#3f3f46 100%)",
    config: {
      displayMode: "filmstrip",
      transition: "slide",
      transitionSpeed: 400,
      autoplay: true,
      autoplayDelay: 3000,
      loop: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "square",
      arrowBg: "rgba(255,255,255,0.1)",
      arrowColor: "#fff",
      arrowSize: 40,
      showDots: true,
      dotStyle: "circle",
      dotColor: "#f59e0b",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: false,
      heightMode: "min",
      minHeight: 480,
      headingWeight: "800",
      textShadow: "strong",
      cardBorderRadius: 8,
      animatedBg: "none",
      bgColor: "#18181b",
    },
  },
  {
    key: "tilt-gallery",
    label: "🎨 Tilt Gallery",
    desc: "Cards tilted with stagger depth",
    thumb: "linear-gradient(135deg,#0c4a6e 0%,#0369a1 100%)",
    config: {
      displayMode: "tilt",
      transition: "fade",
      transitionSpeed: 550,
      autoplay: true,
      autoplayDelay: 4000,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "circle",
      arrowBg: "rgba(255,255,255,0.15)",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "pill",
      dotColor: "#38bdf8",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: true,
      heightMode: "min",
      minHeight: 500,
      headingWeight: "700",
      textShadow: "soft",
      cardBorderRadius: 16,
      animatedBg: "stars",
      particleColor: "rgba(186,230,253,0.7)",
      particleCount: 50,
      animatedBgColor1: "#0c4a6e",
      bgColor: "#082f49",
    },
  },
  {
    key: "book-flip",
    label: "📖 Book Flip",
    desc: "Page turn effect with spine",
    thumb: "linear-gradient(135deg,#78350f 0%,#b45309 100%)",
    config: {
      displayMode: "book",
      transition: "fade",
      transitionSpeed: 700,
      autoplay: true,
      autoplayDelay: 5000,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "square",
      arrowBg: "rgba(255,255,255,0.15)",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "circle",
      dotColor: "#fbbf24",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: true,
      heightMode: "min",
      minHeight: 500,
      headingWeight: "700",
      textShadow: "soft",
      animatedBg: "none",
      bgColor: "#451a03",
    },
  },
  {
    key: "zoom-blur",
    label: "🔍 Zoom Blur",
    desc: "Active zooms, others blur out",
    thumb: "linear-gradient(135deg,#134e4a 0%,#0f766e 100%)",
    config: {
      displayMode: "zoom-blur",
      transition: "blur",
      transitionSpeed: 600,
      autoplay: true,
      autoplayDelay: 4500,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "circle",
      arrowBg: "rgba(255,255,255,0.12)",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "line",
      dotColor: "#2dd4bf",
      dotPosition: "bottom",
      showProgress: true,
      progressColor: "#2dd4bf",
      showCounter: false,
      heightMode: "min",
      minHeight: 560,
      headingWeight: "800",
      textShadow: "strong",
      animatedBg: "bubbles",
      particleColor: "rgba(45,212,191,0.3)",
      particleCount: 25,
      animatedBgColor1: "#134e4a",
      bgColor: "#042f2e",
    },
  },
  {
    key: "diagonal-split",
    label: "⚡ Diagonal Split",
    desc: "Diagonal reveal transition",
    thumb: "linear-gradient(135deg,#831843 0%,#9f1239 50%,#1e1b4b 100%)",
    config: {
      displayMode: "diagonal",
      transition: "fade",
      transitionSpeed: 700,
      autoplay: true,
      autoplayDelay: 4000,
      loop: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "minimal",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "pill",
      dotColor: "#fb7185",
      dotPosition: "bottom",
      showProgress: true,
      progressColor: "#fb7185",
      showCounter: false,
      heightMode: "full",
      headingWeight: "800",
      textShadow: "strong",
      animatedBg: "none",
      bgColor: "#1e1b4b",
    },
  },
  {
    key: "avatar-circle",
    label: "👤 Avatar Circle",
    desc: "Circular cards, label below",
    thumb: "linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)",
    config: {
      displayMode: "transparent",
      transition: "slide",
      transitionSpeed: 400,
      autoplay: true,
      autoplayDelay: 3000,
      loop: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "minimal",
      arrowColor: "#334155",
      arrowSize: 40,
      showDots: true,
      dotStyle: "circle",
      dotColor: "#0284c7",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: false,
      heightMode: "min",
      minHeight: 440,
      headingWeight: "600",
      textShadow: "none",
      cardBorderRadius: 999,
      cardScale: 80,
      cardGap: 20,
      animatedBg: "none",
      bgColor: "#f0f9ff",
    },
  },
  {
    key: "particles-hero",
    label: "✨ Particle Hero",
    desc: "Dark fullscreen with particles",
    thumb: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",
    config: {
      displayMode: "fullscreen",
      transition: "fade",
      transitionSpeed: 1000,
      autoplay: true,
      autoplayDelay: 6000,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "circle",
      arrowBg: "rgba(255,255,255,0.1)",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "line",
      dotColor: "#a78bfa",
      dotPosition: "bottom",
      showProgress: true,
      progressColor: "#a78bfa",
      showCounter: false,
      heightMode: "full",
      headingWeight: "800",
      textShadow: "strong",
      animatedBg: "particles",
      animatedBgColor1: "#0f0c29",
      animatedBgColor2: "#302b63",
      particleColor: "rgba(167,139,250,0.7)",
      particleCount: 60,
      bgColor: "#0f0c29",
    },
  },
  {
    key: "matrix-cyber",
    label: "💻 Matrix Cyber",
    desc: "Matrix rain background",
    thumb: "linear-gradient(135deg,#000 0%,#001a00 100%)",
    config: {
      displayMode: "fullscreen",
      transition: "blur",
      transitionSpeed: 700,
      autoplay: true,
      autoplayDelay: 5000,
      loop: true,
      pauseOnHover: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "square",
      arrowBg: "rgba(0,255,0,0.15)",
      arrowColor: "#0f0",
      arrowSize: 44,
      showDots: true,
      dotStyle: "line",
      dotColor: "#00ff00",
      dotPosition: "bottom",
      showProgress: true,
      progressColor: "#00ff00",
      showCounter: false,
      heightMode: "min",
      minHeight: 560,
      headingWeight: "800",
      textShadow: "strong",
      animatedBg: "matrix",
      particleColor: "#00ff41",
      bgColor: "#000",
    },
  },
  {
    key: "gradient-wave",
    label: "🌊 Gradient Wave",
    desc: "Shifting gradient background",
    thumb: "linear-gradient(135deg,#06b6d4 0%,#3b82f6 50%,#8b5cf6 100%)",
    config: {
      displayMode: "fullscreen",
      transition: "slide-up",
      transitionSpeed: 700,
      autoplay: true,
      autoplayDelay: 5000,
      loop: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "minimal",
      arrowColor: "#fff",
      arrowSize: 44,
      showDots: true,
      dotStyle: "pill",
      dotColor: "#fff",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: false,
      heightMode: "min",
      minHeight: 600,
      headingWeight: "800",
      textShadow: "soft",
      animatedBg: "gradient-shift",
      animatedBgColor1: "#06b6d4",
      animatedBgColor2: "#8b5cf6",
      bgColor: "#06b6d4",
    },
  },
  {
    key: "minimal-clean",
    label: "🤍 Minimal Clean",
    desc: "White, no effects, elegant",
    thumb: "linear-gradient(135deg,#fff 0%,#f1f5f9 100%)",
    config: {
      displayMode: "fullscreen",
      transition: "fade",
      transitionSpeed: 600,
      autoplay: false,
      loop: true,
      swipe: true,
      showArrows: true,
      arrowStyle: "square",
      arrowBg: "#fff",
      arrowColor: "#0f172a",
      arrowSize: 44,
      showDots: true,
      dotStyle: "line",
      dotColor: "#0f172a",
      dotPosition: "bottom",
      showProgress: false,
      showCounter: true,
      heightMode: "min",
      minHeight: 560,
      headingWeight: "800",
      textShadow: "none",
      animatedBg: "none",
      bgColor: "#f8fafc",
    },
  },
];

/* ── Per-mode control sections ── */
function ModeControls({ c, u }) {
  const mode = c.displayMode || "fullscreen";
  const cardModes = ["coverflow", "3d-cards", "stack", "tilt", "transparent"];
  const hasCardControls = cardModes.includes(mode);

  if (
    mode === "fullscreen" ||
    mode === "zoom-blur" ||
    mode === "diagonal" ||
    mode === "cube" ||
    mode === "book"
  ) {
    return (
      <G>
        <L>Transition Effect</L>
        <SelectControl
          label="Effect"
          value={c.transition || "fade"}
          options={[
            { value: "fade", label: "Fade" },
            { value: "slide", label: "Slide" },
            { value: "slide-up", label: "Slide Up" },
            { value: "zoom", label: "Zoom" },
            { value: "flip", label: "Flip" },
            { value: "blur", label: "Blur" },
          ]}
          onChange={(v) => u("transition", v)}
        />
        <RangeControl
          label="Speed"
          value={c.transitionSpeed || 600}
          min={150}
          max={2000}
          onChange={(v) => u("transitionSpeed", v)}
          unit="ms"
        />
      </G>
    );
  }

  if (mode === "filmstrip") {
    return (
      <G>
        <L>Filmstrip</L>
        <RangeControl
          label="Card Border Radius"
          value={c.cardBorderRadius ?? 8}
          min={0}
          max={32}
          onChange={(v) => u("cardBorderRadius", v)}
          unit="px"
        />
      </G>
    );
  }

  if (hasCardControls) {
    return (
      <G>
        <L>Card Controls</L>
        {(mode === "coverflow" || mode === "3d-cards" || mode === "tilt") && (
          <>
            <RangeControl
              label="Side Card Scale"
              value={c.cardScale || 80}
              min={50}
              max={95}
              onChange={(v) => u("cardScale", v)}
              unit="%"
            />
            <RangeControl
              label="Card Gap"
              value={c.cardGap || 40}
              min={10}
              max={120}
              onChange={(v) => u("cardGap", v)}
              unit="px"
            />
          </>
        )}
        <RangeControl
          label="Card Border Radius"
          value={c.cardBorderRadius ?? 16}
          min={0}
          max={999}
          onChange={(v) => u("cardBorderRadius", v)}
          unit="px"
        />
        {mode === "stack" && (
          <RangeControl
            label="Stack Offset"
            value={c.stackOffset || 12}
            min={4}
            max={30}
            onChange={(v) => u("stackOffset", v)}
            unit="px"
          />
        )}
      </G>
    );
  }
  return null;
}

export default function CarouselPanel({ config: c, onChange }) {
  const [tab, setTab] = useState(0);
  const [openSlide, setOpenSlide] = useState(null);
  const [videoUploading, setVideoUploading] = useState({});
  const [videoUploadError, setVideoUploadError] = useState({});
  const [presetConfirm, setPresetConfirm] = useState(null);

  const u = (k, v) => onChange({ [k]: v });
  const us = (id, patch) =>
    onChange({
      slides: (c.slides || []).map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    });
  const usb = (id, patch) =>
    onChange({
      slides: (c.slides || []).map((s) =>
        s.id === id ? { ...s, button: { ...s.button, ...patch } } : s,
      ),
    });
  const us2 = (id, patch) =>
    onChange({
      slides: (c.slides || []).map((s) =>
        s.id === id ? { ...s, button2: { ...s.button2, ...patch } } : s,
      ),
    });

  const applyPreset = (preset) => {
    onChange({ ...preset.config });
    setPresetConfirm(preset.key);
    setTimeout(() => setPresetConfirm(null), 2000);
  };

  const addSlide = () =>
    onChange({
      slides: [
        ...(c.slides || []),
        {
          id: uid(),
          mediaType: "image",
          image: "",
          video: "",
          videoMuted: true,
          videoLoop: true,
          videoAutoplay: true,
          overlay: "rgba(0,0,0,0.4)",
          overlayEnabled: true,
          overlayOpacity: 40,
          heading: "New Slide",
          headingColor: "#fff",
          headingSize: 52,
          subheading: "Subheading text",
          subheadingColor: "rgba(255,255,255,0.8)",
          subheadingSize: 18,
          contentAlign: "center",
          contentValign: "center",
          paddingX: 60,
          paddingY: 0,
          buttonPosition: "inline",
          button: {
            show: true,
            label: "Explore",
            url: "#",
            bg: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            size: "md",
            variant: "solid",
          },
          button2: {
            show: false,
            label: "Learn More",
            url: "#",
            bg: "transparent",
            color: "#fff",
            borderRadius: 8,
            size: "md",
            variant: "outline",
          },
        },
      ],
    });

  const delSlide = (id) =>
    onChange({ slides: (c.slides || []).filter((s) => s.id !== id) });
  const dupSlide = (slide) =>
    onChange({ slides: [...(c.slides || []), { ...slide, id: uid() }] });

  return (
    <div className="ed-right-body" style={{ padding: 0 }}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {TABS.map((t, i) => (
          <TabBtn key={t} active={tab === i} onClick={() => setTab(i)}>
            {t}
          </TabBtn>
        ))}
      </div>

      <div style={{ padding: "12px 12px 24px" }}>
        {/* ── SETTINGS ── */}
        {tab === 0 && (
          <>
            <G>
              <L>Display Mode</L>
              <SelectControl
                label="Mode"
                value={c.displayMode || "fullscreen"}
                options={DISPLAY_MODES}
                onChange={(v) => u("displayMode", v)}
              />
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                {PRESETS.find(
                  (p) =>
                    p.config.displayMode === (c.displayMode || "fullscreen"),
                )?.desc || ""}
              </div>
            </G>
            <D />
            <ModeControls c={c} u={u} />
            <D />
            <G>
              <L>Dimensions</L>
              <RangeControl
                label="Min Height"
                value={c.minHeight || 600}
                min={200}
                max={1200}
                onChange={(v) => u("minHeight", v)}
                unit="px"
              />
              <SelectControl
                label="Height Mode"
                value={c.heightMode || "min"}
                options={[
                  { value: "min", label: "Min Height" },
                  { value: "full", label: "Full Viewport" },
                  { value: "fixed", label: "Fixed px" },
                ]}
                onChange={(v) => u("heightMode", v)}
              />
            </G>
            <D />
            <G>
              <L>Animated Background</L>
              <SelectControl
                label="Effect"
                value={c.animatedBg || "none"}
                options={ANIM_BG_OPTIONS}
                onChange={(v) => u("animatedBg", v)}
              />
              {c.animatedBg && c.animatedBg !== "none" && (
                <>
                  <ColorControl
                    label="Bg Color 1"
                    value={c.animatedBgColor1 || "#0f172a"}
                    onChange={(v) => u("animatedBgColor1", v)}
                  />
                  <ColorControl
                    label="Bg Color 2"
                    value={c.animatedBgColor2 || "#1e293b"}
                    onChange={(v) => u("animatedBgColor2", v)}
                  />
                  {[
                    "particles",
                    "bubbles",
                    "stars",
                    "matrix",
                    "fireworks",
                  ].includes(c.animatedBg) && (
                    <>
                      <RangeControl
                        label="Count"
                        value={c.particleCount || 40}
                        min={5}
                        max={150}
                        onChange={(v) => u("particleCount", v)}
                        unit=""
                      />
                      <ColorControl
                        label="Particle Color"
                        value={c.particleColor || "rgba(255,255,255,0.6)"}
                        onChange={(v) => u("particleColor", v)}
                      />
                    </>
                  )}
                </>
              )}
              <ColorControl
                label="Section Bg Color"
                value={c.bgColor || "#0f172a"}
                onChange={(v) => u("bgColor", v)}
              />
            </G>
            <D />
            <G>
              <L>Playback</L>
              <ToggleControl
                label="Autoplay"
                value={!!c.autoplay}
                onChange={(v) => u("autoplay", v)}
              />
              {c.autoplay && (
                <RangeControl
                  label="Delay"
                  value={c.autoplayDelay || 4000}
                  min={1000}
                  max={15000}
                  onChange={(v) => u("autoplayDelay", v)}
                  unit="ms"
                />
              )}
              <ToggleControl
                label="Loop"
                value={!!c.loop}
                onChange={(v) => u("loop", v)}
              />
              <ToggleControl
                label="Pause on Hover"
                value={!!c.pauseOnHover}
                onChange={(v) => u("pauseOnHover", v)}
              />
              <ToggleControl
                label="Swipe / Drag"
                value={!!c.swipe}
                onChange={(v) => u("swipe", v)}
              />
            </G>
            <D />
            <G>
              <L>Navigation</L>
              <ToggleControl
                label="Show Arrows"
                value={!!c.showArrows}
                onChange={(v) => u("showArrows", v)}
              />
              {c.showArrows && (
                <>
                  <SelectControl
                    label="Arrow Style"
                    value={c.arrowStyle || "circle"}
                    options={[
                      { value: "circle", label: "Circle" },
                      { value: "square", label: "Square" },
                      { value: "minimal", label: "Minimal" },
                    ]}
                    onChange={(v) => u("arrowStyle", v)}
                  />
                  <RangeControl
                    label="Arrow Size"
                    value={c.arrowSize || 44}
                    min={28}
                    max={72}
                    onChange={(v) => u("arrowSize", v)}
                    unit="px"
                  />
                  <ColorControl
                    label="Arrow Bg"
                    value={c.arrowBg || "rgba(255,255,255,0.15)"}
                    onChange={(v) => u("arrowBg", v)}
                  />
                  <ColorControl
                    label="Arrow Color"
                    value={c.arrowColor || "#fff"}
                    onChange={(v) => u("arrowColor", v)}
                  />
                </>
              )}
              <ToggleControl
                label="Show Dots"
                value={!!c.showDots}
                onChange={(v) => u("showDots", v)}
              />
              {c.showDots && (
                <>
                  <SelectControl
                    label="Dot Style"
                    value={c.dotStyle || "pill"}
                    options={[
                      { value: "pill", label: "Pill" },
                      { value: "circle", label: "Circle" },
                      { value: "line", label: "Line" },
                      { value: "number", label: "Number" },
                    ]}
                    onChange={(v) => u("dotStyle", v)}
                  />
                  <ColorControl
                    label="Dot Color"
                    value={c.dotColor || "#2563eb"}
                    onChange={(v) => u("dotColor", v)}
                  />
                  <SelectControl
                    label="Dot Position"
                    value={c.dotPosition || "bottom"}
                    options={[
                      { value: "bottom", label: "Bottom" },
                      { value: "top", label: "Top" },
                      { value: "left", label: "Left" },
                      { value: "right", label: "Right" },
                    ]}
                    onChange={(v) => u("dotPosition", v)}
                  />
                </>
              )}
              <ToggleControl
                label="Show Progress Bar"
                value={!!c.showProgress}
                onChange={(v) => u("showProgress", v)}
              />
              {c.showProgress && (
                <ColorControl
                  label="Progress Color"
                  value={c.progressColor || "#2563eb"}
                  onChange={(v) => u("progressColor", v)}
                />
              )}
              <ToggleControl
                label="Show Counter"
                value={!!c.showCounter}
                onChange={(v) => u("showCounter", v)}
              />
            </G>
          </>
        )}

        {/* ── SLIDES ── */}
        {tab === 1 && (
          <G>
            <L>Slides ({(c.slides || []).length})</L>
            {(c.slides || []).map((slide, i) => (
              <div
                key={slide.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  marginBottom: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  onClick={() =>
                    setOpenSlide(openSlide === slide.id ? null : slide.id)
                  }
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 10px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
                  >
                    {openSlide === slide.id ? "▾" : "▸"} Slide {i + 1}
                    {slide.heading
                      ? ` — ${slide.heading.slice(0, 20)}${slide.heading.length > 20 ? "…" : ""}`
                      : ""}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dupSlide(slide);
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                      title="Duplicate"
                    >
                      ⧉
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        delSlide(slide.id);
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
                  </div>
                </div>

                {openSlide === slide.id && (
                  <div style={{ padding: "0 10px 12px" }}>
                    {/* Media toggle */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      {["image", "video"].map((mt) => (
                        <button
                          key={mt}
                          onClick={() => us(slide.id, { mediaType: mt })}
                          style={{
                            flex: 1,
                            padding: "5px 0",
                            fontSize: 11,
                            fontWeight: 600,
                            borderRadius: 6,
                            border: "1.5px solid",
                            borderColor:
                              (slide.mediaType || "image") === mt
                                ? "#2563eb"
                                : "#e2e8f0",
                            background:
                              (slide.mediaType || "image") === mt
                                ? "#eff6ff"
                                : "#fff",
                            color:
                              (slide.mediaType || "image") === mt
                                ? "#2563eb"
                                : "#64748b",
                            cursor: "pointer",
                          }}
                        >
                          {mt === "image" ? "🖼 Image" : "🎬 Video"}
                        </button>
                      ))}
                    </div>

                    {(slide.mediaType || "image") === "image" ? (
                      <ImageUpload
                        label="Background Image"
                        value={slide.image}
                        onChange={(v) => us(slide.id, { image: v })}
                        height={80}
                      />
                    ) : (
                      <>
                        <div style={{ marginBottom: 8 }}>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#94a3b8",
                              marginBottom: 4,
                            }}
                          >
                            UPLOAD VIDEO FILE
                          </div>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              width: "100%",
                              padding: "10px 0",
                              border: "1.5px dashed #cbd5e1",
                              borderRadius: 8,
                              background: "#f8fafc",
                              cursor: "pointer",
                              fontSize: 11,
                              color: "#64748b",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#2563eb";
                              e.currentTarget.style.color = "#2563eb";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.color = "#64748b";
                            }}
                          >
                            {videoUploading[slide.id]
                              ? "⏳ Uploading..."
                              : "🎬 Upload Video (mp4/webm)"}
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime"
                              style={{ display: "none" }}
                              disabled={!!videoUploading[slide.id]}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setVideoUploading((p) => ({
                                  ...p,
                                  [slide.id]: true,
                                }));
                                setVideoUploadError((p) => ({
                                  ...p,
                                  [slide.id]: "",
                                }));
                                try {
                                  const { url } = await uploadVideo(file);
                                  us(slide.id, { video: url });
                                } catch {
                                  setVideoUploadError((p) => ({
                                    ...p,
                                    [slide.id]: "Upload failed. Try again.",
                                  }));
                                } finally {
                                  setVideoUploading((p) => ({
                                    ...p,
                                    [slide.id]: false,
                                  }));
                                  e.target.value = "";
                                }
                              }}
                            />
                          </label>
                          {videoUploadError[slide.id] && (
                            <div
                              style={{
                                fontSize: 10,
                                color: "#ef4444",
                                marginTop: 4,
                              }}
                            >
                              {videoUploadError[slide.id]}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#94a3b8",
                            marginBottom: 4,
                          }}
                        >
                          OR PASTE URL (YouTube / Vimeo / mp4)
                        </div>
                        <input
                          className="ctrl-input"
                          value={slide.video || ""}
                          onChange={(e) =>
                            us(slide.id, { video: e.target.value })
                          }
                          placeholder="https://... or YouTube/Vimeo URL"
                          style={{ marginBottom: 5 }}
                        />
                        {slide.video &&
                          !slide.video.includes("youtu") &&
                          !slide.video.includes("vimeo") && (
                            <video
                              src={resolveUrl(slide.video)}
                              style={{
                                width: "100%",
                                borderRadius: 6,
                                marginBottom: 8,
                                maxHeight: 80,
                                objectFit: "cover",
                              }}
                              muted
                              playsInline
                            />
                          )}
                        <ToggleControl
                          label="Muted"
                          value={slide.videoMuted !== false}
                          onChange={(v) => us(slide.id, { videoMuted: v })}
                        />
                        <ToggleControl
                          label="Loop"
                          value={slide.videoLoop !== false}
                          onChange={(v) => us(slide.id, { videoLoop: v })}
                        />
                        <ToggleControl
                          label="Autoplay"
                          value={slide.videoAutoplay !== false}
                          onChange={(v) => us(slide.id, { videoAutoplay: v })}
                        />
                        <ToggleControl
                          label="Show Controls"
                          value={!!slide.videoControls}
                          onChange={(v) => us(slide.id, { videoControls: v })}
                        />
                      </>
                    )}

                    {/* Overlay */}
                    <div style={{ marginTop: 8 }}>
                      <ToggleControl
                        label="Enable Overlay"
                        value={slide.overlayEnabled !== false}
                        onChange={(v) => us(slide.id, { overlayEnabled: v })}
                      />
                      {slide.overlayEnabled !== false && (
                        <>
                          <RangeControl
                            label="Overlay Opacity"
                            value={slide.overlayOpacity ?? 40}
                            min={0}
                            max={100}
                            onChange={(v) =>
                              us(slide.id, { overlayOpacity: v })
                            }
                            unit="%"
                          />
                          <ColorControl
                            label="Overlay Color"
                            value={slide.overlay || "rgba(0,0,0,0.4)"}
                            onChange={(v) => us(slide.id, { overlay: v })}
                          />
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        marginTop: 8,
                        paddingTop: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        CONTENT
                      </div>
                      <input
                        className="ctrl-input"
                        value={slide.heading || ""}
                        onChange={(e) =>
                          us(slide.id, { heading: e.target.value })
                        }
                        placeholder="Heading"
                        style={{ marginBottom: 5 }}
                      />
                      <ColorControl
                        label="Heading Color"
                        value={slide.headingColor || "#fff"}
                        onChange={(v) => us(slide.id, { headingColor: v })}
                      />
                      <RangeControl
                        label="Heading Size"
                        value={slide.headingSize || 52}
                        min={20}
                        max={100}
                        onChange={(v) => us(slide.id, { headingSize: v })}
                        unit="px"
                      />
                      <input
                        className="ctrl-input"
                        value={slide.subheading || ""}
                        onChange={(e) =>
                          us(slide.id, { subheading: e.target.value })
                        }
                        placeholder="Subheading"
                        style={{ marginBottom: 5 }}
                      />
                      <ColorControl
                        label="Subheading Color"
                        value={slide.subheadingColor || "rgba(255,255,255,0.8)"}
                        onChange={(v) => us(slide.id, { subheadingColor: v })}
                      />
                      <RangeControl
                        label="Subheading Size"
                        value={slide.subheadingSize || 18}
                        min={12}
                        max={40}
                        onChange={(v) => us(slide.id, { subheadingSize: v })}
                        unit="px"
                      />
                    </div>

                    {/* Alignment */}
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        marginTop: 8,
                        paddingTop: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        ALIGNMENT
                      </div>
                      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                        {["left", "center", "right"].map((a) => (
                          <button
                            key={a}
                            onClick={() => us(slide.id, { contentAlign: a })}
                            style={{
                              flex: 1,
                              padding: "4px 0",
                              fontSize: 10,
                              borderRadius: 5,
                              border: "1.5px solid",
                              cursor: "pointer",
                              borderColor:
                                (slide.contentAlign || "center") === a
                                  ? "#2563eb"
                                  : "#e2e8f0",
                              background:
                                (slide.contentAlign || "center") === a
                                  ? "#eff6ff"
                                  : "#fff",
                              color:
                                (slide.contentAlign || "center") === a
                                  ? "#2563eb"
                                  : "#94a3b8",
                            }}
                          >
                            {a === "left" ? "⬅" : a === "center" ? "↔" : "➡"}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                        {["top", "center", "bottom"].map((a) => (
                          <button
                            key={a}
                            onClick={() => us(slide.id, { contentValign: a })}
                            style={{
                              flex: 1,
                              padding: "4px 0",
                              fontSize: 10,
                              borderRadius: 5,
                              border: "1.5px solid",
                              cursor: "pointer",
                              borderColor:
                                (slide.contentValign || "center") === a
                                  ? "#2563eb"
                                  : "#e2e8f0",
                              background:
                                (slide.contentValign || "center") === a
                                  ? "#eff6ff"
                                  : "#fff",
                              color:
                                (slide.contentValign || "center") === a
                                  ? "#2563eb"
                                  : "#94a3b8",
                            }}
                          >
                            {a === "top" ? "⬆" : a === "center" ? "↕" : "⬇"}
                          </button>
                        ))}
                      </div>
                      <RangeControl
                        label="Padding X"
                        value={slide.paddingX ?? 60}
                        min={0}
                        max={200}
                        onChange={(v) => us(slide.id, { paddingX: v })}
                        unit="px"
                      />
                      <RangeControl
                        label="Padding Y"
                        value={slide.paddingY ?? 0}
                        min={0}
                        max={200}
                        onChange={(v) => us(slide.id, { paddingY: v })}
                        unit="px"
                      />
                      <RangeControl
                        label="Max Content Width"
                        value={slide.maxWidth || 700}
                        min={300}
                        max={1200}
                        onChange={(v) => us(slide.id, { maxWidth: v })}
                        unit="px"
                      />
                    </div>

                    {/* Primary Button */}
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        marginTop: 8,
                        paddingTop: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        PRIMARY BUTTON
                      </div>
                      <ToggleControl
                        label="Show"
                        value={!!slide.button?.show}
                        onChange={(v) => usb(slide.id, { show: v })}
                      />
                      {slide.button?.show && (
                        <>
                          <input
                            className="ctrl-input"
                            value={slide.button.label || ""}
                            onChange={(e) =>
                              usb(slide.id, { label: e.target.value })
                            }
                            placeholder="Label"
                            style={{ marginBottom: 5 }}
                          />
                          <input
                            className="ctrl-input"
                            value={slide.button.url || ""}
                            onChange={(e) =>
                              usb(slide.id, { url: e.target.value })
                            }
                            placeholder="URL"
                            style={{ marginBottom: 5 }}
                          />
                          <SelectControl
                            label="Variant"
                            value={slide.button.variant || "solid"}
                            options={[
                              { value: "solid", label: "Solid" },
                              { value: "outline", label: "Outline" },
                              { value: "ghost", label: "Ghost" },
                            ]}
                            onChange={(v) => usb(slide.id, { variant: v })}
                          />
                          <SelectControl
                            label="Size"
                            value={slide.button.size || "md"}
                            options={[
                              { value: "sm", label: "Small" },
                              { value: "md", label: "Medium" },
                              { value: "lg", label: "Large" },
                            ]}
                            onChange={(v) => usb(slide.id, { size: v })}
                          />
                          <ColorControl
                            label="Bg"
                            value={slide.button.bg || "#2563eb"}
                            onChange={(v) => usb(slide.id, { bg: v })}
                          />
                          <ColorControl
                            label="Text"
                            value={slide.button.color || "#fff"}
                            onChange={(v) => usb(slide.id, { color: v })}
                          />
                          <RangeControl
                            label="Radius"
                            value={slide.button.borderRadius || 8}
                            min={0}
                            max={40}
                            onChange={(v) => usb(slide.id, { borderRadius: v })}
                            unit="px"
                          />
                          <ToggleControl
                            label="Open in new tab"
                            value={!!slide.button.newTab}
                            onChange={(v) => usb(slide.id, { newTab: v })}
                          />
                          <SelectControl
                            label="Button Position"
                            value={slide.buttonPosition || "inline"}
                            options={[
                              { value: "inline", label: "With Content" },
                              { value: "bottom-left", label: "Bottom Left" },
                              {
                                value: "bottom-center",
                                label: "Bottom Center",
                              },
                              { value: "bottom-right", label: "Bottom Right" },
                              { value: "top-left", label: "Top Left" },
                              { value: "top-right", label: "Top Right" },
                            ]}
                            onChange={(v) =>
                              us(slide.id, { buttonPosition: v })
                            }
                          />
                        </>
                      )}
                    </div>

                    {/* Secondary Button */}
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        marginTop: 8,
                        paddingTop: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        SECONDARY BUTTON
                      </div>
                      <ToggleControl
                        label="Show"
                        value={!!slide.button2?.show}
                        onChange={(v) => us2(slide.id, { show: v })}
                      />
                      {slide.button2?.show && (
                        <>
                          <input
                            className="ctrl-input"
                            value={slide.button2.label || ""}
                            onChange={(e) =>
                              us2(slide.id, { label: e.target.value })
                            }
                            placeholder="Label"
                            style={{ marginBottom: 5 }}
                          />
                          <input
                            className="ctrl-input"
                            value={slide.button2.url || ""}
                            onChange={(e) =>
                              us2(slide.id, { url: e.target.value })
                            }
                            placeholder="URL"
                            style={{ marginBottom: 5 }}
                          />
                          <SelectControl
                            label="Variant"
                            value={slide.button2.variant || "outline"}
                            options={[
                              { value: "solid", label: "Solid" },
                              { value: "outline", label: "Outline" },
                              { value: "ghost", label: "Ghost" },
                            ]}
                            onChange={(v) => us2(slide.id, { variant: v })}
                          />
                          <ColorControl
                            label="Bg"
                            value={slide.button2.bg || "transparent"}
                            onChange={(v) => us2(slide.id, { bg: v })}
                          />
                          <ColorControl
                            label="Text"
                            value={slide.button2.color || "#fff"}
                            onChange={(v) => us2(slide.id, { color: v })}
                          />
                          <RangeControl
                            label="Radius"
                            value={slide.button2.borderRadius || 8}
                            min={0}
                            max={40}
                            onChange={(v) => us2(slide.id, { borderRadius: v })}
                            unit="px"
                          />
                          <ToggleControl
                            label="Open in new tab"
                            value={!!slide.button2.newTab}
                            onChange={(v) => us2(slide.id, { newTab: v })}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addSlide}
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
              + Add Slide
            </button>
          </G>
        )}

        {/* ── STYLE ── */}
        {tab === 2 && (
          <>
            <G>
              <L>Typography</L>
              <SelectControl
                label="Heading Weight"
                value={c.headingWeight || "800"}
                options={[
                  { value: "400", label: "Regular" },
                  { value: "600", label: "Semibold" },
                  { value: "700", label: "Bold" },
                  { value: "800", label: "Extrabold" },
                ]}
                onChange={(v) => u("headingWeight", v)}
              />
              <SelectControl
                label="Text Shadow"
                value={c.textShadow || "soft"}
                options={[
                  { value: "none", label: "None" },
                  { value: "soft", label: "Soft" },
                  { value: "strong", label: "Strong" },
                ]}
                onChange={(v) => u("textShadow", v)}
              />
            </G>
            <D />
            <G>
              <L>Global Overlay</L>
              <RangeControl
                label="Global Overlay"
                value={c.globalOverlay ?? 0}
                min={0}
                max={100}
                onChange={(v) => u("globalOverlay", v)}
                unit="%"
              />
            </G>
          </>
        )}

        {/* ── PRESETS ── */}
        {tab === 3 && (
          <G>
            <L>One-Click Presets ({PRESETS.length})</L>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
              Each preset has a unique look. Slides are kept.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p)}
                  style={{
                    border:
                      presetConfirm === p.key
                        ? "2px solid #22c55e"
                        : "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    background: "#fff",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: 0,
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                >
                  <div style={{ height: 48, background: p.thumb }} />
                  <div style={{ padding: "6px 8px" }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: presetConfirm === p.key ? "#16a34a" : "#374151",
                      }}
                    >
                      {presetConfirm === p.key ? "✓ Applied!" : p.label}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}
                    >
                      {p.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </G>
        )}

        {/* ── ADVANCED ── */}
        {tab === 4 && (
          <>
            <G>
              <L>Responsive</L>
              <RangeControl
                label="Mobile Min Height"
                value={c.mobileMinHeight || 320}
                min={200}
                max={800}
                onChange={(v) => u("mobileMinHeight", v)}
                unit="px"
              />
              <RangeControl
                label="Mobile Heading Scale"
                value={c.mobileHeadingScale || 55}
                min={30}
                max={100}
                onChange={(v) => u("mobileHeadingScale", v)}
                unit="%"
              />
              <RangeControl
                label="Mobile Padding X"
                value={c.mobilePaddingX || 20}
                min={0}
                max={80}
                onChange={(v) => u("mobilePaddingX", v)}
                unit="px"
              />
              <ToggleControl
                label="Hide Arrows on Mobile"
                value={!!c.hideArrowsMobile}
                onChange={(v) => u("hideArrowsMobile", v)}
              />
              <ToggleControl
                label="Hide Dots on Mobile"
                value={!!c.hideDotsMobile}
                onChange={(v) => u("hideDotsMobile", v)}
              />
            </G>
            <D />
            <G>
              <L>Accessibility</L>
              <ToggleControl
                label="Keyboard Navigation"
                value={c.keyboardNav !== false}
                onChange={(v) => u("keyboardNav", v)}
              />
              <ToggleControl
                label="Reduce Motion"
                value={!!c.reduceMotion}
                onChange={(v) => u("reduceMotion", v)}
              />
            </G>
            <D />
            <G>
              <L>Misc</L>
              <ToggleControl
                label="Lazy Load Images"
                value={c.lazyLoad !== false}
                onChange={(v) => u("lazyLoad", v)}
              />
              <RangeControl
                label="Z-Index"
                value={c.zIndex || 0}
                min={0}
                max={100}
                onChange={(v) => u("zIndex", v)}
                unit=""
              />
            </G>
          </>
        )}
      </div>
    </div>
  );
}
