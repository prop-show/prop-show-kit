// Regenerates /favicon.ico and /apple-touch-icon.png from .docs/public/icon.svg.
// The binaries are checked in; run this when the mark changes.
import { createRequire } from "node:module";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "../.docs/public");
const svg = readFileSync(join(publicDir, "icon.svg"));

const sharp = loadSharp();
const apple = await sharp(svg, { density: 384 }).resize(180, 180).png().toBuffer();
writeFileSync(join(publicDir, "apple-touch-icon.png"), apple);

const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map(async (size) => ({
    size,
    png: await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer(),
  })),
);
writeFileSync(join(publicDir, "favicon.ico"), ico(pngs));
console.log("wrote favicon.ico and apple-touch-icon.png");

function loadSharp() {
  const root = join(here, "../../../node_modules/.pnpm");
  const entry = readdirSync(root).find((name) => name.startsWith("sharp@"));
  if (!entry) throw new Error("sharp is not installed; run pnpm install");
  return createRequire(join(root, entry, "node_modules/sharp/package.json"))("sharp");
}

function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}
