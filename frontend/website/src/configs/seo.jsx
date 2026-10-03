import { Helmet } from "react-helmet-async";
import { company } from "../data/company";

/**
 * SEO Component using react-helmet-async
 * Sets page title, meta description, canonical link, and JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  canonical,
  schemaJson,
}) {
  const fullTitle = title
    ? `${title} | ${company.brandName}`
    : `${company.brandName} | Trusted Packers and Movers in Bihar & Pan-India`;

  const metaDesc =
    description ||
    "Professional household and commercial relocation services with dedicated closed vehicles, transparent upfront pricing, and careful handling.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}
