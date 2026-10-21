import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";
import { useState } from "react";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

/* ─── Prebuilt Templates ─── */
const TEMPLATES = [
  {
    id: "saas-indigo",
    name: "SaaS Indigo",
    emoji: "💎",
    preview: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    config: {
      bg: "#f8fafc",
      bgType: "solid",
      headingFont: "Inter",
      bodyFont: "Inter",
      accentColor: "#4f46e5",
      headingColor: "#0f172a",
      subheadingColor: "#64748b",
      cardTextColor: "#374151",
      dividerColor: "#f1f5f9",
      toggleBg: "#e0e7ff",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#4f46e5",
      toggleInactiveColor: "#6366f1",
      cardBorderRadius: 16,
      cardPadding: 32,
      cardGap: 24,
      ctaBorderRadius: 10,
      highlightedScale: true,
      showPopularBadge: true,
      popularLabel: "POPULAR",
      layout: { variant: "cards", align: "center", cardStyle: "elevated" },
    },
  },
  {
    id: "dark-pro",
    name: "Dark Pro",
    emoji: "🌑",
    preview: "linear-gradient(135deg,#0f172a,#1e293b)",
    config: {
      bg: "#0f172a",
      bgType: "solid",
      headingFont: "Inter",
      bodyFont: "Inter",
      accentColor: "#6366f1",
      headingColor: "#f8fafc",
      subheadingColor: "rgba(248,250,252,0.55)",
      cardTextColor: "#e2e8f0",
      dividerColor: "rgba(255,255,255,0.06)",
      toggleBg: "rgba(255,255,255,0.07)",
      toggleActiveBg: "rgba(255,255,255,0.12)",
      toggleActiveColor: "#fff",
      toggleInactiveColor: "rgba(255,255,255,0.5)",
      cardBorderRadius: 16,
      cardPadding: 32,
      cardGap: 24,
      ctaBorderRadius: 10,
      highlightedScale: true,
      showPopularBadge: true,
      layout: { variant: "cards", align: "center", cardStyle: "glass" },
    },
  },
  {
    id: "emerald-clean",
    name: "Emerald Clean",
    emoji: "🟢",
    preview: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
    config: {
      bg: "#f0fdf4",
      bgType: "solid",
      headingFont: "DM Sans",
      bodyFont: "DM Sans",
      accentColor: "#16a34a",
      headingColor: "#052e16",
      subheadingColor: "#166534",
      cardTextColor: "#166534",
      dividerColor: "#bbf7d0",
      toggleBg: "#dcfce7",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#16a34a",
      toggleInactiveColor: "#4ade80",
      cardBorderRadius: 12,
      cardPadding: 28,
      cardGap: 20,
      ctaBorderRadius: 8,
      highlightedScale: false,
      showPopularBadge: true,
      layout: { variant: "cards", align: "left", cardStyle: "bordered" },
    },
  },
  {
    id: "orange-bold",
    name: "Orange Bold",
    emoji: "🔥",
    preview: "linear-gradient(135deg,#fff7ed,#ffedd5)",
    config: {
      bg: "#fff7ed",
      bgType: "solid",
      headingFont: "Poppins",
      bodyFont: "Inter",
      accentColor: "#ea580c",
      headingColor: "#431407",
      subheadingColor: "#9a3412",
      cardTextColor: "#431407",
      dividerColor: "#fed7aa",
      toggleBg: "#ffedd5",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#ea580c",
      toggleInactiveColor: "#f97316",
      cardBorderRadius: 20,
      cardPadding: 36,
      cardGap: 20,
      ctaBorderRadius: 100,
      highlightedScale: true,
      showPopularBadge: true,
      popularLabel: "BEST VALUE",
      layout: { variant: "cards", align: "center", cardStyle: "elevated" },
    },
  },
  {
    id: "midnight-gradient",
    name: "Midnight Gradient",
    emoji: "🌌",
    preview: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
    config: {
      bgType: "gradient",
      bgGradient: { direction: "135deg", from: "#0f0c29", to: "#302b63" },
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      accentColor: "#a78bfa",
      headingColor: "#ede9fe",
      subheadingColor: "rgba(237,233,254,0.6)",
      cardTextColor: "#ede9fe",
      dividerColor: "rgba(167,139,250,0.15)",
      toggleBg: "rgba(167,139,250,0.1)",
      toggleActiveBg: "rgba(167,139,250,0.2)",
      toggleActiveColor: "#ede9fe",
      toggleInactiveColor: "rgba(237,233,254,0.5)",
      cardBorderRadius: 20,
      cardPadding: 36,
      cardGap: 24,
      ctaBorderRadius: 12,
      highlightedScale: true,
      showPopularBadge: true,
      layout: { variant: "cards", align: "center", cardStyle: "glass" },
    },
  },
  {
    id: "horizontal-slate",
    name: "Horizontal Slate",
    emoji: "📋",
    preview: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    config: {
      bg: "#f8fafc",
      bgType: "solid",
      headingFont: "Inter",
      bodyFont: "Inter",
      accentColor: "#0f172a",
      headingColor: "#0f172a",
      subheadingColor: "#475569",
      cardTextColor: "#374151",
      dividerColor: "#e2e8f0",
      toggleBg: "#e2e8f0",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#0f172a",
      toggleInactiveColor: "#64748b",
      cardBorderRadius: 14,
      cardPadding: 28,
      cardGap: 16,
      ctaBorderRadius: 8,
      highlightedScale: false,
      showPopularBadge: true,
      layout: { variant: "horizontal", align: "left", cardStyle: "bordered" },
    },
  },
  {
    id: "comparison-blue",
    name: "Comparison Table",
    emoji: "📊",
    preview: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    config: {
      bg: "#eff6ff",
      bgType: "solid",
      headingFont: "Inter",
      bodyFont: "Inter",
      accentColor: "#2563eb",
      headingColor: "#1e3a8a",
      subheadingColor: "#3b82f6",
      cardTextColor: "#1e3a8a",
      dividerColor: "#bfdbfe",
      tableStripeColor: "rgba(37,99,235,0.03)",
      toggleBg: "#dbeafe",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#2563eb",
      toggleInactiveColor: "#3b82f6",
      cardBorderRadius: 16,
      cardPadding: 32,
      cardGap: 0,
      ctaBorderRadius: 8,
      highlightedScale: false,
      showPopularBadge: true,
      layout: { variant: "comparison", align: "center", cardStyle: "elevated" },
    },
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    emoji: "🪟",
    preview: "linear-gradient(135deg,#ffffff,#f1f5f9)",
    config: {
      bg: "#ffffff",
      bgType: "solid",
      headingFont: "DM Sans",
      bodyFont: "DM Sans",
      accentColor: "#6366f1",
      headingColor: "#111827",
      subheadingColor: "#6b7280",
      cardTextColor: "#374151",
      dividerColor: "#f3f4f6",
      toggleBg: "#f3f4f6",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#111827",
      toggleInactiveColor: "#9ca3af",
      cardBorderRadius: 20,
      cardPadding: 32,
      cardGap: 0,
      ctaBorderRadius: 10,
      highlightedScale: false,
      showPopularBadge: true,
      layout: { variant: "minimal", align: "center", cardStyle: "flat" },
    },
  },
  {
    id: "rose-premium",
    name: "Rose Premium",
    emoji: "🌸",
    preview: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
    config: {
      bg: "#fff1f2",
      bgType: "solid",
      headingFont: "Cormorant Garamond",
      bodyFont: "Inter",
      accentColor: "#e11d48",
      headingColor: "#881337",
      subheadingColor: "#be123c",
      cardTextColor: "#881337",
      dividerColor: "#fecdd3",
      toggleBg: "#ffe4e6",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#e11d48",
      toggleInactiveColor: "#fb7185",
      cardBorderRadius: 20,
      cardPadding: 36,
      cardGap: 24,
      ctaBorderRadius: 100,
      highlightedScale: true,
      showPopularBadge: true,
      popularLabel: "TOP PICK",
      layout: { variant: "cards", align: "center", cardStyle: "elevated" },
    },
  },
  {
    id: "teal-startup",
    name: "Teal Startup",
    emoji: "🚀",
    preview: "linear-gradient(135deg,#f0fdfa,#ccfbf1)",
    config: {
      bg: "#f0fdfa",
      bgType: "solid",
      headingFont: "Space Grotesk",
      bodyFont: "Inter",
      accentColor: "#0d9488",
      headingColor: "#042f2e",
      subheadingColor: "#0f766e",
      cardTextColor: "#042f2e",
      dividerColor: "#99f6e4",
      toggleBg: "#ccfbf1",
      toggleActiveBg: "#fff",
      toggleActiveColor: "#0d9488",
      toggleInactiveColor: "#14b8a6",
      cardBorderRadius: 14,
      cardPadding: 30,
      cardGap: 20,
      ctaBorderRadius: 8,
      highlightedScale: true,
      showPopularBadge: true,
      layout: { variant: "cards", align: "left", cardStyle: "elevated" },
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
];

const SECTION_TYPES = [
  { value: "features", label: "Feature Group" },
  { value: "faq", label: "FAQ Accordion" },
  { value: "guarantee", label: "Guarantee Badge" },
  { value: "usage", label: "Usage Limits" },
  { value: "note", label: "Custom Note" },
];

export default function PricingPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ub = (k, v) => onChange({ badge: { ...c.badge, [k]: v } });

  // billing periods helpers
  const periods = c.billingPeriods || [
    { id: uid(), label: "Monthly", suffix: "mo", key: "monthlyPrice" },
    { id: uid(), label: "Yearly", suffix: "yr", key: "yearlyPrice" },
  ];
  const updatePeriod = (id, patch) =>
    u(
      "billingPeriods",
      periods.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  const addPeriod = () =>
    u("billingPeriods", [
      ...periods,
      { id: uid(), label: "New Period", suffix: "mo", key: `price_${uid()}` },
    ]);
  const delPeriod = (id) =>
    u(
      "billingPeriods",
      periods.filter((p) => p.id !== id),
    );

  // plan helpers
  const up = (id, patch) =>
    onChange({
      plans: (c.plans || []).map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });

  const upf = (planId, fi, val) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? { ...p, features: p.features.map((f, i) => (i === fi ? val : f)) }
          : p,
      ),
    });
  const addFeature = (planId) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? { ...p, features: [...p.features, "New feature"] }
          : p,
      ),
    });
  const delFeature = (planId, fi) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? { ...p, features: p.features.filter((_, i) => i !== fi) }
          : p,
      ),
    });

  // plan extra sections helpers
  const addSection = (planId) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? {
              ...p,
              sections: [
                ...(p.sections || []),
                {
                  id: uid(),
                  type: "features",
                  title: "More Features",
                  items: ["Item 1"],
                },
              ],
            }
          : p,
      ),
    });
  const updateSection = (planId, secId, patch) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? {
              ...p,
              sections: (p.sections || []).map((s) =>
                s.id === secId ? { ...s, ...patch } : s,
              ),
            }
          : p,
      ),
    });
  const delSection = (planId, secId) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? { ...p, sections: (p.sections || []).filter((s) => s.id !== secId) }
          : p,
      ),
    });
  const addSectionItem = (planId, secId) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? {
              ...p,
              sections: (p.sections || []).map((s) =>
                s.id === secId
                  ? {
                      ...s,
                      items: [
                        ...(s.items || []),
                        s.type === "faq"
                          ? { q: "Question?", a: "Answer." }
                          : "New item",
                      ],
                    }
                  : s,
              ),
            }
          : p,
      ),
    });
  const updateSectionItem = (planId, secId, idx, val) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? {
              ...p,
              sections: (p.sections || []).map((s) =>
                s.id === secId
                  ? {
                      ...s,
                      items: s.items.map((it, i) => (i === idx ? val : it)),
                    }
                  : s,
              ),
            }
          : p,
      ),
    });
  const delSectionItem = (planId, secId, idx) =>
    onChange({
      plans: (c.plans || []).map((p) =>
        p.id === planId
          ? {
              ...p,
              sections: (p.sections || []).map((s) =>
                s.id === secId
                  ? { ...s, items: s.items.filter((_, i) => i !== idx) }
                  : s,
              ),
            }
          : p,
      ),
    });

  const addPlan = () =>
    onChange({
      plans: [
        ...(c.plans || []),
        {
          id: uid(),
          name: "New Plan",
          prices: {},
          currency: "$",
          description: "Plan description",
          features: ["Feature 1"],
          sections: [],
          cta: "Get Started",
          ctaUrl: "#",
          highlighted: false,
          bg: "#ffffff",
          accentColor: c.accentColor || "#2563eb",
          borderRadius: c.cardBorderRadius || 16,
        },
      ],
    });
  const delPlan = (id) =>
    onChange({ plans: (c.plans || []).filter((p) => p.id !== id) });

  const [activeTab, setActiveTab] = useState("templates");
  const [expandedPlan, setExpandedPlan] = useState(null);

  const applyTemplate = (tpl) => {
    onChange({
      ...tpl.config,
      badge: c.badge,
      heading: c.heading,
      subheading: c.subheading,
      plans: c.plans,
      showToggle: c.showToggle,
      animation: c.animation,
      paddingY: c.paddingY,
      paddingX: c.paddingX,
      billingPeriods: c.billingPeriods,
    });
  };

  const tabs = [
    { id: "templates", label: "Templates" },
    { id: "content", label: "Content" },
    { id: "billing", label: "Billing" },
    { id: "plans", label: "Plans" },
    { id: "style", label: "Style" },
    { id: "layout", label: "Layout" },
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
            Applies style only — your plans and content are preserved.
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
              >
                <div style={{ height: 48, background: tpl.preview }} />
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
                  <span>{tpl.emoji}</span>
                  {tpl.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      {activeTab === "content" && (
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
              placeholder="Heading"
              style={{ marginBottom: 5 }}
            />
            <input
              className="ctrl-input"
              value={c.subheading || ""}
              onChange={(e) => u("subheading", e.target.value)}
              placeholder="Subheading"
              style={{ marginBottom: 5 }}
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
            <L>Animation</L>
            <AnimationControl
              value={c.animation}
              onChange={(v) => u("animation", v)}
            />
          </G>
        </div>
      )}

      {/* ── BILLING PERIODS ── */}
      {activeTab === "billing" && (
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
            Define your billing periods. Each plan will have a price field per
            period.
          </div>
          <G>
            <L>Toggle</L>
            <ToggleControl
              label="Show Billing Toggle"
              value={!!c.showToggle}
              onChange={(v) => u("showToggle", v)}
            />
            {c.showToggle && (
              <>
                <ColorControl
                  label="Toggle BG"
                  value={c.toggleBg || "#f1f5f9"}
                  onChange={(v) => u("toggleBg", v)}
                />
                <ColorControl
                  label="Active BG"
                  value={c.toggleActiveBg || "#ffffff"}
                  onChange={(v) => u("toggleActiveBg", v)}
                />
                <ColorControl
                  label="Active Color"
                  value={c.toggleActiveColor || "#0f172a"}
                  onChange={(v) => u("toggleActiveColor", v)}
                />
                <ColorControl
                  label="Inactive Color"
                  value={c.toggleInactiveColor || "#64748b"}
                  onChange={(v) => u("toggleInactiveColor", v)}
                />
              </>
            )}
          </G>
          <D />
          <L>Billing Periods</L>
          {periods.map((period, i) => (
            <div
              key={period.id}
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
                  style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}
                >
                  Period {i + 1}
                </span>
                {periods.length > 1 && (
                  <button
                    onClick={() => delPeriod(period.id)}
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
                )}
              </div>
              <input
                className="ctrl-input"
                value={period.label}
                onChange={(e) =>
                  updatePeriod(period.id, { label: e.target.value })
                }
                placeholder="Label e.g. Monthly"
                style={{ marginBottom: 4 }}
              />
              <input
                className="ctrl-input"
                value={period.suffix}
                onChange={(e) =>
                  updatePeriod(period.id, { suffix: e.target.value })
                }
                placeholder="Suffix e.g. mo, yr, once"
                style={{ marginBottom: 4 }}
              />
              <input
                className="ctrl-input"
                value={period.savingsBadge || ""}
                onChange={(e) =>
                  updatePeriod(period.id, { savingsBadge: e.target.value })
                }
                placeholder='Savings badge e.g. "Save 20%"'
                style={{ marginBottom: 4 }}
              />
              <input
                className="ctrl-input"
                value={period.savingsLabel || ""}
                onChange={(e) =>
                  updatePeriod(period.id, { savingsLabel: e.target.value })
                }
                placeholder='Sub-label e.g. "Billed annually"'
              />
            </div>
          ))}
          <button
            onClick={addPeriod}
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
            + Add Billing Period
          </button>
        </div>
      )}

      {/* ── PLANS ── */}
      {activeTab === "plans" && (
        <div>
          <G>
            <L>Popular Badge</L>
            <ToggleControl
              label="Show Popular Badge"
              value={c.showPopularBadge !== false}
              onChange={(v) => u("showPopularBadge", v)}
            />
            {c.showPopularBadge !== false && (
              <input
                className="ctrl-input"
                value={c.popularLabel || "POPULAR"}
                onChange={(e) => u("popularLabel", e.target.value)}
                placeholder="POPULAR"
                style={{ marginBottom: 4 }}
              />
            )}
          </G>
          <D />
          {(c.plans || []).map((plan, i) => {
            const isOpen = expandedPlan === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  background: "#f8fafc",
                  border: `1px solid ${plan.highlighted ? "#2563eb" : "#e2e8f0"}`,
                  borderRadius: 8,
                  marginBottom: 10,
                  overflow: "hidden",
                }}
              >
                {/* Plan header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: isOpen ? "#f1f5f9" : "transparent",
                  }}
                  onClick={() => setExpandedPlan(isOpen ? null : plan.id)}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                  >
                    Plan {i + 1}: {plan.name}
                  </span>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        delPlan(plan.id);
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
                    {/* Basic info */}
                    <input
                      className="ctrl-input"
                      value={plan.name || ""}
                      onChange={(e) => up(plan.id, { name: e.target.value })}
                      placeholder="Plan name"
                      style={{ marginBottom: 4 }}
                    />
                    <input
                      className="ctrl-input"
                      value={plan.badge || ""}
                      onChange={(e) => up(plan.id, { badge: e.target.value })}
                      placeholder="Badge label (optional)"
                      style={{ marginBottom: 4 }}
                    />
                    <textarea
                      className="ctrl-input"
                      value={plan.description || ""}
                      onChange={(e) =>
                        up(plan.id, { description: e.target.value })
                      }
                      placeholder="Description"
                      rows={2}
                      style={{ marginBottom: 4, resize: "vertical" }}
                    />

                    {/* Currency */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      <input
                        className="ctrl-input"
                        value={plan.currency || "$"}
                        onChange={(e) =>
                          up(plan.id, { currency: e.target.value })
                        }
                        placeholder="$"
                        style={{ width: 40 }}
                      />
                      <input
                        className="ctrl-input"
                        value={plan.customPrice || ""}
                        onChange={(e) =>
                          up(plan.id, { customPrice: e.target.value })
                        }
                        placeholder='Custom price e.g. "Contact us"'
                        style={{ flex: 1 }}
                      />
                    </div>

                    {/* Price per billing period */}
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        marginBottom: 5,
                        letterSpacing: "0.5px",
                      }}
                    >
                      PRICES PER PERIOD
                    </div>
                    {periods.map((period) => (
                      <div
                        key={period.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            minWidth: 60,
                          }}
                        >
                          {period.label}
                        </span>
                        <input
                          className="ctrl-input"
                          type="number"
                          value={(plan.prices || {})[period.id] ?? ""}
                          onChange={(e) =>
                            up(plan.id, {
                              prices: {
                                ...(plan.prices || {}),
                                [period.id]: +e.target.value,
                              },
                            })
                          }
                          placeholder="0"
                          style={{ flex: 1 }}
                        />
                      </div>
                    ))}

                    <D />
                    {/* CTA */}
                    <input
                      className="ctrl-input"
                      value={plan.cta || ""}
                      onChange={(e) => up(plan.id, { cta: e.target.value })}
                      placeholder="CTA label"
                      style={{ marginBottom: 4 }}
                    />
                    <input
                      className="ctrl-input"
                      value={plan.ctaUrl || ""}
                      onChange={(e) => up(plan.id, { ctaUrl: e.target.value })}
                      placeholder="CTA URL"
                      style={{ marginBottom: 4 }}
                    />

                    {/* Colors */}
                    <ColorControl
                      label="Card BG"
                      value={plan.bg || "#fff"}
                      onChange={(v) => up(plan.id, { bg: v })}
                    />
                    <ColorControl
                      label="Accent Color"
                      value={plan.accentColor || "#2563eb"}
                      onChange={(v) => up(plan.id, { accentColor: v })}
                    />
                    <ToggleControl
                      label="Highlighted (Popular)"
                      value={!!plan.highlighted}
                      onChange={(v) => up(plan.id, { highlighted: v })}
                    />

                    <D />
                    {/* Main features */}
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        marginBottom: 5,
                        letterSpacing: "0.5px",
                      }}
                    >
                      MAIN FEATURES
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        marginBottom: 6,
                      }}
                    >
                      Wrap with ~~text~~ to show as unavailable
                    </div>
                    {(plan.features || []).map((f, fi) => (
                      <div
                        key={fi}
                        style={{
                          display: "flex",
                          gap: 5,
                          marginBottom: 4,
                          alignItems: "center",
                        }}
                      >
                        <input
                          className="ctrl-input"
                          value={f}
                          onChange={(e) => upf(plan.id, fi, e.target.value)}
                          placeholder="Feature"
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => delFeature(plan.id, fi)}
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
                      onClick={() => addFeature(plan.id)}
                      style={{
                        width: "100%",
                        border: "1px dashed #cbd5e1",
                        background: "none",
                        borderRadius: 6,
                        padding: 4,
                        fontSize: 11,
                        color: "#94a3b8",
                        cursor: "pointer",
                        marginBottom: 8,
                      }}
                    >
                      + Feature
                    </button>

                    <D />
                    {/* Custom Sections */}
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        marginBottom: 6,
                        letterSpacing: "0.5px",
                      }}
                    >
                      EXTRA SECTIONS
                    </div>
                    {(plan.sections || []).map((sec) => (
                      <div
                        key={sec.id}
                        style={{
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          padding: 8,
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
                          <SelectControl
                            value={sec.type}
                            options={SECTION_TYPES}
                            onChange={(v) =>
                              updateSection(plan.id, sec.id, {
                                type: v,
                                items: [],
                              })
                            }
                          />
                          <button
                            onClick={() => delSection(plan.id, sec.id)}
                            style={{
                              border: "none",
                              background: "none",
                              color: "#cbd5e1",
                              cursor: "pointer",
                              fontSize: 14,
                              marginLeft: 6,
                            }}
                          >
                            ×
                          </button>
                        </div>
                        <input
                          className="ctrl-input"
                          value={sec.title || ""}
                          onChange={(e) =>
                            updateSection(plan.id, sec.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Section title"
                          style={{ marginBottom: 6 }}
                        />

                        {/* Guarantee type */}
                        {sec.type === "guarantee" && (
                          <>
                            <input
                              className="ctrl-input"
                              value={sec.icon || "🛡️"}
                              onChange={(e) =>
                                updateSection(plan.id, sec.id, {
                                  icon: e.target.value,
                                })
                              }
                              placeholder="Icon emoji"
                              style={{ marginBottom: 4 }}
                            />
                            <input
                              className="ctrl-input"
                              value={sec.text || ""}
                              onChange={(e) =>
                                updateSection(plan.id, sec.id, {
                                  text: e.target.value,
                                })
                              }
                              placeholder="e.g. 30-day money-back guarantee"
                            />
                          </>
                        )}

                        {/* Note type */}
                        {sec.type === "note" && (
                          <textarea
                            className="ctrl-input"
                            value={sec.text || ""}
                            onChange={(e) =>
                              updateSection(plan.id, sec.id, {
                                text: e.target.value,
                              })
                            }
                            placeholder="Note text..."
                            rows={2}
                            style={{ resize: "vertical" }}
                          />
                        )}

                        {/* Feature group, FAQ, Usage */}
                        {["features", "faq", "usage"].includes(sec.type) && (
                          <>
                            {(sec.items || []).map((item, idx) => (
                              <div key={idx} style={{ marginBottom: 4 }}>
                                {sec.type === "faq" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 3,
                                    }}
                                  >
                                    <div style={{ display: "flex", gap: 4 }}>
                                      <input
                                        className="ctrl-input"
                                        value={item.q || ""}
                                        onChange={(e) =>
                                          updateSectionItem(
                                            plan.id,
                                            sec.id,
                                            idx,
                                            { ...item, q: e.target.value },
                                          )
                                        }
                                        placeholder="Question"
                                        style={{ flex: 1 }}
                                      />
                                      <button
                                        onClick={() =>
                                          delSectionItem(plan.id, sec.id, idx)
                                        }
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
                                    <input
                                      className="ctrl-input"
                                      value={item.a || ""}
                                      onChange={(e) =>
                                        updateSectionItem(
                                          plan.id,
                                          sec.id,
                                          idx,
                                          { ...item, a: e.target.value },
                                        )
                                      }
                                      placeholder="Answer"
                                    />
                                  </div>
                                ) : sec.type === "usage" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 4,
                                      alignItems: "center",
                                    }}
                                  >
                                    <input
                                      className="ctrl-input"
                                      value={
                                        typeof item === "object"
                                          ? item.label || ""
                                          : item
                                      }
                                      onChange={(e) =>
                                        updateSectionItem(
                                          plan.id,
                                          sec.id,
                                          idx,
                                          {
                                            label: e.target.value,
                                            value: item?.value ?? 50,
                                            max: item?.max ?? 100,
                                          },
                                        )
                                      }
                                      placeholder="Label e.g. API Calls"
                                      style={{ flex: 2 }}
                                    />
                                    <input
                                      className="ctrl-input"
                                      type="number"
                                      value={item?.value ?? 50}
                                      onChange={(e) =>
                                        updateSectionItem(
                                          plan.id,
                                          sec.id,
                                          idx,
                                          { ...item, value: +e.target.value },
                                        )
                                      }
                                      placeholder="Value"
                                      style={{ flex: 1 }}
                                    />
                                    <input
                                      className="ctrl-input"
                                      type="number"
                                      value={item?.max ?? 100}
                                      onChange={(e) =>
                                        updateSectionItem(
                                          plan.id,
                                          sec.id,
                                          idx,
                                          { ...item, max: +e.target.value },
                                        )
                                      }
                                      placeholder="Max"
                                      style={{ flex: 1 }}
                                    />
                                    <button
                                      onClick={() =>
                                        delSectionItem(plan.id, sec.id, idx)
                                      }
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
                                ) : (
                                  <div style={{ display: "flex", gap: 4 }}>
                                    <input
                                      className="ctrl-input"
                                      value={item}
                                      onChange={(e) =>
                                        updateSectionItem(
                                          plan.id,
                                          sec.id,
                                          idx,
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Feature"
                                      style={{ flex: 1 }}
                                    />
                                    <button
                                      onClick={() =>
                                        delSectionItem(plan.id, sec.id, idx)
                                      }
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
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => addSectionItem(plan.id, sec.id)}
                              style={{
                                width: "100%",
                                border: "1px dashed #cbd5e1",
                                background: "none",
                                borderRadius: 6,
                                padding: 3,
                                fontSize: 11,
                                color: "#94a3b8",
                                cursor: "pointer",
                              }}
                            >
                              +{" "}
                              {sec.type === "faq"
                                ? "Q&A"
                                : sec.type === "usage"
                                  ? "Usage Item"
                                  : "Item"}
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addSection(plan.id)}
                      style={{
                        width: "100%",
                        border: "1px dashed #94a3b8",
                        background: "none",
                        borderRadius: 6,
                        padding: 5,
                        fontSize: 11,
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      + Add Section
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={addPlan}
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
            + Add Plan
          </button>
        </div>
      )}

      {/* ── STYLE ── */}
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
            <L>Card Style</L>
            <SelectControl
              value={c.layout?.cardStyle || "elevated"}
              options={[
                { value: "elevated", label: "Elevated (shadow)" },
                { value: "bordered", label: "Bordered" },
                { value: "glass", label: "Glass (blur)" },
                { value: "flat", label: "Flat (no border)" },
              ]}
              onChange={(v) =>
                onChange({ layout: { ...c.layout, cardStyle: v } })
              }
            />
            <ColorControl
              label="Card Text Color"
              value={c.cardTextColor || "#374151"}
              onChange={(v) => u("cardTextColor", v)}
            />
            <ColorControl
              label="Divider / Stripe Color"
              value={c.dividerColor || "#f1f5f9"}
              onChange={(v) => u("dividerColor", v)}
            />
            <ColorControl
              label="Accent Color (global)"
              value={c.accentColor || "#2563eb"}
              onChange={(v) => u("accentColor", v)}
            />
          </G>
          <D />
          <G>
            <L>Card Shape & Size</L>
            <RangeControl
              label="Border Radius"
              value={c.cardBorderRadius ?? 16}
              min={0}
              max={40}
              onChange={(v) => u("cardBorderRadius", v)}
              unit="px"
            />
            <RangeControl
              label="Padding"
              value={c.cardPadding ?? 32}
              min={12}
              max={64}
              onChange={(v) => u("cardPadding", v)}
              unit="px"
            />
            <RangeControl
              label="Gap"
              value={c.cardGap ?? 24}
              min={0}
              max={64}
              onChange={(v) => u("cardGap", v)}
              unit="px"
            />
            <RangeControl
              label="CTA Border Radius"
              value={c.ctaBorderRadius ?? 10}
              min={0}
              max={100}
              onChange={(v) => u("ctaBorderRadius", v)}
              unit="px"
            />
            <ToggleControl
              label="Scale Highlighted Card"
              value={c.highlightedScale !== false}
              onChange={(v) => u("highlightedScale", v)}
            />
          </G>
          <D />
          <G>
            <L>Spacing</L>
            <RangeControl
              label="Max Width"
              value={c.maxWidth ?? 1100}
              min={600}
              max={1400}
              onChange={(v) => u("maxWidth", v)}
              unit="px"
            />
            <RangeControl
              label="Padding Y"
              value={c.paddingY ?? 80}
              min={0}
              max={200}
              onChange={(v) => u("paddingY", v)}
              unit="px"
            />
            <RangeControl
              label="Padding X"
              value={c.paddingX ?? 32}
              min={0}
              max={120}
              onChange={(v) => u("paddingX", v)}
              unit="px"
            />
          </G>
        </div>
      )}

      {/* ── LAYOUT ── */}
      {activeTab === "layout" && (
        <div>
          <G>
            <L>Layout Variant</L>
            <SelectControl
              value={c.layout?.variant || "cards"}
              options={[
                { value: "cards", label: "Cards Grid (default)" },
                { value: "horizontal", label: "Horizontal Rows" },
                { value: "comparison", label: "Comparison Table" },
                { value: "minimal", label: "Minimal Inline" },
              ]}
              onChange={(v) =>
                onChange({ layout: { ...c.layout, variant: v } })
              }
            />
            <L>Heading Alignment</L>
            <SelectControl
              value={c.layout?.align || "center"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => onChange({ layout: { ...c.layout, align: v } })}
            />
            {(c.layout?.variant === "cards" || !c.layout?.variant) && (
              <RangeControl
                label="Max Columns"
                value={c.maxCols ?? 3}
                min={1}
                max={4}
                onChange={(v) => u("maxCols", v)}
              />
            )}
            {c.layout?.variant === "comparison" && (
              <ColorControl
                label="Table Stripe Color"
                value={c.tableStripeColor || "rgba(0,0,0,0.02)"}
                onChange={(v) => u("tableStripeColor", v)}
              />
            )}
          </G>
        </div>
      )}
    </div>
  );
}
