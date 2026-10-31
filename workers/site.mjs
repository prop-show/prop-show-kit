import { securityHeaders } from "../packages/docs/scripts/security-headers.mjs";

// Cleartext requests for the production hostname are redirected here. Zone-level
// "Always Use HTTPS" is still a dashboard setting; this is the in-repo control.
export const HTTPS_HOSTS = new Set(["kit.prop.show"]);

export function incomingScheme(request) {
  const visitor = request.headers.get("CF-Visitor");
  if (visitor) {
    try {
      const parsed = JSON.parse(visitor);
      if (parsed?.scheme === "http" || parsed?.scheme === "https") return parsed.scheme;
    } catch {
      // A malformed CF-Visitor header falls through to the forwarded proto.
    }
  }
  const forwarded = request.headers.get("X-Forwarded-Proto")?.split(",")[0]?.trim().toLowerCase();
  if (forwarded === "http" || forwarded === "https") return forwarded;
  return new URL(request.url).protocol === "http:" ? "http" : "https";
}

export function httpsRedirect(request, hosts = HTTPS_HOSTS) {
  const url = new URL(request.url);
  if (!hosts.has(url.hostname) || incomingScheme(request) !== "http") return null;
  url.protocol = "https:";
  return Response.redirect(url.toString(), 301);
}

export function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders())) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function handleSiteRequest(request, env) {
  const redirect = httpsRedirect(request);
  if (redirect) return withSecurityHeaders(redirect);
  return withSecurityHeaders(await env.ASSETS.fetch(request));
}

export default {
  fetch: handleSiteRequest,
};
