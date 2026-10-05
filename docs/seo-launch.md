# SEO build and launch guide

## Build output

Run `npm run build` in `frontend/website`. The pipeline builds client assets, bundles the server renderer, renders the actual React pages to static HTML and validates the output. Deploy **only `frontend/website/dist`**. `dist-ssr` is a build tool, not a runtime server or deploy directory.

There are 258 HTML documents: 61 indexable public pages, 195 noindex location enquiry pages, one noindex search page and one noindex error page. Page content, headings, canonical URLs, social metadata and JSON-LD are included before JavaScript executes. The browser hydrates normal pages; query-driven pages mount fresh to apply quote/search parameters.

`src/data/site.js` defines the canonical paths used by generation, indexing rules and the sitemap. Location and route data remain in their existing modules. New data entries are picked up on the next build. Unknown URLs are not generated as successful pages.

Build validation checks unique titles, one H1, nonempty main content, no unresolved loading shells, canonical URLs, descriptions, indexing rules, structured-data JSON, image alt text/assets, anchor destinations, internal route links, inbound links to every indexable page and exact sitemap membership. Run `npm run check:seo` to repeat these checks on an existing build.

Use `npm run preview` to test the static output at `http://127.0.0.1:4173`. This preview serves extensionless paths, generated redirects and HTTP 404s rather than falling back to the homepage for every URL. Development mode remains client-rendered, so inspect the production build when validating SEO.

## Hosting

The output includes Cloudflare Pages-compatible `_redirects` and `_headers`. Flat HTML files match the canonical extensionless URLs. `404.html` disables Pages' automatic SPA fallback, allowing unknown paths to return a real 404. Do not add a wildcard rewrite to `/index.html`; it would hide the generated pages and produce soft 404s.

For Cloudflare Pages, set the project root to `frontend/website`, build command to `npm run build`, and output directory to `dist`. The host needs a Node version compatible with the installed Vite release. Use Node 22.20+ (the current verified local version) or a compatible newer release. Check the hosting build log after changing Node versions.

If another host is used, configure equivalent extensionless HTML serving, query-preserving permanent redirects and custom 404 status handling. `_redirects` and `_headers` are not universally supported.

The provided headers exclude default Pages deployment domains from indexing and cache fingerprinted assets for a year. Production uses the canonical domain `https://omrudrapackersandmovers.com`. Configure HTTPS enforcement and the production custom domain in the hosting dashboard. Confirm the www alias resolves to the same project before relying on its redirect. Additional staging custom domains require their own noindex rules.

After deployment, check HTTP status, response HTML and headers for the homepage, service, city, local-area and route pages. Check `/privacy`, `/terms`, a quote URL with parameters, `/search?q=patna`, an old location alias and a nonexistent URL. Confirm trailing-slash redirects have no loops, unknown paths return 404, and `/sitemap.xml` and `/robots.txt` load successfully.

## Search Console and Bing

1. Create or select the domain property in Google Search Console. DNS verification is preferable for coverage across protocols and subdomains. DNS changes must be made in the domain account.
2. For an HTML-verification URL-prefix property, add the provided token as `VITE_GOOGLE_SITE_VERIFICATION` in the build environment and rebuild. Bing HTML verification is supported with `VITE_BING_SITE_VERIFICATION`. These tokens are public identifiers, not API secrets; do not substitute credentials.
3. Complete verification in the search provider dashboard.
4. Submit `https://omrudrapackersandmovers.com/sitemap.xml`.
5. Inspect representative URLs, verify Google sees their rendered content and request indexing for priority pages. Monitor the Page Indexing and Core Web Vitals reports after real traffic becomes available.

No property verification, DNS update or sitemap submission is performed merely by building the project. Analytics is a separate task: GA4 is still planned, with no measurement ID configured by this change.

## Structured data and business content

The central graph contains one confirmed Patna MovingCompany, WebSite and page entity. Service and location/route graphs reference the same business; service detail pages include breadcrumbs. No invented reviews, aggregate ratings, branch addresses, price offers or delivery guarantees are emitted. JSON-LD is retained in the body so React hydration stays consistent; Google supports JSON-LD in either the head or body.

