import { responsiveImageSet } from "../../../../../utils/responsiveImages";
import { MapPin } from "lucide-react";

export default function Hero({ children }) {
  return (
    <section className="relative isolate lg:min-h-svh flex flex-col justify-center bg-hero-overlay text-white" aria-labelledby="hero-heading">
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/services/home-shifting-mobile.webp" />
        <img src="/images/services/HomeShiftingServices.webp" srcSet={responsiveImageSet("/images/services/HomeShiftingServices.webp")} sizes="100vw" alt="Movers loading carefully packed household furniture into a truck" className="absolute inset-0 -z-20 w-full h-full object-cover object-center" fetchPriority="high" width="1600" height="900" />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-hero-overlay/95 via-hero-overlay/65 to-hero-overlay/35" />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 sm:pt-32 sm:pb-10 lg:pt-36 lg:pb-12 text-center">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 mb-5"><MapPin size={16} aria-hidden="true" />From Patna to your next address</p>
        <h1 id="hero-heading" className="font-display font-extrabold text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.14] tracking-tight max-w-5xl mx-auto">Your next move,<br />made simple.</h1>
        <p className="max-w-2xl mx-auto mt-5 text-base sm:text-lg text-white/90 leading-relaxed">Home, office and vehicle moves. Get your free quote.</p>

      </div>
      {children}
    </section>
  );
}
