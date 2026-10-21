import SelectControl from "./SelectControl";
import ToggleControl from "./ToggleControl";
import RangeControl from "./RangeControl";

const ANIM_TYPES = [
  { value: "fadeUp", label: "Fade Up" },
  { value: "fadeDown", label: "Fade Down" },
  { value: "fadeIn", label: "Fade In" },
  { value: "slideLeft", label: "Slide Left" },
  { value: "slideRight", label: "Slide Right" },
  { value: "zoom", label: "Zoom In" },
  { value: "flip", label: "Flip" },
];

export default function AnimationControl({ value, onChange }) {
  const u = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div>
      <ToggleControl
        label="Enable Animation"
        value={!!value?.enabled}
        onChange={(v) => u("enabled", v)}
      />
      {value?.enabled && (
        <>
          <SelectControl
            label="Type"
            value={value.type}
            options={ANIM_TYPES}
            onChange={(v) => u("type", v)}
          />
          <RangeControl
            label="Duration"
            value={value.duration ?? 0.7}
            min={0.2}
            max={2}
            onChange={(v) => u("duration", v)}
            unit="s"
          />
          <RangeControl
            label="Delay"
            value={value.delay ?? 0}
            min={0}
            max={2}
            onChange={(v) => u("delay", v)}
            unit="s"
          />
          <RangeControl
            label="Stagger"
            value={value.stagger ?? 0.15}
            min={0}
            max={0.5}
            onChange={(v) => u("stagger", v)}
            unit="s"
          />
        </>
      )}
    </div>
  );
}
