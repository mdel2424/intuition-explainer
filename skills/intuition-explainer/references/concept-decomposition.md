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
| Naive mental model | A reasonable but incorrect prediction rule in the learner's voice |
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

## Choosing a model

If the bottleneck, toy world, or counterexample is unclear, consult
[diagnostic examples](concept-examples.md) for chain rule, PCA, probability,
attention, Dijkstra, queues, and paper mechanisms. Otherwise skip that reference.

Do not turn a true equivalence into a “misconception” to manufacture surprise.
Validate the proposed wrong model with the same care as the correct one.

## Prerequisite detours

Make a dependency chain. Teach only prerequisites required by the target, with
one local check of understanding before returning. “Back to the paper: this is
why the normalization in equation 3 is needed” is a return, while silently
resuming the main animation is not. If the dependency is a whole course, narrow
the target honestly rather than hiding the dependency behind jargon.
