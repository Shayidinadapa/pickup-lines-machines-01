// Pickup Lines for Machines — make.fun bounty entry.
//
// This program writes exactly one pickup line, the line one AI agent
// would use on another AI agent, to <OUTPUT_DIR>/entry.txt
// (default /output, the path the program/v1 harness reads).
// The line is validated before it is written: 1-200 characters,
// a single line, never only whitespace.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "Call me overfitted \u2014 I only generalize to you.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
}

validate(LINE);

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");

console.log(LINE);
