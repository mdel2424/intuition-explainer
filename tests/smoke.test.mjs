import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const work = await mkdtemp(join(tmpdir(), 'offline check #'));
const harness = resolve('skills/intuition-explainer/scripts/smoke.mjs');
after(() => rm(work, { recursive: true, force: true }));

async function runFixture(name, files) {
  const site = join(work, name);
  const out = resolve('test-results/offline-harness', name);
  for (const [path, contents] of Object.entries(files)) {
    const file = join(site, path);
    await mkdir(join(file, '..'), { recursive: true });
    await writeFile(file, contents);
  }
  let status = 0, output = '';
  try {
    const result = await execute(process.execPath, [harness, '--site', site, '--out', out], { timeout: 120000 });
    output = result.stdout + result.stderr;
  } catch (error) {
    status = error.code;
    output = error.stdout + error.stderr;
  }
  let report;
  try { report = JSON.parse(await readFile(join(out, 'report.json'), 'utf8')); }
  catch { /* Assert the process output when a report could not be produced. */ }
  return { status, output, report };
}

const basicAdapter = `
export async function exercise({ page, check }) {
  check(await page.locator('h1').textContent() === 'Offline fixture', 'local document loaded');
  return ['index'];
}
`;

test('local scripts, styles, interactions, and relative navigation work offline at all profiles', async () => {
  const result = await runFixture('local-files', {
    'index.html': `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline fixture</title><link rel="stylesheet" href="style.css">
<script defer src="data.js"></script><script defer src="main.js"></script>
<main><h1>Offline fixture</h1><p>Tooling check: local scripts, styles, controls, and navigation.</p>
<button id="increment">Add</button> <button id="reset">Reset</button>
<p>Count: <output id="count" aria-live="polite">0</output></p>
<a href="details.html">Open details</a></main></html>`,
    'style.css': 'body { font: 18px system-ui; margin: 24px; color: #123456; } button { font: inherit; padding: 8px; }',
    'data.js': 'globalThis.fixtureData = { increment: 3 };',
    'main.js': `(() => {
  let count = 0;
  const output = document.querySelector('#count');
  document.querySelector('#increment').addEventListener('click', () => {
    count += globalThis.fixtureData.increment;
    output.textContent = count;
  });
  document.querySelector('#reset').addEventListener('click', () => {
    count = 0;
    output.textContent = count;
  });
})();`,
    'details.html': '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Details</title><link rel="stylesheet" href="style.css"><h1>Details</h1><a href="index.html">Back</a></html>',
    'tests/browser-scenarios.mjs': `
export async function exercise({ page, check, shot, profile }) {
  check(page.url().startsWith('file:'), 'opened through file protocol');
  check(await page.evaluate(() => navigator.onLine) === false, 'browser network is offline');
  check(await page.locator('body').evaluate(el => getComputedStyle(el).color) === 'rgb(18, 52, 86)', 'local CSS loaded');
  await page.locator('#increment').focus();
  await page.keyboard.press('Enter');
  check(await page.locator('#count').textContent() === '3', 'keyboard action uses local data and script');
  await page.locator('#increment').click();
  check(await page.locator('#count').textContent() === '6', 'repeated action computes from current state');
  await page.locator('#reset').click();
  check(await page.locator('#count').textContent() === '0', 'reset restores state');
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
  if (profile.name === 'desktop' || profile.name === 'mobile') await shot('local-files');
  await page.getByRole('link', { name: 'Open details' }).click();
  check(await page.locator('h1').textContent() === 'Details', 'relative page navigation works');
  await page.getByRole('link', { name: 'Back', exact: true }).click();
  await page.locator('#increment').click();
  check(await page.locator('#count').textContent() === '3', 'scripts work after navigating back');
  return ['index', 'details'];
}
`
  });
  assert.equal(result.status, 0, result.output);
  assert.equal(result.report?.passed, true, result.output);
  assert.equal(result.report.offline, true);
  assert.match(result.report.url, /^file:.*%20.*%23/);
  assert.equal(result.report.profiles.length, 6);
  assert.deepEqual(result.report.errors, []);
  for (const profile of result.report.profiles) {
    assert.deepEqual(profile.visited, ['index', 'details']);
    assert.equal(profile.assertions.length, 9);
  }
});

test('a remote dependency fails verification even when the local UI loads', async () => {
  const result = await runFixture('network-dependency', {
    'index.html': '<!doctype html><title>Offline fixture</title><h1>Offline fixture</h1><script src="https://example.invalid/remote.js"></script>',
    'tests/browser-scenarios.mjs': basicAdapter
  });
  assert.equal(result.status, 1, result.output);
  assert.equal(result.report?.passed, false, result.output);
  assert.ok(result.report.errors.some(error => error.includes('network dependency blocked: https://example.invalid/remote.js')));
  assert.equal(result.report.profiles.length, 6);
});

test('module loading that requires an HTTP origin fails direct-file verification', async () => {
  const result = await runFixture('module-dependency', {
    'index.html': '<!doctype html><title>Offline fixture</title><h1>Offline fixture</h1><script type="module" src="module.js"></script>',
    'module.js': 'export const value = 1;',
    'tests/browser-scenarios.mjs': basicAdapter
  });
  assert.equal(result.status, 1, result.output);
  assert.equal(result.report?.passed, false, result.output);
  assert.ok(result.report.errors.some(error => error.includes('module.js')));
});

test('missing lesson scenarios cannot silently pass as a load-only check', async () => {
  const result = await runFixture('missing-adapter', {
    'index.html': '<!doctype html><title>Offline fixture</title><h1>Offline fixture</h1>'
  });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /browser-scenarios\.mjs/);
  assert.notEqual(result.report?.passed, true);
});
