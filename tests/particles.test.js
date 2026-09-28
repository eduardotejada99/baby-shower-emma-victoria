const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('js/particles.js exporta la lógica del motor de partículas y cálculo de movimiento', () => {
  const code = fs.readFileSync(path.join(__dirname, '../js/particles.js'), 'utf8');

  assert.ok(code.includes('class ParticleEngine'), 'Debe definir la clase ParticleEngine');
  assert.ok(code.includes('requestAnimationFrame'), 'Debe usar requestAnimationFrame para fluidez');
  assert.ok(code.includes('visibilitychange'), 'Debe pausarse en pestañas ocultas para ahorrar batería');
  assert.ok(code.includes('prefers-reduced-motion'), 'Debe verificar prefers-reduced-motion');
});
