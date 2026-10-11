import { useEffect } from "react";

// Animate only when content enters view. Prerendered content stays visible,
// including when JavaScript or the animation APIs are unavailable.
export default function useScrollReveals(rootRef, pathname) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet();
    const animations = new Map();
    const distance = window.matchMedia("(min-width: 768px)").matches ? 20 : 12;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (preference.matches || element.contains(document.activeElement)) continue;
        const delay = Math.min(Number(element.dataset.reveal) || 0, 3) * 65;
        const animation = element.animate(
          [{ opacity: 0.25, transform: `translateY(${distance}px)` },
            { opacity: 1, transform: "translateY(0)" }],
          { duration: 520, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
        );
        animations.set(element, animation);
        animation.onfinish = () => animations.delete(element);
      }
    }, { threshold: 0, rootMargin: "0px 0px -36px 0px" });

    const discover = () => {
      if (preference.matches) return;
      root.querySelectorAll("h2, h2 + p, [data-reveal]").forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        observer.observe(element);
      });
    };
    const stopMotion = () => {
      if (preference.matches) {
        observer.disconnect();
        for (const animation of animations.values()) animation.cancel();
        animations.clear();
      } else discover();
    };
    const revealFocused = (event) => {
      for (const [element, animation] of animations) {
        if (element.contains(event.target)) {
          animation.cancel();
          animations.delete(element);
        }
      }
    };
    // Lazy routes and service filters can mount after the layout effect runs.
    const mutations = new MutationObserver(discover);
    mutations.observe(root, { childList: true, subtree: true });
    discover();
    preference.addEventListener("change", stopMotion);
    root.addEventListener("focusin", revealFocused);
    return () => {
      mutations.disconnect();
      observer.disconnect();
      preference.removeEventListener("change", stopMotion);
      root.removeEventListener("focusin", revealFocused);
      for (const animation of animations.values()) animation.cancel();
    };
  }, [rootRef, pathname]);
}
