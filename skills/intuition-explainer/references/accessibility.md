# Accessibility and usability

Make the reasoning task available through more than a precise mouse gesture.
Accessibility should preserve the concept, not supply a disconnected text essay.

- Use semantic headings, buttons, labels, fieldsets, and native range inputs.
  Give SVG diagrams a title/description and important numeric output in HTML.
- Make direct manipulation keyboard operable: arrow keys on a focused point,
  coordinate fields, or an equivalent structured editor. Document the keys.
  Keep focus visible and stable when rendering; do not replace the focused node.
- Use at least 4.5:1 contrast for ordinary text and 3:1 for large text and
  meaningful graphical/control boundaries. Verify the actual palette.
- Pair colors with words, shapes, dashes, and consistent spatial meaning.
  Supply hover relationships on focus/select too. No essential hover-only text.
- Preserve prediction-before-reveal for assistive output. Use a polite live
  region for committed outcomes; don't announce every animation frame.
- Honor reduced motion in both CSS and the playback controller. Keep the same
  computations and evidence available with immediate changes or discrete steps.
- Use generous pointer targets (aim for 44 CSS px). Handle capture, pointer
  cancellation, touch, and page scrolling outside the manipulation surface.
- Support laptop and desktop layouts; use a readable single-column mobile layout
  where feasible. Avoid fixed-height shells hiding content. Do not shrink
  equations or labels to illegibility to fit a phone.
- Check 200% browser zoom/reflow, a narrow viewport, phone landscape, long
  equation values, and touch. Label manual and automated coverage accurately.
- Native `details` can expose model assumptions without trapping focus. For a
  modal, implement focus containment, Escape, and focus restoration.

Keyboard QA includes Tab/Shift-Tab, Enter/Space on buttons, arrow keys on the
manipulated object and sliders, and navigation after a reveal/reset. Do not steal
global arrow keys from normal document scrolling or text input.

Automated accessibility checks and geometry checks catch some errors, but not
whether the diagram makes sense through a screen reader. State the limits of
testing; do not claim comprehensive accessibility from a smoke test alone.
