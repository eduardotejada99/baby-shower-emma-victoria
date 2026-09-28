const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('js/audio.js implementa el sintetizador Web Audio para caja de música', () => {
  const code = fs.readFileSync(path.join(__dirname, '../js/audio.js'), 'utf8');
  assert.ok(code.includes('AudioContext') || code.includes('webkitAudioContext'), 'Debe usar Web Audio API');
  assert.ok(code.includes('createOscillator'), 'Debe crear osciladores para las notas');
  assert.ok(code.includes('createGain'), 'Debe usar gain nodes para el decaimiento de campana');
});

test('js/main.js orquesta IntersectionObserver, dress code interactivo y RSVP', () => {
  const code = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
  assert.ok(code.includes('IntersectionObserver'), 'Debe usar IntersectionObserver para scroll');
  assert.ok(code.includes('btn-audio-toggle'), 'Debe conectar el botón de audio');
  assert.ok(code.includes('rsvp-form'), 'Debe manejar el evento submit del formulario RSVP');
});
