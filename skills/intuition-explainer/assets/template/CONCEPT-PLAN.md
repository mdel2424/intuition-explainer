# Local Steps: concept plan

This plan precedes the UI. It is an authoring artifact, not introductory copy.

## Learning target

Given a point, the local slope or gradient, and a step size, predict the next
update, explain why a larger step can increase the objective, and distinguish
local downhill from a direct route to the minimum on a new contour map.

## Prerequisites

- Assumed: signed numbers, multiplication, reading horizontal/vertical position.
- Inline: height as an objective to reduce; slope as local rise per horizontal
  move; contours as equal-height curves; vectors as two coordinate changes.
- Mini-explainer boundary: deriving derivatives and partial derivatives. The
  slope is supplied and visualized here. The About section supplies exact
  functions, but this lesson does not pretend to teach differentiation.

## Bottleneck and naive model

The learner may conflate a local direction with a guaranteed destination:
“Downhill always gets me closer, so larger downhill steps work faster.”
The crucial jump is from a local linear prediction to a finite update whose
landing height must be evaluated again.

## Smallest world and invariant

One variable, one point, the smooth bowl f(x) = x²/2. A tangent exposes the
local change. Each discrete update is exactly x_new = x − η f′(x).
The invariant is this update rule, not decreasing height: finite steps may go
uphill. When the gradient is nonzero, its negative is a local descent direction
for these differentiable surfaces, under the Euclidean metric.

## Intuition arc

| Stage | Question and manipulation | Prediction → computed evidence | Idea earned |
|---|---|---|---|
| 0. Find downhill | Drag a point on the curve | Left / stay / right → one step and tangent | Local slope tells direction |
| 1. Choose a distance | Change step size | Landing lower / same / higher → actual height | Direction and distance differ |
| 2. Break the rule | Try η = 2.15; then repair it | Settle / same-height bouncing / move away → six iterates | Local advice has a range of usefulness |
| 3. Name the pattern | Manipulate point and step size | Live equation, tangent, coordinates, step | Subtract a scaled slope; introduce gradient descent |
| 4. Add a dimension | Drag on an elliptical contour map | Which coordinate changes more? → both components | Gradient follows steepness, not the center |
| 5. Transfer | Unseen rotated and translated valley | Will the vertical coordinate rise or fall? → first step | A local descent step can move away from the minimum in one coordinate |
| 6. Explore | Choose surface, position, step size | Repeated steps, reversible history | Apply the same rule across representations |

Prediction is committed before the result is revealed. Changing inputs clears
the prediction and its result; it never grades an old answer against new inputs.
Reveal controls then support repeated experiments. A reset restores the stage's
initial experiment; revisiting a stage is independent of animation history.

## Counterexample

On x²/2, x_new = (1 − η)x. With η = 2.15, each nonzero update reverses sign
and increases its magnitude by 15%. At η = 2 the height stays constant; at
η = 1 it reaches zero in one step. These are calculations, not keyframes.
Zero is an explicit exception: it stays zero at any allowed step size.

## Formal bridge and representations

Stage 3 introduces the equation only after the learner has used the direction,
controlled the distance, and seen overshoot. Blue position, amber local slope,
and teal update remain linked in geometry, numeric readouts, and the equation.
Contours in stage 4 replace graph height with equal-height lines; explicit copy
explains the change of representation. The point retains its visual identity.

## Transfer and return to the real concept

The rotated valley starts at (2.7, 1.9), with its minimum at (−0.8, 0.4).
The computed first update raises y despite the minimum lying below it. Learners
predict that sign before seeing the vector, then explain why local steepness can
disagree with the straight route to the bottom. The final copy maps position to
model parameters, height to loss, and step size to learning rate, and states that
real losses may be nonconvex, noisy, and high dimensional.

## Model contract

Pure `model.js`: evaluate(surface, point), gradient(surface, point),
step(surface, point, eta), trajectory(surface, point, eta, count), and exact
contour points for the quadratic surfaces. No DOM, timers, or presentation state.
Independent tests check derivatives numerically, closed-form updates, descent,
instability, stationary points, contour levels, and non-mutation.

`lesson.js` owns committed predictions, discrete history, playback position,
stage progression, replay, reset, and feedback. The renderer may interpolate
between computed iterates for continuity; these intermediate frames are not
claimed to be optimizer updates. Input changes interrupt playback.

See [FIDELITY.md](FIDELITY.md) for the numerical and visual boundaries.
