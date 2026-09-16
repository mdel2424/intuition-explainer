# intuition-explainer

A reusable Agent Skill for building websites that help people reason about
difficult ideas. The learner predicts, changes something, observes a computed
consequence, revises their explanation, and tries an unfamiliar case.

The skill chooses a representation from the concept. Calculus can use linked
number lines; linear algebra can use projections; an algorithm can use an
editable graph; a paper can use a controlled comparison. An isometric world
is one possible representation, not the organizing assumption.

## What's included

- [SKILL.md](skills/intuition-explainer/SKILL.md): triggers, principles, workflow,
  reference routing, architecture, and verification requirements.
- [Twelve focused references](skills/intuition-explainer/references/build-order.md):
  pedagogy, decomposition, interactions, visual language, animation, mathematics,
  papers, narration, fidelity, accessibility, build order, and QA.
- [Local Steps](skills/intuition-explainer/assets/template/README.md): a complete
  gradient-descent explainer with real calculations, seven stages, predictions,
  direct manipulation, delayed equations, overshoot, contour maps, and transfer.
- Independent model and lesson tests, a reusable Playwright harness, and a
  domain-specific browser scenario adapter.
- [Reference inspection](docs/reference-review.md) and [verification evidence](evidence/QA.md).

```text
skills/intuition-explainer/
  SKILL.md
  README.md
  references/              detailed guidance, read when relevant
  scripts/                 syntax/package checks and browser harness
  assets/template/         finished Local Steps website, model, plan, tests
docs/reference-review.md   inspected upstream revision and design decisions
evidence/                  screenshots, browser report, pedagogical QA
```

## Install

Copy the **whole** `skills/intuition-explainer` directory, including its assets
and scripts. The skill uses only the shared `name` and `description` frontmatter
fields and relative resource paths. No proprietary invocation metadata or
agent-specific tool dependency is required. See the [Agent Skills specification](https://agentskills.io/specification).

For a first personal installation, run either or both from this repository:

```bash
# Codex
mkdir -p ~/.agents/skills
cp -R skills/intuition-explainer ~/.agents/skills/

# Claude Code
mkdir -p ~/.claude/skills
cp -R skills/intuition-explainer ~/.claude/skills/
```

For project scope, use `.agents/skills/` for Codex or `.claude/skills/` for
Claude Code in the target project. If the destination already contains this
skill, review and replace/update that folder deliberately rather than nesting
another copy inside it. Codex documents local discovery under `.agents/skills`;
Claude Code documents `.claude/skills`. These paths were checked on 2026-09-15.
[Codex installation conventions](https://learn.chatgpt.com/docs/build-skills),
[Claude Code installation conventions](https://code.claude.com/docs/en/skills).

This task creates the distributable skill in this repository; it does not modify
your personal agent configuration. If a newly installed skill is not listed,
restart the agent session and explicitly invoke it.

## Use

In Codex:

```text
$intuition-explainer Build an interactive website that helps me discover why PCA works.
```

In Claude Code:

```text
/intuition-explainer Turn section 3 of this paper into an interactive explanation.
```

Attach or identify actual source material when the lesson depends on it. State
the learner's background and constraints if known. The skill should also activate
for appropriate natural-language requests to build intuitive learning websites;
ordinary landing-page requests fall outside its scope.

## Preview the finished example

From this repository:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory skills/intuition-explainer/assets/template
```

Open `http://localhost:8000`. There is no build step, runtime library, CDN, font
download, or backend. A static HTTP server is required for ES modules; `file://`
is not supported. Copy the template to build a new lesson, then replace its
concept plan, model, instructional arc, visualization, tests, and fidelity notes.

## Verify

Node 20+ is needed for verification. The generated website itself needs only a
modern browser and a static server.

```bash
npm ci
npx playwright install chromium
npm run verify
```

`npm run check` checks skill frontmatter, local links, and every JavaScript file.
`npm test` runs the independent model/lesson tests. `npm run smoke` serves the
example on loopback, exercises the real UI at six viewport profiles, and writes
screenshots plus `evidence/report.json`. Open the screenshots; the script cannot
judge visual clarity or learning quality. [QA evidence and limits](evidence/QA.md)
records the actual inspection.

For a copied or different explainer:

```bash
node /path/to/intuition-explainer/scripts/verify.mjs --site ./my-explainer
node /path/to/intuition-explainer/scripts/smoke.mjs --site ./my-explainer --out ./my-evidence
```

Run from a directory with Playwright installed. Adapt the site's
`tests/browser-scenarios.mjs` to its controls, expected calculations, and stages.
An existing server can be tested with a URL and `--adapter`; use `--help` for
details. Browser tooling is a development dependency, not a website dependency.

## Architectural reference

The requested [isometric-explainer](https://github.com/LaurentiuGabriel/learnscape/tree/main/skills/isometric-explainer)
was inspected before implementation. This skill is independently authored and
retains its emphasis on a real model, explicit fidelity, staged construction,
a finished exemplar, automated verification, and visual inspection. It does
not modify the reference or require its renderer, vehicles, or station system.
