// Domain adapter: public DOM controls only; no test-only lesson navigation or state mutation.
export async function exercise({ page, check, shot, profile }) {
  const visited = [];
  const state = () => page.locator('#app').evaluate(el => ({ ...el.dataset }));
  const near = (a, b) => Math.abs(Number(a) - b) < 1e-7;
  const idle = () => page.waitForFunction(() => document.querySelector('#app').dataset.running === 'false' && document.querySelector('#app').dataset.observed === 'true');
  const stage = async name => { check((await state()).stage === name, `stage ${name} reached through the UI`); visited.push(name); };
  const choose = async key => {
    await page.locator(`[data-prediction="${key}"]`).click();
    await page.locator('#reveal').click();
    await idle();
    if (profile.name === 'mobile' || profile.name === 'narrow') {
      const bounds = await page.locator('#plot').boundingBox();
      check(bounds.y >= -3 && bounds.y + bounds.height <= profile.height, 'mobile reveal brings the computed diagram into view');
      check(await page.locator('#observation-controls #playback').count() === 1, 'mobile playback remains beside the visual evidence');
    }
  };
  const range = async (selector, value) => {
    // Sets a native form input and emits its normal event, never model state.
    await page.locator(selector).evaluate((el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
  };
  const layout = async label => {
    const issues = await page.evaluate(() => {
      const problems = [];
      if (document.documentElement.scrollWidth > innerWidth + 2) problems.push('horizontal page overflow');
      for (const el of document.querySelectorAll('#equation, #numeric-equation, .readouts, .lesson-actions, #lesson-title')) {
        if (!el.checkVisibility()) continue;
        if (el.scrollWidth > el.clientWidth + 2) problems.push(`${el.id || el.className} clips content`);
        const r = el.getBoundingClientRect();
        if (r.left < -2 || r.right > innerWidth + 2) problems.push(`${el.id || el.className} outside viewport`);
      }
      const plot = document.querySelector('#plot').getBoundingClientRect();
      for (const el of document.querySelectorAll('#plot text')) {
        if (!el.checkVisibility()) continue;
        const b = el.getBoundingClientRect();
        if (b.width && (b.left < plot.left - 3 || b.right > plot.right + 3 || b.top < plot.top - 3 || b.bottom > plot.bottom + 3)) problems.push(`SVG label outside plot: ${el.textContent}`);
      }
      return problems;
    });
    check(issues.length === 0, `${label}: no page/equation clipping or out-of-bounds labels (${issues.join('; ')})`);
  };
  await page.waitForFunction(() => document.querySelector('#position-value').textContent.length > 0);
  await stage('direction');
  check(await page.locator('#reveal').isDisabled(), 'reveal waits for a prediction');
  check(await page.locator('#equation').isHidden(), 'formal equation absent before the experience');
  check(await page.locator('#slope-mark').isHidden(), 'answer-bearing slope hidden before reveal');
  await layout('hook');
  if (profile.full || profile.name === 'mobile') await shot('01-hook');

  if (profile.name === 'mobile') {
    const box = await page.locator('#point-handle').boundingBox();
    const x = Number((await state()).x);
    const touch = await page.context().newCDPSession(page);
    const at = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [at] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: at.x - 45, y: at.y }] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    check(Number((await state()).x) < x - 0.5, 'touch dragging updates the point without scrolling the page');
    await touch.detach();
    await page.locator('#reset').click();
  }
  if (profile.full) {
    const box = await page.locator('#point-handle').boundingBox();
    const x = Number((await state()).x);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 - 85, box.y + box.height / 2, { steps: 8 }); await page.mouse.up();
    check(Number((await state()).x) < x - 0.5, 'dragging the visible point changes the mathematical position');
    await page.locator('#reset').click();
    check(near((await state()).x, 3.2), 'reset restores stage position');
    await page.locator('#point-handle').focus();
    await page.keyboard.press('ArrowLeft');
    check(near((await state()).x, 3.05), 'point responds to keyboard movement');
    check(await page.locator('.point-focus').evaluate(el => getComputedStyle(el).opacity === '1'), 'focused point has a visible focus indicator');
    await page.keyboard.press('Home'); await choose('still');
    check(near((await state()).x, 0), 'stationary point does not move');
    await page.locator('#reset').click();
    await page.locator('[data-prediction="right"]').click();
    await page.locator('#reveal').click();
    await page.waitForTimeout(120);
    await page.locator('#pause').click();
    const cursor = (await state()).cursor;
    await page.waitForTimeout(180);
    check((await state()).cursor === cursor && (await state()).running === 'false', 'pause freezes the playhead');
    await page.locator('#pause').click(); await idle();
    check((await page.locator('#result-lead').textContent()).includes('another way'), 'wrong prediction receives explanatory feedback');
    check(near((await state()).x, 2.56), 'first computed step matches 3.2 − 0.2×3.2');
    const count = (await state()).steps;
    await page.locator('#replay').click(); await idle();
    check((await state()).steps === count && near((await state()).x, 2.56), 'replay preserves result and does not add updates');
    await page.locator('#scrub').focus(); await page.keyboard.press('Home');
    check(near((await state()).x, 3.2), 'history scrub reverses to the original iterate');
    await page.keyboard.press('End'); check(near((await state()).x, 2.56), 'history scrub restores the computed iterate');
  } else await choose('left');

  await page.locator('#next').click(); await stage('distance');
  if (profile.full) {
    const before = await page.locator('#eta-value').textContent();
    await page.locator('#eta').focus(); await page.keyboard.press('ArrowRight');
    check((await page.locator('#eta-value').textContent()) !== before, 'native range input works with arrow keys');
    await page.locator('#reset').click();
  }
  await choose('lower');
  check(near((await state()).x, 0.98), 'step size changes the actual update');
  if (profile.full) {
    await page.locator('#run').click(); await page.waitForTimeout(100);
    await range('#eta', 0.25);
    check((await state()).running === 'false' && (await state()).steps === '0', 'parameter change interrupts a running experiment');
    check(await page.locator('#reveal').isDisabled(), 'input changes invalidate the previous prediction');
    await choose('lower');
  }
  await page.locator('#next').click(); await stage('overshoot');
  await choose('grow');
  check(Number((await state()).height) > 0.72, 'oversized steps visibly increase height');
  check(near((await state()).x, 1.2 * (-1.15) ** 6), 'six-step divergence is calculated, not staged');
  await layout('counterexample');
  if (profile.full || profile.name === 'mobile') await shot('02-counterexample');
  await range('#eta', 0.25); await choose('settle');
  check(Number((await state()).height) < 0.72, 'smaller step size repairs divergence');

  await page.locator('#next').click(); await stage('rule');
  check(await page.locator('#equation').isVisible(), 'formalism appears after the failure case');
  const equation = await page.locator('#numeric-equation').textContent();
  await page.locator('#point-handle').focus(); await page.keyboard.press('ArrowLeft');
  check((await page.locator('#numeric-equation').textContent()) !== equation, 'moving geometry updates the equation');
  for (const [id, highlight] of [['eq-position', 'position'], ['eq-eta', 'step'], ['eq-slope', 'slope']]) {
    await page.locator(`#${id}`).focus();
    check((await state()).highlight === highlight, `symbol focus highlights ${highlight} geometry`);
  }
  await page.locator('#reset').click();
  await page.locator('#reveal').click(); await idle();
  await layout('formal bridge');
  if (profile.full || ['mobile', 'narrow', 'zoom-reflow'].includes(profile.name)) await shot('03-formal-bridge');

  await page.locator('#next').click(); await stage('map');
  check(await page.locator('#equation').isHidden(), 'new prediction does not reveal next-step numbers');
  if (profile.full) {
    const box = await page.locator('#point-handle').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 25, box.y + box.height / 2 + 30, { steps: 6 });
    await page.mouse.up();
    const moved = await state();
    check(Number(moved.x) < 3 && Number(moved.y) < 2, '2D direct manipulation changes both coordinates');
    await page.locator('#point-handle').focus(); await page.keyboard.press('ArrowUp');
    check(near((await state()).y, Number(moved.y) + 0.15), '2D keyboard movement changes the vertical coordinate');
    await page.locator('#reset').click();
  }
  check(near(await page.locator('#eta').inputValue(), 0.18), 'native slider preserves the exact modeled step size');
  await choose('vertical');
  check(near((await state()).x, 2.46) && near((await state()).y, 0.56), '2D gradient updates both coordinates correctly');
  await layout('contour map');
  if (profile.full || profile.name === 'mobile') await shot('04-contours');

  await page.locator('#next').click(); await stage('transfer');
  check(await page.locator('#slope-mark').isHidden(), 'transfer hides the computed direction until commitment');
  if (profile.full) await shot('05-transfer-prediction');
  await choose('up');
  check(Number((await state()).y) > 1.9, 'unseen rotated valley step rises despite the lower minimum');
  check((await page.locator('#result-lead').textContent()).includes('matched'), 'transfer feedback evaluates the new surface');
  await page.locator('#reason').fill('The local slopes describe the height here. Both coordinate changes contribute to the total height change.');
  await page.locator('#reflection summary').click();
  check(await page.locator('#reflection details').getAttribute('open') !== null, 'reflection offers a comparison after the attempt');
  await layout('transfer');
  if (profile.full || ['mobile', 'landscape', 'zoom-reflow'].includes(profile.name)) await shot('06-transfer-result');

  await page.locator('#next').click(); await stage('explore');
  for (const surface of ['bowl', 'valley', 'rotated']) {
    await page.locator('#surface').selectOption(surface);
    const before = Number((await state()).height);
    await page.locator('#run').click(); await idle();
    check(Number((await state()).height) < before, `free exploration runs the ${surface} model`);
  }
  if (profile.full) {
    await page.locator('#surface').selectOption('valley');
    await range('#eta', 2.4);
    await page.locator('#run').click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await idle();
    check((await state()).running === 'false', 'changing reduced-motion preference mid-run completes without stale playback');
    await page.locator('#run').click(); await idle();
    check(await page.locator('#limit').isVisible(), 'large-value guard is visibly disclosed');
    await layout('extreme computed values');
    await page.locator('#reset').click();
    await page.locator('#stage-nav button[data-stage-index="3"]').click();
    check((await state()).stage === 'rule', 'earlier stages remain available after the lesson');
    await page.locator('#back').click();
    check((await state()).stage === 'overshoot', 'Back navigates to the previous lesson');
    await page.locator('#stage-nav button[data-stage-index="6"]').click();
    check((await state()).stage === 'explore', 'free exploration can be revisited');
    await page.locator('#about-model > summary').click();
    await page.locator('.about-copy details > summary').click();
    check(await page.locator('.about-copy details').getAttribute('open') !== null, 'model fidelity and exact functions are reachable');
  }
  await layout('final exploration');
  return visited;
}
