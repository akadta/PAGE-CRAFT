import { useState, useEffect, useCallback, useRef } from "react";
import { resolveUrl } from "../../../utils/resolveUrl";

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}

function parseVideoUrl(url = "") {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };
  const vmMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vmMatch) return { type: "vimeo", id: vmMatch[1] };
  return { type: "mp4", url };
}

function getTextShadow(style) {
  if (style === "strong")
    return "0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)";
  if (style === "soft") return "0 1px 6px rgba(0,0,0,0.4)";
  return "none";
}
function getBtnPadding(size) {
  if (size === "sm") return "8px 18px";
  if (size === "lg") return "16px 38px";
  return "12px 28px";
}
function getBtnFontSize(size) {
  if (size === "sm") return 13;
  if (size === "lg") return 17;
  return 15;
}
function getBtnStyle(btn, isOutline) {
  if (btn.variant === "outline" || isOutline)
    return {
      background: "transparent",
      color: btn.color || "#fff",
      border: `2px solid ${btn.color || "#fff"}`,
    };
  if (btn.variant === "ghost")
    return {
      background: "rgba(255,255,255,0.12)",
      color: btn.color || "#fff",
      border: "none",
    };
  return {
    background: btn.bg || "#2563eb",
    color: btn.color || "#fff",
    border: "none",
  };
}

/* ─── Animated Background ─── */
function AnimatedBackground({ c }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const type = c.animatedBg || "none";
  const color1 = c.animatedBgColor1 || "#0f172a";
  const color2 = c.animatedBgColor2 || "#1e293b";
  const particleColor = c.particleColor || "rgba(255,255,255,0.6)";
  const particleCount = c.particleCount || 40;

  useEffect(() => {
    if (type === "none" || type === "gradient-shift") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth,
      H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", resize);

    if (type === "particles" || type === "stars") {
      const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: type === "stars" ? Math.random() * 2 + 0.5 : Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * (type === "stars" ? 0.1 : 0.4),
        vy: (Math.random() - 0.5) * (type === "stars" ? 0.1 : 0.4),
        o: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.02;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          const opacity = p.o + Math.sin(p.pulse) * 0.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle =
            particleColor.replace(
              /[\d.]+\)$/,
              `${Math.max(0, Math.min(1, opacity))})`,
            ) || `rgba(255,255,255,${opacity})`;
          ctx.fill();
        });
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }
    if (type === "bubbles") {
      const bubbles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * W,
        y: H + Math.random() * H,
        r: Math.random() * 20 + 5,
        vy: -(Math.random() * 1 + 0.3),
        vx: (Math.random() - 0.5) * 0.5,
        o: Math.random() * 0.15 + 0.05,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        bubbles.forEach((b) => {
          b.y += b.vy;
          b.x += b.vx;
          if (b.y + b.r < 0) {
            b.y = H + b.r;
            b.x = Math.random() * W;
          }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${b.o * 3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${b.o})`;
          ctx.fill();
        });
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }
    if (type === "grid-pulse") {
      let t = 0;
      const cellSize = 60;
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.02;
        const cols = Math.ceil(W / cellSize) + 1,
          rows = Math.ceil(H / cellSize) + 1;
        for (let r = 0; r < rows; r++)
          for (let col = 0; col < cols; col++) {
            const dist = Math.sqrt((col - cols / 2) ** 2 + (r - rows / 2) ** 2);
            const o = ((Math.sin(dist * 0.5 - t) + 1) / 2) * 0.15;
            ctx.strokeStyle = `rgba(255,255,255,${o})`;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(col * cellSize, r * cellSize, cellSize, cellSize);
          }
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }
    if (type === "aurora") {
      let t = 0;
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.005;
        for (let i = 0; i < 3; i++) {
          const grd = ctx.createLinearGradient(
            W * (0.2 + i * 0.3 + Math.sin(t + i) * 0.2),
            0,
            W * (0.5 + i * 0.2 + Math.cos(t * 0.7 + i) * 0.3),
            H,
          );
          grd.addColorStop(
            0,
            `rgba(100,200,255,${0.04 + Math.sin(t + i) * 0.02})`,
          );
          grd.addColorStop(
            0.5,
            `rgba(150,100,255,${0.06 + Math.cos(t * 0.8 + i) * 0.02})`,
          );
          grd.addColorStop(
            1,
            `rgba(50,255,200,${0.04 + Math.sin(t * 1.2 + i) * 0.02})`,
          );
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.ellipse(
            W * (0.3 + i * 0.2 + Math.sin(t * 0.6 + i) * 0.15),
            H * (0.4 + Math.cos(t * 0.4 + i * 0.5) * 0.2),
            W * (0.4 + Math.sin(t * 0.3 + i) * 0.1),
            H * (0.3 + Math.cos(t * 0.5 + i) * 0.1),
            t * 0.1 + i,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }
    if (type === "matrix") {
      const cols = Math.floor(W / 18);
      const drops = Array.from(
        { length: cols },
        () => (Math.random() * H) / 18,
      );
      const chars = "01アイウエオカキクケコ".split("");
      const draw = () => {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = c.particleColor || "#0f0";
        ctx.font = "14px monospace";
        drops.forEach((y, i) => {
          ctx.fillText(
            chars[Math.floor(Math.random() * chars.length)],
            i * 18,
            y * 18,
          );
          if (y * 18 > H && Math.random() > 0.975) drops[i] = 0;
          else drops[i]++;
        });
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }
    if (type === "fireworks") {
      const particles = [];
      const addBurst = () => {
        const x = Math.random() * W,
          y = Math.random() * H * 0.7;
        const color = `hsl(${Math.random() * 360},100%,60%)`;
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2;
          const speed = Math.random() * 4 + 1;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            color,
          });
        }
      };
      let t = 0;
      const draw = () => {
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, W, H);
        t++;
        if (t % 60 === 0) addBurst();
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08;
          p.life -= 0.015;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color
            .replace(")", `,${p.life})`)
            .replace("hsl", "hsla");
          ctx.fill();
        }
        animRef.current = requestAnimationFrame(draw);
      };
      addBurst();
      draw();
    }
    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [type, particleColor, particleCount]);

  if (type === "none") return null;
  if (type === "gradient-shift")
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${color1}, ${color2}, ${color1})`,
          backgroundSize: "400% 400%",
          animation: "gradientShift 8s ease infinite",
          zIndex: 0,
        }}
      />
    );
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}

