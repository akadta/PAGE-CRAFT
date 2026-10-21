import { useState, useEffect } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { SectionBadge, SectionHeading } from "./AboutSection";
import { loadFont } from "../../../utils/fontLoader";

const getBg = (c) =>
  c.bgType === "gradient"
    ? `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`
    : c.bgType === "image" && c.bgImage
      ? `url(${c.bgImage})`
      : c.bg || "#f8fafc";

/* ─── responsive hook ──────────────────────────────────────── */
function useBreakpoint() {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return bp;
}

const CheckIcon = ({ color }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "#2563eb"}
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CrossIcon = ({ color }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "#cbd5e1"}
    strokeWidth="2.5"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─── CSS injection for responsive helpers ─────────────────── */
const CSS_ID = "__pricing_css__";
function injectCSS() {
  if (document.getElementById(CSS_ID)) return;
  const s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = `
    @media (max-width: 1023px){
      ._pCardsGrid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}
      ._pHighlight{transform:scale(1) !important;}
    }
    @media (max-width: 639px){
      ._pCardsGrid{grid-template-columns:1fr !important;}
      ._pMinimalRow{flex-direction:column !important;}
      ._pMinimalCol{border-right:none !important;border-bottom:1px solid var(--pdiv,#e2e8f0);}
      ._pMinimalCol:last-child{border-bottom:none !important;}
      ._pHorizCard{flex-direction:column !important;align-items:flex-start !important;gap:16px !important;}
      ._pHorizPrice{text-align:left !important;width:100%;}
      ._pHorizFeatures{flex-direction:column !important;gap:6px !important;}
      ._pToggleWrap{justify-content:center !important;}
      ._pHeading{padding-left:8px;padding-right:8px;}
    }
  `;
  document.head.appendChild(s);
}

