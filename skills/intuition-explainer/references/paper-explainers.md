# Research-paper explainers

Inspect the actual paper and relevant supplement, code, or data before designing
the explanation. Record title, version/date, and section/equation/figure/page
locators. Read around a selected section so its assumptions and claims retain
their context. If a source is missing, identify the gap instead of reconstructing
its content from a title, abstract, or memory.

## Reconstruct why the work exists

Use the applicable parts of this chain:

EXISTING APPROACH → LIMITATION → OBSERVATION → CORE INSIGHT → MECHANISM →
PREDICTED CONSEQUENCE → EXPERIMENT / EVIDENCE.

Write a compact argument map before choosing graphics. Separate:

- What the authors explicitly claim, with a locator.
- What follows mathematically, with assumptions or a short derivation.
- Your intuitive analogy, labeled as a teaching device.
- Your simplified model, including what it omits.
- What the available evidence establishes and what remains uncertain.

Do not force the chain onto a theoretical or descriptive paper that lacks an
experiment. Use assumptions → construction → claim → proof obligations →
consequences where appropriate. A diagram of all terminology is not an argument.

## Turn experiments into reasoning

For each important experiment, record:

| Question | What to extract and teach |
|---|---|
| What claim is tested? | Precise hypothesis and where the authors make it |
| What changes? | Independent variable, intervention, controlled quantities |
| What should happen? | Prediction if the proposed explanation is right |
| What else could explain it? | Baseline, confound, alternative mechanism |
| What happened? | Actual reported metric, uncertainty, scope, and source locator |
| What does it establish? | Support, limitation, falsification, or unresolved ambiguity |

Let the learner predict a result, select a discriminating baseline, remove a
component, or vary an assumption before revealing the evidence. Reproduce an
experiment numerically only when the required data and computation are available.
A toy run illustrates the mechanism; it does not reproduce the paper's result.
Never fabricate benchmark values, uncertainty bars, or empirical ablations.

Keep measured results, digitized estimates, and toy outputs visibly distinct.
Attach citations to the associated claim or figure. A correlation does not by
itself establish a causal mechanism, and one ablation may change several factors.

## Unknown-concept detours

1. Explicitly leave the paper: “Pause here: we need a model of normalization.”
2. Build the smallest standalone world preserving that idea.
3. Let the learner manipulate it and commit a prediction.
4. Check understanding with a changed case or brief explanation.
5. Explicitly return to the exact sentence, equation, or mechanism that needed it.

Keep the detour's state and return location so the learner does not lose the
argument. Do not silently assume embeddings, eigenvectors, likelihoods, or
experimental design because the paper does.

## Teach future reading, sparingly

Occasionally direct attention to the argument's role: “This sentence introduces
an assumption.” “This is the novelty claim.” “What baseline could falsify it?”
“The next experiment should test this prediction.” “This ablation isolates X.”
Use these prompts when the actual source warrants them; do not add constant
meta-commentary.

The transfer task can give a new mechanism or hypothetical paper excerpt and
ask which experiment would distinguish its claim from an alternative. The
learner should leave knowing why someone would try this idea and how to spot
the same reasoning pattern in another paper.