/* ─── Video Background ─── */
function VideoBackground({ slide }) {
  const parsed = parseVideoUrl(slide.video);
  if (!parsed) return null;
  const commonStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  };
  if (parsed.type === "mp4")
    return (
      <video
        key={slide.video}
        style={commonStyle}
        src={resolveUrl(slide.video)}
        autoPlay={slide.videoAutoplay !== false}
        muted={slide.videoMuted !== false}
        loop={slide.videoLoop !== false}
        controls={!!slide.videoControls}
        playsInline
      />
    );
  const params = new URLSearchParams({
    autoplay: slide.videoAutoplay !== false ? "1" : "0",
    mute: slide.videoMuted !== false ? "1" : "0",
    loop: slide.videoLoop !== false ? "1" : "0",
    controls: slide.videoControls ? "1" : "0",
    playsinline: "1",
    ...(parsed.type === "youtube" && { playlist: parsed.id }),
  });
  const src =
    parsed.type === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${parsed.id}?${params}`
      : `https://player.vimeo.com/video/${parsed.id}?${params}`;
  return (
    <iframe
      style={{ ...commonStyle, border: "none" }}
      src={src}
      allow="autoplay; fullscreen"
      allowFullScreen
      title="slide video"
    />
  );
}

function SlideMedia({ slide }) {
  if ((slide.mediaType || "image") === "video")
    return <VideoBackground slide={slide} />;
  if (slide.image)
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${resolveUrl(slide.image)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg,#1e293b,#334155)",
      }}
    />
  );
}

/* ─── Dots ─── */
function Dots({ slides, current, go, c, isMobile }) {
  if (!c.showDots || slides.length < 2) return null;
  if (isMobile && c.hideDotsMobile) return null;
  const pos = c.dotPosition || "bottom";
  const isVertical = pos === "left" || pos === "right";
  const posStyle = {
    bottom: {
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      flexDirection: "row",
    },
    top: {
      top: 24,
      left: "50%",
      transform: "translateX(-50%)",
      flexDirection: "row",
    },
    left: {
      left: 16,
      top: "50%",
      transform: "translateY(-50%)",
      flexDirection: "column",
    },
    right: {
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      flexDirection: "column",
    },
  }[pos];
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        gap: 8,
        zIndex: 20,
        alignItems: "center",
        ...posStyle,
      }}
    >
      {c.dotStyle === "number" ? (
        <span
          style={{
            color: c.dotColor || "#fff",
            fontSize: 13,
            fontWeight: 700,
            background: "rgba(0,0,0,0.4)",
            borderRadius: 20,
            padding: "4px 12px",
          }}
        >
          {current + 1} / {slides.length}
        </span>
      ) : (
        slides.map((_, i) => {
          const active = i === current,
            dot = c.dotStyle || "pill";
          return (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s",
                background: "none",
                ...(dot === "pill"
                  ? {
                      width: active ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: active
                        ? c.dotColor || "#2563eb"
                        : "rgba(255,255,255,0.4)",
                    }
                  : {}),
                ...(dot === "circle"
                  ? {
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: active
                        ? c.dotColor || "#2563eb"
                        : "rgba(255,255,255,0.4)",
                      transform: active ? "scale(1.3)" : "scale(1)",
                    }
                  : {}),
                ...(dot === "line"
                  ? {
                      width: isVertical ? 3 : active ? 24 : 16,
                      height: isVertical ? (active ? 24 : 16) : 3,
                      borderRadius: 2,
                      background: active
                        ? c.dotColor || "#2563eb"
                        : "rgba(255,255,255,0.35)",
                    }
                  : {}),
              }}
            />
          );
        })
      )}
    </div>
  );
}

