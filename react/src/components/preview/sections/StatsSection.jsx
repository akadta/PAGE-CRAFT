import { useCountUp } from "../../../hooks/useCountUp";
import { loadFont } from "../../../utils/fontLoader";
import { useEffect, useRef, useMemo } from "react";

/* ─── helpers ─────────────────────────────────────────────── */
const getBg = (c) => {
  if (c.bgType === "gradient")
    return `linear-gradient(${c.bgGradient?.direction || "to right"}, ${c.bgGradient?.from || "#2563eb"}, ${c.bgGradient?.to || "#7c3aed"})`;
  if (c.bgType === "mesh") return c.bg || "#1e1b4b";
  if (c.bgType === "image") return `url(${c.bgImage}) center/cover no-repeat`;
  return c.bg || "#2563eb";
};

/* ─── Animated Canvas Backgrounds ─────────────────────────── */
function ParticlesCanvas({ cfg }) {
  const canvasRef = useRef(null);
  const anim = useRef(null);
  const particles = useMemo(() => [], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const count = cfg.particleCount ?? 60;
    const speed = cfg.animSpeed ?? 1;
    const color = cfg.particleColor || "#ffffff";
    const size = cfg.particleSize ?? 2;
    const connected = cfg.particleConnect !== false;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: size * (0.5 + Math.random()),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }
      if (connected) {
        const dist = cfg.connectDist ?? 120;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < dist) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = color;
              ctx.globalAlpha = (1 - d / dist) * 0.4;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(anim.current);
      window.removeEventListener("resize", resize);
    };
  }, [cfg, particles]);

  return (
    <canvas
      ref={canvasRef}
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
  const canvasRef = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const speed = cfg.animSpeed ?? 1;
    const color = cfg.waveColor || "rgba(255,255,255,0.15)";
    const waves = cfg.waveCount ?? 3;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let w = 0; w < waves; w++) {
        const amp = 30 + w * 15;
        const freq = 0.005 + w * 0.002;
        const phase = t * speed + w * 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            canvas.height / 2 +
            Math.sin(x * freq + phase) * amp +
            Math.cos(x * 0.003 + phase * 0.5) * amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3 + w * 0.1;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 0.02;
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(anim.current);
      window.removeEventListener("resize", resize);
    };
  }, [cfg]);

  return (
    <canvas
      ref={canvasRef}
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
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    glRef.current = gl;

    const type = cfg.shaderType || "aurora";
    const speed = cfg.animSpeed ?? 1;

    const vert = `
      attribute vec2 a_pos;
      void main(){gl_Position=vec4(a_pos,0,1);}
    `;

    const auroraSrc = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      void main(){
        vec2 uv=(gl_FragCoord.xy/u_res)*2.-1.;
        float t=u_time*${speed.toFixed(2)};
        float r=.5+.5*sin(uv.x*3.+t);
        float g=.4+.4*sin(uv.x*2.-t*.7+1.2);
        float b=.7+.3*sin(uv.y*4.+t*.5+2.4);
        float mask=smoothstep(.8,0.,abs(uv.y+sin(uv.x*2.+t)*.3));
        gl_FragColor=vec4(r,g,b,1.)*mask*0.8+vec4(0.05,0.02,0.1,1.)*(1.-mask);
      }
    `;

    const holographicSrc = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res;
        float t=u_time*${speed.toFixed(2)};
        float lines=sin(uv.y*80.+t*4.)*.5+.5;
        float shift=sin(uv.y*3.+t)*.02;
        vec3 col;
        col.r=sin(uv.x*6.+shift+t)*.5+.5;
        col.g=sin(uv.x*6.+shift+t+2.09)*.5+.5;
        col.b=sin(uv.x*6.+shift+t+4.18)*.5+.5;
        col*=lines*.6+.4;
        float scan=sin(uv.y*400.)*.03;
        gl_FragColor=vec4(col+scan,1.);
      }
    `;

    const plasmaSrc = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      void main(){
        vec2 uv=(gl_FragCoord.xy/u_res)*4.-2.;
        float t=u_time*${speed.toFixed(2)};
        float v=sin(uv.x+t);
        v+=sin(uv.y+t*.7);
        v+=sin((uv.x+uv.y)+t*.5);
        float cx=uv.x+.5*sin(t*.3);
        float cy=uv.y+.5*cos(t*.4);
        v+=sin(sqrt(cx*cx+cy*cy)+t);
        float r=sin(v*3.14159);
        float g=cos(v*3.14159+1.57);
        float b=sin(v*3.14159+3.14);
        gl_FragColor=vec4(r*.5+.5,g*.5+.5,b*.5+.5,1.);
      }
    `;

    const morphicSrc = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      void main(){
        vec2 uv=(gl_FragCoord.xy/u_res)*2.-1.;
        float t=u_time*${speed.toFixed(2)};
        float d=length(uv);
        float angle=atan(uv.y,uv.x);
        float morph=sin(angle*5.+t)*0.3+sin(d*8.-t*2.)*0.2;
        float mask=smoothstep(.6+morph,.5+morph,d);
        vec3 col=mix(
          vec3(.1,.05,.3),
          vec3(.4+sin(t)*.2,.2,1.),
          mask
        );
        col+=vec3(.05)*sin(d*20.-t*3.)*mask;
        gl_FragColor=vec4(col,1.);
      }
    `;

    const shaderMap = {
      aurora: auroraSrc,
      holographic: holographicSrc,
      plasma: plasmaSrc,
      morphic: morphicSrc,
    };
    const fragSrc = shaderMap[type] || auroraSrc;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");

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
      gl.uniform1f(uTime, (ts - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      anim.current = requestAnimationFrame(draw);
    };
    anim.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(anim.current);
      window.removeEventListener("resize", resize);
    };
  }, [cfg]);

  return (
    <canvas
      ref={canvasRef}
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

function MatrixCanvas({ cfg }) {
  const canvasRef = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const speed = cfg.animSpeed ?? 1;
    const color = cfg.matrixColor || "#00ff41";
    const fontSize = 14;
    let cols, drops;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    const draw = (ts) => {
      if (ts - last < 50 / speed) {
        anim.current = requestAnimationFrame(draw);
        return;
      }
      last = ts;
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30a0 + Math.random() * 96);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
      anim.current = requestAnimationFrame(draw);
    };
    anim.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(anim.current);
      window.removeEventListener("resize", resize);
    };
  }, [cfg]);

  return (
    <canvas
      ref={canvasRef}
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
  const canvasRef = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const count = cfg.particleCount ?? 120;
    const speed = cfg.animSpeed ?? 0.5;
    let stars = [];

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        pz: 0,
      }));
    };
    init();
    window.addEventListener("resize", init);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2,
        cy = canvas.height / 2;
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed * 3;
        if (s.z <= 0) {
          s.x = Math.random() * canvas.width;
          s.y = Math.random() * canvas.height;
          s.z = canvas.width;
          s.pz = s.z;
        }
        const sx = (s.x - cx) * (canvas.width / s.z) + cx;
        const sy = (s.y - cy) * (canvas.width / s.z) + cy;
        const px = (s.x - cx) * (canvas.width / s.pz) + cx;
        const py = (s.y - cy) * (canvas.width / s.pz) + cy;
        const size = Math.max(0, (1 - s.z / canvas.width) * 3);
        ctx.strokeStyle = cfg.particleColor || "#ffffff";
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(anim.current);
      window.removeEventListener("resize", init);
    };
  }, [cfg]);

  return (
    <canvas
      ref={canvasRef}
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

/* ─── CSS Keyframe animations injected once ─────────────────── */
const CSS_ID = "__stats_anim_css__";
function injectCSS() {
  if (document.getElementById(CSS_ID)) return;
  const style = document.createElement("style");
  style.id = CSS_ID;
  style.textContent = `
    @keyframes _fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes _fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes _zoomIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
    @keyframes _slideLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes _flipX{from{opacity:0;transform:perspective(600px) rotateX(40deg)}to{opacity:1;transform:perspective(600px) rotateX(0)}}
    @keyframes _flipY{from{opacity:0;transform:perspective(600px) rotateY(40deg)}to{opacity:1;transform:perspective(600px) rotateY(0)}}
    @keyframes _swing{from{opacity:0;transform:perspective(600px) rotateY(-60deg)}to{opacity:1;transform:perspective(600px) rotateY(0)}}
    @keyframes _pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes _float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes _glow{0%,100%{text-shadow:0 0 8px currentColor}50%{text-shadow:0 0 24px currentColor,0 0 48px currentColor}}
    @keyframes _shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes _rotateBg{from{background-position:0% 50%}to{background-position:100% 50%}}
    @keyframes _bgFade{0%,100%{opacity:.9}50%{opacity:.4}}
    @keyframes _gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes _3dTilt{0%,100%{transform:perspective(800px) rotateX(0) rotateY(0)}25%{transform:perspective(800px) rotateX(3deg) rotateY(3deg)}75%{transform:perspective(800px) rotateX(-3deg) rotateY(-3deg)}}
    @keyframes _ripple{0%{box-shadow:0 0 0 0 rgba(255,255,255,.4)}100%{box-shadow:0 0 0 40px rgba(255,255,255,0)}}
    @keyframes _typewriter{from{width:0}to{width:100%}}
    @keyframes _neonFlicker{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:.4}}
  `;
  document.head.appendChild(style);
}

/* ─── StatItem ─────────────────────────────────────────────── */
function StatItem({ item, c, index }) {
  const { ref, display } = useCountUp(item.value, c.countUp !== false);
  const delay = `${index * 0.15}s`;
  const dur = `${0.5 + (c.animSpeed || 1) * 0.3}s`;

  const animMap = {
    fadeUp: `_fadeUp ${dur} ${delay} both ease-out`,
    zoomIn: `_zoomIn ${dur} ${delay} both`,
    flipX: `_flipX ${dur} ${delay} both`,
    flipY: `_flipY ${dur} ${delay} both`,
    swing: `_swing ${dur} ${delay} both`,
    slideLeft: `_slideLeft ${dur} ${delay} both`,
    none: "none",
  };
  const entryAnim = animMap[c.itemAnimation] || animMap.fadeUp;

  const valueStyle = {
    fontSize: c.valueFontSize || 48,
    fontWeight: 800,
    color: c.valueColor || "#fff",
    lineHeight: 1,
    marginBottom: 6,
    animation:
      c.valueEffect === "glow"
        ? `_glow 2s infinite`
        : c.valueEffect === "pulse"
          ? `_pulse 2s infinite`
          : "none",
  };
  if (c.valueEffect === "shimmer") {
    valueStyle.background = `linear-gradient(90deg,${c.valueColor || "#fff"} 25%,rgba(255,255,255,0.1) 50%,${c.valueColor || "#fff"} 75%)`;
    valueStyle.backgroundSize = "200% auto";
    valueStyle.WebkitBackgroundClip = "text";
    valueStyle.WebkitTextFillColor = "transparent";
    valueStyle.animation = `_shimmer 2s linear infinite`;
  }
  if (c.valueEffect === "neon") {
    valueStyle.animation = `_neonFlicker 3s infinite`;
    valueStyle.color = c.valueColor || "#0ff";
    valueStyle.textShadow = `0 0 10px ${c.valueColor || "#0ff"},0 0 20px ${c.valueColor || "#0ff"},0 0 40px ${c.valueColor || "#0ff"}`;
  }

  const cardStyle =
    c.cardStyle === "glass"
      ? {
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 16,
          padding: "24px 20px",
          animation: `${entryAnim}${c.float ? `,_float ${2 + index * 0.3}s ease-in-out ${index * 0.3}s infinite` : ""}`,
        }
      : c.cardStyle === "bordered"
        ? {
            border: `2px solid ${c.valueColor || "#fff"}`,
            borderRadius: 12,
            padding: "20px 16px",
            animation: entryAnim,
          }
        : c.cardStyle === "elevated"
          ? {
              background: "rgba(0,0,0,0.25)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              borderRadius: 16,
              padding: "24px 20px",
              animation: entryAnim,
            }
          : c.cardStyle === "none"
            ? {
                animation: entryAnim,
              }
            : { animation: entryAnim };

  return (
    <div
      ref={ref}
      style={{ textAlign: "center", flex: 1, minWidth: 140, ...cardStyle }}
    >
      {c.iconShow && item.icon && (
        <div
          style={{
            fontSize: 32,
            marginBottom: 8,
            animation: c.float ? `_float 2.5s ease-in-out infinite` : "none",
          }}
        >
          {item.icon}
        </div>
      )}
      <div style={valueStyle}>{display}</div>
      <div
        style={{
          fontSize: c.labelFontSize || 14,
          color: c.labelColor || "rgba(255,255,255,0.75)",
          fontWeight: 500,
        }}
      >
        {item.label}
      </div>
    </div>
  );
}

/* ─── Main Section ─────────────────────────────────────────── */
export default function StatsSection({ config: c, navId }) {
  loadFont(c.headingFont);
  injectCSS();
  const items = c.items || [];
  const bgAnim = c.bgAnimation;

  /* Section-level animated BG styles */
  let sectionStyle = {
    position: "relative",
    overflow: "hidden",
    background: getBg(c),
    paddingTop: c.paddingY || 60,
    paddingBottom: c.paddingY || 60,
    paddingLeft: c.paddingX || 32,
    paddingRight: c.paddingX || 32,
  };

  if (bgAnim === "gradientShift") {
    sectionStyle.background = `linear-gradient(270deg,${c.bgGradient?.from || "#2563eb"},${c.bgGradient?.to || "#7c3aed"},${c.bgGradient?.mid || "#db2777"})`;
    sectionStyle.backgroundSize = "400% 400%";
    sectionStyle.animation = `_gradientShift ${(3 / (c.animSpeed || 1)).toFixed(1)}s ease infinite`;
  } else if (bgAnim === "bgFade") {
    sectionStyle.animation = `_bgFade ${(4 / (c.animSpeed || 1)).toFixed(1)}s ease-in-out infinite`;
  } else if (bgAnim === "3d") {
    sectionStyle.animation = `_3dTilt ${(6 / (c.animSpeed || 1)).toFixed(1)}s ease-in-out infinite`;
    sectionStyle.transformStyle = "preserve-3d";
  }

  return (
    <section id={navId} style={sectionStyle}>
      {/* Canvas BG layers */}
      {bgAnim === "particles" && <ParticlesCanvas cfg={c} />}
      {bgAnim === "waves" && <WavesCanvas cfg={c} />}
      {bgAnim === "matrix" && <MatrixCanvas cfg={c} />}
      {bgAnim === "stars" && <StarsCanvas cfg={c} />}
      {(bgAnim === "shader" ||
        bgAnim === "aurora" ||
        bgAnim === "holographic" ||
        bgAnim === "plasma" ||
        bgAnim === "morphic") && (
        <ShaderCanvas
          cfg={{
            ...c,
            shaderType: bgAnim === "shader" ? c.shaderType || "aurora" : bgAnim,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: c.cardStyle && c.cardStyle !== "none" ? c.cardGap || 16 : 0,
          flexWrap: "wrap",
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              flex: 1,
              minWidth: 140,
            }}
          >
            <StatItem item={item} c={c} index={i} />
            {c.divider && i < items.length - 1 && (
              <div
                style={{
                  width: 1,
                  background: c.dividerColor || "rgba(255,255,255,0.2)",
                  margin: "0 20px",
                  alignSelf: "stretch",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
