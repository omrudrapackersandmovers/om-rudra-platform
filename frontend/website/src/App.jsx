import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./store";
import MainWebsiteRoutes from "./apps/main-website/MainWebsiteRoutes";
import ErrorBoundary from "./apps/main-website/shared/components/ErrorBoundary";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LenisScroll() {
  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Disable on touch screens / mobile devices for zero CPU overhead and 100% native momentum scroll
    const isDesktopPointer = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    if (!isDesktopPointer) {
      return;
    }

    let lenis;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      window.__lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    });

    return () => {
      if (window.__lenis) {
        window.__lenis = null;
      }
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return null;
}

const App = () => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <LenisScroll />
          <Routes>
            <Route
              path="/*"
              element={
                <ErrorBoundary>
                  <MainWebsiteRoutes />
                </ErrorBoundary>
              }
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
};

export default App;
