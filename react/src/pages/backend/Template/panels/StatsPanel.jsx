import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

const Sel = ({ label, value, options, onChange }) => (
  <div className="ctrl-row">
    <span className="ctrl-row-label">{label}</span>
    <select
      className="ctrl-select"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        flex: 1,
        padding: "4px 8px",
        borderRadius: 6,
        border: "1px solid #e2e8f0",
        fontSize: 12,
      }}
    >
      {options.map(([v, lbl]) => (
        <option key={v} value={v}>
          {lbl}
        </option>
      ))}
    </select>
  </div>
);

/* ─── Prebuilt Templates ───────────────────────────────────── */
const TEMPLATES = [
  {
    id: "aurora_glass",
    label: "🌌 Aurora Glass",
    thumb: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
    patch: {
      bg: "#0f0c29",
      bgType: "solid",
      bgAnimation: "aurora",
      shaderType: "aurora",
      animSpeed: 0.8,
      valueColor: "#e0f2fe",
      labelColor: "rgba(224,242,254,0.7)",
      valueFontSize: 52,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: false,
      cardStyle: "glass",
      cardGap: 20,
      float: false,
      valueEffect: "shimmer",
      itemAnimation: "fadeUp",
      items: [
        { id: uid(), value: "98%", label: "Uptime", icon: "🚀" },
        { id: uid(), value: "12K+", label: "Users", icon: "👥" },
        { id: uid(), value: "4.9", label: "Rating", icon: "⭐" },
        { id: uid(), value: "50ms", label: "Latency", icon: "⚡" },
      ],
    },
  },
  {
    id: "neon_matrix",
    label: "💚 Neon Matrix",
    thumb: "linear-gradient(135deg,#000,#001100)",
    patch: {
      bg: "#000000",
      bgType: "solid",
      bgAnimation: "matrix",
      matrixColor: "#00ff41",
      animSpeed: 1.2,
      valueColor: "#00ff41",
      labelColor: "rgba(0,255,65,0.7)",
      valueFontSize: 56,
      labelFontSize: 13,
      countUp: true,
      iconShow: false,
      divider: true,
      dividerColor: "#00ff4133",
      cardStyle: "none",
      cardGap: 0,
      float: false,
      valueEffect: "neon",
      itemAnimation: "flipX",
    },
  },
  {
    id: "plasma_fire",
    label: "🔥 Plasma Fire",
    thumb: "linear-gradient(135deg,#1a0533,#6b21a8)",
    patch: {
      bg: "#1a0533",
      bgType: "solid",
      bgAnimation: "plasma",
      animSpeed: 1.5,
      valueColor: "#fbbf24",
      labelColor: "rgba(251,191,36,0.75)",
      valueFontSize: 48,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: false,
      cardStyle: "glass",
      cardGap: 16,
      float: true,
      valueEffect: "glow",
      itemAnimation: "zoomIn",
    },
  },
  {
    id: "starfield",
    label: "🌠 Starfield",
    thumb: "linear-gradient(135deg,#020024,#090979,#00d4ff)",
    patch: {
      bg: "#020024",
      bgType: "solid",
      bgAnimation: "stars",
      particleCount: 160,
      particleColor: "#ffffff",
      animSpeed: 1.2,
      valueColor: "#ffffff",
      labelColor: "rgba(255,255,255,0.65)",
      valueFontSize: 48,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: true,
      dividerColor: "rgba(255,255,255,0.15)",
      cardStyle: "elevated",
      cardGap: 16,
      float: false,
      valueEffect: "shimmer",
      itemAnimation: "fadeUp",
    },
  },
  {
    id: "holographic",
    label: "🌈 Holographic",
    thumb: "linear-gradient(135deg,#000428,#004e92)",
    patch: {
      bg: "#000428",
      bgType: "solid",
      bgAnimation: "holographic",
      animSpeed: 1.0,
      valueColor: "#ffffff",
      labelColor: "rgba(255,255,255,0.7)",
      valueFontSize: 54,
      labelFontSize: 14,
      countUp: true,
      iconShow: false,
      divider: true,
      dividerColor: "rgba(255,255,255,0.25)",
      cardStyle: "bordered",
      cardGap: 16,
      float: false,
      valueEffect: "shimmer",
      itemAnimation: "flipY",
    },
  },
  {
    id: "gradient_shift",
    label: "🎨 Gradient Flow",
    thumb: "linear-gradient(135deg,#2563eb,#7c3aed,#db2777)",
    patch: {
      bgType: "gradient",
      bgGradient: {
        from: "#2563eb",
        to: "#db2777",
        mid: "#7c3aed",
        direction: "to right",
      },
      bgAnimation: "gradientShift",
      animSpeed: 1.0,
      valueColor: "#ffffff",
      labelColor: "rgba(255,255,255,0.8)",
      valueFontSize: 48,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: true,
      dividerColor: "rgba(255,255,255,0.3)",
      cardStyle: "glass",
      cardGap: 16,
      float: false,
      valueEffect: "pulse",
      itemAnimation: "slideLeft",
    },
  },
  {
    id: "particles_web",
    label: "🕸️ Particle Web",
    thumb: "linear-gradient(135deg,#0f172a,#1e293b)",
    patch: {
      bg: "#0f172a",
      bgType: "solid",
      bgAnimation: "particles",
      particleCount: 80,
      particleColor: "#38bdf8",
      particleConnect: true,
      connectDist: 140,
      animSpeed: 0.8,
      valueColor: "#38bdf8",
      labelColor: "rgba(56,189,248,0.75)",
      valueFontSize: 48,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: false,
      cardStyle: "glass",
      cardGap: 20,
      float: false,
      valueEffect: "glow",
      itemAnimation: "fadeUp",
    },
  },
  {
    id: "ocean_waves",
    label: "🌊 Ocean Waves",
    thumb: "linear-gradient(135deg,#0c4a6e,#0369a1)",
    patch: {
      bg: "#0c4a6e",
      bgType: "solid",
      bgAnimation: "waves",
      waveCount: 4,
      waveColor: "rgba(56,189,248,0.12)",
      animSpeed: 0.6,
      valueColor: "#e0f2fe",
      labelColor: "rgba(224,242,254,0.7)",
      valueFontSize: 48,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: true,
      dividerColor: "rgba(224,242,254,0.2)",
      cardStyle: "glass",
      cardGap: 16,
      float: true,
      valueEffect: "none",
      itemAnimation: "fadeUp",
    },
  },
  {
    id: "morphic",
    label: "🔮 Morphic",
    thumb: "linear-gradient(135deg,#1e1b4b,#4c1d95)",
    patch: {
      bg: "#1e1b4b",
      bgType: "solid",
      bgAnimation: "morphic",
      animSpeed: 0.7,
      valueColor: "#c4b5fd",
      labelColor: "rgba(196,181,253,0.7)",
      valueFontSize: 50,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: false,
      cardStyle: "glass",
      cardGap: 20,
      float: true,
      valueEffect: "shimmer",
      itemAnimation: "swing",
    },
  },
  {
    id: "clean_light",
    label: "☀️ Clean Light",
    thumb: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    patch: {
      bg: "#f8fafc",
      bgType: "solid",
      bgAnimation: "none",
      valueColor: "#1e293b",
      labelColor: "#64748b",
      valueFontSize: 48,
      labelFontSize: 14,
      countUp: true,
      iconShow: true,
      divider: true,
      dividerColor: "#e2e8f0",
      cardStyle: "elevated",
      cardGap: 16,
      float: false,
      valueEffect: "none",
      itemAnimation: "fadeUp",
    },
  },
];

