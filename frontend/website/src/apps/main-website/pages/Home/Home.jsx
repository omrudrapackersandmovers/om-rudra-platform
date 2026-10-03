import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import ServicesGrid from "./components/ServicesGrid";
import HowItWorks from "./components/HowItWorks";
import QuoteForm from "./components/QuoteForm";
import TestimonialsBlock from "./components/TestimonialsBlock";
import LocationsSnapshot from "./components/LocationsSnapshot";
import SEO from "../../../../configs/seo";
import { company } from "../../../../data/company";

const Home = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://1stompackersandmovers.com/#organization",
        "name": company.legalName,
        "alternateName": company.brandName,
        "url": "https://1stompackersandmovers.com",
        "telephone": company.phone.primary || undefined,
        "email": company.email.general || undefined,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": company.headOffice.addressLine || undefined,
          "addressLocality": company.headOffice.city,
          "addressRegion": company.headOffice.state,
          "postalCode": company.headOffice.pincode || undefined,
          "addressCountry": "IN"
        }
      },
      {
        "@type": "MovingCompany",
        "@id": "https://1stompackersandmovers.com/#localbusiness",
        "name": company.brandName,
        "telephone": company.phone.primary || undefined,
        "url": "https://1stompackersandmovers.com",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": company.headOffice.city,
          "addressRegion": company.headOffice.state,
          "addressCountry": "IN"
        },
        "areaServed": ["Bihar", "Jharkhand", "Uttar Pradesh", "Delhi NCR", "West Bengal", "Pan-India"]
      }
    ]
  };

  return (
    <>
      <SEO
        title="Reliable Packers and Movers in Bihar & Pan-India"
        description="Dedicated home shifting, office relocation, and vehicle transport across Bihar, Jharkhand, UP, Delhi NCR, and nationwide routes."
        schemaJson={schema}
      />
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <HowItWorks />
      <QuoteForm />
      <TestimonialsBlock />
      <LocationsSnapshot />
    </>
  );
};

export default Home;
