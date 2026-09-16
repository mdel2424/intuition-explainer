# intuition-explainer

A reusable Agent Skill for turning papers, lecture notes, and difficult concepts
into interactive explanations. Learners predict, manipulate examples, observe
computed consequences, and apply what they discover to a new case.

The source material and learning goal determine the representation: geometric
constructions, editable graphs, linked plots, controlled comparisons, or whatever
makes the idea easier to reason about.

The result is **offline HTML, CSS, and JavaScript**. Open `index.html` directly
in a browser, with no server, build step, runtime installation, or internet
connection needed to use the finished explanation.

## Install

### Codex

In Codex, invoke the built-in `$skill-installer`:

```text
$skill-installer Install the intuition-explainer skill from https://github.com/mdel2424/intuition-explainer/tree/main/skills/intuition-explainer
```

The installer installs the whole skill directory and its supporting resources.
Invoke `$intuition-explainer` on your next turn. If it does not appear, restart
Codex. See the [official Codex installation guidance](https://learn.chatgpt.com/docs/build-skills#install-curated-skills-for-local-use).

### Claude Code

From a checkout of this repository:

```bash
mkdir -p ~/.claude/skills
cp -R skills/intuition-explainer ~/.claude/skills/
```

For project scope, use `.claude/skills/` in the target project. Review an existing
installation before replacing it and preserve the whole directory structure.
See the [Claude Code skill documentation](https://code.claude.com/docs/en/skills).

## Usage examples

Attach source files or give their paths, and describe the learner's background
when it matters. In Claude Code, replace `$intuition-explainer` with
`/intuition-explainer` in these prompts.

**Understand a research paper**

```text
$intuition-explainer Read the attached paper and build an interactive explanation
that gives me a more intuitive look at the work done: what problem the authors
address, why their approach makes sense, how it works, and what the experiments
show. I know basic linear algebra. Link claims to the paper's sections and keep
toy demonstrations distinct from the authors' reported results.
```

**Turn an entire course into weekly interactive summaries**

```text
$intuition-explainer Use all the lecture notes in ./course-notes to make an
interactive summary of every week. Create a course index, preserve the weekly
order, link prerequisites across weeks, and give each week an experiment and
a check for understanding. Cite the relevant lecture pages and flag missing
weeks. Make the whole course usable offline.
```

**Make a dense section or proof intuitive**

```text
$intuition-explainer Turn section 3 of the attached paper into a visual,
interactive walkthrough. Help me discover why each assumption is needed,
connect the construction to the notation, and show what breaks when an
assumption is removed. Distinguish numerical evidence from a proof.
```

**Build intuition for a concept**

```text
$intuition-explainer Help me understand conditional probability. Let me change
the population and test accuracy, predict what a positive result means, and
see why the base rate matters before introducing Bayes' rule.
```

**Compare two methods from supplied readings**

```text
$intuition-explainer Use these two papers to explain how their methods differ.
Let me apply both to the same small example, vary the assumptions, and inspect
where each succeeds or fails. Separate the computed comparison from published
benchmark results, and cite both sources.
```

**Prepare for an exam from notes and problem sets**

```text
$intuition-explainer Use my lecture notes and problem sets to build an interactive
revision guide. Organize it by the ideas needed to solve the problems, include
prediction questions and hints, and finish each topic with an unfamiliar case.
```

**Explore an algorithm**

```text
$intuition-explainer Build an editable graph that helps me understand shortest
paths. Let me predict a route, change an edge, and inspect the algorithm's real
decisions, including ties and disconnected nodes.
```

Appropriate natural-language requests can also select the skill. It is intended
for learning environments; ordinary landing pages and dashboards fall outside
its scope.

## What's included

```text
skills/intuition-explainer/
  SKILL.md          teaching principles, source workflow, offline architecture
  README.md         installation and invocation
  references/       guidance for papers, courses, math, interaction, and QA
  scripts/          syntax/link checks and offline browser verification
tests/              regression checks for the verification tools
docs/design.md      scope and architecture decisions
evidence/QA.md      verification results and limits
```

Start with [SKILL.md](skills/intuition-explainer/SKILL.md). The references cover
[papers](skills/intuition-explainer/references/paper-explainers.md),
[course notes](skills/intuition-explainer/references/course-explainers.md),
[mathematics](skills/intuition-explainer/references/math-explainers.md), and
the [build workflow](skills/intuition-explainer/references/build-order.md).
Each explanation is authored for its material and audience.

## Offline architecture

Use semantic HTML, local CSS, and plain JavaScript. A small explanation can fit
in one HTML file; a larger one can use relative links and classic deferred
scripts. Embed lesson data or load it through local classic scripts, so opening
the files does not depend on `fetch`, module loading, a CDN, or a backend.

For a course, deliver an `index.html` linking to the weekly explanations. Keep
required assets in the folder so it can be copied or shared and opened offline.
Source citations may link to the web; learning interactions must work without
following those links.

## Verify

The finished explanations need only a browser. Maintainers can install the
development tools to check the skill and its verification harness (Node 20+):

```bash
npm ci
npx playwright install chromium
npm run verify
```

This checks syntax and local links, validates the browser harness against small
test fixtures, and records screenshots. The fixtures test tooling; they are not
lesson templates or evidence that a generated lesson teaches well.
See [verification results and limits](evidence/QA.md).

For a generated explanation, run from a directory with Playwright installed:

```bash
node /path/to/intuition-explainer/scripts/verify.mjs --site ./my-explainer
node /path/to/intuition-explainer/scripts/smoke.mjs --site ./my-explainer --out ./my-evidence
```

The browser harness opens `index.html` through `file://`, blocks network access,
and exercises six viewport profiles. Provide the site's
`tests/browser-scenarios.mjs` with assertions for its actual controls, computed
results, and learning sequence. Run independent model tests as appropriate and
open the screenshots for visual review. See `smoke.mjs --help` for adapter options.
