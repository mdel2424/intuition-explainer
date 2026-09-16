# Reference inspection and design decisions

Inspected before implementation: `LaurentiuGabriel/learnscape`, revision
`5c8af77808ba11bff6f4b46297dc45514247c4a5`, downloaded to a temporary read-only
reference checkout. The new skill was authored in an initially empty workspace.
The upstream skill was not edited or copied as the implementation.

## What was inspected

- [SKILL.md](https://github.com/LaurentiuGabriel/learnscape/blob/5c8af77808ba11bff6f4b46297dc45514247c4a5/skills/isometric-explainer/SKILL.md): trigger scope, rules, reference routing, architecture, template, and finish criteria.
- Its `references/` organization: build order, fidelity, checklist, pacing,
  narration, and the drawing guide. Their boundaries informed progressive
  disclosure here rather than one oversized entry point.
- The finished PacketPost template: HTML/CSS, README, the full numerical model,
  simulation state, runtime wiring, world definitions, and renderer/UI state
  consumption. In particular, cost arithmetic is separate from route animation.
- [The smoke script](https://github.com/LaurentiuGabriel/learnscape/blob/5c8af77808ba11bff6f4b46297dc45514247c4a5/skills/isometric-explainer/scripts/smoke.mjs): browser errors, stage coverage, screenshots, and resolving Playwright from the caller's directory.
- [Fidelity rules](https://github.com/LaurentiuGabriel/learnscape/blob/5c8af77808ba11bff6f4b46297dc45514247c4a5/skills/isometric-explainer/references/fidelity.md): explicit numerical boundaries and public disclosures.

## What the new skill preserves

Model-first construction, a complete exemplar, narrow responsibilities, explicit
numerical honesty, staged build instructions, error-detecting browser checks,
and opening screenshots before reporting visual success. These are architectural
ideas that remain useful when the representation changes.

## What changes

| Reference-specific design | Decision for intuition-explainer |
|---|---|
| A place and a traveling piece of state | Choose a representation from the conceptual obstacle |
| Stations organize narration | Prediction/reveal/transfer organize learning |
| Timed first visits | Learner-controlled advancement; no reading timer |
| Canvas, globals, IIFEs, direct file opening | Semantic HTML, SVG by default, modern modules, lightweight static HTTP |
| Reusable fixed engine files | Flexible responsibility boundaries; no compulsory scene engine |
| Smoke test calls simulation globals | Shared harness with a per-site adapter that drives actual controls |
| Fidelity disclosure at completion | Plan the ledger before implementation and keep it synchronized |

The instruction set is written around discovering and revising a mental model.
Its paper mode follows the authors' argument and distinguishes empirical
evidence from a toy demonstration. Its math mode distinguishes construction,
invariant, conjecture, numerical evidence, and proof.

## Packaging conventions checked

The shared [Agent Skills specification](https://agentskills.io/specification)
supports a folder with a required `SKILL.md` and progressive loading of
references, scripts, and assets. This package uses only required shared fields.
Installation and explicit invocation guidance was checked against
[official Codex guidance](https://learn.chatgpt.com/docs/build-skills) and
[Claude Code documentation](https://code.claude.com/docs/en/skills) on 2026-09-15.
No host-specific tool allowlist, context injection, or proprietary manifest is
required. The skill is not installed into personal settings by this build.
