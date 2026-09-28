const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

test('Estructura de archivos y assets SVG requeridos existen', () => {
  const requiredFiles = [
    'assets/icons/seal.svg',
    'assets/icons/wreath.svg',
    'assets/icons/butterfly.svg',
    'assets/icons/calendar.svg',
    'assets/icons/map-pin.svg',
    'assets/icons/music.svg',
    'index.html'
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    assert.ok(fs.existsSync(fullPath), `El archivo ${file} debe existir`);
  }
});

test('index.html contiene todas las secciones, IDs interactivos y metadatos clave', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  assert.ok(html.includes('Emma Victoria'), 'Debe contener el nombre de la bebé');
  assert.ok(html.includes('id="canvas-particles"'), 'Debe contener el canvas de partículas');
  assert.ok(html.includes('id="wax-seal"'), 'Debe contener el sello de cera');
  assert.ok(html.includes('id="countdown-timer"'), 'Debe contener el contenedor de la cuenta regresiva');
  assert.ok(html.includes('id="dresscode-section"'), 'Debe contener la sección de dress code');
  assert.ok(html.includes('id="rsvp-form"'), 'Debe contener el formulario RSVP');
  assert.ok(html.includes('id="btn-audio-toggle"'), 'Debe contener el botón de control de audio');
});
