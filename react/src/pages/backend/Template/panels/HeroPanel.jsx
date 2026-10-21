import { useState, useRef, useCallback, useEffect } from "react";
import BgControl from "../../../../components/editor/controls/BgControl";
import ColorControl from "../../../../components/editor/controls/ColorControl";
import RangeControl from "../../../../components/editor/controls/RangeControl";
import ToggleControl from "../../../../components/editor/controls/ToggleControl";
import SelectControl from "../../../../components/editor/controls/SelectControl";
import ImageUpload from "../../../../components/editor/controls/ImageUpload";
import AnimationControl from "../../../../components/editor/controls/AnimationControl";
import { uid } from "../../../../config/sectionDefaults";

import {
  CANVAS_PRESETS,
  CAROUSEL_PRESETS,
  BLOCK_PRESETS,
} from "../../../../config/heroPresets";
import HeroSection from "../../../../components/preview/sections/HeroSection";

// ─── Tiny UI helpers ──────────────────────────────────────────────────────────
const D = () => (
  <div style={{ borderTop: "1px solid #f1f5f9", margin: "12px 0" }} />
);
const SL = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "#94a3b8",
      textTransform: "uppercase",
      margin: "12px 0 5px",
    }}
  >
    {children}
  </div>
);
const Input = ({ value, onChange, placeholder, rows }) =>
  rows ? (
    <textarea
      className="ctrl-input"
      rows={rows}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ resize: "vertical", marginBottom: 6 }}
    />
  ) : (
    <input
      className="ctrl-input"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ marginBottom: 6 }}
    />
  );

// ─── Block type registry ──────────────────────────────────────────────────────
const BLOCK_TYPES = [
  { type: "heading", icon: "H", label: "Heading" },
  { type: "subheading", icon: "¶", label: "Subheading" },
  { type: "badge", icon: "🏷", label: "Badge" },
  { type: "buttons", icon: "⬛", label: "Buttons" },
  { type: "image", icon: "🖼", label: "Image" },
  { type: "richtext", icon: "📝", label: "Rich Text" },
  { type: "gallery", icon: "🎞", label: "Gallery" },
  { type: "carousel", icon: "🎠", label: "Carousel" },
  { type: "spacer", icon: "↕", label: "Spacer" },
  { type: "divider", icon: "─", label: "Divider" },
  { type: "stats", icon: "📊", label: "Stats" },
  { type: "iconrow", icon: "✦", label: "Icon Row" },
];

// ─── Default block factory ────────────────────────────────────────────────────
const defaultBlock = (type) => {
  const base = {
    id: uid(),
    type,
    position: "flow",
    x: 50,
    y: 50,
    width: 100,
    zIndex: 1,
    anchor: "center",
    visible: true,
  };
  switch (type) {
    case "heading":
      return {
        ...base,
        text: "Your Headline Here",
        fontSize: 64,
        color: "#ffffff",
        fontWeight: 800,
        align: "center",
        highlight: "",
        highlightColor: "#60a5fa",
      };
    case "subheading":
      return {
        ...base,
        text: "A compelling subheading that supports your headline.",
        fontSize: 18,
        color: "rgba(255,255,255,0.7)",
        align: "center",
        maxWidth: 640,
      };
    case "badge":
      return {
        ...base,
        text: "New Release",
        bg: "rgba(99,102,241,0.15)",
        color: "#818cf8",
        borderRadius: 100,
      };
    case "buttons":
      return {
        ...base,
        items: [
          {
            id: uid(),
            label: "Get Started",
            url: "#",
            style: "filled",
            bg: "#6366f1",
            color: "#fff",
            hoverBg: "#4f46e5",
            hoverColor: "#fff",
            borderRadius: 10,
            size: "md",
          },
        ],
        gap: 12,
        align: "center",
      };
    case "image":
      return {
        ...base,
        url: "",
        alt: "",
        width: 100,
        maxWidth: 700,
        borderRadius: 16,
        shadow: true,
        opacity: 100,
        align: "center",
      };
    case "richtext":
      return {
        ...base,
        html: "<p>Add your content here.</p>",
        align: "center",
        maxWidth: 800,
      };
    case "gallery":
      return {
        ...base,
        images: [],
        scrollMode: "both",
        speed: 40,
        direction: "left",
        imageHeight: 200,
        gap: 16,
        borderRadius: 8,
        objectFit: "cover",
        shadow: false,
        grayscaleHover: false,
      };
    case "carousel":
      return {
        ...base,
        slides: [
          {
            id: uid(),
            heading: "Slide 1",
            headingColor: "#fff",
            subheading: "",
            subheadingColor: "rgba(255,255,255,0.65)",
            buttons: [],
            image: { show: false, url: "" },
            badge: { show: false },
          },
        ],
        style: {
          animation: "slide",
          autoPlay: true,
          interval: 4000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
          gap: 16,
          imageAspectW: 16,
          imageAspectH: 9,
          imageBorderRadius: 12,
          imageShadow: true,
          slideHeight: 400,
          customWidth: false,
          slideWidth: 400,
          slidePadding: 0,
        },
      };
    case "spacer":
      return { ...base, height: 40 };
    case "divider":
      return {
        ...base,
        color: "rgba(255,255,255,0.15)",
        thickness: 1,
        width: 100,
        style: "solid",
      };
    case "stats":
      return {
        ...base,
        items: [
          { id: uid(), value: "99.9%", label: "Uptime" },
          { id: uid(), value: "50K+", label: "Users" },
          { id: uid(), value: "4.9★", label: "Rating" },
        ],
        valueColor: "#fff",
        labelColor: "rgba(255,255,255,0.6)",
        valueFontSize: 36,
        labelFontSize: 13,
        bg: "rgba(255,255,255,0.05)",
        borderColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        columns: 3,
      };
    case "iconrow":
      return {
        ...base,
        items: [
          { id: uid(), icon: "⚡", label: "Fast" },
          { id: uid(), icon: "🔒", label: "Secure" },
          { id: uid(), icon: "☁️", label: "Cloud" },
        ],
        iconSize: 24,
        labelColor: "rgba(255,255,255,0.7)",
        labelFontSize: 14,
        gap: 32,
        align: "center",
      };
    default:
      return base;
  }
};

