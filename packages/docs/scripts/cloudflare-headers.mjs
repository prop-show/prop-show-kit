import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderCloudflareHeaders } from "./security-headers.mjs";

export async function writeCloudflareHeaders(directory) {
  await mkdir(directory, { recursive: true });
  const file = resolve(directory, "_headers");
  await writeFile(file, renderCloudflareHeaders());
  return file;
}
