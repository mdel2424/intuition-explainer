---
name: intuition-explainer
description: >-
  Build interactive educational websites that develop intuition through prediction,
  direct manipulation, real computation, and transfer challenges. Use for explorable
  explanations, intuitive visualizations, concept playgrounds, interactive math
  demonstrations, visual algorithm explanations, research-paper explainers,
  interactive textbooks, or 3Blue1Brown-like educational sites; for requests to
  build intuition for an unfamiliar academic concept; and for editing these sites.
  Choose this when the requested deliverable is a learning environment, not for
  ordinary webpages, dashboards, static plots, or a text-only explanation.
---

# Intuition explainer

Build a small environment in which a learner can discover an idea. Begin with:
**What can the learner manipulate, observe, predict, or break that would make
the underlying idea intuitive?** The representation follows that answer.

The user's explicit scope, technology, visual approach, and level of detail
take precedence over this skill's defaults. Make routine implementation choices
and finish the authorized work; this workflow does not add approval gates.

## Non-negotiable teaching principles

1. **Plan the mental model before the UI.** State an observable learning target,
   prerequisites, bottleneck, naive model, smallest world, invariant,
   counterexample, formal bridge, and transfer test. Save a concise internal
   `CONCEPT-PLAN.md` or equivalent authoring artifact.
2. **Let the learner reason.** Use PREDICT → MANIPULATE → OBSERVE → EXPLAIN →
   GENERALIZE wherever a result can meaningfully be anticipated. An initial
   manipulation may establish the setup, but commit a prediction before revealing
   its consequence. Every substantial lesson includes a new transfer situation.
3. **Compute the mechanism.** Write and test the underlying model independently
   of rendering. Execute the actual reduced algorithm, arithmetic, distribution,
   or transformation. Interpolation may connect computed states visually; it
   must never fabricate algorithmic results.
4. **Earn formalism.** Start with a concrete obstacle. Let a counterexample
   expose the missing idea. Introduce notation when it resolves a problem the
   learner has experienced. Link symbols to visible objects and values.
5. **Be precise about fidelity.** Maintain a ledger of COMPUTED, SIMPLIFIED,
   ASSUMED, and ILLUSTRATIVE quantities and behaviors. Expose substantial
   simplifications in an unobtrusive About section. Label illustrative values
   where they appear; never use them as empirical evidence.
6. **Keep the learner in control.** Support pause, replay, reset, earlier stages,
   parameter manipulation, and free exploration after guidance. Prefer direct
   manipulation, meaningful continuous transitions, and stable object identity.
7. **Verify teaching as well as code.** A loaded page is insufficient. Exercise
   the full lesson, test mathematics, inspect screenshots, and revise weak
   prediction, misconception, and transfer interactions.

## Workflow and reference routing

Read [build-order](references/build-order.md) first. Follow its sequence; do not
start by styling the page. Resolve each phase's uncertainties before building
on it. Read the following references when their phase or mode applies.

| Phase | Read | Concrete output |
|---|---|---|
| Inspect source; plan learning | [concept-decomposition](references/concept-decomposition.md), [pedagogy](references/pedagogy.md) | Source/claim notes and concept plan |
| A paper or paper section | [paper-explainers](references/paper-explainers.md) | Authors' reasoning chain, claim–experiment map, prerequisite detours |
| Mathematics or a theorem | [math-explainers](references/math-explainers.md) | Construction, invariant, assumptions, formal bridge; proof boundary |
| Design experiments | [interaction-patterns](references/interaction-patterns.md) | Prediction, manipulation, observable consequence, transfer |
| Specify and implement model | [fidelity](references/fidelity.md) | Model API, independent tests, fidelity ledger |
| Render the concept | [visual-language](references/visual-language.md), [animation](references/animation.md), [accessibility](references/accessibility.md) | Linked representations and operable controls |
| Build progression and exploration | [narration](references/narration.md) | Short prompts, reveal logic, replay, free exploration |
| Verify and revise | [checklist](references/checklist.md) | Test results, inspected screenshots, pedagogical QA findings |

