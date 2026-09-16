# Local Steps

A complete gradient-descent lesson. Move a point, predict a step, make the step
too large, connect the behavior to an equation, and try a new contour map.
The central idea is that local downhill gives a direction; it does not promise
that every finite jump lands lower or points straight toward the minimum.

## Run

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000`. Modern vanilla JavaScript, HTML, CSS, and SVG; no
build step or runtime dependencies. ES modules require HTTP rather than `file://`.
Once served, the site uses no external network resources.

## Learn and explore

| Stage | Experiment |
|---|---|
| Find downhill | Drag the point; predict left, right, or staying still |
| Choose a distance | Change step size; predict the landing height |
| Break the rule | Observe six oversized steps; repair the failure |
| Name the pattern | Link position, slope, and step size to a live equation |
| Add a dimension | Predict which coordinate changes more on a contour map |
| Try a new valley | Predict vertical motion on a rotated, shifted surface |
| Explore freely | Choose a surface, position, and step size; compare histories |

Commit a prediction, then reveal. An incorrect prediction gives evidence and
still allows progression. Changing inputs starts a fresh experiment and clears
the old prediction. The bottom cross, labels, dashes, and readouts supplement
color. Keyboard movement and reduced motion preserve the same experiment.

| Control | Behavior |
|---|---|
| Drag the point | Choose a starting position in −4…4 per coordinate |
| Focus point; arrow keys | Move by 0.15; Shift moves by 0.5; Home sets (0,0) |
| Step-size slider | Recompute from the chosen start; keyboard arrows work |
| Reveal / take another step | Commit a computed update; the overshoot stage uses six |
| Run 6 steps | Run a short experiment after the first reveal or during free exploration |
| Pause / Resume | Freeze or continue the same transition |
| Replay | Animate the last computed experiment without adding steps |
| Recorded step | Scrub discrete history; new steps branch from the selected iterate |
| Reset experiment | Restore the current stage's defaults, keeping unlocked stages |
| Back / stage navigation | Revisit an earlier idea |
| Colored equation terms | Focus or select to highlight matching geometry |

On compact screens, revealing brings the diagram into view and places feedback
and playback alongside it. Nothing plays automatically on load. A guided stage
advances only after an attempted experiment has been observed.

## Architecture

```text
js/model.js          pure objectives, gradients, updates, trajectories, contours
js/lesson.js         prediction evaluation, learning state, recorded playback
js/render.js         SVG projection, DOM readouts, visual interpolation
js/interactions.js   direct manipulation and native controls; action dispatch
js/main.js           module wiring and animation scheduling
tests/               model, lesson, and real-UI browser scenarios
```

The model has no DOM, timer, or renderer dependency. A trajectory is computed
before it is animated. Visual frames between iterates never become optimizer
states. The pure lesson controller owns prediction and progression; a replay
cannot add a model update. Renderers consume the same model functions as tests.

The [concept plan](CONCEPT-PLAN.md) records the teaching decisions made before
UI implementation. The [fidelity ledger](FIDELITY.md) is the full numerical and
visual contract. Its four classifications also appear in **About this model**:

- **COMPUTED:** heights, analytic gradients, iterates, contour levels, verdicts.
- **SIMPLIFIED:** deterministic convex quadratics in one or two dimensions;
  exact gradients and fixed step sizes; no real training experiment.
- **ASSUMED:** starting points, curvatures, learning rates, Euclidean metric,
  and finite browser guards. A numerical stop is not convergence.
- **ILLUSTRATIVE:** animation timing and interpolation; the amber uphill arrow's
  display length. The teal update arrow is the real coordinate displacement.

These bowls do not model nonconvex losses, noise, momentum, or adaptive learning
rates. The lesson supplies derivatives; deriving them requires another lesson.
The transfer reflection is not automatically graded. There is no empirical
claim about learning efficacy or machine-learning performance.

## Verify or adapt

`npm test` runs the mathematical and lesson tests with Node 20+, without a
browser. They include finite-difference gradient checks, exact updates,
contour level consistency, overshoot, stationary cases, replay, input
invalidation, and stage progression.

The containing skill's `scripts/smoke.mjs --site <this-directory>` serves the site
and runs `tests/browser-scenarios.mjs` through Playwright. That adapter checks
actual controls and known results at desktop, laptop, mobile, narrow, landscape,
and a 200%-reflow-equivalent viewport. It captures important states for human
inspection. It is not a substitute for a screen-reader or learner study.

When adapting to another topic, first replace the concept plan and model tests.
Then change the model, interaction, representations, and lesson together. Update
the browser adapter's expected calculations and the fidelity ledger. Retain the
separation and teaching loop, not these particular stages or plot shapes.
