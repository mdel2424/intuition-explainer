# Animation with a meaning

Use motion to show transformation, cause and effect, correspondence, movement
through a process, interpolation, or the consequence of an input. If removing
the animation loses no information or continuity, remove it.

## Separate computation from presentation

Calculate actual results before drawing a transition. Preserve stable object
IDs while positions or representations change. An interpolated visual frame
is not necessarily a valid algorithm state. Keep it out of model history and
label between-step playback when that distinction matters.

For a discrete update, retain the old and new values and animate their
correspondence. Do not rebuild unrelated marks so the learner has to rediscover
which quantity is which. A topology change may be clearer as a labeled cut than
as a misleading geometric morph.

## Temporal controls

- Pause freezes the visual playhead; resume continues that same transition.
- Replay shows already computed results without applying the model again.
- Reset clearly identifies its scope: current experiment or whole lesson.
- Scrubbing or stepping exposes temporal order and supports reversal.
- Changing inputs interrupts playback and invalidates dependent predictions;
  say if history is restarted or branched.
- Revisiting a lesson stage should not depend on an animation finishing.

Use elapsed time, not frame count, for motion. Stop scheduling frames when idle.
Pause when the page is hidden, or otherwise prevent tab restoration from skipping
the lesson. Never require a reader to race a timed caption or watch a long tour.

## Reduced motion

Honor `prefers-reduced-motion` in JavaScript as well as CSS. Replace spatial
tweening with a discrete result or immediate state change, while retaining
before/after evidence, histories, and all learning interactions. Test changing
the preference during playback. Reduced motion must not mean missing evidence.

## Verification

Exercise start, pause during a transition, resume to completion, replay,
scrub backward and forward, reset mid-run, and parameter changes mid-run.
Assert resulting model values and history length. Check that a replay doesn't
double-charge an update, an interrupted animation doesn't later overwrite a
new input, and reduced-motion completion doesn't leave disabled controls.
