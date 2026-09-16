import { surfaces, evaluate, gradient, step, contour } from './model.js';
import { stages, format } from './lesson.js';

const $ = id => document.getElementById(id);
const text = (id, value) => { const el = $(id); if (el.textContent !== value) el.textContent = value; };
const hidden = (id, value) => $(id).toggleAttribute('hidden', value);
const attrs = (el, values) => Object.entries(values).forEach(([key, value]) => el.setAttribute(key, String(value)));
const vector = (p, dimensions) => dimensions === 1 ? format(p[0]) : `(${format(p[0])}, ${format(p[1])})`;
const path = points => points.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
const svgNode = (tag, values, content) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  attrs(el, values);
  if (content !== undefined) el.textContent = content;
  return el;
};

export function createRenderer() {
  let lastStage = -1, backdropKey = '', geometry, current, dragExtent = null;
  const plot = $('plot');
  stages.forEach((stage, i) => {
    const button = document.createElement('button');
    button.dataset.stageIndex = i;
    button.setAttribute('aria-label', `${i + 1}. ${stage.short}`);
    const number = document.createElement('span');
    number.textContent = String(i + 1).padStart(2, '0');
    button.append(number, document.createTextNode(stage.short));
    $('stage-nav').append(button);
  });

  function layout(state, showNext) {
    const dimensions = surfaces[state.surface].dimensions;
    const w = Math.max(240, plot.getBoundingClientRect().width);
    const h = Math.max(280, Math.min(450, w * 0.62));
    attrs(plot, { viewBox: `0 0 ${w} ${h}` });
    plot.style.height = `${h}px`;
    const recorded = state.history[Math.floor(state.cursor + 1e-8)] ?? state.history.at(-1);
    const extra = showNext ? [step(state.surface, recorded, state.eta)] : [];
    const largest = Math.max(4, ...state.history.flatMap(p => p.map(Math.abs)), ...extra.flatMap(p => p.map(Math.abs)));
    const extent = dragExtent ?? Math.max(5, Math.ceil(largest * 1.18));
    const left = extent > 100 ? 82 : 48;
    const size = Math.min(w - (extent > 100 ? 135 : 85), h - 78);
    const box = dimensions === 1 ? { x: left, y: 22, w: w - left - 25, h: h - 70 }
      : { x: (w - size) / 2, y: 18, w: size, h: size };
    const ymax = Math.ceil(extent * extent / 10) * 5;
    const sx = x => box.x + (x + extent) / (2 * extent) * box.w;
    const sy = y => dimensions === 1 ? box.y + box.h - y / ymax * box.h
      : box.y + box.h - (y + extent) / (2 * extent) * box.h;
    const project = p => [sx(p[0]), sy(dimensions === 1 ? evaluate(state.surface, p) : p[1])];
    return { dimensions, w, h, box, extent, ymax, sx, sy, project };
  }

  function backdrop(state, g) {
    const { dimensions, box, extent, ymax, sx, sy } = g;
    const key = `${state.surface}|${g.w}|${extent}|${ymax}`;
    if (key === backdropKey) return;
    backdropKey = key;
    attrs($('clip-rect'), { x: box.x, y: box.y, width: box.w, height: box.h });
    $('grid').replaceChildren(); $('landscape').replaceChildren(); $('axis-labels').replaceChildren();
    const gridLine = (x1, y1, x2, y2, axis = false) => $('grid').append(svgNode('line', { x1, y1, x2, y2, class: axis ? 'axis-line' : 'grid-line' }));
    const label = (x, y, content, anchor = 'middle') => $('axis-labels').append(svgNode('text', { x, y, 'text-anchor': anchor }, content));
    for (const fraction of [-0.8, -0.4, 0, 0.4, 0.8]) {
      const value = fraction * extent;
      gridLine(sx(value), box.y, sx(value), box.y + box.h, fraction === 0);
      label(sx(value), box.y + box.h + 22, format(value).replace(/\.00$/, ''));
      if (dimensions === 2) {
        gridLine(box.x, sy(value), box.x + box.w, sy(value), fraction === 0);
        label(box.x - 9, sy(value) + 4, format(value).replace(/\.00$/, ''), 'end');
      }
    }
    if (dimensions === 1) {
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        gridLine(box.x, sy(ymax * f), box.x + box.w, sy(ymax * f), f === 0);
        label(box.x - 9, sy(ymax * f) + 4, format(ymax * f).replace(/\.00$/, ''), 'end');
      }
      const samples = Array.from({ length: 161 }, (_, i) => [-extent + 2 * extent * i / 160, 0]);
      $('landscape').append(svgNode('path', { d: path(samples.map(g.project)), class: 'curve' }));
    } else {
      const scale = (extent / 5) ** 2;
      for (const level of [32, 20, 12, 6, 2, 0.5].map(x => x * scale)) {
        const d = path(contour(state.surface, level).map(p => [sx(p[0]), sy(p[1])])) + ' Z';
        if (level <= 2 * scale) $('landscape').append(svgNode('path', { d, class: 'contour-fill' }));
        $('landscape').append(svgNode('path', { d, class: 'contour' }));
      }
    }
    label(box.x + box.w, g.h - 4, dimensions === 1 ? 'position →' : 'horizontal coordinate →', 'end');
    label(box.x, 11, dimensions === 1 ? 'height' : 'vertical coordinate', 'start');
    attrs($('minimum-mark'), { transform: `translate(${g.project(surfaces[state.surface].center).join(' ')})` });
    hidden('minimum-mark', dimensions === 1);
  }

  function draw(state) {
    current = state;
    const stage = stages[state.stage], s = surfaces[state.surface];
    const showSlope = state.revealed;
    const formal = state.stage === 3 || state.stage === 6 || (state.stage >= 4 && state.observed);
    const showNext = formal && !state.running;
    const g = layout(state, showNext);
    geometry = g;
    backdrop(state, g);
    const index = Math.min(state.history.length - 1, Math.floor(state.cursor + 1e-8));
    const p = state.history[index], later = state.history[Math.min(index + 1, state.history.length - 1)];
    const fraction = Math.max(0, state.cursor - index);
    const visible = p.map((v, i) => v + (later[i] - v) * fraction);
    const location = g.project(visible), grad = gradient(state.surface, p), next = step(state.surface, p, state.eta);
    const nextLocation = g.project(next);
    attrs($('point-handle'), { transform: `translate(${location.join(' ')})`, 'aria-label': `Position ${vector(p, s.dimensions)}. Move with arrow keys.` });
    attrs($('point-label'), { x: Math.max(g.box.x + 6, Math.min(g.box.x + g.box.w - 95, location[0] + 17)), y: Math.max(36, location[1] - 17) });
    hidden('point-label', fraction > 0);
    const trail = [...state.history.slice(0, index + 1), ...(fraction ? [visible] : [])];
    attrs($('history-path'), { d: path(trail.map(g.project)) });
    $('history-dots').replaceChildren(...state.history.slice(0, index + 1).map(point => {
      const [cx, cy] = g.project(point);
      return svgNode('circle', { cx, cy, r: 3.5, class: 'history-dot' });
    }));
    hidden('slope-mark', !showSlope);
    hidden('center-guide', s.dimensions === 1 || !showSlope);
    hidden('step-mark', !showNext);
    hidden('next-point', !showNext);
    attrs($('step-mark'), { x1: g.project(p)[0], y1: g.project(p)[1], x2: nextLocation[0], y2: nextLocation[1] });
    attrs($('next-point'), { cx: nextLocation[0], cy: nextLocation[1] });
    if (s.dimensions === 1) {
      const radius = g.extent * 0.16, value = evaluate(state.surface, p);
      attrs($('slope-mark'), { x1: g.sx(p[0] - radius), y1: g.sy(value - grad[0] * radius), x2: g.sx(p[0] + radius), y2: g.sy(value + grad[0] * radius) });
      $('slope-mark').removeAttribute('marker-end');
    } else {
      const norm = Math.hypot(...grad), length = norm > 1e-9 ? 52 : 0;
      const start = g.project(p), center = g.project(s.center);
      attrs($('slope-mark'), { x1: start[0], y1: start[1], x2: start[0] + (norm ? length * grad[0] / norm : 0), y2: start[1] - (norm ? length * grad[1] / norm : 0), 'marker-end': 'url(#arrow-slope)' });
      attrs($('center-guide'), { x1: start[0], y1: start[1], x2: center[0], y2: center[1] });
    }

    if (lastStage !== state.stage) {
      lastStage = state.stage;
      text('stage-label', `${String(state.stage + 1).padStart(2, '0')} / ${stage.short}`);
      text('lesson-title', stage.title);
      text('intro', stage.intro);
      text('question', stage.question);
      text('question-label', stage.choices.length ? 'Make a prediction' : 'Try the rule');
      $('choices').replaceChildren(...stage.choices.map(([key, label]) => {
        const button = document.createElement('button');
        button.textContent = label; button.dataset.prediction = key;
        button.setAttribute('aria-pressed', 'false');
        return button;
      }));
      $('reason').value = '';
    }
    $('app').dataset.stage = stage.id;
    $('app').dataset.running = String(state.running);
    $('app').dataset.observed = String(state.observed);
    $('app').dataset.cursor = String(state.cursor);
    $('app').dataset.steps = String(state.history.length - 1);
    $('app').dataset.x = String(p[0]);
    $('app').dataset.y = String(p[1]);
    $('app').dataset.height = String(evaluate(state.surface, p));
    $('app').dataset.highlight = state.highlight ?? '';
    for (const button of $('stage-nav').children) {
      const number = Number(button.dataset.stageIndex);
      button.disabled = number > state.maxReached;
      if (number === state.stage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    }
    for (const button of $('choices').children) {
      button.setAttribute('aria-pressed', String(button.dataset.prediction === state.prediction));
      button.disabled = state.revealed;
    }

    text('plot-name', s.name);
    text('plot-mode', s.dimensions === 1 ? 'A side view' : 'Contours = equal height');
    text('plot-title', s.dimensions === 1 ? 'A point on a bowl-shaped curve' : 'A point on a contour map of a valley');
    text('plot-description', s.dimensions === 1
      ? 'The bowl is lowest at zero. Move the blue point by dragging or using left and right arrow keys. Recorded coordinates and height appear below.'
      : 'Each contour joins positions of equal height. The cross marks the minimum. Move the blue point by dragging or using all four arrow keys. Recorded coordinates and height appear below.');
    text('position-value', vector(p, s.dimensions));
    text('height-value', format(evaluate(state.surface, p)));
    text('slope-value', vector(grad, s.dimensions));
    text('slope-label', s.dimensions === 1 ? 'Local slope' : 'Local slopes');
    text('slope-key', s.dimensions === 1 ? '／ Local slope' : '↗ Uphill direction · scaled');
    hidden('slope-key', !showSlope); hidden('slope-readout', !showSlope); hidden('step-key', !showNext);
    text('drag-help', `Drag the point, or focus it and use ${s.dimensions === 1 ? '← →' : '← → ↑ ↓'}. Starting positions range from −4 to 4.`);
    text('playback-note', fraction > 0
      ? `Between steps ${index} and ${index + 1}. Readouts show recorded step ${index}.`
      : state.history.length > 1 ? `Recorded step ${index}. Scrub backward to compare; a new step branches from here.` : 'Choose a position before predicting.');
    hidden('eta-control', state.stage === 0 || state.stage === 5);
    $('eta').value = String(state.eta);
    text('eta-value', format(state.eta));
    hidden('equation', !formal);
    text('symbolic', s.dimensions === 1 ? 'xₙₑₓₜ = x − η · slope' : 'pₙₑₓₜ = p − η · ∇f(p)');
    text('eq-next', vector(next, s.dimensions));
    text('eq-position', vector(p, s.dimensions));
    text('eq-eta', format(state.eta));
    text('eq-slope', s.dimensions === 1 && grad[0] < 0 ? `(${format(grad[0])})` : vector(grad, s.dimensions));
    $('eq-position').setAttribute('aria-label', `Position ${vector(p, s.dimensions)}. Highlight its geometry.`);
    $('eq-eta').setAttribute('aria-label', `Step size ${format(state.eta)}. Highlight the next step.`);
    $('eq-slope').setAttribute('aria-label', `Local slope ${vector(grad, s.dimensions)}. Highlight its geometry.`);
    text('formal-note', s.dimensions === 1
      ? 'This is gradient descent. η (“eta”) is the step size, or learning rate. Here, the slope equals x. Focus or select a colored term to find its geometry.'
      : 'The gradient ∇f is the pair of local slopes. Subtract a scaled copy from the position. Focus or select a colored term to find its geometry.');

    $('reveal').disabled = state.running || (!state.revealed && !state.prediction);
    text('reveal', state.observed ? 'Take one more step →' : stage.count === 6 ? 'Reveal six steps →' : 'Reveal one step →');
    // After the first six-step experiment, an extra reveal still means six steps.
    if (state.observed && stage.count === 6) text('reveal', 'Try six more steps →');
    text('reveal-hint', !state.revealed && !state.prediction ? 'Choose a prediction to reveal the result.'
      : state.running ? 'Pause whenever you want to look closer.'
        : state.observed ? stage.choices.length ? 'Drag again or change the step size to make a new prediction.' : 'Change the inputs to try a different experiment.' : 'You can pause or replay the result.');
    hidden('result', !state.result);
    if (state.result) {
      text('result-lead', state.result.correct === null ? 'Watch what changed.'
        : state.result.correct ? 'Your prediction matched.' : 'The result went another way.');
      text('result-text', state.result.explanation);
    }
    hidden('limit', !state.stopReason);
    text('limit', state.stopReason ?? '');
    hidden('playback', !state.lastRun && state.stage !== 6);
    text('pause', state.running ? 'Pause' : 'Resume');
    $('pause').disabled = !state.running && state.cursor >= state.runEnd;
    $('replay').disabled = !state.lastRun;
    $('run').disabled = state.running || !state.observed;
    attrs($('scrub'), { max: state.history.length - 1 });
    $('scrub').value = String(index);
    text('step-value', `${index} / ${state.history.length - 1}`);
    hidden('reflection', state.stage !== 5 || !state.observed);
    if (!state.observed) $('reason').value = '';
    hidden('free-controls', state.stage !== 6);
    $('surface').value = state.surface;
    $('back').disabled = state.stage === 0;
    hidden('next', state.stage === 6);
    $('next').disabled = !state.observed;
    text('next', state.stage === 5 ? 'Explore freely →' : 'Next idea →');
  }

  const resize = new ResizeObserver(() => { if (current) draw(current); });
  resize.observe(plot.parentElement);
  return {
    draw,
    beginDrag() { dragExtent = geometry.extent; },
    endDrag() { dragExtent = null; if (current) draw(current); },
    // Convert through the actual SVG screen matrix; stable under zoom/scroll.
    pointFromClient(clientX, clientY) {
      const p = new DOMPoint(clientX, clientY).matrixTransform(plot.getScreenCTM().inverse());
      return [((p.x - geometry.box.x) / geometry.box.w * 2 - 1) * geometry.extent,
        geometry.dimensions === 1 ? 0 : (1 - (p.y - geometry.box.y) / geometry.box.h * 2) * geometry.extent];
    },
    dispose: () => resize.disconnect()
  };
}
