import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";

const G = ({ c }) => <div className="ctrl-group">{c}</div>;
const CARD_STYLES = [
  { value: "elevated", label: "Elevated" },
  { value: "bordered", label: "Bordered" },
  { value: "flat", label: "Flat" },
  { value: "glass", label: "Glass" },
];
const ICON_STYLES = [
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "none", label: "None" },
];

export default function FeaturesPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ub = (k, v) => onChange({ badge: { ...c.badge, [k]: v } });
  const ui = (id, patch) =>
    onChange({
      items: (c.items || []).map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  const addItem = () =>
    onChange({
      items: [
        ...(c.items || []),
        {
          id: uid(),
          icon: "⭐",
          iconBg: "#eff6ff",
          iconColor: "#2563eb",
          title: "New Feature",
          body: "Description here",
        },
      ],
    });
  const delItem = (id) =>
    onChange({ items: (c.items || []).filter((i) => i.id !== id) });

  return (
    <div className="ed-right-body">
      <div className="ctrl-group">
        <div className="ctrl-label">Background</div>
        <BgControl config={c} onChange={onChange} />
      </div>
      <div className="ctrl-divider" />

      <div className="ctrl-group">
        <div className="ctrl-label">Heading</div>
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
              style={{ marginBottom: 5 }}
            />
            <ColorControl
              label="Badge Bg"
              value={c.badge.bg}
              onChange={(v) => ub("bg", v)}
            />
            <ColorControl
              label="Badge Color"
              value={c.badge.color}
              onChange={(v) => ub("color", v)}
            />
          </>
        )}
        <input
          className="ctrl-input"
          value={c.heading || ""}
          onChange={(e) => u("heading", e.target.value)}
          style={{ marginBottom: 5 }}
          placeholder="Section heading"
        />
        <RangeControl
          label="Heading Size"
          value={c.headingSize || 42}
          min={20}
          max={80}
          onChange={(v) => u("headingSize", v)}
          unit="px"
        />
        <ColorControl
          label="Heading Color"
          value={c.headingColor || "#0f172a"}
          onChange={(v) => u("headingColor", v)}
        />
        <input
          className="ctrl-input"
          value={c.subheading || ""}
          onChange={(e) => u("subheading", e.target.value)}
          placeholder="Subheading"
        />
        <ColorControl
          label="Subheading Color"
          value={c.subheadingColor || "#64748b"}
          onChange={(v) => u("subheadingColor", v)}
        />
      </div>
      <div className="ctrl-divider" />

      <div className="ctrl-group">
        <div className="ctrl-label">Grid</div>
        <RangeControl
          label="Columns"
          value={c.columns || 3}
          min={1}
          max={4}
          onChange={(v) => u("columns", v)}
          unit=""
        />
        <SelectControl
          label="Card Style"
          value={c.cardStyle || "elevated"}
          options={CARD_STYLES}
          onChange={(v) => u("cardStyle", v)}
        />
        <ColorControl
          label="Card Bg"
          value={c.cardBg || "#fff"}
          onChange={(v) => u("cardBg", v)}
        />
        <RangeControl
          label="Card Radius"
          value={c.cardBorderRadius || 16}
          min={0}
          max={32}
          onChange={(v) => u("cardBorderRadius", v)}
          unit="px"
        />
        <RangeControl
          label="Card Padding"
          value={c.cardPadding || 28}
          min={8}
          max={60}
          onChange={(v) => u("cardPadding", v)}
          unit="px"
        />
        <SelectControl
          label="Icon Style"
          value={c.iconStyle || "rounded"}
          options={ICON_STYLES}
          onChange={(v) => u("iconStyle", v)}
        />
        <RangeControl
          label="Icon Size"
          value={c.iconSize || 48}
          min={24}
          max={96}
          onChange={(v) => u("iconSize", v)}
          unit="px"
        />
      </div>
      <div className="ctrl-divider" />

      <div className="ctrl-group">
        <div className="ctrl-label">Feature Items</div>
        {(c.items || []).map((item) => (
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
                {item.title}
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
              value={item.icon || ""}
              onChange={(e) => ui(item.id, { icon: e.target.value })}
              placeholder="Icon emoji"
              style={{ marginBottom: 5 }}
            />
            <input
              className="ctrl-input"
              value={item.title || ""}
              onChange={(e) => ui(item.id, { title: e.target.value })}
              placeholder="Title"
              style={{ marginBottom: 5 }}
            />
            <textarea
              className="ctrl-input"
              rows={2}
              value={item.body || ""}
              onChange={(e) => ui(item.id, { body: e.target.value })}
              placeholder="Description"
              style={{ resize: "vertical", marginBottom: 5 }}
            />
            <ColorControl
              label="Icon Bg"
              value={item.iconBg || "#eff6ff"}
              onChange={(v) => ui(item.id, { iconBg: v })}
            />
            <ColorControl
              label="Icon Color"
              value={item.iconColor || "#2563eb"}
              onChange={(v) => ui(item.id, { iconColor: v })}
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
          + Add Feature
        </button>
      </div>
      <div className="ctrl-divider" />

      <div className="ctrl-group">
        <div className="ctrl-label">Spacing</div>
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
      </div>
      <div className="ctrl-divider" />

      <div className="ctrl-group">
        <div className="ctrl-label">Animation</div>
        <AnimationControl
          value={c.animation}
          onChange={(v) => u("animation", v)}
        />
      </div>
    </div>
  );
}
