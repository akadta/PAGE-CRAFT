import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";

const G = ({ children }) => <div className="ctrl-group">{children}</div>;
const L = ({ children }) => <div className="ctrl-label">{children}</div>;
const D = () => <div className="ctrl-divider" />;

export default function GalleryPanel({ config: c, onChange }) {
  const u = (k, v) => onChange({ [k]: v });
  const ub = (k, v) => onChange({ badge: { ...c.badge, [k]: v } });
  const ui = (id, patch) =>
    onChange({
      images: (c.images || []).map((i) =>
        i.id === id ? { ...i, ...patch } : i,
      ),
    });
  const addImage = () =>
    onChange({
      images: [
        ...(c.images || []),
        { id: uid(), url: "", caption: "", alt: "" },
      ],
    });
  const delImage = (id) =>
    onChange({ images: (c.images || []).filter((i) => i.id !== id) });

  return (
    <div className="ed-right-body">
      <G>
        <L>Layout</L>
        <SelectControl
          label="Variant"
          value={c.variant || "masonry"}
          options={[
            { value: "masonry", label: "Masonry" },
            { value: "grid", label: "Grid" },
            { value: "carousel", label: "Carousel" },
            { value: "lightbox-grid", label: "Lightbox Grid" },
          ]}
          onChange={(v) => u("variant", v)}
        />
        <RangeControl
          label="Columns"
          value={c.columns || 3}
          min={1}
          max={5}
          onChange={(v) => u("columns", v)}
          unit=""
        />
        <RangeControl
          label="Gap"
          value={c.gap || 12}
          min={0}
          max={40}
          onChange={(v) => u("gap", v)}
          unit="px"
        />
        <RangeControl
          label="Border Radius"
          value={c.borderRadius || 12}
          min={0}
          max={32}
          onChange={(v) => u("borderRadius", v)}
          unit="px"
        />
        <SelectControl
          label="Hover Effect"
          value={c.hoverEffect || "zoom"}
          options={[
            { value: "zoom", label: "Zoom" },
            { value: "overlay", label: "Overlay" },
            { value: "none", label: "None" },
          ]}
          onChange={(v) => u("hoverEffect", v)}
        />
        <ToggleControl
          label="Lightbox"
          value={!!c.lightbox}
          onChange={(v) => u("lightbox", v)}
        />
      </G>
      <D />

      <G>
        <L>Background</L>
        <BgControl config={c} onChange={onChange} />
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
          placeholder="Section heading"
        />
        <ColorControl
          label="Heading Color"
          value={c.headingColor || "#0f172a"}
          onChange={(v) => u("headingColor", v)}
        />
      </G>
      <D />

      <G>
        <L>Images</L>
        {(c.images || []).map((img, i) => (
          <div
            key={img.id}
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
                Image #{i + 1}
              </span>
              <button
                onClick={() => delImage(img.id)}
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
            <ImageUpload
              value={img.url}
              onChange={(v) => ui(img.id, { url: v })}
              height={90}
            />
            <input
              className="ctrl-input"
              value={img.caption || ""}
              onChange={(e) => ui(img.id, { caption: e.target.value })}
              placeholder="Caption (optional)"
              style={{ marginBottom: 4 }}
            />
            <input
              className="ctrl-input"
              value={img.alt || ""}
              onChange={(e) => ui(img.id, { alt: e.target.value })}
              placeholder="Alt text"
            />
          </div>
        ))}
        <button
          onClick={addImage}
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
          + Add Image
        </button>
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
