import test from 'node:test';
import assert from 'node:assert/strict';
import { surfaces, evaluate, gradient, step, trajectory, contour } from '../js/model.js';

const close = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) <= tolerance, `${a} ≠ ${b}`);

test('known one-dimensional updates and stable closed form', () => {
  assert.deepEqual(step('bowl', [3, 0], 0.2), [2.4, 0]);
  close(trajectory('bowl', [3, 0], 0.2, 8).points.at(-1)[0], 3 * 0.8 ** 8);
  assert.deepEqual(step('bowl', [3, 0], 1), [0, 0]);
});
test('overshoot, equal-height oscillation, and zero exception', () => {
  const growing = trajectory('bowl', [1.2, 0], 2.15, 6).points;
  for (let i = 1; i < growing.length; i++) {
    assert.ok(growing[i][0] * growing[i - 1][0] < 0);
    assert.ok(evaluate('bowl', growing[i]) > evaluate('bowl', growing[i - 1]));
  }
  assert.deepEqual(trajectory('bowl', [2, 0], 2, 2).points, [[2, 0], [-2, 0], [2, 0]]);
  assert.deepEqual(step('bowl', [0, 0], 2.4), [0, 0]);
});
test('analytic gradients agree with finite differences on every surface', () => {
  for (const id of Object.keys(surfaces)) for (const p of [[2.1, -1.3], [-0.3, 2.8], [0, 0]]) {
    const g = gradient(id, p), h = 1e-5;
    for (let d = 0; d < 2; d++) {
      const lo = [...p], hi = [...p]; lo[d] -= h; hi[d] += h;
      close(g[d], (evaluate(id, hi) - evaluate(id, lo)) / (2 * h), 1e-7);
    }
  }
});
test('sufficiently small steps descend and minima are stationary', () => {
  for (const [id, s] of Object.entries(surfaces)) {
    const path = trajectory(id, [2.3, -1.7], 0.12, 15).points;
    for (let i = 1; i < path.length; i++) assert.ok(evaluate(id, path[i]) <= evaluate(id, path[i - 1]));
    close(evaluate(id, s.center), 0);
    assert.deepEqual(step(id, s.center, 2.4), [...s.center]);
  }
});
test('rotated transfer: first step goes up while minimum lies below', () => {
  const p = [2.7, 1.9], next = step('rotated', p, 0.12);
  assert.ok(surfaces.rotated.center[1] < p[1]);
  assert.ok(next[1] > p[1]);
  assert.ok(next[0] < p[0]);
  assert.ok(evaluate('rotated', next) < evaluate('rotated', p));
});
test('all contour points have the claimed objective value', () => {
  for (const id of ['valley', 'rotated']) for (const level of [0.5, 2, 8, 18]) {
    for (const p of contour(id, level)) close(evaluate(id, p), level);
  }
});
test('inputs stay intact and invalid parameters fail explicitly', () => {
  const p = Object.freeze([1, 2]);
  trajectory('valley', p, 0.2, 3);
  assert.deepEqual(p, [1, 2]);
  assert.throws(() => step('missing', p, 0.2));
  assert.throws(() => step('valley', p, NaN));
  assert.throws(() => step('valley', [Infinity, 2], 1));
  assert.throws(() => trajectory('bowl', p, 1, 1.5));
  assert.throws(() => contour('bowl', 1));
});
test('divergence guard terminates without clamping or fabricating convergence', () => {
  const run = trajectory('valley', [2, 2], 2.4, 1000);
  assert.ok(run.stopped?.includes('limit'));
  assert.ok(run.points.length < 1000);
  assert.ok(run.points.at(-1).some(v => Math.abs(v) > 1e6));
});
