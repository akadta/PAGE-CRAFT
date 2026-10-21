import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import { uid } from "../../../../config/sectionDefaults";
import { resolveUrl } from "../../../../utils/resolveUrl";
import { uploadLogo } from "../../../../api/uploadApi";
import { useState } from "react";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

const PLATFORMS = [
  "twitter",
  "linkedin",
  "github",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
];

/* ─── Prebuilt Templates ─── */
const TEMPLATES = [
  {
    id: "corporate-dark",
    name: "Corporate Dark",
    emoji: "🏢",
    preview: "linear-gradient(135deg,#0f172a,#1e293b)",
    config: {
      bg: "#0f172a",
      bgType: "solid",
      headingFont: "Inter",
      bodyFont: "Inter",
      accentColor: "#6366f1",
      headingColor: "#ffffff",
      textColor: "rgba(255,255,255,0.6)",
      linkColor: "rgba(255,255,255,0.55)",
      linkHoverColor: "#6366f1",
      dividerColor: "rgba(255,255,255,0.08)",
      taglineColor: "rgba(255,255,255,0.5)",
      copyrightColor: "rgba(255,255,255,0.35)",
      socialBg: "rgba(255,255,255,0.07)",
      socialBgHover: "#6366f1",
      socialIconColor: "rgba(255,255,255,0.5)",
      socialIconHoverColor: "#fff",
      socialShape: "rounded",
      layout: { variant: "columns", align: "left" },
      paddingY: 64,
      paddingX: 48,
    },
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    emoji: "🌙",
    preview: "linear-gradient(135deg,#0a0f2c,#1a237e)",
    config: {
      bgType: "gradient",
      bgGradient: {
        direction: "to bottom right",
        from: "#0a0f2c",
        to: "#1a237e",
      },
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      accentColor: "#60a5fa",
      headingColor: "#e0e7ff",
      textColor: "rgba(224,231,255,0.6)",
      linkColor: "rgba(224,231,255,0.5)",
      linkHoverColor: "#60a5fa",
      dividerColor: "rgba(96,165,250,0.15)",
      taglineColor: "rgba(224,231,255,0.55)",
      copyrightColor: "rgba(224,231,255,0.3)",
      socialBg: "rgba(96,165,250,0.1)",
      socialBgHover: "#60a5fa",
      socialIconColor: "rgba(224,231,255,0.5)",
      socialIconHoverColor: "#0a0f2c",
      socialShape: "circle",
      layout: { variant: "magazine", align: "left" },
      paddingY: 72,
      paddingX: 56,
    },
  },
  {
    id: "forest-green",
    name: "Forest Executive",
    emoji: "🌿",
    preview: "linear-gradient(135deg,#052e16,#14532d)",
    config: {
      bgType: "gradient",
      bgGradient: { direction: "to bottom", from: "#052e16", to: "#14532d" },
      headingFont: "Merriweather",
      bodyFont: "Inter",
      accentColor: "#4ade80",
      headingColor: "#f0fdf4",
      textColor: "rgba(240,253,244,0.6)",
      linkColor: "rgba(240,253,244,0.5)",
      linkHoverColor: "#4ade80",
      dividerColor: "rgba(74,222,128,0.12)",
      taglineColor: "rgba(240,253,244,0.55)",
      copyrightColor: "rgba(240,253,244,0.3)",
      socialBg: "rgba(74,222,128,0.08)",
      socialBgHover: "#4ade80",
      socialIconColor: "rgba(240,253,244,0.5)",
      socialIconHoverColor: "#052e16",
      socialShape: "rounded",
      layout: { variant: "columns", align: "left" },
      paddingY: 64,
      paddingX: 48,
    },
  },
  {
    id: "slate-minimal",
    name: "Slate Minimal",
    emoji: "🪨",
    preview: "linear-gradient(135deg,#1e293b,#334155)",
    config: {
      bg: "#1e293b",
      bgType: "solid",
      headingFont: "DM Sans",
      bodyFont: "DM Sans",
      accentColor: "#f59e0b",
      headingColor: "#f8fafc",
      textColor: "rgba(248,250,252,0.5)",
      linkColor: "rgba(248,250,252,0.45)",
      linkHoverColor: "#f59e0b",
      dividerColor: "rgba(248,250,252,0.07)",
      taglineColor: "rgba(248,250,252,0.45)",
      copyrightColor: "rgba(248,250,252,0.3)",
      socialBg: "rgba(245,158,11,0.1)",
      socialBgHover: "#f59e0b",
      socialIconColor: "rgba(248,250,252,0.5)",
      socialIconHoverColor: "#1e293b",
      socialShape: "square",
      layout: { variant: "minimal", align: "center" },
      paddingY: 48,
      paddingX: 40,
    },
  },
  {
    id: "pure-white",
    name: "Light Corporate",
    emoji: "☀️",
    preview: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    config: {
      bg: "#f8fafc",
      bgType: "solid",
      headingFont: "Inter",
      bodyFont: "Inter",
      accentColor: "#3b82f6",
      headingColor: "#0f172a",
      textColor: "#475569",
      linkColor: "#64748b",
      linkHoverColor: "#3b82f6",
      dividerColor: "#e2e8f0",
      taglineColor: "#64748b",
      copyrightColor: "#94a3b8",
      socialBg: "#e2e8f0",
      socialBgHover: "#3b82f6",
      socialIconColor: "#64748b",
      socialIconHoverColor: "#fff",
      socialShape: "circle",
      layout: { variant: "columns", align: "left" },
      paddingY: 64,
      paddingX: 48,
    },
  },
  {
    id: "purple-glass",
    name: "Purple Glass",
    emoji: "💜",
    preview: "linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)",
    config: {
      bgType: "gradient",
      bgGradient: { direction: "135deg", from: "#1e1b4b", to: "#4c1d95" },
      headingFont: "Poppins",
      bodyFont: "Inter",
      accentColor: "#a78bfa",
      headingColor: "#ede9fe",
      textColor: "rgba(237,233,254,0.6)",
      linkColor: "rgba(237,233,254,0.5)",
      linkHoverColor: "#a78bfa",
      dividerColor: "rgba(167,139,250,0.15)",
      taglineColor: "rgba(237,233,254,0.55)",
      copyrightColor: "rgba(237,233,254,0.3)",
      socialBg: "rgba(167,139,250,0.1)",
      socialBgHover: "#a78bfa",
      socialIconColor: "rgba(237,233,254,0.5)",
      socialIconHoverColor: "#1e1b4b",
      socialShape: "circle",
      layout: { variant: "stacked", align: "center" },
      paddingY: 72,
      paddingX: 48,
    },
  },
  {
    id: "charcoal-magazine",
    name: "Charcoal Magazine",
    emoji: "📰",
    preview: "linear-gradient(135deg,#18181b,#27272a)",
    config: {
      bg: "#18181b",
      bgType: "solid",
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      accentColor: "#f97316",
      headingColor: "#fafafa",
      textColor: "rgba(250,250,250,0.55)",
      linkColor: "rgba(250,250,250,0.5)",
      linkHoverColor: "#f97316",
      dividerColor: "rgba(250,250,250,0.07)",
      taglineColor: "rgba(250,250,250,0.5)",
      copyrightColor: "rgba(250,250,250,0.3)",
      socialBg: "rgba(249,115,22,0.08)",
      socialBgHover: "#f97316",
      socialIconColor: "rgba(250,250,250,0.5)",
      socialIconHoverColor: "#fff",
      socialShape: "rounded",
      layout: { variant: "magazine", align: "left" },
      paddingY: 72,
      paddingX: 56,
    },
  },
  {
    id: "rose-gold",
    name: "Rose Gold Premium",
    emoji: "🌹",
    preview: "linear-gradient(135deg,#881337,#1c1917)",
    config: {
      bgType: "gradient",
      bgGradient: {
        direction: "to bottom right",
        from: "#1c1917",
        to: "#881337",
      },
      headingFont: "Cormorant Garamond",
      bodyFont: "Inter",
      accentColor: "#fb7185",
      headingColor: "#fff1f2",
      textColor: "rgba(255,241,242,0.6)",
      linkColor: "rgba(255,241,242,0.5)",
      linkHoverColor: "#fb7185",
      dividerColor: "rgba(251,113,133,0.15)",
      taglineColor: "rgba(255,241,242,0.55)",
      copyrightColor: "rgba(255,241,242,0.3)",
      socialBg: "rgba(251,113,133,0.08)",
      socialBgHover: "#fb7185",
      socialIconColor: "rgba(255,241,242,0.5)",
      socialIconHoverColor: "#1c1917",
      socialShape: "circle",
      layout: { variant: "stacked", align: "center" },
      paddingY: 80,
      paddingX: 48,
    },
  },
  {
    id: "teal-tech",
    name: "Teal Tech",
    emoji: "🔷",
    preview: "linear-gradient(135deg,#042f2e,#134e4a)",
    config: {
      bgType: "gradient",
      bgGradient: { direction: "to right", from: "#042f2e", to: "#134e4a" },
      headingFont: "Space Grotesk",
      bodyFont: "Inter",
      accentColor: "#2dd4bf",
      headingColor: "#f0fdfa",
      textColor: "rgba(240,253,250,0.6)",
      linkColor: "rgba(240,253,250,0.5)",
      linkHoverColor: "#2dd4bf",
      dividerColor: "rgba(45,212,191,0.12)",
      taglineColor: "rgba(240,253,250,0.55)",
      copyrightColor: "rgba(240,253,250,0.3)",
      socialBg: "rgba(45,212,191,0.08)",
      socialBgHover: "#2dd4bf",
      socialIconColor: "rgba(240,253,250,0.5)",
      socialIconHoverColor: "#042f2e",
      socialShape: "rounded",
      layout: { variant: "columns", align: "left" },
      paddingY: 64,
      paddingX: 48,
    },
  },
  {
    id: "navy-stacked",
    name: "Navy Center",
    emoji: "⚓",
    preview: "linear-gradient(135deg,#172554,#1e3a8a)",
    config: {
      bgType: "gradient",
      bgGradient: { direction: "to bottom", from: "#172554", to: "#1e3a8a" },
      headingFont: "Montserrat",
      bodyFont: "Inter",
      accentColor: "#38bdf8",
      headingColor: "#f0f9ff",
      textColor: "rgba(240,249,255,0.6)",
      linkColor: "rgba(240,249,255,0.5)",
      linkHoverColor: "#38bdf8",
      dividerColor: "rgba(56,189,248,0.15)",
      taglineColor: "rgba(240,249,255,0.55)",
      copyrightColor: "rgba(240,249,255,0.3)",
      socialBg: "rgba(56,189,248,0.1)",
      socialBgHover: "#38bdf8",
      socialIconColor: "rgba(240,249,255,0.5)",
      socialIconHoverColor: "#172554",
      socialShape: "circle",
      layout: { variant: "stacked", align: "center" },
      paddingY: 72,
      paddingX: 48,
    },
  },
];

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
  "EB Garamond",
];

