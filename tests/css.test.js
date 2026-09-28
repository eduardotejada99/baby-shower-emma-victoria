const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('style.css contiene variables de diseño, glassmorphism, responsive y keyframes', () => {
  const css = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

  // Variables de color
  assert.ok(css.includes('--color-blush'), 'Debe definir --color-blush');
  assert.ok(css.includes('--color-gold'), 'Debe definir --color-gold');
  assert.ok(css.includes('--font-serif'), 'Debe definir --font-serif');
  assert.ok(css.includes('--font-script'), 'Debe definir --font-script');

  // Glassmorphism y efectos
  assert.ok(css.includes('backdrop-filter'), 'Debe utilizar backdrop-filter para glassmorphism');
  assert.ok(css.includes('@keyframes'), 'Debe contener animaciones keyframes');
  assert.ok(css.includes('@media'), 'Debe incluir media queries para adaptación responsive');
  assert.ok(css.includes('prefers-reduced-motion'), 'Debe respetar preferencias de reducción de movimiento');
});
