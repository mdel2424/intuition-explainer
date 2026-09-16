# Build order

The order protects the explanation from being dictated by its first attractive
diagram. These are authoring steps, not a required number of learner screens.

## 1. Establish the teaching problem

1. Inspect actual source material and record exact sections, figures, code, or
   dataset fields. Check uncertain technical facts against primary sources.
2. Identify an observable learning target per unit: what can the learner predict or
   mentally simulate afterward?
3. Sort prerequisites into assumed, inline, and separate mini-explainer.
4. Identify the smallest conceptual bottleneck.
5. State a plausible naive mental model in the learner's voice.
6. Construct the smallest useful toy world preserving the phenomenon.

Write these into the concept plan using
[concept-decomposition](concept-decomposition.md). For papers, first reconstruct
the argument with [paper-explainers](paper-explainers.md). For a course, inventory
every supplied week with [course-explainers](course-explainers.md). Do not start UI code.

## 2. Design experiments and evidence

7. Design the intuition arc: mystery → concrete case → manipulation → surprise
   → missing idea → repeated experiment → formalism → real concept → transfer.
8. Identify concrete learner predictions, including wrong answers that diagnose
   different mental models. State the evidence revealed after each choice.
9. Choose representations by what each makes inferable. Introduce them in order.
10. Choose direct manipulations; decide what stays fixed and what changes.
11. Specify the real model API, inputs, outputs, invariant, edge cases, numerical
    limits, and the exact comparison that will falsify the naive model.
12. Create the fidelity ledger before assigning decorative or illustrative values.

Checkpoint: explain how changing one input propagates through the model to a
visible consequence. If that chain has a gap, fix the design before rendering.
Use [pedagogy](pedagogy.md), [interaction-patterns](interaction-patterns.md),
and [fidelity](fidelity.md).

## 3. Build the mechanism before presentation

13. Implement the model without DOM, canvas, timers, or lesson prose.
14. Test it independently: a known answer, an invariant, an edge case, the
    intended counterexample, and sensitivity to the learner's input. For
    probabilities, enumerate a tiny sample space; for shortest paths, use a
    hand-solvable graph and a disconnected node.
15. Implement the visualization as a projection of that model. Keep object
    identity across transitions and representations; distinguish state from
    interpolation. Apply [visual-language](visual-language.md),
    [animation](animation.md), and [accessibility](accessibility.md).
16. Implement lesson progression, predictions, reveal logic, short narration,
    and prerequisite detours. Do not automatically advance while someone reads.
17. Implement free exploration with reset, replay, pause, and stage revisiting.
18. Add a genuinely new transfer case and explanatory feedback.

## 4. Verify, inspect, revise

19. Open `index.html` directly with network access disabled. Run syntax,
    independent model tests, and browser scenarios for all important
    controls, stages, animation, input interruptions, keyboard, and reduced motion.
20. Run the pedagogical review in [checklist](checklist.md). State the evidence
    behind each answer. Several weak answers require instructional revision.
21. Capture and open screenshots at common viewports and reflow/zoom conditions.
    Check labels and equation clipping, especially at extreme parameter values.
22. Revise errors in model, lesson, or layout; rerun the affected checks and the
    full lesson after changes to shared behavior. Save the results and remaining
    limitations. A screenshot file that nobody inspected is not visual QA.

Finish with a working artifact. If a necessary tool is unavailable, complete
independent work, identify exactly which checks remain, and avoid a blanket
“verified” claim.
