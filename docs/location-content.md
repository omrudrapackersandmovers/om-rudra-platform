# Location content and editorial policy

All 202 client-listed location URLs are available for address planning, enquiries and search discovery. Each page keeps a self-referencing canonical URL, permits indexing, and appears in the sitemap and `llms.txt`. Search and 404 pages remain excluded.

The complete build retains 259 HTML documents and includes 257 indexable URLs. Directory links expose all cities, districts and local areas. Each location page has pickup, outbound and receiving-address planning, location-type address guidance, booking questions and a prefilled enquiry. Listed routes and local areas provide further context where available.

Seven locations have additional manually researched guides: Patna, Gaya, Ranchi, Muzaffarpur, Bhagalpur, Delhi NCR and Kolkata. The remaining pages use shared planning content adapted to the directory location and its type; they are not 195 independently researched guides. Search eligibility does not guarantee Google indexing or rankings. Continue adding sourced local detail and business-supplied evidence to improve their usefulness.

## What makes a reviewed guide useful

- A distinct address problem, supported by an official geographical or municipal reference.
- Practical decisions for that location, with separate pickup and receiving-address guidance.
- A local question answered directly, plus relevant inbound and outbound route links where listed.
- Clear enquiries and explicit confirmation of access, service availability and final scope.

The current guides cite district administration directories, the NCR Planning Board and Kolkata Municipal Corporation documentation. References establish address distinctions. They do not prove branch offices, completed moves, road restrictions, vehicle access or company operations. Access advice is presented as questions to resolve with the property and moving team.

Patna and Delhi NCR guides collect local-area planning in the parent guide. Their individual area URLs also appear in search discovery and remain usable for precise enquiries. Route pages remain separate; this change reviews location-page admission only.

## Adding or improving a location

1. Verify the business can accept enquiries for the location. Do not promise availability without confirmation.
2. Add a client-confirmed location to the appropriate directory data file. It receives the shared planning sections and search discovery automatically. For more local detail, research and write a useful guide in `frontend/website/src/data/locations/editorialGuides.js`. Include a distinct introduction, sourced address fact and reference links, three practical decisions, and at least one location-specific question. Add useful address areas only when supported.
3. Review it against existing guides. Shared moving checklists are not a substitute for independently researched local guidance. Add genuine move examples, photos or customer feedback only when the business supplies permission and evidence.
4. Run `npm run build` in `frontend/website`. Checks verify every location is discoverable, its planning sections and address distinctions are present, rendered guidance, references, preserved enquiry pickup, metadata and sitemap/discovery membership.
5. Review the rendered guide on a narrow screen and confirm its enquiry and route links work. After deployment, use Search Console to monitor crawling and usefulness; re-review weak pages rather than adding more templates.

`indexableLocationPages` derives from the client-listed location directory. The same collection controls robots metadata, sitemap and AI discovery generation. `editorialGuides` adds sourced content without limiting directory discovery. Do not import unsupported branch, fleet, pricing or road-restriction claims from legacy location profiles.
