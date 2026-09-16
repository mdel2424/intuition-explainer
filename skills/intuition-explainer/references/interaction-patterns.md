# Interaction patterns

Choose the gesture from the conceptual variable. Each interaction has a causal
contract: **action → model input → computed change → visible evidence → question**.

| Learning need | Interaction | Evidence and keyboard equivalent |
|---|---|---|
| Local geometry | Drag the point or vector itself | Linked coordinates/projections; arrow keys or labeled numeric inputs |
| Sensitivity | Vary one parameter; freeze others | Before/after overlay and live value; native range input |
| Causality over time | Step or scrub a recorded computation | State and event history; previous/next and range control |
| Assumption testing | Toggle one assumption | The guarantee fails visibly; labeled checkbox |
| Generality | Add/remove points, edit a graph, change dataset | Recompute actual result; accessible list/editor equivalent |
| Function behavior | Draw an input or move a control point | Transform the same object; preset inputs and numeric alternatives |
| Competing methods | Compare with identical inputs side by side | Same scales, units, and randomness; explicit shared-input control |
| Hidden relationships | Hover, focus, or select an object | Persistent labels and highlighted correspondences; nothing hover-only |
| Mental-model diagnosis | Choose prediction before reveal | Recorded choice and calculated result; native buttons/radios |
| Failure discovery | Deliberately create an edge case | Visible breakdown plus reset/repair; reachable extreme presets |
| Multiple representations | Manipulate geometry and linked symbols | Shared object IDs and colors; focusable symbolic counterpart |

## Direct manipulation

Prefer dragging a vector to separate X/Y sliders. Keep its coordinates available
for keyboard and precise input. Make hit targets larger than the drawn mark.
Use pointer capture so a drag continues outside the object, convert client
coordinates through the actual SVG transform or canvas bounds, and handle
pointer cancellation. Do not disable normal page scrolling outside the plot.

Avoid unstable drag mappings: keep the coordinate system fixed for the gesture.
If a reveal expands the range, label new ticks. Do not move the target away from
the pointer while it is being dragged.

## Predictions and state ownership

A prediction is about a particular model snapshot. Store the inputs with it,
or clear it when inputs change. Hide answer-bearing vectors and next-step
equations until commitment. Feedback must be recomputed from the result,
including ties, stationary states, and other valid alternatives.

Separate learning progress, model state, and visual playback. Replaying a stored
transition cannot execute a second model update. Scrubbing can show recorded
iterates; if it shows interpolated states, label them as between steps and never
silently use them as algorithm states. Define what editing while paused does.

## Control budget

Begin with one important action. Reveal parameters when the learner has a reason
to vary them. A compact experiment can have direct manipulation, a prediction,
and a reveal button without displaying every future control. After the guided
arc, expose a wider playground and preserve earlier stages for reference.

Do not make correctness a navigation password. A committed attempt and observed
feedback can advance the lesson. The goal is to revise a model, not maximize a
score. Avoid autoplay as the default interaction.