function ProgressBar({ c, current, total, speed }) {
  if (!c.showProgress || total < 2) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(255,255,255,0.2)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${((current + 1) / total) * 100}%`,
          background: c.progressColor || "#2563eb",
          transition: `width ${speed || 600}ms ease`,
        }}
      />
    </div>
  );
}

function Counter({ current, total, c }) {
  if (!c.showCounter || total < 2) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 20,
        zIndex: 20,
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        background: "rgba(0,0,0,0.35)",
        borderRadius: 20,
        padding: "3px 10px",
      }}
    >
      {current + 1} / {total}
    </div>
  );
}

function Arrow({ dir, onClick, c, isMobile }) {
  if (!c.showArrows) return null;
  if (isMobile && c.hideArrowsMobile) return null;
  const size = c.arrowSize || 44,
    style = c.arrowStyle || "circle";
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [dir]: isMobile ? 8 : 20,
        zIndex: 20,
        width: size,
        height: size,
        borderRadius: style === "circle" ? "50%" : style === "square" ? 8 : 0,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          style === "minimal"
            ? "transparent"
            : c.arrowBg || "rgba(255,255,255,0.15)",
        color: c.arrowColor || "#fff",
        transition: "background 0.2s",
        backdropFilter: style !== "minimal" ? "blur(4px)" : "none",
      }}
      onMouseEnter={(e) => {
        if (style !== "minimal")
          e.currentTarget.style.background =
            c.arrowBg || "rgba(255,255,255,0.3)";
      }}
      onMouseLeave={(e) => {
        if (style !== "minimal")
          e.currentTarget.style.background =
            c.arrowBg || "rgba(255,255,255,0.15)";
      }}
    >
      <svg
        width={isMobile ? 16 : 20}
        height={isMobile ? 16 : 20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        {dir === "left" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

function SlideContent({ slide, c, isMobile }) {
  const headingScale = (c.mobileHeadingScale || 55) / 100;
  const hSize = isMobile
    ? Math.max((slide.headingSize || 52) * headingScale, 22)
    : slide.headingSize || 52;
  const subSize = isMobile
    ? Math.max((slide.subheadingSize || 18) * 0.85, 14)
    : slide.subheadingSize || 18;
  const padX = isMobile ? c.mobilePaddingX || 20 : (slide.paddingX ?? 60);
  const padY = slide.paddingY ?? 0;
  const hAlign = slide.contentAlign || "center";
  const vAlign = slide.contentValign || "center";
  const justifyContent =
    hAlign === "left"
      ? "flex-start"
      : hAlign === "right"
        ? "flex-end"
        : "center";
  const alignItems =
    vAlign === "top"
      ? "flex-start"
      : vAlign === "bottom"
        ? "flex-end"
        : "center";
  const textShadow = getTextShadow(c.textShadow);
  const showInlineButtons =
    !slide.buttonPosition || slide.buttonPosition === "inline";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems,
        justifyContent,
        padding: `${padY}px ${padX}px`,
        zIndex: 2,
      }}
    >
      <div
        style={{
          textAlign: hAlign,
          maxWidth: isMobile ? "100%" : slide.maxWidth || 700,
          width: "100%",
        }}
      >
        {slide.heading && (
          <h2
            style={{
              fontSize: hSize,
              fontWeight: c.headingWeight || 800,
              color: slide.headingColor || "#fff",
              margin: "0 0 12px",
              lineHeight: 1.1,
              textShadow,
              wordBreak: "break-word",
            }}
          >
            {slide.heading}
          </h2>
        )}
        {slide.subheading && (
          <p
            style={{
              fontSize: subSize,
              color: slide.subheadingColor || "rgba(255,255,255,0.8)",
              margin: "0 0 24px",
              lineHeight: 1.6,
              textShadow,
            }}
          >
            {slide.subheading}
          </p>
        )}
        {(slide.button?.show || slide.button2?.show) && showInlineButtons && (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent:
                hAlign === "center"
                  ? "center"
                  : hAlign === "right"
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            {slide.button?.show && (
              <a
                href={slide.button.url || "#"}
                target={slide.button.newTab ? "_blank" : undefined}
                rel={slide.button.newTab ? "noopener noreferrer" : undefined}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  fontWeight: 700,
                  padding: getBtnPadding(slide.button.size),
                  fontSize: getBtnFontSize(slide.button.size),
                  borderRadius: slide.button.borderRadius ?? 8,
                  transition: "opacity 0.2s",
                  ...getBtnStyle(slide.button, false),
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {slide.button.label}
              </a>
            )}
            {slide.button2?.show && (
              <a
                href={slide.button2.url || "#"}
                target={slide.button2.newTab ? "_blank" : undefined}
                rel={slide.button2.newTab ? "noopener noreferrer" : undefined}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  fontWeight: 700,
                  padding: getBtnPadding(slide.button2.size),
                  fontSize: getBtnFontSize(slide.button2.size),
                  borderRadius: slide.button2.borderRadius ?? 8,
                  transition: "opacity 0.2s",
                  ...getBtnStyle(slide.button2, true),
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {slide.button2.label}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingButtons({ slide }) {
  if (!slide.buttonPosition || slide.buttonPosition === "inline") return null;
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 11,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        ...(slide.buttonPosition.startsWith("bottom")
          ? { bottom: 36 }
          : { top: 36 }),
        ...(slide.buttonPosition.endsWith("left") && { left: 32 }),
        ...(slide.buttonPosition.endsWith("right") && { right: 32 }),
        ...(slide.buttonPosition.endsWith("center") && {
          left: "50%",
          transform: "translateX(-50%)",
        }),
      }}
    >
      {slide.button?.show && (
        <a
          href={slide.button.url || "#"}
          target={slide.button.newTab ? "_blank" : undefined}
          rel={slide.button.newTab ? "noopener noreferrer" : undefined}
          style={{
            display: "inline-block",
            textDecoration: "none",
            fontWeight: 700,
            padding: getBtnPadding(slide.button.size),
            fontSize: getBtnFontSize(slide.button.size),
            borderRadius: slide.button.borderRadius ?? 8,
            transition: "opacity 0.2s",
            ...getBtnStyle(slide.button, false),
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {slide.button.label}
        </a>
      )}
      {slide.button2?.show && (
        <a
          href={slide.button2.url || "#"}
          target={slide.button2.newTab ? "_blank" : undefined}
          rel={slide.button2.newTab ? "noopener noreferrer" : undefined}
          style={{
            display: "inline-block",
            textDecoration: "none",
            fontWeight: 700,
            padding: getBtnPadding(slide.button2.size),
            fontSize: getBtnFontSize(slide.button2.size),
            borderRadius: slide.button2.borderRadius ?? 8,
            transition: "opacity 0.2s",
            ...getBtnStyle(slide.button2, true),
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {slide.button2.label}
        </a>
      )}
    </div>
  );
}

function getSlideStyle(transition, state, reduceMotion) {
  if (reduceMotion || transition === "none")
    return { opacity: state === "enter" ? 1 : 0, transition: "opacity 0.2s" };
  if (transition === "zoom")
    return {
      opacity: state === "enter" ? 1 : 0,
      transform: state === "enter" ? "scale(1)" : "scale(1.06)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    };
  if (transition === "slide")
    return {
      opacity: state === "enter" ? 1 : 0,
      transform: state === "enter" ? "translateX(0)" : "translateX(60px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    };
  if (transition === "flip")
    return {
      opacity: state === "enter" ? 1 : 0,
      transform:
        state === "enter"
          ? "perspective(800px) rotateY(0deg)"
          : "perspective(800px) rotateY(20deg)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    };
  if (transition === "blur")
    return {
      opacity: state === "enter" ? 1 : 0,
      filter: state === "enter" ? "blur(0px)" : "blur(8px)",
      transition: "opacity 0.5s ease, filter 0.5s ease",
    };
  if (transition === "slide-up")
    return {
      opacity: state === "enter" ? 1 : 0,
      transform: state === "enter" ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    };
  return {
    opacity: state === "enter" ? 1 : 0,
    transition: "opacity 0.5s ease",
  };
}

/* ══════════════════════════════════════════════════════
   DISPLAY MODES
══════════════════════════════════════════════════════ */

/* 1. COVERFLOW — rotated side cards, blurred, raised center */
function CoverflowCards({ slides, current, go, c, isMobile }) {
  const radius = c.cardBorderRadius ?? 16;
  const gap = c.cardGap || 32;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1400px",
        overflow: "hidden",
      }}
    >
      {slides.map((slide, i) => {
        const offset = i - current,
          absOffset = Math.abs(offset);
        if (absOffset > 2) return null;
        const translateX = offset * (isMobile ? 200 : 320 + gap);
        const rotateY = offset * -22;
        const scale = absOffset === 0 ? 1 : 0.8;
        const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.6 : 0.25;
        const blur = absOffset === 0 ? 0 : absOffset * 2;
        return (
          <div
            key={slide.id}
            onClick={() => absOffset > 0 && go(i)}
            style={{
              position: "absolute",
              width: isMobile ? "78vw" : "52%",
              height: isMobile ? "55%" : "72%",
              borderRadius: radius,
              overflow: "hidden",
              cursor: absOffset > 0 ? "pointer" : "default",
              transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
              opacity,
              filter: blur > 0 ? `blur(${blur}px)` : "none",
              transition: "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
              zIndex: 10 - absOffset,
              boxShadow:
                absOffset === 0
                  ? "0 24px 60px rgba(0,0,0,0.35),0 8px 24px rgba(0,0,0,0.2)"
                  : "0 8px 24px rgba(0,0,0,0.15)",
              transformOrigin:
                offset < 0
                  ? "right center"
                  : offset > 0
                    ? "left center"
                    : "center center",
            }}
          >
            <SlideMedia slide={slide} />
            {slide.overlayEnabled !== false && absOffset === 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: slide.overlay || "rgba(0,0,0,0.2)",
                  opacity: (slide.overlayOpacity ?? 20) / 100,
                }}
              />
            )}
            {absOffset === 0 && (
              <SlideContent slide={slide} c={c} isMobile={isMobile} />
            )}
            {absOffset === 0 && <FloatingButtons slide={slide} />}
          </div>
        );
      })}
    </div>
  );
}

/* 2. 3D STACK — cards stacked behind each other with offset */
function StackCards({ slides, current, go, c, isMobile }) {
  const radius = c.cardBorderRadius ?? 20;
  const stackOffset = c.stackOffset || 12;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[...slides].reverse().map((slide, ri) => {
        const i = slides.length - 1 - ri;
        const offset = i - current;
        const absOffset = Math.abs(offset);
        if (absOffset > 3) return null;
        const isActive = absOffset === 0;
        const stackIdx = isActive
          ? 0
          : offset > 0
            ? offset
            : slides.length + offset;
        const cappedStack = Math.min(stackIdx, 3);
        const translateY = isActive ? 0 : cappedStack * -stackOffset;
        const translateX = isActive ? 0 : cappedStack * stackOffset * 0.5;
        const scale = isActive ? 1 : 1 - cappedStack * 0.04;
        const rotate = isActive
          ? 0
          : offset > 0
            ? cappedStack * 2
            : -cappedStack * 2;
        return (
          <div
            key={slide.id}
            onClick={() => !isActive && go(i)}
            style={{
              position: "absolute",
              width: isMobile ? "82%" : "58%",
              height: isMobile ? "62%" : "76%",
              borderRadius: radius,
              overflow: "hidden",
              cursor: !isActive ? "pointer" : "default",
              transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
              transition: "all 0.55s cubic-bezier(0.34,1.56,0.64,1)",
              zIndex: isActive ? 10 : 10 - Math.abs(offset),
              boxShadow: isActive
                ? "0 32px 80px rgba(0,0,0,0.5),0 12px 32px rgba(0,0,0,0.3)"
                : "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <SlideMedia slide={slide} />
            {slide.overlayEnabled !== false && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: slide.overlay || "rgba(0,0,0,0.3)",
                  opacity: (slide.overlayOpacity ?? 30) / 100,
                }}
              />
            )}
            {isActive && (
              <SlideContent slide={slide} c={c} isMobile={isMobile} />
            )}
            {isActive && <FloatingButtons slide={slide} />}
          </div>
        );
      })}
    </div>
  );
}

/* 3. CUBE — 3D cube rotation between slides */
function CubeSlider({ slides, current, c, isMobile, transitioning }) {
  const slide = slides[current];
  const prev = slides[(current - 1 + slides.length) % slides.length];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transition: transitioning
            ? "transform 0.7s cubic-bezier(0.4,0,0.2,1)"
            : "none",
          transform: transitioning ? "rotateY(-90deg)" : "rotateY(0deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
          }}
        >
          <SlideMedia slide={slide} />
          {slide.overlayEnabled !== false && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: slide.overlay || "rgba(0,0,0,0.35)",
                opacity: (slide.overlayOpacity ?? 35) / 100,
              }}
            />
          )}
          <SlideContent slide={slide} c={c} isMobile={isMobile} />
          <FloatingButtons slide={slide} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(90deg) translateZ(100px)",
          }}
        >
          <SlideMedia slide={prev} />
        </div>
      </div>
    </div>
  );
}

/* 4. WHEEL / FILMSTRIP — horizontal strip of cards like a film roll */
function FilmstripSlider({ slides, current, go, c, isMobile }) {
  const radius = c.cardBorderRadius ?? 12;
  const cardW = isMobile ? 200 : 280;
  const cardH = isMobile ? 140 : 200;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Film perforations top */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          right: 0,
          height: 20,
          display: "flex",
          gap: 12,
          padding: "0 20px",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 18,
              borderRadius: 3,
              border: "2px solid rgba(255,255,255,0.3)",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          height: 20,
          display: "flex",
          gap: 12,
          padding: "0 20px",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 18,
              borderRadius: 3,
              border: "2px solid rgba(255,255,255,0.3)",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          transform: `translateX(${-current * (cardW + 16)}px)`,
          transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {slides.map((slide, i) => {
          const offset = i - current,
            absOffset = Math.abs(offset);
          const scale = absOffset === 0 ? 1.15 : 0.85;
          const opacity = absOffset === 0 ? 1 : 0.5;
          return (
            <div
              key={slide.id}
              onClick={() => absOffset > 0 && go(i)}
              style={{
                width: cardW,
                height: cardH,
                flexShrink: 0,
                borderRadius: radius,
                overflow: "hidden",
                cursor: absOffset > 0 ? "pointer" : "default",
                transform: `scale(${scale})`,
                opacity,
                transition: "all 0.5s ease",
                boxShadow:
                  absOffset === 0 ? "0 16px 48px rgba(0,0,0,0.6)" : "none",
                border: `2px solid rgba(255,255,255,${absOffset === 0 ? 0.4 : 0.1})`,
              }}
            >
              <SlideMedia slide={slide} />
              {slide.overlayEnabled !== false && absOffset === 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: slide.overlay || "rgba(0,0,0,0.3)",
                    opacity: (slide.overlayOpacity ?? 30) / 100,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Active slide info below */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        {slides[current]?.heading && (
          <h3
            style={{
              color: "#fff",
              fontSize: isMobile ? 16 : 22,
              fontWeight: 700,
              margin: 0,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {slides[current].heading}
          </h3>
        )}
      </div>
    </div>
  );
}

/* 5. TILT GALLERY — cards tilt on hover, staggered layout */
function TiltGallery({ slides, current, go, c, isMobile }) {
  const radius = c.cardBorderRadius ?? 16;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {slides.map((slide, i) => {
        const offset = i - current,
          absOffset = Math.abs(offset);
        if (absOffset > 2) return null;
        const isActive = absOffset === 0;
        const tilt = offset * -15;
        const translateX = offset * (isMobile ? 160 : 260);
        const translateY = absOffset === 1 ? 30 : absOffset === 2 ? 55 : 0;
        const scale = isActive ? 1 : 0.78 - absOffset * 0.06;
        return (
          <div
            key={slide.id}
            onClick={() => !isActive && go(i)}
            style={{
              position: "absolute",
              width: isMobile ? "70%" : "46%",
              height: isMobile ? "58%" : "74%",
              borderRadius: radius,
              overflow: "hidden",
              cursor: !isActive ? "pointer" : "default",
              transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${tilt}deg) scale(${scale})`,
              transition: "all 0.55s cubic-bezier(0.34,1.2,0.64,1)",
              zIndex: 10 - absOffset,
              opacity: isActive ? 1 : 0.55,
              boxShadow: isActive
                ? "0 28px 70px rgba(0,0,0,0.45)"
                : "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            <SlideMedia slide={slide} />
            {slide.overlayEnabled !== false && isActive && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: slide.overlay || "rgba(0,0,0,0.3)",
                  opacity: (slide.overlayOpacity ?? 30) / 100,
                }}
              />
            )}
            {isActive && (
              <SlideContent slide={slide} c={c} isMobile={isMobile} />
            )}
            {isActive && <FloatingButtons slide={slide} />}
          </div>
        );
      })}
    </div>
  );
}

