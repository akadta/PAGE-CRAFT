import { useEffect, useRef, useState } from "react";

export const useCountUp = (target, enabled, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  const numeric = parseFloat(String(target).replace(/[^0-9.]/g, "")) || 0;
  const suffix = String(target).replace(/[0-9.]/g, "");

  useEffect(() => {
    if (!enabled) {
      setCount(numeric);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(ease * numeric));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(numeric);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric, enabled]);

  return { ref, display: count + suffix };
};
