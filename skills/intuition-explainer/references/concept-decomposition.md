# Concept decomposition

Write a concise internal plan before implementing UI. This is a design artifact,
not a request to expose private deliberation or fill the website with planning
text. Record decisions, observable goals, and evidence.

## Required plan fields

| Field | Decision to record |
|---|---|
| Learning target | Given what input, what can the learner predict, construct, or explain? |
| Assumed knowledge | Small, explicit prerequisites appropriate to this learner |
| Inline prerequisites | A short manipulation or local definition can supply these |
| Mini-explainers | Ideas requiring their own experiment, with an explicit return point |
| Conceptual bottleneck | The smallest new inference the learner cannot yet make |
| Naive mental model | A reasonable but incorrect prediction rule |
| Smallest useful world | Minimal objects and dimensions retaining the phenomenon |
| Key invariant | What remains true under changes; specify its assumptions |
| Counterexample | Inputs that visibly separate the naive model from the mechanism |
| Intuition arc | Question → experiment → surprise → new idea → formal bridge |
| Predictions | Exact choices or constructions, when committed, how evaluated |
| Representations | What each reveals; when it appears; object-to-symbol mapping |
| Manipulations | Direct action, controlled variable, fixed variables, observed change |
| Model contract | Pure API, independent expected results, numerical boundaries |
| Formal bridge | The experienced problem notation now helps solve |
| Transfer | Unseen setting requiring reuse of the idea, not a memorized answer |
| Source/claim map | Source statement, locator, mathematical consequence, teaching addition |
| Fidelity ledger | See [fidelity](fidelity.md) |

Weak target: “Understand PCA.” Useful target: “Given a centered point cloud and
a direction, predict how much projected variation it retains and explain which
direction PCA selects.” The phrase “given … predict … because …” helps.

## Diagnostic examples

| Concept | Bottleneck | Smallest useful experiment | Counterexample / invariant |
|---|---|---|---|
| Chain rule | Local changes multiply across composition | Drag x through two linked number lines; compare small input/output changes | Changing outer sensitivity changes total gain even when inner gain is fixed |
| PCA | Projection quality depends on direction | Rotate a line through a centered 2D cloud and display projections | First-PC variance maximization equals minimum squared orthogonal reconstruction error under the standard Euclidean formulation; “closest line” alone is ambiguous, not automatically false |
| Probability | A sample is not the distribution | Draw from a tiny distribution; compare counts to exact probabilities | Rare outcomes may be absent in a short sample; total probability stays one |
| Attention | Similarity scores weight values, not just retrieve a token | Move one query among three keys; compute scores, normalized weights, weighted values | Two moderately weighted values can dominate a mixture; weights sum to one |
| Dijkstra | Locally smallest tentative distance can be finalized under a condition | A five-node graph with adjustable weights; step the priority queue | Negative edges break the guarantee; settled distances are final only under nonnegative weights |
| Queues | Variability and utilization interact | Add jobs and change service intervals in a real event simulation | Equal mean arrival/service rates do not imply short waits; arrivals minus departures equals queued plus in-service jobs |
| Paper mechanism | A design choice follows from a limitation | Compare smallest baseline and proposed mechanism under one controlled intervention | Prediction distinguishing the hypothesis from a plausible alternative |

Do not turn a true equivalence into a “misconception” to manufacture surprise.
Validate the proposed wrong model with the same care as the correct one.

## Prerequisite detours

Make a dependency chain. Teach only prerequisites required by the target, with
one local check of understanding before returning. “Back to the paper: this is
why the normalization in equation 3 is needed” is a return, while silently
resuming the main animation is not. If the dependency is a whole course, narrow
the target honestly rather than hiding the dependency behind jargon.
