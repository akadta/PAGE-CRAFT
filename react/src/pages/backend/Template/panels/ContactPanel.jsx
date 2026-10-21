import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

export default function ContactPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ub = (k, v) => onChange({ badge: { ...c.badge, [k]: v } });
  const uin = (k, v) => onChange({ info: { ...c.info, [k]: v } });
  const uf = (id, patch) =>
    onChange({
      formFields: (c.formFields || []).map((f) =>
        f.id === id ? { ...f, ...patch } : f,
      ),
    });
  const addField = () =>
    onChange({
      formFields: [
        ...(c.formFields || []),
        {
          id: uid(),
          type: "text",
          label: "New Field",
          placeholder: "Enter value",
          required: false,
        },
      ],
    });
  const delField = (id) =>
    onChange({ formFields: (c.formFields || []).filter((f) => f.id !== id) });

  return (
    <div className="ed-right-body">
      <G>
        <L>Background</L>
        <BgControl config={c} onChange={onChange} />
      </G>
      <D />

      <G>
        <L>Variant</L>
        <SelectControl
          value={c.variant || "split"}
          options={[
            { value: "split", label: "Split" },
            { value: "centered", label: "Centered" },
            { value: "minimal", label: "Minimal" },
          ]}
          onChange={(v) => u("variant", v)}
        />
      </G>
      <D />

      <G>
        <L>Badge & Heading</L>
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
        <L>Contact Info</L>
        <ToggleControl
          label="Show Email"
          value={!!c.info?.showEmail}
          onChange={(v) => uin("showEmail", v)}
        />
        {c.info?.showEmail && (
          <input
            className="ctrl-input"
            value={c.info.email || ""}
            onChange={(e) => uin("email", e.target.value)}
            placeholder="Email"
            style={{ marginBottom: 4 }}
          />
        )}
        <ToggleControl
          label="Show Phone"
          value={!!c.info?.showPhone}
          onChange={(v) => uin("showPhone", v)}
        />
        {c.info?.showPhone && (
          <input
            className="ctrl-input"
            value={c.info.phone || ""}
            onChange={(e) => uin("phone", e.target.value)}
            placeholder="Phone"
            style={{ marginBottom: 4 }}
          />
        )}
        <ToggleControl
          label="Show Address"
          value={!!c.info?.showAddress}
          onChange={(v) => uin("showAddress", v)}
        />
        {c.info?.showAddress && (
          <input
            className="ctrl-input"
            value={c.info.address || ""}
            onChange={(e) => uin("address", e.target.value)}
            placeholder="Address"
          />
        )}
      </G>
      <D />

      <G>
        <L>Form Fields</L>
        {(c.formFields || []).map((field, i) => (
          <div
            key={field.id}
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
                Field #{i + 1}
              </span>
              <button
                onClick={() => delField(field.id)}
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
            <SelectControl
              label="Type"
              value={field.type || "text"}
              options={[
                { value: "text", label: "Text" },
                { value: "email", label: "Email" },
                { value: "tel", label: "Phone" },
                { value: "textarea", label: "Textarea" },
                { value: "select", label: "Select" },
              ]}
              onChange={(v) => uf(field.id, { type: v })}
            />
            <input
              className="ctrl-input"
              value={field.label || ""}
              onChange={(e) => uf(field.id, { label: e.target.value })}
              placeholder="Label"
              style={{ marginBottom: 4 }}
            />
            <input
              className="ctrl-input"
              value={field.placeholder || ""}
              onChange={(e) => uf(field.id, { placeholder: e.target.value })}
              placeholder="Placeholder"
              style={{ marginBottom: 4 }}
            />
            <ToggleControl
              label="Required"
              value={!!field.required}
              onChange={(v) => uf(field.id, { required: v })}
            />
            {field.type === "textarea" && (
              <RangeControl
                label="Rows"
                value={field.rows || 4}
                min={2}
                max={10}
                onChange={(v) => uf(field.id, { rows: v })}
                unit=""
              />
            )}
          </div>
        ))}
        <button
          onClick={addField}
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
          + Add Field
        </button>
      </G>
      <D />

      <G>
        <L>Submit Button</L>
        <input
          className="ctrl-input"
          value={c.submitLabel || "Send Message"}
          onChange={(e) => u("submitLabel", e.target.value)}
          style={{ marginBottom: 5 }}
          placeholder="Button label"
        />
        <ColorControl
          label="Background"
          value={c.submitBg || "#2563eb"}
          onChange={(v) => u("submitBg", v)}
        />
        <ColorControl
          label="Text Color"
          value={c.submitColor || "#ffffff"}
          onChange={(v) => u("submitColor", v)}
        />
        <RangeControl
          label="Border Radius"
          value={c.submitBorderRadius || 8}
          min={0}
          max={30}
          onChange={(v) => u("submitBorderRadius", v)}
          unit="px"
        />
        <RangeControl
          label="Input Radius"
          value={c.inputBorderRadius || 8}
          min={0}
          max={20}
          onChange={(v) => u("inputBorderRadius", v)}
          unit="px"
        />
        <input
          className="ctrl-input"
          value={c.formAction || ""}
          onChange={(e) => u("formAction", e.target.value)}
          placeholder="POST endpoint URL (optional)"
        />
      </G>
      <D />

      <G>
        <L>Spacing</L>
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
