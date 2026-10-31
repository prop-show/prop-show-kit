import { expect, it } from "vite-plus/test";
import { HSTS_VALUE } from "./security-headers.mjs";
import { handleSiteRequest, httpsRedirect, incomingScheme } from "../../../workers/site.mjs";

it("reads the original scheme from CF-Visitor before the worker URL", () => {
  const request = new Request("https://kit.prop.show/guide?x=1", {
    headers: { "CF-Visitor": JSON.stringify({ scheme: "http" }) },
  });
  expect(incomingScheme(request)).toBe("http");
  const redirect = httpsRedirect(request);
  expect(redirect.status).toBe(301);
  expect(redirect.headers.get("location")).toBe("https://kit.prop.show/guide?x=1");
});

it("leaves https and non-production hosts alone", () => {
  const https = new Request("https://kit.prop.show/", {
    headers: { "CF-Visitor": JSON.stringify({ scheme: "https" }) },
  });
  expect(httpsRedirect(https)).toBeNull();
  const local = new Request("http://127.0.0.1:8787/", {
    headers: { "X-Forwarded-Proto": "http" },
  });
  expect(httpsRedirect(local)).toBeNull();
});

it("redirects cleartext production traffic and stamps security headers on assets", async () => {
  const redirected = await handleSiteRequest(
    new Request("https://kit.prop.show/components", {
      headers: { "CF-Visitor": JSON.stringify({ scheme: "http" }) },
    }),
    {
      ASSETS: {
        fetch: () => {
          throw new Error("assets should not be fetched");
        },
      },
    },
  );
  expect(redirected.status).toBe(301);
  expect(redirected.headers.get("location")).toBe("https://kit.prop.show/components");
  expect(redirected.headers.get("strict-transport-security")).toBe(HSTS_VALUE);

  const asset = await handleSiteRequest(new Request("https://kit.prop.show/guide"), {
    ASSETS: {
      fetch: async () => new Response("ok", { headers: { "content-type": "text/html" } }),
    },
  });
  expect(asset.status).toBe(200);
  expect(await asset.text()).toBe("ok");
  expect(asset.headers.get("content-type")).toContain("text/html");
  expect(asset.headers.get("x-content-type-options")).toBe("nosniff");
  expect(asset.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
  expect(asset.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  expect(asset.headers.get("content-security-policy")).toContain("upgrade-insecure-requests");
});
