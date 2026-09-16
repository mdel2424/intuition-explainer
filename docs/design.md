# Scope and architecture

This package is a reusable skill for building intuitive learning environments
from concepts, papers, and lecture material. Its teaching guidance and tooling
are independent of any particular subject or finished demonstration.

## Source and learning goal first

Choose the representation from the conceptual obstacle. Build real calculations
or source-backed comparisons, keep simplifications explicit, and connect learner
actions to visible consequences. Paper explanations follow the authors' argument
and separate toy demonstrations from reported evidence. Course explanations
preserve coverage across the supplied weeks and connect prerequisite ideas.

## Offline output

The deliverable is HTML, CSS, and JavaScript that works when its `index.html` is
opened directly. Use relative links, local assets, and inline or classic scripts.
Embed required data; avoid runtime imports, local-file fetches, remote fonts,
CDNs, and backend dependencies. A small explanation may be a single HTML file;
a course may have an index and a page per week. No server is started for preview
or browser verification.

Separate model calculations, lesson progression, rendering, and interaction as
needed for the concept. These are responsibility boundaries, not a compulsory
engine or folder layout.

## Verification boundaries

The shared browser harness opens files with network access disabled and checks
errors at several viewports. A generated site's adapter must exercise its actual
controls, calculations, and learning sequence. Model correctness and educational
quality still need their own checks and visual review.

Repository fixtures validate the tooling only. They are not instructional
templates, and their passing checks do not establish the quality of future sites.
