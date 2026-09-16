# Verification checklist

Keep a short QA record with actual commands, results, screenshots opened, and
unresolved limitations. Do not mark unchecked items as passed.

## Technical checks

- [ ] Every JavaScript file passes syntax checking.
- [ ] The model runs without a renderer and passes independent numerical tests.
- [ ] Known results, invariants, stationary/edge cases, and the intended failure
      example match expectations. Inputs measurably affect outputs.
- [ ] Opening `index.html` through `file://` with network access disabled works,
      including local assets and navigation, without console errors or failed requests.
- [ ] Every stage is reached through the actual UI, including transfer and free
      exploration. No test-only navigation stands in for learner navigation.
- [ ] Every control has an observable effect; predictions are committed before
      reveal and invalidated when their inputs change.
- [ ] Dragging, keyboard equivalents, sliders, selectors, and prediction choices
      work, including bounds, zero/tie cases, touch/pointer cancellation.
- [ ] Important animations complete; pause/resume, replay, reset, stage revisiting,
      scrubbing, and input changes during playback preserve correct state.
- [ ] Replay reuses computation and does not append duplicate model updates.
- [ ] Reduced motion preserves results and navigation, including a preference
      change during playback.
- [ ] Desktop/laptop, mobile, landscape, and zoom/reflow layouts remain readable.
- [ ] Label collision and clipped equations are checked at extreme values.
- [ ] Focus states, names, contrast, non-color cues, and non-hover access exist.
- [ ] The default 3Blue1Brown-inspired palette (or the user's requested theme)
      is consistent across pages, controls, equations, SVG, and Canvas; object
      colors retain their meaning and actual foreground/background pairs pass contrast checks.
- [ ] Model assumptions, illustrative quantities, and source claims are traceable.

## Verification workflow

1. Run `node <skill-dir>/scripts/verify.mjs --site <site-dir>` to check every
   JavaScript file and local asset. `node --check js/*.js` checks only one file.
   Run the site's independent model/lesson tests for known answers, invariants,
   edge cases, input sensitivity, and the intended counterexample.
2. From a directory with Playwright installed, run
   `node <skill-dir>/scripts/smoke.mjs --site <site-dir> --out <evidence-dir>`.
   Supply the site's `tests/browser-scenarios.mjs` exporting
   `async exercise({ page, check, shot, profile })`, or pass `--adapter <file.mjs>`.
   Exercise real controls and every stage; assert values, not just clickability.
   The harness opens `file://`, blocks network access, checks errors and
   responsiveness, and saves screenshots plus a JSON report. Missing adapters
   fail; a generic load check cannot establish lesson correctness. Use `--help`
   for options. Browser tooling is a development dependency only.
3. **Open and inspect screenshots** of the first interaction, counterexample,
   formal bridge, linked representations/generalization, and transfer at desktop
   and mobile sizes. Check labels, equations, correspondence, hierarchy, and
   zoom/reflow, including extreme inputs. Bounds checks cannot prove readability.
4. Complete the technical checks and all 13 pedagogical questions. Revise model,
   lesson, or layout failures; rerun affected checks and the full lesson after
   shared-behavior changes. Record commands, results, inspected images, and
   limitations. Missing tools leave checks unverified; complete independent work.

## Pedagogical review: answer explicitly with evidence

1. Can I state the exact mental model this is trying to teach?
2. Does the first minute contain unnecessary terminology?
3. Is the learner asked to predict anything?
4. Can the learner directly manipulate the important quantity?
5. Is there a visible consequence to their actions?
6. Does the site expose at least one misconception or failure case?
7. Are equations introduced because they solve a problem already encountered?
8. Are symbolic and visual representations linked?
9. Are important numerical claims actually calculated?
10. Could someone confuse an illustrative quantity with a real one?
11. Is the learner ever forced to just watch for too long?
12. Does the final challenge require transfer rather than repetition?
13. Could a learner explain the concept afterward without relying on page jargon?

For each weak answer, name the missing interaction or evidence and revise it.
If several are weak, redesign the instructional arc before polishing. A high
test count does not compensate for a learner who only watches.

## Skill-level forward checks

When maintaining this skill, try requests across domains: PCA, chain rule,
attention, shortest paths, probability, a queueing mechanism, and a supplied
paper excerpt, plus a course-wide set of lecture notes. Check that the plan chooses different representations, identifies
prerequisites, inspects sources, and creates a real model and transfer test.
Also test a plain landing-page request: this skill should not claim that task.
Report whether this was a document review, a partial plan exercise, or a full
generated-site evaluation; these provide different levels of evidence.

For course summaries, also compare the source inventory with the final index,
visit every weekly page offline, check its main interaction, and follow
prerequisite and previous/next links. Record missing source material explicitly.