// ─── Rich Text Modal ──────────────────────────────────────────────────────────
function RichTextModal({ value, onClose, onSave }) {
  const editorRef = useRef(null);
  const [html, setHtml] = useState(value || "");
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || "";
  }, []);
  const exec = useCallback((cmd, val = null) => {
    editorRef.current?.focus();
    try {
      document.execCommand(cmd, false, val);
    } catch (_) {}
    setHtml(editorRef.current?.innerHTML || "");
  }, []);
  const TB = ({ label, cmd, val = null, color }) => (
    <button
      title={label}
      onMouseDown={(e) => {
        e.preventDefault();
        exec(cmd, val);
      }}
      style={{
        padding: "4px 7px",
        border: "1px solid #e2e8f0",
        borderRadius: 4,
        background: "#fff",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 700,
        color: color || "#374151",
        minWidth: 26,
      }}
    >
      {label}
    </button>
  );
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "100%",
          maxWidth: 780,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f9fafb",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            📝 Rich Text Editor
          </span>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            padding: "7px 10px",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
            alignItems: "center",
          }}
        >
          <TB label="H1" cmd="formatBlock" val="h1" />
          <TB label="H2" cmd="formatBlock" val="h2" />
          <TB label="H3" cmd="formatBlock" val="h3" />
          <TB label="¶" cmd="formatBlock" val="p" />
          <div
            style={{
              width: 1,
              height: 20,
              background: "#e2e8f0",
              margin: "0 3px",
            }}
          />
          <TB label="B" cmd="bold" color="#111" />
          <TB label="I" cmd="italic" />
          <TB label="U" cmd="underline" />
          <TB label="S" cmd="strikeThrough" />
          <div
            style={{
              width: 1,
              height: 20,
              background: "#e2e8f0",
              margin: "0 3px",
            }}
          />
          <TB label="≡L" cmd="justifyLeft" />
          <TB label="≡C" cmd="justifyCenter" />
          <TB label="≡R" cmd="justifyRight" />
          <div
            style={{
              width: 1,
              height: 20,
              background: "#e2e8f0",
              margin: "0 3px",
            }}
          />
          <TB label="• List" cmd="insertUnorderedList" />
          <TB label="1. List" cmd="insertOrderedList" />
          <TB label="✕" cmd="removeFormat" color="#ef4444" />
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => setHtml(editorRef.current?.innerHTML || "")}
            spellCheck
            style={{
              minHeight: 200,
              outline: "none",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#111827",
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #e5e7eb",
            background: "#f9fafb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(html);
              onClose();
            }}
            style={{
              padding: "8px 22px",
              border: "none",
              borderRadius: 6,
              background: "#2563eb",
              cursor: "pointer",
              fontSize: 13,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Position Controls ────────────────────────────────────────────────────────
const ANCHOR_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "top-center", label: "Top Center" },
  { value: "bottom-center", label: "Bottom Center" },
];
function PositionControls({ block, onChange }) {
  const u = (k, v) => onChange({ ...block, [k]: v });
  const isAbsolute = block.position === "absolute";
  return (
    <div>
      <SL>Placement Mode</SL>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {["flow", "absolute"].map((mode) => (
          <button
            key={mode}
            onClick={() => u("position", mode)}
            style={{
              flex: 1,
              padding: "8px 0",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 6,
              border: "1.5px solid",
              borderColor:
                (block.position || "flow") === mode ? "#2563eb" : "#e2e8f0",
              background:
                (block.position || "flow") === mode ? "#eff6ff" : "#fff",
              color:
                (block.position || "flow") === mode ? "#2563eb" : "#64748b",
              cursor: "pointer",
            }}
          >
            {mode === "flow" ? "↕ Normal Flow" : "⛓ Free Position"}
          </button>
        ))}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#94a3b8",
          marginBottom: 10,
          lineHeight: 1.5,
        }}
      >
        {isAbsolute
          ? "Block overlaps others. Use X/Y/Z to position freely."
          : "Block stacks in order with other blocks."}
      </div>
      {isAbsolute && (
        <>
          <SL>Anchor Point</SL>
          <SelectControl
            value={block.anchor || "center"}
            options={ANCHOR_OPTIONS}
            onChange={(v) => u("anchor", v)}
          />
          <SL>Position</SL>
          <RangeControl
            label="X (horizontal)"
            value={block.x ?? 50}
            min={0}
            max={100}
            onChange={(v) => u("x", v)}
            unit="%"
          />
          <RangeControl
            label="Y (vertical)"
            value={block.y ?? 50}
            min={0}
            max={100}
            onChange={(v) => u("y", v)}
            unit="%"
          />
          <SL>Size & Stacking</SL>
          <RangeControl
            label="Width"
            value={block.width ?? 100}
            min={5}
            max={100}
            onChange={(v) => u("width", v)}
            unit="%"
          />
          <RangeControl
            label="Z-Index (depth)"
            value={block.zIndex ?? 1}
            min={0}
            max={50}
            onChange={(v) => u("zIndex", v)}
            unit=""
          />
        </>
      )}
    </div>
  );
}

