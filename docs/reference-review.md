# Reference organization and scope review

The active skill routes source-specific tasks to focused guidance:

- Papers: reconstruct the argument, distinguish reported evidence from a toy model,
  and connect explanations to the actual sections and figures.
- Courses: inventory supplied notes, preserve every requested week, and connect
  summaries through an offline index and prerequisite links.
- Mathematics: connect constructions, assumptions, and notation while distinguishing
  numerical evidence from proof.

Teaching references cover conceptual decomposition, meaningful interaction,
visual correspondence, narration, accessibility, fidelity, and verification.
The full workflow and its resource links are in [SKILL.md](../skills/intuition-explainer/SKILL.md).

The [architecture decisions](design.md) require direct offline opening of the
finished HTML. Shared browser tooling tests the local files without starting a
server; each generated site supplies assertions for its own learning sequence.
The archived demonstration is outside the distributed skill and active checks.

## Instruction-size review (2026-09-16)

Counts use whitespace-separated words, not model-specific tokenization:

| Scope | Before | After | Reduction |
|---|---:|---:|---:|
| Skill entrypoint | 1,310 | 734 | 44.0% |
| Required entrypoint + build-order guide | 1,844 | 734 | 60.2% |
| Entrypoint + all references, including optional examples | 7,932 | 6,631 | 16.4% |

The entrypoint now owns phase order and routing; the QA checklist owns executable
verification instructions. Domain examples remain intact in an optional reference.
References are loaded by phase and applicability, reusing existing context.
The 3Blue1Brown palette tokens, offline constraints, fidelity classifications,
model/playback invariants, accessibility requirements, and all 13 pedagogical
questions are preserved.

Document review covered PCA, chain rule, attention, shortest paths, probability,
queues, a paper section, and a course-wide request: common planning/model/QA
references remain routed, math/paper/course guidance remains conditional, and
unclear model choices can load the retained examples. Ordinary landing pages
remain excluded. This was a routing and requirement-preservation review, not a
generated-site evaluation. Package/link validation and skill validation passed;
no renderer or verification scripts changed.
