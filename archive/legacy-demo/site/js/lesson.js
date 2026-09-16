import { evaluate, gradient, trajectory, surfaces, MAX_COORDINATE } from './model.js';

// ASSUMED teaching sequence and inputs. All answers below come from the model.
export const stages = [
  { id: 'direction', short: 'Find downhill', title: 'Which way is down?',
    intro: 'Drag the blue point along the curve. Your task is to make its height smaller.',
    question: 'From your chosen position, which way should a small step go?',
    choices: [['left', '← Left'], ['still', 'Stay here'], ['right', 'Right →']],
    surface: 'bowl', start: [3.2, 0], eta: 0.2, count: 1 },
  { id: 'distance', short: 'Choose a distance', title: 'A direction is not a distance.',
    intro: 'Keep the same starting point. Change the step size, then predict where the jump will land.',
    question: 'Will the landing be lower, at the same height, or higher?',
    choices: [['lower', 'Lower'], ['same', 'Same height'], ['higher', 'Higher']],
    surface: 'bowl', start: [2.8, 0], eta: 0.65, count: 1 },
  { id: 'overshoot', short: 'Break the rule', title: 'Can downhill send you uphill?',
    intro: 'This step size is deliberately large. Each jump still starts against the local slope.',
    question: 'Predict what six repeated jumps will do.',
    choices: [['settle', 'Approach the bottom'], ['same', 'Keep the same height'], ['grow', 'Move farther away']],
    surface: 'bowl', start: [1.2, 0], eta: 2.15, count: 6 },
  { id: 'rule', short: 'Name the pattern', title: 'Now the rule has a job to do.',
    intro: 'Use the local slope for direction and the step size for distance. Subtract their product from the current position.',
    question: 'Move the point or change the step size. Watch the next-step equation change with it.',
    choices: [], surface: 'bowl', start: [2.8, 0], eta: 0.3, count: 1 },
  { id: 'map', short: 'Add a dimension', title: 'Two coordinates. One local rule.',
    intro: 'Now look down on a valley. Each contour joins positions with equal height; the × marks the bottom.',
    question: 'On the first step, which coordinate will change more?',
    choices: [['horizontal', 'Horizontal'], ['equal', 'Equal amounts'], ['vertical', 'Vertical']],
    surface: 'valley', start: [3, 2], eta: 0.18, count: 1 },
  { id: 'transfer', short: 'Try a new valley', title: 'Does downhill always point toward the bottom?',
    intro: 'This valley is rotated and shifted. Use the contour shapes to predict the first step, before seeing its arrow.',
    question: 'Will the next step raise or lower the vertical coordinate?',
    choices: [['up', '↑ Raise it'], ['still', 'Keep it'], ['down', '↓ Lower it']],
    surface: 'rotated', start: [2.7, 1.9], eta: 0.12, count: 1 },
  { id: 'explore', short: 'Explore freely', title: 'A local clue, used over and over.',
    intro: 'In machine learning, position becomes the model’s parameters, height becomes loss, and step size becomes the learning rate.',
    question: 'Find a step size that settles, then one that fails. Explain the difference without using the word “gradient.”',
    choices: [], surface: 'rotated', start: [2.7, 1.9], eta: 0.12, count: 1 }
];

export const format = value => Math.abs(value) < 0.0005 ? '0.00'
  : Math.abs(value) >= 10000 ? value.toExponential(2) : value.toFixed(2);
const sign = (v, negative, zero, positive) => Math.abs(v) < 1e-9 ? zero : v < 0 ? negative : positive;
const compare = (a, b, less, equal, greater) => sign(a - b, less, equal, greater);

export function assess(stage, surface, start, end, eta, prediction) {
  const before = evaluate(surface, start), after = evaluate(surface, end);
  const g = gradient(surface, start);
  let expected, explanation;
  switch (stage) {
    case 0:
      expected = sign(-g[0], 'left', 'still', 'right');
      explanation = Math.abs(g[0]) < 1e-9
        ? 'The slope is zero at the bottom, so this rule stays here. Move away and try again.'
        : `At your starting point, the local slope was ${format(g[0])}. Moving against it sent the point ${expected}. The tangent now shows the tilt at the current point.`;
      break;
    case 1:
      expected = compare(after, before, 'lower', 'same', 'higher');
      explanation = `Height changes from ${format(before)} to ${format(after)}. A downhill direction alone does not decide where a finite jump lands.`;
      break;
    case 2:
      expected = compare(after, before, 'settle', 'same', 'grow');
      explanation = expected === 'grow'
        ? `Height grows from ${format(before)} to ${format(after)}. The local slope only describes a small neighborhood; these jumps cross it. Try a smaller step size.`
        : expected === 'same'
          ? `Height stays at ${format(after)}. ${Math.abs(start[0]) < 1e-9 ? 'At zero there is no slope and no movement.' : 'The point jumps between opposite sides without getting lower.'} Change the step size and compare.`
          : `Height falls from ${format(before)} to ${format(after)}. You repaired the overshoot. The rule is unchanged; the step size is smaller.`;
      break;
    case 4:
      expected = compare(Math.abs(g[0]), Math.abs(g[1]), 'vertical', 'equal', 'horizontal');
      explanation = `At the start, the local slopes were ${format(g[0])} and ${format(g[1])}. The first step changed the coordinates by ${format(-eta * g[0])} and ${format(-eta * g[1])}. Local steepness sets the direction; it need not point straight at the ×.`;
      break;
    case 5:
      expected = sign(-g[1], 'down', 'still', 'up');
      explanation = `At the start, the vertical local slope was ${format(g[1])}, so the first vertical change was ${format(-eta * g[1])}. Height falls from ${format(before)} to ${format(after)}. A step can move away from the bottom in one coordinate while still going locally downhill.`;
      // Dragging can reach a stationary point. Avoid claiming a strict decrease.
      if (Math.abs(after - before) < 1e-9) explanation = 'At this position the height does not change. Try a point away from the minimum and predict again.';
      break;
    default:
      explanation = `This experiment changes height from ${format(before)} to ${format(after)}. The same local rule produces every point in the path.`;
  }
  return { expected, chosen: prediction, correct: expected ? prediction === expected : null, explanation };
}