const DEFAULT_ITEMS = [
  { id: uid(), value: "10K+", label: "Happy Clients", icon: "😊" },
  { id: uid(), value: "99%", label: "Satisfaction", icon: "⭐" },
  { id: uid(), value: "50+", label: "Countries", icon: "🌍" },
  { id: uid(), value: "24/7", label: "Support", icon: "🛡️" },
];

export default function StatsPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const um = (patch) => onChange(patch);
  const ui = (id, patch) =>
    onChange({
      items: (c.items || []).map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  const addItem = () =>
    onChange({
      items: [
        ...(c.items || []),
        { id: uid(), value: "0+", label: "New Stat", icon: "⭐" },
      ],
    });
  const delItem = (id) =>
    onChange({ items: (c.items || []).filter((i) => i.id !== id) });

  const applyTemplate = (tpl) => {
    const items = tpl.patch.items || c.items || DEFAULT_ITEMS;
    onChange({ ...tpl.patch, items });
  };

  const bgAnim = c.bgAnimation || "none";

  return (
    <div className="ed-right-body">
      {/* ── Prebuilt Templates ── */}
      <G>
        <L>Prebuilt Templates</L>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 6,
          }}
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
                background: "none",
                padding: 0,
                textAlign: "left",
                transition: "box-shadow .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 2px #6366f1")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ height: 36, background: tpl.thumb }} />
              <div
                style={{
                  padding: "4px 8px",
                  fontSize: 11,
                  color: "#374151",
                  fontWeight: 500,
                }}
              >
                {tpl.label}
              </div>
            </button>
          ))}
        </div>
      </G>
      <D />

      {/* ── Background ── */}
      <G>
        <L>Background</L>
        <BgControl config={c} onChange={onChange} />
      </G>
      <D />

      {/* ── Background Animation ── */}
      <G>
        <L>Background Animation</L>
        <Sel
          label="Effect"
          value={bgAnim}
          onChange={(v) => u("bgAnimation", v)}
          options={[
            ["none", "None"],
            ["gradientShift", "Gradient Shift"],
            ["bgFade", "Fade Pulse"],
            ["particles", "Particles / Constellation"],
            ["waves", "Ocean Waves"],
            ["matrix", "Matrix Rain"],
            ["stars", "Starfield / Hyperspace"],
            ["aurora", "Shader — Aurora"],
            ["holographic", "Shader — Holographic"],
            ["plasma", "Shader — Plasma"],
            ["morphic", "Shader — Morphic Blob"],
          ]}
        />
        {bgAnim !== "none" && (
          <RangeControl
            label="Animation Speed"
            value={c.animSpeed ?? 1}
            min={0.1}
            max={5}
            step={0.1}
            onChange={(v) => u("animSpeed", v)}
            unit="x"
          />
        )}

        {/* Particles controls */}
        {bgAnim === "particles" && (
          <>
            <RangeControl
              label="Particle Count"
              value={c.particleCount ?? 60}
              min={10}
              max={300}
              onChange={(v) => u("particleCount", v)}
            />
            <RangeControl
              label="Particle Size"
              value={c.particleSize ?? 2}
              min={1}
              max={8}
              onChange={(v) => u("particleSize", v)}
              unit="px"
            />
            <ColorControl
              label="Particle Color"
              value={c.particleColor || "#ffffff"}
              onChange={(v) => u("particleColor", v)}
            />
            <ToggleControl
              label="Connect Lines"
              value={c.particleConnect !== false}
              onChange={(v) => u("particleConnect", v)}
            />
            {c.particleConnect !== false && (
              <RangeControl
                label="Connect Distance"
                value={c.connectDist ?? 120}
                min={40}
                max={300}
                onChange={(v) => u("connectDist", v)}
                unit="px"
              />
            )}
          </>
        )}

        {/* Stars / hyperspace */}
        {bgAnim === "stars" && (
          <>
            <RangeControl
              label="Star Count"
              value={c.particleCount ?? 120}
              min={20}
              max={400}
              onChange={(v) => u("particleCount", v)}
            />
            <ColorControl
              label="Star Color"
              value={c.particleColor || "#ffffff"}
              onChange={(v) => u("particleColor", v)}
            />
          </>
        )}

        {/* Waves */}
        {bgAnim === "waves" && (
          <>
            <RangeControl
              label="Wave Layers"
              value={c.waveCount ?? 3}
              min={1}
              max={8}
              onChange={(v) => u("waveCount", v)}
            />
            <ColorControl
              label="Wave Color"
              value={c.waveColor || "rgba(255,255,255,0.15)"}
              onChange={(v) => u("waveColor", v)}
            />
          </>
        )}

        {/* Matrix */}
        {bgAnim === "matrix" && (
          <ColorControl
            label="Glyph Color"
            value={c.matrixColor || "#00ff41"}
            onChange={(v) => u("matrixColor", v)}
          />
        )}
      </G>
      <D />

      {/* ── Number Style ── */}
      <G>
        <L>Number Style</L>
        <ColorControl
          label="Value Color"
          value={c.valueColor || "#ffffff"}
          onChange={(v) => u("valueColor", v)}
        />
        <RangeControl
          label="Value Size"
          value={c.valueFontSize || 48}
          min={24}
          max={96}
          onChange={(v) => u("valueFontSize", v)}
          unit="px"
        />
        <ColorControl
          label="Label Color"
          value={c.labelColor || "rgba(255,255,255,0.75)"}
          onChange={(v) => u("labelColor", v)}
        />
        <RangeControl
          label="Label Size"
          value={c.labelFontSize || 14}
          min={10}
          max={24}
          onChange={(v) => u("labelFontSize", v)}
          unit="px"
        />

        <Sel
          label="Value Effect"
          value={c.valueEffect || "none"}
          onChange={(v) => u("valueEffect", v)}
          options={[
            ["none", "None"],
            ["shimmer", "Shimmer"],
            ["glow", "Glow"],
            ["pulse", "Pulse"],
            ["neon", "Neon Flicker"],
          ]}
        />

        <ToggleControl
          label="Count Up Animation"
          value={c.countUp !== false}
          onChange={(v) => u("countUp", v)}
        />
        <ToggleControl
          label="Show Icons"
          value={!!c.iconShow}
          onChange={(v) => u("iconShow", v)}
        />
        <ToggleControl
          label="Float Animation"
          value={!!c.float}
          onChange={(v) => u("float", v)}
        />
        <ToggleControl
          label="Show Dividers"
          value={!!c.divider}
          onChange={(v) => u("divider", v)}
        />
        {c.divider && (
          <ColorControl
            label="Divider Color"
            value={c.dividerColor || "rgba(255,255,255,0.2)"}
            onChange={(v) => u("dividerColor", v)}
          />
        )}
      </G>
      <D />

      {/* ── Card Style ── */}
      <G>
        <L>Card Style</L>
        <Sel
          label="Card Style"
          value={c.cardStyle || "none"}
          onChange={(v) => u("cardStyle", v)}
          options={[
            ["none", "None (flat)"],
            ["glass", "Glassmorphism"],
            ["bordered", "Bordered"],
            ["elevated", "Elevated / Shadow"],
          ]}
        />
        {c.cardStyle && c.cardStyle !== "none" && (
          <RangeControl
            label="Card Gap"
            value={c.cardGap ?? 16}
            min={0}
            max={60}
            onChange={(v) => u("cardGap", v)}
            unit="px"
          />
        )}
      </G>
      <D />

      {/* ── Item Entry Animation ── */}
      <G>
        <L>Item Entry Animation</L>
        <Sel
          label="Animation"
          value={c.itemAnimation || "fadeUp"}
          onChange={(v) => u("itemAnimation", v)}
          options={[
            ["none", "None"],
            ["fadeUp", "Fade Up"],
            ["zoomIn", "Zoom In"],
            ["flipX", "Flip X (3D)"],
            ["flipY", "Flip Y (3D)"],
            ["swing", "Swing (3D)"],
            ["slideLeft", "Slide Left"],
          ]}
        />
      </G>
      <D />

      {/* ── Stat Items ── */}
      <G>
        <L>Stat Items</L>
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                Stat #{i + 1}
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
              value={item.value || ""}
              onChange={(e) => ui(item.id, { value: e.target.value })}
              placeholder="e.g. 10K+"
              style={{ marginBottom: 5 }}
            />
            <input
              className="ctrl-input"
              value={item.label || ""}
              onChange={(e) => ui(item.id, { label: e.target.value })}
              placeholder="Label"
              style={{ marginBottom: 5 }}
            />
            <input
              className="ctrl-input"
              value={item.icon || ""}
              onChange={(e) => ui(item.id, { icon: e.target.value })}
              placeholder="Icon emoji"
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
          + Add Stat
        </button>

        {/* Quick item presets */}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
            Quick item presets:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              {
                label: "SaaS",
                items: [
                  { value: "10K+", label: "Users", icon: "👥" },
                  { value: "99.9%", label: "Uptime", icon: "🚀" },
                  { value: "4.8", label: "Rating", icon: "⭐" },
                  { value: "24/7", label: "Support", icon: "🛡️" },
                ],
              },
              {
                label: "Agency",
                items: [
                  { value: "200+", label: "Projects", icon: "💼" },
                  { value: "50+", label: "Clients", icon: "🤝" },
                  { value: "8yr", label: "Experience", icon: "🏆" },
                  { value: "12", label: "Awards", icon: "🎖️" },
                ],
              },
              {
                label: "E-comm",
                items: [
                  { value: "1M+", label: "Orders", icon: "📦" },
                  { value: "4.9★", label: "Reviews", icon: "⭐" },
                  { value: "30d", label: "Returns", icon: "🔄" },
                  { value: "Free", label: "Shipping", icon: "🚚" },
                ],
              },
              {
                label: "Startup",
                items: [
                  { value: "$50M", label: "Raised", icon: "💰" },
                  { value: "3", label: "Unicorns", icon: "🦄" },
                  { value: "150+", label: "Team", icon: "🧑‍💻" },
                  { value: "32", label: "Countries", icon: "🌍" },
                ],
              },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() =>
                  onChange({
                    items: preset.items.map((it) => ({ ...it, id: uid() })),
                  })
                }
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  background: "#fff",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </G>
      <D />

      {/* ── Spacing ── */}
      <G>
        <L>Spacing</L>
        <RangeControl
          label="Padding Y"
          value={c.paddingY || 60}
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
      </G>
      <D />

      {/* ── Section Animation ── */}
      <G>
        <L>Section Entry Animation</L>
        <AnimationControl
          value={c.animation}
          onChange={(v) => u("animation", v)}
        />
      </G>
    </div>
  );
}
