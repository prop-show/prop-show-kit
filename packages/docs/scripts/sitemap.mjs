import { readdir, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const SKIP_PREFIXES = ["/_og/", "/_undocs/", "/_vercel/", "/api/", "/raw/"];

export function routeFromHtmlFile(file) {
  const normalized = file.split(sep).join("/");
  if (!normalized.endsWith(".html")) return null;
  if (normalized === "404.html" || normalized.endsWith("/404.html")) return null;
  if (normalized === "200.html" || normalized.endsWith("/200.html")) return null;
  const route =
    normalized === "index.html"
      ? "/"
      : normalized.endsWith("/index.html")
        ? `/${normalized.slice(0, -"/index.html".length)}`
        : `/${normalized.slice(0, -".html".length)}`;
  if (SKIP_PREFIXES.some((prefix) => route === prefix.slice(0, -1) || route.startsWith(prefix))) {
    return null;
  }
  if (route.split("/").some((segment) => segment.startsWith("_"))) return null;
  return route;
}

export function renderSitemap(routes, siteUrl) {
  const base = new URL(siteUrl);
  const locs = [...new Set(routes)]
    .sort((a, b) => a.localeCompare(b))
    .map((route) => `  <url><loc>${escapeXml(new URL(route, base).href)}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs.join("\n")}\n</urlset>\n`;
}

export async function collectHtmlRoutes(directory) {
  const routes = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith("_")) continue;
        await walk(path);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
      const route = routeFromHtmlFile(relative(directory, path));
      if (route) routes.push(route);
    }
  }
  await walk(directory);
  return routes;
}

export async function writeSitemap(directory, siteUrl) {
  const routes = await collectHtmlRoutes(directory);
  const file = join(directory, "sitemap.xml");
  await writeFile(file, renderSitemap(routes, siteUrl));
  return { file, count: routes.length };
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
