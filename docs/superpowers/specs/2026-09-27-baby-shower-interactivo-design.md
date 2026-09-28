# Especificación de Diseño: Baby Shower Interactivo "Cuento de Hadas & Ensueño"

**Fecha:** 2026-09-27  
**Estado:** Aprobado por el usuario  
**Ubicación del Proyecto:** `C:\Users\ETEJADA\.gemini\antigravity-ide\scratch\baby-shower-interactivo`

---

## 1. Visión General y Propósito

El objetivo del proyecto es crear una página web interactiva e inmersiva tipo invitación/experiencia digital para el Baby Shower de una niña (**Emma Victoria**), con temática de **Cuento de Hadas & Ensueño**.

La experiencia funciona como un libro de cuentos ilustrado que se devela progresivamente conforme el usuario se desplaza (scroll), ofreciendo micro-animaciones delicadas, destellos dorados, partículas en suspensión y módulos interactivos clave (cuenta regresiva, mapa, dress code interactivo y confirmación RSVP vía WhatsApp).

---

## 2. Dirección Artística y Sistema de Diseño

### 2.1 Paleta Cromática
- **Fondo Base (Marfil & Nube):** `#FAF8F6` y `#FFFFFF`
- **Rosa Empolvado Principal:** `#F4E7EB` y `#E8BAC9`
- **Rosa Vintage / Mauve:** `#C98B9E` y `#8B5A6A`
- **Acentos Dorados (Oro Champaña):** `#D4AF37`, `#E5C378` y degradados metálicos dorados
- **Texto Principal:** `#34272F` (Ciruela oscuro / grafito cálido de alto contraste)
- **Texto Secundario:** `#6E5865`

### 2.2 Tipografía
- **Titulares principales y nombre:** `Playfair Display` (Google Fonts, serif editorial de alta gama)
- **Caligrafía y acentos decorativos:** `Great Vibes` (Google Fonts, cursiva de ensueño)
- **Cuerpo de texto, datos y botones:** `Plus Jakarta Sans` (Google Fonts, sans-serif limpia y legible)

### 2.3 Estética Visual
- **Glassmorphism:** Tarjetas con `backdrop-filter: blur(16px)`, bordes de `1px solid rgba(255, 255, 255, 0.6)` y sombras multicapa difusas.
- **Partículas de Ensueño:** Lienzo `<canvas>` superpuesto con mariposas doradas, destellos estelares y motas de luz que se mueven con física suave a 60 FPS.
- **Acentos vectoriales:** Sello de cera dorado con relieve 3D, coronas florales en SVG puro e ilustraciones botánicas libres de pixelado.

---

## 3. Estructura Narrativa y Capítulos del Scroll

### Capítulo 0: La Portada y el Sello de Cera (Hero)
- **Visual:** Cielo en acuarela rosa pastel y marfil, partículas flotantes y un sobre de gala central cerrado con un sello de cera dorado animado con el monograma "E".
- **Indicador:** Texto caligráfico *"Había una vez un sueño a punto de florecer..."* y botón flotante con rebote sutil *"Desliza para abrir la historia"*.
- **Transición:** Al iniciar el scroll, el sello se rompe con un destello radiante y el sobre se despliega.

### Capítulo 1: La Revelación (Nombre y Dedicatoria)
- **Visual:** Página interior de papel pergamino aperlado.
- **Contenido:**
  - Título caligráfico: *"Celebramos la llegada de"*
  - Nombre en gran escala: **«Emma Victoria»**
  - Dedicatoria de los padres: *"Un pedacito de cielo que viene a colmar nuestras vidas de luz, amor y bendición."*
  - Significado del nombre en tarjeta flotante: *"Emma: Universal y fuerte | Victoria: Victoriosa y llena de gracia"*.

### Capítulo 2: El Reloj de la Ilusión (Fecha & Cuenta Regresiva)
- **Visual:** Cajas de tiempo doradas con efecto de brillo metálico.
- **Funcionalidad:**
  - Contador en vivo: Días, Horas, Minutos y Segundos hasta la fecha fijada (Sábado, 24 de Octubre de 2026, 4:00 PM).
  - Botón interactivo: *"Añadir a Google Calendar"* con enlace `https://calendar.google.com/calendar/render?action=TEMPLATE...` preconfigurado con título, descripción y lugar.

### Capítulo 3: El Lugar del Encuentro (Ubicación & Mapa)
- **Visual:** Tarjeta de vidrio con ícono de carruaje/palacio botánico.
- **Contenido:**
  - Nombre del recinto: *"Jardín de Ensueño Las Rosas"*
  - Dirección: *"Av. Los Jazmines 450, Valle Hermoso"*
  - Acciones táctiles:
    - Botón primario: *"Abrir en Google Maps"* (enlace a navegación GPS).
    - Botón secundario: *"Abrir en Waze"*.

### Capítulo 4: El Código de Ensueño (Dress Code Interactivo)
- **Visual:** *"Elegante Casual en Paleta Pastel"*.
- **Interactividad:** Muestrario de 4 círculos de color táctiles con tooltip animado:
  1. Rosa Empolvado (`#F0D0D9`)
  2. Crema Vainilla (`#FBF6EB`)
  3. Lavanda Nube (`#E8DFF5`)
  4. Oro Champaña (`#E6CE94`)
- Al hacer clic en un color, la tarjeta muestra una vista previa armoniosa y una recomendación de estilo.

### Capítulo 5: Asistencia y Bendiciones (RSVP Inteligente)
- **Visual:** Tarjeta final con mariposas doradas y confeti sutil.
- **Formulario:**
  - Campo: Nombre del invitado o familia.
  - Selector: Confirmación ("¡Sí, allí estaré!", "No podré asistir pero les envío mi amor").
  - Selector: Número de pases / acompañantes (1 a 4).
  - Campo opcional: Un mensaje o deseo para Emma Victoria.
- **Acción:**
  - Al pulsar *"Confirmar Asistencia"*, se valida el formulario, se dispara una lluvia de destellos dorados y confeti en pantalla, y se genera automáticamente una URL de WhatsApp (`https://wa.me/51999999999?text=...`) con el mensaje perfectamente formateado y legible para enviar a los anfitriones.

---

## 4. Arquitectura de Archivos

```
baby-shower-interactivo/
├── index.html                   # Documento principal HTML5 semántico
├── css/
│   └── style.css                # Estilos, tokens CSS, glassmorphism, responsive
├── js/
│   ├── particles.js             # Motor Canvas de destellos y mariposas flotantes
│   ├── countdown.js             # Lógica de cuenta regresiva en tiempo real
│   ├── audio.js                 # Sintetizador ambiental de caja de música/arpa Web Audio
│   └── main.js                  # IntersectionObserver, validación RSVP, WhatsApp y UI
└── assets/
    ├── icons/                   # SVGs optimizados (sello, calendario, mapa, música)
    └── og-cover.svg             # Gráfico OpenGraph para vista previa al compartir
```

---

## 5. Requerimientos No Funcionales

1. **Rendimiento:** 60 FPS estables en dispositivos móviles y de escritorio. Cero dependencias pesadas de terceros (Zero external npm libraries at runtime).
2. **Compatibilidad:** 100% responsive (Mobile First: desde 360px de ancho hasta pantallas 4K).
3. **Accesibilidad (a11y):** Contraste de color verificado según WCAG AA, soporte de teclado en elementos interactivos y soporte de `prefers-reduced-motion` para usuarios que prefieran menos movimiento.
4. **Offline / Standalone:** Funciona de inmediato al abrirse en cualquier navegador web moderno (Chrome, Safari iOS, Edge, Firefox).
