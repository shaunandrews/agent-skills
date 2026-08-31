#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePackageScanner = path.resolve(skillDir, "..", "..", "scripts", "safe-repo-scan.mjs");

let result = spawnSync("agent-canvas", ["scan-repo", ...process.argv.slice(2)], { stdio: "inherit" });

if (result.error && result.error.code === "ENOENT") {
  result = spawnSync("node", [sourcePackageScanner, ...process.argv.slice(2)], { stdio: "inherit" });
}

if (result.error) {
  console.error(result.error.message);
  process.exitCode = 1;
} else {
  process.exitCode = result.status || 0;
}