// ─── Block Settings Panel ─────────────────────────────────────────────────────
function BlockSettings({ block, onChange }) {
  const u = (k, v) => onChange({ ...block, [k]: v });
  const [richModalOpen, setRichModalOpen] = useState(false);
  const [subTab, setSubTab] = useState("content");

  if (!block)
    return (
      <div
        style={{
          padding: 24,
          color: "#94a3b8",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        ← Select a block to edit
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        {["content", "layout"].map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            style={{
              flex: 1,
              padding: "9px 0",
              fontSize: 11,
              fontWeight: subTab === t ? 700 : 500,
              color: subTab === t ? "#2563eb" : "#64748b",
              background: subTab === t ? "#eff6ff" : "transparent",
              border: "none",
              borderBottom:
                subTab === t ? "2px solid #2563eb" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            {t === "content" ? "Content & Style" : "⛓ Position / Layout"}
          </button>
        ))}
      </div>

      {subTab === "layout" && (
        <div style={{ padding: "0 14px 24px", marginTop: 14 }}>
          <PositionControls block={block} onChange={onChange} />
        </div>
      )}

      {subTab === "content" && (
        <div style={{ padding: "0 14px 24px" }}>
          {/* ── HEADING ── */}
          {block.type === "heading" && (
            <>
              <SL>Text</SL>
              <Input
                value={block.text}
                onChange={(v) => u("text", v)}
                placeholder="Heading text"
                rows={3}
              />
              <SL>Style</SL>
              <RangeControl
                label="Font Size"
                value={block.fontSize || 64}
                min={24}
                max={120}
                onChange={(v) => u("fontSize", v)}
                unit="px"
              />
              <SelectControl
                label="Weight"
                value={String(block.fontWeight || 800)}
                options={[
                  { value: "400", label: "Regular" },
                  { value: "600", label: "Semibold" },
                  { value: "700", label: "Bold" },
                  { value: "800", label: "Extrabold" },
                ]}
                onChange={(v) => u("fontWeight", Number(v))}
              />
              <ColorControl
                label="Color"
                value={block.color || "#fff"}
                onChange={(v) => u("color", v)}
              />
              <SelectControl
                label="Align"
                value={block.align || "center"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => u("align", v)}
              />
              <SL>Highlight Word</SL>
              <Input
                value={block.highlight || ""}
                onChange={(v) => u("highlight", v)}
                placeholder="Word to highlight"
              />
              <ColorControl
                label="Highlight Color"
                value={block.highlightColor || "#60a5fa"}
                onChange={(v) => u("highlightColor", v)}
              />
            </>
          )}

          {/* ── SUBHEADING ── */}
          {block.type === "subheading" && (
            <>
              <SL>Text</SL>
              <Input
                value={block.text}
                onChange={(v) => u("text", v)}
                placeholder="Subheading text"
                rows={4}
              />
              <SL>Style</SL>
              <RangeControl
                label="Font Size"
                value={block.fontSize || 18}
                min={12}
                max={40}
                onChange={(v) => u("fontSize", v)}
                unit="px"
              />
              <ColorControl
                label="Color"
                value={block.color || "rgba(255,255,255,0.7)"}
                onChange={(v) => u("color", v)}
              />
              <SelectControl
                label="Align"
                value={block.align || "center"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => u("align", v)}
              />
              <RangeControl
                label="Max Width"
                value={block.maxWidth || 640}
                min={200}
                max={1200}
                onChange={(v) => u("maxWidth", v)}
                unit="px"
              />
            </>
          )}

          {/* ── BADGE ── */}
          {block.type === "badge" && (
            <>
              <SL>Text</SL>
              <Input
                value={block.text}
                onChange={(v) => u("text", v)}
                placeholder="Badge text"
              />
              <SL>Style</SL>
              <ColorControl
                label="Background"
                value={block.bg || "rgba(99,102,241,0.15)"}
                onChange={(v) => u("bg", v)}
              />
              <ColorControl
                label="Text Color"
                value={block.color || "#818cf8"}
                onChange={(v) => u("color", v)}
              />
              <RangeControl
                label="Border Radius"
                value={block.borderRadius ?? 100}
                min={0}
                max={100}
                onChange={(v) => u("borderRadius", v)}
                unit="px"
              />
            </>
          )}

          {/* ── BUTTONS ── */}
          {block.type === "buttons" && (
            <>
              <SL>Layout</SL>
              <SelectControl
                value={block.align || "center"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => u("align", v)}
              />
              <RangeControl
                label="Gap"
                value={block.gap || 12}
                min={0}
                max={40}
                onChange={(v) => u("gap", v)}
                unit="px"
              />
              <SL>Buttons</SL>
              {(block.items || []).map((btn, i) => (
                <div
                  key={btn.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 8,
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#374151",
                      }}
                    >
                      Button {i + 1}
                    </span>
                    <button
                      onClick={() =>
                        u(
                          "items",
                          block.items.filter((b) => b.id !== btn.id),
                        )
                      }
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
                  <Input
                    value={btn.label}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, label: v } : b,
                        ),
                      )
                    }
                    placeholder="Label"
                  />
                  <Input
                    value={btn.url}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, url: v } : b,
                        ),
                      )
                    }
                    placeholder="URL"
                  />
                  <SelectControl
                    label="Style"
                    value={btn.style}
                    options={["filled", "outline", "ghost"].map((v) => ({
                      value: v,
                      label: v.charAt(0).toUpperCase() + v.slice(1),
                    }))}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, style: v } : b,
                        ),
                      )
                    }
                  />
                  <SelectControl
                    label="Size"
                    value={btn.size}
                    options={[
                      { value: "sm", label: "Small" },
                      { value: "md", label: "Medium" },
                      { value: "lg", label: "Large" },
                    ]}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, size: v } : b,
                        ),
                      )
                    }
                  />
                  <ColorControl
                    label="BG"
                    value={btn.bg}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, bg: v } : b,
                        ),
                      )
                    }
                  />
                  <ColorControl
                    label="Text"
                    value={btn.color}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, color: v } : b,
                        ),
                      )
                    }
                  />
                  <ColorControl
                    label="Hover BG"
                    value={btn.hoverBg || btn.bg}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, hoverBg: v } : b,
                        ),
                      )
                    }
                  />
                  <RangeControl
                    label="Radius"
                    value={btn.borderRadius || 10}
                    min={0}
                    max={100}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((b) =>
                          b.id === btn.id ? { ...b, borderRadius: v } : b,
                        ),
                      )
                    }
                    unit="px"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  u("items", [
                    ...(block.items || []),
                    {
                      id: uid(),
                      label: "Button",
                      url: "#",
                      style: "filled",
                      bg: "#2563eb",
                      color: "#fff",
                      hoverBg: "#1d4ed8",
                      hoverColor: "#fff",
                      borderRadius: 10,
                      size: "md",
                    },
                  ])
                }
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
            </>
          )}

          {/* ── IMAGE ── */}
          {block.type === "image" && (
            <>
              <SL>Image</SL>
              <ImageUpload
                value={block.url}
                onChange={(v) => u("url", v)}
                height={100}
              />
              <Input
                value={block.alt}
                onChange={(v) => u("alt", v)}
                placeholder="Alt text"
              />
              <SL>Layout</SL>
              <SelectControl
                label="Align"
                value={block.align || "center"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => u("align", v)}
              />
              <RangeControl
                label="Width %"
                value={block.width || 100}
                min={10}
                max={100}
                onChange={(v) => u("width", v)}
                unit="%"
              />
              <RangeControl
                label="Max Width"
                value={block.maxWidth || 700}
                min={100}
                max={1400}
                onChange={(v) => u("maxWidth", v)}
                unit="px"
              />
              <SL>Style</SL>
              <RangeControl
                label="Border Radius"
                value={block.borderRadius ?? 16}
                min={0}
                max={60}
                onChange={(v) => u("borderRadius", v)}
                unit="px"
              />
              <ToggleControl
                label="Shadow"
                value={!!block.shadow}
                onChange={(v) => u("shadow", v)}
              />
              <RangeControl
                label="Opacity"
                value={block.opacity ?? 100}
                min={0}
                max={100}
                onChange={(v) => u("opacity", v)}
                unit="%"
              />
            </>
          )}

          {/* ── RICH TEXT ── */}
          {block.type === "richtext" && (
            <>
              <SL>Content</SL>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 11,
                  color: "#64748b",
                  minHeight: 50,
                  maxHeight: 100,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
                dangerouslySetInnerHTML={{
                  __html: block.html || "<em style='color:#94a3b8'>Empty</em>",
                }}
              />
              <button
                onClick={() => setRichModalOpen(true)}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  border: "1.5px solid #2563eb",
                  borderRadius: 6,
                  background: "#eff6ff",
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: 8,
                }}
              >
                ✏️ Open Rich Text Editor
              </button>
              <SL>Layout</SL>
              <SelectControl
                label="Align"
                value={block.align || "center"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => u("align", v)}
              />
              <RangeControl
                label="Max Width"
                value={block.maxWidth || 800}
                min={200}
                max={1200}
                onChange={(v) => u("maxWidth", v)}
                unit="px"
              />
              {richModalOpen && (
                <RichTextModal
                  value={block.html}
                  onClose={() => setRichModalOpen(false)}
                  onSave={(v) => u("html", v)}
                />
              )}
            </>
          )}

          {/* ── GALLERY ── */}
          {block.type === "gallery" && (
            <>
              <SL>Images ({(block.images || []).length})</SL>
              {(block.images || []).map((img, i) => (
                <div
                  key={img.id || i}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 6,
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#64748b",
                      }}
                    >
                      Image {i + 1}
                    </span>
                    <button
                      onClick={() =>
                        u(
                          "images",
                          block.images.filter((im) => im.id !== img.id),
                        )
                      }
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
                    onChange={(v) =>
                      u(
                        "images",
                        block.images.map((im) =>
                          im.id === img.id ? { ...im, url: v } : im,
                        ),
                      )
                    }
                    height={70}
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  u("images", [
                    ...(block.images || []),
                    { id: uid(), url: "", alt: "" },
                  ])
                }
                style={{
                  width: "100%",
                  border: "1.5px dashed #cbd5e1",
                  background: "transparent",
                  borderRadius: 8,
                  padding: 8,
                  color: "#94a3b8",
                  fontSize: 12,
                  cursor: "pointer",
                  marginBottom: 10,
                }}
              >
                + Add Image
              </button>
              <SL>Scroll</SL>
              <SelectControl
                value={block.scrollMode || "both"}
                options={[
                  { value: "auto", label: "Auto-scroll" },
                  { value: "manual", label: "Manual drag" },
                  { value: "both", label: "Auto + pause on hover" },
                ]}
                onChange={(v) => u("scrollMode", v)}
              />
              <RangeControl
                label="Speed"
                value={block.speed ?? 40}
                min={5}
                max={150}
                onChange={(v) => u("speed", v)}
                unit="s"
              />
              <SelectControl
                label="Direction"
                value={block.direction || "left"}
                options={[
                  { value: "left", label: "← Left" },
                  { value: "right", label: "→ Right" },
                ]}
                onChange={(v) => u("direction", v)}
              />
              <SL>Style</SL>
              <RangeControl
                label="Image Height"
                value={block.imageHeight || 200}
                min={60}
                max={500}
                onChange={(v) => u("imageHeight", v)}
                unit="px"
              />
              <RangeControl
                label="Gap"
                value={block.gap || 16}
                min={0}
                max={60}
                onChange={(v) => u("gap", v)}
                unit="px"
              />
              <RangeControl
                label="Border Radius"
                value={block.borderRadius || 8}
                min={0}
                max={60}
                onChange={(v) => u("borderRadius", v)}
                unit="px"
              />
              <ToggleControl
                label="Shadow"
                value={!!block.shadow}
                onChange={(v) => u("shadow", v)}
              />
              <ToggleControl
                label="Grayscale → Color on Hover"
                value={!!block.grayscaleHover}
                onChange={(v) => u("grayscaleHover", v)}
              />
            </>
          )}

          {/* ── CAROUSEL ── */}
          {block.type === "carousel" && (
            <>
              <SL>Carousel Presets</SL>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                {CAROUSEL_PRESETS.slice(0, 8).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const nb = p.block();
                      u("slides", nb.slides);
                      u("style", nb.style);
                    }}
                    style={{
                      padding: "7px 8px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      background: "#fafafa",
                      cursor: "pointer",
                      fontSize: 11,
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2563eb";
                      e.currentTarget.style.background = "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.background = "#fafafa";
                    }}
                  >
                    <span>{p.thumb}</span>
                    <span style={{ lineHeight: 1.3 }}>{p.name}</span>
                  </button>
                ))}
              </div>
              <SL>Animation</SL>
              <SelectControl
                value={block.style?.animation || "slide"}
                options={[
                  { value: "slide", label: "Slide" },
                  { value: "fade", label: "Fade" },
                  { value: "zoom", label: "Zoom" },
                ]}
                onChange={(v) => u("style", { ...block.style, animation: v })}
              />
              <ToggleControl
                label="Auto Play"
                value={!!block.style?.autoPlay}
                onChange={(v) => u("style", { ...block.style, autoPlay: v })}
              />
              {block.style?.autoPlay && (
                <RangeControl
                  label="Interval"
                  value={block.style?.interval ?? 4000}
                  min={1000}
                  max={10000}
                  onChange={(v) => u("style", { ...block.style, interval: v })}
                  unit="ms"
                />
              )}
              <ToggleControl
                label="Show Arrows"
                value={!!block.style?.showArrows}
                onChange={(v) => u("style", { ...block.style, showArrows: v })}
              />
              <ToggleControl
                label="Show Dots"
                value={!!block.style?.showDots}
                onChange={(v) => u("style", { ...block.style, showDots: v })}
              />
              <SelectControl
                label="Theme"
                value={block.style?.theme || "dark"}
                options={[
                  { value: "dark", label: "Dark" },
                  { value: "light", label: "Light" },
                  { value: "accent", label: "Accent" },
                ]}
                onChange={(v) => u("style", { ...block.style, theme: v })}
              />
              <SL>Layout</SL>
              <SelectControl
                label="Slides Per Row"
                value={block.style?.itemsPerView ?? 1}
                options={[
                  { value: 1, label: "1 — Full width" },
                  { value: 2, label: "2 — Side by side" },
                  { value: 3, label: "3 — Grid" },
                  { value: 4, label: "4 — Compact" },
                ]}
                onChange={(v) =>
                  u("style", { ...block.style, itemsPerView: Number(v) })
                }
              />
              <RangeControl
                label="Gap"
                value={block.style?.gap ?? 16}
                min={0}
                max={60}
                onChange={(v) => u("style", { ...block.style, gap: v })}
                unit="px"
              />
              <RangeControl
                label="Slide Height"
                value={block.style?.slideHeight ?? 400}
                min={100}
                max={900}
                onChange={(v) => u("style", { ...block.style, slideHeight: v })}
                unit="px"
              />
              <RangeControl
                label="Image Aspect W"
                value={block.style?.imageAspectW ?? 16}
                min={1}
                max={21}
                onChange={(v) =>
                  u("style", { ...block.style, imageAspectW: v })
                }
                unit=""
              />
              <RangeControl
                label="Image Aspect H"
                value={block.style?.imageAspectH ?? 9}
                min={1}
                max={16}
                onChange={(v) =>
                  u("style", { ...block.style, imageAspectH: v })
                }
                unit=""
              />
              <RangeControl
                label="Image Radius"
                value={block.style?.imageBorderRadius ?? 12}
                min={0}
                max={60}
                onChange={(v) =>
                  u("style", { ...block.style, imageBorderRadius: v })
                }
                unit="px"
              />
              <ToggleControl
                label="Image Shadow"
                value={!!block.style?.imageShadow}
                onChange={(v) => u("style", { ...block.style, imageShadow: v })}
              />
              <SL>Slides</SL>
              {(block.slides || []).map((slide, si) => (
                <div
                  key={slide.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 8,
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700 }}>
                      Slide {si + 1}
                    </span>
                    <button
                      onClick={() =>
                        u(
                          "slides",
                          block.slides.filter((s) => s.id !== slide.id),
                        )
                      }
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
                  <Input
                    value={slide.heading || ""}
                    onChange={(v) =>
                      u(
                        "slides",
                        block.slides.map((s) =>
                          s.id === slide.id ? { ...s, heading: v } : s,
                        ),
                      )
                    }
                    placeholder="Heading"
                  />
                  <Input
                    value={slide.subheading || ""}
                    onChange={(v) =>
                      u(
                        "slides",
                        block.slides.map((s) =>
                          s.id === slide.id ? { ...s, subheading: v } : s,
                        ),
                      )
                    }
                    placeholder="Subheading"
                  />
                  <ColorControl
                    label="Heading Color"
                    value={slide.headingColor || "#fff"}
                    onChange={(v) =>
                      u(
                        "slides",
                        block.slides.map((s) =>
                          s.id === slide.id ? { ...s, headingColor: v } : s,
                        ),
                      )
                    }
                  />
                  <ToggleControl
                    label="Show Image"
                    value={!!slide.image?.show}
                    onChange={(v) =>
                      u(
                        "slides",
                        block.slides.map((s) =>
                          s.id === slide.id
                            ? { ...s, image: { ...s.image, show: v } }
                            : s,
                        ),
                      )
                    }
                  />
                  {slide.image?.show && (
                    <ImageUpload
                      value={slide.image?.url || ""}
                      onChange={(v) =>
                        u(
                          "slides",
                          block.slides.map((s) =>
                            s.id === slide.id
                              ? { ...s, image: { ...s.image, url: v } }
                              : s,
                          ),
                        )
                      }
                      height={80}
                    />
                  )}
                </div>
              ))}
              <button
                onClick={() =>
                  u("slides", [
                    ...(block.slides || []),
                    {
                      id: uid(),
                      heading: `Slide ${(block.slides || []).length + 1}`,
                      headingColor: "#fff",
                      subheading: "",
                      subheadingColor: "rgba(255,255,255,0.65)",
                      buttons: [],
                      image: { show: false, url: "" },
                      badge: { show: false },
                    },
                  ])
                }
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
                + Add Slide
              </button>
            </>
          )}

          {/* ── SPACER ── */}
          {block.type === "spacer" && (
            <>
              <SL>Height</SL>
              <RangeControl
                label="Height"
                value={block.height || 40}
                min={4}
                max={200}
                onChange={(v) => u("height", v)}
                unit="px"
              />
            </>
          )}

          {/* ── DIVIDER ── */}
          {block.type === "divider" && (
            <>
              <SL>Style</SL>
              <SelectControl
                value={block.style || "solid"}
                options={[
                  { value: "solid", label: "Solid" },
                  { value: "dashed", label: "Dashed" },
                  { value: "dotted", label: "Dotted" },
                ]}
                onChange={(v) => u("style", v)}
              />
              <ColorControl
                label="Color"
                value={block.color || "rgba(255,255,255,0.15)"}
                onChange={(v) => u("color", v)}
              />
              <RangeControl
                label="Thickness"
                value={block.thickness || 1}
                min={1}
                max={8}
                onChange={(v) => u("thickness", v)}
                unit="px"
              />
              <RangeControl
                label="Width"
                value={block.width || 100}
                min={10}
                max={100}
                onChange={(v) => u("width", v)}
                unit="%"
              />
            </>
          )}

          {/* ── STATS ── */}
          {block.type === "stats" && (
            <>
              <SL>Stats</SL>
              {(block.items || []).map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 6,
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#64748b",
                      }}
                    >
                      Stat {i + 1}
                    </span>
                    <button
                      onClick={() =>
                        u(
                          "items",
                          block.items.filter((it) => it.id !== item.id),
                        )
                      }
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
                  <Input
                    value={item.value}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((it) =>
                          it.id === item.id ? { ...it, value: v } : it,
                        ),
                      )
                    }
                    placeholder="99.9%"
                  />
                  <Input
                    value={item.label}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((it) =>
                          it.id === item.id ? { ...it, label: v } : it,
                        ),
                      )
                    }
                    placeholder="Label"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  u("items", [
                    ...(block.items || []),
                    { id: uid(), value: "100+", label: "New Stat" },
                  ])
                }
                style={{
                  width: "100%",
                  border: "1.5px dashed #cbd5e1",
                  background: "transparent",
                  borderRadius: 8,
                  padding: 8,
                  color: "#94a3b8",
                  fontSize: 12,
                  cursor: "pointer",
                  marginBottom: 10,
                }}
              >
                + Add Stat
              </button>
              <SL>Layout</SL>
              <SelectControl
                label="Columns"
                value={block.columns || 3}
                options={[
                  { value: 2, label: "2 cols" },
                  { value: 3, label: "3 cols" },
                  { value: 4, label: "4 cols" },
                ]}
                onChange={(v) => u("columns", Number(v))}
              />
              <SL>Colors</SL>
              <ColorControl
                label="Value Color"
                value={block.valueColor || "#fff"}
                onChange={(v) => u("valueColor", v)}
              />
              <ColorControl
                label="Label Color"
                value={block.labelColor || "rgba(255,255,255,0.6)"}
                onChange={(v) => u("labelColor", v)}
              />
              <ColorControl
                label="Card BG"
                value={block.bg || "rgba(255,255,255,0.05)"}
                onChange={(v) => u("bg", v)}
              />
              <SL>Typography</SL>
              <RangeControl
                label="Value Size"
                value={block.valueFontSize || 36}
                min={20}
                max={72}
                onChange={(v) => u("valueFontSize", v)}
                unit="px"
              />
              <RangeControl
                label="Label Size"
                value={block.labelFontSize || 13}
                min={10}
                max={20}
                onChange={(v) => u("labelFontSize", v)}
                unit="px"
              />
              <RangeControl
                label="Border Radius"
                value={block.borderRadius || 12}
                min={0}
                max={40}
                onChange={(v) => u("borderRadius", v)}
                unit="px"
              />
            </>
          )}

          {/* ── ICON ROW ── */}
          {block.type === "iconrow" && (
            <>
              <SL>Icons</SL>
              {(block.items || []).map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 6,
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#64748b",
                      }}
                    >
                      Item {i + 1}
                    </span>
                    <button
                      onClick={() =>
                        u(
                          "items",
                          block.items.filter((it) => it.id !== item.id),
                        )
                      }
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
                  <Input
                    value={item.icon}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((it) =>
                          it.id === item.id ? { ...it, icon: v } : it,
                        ),
                      )
                    }
                    placeholder="Emoji or icon"
                  />
                  <Input
                    value={item.label}
                    onChange={(v) =>
                      u(
                        "items",
                        block.items.map((it) =>
                          it.id === item.id ? { ...it, label: v } : it,
                        ),
                      )
                    }
                    placeholder="Label"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  u("items", [
                    ...(block.items || []),
                    { id: uid(), icon: "✦", label: "Feature" },
                  ])
                }
                style={{
                  width: "100%",
                  border: "1.5px dashed #cbd5e1",
                  background: "transparent",
                  borderRadius: 8,
                  padding: 8,
                  color: "#94a3b8",
                  fontSize: 12,
                  cursor: "pointer",
                  marginBottom: 10,
                }}
              >
                + Add Icon
              </button>
              <SL>Style</SL>
              <ColorControl
                label="Label Color"
                value={block.labelColor || "rgba(255,255,255,0.7)"}
                onChange={(v) => u("labelColor", v)}
              />
              <RangeControl
                label="Icon Size"
                value={block.iconSize || 24}
                min={14}
                max={64}
                onChange={(v) => u("iconSize", v)}
                unit="px"
              />
              <RangeControl
                label="Label Size"
                value={block.labelFontSize || 14}
                min={10}
                max={24}
                onChange={(v) => u("labelFontSize", v)}
                unit="px"
              />
              <RangeControl
                label="Gap"
                value={block.gap || 32}
                min={8}
                max={80}
                onChange={(v) => u("gap", v)}
                unit="px"
              />
              <SelectControl
                label="Align"
                value={block.align || "center"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => u("align", v)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mini Preview ─────────────────────────────────────────────────────────────
function MiniPreview({ config: c, blocks }) {
  const bg =
    c.bgType === "gradient" && c.bgGradient
      ? `linear-gradient(${c.bgGradient.direction || "to right"}, ${c.bgGradient.from || "#0f172a"}, ${c.bgGradient.to || "#1e1b4b"})`
      : c.bg || "#0f172a";
  return (
    <div
      style={{
        background: bg,
        borderRadius: 8,
        padding: "16px 12px",
        minHeight: 120,
        position: "relative",
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
        }}
      >
        {blocks
          .filter((b) => b.visible !== false)
          .slice(0, 6)
          .map((block) => {
            if (block.type === "heading")
              return (
                <div
                  key={block.id}
                  style={{
                    height: 10,
                    width: "70%",
                    background: block.color || "#fff",
                    borderRadius: 3,
                    opacity: 0.9,
                  }}
                />
              );
            if (block.type === "subheading")
              return (
                <div
                  key={block.id}
                  style={{
                    height: 6,
                    width: "50%",
                    background: block.color || "rgba(255,255,255,0.6)",
                    borderRadius: 3,
                  }}
                />
              );
            if (block.type === "badge")
              return (
                <div
                  key={block.id}
                  style={{
                    height: 8,
                    width: "25%",
                    background: block.bg || "rgba(99,102,241,0.3)",
                    borderRadius: 10,
                  }}
                />
              );
            if (block.type === "buttons")
              return (
                <div key={block.id} style={{ display: "flex", gap: 4 }}>
                  {(block.items || []).slice(0, 2).map((btn, i) => (
                    <div
                      key={i}
                      style={{
                        height: 8,
                        width: 36,
                        background: btn.bg || "#6366f1",
                        borderRadius: btn.borderRadius || 4,
                        opacity: 0.9,
                      }}
                    />
                  ))}
                </div>
              );
            if (block.type === "spacer")
              return (
                <div
                  key={block.id}
                  style={{ height: Math.max(2, (block.height || 40) / 8) }}
                />
              );
            if (block.type === "divider")
              return (
                <div
                  key={block.id}
                  style={{
                    height: 1,
                    width: "60%",
                    background: block.color || "rgba(255,255,255,0.2)",
                  }}
                />
              );
            if (block.type === "image")
              return (
                <div
                  key={block.id}
                  style={{
                    height: 24,
                    width: "60%",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: block.borderRadius
                      ? block.borderRadius / 4
                      : 4,
                  }}
                />
              );
            if (block.type === "stats")
              return (
                <div key={block.id} style={{ display: "flex", gap: 4 }}>
                  {(block.items || [])
                    .slice(0, block.columns || 3)
                    .map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: 18,
                          width: 28,
                          background: block.bg || "rgba(255,255,255,0.1)",
                          borderRadius: 3,
                        }}
                      />
                    ))}
                </div>
              );
            if (block.type === "gallery")
              return (
                <div
                  key={block.id}
                  style={{
                    height: 14,
                    width: "90%",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 3,
                  }}
                />
              );
            if (block.type === "carousel")
              return (
                <div
                  key={block.id}
                  style={{
                    height: 22,
                    width: "80%",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>
                    carousel
                  </span>
                </div>
              );
            if (block.type === "iconrow")
              return (
                <div key={block.id} style={{ display: "flex", gap: 6 }}>
                  {(block.items || []).slice(0, 4).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: 6,
                        width: 20,
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              );
            return null;
          })}
      </div>
    </div>
  );
}

