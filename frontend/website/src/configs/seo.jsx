import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { company } from "../data/company";
import { siteUrl, isIndexablePath } from "../data/site.js";
import { services } from "../data/services.js";

export default function SEO({ title, description, canonical, schemaJson, noindex = false }) {
  const { pathname } = useLocation();
  const url = canonical || `${siteUrl}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
  const fullTitle = title?.includes(company.brandName) ? title : `${title || "Packers and Movers in Patna"} | ${company.brandName}`;
  const metaDesc = (description || "Plan home shifting, office relocation and vehicle transport with Om Rudra Packers and Movers, based in Patna. Request a quote for your move.").replace(/\s+/g, " ").trim();
  const excluded = noindex || !isIndexablePath(pathname);
  const businessId = `${siteUrl}/#business`;
  const service = services.find(item => pathname === `/services/${item.slug}`);
  const graph = [
    { "@type": "MovingCompany", "@id": businessId, name: company.brandName, legalName: company.legalName, url: `${siteUrl}/`, logo: `${siteUrl}${company.logo.primary}`, image: `${siteUrl}${company.logo.horizontal}`, telephone: company.phone.primary, email: company.email.general, sameAs: Object.values(company.socials).filter(Boolean), address: { "@type": "PostalAddress", streetAddress: company.headOffice.addressLine, addressLocality: company.headOffice.city, addressRegion: company.headOffice.state, postalCode: company.headOffice.pincode, addressCountry: "IN" } },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: `${siteUrl}/`, name: company.brandName, publisher: { "@id": businessId }, inLanguage: "en-IN" },
    { "@type": pathname === "/about" ? "AboutPage" : pathname === "/contact" ? "ContactPage" : "WebPage", "@id": `${url}#webpage`, url, name: fullTitle, description: metaDesc, isPartOf: { "@id": `${siteUrl}/#website` }, inLanguage: "en-IN" },
    ...(service ? [{ "@type": "Service", "@id": `${url}#service`, name: service.title, description: service.description, url, provider: { "@id": businessId } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` }, { "@type": "ListItem", position: 3, name: service.title, item: url }] }] : []),
  ];
  if (schemaJson && pathname !== "/") {
    const entries = schemaJson["@graph"] || [schemaJson];
    graph.push(...entries.map(entry => entry["@type"] === "Service" ? { ...entry, provider: { "@id": businessId } } : entry));
  }
  const structuredData = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  const image = `${siteUrl}${company.logo.share}`;
  return <Helmet>
    <title>{fullTitle}</title>
    <meta name="description" content={metaDesc} />
    <link rel="canonical" href={url} />
    <meta name="robots" content={excluded ? "noindex,follow" : "index,follow,max-image-preview:large"} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={metaDesc} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:site_name" content={company.brandName} />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content={company.brandName} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={metaDesc} />
    <meta name="twitter:image" content={image} />
    {import.meta.env.VITE_GOOGLE_SITE_VERIFICATION && <meta name="google-site-verification" content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION} />}
    {import.meta.env.VITE_BING_SITE_VERIFICATION && <meta name="msvalidate.01" content={import.meta.env.VITE_BING_SITE_VERIFICATION} />}
    <script type="application/ld+json">{structuredData}</script>
  </Helmet>;
}
