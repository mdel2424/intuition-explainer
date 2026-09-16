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

Borrow geometric reasoning and visual continuity from mathematical explainers,
not another creator's branding, trademark, or exact visual identity.

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
