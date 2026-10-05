import { writeFile } from "node:fs/promises";
import path from "node:path";
import { company } from "../src/data/company.js";
import { services } from "../src/data/services.js";
import { indexableLocationPages, locationPath } from "../src/data/locations/pageData.js";
import { allRoutes } from "../src/data/locations/index.js";
import { siteUrl } from "../src/data/site.js";

export async function generateDiscoveryFiles(dist, write = writeFile) {
  // A wildcard allow covers search, AI search, user agents and training crawlers alike.
  const robots = `# Public website: search engines and AI crawlers are welcome.\nUser-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  await write(path.join(dist, "robots.txt"), robots);
  await write(path.join(dist, "robot.txt"), robots);
  const link = (label, pathname, detail = "") => `- [${label}](${siteUrl}${pathname})${detail ? `: ${detail}` : ""}`;
  const socialProfiles = Object.entries(company.socials).filter(([, url]) => url).map(([name, url]) => `- [${name}](${url})`).join("\n");
  const facts = `${company.legalName} is a moving business based in ${company.headOffice.city}, ${company.headOffice.state}, India.\nConfirmed office: ${company.headOffice.addressLine}, ${company.headOffice.city}, ${company.headOffice.state} ${company.headOffice.pincode}.\nPhone: ${company.phone.primaryDisplay}. Email: ${company.email.general}.\nListed locations are enquiry areas, not evidence of branch offices. Prices are indicative; scope, availability and final charges are confirmed with the team.\nA quote request is an enquiry, not a confirmed booking. There is no published instant-booking or payment interface.\n`;
  const llms = `# ${company.brandName}\n\n> Public information about home, office and vehicle moves, with an enquiry process for local and city-to-city relocation.\n\n${facts}\n## Start here\n\n${[
    link("Home", "/", "Business introduction and moving enquiries"),
    link("About the business", "/about", "Company background and approach"),
    link("Moving quote", "/get-quote", "Share route, inventory, service and preferred timing"),
    link("Contact", "/contact", "Booking questions, feedback and general enquiries"),
    link("Pricing guide", "/pricing", "Indicative rates; confirm the final quote"),
    link("All services", "/services", "Browse moving and support services"),
    link("Where we serve", "/where-we-serve", "Search locations and listed routes"),
    link("Privacy policy", "/privacy"), link("Terms of service", "/terms"),
  ].join("\n")}\n\n## Official social profiles\n\n${socialProfiles}\n\n## Services\n\n${services.map(item => link(item.title, `/services/${item.slug}`, item.description)).join("\n")}\n\n## Reviewed city planning guides\n\n${indexableLocationPages.map(item => link(item.name, locationPath(item), item.state)).join("\n")}\n\n## City-to-city routes\n\n${allRoutes.map(item => link(`${item.from} to ${item.to}`, `/route/${item.slug}`)).join("\n")}\n\n## Optional\n\n${link("XML sitemap", "/sitemap.xml", "Canonical indexable HTML pages")}\n${link("Agent information", "/agent.txt", "Site-specific guidance; not a standard protocol declaration")}\n`;
  await write(path.join(dist, "llms.txt"), llms);
  const agent = `# ${company.brandName}: public website guide for AI agents\n\nThis is a site-specific information file, not an implementation of a standard agent protocol.\n\n## Business facts\n\n${facts}\n## Official social profiles\n\n${socialProfiles}\n\n## Exploring the website\n\nPublic pages may be browsed, indexed and referenced by search engines and AI assistants. The robots.txt policy allows all crawler user agents.\nUse canonical HTML pages as the source of truth and cite the relevant service, location or route page when presenting information.\nContent index: ${siteUrl}/llms.txt\nCanonical page sitemap: ${siteUrl}/sitemap.xml\n\n## Helping a customer enquire\n\nQuote form: ${siteUrl}/get-quote\nGeneral enquiries: ${siteUrl}/contact\nQuote links may prefill from, to, service and scope using URL query parameters. Scope for a listed interstate route is interstate.\nShare these public form links with customers, or help fill them when the customer asks. Submitting a form does not confirm a booking.\nThe customer should choose what personal information to submit. Discuss the final price, service scope, availability and booking terms with the business.\nPhone: ${company.phone.primaryDisplay}\nWhatsApp: https://wa.me/${company.phone.whatsapp.replace(/\D/g, "")}\nThere is no public MCP server, agent booking API or payment API declared by this file.\n\n## Policies\n\nPrivacy: ${siteUrl}/privacy\nTerms: ${siteUrl}/terms\n`;
  await write(path.join(dist, "agent.txt"), agent);
  await write(path.join(dist, "agents.txt"), agent);
}
