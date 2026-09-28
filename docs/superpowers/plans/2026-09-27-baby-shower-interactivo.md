# Baby Shower Interactivo "Cuento de Hadas & Ensueño" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una página web interactiva e inmersiva para el baby shower de una niña ("Emma Victoria") con temática de Cuento de Hadas, que devela progresivamente hitos y animaciones al hacer scroll (portada con sello de cera, revelación del nombre, cuenta regresiva, mapa, dress code interactivo y confirmación RSVP vía WhatsApp).

**Architecture:** Aplicación web moderna standalone en HTML5 semántico, CSS3 con tokens HSL, Glassmorphism y animaciones aceleradas por GPU, junto con JavaScript modular (Canvas 2D para partículas y mariposas flotantes, IntersectionObserver para desbloqueo por scroll, sintetizador Web Audio para música de caja de notas y generador de enlaces de WhatsApp/Calendario).

**Tech Stack:** HTML5 semántico, CSS3 Vanilla (Custom Properties, Flexbox, Grid, Glassmorphism, Keyframes), Vanilla JavaScript (ES6+), Canvas 2D API, Web Audio API, Google Fonts (Playfair Display, Great Vibes, Plus Jakarta Sans), Node.js (test runner nativo `node:test`).

**Spec:** `docs/superpowers/specs/2026-09-27-baby-shower-interactivo-design.md`

## Global Constraints

- **Ruta de proyecto:** `C:\Users\ETEJADA\.gemini\antigravity-ide\scratch\baby-shower-interactivo`
- **Cero dependencias externas en runtime:** Todo el cliente se ejecuta de forma nativa en cualquier navegador web moderno.
- **Paleta de colores exacta:**
  - Base: Marfil (`#FAF8F6`) y Blanco Puro (`#FFFFFF`)
  - Rosa Empolvado: `#F4E7EB` y `#E8BAC9`
  - Rosa Vintage / Mauve: `#C98B9E` y `#8B5A6A`
  - Oro Champaña: `#D4AF37`, `#E5C378`
  - Texto: Ciruela Oscuro / Grafito Cálido (`#34272F`) y Secundario (`#6E5865`)
- **Tipografías:** `Playfair Display` (serif títulos), `Great Vibes` (cursiva decorativa), `Plus Jakarta Sans` (cuerpo de lectura).
- **Responsive:** Mobile-first impecable desde 360px hasta 4K.
- **Soporte de accesibilidad:** Respeto estricto a `prefers-reduced-motion` y contraste legible.

---

### Task 1: Estructura HTML Semántica y Assets Vectoriales SVG

**Files:**
- Create: `assets/icons/seal.svg`
- Create: `assets/icons/wreath.svg`
- Create: `assets/icons/butterfly.svg`
- Create: `assets/icons/calendar.svg`
- Create: `assets/icons/map-pin.svg`
- Create: `assets/icons/music.svg`
- Create: `index.html`
- Create: `tests/structure.test.js`

**Interfaces:**
- Consumes: Ninguna (primer componente).
- Produces: Elementos DOM con IDs semánticos: `#canvas-particles`, `#hero-section`, `#wax-seal`, `#story-card`, `#baby-name`, `#countdown-timer`, `#location-card`, `#dresscode-section`, `#rsvp-form`, `#btn-audio-toggle`.

- [ ] **Step 1: Escribir el test de estructura y assets**

Crear `tests/structure.test.js`:
```javascript
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
```

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `node --test tests/structure.test.js`  
Expected: FAIL con "El archivo assets/icons/seal.svg debe existir"

- [ ] **Step 3: Crear los SVGs e index.html con estructura semántica**

