export default function RangeControl({
  label,
  value,
  min = 0,
  max = 100,
  onChange,
  unit = "px",
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
    >
      <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ flex: 2, cursor: "pointer", accentColor: "#2563eb" }}
      />
      <span
        style={{
          fontSize: 11,
          color: "#94a3b8",
          width: 36,
          textAlign: "right",
        }}
      >
        {value}
        {unit}
      </span>
    </div>
  );
}