// ─── Canvas Builder Modal (full screen) ──────────────────────────────────────
function CanvasBuilderModal({ config: c, onChange, onClose }) {
  const [blocks, setBlocks] = useState(c.canvasBlocks || []);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCarouselPresets, setShowCarouselPresets] = useState(false);
  const [presetsTab, setPresetsTab] = useState("canvas"); // "canvas" | "carousel" | "block"
  const [showPresetsPanel, setShowPresetsPanel] = useState(false);
  const [presetCategory, setPresetCategory] = useState("All");
  const [carouselCategory, setCarouselCategory] = useState("All");
  const [confirmApply, setConfirmApply] = useState(null);
  const dragIdx = useRef(null);
  const dragOverIdx = useRef(null);

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  const addBlock = (type) => {
    const nb = defaultBlock(type);
    const updated = [...blocks, nb];
    setBlocks(updated);
    setSelectedId(nb.id);
    setShowAddMenu(false);
  };

  const updateBlock = (updated) =>
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const toggleVisible = (id) =>
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, visible: b.visible === false ? true : false } : b,
      ),
    );
  const moveBlock = (id, dir) => {
    const arr = [...blocks];
    const i = arr.findIndex((b) => b.id === id);
    const ni = i + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[i], arr[ni]] = [arr[ni], arr[i]];
    setBlocks(arr);
  };

  // Drag and drop
  const onDragStart = (i) => {
    dragIdx.current = i;
  };
  const onDragOver = (e, i) => {
    e.preventDefault();
    dragOverIdx.current = i;
  };
  const onDrop = () => {
    if (dragIdx.current === null || dragOverIdx.current === null) return;
    const arr = [...blocks];
    const [moved] = arr.splice(dragIdx.current, 1);
    arr.splice(dragOverIdx.current, 0, moved);
    setBlocks(arr);
    dragIdx.current = null;
    dragOverIdx.current = null;
  };

  // Apply canvas preset
  const applyCanvasPreset = (preset) => {
    const newBlocks = preset.blocks();
    setBlocks(newBlocks);
    setSelectedId(null);
    // Apply bg config too
    if (preset.bg) onChange({ ...preset.bg });
    setConfirmApply(preset.id);
    setTimeout(() => setConfirmApply(null), 2000);
  };

  // Insert carousel preset as a block
  const insertCarouselPreset = (preset) => {
    const nb = { ...preset.block(), id: uid() };
    const updated = [...blocks, nb];
    setBlocks(updated);
    setSelectedId(nb.id);
  };

  // Insert block preset
  const insertBlockPreset = (type, presetDef) => {
    const nb = { ...presetDef.block(), id: uid() };
    const updated = [...blocks, nb];
    setBlocks(updated);
    setSelectedId(nb.id);
  };

  const save = () => {
    onChange({ canvasBlocks: blocks, _builderMode: true });
    onClose();
  };

  // Categories
  const canvasCategories = [
    "All",
    ...new Set(CANVAS_PRESETS.map((p) => p.category)),
  ];
  const carouselCategories = [
    "All",
    ...new Set(CAROUSEL_PRESETS.map((p) => p.category)),
  ];
  const filteredCanvas =
    presetCategory === "All"
      ? CANVAS_PRESETS
      : CANVAS_PRESETS.filter((p) => p.category === presetCategory);
  const filteredCarousel =
    carouselCategory === "All"
      ? CAROUSEL_PRESETS
      : CAROUSEL_PRESETS.filter((p) => p.category === carouselCategory);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* ── LEFT: Block List ── */}
      <div
        style={{
          width: 270,
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
              🎨 Canvas Builder
            </div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
              Drag to reorder · 👁 to hide
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            ×
          </button>
        </div>

        {/* Mini preview */}
        <div
          style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Live Preview
          </div>
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              height: 130,
              position: "relative",
              background: "#0f172a",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "400%",
                height: "400%",
                transform: "scale(0.25)",
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            >
              <HeroSection
                config={{ ...c, canvasBlocks: blocks, _builderMode: true }}
              />
            </div>
          </div>
        </div>
        {/* Background + Block list (scroll together) */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          <div
            style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9" }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Background
            </div>
            <BgControl config={c} onChange={onChange} />
          </div>

          <div style={{ padding: "8px 10px" }}>
            {blocks.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: 12,
                  padding: "30px 10px",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
                No blocks yet.
                <br />
                Use + Add Block or browse Presets.
              </div>
            )}
            {blocks.map((block, i) => {
              const def = BLOCK_TYPES.find((t) => t.type === block.type);
              const isSelected = selectedId === block.id;
              const isHidden = block.visible === false;
              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={onDrop}
                  onClick={() => setSelectedId(block.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 8px",
                    marginBottom: 3,
                    borderRadius: 8,
                    border: isSelected
                      ? "1.5px solid #2563eb"
                      : "1.5px solid #f1f5f9",
                    background: isSelected ? "#eff6ff" : "#fafafa",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    opacity: isHidden ? 0.45 : 1,
                  }}
                >
                  {/* Drag handle */}
                  <span
                    style={{
                      fontSize: 12,
                      color: "#cbd5e1",
                      cursor: "grab",
                      flexShrink: 0,
                    }}
                  >
                    ⠿
                  </span>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>
                    {def?.icon || "□"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: isSelected ? "#2563eb" : "#374151",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {def?.label || block.type}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {block.type === "heading" &&
                        (block.text || "").slice(0, 22)}
                      {block.type === "subheading" &&
                        (block.text || "").slice(0, 22)}
                      {block.type === "badge" && block.text}
                      {block.type === "buttons" &&
                        `${(block.items || []).length} btn(s)`}
                      {block.type === "gallery" &&
                        `${(block.images || []).length} img(s)`}
                      {block.type === "stats" &&
                        `${(block.items || []).length} stat(s)`}
                      {block.type === "iconrow" &&
                        `${(block.items || []).length} icon(s)`}
                      {block.type === "spacer" && `${block.height || 40}px`}
                      {block.type === "carousel" &&
                        `${(block.slides || []).length} slide(s)`}
                      {block.type === "image" &&
                        (block.url ? "Image set" : "No image")}
                    </div>
                  </div>
                  {/* Controls */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisible(block.id);
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        padding: "1px 3px",
                        color: isHidden ? "#94a3b8" : "#374151",
                      }}
                      title={isHidden ? "Show block" : "Hide block"}
                    >
                      {isHidden ? "🙈" : "👁"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, -1);
                      }}
                      disabled={i === 0}
                      style={{
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        borderRadius: 3,
                        padding: "1px 4px",
                        cursor: "pointer",
                        fontSize: 9,
                        color: "#64748b",
                        lineHeight: 1,
                      }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, 1);
                      }}
                      disabled={i === blocks.length - 1}
                      style={{
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        borderRadius: 3,
                        padding: "1px 4px",
                        cursor: "pointer",
                        fontSize: 9,
                        color: "#64748b",
                        lineHeight: 1,
                      }}
                    >
                      ↓
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        color: "#e2e8f0",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: "0 2px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#ef4444")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#e2e8f0")
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add block + Presets + Save */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: "1px solid #e2e8f0",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <button
              onClick={() => {
                setShowAddMenu((v) => !v);
                setShowPresetsPanel(false);
              }}
              style={{
                flex: 1,
                padding: "8px 0",
                border: "none",
                borderRadius: 7,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              + Add Block
            </button>
            <button
              onClick={() => {
                setShowPresetsPanel((v) => !v);
                setShowAddMenu(false);
              }}
              style={{
                flex: 1,
                padding: "8px 0",
                border: "1.5px solid #e2e8f0",
                borderRadius: 7,
                background: showPresetsPanel ? "#eff6ff" : "#fff",
                color: showPresetsPanel ? "#2563eb" : "#374151",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ✦ Presets
            </button>
          </div>
          <button
            onClick={save}
            style={{
              width: "100%",
              padding: "9px 0",
              border: "none",
              borderRadius: 7,
              background: "#10b981",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ✓ Save & Apply
          </button>

          {/* Add block menu */}
          {showAddMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: 12,
                right: 12,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                Choose Block Type
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                }}
              >
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#374151",
                      textAlign: "left",
                      borderBottom: "1px solid #f8fafc",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>
                      {bt.icon}
                    </span>{" "}
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MIDDLE: Presets Panel (slides in when open) ── */}
      {showPresetsPanel && (
        <div
          style={{
            width: 320,
            background: "#f8fafc",
            borderRight: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {/* Preset type tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e2e8f0",
              background: "#fff",
            }}
          >
            {[
              { id: "canvas", label: "🎨 Full Hero" },
              { id: "carousel", label: "🎠 Carousel" },
              { id: "block", label: "⬛ Blocks" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPresetsTab(t.id)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  fontSize: 10,
                  fontWeight: presetsTab === t.id ? 700 : 500,
                  color: presetsTab === t.id ? "#2563eb" : "#64748b",
                  background: presetsTab === t.id ? "#eff6ff" : "transparent",
                  border: "none",
                  borderBottom:
                    presetsTab === t.id
                      ? "2px solid #2563eb"
                      : "2px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div
            style={{ flex: 1, overflowY: "auto", padding: "10px 10px 20px" }}
          >
            {/* Canvas presets */}
            {presetsTab === "canvas" && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  Apply a full hero layout.{" "}
                  <strong>Replaces all blocks.</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {canvasCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPresetCategory(cat)}
                      style={{
                        padding: "3px 8px",
                        border: "1px solid",
                        borderColor:
                          presetCategory === cat ? "#2563eb" : "#e2e8f0",
                        borderRadius: 100,
                        fontSize: 10,
                        fontWeight: presetCategory === cat ? 700 : 400,
                        background: presetCategory === cat ? "#eff6ff" : "#fff",
                        color: presetCategory === cat ? "#2563eb" : "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {filteredCanvas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyCanvasPreset(p)}
                      style={{
                        border:
                          confirmApply === p.id
                            ? "2px solid #10b981"
                            : "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        background: "#fff",
                        cursor: "pointer",
                        overflow: "hidden",
                        padding: 0,
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2563eb";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          confirmApply === p.id ? "#10b981" : "#e2e8f0";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          height: 44,
                          background: p.bg?.bg || "#0f172a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                        }}
                      >
                        {p.thumb}
                      </div>
                      <div style={{ padding: "6px 8px" }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color:
                              confirmApply === p.id ? "#10b981" : "#374151",
                          }}
                        >
                          {confirmApply === p.id ? "✓ Applied!" : p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "#94a3b8",
                            marginTop: 1,
                          }}
                        >
                          {p.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Carousel presets */}
            {presetsTab === "carousel" && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  Insert a carousel block with pre-configured slides and style.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {carouselCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCarouselCategory(cat)}
                      style={{
                        padding: "3px 8px",
                        border: "1px solid",
                        borderColor:
                          carouselCategory === cat ? "#2563eb" : "#e2e8f0",
                        borderRadius: 100,
                        fontSize: 10,
                        fontWeight: carouselCategory === cat ? 700 : 400,
                        background:
                          carouselCategory === cat ? "#eff6ff" : "#fff",
                        color: carouselCategory === cat ? "#2563eb" : "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {filteredCarousel.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => insertCarouselPreset(p)}
                      style={{
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        background: "#fff",
                        cursor: "pointer",
                        overflow: "hidden",
                        padding: 0,
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2563eb";
                        e.currentTarget.style.background = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.background = "#fff";
                      }}
                    >
                      <div style={{ padding: "10px 10px 6px" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>
                          {p.thumb}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#374151",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "#94a3b8",
                            marginTop: 1,
                          }}
                        >
                          {p.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Block presets */}
            {presetsTab === "block" && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}
                >
                  Insert a pre-styled block into your canvas.
                </div>
                {Object.entries(BLOCK_PRESETS).map(([type, presets]) => {
                  const def = BLOCK_TYPES.find((t) => t.type === type);
                  return (
                    <div key={type} style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        {def?.icon} {def?.label}
                      </div>
                      {presets.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => insertBlockPreset(type, p)}
                          style={{
                            width: "100%",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "8px 12px",
                            background: "#fff",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: 12,
                            color: "#374151",
                            marginBottom: 4,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#2563eb";
                            e.currentTarget.style.background = "#eff6ff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.background = "#fff";
                          }}
                        >
                          <span>{p.name}</span>
                          <span style={{ color: "#94a3b8", fontSize: 10 }}>
                            + Insert
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── RIGHT: Block Settings ── */}
      <div
        style={{
          flex: 1,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid #e2e8f0",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {selectedBlock ? (
            <>
              <span style={{ fontSize: 18 }}>
                {BLOCK_TYPES.find((t) => t.type === selectedBlock.type)?.icon}
              </span>
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}
                >
                  {
                    BLOCK_TYPES.find((t) => t.type === selectedBlock.type)
                      ?.label
                  }{" "}
                  Settings
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>
                  Block #{blocks.findIndex((b) => b.id === selectedId) + 1} ·{" "}
                  {selectedBlock.position === "absolute"
                    ? "⛓ Free positioned"
                    : "↕ Flow"}
                </div>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Select a block from the left to edit its settings
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {selectedBlock && (
            <BlockSettings
              block={selectedBlock}
              onChange={(updated) => updateBlock(updated)}
            />
          )}
          <div
            style={{
              borderTop: selectedBlock ? "1px solid #e2e8f0" : "none",
              padding: selectedBlock ? "14px 14px 0" : 0,
            }}
          >
            {selectedBlock && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Live Preview
              </div>
            )}
            <HeroSection
              config={{ ...c, canvasBlocks: blocks, _builderMode: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Animated BG options for Style tab ───────────────────────────────────────
const ANIMATED_BG_PRESETS = [
  { id: "particles", name: "Particles", thumb: "✨" },
  { id: "orbs", name: "Orbs", thumb: "🔵" },
  { id: "mesh", name: "Mesh", thumb: "🌈" },
  { id: "grid", name: "Grid", thumb: "▦" },
  { id: "stars", name: "Stars", thumb: "⭐" },
  { id: "waves", name: "Waves", thumb: "🌊" },
];
const FONTS = [
  "Inter",
  "Plus Jakarta Sans",
  "Poppins",
  "Montserrat",
  "Raleway",
  "Syne",
  "Outfit",
  "DM Sans",
  "Lato",
  "Nunito",
  "Playfair Display",
  "Merriweather",
];
const TABS = ["Canvas", "Style", "Advanced"];

// ─── Main HeroPanel ───────────────────────────────────────────────────────────
export default function HeroPanel({ config: c, onChange }) {
  const [tab, setTab] = useState("Canvas");
  const [canvasOpen, setCanvasOpen] = useState(false);
  const u = (k, v) => onChange({ [k]: v });
  const isBuilderMode = !!c._builderMode;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1.5px solid #e2e8f0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderBottom:
                tab === t ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              color: tab === t ? "#2563eb" : "#64748b",
              fontWeight: tab === t ? 700 : 500,
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 12px 24px", overflowY: "auto", flex: 1 }}>
        {/* ── CANVAS TAB ── */}
        {tab === "Canvas" && (
          <div style={{ marginTop: 14 }}>
            {/* Canvas Builder CTA */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                borderRadius: 12,
                padding: "18px 16px",
                marginBottom: 14,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  fontSize: 80,
                  opacity: 0.1,
                }}
              >
                🎨
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Canvas Builder
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                Build your hero block-by-block. Add headings, images, stats,
                carousels and more — all inside one editor with presets,
                drag-and-drop, and visibility controls.
              </div>
              <button
                onClick={() => setCanvasOpen(true)}
                style={{
                  padding: "9px 18px",
                  border: "none",
                  borderRadius: 8,
                  background: "#6366f1",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {isBuilderMode ? "✏️ Edit Canvas" : "✦ Open Canvas Builder"}
              </button>
              {isBuilderMode && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.5)",
                    textAlign: "center",
                  }}
                >
                  Canvas mode · {(c.canvasBlocks || []).length} block(s) ·{" "}
                  {
                    (c.canvasBlocks || []).filter((b) => b.visible !== false)
                      .length
                  }{" "}
                  visible
                </div>
              )}
            </div>

            {/* Block list summary */}
            {isBuilderMode && (c.canvasBlocks || []).length > 0 && (
              <>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Canvas Blocks
                </div>
                {(c.canvasBlocks || []).map((block) => {
                  const def = BLOCK_TYPES.find((t) => t.type === block.type);
                  const isHidden = block.visible === false;
                  return (
                    <div
                      key={block.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        marginBottom: 4,
                        borderRadius: 8,
                        border: "1px solid #f1f5f9",
                        background: "#fafafa",
                        fontSize: 12,
                        color: "#374151",
                        opacity: isHidden ? 0.5 : 1,
                      }}
                    >
                      <span>{def?.icon}</span>
                      <span style={{ flex: 1 }}>{def?.label}</span>
                      {isHidden && (
                        <span style={{ fontSize: 10, color: "#94a3b8" }}>
                          hidden
                        </span>
                      )}
                      <button
                        onClick={() => setCanvasOpen(true)}
                        style={{
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          borderRadius: 4,
                          padding: "2px 8px",
                          cursor: "pointer",
                          fontSize: 10,
                          color: "#2563eb",
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  );
                })}
                <button
                  onClick={() =>
                    onChange({ _builderMode: false, canvasBlocks: [] })
                  }
                  style={{
                    width: "100%",
                    marginTop: 8,
                    border: "1.5px dashed #fca5a5",
                    background: "transparent",
                    borderRadius: 8,
                    padding: 8,
                    color: "#ef4444",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  ✕ Clear canvas & reset
                </button>
              </>
            )}

            {!isBuilderMode && (
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  Start with a Preset
                </div>
                <div
                  style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}
                >
                  Open the Canvas Builder and choose from 15+ full hero presets,
                  22+ carousel styles, and individual block presets.
                </div>
                <button
                  onClick={() => setCanvasOpen(true)}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 8,
                    background: "#6366f1",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Open Canvas Builder →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STYLE TAB ── */}
        {tab === "Style" && (
          <>
            <SL>Background</SL>
            <BgControl config={c} onChange={onChange} />
            <D />
            <SL>Animated Background</SL>
            <ToggleControl
              label="Enable"
              value={!!c.animatedBg?.enabled}
              onChange={(v) => u("animatedBg", { ...c.animatedBg, enabled: v })}
            />
            {c.animatedBg?.enabled && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  {ANIMATED_BG_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        u("animatedBg", { ...c.animatedBg, preset: p.id })
                      }
                      style={{
                        padding: "8px 6px",
                        border:
                          (c.animatedBg?.preset || "particles") === p.id
                            ? "1.5px solid #2563eb"
                            : "1px solid #e2e8f0",
                        borderRadius: 8,
                        background:
                          (c.animatedBg?.preset || "particles") === p.id
                            ? "#eff6ff"
                            : "#fafafa",
                        cursor: "pointer",
                        fontSize: 11,
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>{p.thumb}</span> {p.name}
                    </button>
                  ))}
                </div>
                <ColorControl
                  label="Color"
                  value={c.animatedBg?.color || "#2563eb"}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, color: v })
                  }
                />
                <RangeControl
                  label="Speed"
                  value={c.animatedBg?.speed ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, speed: v })
                  }
                  unit="%"
                />
                <RangeControl
                  label="Density"
                  value={c.animatedBg?.density ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, density: v })
                  }
                  unit="%"
                />
                <RangeControl
                  label="Size"
                  value={c.animatedBg?.size ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, size: v })
                  }
                  unit="%"
                />
                <RangeControl
                  label="Glow"
                  value={c.animatedBg?.glow ?? 50}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    u("animatedBg", { ...c.animatedBg, glow: v })
                  }
                  unit="%"
                />
              </>
            )}
            <D />
            <SL>Typography</SL>
            <SelectControl
              label="Heading Font"
              value={c.headingFont || "Inter"}
              options={FONTS}
              onChange={(v) => u("headingFont", v)}
            />
            <SelectControl
              label="Body Font"
              value={c.bodyFont || "Inter"}
              options={FONTS}
              onChange={(v) => u("bodyFont", v)}
            />
            <D />
            <SL>Spacing</SL>
            <RangeControl
              label="Min Height"
              value={c.minHeight || 100}
              min={40}
              max={100}
              onChange={(v) => u("minHeight", v)}
              unit="vh"
            />
            <RangeControl
              label="Padding Y"
              value={c.paddingY || 120}
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
            <ToggleControl
              label="Scroll Indicator"
              value={!!c.scrollIndicator}
              onChange={(v) => u("scrollIndicator", v)}
            />
          </>
        )}

        {/* ── ADVANCED TAB ── */}
        {tab === "Advanced" && (
          <>
            <SL>Scroll Animation</SL>
            <AnimationControl
              value={c.animation}
              onChange={(v) => u("animation", v)}
            />
          </>
        )}
      </div>

      {/* Canvas Builder Modal */}
      {canvasOpen && (
        <CanvasBuilderModal
          config={c}
          onChange={onChange}
          onClose={() => setCanvasOpen(false)}
        />
      )}
    </div>
  );
}