Crear `assets/icons/seal.svg` (sello de cera dorado con relieve y monograma "E"):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <defs>
    <radialGradient id="gold-seal" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FFEAA7"/>
      <stop offset="35%" stop-color="#DFB76C"/>
      <stop offset="70%" stop-color="#B8860B"/>
      <stop offset="100%" stop-color="#7A5600"/>
    </radialGradient>
    <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#553311" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path d="M60 5C68 5 72 10 79 12C86 14 92 12 98 17C104 22 105 29 110 36C114 42 118 46 118 53C119 61 114 66 112 73C110 80 113 87 109 93C104 99 98 100 92 104C86 109 81 114 74 115C67 116 62 111 54 112C46 112 41 117 34 115C27 113 23 107 17 103C12 99 5 97 3 90C1 83 6 78 5 71C4 64 -1 59 0 52C2 45 7 42 10 35C14 28 13 22 19 17C24 12 31 14 38 12C45 9 52 5 60 5Z" fill="url(#gold-seal)" filter="url(#seal-shadow)"/>
  <circle cx="60" cy="60" r="40" stroke="#FFEAA7" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.8"/>
  <text x="60" y="70" font-family="'Playfair Display', serif" font-size="34" font-weight="bold" fill="#5A3A00" text-anchor="middle" filter="drop-shadow(0 1px 1px #FFEAA7)">E</text>
</svg>
```

Crear `assets/icons/wreath.svg` (corona floral botánica):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
  <path d="M10 30 Q 55 10, 100 30 T 190 30" stroke="#DFBAC6" stroke-width="1.8" fill="none"/>
  <circle cx="100" cy="30" r="4" fill="#DFB76C"/>
  <circle cx="85" cy="24" r="3" fill="#E8BAC9"/>
  <circle cx="115" cy="24" r="3" fill="#E8BAC9"/>
  <path d="M85 24 Q 75 15, 65 24 Q 75 30, 85 24" fill="#C98B9E" opacity="0.7"/>
  <path d="M115 24 Q 125 15, 135 24 Q 125 30, 115 24" fill="#C98B9E" opacity="0.7"/>
  <path d="M45 27 Q 35 18, 25 28 Q 38 33, 45 27" fill="#DFBAC6" opacity="0.8"/>
  <path d="M155 27 Q 165 18, 175 28 Q 162 33, 155 27" fill="#DFBAC6" opacity="0.8"/>
</svg>
```

Crear `assets/icons/butterfly.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 50" fill="none">
  <path d="M30 25 C20 5, 0 10, 5 30 C8 42, 25 35, 30 25 Z" fill="#DFB76C" opacity="0.85"/>
  <path d="M30 25 C40 5, 60 10, 55 30 C52 42, 35 35, 30 25 Z" fill="#DFB76C" opacity="0.85"/>
  <path d="M30 25 C22 28, 12 36, 18 45 C25 50, 28 35, 30 25 Z" fill="#E8BAC9" opacity="0.9"/>
  <path d="M30 25 C38 28, 48 36, 42 45 C35 50, 32 35, 30 25 Z" fill="#E8BAC9" opacity="0.9"/>
  <ellipse cx="30" cy="26" rx="2" ry="12" fill="#8B5A6A"/>
</svg>
```

Crear `assets/icons/calendar.svg`, `assets/icons/map-pin.svg` y `assets/icons/music.svg`.
Crear `index.html` con todos los capítulos, metadatos OpenGraph, enlaces a Google Fonts, audio toggle y contenedor de partículas.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `node --test tests/structure.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/ index.html tests/structure.test.js
git commit -m "feat: add semantic html structure and vector assets"
```

---

### Task 2: Sistema de Diseño CSS, Glassmorphism y Animaciones de Ensueño

**Files:**
- Create: `css/style.css`
- Create: `tests/css.test.js`

**Interfaces:**
- Consumes: Clases y elementos definidos en `index.html` (`.glass-card`, `.scroll-reveal`, `.chapter`, `#wax-seal`, `#dresscode-section`, etc.).
- Produces: Estilos visuales completos, variables CSS reutilizables, animaciones de apertura de sobre, brillo dorado y adaptación responsiva móvil/escritorio.

- [ ] **Step 1: Escribir el test de validación de CSS**

Crear `tests/css.test.js`:
```javascript
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
```

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `node --test tests/css.test.js`  
Expected: FAIL porque `css/style.css` no existe aún.

- [ ] **Step 3: Implementar `css/style.css` completo**

Implementar todas las variables cromáticas, la tipografía importada de Google Fonts, los efectos de sobre y sello de cera, las tarjetas con efecto vidrio esmerilado (`.glass-card`), las animaciones de revelación (`.is-revealed`), la cuadrícula de cuenta regresiva, los selectores de muestras de color del dress code, el formulario RSVP y el reproductor de audio flotante.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `node --test tests/css.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add css/style.css tests/css.test.js
git commit -m "feat: implement css design system with glassmorphism and animations"
```

