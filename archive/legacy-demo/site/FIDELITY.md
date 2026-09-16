# Fidelity ledger

| Quantity or behavior | Class | Origin and boundary |
|---|---|---|
| Objective values, analytic gradients, updates, and trajectories | COMPUTED | `js/model.js`: double-precision arithmetic; no recorded answers |
| One-dimensional bowl | SIMPLIFIED | f(x) = x²/2, f′(x) = x; actual gradient descent on a toy objective |
| Axis-aligned valley | SIMPLIFIED | f(x,y) = (x² + 4y²)/2; gradient (x, 4y) |
| Rotated valley | SIMPLIFIED | Center (−0.8, 0.4), θ = π/5; u = cos θ·dx + sin θ·dy, v = −sin θ·dx + cos θ·dy; f = (0.6u² + 5v²)/2; gradient obtained by the chain rule |
| Contour curves and current height | COMPUTED | Inverse rotation of ellipses at listed objective levels, from the same quadratic model |
| Prediction verdicts | COMPUTED | Derived from the actual selected inputs and resulting iterates, including zero and equal-height cases |
| Starting points, learning rates, curvature, and metric | ASSUMED | Teaching choices in `lesson.js` and `model.js`; Euclidean coordinates, exact gradients, deterministic fixed-rate steps |
| Animation timing and frames between iterates | ILLUSTRATIVE | 650 ms per step; position interpolation only, never used as a new optimizer state |
| Uphill gradient arrow | ILLUSTRATIVE | Direction from the actual gradient, display length is scaled; the labeled next-step arrow uses the true coordinate displacement |
| Numerical stop at coordinate magnitude > 10⁶, nonfinite result, or history limit | ASSUMED | Browser guard, disclosed when reached; not convergence or an optimization method |

The model deliberately omits stochastic gradients, momentum, adaptive step
sizes, nonconvex basins, and high-dimensional parameter spaces. Its convex
quadratics have a unique minimum; real loss functions need not. There are no
empirical measurements, benchmark results, learned weights, or claims about
training speed. The display rounds numbers; the model does not round updates. Prediction checks
treat differences below 10⁻⁹ as ties, a numerical comparison tolerance.

The curve's vertical scale can differ from its horizontal scale. Read the
numeric slope; a screen angle alone does not give its value. The 2D map uses
equal coordinate scales. Views fit the computed experiment after reveal, and
the axis labels show the changed range. The displayed interpolated point lies
on the objective curve in 1D and between consecutive iterates in 2D.

These same boundaries are summarized in the website's **About this model**.
