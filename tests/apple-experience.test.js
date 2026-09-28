const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

test('index.html implementa la arquitectura móvil exacta de Apple', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  // Sub-navegación sticky estilo Apple
  assert.ok(html.includes('id="apple-subnav"'), 'Debe incluir el subnav persistente');
  assert.ok(html.includes('id="subnav-rsvp-btn"'), 'Debe incluir el botón de acción rápido en el subnav');

  // Sección "Get the highlights" (carrusel de tarjetas destacadas)
  assert.ok(html.includes('highlights-carousel'), 'Debe incluir el carrusel de momentos destacados');
  assert.ok(html.includes('carousel-dot'), 'Debe incluir los puntos de paginación del carrusel');

  // Sección "Take a closer look" (explorador con tabs interactivos tipo píldora)
  assert.ok(html.includes('closer-look-tabs'), 'Debe incluir los botones de píldora interactivos');
  assert.ok(html.includes('data-tab="countdown"'), 'Debe incluir tab de cuenta regresiva');
  assert.ok(html.includes('data-tab="location"'), 'Debe incluir tab de ubicación');
  assert.ok(html.includes('data-tab="dresscode"'), 'Debe incluir tab de dress code');

  // Sección editorial de alto impacto y estadísticas Apple
  assert.ok(html.includes('apple-stats-grid'), 'Debe incluir la cuadrícula de estadísticas con tipografía gigante');

  // Formulario RSVP de alta gama
  assert.ok(html.includes('id="rsvp-form"'), 'Debe incluir el formulario RSVP');
});

test('js/main.js implementa interactividad de carrusel, tabs y swatches estilo Apple', () => {
  const mainJs = fs.readFileSync(path.join(rootDir, 'js/main.js'), 'utf8');

  assert.ok(mainJs.includes('highlights-carousel'), 'Debe vincular el carrusel de destacados');
  assert.ok(mainJs.includes('carousel-dot'), 'Debe manejar los puntos de paginación del carrusel');
  assert.ok(mainJs.includes('tab-chip'), 'Debe manejar los chips interactivos de pestañas');
  assert.ok(mainJs.includes('tab-panel'), 'Debe alternar los paneles de contenido');
  assert.ok(mainJs.includes('swatch-btn'), 'Debe permitir seleccionar muestras de color de vestido');
  assert.ok(mainJs.includes('apple-subnav'), 'Debe reaccionar al scroll en la subnav');
});