---

### Task 3: Motor de Partículas en Canvas 2D (js/particles.js)

**Files:**
- Create: `js/particles.js`
- Create: `tests/particles.test.js`

**Interfaces:**
- Consumes: `<canvas id="canvas-particles"></canvas>` en el DOM.
- Produces: Clase `ParticleEngine` con métodos `init()`, `start()`, `pause()`, `createSparkle(x, y)`. Maneja destellos dorados y mariposas flotantes en tiempo real a 60 FPS con pausa automática en pestañas ocultas (`document.visibilityState`).

- [ ] **Step 1: Escribir el test para el motor de partículas**

Crear `tests/particles.test.js`:
```javascript
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
```

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `node --test tests/particles.test.js`  
Expected: FAIL con "no such file or directory"

- [ ] **Step 3: Implementar `js/particles.js`**

Implementar la clase `ParticleEngine`:
- Generación de dos tipos de partículas: `Mote` (destellos dorados circulares con oscilación de opacidad) y `Butterfly` (mariposas vectoriales con aleteo sinusoidal `Math.sin(time)` y trayectoria flotante suave).
- Soporte para clic/toque que dispara ráfaga de destellos `createSparkleBurst(x, y)`.
- Manejo de resize con debounce y escala para pantallas retina (`window.devicePixelRatio`).

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `node --test tests/particles.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add js/particles.js tests/particles.test.js
git commit -m "feat: add canvas 2d particle and floating butterfly engine"
```

---

### Task 4: Lógica de Cuenta Regresiva, Calendario y RSVP WhatsApp (js/countdown.js & js/utils.js)

**Files:**
- Create: `js/utils.js`
- Create: `js/countdown.js`
- Create: `tests/logic.test.js`

**Interfaces:**
- Consumes: Fecha objetivo del evento (`2026-10-24T16:00:00-05:00`), datos del formulario RSVP.
- Produces:
  - `calculateTimeRemaining(targetDate, currentDate)`: `{ days, hours, minutes, seconds, isExpired }`.
  - `generateGoogleCalendarUrl(eventDetails)`: URL string para agendar en Google Calendar.
  - `formatWhatsAppRsvpMessage(formData)`: URL string con mensaje codificado (`wa.me/?text=...`).
  - `initCountdown(targetDateStr, containerElement)`: Inicializador en vivo.

- [ ] **Step 1: Escribir los tests unitarios para la lógica**

Crear `tests/logic.test.js`:
```javascript
const { test } = require('node:test');
const assert = require('node:assert');
const { calculateTimeRemaining, generateGoogleCalendarUrl, formatWhatsAppRsvpMessage } = require('../js/utils.js');

test('calculateTimeRemaining calcula correctamente la diferencia de tiempo', () => {
  const now = new Date('2026-10-01T10:00:00Z');
  const target = new Date('2026-10-03T14:30:15Z'); // 2 días, 4 horas, 30 minutos, 15 segundos

  const result = calculateTimeRemaining(target, now);
  assert.strictEqual(result.days, 2);
  assert.strictEqual(result.hours, 4);
  assert.strictEqual(result.minutes, 30);
  assert.strictEqual(result.seconds, 15);
  assert.strictEqual(result.isExpired, false);
});

test('calculateTimeRemaining marca isExpired true si la fecha ya pasó', () => {
  const now = new Date('2026-11-01T00:00:00Z');
  const target = new Date('2026-10-24T16:00:00Z');

  const result = calculateTimeRemaining(target, now);
  assert.strictEqual(result.isExpired, true);
  assert.strictEqual(result.days, 0);
});

test('generateGoogleCalendarUrl genera el enlace correcto con parámetros codificados', () => {
  const url = generateGoogleCalendarUrl({
    title: 'Baby Shower de Emma Victoria',
    details: 'Acompáñanos a celebrar la llegada de nuestra pequeña princesa',
    location: 'Jardín de Ensueño Las Rosas',
    startIso: '20261024T210000Z',
    endIso: '20261025T010000Z'
  });

  assert.ok(url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'));
  assert.ok(url.includes('Emma+Victoria') || url.includes('Emma%20Victoria'));
});

test('formatWhatsAppRsvpMessage genera el mensaje formateado para enviar a WhatsApp', () => {
  const link = formatWhatsAppRsvpMessage({
    phone: '51999999999',
    guestName: 'Familia Perez',
    attending: 'si',
    passes: 2,
    wishes: '¡Muchas felicidades y bendiciones!'
  });

  assert.ok(link.startsWith('https://wa.me/51999999999?text='));
  const decoded = decodeURIComponent(link);
  assert.ok(decoded.includes('Familia Perez'));
  assert.ok(decoded.includes('Confirmación de Asistencia'));
  assert.ok(decoded.includes('Emma Victoria'));
  assert.ok(decoded.includes('Muchas felicidades y bendiciones'));
});
```

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `node --test tests/logic.test.js`  
Expected: FAIL porque `js/utils.js` no existe.

