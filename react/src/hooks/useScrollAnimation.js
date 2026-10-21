import { useEffect, useRef } from "react";

export const useScrollAnimation = (config) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!config?.enabled || !ref.current) return;
    const el = ref.current;
    const items = el.querySelectorAll("[data-anim]");
    const targets = items.length ? items : [el];

    // initial state
    targets.forEach((t, i) => {
      t.style.transition = "none";
      applyInitial(t, config.type);
      t.style.transitionDelay = `${(config.delay || 0) + i * (config.stagger || 0)}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            targets.forEach((t) => {
              t.style.transition = `opacity ${config.duration || 0.7}s ease, transform ${config.duration || 0.7}s ease`;
              applyFinal(t);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [config]);

  return ref;
};

const applyInitial = (el, type) => {
  el.style.opacity = "0";
  const map = {
    fadeUp: "translateY(40px)",
    fadeDown: "translateY(-40px)",
    slideLeft: "translateX(60px)",
    slideRight: "translateX(-60px)",
    zoom: "scale(0.85)",
    flip: "rotateX(20deg)",
    fadeIn: "translateY(0px)",
  };
  el.style.transform = map[type] || "translateY(20px)";
};

const applyFinal = (el) => {
  el.style.opacity = "1";
  el.style.transform = "translateY(0) translateX(0) scale(1) rotateX(0)";
};
