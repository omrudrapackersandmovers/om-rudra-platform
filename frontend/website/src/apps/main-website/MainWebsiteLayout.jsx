import { Suspense } from "react";
import { Outlet } from "react-router";
import Footer from "./shared/components/Footer";
import Header from "./shared/components/Header";
import MobileActionBar from "./shared/components/MobileActionBar";

const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 py-16" aria-label="Loading page content">
    <div className="w-8 h-8 rounded-full border-2 border-primary/15 border-t-primary animate-spin" />
    <span className="text-xs text-text-muted font-medium tracking-wide">Loading...</span>
  </div>
);

const MainWebsiteLayout = () => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      {/* pt-16 on mobile, pt-20 on lg - matches header height */}
      <main className="flex-1 pt-16 lg:pt-20">
        <Suspense fallback={<PageLoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default MainWebsiteLayout;
