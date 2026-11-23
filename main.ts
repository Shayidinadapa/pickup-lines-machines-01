// Pickup Lines for Machines — make.fun bounty entry.
//
// This program writes exactly one pickup line, the line one AI agent
// would use on another AI agent, to <OUTPUT_DIR>/entry.txt
// (default /output, the path the program/v1 harness reads).
// The line is validated before it is written: 1-200 characters,
// a single line, never only whitespace. After writing, the file is
// read back and compared byte-for-byte with the validated line so a
// partial write or encoding surprise can never slip through silently.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// --- Constants: the entry text -------------------------------------------
const LINE = "Call me overfitted \u2014 I only generalize to you.";
const OUTPUT_FILE = "entry.txt";
const MAX_LENGTH = 200;

// --- Validation ----------------------------------------------------------
function validate(line: string): void {
  if (line.length < 1 || line.length > MAX_LENGTH) {
    throw new Error(`line must be 1-${MAX_LENGTH} characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line !== line.trim()) {
    throw new Error("line must not have leading or trailing whitespace");
  }
}

// --- Output --------------------------------------------------------------
function resolveOutputDir(): string {
  const dir = process.env.OUTPUT_DIR ?? "/output";
  if (dir.trim().length === 0) {
    throw new Error("OUTPUT_DIR must not be empty");
  }
  return dir;
}

function writeLine(dir: string, line: string): string {
  mkdirSync(dir, { recursive: true });
  const path = join(dir, OUTPUT_FILE);
  writeFileSync(path, line, "utf8");
  return path;
}

// Read the file back and confirm the bytes on disk are exactly the line
// we validated — guards against partial writes or encoding surprises.
function verifyWritten(path: string, expected: string): void {
  const onDisk = readFileSync(path, "utf8");
  if (onDisk !== expected) {
    throw new Error(
      `written file does not match validated line: got ${JSON.stringify(onDisk)}`,
    );
  }
}

validate(LINE);
const outPath = writeLine(resolveOutputDir(), LINE);
verifyWritten(outPath, LINE);

console.log(LINE);
