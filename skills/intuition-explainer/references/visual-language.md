# Visual language

Choose geometry for the question: number lines for composition, projections for
PCA, matrices for attention, graphs for paths. Do not impose a city, pipeline,
or dashboard on a concept without that structure.

## Hierarchy

Give the primary experiment space and a short nearby question. Mute context;
emphasize current quantities. Prefer open layout and a few dividers over nested
cards. Avoid giant introductory text, unnecessary gradients, glassmorphism,
decorative motion, and walls of controls.

## Default palette: 3Blue1Brown-inspired

Apply the dark theme to pages, plots, course indexes, controls, tooltips, and
equations. Keep it regardless of OS preference unless the user requests another
theme or a switch. Define these tokens once; accents use
[3Blue1Brown's Manim palette](https://github.com/3b1b/manim/blob/master/manimlib/default_config.yml),
with near-black surfaces adapted for interactive UI.

```css
:root {
  color-scheme: dark;
  --bg: #000000;
  --surface: #111111;
  --surface-raised: #1B1B1B;
  --text: #FFFFFF;
  --text-muted: #BBBBBB;
  --grid: #333333;
  --axis: #888888;
  --control-border: #888888;
  --blue: #58C4DD;
  --teal: #5CD0B3;
  --yellow: #FFFF00;
  --green: #83C167;
  --red: #FC6255;
  --gold: #F0AC5F;
  --purple: #B189C6;
  --focus: var(--yellow);
}
```

- Page/stage: `--bg`. Use `--surface` / `--surface-raised` only where controls,
  popovers, or regions need separation. Keep backgrounds flat and neutral.
- Prose/equations: `--text`; supporting labels: `--text-muted`. Color symbols
  only to link them to colored objects.
- Main object: `--blue`; comparison: `--teal`; result/emphasis: `--yellow`.
  Prefer two or three accent hues per experiment. Preserve assigned colors
  across transformations, equations, plots, legends, and stages.
- Use labeled `--green` / `--red` for success/failure or positive/negative roles
  where useful. Reserve `--gold` / `--purple` for additional series. Avoid
  decorative rainbows; continuous fields need a scale and legend.
- Optional grid: `--grid`; essential axes/ticks: `--axis`. Low-contrast grids
  carry no essential data. Use crisp strokes, points, and arrowheads;
  translucent fills keep full-contrast outlines and labels.
- Controls: neutral dark fill, `--text` labels, `--control-border` where needed
  to identify boundaries. Primary actions may use `--blue` fill with `--bg`
  text; bright fills need dark text. Use an offset `--focus` outline.
  Selection adds an outline, marker, or label without replacing identity colors.

Use CSS variables in HTML/SVG; Canvas resolves the same tokens through
`getComputedStyle(document.documentElement).getPropertyValue(...)`.
Verify contrast on actual backgrounds, including hover, selection, and
composited transparency. Pair color with labels, shapes, or line styles;
see [accessibility](accessibility.md).

## Accurate, linked representations

Show units and scales; distinguish signed values from magnitudes. Visual length
must not imply unsupported ratios. Label normalized arrows as direction-only
and show magnitude elsewhere. Preserve equal axis scales when Euclidean lengths
or angles matter. With unequal scales, do not claim screen angles equal
mathematical angles. Disclose automatic view fitting.

Add a representation only when it answers a new question. Link points to
coordinates, symbols to objects, or vectors to weighted sums through shared
highlighting, alignment, guides, or continuous transformation. Reveal notation
progressively and explain what it adds. All readouts use one model snapshot.
Correspondence must work on focus/selection as well as hover, with text labels.

## Labels and rendering

Use SVG for moderate geometry, Canvas for many marks/fields, and DOM text for
prose/equations. Canvas needs semantic HTML controls and important output.
Renderers consume model results.

Reserve label space; keep labels within the plot and prioritize active objects.
Switch label sides near edges. Check zero/extreme values, long labels, narrow
screens, and zoom. Never hide overflow to disguise clipped equations.
