#!/usr/bin/env node
// Shared browser harness. Lesson-specific interactions live in the site's adapter.
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, resolve, sep, extname } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const options = { site: resolve(skill, 'assets/template'), out: resolve('evidence'), adapter: null, url: null };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--help') {
    console.log(`Usage: node smoke.mjs [URL] [--site directory] [--adapter file.mjs] [--out directory]
Default: serve the finished exemplar on loopback and run its browser scenarios.
Another site: --site ./my-explainer (expects tests/browser-scenarios.mjs).
Existing server: http://127.0.0.1:8000 --adapter ./tests/browser-scenarios.mjs.
Run from a directory with Playwright installed: npm install --save-dev playwright
Install its browser if needed: npx playwright install chromium
Writes screenshots plus report.json. Exit 1 on a failure, 2 on missing tools.
Adapt the scenario adapter to each new lesson. Open screenshots before claiming visual QA.`);
    process.exit(0);
  } else if (['--site', '--adapter', '--out'].includes(arg)) {
    if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value for ${arg}`);
    options[arg.slice(2)] = resolve(args[++i]);
  } else if (/^https?:\/\//.test(arg) && !options.url) options.url = arg;
  else throw new Error(`Unknown argument: ${arg}`);
}
if (options.url && !options.adapter) throw new Error('An existing URL requires --adapter so the correct lesson is verified.');
options.adapter ??= resolve(options.site, 'tests/browser-scenarios.mjs');

let chromium;
try {
  const require = createRequire(resolve(process.cwd(), 'package.json'));
  ({ chromium } = require('playwright'));
} catch {
  try { ({ chromium } = await import('playwright')); }
  catch {
    console.error('Playwright is unavailable. Run npm install --save-dev playwright and npx playwright install chromium in your project. No browser verification has passed.');
    process.exit(2);
  }
}
const adapter = await import(pathToFileURL(options.adapter));
if (typeof adapter.exercise !== 'function') throw new Error('Adapter must export async exercise({ page, check, shot, profile }).');
await mkdir(options.out, { recursive: true });
const report = { site: options.site, adapter: options.adapter, started: new Date().toISOString(), profiles: [], errors: [], screenshots: [], visualInspection: 'Required: open the captured images; this script cannot judge pedagogy or visual clarity.' };
let server, browser;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' };
try {
  if (!options.url) {
    server = createServer(async (request, response) => {
      try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const file = resolve(options.site, `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`);
        if (!file.startsWith(options.site + sep)) { response.writeHead(403); response.end(); return; }
        const body = await readFile(file);
        response.writeHead(200, { 'Content-Type': `${types[extname(file)] ?? 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
        response.end(body);
      } catch { response.writeHead(404); response.end('Not found'); }
    });
    await new Promise((yes, no) => { server.once('error', no); server.listen(0, '127.0.0.1', yes); });
    options.url = `http://127.0.0.1:${server.address().port}/`;
  }
  browser = await chromium.launch({ headless: true });
  const profiles = [
    { name: 'desktop', width: 1280, height: 900, reducedMotion: 'no-preference', full: true },
    { name: 'laptop', width: 1024, height: 768, reducedMotion: 'reduce' },
    { name: 'mobile', width: 390, height: 844, reducedMotion: 'reduce', touch: true },
    { name: 'narrow', width: 320, height: 740, reducedMotion: 'reduce' },
    { name: 'landscape', width: 844, height: 390, reducedMotion: 'reduce' },
    { name: 'zoom-reflow', width: 640, height: 900, reducedMotion: 'reduce', dpr: 2 }
  ];
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: profile.dpr ?? 1, reducedMotion: profile.reducedMotion, hasTouch: !!profile.touch });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const run = { profile: profile.name, viewport: `${profile.width}×${profile.height}`, motion: profile.reducedMotion, assertions: [], visited: [] };
    report.profiles.push(run);
    const error = message => report.errors.push(`${profile.name}: ${message}`);
    page.on('pageerror', e => error(`pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') error(`console: ${m.text()}`); });
    page.on('requestfailed', r => error(`request failed: ${r.url()}`));
    page.on('response', r => { if (r.status() >= 400) error(`HTTP ${r.status()}: ${r.url()}`); });
    const check = (condition, message) => { assert.ok(condition, `${profile.name}: ${message}`); run.assertions.push(message); };
    const shot = async name => {
      const filename = `${profile.name}-${name}.png`;
      await page.screenshot({ path: resolve(options.out, filename), fullPage: true });
      report.screenshots.push(filename);
    };
    try {
      await page.goto(options.url, { waitUntil: 'networkidle' });
      run.visited = await adapter.exercise({ page, check, shot, profile });
      console.log(`PASS ${profile.name}: ${run.assertions.length} assertions; ${run.visited.length} stages`);
    } catch (e) {
      error(e.stack ?? e.message);
      await shot('failure').catch(() => {});
      console.error(`FAIL ${profile.name}: ${e.message}`);
    } finally { await context.close(); }
  }
} catch (error) { report.errors.push(error.stack ?? error.message); }
finally {
  await browser?.close();
  if (server) await new Promise(done => server.close(done));
  report.finished = new Date().toISOString();
  report.passed = report.errors.length === 0 && report.profiles.length === 6;
  await writeFile(resolve(options.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
}
if (!report.passed) {
  console.error(report.errors.join('\n')); process.exitCode = 1;
} else console.log(`PASS: screenshots and report in ${options.out}. Open the screenshots for visual review.`);
