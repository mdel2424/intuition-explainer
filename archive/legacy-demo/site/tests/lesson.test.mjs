import test from 'node:test';
import assert from 'node:assert/strict';
import { createLesson, stages, assess } from '../js/lesson.js';

function finish(lesson) { lesson.tick(100, true); }
function advance(lesson) {
  const stage = stages[lesson.getState().stage];
  if (stage.choices.length) lesson.dispatch('predict', stage.choices[0][0]);
  lesson.dispatch('reveal'); finish(lesson); lesson.dispatch('next');
}
test('prediction is committed before reveal and completion before progression', () => {
  const l = createLesson();
  l.dispatch('reveal'); l.dispatch('next');
  assert.equal(l.getState().stage, 0);
  assert.equal(l.getState().history.length, 1);
  l.dispatch('predict', 'left'); l.dispatch('reveal'); l.dispatch('next');
  assert.equal(l.getState().stage, 0);
  finish(l);
  assert.equal(l.getState().result.correct, true);
  l.dispatch('next'); assert.equal(l.getState().stage, 1);
});
test('wrong predictions receive feedback and do not block learning', () => {
  const l = createLesson();
  l.dispatch('predict', 'right'); l.dispatch('reveal'); finish(l);
  assert.equal(l.getState().result.correct, false);
  l.dispatch('next'); assert.equal(l.getState().stage, 1);
});
test('all stages and transfer reachable; earlier stages remain accessible', () => {
  const l = createLesson();
  for (let i = 0; i < 6; i++) { assert.equal(l.getState().stage, i); advance(l); }
  assert.equal(stages[l.getState().stage].id, 'explore');
  l.dispatch('goto', 2); assert.equal(l.getState().stage, 2);
  l.dispatch('goto', 6); assert.equal(l.getState().stage, 6);
  l.dispatch('goto', 42); assert.equal(l.getState().stage, 6);
});
test('pause, resume and replay preserve the computed sequence', () => {
  const l = createLesson();
  l.dispatch('predict', 'left'); l.dispatch('reveal'); l.tick(0.2);
  const pausedAt = l.getState().cursor;
  l.dispatch('pause'); l.tick(2); assert.equal(l.getState().cursor, pausedAt);
  l.dispatch('resume'); finish(l);
  const history = structuredClone(l.getState().history);
  l.dispatch('replay'); assert.equal(l.getState().cursor, 0); finish(l);
  assert.deepEqual(l.getState().history, history);
});
test('input changes interrupt playback and clear stale predictions', () => {
  const l = createLesson();
  l.dispatch('predict', 'left'); l.dispatch('reveal'); l.tick(0.1);
  l.dispatch('point', [-2, 0]); finish(l);
  assert.deepEqual(l.getState().history, [[-2, 0]]);
  assert.equal(l.getState().prediction, null);
  assert.equal(l.getState().revealed, false);
  l.dispatch('predict', 'right'); l.dispatch('eta', 0.8);
  assert.equal(l.getState().prediction, null);
  assert.equal(l.getState().eta, 0.8);
});
test('scrubbing uses recorded states; branching and reset are unambiguous', () => {
  const l = createLesson();
  l.dispatch('predict', 'left'); l.dispatch('reveal'); finish(l);
  l.dispatch('run'); finish(l); assert.equal(l.getState().history.length, 8);
  const earlier = [...l.getState().history[2]];
  l.dispatch('scrub', 2); assert.deepEqual(l.currentPoint(), earlier);
  l.dispatch('reveal'); finish(l); assert.equal(l.getState().history.length, 4);
  l.dispatch('reset'); assert.deepEqual(l.getState().history, [[3.2, 0]]);
  assert.equal(l.getState().prediction, null);
});
test('zero, ties, bounds and invalid inputs have explicit behavior', () => {
  const l = createLesson();
  l.dispatch('point', [0, 0]); l.dispatch('predict', 'still'); l.dispatch('reveal'); finish(l);
  assert.equal(l.getState().result.correct, true);
  assert.equal(assess(1, 'bowl', [2, 0], [-2, 0], 2, 'same').correct, true);
  assert.equal(assess(4, 'valley', [4, 1], [3.2, 0.2], 0.2, 'equal').correct, true);
  l.dispatch('point', [100, 100]); assert.deepEqual(l.currentPoint(), [4, 0]);
  l.dispatch('eta', 0); assert.equal(l.getState().eta, 0.05);
  l.dispatch('point', [NaN, 0]); assert.deepEqual(l.currentPoint(), [4, 0]);
});
