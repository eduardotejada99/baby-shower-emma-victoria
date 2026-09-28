const { test } = require('node:test');
const assert = require('node:assert');

function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

function calculateSceneProgress(scrollProgress, sceneStart, sceneEnd) {
  if (sceneEnd <= sceneStart) return 0;
  const raw = (scrollProgress - sceneStart) / (sceneEnd - sceneStart);
  return Math.round(clamp(raw, 0, 1) * 10000) / 10000;
}

function calculateSceneOpacityAndTransform(localProgress) {
  let opacity = 0;
  let scale = 0.92;
  let translateY = 30;

  if (localProgress < 0.25) {
    const t = localProgress / 0.25;
    opacity = t;
    scale = 0.92 + (1.0 - 0.92) * t;
    translateY = 30 * (1 - t);
  } else if (localProgress <= 0.75) {
    opacity = 1;
    scale = 1.0;
    translateY = 0;
  } else {
    const t = (localProgress - 0.75) / 0.25;
    opacity = 1 - t;
    scale = 1.0 + 0.06 * t;
    translateY = -25 * t;
  }

  return {
    opacity: Math.round(opacity * 1000) / 1000,
    scale: Math.round(scale * 1000) / 1000,
    translateY: Math.round(translateY * 10) / 10
  };
}

test('calculateSceneProgress calcula progreso normalizado entre 0 y 1', () => {
  assert.strictEqual(calculateSceneProgress(0.1, 0.2, 0.4), 0);
  assert.strictEqual(calculateSceneProgress(0.3, 0.2, 0.4), 0.5);
  assert.strictEqual(calculateSceneProgress(0.5, 0.2, 0.4), 1);
});

test('calculateSceneOpacityAndTransform genera transiciones suaves bidireccionales', () => {
  const enter = calculateSceneOpacityAndTransform(0);
  assert.strictEqual(enter.opacity, 0);
  assert.strictEqual(enter.scale, 0.92);

  const active = calculateSceneOpacityAndTransform(0.5);
  assert.strictEqual(active.opacity, 1);
  assert.strictEqual(active.scale, 1.0);
  assert.strictEqual(active.translateY, 0);

  const exit = calculateSceneOpacityAndTransform(1);
  assert.strictEqual(exit.opacity, 0);
  assert.strictEqual(exit.scale, 1.06);
});
