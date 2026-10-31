import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// `docs.yaml` redirects are Nitro route rules. Production uploads only
// `.output/public` as Cloudflare Workers static assets, which applies `_redirects`
// and never those route rules. Exact rules are emitted before splat rules.
export function cloudflareRedirectRules(redirects) {
  const staticRules = [];
  const dynamicRules = [];
  if (!redirects || typeof redirects !== "object") return [];
  for (const [rawFrom, rawTo] of Object.entries(redirects)) {
    if (!rawFrom || typeof rawTo !== "string" || !rawTo) continue;
    const from = rawFrom.startsWith("/") ? rawFrom : `/${rawFrom}`;
    if (from.endsWith("/**")) {
      const base = from.slice(0, -3);
      const source = base || "/";
      const preserveTail = rawTo.endsWith("/**");
      const target = preserveTail ? rawTo.slice(0, -3) || "/" : rawTo;
      addRule(staticRules, source, target);
      if (source !== "/") addRule(staticRules, `${source}/`, target);
      const prefix = source.endsWith("/") ? source : `${source}/`;
      addRule(dynamicRules, `${prefix}*`, preserveTail ? `${joinPath(target)}:splat` : target);
    } else {
      addRule(staticRules, from, rawTo);
      if (!from.endsWith("/")) addRule(staticRules, `${from}/`, rawTo);
    }
  }
  return [...staticRules, ...dynamicRules];
}

export function renderCloudflareRedirects(redirects) {
  const lines = cloudflareRedirectRules(redirects).map(
    (rule) => `${rule.source} ${rule.destination} 301`,
  );
  return `${["# Generated from .config/docs.yaml redirects.", ...lines].join("\n")}\n`;
}

export async function writeCloudflareRedirects(directory, redirects) {
  await mkdir(directory, { recursive: true });
  const file = resolve(directory, "_redirects");
  await writeFile(file, renderCloudflareRedirects(redirects));
  return file;
}

function joinPath(target) {
  return target.endsWith("/") ? target : `${target}/`;
}

function addRule(rules, source, destination) {
  if (!source || !destination || source === destination) return;
  if (/\s/.test(source) || /\s/.test(destination)) {
    throw new Error(`Redirects cannot contain whitespace: ${source} -> ${destination}`);
  }
  if (rules.some((rule) => rule.source === source)) return;
  rules.push({ source, destination });
}
