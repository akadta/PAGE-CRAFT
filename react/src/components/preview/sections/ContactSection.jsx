import { useState } from "react";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { SectionBadge, SectionHeading } from "./AboutSection";
import { loadFont } from "../../../utils/fontLoader";

const getBg = (c) =>
  c.bgType === "gradient"
    ? `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from}, ${c.bgGradient?.to})`
    : c.bg || "#f8fafc";

export default function ContactSection({ config: c, navId }) {
  loadFont(c.headingFont);
  const ref = useScrollAnimation(c.animation);
  const [form, setForm] = useState({});
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!c.formAction) {
      setSent(true);
      return;
    }
    try {
      await fetch(c.formAction, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch {}
  };

  return (
    <section
      id={navId}
      style={{
        background: getBg(c),
        paddingTop: c.paddingY || 80,
        paddingBottom: c.paddingY || 80,
        paddingLeft: c.paddingX || 32,
        paddingRight: c.paddingX || 32,
      }}
    >
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
          {/* Info side */}
          <div data-anim style={{ flex: 1, minWidth: 260 }}>
            <SectionBadge badge={c.badge} />
            <SectionHeading c={c} />
            {c.subheading && (
              <p
                style={{
                  fontSize: 16,
                  color: c.subheadingColor || "#64748b",
                  lineHeight: 1.7,
                  marginBottom: 32,
                }}
              >
                {c.subheading}
              </p>
            )}
            {c.info?.showEmail && c.info.email && (
              <InfoRow icon="✉️" text={c.info.email} />
            )}
            {c.info?.showPhone && c.info.phone && (
              <InfoRow icon="📞" text={c.info.phone} />
            )}
            {c.info?.showAddress && c.info.address && (
              <InfoRow icon="📍" text={c.info.address} />
            )}
          </div>
          {/* Form side */}
          <div data-anim style={{ flex: 1.5, minWidth: 300 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: c.headingColor || "#0f172a",
                    marginBottom: 8,
                  }}
                >
                  Message Sent!
                </h3>
                <p style={{ color: "#64748b" }}>We'll get back to you soon.</p>
              </div>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {(c.formFields || []).map((field) => (
                  <div key={field.id} style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#475569",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      {field.label}
                      {field.required && (
                        <span style={{ color: "#ef4444" }}> *</span>
                      )}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={field.rows || 4}
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            [field.label]: e.target.value,
                          }))
                        }
                        style={inputStyle(c)}
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            [field.label]: e.target.value,
                          }))
                        }
                        style={inputStyle(c)}
                      />
                    )}
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: c.submitBorderRadius || 8,
                    background: c.submitBg || "#2563eb",
                    color: c.submitColor || "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {c.submitLabel || "Send Message"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle = (c) => ({
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: c.inputBorderRadius || 8,
  fontSize: 13,
  color: "#0f172a",
  outline: "none",
  fontFamily: "inherit",
  resize: "vertical",
  background: "#fafafa",
  boxSizing: "border-box",
});

function InfoRow({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 14, color: "#374151" }}>{text}</span>
    </div>
  );
}
