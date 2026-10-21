import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";
import { uid } from "../../../../config/sectionDefaults";
import { useState } from "react";
import { uploadLogo } from "../../../../api/uploadApi";
import { resolveUrl } from "../../../../utils/resolveUrl";

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Source Sans 3",
  "DM Sans",
  "Plus Jakarta Sans",
  "Outfit",
  "Syne",
];
const HAMBURGER_STYLES = [
  { value: "slide", label: "Slide" },
  { value: "fade", label: "Fade" },
  { value: "squeeze", label: "Squeeze" },
  { value: "spin", label: "Spin" },
];
const PRESETS = {
  modern: {
    label: "Modern",
    emoji: "💼",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#0f172a",
    linkColor: "#374151",
    accentColor: "#2563eb",
    shadow: true,
    borderBottom: false,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#2563eb",
      to: "#7c3aed",
      direction: "to right",
      intensity: 100,
    },
  },
  darkpro: {
    label: "Dark Pro",
    emoji: "🌑",
    bg: "#0f172a",
    bgType: "solid",
    textColor: "#f8fafc",
    linkColor: "#cbd5e1",
    accentColor: "#60a5fa",
    shadow: false,
    borderBottom: false,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 32,
    borderRadius: 0,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#0f172a",
      to: "#1e293b",
      direction: "to right",
      intensity: 100,
    },
  },
  minimal: {
    label: "Minimal",
    emoji: "🤍",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#111827",
    linkColor: "#6b7280",
    accentColor: "#111827",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 60,
    logoPosition: "left",
    linksPosition: "right",
    linkFontSize: 13,
    linkFontWeight: 400,
    linkSpacing: 32,
    borderRadius: 0,
    fontFamily: "DM Sans",
    logoFontFamily: "DM Sans",
    logo: { fontSize: 20, fontWeight: 600 },
    bgGradient: {
      from: "#ffffff",
      to: "#f1f5f9",
      direction: "to right",
      intensity: 100,
    },
  },
  glass: {
    label: "Glass",
    emoji: "🪟",
    bg: "rgba(255,255,255,0.7)",
    bgType: "solid",
    textColor: "#0f172a",
    linkColor: "#374151",
    accentColor: "#2563eb",
    shadow: true,
    borderBottom: false,
    backdropBlur: true,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#ffffff",
      to: "#e0e7ff",
      direction: "to right",
      intensity: 70,
    },
  },
  startup: {
    label: "Startup",
    emoji: "🚀",
    bg: "#7c3aed",
    bgType: "gradient",
    textColor: "#ffffff",
    linkColor: "rgba(255,255,255,0.85)",
    accentColor: "#ffffff",
    shadow: true,
    borderBottom: false,
    backdropBlur: false,
    height: 68,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 600,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Plus Jakarta Sans",
    logoFontFamily: "Plus Jakarta Sans",
    logo: { fontSize: 24, fontWeight: 800 },
    bgGradient: {
      from: "#7c3aed",
      to: "#ec4899",
      direction: "to right",
      intensity: 100,
    },
  },
  agency: {
    label: "Agency",
    emoji: "🔥",
    bg: "#ea580c",
    bgType: "gradient",
    textColor: "#ffffff",
    linkColor: "rgba(255,255,255,0.9)",
    accentColor: "#fef08a",
    shadow: true,
    borderBottom: false,
    backdropBlur: false,
    height: 68,
    logoPosition: "left",
    linksPosition: "right",
    linkFontSize: 13,
    linkFontWeight: 600,
    linkSpacing: 24,
    borderRadius: 0,
    fontFamily: "Syne",
    logoFontFamily: "Syne",
    logo: { fontSize: 24, fontWeight: 800 },
    bgGradient: {
      from: "#ea580c",
      to: "#dc2626",
      direction: "to right",
      intensity: 100,
    },
  },
  corporate: {
    label: "Corporate",
    emoji: "🏢",
    bg: "#1e3a5f",
    bgType: "gradient",
    textColor: "#ffffff",
    linkColor: "rgba(255,255,255,0.85)",
    accentColor: "#93c5fd",
    shadow: true,
    borderBottom: false,
    backdropBlur: false,
    height: 70,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 13,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Lato",
    logoFontFamily: "Lato",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#1e3a5f",
      to: "#2563eb",
      direction: "to right",
      intensity: 100,
    },
  },
  neon: {
    label: "Neon",
    emoji: "⚡",
    bg: "#020617",
    bgType: "gradient",
    textColor: "#ffffff",
    linkColor: "#86efac",
    accentColor: "#4ade80",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 13,
    linkFontWeight: 600,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Outfit",
    logoFontFamily: "Outfit",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#020617",
      to: "#052e16",
      direction: "to right",
      intensity: 100,
    },
  },
  ocean: {
    label: "Ocean",
    emoji: "🌊",
    bg: "#0369a1",
    bgType: "gradient",
    textColor: "#ffffff",
    linkColor: "rgba(255,255,255,0.9)",
    accentColor: "#e0f2fe",
    shadow: true,
    borderBottom: false,
    backdropBlur: false,
    height: 68,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Nunito",
    logoFontFamily: "Nunito",
    logo: { fontSize: 24, fontWeight: 800 },
    bgGradient: {
      from: "#0369a1",
      to: "#06b6d4",
      direction: "to bottom right",
      intensity: 100,
    },
  },
  ecommerce: {
    label: "Shop",
    emoji: "🛒",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#111827",
    linkColor: "#374151",
    accentColor: "#f59e0b",
    shadow: true,
    borderBottom: false,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 13,
    linkFontWeight: 500,
    linkSpacing: 24,
    borderRadius: 0,
    fontFamily: "Poppins",
    logoFontFamily: "Poppins",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#ffffff",
      to: "#fef9c3",
      direction: "to right",
      intensity: 100,
    },
  },
  // ── NEW PRESETS ───────────────────────────────────────────────────────────
  centered: {
    label: "Centered",
    emoji: "⊕",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#0f172a",
    linkColor: "#475569",
    accentColor: "#2563eb",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 72,
    logoPosition: "center",
    linksPosition: "center",
    linkFontSize: 13,
    linkFontWeight: 500,
    linkSpacing: 32,
    borderRadius: 0,
    fontFamily: "Raleway",
    logoFontFamily: "Raleway",
    logo: { fontSize: 26, fontWeight: 800 },
    bgGradient: {
      from: "#ffffff",
      to: "#f1f5f9",
      direction: "to right",
      intensity: 100,
    },
  },
  bold: {
    label: "Bold",
    emoji: "💪",
    bg: "#09090b",
    bgType: "solid",
    textColor: "#fafafa",
    linkColor: "#a1a1aa",
    accentColor: "#f97316",
    shadow: false,
    borderBottom: false,
    backdropBlur: false,
    height: 72,
    logoPosition: "left",
    linksPosition: "right",
    linkFontSize: 13,
    linkFontWeight: 700,
    linkSpacing: 24,
    borderRadius: 0,
    fontFamily: "Syne",
    logoFontFamily: "Syne",
    logo: { fontSize: 28, fontWeight: 800 },
    bgGradient: {
      from: "#09090b",
      to: "#18181b",
      direction: "to right",
      intensity: 100,
    },
  },
  elegant: {
    label: "Elegant",
    emoji: "✨",
    bg: "#faf7f2",
    bgType: "solid",
    textColor: "#1c1917",
    linkColor: "#78716c",
    accentColor: "#b45309",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 76,
    logoPosition: "center",
    linksPosition: "center",
    linkFontSize: 13,
    linkFontWeight: 400,
    linkSpacing: 36,
    borderRadius: 0,
    fontFamily: "Playfair Display",
    logoFontFamily: "Playfair Display",
    logo: { fontSize: 26, fontWeight: 700 },
    bgGradient: {
      from: "#faf7f2",
      to: "#f5f0e8",
      direction: "to right",
      intensity: 100,
    },
  },
  saas: {
    label: "SaaS",
    emoji: "💻",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#0f172a",
    linkColor: "#475569",
    accentColor: "#6366f1",
    shadow: false,
    borderBottom: false,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Plus Jakarta Sans",
    logoFontFamily: "Plus Jakarta Sans",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#6366f1",
      to: "#8b5cf6",
      direction: "to right",
      intensity: 100,
    },
  },
  frosted: {
    label: "Frosted",
    emoji: "❄️",
    bg: "rgba(15,23,42,0.6)",
    bgType: "solid",
    textColor: "#f8fafc",
    linkColor: "rgba(255,255,255,0.75)",
    accentColor: "#38bdf8",
    shadow: false,
    borderBottom: false,
    backdropBlur: true,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#0f172a",
      to: "#1e293b",
      direction: "to right",
      intensity: 60,
    },
  },
  creative: {
    label: "Creative",
    emoji: "🎨",
    bg: "#fdf2f8",
    bgType: "solid",
    textColor: "#701a75",
    linkColor: "#a21caf",
    accentColor: "#d946ef",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 68,
    logoPosition: "left",
    linksPosition: "right",
    linkFontSize: 14,
    linkFontWeight: 600,
    linkSpacing: 24,
    borderRadius: 0,
    fontFamily: "Outfit",
    logoFontFamily: "Outfit",
    logo: { fontSize: 24, fontWeight: 800 },
    bgGradient: {
      from: "#fdf2f8",
      to: "#fae8ff",
      direction: "to right",
      intensity: 100,
    },
  },
  retro: {
    label: "Retro",
    emoji: "📼",
    bg: "#1a1a2e",
    bgType: "solid",
    textColor: "#e2e2e2",
    linkColor: "#e2e2e2",
    accentColor: "#e94560",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 13,
    linkFontWeight: 700,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Syne",
    logoFontFamily: "Syne",
    logo: { fontSize: 22, fontWeight: 800 },
    bgGradient: {
      from: "#1a1a2e",
      to: "#16213e",
      direction: "to right",
      intensity: 100,
    },
    borderColor: "#e94560",
  },
  nature: {
    label: "Nature",
    emoji: "🌿",
    bg: "#f0fdf4",
    bgType: "solid",
    textColor: "#14532d",
    linkColor: "#166534",
    accentColor: "#16a34a",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Nunito",
    logoFontFamily: "Nunito",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#f0fdf4",
      to: "#dcfce7",
      direction: "to right",
      intensity: 100,
    },
  },
  luxury: {
    label: "Luxury",
    emoji: "👑",
    bg: "#18110a",
    bgType: "solid",
    textColor: "#d4af6a",
    linkColor: "#c9a84c",
    accentColor: "#f0c040",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 76,
    logoPosition: "center",
    linksPosition: "center",
    linkFontSize: 13,
    linkFontWeight: 400,
    linkSpacing: 40,
    borderRadius: 0,
    fontFamily: "Playfair Display",
    logoFontFamily: "Playfair Display",
    logo: { fontSize: 26, fontWeight: 700 },
    bgGradient: {
      from: "#18110a",
      to: "#2c1a0e",
      direction: "to right",
      intensity: 100,
    },
    borderColor: "#d4af6a",
  },
  tech: {
    label: "Tech",
    emoji: "🤖",
    bg: "#0a0a0a",
    bgType: "gradient",
    textColor: "#ffffff",
    linkColor: "#a0a0a0",
    accentColor: "#00ff87",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "right",
    linkFontSize: 13,
    linkFontWeight: 600,
    linkSpacing: 24,
    borderRadius: 0,
    fontFamily: "DM Sans",
    logoFontFamily: "DM Sans",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#0a0a0a",
      to: "#0d1117",
      direction: "to right",
      intensity: 100,
    },
    borderColor: "#1a1a1a",
  },

  floating_pill: {
    label: "Floating Pill",
    emoji: "💊",
    navbarStyle: "floating",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#0f172a",
    linkColor: "#374151",
    accentColor: "#e11d48",
    shadow: true,
    borderBottom: false,
    backdropBlur: false,
    height: 56,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 999,
    floatingMarginTop: 20,
    floatingMaxWidth: 680,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#ffffff",
      to: "#f1f5f9",
      direction: "to right",
      intensity: 100,
    },
  },
  side_panel: {
    label: "Side Panel",
    emoji: "◧",
    navbarStyle: "side-panel",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#0f172a",
    linkColor: "#374151",
    accentColor: "#e11d48",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 64,
    logoPosition: "left",
    linksPosition: "right",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    sidePanelBg: "#000000",
    sidePanelTextColor: "#ffffff",
    sidePanelPosition: "right",
    sidePanelWidth: 340,
    sidePanelFontSize: 36,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#ffffff",
      to: "#f1f5f9",
      direction: "to right",
      intensity: 100,
    },
  },
  split_nav: {
    label: "Split Nav",
    emoji: "⟺",
    navbarStyle: "standard",
    bg: "#ffffff",
    bgType: "solid",
    textColor: "#0f172a",
    linkColor: "#374151",
    accentColor: "#2563eb",
    shadow: false,
    borderBottom: true,
    backdropBlur: false,
    height: 64,
    logoPosition: "center",
    linksPosition: "split",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    fontFamily: "Raleway",
    logoFontFamily: "Raleway",
    logo: { fontSize: 24, fontWeight: 800 },
    bgGradient: {
      from: "#ffffff",
      to: "#f1f5f9",
      direction: "to right",
      intensity: 100,
    },
  },
  floating_dark: {
    label: "Float Dark",
    emoji: "🌙",
    navbarStyle: "floating",
    bg: "#0f172a",
    bgType: "solid",
    textColor: "#f8fafc",
    linkColor: "#cbd5e1",
    accentColor: "#60a5fa",
    shadow: true,
    borderBottom: false,
    backdropBlur: true,
    height: 56,
    logoPosition: "left",
    linksPosition: "center",
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 999,
    floatingMarginTop: 20,
    floatingMaxWidth: 680,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    logo: { fontSize: 22, fontWeight: 700 },
    bgGradient: {
      from: "#0f172a",
      to: "#1e293b",
      direction: "to right",
      intensity: 100,
    },
  },
};
const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

