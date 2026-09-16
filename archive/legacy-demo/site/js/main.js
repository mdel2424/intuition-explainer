import { createLesson } from './lesson.js';
import { createRenderer } from './render.js';
import { wireInteractions } from './interactions.js';

const lesson = createLesson();
const renderer = createRenderer();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let frame = null, previous = 0;

function schedule(state) {
  renderer.draw(state);
  if (state.running && frame === null) {
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  }
  if (!state.running && frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
}
function tick(now) {
  const dt = Math.min(0.1, (now - previous) / 1000);
  frame = null;
  lesson.tick(dt, reducedMotion.matches);
}
lesson.subscribe(schedule);
wireInteractions(lesson, renderer);
reducedMotion.addEventListener('change', () => { if (lesson.getState().running) lesson.tick(0, reducedMotion.matches); });
schedule(lesson.getState());
