import { useState, useEffect, useRef, useMemo } from "react";
import { loadFont } from "../../../utils/fontLoader";

/* ─── helpers ─────────────────────────────────────────────── */
const getBg = (c) => {
  if (c.bgType === "gradient")
    return `linear-gradient(${c.bgGradient?.direction || "to bottom right"}, ${c.bgGradient?.from || "#667eea"}, ${c.bgGradient?.to || "#764ba2"})`;
  if (c.bgType === "image") return `url(${c.bgImage}) center/cover no-repeat`;
  return c.bg || "#f8fafc";
};

/* ─── CSS injection ────────────────────────────────────────── */
const CSS_ID = "__testi_anim_css__";
function injectCSS() {
  if (document.getElementById(CSS_ID)) return;
  const s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = `
    @keyframes _tScrollL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes _tScrollR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
    @keyframes _tFadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes _tZoom{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    @keyframes _tFlipY{from{opacity:0;transform:perspective(700px) rotateY(35deg)}to{opacity:1;transform:perspective(700px) rotateY(0)}}
    @keyframes _tSlide{from{opacity:0;transform:translateX(-36px)}to{opacity:1;transform:translateX(0)}}
    @keyframes _tFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes _tPulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.35)}70%{box-shadow:0 0 0 14px rgba(99,102,241,0)}}
    @keyframes _tShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes _tGradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes _tBgFade{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes _tMagnetHover{to{transform:scale(1.03) translateY(-4px)}}
    ._tCard{transition:transform .3s ease,box-shadow .3s ease;}
    ._tCard:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 20px 60px rgba(0,0,0,.15)!important;}
    ._tCard3d{transition:transform .4s ease;}
    ._tCardGlass{backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
   ._tCardNeon:hover{box-shadow:0 0 24px var(--neon),0 0 48px var(--neon)!important;}
    ._tCarouselTrack{transition:transform .5s cubic-bezier(.25,.46,.45,.94);}
    ._tCarouselSlideIn{animation:_tCarouselIn .5s cubic-bezier(.25,.46,.45,.94) both;}
    ._tCarouselSlideOut{animation:_tCarouselOut .5s cubic-bezier(.25,.46,.45,.94) both;}
    @keyframes _tCarouselIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
    @keyframes _tCarouselInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}}

    /* ── Responsive / adaptive layout ──────────────────────── */
    ._tSection{padding-left:clamp(16px,4vw,32px);padding-right:clamp(16px,4vw,32px);}
    ._tSection._tSectionFull{padding-left:0;padding-right:0;}
    ._tHeadingWrap{padding-left:0;padding-right:0;}
    ._tHeadingWrap._tHeadingWrapFull{padding-left:clamp(16px,4vw,32px);padding-right:clamp(16px,4vw,32px);}
    ._tHeading{font-size:clamp(26px, 5vw, var(--heading-size, 42px));}
    ._tSubheading{font-size:clamp(14px, 2.2vw, 17px);}

    ._tGrid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(var(--cols,3),1fr);gap:var(--card-gap,24px);grid-auto-rows:1fr;}
    @media (max-width:1024px){
      ._tGrid{grid-template-columns:repeat(var(--cols-tablet,2),1fr);}
      ._tMasonry{flex-direction:column;}
      ._tMasonryCol{width:100%;}
    }
    @media (max-width:640px){
      ._tGrid{grid-template-columns:repeat(var(--cols-mobile,1),1fr);}
    }

    ._tMasonry{list-style:none;margin:0;padding:0;display:flex;gap:var(--card-gap,24px);align-items:flex-start;}
    ._tMasonryCol{flex:1;display:flex;flex-direction:column;gap:var(--card-gap,24px);list-style:none;margin:0;padding:0;}

    ._tCarouselList{list-style:none;margin:0;padding:0;display:flex;gap:var(--card-gap,24px);justify-content:center;align-items:stretch;}
    ._tCarouselItem{flex:1;max-width:var(--card-width,600px);display:flex;}
    @media (max-width:768px){
      ._tCarouselList{flex-direction:column;}
      ._tCarouselItem{max-width:100%;}
      ._tCarouselItem._tHideOnTablet{display:none;}
    }
    @media (max-width:480px){
      ._tCarouselItem._tHideOnMobile{display:none;}
    }

    ._tStripCard{width:clamp(240px, 80vw, var(--card-width,320px));flex-shrink:0;display:flex;}

    @media (max-width:768px){
      ._tCardPad{padding:clamp(16px,4vw,28px)!important;}
      ._tAvatar{width:44px!important;height:44px!important;}
    }
  `;
  document.head.appendChild(s);
}

