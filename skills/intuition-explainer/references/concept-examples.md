# Diagnostic examples

| Concept | Bottleneck | Smallest useful experiment | Counterexample / invariant |
|---|---|---|---|
| Chain rule | Local changes multiply across composition | Drag x through two linked number lines; compare small input/output changes | Changing outer sensitivity changes total gain even when inner gain is fixed |
| PCA | Projection quality depends on direction | Rotate a line through a centered 2D cloud and display projections | First-PC variance maximization equals minimum squared orthogonal reconstruction error under the standard Euclidean formulation; “closest line” alone is ambiguous, not automatically false |
| Probability | A sample is not the distribution | Draw from a tiny distribution; compare counts to exact probabilities | Rare outcomes may be absent in a short sample; total probability stays one |
| Attention | Similarity scores weight values, not just retrieve a token | Move one query among three keys; compute scores, normalized weights, weighted values | Two moderately weighted values can dominate a mixture; weights sum to one |
| Dijkstra | Locally smallest tentative distance can be finalized under a condition | A five-node graph with adjustable weights; step the priority queue | Negative edges break the guarantee; settled distances are final only under nonnegative weights |
| Queues | Variability and utilization interact | Add jobs and change service intervals in a real event simulation | Equal mean arrival/service rates do not imply short waits; arrivals minus departures equals queued plus in-service jobs |
| Paper mechanism | A design choice follows from a limitation | Compare smallest baseline and proposed mechanism under one controlled intervention | Prediction distinguishing the hypothesis from a plausible alternative |