export default function FooterPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ul = (patch) => onChange({ logo: { ...c.logo, ...patch } });
  const [logoUploading, setLogoUploading] = useState(false);
  const [partnerUploading, setPartnerUploading] = useState(null);
  const [activeTab, setActiveTab] = useState("templates");

  const applyTemplate = (tpl) => {
    onChange({
      ...tpl.config,
      // preserve user content
      logo: c.logo,
      tagline: c.tagline,
      columns: c.columns,
      socials: c.socials,
      copyright: c.copyright,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      contactAddress: c.contactAddress,
      showNewsletter: c.showNewsletter,
      newsletterLabel: c.newsletterLabel,
      newsletterSubtext: c.newsletterSubtext,
      newsletterPlaceholder: c.newsletterPlaceholder,
      newsletterBtnText: c.newsletterBtnText,
      showMap: c.showMap,
      mapEmbedUrl: c.mapEmbedUrl,
      mapHeight: c.mapHeight,
      showAwards: c.showAwards,
      awards: c.awards,
      showPartnerLogos: c.showPartnerLogos,
      partnerLogos: c.partnerLogos,
      partnerLogosLabel: c.partnerLogosLabel,
      legalLinks: c.legalLinks,
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const d = await uploadLogo(file);
      ul({ imageUrl: d.url, useImage: true });
    } catch {
    } finally {
      setLogoUploading(false);
    }
  };

  // Partner logos
  const addPartnerLogo = () =>
    onChange({
      partnerLogos: [
        ...(c.partnerLogos || []),
        { id: uid(), imageUrl: "", alt: "", height: 28 },
      ],
    });
  const uPartnerLogo = (id, patch) =>
    onChange({
      partnerLogos: (c.partnerLogos || []).map((l) =>
        l.id === id ? { ...l, ...patch } : l,
      ),
    });
  const delPartnerLogo = (id) =>
    onChange({
      partnerLogos: (c.partnerLogos || []).filter((l) => l.id !== id),
    });
  const handlePartnerLogoUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    setPartnerUploading(id);
    try {
      const d = await uploadLogo(file);
      uPartnerLogo(id, { imageUrl: d.url });
    } catch {
    } finally {
      setPartnerUploading(null);
    }
  };

  // Columns
  const addCol = () =>
    onChange({
      columns: [
        ...(c.columns || []),
        {
          id: uid(),
          heading: "Column",
          headingColor: c.headingColor || "#ffffff",
          links: [],
        },
      ],
    });
  const delCol = (id) =>
    onChange({ columns: (c.columns || []).filter((col) => col.id !== id) });
  const ucol = (id, patch) =>
    onChange({
      columns: (c.columns || []).map((col) =>
        col.id === id ? { ...col, ...patch } : col,
      ),
    });
  const addColLink = (colId) =>
    onChange({
      columns: (c.columns || []).map((col) =>
        col.id === colId
          ? {
              ...col,
              links: [...col.links, { id: uid(), label: "Link", url: "#" }],
            }
          : col,
      ),
    });
  const uColLink = (colId, lid, patch) =>
    onChange({
      columns: (c.columns || []).map((col) =>
        col.id === colId
          ? {
              ...col,
              links: col.links.map((l) =>
                l.id === lid ? { ...l, ...patch } : l,
              ),
            }
          : col,
      ),
    });
  const delColLink = (colId, lid) =>
    onChange({
      columns: (c.columns || []).map((col) =>
        col.id === colId
          ? { ...col, links: col.links.filter((l) => l.id !== lid) }
          : col,
      ),
    });

  // Socials
  const us = (id, patch) =>
    onChange({
      socials: (c.socials || []).map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    });
  const addSocial = () =>
    onChange({
      socials: [
        ...(c.socials || []),
        { id: uid(), platform: "twitter", url: "" },
      ],
    });
  const delSocial = (id) =>
    onChange({ socials: (c.socials || []).filter((s) => s.id !== id) });

  // Awards
  const addAward = () =>
    onChange({
      awards: [
        ...(c.awards || []),
        { id: uid(), icon: "🏆", label: "Award Name" },
      ],
    });
  const uAward = (id, patch) =>
    onChange({
      awards: (c.awards || []).map((a) =>
        a.id === id ? { ...a, ...patch } : a,
      ),
    });
  const delAward = (id) =>
    onChange({ awards: (c.awards || []).filter((a) => a.id !== id) });

  // Legal links
  const addLegal = () =>
    onChange({
      legalLinks: [
        ...(c.legalLinks || []),
        { id: uid(), label: "Privacy Policy", url: "#" },
      ],
    });
  const uLegal = (id, patch) =>
    onChange({
      legalLinks: (c.legalLinks || []).map((l) =>
        l.id === id ? { ...l, ...patch } : l,
      ),
    });
  const delLegal = (id) =>
    onChange({ legalLinks: (c.legalLinks || []).filter((l) => l.id !== id) });

  const tabs = [
    { id: "templates", label: "Templates" },
    { id: "brand", label: "Brand" },
    { id: "links", label: "Links" },
    { id: "contact", label: "Contact" },
    { id: "extras", label: "Extras" },
    { id: "style", label: "Style" },
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

      {/* ── TEMPLATES TAB ── */}
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
            Click a template to apply styles. Your content is preserved.
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
                  padding: 0,
                  background: "none",
                  textAlign: "left",
                }}
                title={tpl.name}
              >
                <div style={{ height: 52, background: tpl.preview }} />
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
                  <span>{tpl.emoji}</span> {tpl.name}
                </div>
              </button>
            ))}
          </div>
          <D />
          <G>
            <L>Layout Variant</L>
            <SelectControl
              value={c.layout?.variant || "columns"}
              options={[
                { value: "columns", label: "Brand + Columns (default)" },
                { value: "magazine", label: "Magazine (split)" },
                { value: "stacked", label: "Stacked (centered)" },
                { value: "minimal", label: "Minimal (single bar)" },
              ]}
              onChange={(v) =>
                onChange({ layout: { ...c.layout, variant: v } })
              }
            />
            <L>Content Alignment</L>
            <SelectControl
              value={c.layout?.align || "left"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => onChange({ layout: { ...c.layout, align: v } })}
            />
          </G>
        </div>
      )}

      {/* ── BRAND TAB ── */}
      {activeTab === "brand" && (
        <div>
          <G>
            <L>Background</L>
            <BgControl config={c} onChange={onChange} />
          </G>
          <D />
          <G>
            <L>Primary Logo</L>
            <ToggleControl
              label="Use Image"
              value={!!c.logo?.useImage}
              onChange={(v) => ul({ useImage: v })}
            />
            {c.logo?.useImage ? (
              <>
                <div
                  onClick={() =>
                    !logoUploading &&
                    document.getElementById("footer-logo-input").click()
                  }
                  style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: 8,
                    padding: 10,
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#f8fafc",
                    marginBottom: 6,
                    minHeight: 50,
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
                        maxHeight: 36,
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                      alt="logo"
                    />
                  ) : (
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      🖼️ Upload logo
                    </span>
                  )}
                </div>
                <input
                  id="footer-logo-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleLogoUpload}
                />
                {c.logo.imageUrl && (
                  <button
                    onClick={() => ul({ imageUrl: "", useImage: false })}
                    style={{
                      width: "100%",
                      border: "1px solid #fee2e2",
                      background: "#fff",
                      color: "#dc2626",
                      borderRadius: 6,
                      padding: 4,
                      fontSize: 11,
                      cursor: "pointer",
                      marginBottom: 6,
                    }}
                  >
                    Remove
                  </button>
                )}
                <RangeControl
                  label="Height"
                  value={c.logo.imageHeight || 36}
                  min={16}
                  max={80}
                  onChange={(v) => ul({ imageHeight: v })}
                  unit="px"
                />
              </>
            ) : (
              <>
                <input
                  className="ctrl-input"
                  value={c.logo?.text || ""}
                  onChange={(e) => ul({ text: e.target.value })}
                  placeholder="Brand name"
                  style={{ marginBottom: 5 }}
                />
                <RangeControl
                  label="Font Size"
                  value={c.logo?.fontSize || 22}
                  min={14}
                  max={48}
                  onChange={(v) => ul({ fontSize: v })}
                  unit="px"
                />
                <ColorControl
                  label="Color"
                  value={c.logo?.color || "#ffffff"}
                  onChange={(v) => ul({ color: v })}
                />
              </>
            )}
          </G>
          <D />
          <G>
            <L>Tagline</L>
            <textarea
              className="ctrl-input"
              value={c.tagline || ""}
              onChange={(e) => u("tagline", e.target.value)}
              placeholder="Short brand description"
              rows={2}
              style={{ marginBottom: 5, resize: "vertical" }}
            />
            <ColorControl
              label="Tagline Color"
              value={c.taglineColor || "rgba(255,255,255,0.5)"}
              onChange={(v) => u("taglineColor", v)}
            />
          </G>
          <D />
          <G>
            <L>Partner / Client Logos</L>
            <ToggleControl
              label="Show Partner Logos"
              value={!!c.showPartnerLogos}
              onChange={(v) => u("showPartnerLogos", v)}
            />
            {c.showPartnerLogos && (
              <>
                <input
                  className="ctrl-input"
                  value={c.partnerLogosLabel || ""}
                  onChange={(e) => u("partnerLogosLabel", e.target.value)}
                  placeholder='Label e.g. "Trusted by"'
                  style={{ marginBottom: 5 }}
                />
                <RangeControl
                  label="Logo Opacity"
                  value={c.partnerLogosOpacity ?? 0.5}
                  min={0.1}
                  max={1}
                  step={0.05}
                  onChange={(v) => u("partnerLogosOpacity", v)}
                />
                <ToggleControl
                  label="Grayscale"
                  value={!!c.partnerLogosGrayscale}
                  onChange={(v) => u("partnerLogosGrayscale", v)}
                />
                {(c.partnerLogos || []).map((l, i) => (
                  <div
                    key={l.id}
                    style={{
                      background: "#f8fafc",
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
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 600 }}>
                        Logo {i + 1}
                      </span>
                      <button
                        onClick={() => delPartnerLogo(l.id)}
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
                    <div
                      onClick={() =>
                        !partnerUploading &&
                        document.getElementById(`partner-logo-${l.id}`).click()
                      }
                      style={{
                        border: "2px dashed #cbd5e1",
                        borderRadius: 6,
                        padding: 8,
                        textAlign: "center",
                        cursor: "pointer",
                        background: "#fff",
                        marginBottom: 5,
                        minHeight: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {partnerUploading === l.id ? (
                        <span style={{ fontSize: 11, color: "#2563eb" }}>
                          Uploading...
                        </span>
                      ) : l.imageUrl ? (
                        <img
                          src={resolveUrl(l.imageUrl)}
                          style={{
                            maxHeight: 28,
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                          alt=""
                        />
                      ) : (
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                          🖼️ Upload
                        </span>
                      )}
                    </div>
                    <input
                      id={`partner-logo-${l.id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handlePartnerLogoUpload(e, l.id)}
                    />
                    <input
                      className="ctrl-input"
                      value={l.alt || ""}
                      onChange={(e) =>
                        uPartnerLogo(l.id, { alt: e.target.value })
                      }
                      placeholder="Alt / company name"
                      style={{ marginBottom: 4, fontSize: 11 }}
                    />
                    <RangeControl
                      label="Height"
                      value={l.height || 28}
                      min={16}
                      max={60}
                      onChange={(v) => uPartnerLogo(l.id, { height: v })}
                      unit="px"
                    />
                  </div>
                ))}
                <button
                  onClick={addPartnerLogo}
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
                  + Add Logo
                </button>
              </>
            )}
          </G>
        </div>
      )}

      {/* ── LINKS TAB ── */}
      {activeTab === "links" && (
        <div>
          <G>
            <L>Link Columns</L>
            {(c.columns || []).map((col, ci) => (
              <div
                key={col.id}
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
                    Column {ci + 1}
                  </span>
                  <button
                    onClick={() => delCol(col.id)}
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
                  value={col.heading || ""}
                  onChange={(e) => ucol(col.id, { heading: e.target.value })}
                  placeholder="Column heading"
                  style={{ marginBottom: 5 }}
                />
                <ColorControl
                  label="Heading Color"
                  value={col.headingColor || "#ffffff"}
                  onChange={(v) => ucol(col.id, { headingColor: v })}
                />
                {(col.links || []).map((link) => (
                  <div
                    key={link.id}
                    style={{
                      display: "flex",
                      gap: 4,
                      marginBottom: 4,
                      alignItems: "center",
                    }}
                  >
                    <input
                      style={{
                        flex: 1,
                        padding: "5px 8px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        fontSize: 11,
                        outline: "none",
                      }}
                      value={link.label || ""}
                      onChange={(e) =>
                        uColLink(col.id, link.id, { label: e.target.value })
                      }
                      placeholder="Label"
                    />
                    <input
                      style={{
                        flex: 1,
                        padding: "5px 8px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        fontSize: 11,
                        outline: "none",
                      }}
                      value={link.url || ""}
                      onChange={(e) =>
                        uColLink(col.id, link.id, { url: e.target.value })
                      }
                      placeholder="URL"
                    />
                    <button
                      onClick={() => delColLink(col.id, link.id)}
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
                  onClick={() => addColLink(col.id)}
                  style={{
                    width: "100%",
                    border: "1px dashed #cbd5e1",
                    background: "none",
                    borderRadius: 6,
                    padding: 4,
                    fontSize: 11,
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  + Link
                </button>
              </div>
            ))}
            <button
              onClick={addCol}
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
              + Add Column
            </button>
          </G>
          <D />
          <G>
            <L>Bottom Legal Links</L>
            {(c.legalLinks || []).map((l) => (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  gap: 4,
                  marginBottom: 5,
                  alignItems: "center",
                }}
              >
                <input
                  style={{
                    flex: 1,
                    padding: "5px 8px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    fontSize: 11,
                    outline: "none",
                  }}
                  value={l.label || ""}
                  onChange={(e) => uLegal(l.id, { label: e.target.value })}
                  placeholder="Label"
                />
                <input
                  style={{
                    flex: 1,
                    padding: "5px 8px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    fontSize: 11,
                    outline: "none",
                  }}
                  value={l.url || ""}
                  onChange={(e) => uLegal(l.id, { url: e.target.value })}
                  placeholder="URL"
                />
                <button
                  onClick={() => delLegal(l.id)}
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
              onClick={addLegal}
              style={{
                width: "100%",
                border: "1px dashed #cbd5e1",
                background: "none",
                borderRadius: 6,
                padding: 5,
                fontSize: 11,
                color: "#94a3b8",
                cursor: "pointer",
              }}
            >
              + Add Legal Link
            </button>
          </G>
          <D />
          <G>
            <L>Copyright Text</L>
            <input
              className="ctrl-input"
              value={c.copyright || ""}
              onChange={(e) => u("copyright", e.target.value)}
              placeholder={`© ${new Date().getFullYear()} Brand. All rights reserved.`}
              style={{ marginBottom: 5 }}
            />
            <ColorControl
              label="Copyright Color"
              value={c.copyrightColor || "rgba(255,255,255,0.4)"}
              onChange={(v) => u("copyrightColor", v)}
            />
          </G>
        </div>
      )}

      {/* ── CONTACT TAB ── */}
      {activeTab === "contact" && (
        <div>
          <G>
            <L>Email Address</L>
            <input
              className="ctrl-input"
              value={c.contactEmail || ""}
              onChange={(e) => u("contactEmail", e.target.value)}
              placeholder="hello@company.com"
              style={{ marginBottom: 5 }}
            />
            <L>Phone</L>
            <input
              className="ctrl-input"
              value={c.contactPhone || ""}
              onChange={(e) => u("contactPhone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              style={{ marginBottom: 5 }}
            />
            <L>Address</L>
            <textarea
              className="ctrl-input"
              value={c.contactAddress || ""}
              onChange={(e) => u("contactAddress", e.target.value)}
              placeholder="123 Main St, City, Country"
              rows={2}
              style={{ resize: "vertical", marginBottom: 5 }}
            />
          </G>
          <D />
          <G>
            <L>Google Maps Embed</L>
            <ToggleControl
              label="Show Map"
              value={!!c.showMap}
              onChange={(v) => u("showMap", v)}
            />
            {c.showMap && (
              <>
                <div
                  style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}
                >
                  Paste any Google Maps link — view URL or embed URL, both work.
                </div>
                <textarea
                  className="ctrl-input"
                  value={c.mapRawUrl || c.mapEmbedUrl || ""}
                  onChange={(e) => {
                    const raw = e.target.value.trim();
                    u("mapRawUrl", raw);

                    // Extract lat/lng from view URL: @lat,lng,zoom
                    const viewMatch = raw.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                    // Already an embed URL
                    if (raw.includes("maps/embed")) {
                      u("mapEmbedUrl", raw);
                    } else if (viewMatch) {
                      const lat = viewMatch[1];
                      const lng = viewMatch[2];
                      const embed = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15712!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;
                      u("mapEmbedUrl", embed);
                    } else {
                      u("mapEmbedUrl", raw);
                    }
                  }}
                  placeholder="Paste any Google Maps URL here"
                  rows={3}
                  style={{ resize: "vertical", marginBottom: 5, fontSize: 11 }}
                />
                {c.mapEmbedUrl && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#22c55e",
                      marginBottom: 6,
                      wordBreak: "break-all",
                    }}
                  >
                    ✓ Embed URL ready
                  </div>
                )}
                <RangeControl
                  label="Map Height"
                  value={c.mapHeight || 180}
                  min={100}
                  max={400}
                  onChange={(v) => u("mapHeight", v)}
                  unit="px"
                />
                <ToggleControl
                  label="Custom Width"
                  value={!!c.mapCustomWidth}
                  onChange={(v) => u("mapCustomWidth", v)}
                />
                {c.mapCustomWidth && (
                  <RangeControl
                    label="Map Width"
                    value={c.mapWidth || 400}
                    min={100}
                    max={800}
                    onChange={(v) => u("mapWidth", v)}
                    unit="px"
                  />
                )}
              </>
            )}
          </G>
          <D />
          <G>
            <L>Social Links</L>
            <ToggleControl
              label="Show Socials"
              value={!!c.showSocials}
              onChange={(v) => u("showSocials", v)}
            />
            {c.showSocials && (
              <>
                {(c.socials || []).map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      gap: 5,
                      marginBottom: 5,
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={s.platform}
                      onChange={(e) => us(s.id, { platform: e.target.value })}
                      style={{
                        padding: "5px 6px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        fontSize: 11,
                        outline: "none",
                        background: "#fafafa",
                      }}
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <input
                      style={{
                        flex: 1,
                        padding: "5px 8px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        fontSize: 11,
                        outline: "none",
                      }}
                      value={s.url || ""}
                      onChange={(e) => us(s.id, { url: e.target.value })}
                      placeholder="URL"
                    />
                    <button
                      onClick={() => delSocial(s.id)}
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
                  onClick={addSocial}
                  style={{
                    width: "100%",
                    border: "1px dashed #cbd5e1",
                    background: "none",
                    borderRadius: 6,
                    padding: 5,
                    fontSize: 11,
                    color: "#94a3b8",
                    cursor: "pointer",
                    marginBottom: 8,
                  }}
                >
                  + Add Social
                </button>
                <SelectControl
                  label="Icon Shape"
                  value={c.socialShape || "rounded"}
                  options={[
                    { value: "rounded", label: "Rounded" },
                    { value: "circle", label: "Circle" },
                    { value: "square", label: "Square" },
                  ]}
                  onChange={(v) => u("socialShape", v)}
                />
                <ColorControl
                  label="Icon Color"
                  value={c.socialIconColor || "rgba(255,255,255,0.5)"}
                  onChange={(v) => u("socialIconColor", v)}
                />
                <ColorControl
                  label="Icon Hover Color"
                  value={c.socialIconHoverColor || "#ffffff"}
                  onChange={(v) => u("socialIconHoverColor", v)}
                />
                <ColorControl
                  label="Icon BG"
                  value={c.socialBg || "rgba(255,255,255,0.07)"}
                  onChange={(v) => u("socialBg", v)}
                />
                <ColorControl
                  label="Icon BG Hover"
                  value={c.socialBgHover || "#6366f1"}
                  onChange={(v) => u("socialBgHover", v)}
                />
              </>
            )}
          </G>
        </div>
      )}

      {/* ── EXTRAS TAB ── */}
      {activeTab === "extras" && (
        <div>
          <G>
            <L>Newsletter Signup</L>
            <ToggleControl
              label="Show Newsletter"
              value={!!c.showNewsletter}
              onChange={(v) => u("showNewsletter", v)}
            />
            {c.showNewsletter && (
              <>
                <input
                  className="ctrl-input"
                  value={c.newsletterLabel || ""}
                  onChange={(e) => u("newsletterLabel", e.target.value)}
                  placeholder="Subscribe to our newsletter"
                  style={{ marginBottom: 4 }}
                />
                <input
                  className="ctrl-input"
                  value={c.newsletterSubtext || ""}
                  onChange={(e) => u("newsletterSubtext", e.target.value)}
                  placeholder="No spam. Unsubscribe anytime."
                  style={{ marginBottom: 4 }}
                />
                <input
                  className="ctrl-input"
                  value={c.newsletterPlaceholder || ""}
                  onChange={(e) => u("newsletterPlaceholder", e.target.value)}
                  placeholder="Input placeholder text"
                  style={{ marginBottom: 4 }}
                />
                <input
                  className="ctrl-input"
                  value={c.newsletterBtnText || ""}
                  onChange={(e) => u("newsletterBtnText", e.target.value)}
                  placeholder="Button text"
                  style={{ marginBottom: 4 }}
                />
              </>
            )}
          </G>
          <D />
          <G>
            <L>Awards / Badges</L>
            <ToggleControl
              label="Show Awards"
              value={!!c.showAwards}
              onChange={(v) => u("showAwards", v)}
            />
            {c.showAwards && (
              <>
                {(c.awards || []).map((a) => (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      gap: 5,
                      marginBottom: 5,
                      alignItems: "center",
                    }}
                  >
                    <input
                      style={{
                        width: 36,
                        padding: "5px 6px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        fontSize: 14,
                        textAlign: "center",
                        outline: "none",
                      }}
                      value={a.icon || ""}
                      onChange={(e) => uAward(a.id, { icon: e.target.value })}
                      placeholder="🏆"
                    />
                    <input
                      style={{
                        flex: 1,
                        padding: "5px 8px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        fontSize: 11,
                        outline: "none",
                      }}
                      value={a.label || ""}
                      onChange={(e) => uAward(a.id, { label: e.target.value })}
                      placeholder="Award label"
                    />
                    <button
                      onClick={() => delAward(a.id)}
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
                  onClick={addAward}
                  style={{
                    width: "100%",
                    border: "1px dashed #cbd5e1",
                    background: "none",
                    borderRadius: 6,
                    padding: 5,
                    fontSize: 11,
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  + Add Award
                </button>
              </>
            )}
          </G>
        </div>
      )}

      {/* ── STYLE TAB ── */}
      {activeTab === "style" && (
        <div>
          <G>
            <L>Typography</L>
            <SelectControl
              label="Heading Font"
              value={c.headingFont || "Inter"}
              options={GOOGLE_FONTS.map((f) => ({ value: f, label: f }))}
              onChange={(v) => u("headingFont", v)}
            />
            <SelectControl
              label="Body Font"
              value={c.bodyFont || "Inter"}
              options={GOOGLE_FONTS.map((f) => ({ value: f, label: f }))}
              onChange={(v) => u("bodyFont", v)}
            />
          </G>
          <D />
          <G>
            <L>Colors</L>
            <ColorControl
              label="Accent Color"
              value={c.accentColor || "#6366f1"}
              onChange={(v) => u("accentColor", v)}
            />
            <ColorControl
              label="Heading Color"
              value={c.headingColor || "#ffffff"}
              onChange={(v) => u("headingColor", v)}
            />
            <ColorControl
              label="Text Color"
              value={c.textColor || "rgba(255,255,255,0.6)"}
              onChange={(v) => u("textColor", v)}
            />
            <ColorControl
              label="Link Color"
              value={c.linkColor || "rgba(255,255,255,0.55)"}
              onChange={(v) => u("linkColor", v)}
            />
            <ColorControl
              label="Link Hover Color"
              value={c.linkHoverColor || "#ffffff"}
              onChange={(v) => u("linkHoverColor", v)}
            />
            <ColorControl
              label="Divider Color"
              value={c.dividerColor || "rgba(255,255,255,0.08)"}
              onChange={(v) => u("dividerColor", v)}
            />
          </G>
          <D />
          <G>
            <L>Spacing</L>
            <RangeControl
              label="Padding Y"
              value={c.paddingY ?? 64}
              min={0}
              max={200}
              onChange={(v) => u("paddingY", v)}
              unit="px"
            />
            <RangeControl
              label="Padding X"
              value={c.paddingX ?? 48}
              min={0}
              max={120}
              onChange={(v) => u("paddingX", v)}
              unit="px"
            />
          </G>
        </div>
      )}
    </div>
  );
}
