import { Route, Routes } from "react-router";

import { lazy } from "react";
import MainWebsiteLayout from "./MainWebsiteLayout";
import Home from "./pages/Home/Home";

const ServicesPage = import.meta.env.SSR ? null : lazy(() => import("./pages/Services/ServicesPage"));
const ServiceDetail = import.meta.env.SSR ? null : lazy(() => import("./pages/Services/ServiceDetail"));
const About = import.meta.env.SSR ? null : lazy(() => import("./pages/About/About"));
const Pricing = import.meta.env.SSR ? null : lazy(() => import("./pages/Pricing/Pricing"));
const Contact = import.meta.env.SSR ? null : lazy(() => import("./pages/Contact/Contact"));
const GetQuote = import.meta.env.SSR ? null : lazy(() => import("./pages/GetQuote/GetQuote"));
const WhereWeServe = import.meta.env.SSR ? null : lazy(() => import("./pages/WhereWeServe/WhereWeServe"));
const LocationPage = import.meta.env.SSR ? null : lazy(() => import("./pages/Location/LocationPage"));
const RoutePage = import.meta.env.SSR ? null : lazy(() => import("./pages/Route/RoutePage"));
const Privacy = import.meta.env.SSR ? null : lazy(() => import("./pages/Legal/Privacy"));
const Terms = import.meta.env.SSR ? null : lazy(() => import("./pages/Legal/Terms"));
const SearchPage = import.meta.env.SSR ? null : lazy(() => import("./pages/Search/SearchPage"));
const NotFound = import.meta.env.SSR ? null : lazy(() => import("./shared/components/NotFound"));

const defaultPages = { Home, ServicesPage, ServiceDetail, About, Pricing, Contact, GetQuote, WhereWeServe, LocationPage, RoutePage, Privacy, Terms, SearchPage, NotFound };
const MainWebsiteRoutes = ({ pages = defaultPages }) => {
  const { Home, ServicesPage, ServiceDetail, About, Pricing, Contact, GetQuote, WhereWeServe, LocationPage, RoutePage, Privacy, Terms, SearchPage, NotFound } = pages;
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
