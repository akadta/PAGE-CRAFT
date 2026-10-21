import ColorControl from "./ColorControl";

export default function BadgeControl({ value, onChange }) {
  const u = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div style={{ marginBottom: 8 }}>
      <ToggleRow
        label="Show Badge"
        value={value.show}
        onChange={(v) => u("show", v)}
      />
      {value.show && (
        <>
          <input
            value={value.text}
            onChange={(e) => u("text", e.target.value)}
            placeholder="Badge text"
            style={{
              width: "100%",
              padding: "6px 10px",
              border: "1px solid #e2e8f0",
              borderRadius: 7,
              fontSize: 12,
              color: "#0f172a",
              outline: "none",
              background: "#fafafa",
              marginBottom: 5,
            }}
          />
          <ColorControl
            label="Background"
            value={value.bg}
            onChange={(v) => u("bg", v)}
          />
          <ColorControl
            label="Text Color"
            value={value.color}
            onChange={(v) => u("color", v)}
          />
        </>
      )}
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
    >
      <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          background: value ? "#2563eb" : "#cbd5e1",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: value ? 18 : 3,
            top: 3,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}