/* ─── Canvas Backgrounds ───────────────────────────────────── */
function ParticlesCanvas({ cfg }) {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const n = cfg.particleCount ?? 55,
      spd = cfg.animSpeed ?? 0.8;
    const col = cfg.particleColor || "rgba(99,102,241,0.6)";
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: n }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * spd,
      vy: (Math.random() - 0.5) * spd,
      r: 1.5 + Math.random() * 2,
    }));
    const dist = cfg.connectDist ?? 130;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }
      if (cfg.particleConnect !== false) {
        for (let i = 0; i < pts.length; i++)
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x,
              dy = pts[i].y - pts[j].y,
              d = Math.sqrt(dx * dx + dy * dy);
            if (d < dist) {
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = col;
              ctx.globalAlpha = (1 - d / dist) * 0.4;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
      }
      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [cfg]);
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

function WavesCanvas({ cfg }) {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const spd = cfg.animSpeed ?? 0.6,
      waves = cfg.waveCount ?? 3,
      col = cfg.waveColor || "rgba(99,102,241,0.1)";
    let t = 0;
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let w = 0; w < waves; w++) {
        const amp = 25 + w * 12,
          freq = 0.004 + w * 0.002,
          phase = t * spd + w * 2;
        ctx.beginPath();
        ctx.moveTo(0, c.height / 2);
        for (let x = 0; x <= c.width; x += 4) {
          const y =
            c.height / 2 +
            Math.sin(x * freq + phase) * amp +
            Math.cos(x * 0.003 + phase * 0.5) * amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(c.width, c.height);
        ctx.lineTo(0, c.height);
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.3 + w * 0.08;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 0.02;
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [cfg]);
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

function ShaderCanvas({ cfg }) {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    const spd = (cfg.animSpeed ?? 1).toFixed(2);
    const type = cfg.shaderType || "aurora";
    const vert = `attribute vec2 a; void main(){gl_Position=vec4(a,0,1);}`;
    const frags = {
      aurora: `precision mediump float;uniform float u_t;uniform vec2 u_r;
        void main(){vec2 uv=(gl_FragCoord.xy/u_r)*2.-1.;float t=u_t*${spd};
        float r=.5+.5*sin(uv.x*3.+t);float g=.3+.4*sin(uv.x*2.-t*.7+1.2);float b=.7+.3*sin(uv.y*4.+t*.5+2.4);
        float m=smoothstep(.9,0.,abs(uv.y+sin(uv.x*2.+t)*.3));
        gl_FragColor=vec4(r,g,b,1.)*m*.8+vec4(.04,.02,.1,1.)*(1.-m);}`,
      holographic: `precision mediump float;uniform float u_t;uniform vec2 u_r;
        void main(){vec2 uv=gl_FragCoord.xy/u_r;float t=u_t*${spd};
        float sh=sin(uv.y*3.+t)*.02;vec3 col;
        col.r=sin(uv.x*6.+sh+t)*.5+.5;col.g=sin(uv.x*6.+sh+t+2.09)*.5+.5;col.b=sin(uv.x*6.+sh+t+4.18)*.5+.5;
        col*=sin(uv.y*80.+t*4.)*.3+.7;gl_FragColor=vec4(col,1.);}`,
      plasma: `precision mediump float;uniform float u_t;uniform vec2 u_r;
        void main(){vec2 uv=(gl_FragCoord.xy/u_r)*4.-2.;float t=u_t*${spd};
        float v=sin(uv.x+t)+sin(uv.y+t*.7)+sin((uv.x+uv.y)+t*.5);
        float cx=uv.x+.5*sin(t*.3),cy=uv.y+.5*cos(t*.4);v+=sin(sqrt(cx*cx+cy*cy)+t);
        gl_FragColor=vec4(sin(v*3.14)*.5+.5,cos(v*3.14+1.57)*.5+.5,sin(v*3.14+3.14)*.5+.5,1.);}`,
      morphic: `precision mediump float;uniform float u_t;uniform vec2 u_r;
        void main(){vec2 uv=(gl_FragCoord.xy/u_r)*2.-1.;float t=u_t*${spd};
        float d=length(uv),a=atan(uv.y,uv.x);
        float m=sin(a*5.+t)*.3+sin(d*8.-t*2.)*.2;
        float mask=smoothstep(.6+m,.5+m,d);
        vec3 col=mix(vec3(.08,.04,.2),vec3(.4+sin(t)*.2,.15,.9),mask);
        gl_FragColor=vec4(col,1.);}`,
      bubbles: `precision mediump float;uniform float u_t;uniform vec2 u_r;
        void main(){vec2 uv=gl_FragCoord.xy/u_r;float t=u_t*${spd};
        float v=0.;for(int i=0;i<6;i++){float fi=float(i);
        vec2 c=vec2(.2+fi*.13+sin(t*.7+fi)*0.15,sin(t*.5+fi*1.3)*.3+.5);
        float d=length(uv-c);v+=.04/(d*d+.001);}
        v=clamp(v,0.,1.);vec3 col=mix(vec3(.06,.08,.2),vec3(.5,.2,1.),v);
        gl_FragColor=vec4(col,1.);}`,
    };
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(
      prog,
      compile(gl.FRAGMENT_SHADER, frags[type] || frags.aurora),
    );
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "u_t"),
      uR = gl.getUniformLocation(prog, "u_r");
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    let start = null;
    const draw = (ts) => {
      if (!start) start = ts;
      gl.uniform1f(uT, (ts - start) / 1000);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [cfg]);
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

function StarsCanvas({ cfg }) {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const spd = cfg.animSpeed ?? 0.8;
    let stars;
    const init = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
      stars = Array.from({ length: cfg.particleCount ?? 100 }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        z: Math.random() * c.width,
        pz: 0,
      }));
    };
    init();
    window.addEventListener("resize", init);
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,.2)";
      ctx.fillRect(0, 0, c.width, c.height);
      const cx = c.width / 2,
        cy = c.height / 2;
      for (const s of stars) {
        s.pz = s.z;
        s.z -= spd * 2.5;
        if (s.z <= 0) {
          s.x = Math.random() * c.width;
          s.y = Math.random() * c.height;
          s.z = c.width;
          s.pz = s.z;
        }
        const sx = (s.x - cx) * (c.width / s.z) + cx,
          sy = (s.y - cy) * (c.width / s.z) + cy;
        const px = (s.x - cx) * (c.width / s.pz) + cx,
          py = (s.y - cy) * (c.width / s.pz) + cy;
        ctx.strokeStyle = cfg.particleColor || "#fff";
        ctx.lineWidth = Math.max(0, (1 - s.z / c.width) * 2.5);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", init);
    };
  }, [cfg]);
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Star Rating ──────────────────────────────────────────── */
function Stars({ count = 5, color = "#f59e0b", size = 16 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{ color: i < count ? color : "#e2e8f0", fontSize: size }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─── Single Card ──────────────────────────────────────────── */
function TestiCard({ item, c, index = 0 }) {
  const cardRef = useRef(null);
  const layout = c.cardLayout || "standard";
  const cardBg = item.bg || c.cardBg || "#ffffff";
  const radius = c.cardBorderRadius ?? 16;
  const delay = `${index * 0.1}s`;

  const animMap = {
    fadeUp: `_tFadeUp .6s ${delay} both ease-out`,
    zoomIn: `_tZoom .5s ${delay} both`,
    flipY: `_tFlipY .6s ${delay} both`,
    slide: `_tSlide .5s ${delay} both`,
    none: "none",
  };
  const entryAnim = animMap[c.itemAnimation || "fadeUp"];

  /* 3D tilt on hover */
  const handle3D = (e) => {
    if (c.cardEffect !== "3d") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  };
  const reset3D = () => {
    if (cardRef.current && c.cardEffect === "3d")
      cardRef.current.style.transform = "";
  };

  const baseCardStyle = {
    borderRadius: radius,
    padding: c.cardPadding ?? 28,
    background: cardBg,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow:
      c.cardEffect === "neon"
        ? `0 0 0 1px ${c.neonColor || "#6366f1"}40, 0 4px 24px ${c.neonColor || "#6366f1"}30`
        : c.shadow !== false
          ? "0 4px 24px rgba(0,0,0,.08)"
          : "none",
    border: c.cardBorder
      ? `1px solid ${c.cardBorderColor || "rgba(99,102,241,0.2)"}`
      : "none",
    animation: entryAnim,
    flexShrink: 0,
    cursor: "default",
    "--neon": c.neonColor || "#6366f1",
  };

  if (c.cardEffect === "glass") {
    baseCardStyle.background = "rgba(255,255,255,0.08)";
    baseCardStyle.backdropFilter = "blur(14px)";
    baseCardStyle.border = "1px solid rgba(255,255,255,0.2)";
  }
  if (c.cardEffect === "dark") {
    baseCardStyle.background = "rgba(15,23,42,0.85)";
    baseCardStyle.color = "#e2e8f0";
  }

  const cls = [
    "_tCard",
    "_tCardPad",
    c.cardEffect === "3d" ? "_tCard3d" : "",
    c.cardEffect === "glass" ? "_tCardGlass" : "",
    c.cardEffect === "neon" ? "_tCardNeon" : "",
    c.floatCards ? "" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const avatar = item.avatar ? (
    <img
      className="_tAvatar"
      src={item.avatar}
      alt={item.name}
      style={{
        width: c.avatarSize || 56,
        height: c.avatarSize || 56,
        borderRadius: "50%",
        objectFit: "cover",
        border: `3px solid ${c.avatarBorderColor || "#e2e8f0"}`,
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      className="_tAvatar"
      style={{
        width: c.avatarSize || 56,
        height: c.avatarSize || 56,
        borderRadius:
          c.avatarShape === "square"
            ? "0px"
            : c.avatarShape === "rounded"
              ? "12px"
              : "50%",
        background: `linear-gradient(135deg,${c.avatarFallbackA || "#6366f1"},${c.avatarFallbackB || "#8b5cf6"})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: (c.avatarSize || 56) * 0.38,
        flexShrink: 0,
      }}
    >
      {(item.name || "?")[0].toUpperCase()}
    </div>
  );

  const nameBlock = (
    <div>
      <div
        style={{
          fontWeight: 700,
          fontSize: "clamp(13px, 2vw, 15px)",
          color:
            c.cardEffect === "dark" || c.cardEffect === "glass"
              ? "#f1f5f9"
              : c.nameColor || "#0f172a",
        }}
      >
        {item.name}
      </div>
      <div
        style={{
          fontSize: "clamp(11px, 1.8vw, 13px)",
          color:
            c.cardEffect === "dark" || c.cardEffect === "glass"
              ? "#94a3b8"
              : c.roleColor || "#64748b",
          marginTop: 2,
        }}
      >
        {item.role}
      </div>
    </div>
  );

  const quoteIcon = c.showQuoteIcon !== false && (
    <div
      style={{
        fontSize: "clamp(34px, 6vw, 48px)",
        lineHeight: 1,
        color: c.quoteColor || "#6366f1",
        opacity: 0.25,
        fontFamily: "Georgia,serif",
        marginBottom: 4,
        userSelect: "none",
      }}
    >
      "
    </div>
  );

  const bodyText = (
    <p
      style={{
        fontSize: `clamp(13px, 1.8vw, ${c.bodySize || 15}px)`,
        color:
          c.cardEffect === "dark" || c.cardEffect === "glass"
            ? "#cbd5e1"
            : c.bodyColor || "#374151",
        lineHeight: 1.7,
        margin: 0,
      }}
    >
      {item.body}
    </p>
  );

  const stars = c.showRating && (
    <Stars
      count={item.rating || 5}
      color={c.starColor || "#f59e0b"}
      size={c.starSize || 16}
    />
  );

  /* layout orientations */
  let inner;
  if (layout === "image-top") {
    inner = (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {avatar}
          <div style={{ textAlign: "center" }}>{nameBlock}</div>
          {stars && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {stars}
            </div>
          )}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginTop: 12,
            width: "100%",
          }}
        >
          {quoteIcon}
          {bodyText}
        </div>
      </>
    );
    baseCardStyle.display = "flex";
    baseCardStyle.flexDirection = "column";
    baseCardStyle.alignItems = "center";
    baseCardStyle.justifyContent = "flex-start";
    baseCardStyle.gap = 0;
  } else if (layout === "inline") {
    inner = (
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flexShrink: 0 }}>{avatar}</div>
        <div style={{ flex: 1, minWidth: 180 }}>
          {nameBlock}
          {stars && <div style={{ marginTop: 6 }}>{stars}</div>}
          {quoteIcon}
          {bodyText}
        </div>
      </div>
    );
  } else if (layout === "bottom-name") {
    inner = (
      <>
        {quoteIcon}
        {bodyText}
        {stars && <div style={{ marginTop: 12 }}>{stars}</div>}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          {avatar}
          {nameBlock}
        </div>
      </>
    );
  } else if (layout === "minimal") {
    inner = (
      <>
        {stars && <div style={{ marginBottom: 10 }}>{stars}</div>}
        {bodyText}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
          }}
        >
          {avatar}
          <div
            style={{
              fontSize: "clamp(12px, 1.8vw, 13px)",
              fontWeight: 600,
              color:
                c.cardEffect === "dark" || c.cardEffect === "glass"
                  ? "#f1f5f9"
                  : "#374151",
            }}
          >
            {item.name}
          </div>
        </div>
      </>
    );
  } else if (layout === "magazine") {
    baseCardStyle.display = "flex";
    baseCardStyle.flexDirection = "row";
    baseCardStyle.padding = 0;
    baseCardStyle.overflow = "hidden";
    baseCardStyle.flexWrap = "wrap";
    inner = (
      <>
        <div
          style={{
            width: 100,
            minWidth: 100,
            flexShrink: 0,
            background: `linear-gradient(180deg,${c.avatarFallbackA || "#6366f1"},${c.avatarFallbackB || "#8b5cf6"})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.avatar ? (
            <img
              className="_tAvatar"
              src={item.avatar}
              alt={item.name}
              style={{
                width: c.avatarSize || 56,
                height: c.avatarSize || 56,
                borderRadius:
                  c.avatarShape === "square"
                    ? "0px"
                    : c.avatarShape === "rounded"
                      ? "12px"
                      : "50%",
                objectFit: "cover",
                border: `3px solid ${c.avatarBorderColor || "#e2e8f0"}`,
                flexShrink: 0,
              }}
            />
          ) : (
            <div style={{ fontSize: 32, color: "#fff", fontWeight: 700 }}>
              {(item.name || "?")[0]}
            </div>
          )}
        </div>
        <div style={{ flex: "1 1 200px", padding: "24px 20px" }}>
          {quoteIcon}
          {bodyText}
          {stars && <div style={{ marginTop: 10 }}>{stars}</div>}
          <div style={{ marginTop: 12 }}>{nameBlock}</div>
        </div>
      </>
    );
  } else {
    // standard
    inner = (
      <>
        {quoteIcon}
        {bodyText}
        {stars && <div style={{ marginTop: 12 }}>{stars}</div>}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          {avatar}
          {nameBlock}
        </div>
      </>
    );
  }

  return (
    <div
      ref={cardRef}
      className={cls}
      style={baseCardStyle}
      onMouseMove={handle3D}
      onMouseLeave={reset3D}
    >
      {inner}
    </div>
  );
}

/* ─── Infinite Scroll Strip ────────────────────────────────── */
function InfiniteStrip({ items, c, dir = "left" }) {
  const spd = c.scrollSpeed ?? 30;
  const [paused, setPaused] = useState(false);
  const mode = c.infiniteMode || "auto-left";
  const isTouchMode = mode === "touch";

  /* ── touch/drag scroll ── */
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    if (!isTouchMode) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };
  const onMouseMove = (e) => {
    if (!isDragging.current || !isTouchMode) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const onMouseUp = () => {
    isDragging.current = false;
  };

  const doubled = [...items, ...items];
  const actualDir = mode === "auto-right" ? "right" : dir;
  const anim =
    actualDir === "right"
      ? `_tScrollR ${spd}s linear infinite`
      : `_tScrollL ${spd}s linear infinite`;

  const stripVars = {
    "--card-gap": `${c.cardGap ?? 20}px`,
    "--card-width": `${c.cardWidth || 320}px`,
  };

  if (isTouchMode) {
    return (
      <div
        ref={trackRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
          cursor: "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <style>{`.testi-track::-webkit-scrollbar{display:none}`}</style>
        <ul
          className="testi-track"
          style={{
            ...stripVars,
            display: "flex",
            gap: "var(--card-gap)",
            width: "max-content",
            alignItems: "stretch",
            padding: "8px 0",
            margin: 0,
            listStyle: "none",
          }}
        >
          {doubled.map((item, i) => (
            <li key={i} className="_tStripCard">
              <TestiCard
                item={item}
                c={{ ...c, itemAnimation: "none" }}
                index={0}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      style={{ overflow: "hidden", width: "100%", position: "relative" }}
      onMouseEnter={() => c.pauseOnHover !== false && setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "clamp(24px, 6vw, 80px)",
          background: `linear-gradient(to right,${c.bg || "#f8fafc"},transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "clamp(24px, 6vw, 80px)",
          background: `linear-gradient(to left,${c.bg || "#f8fafc"},transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <ul
        style={{
          ...stripVars,
          display: "flex",
          gap: "var(--card-gap)",
          animation: anim,
          animationPlayState: paused ? "paused" : "running",
          width: "max-content",
          alignItems: "stretch",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {doubled.map((item, i) => (
          <li key={i} className="_tStripCard">
            <TestiCard
              item={item}
              c={{ ...c, itemAnimation: "none" }}
              index={0}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Carousel ─────────────────────────────────────────────── */
function Carousel({ items, c }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState("right");
  const [animKey, setAnimKey] = useState(0);
  const total = items.length;

  const go = (newIdx, direction) => {
    setDir(direction);
    setAnimKey((k) => k + 1);
    setIdx(newIdx);
  };

  const prev = () => go((idx - 1 + total) % total, "left");
  const next = () => go((idx + 1) % total, "right");

  useEffect(() => {
    if (!c.autoplay) return;
    const t = setInterval(next, c.autoplayDelay || 5000);
    return () => clearInterval(t);
  }, [c.autoplay, c.autoplayDelay, idx]);

  const visible = Math.min(c.carouselShow ?? 1, total);
  const visItems = Array.from(
    { length: visible },
    (_, i) => items[(idx + i) % total],
  );

  const slideAnim =
    dir === "right"
      ? `_tCarouselIn .5s cubic-bezier(.25,.46,.45,.94) both`
      : `_tCarouselInR .5s cubic-bezier(.25,.46,.45,.94) both`;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <ul
        className="_tCarouselList"
        style={{
          "--card-gap": `${c.cardGap ?? 24}px`,
        }}
      >
        {visItems.map((item, i) => (
          <li
            key={`${animKey}-${i}`}
            className={[
              "_tCarouselItem",
              i >= 2 ? "_tHideOnTablet" : "",
              i >= 1 ? "_tHideOnMobile" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              "--card-width": `${c.cardWidth || 600}px`,
              animation: slideAnim,
            }}
          >
            <TestiCard
              item={item}
              c={{ ...c, itemAnimation: "none" }}
              index={i}
            />
          </li>
        ))}
      </ul>
      {total > visible && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={prev}
            style={{
              width: "clamp(34px, 6vw, 40px)",
              height: "clamp(34px, 6vw, 40px)",
              borderRadius: "50%",
              border: `1.5px solid ${c.arrowColor || "#6366f1"}`,
              background: "transparent",
              cursor: "pointer",
              color: c.arrowColor || "#6366f1",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {c.arrowLeft || "‹"}
          </button>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                onClick={() => go(i, i > idx ? "right" : "left")}
                style={{
                  width: i === idx ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === idx ? c.arrowColor || "#6366f1" : "#cbd5e1",
                  cursor: "pointer",
                  transition: "all .3s",
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            style={{
              width: "clamp(34px, 6vw, 40px)",
              height: "clamp(34px, 6vw, 40px)",
              borderRadius: "50%",
              border: `1.5px solid ${c.arrowColor || "#6366f1"}`,
              background: "transparent",
              cursor: "pointer",
              color: c.arrowColor || "#6366f1",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {c.arrowRight || "›"}
          </button>
        </div>
      )}
    </div>
  );
}
/* ─── Grid / Masonry ───────────────────────────────────────── */
function GridLayout({ items, c }) {
  const cols = c.columns || 3;
  const colsTablet = Math.min(cols, 2);
  return (
    <ul
      className="_tGrid"
      style={{
        "--cols": cols,
        "--cols-tablet": colsTablet,
        "--cols-mobile": 1,
        "--card-gap": `${c.cardGap ?? 24}px`,
      }}
    >
      {items.map((item, i) => (
        <li key={item.id} style={{ display: "flex" }}>
          <TestiCard item={item} c={c} index={i} />
        </li>
      ))}
    </ul>
  );
}

function MasonryLayout({ items, c }) {
  const cols = c.columns || 3;
  const columns = Array.from({ length: cols }, (_, ci) =>
    items.filter((_, i) => i % cols === ci),
  );
  return (
    <ul
      className="_tMasonry"
      style={{
        "--card-gap": `${c.cardGap ?? 24}px`,
      }}
    >
      {columns.map((col, ci) => (
        <ul
          key={ci}
          className="_tMasonryCol"
          style={{ "--card-gap": `${c.cardGap ?? 24}px` }}
        >
          {col.map((item, i) => (
            <li key={item.id}>
              <TestiCard item={item} c={c} index={ci * 10 + i} />
            </li>
          ))}
        </ul>
      ))}
    </ul>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function TestimonialsSection({ config: c, navId }) {
  loadFont(c.headingFont);
  injectCSS();
  const items = c.items || [];
  const bgAnim = c.bgAnimation || "none";
  const isFullWidth = c.variant === "infinite";

  let sectionStyle = {
    position: "relative",
    overflow: "hidden",
    background: getBg(c),
    paddingTop: c.paddingY || 80,
    paddingBottom: c.paddingY || 80,
  };

  if (bgAnim === "gradientShift") {
    sectionStyle.background = `linear-gradient(270deg,${c.bgGradient?.from || "#667eea"},${c.bgGradient?.to || "#764ba2"},${c.bgGradient?.mid || "#f093fb"})`;
    sectionStyle.backgroundSize = "400% 400%";
    sectionStyle.animation = `_tGradShift ${(4 / (c.animSpeed || 1)).toFixed(1)}s ease infinite`;
  }

  return (
    <section
      id={navId}
      className={["_tSection", isFullWidth ? "_tSectionFull" : ""]
        .filter(Boolean)
        .join(" ")}
      style={sectionStyle}
    >
      {bgAnim === "particles" && <ParticlesCanvas cfg={c} />}
      {bgAnim === "waves" && <WavesCanvas cfg={c} />}
      {bgAnim === "stars" && <StarsCanvas cfg={c} />}
      {["aurora", "holographic", "plasma", "morphic", "bubbles"].includes(
        bgAnim,
      ) && <ShaderCanvas cfg={{ ...c, shaderType: bgAnim }} />}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: isFullWidth ? "none" : 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        {(c.badge?.show || c.heading || c.subheading) && (
          <div
            className={["_tHeadingWrap", isFullWidth ? "_tHeadingWrapFull" : ""]
              .filter(Boolean)
              .join(" ")}
            style={{
              textAlign: c.headingAlign || "center",
              marginBottom: isFullWidth ? 40 : 56,
            }}
          >
            {c.badge?.show && (
              <span
                style={{
                  display: "inline-block",
                  background: c.badge.bg || "#ede9fe",
                  color: c.badge.color || "#6d28d9",
                  borderRadius: 99,
                  padding: "4px 16px",
                  fontSize: "clamp(11px, 1.8vw, 12px)",
                  fontWeight: 600,
                  marginBottom: 14,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                {c.badge.text || "Testimonials"}
              </span>
            )}
            {c.heading && (
              <h2
                className="_tHeading"
                style={{
                  "--heading-size": `${c.headingSize || 42}px`,
                  fontWeight: 800,
                  color: c.headingColor || "#0f172a",
                  margin: "0 0 12px",
                  lineHeight: 1.2,
                }}
              >
                {c.heading}
              </h2>
            )}
            {c.subheading && (
              <p
                className="_tSubheading"
                style={{
                  color: c.subheadingColor || "#64748b",
                  margin: 0,
                  maxWidth: 560,
                  marginLeft: c.headingAlign === "center" ? "auto" : 0,
                  marginRight: c.headingAlign === "center" ? "auto" : 0,
                }}
              >
                {c.subheading}
              </p>
            )}
          </div>
        )}

        {/* Layouts */}
        {c.variant === "grid" && <GridLayout items={items} c={c} />}
        {c.variant === "masonry" && <MasonryLayout items={items} c={c} />}
        {(c.variant === "carousel" || c.variant === "single" || !c.variant) && (
          <Carousel items={items} c={c} />
        )}
        {c.variant === "infinite" && (
          <InfiniteStrip items={items} c={c} dir="left" />
        )}
        {c.variant === "infinite-dual" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <InfiniteStrip items={items} c={c} dir="left" />
            <InfiniteStrip items={[...items].reverse()} c={c} dir="right" />
          </div>
        )}
        {c.variant === "infinite-triple" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <InfiniteStrip items={items} c={c} dir="left" />
            <InfiniteStrip items={[...items].reverse()} c={c} dir="right" />
            <InfiniteStrip items={items} c={c} dir="left" />
          </div>
        )}
      </div>
    </section>
  );
}
