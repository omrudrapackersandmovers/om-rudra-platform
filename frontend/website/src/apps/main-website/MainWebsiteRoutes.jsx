import { Route, Routes } from "react-router";

import { lazy } from "react";
import MainWebsiteLayout from "./MainWebsiteLayout";

const Home = lazy(() => import("./pages/Home/Home"));
const ServicesPage = lazy(() => import("./pages/Services/ServicesPage"));
const ServiceDetail = lazy(() => import("./pages/Services/ServiceDetail"));
const About = lazy(() => import("./pages/About/About"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const GetQuote = lazy(() => import("./pages/GetQuote/GetQuote"));
const WhereWeServe = lazy(() => import("./pages/WhereWeServe/WhereWeServe"));
const LocationPage = lazy(() => import("./pages/Location/LocationPage"));
const RoutePage = lazy(() => import("./pages/Route/RoutePage"));
const Privacy = lazy(() => import("./pages/Legal/Privacy"));
const Terms = lazy(() => import("./pages/Legal/Terms"));
const SearchPage = lazy(() => import("./pages/Search/SearchPage"));
const NotFound = lazy(() => import("./shared/components/NotFound"));

const MainWebsiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainWebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="get-quote" element={<GetQuote />} />
        <Route path="where-we-serve" element={<WhereWeServe />} />
        <Route path="packers-movers/:slug" element={<LocationPage />} />
        <Route path="route/:slug" element={<RoutePage />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="search" element={<SearchPage />} />
        <Route path=":slug" element={<LocationPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default MainWebsiteRoutes;
