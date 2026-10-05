import path from "node:path";
import { generateDiscoveryFiles } from "./discovery.mjs";
import { generateSitemap } from "../src/data/site.js";

export function devDiscovery() {
  return {
    name: "dev-discovery-files",
    apply: "serve",
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        if (context.path !== "/" && context.path !== "/index.html") return html;
        return { html, tags: [
          { tag: "link", attrs: { rel: "preload", as: "image", href: "/images/services/home-shifting-mobile.webp", media: "(max-width: 767px)", fetchpriority: "high" }, injectTo: "head" },
          { tag: "link", attrs: { rel: "preload", as: "image", href: "/images/services/HomeShiftingServices.webp", imagesrcset: [320, 640, 960].map(width => `/images/services/HomeShiftingServices-${width}w.webp ${width}w`).join(", "), imagesizes: "100vw", media: "(min-width: 768px)", fetchpriority: "high" }, injectTo: "head" },
        ] };
      },
    },
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
