import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { company } from "../../../../../data/company";
import Button from "../../../shared/components/Button";

const heroSlides = [
  {
    id: "home",
    image: "/images/services/HomeShiftingServices.webp",
    tag: "Residential Moving",
    headlineStart: "Household shifting, handled with ",
    headlineAccent: "complete care",
    headlineEnd: ".",
    description:
      "Dedicated closed container trucks, multi-layer cushioning, and zero co-loading.",
  },
  {
    id: "office",
    image: "/images/services/Office&CommercialShifting.webp",
    tag: "Commercial Moving",
    headlineStart: "Zero-downtime office moves on your ",
    headlineAccent: "schedule",
    headlineEnd: ".",
    description:
      "Weekend and after-hours business transfers with anti-static IT equipment packing.",
  },
  {
    id: "car",
    image: "/images/services/CarTransportationServices.webp",
    tag: "Vehicle Logistics",
    headlineStart: "Enclosed car carriers arriving ",
    headlineAccent: "scratch-free",
    headlineEnd: ".",
    description:
      "Hydraulic covered trailers with pre-load inspection and doorstep delivery nationwide.",
  },
  {
    id: "packing",
    image: "/images/services/Packing&UnpackingServices.webp",
    tag: "Protective Packaging",
    headlineStart: "High-density packing for your ",
    headlineAccent: "fragile valuables",
    headlineEnd: ".",
    description:
      "Export-grade 5-ply corrugated cartons, bubble wraps, and custom wooden crating.",
  },
  {
    id: "storage",
    image: "/images/services/Warehousing&SecureStorage.webp",
    tag: "Secure Storage",
    headlineStart: "Clean, guarded warehousing ",
    headlineAccent: "open 24/7",
    headlineEnd: ".",
    description:
      "Moisture-free, pest-controlled storage bays with round-the-clock CCTV surveillance.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Auto-advance slides every 3.6s unless paused by hover
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3600);

    return () => clearInterval(timerRef.current);
  }, [currentSlide, isPaused]);

  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20need%20a%20quote%20for%20my%20relocation.`
    : "#";

  const slide = heroSlides[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-[#0c192e] text-white min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] flex flex-col justify-center"
      aria-labelledby="hero-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Slides with Smooth Cross-fade ──────────────── */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((item, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={item.image}
                alt={item.tag}
                className="w-full h-full object-cover object-center lg:object-right"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Left-weighted dark gradient - perfectly covers the left text area while leaving the subject clear */}
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#07111e]/95 via-[#07111e]/85 via-45% to-transparent" />
            </div>
          );
        })}
      </div>

      {/* ── Main Hero Content (Spacious, elegant, generous rhythm) ──── */}
      <div className="relative z-20 w-full pl-8 sm:pl-16 lg:pl-24 xl:pl-32 pr-6 sm:pr-12 py-20 sm:py-24 lg:py-28">
        
        <div className="max-w-lg lg:max-w-xl">
          
          {/* Category Tag */}
          <div className="mb-6 sm:mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-extrabold uppercase tracking-wider shadow-sm">
              {slide.tag}
            </span>
          </div>

          {/* Dynamic Headline (Spacious line-height, natural letter-spacing) */}
          <h1
            id="hero-heading"
            className="font-display font-extrabold !text-white mb-6 sm:mb-8"
            style={{
              color: "#ffffff",
              fontSize: "clamp(2.1rem, 3.8vw, 3.4rem)",
              lineHeight: "1.36",
              letterSpacing: "0.01em",
            }}
          >
            {slide.headlineStart}
            <span className="text-accent">
              {slide.headlineAccent}
            </span>
            {slide.headlineEnd}
          </h1>

          {/* Dynamic Description (Clear sentence with generous room to breathe) */}
          <p
            className="text-base sm:text-lg lg:text-xl max-w-xl font-normal"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.75",
              letterSpacing: "0.015em",
            }}
          >
            {slide.description}
          </p>

          {/* Action Buttons Cluster - Generous, uncollapsible spacing */}
          <div className="pt-8 sm:pt-10 pb-12 sm:pb-16 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 sm:gap-6 w-full sm:w-auto">
            <Button
              to="/get-quote"
              size="lg"
              className="min-h-[56px] px-8 text-base font-bold shadow-lg"
            >
              Get a Free Quote
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[56px] inline-flex items-center justify-center gap-3 px-8 rounded-full border-2 border-white/40 bg-white/10 hover:bg-white/20 font-bold text-base transition-all duration-200 backdrop-blur-md shadow-sm hover:border-white/60"
              style={{ color: "#ffffff" }}
            >
              <MessageCircle size={20} className="text-success shrink-0" strokeWidth={2.5} />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center gap-3">
            {heroSlides.map((item, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${item.tag}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? "w-10 bg-accent" : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>

        </div>

      </div>

      {/* ── Floating Prev / Next Controls in Bottom Right Corner ──── */}
      <div className="absolute bottom-8 right-6 sm:right-12 lg:right-16 z-30 hidden sm:flex items-center gap-3">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

    </section>
  );
};

export default Hero;
