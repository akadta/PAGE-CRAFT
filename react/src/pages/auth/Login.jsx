import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../api/Axios";
import { useNavigate } from "react-router-dom";

const IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&fit=crop",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600&fit=crop",
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=600&fit=crop",
];
const G = 3,
  TOTAL = G * G;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function JigsawPuzzle() {
  const [img, setImg] = useState(null);
  const [order, setOrder] = useState([]);
  const [dragging, setDragging] = useState(null);
  const refs = useRef([]);
  const P = 82;

  function loadImg() {
    const src = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src + "&t=" + Date.now();
    image.onload = () => {
      setImg(image);
      setOrder(shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
    };
    image.onerror = () => {
      const fb = new window.Image();
      fb.crossOrigin = "anonymous";
      fb.src = `https://picsum.photos/seed/${Math.floor(Math.random() * 999)}/600/600`;
      fb.onload = () => {
        setImg(fb);
        setOrder(shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
      };
    };
  }

  useEffect(() => {
    loadImg();
  }, []);

  useEffect(() => {
    if (!img) return;
    refs.current.forEach((c, i) => {
      if (!c) return;
      const ctx = c.getContext("2d");
      const px = order[i];
      ctx.clearRect(0, 0, P, P);
      ctx.drawImage(
        img,
        (px % G) * (img.width / G),
        Math.floor(px / G) * (img.height / G),
        img.width / G,
        img.height / G,
        0,
        0,
        P,
        P,
      );
    });
  }, [img, order]);

  function swap(a, b) {
    setOrder((prev) => {
      const n = [...prev];
      [n[a], n[b]] = [n[b], n[a]];
      return n;
    });
  }

  const solved = order.every((v, i) => v === i);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span
          style={{
            fontSize: 10,
            color: solved ? "#86efac" : "rgba(255,255,255,0.45)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {solved ? "✓ Solved!" : "Rearrange tiles"}
        </span>
        <button
          onClick={loadImg}
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 6,
            padding: "3px 10px",
            fontSize: 11,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          New
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${G},${P}px)`,
          gridTemplateRows: `repeat(${G},${P}px)`,
          gap: 2,
          borderRadius: 10,
          overflow: "hidden",
          border: "1.5px solid rgba(255,255,255,0.18)",
        }}
      >
        {Array.from({ length: TOTAL }, (_, i) => (
          <canvas
            key={i}
            ref={(el) => (refs.current[i] = el)}
            width={P}
            height={P}
            draggable
            onDragStart={() => setDragging(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragging !== null && dragging !== i) swap(dragging, i);
              setDragging(null);
            }}
            style={{
              cursor: "grab",
              opacity: dragging === i ? 0.35 : 1,
              transition: "opacity 0.15s",
              display: "block",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── CAPTCHA ──────────────────────────────────────────────────────────────────
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function Captcha({ onVerify }) {
  const canvasRef = useRef(null);
  const [code, setCode] = useState(() => generateCode());
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");

  const draw = useCallback((text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width,
      H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * W,
        Math.random() * H,
        Math.random() * 1.4,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 160)},${Math.floor(Math.random() * 160)},${Math.floor(Math.random() * 210)},0.2)`;
      ctx.fill();
    }
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.bezierCurveTo(
        Math.random() * W,
        Math.random() * H,
        Math.random() * W,
        Math.random() * H,
        Math.random() * W,
        Math.random() * H,
      );
      ctx.strokeStyle = `rgba(100,130,200,0.25)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    const palette = [
      "#1e40af",
      "#2563eb",
      "#7c3aed",
      "#0369a1",
      "#0f766e",
      "#1d4ed8",
    ];
    text.split("").forEach((ch, i) => {
      ctx.save();
      ctx.translate(14 + i * 26, H / 2 + 7);
      ctx.rotate((Math.random() - 0.5) * 0.45);
      ctx.font = `${500 + Math.floor(Math.random() * 200)} ${18 + Math.floor(Math.random() * 4)}px 'Inter',monospace`;
      ctx.fillStyle = palette[i % palette.length];
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, []);

  useEffect(() => {
    draw(code);
  }, [code, draw]);

  function refresh() {
    const next = generateCode();
    setCode(next);
    setInput("");
    setStatus("idle");
    onVerify(false);
  }

  function handleInput(val) {
    const v = val.toUpperCase();
    setInput(v);
    if (v === code) {
      setStatus("success");
      onVerify(true);
    } else {
      setStatus("idle");
      onVerify(false);
    }
  }

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: "#374151",
          marginBottom: 5,
        }}
      >
        Verification
      </label>
      <div
        style={{
          display: "flex",
          gap: 7,
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <canvas
          ref={canvasRef}
          width={190}
          height={46}
          style={{
            borderRadius: 8,
            border: `1.5px solid ${status === "error" ? "#fca5a5" : "#e2e8f0"}`,
            display: "block",
            flexShrink: 0,
          }}
        />
        <button
          type="button"
          onClick={refresh}
          style={{
            background: "none",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            width: 38,
            height: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#94a3b8",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#2563eb";
            e.currentTarget.style.color = "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>
      <div style={{ position: "relative" }}>
        <input
          className="fi"
          type="text"
          maxLength={6}
          placeholder="Enter code"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={() => {
            if (input && input.toUpperCase() !== code) setStatus("error");
          }}
          style={{
            letterSpacing: 4,
            fontWeight: 600,
            paddingRight: 36,
            borderColor:
              status === "success"
                ? "#86efac"
                : status === "error"
                  ? "#fca5a5"
                  : undefined,
          }}
        />
        {status === "success" && (
          <svg
            style={{
              position: "absolute",
              right: 11,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {status === "error" && (
          <svg
            style={{
              position: "absolute",
              right: 11,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      {status === "error" && (
        <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>
          Incorrect — try again or refresh
        </p>
      )}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  function showToast(msg, type = "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in both fields");
      return;
    }
    if (!captchaOk) {
      showToast("Complete the verification first");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{height:100%;overflow:hidden;}
        body{font-family:'Inter',sans-serif;background:#f1f5f9;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes d1{0%,100%{transform:translate(0,0);}50%{transform:translate(28px,-18px);}}
        @keyframes d2{0%,100%{transform:translate(0,0);}50%{transform:translate(-18px,22px);}}
        @keyframes d3{0%,100%{transform:translate(0,0);}50%{transform:translate(12px,12px);}}
        .fi{
          width:100%;padding:9px 12px;
          border:1.5px solid #e2e8f0;border-radius:8px;
          font-size:13px;font-family:'Inter',sans-serif;
          color:#0f172a;outline:none;transition:border-color 0.18s;background:#fff;
        }
        .fi::placeholder{color:#94a3b8;}
        .fi:focus{border-color:#2563eb;}
        .sb{
          width:100%;padding:11px;background:#2563eb;color:#fff;border:none;
          border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;
          font-family:'Inter',sans-serif;transition:background 0.18s,transform 0.12s;
        }
        .sb:hover:not(:disabled){background:#1d4ed8;}
        .sb:active:not(:disabled){transform:scale(0.98);}
        .sb:disabled{opacity:0.52;cursor:not-allowed;}
        @media(max-width:720px){
          .lp{display:none!important;}
          .rp{width:100%!important;}
          .cw{border-radius:0!important;height:100%!important;}
        }
      `}</style>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          position: "relative",
        }}
      >
        {/* bg grid */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.035,
            pointerEvents: "none",
          }}
        >
          <defs>
            <pattern
              id="g"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 36 0 L 0 0 0 36"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>

        {/* blobs */}
        <div
          style={{
            position: "absolute",
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: "#dbeafe",
            top: -110,
            left: -90,
            animation: "d1 10s ease-in-out infinite",
            filter: "blur(55px)",
            opacity: 0.65,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "#bfdbfe",
            bottom: -70,
            right: -50,
            animation: "d2 13s ease-in-out infinite",
            filter: "blur(45px)",
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "#eff6ff",
            top: "45%",
            left: "52%",
            animation: "d3 8s ease-in-out infinite",
            filter: "blur(35px)",
            opacity: 0.75,
            pointerEvents: "none",
          }}
        />

        {/* toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              background: toast.type === "success" ? "#166534" : "#991b1b",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 7,
              animation: "toastIn 0.22s ease",
              maxWidth: "88vw",
              boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
            }}
          >
            {toast.type === "success" ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            {toast.msg}
          </div>
        )}

        {/* card */}
        <div
          className="cw"
          style={{
            display: "flex",
            width: "min(920px,95vw)",
            height: "min(560px,94vh)",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.11),0 1px 2px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            background: "#fff",
            animation: "fadeUp 0.45s ease",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* LEFT */}
          <div
            className="lp"
            style={{
              flex: 1,
              background:
                "linear-gradient(150deg,#1e40af 0%,#2563eb 55%,#3b82f6 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0.06,
                pointerEvents: "none",
              }}
              viewBox="0 0 400 560"
            >
              <circle
                cx="340"
                cy="70"
                r="110"
                fill="none"
                stroke="#fff"
                strokeWidth="1.2"
              />
              <circle
                cx="40"
                cy="480"
                r="150"
                fill="none"
                stroke="#fff"
                strokeWidth="0.8"
              />
              <circle
                cx="200"
                cy="280"
                r="55"
                fill="none"
                stroke="#fff"
                strokeWidth="0.8"
              />
            </svg>
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Daily Puzzle
              </p>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>
                Can you solve it?
              </h2>
            </div>
            <JigsawPuzzle />
          </div>

          {/* RIGHT */}
          <div
            className="rp"
            style={{
              width: 380,
              padding: "32px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "#fff",
              flexShrink: 0,
            }}
          >
            {/* logo */}
            <div style={{ marginBottom: 22 }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 36 36"
                fill="none"
                style={{ marginBottom: 14 }}
              >
                <rect width="36" height="36" rx="9" fill="#2563eb" />
                <path
                  d="M10 18C10 13.58 13.58 10 18 10C22.42 10 26 13.58 26 18"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="18" cy="22" r="4" fill="#fff" />
                <path
                  d="M18 18V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                Welcome back
              </h1>
              <p style={{ fontSize: 13, color: "#64748b" }}>
                Sign in to your admin account
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: 11 }}
            >
              {/* email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 5,
                  }}
                >
                  Email
                </label>
                <input
                  className="fi"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 5,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="fi"
                    type={showPw ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: "absolute",
                      right: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                  >
                    {showPw ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* captcha */}
              <Captcha onVerify={setCaptchaOk} />

              {/* forgot + submit row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: -2,
                }}
              >
                <a
                  href="/forgot-password"
                  style={{
                    fontSize: 12,
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                className="sb"
                type="submit"
                disabled={loading || !captchaOk}
              >
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    >
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Secured with enterprise-grade encryption
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
