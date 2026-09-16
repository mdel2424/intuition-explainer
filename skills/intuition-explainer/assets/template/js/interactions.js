export function wireInteractions(lesson, renderer) {
  const $ = id => document.getElementById(id);
  const action = (id, type, value) => $(id).addEventListener('click', () => lesson.dispatch(type, value));
  const compact = matchMedia('(max-width: 720px)');
  const placeObservationControls = () => {
    if (compact.matches) $('observation-controls').append($('result'), $('playback'));
    else {
      $('limit').before($('result'));
      $('limit').after($('playback'));
    }
  };
  placeObservationControls();
  compact.addEventListener('change', placeObservationControls);
  for (const id of ['reveal', 'run', 'replay']) {
    $(id).addEventListener('click', () => {
      lesson.dispatch(id);
      // Keep the result in view when the prediction controls lie below the plot.
      if (compact.matches) $('plot').scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }
  action('reset', 'reset');
  for (const [id, type] of [['next', 'next'], ['back', 'back']]) {
    $(id).addEventListener('click', () => { lesson.dispatch(type); $('lesson-title').focus({ preventScroll: true }); if (compact.matches) $('lesson-title').scrollIntoView({ block: 'start', behavior: 'instant' }); });
  }
  $('stage-nav').addEventListener('click', event => {
    const button = event.target.closest('button[data-stage-index]');
    if (button && !button.disabled) {
      lesson.dispatch('goto', Number(button.dataset.stageIndex));
      $('lesson-title').focus({ preventScroll: true }); if (compact.matches) $('lesson-title').scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  });
  $('choices').addEventListener('click', event => {
    const button = event.target.closest('button[data-prediction]');
    if (button) lesson.dispatch('predict', button.dataset.prediction);
  });
  $('eta').addEventListener('input', event => lesson.dispatch('eta', Number(event.target.value)));
  $('scrub').addEventListener('input', event => lesson.dispatch('scrub', Number(event.target.value)));
  $('surface').addEventListener('change', event => lesson.dispatch('surface', event.target.value));
  $('pause').addEventListener('click', () => lesson.dispatch(lesson.getState().running ? 'pause' : 'resume'));

  const handle = $('point-handle');
  let dragging = null;
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    dragging = event.pointerId;
    renderer.beginDrag();
    handle.setPointerCapture(event.pointerId);
    handle.focus({ preventScroll: true });
    // Stop first; model edits on move replace the old experiment.
    lesson.dispatch('pause');
    event.preventDefault();
  });
  handle.addEventListener('pointermove', event => {
    if (event.pointerId !== dragging) return;
    lesson.dispatch('point', renderer.pointFromClient(event.clientX, event.clientY));
  });
  const release = event => {
    if (event.pointerId !== dragging) return;
    dragging = null;
    renderer.endDrag();
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  };
  handle.addEventListener('pointerup', release);
  handle.addEventListener('pointercancel', release);
  handle.addEventListener('lostpointercapture', () => { dragging = null; renderer.endDrag(); });
  handle.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault();
    const p = lesson.currentPoint(), amount = event.shiftKey ? 0.5 : 0.15;
    if (event.key === 'ArrowLeft') p[0] -= amount;
    if (event.key === 'ArrowRight') p[0] += amount;
    if (event.key === 'ArrowUp') p[1] += amount;
    if (event.key === 'ArrowDown') p[1] -= amount;
    if (event.key === 'Home') { p[0] = 0; p[1] = 0; }
    lesson.dispatch('point', p);
  });
  document.querySelectorAll('[data-highlight]').forEach(element => {
    const highlight = () => lesson.dispatch('highlight', element.dataset.highlight);
    element.addEventListener('focus', highlight);
    element.addEventListener('pointerenter', highlight);
    element.addEventListener('click', highlight);
    element.addEventListener('blur', () => lesson.dispatch('highlight', null));
    element.addEventListener('pointerleave', () => {
      if (document.activeElement !== element) lesson.dispatch('highlight', null);
    });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) lesson.dispatch('pause'); });
}
