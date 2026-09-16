# Narration

Use prose to pose a question, direct attention, name a relationship, or explain
a surprise. Let the interactive visual do the rest.

Prefer “Move the point.” “Watch the highlighted group.” “Notice what stays fixed.”
“Before revealing, predict which way it moves.” “Change the population.”
Avoid “The following visualization allows you to observe…” and long preambles.

## A useful stage record

```js
{
  id: 'base-rate',
  question: 'Does a positive test always mean the condition is likely?',
  invitation: 'Make the condition rarer. Predict who tests positive.',
  prediction: { /* choices or construction; evaluated from the model */ },
  reveal: { /* action and evidence; no prewritten numeric result */ },
  explanation: result => /* one or two sentences about these actual values */,
  nextQuestion: 'Which counts matter when interpreting a positive result?'
}
```

Do not copy these field names as a rigid framework. Keep the role of each piece.
Front-load the learner's action. Use short progressive disclosure rather than
several paragraphs before interaction. Do not advance on a reading timer.

## Feedback

Refer to the learner's choice and the computed consequence. Explain what a
different result would have implied. Handle valid ties and exceptional cases.
“You predicted a majority, but the counted false positives outnumber true positives”
teaches more than “Incorrect.” Invite a repair experiment.

Avoid exposing the answer in a subtitle, equation, arrow, or accessibility label
before the learner commits. Accessible equivalents should preserve the same
reasoning task, not inadvertently reveal its result.

Use terms after they have referents. Translate the toy model back to the real
concept explicitly. Keep accurate qualifications near the relevant claim;
reserve detailed model boundaries for About, not the main action prompt.

## Endings

End the guided arc with a new situation and a reasoned explanation. Then leave
the playground usable. “Complete” alone says nothing about what was learned.
Ask “Why can most positive results be false even when the test is accurate?”
instead of asking for the definition of a conditional probability.
