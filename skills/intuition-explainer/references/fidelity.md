# Fidelity and source honesty

Keep an internal ledger as soon as the model is specified. Publish substantial
boundaries in **About this model**, with a fuller README or `FIDELITY.md`.
Label approximations and illustrative values where they appear.

| Classification | Meaning | Example |
|---|---|---|
| COMPUTED | Actually calculated by this implementation | Softmax weights from the entered scores; an executed shortest path |
| SIMPLIFIED | Real mechanism with deliberately reduced scope | Three tokens and two features; a convex 2D loss instead of a training model |
| ASSUMED | Externally chosen input or condition | Independent arrivals, Euclidean metric, fixed weights, teaching dataset |
| ILLUSTRATIVE | Visually chosen; not quantitative evidence | Animation duration, decorative dimensions, a normalized arrow length |

Choose a precise object for each ledger row. The attention mechanism can be
SIMPLIFIED while its individual weights are COMPUTED; record these as separate
claims. Include a code location or source locator, units, omissions, and what
the learner may infer. Do not hide uncertainty in vague labels like “realistic.”

## Model/renderer boundary

The model runs without DOM, SVG, Canvas, animation clocks, or lesson transitions.
Give it explicit inputs and derived outputs. Compute the actual reduced process,
not a table of plausible results. Lookups of real input data or memoization are
fine; pre-baked output sequences pretending to react to arbitrary input are not.

The renderer reads model outputs. It may interpolate between them for continuity,
but interpolation is not an algorithm update or experiment. The lesson owns
predictions and progression; the animation cannot silently change either.

Document numerical precision, sampling, seeded randomness, finite domains,
clipping, display scaling, convergence criteria, and guard conditions when they
matter. A numerical limit is not convergence. Avoid clamping away an intended
failure; show the last calculated value and the reason the run stopped.

## Source accuracy is a second axis

Track whether a statement is an explicit source claim, mathematical consequence,
teaching analogy, or pedagogical simplification. A COMPUTED toy result is still
not empirical evidence for a paper. Likewise an assumed parameter may be a
faithful reproduction of an author's stated assumption.

Do not call a toy example a replication unless its data and procedure support
that claim. No invented benchmark scores, training outcomes, empirical evidence,
or accuracy numbers. For each important displayed number, answer “where did this
come from?” with code or a source. If it is illustrative, say so visibly.

## Useful independent checks

Check conservation, normalization, symmetry, known solutions, limiting cases,
and counterexamples. Use alternate methods when feasible: finite differences
for analytic derivatives, exhaustive tiny graphs for shortest paths, or exact
probabilities alongside seeded sampling. A test that duplicates the same formula
verbatim may reproduce the same error.