export default function NavbarPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ul = (patch) => onChange({ logo: { ...c.logo, ...patch } });
  const up = (patch) => onChange({ padding: { ...c.padding, ...patch } });
  const ug = (patch) => onChange({ bgGradient: { ...c.bgGradient, ...patch } });

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoUploading(true);
    setLogoError("");
    try {
      const data = await uploadLogo(file);
      ul({ imageUrl: data.url, useImage: true });
    } catch {
      setLogoError("Upload failed.");
    } finally {
      setLogoUploading(false);
    }
  };

  const applyPreset = (key) => {
    const p = PRESETS[key];
    onChange({
      preset: key,
      bg: p.bg,
      bgType: p.bgType,
      bgGradient: p.bgGradient,
      textColor: p.textColor,
      linkColor: p.linkColor,
      accentColor: p.accentColor,
      shadow: p.shadow,
      borderBottom: p.borderBottom,
      backdropBlur: p.backdropBlur,
      height: p.height,
      logoPosition: p.logoPosition,
      linksPosition: p.linksPosition,
      linkFontSize: p.linkFontSize,
      linkFontWeight: p.linkFontWeight,
      linkSpacing: p.linkSpacing,
      fontFamily: p.fontFamily,
      logoFontFamily: p.logoFontFamily,
      borderColor: p.borderColor || "#e2e8f0",
      // NEW fields
      navbarStyle: p.navbarStyle || "standard",
      floatingMarginTop: p.floatingMarginTop || 20,
      floatingMaxWidth: p.floatingMaxWidth || 680,
      sidePanelBg: p.sidePanelBg || "#000000",
      sidePanelTextColor: p.sidePanelTextColor || "#ffffff",
      sidePanelPosition: p.sidePanelPosition || "right",
      sidePanelWidth: p.sidePanelWidth || 340,
      sidePanelFontSize: p.sidePanelFontSize || 36,
      links: c.links,
      buttons: c.buttons,
      logo: {
        ...c.logo,
        color: p.textColor,
        iconColor: p.accentColor,
        fontSize: p.logo?.fontSize || c.logo.fontSize,
        fontWeight: p.logo?.fontWeight || c.logo.fontWeight,
      },
      hamburgerColor: p.textColor,
    });
  };
  const addLink = () =>
    onChange({
      links: [
        ...c.links,
        {
          id: uid(),
          label: "New Link",
          url: "#",
          hasSubmenu: false,
          children: [],
        },
      ],
    });
  const updateLink = (lid, patch) =>
    onChange({
      links: c.links.map((l) => (l.id === lid ? { ...l, ...patch } : l)),
    });
  const removeLink = (lid) =>
    onChange({ links: c.links.filter((l) => l.id !== lid) });
  const addSubmenuItem = (lid) =>
    onChange({
      links: c.links.map((l) =>
        l.id === lid
          ? {
              ...l,
              hasSubmenu: true,
              children: [
                ...l.children,
                { id: uid(), label: "Sub Item", url: "#" },
              ],
            }
          : l,
      ),
    });
  const updateSubmenuItem = (lid, cid, patch) =>
    onChange({
      links: c.links.map((l) =>
        l.id === lid
          ? {
              ...l,
              children: l.children.map((ch) =>
                ch.id === cid ? { ...ch, ...patch } : ch,
              ),
            }
          : l,
      ),
    });
  const removeSubmenuItem = (lid, cid) =>
    onChange({
      links: c.links.map((l) =>
        l.id === lid
          ? { ...l, children: l.children.filter((ch) => ch.id !== cid) }
          : l,
      ),
    });
  const addButton = () =>
    onChange({
      buttons: [
        ...c.buttons,
        {
          id: uid(),
          label: "Button",
          url: "#",
          style: "filled",
          bg: c.accentColor,
          color: "#fff",
          borderRadius: 8,
          size: "md",
        },
      ],
    });
  const updateButton = (bid, patch) =>
    onChange({
      buttons: c.buttons.map((b) => (b.id === bid ? { ...b, ...patch } : b)),
    });
  const removeButton = (bid) =>
    onChange({ buttons: c.buttons.filter((b) => b.id !== bid) });

  const [tab, setTab] = useState("style");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #f1f5f9",
          flexShrink: 0,
        }}
      >
        {["presets", "style", "links", "buttons", "layout"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: tab === t ? "#2563eb" : "#94a3b8",
              padding: "10px 4px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              borderBottom: `2px solid ${tab === t ? "#2563eb" : "transparent"}`,
              textTransform: "capitalize",
              transition: "all 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="ed-right-body">
        {/* ── PRESETS TAB ── */}
        {tab === "presets" && (
          <>
            <G>
              <L>Click any preset to apply instantly</L>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {Object.entries(PRESETS).map(([key, p]) => (
                  <div
                    key={key}
                    onClick={() => applyPreset(key)}
                    style={{
                      border: `2px solid ${c.preset === key ? "#2563eb" : "#e2e8f0"}`,
                      borderRadius: 10,
                      overflow: "hidden",
                      cursor: "pointer",
                      background: c.preset === key ? "#eff6ff" : "#fff",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (c.preset !== key) {
                        e.currentTarget.style.borderColor = "#93c5fd";
                        e.currentTarget.style.background = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (c.preset !== key) {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.background = "#fff";
                      }
                    }}
                  >
                    {/* Preview bar */}
                    <div
                      style={{
                        height: 32,
                        background:
                          p.bgType === "gradient"
                            ? `linear-gradient(${p.bgGradient.direction}, ${p.bgGradient.from}, ${p.bgGradient.to})`
                            : p.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          p.logoPosition === "center"
                            ? "center"
                            : "space-between",
                        padding: "0 8px",
                        gap: 4,
                      }}
                    >
                      {/* Mini logo */}
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: p.logo?.fontWeight || 700,
                          color: p.textColor,
                          fontFamily: p.fontFamily,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.emoji} Brand
                      </div>
                      {/* Mini links */}
                      {p.logoPosition !== "center" && (
                        <div style={{ display: "flex", gap: 4 }}>
                          {["Home", "About", "Work"].map((l) => (
                            <div
                              key={l}
                              style={{
                                fontSize: 7,
                                color: p.linkColor,
                                fontWeight: p.linkFontWeight,
                                fontFamily: p.fontFamily,
                              }}
                            >
                              {l}
                            </div>
                          ))}
                        </div>
                      )}
                      {p.logoPosition === "center" && (
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        >
                          {["Home", "About"].map((l) => (
                            <div
                              key={l}
                              style={{ fontSize: 7, color: p.linkColor }}
                            >
                              {l}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Mini button */}
                      <div
                        style={{
                          fontSize: 7,
                          background: p.accentColor,
                          color:
                            p.bgType === "solid" && p.bg === "#ffffff"
                              ? "#fff"
                              : p.bg,
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        CTA
                      </div>
                    </div>
                    {/* Label row */}
                    <div
                      style={{
                        padding: "5px 8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: c.preset === key ? "#2563eb" : "#374151",
                        }}
                      >
                        {p.label}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 3,
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        {p.backdropBlur && (
                          <span
                            style={{
                              fontSize: 8,
                              background: "#e0f2fe",
                              color: "#0369a1",
                              borderRadius: 3,
                              padding: "1px 4px",
                            }}
                          >
                            blur
                          </span>
                        )}
                        {p.logoPosition === "center" && (
                          <span
                            style={{
                              fontSize: 8,
                              background: "#fef3c7",
                              color: "#92400e",
                              borderRadius: 3,
                              padding: "1px 4px",
                            }}
                          >
                            centered
                          </span>
                        )}
                        {p.bgType === "gradient" && (
                          <span
                            style={{
                              fontSize: 8,
                              background: "#ede9fe",
                              color: "#5b21b6",
                              borderRadius: 3,
                              padding: "1px 4px",
                            }}
                          >
                            gradient
                          </span>
                        )}
                        {p.linksPosition === "right" && (
                          <span
                            style={{
                              fontSize: 8,
                              background: "#f1f5f9",
                              color: "#475569",
                              borderRadius: 3,
                              padding: "1px 4px",
                            }}
                          >
                            right
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "0 8px 5px",
                        fontSize: 9,
                        color: "#94a3b8",
                      }}
                    >
                      {p.fontFamily}
                    </div>
                  </div>
                ))}
              </div>
            </G>
          </>
        )}
        {/* ── STYLE TAB ── */}
        {tab === "style" && (
          <>
            <G>
              <L>Presets</L>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                {Object.entries(PRESETS).map(([key, p]) => (
                  <div
                    key={key}
                    onClick={() => applyPreset(key)}
                    style={{
                      border: `2px solid ${c.preset === key ? "#2563eb" : "#e2e8f0"}`,
                      borderRadius: 8,
                      padding: "6px 8px",
                      cursor: "pointer",
                      background: c.preset === key ? "#eff6ff" : "#fff",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        height: 18,
                        borderRadius: 4,
                        marginBottom: 4,
                        border: "1px solid #e2e8f0",
                        background:
                          p.bgType === "gradient"
                            ? `linear-gradient(to right, ${p.bgGradient.from}, ${p.bgGradient.to})`
                            : p.bg,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        color: c.preset === key ? "#2563eb" : "#475569",
                        fontWeight: 600,
                      }}
                    >
                      <span>{p.emoji}</span>
                      {p.label}
                    </div>
                  </div>
                ))}
              </div>
            </G>
            <D />

            <G>
              <L>Typography</L>
              <SelectControl
                label="Nav Font"
                value={c.fontFamily || "Inter"}
                options={GOOGLE_FONTS}
                onChange={(v) => u("fontFamily", v)}
              />
              <SelectControl
                label="Logo Font"
                value={c.logoFontFamily || "Inter"}
                options={GOOGLE_FONTS}
                onChange={(v) => u("logoFontFamily", v)}
              />
            </G>
            <D />

            <G>
              <L>Background</L>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {["solid", "gradient"].map((t) => (
                  <button
                    key={t}
                    onClick={() => u("bgType", t)}
                    style={{
                      flex: 1,
                      padding: "5px 0",
                      borderRadius: 6,
                      border: "1.5px solid",
                      borderColor: c.bgType === t ? "#2563eb" : "#e2e8f0",
                      background: c.bgType === t ? "#eff6ff" : "#fff",
                      color: c.bgType === t ? "#2563eb" : "#475569",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {c.bgType === "solid" ? (
                <ColorControl
                  label="Color"
                  value={c.bg}
                  onChange={(v) => u("bg", v)}
                />
              ) : (
                <>
                  <ColorControl
                    label="From"
                    value={c.bgGradient?.from}
                    onChange={(v) => ug({ from: v })}
                  />
                  <ColorControl
                    label="To"
                    value={c.bgGradient?.to}
                    onChange={(v) => ug({ to: v })}
                  />
                  <SelectControl
                    label="Direction"
                    value={c.bgGradient?.direction || "to right"}
                    options={[
                      { value: "to right", label: "→ Left to Right" },
                      { value: "to left", label: "← Right to Left" },
                      { value: "to bottom", label: "↓ Top to Bottom" },
                      { value: "to bottom right", label: "↘ Diagonal" },
                      { value: "135deg", label: "135° Angle" },
                    ]}
                    onChange={(v) => ug({ direction: v })}
                  />
                  <RangeControl
                    label="Intensity"
                    value={c.bgGradient?.intensity ?? 100}
                    min={10}
                    max={100}
                    onChange={(v) => ug({ intensity: v })}
                    unit="%"
                  />
                  <div
                    style={{
                      height: 28,
                      borderRadius: 8,
                      marginTop: 6,
                      border: "1px solid #e2e8f0",
                      background: `linear-gradient(${c.bgGradient?.direction}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`,
                    }}
                  />
                </>
              )}
            </G>
            <D />

            <G>
              <L>Colors</L>
              {[
                ["Text", "textColor"],
                ["Links", "linkColor"],
                ["Link Hover", "linkHoverColor"],
                ["Accent", "accentColor"],
                ["Border", "borderColor"],
              ].map(([label, key]) => (
                <ColorControl
                  key={key}
                  label={label}
                  value={c[key]}
                  onChange={(v) => u(key, v)}
                />
              ))}
            </G>
            <D />

            <G>
              <L>Logo</L>
              <ToggleControl
                label="Use Image"
                value={!!c.logo.useImage}
                onChange={(v) => ul({ useImage: v })}
              />
              {c.logo.useImage ? (
                <>
                  <div
                    onClick={() =>
                      !logoUploading &&
                      document.getElementById("nb-logo-input").click()
                    }
                    style={{
                      border: `2px dashed ${logoUploading ? "#2563eb" : "#cbd5e1"}`,
                      borderRadius: 8,
                      padding: 12,
                      textAlign: "center",
                      cursor: logoUploading ? "wait" : "pointer",
                      background: "#f8fafc",
                      marginBottom: 8,
                      minHeight: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {logoUploading ? (
                      <span style={{ fontSize: 12, color: "#2563eb" }}>
                        Uploading...
                      </span>
                    ) : c.logo.imageUrl ? (
                      <img
                        src={resolveUrl(c.logo.imageUrl)}
                        style={{
                          maxHeight: 40,
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                        alt="logo"
                      />
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>
                        🖼️ Click to upload logo
                      </span>
                    )}
                  </div>
                  <input
                    id="nb-logo-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleLogoUpload}
                  />
                  {logoError && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#dc2626",
                        marginBottom: 6,
                      }}
                    >
                      {logoError}
                    </div>
                  )}
                  {c.logo.imageUrl && (
                    <>
                      <button
                        onClick={() => ul({ imageUrl: "", useImage: false })}
                        style={{
                          width: "100%",
                          border: "1px solid #fee2e2",
                          background: "#fff",
                          color: "#dc2626",
                          borderRadius: 6,
                          padding: 5,
                          fontSize: 11,
                          cursor: "pointer",
                          marginBottom: 8,
                        }}
                      >
                        Remove Logo
                      </button>
                      <RangeControl
                        label="Height"
                        value={c.logo.imageHeight || 36}
                        min={20}
                        max={60}
                        onChange={(v) => ul({ imageHeight: v })}
                        unit="px"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <input
                    className="ctrl-input"
                    value={c.logo.text}
                    onChange={(e) => ul({ text: e.target.value })}
                    style={{ marginBottom: 5 }}
                    placeholder="Brand name"
                  />
                  <RangeControl
                    label="Font Size"
                    value={c.logo.fontSize}
                    min={14}
                    max={36}
                    onChange={(v) => ul({ fontSize: v })}
                    unit="px"
                  />
                  <SelectControl
                    label="Weight"
                    value={String(c.logo.fontWeight)}
                    options={["400", "500", "600", "700", "800"].map((w) => ({
                      value: w,
                      label: w,
                    }))}
                    onChange={(v) => ul({ fontWeight: +v })}
                  />
                  <ColorControl
                    label="Color"
                    value={c.logo.color}
                    onChange={(v) => ul({ color: v })}
                  />
                  <ToggleControl
                    label="Show Icon"
                    value={!!c.logo.showIcon}
                    onChange={(v) => ul({ showIcon: v })}
                  />
                  {c.logo.showIcon && (
                    <ColorControl
                      label="Icon Color"
                      value={c.logo.iconColor}
                      onChange={(v) => ul({ iconColor: v })}
                    />
                  )}
                </>
              )}
            </G>
            <D />

            <G>
              <L>Link Style</L>
              <RangeControl
                label="Font Size"
                value={c.linkFontSize}
                min={11}
                max={20}
                onChange={(v) => u("linkFontSize", v)}
                unit="px"
              />
              <SelectControl
                label="Weight"
                value={String(c.linkFontWeight)}
                options={["400", "500", "600", "700"].map((w) => ({
                  value: w,
                  label: w,
                }))}
                onChange={(v) => u("linkFontWeight", +v)}
              />
              <RangeControl
                label="Spacing"
                value={c.linkSpacing}
                min={8}
                max={60}
                onChange={(v) => u("linkSpacing", v)}
                unit="px"
              />
            </G>
            <D />

            <G>
              <L>Effects</L>
              {[
                ["Shadow", "shadow"],
                ["Border Bottom", "borderBottom"],
                ["Sticky", "sticky"],
                ["Backdrop Blur", "backdropBlur"],
              ].map(([label, key]) => (
                <ToggleControl
                  key={key}
                  label={label}
                  value={!!c[key]}
                  onChange={(v) => u(key, v)}
                />
              ))}
            </G>
            <D />

            <G>
              <L>Transparent Navbar</L>
              <ToggleControl
                label="Transparent"
                value={!!c.transparent}
                onChange={(v) => u("transparent", v)}
              />
              {c.transparent && (
                <>
                  <ToggleControl
                    label="Solid on Scroll"
                    value={!!c.transparentScrolled}
                    onChange={(v) => u("transparentScrolled", v)}
                  />
                  <RangeControl
                    label="Scroll Threshold"
                    value={c.transparentScrollThreshold || 80}
                    min={20}
                    max={300}
                    onChange={(v) => u("transparentScrollThreshold", v)}
                    unit="px"
                  />
                  <ColorControl
                    label="Transparent Link Color"
                    value={c.transparentLinkColor || "#ffffff"}
                    onChange={(v) => u("transparentLinkColor", v)}
                  />
                </>
              )}
            </G>
            <D />

            <G>
              <L>Mobile / Hamburger</L>
              <SelectControl
                label="Animation"
                value={c.hamburgerStyle}
                options={HAMBURGER_STYLES}
                onChange={(v) => u("hamburgerStyle", v)}
              />
              <ColorControl
                label="Icon Color"
                value={c.hamburgerColor}
                onChange={(v) => u("hamburgerColor", v)}
              />
              <ToggleControl
                label="Submenu Open by Default"
                value={!!c.mobileSubmenuDefaultOpen}
                onChange={(v) => u("mobileSubmenuDefaultOpen", v)}
              />
            </G>
          </>
        )}

        {/* ── LINKS TAB ── */}
        {tab === "links" && (
          <>
            <G>
              <L>Nav Links</L>
              {c.links.map((link) => (
                <div
                  key={link.id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e8edf3",
                    borderRadius: 8,
                    marginBottom: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#374151",
                        flex: 1,
                      }}
                    >
                      {link.label}
                    </span>
                    <button
                      onClick={() => removeLink(link.id)}
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
                  <div style={{ padding: "0 10px 10px" }}>
                    <input
                      className="ctrl-input"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) =>
                        updateLink(link.id, { label: e.target.value })
                      }
                      style={{ marginBottom: 5 }}
                    />
                    <input
                      className="ctrl-input"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateLink(link.id, { url: e.target.value })
                      }
                      style={{ marginBottom: 5 }}
                    />
                    <input
                      className="ctrl-input"
                      placeholder="Nav Target ID (e.g. about)"
                      value={link.navTarget || ""}
                      onChange={(e) =>
                        updateLink(link.id, { navTarget: e.target.value })
                      }
                      style={{ marginBottom: 5 }}
                    />
                    <ToggleControl
                      label="Has Submenu"
                      value={!!link.hasSubmenu}
                      onChange={(v) => updateLink(link.id, { hasSubmenu: v })}
                    />
                    {link.hasSubmenu && (
                      <>
                        {link.children.map((ch) => (
                          <div
                            key={ch.id}
                            style={{
                              display: "flex",
                              gap: 5,
                              marginBottom: 5,
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                gap: 4,
                              }}
                            >
                              <input
                                style={{
                                  width: "100%",
                                  padding: "5px 8px",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  outline: "none",
                                }}
                                placeholder="Label"
                                value={ch.label}
                                onChange={(e) =>
                                  updateSubmenuItem(link.id, ch.id, {
                                    label: e.target.value,
                                  })
                                }
                              />
                              <input
                                style={{
                                  width: "100%",
                                  padding: "5px 8px",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  outline: "none",
                                }}
                                placeholder="URL (e.g. /about or #section)"
                                value={ch.url}
                                onChange={(e) =>
                                  updateSubmenuItem(link.id, ch.id, {
                                    url: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <button
                              onClick={() => removeSubmenuItem(link.id, ch.id)}
                              style={{
                                border: "none",
                                background: "none",
                                color: "#cbd5e1",
                                cursor: "pointer",
                                fontSize: 12,
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addSubmenuItem(link.id)}
                          style={{
                            width: "100%",
                            background: "none",
                            border: "1px dashed #cbd5e1",
                            borderRadius: 6,
                            padding: 5,
                            fontSize: 11,
                            color: "#94a3b8",
                            cursor: "pointer",
                          }}
                        >
                          + Add Sub Item
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={addLink}
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
                + Add Link
              </button>
            </G>
            <D />

            <G>
              <L>Submenu Style</L>
              <ColorControl
                label="Background"
                value={c.submenuBg || "#fff"}
                onChange={(v) => u("submenuBg", v)}
              />
              <ColorControl
                label="Text Color"
                value={c.submenuTextColor || "#374151"}
                onChange={(v) => u("submenuTextColor", v)}
              />
              <ColorControl
                label="Border"
                value={c.submenuBorderColor || "#e8edf3"}
                onChange={(v) => u("submenuBorderColor", v)}
              />
              <ColorControl
                label="Hover Bg"
                value={c.submenuHoverBg || "#eff6ff"}
                onChange={(v) => u("submenuHoverBg", v)}
              />
              <ColorControl
                label="Hover Text"
                value={c.submenuHoverColor || "#2563eb"}
                onChange={(v) => u("submenuHoverColor", v)}
              />
              <ToggleControl
                label="Show Bullets"
                value={c.submenuShowBullet !== false}
                onChange={(v) => u("submenuShowBullet", v)}
              />
              {c.submenuShowBullet !== false && (
                <>
                  <ColorControl
                    label="Bullet Color"
                    value={c.submenuBulletColor || "#2563eb"}
                    onChange={(v) => u("submenuBulletColor", v)}
                  />
                  <RangeControl
                    label="Bullet Size"
                    value={c.submenuBulletSize || 6}
                    min={3}
                    max={12}
                    onChange={(v) => u("submenuBulletSize", v)}
                    unit="px"
                  />
                </>
              )}
            </G>
          </>
        )}

        {/* ── BUTTONS TAB ── */}
        {tab === "buttons" && (
          <>
            <G>
              <L>Action Buttons</L>
              {c.buttons.map((btn) => (
                <div
                  key={btn.id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e8edf3",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {btn.label}
                    </span>
                    <button
                      onClick={() => removeButton(btn.id)}
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
                    placeholder="Label"
                    value={btn.label}
                    onChange={(e) =>
                      updateButton(btn.id, { label: e.target.value })
                    }
                    style={{ marginBottom: 5 }}
                  />
                  <input
                    className="ctrl-input"
                    placeholder="URL"
                    value={btn.url}
                    onChange={(e) =>
                      updateButton(btn.id, { url: e.target.value })
                    }
                    style={{ marginBottom: 5 }}
                  />
                  <SelectControl
                    label="Style"
                    value={btn.style}
                    options={[
                      { value: "filled", label: "Filled" },
                      { value: "outline", label: "Outline" },
                      { value: "ghost", label: "Ghost" },
                    ]}
                    onChange={(v) => updateButton(btn.id, { style: v })}
                  />
                  <SelectControl
                    label="Size"
                    value={btn.size}
                    options={[
                      { value: "sm", label: "Small" },
                      { value: "md", label: "Medium" },
                      { value: "lg", label: "Large" },
                    ]}
                    onChange={(v) => updateButton(btn.id, { size: v })}
                  />
                  <ColorControl
                    label="Color"
                    value={btn.bg}
                    onChange={(v) => updateButton(btn.id, { bg: v })}
                  />
                  <ColorControl
                    label="Text Color"
                    value={btn.color}
                    onChange={(v) => updateButton(btn.id, { color: v })}
                  />
                  <RangeControl
                    label="Radius"
                    value={btn.borderRadius}
                    min={0}
                    max={30}
                    onChange={(v) => updateButton(btn.id, { borderRadius: v })}
                    unit="px"
                  />
                </div>
              ))}
              <button
                onClick={addButton}
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
                + Add Button
              </button>
            </G>
          </>
        )}

        {/* ── LAYOUT TAB ── */}
        {tab === "layout" && (
          <>
            <G>
              <L>Navbar Style</L>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { value: "standard", label: "Standard" },
                  { value: "floating", label: "Floating Pill" },
                  { value: "side-panel", label: "Side Panel" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => u("navbarStyle", opt.value)}
                    style={{
                      flex: 1,
                      minWidth: 70,
                      padding: "5px 4px",
                      borderRadius: 6,
                      border: "1.5px solid",
                      borderColor:
                        c.navbarStyle === opt.value ? "#2563eb" : "#e2e8f0",
                      background:
                        c.navbarStyle === opt.value ? "#eff6ff" : "#fff",
                      color:
                        c.navbarStyle === opt.value ? "#2563eb" : "#475569",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </G>
            <D />

            {c.navbarStyle === "floating" && (
              <>
                <G>
                  <L>Floating Settings</L>
                  <RangeControl
                    label="Margin Top"
                    value={c.floatingMarginTop || 20}
                    min={0}
                    max={80}
                    onChange={(v) => u("floatingMarginTop", v)}
                    unit="px"
                  />
                  <RangeControl
                    label="Max Width"
                    value={c.floatingMaxWidth || 680}
                    min={400}
                    max={1200}
                    onChange={(v) => u("floatingMaxWidth", v)}
                    unit="px"
                  />
                </G>
                <D />
              </>
            )}

            {(c.navbarStyle === "side-panel" ||
              c.navbarStyle === "floating") && (
              <>
                <G>
                  <L>Side Panel Settings</L>
                  <SelectControl
                    label="Position"
                    value={c.sidePanelPosition || "right"}
                    options={[
                      { value: "right", label: "Slide from Right" },
                      { value: "left", label: "Slide from Left" },
                    ]}
                    onChange={(v) => u("sidePanelPosition", v)}
                  />
                  <RangeControl
                    label="Panel Width"
                    value={c.sidePanelWidth || 340}
                    min={200}
                    max={600}
                    onChange={(v) => u("sidePanelWidth", v)}
                    unit="px"
                  />
                  <RangeControl
                    label="Link Font Size"
                    value={c.sidePanelFontSize || 36}
                    min={18}
                    max={64}
                    onChange={(v) => u("sidePanelFontSize", v)}
                    unit="px"
                  />
                  <ColorControl
                    label="Panel Background"
                    value={c.sidePanelBg || "#000000"}
                    onChange={(v) => u("sidePanelBg", v)}
                  />
                  <ColorControl
                    label="Panel Text Color"
                    value={c.sidePanelTextColor || "#ffffff"}
                    onChange={(v) => u("sidePanelTextColor", v)}
                  />
                  <ToggleControl
                    label="Show Brand Watermark"
                    value={c.sidePanelWatermark !== false}
                    onChange={(v) => u("sidePanelWatermark", v)}
                  />
                </G>
                <D />
              </>
            )}

            <G>
              <L>Dimensions</L>
              <RangeControl
                label="Height"
                value={c.height}
                min={40}
                max={100}
                onChange={(v) => u("height", v)}
                unit="px"
              />
              <RangeControl
                label="Padding X"
                value={c.padding.x}
                min={0}
                max={80}
                onChange={(v) => up({ x: v })}
                unit="px"
              />
              <RangeControl
                label="Border Radius"
                value={c.borderRadius}
                min={0}
                max={999}
                onChange={(v) => u("borderRadius", v)}
                unit="px"
              />
            </G>
            <D />

            <G>
              <L>Logo Position</L>
              <SelectControl
                value={c.logoPosition}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => u("logoPosition", v)}
              />
            </G>
            <G>
              <L>Links Position</L>
              <SelectControl
                value={c.linksPosition}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right (with buttons)" },
                  { value: "split", label: "Split (half left, half right)" },
                ]}
                onChange={(v) => u("linksPosition", v)}
              />
            </G>
          </>
        )}
      </div>
    </div>
  );
}