/* 6. BOOK FLIP — page turn effect */
function BookFlip({ slides, current, c, isMobile, transitioning, transDir }) {
  const slide = slides[current];
  const next = slides[(current + 1) % slides.length];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "2000px",
        perspectiveOrigin: "50% 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: isMobile ? "90%" : "70%",
          height: isMobile ? "70%" : "80%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Back page */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <SlideMedia slide={next} />
        </div>
        {/* Front page with flip */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            overflow: "hidden",
            transformOrigin: "left center",
            transform: transitioning ? "rotateY(-180deg)" : "rotateY(0deg)",
            transition: transitioning
              ? "transform 0.7s cubic-bezier(0.4,0,0.2,1)"
              : "none",
            transformStyle: "preserve-3d",
            boxShadow: "8px 0 32px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
            }}
          >
            <SlideMedia slide={slide} />
            {slide.overlayEnabled !== false && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: slide.overlay || "rgba(0,0,0,0.3)",
                  opacity: (slide.overlayOpacity ?? 30) / 100,
                }}
              />
            )}
            <SlideContent slide={slide} c={c} isMobile={isMobile} />
            <FloatingButtons slide={slide} />
            {/* Page edge shine */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 12,
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.15))",
                pointerEvents: "none",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "#f5f5f0",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(transparent,transparent 31px,#e0e0e0 31px,#e0e0e0 32px)",
                padding: "24px 40px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 7. ZOOM BLUR — active zooms in, others blur out */
function ZoomBlur({ slides, current, go, c, isMobile }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {slides.map((slide, i) => {
        const offset = i - current,
          absOffset = Math.abs(offset);
        if (absOffset > 1) return null;
        const isActive = absOffset === 0;
        return (
          <div
            key={slide.id}
            onClick={() => !isActive && go(i)}
            style={{
              position: "absolute",
              inset: 0,
              cursor: !isActive ? "pointer" : "default",
              transform: isActive ? "scale(1)" : "scale(0.92)",
              filter: isActive ? "none" : "blur(4px) brightness(0.4)",
              opacity: isActive ? 1 : 0.6,
              transition: "all 0.6s ease",
              zIndex: isActive ? 2 : 1,
            }}
          >
            <SlideMedia slide={slide} />
            {slide.overlayEnabled !== false && isActive && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: slide.overlay || "rgba(0,0,0,0.35)",
                  opacity: (slide.overlayOpacity ?? 35) / 100,
                }}
              />
            )}
            {isActive && (
              <SlideContent slide={slide} c={c} isMobile={isMobile} />
            )}
            {isActive && <FloatingButtons slide={slide} />}
          </div>
        );
      })}
    </div>
  );
}