Use Google's Rich Results Test and a schema validator on deployed URLs. Valid structured data makes a page eligible for supported search features; it does not promise a rich result. FAQ content is visible, but this business does not need unsupported promises of FAQ rich results.

Keep name, address and telephone consistent with the genuine Google Business Profile. Create/complete that profile using the real business details and service area; never register fictional offices. Add real photographs, move examples and customer feedback as they become available. Shared templates and static generation alone do not make thin location content valuable or guarantee rankings.

## Remaining external checks

- Production deployment, HTTPS/domain redirects and response-header verification.
- Search Console/Bing property verification, sitemap submission and indexing monitoring.
- Rich Results Test and real production Core Web Vitals assessment.
- Client review of business facts, service availability and deferred legal copy.
- Genuine local content and Google Business Profile ownership/verification.

## Sources

- Google JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google canonical URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Vite server rendering: https://vite.dev/guide/ssr
- React hydration: https://react.dev/reference/react-dom/client/hydrateRoot
- Cloudflare Pages serving and 404 behaviour: https://developers.cloudflare.com/pages/configuration/serving-pages/
- Cloudflare Pages redirects: https://developers.cloudflare.com/pages/configuration/redirects/

## AI crawler access and discovery files

Each build generates these files from the same confirmed company, service, location and route data:

- `/sitemap.xml` - all 61 canonical indexable HTML pages; search and error pages are excluded. No invented modification dates or priority scores are added.
- `/robots.txt` - the standard crawler file. `User-agent: *` with `Allow: /` permits search and AI crawlers, including search, user-request and training bots. There are no agent-specific block rules or crawl delays.
- `/robot.txt` - an identical convenience copy for the singular filename; crawlers normally read `/robots.txt`.
- `/llms.txt` - an AI-readable business summary and links to every indexable page. It follows the emerging Markdown discovery convention and is supplementary to the actual HTML pages.
- `/agent.txt` and `/agents.txt` - identical site-specific business and enquiry guidance. These do not claim compliance with one of the competing agent discovery proposals or announce unimplemented APIs.

HTML includes discoverable links to the sitemap and text guides. The agent guide explains that quotes are enquiries and final bookings need agreement with the business. It links the real contact and quote forms and does not claim instant payments or confirmed booking automation. Text files do not grant access to private customer records.

The build checker verifies sitemap membership, unrestricted robots rules, the discovery index's coverage and valid page destinations, and matching alias files. Rebuild after changing business data.

### Check the live CDN settings before launch

Repository files do not override Cloudflare account rules. Review Security Settings / Configure AI bot policies, Block AI Bots, AI Crawl Control and managed robots.txt preferences for the production zone. Ensure the intended search, user and training behaviours are allowed and that Cloudflare is not injecting conflicting disallow rules. Review crawler-specific WAF blocks/challenges and bot rules using the verified provider identities/IP lists. Keep form security and private/admin authentication in place; public crawler access does not require opening private APIs.

Check the live `/robots.txt` response after deployment, using actual provider crawls and Security Events where possible. Spoofing a user-agent string alone does not prove that a verified crawler is allowed. Preview-domain noindex headers remain intentional: the canonical production site is indexable and public pages are crawlable, while duplicate preview deployments should not appear in search.

No universal adoption or ranking guarantee exists for `agent.txt` or `llms.txt`. Google says conventional SEO remains the foundation for its generative search features; the generated HTML, truthful content, internal links and structured data remain the primary implementation.

Additional references:

- OpenAI crawler roles and access: https://developers.openai.com/api/docs/bots
- Anthropic crawler roles: https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity crawler access: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- Google generative-search guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Emerging llms.txt convention: https://llmstxt.org/
- Chrome Lighthouse llms.txt guidance: https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt
- Cloudflare AI bot settings: https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/
- Cloudflare AI Crawl Control: https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/
