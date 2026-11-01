#!/usr/bin/env node
import console from "node:console";
import { readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const file = resolve(dirname(fileURLToPath(import.meta.url)), "../src/shared/data/words.ts");
const source = readFileSync(file, "utf8");

const lineAt = (index) => source.slice(0, index).split("\n").length;
const field = (object, name) =>
  object.match(new RegExp(`${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1];

const byKana = new Map();

for (const match of source.matchAll(/\{[^{}]*\bkana:[^{}]*\}/g)) {
  const kana = field(match[0], "kana");
  if (!kana) continue;

  const entry = { line: lineAt(match.index), en: field(match[0], "en"), ru: field(match[0], "ru") };
  byKana.set(kana, [...(byKana.get(kana) ?? []), entry]);
}

const duplicates = [...byKana].filter(([, entries]) => entries.length > 1);
const path = relative(process.cwd(), file);

if (duplicates.length === 0) {
  console.log(`No duplicate kana in ${path} (${byKana.size} words)`);
  process.exit(0);
}

for (const [kana, entries] of duplicates) {
  console.log(`\n${kana} ×${entries.length}`);
  for (const { line, en, ru } of entries) {
    console.log(`  ${path}:${line}  ${en} / ${ru}`);
  }
}

const extra = duplicates.reduce((sum, [, entries]) => sum + entries.length - 1, 0);
console.log(`\n${duplicates.length} duplicated kana, ${extra} extra entries to remove`);
process.exit(1);
