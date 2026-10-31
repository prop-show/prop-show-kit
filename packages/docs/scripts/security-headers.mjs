// Response headers for the docs site. Production (Cloudflare `_headers` and the
// Worker) includes HSTS and `upgrade-insecure-requests`. Local `undocs dev`
// omits those so an http://127.0.0.1 server is not upgraded to a missing TLS port.

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  // undocs inlines the color-mode and theme boot scripts, and Vue SSR emits style tags.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // Contributor avatars are github.com URLs that redirect to the avatar CDN.
  "img-src 'self' data: https://github.com https://avatars.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self'",
];

export const HSTS_VALUE = "max-age=31536000; includeSubDomains; preload";

export function securityHeaders({ production = true } = {}) {
  const directives = production ? [...CSP_DIRECTIVES, "upgrade-insecure-requests"] : CSP_DIRECTIVES;
  const headers = {
    "Content-Security-Policy": directives.join("; "),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "off",
  };
  if (production) headers["Strict-Transport-Security"] = HSTS_VALUE;
  return headers;
}

export function renderCloudflareHeaders() {
  const lines = [
    "# Applied by Cloudflare Workers static assets. Keep in sync with securityHeaders().",
    "/*",
  ];
  for (const [name, value] of Object.entries(securityHeaders())) {
    lines.push(`  ${name}: ${value}`);
  }
  return `${lines.join("\n")}\n`;
}
