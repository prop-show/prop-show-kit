import { readFile } from "node:fs/promises";
import { expect, it } from "vite-plus/test";
import { HSTS_VALUE, renderCloudflareHeaders, securityHeaders } from "./security-headers.mjs";

it("publishes the production header policy as a Cloudflare _headers file", async () => {
  const rendered = renderCloudflareHeaders();
  expect(rendered.startsWith("/*\n") || rendered.includes("\n/*\n")).toBe(true);
  for (const [name, value] of Object.entries(securityHeaders())) {
    expect(rendered).toContain(`  ${name}: ${value}\n`);
  }
  expect(rendered).toContain(`Strict-Transport-Security: ${HSTS_VALUE}`);
  expect(rendered).toContain("X-Content-Type-Options: nosniff");
  expect(rendered).toContain("Referrer-Policy: strict-origin-when-cross-origin");
  expect(rendered).toContain("upgrade-insecure-requests");
  const checkedIn = await readFile(new URL("../.docs/public/_headers", import.meta.url), "utf8");
  expect(checkedIn).toBe(rendered);
});

it("ships a real favicon.ico and a 180px apple touch icon", async () => {
  const ico = await readFile(new URL("../.docs/public/favicon.ico", import.meta.url));
  expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
  expect(ico.readUInt16LE(4)).toBe(3);
  const png = await readFile(new URL("../.docs/public/apple-touch-icon.png", import.meta.url));
  expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(png.readUInt32BE(16)).toBe(180);
  expect(png.readUInt32BE(20)).toBe(180);
});

it("keeps HSTS and insecure-request upgrades off the local dev policy", () => {
  const headers = securityHeaders({ production: false });
  expect(headers["Strict-Transport-Security"]).toBeUndefined();
  expect(headers["Content-Security-Policy"]).not.toContain("upgrade-insecure-requests");
  expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
});
