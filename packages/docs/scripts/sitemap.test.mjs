import { readFile } from "node:fs/promises";
import { expect, it } from "vite-plus/test";
import { renderSitemap, routeFromHtmlFile } from "./sitemap.mjs";

it("maps prerendered html files to canonical paths and skips non-pages", () => {
  expect(routeFromHtmlFile("index.html")).toBe("/");
  expect(routeFromHtmlFile("components/frame/index.html")).toBe("/components/frame");
  expect(routeFromHtmlFile("guide.html")).toBe("/guide");
  expect(routeFromHtmlFile("404.html")).toBeNull();
  expect(routeFromHtmlFile("blog/missing/404.html")).toBeNull();
  expect(routeFromHtmlFile("_og/_index.html")).toBeNull();
  expect(routeFromHtmlFile("raw/guide.md.html")).toBeNull();
});

it("renders an absolute urlset and escapes locs", () => {
  const xml = renderSitemap(["/components/frame", "/", "/guide"], "https://kit.prop.show/");
  expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  expect(xml).toContain("<loc>https://kit.prop.show/</loc>");
  expect(xml).toContain("<loc>https://kit.prop.show/components/frame</loc>");
  expect(xml.indexOf("<loc>https://kit.prop.show/</loc>")).toBeLessThan(
    xml.indexOf("<loc>https://kit.prop.show/components/frame</loc>"),
  );
  expect(renderSitemap(["/a?b=1&c=2"], "https://kit.prop.show/")).toContain(
    "https://kit.prop.show/a?b=1&amp;c=2",
  );
});

it("allows Baiduspider in the origin robots file and points at the sitemap", async () => {
  const robots = await readFile(new URL("../.docs/public/robots.txt", import.meta.url), "utf8");
  expect(robots).toMatch(/User-agent: Baiduspider\nAllow: \/\n/);
  expect(robots).toContain("Sitemap: https://kit.prop.show/sitemap.xml");
  expect(robots).not.toMatch(/User-agent: Baiduspider\nDisallow:/);
});
