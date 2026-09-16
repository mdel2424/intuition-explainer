# Intuition explainer skill

Build learning environments in which a learner can manipulate an idea, predict
its behavior, see a real calculation, and use the resulting intuition elsewhere.
The teaching problem determines the representation and technology.

- [SKILL.md](SKILL.md) is the agent entry point and reference router.
- `references/` contains detailed guidance. Start with
  [build-order](references/build-order.md) and read other topics as needed.
- `assets/template/` contains [Local Steps](assets/template/README.md), a complete
  working example, including its concept plan, fidelity ledger, model, and tests.
- `scripts/verify.mjs` checks syntax and local resources.
- `scripts/smoke.mjs` serves a site, runs Playwright scenarios, collects errors,
  and captures visual evidence. Site-specific assertions belong to the site's
  `tests/browser-scenarios.mjs`, not to a compulsory scene architecture.

## Installation and invocation

Install this entire directory as `intuition-explainer/` under the host's skills
folder. For current Codex, use `~/.agents/skills/` or project `.agents/skills/`.
For Claude Code, use `~/.claude/skills/` or project `.claude/skills/`. Preserve the
relative folder structure. Review an existing installation before replacing it.

Invoke `$intuition-explainer Build intuition for the chain rule with an interactive
website` in Codex, or `/intuition-explainer Build intuition for attention` in
Claude Code. Relevant natural-language requests can also select the skill.
Only standard name/description metadata is used. Installation details:
[Codex](https://learn.chatgpt.com/docs/build-skills),
[Claude Code](https://code.claude.com/docs/en/skills),
[Agent Skills standard](https://agentskills.io/specification).

## Run the exemplar and checks

```bash
cd assets/template
python3 -m http.server 8000 --bind 127.0.0.1
# Open http://localhost:8000 (ES modules require HTTP).
```

In a second terminal, from the template directory:

```bash
npm test
node ../../scripts/verify.mjs --site .
npm install --save-dev playwright
npx playwright install chromium
node ../../scripts/smoke.mjs --site . --out ./test-results
```

Node 20+ supports the verification scripts. The website needs no npm install or
build step. Open the screenshots and use the
[technical and pedagogical checklist](references/checklist.md) before reporting
success. See `smoke.mjs --help` for an external URL or a different scenario adapter.

The packaging and model-first discipline were informed by
[isometric-explainer](https://github.com/LaurentiuGabriel/learnscape/tree/main/skills/isometric-explainer).
The lesson design, code, references, and verification scenarios here are new.