export default function PricingSection({ config: c, navId }) {
  loadFont(c.headingFont);
  loadFont(c.bodyFont);
  const ref = useScrollAnimation(c.animation);
  injectCSS();
  const bp = useBreakpoint();

  // billing periods — fallback to classic monthly/yearly if none defined
  const periods = c.billingPeriods || [
    { id: "__monthly", label: "Monthly", suffix: "mo", key: "monthlyPrice" },
    {
      id: "__yearly",
      label: "Yearly",
      suffix: "yr",
      key: "yearlyPrice",
      savingsBadge: "Save 20%",
      savingsLabel: "Billed annually",
    },
  ];

  const [activePeriodId, setActivePeriodId] = useState(
    periods[0]?.id || "__monthly",
  );
  const activePeriod =
    periods.find((p) => p.id === activePeriodId) || periods[0];

  const plans = c.plans || [];
  const align = c.layout?.align || "center";
  let variant = c.layout?.variant || "cards";
  const cardStyle = c.layout?.cardStyle || "elevated";
  const textAlign =
    align === "center" ? "center" : align === "right" ? "right" : "left";
  const justifyContent =
    align === "center"
      ? "center"
      : align === "right"
        ? "flex-end"
        : "flex-start";
  const accentColor = c.accentColor || "#2563eb";

  // On mobile, comparison and horizontal variants are unwieldy — fall back to cards
  const effectiveVariant =
    bp === "mobile" && (variant === "comparison" || variant === "horizontal")
      ? variant === "comparison"
        ? "comparison-scroll"
        : "horizontal"
      : variant;

  // Get price for active period
  const getPlanPrice = (plan) => {
    if (plan.customPrice) return null;
    // new prices object by period id
    if (plan.prices && plan.prices[activePeriod.id] !== undefined)
      return plan.prices[activePeriod.id];
    // fallback to legacy monthlyPrice/yearlyPrice
    if (activePeriod.id === "__monthly" || activePeriod.key === "monthlyPrice")
      return plan.monthlyPrice ?? 0;
    if (activePeriod.id === "__yearly" || activePeriod.key === "yearlyPrice")
      return plan.yearlyPrice ?? 0;
    return 0;
  };

  const getCardBg = (plan) => {
    if (plan.highlighted) {
      const color = plan.accentColor;
      return color &&
        color !== "#ffffff" &&
        color !== "#fff" &&
        color !== "white"
        ? color
        : accentColor;
    }
    if (cardStyle === "glass") return "rgba(255,255,255,0.07)";
    if (cardStyle === "flat") return "transparent";
    return plan.bg || "#ffffff";
  };

  const getCardBorder = (plan) => {
    if (plan.highlighted) return `2px solid ${plan.accentColor || accentColor}`;
    if (cardStyle === "glass") return "1px solid rgba(255,255,255,0.12)";
    if (cardStyle === "flat") return `1px solid ${c.dividerColor || "#e2e8f0"}`;
    if (cardStyle === "bordered")
      return `2px solid ${c.dividerColor || "#e2e8f0"}`;
    return "1px solid #e2e8f0";
  };

  const getCardShadow = (plan) => {
    if (cardStyle === "flat" || cardStyle === "glass") return "none";
    if (plan.highlighted)
      return `0 24px 64px ${plan.accentColor || accentColor}40`;
    return "0 4px 24px rgba(0,0,0,0.06)";
  };

  const getTextColor = (plan, opacity = 1) => {
    if (plan.highlighted) return `rgba(255,255,255,${opacity})`;
    return c.cardTextColor || (opacity < 1 ? "#64748b" : "#0f172a");
  };

  /* ── Sub-components ── */
  const FeatureRow = ({ f, plan }) => {
    const isCross = f.startsWith("~~") && f.endsWith("~~");
    const label = isCross ? f.slice(2, -2) : f;
    return (
      <li
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          color: getTextColor(plan, plan.highlighted ? 0.9 : 1),
          padding: "7px 0",
          borderBottom: `1px solid ${plan.highlighted ? "rgba(255,255,255,0.1)" : c.dividerColor || "#f1f5f9"}`,
        }}
      >
        {isCross ? (
          <CrossIcon
            color={plan.highlighted ? "rgba(255,255,255,0.35)" : "#cbd5e1"}
          />
        ) : (
          <CheckIcon
            color={plan.highlighted ? "#fff" : plan.accentColor || accentColor}
          />
        )}
        <span style={{ opacity: isCross ? 0.45 : 1 }}>{label}</span>
      </li>
    );
  };

  const PriceDisplay = ({ plan }) => {
    const price = getPlanPrice(plan);
    return (
      <div style={{ marginBottom: 24 }}>
        {plan.customPrice ? (
          <div
            style={{
              fontSize: bp === "mobile" ? 28 : 36,
              fontWeight: 800,
              color: getTextColor(plan),
              fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
            }}
          >
            {plan.customPrice}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: getTextColor(plan, 0.7),
                alignSelf: "flex-start",
                marginTop: 10,
              }}
            >
              {plan.currency || "$"}
            </span>
            <span
              style={{
                fontSize: bp === "mobile" ? 42 : 52,
                fontWeight: 800,
                lineHeight: 1,
                color: getTextColor(plan),
                fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
              }}
            >
              {price}
            </span>
            <span
              style={{
                fontSize: 13,
                color: getTextColor(plan, 0.5),
                marginBottom: 6,
              }}
            >
              /{activePeriod.suffix || "mo"}
            </span>
          </div>
        )}
        {activePeriod.savingsLabel && !plan.customPrice && (
          <div
            style={{
              fontSize: 11,
              color: plan.highlighted ? "rgba(255,255,255,0.6)" : "#16a34a",
              marginTop: 2,
            }}
          >
            {activePeriod.savingsLabel}
          </div>
        )}
      </div>
    );
  };

  const CtaButton = ({ plan }) => (
    <a
      href={plan.ctaUrl || "#"}
      style={{
        display: "block",
        textAlign: "center",
        padding: "13px",
        borderRadius: c.ctaBorderRadius ?? 10,
        fontWeight: 700,
        fontSize: 14,
        textDecoration: "none",
        background: plan.highlighted
          ? "rgba(255,255,255,0.2)"
          : plan.accentColor || accentColor,
        color: "#fff",
        border: plan.highlighted ? "1.5px solid rgba(255,255,255,0.4)" : "none",
        transition: "all 0.2s",
        fontFamily: `'${c.bodyFont || "Inter"}',sans-serif`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.85";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {plan.cta || "Get Started"}
    </a>
  );

  /* ── Custom Extra Sections ── */
  const [openFaq, setOpenFaq] = useState({});

  const renderPlanSections = (plan) => {
    if (!plan.sections || plan.sections.length === 0) return null;
    return plan.sections.map((sec) => {
      const titleStyle = {
        fontSize: 12,
        fontWeight: 700,
        color: getTextColor(plan, 0.55),
        marginBottom: 8,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      };

      if (sec.type === "guarantee")
        return (
          <div
            key={sec.id}
            style={{
              marginTop: 16,
              padding: "10px 14px",
              borderRadius: 8,
              background: plan.highlighted
                ? "rgba(255,255,255,0.12)"
                : c.dividerColor || "#f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>{sec.icon || "🛡️"}</span>
            <div>
              {sec.title && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: getTextColor(plan, 0.7),
                    marginBottom: 2,
                  }}
                >
                  {sec.title}
                </div>
              )}
              <div style={{ fontSize: 12, color: getTextColor(plan, 0.6) }}>
                {sec.text || "Money-back guarantee"}
              </div>
            </div>
          </div>
        );

      if (sec.type === "note")
        return (
          <div
            key={sec.id}
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 8,
              background: plan.highlighted
                ? "rgba(255,255,255,0.08)"
                : c.dividerColor || "#f8fafc",
              borderLeft: `3px solid ${plan.highlighted ? "rgba(255,255,255,0.3)" : plan.accentColor || accentColor}`,
            }}
          >
            {sec.title && <div style={titleStyle}>{sec.title}</div>}
            <div
              style={{
                fontSize: 13,
                color: getTextColor(plan, 0.7),
                lineHeight: 1.5,
              }}
            >
              {sec.text}
            </div>
          </div>
        );

      if (sec.type === "features")
        return (
          <div key={sec.id} style={{ marginTop: 16 }}>
            {sec.title && <div style={titleStyle}>{sec.title}</div>}
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {(sec.items || []).map((f, i) => (
                <FeatureRow key={i} f={f} plan={plan} />
              ))}
            </ul>
          </div>
        );

      if (sec.type === "faq")
        return (
          <div key={sec.id} style={{ marginTop: 16 }}>
            {sec.title && <div style={titleStyle}>{sec.title}</div>}
            {(sec.items || []).map((item, i) => {
              const faqKey = `${sec.id}-${i}`;
              const isOpen = openFaq[faqKey];
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: `1px solid ${plan.highlighted ? "rgba(255,255,255,0.1)" : c.dividerColor || "#f1f5f9"}`,
                  }}
                >
                  <button
                    onClick={() =>
                      setOpenFaq((prev) => ({
                        ...prev,
                        [faqKey]: !prev[faqKey],
                      }))
                    }
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      color: getTextColor(plan, 0.85),
                      textAlign: "left",
                    }}
                  >
                    {item.q || item}
                    <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 8 }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        fontSize: 12,
                        color: getTextColor(plan, 0.6),
                        paddingBottom: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      if (sec.type === "usage")
        return (
          <div key={sec.id} style={{ marginTop: 16 }}>
            {sec.title && <div style={titleStyle}>{sec.title}</div>}
            {(sec.items || []).map((item, i) => {
              const label = typeof item === "object" ? item.label : item;
              const value = typeof item === "object" ? (item.value ?? 50) : 50;
              const max = typeof item === "object" ? (item.max ?? 100) : 100;
              const pct = Math.min(100, Math.round((value / max) * 100));
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: getTextColor(plan, 0.7),
                      marginBottom: 4,
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ fontWeight: 600 }}>
                      {value}/{max}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 100,
                      background: plan.highlighted
                        ? "rgba(255,255,255,0.15)"
                        : c.dividerColor || "#e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 100,
                        background: plan.highlighted
                          ? "rgba(255,255,255,0.7)"
                          : plan.accentColor || accentColor,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );

      return null;
    });
  };

  /* ── Toggle ── */
  const Toggle = () =>
    c.showToggle &&
    periods.length > 1 && (
      <div
        data-anim
        className="_pToggleWrap"
        style={{ display: "flex", justifyContent, marginBottom: 40 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: c.toggleBg || "#f1f5f9",
            borderRadius: 100,
            padding: "6px 8px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {periods.map((period) => {
            const active = activePeriodId === period.id;
            return (
              <button
                key={period.id}
                onClick={() => setActivePeriodId(period.id)}
                style={{
                  padding: bp === "mobile" ? "6px 16px" : "6px 22px",
                  borderRadius: 100,
                  border: "none",
                  cursor: "pointer",
                  background: active
                    ? c.toggleActiveBg || "#fff"
                    : "transparent",
                  color: active
                    ? c.toggleActiveColor || "#0f172a"
                    : c.toggleInactiveColor || "#64748b",
                  fontWeight: 600,
                  fontSize: bp === "mobile" ? 12 : 13,
                  boxShadow: active ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {period.label}
                {period.savingsBadge && (
                  <span
                    style={{ color: "#16a34a", fontSize: 11, marginLeft: 4 }}
                  >
                    {period.savingsBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );

  /* ── CARDS ── */
  const renderCards = () => {
    const cols = Math.min(plans.length, c.maxCols || 3);
    return (
      <div
        className="_pCardsGrid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
          gap: c.cardGap ?? 24,
          alignItems: c.alignCards === "top" ? "start" : "center",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            data-anim
            className={plan.highlighted ? "_pHighlight" : ""}
            style={{
              background: getCardBg(plan),
              borderRadius: plan.borderRadius ?? c.cardBorderRadius ?? 16,
              padding:
                bp === "mobile"
                  ? Math.min(c.cardPadding ?? 32, 24)
                  : (c.cardPadding ?? 32),
              boxShadow: getCardShadow(plan),
              border: getCardBorder(plan),
              transform:
                plan.highlighted &&
                c.highlightedScale !== false &&
                bp === "desktop"
                  ? "scale(1.04)"
                  : "scale(1)",
              position: "relative",
              overflow: "hidden",
              backdropFilter: cardStyle === "glass" ? "blur(12px)" : "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {plan.highlighted && c.showPopularBadge !== false && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 100,
                  letterSpacing: "0.5px",
                }}
              >
                {c.popularLabel || "POPULAR"}
              </div>
            )}
            {plan.badge && (
              <div
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 100,
                  background: (plan.accentColor || accentColor) + "20",
                  color: plan.accentColor || accentColor,
                  marginBottom: 12,
                  letterSpacing: "0.5px",
                }}
              >
                {plan.badge}
              </div>
            )}
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: getTextColor(plan),
                marginBottom: 4,
                fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
              }}
            >
              {plan.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: getTextColor(plan, 0.6),
                marginBottom: 20,
              }}
            >
              {plan.description}
            </div>
            <PriceDisplay plan={plan} />
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
              {(plan.features || []).map((f, i) => (
                <FeatureRow key={i} f={f} plan={plan} />
              ))}
            </ul>
            {renderPlanSections(plan)}
            <div style={{ marginTop: 24 }}>
              <CtaButton plan={plan} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ── HORIZONTAL ── */
  const renderHorizontal = () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: c.cardGap ?? 16 }}
    >
      {plans.map((plan) => (
        <div
          key={plan.id}
          data-anim
          className="_pHorizCard"
          style={{
            background: getCardBg(plan),
            borderRadius: plan.borderRadius ?? c.cardBorderRadius ?? 14,
            padding: bp === "mobile" ? "20px" : "24px 32px",
            boxShadow: getCardShadow(plan),
            border: getCardBorder(plan),
            display: "flex",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
            backdropFilter: cardStyle === "glass" ? "blur(12px)" : "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ flex: 2, minWidth: 160 }}>
            {plan.badge && (
              <div
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 100,
                  background: (plan.accentColor || accentColor) + "20",
                  color: plan.accentColor || accentColor,
                  marginBottom: 6,
                }}
              >
                {plan.badge}
              </div>
            )}
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: getTextColor(plan),
                fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
              }}
            >
              {plan.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: getTextColor(plan, 0.55),
                marginTop: 4,
              }}
            >
              {plan.description}
            </div>
          </div>
          <div
            className="_pHorizFeatures"
            style={{
              flex: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 20px",
              minWidth: bp === "mobile" ? "100%" : undefined,
            }}
          >
            {(plan.features || []).map((f, i) => {
              const isCross = f.startsWith("~~") && f.endsWith("~~");
              const label = isCross ? f.slice(2, -2) : f;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: getTextColor(plan, isCross ? 0.4 : 0.85),
                    minWidth: bp === "mobile" ? "auto" : 140,
                  }}
                >
                  {isCross ? (
                    <CrossIcon color="currentColor" />
                  ) : (
                    <CheckIcon
                      color={
                        plan.highlighted
                          ? "#fff"
                          : plan.accentColor || accentColor
                      }
                    />
                  )}
                  {label}
                </div>
              );
            })}
          </div>
          <div
            className="_pHorizPrice"
            style={{ flex: 1, minWidth: 140, textAlign: "right" }}
          >
            <div
              style={{
                fontSize: bp === "mobile" ? 28 : 32,
                fontWeight: 800,
                color: getTextColor(plan),
                fontFamily: `'${c.headingFont || "Inter"}',sans-serif`,
              }}
            >
              {plan.customPrice ||
                `${plan.currency || "$"}${getPlanPrice(plan)}`}
              {!plan.customPrice && (
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: getTextColor(plan, 0.5),
                  }}
                >
                  /{activePeriod.suffix || "mo"}
                </span>
              )}
            </div>
            <CtaButton plan={plan} />
          </div>
        </div>
      ))}
    </div>
  );

  /* ── COMPARISON TABLE ── */
  const renderComparison = () => {
    const allFeatures = [
      ...new Set(
        plans.flatMap((p) =>
          (p.features || []).map((f) => f.replace(/^~~|~~$/g, "")),
        ),
      ),
    ];
    return (
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          margin: bp === "mobile" ? "0 -16px" : 0,
          padding: bp === "mobile" ? "0 16px" : 0,
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: bp === "mobile" ? plans.length * 160 : "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                  fontSize: 13,
                  color: c.cardTextColor || "#64748b",
                  fontWeight: 600,
                  borderBottom: `2px solid ${c.dividerColor || "#e2e8f0"}`,
                  position: bp === "mobile" ? "sticky" : "static",
                  left: 0,
                  background: getBg(c),
                  zIndex: 1,
                  whiteSpace: "nowrap",
                }}
              >
                Features
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  style={{
                    padding: "12px 20px",
                    textAlign: "center",
                    background: plan.highlighted
                      ? plan.accentColor || accentColor
                      : "transparent",
                    color: plan.highlighted
                      ? "#fff"
                      : c.cardTextColor || "#0f172a",
                    borderRadius: plan.highlighted ? "12px 12px 0 0" : 0,
                    fontSize: 14,
                    minWidth: 140,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>
                    {plan.customPrice ||
                      `${plan.currency || "$"}${getPlanPrice(plan)}`}
                  </div>
                  {!plan.customPrice && (
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      /{activePeriod.suffix || "mo"}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feat, fi) => (
              <tr
                key={fi}
                style={{
                  background:
                    fi % 2 === 0
                      ? c.tableStripeColor || "rgba(0,0,0,0.02)"
                      : "transparent",
                }}
              >
                <td
                  style={{
                    padding: "11px 20px",
                    fontSize: 13,
                    color: c.cardTextColor || "#374151",
                    borderBottom: `1px solid ${c.dividerColor || "#f1f5f9"}`,
                    position: bp === "mobile" ? "sticky" : "static",
                    left: 0,
                    background:
                      fi % 2 === 0
                        ? c.tableStripeColor || "rgba(0,0,0,0.02)"
                        : getBg(c),
                    whiteSpace: "nowrap",
                  }}
                >
                  {feat}
                </td>
                {plans.map((plan) => {
                  const has = (plan.features || []).some(
                    (f) =>
                      f.replace(/^~~|~~$/g, "") === feat && !f.startsWith("~~"),
                  );
                  return (
                    <td
                      key={plan.id}
                      style={{
                        padding: "11px 20px",
                        textAlign: "center",
                        background: plan.highlighted
                          ? (plan.accentColor || accentColor) + "10"
                          : "transparent",
                        borderBottom: `1px solid ${c.dividerColor || "#f1f5f9"}`,
                      }}
                    >
                      {has ? (
                        <CheckIcon color={plan.accentColor || accentColor} />
                      ) : (
                        <CrossIcon color="#cbd5e1" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td
                style={{
                  padding: "20px",
                  position: bp === "mobile" ? "sticky" : "static",
                  left: 0,
                  background: getBg(c),
                }}
              />
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  style={{
                    padding: "16px 20px",
                    background: plan.highlighted
                      ? (plan.accentColor || accentColor) + "10"
                      : "transparent",
                    borderRadius: "0 0 12px 12px",
                  }}
                >
                  <CtaButton plan={plan} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  /* ── MINIMAL ── */
  const renderMinimal = () => (
    <div
      className="_pMinimalRow"
      style={{
        "--pdiv": c.dividerColor || "#e2e8f0",
        display: "flex",
        gap: c.cardGap ?? 0,
        flexWrap: "wrap",
        border: `1px solid ${c.dividerColor || "#e2e8f0"}`,
        borderRadius: c.cardBorderRadius ?? 16,
        overflow: "hidden",
      }}
    >
      {plans.map((plan, i) => (
        <div
          key={plan.id}
          data-anim
          className="_pMinimalCol"
          style={{
            flex: "1 1 0",
            minWidth: bp === "mobile" ? "100%" : 200,
            padding: bp === "mobile" ? 24 : (c.cardPadding ?? 32),
            borderRight:
              i < plans.length - 1 && bp !== "mobile"
                ? `1px solid ${c.dividerColor || "#e2e8f0"}`
                : "none",
            background: plan.highlighted
              ? plan.accentColor || accentColor
              : getCardBg(plan),
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {plan.highlighted && c.showPopularBadge !== false && (
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 100,
              }}
            >
              {c.popularLabel || "POPULAR"}
            </div>
          )}
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: getTextColor(plan),
              marginBottom: 4,
            }}
          >
            {plan.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: getTextColor(plan, 0.55),
              marginBottom: 16,
            }}
          >
            {plan.description}
          </div>
          <PriceDisplay plan={plan} />
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
            {(plan.features || []).map((f, fi) => (
              <FeatureRow key={fi} f={f} plan={plan} />
            ))}
          </ul>
          {renderPlanSections(plan)}
          <div style={{ marginTop: 24 }}>
            <CtaButton plan={plan} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderLayout = () => {
    if (effectiveVariant === "horizontal") return renderHorizontal();
    if (
      effectiveVariant === "comparison" ||
      effectiveVariant === "comparison-scroll"
    )
      return renderComparison();
    if (effectiveVariant === "minimal") return renderMinimal();
    return renderCards();
  };

  return (
    <section
      id={navId}
      style={{
        background: getBg(c),
        backgroundSize: c.bgType === "image" ? "cover" : undefined,
        backgroundPosition: c.bgType === "image" ? "center" : undefined,
        paddingTop:
          bp === "mobile" ? Math.min(c.paddingY ?? 80, 48) : (c.paddingY ?? 80),
        paddingBottom:
          bp === "mobile" ? Math.min(c.paddingY ?? 80, 48) : (c.paddingY ?? 80),
        paddingLeft:
          bp === "mobile" ? Math.min(c.paddingX ?? 32, 16) : (c.paddingX ?? 32),
        paddingRight:
          bp === "mobile" ? Math.min(c.paddingX ?? 32, 16) : (c.paddingX ?? 32),
        overflow: "hidden",
      }}
    >
      <div ref={ref} style={{ maxWidth: c.maxWidth ?? 1100, margin: "0 auto" }}>
        <div
          className="_pHeading"
          style={{ textAlign, marginBottom: bp === "mobile" ? 28 : 40 }}
        >
          <SectionBadge badge={c.badge} />
          <SectionHeading c={c} />
          {c.subheading && (
            <p
              data-anim
              style={{
                fontSize: 16,
                color: c.subheadingColor || "#64748b",
                marginBottom: 0,
                fontFamily: `'${c.bodyFont || "Inter"}',sans-serif`,
              }}
            >
              {c.subheading}
            </p>
          )}
        </div>
        <Toggle />
        {renderLayout()}
      </div>
    </section>
  );
}
