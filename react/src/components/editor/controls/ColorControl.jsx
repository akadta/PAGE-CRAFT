const toHex = (color) => {
  if (!color) return "#000000";
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (color === "#fff") return "#ffffff";
  if (color === "#000") return "#000000";
  return "#000000";
};
export default function ColorControl({ label, value, onChange }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
    >
      <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{label}</span>
      <input
        type="color"
        value={toHex(value)}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 36,
          height: 30,
          borderRadius: 7,
          border: "1px solid #e2e8f0",
          padding: 2,
          cursor: "pointer",
        }}
      />
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 80,
          padding: "5px 8px",
          border: "1px solid #e2e8f0",
          borderRadius: 7,
          fontSize: 11,
          color: "#0f172a",
          outline: "none",
          background: "#fafafa",
        }}
      />
    </div>
  );
}
