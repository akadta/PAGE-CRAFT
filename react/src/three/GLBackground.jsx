import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────
   GLBackground
   Reusable Three.js canvas for animated section backgrounds.

   Props:
     texture: "waves" | "particles" | "noise" | "ribbon"
     colorA, colorB: hex strings, used by all texture types
     speed: 0.1 - 3 (animation speed multiplier)
     density: 0.1 - 3 (waves: ridge count / particles: count / noise: scale)
     opacity: 0 - 1 (overall canvas opacity, for blending with overlay)
     scrollFactor: 0 - 1, pass current scroll progress (0-1) for this section
                   if you want the texture itself to react to scroll
                   (optional — most reactivity is handled by GSAP outside this
                   component; this just lets the shader nudge with scroll)
     interactive: bool — mouse parallax tilt
   ──────────────────────────────────────────────────────────────────────── */

function hexToVec3(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return [r, g, b];
}

const WAVES_FRAG = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uSpeed;
  uniform float uDensity;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float ridge(float x) {
    return 1.0 - abs(fract(x) * 2.0 - 1.0);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * uSpeed * 0.25;
    float n = 0.0;
    float amp = 1.0;
    float freq = uDensity * 3.0;
    for (int i = 0; i < 4; i++) {
      n += ridge(uv.x * freq + t * (1.0 + float(i) * 0.3) + uv.y * 2.0) * amp;
      freq *= 1.8;
      amp *= 0.55;
    }
    n /= 1.9;
    float tilt = (uMouse.y - 0.5) * 0.15;
    n += sin((uv.x + tilt) * 6.0 + t * 2.0) * 0.05;
    vec3 col = mix(uColorA, uColorB, clamp(n + uv.y * 0.3, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const NOISE_FRAG = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uSpeed;
  uniform float uDensity;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * (1.5 + uDensity);
    float t = uTime * uSpeed * 0.15;
    float n = fbm(uv + vec2(t, t * 0.6));
    vec3 col = mix(uColorA, uColorB, clamp(n, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const RIBBON_FRAG = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uSpeed;
  uniform float uDensity;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * uSpeed * 0.3;
    float bands = uDensity * 14.0 + 6.0;
    float wob = sin(uv.y * 3.0 + t) * 0.08 + sin(uv.y * 7.0 - t * 1.3) * 0.04;
    float x = uv.x + wob + (uMouse.x - 0.5) * 0.05;
    float band = sin(x * bands + uv.y * 2.0 - t * 2.0);
    float shade = smoothstep(-1.0, 1.0, band);
    float sheen = pow(max(0.0, sin(x * bands * 2.0 - t * 3.0)), 8.0) * 0.4;
    vec3 col = mix(uColorA, uColorB, shade);
    col += sheen;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function buildPlaneMaterial(texture, uniforms) {
  const frag =
    texture === "noise"
      ? NOISE_FRAG
      : texture === "ribbon"
        ? RIBBON_FRAG
        : WAVES_FRAG;
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: frag,
  });
}

export default function GLBackground({
  texture = "waves",
  colorA = "#0f172a",
  colorB = "#1e3a5f",
  speed = 1,
  density = 1,
  opacity = 1,
  interactive = true,
  className = "",
  style = {},
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uColorA: { value: hexToVec3(colorA) },
      uColorB: { value: hexToVec3(colorB) },
      uSpeed: { value: speed },
      uDensity: { value: density },
      uMouse: { value: [0.5, 0.5] },
    };

    if (texture === "particles") {
      buildParticles(scene, uniforms, colorA, colorB, density);
    } else {
      const geo = new THREE.PlaneGeometry(2, 2);
      const mat = buildPlaneMaterial(texture, uniforms);
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
    }

    let mouseX = 0.5,
      mouseY = 0.5;
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };
    if (interactive) mount.addEventListener("mousemove", onMove);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      uniforms.uTime.value = t;
      uniforms.uMouse.value = [
        uniforms.uMouse.value[0] + (mouseX - uniforms.uMouse.value[0]) * 0.05,
        uniforms.uMouse.value[1] + (mouseY - uniforms.uMouse.value[1]) * 0.05,
      ];
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    stateRef.current = { renderer, scene, uniforms };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) mount.removeEventListener("mousemove", onMove);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture, colorA, colorB, speed, density, interactive]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        overflow: "hidden",
        ...style,
      }}
    />
  );
}

function buildParticles(scene, uniforms, colorA, colorB, density) {
  const count = Math.round(200 + density * 400);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2.2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    positions[i * 3 + 2] = 0;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float seed;
      uniform float uTime;
      uniform float uSpeed;
      varying float vSeed;
      void main() {
        vSeed = seed;
        vec3 p = position;
        p.x += sin(uTime * uSpeed * 0.3 + seed * 3.0) * 0.15;
        p.y += cos(uTime * uSpeed * 0.25 + seed * 5.0) * 0.15;
        gl_PointSize = 2.0 + sin(seed * 10.0 + uTime) * 1.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vSeed;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        vec3 col = mix(uColorA, uColorB, fract(vSeed));
        gl_FragColor = vec4(col, a * 0.85);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
}
