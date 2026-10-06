import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { responsiveImageSet } from "../../../../utils/responsiveImages";
import { packingGroups } from "../../../../data/packingMaterials";

const materials = packingGroups.flatMap(group => group.items);

export default function PackingMaterialsPreview() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const section = useRef(null);
  const touchStart = useRef(null);
  const [, title] = materials[active];
  const advance = (direction) => setActive(current => (current + direction + materials.length) % materials.length);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(section.current);
    return () => { preference.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (paused || interacting || !inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(current => (current + 1) % materials.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, interacting, inView, reducedMotion, active]);

  return <section ref={section} className="py-12 sm:py-16" aria-label="Explore packing materials">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 items-center rounded-lg border border-border overflow-hidden bg-brand-soft/40">
        <div role="region" aria-roledescription="carousel" aria-label="Packing material mockups" className="relative bg-surface"
          onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
          onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
          onTouchStart={event => { touchStart.current = event.touches[0].clientX; setPaused(true); }}
          onTouchEnd={event => { if (touchStart.current !== null) { const distance = touchStart.current - event.changedTouches[0].clientX; if (Math.abs(distance) > 45) advance(distance > 0 ? 1 : -1); } touchStart.current = null; }}>
          <div className="relative aspect-[4/3] overflow-hidden">
            {materials.map(([materialId, materialTitle], index) => {
              const src = `/images/packing-materials/${materialId}.webp`;
              // Load the current and next image; defer the rest until needed.
              if (index !== active && index !== (active + 1) % materials.length) return null;
              return <img key={materialId} src={src} srcSet={responsiveImageSet(src)} sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw" alt={index === active ? `Illustrative branded mockup of ${materialTitle.toLowerCase()}` : ""} aria-hidden={index !== active} width="960" height="960" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`} />;
            })}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-background/95 border-t border-border p-3 sm:p-4">
            <div className="min-w-0"><p className="text-xs text-primary font-semibold">{active + 1} / {materials.length}</p><p className="text-sm sm:text-base font-semibold truncate" aria-live={paused || interacting || reducedMotion ? "polite" : "off"}>{title}</p></div>
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => { setPaused(true); advance(-1); }} aria-label="Previous packing material" className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border hover:bg-brand-soft text-primary"><ChevronLeft size={20}/></button>
              {!reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Start automatic slideshow" : "Pause automatic slideshow"} className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border hover:bg-brand-soft text-primary">{paused ? <Play size={17}/> : <Pause size={17}/>}</button>}
              <button type="button" onClick={() => { setPaused(true); advance(1); }} aria-label="Next packing material" className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border hover:bg-brand-soft text-primary"><ChevronRight size={20}/></button>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-10"><p className="text-primary text-sm font-semibold mb-3">The layers behind your move</p><h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">Good packing starts with the right materials.</h2><p className="text-text-muted leading-relaxed mt-4">Explore cartons, cushioning, covers and labels, and learn what to discuss when planning protection for your belongings.</p><Link to="/packing-materials" className="inline-flex items-center gap-2 min-h-12 mt-5 text-primary font-semibold hover:underline">Explore packing materials<ArrowRight size={18} aria-hidden="true"/></Link><p className="text-xs text-text-muted mt-2">Illustrative branded mockups.</p></div>
      </div>
    </div>
  </section>;
}

