import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

export default function SpacerPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ud = (k, v) => onChange({ divider: { ...(c.divider || {}), [k]: v } });

  return (
    <div className="ed-right-body">
      <G>
        <L>Height</L>
        <RangeControl
          label="Desktop Height"
          value={c.height ?? 60}
          min={0}
          max={400}
          onChange={(v) => u("height", v)}
          unit="px"
        />
        <RangeControl
          label="Mobile Height"
          value={c.heightMobile ?? 30}
          min={0}
          max={300}
          onChange={(v) => u("heightMobile", v)}
          unit="px"
        />
      </G>
      <D />
      <G>
        <L>Background</L>
        <BgControl config={c} onChange={onChange} />
      </G>
      <D />
      <G>
        <L>Divider Line</L>
        <ToggleControl
          label="Show Divider"
          value={!!c.divider?.show}
          onChange={(v) => ud("show", v)}
        />
        {c.divider?.show && (
          <>
            <SelectControl
              label="Line Style"
              value={c.divider.style || "solid"}
              options={[
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "dotted", label: "Dotted" },
              ]}
              onChange={(v) => ud("style", v)}
            />
            <ColorControl
              label="Line Color"
              value={c.divider.color || "#e2e8f0"}
              onChange={(v) => ud("color", v)}
            />
            <RangeControl
              label="Thickness"
              value={c.divider.thickness ?? 1}
              min={1}
              max={10}
              onChange={(v) => ud("thickness", v)}
              unit="px"
            />
            <RangeControl
              label="Width"
              value={c.divider.width ?? 100}
              min={5}
              max={100}
              onChange={(v) => ud("width", v)}
              unit="%"
            />
            <SelectControl
              label="Alignment"
              value={c.divider.align || "center"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => ud("align", v)}
            />
          </>
        )}
      </G>
    </div>
  );
}
