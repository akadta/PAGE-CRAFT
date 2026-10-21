export default function SelectControl({
  label,
  value,
  options,
  onChange,
  width,
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
    >
      {label && (
        <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{label}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: width || "100%",
          padding: "6px 10px",
          border: "1px solid #e2e8f0",
          borderRadius: 7,
          fontSize: 12,
          color: "#0f172a",
          outline: "none",
          background: "#fafafa",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}
