import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

export default function CtaPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ubtn = (id, patch) =>
    onChange({
      buttons: (c.buttons || []).map((b) =>
        b.id === id ? { ...b, ...patch } : b,
      ),
    });
  const addBtn = () =>
    onChange({
      buttons: [
        ...(c.buttons || []),
        {
          id: uid(),
          label: "Get Started",
          url: "#",
          style: "filled",
          bg: "#ffffff",
          color: "#2563eb",
          borderRadius: 10,
          size: "lg",
        },
      ],
    });
  const delBtn = (id) =>
    onChange({ buttons: (c.buttons || []).filter((b) => b.id !== id) });

  return (
    <div className="ed-right-body">
      <G>
        <L>Background</L>
        <BgControl config={c} onChange={onChange} />
      </G>
      <D />

      <G>
        <L>Content</L>
        <textarea
          className="ctrl-input"
          rows={2}
          value={c.heading || ""}
          onChange={(e) => u("heading", e.target.value)}
          style={{ resize: "vertical", marginBottom: 5 }}
          placeholder="Heading"
        />
        <RangeControl
          label="Heading Size"
          value={c.headingSize || 48}
          min={24}
          max={100}
          onChange={(v) => u("headingSize", v)}
          unit="px"
        />
        <ColorControl
          label="Heading Color"
          value={c.headingColor || "#fff"}
          onChange={(v) => u("headingColor", v)}
        />
        <textarea
          className="ctrl-input"
          rows={2}
          value={c.subheading || ""}
          onChange={(e) => u("subheading", e.target.value)}
          style={{ resize: "vertical", marginBottom: 5 }}
          placeholder="Subheading"
        />
        <ColorControl
          label="Subheading Color"
          value={c.subheadingColor || "rgba(255,255,255,0.75)"}
          onChange={(v) => u("subheadingColor", v)}
        />
      </G>
      <D />

      <G>
        <L>Buttons</L>
        {(c.buttons || []).map((btn) => (
          <div
            key={btn.id}
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
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                {btn.label}
              </span>
              <button
                onClick={() => delBtn(btn.id)}
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
              value={btn.label || ""}
              onChange={(e) => ubtn(btn.id, { label: e.target.value })}
              placeholder="Label"
              style={{ marginBottom: 5 }}
            />
            <input
              className="ctrl-input"
              value={btn.url || ""}
              onChange={(e) => ubtn(btn.id, { url: e.target.value })}
              placeholder="URL"
              style={{ marginBottom: 5 }}
            />
            <SelectControl
              label="Style"
              value={btn.style}
              options={[
                { value: "filled", label: "Filled" },
                { value: "outline", label: "Outline" },
              ]}
              onChange={(v) => ubtn(btn.id, { style: v })}
            />
            <SelectControl
              label="Size"
              value={btn.size}
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
              onChange={(v) => ubtn(btn.id, { size: v })}
            />
            <ColorControl
              label="Color"
              value={btn.bg}
              onChange={(v) => ubtn(btn.id, { bg: v })}
            />
            <ColorControl
              label="Text Color"
              value={btn.color}
              onChange={(v) => ubtn(btn.id, { color: v })}
            />
            <RangeControl
              label="Radius"
              value={btn.borderRadius || 10}
              min={0}
              max={50}
              onChange={(v) => ubtn(btn.id, { borderRadius: v })}
              unit="px"
            />
          </div>
        ))}
        <button
          onClick={addBtn}
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
      <D />

      <G>
        <L>Spacing</L>
        <RangeControl
          label="Padding Y"
          value={c.paddingY || 100}
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

      <G>
        <L>Animation</L>
        <AnimationControl
          value={c.animation}
          onChange={(v) => u("animation", v)}
        />
      </G>
    </div>
  );
}
