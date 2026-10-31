# Edge, HTTPS, and robots

Production is a Cloudflare Worker with static assets (`wrangler.jsonc`). Nitro route rules are not what the live site serves: `wrangler deploy` uploads `packages/docs/.output/public` only. Redirects already follow that split (`_redirects`). Security headers follow it too.

## In this repo

| Control                                                                                               | Where                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, COOP, CSP | `packages/docs/.docs/public/_headers` (from `packages/docs/scripts/security-headers.mjs`) and the same values set again on the Worker response |
| HTTP → HTTPS 301 for `kit.prop.show`                                                                  | `workers/site.mjs` (`assets.run_worker_first`)                                                                                                 |
| Same headers on `undocs dev`                                                                          | Vite middleware in `packages/docs/scripts/undocs.mjs` (no HSTS, no `upgrade-insecure-requests`)                                                |
| `sitemap.xml`                                                                                         | Written into `.output/public` at the end of `undocs build`                                                                                     |
| Canonical, `og:url`, `og:type`, `twitter:title`, JSON-LD                                              | undocs `usePageSEO` patch                                                                                                                      |
| `/favicon.ico`, `/apple-touch-icon.png`                                                               | `packages/docs/.docs/public/`                                                                                                                  |
| Origin `robots.txt`, including `Allow` for Baiduspider and the sitemap URL                            | `packages/docs/.docs/public/robots.txt`                                                                                                        |

`includeSubDomains` applies only to names under `kit.prop.show`, not to `prop.show`. The `preload` token is in the header. This repo does not submit the host to the [HSTS preload list](https://hstspreload.org/).

## Dashboard only

Nothing in this list is applied by the pull request. Someone with access to the `prop.show` zone has to do it.

1. Open the Cloudflare dashboard for the zone that owns `kit.prop.show`.
2. **SSL/TLS → Overview**. Set the encryption mode to **Full (strict)**. Workers already terminate TLS; this avoids a Flexible-SSL loop if any other record is proxied.
3. **SSL/TLS → Edge Certificates → Always Use HTTPS**: turn **On**. This redirects cleartext before the Worker. The Worker redirect covers requests that still arrive as HTTP. If `http://kit.prop.show` returns 500 instead of a redirect, check this toggle and the certificate status before changing application code.
4. **SSL/TLS → Edge Certificates → Automatic HTTPS Rewrites**: turn **On**.
5. **SSL/TLS → Edge Certificates → Minimum TLS Version**: **TLS 1.2**.
6. **SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS)**. Enabling it here duplicates the `_headers` policy at the zone. Use max-age of at least 6 months, include subdomains only if every name under `kit.prop.show` is HTTPS, and leave preload off unless you also submit the domain and accept that removal takes months.
7. **AI Crawl Control** (or **Security → Bots**, wherever **Managed robots.txt** is edited). The live `robots.txt` is a Cloudflare prefix plus this repo's file. The prefix currently contains `User-agent: Baiduspider` / `Disallow: /`. Delete Baiduspider from that managed block. This repo's file already has `Allow: /` for Baiduspider and cannot delete the managed block.

## Check after deploy

```sh
curl -sI http://kit.prop.show/ | head -n 20
curl -sI https://kit.prop.show/ | head -n 40
curl -sI https://kit.prop.show/favicon.ico | head -n 15
curl -sI https://kit.prop.show/apple-touch-icon.png | head -n 15
curl -s https://kit.prop.show/robots.txt
curl -s https://kit.prop.show/sitemap.xml | head
curl -s https://kit.prop.show/ | tr '>' '>\n' | grep -E 'canonical|og:url|og:type|twitter:title|ld\+json|favicon|apple-touch'
```

Expect a 301 from `http://` to `https://`, and on the HTTPS response: `strict-transport-security`, `x-content-type-options: nosniff`, `referrer-policy`, `x-frame-options`, `permissions-policy`, `content-security-policy`. Favicon responses are `200` with an icon or PNG body. `sitemap.xml` lists `https://kit.prop.show/` and doc paths. The homepage source includes `rel="canonical"`, `og:url`, `og:type` `website`, `twitter:title`, and `application/ld+json`. A blog post uses `og:type` `article`.
