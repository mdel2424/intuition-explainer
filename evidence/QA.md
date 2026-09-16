# Verification results and limits

Verified on 2026-09-16 with Node and Playwright/Chromium using the installed
project development dependencies. No preview or HTTP server was started.

## Executed checks

- `npm run verify`: skill frontmatter, JavaScript syntax, local links, and all
  four browser-harness regression tests passed.
- The offline fixture passed 54 assertions across six viewport profiles: local
  scripts and CSS, script dependency order, keyboard and pointer actions, reset,
  relative page navigation and return, offline state, and horizontal overflow.
- The other tests confirmed rejection of remote dependencies, browser module
  loading that requires an HTTP origin, and missing lesson scenario adapters.
- The skill-creator's `quick_validate.py` reported `Skill is valid!`.
- `git diff --check` passed.
- All 31 archived lesson and evidence files match their original tracked
  contents byte-for-byte.

The six browser profiles are desktop, laptop, mobile, narrow, landscape, and a
640-pixel-wide reflow layout at device scale 2. Reports and screenshots are
written to `test-results/offline-harness/` (ignored generated output).
Opened the desktop and mobile fixture screenshots: text, controls, and links
are readable, and the compact layout wraps without horizontal overflow.

## Scope

These checks validate the reusable skill and its offline browser tooling. The
fixtures are not lesson templates or evidence of teaching quality. A generated
explanation still needs its own numerical/model tests, UI scenarios, source
coverage review, visual inspection, and pedagogical checks.

Earlier lesson-specific screenshots and review records are preserved under
`archive/legacy-demo/evidence/`; they do not describe the current package.
The archived demo is outside the installable skill and active verification.

## Limits

Browser checks used Chromium; Firefox, Safari, physical devices, and screen
readers were not tested. The reflow profile does not replace manual browser
zoom testing. Installation instructions were checked against the installed
skill-installer guidance and official Codex documentation; no new personal
skill installation was performed. Course guidance was reviewed for coverage,
source tracing, and offline navigation; no full course was generated in this
maintenance task.
