import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/* Inline stand-in for @gsap/react's useGSAP.
   One gsap.context lives for the component's lifetime. */
function useGSAP(callback, options) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef(null);
  const cleanupRef = useRef(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : scope;
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(SplitText);
  } catch (e) {
    // Graceful fallback if already registered or unavailable
  }
}

// Animation timing constants
const STRIP_COUNT = 10;
const REVEAL_DURATION = 0.55;
const STRIP_STAGGER = 0.04;
const ZOOM_DURATION = 0.9;
const AUTOPLAY_INTERVAL = 6000;
const TITLE_CHAR_DURATION = 0.6;
const TITLE_CHAR_STAGGER = 0.04;
const TITLE_CHAR_Y_PERCENT = 100;

const DEFAULT_SLIDES = [
  {
    src: "/images/places/bihar.webp",
    title: "Verified Logistics Hub",
    chapter: "Regional Network 01",
  },
  {
    src: "/images/process-for-home-service/packing.webp",
    title: "5-Layer Defensive Packing",
    chapter: "Safe Transit 02",
  },
  {
    src: "/images/process-for-home-service/safe-transport.webp",
    title: "Dedicated Sealed Containers",
    chapter: "Highway Fleet 03",
  },
  {
    src: "/images/process-for-home-service/setting-on-new-place.webp",
    title: "Doorstep Setup and Placement",
    chapter: "Final Delivery 04",
  },
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

export default function ParallaxStripSlider({
  slides = DEFAULT_SLIDES,
  children,
  className = "",
  stripCount = STRIP_COUNT,
  revealDuration = REVEAL_DURATION,
  stripStagger = STRIP_STAGGER,
  zoomDuration = ZOOM_DURATION,
  autoplay = true,
  showCounter = true,
  showControls = true,
  accentColor = "#ffffff",
  backgroundColor = "#070b14",
}) {
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState(null);
  const [caption, setCaption] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const rootRef = useRef(null);
  const captionRef = useRef(null);
  const chapterRef = useRef(null);
  const titleRef = useRef(null);
  const counterRef = useRef(null);
  const counterNumRef = useRef(null);
  const incomingWrapperRef = useRef(null);
  const stripsRef = useRef([]);
  const isAnimating = useRef(false);
  const isFirstCaption = useRef(true);
  const splitRef = useRef(null);

  // Circular click-to-navigate cursor
  const cursorRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const isInside = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const total = slides.length;

  // Preload all slide images into browser cache so transitions never lag or flash
  useEffect(() => {
    slides.forEach((s) => {
      if (s?.src) {
        const img = new Image();
        img.src = s.src;
      }
    });
  }, [slides]);

  // Touch vs. mouse detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const goTo = useCallback(
    (next, transitionDirection) => {
      if (isAnimating.current || next === current || total < 2) return;
      isAnimating.current = true;
      setDirection(transitionDirection);
      setIncoming(next);
    },
    [current, total]
  );

  const onNext = useCallback(
    () => goTo((current + 1) % total, "next"),
    [current, total, goTo]
  );
  const onPrev = useCallback(
    () => goTo((current - 1 + total) % total, "prev"),
    [current, total, goTo]
  );

  // Auto-advance on a timer; pauses while transition is active or when user prefers reduced motion
  useEffect(() => {
    if (!autoplay || total < 2) return;
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (!isAnimating.current) onNext();
    }, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [autoplay, total, onNext]);

  // Wipe + zoom on slide change: 100% glitch-free continuous image reveal
  useGSAP(
    () => {
      if (incoming === null) return;

      const strips = stripsRef.current.slice(0, stripCount).filter(Boolean);
      if (!strips.length) return;
      const isPrevious = direction === "prev";
      const orderedStrips = isPrevious ? [...strips].reverse() : strips;

      // Reduced motion: swap without the reveal
      if (prefersReducedMotion()) {
        setCurrent(incoming);
        setCaption(incoming);
        setIncoming(null);
        isAnimating.current = false;
        return;
      }

      // Settle smoothly: switch base slide first, then release incoming layer on next frame
      const settle = () => {
        setCurrent(incoming);
        setCaption(incoming);
        requestAnimationFrame(() => {
          setIncoming(null);
          isAnimating.current = false;
        });
      };

      const tl = gsap.timeline({ onComplete: settle });

      // Clip-path wipe: clean, uninterrupted, perfectly continuous across strips
      tl.fromTo(
        orderedStrips,
        { clipPath: isPrevious ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
        {
          clipPath: isPrevious ? "inset(0 0 0 0%)" : "inset(0 0% 0 0)",
          duration: revealDuration,
          ease: "power3.out",
          stagger: stripStagger,
        },
        0
      );

      // Unified zoom on the entire incoming container (never slicing the image per strip!)
      if (incomingWrapperRef.current) {
        tl.fromTo(
          incomingWrapperRef.current,
          { scale: 1.04 },
          {
            scale: 1,
            duration: zoomDuration,
            ease: "power3.out",
          },
          0
        );
      }

      // Outgoing caption texts fade out smoothly
      const outgoing = [
        captionRef.current,
        titleRef.current,
        counterRef.current,
      ].filter(Boolean);
      if (outgoing.length) {
        tl.to(
          outgoing,
          {
            autoAlpha: 0,
            y: -2,
            duration: 0.3,
            ease: "power2.in",
          },
          0.1
        );
        tl.add(() => setCaption(incoming), 0.4);
      }
    },
    {
      dependencies: [
        incoming,
        direction,
        stripCount,
        revealDuration,
        stripStagger,
        zoomDuration,
      ],
      scope: rootRef,
    }
  );

  // Revert the split before React commits the new title
  useLayoutEffect(() => {
    try {
      splitRef.current?.revert();
    } catch (e) {}
    splitRef.current = null;
  }, [caption]);

  // Incoming caption reveal: title chars, chapter fade, counter number
  useGSAP(
    () => {
      if (isFirstCaption.current) {
        isFirstCaption.current = false;
        return;
      }
      if (!captionRef.current && !titleRef.current) return;

      if (captionRef.current) gsap.set(captionRef.current, { autoAlpha: 1, y: 0 });
      if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });

      if (prefersReducedMotion()) {
        const elements = [
          chapterRef.current,
          titleRef.current,
          counterRef.current,
          counterNumRef.current,
        ].filter(Boolean);
        gsap.set(elements, { autoAlpha: 1, y: 0, yPercent: 0 });
        return;
      }

      let split = null;
      try {
        if (titleRef.current && typeof SplitText !== "undefined") {
          split = new SplitText(titleRef.current, { type: "chars" });
          splitRef.current = split;
        }
      } catch (err) {
        split = null;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          try {
            split?.revert();
          } catch (e) {}
          if (splitRef.current === split) splitRef.current = null;
        },
      });

      if (split?.chars && split.chars.length > 0) {
        tl.from(
          split.chars,
          {
            yPercent: TITLE_CHAR_Y_PERCENT,
            duration: TITLE_CHAR_DURATION,
            ease: "power2.out",
            stagger: TITLE_CHAR_STAGGER,
          },
          0
        );
      } else if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0
        );
      }

      if (chapterRef.current) {
        tl.fromTo(
          chapterRef.current,
          { autoAlpha: 0, y: 0 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0
        );
      }

      if (counterRef.current) {
        tl.fromTo(
          counterRef.current,
          { autoAlpha: 0, y: 0 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0
        );
      }
      if (counterNumRef.current) {
        tl.from(
          counterNumRef.current,
          {
            yPercent: 110,
            duration: 0.55,
            ease: "power3.out",
          },
          0
        );
      }
    },
    { dependencies: [caption], scope: rootRef }
  );

  useGSAP(
    () => () => {
      try {
        splitRef.current?.revert();
      } catch (e) {}
      splitRef.current = null;
    },
    { scope: rootRef }
  );

  // Circular cursor: smooth follow + arrow that flips with pointer side
  useEffect(() => {
    if (!showControls || isCoarsePointer) return;
    const cursor = cursorRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!cursor || !l1 || !l2) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.5 });
    gsap.set(l1, {
      transformOrigin: "100% 50%",
      xPercent: -50,
      yPercent: -50,
      y: -1.5,
      rotation: 45,
      x: 0,
    });
    gsap.set(l2, {
      transformOrigin: "100% 50%",
      xPercent: -50,
      yPercent: -50,
      y: 1.5,
      rotation: -45,
      x: 0,
    });

    let currentSide = "right";
    let rafId = null;

    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const target = e.target instanceof Element ? e.target : null;
      const isOverInteractive = Boolean(
        target?.closest(
          'button, input, textarea, select, a, label, [role="button"], [contenteditable="true"], .pointer-events-auto'
        )
      );

      mouse.current.x = x;
      mouse.current.y = y;

      const rect = rootRef.current?.getBoundingClientRect();
      const isOut =
        !rect ||
        x <= rect.left ||
        y <= rect.top ||
        x >= rect.right ||
        y >= rect.bottom;

      if (isOut || isOverInteractive) {
        if (isInside.current) {
          isInside.current = false;
          gsap.to(cursor, {
            opacity: 0,
            scale: 0.5,
            duration: 0.2,
            ease: "power3.inOut",
          });
        }
        return;
      }

      if (!isInside.current) {
        pos.current.x = x;
        pos.current.y = y;
        gsap.set(cursor, { x, y });
        gsap.to(cursor, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power3.out",
        });
        isInside.current = true;
      }

      const isLeft = rect ? x < rect.left + rect.width / 2 : false;
      const nextSide = isLeft ? "left" : "right";

      if (nextSide !== currentSide) {
        currentSide = nextSide;
        if (nextSide === "left") {
          gsap.to(l1, {
            rotation: 135,
            x: "-10px",
            duration: 0.3,
            ease: "power3.inOut",
          });
          gsap.to(l2, {
            rotation: -135,
            x: "-10px",
            duration: 0.3,
            ease: "power3.inOut",
          });
        } else {
          gsap.to(l1, {
            rotation: 45,
            x: 3,
            duration: 0.3,
            ease: "power3.inOut",
          });
          gsap.to(l2, {
            rotation: -45,
            x: 3,
            duration: 0.3,
            ease: "power3.inOut",
          });
        }
      }
    };

    const render = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;
      gsap.set(cursor, { x: pos.current.x, y: pos.current.y });
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMove);
    render();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [showControls, isCoarsePointer]);

  // Render strips: each strip has an inner div matching 100% of the container width and height
  const renderStrips = (slide) => {
    const width = 100 / stripCount;

    return Array.from({ length: stripCount }, (_, i) => (
      <div
        key={i}
        ref={(el) => {
          if (el) stripsRef.current[i] = el;
        }}
        className="absolute inset-y-0 overflow-hidden"
        style={{
          left: `${i * width}%`,
          width: `${width}%`,
          marginLeft: i === 0 ? 0 : "-0.5px",
          paddingLeft: i === 0 ? 0 : "0.5px",
        }}
      >
        <div
          className="absolute inset-y-0"
          style={{
            left: `-${i * 100}%`,
            width: `${stripCount * 100}%`,
          }}
        >
          <img
            src={slide.src}
            alt={slide.title || "1st Om Movers Logistics Operation"}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover"
          />
        </div>
      </div>
    ));
  };

  const activeSlide = slides[caption] || slides[0];
  const stacked = isCoarsePointer;

  return (
    <div
      ref={rootRef}
      style={{ backgroundColor }}
      className={`parallax-strip-slider relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden ${className}`}
    >
      {/* Background slide layer */}
      <div className="absolute inset-0">
        <img
          src={slides[current]?.src || slides[0]?.src}
          alt={slides[current]?.title || "1st Om Movers Transit Fleet"}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
      </div>

      {/* Incoming slide layer with continuous parallax strips (scaled uniformly on parent wrapper) */}
      {incoming !== null && (
        <div
          ref={incomingWrapperRef}
          className="absolute inset-0 pointer-events-none origin-center"
        >
          {renderStrips(slides[incoming])}
        </div>
      )}

      {/* Seamless Left Readability Gradient Mask: Guarantees text readability with ZERO box */}
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/80 md:via-[#070b14]/60 to-transparent w-full lg:w-4/5"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#070b14]/90 via-transparent to-[#070b14]/40"
        aria-hidden="true"
      />

      {/* Click-to-navigate overlay (handles empty background clicks) */}
      {showControls && total > 1 && (
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: stacked ? "pointer" : "none" }}
          onClick={(e) => {
            if (isAnimating.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const isLeft = e.clientX < rect.left + rect.width / 2;
            if (isLeft) onPrev();
            else onNext();
          }}
        />
      )}

      {/* Overlaid Hero Content (sits directly on parallax canvas without boxes) */}
      {children ? (
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none py-12 sm:py-20 lg:py-24">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>
      ) : (
        /* Standalone Layout when no children provided */
        <div className="relative z-20 h-full min-h-[500px] flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
          <div ref={captionRef} className="pt-6 sm:pt-10">
            <span
              ref={chapterRef}
              className="inline-block text-xs font-semibold tracking-wider uppercase text-accent"
            >
              {activeSlide.chapter ?? `Phase ${String(caption + 1).padStart(2, "0")}`}
            </span>
          </div>

          <div className="flex items-end justify-between pb-6">
            <h2
              ref={titleRef}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight"
            >
              {activeSlide.title}
            </h2>

            {showCounter && (
              <span
                ref={counterRef}
                className="text-sm font-mono text-white/70"
              >
                <span ref={counterNumRef} className="inline-block">
                  {String(caption + 1).padStart(2, "0")}
                </span>
                <span> / {String(total).padStart(2, "0")}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Floating Slide Indicator & Counter Badge (Bottom Right when children is present) */}
      {children && (
        <div className="absolute right-4 sm:right-8 bottom-6 sm:bottom-8 z-20 pointer-events-none hidden md:flex flex-col items-end gap-1.5 text-right">
          <span
            ref={chapterRef}
            className="text-[11px] font-semibold uppercase tracking-widest text-blue-300 bg-black/50 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-sm"
          >
            {activeSlide.chapter ?? `Phase ${String(caption + 1).padStart(2, "0")}`}
          </span>
          <span
            ref={titleRef}
            className="text-xs sm:text-sm font-bold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-xs"
          >
            {activeSlide.title}
          </span>
          {showCounter && (
            <span
              ref={counterRef}
              className="text-[11px] font-mono text-white/60 tracking-wider"
            >
              <span ref={counterNumRef} className="inline-block">
                {String(caption + 1).padStart(2, "0")}
              </span>
              <span> / {String(total).padStart(2, "0")}</span>
            </span>
          )}
        </div>
      )}

      {/* Interactive Circular Navigation Cursor */}
      {showControls && total > 1 && !isCoarsePointer && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-[100]"
        >
          <div
            className="flex w-11 h-11 items-center justify-center rounded-full bg-white/90 text-black shadow-xl backdrop-blur-md border border-white/40"
          >
            <div className="relative w-5 h-5">
              <span
                ref={line1Ref}
                className="absolute left-1/2 top-1/2 h-0.5 w-3"
                style={{ backgroundColor: "#000000" }}
              />
              <span
                ref={line2Ref}
                className="absolute left-1/2 top-1/2 h-0.5 w-3"
                style={{ backgroundColor: "#000000" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
