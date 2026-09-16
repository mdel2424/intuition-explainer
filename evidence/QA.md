# Verification and pedagogical review

Verified on 2026-09-15 with Node 24.13.1 and Playwright 1.58.2 / headless Chromium.
This is an implementation and instructional-design review, not a learner study.

## Executed checks

- `npm run verify`: skill frontmatter/local-link/JavaScript checks, independent
  model and lesson tests, and the full browser workflow.
- **15 independent tests passed.** These check known updates, finite-difference
  gradients, descent, instability, equal-height oscillation, the zero case,
  exact contour levels, non-mutation, numerical guards, prediction gating,
  all stages, stale-input invalidation, replay, pause, reset, and history branching.
- `verify.mjs --site skills/intuition-explainer/assets/template`: all template
  JavaScript and local assets checked independently of skill packaging.
- The skill-creator's `quick_validate.py`: **Skill is valid.**
- The latest [browser report](report.json) records **258 passing assertions**, all seven
  visited stages per profile, screenshots, and zero console/page/network errors.
  The adapter drives public DOM controls, rather than a test-only state API.

Browser profiles: 1280×900 desktop with normal animation; 1024×768 laptop;
390×844 mobile with touch; 320×740 narrow; 844×390 landscape; and 640×900 at
device scale 2 for a 200%-reflow-equivalent layout. The latter checks the effective
layout width and raster scale; it is not a manual browser-toolbar zoom test.

The browser scenarios check committed predictions, all stages, exact results,
1D and 2D dragging, touch input, arrow-key manipulation, a native keyboard slider,
visible point focus, equation correspondence, pause/resume, replay without extra
updates, scrubbing, reset, input changes during playback, every surface selector,
free exploration, a numerical guard, About disclosure, reflection, revisiting,
and reduced motion including a preference change during playback.

Layout checks detect page overflow, clipped equation/readout containers, and
SVG text outside the diagram. They do not attempt to replace visual inspection.

## Visual review and resulting revisions

Opened and inspected screenshots of the hook, counterexample, formal bridge,
contour map, and transfer at desktop and compact sizes. The important states are
linked below; the complete list is in the browser report.

| State | Visual evidence |
|---|---|
| First concrete experiment; no equation | [Desktop hook](desktop-01-hook.png), [mobile hook](mobile-01-hook.png) |
| Actual oscillation and growing height | [Desktop counterexample](desktop-02-counterexample.png), [mobile counterexample](mobile-02-counterexample.png) |
| Live symbols linked to geometry | [Desktop formal bridge](desktop-03-formal-bridge.png), [320 px formal bridge](narrow-03-formal-bridge.png) |
| Equal-height curves and two coordinate changes | [Desktop contours](desktop-04-contours.png), [mobile contours](mobile-04-contours.png) |
| Unseen geometry before and after commitment | [Transfer prediction](desktop-05-transfer-prediction.png), [transfer result](desktop-06-transfer-result.png) |
| Compact and zoom-equivalent transfer layouts | [Mobile](mobile-06-transfer-result.png), [landscape](landscape-06-transfer-result.png), [reflow at scale 2](zoom-reflow-06-transfer-result.png) |

Revisions made from testing and inspection:

1. Exposed Run 6 steps immediately in free exploration.
2. Kept the coordinate scale fixed during a drag.
3. Moved compact-screen feedback and playback beside the diagram, and brought
   the diagram into view after Reveal/Run/Replay. The mobile observation loop
   is tested explicitly.
4. Reserved more axis-label space for large computed values.
5. Darkened contour lines and control borders. Measured contrast against the
   background: body text 13.16:1, secondary text 5.77:1, semantic text 4.59–5.82:1,
   contour lines 3.52:1, control boundaries 3.29:1, objective curve 3.03:1.
6. Matched the slider's resolution to modeled rates such as 0.18 and 0.12.
7. Distinguished the starting slopes in outcome narration from the current
   slopes in live readouts; added values to accessible equation-term names.

The inspected diagrams retain readable labels, visible point identity, and
explicit contour/arrow meaning. Equations wrap on narrow screens without
clipping. Mobile pages scroll vertically; they are not compressed into a fixed
screen or scaled until the text becomes too small.

## Pedagogical QA: all 13 questions

| Question | Evaluation and evidence |
|---|---|
| 1. Exact mental model? | Local slope gives a direction; a finite update also needs a distance. A large step can increase height, and local descent need not aim at the minimum. Recorded in the concept plan and enacted in stages 2, 4, and 5. |
| 2. Unnecessary first-minute terminology? | The first screen uses point, position, curve, height, and a directional question. No gradient notation or update formula is shown. Basic signed numbers and graph reading are explicit prerequisites in the plan. |
| 3. Predictions? | Five stages request a committed choice before revealing. Wrong answers receive explanatory evidence and do not trap the learner. |
| 4. Direct manipulation? | The learner drags the point in 1D and 2D; keyboard arrows and touch also work. Step size is a real model parameter. |
| 5. Visible consequences? | Point position, tangent, contour relationships, trace, current height, and equations update from the same model. Mobile Reveal brings the diagram into view. |
| 6. Misconception or failure? | At η=2.15 the 1D iterates cross the bowl and grow: height 0.72 becomes about 3.85 after six updates. A smaller rate repairs the failure. |
| 7. Motivated formalism? | The equation appears after the learner controls direction/distance and observes overshoot. It names the rule already used. |
| 8. Linked symbolic and visual representations? | Blue position, amber slope, teal step; live values and focus/select highlighting link equation terms to geometry. Contours are introduced as equal-height curves. |
| 9. Numerical claims computed? | Analytic gradients, updates, trajectories, objective values, level sets, and prediction verdicts are calculated in the model and checked independently. |
| 10. Illustrative values mistaken for evidence? | About and FIDELITY.md distinguish actual updates from interpolation and the scaled uphill arrow. There are no empirical benchmark or training claims. |
| 11. Forced passive watching? | No autoplay on load; the longest initial run is six 650 ms transitions, with pause/replay/scrub/reset available. Reduced motion completes the same computation immediately. |
| 12. Transfer instead of repetition? | A rotated and translated valley makes the first step raise y although the minimum is lower. The learner predicts the sign before seeing the slope; this cannot be answered by replaying the axis-aligned example. |
| 13. Explanation without terminology? | The transfer prompt asks why a move away from the bottom can go downhill. Free exploration asks for an explanation without the word “gradient.” A learner study would be required to establish actual learning outcomes. |

## Skill scope and portability review

Reviewed the routing against calculus, PCA, probability, attention, shortest
paths, queues, and paper-section requests. The references require different
representations, a real mechanism, explicit prerequisites, an appropriate
counterexample, and transfer; they do not prescribe this template's plots.
A routine landing-page or dashboard request is outside the trigger description.
This was a document/scope review, not a full generated-site evaluation in each
domain or a statistical test of automatic skill selection.

## Remaining limitations

- Browser automation used Chromium. Firefox, Safari, physical devices, and a
  screen reader were not comprehensively tested.
- The package follows shared Agent Skills conventions and passes structural
  validation; live discovery/invocation in separate Claude Code and Codex
  installations was not exercised in this session.
- The exemplar deliberately covers convex quadratics and supplied derivatives.
  It does not teach nonconvex optimization, differentiation, or real training.
- Transfer prose is for reflection and comparison; it is not automatically graded.
- ES modules require a static HTTP server. The site has no build step and no
  external runtime services.
