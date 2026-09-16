# Intuition explainer skill

Turn papers, lecture notes, and concepts into interactive explanations that
open directly in a browser and work offline. Choose the representation and
learning sequence from the supplied material and the learner's needs.

- [SKILL.md](SKILL.md) is the agent entry point and reference router.
- [Build order](references/build-order.md) describes the authoring workflow.
- [Paper explainers](references/paper-explainers.md) follows a paper's reasoning
  and evidence; [course explainers](references/course-explainers.md) covers
  weekly summaries and connections across a full set of notes.
- `scripts/verify.mjs` checks syntax and local resources.
- `scripts/smoke.mjs` opens local HTML with Playwright, blocks network requests,
  runs the site's browser scenarios, and captures visual evidence.

## Installation and invocation

In Codex, use the built-in installer:

```text
$skill-installer Install the intuition-explainer skill from https://github.com/mdel2424/intuition-explainer/tree/main/skills/intuition-explainer
```

Invoke `$intuition-explainer` on the next turn; restart Codex if it does not appear.
See [official Codex guidance](https://learn.chatgpt.com/docs/build-skills#install-curated-skills-for-local-use).

For Claude Code, copy this whole directory to `~/.claude/skills/intuition-explainer`
or the target project's `.claude/skills/intuition-explainer`, preserving supporting
resources. Invoke `/intuition-explainer`.
See [Claude Code guidance](https://code.claude.com/docs/en/skills).

## Example requests

```text
$intuition-explainer Read this paper and give me an intuitive, interactive look
at the problem, the authors' approach, and the evidence for their claims.
```

```text
$intuition-explainer Use all my lecture notes to make an interactive summary of
every week, with a course index, prerequisite links, experiments, and practice.
```

```text
$intuition-explainer Turn this proof into a geometric construction I can
manipulate. Show why the assumptions matter and connect the picture to notation.
```

Attach or identify the actual sources. Relevant natural-language requests can
also select the skill. Generated sites use HTML, CSS, and classic JavaScript
with local assets; open their `index.html` directly, without starting a server.

## Check a generated explanation

From the generated site's directory, with Node 20+ and Playwright installed:

```bash
node /path/to/intuition-explainer/scripts/verify.mjs --site .
node /path/to/intuition-explainer/scripts/smoke.mjs --site . --out ./test-results
```

Supply `tests/browser-scenarios.mjs` with an exported async
`exercise({ page, check, shot, profile })` function that drives the real UI and
returns the visited lesson stages. Run the site's independent model tests, open
the screenshots, and complete the [teaching checklist](references/checklist.md).
The browser harness validates offline loading; it does not establish learning
quality by itself. Browser tooling is only a development dependency.
