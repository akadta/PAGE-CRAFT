let _id = Date.now();
export const uid = () => ++_id;

// ─── shared animation default ────────────────────────────────────────────────
const anim = {
  enabled: false,
  type: "fadeUp", // fadeUp | fadeIn | slideLeft | slideRight | zoom | flip
  duration: 0.7,
  delay: 0,
  stagger: 0.15, // for list items
  triggerOnScroll: true,
};

// ─── shared bg ───────────────────────────────────────────────────────────────
const solidBg = (color = "#ffffff") => ({
  bgType: "solid", // solid | gradient | image | video
  bg: color,
  bgGradient: {
    from: "#2563eb",
    to: "#7c3aed",
    direction: "to right",
    intensity: 100,
  },
  bgImage: "",
  bgImageOverlay: "rgba(0,0,0,0.45)",
  bgVideo: "",
  bgFixed: false, // parallax
});

// ─── shared padding ──────────────────────────────────────────────────────────
const pad = (y = 80, x = 32) => ({ paddingY: y, paddingX: x });

// ─── shared typography ───────────────────────────────────────────────────────
const typo = (heading = "Inter", body = "Inter") => ({
  headingFont: heading,
  bodyFont: body,
  headingWeight: 700,
  bodyWeight: 400,
});

export const SECTION_DEFAULTS = {
  // ── NAVBAR ─────────────────────────────────────────────────────────────────
  navbar: {
    preset: "modern",
    transparent: false, // merge with hero: true = transparent over hero
    transparentScrolled: false, // becomes solid after scroll
    transparentScrollThreshold: 80,
    logo: {
      text: "Brand",
      fontSize: 22,
      fontWeight: 700,
      color: "#2563eb",
      showIcon: true,
      iconColor: "#2563eb",
      useImage: false,
      imageUrl: "",
      imageHeight: 36,
    },
    bg: "#ffffff",
    bgType: "solid",
    bgGradient: {
      from: "#2563eb",
      to: "#7c3aed",
      direction: "to right",
      intensity: 100,
    },
    textColor: "#0f172a",
    linkColor: "#374151",
    linkHoverColor: "#2563eb",
    accentColor: "#2563eb",
    height: 64,
    sticky: true,
    shadow: true,
    borderBottom: false,
    borderColor: "#e2e8f0",
    logoPosition: "left",
    linksPosition: "center",
    hamburgerStyle: "slide",
    hamburgerColor: "#0f172a",
    links: [
      {
        id: 1,
        label: "Home",
        url: "#",
        navTarget: "",
        hasSubmenu: false,
        children: [],
      },
      {
        id: 2,
        label: "About",
        url: "#about",
        navTarget: "about",
        hasSubmenu: false,
        children: [],
      },
      {
        id: 3,
        label: "Services",
        url: "#",
        navTarget: "",
        hasSubmenu: true,
        children: [
          { id: 31, label: "Web Design", url: "#web" },
          { id: 32, label: "Development", url: "#dev" },
        ],
      },
      {
        id: 4,
        label: "Contact",
        url: "#contact",
        navTarget: "contact",
        hasSubmenu: false,
        children: [],
      },
    ],
    buttons: [
      {
        id: 1,
        label: "Get Started",
        url: "#",
        style: "filled",
        bg: "#2563eb",
        color: "#ffffff",
        borderRadius: 8,
        size: "md",
      },
    ],
    padding: { x: 32, y: 0 },
    linkFontSize: 14,
    linkFontWeight: 500,
    linkSpacing: 28,
    borderRadius: 0,
    backdropBlur: false,
    mobileSubmenuDefaultOpen: false,
    fontFamily: "Inter",
    logoFontFamily: "Inter",
    submenuShowBullet: true,
    submenuBulletColor: "#2563eb",
    submenuBulletSize: 6,
    submenuHoverBg: "#eff6ff",
    submenuHoverColor: "#2563eb",
    submenuBg: "#ffffff",
    submenuTextColor: "#374151",
    submenuBorderColor: "#e8edf3",
  },

  // ── HERO ───────────────────────────────────────────────────────────────────
  hero: {
    navId: "home",
    variant: "centered", // centered | split-left | split-right | fullscreen | minimal
    ...solidBg("#0f172a"),
    bgType: "gradient",
    bgGradient: {
      from: "#0f172a",
      to: "#1e3a5f",
      direction: "to bottom right",
      intensity: 100,
    },
    ...pad(120, 32),
    ...typo("Plus Jakarta Sans", "Inter"),
    // Content
    badge: {
      show: true,
      text: "🚀 New Release",
      bg: "rgba(255,255,255,0.1)",
      color: "#fff",
    },
    heading: "Build Something\nAmazing Today",
    headingSize: 64,
    headingColor: "#ffffff",
    headingHighlight: "Amazing", // word to highlight
    headingHighlightColor: "#60a5fa",
    subheading:
      "The fastest way to launch your product. Beautiful, responsive, and production-ready.",
    subheadingSize: 18,
    subheadingColor: "rgba(255,255,255,0.7)",
    // Buttons
    buttons: [
      {
        id: 1,
        label: "Get Started Free",
        url: "#",
        style: "filled",
        bg: "#2563eb",
        color: "#fff",
        borderRadius: 10,
        size: "lg",
      },
      {
        id: 2,
        label: "Watch Demo",
        url: "#",
        style: "outline",
        bg: "#ffffff",
        color: "#fff",
        borderRadius: 10,
        size: "lg",
      },
    ],
    // Image (split layout)
    image: { show: false, url: "", alt: "", borderRadius: 16, shadow: true },
    // 3JS / decoration
    decoration: {
      type: "none", // none | particles | waves | globe | grid | blobs
      color: "#2563eb",
      opacity: 0.3,
    },
    // Scroll indicator
    scrollIndicator: true,
    minHeight: 100, // vh
    animation: { ...anim, enabled: true, type: "fadeUp" },
  },

  // ── ABOUT ──────────────────────────────────────────────────────────────────
  about: {
    navId: "about",
    variant: "image-left", // image-left | image-right | centered | timeline
    ...solidBg("#ffffff"),
    ...pad(80, 32),
    ...typo(),
    badge: { show: true, text: "About Us", bg: "#eff6ff", color: "#2563eb" },
    heading: "We Build Digital Experiences",
    headingSize: 42,
    headingColor: "#0f172a",
    body: "<p>We are a passionate team of designers and developers who craft beautiful digital experiences. Our mission is to help businesses grow through exceptional design and technology.</p>",
    bodyColor: "#475569",
    bodySize: 16,
    image: { url: "", alt: "", borderRadius: 16, shadow: true, width: 50 },
    stats: [
      { id: 1, value: "10+", label: "Years Experience" },
      { id: 2, value: "500+", label: "Projects Done" },
      { id: 3, value: "99%", label: "Client Satisfaction" },
    ],
    showStats: true,
    button: {
      show: true,
      label: "Learn More",
      url: "#",
      bg: "#2563eb",
      color: "#fff",
      borderRadius: 8,
    },
    animation: { ...anim, enabled: true, type: "slideLeft" },
  },

  // ── FEATURES ───────────────────────────────────────────────────────────────
  features: {
    navId: "features",
    variant: "grid", // grid | list | alternating | tabs | icons-top | cards
    columns: 3,
    ...solidBg("#f8fafc"),
    ...pad(80, 32),
    ...typo(),
    badge: { show: true, text: "Features", bg: "#eff6ff", color: "#2563eb" },
    heading: "Everything You Need",
    headingSize: 42,
    headingColor: "#0f172a",
    subheading: "Powerful features to help you build faster and better.",
    subheadingColor: "#64748b",
    items: [
      {
        id: 1,
        icon: "⚡",
        iconBg: "#eff6ff",
        iconColor: "#2563eb",
        title: "Lightning Fast",
        body: "Optimized for speed and performance out of the box.",
        image: "",
      },
      {
        id: 2,
        icon: "🔒",
        iconBg: "#f0fdf4",
        iconColor: "#16a34a",
        title: "Secure by Default",
        body: "Enterprise-grade security built into every layer.",
        image: "",
      },
      {
        id: 3,
        icon: "🎨",
        iconBg: "#fdf4ff",
        iconColor: "#9333ea",
        title: "Fully Customizable",
        body: "Adapt every pixel to match your brand perfectly.",
        image: "",
      },
      {
        id: 4,
        icon: "📱",
        iconBg: "#fff7ed",
        iconColor: "#ea580c",
        title: "Responsive Design",
        body: "Looks perfect on every screen size and device.",
        image: "",
      },
      {
        id: 5,
        icon: "🔗",
        iconBg: "#eff6ff",
        iconColor: "#2563eb",
        title: "Easy Integrations",
        body: "Connect with your favorite tools in seconds.",
        image: "",
      },
      {
        id: 6,
        icon: "📊",
        iconBg: "#fefce8",
        iconColor: "#ca8a04",
        title: "Analytics Built-in",
        body: "Track performance and make data-driven decisions.",
        image: "",
      },
    ],
    cardStyle: "elevated", // elevated | bordered | flat | glass
    cardBg: "#ffffff",
    cardBorderRadius: 16,
    cardPadding: 28,
    iconStyle: "rounded", // rounded | circle | square | none
    iconSize: 48,
    animation: { ...anim, enabled: true, type: "fadeUp", stagger: 0.1 },
  },

  // ── CAROUSEL ───────────────────────────────────────────────────────────────
  carousel: {
    navId: "showcase",
    variant: "slides", // slides | cards | fullscreen | thumbnails
    ...solidBg("#0f172a"),
    ...pad(0, 0),
    ...typo(),
    autoplay: true,
    autoplayDelay: 4000,
    loop: true,
    showDots: true,
    showArrows: true,
    dotColor: "#2563eb",
    arrowBg: "rgba(255,255,255,0.15)",
    arrowColor: "#ffffff",
    slides: [
      {
        id: 1,
        image: "",
        overlay: "rgba(0,0,0,0.4)",
        heading: "Slide One Heading",
        headingColor: "#ffffff",
        subheading: "Supporting text for slide one",
        subheadingColor: "rgba(255,255,255,0.8)",
        button: {
          show: true,
          label: "Explore",
          url: "#",
          bg: "#2563eb",
          color: "#fff",
          borderRadius: 8,
        },
        contentAlign: "center", // left | center | right
      },
      {
        id: 2,
        image: "",
        overlay: "rgba(0,0,0,0.4)",
        heading: "Slide Two Heading",
        headingColor: "#ffffff",
        subheading: "Supporting text for slide two",
        subheadingColor: "rgba(255,255,255,0.8)",
        button: {
          show: true,
          label: "Learn More",
          url: "#",
          bg: "#7c3aed",
          color: "#fff",
          borderRadius: 8,
        },
        contentAlign: "center",
      },
    ],
    minHeight: 600,
    transition: "slide", // slide | fade | zoom
    animation: { ...anim },
  },

  // ── TESTIMONIALS ───────────────────────────────────────────────────────────
  testimonials: {
    navId: "testimonials",
    variant: "carousel", // carousel | grid | masonry | single
    columns: 3,
    ...solidBg("#f8fafc"),
    ...pad(80, 32),
    ...typo(),
    badge: {
      show: true,
      text: "Testimonials",
      bg: "#eff6ff",
      color: "#2563eb",
    },
    heading: "What Our Clients Say",
    headingSize: 42,
    headingColor: "#0f172a",
    subheading: "Real results from real customers.",
    subheadingColor: "#64748b",
    items: [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "CEO, TechCorp",
        avatar: "",
        rating: 5,
        body: "Absolutely transformed our online presence. The quality and speed of delivery was outstanding.",
        bg: "#ffffff",
      },
      {
        id: 2,
        name: "Mark Williams",
        role: "Founder, StartupXYZ",
        avatar: "",
        rating: 5,
        body: "The best investment we made this year. Incredible design and rock-solid performance.",
        bg: "#ffffff",
      },
      {
        id: 3,
        name: "Priya Sharma",
        role: "CTO, DataFlow",
        avatar: "",
        rating: 5,
        body: "Clean code, beautiful UI, and the team was a pleasure to work with throughout.",
        bg: "#ffffff",
      },
    ],
    cardBg: "#ffffff",
    cardBorderRadius: 16,
    starColor: "#f59e0b",
    showRating: true,
    autoplay: true,
    autoplayDelay: 5000,
    animation: { ...anim, enabled: true, type: "fadeUp", stagger: 0.12 },
  },

  // ── TEAM ───────────────────────────────────────────────────────────────────
  team: {
    navId: "team",
    variant: "cards", // cards | minimal | circle
    columns: 4,
    ...solidBg("#ffffff"),
    ...pad(80, 32),
    ...typo(),
    badge: { show: true, text: "Our Team", bg: "#eff6ff", color: "#2563eb" },
    heading: "Meet the Team",
    headingSize: 42,
    headingColor: "#0f172a",
    subheading: "The brilliant minds behind the product.",
    subheadingColor: "#64748b",
    items: [
      {
        id: 1,
        name: "Alex Carter",
        role: "CEO & Founder",
        avatar: "",
        bio: "Visionary leader with 15+ years in tech.",
        socials: { twitter: "", linkedin: "", github: "" },
      },
      {
        id: 2,
        name: "Jamie Lee",
        role: "Head of Design",
        avatar: "",
        bio: "Crafts beautiful experiences that users love.",
        socials: { twitter: "", linkedin: "", github: "" },
      },
      {
        id: 3,
        name: "Sam Rivera",
        role: "Lead Developer",
        avatar: "",
        bio: "Full-stack wizard who ships pixel-perfect code.",
        socials: { twitter: "", linkedin: "", github: "" },
      },
      {
        id: 4,
        name: "Taylor Kim",
        role: "Growth Lead",
        avatar: "",
        bio: "Data-driven marketer scaling products to millions.",
        socials: { twitter: "", linkedin: "", github: "" },
      },
    ],
    showSocials: true,
    cardBg: "#f8fafc",
    cardBorderRadius: 16,
    imageShape: "circle", // circle | rounded | square
    animation: { ...anim, enabled: true, type: "fadeUp", stagger: 0.1 },
  },

  // ── STATS ──────────────────────────────────────────────────────────────────
  stats: {
    navId: "stats",
    variant: "row", // row | cards | split
    ...solidBg("#2563eb"),
    ...pad(60, 32),
    ...typo(),
    items: [
      { id: 1, value: "10K+", label: "Happy Customers", icon: "👥" },
      { id: 2, value: "$2M+", label: "Revenue Generated", icon: "💰" },
      { id: 3, value: "99.9%", label: "Uptime SLA", icon: "⚡" },
      { id: 4, value: "150+", label: "Countries Served", icon: "🌍" },
    ],
    valueColor: "#ffffff",
    valueFontSize: 48,
    labelColor: "rgba(255,255,255,0.75)",
    labelFontSize: 14,
    iconShow: true,
    divider: true,
    dividerColor: "rgba(255,255,255,0.2)",
    countUp: true, // animate numbers on scroll
    animation: { ...anim, enabled: true, type: "fadeIn" },
  },

  // ── CTA ────────────────────────────────────────────────────────────────────
  cta: {
    navId: "cta",
    variant: "centered", // centered | split | card | banner
    ...solidBg("#0f172a"),
    bgType: "gradient",
    bgGradient: {
      from: "#2563eb",
      to: "#7c3aed",
      direction: "to right",
      intensity: 100,
    },
    ...pad(100, 32),
    ...typo("Plus Jakarta Sans", "Inter"),
    heading: "Ready to Get Started?",
    headingSize: 48,
    headingColor: "#ffffff",
    subheading: "Join thousands of teams already using our platform.",
    subheadingColor: "rgba(255,255,255,0.75)",
    buttons: [
      {
        id: 1,
        label: "Start Free Trial",
        url: "#",
        style: "filled",
        bg: "#ffffff",
        color: "#2563eb",
        borderRadius: 10,
        size: "lg",
      },
      {
        id: 2,
        label: "Talk to Sales",
        url: "#",
        style: "outline",
        bg: "#ffffff",
        color: "#fff",
        borderRadius: 10,
        size: "lg",
      },
    ],
    decoration: { type: "none", color: "#ffffff", opacity: 0.05 },
    animation: { ...anim, enabled: true, type: "zoom" },
  },

  // ── GALLERY ────────────────────────────────────────────────────────────────
  gallery: {
    navId: "gallery",
    variant: "masonry", // masonry | grid | carousel | lightbox-grid
    columns: 3,
    ...solidBg("#ffffff"),
    ...pad(80, 32),
    ...typo(),
    badge: { show: true, text: "Gallery", bg: "#eff6ff", color: "#2563eb" },
    heading: "Our Work",
    headingSize: 42,
    headingColor: "#0f172a",
    images: [
      { id: 1, url: "", caption: "", alt: "" },
      { id: 2, url: "", caption: "", alt: "" },
      { id: 3, url: "", caption: "", alt: "" },
    ],
    gap: 12,
    borderRadius: 12,
    hoverEffect: "zoom", // zoom | overlay | slide | none
    lightbox: true,
    animation: { ...anim, enabled: true, type: "fadeIn", stagger: 0.08 },
  },

  // ── PRICING ────────────────────────────────────────────────────────────────
  pricing: {
    navId: "pricing",
    variant: "cards", // cards | table | toggle (monthly/yearly)
    ...solidBg("#f8fafc"),
    ...pad(80, 32),
    ...typo(),
    badge: { show: true, text: "Pricing", bg: "#eff6ff", color: "#2563eb" },
    heading: "Simple, Transparent Pricing",
    headingSize: 42,
    headingColor: "#0f172a",
    subheading: "No hidden fees. Cancel anytime.",
    subheadingColor: "#64748b",
    showToggle: true, // monthly / yearly toggle
    plans: [
      {
        id: 1,
        name: "Starter",
        monthlyPrice: 0,
        yearlyPrice: 0,
        currency: "$",
        description: "Perfect for individuals",
        features: [
          "5 Projects",
          "10GB Storage",
          "Basic Analytics",
          "Email Support",
        ],
        cta: "Get Started Free",
        ctaUrl: "#",
        highlighted: false,
        bg: "#ffffff",
        accentColor: "#2563eb",
        borderRadius: 16,
      },
      {
        id: 2,
        name: "Pro",
        monthlyPrice: 29,
        yearlyPrice: 290,
        currency: "$",
        description: "For growing teams",
        features: [
          "Unlimited Projects",
          "100GB Storage",
          "Advanced Analytics",
          "Priority Support",
          "Custom Domain",
        ],
        cta: "Start Free Trial",
        ctaUrl: "#",
        highlighted: true,
        bg: "#2563eb",
        accentColor: "#ffffff",
        borderRadius: 16,
      },
      {
        id: 3,
        name: "Enterprise",
        monthlyPrice: 99,
        yearlyPrice: 990,
        currency: "$",
        description: "For large organizations",
        features: [
          "Everything in Pro",
          "Unlimited Storage",
          "Dedicated Support",
          "SLA Guarantee",
          "SSO & Security",
        ],
        cta: "Contact Sales",
        ctaUrl: "#",
        highlighted: false,
        bg: "#ffffff",
        accentColor: "#2563eb",
        borderRadius: 16,
      },
    ],
    animation: { ...anim, enabled: true, type: "fadeUp", stagger: 0.12 },
  },

  // ── FAQ ────────────────────────────────────────────────────────────────────
  faq: {
    navId: "faq",
    variant: "accordion", // accordion | grid | tabs
    ...solidBg("#ffffff"),
    ...pad(80, 32),
    ...typo(),
    badge: { show: true, text: "FAQ", bg: "#eff6ff", color: "#2563eb" },
    heading: "Frequently Asked Questions",
    headingSize: 42,
    headingColor: "#0f172a",
    subheading: "Everything you need to know.",
    subheadingColor: "#64748b",
    accentColor: "#2563eb",
    items: [
      {
        id: 1,
        question: "How do I get started?",
        answer:
          "Simply sign up for free and follow our onboarding guide. You'll be up and running in minutes.",
      },
      {
        id: 2,
        question: "Can I cancel anytime?",
        answer:
          "Yes, absolutely. No contracts, no commitments. Cancel with one click from your dashboard.",
      },
      {
        id: 3,
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee, no questions asked.",
      },
      {
        id: 4,
        question: "Is my data secure?",
        answer:
          "Your data is encrypted at rest and in transit. We are SOC2 Type II certified.",
      },
    ],
    allowMultiOpen: false,
    borderColor: "#e2e8f0",
    animation: { ...anim, enabled: true, type: "fadeUp" },
  },

  // ── CONTACT ────────────────────────────────────────────────────────────────
  contact: {
    navId: "contact",
    variant: "split", // split | centered | minimal | with-map
    ...solidBg("#f8fafc"),
    ...pad(80, 32),
    ...typo(),
    badge: { show: true, text: "Contact Us", bg: "#eff6ff", color: "#2563eb" },
    heading: "Get In Touch",
    headingSize: 42,
    headingColor: "#0f172a",
    subheading: "We'd love to hear from you.",
    subheadingColor: "#64748b",
    info: {
      email: "hello@example.com",
      phone: "+1 (555) 000-0000",
      address: "123 Main Street, City, Country",
      showEmail: true,
      showPhone: true,
      showAddress: true,
    },
    formFields: [
      {
        id: 1,
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
      },
      {
        id: 2,
        type: "email",
        label: "Email Address",
        placeholder: "john@example.com",
        required: true,
      },
      {
        id: 3,
        type: "text",
        label: "Subject",
        placeholder: "How can we help?",
        required: false,
      },
      {
        id: 4,
        type: "textarea",
        label: "Message",
        placeholder: "Your message here...",
        required: true,
        rows: 5,
      },
    ],
    submitLabel: "Send Message",
    submitBg: "#2563eb",
    submitColor: "#ffffff",
    submitBorderRadius: 8,
    formAction: "", // POST endpoint, empty = disable actual submit
    accentColor: "#2563eb",
    inputBorderRadius: 8,
    animation: { ...anim, enabled: true, type: "fadeUp" },
  },

  // ── SPACER ─────────────────────────────────────────────────────────────────
  spacer: {
    navId: "",
    height: 60,
    heightMobile: 30,
    ...solidBg("transparent"),
    bgType: "solid",
    bg: "transparent",
    divider: {
      show: false,
      style: "solid", // solid | dashed | dotted
      color: "#e2e8f0",
      thickness: 1,
      width: 100, // % width of the line
      align: "center", // left | center | right
    },
  },

  // ── CUSTOM ABOUT ───────────────────────────────────────────────────────────
  customAbout: {
    navId: "about",
    bgMediaType: "image", // image | video | solid | gradient
    bgImage: "",
    bgVideo: "",
    bgFallbackImage: "",
    bg: "#0f172a",
    bgGradient: {
      from: "#0f172a",
      to: "#1e293b",
      direction: "to bottom right",
      intensity: 100,
    },
    overlay: {
      enabled: true,
      type: "solid", // solid | gradient
      color: "rgba(0,0,0,0.45)",
      gradientFrom: "rgba(0,0,0,0.75)",
      gradientTo: "rgba(0,0,0,0.05)",
      gradientDirection: "to top",
      intensity: 100,
    },
    minHeight: 480,
    minHeightMobile: 360,
    maxWidthInner: 1200,
    blocks: [
      {
        id: 1,
        type: "text",
        x: 6,
        y: 62,
        width: 30,
        anchor: "top-left",
        zIndex: 2,
        hidden: false,
        hiddenMobile: false,
        text: "● Elevate.",
        fontSize: 13,
        fontWeight: 600,
        color: "#ffffff",
        fontFamily: "Inter",
        lineHeight: 1.3,
        textAlign: "left",
        bg: "rgba(255,255,255,0.12)",
        padding: "6px 14px",
        borderRadius: 100,
        display: "inline",
      },
      {
        id: 2,
        type: "text",
        x: 6,
        y: 70,
        width: 70,
        anchor: "top-left",
        zIndex: 2,
        hidden: false,
        hiddenMobile: false,
        text: "Developing Your Vision,\nBuilding Exceptional User Experiences.",
        fontSize: 42,
        fontWeight: 700,
        color: "#ffffff",
        fontFamily: "Inter",
        lineHeight: 1.2,
        textAlign: "left",
        bg: "transparent",
        padding: "0",
        borderRadius: 0,
        display: "block",
      },
    ],
  },

  // ── ANIMATED HERO (WebGL background + scroll-morph blocks) ────────────────
  animatedHero: {
    navId: "home",
    glTexture: "ribbon", // ribbon | waves | noise | particles
    glColorA: "#0f172a",
    glColorB: "#1e3a5f",
    glSpeed: 1,
    glDensity: 1,
    glOpacity: 1,
    glInteractive: true,
    fallbackBg: "#0f172a",
    overlay: {
      enabled: false,
      type: "solid", // solid | gradient
      color: "rgba(0,0,0,0.35)",
      gradientFrom: "rgba(0,0,0,0.6)",
      gradientTo: "rgba(0,0,0,0.05)",
      gradientDirection: "to top",
    },
    minHeight: 640,
    minHeightMobile: 480,
    maxWidthInner: 1200,
    blocks: [
      {
        id: 1,
        type: "text",
        x: 50,
        y: 45,
        width: 60,
        anchor: "center",
        zIndex: 2,
        hidden: false,
        hiddenMobile: false,
        text: "Build Something\nUnforgettable",
        fontSize: 52,
        fontWeight: 800,
        color: "#ffffff",
        fontFamily: "Inter",
        lineHeight: 1.15,
        textAlign: "center",
        bg: "transparent",
        padding: "0",
        borderRadius: 0,
        display: "block",
        anim: {
          enabled: true,
          trigger: "scroll-in",
          from: { x: 0, y: 30, scale: 0.95, rotate: 0, opacity: 0 },
          to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
          ease: "power2.out",
          duration: 0.9,
          delay: 0,
        },
      },
    ],
  },

  // ── FOOTER ─────────────────────────────────────────────────────────────────
  footer: {
    navId: "footer",
    variant: "columns", // columns | minimal | centered | mega
    ...solidBg("#0f172a"),
    ...pad(60, 32),
    ...typo(),
    logo: {
      text: "Brand",
      fontSize: 22,
      fontWeight: 700,
      color: "#ffffff",
      useImage: false,
      imageUrl: "",
      imageHeight: 36,
    },
    tagline: "Building the future, one pixel at a time.",
    taglineColor: "rgba(255,255,255,0.5)",
    columns: [
      {
        id: 1,
        heading: "Product",
        headingColor: "#ffffff",
        links: [
          { id: 11, label: "Features", url: "#" },
          { id: 12, label: "Pricing", url: "#" },
          { id: 13, label: "Changelog", url: "#" },
        ],
      },
      {
        id: 2,
        heading: "Company",
        headingColor: "#ffffff",
        links: [
          { id: 21, label: "About", url: "#" },
          { id: 22, label: "Blog", url: "#" },
          { id: 23, label: "Careers", url: "#" },
        ],
      },
      {
        id: 3,
        heading: "Support",
        headingColor: "#ffffff",
        links: [
          { id: 31, label: "Docs", url: "#" },
          { id: 32, label: "FAQ", url: "#" },
          { id: 33, label: "Contact", url: "#" },
        ],
      },
    ],
    linkColor: "rgba(255,255,255,0.55)",
    linkHoverColor: "#ffffff",
    dividerColor: "rgba(255,255,255,0.08)",
    copyright: `© ${new Date().getFullYear()} Brand. All rights reserved.`,
    copyrightColor: "rgba(255,255,255,0.4)",
    socials: [
      { id: 1, platform: "twitter", url: "" },
      { id: 2, platform: "linkedin", url: "" },
      { id: 3, platform: "github", url: "" },
    ],
    showSocials: true,
    socialIconColor: "rgba(255,255,255,0.5)",
    socialIconHoverColor: "#ffffff",
  },
};

export const createSection = (type) => ({
  id: uid(),
  type,
  navId: SECTION_DEFAULTS[type]?.navId || type,
  config: JSON.parse(JSON.stringify(SECTION_DEFAULTS[type])),
});

export const createPage = (label) => ({
  id: uid(),
  label,
  slug:
    label.toLowerCase() === "home"
      ? "/"
      : "/" + label.toLowerCase().replace(/\s+/g, "-"),
  navbarId: "global",
  sections: [],
});

export const createNavbarEntry = (name) => ({
  id: "nb_" + uid(),
  name,
  config: JSON.parse(JSON.stringify(SECTION_DEFAULTS.navbar)),
});
