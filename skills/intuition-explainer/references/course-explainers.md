# Course notes and weekly summaries

Use this workflow when given lecture notes, slides, readings, or problem sets
and asked for a course-wide learning resource.

## Establish coverage before designing lessons

Inventory every supplied file. Map it to its week or lecture using source dates,
titles, or the syllabus; do not guess order from ambiguous filenames. Record
page/slide locators, topics, learning targets, and prerequisites. Combine files
from the same week without losing their distinct topics. Flag missing,
unreadable, or ambiguous material rather than inventing a lecture.

Keep a coverage table in the authoring notes with columns for week/unit, sources
and locators, main ideas, prerequisites, and the corresponding summary page.
“Every week” means every supplied week has a summary. For a large course, build
and check units incrementally while keeping the coverage table and index current.
State unfinished units explicitly if work is blocked.

## Give each week an explanation

Orient the learner: what question did this week address, and how does it build
on earlier material? Choose an interaction for each central conceptual obstacle.
A week with several distinct ideas may need several short experiments.

Include:

- A concise map of the important ideas and their source locations.
- A concrete example the learner can manipulate, with a meaningful prediction
  and a visible consequence from the actual model or supplied evidence.
- A misconception or boundary case and an explanation tied to what happened.
- Notation connected to the interaction, plus prerequisite detours as needed.
- A check for understanding using a changed case, with hints and explanation.

Choose representations independently for each topic. Shared navigation and
visual conventions help continuity; identical experiments across unrelated
weeks do not. For non-numerical material, use evidence comparisons,
constructions, or assumption changes rather than forcing a numerical simulation.

## Connect the course and keep it offline

Deliver a course `index.html` with an entry for every week, relative links to
summaries, and a visible indication of missing source material. Add previous/next
navigation and links back to specific prerequisite ideas. Let the learner open
a unit without completing every earlier week first.

Keep lesson data and required assets local, using classic scripts or inline
data. Opening the index and following weekly links must work through `file://`.
Citations can name the lecture and page even when the original file is not
distributed with the site. Online access must not be necessary for an interaction
or for viewing core content.

Verify the index, all weekly links, and the main interaction and understanding
check in every unit. Match the final coverage table against the source inventory
so omitted weeks and broken prerequisite links are caught.