/* 8. DIAGONAL SPLIT — slides split diagonally */
function DiagonalSplit({ slides, current, go, c, isMobile, transitioning }) {
  const slide = slides[current];
  const next = slides[(current + 1) % slides.length];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <SlideMedia slide={slide} />
      {slide.overlayEnabled !== false && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: slide.overlay || "rgba(0,0,0,0.35)",
            opacity: (slide.overlayOpacity ?? 35) / 100,
          }}
        />
      )}
      <SlideContent slide={slide} c={c} isMobile={isMobile} />
      <FloatingButtons slide={slide} />
      {/* Diagonal reveal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: transitioning
            ? "polygon(100% 0,100% 0,100% 100%,100% 100%)"
            : "polygon(0 0,0 0,0 100%,0 100%)",
          transition: "clip-path 0.7s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        <SlideMedia slide={next} />
      </div>
    </div>
  );
}

/* 9. TRANSPARENT AVATAR — circular cards with label below */
function TransparentCards({ slides, current, go, c, isMobile }) {
  const radius = c.cardBorderRadius ?? 999;
  const gap = c.cardGap || 24;
  const cardScale = (c.cardScale || 80) / 100;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap,
        }}
      >
        {slides.map((slide, i) => {
          const offset = i - current,
            absOffset = Math.abs(offset);
          if (absOffset > 3) return null;
          const isActive = absOffset === 0;
          const scale = isActive ? 1 : cardScale - absOffset * 0.08;
          const size = isMobile ? 80 : 120;
          const activeSize = isMobile ? 160 : 220;
          return (
            <div
              key={slide.id}
              onClick={() => !isActive && go(i)}
              style={{
                width: isActive ? activeSize : size,
                height: isActive ? activeSize : size,
                borderRadius: radius,
                overflow: "hidden",
                cursor: !isActive ? "pointer" : "default",
                transform: `scale(${scale})`,
                transition: "all 0.4s cubic-bezier(0.34,1.3,0.64,1)",
                opacity: isActive ? 1 : 0.45 + 0.1 * (3 - absOffset),
                boxShadow: isActive
                  ? "0 12px 40px rgba(0,0,0,0.25)"
                  : "0 2px 12px rgba(0,0,0,0.1)",
                flexShrink: 0,
                border: isActive
                  ? `3px solid ${c.dotColor || "#2563eb"}`
                  : "2px solid transparent",
              }}
            >
              <SlideMedia slide={slide} />
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 24, textAlign: "center", padding: "0 24px" }}>
        {slides[current]?.heading && (
          <h2
            style={{
              fontSize: isMobile ? 22 : slides[current].headingSize || 32,
              fontWeight: c.headingWeight || 700,
              color: slides[current].headingColor || "#0f172a",
              margin: "0 0 8px",
            }}
          >
            {slides[current].heading}
          </h2>
        )}
        {slides[current]?.subheading && (
          <p
            style={{
              fontSize: isMobile ? 14 : slides[current].subheadingSize || 16,
              color: slides[current].subheadingColor || "#64748b",
              margin: 0,
            }}
          >
            {slides[current].subheading}
          </p>
        )}
      </div>
    </div>
  );
}

