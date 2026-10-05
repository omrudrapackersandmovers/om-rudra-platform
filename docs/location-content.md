# Location content and editorial policy

All 202 location URLs remain available for address planning and enquiries. Only seven reviewed city guides currently qualify for search discovery: Patna, Gaya, Ranchi, Muzaffarpur, Bhagalpur, Delhi NCR and Kolkata. The other 195 location pages use `noindex,follow`, keep their own canonical URL, and are omitted from the sitemap and `llms.txt`. Crawlers are still allowed to visit them. No location is removed from the directory or quote flow.

The complete build retains 258 HTML documents and includes 61 indexable URLs. This is an editorial choice to avoid publishing hundreds of city-name substitutions as search landing pages. It is not a Google requirement to have a particular page count, and it does not guarantee rankings.

## What makes a reviewed guide useful

- A distinct address problem, supported by an official geographical or municipal reference.
- Practical decisions for that location, with separate pickup and receiving-address guidance.
- A local question answered directly, plus relevant inbound and outbound route links where listed.
- Clear enquiries and explicit confirmation of access, service availability and final scope.

The current guides cite district administration directories, the NCR Planning Board and Kolkata Municipal Corporation documentation. References establish address distinctions. They do not prove branch offices, completed moves, road restrictions, vehicle access or company operations. Access advice is presented as questions to resolve with the property and moving team.

Patna and Delhi NCR guides collect local-area planning in the parent guide. Their individual area URLs remain usable for precise enquiries. Route pages remain separate; this change reviews location-page admission only.

## Adding another indexed location

1. Verify the business can accept enquiries for the location. Do not promise availability without confirmation.
2. Research and write a useful guide in `frontend/website/src/data/locations/editorialGuides.js`. Include a distinct introduction, sourced address fact and reference links, three practical decisions, and at least one location-specific question. Add useful address areas only when supported.
3. Review it against existing guides. A copied paragraph with another city name does not qualify. Add genuine move examples, photos or customer feedback only when the business supplies permission and evidence.
4. Run `npm run build` in `frontend/website`. Checks verify editorial admission, rendered guidance, references, preserved enquiry pickup, metadata and sitemap/discovery membership.
5. Review the rendered guide on a narrow screen and confirm its enquiry and route links work. After deployment, use Search Console to monitor crawling and usefulness; re-review weak pages rather than adding more templates.

`indexableLocationPages` derives from the reviewed guide registry. `staticPaths` separately includes all locations, so adding a directory location does not automatically add it to search. The same registry controls development and production sitemap/discovery generation.
