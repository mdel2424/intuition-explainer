#!/usr/bin/env node
// Shared browser harness. Lesson-specific interactions live in the site's adapter.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const options = { site: null, out: resolve('evidence'), adapter: null };
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--help') {
    console.log(`Usage: node smoke.mjs --site directory [--adapter file.mjs] [--out directory]
Opens index.html directly through file:// with network access disabled. No server.
The site must provide tests/browser-scenarios.mjs, or use --adapter file.mjs.
Run from a directory with Playwright installed: npm install --save-dev playwright
Install its browser if needed: npx playwright install chromium
Writes screenshots plus report.json. Exit 1 on a failure, 2 on missing tools.
Adapt the scenario adapter to each new lesson. Open screenshots before claiming visual QA.`);
    process.exit(0);
  } else if (['--site', '--adapter', '--out'].includes(arg)) {
    if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value for ${arg}`);
    options[arg.slice(2)] = resolve(args[++i]);
  } else throw new Error(`Unknown argument: ${arg}`);
}
if (!options.site) throw new Error('Provide --site <directory>. Use --help.');
const entry = resolve(options.site, 'index.html');
if (!(await stat(entry)).isFile()) throw new Error('The site must contain index.html.');
const url = pathToFileURL(entry).href;
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
const report = { site: options.site, url, offline: true, adapter: options.adapter, started: new Date().toISOString(), profiles: [], errors: [], screenshots: [], visualInspection: 'Required: open the captured images; this script cannot judge pedagogy or visual clarity.' };
let browser;
try {
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
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: profile.dpr ?? 1, reducedMotion: profile.reducedMotion, hasTouch: !!profile.touch, offline: true, serviceWorkers: 'block' });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const run = { profile: profile.name, viewport: `${profile.width}×${profile.height}`, motion: profile.reducedMotion, assertions: [], visited: [] };
    report.profiles.push(run);
    const error = message => report.errors.push(`${profile.name}: ${message}`);
    await context.route('**/*', async route => {
      const target = route.request().url();
      if (/^(?:file|data|blob):/.test(target)) await route.continue();
      else {
        error(`network dependency blocked: ${target}`);
        await route.abort('internetdisconnected');
      }
    });
    await context.routeWebSocket(/.*/, socket => {
      error(`network dependency blocked: ${socket.url()}`);
      socket.close();
    });
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
      await page.goto(url, { waitUntil: 'load' });
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
  report.finished = new Date().toISOString();
  report.passed = report.errors.length === 0 && report.profiles.length === 6;
  await writeFile(resolve(options.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
}
if (!report.passed) {
  console.error(report.errors.join('\n')); process.exitCode = 1;
} else console.log(`PASS: screenshots and report in ${options.out}. Open the screenshots for visual review.`);