/* 10. 3D CARDS — perspective fan */
function ThreeDCards({ slides, current, go, c, isMobile }) {
  const cardScale = (c.cardScale || 80) / 100;
  const gap = c.cardGap || 40;
  const radius = c.cardBorderRadius ?? 16;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
      }}
    >
      {slides.map((slide, i) => {
        const offset = i - current,
          absOffset = Math.abs(offset);
        if (absOffset > 2) return null;
        const scale =
          absOffset === 0 ? 1 : absOffset === 1 ? cardScale : cardScale * 0.82;
        const translateX = offset * (isMobile ? 180 : 290 + gap);
        const translateZ = absOffset === 0 ? 0 : -100 * absOffset;
        const rotateY = offset * -10;
        const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.72 : 0.38;
        return (
          <div
            key={slide.id}
            onClick={() => absOffset > 0 && go(i)}
            style={{
              position: "absolute",
              width: isMobile ? "75%" : "55%",
              height: isMobile ? "60%" : "75%",
              borderRadius: radius,
              overflow: "hidden",
              cursor: absOffset > 0 ? "pointer" : "default",
              transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
              opacity,
              transition: "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
              zIndex: 10 - absOffset,
              boxShadow:
                absOffset === 0
                  ? "0 30px 80px rgba(0,0,0,0.5),0 10px 30px rgba(0,0,0,0.3)"
                  : "0 10px 40px rgba(0,0,0,0.3)",
            }}
          >
            <SlideMedia slide={slide} />
            {slide.overlayEnabled !== false && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: slide.overlay || "rgba(0,0,0,0.4)",
                  opacity: (slide.overlayOpacity ?? 40) / 100,
                }}
              />
            )}
            {absOffset === 0 && (
              <SlideContent slide={slide} c={c} isMobile={isMobile} />
            )}
            {absOffset === 0 && <FloatingButtons slide={slide} />}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════════════ */
export default function CarouselSection({ config: c, navId }) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [transDir, setTransDir] = useState(1);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const slides = c.slides || [];
  const speed = c.transitionSpeed || 600;
  const displayMode = c.displayMode || "fullscreen";

  const go = useCallback(
    (idx) => {
      if (transitioning || slides.length < 2) return;
      setTransDir(idx > current ? 1 : -1);
      setTransitioning(true);
      setTimeout(
        () => {
          setCurrent((idx + slides.length) % slides.length);
          setTransitioning(false);
        },
        Math.min(speed, 700),
      );
    },
    [transitioning, slides.length, speed, current],
  );

  useEffect(() => {
    const currentSlide = slides[current];
    if (!c.autoplay || slides.length < 2 || currentSlide?.mediaType === "video")
      return;
    const start = () => {
      timerRef.current = setInterval(
        () => go(current + 1),
        c.autoplayDelay || 4000,
      );
    };
    const stop = () => clearInterval(timerRef.current);
    start();
    if (c.pauseOnHover && sectionRef.current) {
      sectionRef.current.addEventListener("mouseenter", stop);
      sectionRef.current.addEventListener("mouseleave", start);
    }
    return () => {
      stop();
      if (sectionRef.current) {
        sectionRef.current.removeEventListener("mouseenter", stop);
        sectionRef.current.removeEventListener("mouseleave", start);
      }
    };
  }, [c.autoplay, c.autoplayDelay, c.pauseOnHover, current, go, slides]);

  useEffect(() => {
    if (c.keyboardNav === false) return;
    const h = (e) => {
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [current, go, c.keyboardNav]);

  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current || !c.swipe) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
    touchStart.current = null;
  };

  const heightMode = c.heightMode || "min";
  const sectionHeight =
    heightMode === "full"
      ? "100vh"
      : heightMode === "fixed"
        ? `${c.minHeight || 600}px`
        : undefined;
  const sectionMinHeight =
    heightMode !== "full" && heightMode !== "fixed"
      ? isMobile
        ? c.mobileMinHeight || 320
        : c.minHeight || 600
      : undefined;
  const bgColor = c.bgColor || "#0f172a";

  if (!slides.length)
    return (
      <section
        id={navId}
        style={{
          minHeight: sectionMinHeight || 500,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          No slides added yet
        </span>
      </section>
    );

  const slide = slides[current];
  const slideStyle = getSlideStyle(
    c.transition || "fade",
    transitioning ? "exit" : "enter",
    c.reduceMotion,
  );

  const isFullscreen = !displayMode || displayMode === "fullscreen";
  const is3D = displayMode === "3d-cards";
  const isCoverflow = displayMode === "coverflow";
  const isStack = displayMode === "stack";
  const isCube = displayMode === "cube";
  const isFilmstrip = displayMode === "filmstrip";
  const isTilt = displayMode === "tilt";
  const isBook = displayMode === "book";
  const isZoomBlur = displayMode === "zoom-blur";
  const isDiagonal = displayMode === "diagonal";
  const isTransparent = displayMode === "transparent";

  /* Modes that handle their own full-section layout */
  const isManagedMode =
    is3D ||
    isCoverflow ||
    isStack ||
    isCube ||
    isFilmstrip ||
    isTilt ||
    isBook ||
    isZoomBlur ||
    isDiagonal ||
    isTransparent;

  return (
    <>
      <style>{`
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @media(prefers-reduced-motion:reduce){.carousel-slide{transition:none!important}}
      `}</style>
      <section
        ref={sectionRef}
        id={navId}
        style={{
          position: "relative",
          height: sectionHeight,
          minHeight: sectionMinHeight,
          background: bgColor,
          overflow: "hidden",
          zIndex: c.zIndex || 0,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatedBackground c={c} />
        <ProgressBar
          c={c}
          current={current}
          total={slides.length}
          speed={speed}
        />
        <Counter current={current} total={slides.length} c={c} />

        {/* ── Managed display modes ── */}
        {isCoverflow && (
          <CoverflowCards
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
          />
        )}
        {is3D && (
          <ThreeDCards
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
          />
        )}
        {isStack && (
          <StackCards
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
          />
        )}
        {isCube && (
          <CubeSlider
            slides={slides}
            current={current}
            c={c}
            isMobile={isMobile}
            transitioning={transitioning}
          />
        )}
        {isFilmstrip && (
          <FilmstripSlider
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
          />
        )}
        {isTilt && (
          <TiltGallery
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
          />
        )}
        {isBook && (
          <BookFlip
            slides={slides}
            current={current}
            c={c}
            isMobile={isMobile}
            transitioning={transitioning}
            transDir={transDir}
          />
        )}
        {isZoomBlur && (
          <ZoomBlur
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
          />
        )}
        {isDiagonal && (
          <DiagonalSplit
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
            transitioning={transitioning}
          />
        )}
        {isTransparent && (
          <TransparentCards
            slides={slides}
            current={current}
            go={go}
            c={c}
            isMobile={isMobile}
          />
        )}

        {/* ── Fullscreen / default ── */}
        {!isManagedMode && (
          <div
            className="carousel-slide"
            style={{ position: "absolute", inset: 0, ...slideStyle }}
          >
            <SlideMedia slide={slide} />
            {slide.overlayEnabled !== false && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: slide.overlay || "rgba(0,0,0,0.4)",
                  opacity: (slide.overlayOpacity ?? 40) / 100,
                }}
              />
            )}
            {c.globalOverlay > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `rgba(0,0,0,${c.globalOverlay / 100})`,
                }}
              />
            )}
            <SlideContent slide={slide} c={c} isMobile={isMobile} />
            <FloatingButtons slide={slide} />
          </div>
        )}

        <Arrow
          dir="left"
          onClick={() => go(current - 1)}
          c={c}
          isMobile={isMobile}
        />
        <Arrow
          dir="right"
          onClick={() => go(current + 1)}
          c={c}
          isMobile={isMobile}
        />
        <Dots
          slides={slides}
          current={current}
          go={go}
          c={c}
          isMobile={isMobile}
        />
      </section>
    </>
  );
}
