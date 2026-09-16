// Pure conceptual model. SIMPLIFIED objectives; real gradients and updates.
const theta = Math.PI / 5;
export const surfaces = Object.freeze({
  bowl: Object.freeze({ id: 'bowl', name: 'One-dimensional bowl', dimensions: 1, center: Object.freeze([0, 0]), eigen: Object.freeze([1, 0]), angle: 0 }),
  valley: Object.freeze({ id: 'valley', name: 'Narrow valley', dimensions: 2, center: Object.freeze([0, 0]), eigen: Object.freeze([1, 4]), angle: 0 }),
  rotated: Object.freeze({ id: 'rotated', name: 'Rotated valley', dimensions: 2, center: Object.freeze([-0.8, 0.4]), eigen: Object.freeze([0.6, 5]), angle: theta })
});

function specification(id) {
  if (!Object.hasOwn(surfaces, id)) throw new RangeError(`Unknown surface: ${id}`);
  return surfaces[id];
}
function finitePoint(point) {
  if (!Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite)) {
    throw new TypeError('A point must contain two finite coordinates.');
  }
}
function local(id, point) {
  finitePoint(point);
  const s = specification(id), c = Math.cos(s.angle), t = Math.sin(s.angle);
  const dx = point[0] - s.center[0], dy = point[1] - s.center[1];
  return { s, c, t, u: c * dx + t * dy, v: -t * dx + c * dy };
}
export function evaluate(id, point) {
  const { s, u, v } = local(id, point);
  return (s.eigen[0] * u * u + s.eigen[1] * v * v) / 2;
}
export function gradient(id, point) {
  const { s, c, t, u, v } = local(id, point);
  return [c * s.eigen[0] * u - t * s.eigen[1] * v,
    t * s.eigen[0] * u + c * s.eigen[1] * v];
}
export function step(id, point, eta) {
  if (!Number.isFinite(eta) || eta < 0) throw new RangeError('Step size must be finite and nonnegative.');
  const g = gradient(id, point);
  return [point[0] - eta * g[0], point[1] - eta * g[1]];
}

// ASSUMED browser guard. Reaching it is not convergence. Keep actual values.
export const MAX_COORDINATE = 1e6;
export function trajectory(id, start, eta, count) {
  if (!Number.isInteger(count) || count < 0 || count > 1000) throw new RangeError('Step count must be an integer from 0 to 1000.');
  finitePoint(start);
  specification(id);
  step(id, start, eta); // Validate eta even for a zero-length experiment.
  const points = [[...start]];
  let stopped = null;
  for (let i = 0; i < count; i++) {
    const next = step(id, points.at(-1), eta);
    if (!next.every(Number.isFinite) || !Number.isFinite(evaluate(id, next))) {
      stopped = 'Numerical limit reached; no further steps were calculated.';
      break;
    }
    points.push(next);
    if (next.some(v => Math.abs(v) > MAX_COORDINATE)) {
      stopped = 'Magnitude limit reached (10⁶); this is a display guard, not convergence.';
      break;
    }
  }
  return { points, stopped };
}

// Exact level set, sampled only for drawing. No renderer dependency.
export function contour(id, level, samples = 120) {
  const s = specification(id);
  if (s.dimensions !== 2 || !Number.isFinite(level) || level <= 0) throw new RangeError('Contours need a 2D surface and positive finite level.');
  if (!Number.isInteger(samples) || samples < 4 || samples > 10000) throw new RangeError('Contour samples must be an integer from 4 to 10000.');
  const c = Math.cos(s.angle), t = Math.sin(s.angle);
  return Array.from({ length: samples + 1 }, (_, i) => {
    const a = 2 * Math.PI * i / samples;
    const u = Math.sqrt(2 * level / s.eigen[0]) * Math.cos(a);
    const v = Math.sqrt(2 * level / s.eigen[1]) * Math.sin(a);
    return [s.center[0] + c * u - t * v, s.center[1] + t * u + c * v];
  });
}
