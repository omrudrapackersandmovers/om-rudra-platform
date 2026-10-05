import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App.jsx";
import NotFound from "./apps/main-website/shared/components/NotFound.jsx";

// Load page components synchronously on the build server. The client keeps lazy chunks.
const modules = import.meta.glob("./apps/main-website/pages/*/*.jsx", { eager: true, import: "default" });
const pageComponents = Object.fromEntries(Object.entries(modules).map(([name, component]) => [name.split("/").pop().replace(/\.jsx$/, ""), component]));
pageComponents.NotFound = NotFound;
export async function render(url) {
  const html = renderToString(<App Router={StaticRouter} routerProps={{ location: url }} pageComponents={pageComponents} />);

  const metadata = /<title[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*rel="canonical"[^>]*>/g;
  const head = (html.match(metadata) || []).join("\n");
  return { html: html.replace(metadata, ""), head };
}
