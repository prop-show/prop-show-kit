import { fileURLToPath } from "node:url";

import { createCLI } from "undocs/cli/cli.mjs";

const docsLayer = fileURLToPath(new URL("../.docs", import.meta.url));

process.env.BRANCH ||= "main";

createCLI({
  name: "undocs",
  description: "prop-show-kit documentation",
  setup: {
    extends: [docsLayer],
  },
}).runMain();