If source material is specified, inspect the actual paper, notes, repository,
dataset, or specification before designing the lesson. Record locators and
separate explicit source claims, mathematical consequences, teaching analogies,
and simplifications. If the source is inaccessible, identify the gap; do not
invent its contents. Continue only work that does not depend on those contents.

## Default architecture

Use semantic HTML, CSS, modern vanilla JavaScript, and SVG for geometric objects.
Use Canvas when element counts or continuous drawing justify it. Keep the
website lightweight; default to no build step and no runtime dependencies.
Use an existing framework or another stack when the task gives a concrete reason.

```text
index.html
css/main.css
js/model.js          calculations; no DOM or animation clock
js/lesson.js         stages, predictions, reveal/progression, learning state
js/render.js         SVG/Canvas, labels, visual interpolation
js/interactions.js   pointer/keyboard controls; dispatches learner intentions
js/main.js           wiring and scheduling
tests/               independent model tests and browser scenarios
CONCEPT-PLAN.md       internal authoring plan
FIDELITY.md           auditable numerical and visual boundaries
```

Adapt the structure when justified. Model values have one source of truth;
renderers do not independently reimplement the algorithm. Keep lesson progress
separate from transient animation position. A replay never applies the update
twice. Changing inputs invalidates predictions tied to the old inputs.

## Finished exemplar

`assets/template/` is **Local Steps**, a complete gradient-descent lesson. Inspect
its concept plan, pure model, tests, and running website before adapting it.
It demonstrates a draggable point, committed predictions, real updates,
overshoot, delayed equations, contour maps, and a rotated-valley transfer test.

Copy it as a working starting point, not as a compulsory layout or subject:

```bash
cp -R <skill-dir>/assets/template my-explainer
cd my-explainer
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000`. ES modules require HTTP; opening this exemplar
with `file://` is not supported. Once served it needs no external services.
For a different concept, replace the model, lesson, representations, source
notes, tests, and fidelity ledger together. Do not reskin a gradient-descent
lesson and leave its instructional assumptions intact.

## Verification contract

1. Run a syntax check on **every** JavaScript file; `node --check js/*.js` checks
   only one. `scripts/verify.mjs --site <site-dir>` recursively checks the site.
2. Run the site's independent model/lesson tests. For the exemplar, `npm test`
   inside `assets/template` needs only Node 20+.
3. Run `scripts/smoke.mjs --site <site-dir> --out <evidence-dir>` from a directory
   with Playwright installed. It serves the site on loopback, checks errors and
   responsiveness, invokes `tests/browser-scenarios.mjs`, and saves screenshots
   and a JSON report. The exemplar adapter exercises actual UI controls. Adapt
   that scenario file to the new lesson; a generic load check cannot prove its
   controls or stages work. See the script's `--help` for an existing URL/adapter.
4. Exercise prediction/reveal, every stage and control, dragging, keyboard input,
   pause/resume, replay, reset, reversible history, input changes during playback,
   reduced motion, and transfer. Verify expected values, not just clickability.
5. **Open and inspect screenshots** of the first interaction, counterexample,
   formal bridge, generalization, and transfer at desktop and mobile sizes.
   Check labels, equations, correspondence, hierarchy, and browser zoom/reflow.
6. Answer all 13 pedagogical questions in [checklist](references/checklist.md).
   Record evidence and revise weak answers. Report test coverage and limitations
   honestly; missing browser tooling is a verification gap, not a passing test.

## Reject these patterns

- Animated textbook: long exposition with motion beside it.
- Formula-first lesson: definitions and equations before an experienced need.
- Dashboard syndrome: all charts and controls visible at once.
- Fake simulation: plausible keyframes masquerading as computation.
- Decorative interactivity: controls without a learning consequence.
- Terminology avalanche: advanced terms preceding a usable mental model.
- Visualization without a question: an attractive graph with no reasoning task.
- Passive tour: an animation that never asks for a prediction or explanation.

When finished, deliver the working site, source/fidelity notes, verification
evidence, and a concise statement of what mental model the learner can now use.
