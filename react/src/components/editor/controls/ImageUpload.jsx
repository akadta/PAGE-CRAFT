import { useState } from "react";
import { uploadImage } from "../../../api/uploadApi";
import { resolveUrl } from "../../../utils/resolveUrl";

export default function ImageUpload({ label, value, onChange, height = 120 }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const id = `img-up-${Math.random().toString(36).slice(2)}`;

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setErr("");
    try {
      const data = await uploadImage(file);
      onChange(data.url);
    } catch {
      setErr("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      {label && (
        <div
          style={{
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 5,
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      )}
      <div
        onClick={() => !loading && document.getElementById(id).click()}
        style={{
          border: `2px dashed ${loading ? "#2563eb" : value ? "#a3bffa" : "#cbd5e1"}`,
          borderRadius: 10,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: loading ? "wait" : "pointer",
          background: value ? "#f8fafc" : "#fafafa",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.2s",
        }}
      >
        {loading ? (
          <span style={{ fontSize: 12, color: "#2563eb" }}>Uploading...</span>
        ) : value ? (
          <>
            <img
              src={resolveUrl(value)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                Change
              </span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🖼️</div>
            <div style={{ fontSize: 11 }}>Click to upload</div>
          </div>
        )}
      </div>
      <input
        id={id}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handle}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            width: "100%",
            marginTop: 5,
            border: "1px solid #fee2e2",
            background: "#fff",
            color: "#dc2626",
            borderRadius: 6,
            padding: "4px",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      )}
      {err && (
        <div style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>
          {err}
        </div>
      )}
    </div>
  );
}
