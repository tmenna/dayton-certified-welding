import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import path from "node:path";

const output = path.join(import.meta.dirname, ".cache/estimates.test.cjs");
await build({
  entryPoints: [path.join(import.meta.dirname, "src/routes/estimates.test.ts")],
  outfile: output,
  bundle: true,
  platform: "node",
  format: "cjs",
});
const result = spawnSync(process.execPath, ["--test", output], { stdio: "inherit" });
process.exit(result.status ?? 1);