- [ ] **Step 3: Implementar `js/utils.js` y `js/countdown.js`**

Implementar funciones puras en `js/utils.js` y la integración con el DOM en `js/countdown.js`.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `node --test tests/logic.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add js/utils.js js/countdown.js tests/logic.test.js
git commit -m "feat: implement countdown logic, calendar export and rsvp whatsapp generator"
```

---

### Task 5: Sintetizador de Audio Ambiental, IntersectionObserver y Flujo Principal (js/audio.js & js/main.js)

**Files:**
- Create: `js/audio.js`
- Create: `js/main.js`
- Create: `tests/integration.test.js`

**Interfaces:**
- Consumes: `ParticleEngine` de `js/particles.js`, funciones de `js/utils.js`, elementos DOM de `index.html`.
- Produces: Controlador de audio con Web Audio API (genera notas suaves de caja musical / carillón de cuna sin requerir archivos MP3 externos), `IntersectionObserver` que activa `.is-revealed` en cada capítulo al scrollear, interactividad de selección de color de vestimenta y envío del formulario RSVP con ráfaga de confeti.

- [ ] **Step 1: Escribir el test de integración y sintaxis de scripts**

Crear `tests/integration.test.js`:
```javascript
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
```

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `node --test tests/integration.test.js`  
Expected: FAIL porque los archivos aún no existen.

- [ ] **Step 3: Implementar `js/audio.js` y `js/main.js`**

Implementar:
- `MusicBoxSynthesizer`: Arpegios suaves y delicados en escala pentatónica mayor con envolvente exponencial (`exponentialRampToValueAtTime`) que imita el sonido de una cajita musical clásica de bebé.
- `main.js`:
  - Activación progresiva de capítulos con umbral de visibilidad (`threshold: 0.2`).
  - Animación especial para `#wax-seal`: al scrollear se rompe y desvanece con destello.
  - Selector de muestras de Dress Code que actualiza la descripción y activa el brillo en el color elegido.
  - Manejador de RSVP con validación de campos, efecto de fuegos de artificio/mariposas doradas en el canvas y redirección a WhatsApp en nueva pestaña.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `node --test tests/integration.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add js/audio.js js/main.js tests/integration.test.js
git commit -m "feat: implement web audio music box synthesizer and scroll orchestration"
```

---

### Task 6: Verificación Integral en Navegador y Servidor de Demostración Local

**Files:**
- Verify: Todas las pruebas unitarias y de integración.
- Verify: Servidor HTTP local con previsualización en vivo.

- [ ] **Step 1: Ejecutar la suite completa de pruebas unitarias**

Run: `node --test tests/*.test.js`  
Expected: Todos los tests deben pasar con 100% de éxito.

- [ ] **Step 2: Iniciar servidor local estático**

Iniciar un servidor local simple en el puerto 3000 o 8080 para comprobar el renderizado completo en el navegador.

- [ ] **Step 3: Validar interactividad completa**

- Verificar animación inicial del sello y apertura al scroll.
- Verificar conteo regresivo dinámico.
- Probar selección de colores en el Dress Code.
- Probar envío del formulario RSVP y mensaje generado.
- Probar reproducción y pausa del audio ambiental.

- [ ] **Step 4: Commit final del prototipo verificado**

```bash
git add .
git commit -m "chore: complete verified interactive baby shower test project"
```
