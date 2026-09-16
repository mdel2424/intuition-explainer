# Visual language

Choose geometry for the question. A number line may teach composition, a
rotatable projection may teach PCA, a matrix may reveal attention weights, and
a graph may teach a shortest-path algorithm. Do not impose a city, vehicle,
pipeline, or dashboard on a concept that does not have that structure.

## Hierarchy

Use a spacious primary experiment with a short nearby question. Keep context
muted and the current quantities prominent. Prefer open layout and a few
dividers over nested cards. Use readable typography and restrained color;
avoid giant introductory text, unnecessary gradients, glassmorphism, decorative
motion, and large control walls. A purpose-built scientific instrument is the
default, not a generic analytics dashboard.

## Default palette: 3Blue1Brown-inspired

Use a black mathematical stage with crisp white labels and a few bright,
meaningful accents. Carry the dark theme through the surrounding page, course
index, controls, tooltips, and equations. Use this palette by default; an explicit
user theme takes precedence. Keep dark mode regardless of the OS preference
unless the user asks for a theme switch.

Define these tokens once in the site's stylesheet (inline CSS is also fine).
The accent colors come from [3Blue1Brown's Manim palette](https://github.com/3b1b/manim/blob/master/manimlib/default_config.yml);
the near-black UI surfaces are adaptations for readable interactive pages.

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

- Use `--bg` for the page and plotting stage. Reserve `--surface` and
  `--surface-raised` for controls, popovers, or areas that need separation.
  Keep backgrounds flat and neutral, with generous empty space around the math.
- Set prose and ordinary equations in `--text`; use `--text-muted` for supporting
  labels. Color only the symbols that correspond to colored objects.
- Start with `--blue` for the main object, `--teal` for a comparison or second
  quantity, and `--yellow` for a result or emphasis. Keep roughly two or three
  accent hues visible per experiment. Once assigned, preserve an object's color
  through transformations, equations, plots, legends, and later lesson stages.
- Use `--green` and `--red` for explicitly labeled success/failure or positive/
  negative roles when those distinctions help the lesson. Use `--gold` or
  `--purple` when another series needs its own identity. Avoid decorative
  rainbow coloring; continuous fields need a scale and legend.
- Draw optional background grids in `--grid`; use `--axis` for axes and ticks
  needed to read values. Low-contrast grid lines must not carry essential data.
  Prefer crisp strokes, solid points, arrowheads, and restrained translucent
  fills; keep essential outlines and labels at full contrast.
- Use dark neutral controls with `--text` labels and `--control-border` where
  the boundary identifies the control. A primary action can have a `--blue`
  fill with `--bg` text. Bright accent fills need dark text. Use a visible
  `--focus` outline with an offset; indicate selection with an outline, marker,
  or label while retaining the object's identity color.

Use CSS variables directly in HTML/SVG. For Canvas, resolve the same tokens with
`getComputedStyle(document.documentElement).getPropertyValue(...)`; do not invent
a separate renderer palette. Check contrast on the actual background, including
hover/selected states and composited transparency. Pair color with labels,
shapes, or line styles as described in [accessibility](accessibility.md).

## Consistent encodings

Assign semantic colors once. Pair color with labels, shapes, dashes, or position.
An object retains its identity and color across representations. Show units and
scales; separate signed values from magnitudes. Never use visual length to
suggest a ratio that the data does not support.

If vector length is normalized for visibility, label it as a direction-only
arrow and show magnitude elsewhere. If the axes have unequal scales, do not
claim screen angles are mathematical angles. Preserve equal scales when angles
or Euclidean lengths matter. Disclose automatic view fitting.

## Linked representations

Introduce a second representation to answer a question the first cannot answer.
Map a point to its coordinate, a coordinate to a symbol, a vector to a weighted
sum, or a curve to a distribution. The mapping should be visible through shared
highlighting, aligned layout, connecting guides, or a continuous transformation.

Use one model snapshot for all readouts. A hover highlight is a supplement;
the correspondence must also work on focus or selection and have text labels.
Avoid showing every representation at once. Reveal notation progressively and
explain what information the new representation makes easier to see.

## Rendering and label placement

Default to SVG for a moderate number of geometric objects and DOM text for prose
and equations. Use Canvas for many marks or continuous fields, with a semantic
HTML equivalent for controls and important output. Neither renderer computes
its own version of the underlying algorithm.

Reserve label space, clamp labels to the visible plot, and prioritize the active
object over context. Test zero, extreme values, long labels, narrow widths, and
zoom. A label that follows an object may need to switch sides at an edge.
Do not hide overflow to disguise a clipped equation.
