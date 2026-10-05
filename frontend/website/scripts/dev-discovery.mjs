import path from "node:path";
import { generateDiscoveryFiles } from "./discovery.mjs";
import { generateSitemap } from "../src/data/site.js";

export function devDiscovery() {
  return {
    name: "dev-discovery-files",
    apply: "serve",
    async configureServer(server) {
      const files = new Map();
      await generateDiscoveryFiles("", async (filename, body) => files.set(`/${path.basename(filename)}`, body));
      files.set("/sitemap.xml", generateSitemap());
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url, "http://localhost").pathname;
        if (!files.has(pathname)) return next();
        response.setHeader("Content-Type", pathname.endsWith(".xml") ? "application/xml; charset=utf-8" : "text/plain; charset=utf-8");
        response.end(files.get(pathname));
      });
    },
  };
}
