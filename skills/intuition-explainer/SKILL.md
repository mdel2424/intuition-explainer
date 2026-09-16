---
name: intuition-explainer
description: >-
  Build or edit interactive educational websites that develop intuition through
  prediction, manipulation, real computation, and transfer. Use for explorable
  explanations of unfamiliar concepts, mathematics, algorithms, research papers,
  weekly lecture notes, and interactive textbooks. Choose this for learning
  environments, not ordinary webpages, dashboards, static plots, or text-only explanations.
---

# Intuition explainer

Begin with: **What can the learner manipulate, predict, observe, or break that
makes the idea intuitive?** Choose the representation from that question.
User scope, stack, theme, and detail override defaults; this workflow adds no
approval gates.

## Teaching contract

- **Reason before revealing.** Use PREDICT → MANIPULATE → OBSERVE → EXPLAIN →
  GENERALIZE where outcomes can be anticipated. Setup manipulation may precede
  prediction; the answer may not. Include a new transfer situation.
- **Earn notation.** Start with a concrete obstacle and a counterexample to a
  plausible naive model. Introduce formalism when it solves an experienced
  problem; link symbols to visible objects and values.
- **Compute the mechanism.** Test the real reduced process independently of
  rendering. Interpolation connects computed states; it never invents results.
  Separate model state, lesson progress, and visual playback. Replay cannot
  apply an update twice; input changes invalidate dependent predictions.
- **Keep the learner in control.** Support direct manipulation, pause, replay,
  reset, stage revisiting, and free exploration. Preserve object identity.
- **Declare fidelity.** Maintain a COMPUTED / SIMPLIFIED / ASSUMED / ILLUSTRATIVE
  ledger. Expose substantial simplifications in About and label illustrative
  values where shown; toy results are not empirical evidence.

## Workflow

Follow these phases in order; resolve a phase's uncertainties before building
on it. Read only references needed for the current phase or source type, once;
reuse material already in context. Do not bulk-load references, READMEs, or
maintenance docs. These are authoring phases, not a required screen count.

| Phase | Read when applicable | Output / gate |
|---|---|---|
| Inspect supplied sources | Paper or section: [paper-explainers](references/paper-explainers.md). Course or multiple lectures: [course-explainers](references/course-explainers.md). | Inspect actual sources and record claim locators before designing. Preserve requested coverage; flag missing material and continue only independent work. |
| Plan learning | [concept-decomposition](references/concept-decomposition.md), [pedagogy](references/pedagogy.md). Mathematical claims or proofs: [math-explainers](references/math-explainers.md). | Concise internal `CONCEPT-PLAN.md` using the required plan fields. No UI code yet. |
| Design experiments and model | [interaction-patterns](references/interaction-patterns.md), [fidelity](references/fidelity.md) | Predictions, pure model API, numerical boundaries, `FIDELITY.md`. Trace an input through computation to visible evidence; resolve any gap before rendering. |
| Implement and test the mechanism | Use the model contract above. | Model runs without DOM, timers, or prose. Test known answers, invariants, edge cases, counterexample, and input sensitivity before presentation. |
| Render and guide | [visual-language](references/visual-language.md), [accessibility](references/accessibility.md), [narration](references/narration.md). Motion or playback: [animation](references/animation.md). | Linked representations, prediction/reveal, prerequisite detours, replay, exploration, and new transfer case. No reading timers. |
| Verify and revise | [checklist](references/checklist.md) | Run syntax/model/browser checks, inspect screenshots, answer all 13 pedagogical questions with evidence, and revise weak results. |

Check uncertain technical facts against primary sources; never invent missing
source content. Keep explicit source claims, mathematical consequences, teaching
analogies, and simplifications distinct. A course needs every supplied week, a navigable index,
missing-source notices, and a target and experiment per unit; do not collapse a
requested course or paper into one convenient example.

## Defaults

Use the **3Blue1Brown-inspired dark theme** and exact tokens in visual-language:
black page/stage, near-black controls, white text, blue/teal/yellow accents shared
by HTML, SVG, and Canvas.

Deliver semantic HTML, local CSS, and vanilla JavaScript that opens directly as
`index.html` through `file://`: no server, build step, runtime installation, or
network dependency. Do not start a preview server. Use SVG for moderate geometry,
Canvas for many marks/continuous fields, and DOM text for prose/equations.

Use inline or classic scripts in dependency order (`defer` for external scripts).
Embed data or load classic data scripts; avoid browser ES modules, local-file
`fetch`, remote fonts, CDNs, and service workers. Online citations are optional
to follow. If the user requests another stack, explain any effect on offline use.

Separate model, lesson, rendering, and interaction responsibilities without
prescribing a file count; one self-contained HTML file is fine. Use scoped
functions/IIFEs and a small shared namespace for multiple classic scripts.
Renderers consume one model snapshot instead of reimplementing calculations.
Course pages use relative links.

Deliver the working site, source/fidelity notes, verification evidence and
limitations, and the mental model learned. Missing tooling is a verification
gap: complete independent work and name unchecked items, never claim a pass.
