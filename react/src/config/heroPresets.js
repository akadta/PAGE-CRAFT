import { uid } from "./sectionDefaults";

// ─── Helper to stamp fresh IDs on every preset load ──────────────────────────
const stamp = (blocks) =>
  blocks.map((b) => ({
    ...b,
    id: uid(),
    ...(b.items ? { items: b.items.map((it) => ({ ...it, id: uid() })) } : {}),
    ...(b.slides ? { slides: b.slides.map((s) => ({ ...s, id: uid() })) } : {}),
  }));

// ─── Shared block factories ───────────────────────────────────────────────────
const headingBlock = (text, opts = {}) => ({
  type: "heading",
  position: "flow",
  text,
  fontSize: opts.fontSize || 64,
  fontWeight: opts.fontWeight || 800,
  color: opts.color || "#ffffff",
  align: opts.align || "center",
  highlight: opts.highlight || "",
  highlightColor: opts.highlightColor || "#60a5fa",
  visible: true,
});

const subBlock = (text, opts = {}) => ({
  type: "subheading",
  position: "flow",
  text,
  fontSize: opts.fontSize || 18,
  color: opts.color || "rgba(255,255,255,0.7)",
  align: opts.align || "center",
  maxWidth: opts.maxWidth || 640,
  visible: true,
});

const badgeBlock = (text, opts = {}) => ({
  type: "badge",
  position: "flow",
  text,
  bg: opts.bg || "rgba(99,102,241,0.15)",
  color: opts.color || "#818cf8",
  borderRadius: 100,
  visible: true,
});

const btnsBlock = (items, opts = {}) => ({
  type: "buttons",
  position: "flow",
  items,
  gap: opts.gap || 12,
  align: opts.align || "center",
  visible: true,
});

const spacerBlock = (h = 24) => ({
  type: "spacer",
  position: "flow",
  height: h,
  visible: true,
});

const dividerBlock = (opts = {}) => ({
  type: "divider",
  position: "flow",
  color: opts.color || "rgba(255,255,255,0.15)",
  thickness: opts.thickness || 1,
  width: opts.width || 80,
  style: "solid",
  visible: true,
});

const statsBlock = (items, opts = {}) => ({
  type: "stats",
  position: "flow",
  items,
  columns: opts.columns || items.length,
  valueColor: opts.valueColor || "#ffffff",
  labelColor: opts.labelColor || "rgba(255,255,255,0.6)",
  valueFontSize: opts.valueFontSize || 36,
  labelFontSize: opts.labelFontSize || 13,
  bg: opts.bg || "rgba(255,255,255,0.05)",
  borderColor: opts.borderColor || "rgba(255,255,255,0.1)",
  borderRadius: opts.borderRadius || 12,
  visible: true,
});

const iconrowBlock = (items, opts = {}) => ({
  type: "iconrow",
  position: "flow",
  items,
  iconSize: opts.iconSize || 24,
  labelColor: opts.labelColor || "rgba(255,255,255,0.7)",
  labelFontSize: opts.labelFontSize || 14,
  gap: opts.gap || 32,
  align: opts.align || "center",
  visible: true,
});

const imageBlock = (opts = {}) => ({
  type: "image",
  position: "flow",
  url: opts.url || "",
  alt: opts.alt || "",
  width: opts.width || 100,
  maxWidth: opts.maxWidth || 700,
  borderRadius: opts.borderRadius ?? 16,
  shadow: opts.shadow ?? true,
  opacity: 100,
  align: opts.align || "center",
  visible: true,
});

const galleryBlock = (opts = {}) => ({
  type: "gallery",
  position: "flow",
  images: opts.images || [],
  scrollMode: opts.scrollMode || "both",
  speed: opts.speed || 40,
  direction: opts.direction || "left",
  imageHeight: opts.imageHeight || 200,
  gap: opts.gap || 16,
  borderRadius: opts.borderRadius || 8,
  objectFit: opts.objectFit || "cover",
  shadow: opts.shadow || false,
  grayscaleHover: opts.grayscaleHover || false,
  visible: true,
});

const carouselBlock = (slides, styleOpts = {}) => ({
  type: "carousel",
  position: "flow",
  slides,
  style: {
    animation: styleOpts.animation || "slide",
    autoPlay: styleOpts.autoPlay ?? true,
    interval: styleOpts.interval || 4000,
    showArrows: styleOpts.showArrows ?? true,
    showDots: styleOpts.showDots ?? true,
    theme: styleOpts.theme || "dark",
    itemsPerView: styleOpts.itemsPerView || 1,
    gap: styleOpts.gap || 0,
    imageAspectW: styleOpts.imageAspectW || 16,
    imageAspectH: styleOpts.imageAspectH || 9,
    imageBorderRadius: styleOpts.imageBorderRadius || 12,
    imageShadow: styleOpts.imageShadow ?? true,
    slideHeight: styleOpts.slideHeight || 400,
    customWidth: styleOpts.customWidth || false,
    slideWidth: styleOpts.slideWidth || 400,
    slidePadding: styleOpts.slidePadding || 0,
    ...styleOpts,
  },
  visible: true,
});

const richBlock = (html, opts = {}) => ({
  type: "richtext",
  position: "flow",
  html,
  align: opts.align || "center",
  maxWidth: opts.maxWidth || 800,
  visible: true,
});

