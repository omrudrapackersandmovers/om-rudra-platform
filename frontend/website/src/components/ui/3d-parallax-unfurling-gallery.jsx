import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Default authentic logistics & fleet image assets from our codebase
export const DEFAULT_RELOCATION_IMAGES = [
  "/images/process-for-home-service/safe-transport.webp",
  "/images/places/delhi-ncr.webp",
  "/images/process-for-home-service/packing.webp",
  "/images/services/CarTransportationServices.webp",
  "/images/places/bihar.webp",
  "/images/process-for-home-service/loading.webp",
  "/images/services/HomeShiftingServices.webp",
  "/images/places/jharkhand.webp",
  "/images/process-for-home-service/setting-on-new-place.webp",
  "/images/services/Bike&Two-WheelerTransportation.webp",
  "/images/places/west-bengal.webp",
  "/images/process-for-home-service/unloading.webp",
  "/images/services/Warehousing&SecureStorage.webp",
  "/images/places/up.webp",
  "/images/process-for-home-service/packing1.webp",
  "/images/services/Office&CommercialShifting.webp",
  "/images/process-for-home-service/loading1.webp",
  "/images/services/GoodsTransitInsurance.webp",
  "/images/process-for-home-service/unpacking.webp",
  "/images/places/maharashtra.webp",
  "/images/process-for-home-service/visti-and-survey.webp",
  "/images/services/Loading&UnloadingServices.webp",
  "/images/process-for-home-service/after-shifting.webp",
  "/images/places/karnataka.webp",
  "/images/process-for-home-service/loading2.webp",
  "/images/services/Packing&UnpackingServices.webp",
  "/images/process-for-home-service/unloading0.webp",
  "/images/places/gujrat.webp",
];

const ImageCard = ({ src, onLoad, alt = "1st Om Movers Transit Fleet" }) => {
  return (
    <div className="w-full aspect-video flex-shrink-0 bg-[#0f172a] rounded-xl overflow-hidden border border-white/10 transition-transform duration-300 hover:scale-[1.02] relative will-change-transform backface-hidden preserve-3d shadow-md">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={onLoad}
        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
};

export default function ParallaxUnfurlingGallery({
  images = DEFAULT_RELOCATION_IMAGES,
  children,
  className = "",
}) {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const loadedCountRef = useRef(0);

  const handleItemLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (!isReady && loadedCountRef.current >= 1) setIsReady(true);
  }, [isReady]);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const galleryImages = useMemo(() => {
    const list = images && images.length >= 8 ? images : DEFAULT_RELOCATION_IMAGES;
    return list;
  }, [images]);

  const colMedia = useMemo(() => {
    const list = galleryImages && galleryImages.length >= 8 ? galleryImages : DEFAULT_RELOCATION_IMAGES;
    const col1Base = list.filter((_, i) => i % 4 === 0);
    const col2Base = list.filter((_, i) => i % 4 === 1);
    const col3Base = list.filter((_, i) => i % 4 === 2);
    const col4Base = list.filter((_, i) => i % 4 === 3);

    const padToMin = (arr, count = 12) => {
      let out = [...arr];
      while (out.length < count) {
        out = [...out, ...arr];
      }
      return out;
    };

    return {
      col1: padToMin(col1Base, 12),
      col2: padToMin(col2Base, 12),
      col3: padToMin(col3Base, 12),
      col4: padToMin(col4Base, 12),
    };
  }, [galleryImages]);

  // Page-level scroll tracking for seamless integration in the document flow
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  // 3D Matrix animations (unfurls smoothly as user scrolls through the corridor)
  const rotateY = useTransform(smoothProgress, [0.1, 0.95], [-42, -6]);
  const rotateX = useTransform(smoothProgress, [0.1, 0.95], [22, 2]);
  const rotateZ = useTransform(smoothProgress, [0.1, 0.95], [14, 1]);
  const translateZ = useTransform(smoothProgress, [0.1, 0.95], [-750, 0]);

  // Track columns parallax speeds - bounded so 12-item columns never expose top or bottom edges
  const yCol1 = useTransform(smoothProgress, [0, 1], ["0%", "-18%"]);
  const yCol2 = useTransform(smoothProgress, [0, 1], ["-8%", "10%"]);
  const yCol3 = useTransform(smoothProgress, [0, 1], ["-2%", "-16%"]);
  const yCol4 = useTransform(smoothProgress, [0, 1], ["-6%", "12%"]);

  return (
    <div className={`relative w-full ${className}`}>
      <section
        ref={containerRef}
        className="relative w-full h-[220vh] sm:h-[260vh] bg-[#070b14] text-white font-sans overflow-visible"
      >
        <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden">
          <div className="relative w-full h-full bg-[#070b14] overflow-hidden flex items-center justify-center will-change-transform backface-hidden preserve-3d">
            {/* 3D Perspective Matrix */}
            <div
              className="absolute inset-0 flex justify-center items-center pointer-events-none"
              style={{ perspective: "1100px" }}
            >
              {/* Ambient Brand Shadow Masks */}
              <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_80px_120px_-30px_rgba(7,11,20,0.85),inset_0_-80px_120px_-30px_rgba(7,11,20,0.85)]" />
              <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_100px_0_120px_-30px_rgba(7,11,20,0.85),inset_-100px_0_120px_-30px_rgba(7,11,20,0.85)]" />
              <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#070b14]/85 via-[#070b14]/30 to-[#070b14]/70" />

              {/* Parallax Image Grid Matrix */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  rotateZ,
                  z: translateZ,
                  transformStyle: "preserve-3d",
                }}
                className="flex gap-3 sm:gap-5 md:gap-6 justify-center items-center w-[135vw] h-[175vh] origin-center opacity-95 will-change-transform backface-hidden"
              >
                <motion.div style={{ y: yCol1 }} className="flex flex-col gap-3 sm:gap-5 md:gap-6 w-[24vw] min-w-[190px] sm:min-w-[260px] md:min-w-[300px] pointer-events-auto">
                  {colMedia.col1.map((src, index) => (
                    <ImageCard key={`col1-${index}`} src={src} onLoad={handleItemLoad} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol2 }} className="flex flex-col gap-3 sm:gap-5 md:gap-6 w-[24vw] min-w-[190px] sm:min-w-[260px] md:min-w-[300px] pointer-events-auto">
                  {colMedia.col2.map((src, index) => (
                    <ImageCard key={`col2-${index}`} src={src} onLoad={handleItemLoad} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol3 }} className="flex flex-col gap-3 sm:gap-5 md:gap-6 w-[24vw] min-w-[190px] sm:min-w-[260px] md:min-w-[300px] pointer-events-auto">
                  {colMedia.col3.map((src, index) => (
                    <ImageCard key={`col3-${index}`} src={src} onLoad={handleItemLoad} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol4 }} className="flex flex-col gap-3 sm:gap-5 md:gap-6 w-[24vw] min-w-[190px] sm:min-w-[260px] md:min-w-[300px] pointer-events-auto">
                  {colMedia.col4.map((src, index) => (
                    <ImageCard key={`col4-${index}`} src={src} onLoad={handleItemLoad} />
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Seamless Left Readability Gradient Mask (Ensures text is 100% crisp without any box) */}
            <div
              className="absolute inset-0 z-15 pointer-events-none bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/75 to-transparent w-full md:w-4/5 lg:w-2/3"
              aria-hidden="true"
            />

            {/* Overlaid Hero Content */}
            {children && (
              <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
                {children}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
