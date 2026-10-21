import ColorControl from "./ColorControl";
import SelectControl from "./SelectControl";
import RangeControl from "./RangeControl";
import ImageUpload from "./ImageUpload";

const DIRECTIONS = [
  { value: "to right", label: "→ Left to Right" },
  { value: "to left", label: "← Right to Left" },
  { value: "to bottom", label: "↓ Top to Bottom" },
  { value: "to bottom right", label: "↘ Diagonal" },
  { value: "to bottom left", label: "↙ Diagonal" },
  { value: "135deg", label: "135° Angle" },
  { value: "45deg", label: "45° Angle" },
];

export default function BgControl({ config, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ug = (k, v) =>
    onChange({ bgGradient: { ...config.bgGradient, [k]: v } });

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {["solid", "gradient", "image"].map((t) => (
          <button
            key={t}
            onClick={() => u("bgType", t)}
            style={{
              flex: 1,
              padding: "5px 0",
              borderRadius: 6,
              border: "1.5px solid",
              borderColor: config.bgType === t ? "#2563eb" : "#e2e8f0",
              background: config.bgType === t ? "#eff6ff" : "#fff",
              color: config.bgType === t ? "#2563eb" : "#475569",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {config.bgType === "solid" && (
        <ColorControl
          label="Color"
          value={config.bg}
          onChange={(v) => u("bg", v)}
        />
      )}

      {config.bgType === "gradient" && (
        <>
          <ColorControl
            label="From"
            value={config.bgGradient?.from}
            onChange={(v) => ug("from", v)}
          />
          <ColorControl
            label="To"
            value={config.bgGradient?.to}
            onChange={(v) => ug("to", v)}
          />
          <SelectControl
            label="Direction"
            value={config.bgGradient?.direction}
            options={DIRECTIONS}
            onChange={(v) => ug("direction", v)}
          />
          <RangeControl
            label="Intensity"
            value={config.bgGradient?.intensity ?? 100}
            min={10}
            max={100}
            onChange={(v) => ug("intensity", v)}
            unit="%"
          />
          <div
            style={{
              height: 28,
              borderRadius: 8,
              marginTop: 6,
              border: "1px solid #e2e8f0",
              background: `linear-gradient(${config.bgGradient?.direction}, ${config.bgGradient?.from}, ${config.bgGradient?.to})`,
              opacity: (config.bgGradient?.intensity ?? 100) / 100,
            }}
          />
        </>
      )}

      {config.bgType === "image" && (
        <>
          <ImageUpload
            label="Background Image"
            value={config.bgImage}
            onChange={(v) => u("bgImage", v)}
            height={100}
          />
          <ColorControl
            label="Overlay Color"
            value={config.bgOverlayColor || "#000000"}
            onChange={(v) => {
              u("bgOverlayColor", v);
              u(
                "bgImageOverlay",
                `${v}${Math.round((config.bgOverlayOpacity ?? 0) * 2.55)
                  .toString(16)
                  .padStart(2, "0")}`,
              );
            }}
          />
          <RangeControl
            label="Overlay Opacity"
            value={config.bgOverlayOpacity ?? 0}
            min={0}
            max={100}
            onChange={(v) => {
              u("bgOverlayOpacity", v);
              const hex = config.bgOverlayColor || "#000000";
              u(
                "bgImageOverlay",
                `${hex}${Math.round(v * 2.55)
                  .toString(16)
                  .padStart(2, "0")}`,
              );
            }}
            unit="%"
          />
        </>
      )}
    </div>
  );
}