// ─── Button shape helpers ─────────────────────────────────────────────────────
const btn = (label, url, bg, color, opts = {}) => ({
  id: uid(),
  label,
  url: url || "#",
  style: opts.style || "filled",
  bg,
  color,
  hoverBg: opts.hoverBg || bg,
  hoverColor: opts.hoverColor || color,
  borderRadius: opts.borderRadius ?? 10,
  size: opts.size || "lg",
});

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS PRESETS  (full hero canvas block groups)
// ═══════════════════════════════════════════════════════════════════════════════
export const CANVAS_PRESETS = [
  // ── 1. SaaS Dark ─────────────────────────────────────────────────────────
  {
    id: "saas-dark",
    name: "SaaS Dark",
    thumb: "💻",
    category: "SaaS",
    bg: {
      bgType: "gradient",
      bg: "#0f172a",
      bgGradient: {
        from: "#0f172a",
        to: "#1e1b4b",
        direction: "to bottom right",
        intensity: 100,
      },
      animatedBg: {
        enabled: true,
        preset: "particles",
        color: "#6366f1",
        density: 50,
        speed: 40,
        size: 50,
        glow: 60,
        count: 50,
      },
      headingFont: "Syne",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Now in Beta", {
          bg: "rgba(99,102,241,0.15)",
          color: "#818cf8",
        }),
        spacerBlock(16),
        headingBlock("Ship faster.\nBreak nothing.", {
          fontSize: 72,
          highlight: "faster",
          highlightColor: "#818cf8",
        }),
        spacerBlock(20),
        subBlock("The all-in-one platform for modern engineering teams.", {
          fontSize: 20,
          color: "rgba(241,245,249,0.65)",
        }),
        spacerBlock(32),
        btnsBlock([
          btn("Start for free", "#", "#6366f1", "#fff", {
            hoverBg: "#4f46e5",
            borderRadius: 10,
          }),
          btn("See demo", "#", "transparent", "#818cf8", {
            style: "outline",
            hoverBg: "#6366f1",
            hoverColor: "#fff",
            borderRadius: 10,
          }),
        ]),
      ]),
  },

  // ── 2. Agency Split ──────────────────────────────────────────────────────
  {
    id: "agency-split",
    name: "Agency Split",
    thumb: "🏢",
    category: "Agency",
    bg: {
      bgType: "solid",
      bg: "#ffffff",
      animatedBg: { enabled: false },
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Award Winning Agency", { bg: "#eff6ff", color: "#2563eb" }),
        spacerBlock(16),
        headingBlock("We design brands that people remember.", {
          fontSize: 56,
          color: "#0f172a",
          highlight: "remember",
          highlightColor: "#2563eb",
        }),
        spacerBlock(20),
        subBlock("Strategy, design, and development under one roof.", {
          color: "#64748b",
        }),
        spacerBlock(32),
        btnsBlock([
          btn("Our Work", "#", "#2563eb", "#fff", {
            hoverBg: "#1d4ed8",
            borderRadius: 8,
          }),
          btn("Get in Touch", "#", "transparent", "#2563eb", {
            style: "outline",
            hoverBg: "#2563eb",
            hoverColor: "#fff",
            borderRadius: 8,
          }),
        ]),
        spacerBlock(40),
        imageBlock({ borderRadius: 20 }),
      ]),
  },

  // ── 3. Startup Bold ──────────────────────────────────────────────────────
  {
    id: "startup-bold",
    name: "Startup Bold",
    thumb: "🚀",
    category: "Startup",
    bg: {
      bgType: "gradient",
      bg: "#000",
      bgGradient: {
        from: "#000000",
        to: "#0a0a2e",
        direction: "to bottom",
        intensity: 100,
      },
      animatedBg: {
        enabled: true,
        preset: "orbs",
        color: "#a855f7",
        density: 60,
        speed: 30,
        size: 80,
        glow: 70,
        count: 60,
      },
      headingFont: "Outfit",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        headingBlock("The future of work\nstarts here.", {
          fontSize: 80,
          highlight: "future",
          highlightColor: "#a855f7",
        }),
        spacerBlock(24),
        subBlock("Join 50,000+ teams already building on our platform.", {
          fontSize: 20,
          color: "rgba(255,255,255,0.6)",
        }),
        spacerBlock(40),
        btnsBlock([
          btn("Get Early Access", "#", "#a855f7", "#fff", {
            hoverBg: "#9333ea",
            borderRadius: 100,
          }),
        ]),
        spacerBlock(48),
        statsBlock(
          [
            { value: "50K+", label: "Teams" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9★", label: "Rating" },
          ],
          {
            columns: 3,
            bg: "rgba(168,85,247,0.1)",
            borderColor: "rgba(168,85,247,0.2)",
            valueColor: "#c084fc",
          },
        ),
      ]),
  },

  // ── 4. Portfolio ─────────────────────────────────────────────────────────
  {
    id: "portfolio",
    name: "Portfolio",
    thumb: "🎨",
    category: "Personal",
    bg: {
      bgType: "solid",
      bg: "#fafaf9",
      animatedBg: { enabled: false },
      headingFont: "Montserrat",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Available for hire", { bg: "#f0fdf4", color: "#16a34a" }),
        spacerBlock(16),
        headingBlock("Designer &\nDeveloper.", {
          fontSize: 64,
          color: "#1c1917",
          highlight: "Developer",
          highlightColor: "#ea580c",
        }),
        spacerBlock(20),
        subBlock(
          "I craft beautiful digital experiences with clean code and bold design.",
          { color: "#78716c" },
        ),
        spacerBlock(32),
        btnsBlock([
          btn("View Work", "#", "#1c1917", "#fff", {
            hoverBg: "#ea580c",
            borderRadius: 8,
          }),
          btn("Download CV", "#", "transparent", "#1c1917", {
            style: "outline",
            hoverBg: "#1c1917",
            hoverColor: "#fff",
            borderRadius: 8,
          }),
        ]),
        spacerBlock(40),
        imageBlock({ borderRadius: 24 }),
      ]),
  },

  // ── 5. SaaS Light ────────────────────────────────────────────────────────
  {
    id: "saas-light",
    name: "SaaS Light",
    thumb: "☀️",
    category: "SaaS",
    bg: {
      bgType: "solid",
      bg: "#f8fafc",
      animatedBg: {
        enabled: true,
        preset: "mesh",
        color: "#2563eb",
        density: 40,
        speed: 30,
        size: 60,
        glow: 40,
        count: 40,
      },
      headingFont: "DM Sans",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Trusted by 10,000+ teams", {
          bg: "#eff6ff",
          color: "#2563eb",
        }),
        spacerBlock(16),
        headingBlock("Analytics that actually make sense.", {
          fontSize: 60,
          color: "#0f172a",
          highlight: "make sense",
          highlightColor: "#2563eb",
        }),
        spacerBlock(20),
        subBlock("Turn raw data into decisions your whole team can act on.", {
          color: "#64748b",
        }),
        spacerBlock(32),
        btnsBlock([
          btn("Try it free", "#", "#2563eb", "#fff", {
            hoverBg: "#1d4ed8",
            borderRadius: 10,
          }),
          btn("Book a demo", "#", "transparent", "#2563eb", {
            style: "ghost",
            hoverBg: "#eff6ff",
            hoverColor: "#1d4ed8",
            borderRadius: 10,
          }),
        ]),
        spacerBlock(48),
        imageBlock({ borderRadius: 16 }),
      ]),
  },

  // ── 6. E-Commerce ────────────────────────────────────────────────────────
  {
    id: "ecommerce",
    name: "E-Commerce",
    thumb: "🛍️",
    category: "Commerce",
    bg: {
      bgType: "solid",
      bg: "#fff7ed",
      animatedBg: { enabled: false },
      headingFont: "Raleway",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Summer Collection 2025", {
          bg: "#ffedd5",
          color: "#ea580c",
        }),
        spacerBlock(16),
        headingBlock("Style that speaks for itself.", {
          fontSize: 54,
          color: "#1c1917",
          highlight: "speaks",
          highlightColor: "#ea580c",
        }),
        spacerBlock(20),
        subBlock("New arrivals every week. Free shipping on orders over $50.", {
          color: "#78716c",
        }),
        spacerBlock(32),
        btnsBlock([
          btn("Shop Now", "#", "#ea580c", "#fff", {
            hoverBg: "#c2410c",
            borderRadius: 100,
          }),
          btn("Browse All", "#", "transparent", "#ea580c", {
            style: "outline",
            hoverBg: "#ea580c",
            hoverColor: "#fff",
            borderRadius: 100,
          }),
        ]),
        spacerBlock(40),
        imageBlock({ borderRadius: 32 }),
      ]),
  },

  // ── 7. Nonprofit ─────────────────────────────────────────────────────────
  {
    id: "nonprofit",
    name: "Nonprofit",
    thumb: "💚",
    category: "Nonprofit",
    bg: {
      bgType: "gradient",
      bg: "#052e16",
      bgGradient: {
        from: "#052e16",
        to: "#14532d",
        direction: "to bottom right",
        intensity: 100,
      },
      animatedBg: {
        enabled: true,
        preset: "stars",
        color: "#4ade80",
        density: 50,
        speed: 20,
        size: 50,
        glow: 60,
        count: 50,
      },
      headingFont: "Raleway",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Making a difference", {
          bg: "rgba(74,222,128,0.15)",
          color: "#4ade80",
        }),
        spacerBlock(16),
        headingBlock("Every donation changes a life.", {
          fontSize: 62,
          highlight: "changes",
          highlightColor: "#4ade80",
        }),
        spacerBlock(20),
        subBlock("Help us reach 1 million families by the end of this year.", {
          fontSize: 19,
          color: "rgba(240,253,244,0.7)",
        }),
        spacerBlock(32),
        btnsBlock([
          btn("Donate Now", "#", "#4ade80", "#052e16", {
            hoverBg: "#22c55e",
            borderRadius: 100,
          }),
          btn("Learn More", "#", "transparent", "#4ade80", {
            style: "outline",
            hoverBg: "#4ade80",
            hoverColor: "#052e16",
            borderRadius: 100,
          }),
        ]),
        spacerBlock(48),
        statsBlock(
          [
            { value: "1M", label: "Goal Families" },
            { value: "60+", label: "Countries" },
            { value: "$2M", label: "Raised" },
          ],
          {
            columns: 3,
            valueColor: "#4ade80",
            bg: "rgba(74,222,128,0.08)",
            borderColor: "rgba(74,222,128,0.2)",
          },
        ),
      ]),
  },

  // ── 8. Text + Gallery Bottom ─────────────────────────────────────────────
  {
    id: "text-gallery-bottom",
    name: "Text + Gallery",
    thumb: "📸",
    category: "Creative",
    bg: {
      bgType: "solid",
      bg: "#0f172a",
      animatedBg: { enabled: false },
      headingFont: "Syne",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Featured Work", {
          bg: "rgba(99,102,241,0.15)",
          color: "#818cf8",
        }),
        spacerBlock(16),
        headingBlock("Work that\nspeaks louder.", {
          fontSize: 68,
          highlight: "louder",
          highlightColor: "#818cf8",
        }),
        spacerBlock(20),
        subBlock(
          "Scroll through our latest projects and creative experiments.",
          { color: "rgba(241,245,249,0.6)" },
        ),
        spacerBlock(32),
        btnsBlock([
          btn("View All Projects", "#", "#6366f1", "#fff", {
            hoverBg: "#4f46e5",
            borderRadius: 10,
          }),
        ]),
        spacerBlock(48),
        galleryBlock({
          speed: 35,
          imageHeight: 220,
          borderRadius: 12,
          shadow: true,
          grayscaleHover: true,
        }),
      ]),
  },

  // ── 9. Gallery Middle (logos) ─────────────────────────────────────────────
  {
    id: "gallery-logos",
    name: "Gallery Middle",
    thumb: "🎭",
    category: "SaaS",
    bg: {
      bgType: "solid",
      bg: "#ffffff",
      animatedBg: { enabled: false },
      headingFont: "Outfit",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Trusted by the best", { bg: "#f0f9ff", color: "#0284c7" }),
        spacerBlock(16),
        headingBlock("Trusted by the\nworld's best teams.", {
          fontSize: 58,
          color: "#0f172a",
          highlight: "best teams",
          highlightColor: "#0284c7",
        }),
        spacerBlock(20),
        subBlock("Join 10,000+ companies that rely on us every day.", {
          color: "#64748b",
        }),
        spacerBlock(32),
        galleryBlock({
          speed: 50,
          imageHeight: 60,
          gap: 40,
          borderRadius: 0,
          objectFit: "contain",
          grayscaleHover: true,
        }),
        spacerBlock(32),
        btnsBlock([
          btn("Join Them", "#", "#0284c7", "#fff", {
            hoverBg: "#0369a1",
            borderRadius: 8,
          }),
          btn("Case Studies", "#", "transparent", "#0284c7", {
            style: "ghost",
            hoverBg: "#f0f9ff",
            hoverColor: "#0369a1",
            borderRadius: 8,
          }),
        ]),
      ]),
  },

  // ── 10. Minimal Waves ────────────────────────────────────────────────────
  {
    id: "minimal-waves",
    name: "Minimal",
    thumb: "🌊",
    category: "Minimal",
    bg: {
      bgType: "gradient",
      bg: "#0c0a09",
      bgGradient: {
        from: "#0c0a09",
        to: "#1c1917",
        direction: "to bottom",
        intensity: 100,
      },
      animatedBg: {
        enabled: true,
        preset: "waves",
        color: "#f97316",
        density: 40,
        speed: 25,
        size: 60,
        glow: 50,
        count: 40,
      },
      headingFont: "Playfair Display",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        headingBlock("Less noise.\nMore impact.", {
          fontSize: 84,
          highlight: "impact",
          highlightColor: "#f97316",
        }),
        spacerBlock(40),
        btnsBlock([
          btn("Get Started", "#", "#f97316", "#fff", {
            hoverBg: "#ea580c",
            borderRadius: 4,
          }),
        ]),
      ]),
  },

  // ── 11. Heading + Stats ──────────────────────────────────────────────────
  {
    id: "heading-stats",
    name: "Heading + Stats",
    thumb: "📊",
    category: "SaaS",
    bg: {
      bgType: "solid",
      bg: "#0f172a",
      animatedBg: {
        enabled: true,
        preset: "grid",
        color: "#6366f1",
        density: 30,
        speed: 15,
        size: 50,
        glow: 40,
        count: 30,
      },
      headingFont: "Syne",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("By the numbers", {
          bg: "rgba(99,102,241,0.15)",
          color: "#818cf8",
        }),
        spacerBlock(16),
        headingBlock("Results you can\nmeasure.", {
          fontSize: 58,
          highlight: "measure",
          highlightColor: "#818cf8",
        }),
        spacerBlock(20),
        subBlock("Real metrics from real customers who trust our platform.", {
          color: "rgba(241,245,249,0.6)",
        }),
        spacerBlock(40),
        statsBlock(
          [
            { value: "99.9%", label: "Uptime SLA" },
            { value: "4.9★", label: "Avg Rating" },
            { value: "50K+", label: "Active Teams" },
            { value: "2min", label: "Avg Setup" },
          ],
          {
            columns: 4,
            valueColor: "#818cf8",
            bg: "rgba(99,102,241,0.1)",
            borderColor: "rgba(99,102,241,0.2)",
          },
        ),
        spacerBlock(32),
        btnsBlock([
          btn("See Full Report", "#", "#6366f1", "#fff", {
            hoverBg: "#4f46e5",
            borderRadius: 8,
          }),
        ]),
      ]),
  },

  // ── 12. App Landing ──────────────────────────────────────────────────────
  {
    id: "app-landing",
    name: "App Landing",
    thumb: "📱",
    category: "Mobile",
    bg: {
      bgType: "solid",
      bg: "#f0f9ff",
      animatedBg: { enabled: false },
      headingFont: "DM Sans",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        imageBlock({ borderRadius: 24, maxWidth: 600 }),
        spacerBlock(32),
        badgeBlock("Now on iOS & Android", { bg: "#e0f2fe", color: "#0284c7" }),
        spacerBlock(12),
        headingBlock("Your productivity\nsupercharged.", {
          fontSize: 54,
          color: "#0f172a",
          highlight: "supercharged",
          highlightColor: "#0284c7",
        }),
        spacerBlock(16),
        subBlock(
          "The app millions of people use to get more done in less time.",
          { color: "#475569" },
        ),
        spacerBlock(28),
        btnsBlock([
          btn("Download Free", "#", "#0284c7", "#fff", {
            hoverBg: "#0369a1",
            borderRadius: 12,
          }),
          btn("Watch Demo", "#", "transparent", "#0284c7", {
            style: "ghost",
            hoverBg: "#e0f2fe",
            hoverColor: "#0369a1",
            borderRadius: 12,
          }),
        ]),
        spacerBlock(24),
        iconrowBlock(
          [
            { icon: "⚡", label: "Lightning fast" },
            { icon: "🔒", label: "Privacy first" },
            { icon: "☁️", label: "Syncs everywhere" },
          ],
          { labelColor: "#475569" },
        ),
      ]),
  },

  // ── 13. Image Overlay ────────────────────────────────────────────────────
  {
    id: "image-overlay",
    name: "Image Overlay",
    thumb: "🖼️",
    category: "Creative",
    bg: {
      bgType: "image",
      bg: "#000",
      bgImage: "",
      bgImageOverlay: "rgba(0,0,0,0.55)",
      animatedBg: { enabled: false },
      headingFont: "Montserrat",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        headingBlock("A story worth\ntelling.", {
          fontSize: 76,
          highlight: "story",
          highlightColor: "#fbbf24",
        }),
        spacerBlock(20),
        subBlock(
          "Set a powerful background image and let the visuals do the talking.",
          { fontSize: 20, color: "rgba(255,255,255,0.8)" },
        ),
        spacerBlock(36),
        btnsBlock([
          btn("Get Started", "#", "#fbbf24", "#000", {
            hoverBg: "#f59e0b",
            borderRadius: 6,
          }),
          btn("Watch Video", "#", "transparent", "#fff", {
            style: "outline",
            hoverBg: "#fff",
            hoverColor: "#000",
            borderRadius: 6,
          }),
        ]),
      ]),
  },

  // ── 14. Feature Icons ────────────────────────────────────────────────────
  {
    id: "feature-icons",
    name: "Feature Icons",
    thumb: "✦",
    category: "SaaS",
    bg: {
      bgType: "gradient",
      bg: "#0f172a",
      bgGradient: {
        from: "#0f172a",
        to: "#1e293b",
        direction: "to bottom right",
        intensity: 100,
      },
      animatedBg: {
        enabled: true,
        preset: "particles",
        color: "#38bdf8",
        density: 30,
        speed: 25,
        size: 40,
        glow: 50,
        count: 40,
      },
      headingFont: "Syne",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        badgeBlock("Platform", {
          bg: "rgba(56,189,248,0.15)",
          color: "#38bdf8",
        }),
        spacerBlock(12),
        headingBlock("One platform.\nEndless possibilities.", {
          fontSize: 54,
          highlight: "Endless",
          highlightColor: "#38bdf8",
        }),
        spacerBlock(16),
        subBlock("Streamline your workflow from day one.", {
          color: "rgba(241,245,249,0.6)",
        }),
        spacerBlock(32),
        iconrowBlock(
          [
            { icon: "🚀", label: "Fast Deploy" },
            { icon: "🔒", label: "Enterprise Sec" },
            { icon: "📊", label: "Analytics" },
            { icon: "🤝", label: "Team Collab" },
          ],
          { labelColor: "rgba(241,245,249,0.7)", gap: 36 },
        ),
        spacerBlock(32),
        btnsBlock([
          btn("Get Started", "#", "#38bdf8", "#0f172a", {
            hoverBg: "#0ea5e9",
            borderRadius: 8,
          }),
        ]),
      ]),
  },

  // ── 15. Creative Studio ──────────────────────────────────────────────────
  {
    id: "creative-studio",
    name: "Creative Studio",
    thumb: "🏞️",
    category: "Creative",
    bg: {
      bgType: "solid",
      bg: "#fafaf9",
      animatedBg: { enabled: false },
      headingFont: "Raleway",
      bodyFont: "Inter",
    },
    blocks: () =>
      stamp([
        galleryBlock({
          speed: 45,
          direction: "right",
          imageHeight: 180,
          borderRadius: 8,
        }),
        spacerBlock(40),
        badgeBlock("Creative Studio", { bg: "#fff7ed", color: "#ea580c" }),
        spacerBlock(12),
        headingBlock("We make things\npeople love.", {
          fontSize: 62,
          color: "#1c1917",
          highlight: "love",
          highlightColor: "#ea580c",
        }),
        spacerBlock(16),
        subBlock("Award-winning design for brands that dare to be different.", {
          color: "#78716c",
        }),
        spacerBlock(32),
        btnsBlock([
          btn("Start a Project", "#", "#ea580c", "#fff", {
            hoverBg: "#c2410c",
            borderRadius: 100,
          }),
          btn("Our Work", "#", "transparent", "#ea580c", {
            style: "outline",
            hoverBg: "#ea580c",
            hoverColor: "#fff",
            borderRadius: 100,
          }),
        ]),
      ]),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CAROUSEL PRESETS  (20+ carousel block configs)
// ═══════════════════════════════════════════════════════════════════════════════
const mkSlide = (heading, sub, btnLabel, btnBg, btnColor, opts = {}) => ({
  id: uid(),
  heading,
  headingColor: opts.headingColor || "#fff",
  subheading: sub,
  subheadingColor: opts.subheadingColor || "rgba(255,255,255,0.65)",
  showText: true,
  buttons: btnLabel
    ? [btn(btnLabel, "#", btnBg, btnColor, opts.btnOpts || {})]
    : [],
  badge: opts.badge || { show: false },
  image: { show: opts.showImage ?? false, url: opts.imageUrl || "" },
});

export const CAROUSEL_PRESETS = [
  // 1
  {
    id: "c-fade-dark",
    name: "Fade Dark",
    thumb: "🌑",
    category: "Minimal",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Welcome to our platform",
            "The best place to build your next project.",
            "Get Started",
            "#6366f1",
            "#fff",
            { btnOpts: { borderRadius: 10 } },
          ),
          mkSlide(
            "Powerful features built in",
            "Everything you need, nothing you don't.",
            "Explore",
            "#818cf8",
            "#fff",
            { btnOpts: { borderRadius: 10 } },
          ),
          mkSlide(
            "Ready to get started?",
            "Join thousands of teams already using our platform.",
            "Sign Up Free",
            "#22d3ee",
            "#0f172a",
            { btnOpts: { borderRadius: 10 } },
          ),
        ],
        {
          animation: "fade",
          autoPlay: true,
          interval: 4000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 2
  {
    id: "c-slide-light",
    name: "Slide Light",
    thumb: "☀️",
    category: "Minimal",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Clean & Simple",
            "A light theme carousel for modern sites.",
            "Learn More",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Beautiful Layouts",
            "Designed for clarity and conversion.",
            "Get Started",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Ship with Confidence",
            "Built-in quality, from day one.",
            "Try Free",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              btnOpts: { borderRadius: 8 },
            },
          ),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 3500,
          showArrows: true,
          showDots: true,
          theme: "light",
          itemsPerView: 1,
        },
      ),
  },
  // 3
  {
    id: "c-zoom-neon",
    name: "Zoom Neon",
    thumb: "⚡",
    category: "Bold",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Break the Mold",
            "Neon zoom carousel for bold brands.",
            "Enter",
            "#a855f7",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
          mkSlide(
            "Move Faster",
            "Speed is a feature. Make it yours.",
            "Go",
            "#ec4899",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
          mkSlide(
            "Stand Out",
            "Don't blend in when you were born to stand out.",
            "Start",
            "#f97316",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
        ],
        {
          animation: "zoom",
          autoPlay: true,
          interval: 3000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 4
  {
    id: "c-trio-cards",
    name: "Trio Cards",
    thumb: "🃏🃏🃏",
    category: "Cards",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Feature One",
            "A quick description of this card feature.",
            "",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              showImage: true,
            },
          ),
          mkSlide(
            "Feature Two",
            "Another feature with a brief explanation.",
            "",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              showImage: true,
            },
          ),
          mkSlide(
            "Feature Three",
            "Yet another highlight worth showcasing.",
            "",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              showImage: true,
            },
          ),
          mkSlide(
            "Feature Four",
            "One more excellent point to drive home.",
            "",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              showImage: true,
            },
          ),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 4000,
          showArrows: true,
          showDots: true,
          theme: "light",
          itemsPerView: 3,
          gap: 20,
          imageAspectW: 4,
          imageAspectH: 3,
          imageBorderRadius: 12,
          imageShadow: false,
        },
      ),
  },
  // 5
  {
    id: "c-media-reel",
    name: "Media Reel",
    thumb: "📽️",
    category: "Media",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Campaign One",
            "A bold visual story.",
            "View Project",
            "#ef4444",
            "#fff",
            {
              showImage: true,
              badge: {
                show: true,
                text: "Featured",
                bg: "rgba(239,68,68,0.2)",
                color: "#f87171",
              },
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Campaign Two",
            "Fresh perspectives, every time.",
            "Explore",
            "#22c55e",
            "#fff",
            {
              showImage: true,
              badge: {
                show: true,
                text: "New",
                bg: "rgba(34,197,94,0.2)",
                color: "#4ade80",
              },
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Campaign Three",
            "Innovation at every step.",
            "Discover",
            "#a855f7",
            "#fff",
            { showImage: true, btnOpts: { borderRadius: 8 } },
          ),
        ],
        {
          animation: "fade",
          autoPlay: true,
          interval: 5000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
          imageAspectW: 16,
          imageAspectH: 7,
          imageBorderRadius: 12,
          imageShadow: true,
        },
      ),
  },
  // 6
  {
    id: "c-duo-cards",
    name: "Duo Cards",
    thumb: "🃏🃏",
    category: "Cards",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Product Alpha",
            "Our flagship solution.",
            "Buy Now",
            "#059669",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              showImage: true,
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Product Beta",
            "The lean startup edition.",
            "Learn More",
            "#059669",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              showImage: true,
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Product Gamma",
            "Enterprise power, startup price.",
            "Contact",
            "#059669",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              showImage: true,
              btnOpts: { borderRadius: 8 },
            },
          ),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 4500,
          showArrows: true,
          showDots: true,
          theme: "light",
          itemsPerView: 2,
          gap: 24,
          imageAspectW: 4,
          imageAspectH: 3,
          imageBorderRadius: 16,
          imageShadow: true,
        },
      ),
  },
  // 7
  {
    id: "c-blur-trans",
    name: "Blur Transition",
    thumb: "🌫️",
    category: "Cinematic",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Scene One",
            "Where every frame tells a story.",
            "Watch",
            "#f59e0b",
            "#000",
            { btnOpts: { borderRadius: 4 } },
          ),
          mkSlide(
            "Scene Two",
            "Crafted for the cinematic eye.",
            "Explore",
            "#f59e0b",
            "#000",
            { btnOpts: { borderRadius: 4 } },
          ),
          mkSlide(
            "Scene Three",
            "Motion that moves people.",
            "Begin",
            "#f59e0b",
            "#000",
            { btnOpts: { borderRadius: 4 } },
          ),
        ],
        {
          animation: "zoom",
          autoPlay: true,
          interval: 5000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 8
  {
    id: "c-testimonials",
    name: "Testimonials",
    thumb: "💬",
    category: "Social Proof",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            '"Game changer for our team"',
            '"We shipped 3x faster after switching. I can\'t imagine going back."  — Alex R., CTO',
            "",
            "#2563eb",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#475569",
              fontSize: 28,
            },
          ),
          mkSlide(
            '"Simply the best tool"',
            '"Intuitive, powerful, and the support team is incredible."  — Maria S., Head of Product',
            "",
            "#2563eb",
            "#fff",
            { headingColor: "#0f172a", subheadingColor: "#475569" },
          ),
          mkSlide(
            '"ROI within 2 weeks"',
            '"Our conversion rate jumped 40% in the first month."  — James K., Founder',
            "",
            "#2563eb",
            "#fff",
            { headingColor: "#0f172a", subheadingColor: "#475569" },
          ),
        ],
        {
          animation: "fade",
          autoPlay: true,
          interval: 6000,
          showArrows: false,
          showDots: true,
          theme: "light",
          itemsPerView: 1,
        },
      ),
  },
  // 9
  {
    id: "c-badge-slides",
    name: "Badge Slides",
    thumb: "🏷️",
    category: "SaaS",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Launch Faster",
            "Go from idea to deploy in hours, not weeks.",
            "Start",
            "#6366f1",
            "#fff",
            {
              badge: {
                show: true,
                text: "Step 1",
                bg: "rgba(99,102,241,0.2)",
                color: "#a5b4fc",
              },
              btnOpts: { borderRadius: 10 },
            },
          ),
          mkSlide(
            "Scale Effortlessly",
            "Auto-scaling infrastructure with zero config.",
            "Scale",
            "#8b5cf6",
            "#fff",
            {
              badge: {
                show: true,
                text: "Step 2",
                bg: "rgba(139,92,246,0.2)",
                color: "#c4b5fd",
              },
              btnOpts: { borderRadius: 10 },
            },
          ),
          mkSlide(
            "Grow Revenue",
            "Built-in analytics, A/B tests, and conversion tools.",
            "Grow",
            "#a855f7",
            "#fff",
            {
              badge: {
                show: true,
                text: "Step 3",
                bg: "rgba(168,85,247,0.2)",
                color: "#d8b4fe",
              },
              btnOpts: { borderRadius: 10 },
            },
          ),
        ],
        {
          animation: "slide",
          autoPlay: false,
          interval: 4000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 10
  {
    id: "c-four-grid",
    name: "4-Card Grid",
    thumb: "▦",
    category: "Cards",
    block: () =>
      carouselBlock(
        [
          mkSlide("Design", "Beautiful by default.", "", "", "", {
            headingColor: "#0f172a",
            subheadingColor: "#64748b",
            showImage: true,
          }),
          mkSlide("Develop", "Clean code, fast builds.", "", "", "", {
            headingColor: "#0f172a",
            subheadingColor: "#64748b",
            showImage: true,
          }),
          mkSlide("Deploy", "One click to production.", "", "", "", {
            headingColor: "#0f172a",
            subheadingColor: "#64748b",
            showImage: true,
          }),
          mkSlide("Delight", "Users love it.", "", "", "", {
            headingColor: "#0f172a",
            subheadingColor: "#64748b",
            showImage: true,
          }),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 3500,
          showArrows: true,
          showDots: true,
          theme: "light",
          itemsPerView: 4,
          gap: 16,
          imageAspectW: 1,
          imageAspectH: 1,
          imageBorderRadius: 12,
          imageShadow: false,
        },
      ),
  },
  // 11
  {
    id: "c-hero-split",
    name: "Hero Split Slides",
    thumb: "🔀",
    category: "Split",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Left Content, Right Image",
            "A natural reading flow that converts.",
            "See It",
            "#2563eb",
            "#fff",
            { showImage: true, btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Story Meets Visuals",
            "Pair your narrative with stunning imagery.",
            "Explore",
            "#2563eb",
            "#fff",
            { showImage: true, btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Sell The Vision",
            "Great visuals do half the selling for you.",
            "Buy Now",
            "#2563eb",
            "#fff",
            { showImage: true, btnOpts: { borderRadius: 8 } },
          ),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 5000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
          imageAspectW: 16,
          imageAspectH: 9,
          imageBorderRadius: 16,
          imageShadow: true,
        },
      ),
  },
  // 12
  {
    id: "c-minimal-dots",
    name: "Minimal Dots",
    thumb: "⚬⚬⚬",
    category: "Minimal",
    block: () =>
      carouselBlock(
        [
          mkSlide("Clarity", "Simplified. Focused. Yours.", "", "", "", {
            headingColor: "#0f172a",
            subheadingColor: "#64748b",
          }),
          mkSlide("Simplicity", "Remove what doesn't matter.", "", "", "", {
            headingColor: "#0f172a",
            subheadingColor: "#64748b",
          }),
          mkSlide("Impact", "Do more with less.", "", "", "", {
            headingColor: "#0f172a",
            subheadingColor: "#64748b",
          }),
        ],
        {
          animation: "fade",
          autoPlay: true,
          interval: 3000,
          showArrows: false,
          showDots: true,
          theme: "light",
          itemsPerView: 1,
        },
      ),
  },
  // 13
  {
    id: "c-orange-energy",
    name: "Energy Bold",
    thumb: "🔥",
    category: "Bold",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Ignite Your Growth",
            "Fuel your business with real momentum.",
            "Start Now",
            "#f97316",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
          mkSlide(
            "Burn Brighter",
            "Every feature designed to amplify your impact.",
            "Join",
            "#fb923c",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
          mkSlide(
            "Unstoppable",
            "The energy your brand deserves.",
            "Go",
            "#ea580c",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
        ],
        {
          animation: "zoom",
          autoPlay: true,
          interval: 3500,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 14
  {
    id: "c-teal-minimal",
    name: "Teal Minimal",
    thumb: "🩵",
    category: "Minimal",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Fresh Perspective",
            "Modern products need modern storytelling.",
            "Discover",
            "#14b8a6",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Clean by Design",
            "Clarity is a feature, not an afterthought.",
            "Explore",
            "#0d9488",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Built to Last",
            "Robust foundations, beautiful surfaces.",
            "Learn More",
            "#0f766e",
            "#fff",
            {
              headingColor: "#0f172a",
              subheadingColor: "#64748b",
              btnOpts: { borderRadius: 8 },
            },
          ),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 4000,
          showArrows: true,
          showDots: true,
          theme: "light",
          itemsPerView: 1,
        },
      ),
  },
  // 15
  {
    id: "c-image-widescreen",
    name: "Widescreen Film",
    thumb: "🎬",
    category: "Cinematic",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Act One",
            "The beginning of something extraordinary.",
            "Begin",
            "#fff",
            "#0f172a",
            {
              showImage: true,
              badge: {
                show: true,
                text: "Chapter 1",
                bg: "rgba(255,255,255,0.15)",
                color: "#fff",
              },
              btnOpts: { borderRadius: 0 },
            },
          ),
          mkSlide(
            "Act Two",
            "The tension builds. The stakes rise.",
            "Continue",
            "#fff",
            "#0f172a",
            {
              showImage: true,
              badge: {
                show: true,
                text: "Chapter 2",
                bg: "rgba(255,255,255,0.15)",
                color: "#fff",
              },
              btnOpts: { borderRadius: 0 },
            },
          ),
          mkSlide(
            "Act Three",
            "The resolution you've been waiting for.",
            "Finish",
            "#fff",
            "#0f172a",
            {
              showImage: true,
              badge: {
                show: true,
                text: "Chapter 3",
                bg: "rgba(255,255,255,0.15)",
                color: "#fff",
              },
              btnOpts: { borderRadius: 0 },
            },
          ),
        ],
        {
          animation: "fade",
          autoPlay: false,
          interval: 6000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
          imageAspectW: 21,
          imageAspectH: 9,
          imageBorderRadius: 0,
          imageShadow: false,
        },
      ),
  },
  // 16
  {
    id: "c-pink-bold",
    name: "Pink Bold",
    thumb: "🌸",
    category: "Bold",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Dare to Be Different",
            "Pink. Bold. Unapologetic.",
            "Start",
            "#ec4899",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
          mkSlide(
            "Own Your Brand",
            "A voice that cuts through the noise.",
            "Own It",
            "#db2777",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
          mkSlide(
            "Stand Out",
            "The world needs your authentic self.",
            "Join",
            "#be185d",
            "#fff",
            { btnOpts: { borderRadius: 100 } },
          ),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 3000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 17
  {
    id: "c-green-eco",
    name: "Eco Green",
    thumb: "🌿",
    category: "Nonprofit",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Protect What Matters",
            "Our planet needs your voice.",
            "Act Now",
            "#22c55e",
            "#fff",
            { btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Every Action Counts",
            "Small changes create massive impact.",
            "Learn",
            "#16a34a",
            "#fff",
            { btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Build a Better Tomorrow",
            "The future is built by people like you.",
            "Join",
            "#15803d",
            "#fff",
            { btnOpts: { borderRadius: 8 } },
          ),
        ],
        {
          animation: "fade",
          autoPlay: true,
          interval: 5000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 18
  {
    id: "c-auto-no-arrows",
    name: "Auto Scroll",
    thumb: "🔄",
    category: "Minimal",
    block: () =>
      carouselBlock(
        [
          mkSlide("One", "Always moving forward.", "", "", "", {
            headingColor: "#fff",
          }),
          mkSlide("Two", "Never looking back.", "", "", "", {
            headingColor: "#fff",
          }),
          mkSlide("Three", "Always improving.", "", "", "", {
            headingColor: "#fff",
          }),
          mkSlide("Four", "Always shipping.", "", "", "", {
            headingColor: "#fff",
          }),
        ],
        {
          animation: "slide",
          autoPlay: true,
          interval: 2000,
          showArrows: false,
          showDots: false,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 19
  {
    id: "c-gold-luxury",
    name: "Gold Luxury",
    thumb: "✨",
    category: "Premium",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Crafted to Perfection",
            "Where luxury meets function.",
            "Discover",
            "#d97706",
            "#fff",
            { btnOpts: { borderRadius: 0, style: "outline" } },
          ),
          mkSlide(
            "Timeless Design",
            "Built for those who appreciate excellence.",
            "Explore",
            "#b45309",
            "#fff",
            { btnOpts: { borderRadius: 0, style: "outline" } },
          ),
          mkSlide(
            "Yours to Own",
            "An experience unlike any other.",
            "Inquire",
            "#92400e",
            "#fff",
            { btnOpts: { borderRadius: 0, style: "outline" } },
          ),
        ],
        {
          animation: "fade",
          autoPlay: true,
          interval: 6000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 20
  {
    id: "c-five-steps",
    name: "5-Step Process",
    thumb: "1️⃣2️⃣3️⃣",
    category: "SaaS",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Step 1: Sign Up",
            "Create your account in 30 seconds — no card needed.",
            "Next →",
            "#6366f1",
            "#fff",
            {
              badge: {
                show: true,
                text: "01 / 05",
                bg: "rgba(99,102,241,0.2)",
                color: "#a5b4fc",
              },
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Step 2: Configure",
            "Set up your workspace in minutes with our wizard.",
            "Next →",
            "#6366f1",
            "#fff",
            {
              badge: {
                show: true,
                text: "02 / 05",
                bg: "rgba(99,102,241,0.2)",
                color: "#a5b4fc",
              },
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Step 3: Invite Team",
            "Bring everyone on board instantly.",
            "Next →",
            "#6366f1",
            "#fff",
            {
              badge: {
                show: true,
                text: "03 / 05",
                bg: "rgba(99,102,241,0.2)",
                color: "#a5b4fc",
              },
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Step 4: Launch",
            "Go live with one click.",
            "Next →",
            "#6366f1",
            "#fff",
            {
              badge: {
                show: true,
                text: "04 / 05",
                bg: "rgba(99,102,241,0.2)",
                color: "#a5b4fc",
              },
              btnOpts: { borderRadius: 8 },
            },
          ),
          mkSlide(
            "Step 5: Grow",
            "Watch your metrics soar from day one.",
            "Get Started",
            "#4f46e5",
            "#fff",
            {
              badge: {
                show: true,
                text: "05 / 05",
                bg: "rgba(99,102,241,0.2)",
                color: "#a5b4fc",
              },
              btnOpts: { borderRadius: 8 },
            },
          ),
        ],
        {
          animation: "slide",
          autoPlay: false,
          interval: 4000,
          showArrows: true,
          showDots: true,
          theme: "dark",
          itemsPerView: 1,
        },
      ),
  },
  // 21
  {
    id: "c-split-image-text",
    name: "Split Image+Text",
    thumb: "🖼️📝",
    category: "Split",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Our Story",
            "From a small garage to a global platform.",
            "Read More",
            "#0284c7",
            "#fff",
            { showImage: true, btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Our Mission",
            "Democratizing powerful software for everyone.",
            "Learn More",
            "#0284c7",
            "#fff",
            { showImage: true, btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Our Team",
            "World-class people doing world-class work.",
            "Meet Us",
            "#0284c7",
            "#fff",
            { showImage: true, btnOpts: { borderRadius: 8 } },
          ),
        ],
        {
          animation: "fade",
          autoPlay: true,
          interval: 5500,
          showArrows: true,
          showDots: true,
          theme: "light",
          itemsPerView: 1,
          imageAspectW: 16,
          imageAspectH: 9,
          imageBorderRadius: 12,
          imageShadow: true,
        },
      ),
  },
  // 22
  {
    id: "c-dark-accent",
    name: "Dark Accent",
    thumb: "🌐",
    category: "SaaS",
    block: () =>
      carouselBlock(
        [
          mkSlide(
            "Global Scale",
            "Deploy to 200+ regions instantly.",
            "Deploy",
            "#22d3ee",
            "#0f172a",
            { btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Zero Downtime",
            "99.99% uptime. Always online.",
            "Explore",
            "#22d3ee",
            "#0f172a",
            { btnOpts: { borderRadius: 8 } },
          ),
          mkSlide(
            "Built for Teams",
            "Real-time collaboration across the globe.",
            "Try Free",
            "#22d3ee",
            "#0f172a",
            { btnOpts: { borderRadius: 8 } },
          ),
        ],
        {
          animation: "zoom",
          autoPlay: true,
          interval: 4000,
          showArrows: true,
          showDots: true,
          theme: "accent",
          itemsPerView: 1,
        },
      ),
  },
];

// ─── Block-level preset groups ────────────────────────────────────────────────
export const BLOCK_PRESETS = {
  heading: [
    {
      name: "Hero Heading",
      block: () => ({
        ...headingBlock("Your Headline Here", {
          fontSize: 72,
          highlight: "Headline",
          highlightColor: "#60a5fa",
        }),
        id: uid(),
      }),
    },
    {
      name: "Dark Heading",
      block: () => ({
        ...headingBlock("Bold Dark Text", { fontSize: 64, color: "#0f172a" }),
        id: uid(),
      }),
    },
    {
      name: "Gradient Text",
      block: () => ({
        ...headingBlock("Gradient Words", {
          fontSize: 64,
          highlight: "Gradient",
          highlightColor: "#a855f7",
        }),
        id: uid(),
      }),
    },
  ],
  subheading: [
    {
      name: "Standard Sub",
      block: () => ({
        ...subBlock(
          "A compelling subheading that supports your headline and drives action.",
          {},
        ),
        id: uid(),
      }),
    },
    {
      name: "Dark Sub",
      block: () => ({
        ...subBlock("Supporting text for light backgrounds.", {
          color: "#64748b",
        }),
        id: uid(),
      }),
    },
  ],
  badge: [
    {
      name: "Indigo Badge",
      block: () => ({
        ...badgeBlock("New Release", {
          bg: "rgba(99,102,241,0.15)",
          color: "#818cf8",
        }),
        id: uid(),
      }),
    },
    {
      name: "Green Badge",
      block: () => ({
        ...badgeBlock("Available Now", { bg: "#f0fdf4", color: "#16a34a" }),
        id: uid(),
      }),
    },
    {
      name: "Orange Badge",
      block: () => ({
        ...badgeBlock("Limited Time", { bg: "#fff7ed", color: "#ea580c" }),
        id: uid(),
      }),
    },
  ],
  buttons: [
    {
      name: "Primary + Outline",
      block: () => ({
        ...btnsBlock([
          btn("Get Started", "#", "#6366f1", "#fff", { hoverBg: "#4f46e5" }),
          btn("Learn More", "#", "transparent", "#6366f1", {
            style: "outline",
          }),
        ]),
        id: uid(),
      }),
    },
    {
      name: "Single CTA",
      block: () => ({
        ...btnsBlock([
          btn("Start Free Trial", "#", "#2563eb", "#fff", {
            hoverBg: "#1d4ed8",
            borderRadius: 100,
            size: "lg",
          }),
        ]),
        id: uid(),
      }),
    },
  ],
  stats: [
    {
      name: "3-Col Dark",
      block: () => ({
        ...statsBlock(
          [
            { value: "99.9%", label: "Uptime" },
            { value: "50K+", label: "Users" },
            { value: "4.9★", label: "Rating" },
          ],
          { columns: 3 },
        ),
        id: uid(),
      }),
    },
    {
      name: "4-Col Light",
      block: () => ({
        ...statsBlock(
          [
            { value: "1M+", label: "Downloads" },
            { value: "150+", label: "Countries" },
            { value: "24/7", label: "Support" },
            { value: "#1", label: "Ranked" },
          ],
          {
            columns: 4,
            valueColor: "#0f172a",
            labelColor: "#64748b",
            bg: "#f8fafc",
            borderColor: "#e2e8f0",
          },
        ),
        id: uid(),
      }),
    },
  ],
  iconrow: [
    {
      name: "3 Features",
      block: () => ({
        ...iconrowBlock([
          { icon: "⚡", label: "Fast" },
          { icon: "🔒", label: "Secure" },
          { icon: "☁️", label: "Cloud" },
        ]),
        id: uid(),
      }),
    },
    {
      name: "5 Features",
      block: () => ({
        ...iconrowBlock(
          [
            { icon: "🚀", label: "Launch" },
            { icon: "📊", label: "Analytics" },
            { icon: "🤝", label: "Collab" },
            { icon: "🔧", label: "Tools" },
            { icon: "💬", label: "Support" },
          ],
          { gap: 24 },
        ),
        id: uid(),
      }),
    },
  ],
};

// Legacy export kept for any existing imports
export const HERO_PRESETS = CANVAS_PRESETS;
