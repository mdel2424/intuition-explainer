#!/usr/bin/env node
// Package links/frontmatter and every JS file; no dependencies or browser needed.
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node verify.mjs [--site path]\nWithout --site: validate this skill, local Markdown links, and all JavaScript.\nWith --site: validate site-local assets and all JavaScript; does not prove browser or model correctness.');
  process.exit(0);
}
if (args.length && (args.length !== 2 || args[0] !== '--site')) throw new Error('Expected --site <directory>. Use --help.');
const root = args.length ? resolve(args[1]) : skill;
const failures = [];
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.filter(e => !['node_modules', '.git', 'evidence', 'test-results'].includes(e.name)).map(e => {
    const p = resolve(dir, e.name); return e.isDirectory() ? walk(p) : [p];
  }))).flat();
}
const files = await walk(root);
if (!args.length) {
  const entry = await readFile(resolve(skill, 'SKILL.md'), 'utf8');
  const front = entry.match(/^---\n([\s\S]*?)\n---\n/);
  if (!front) failures.push('SKILL.md: missing YAML frontmatter');
  else {
    const name = front[1].match(/^name: (.+)$/m)?.[1];
    const description = front[1].match(/^description: >-?\n((?:[ \t]+.*\n?)+)/m)?.[1]?.trim().replace(/\s+/g, ' ');
    if (name !== basename(skill) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name ?? '') || name.length > 64) failures.push('Invalid skill name');
    if (!description || description.length > 1024) failures.push('Description must contain 1–1024 characters');
    if (entry.split('\n').length > 500) failures.push('SKILL.md exceeds the standard progressive-disclosure guidance');
  }
}
let syntax = 0, links = 0;
for (const file of files) {
  const extension = extname(file);
  if (['.js', '.mjs', '.cjs'].includes(extension)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) failures.push(`${file}: ${result.stderr || result.error}`);
    syntax++;
  }
  if (extension === '.md' || extension === '.html') {
    const source = await readFile(file, 'utf8');
    const matches = extension === '.md' ? [...source.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)]
      : [...source.matchAll(/(?:src|href)="([^"]+)"/g)];
    for (const [, target] of matches) {
      if (/^(?:[a-z]+:|#|\/\/)/i.test(target) || target.includes('<')) continue;
      const local = decodeURIComponent(target.split('#')[0].split('?')[0]);
      if (!local) continue;
      links++;
      try { await stat(resolve(dirname(file), local)); }
      catch { failures.push(`${file}: missing local target ${target}`); }
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n')); process.exitCode = 1;
} else console.log(`PASS: ${syntax} JavaScript files syntax-checked; ${links} local links/assets resolved${args.length ? '' : '; skill frontmatter valid'}.`);