export function createLesson() {
  const listeners = new Set();
  let state;
  function init(index, maxReached = index) {
    const stage = stages[index];
    state = { stage: index, maxReached, surface: stage.surface, start: [...stage.start],
      eta: stage.eta, history: [[...stage.start]], cursor: 0, running: false,
      prediction: null, revealed: stage.choices.length === 0, observed: index === 6,
      result: null, pending: null, runStart: 0, runEnd: 0, lastRun: null,
      stopReason: null, highlight: null };
  }
  init(0);
  const emit = () => listeners.forEach(fn => fn(state));
  const point = () => state.history[Math.floor(state.cursor + 1e-8)] ?? state.history.at(-1);
  function restartInputs() {
    Object.assign(state, { history: [[...state.start]], cursor: 0, running: false,
      prediction: null, revealed: stages[state.stage].choices.length === 0,
      observed: state.stage === 6, result: null, pending: null, lastRun: null,
      runStart: 0, runEnd: 0, stopReason: null });
  }
  function complete() {
    state.cursor = state.runEnd;
    state.running = false;
    state.observed = true;
    state.result = state.pending;
  }
  function reveal(count = stages[state.stage].count) {
    if (state.running || (!state.revealed && !state.prediction)) return;
    const base = Math.floor(state.cursor + 1e-8), start = [...point()];
    if (base >= 72 || start.some(v => Math.abs(v) > MAX_COORDINATE)) {
      state.stopReason = 'Experiment limit reached. Reset or scrub to an earlier step to continue.';
      return;
    }
    const run = trajectory(state.surface, start, state.eta, Math.min(count, 72 - base));
    const firstReveal = !state.observed;
    state.pending = assess(firstReveal ? state.stage : 6, state.surface, start,
      run.points.at(-1), state.eta, state.prediction);
    state.history = [...state.history.slice(0, base + 1), ...run.points.slice(1)];
    state.runStart = base;
    state.runEnd = state.history.length - 1;
    state.lastRun = { start: base, end: state.runEnd };
    state.cursor = base;
    state.running = true;
    state.revealed = true;
    state.result = null;
    state.stopReason = run.stopped;
    if (state.runStart === state.runEnd) complete();
  }
  function dispatch(type, value) {
    switch (type) {
      case 'predict':
        if (!state.revealed && stages[state.stage].choices.some(([key]) => key === value)) state.prediction = value;
        break;
      case 'point':
        if (!Array.isArray(value) || value.length !== 2 || !value.every(Number.isFinite)) return;
        state.start = [Math.max(-4, Math.min(4, value[0])), surfaces[state.surface].dimensions === 1 ? 0 : Math.max(-4, Math.min(4, value[1]))];
        restartInputs();
        break;
      case 'eta':
        if (!Number.isFinite(value)) return;
        state.eta = Math.max(0.05, Math.min(2.4, value));
        restartInputs();
        break;
      case 'surface':
        if (state.stage !== 6 || !Object.hasOwn(surfaces, value)) return;
        state.surface = value;
        state.start = value === 'bowl' ? [2.8, 0] : [2.7, 1.9];
        state.eta = value === 'bowl' ? 0.3 : 0.12;
        restartInputs();
        break;
      case 'reveal': reveal(); break;
      case 'run':
        // Additional runs follow an observed prediction; no bypass of its question.
        if (state.observed) reveal(6);
        break;
      case 'pause': state.running = false; break;
      case 'resume':
        if (state.lastRun && state.cursor < state.runEnd) state.running = true;
        break;
      case 'replay':
        if (state.lastRun) {
          state.cursor = state.lastRun.start;
          state.runStart = state.lastRun.start;
          state.runEnd = state.lastRun.end;
          state.running = true;
        }
        break;
      case 'scrub':
        if (!Number.isFinite(value)) return;
        state.cursor = Math.max(0, Math.min(state.history.length - 1, Math.round(value)));
        state.running = false;
        if (state.lastRun && state.cursor >= state.runEnd) complete();
        break;
      case 'reset': init(state.stage, state.maxReached); break;
      case 'next':
        if (state.observed && state.stage < stages.length - 1) init(state.stage + 1, Math.max(state.maxReached, state.stage + 1));
        break;
      case 'back': if (state.stage > 0) init(state.stage - 1, state.maxReached); break;
      case 'goto':
        if (Number.isInteger(value) && value >= 0 && value <= state.maxReached) init(value, state.maxReached);
        break;
      case 'highlight': state.highlight = value; break;
      default: throw new RangeError(`Unknown lesson action: ${type}`);
    }
    emit();
  }
  return {
    getState: () => state,
    currentPoint: () => [...point()],
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
    dispatch,
    tick(seconds, reducedMotion = false) {
      if (!state.running) return;
      // ILLUSTRATIVE duration. Computation has already produced each endpoint.
      state.cursor = reducedMotion ? state.runEnd : Math.min(state.runEnd, state.cursor + Math.max(0, seconds) / 0.65);
      if (state.cursor >= state.runEnd) complete();
      emit();
    }
  };
}
