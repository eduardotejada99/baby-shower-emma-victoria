/**
 * ORQUESTADOR PRINCIPAL DE INTERACCIONES Y EXPERIENCIA DE SCROLL
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Iniciar Motor de Partículas en Canvas
  let particleEngine = null;
  if (window.ParticleEngine) {
    particleEngine = new window.ParticleEngine('canvas-particles');
    particleEngine.init();
    window.particleEngine = particleEngine;
  }

  // 2. Iniciar Sintetizador de Audio Ambiental
  let musicSynth = null;
  const audioBtn = document.getElementById('btn-audio-toggle');
  if (audioBtn && window.MusicBoxSynthesizer) {
    musicSynth = new window.MusicBoxSynthesizer();

    audioBtn.addEventListener('click', () => {
      const isPlaying = musicSynth.toggle();
      if (isPlaying) {
        audioBtn.classList.add('is-playing');
        audioBtn.setAttribute('aria-label', 'Silenciar música');
        audioBtn.title = 'Silenciar música';
        if (particleEngine) {
          const rect = audioBtn.getBoundingClientRect();
          particleEngine.createSparkleBurst(rect.left + 24, rect.top + 24, 15);
        }
      } else {
        audioBtn.classList.remove('is-playing');
        audioBtn.setAttribute('aria-label', 'Reproducir melodía de ensueño');
        audioBtn.title = 'Reproducir música';
      }
    });
  }

  // 3. Interacción del Sello de Cera
  const waxSeal = document.getElementById('wax-seal');
  const storyCard = document.getElementById('story-card');

  function openSeal() {
    if (!waxSeal || waxSeal.classList.contains('is-broken')) return;
    waxSeal.classList.add('is-broken');

    if (particleEngine) {
      const rect = waxSeal.getBoundingClientRect();
      particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
    }

    if (storyCard) {
      storyCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', openSeal);
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSeal();
      }
    });
  }

  // Romper sello automáticamente con el primer desplazamiento de scroll
  let sealBrokenByScroll = false;
  window.addEventListener('scroll', () => {
    if (!sealBrokenByScroll && window.scrollY > 40) {
      sealBrokenByScroll = true;
      if (waxSeal && !waxSeal.classList.contains('is-broken')) {
        waxSeal.classList.add('is-broken');
        if (particleEngine) {
          const rect = waxSeal.getBoundingClientRect();
          particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
        }
      }
    }
  }, { passive: true });

  // 4. Desbloqueo progresivo por Scroll con IntersectionObserver
  const scrollElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');

          // Efecto de destello sutil al revelarse
          if (particleEngine) {
            const rect = entry.target.getBoundingClientRect();
            particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + 60, 16);
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));
  } else {
    // Respaldo para navegadores antiguos
    scrollElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 5. Paleta de Colores de Vestimenta (Dress Code) Interactiva
  const swatches = document.querySelectorAll('.color-swatch');
  const colorNameEl = document.getElementById('selected-color-name');
  const colorDescEl = document.getElementById('selected-color-desc');

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-checked', 'false');
      });

      swatch.classList.add('active');
      swatch.setAttribute('aria-checked', 'true');

      const colorName = swatch.getAttribute('data-color');
      const colorDesc = swatch.getAttribute('data-desc');

      if (colorNameEl) colorNameEl.textContent = colorName;
      if (colorDescEl) colorDescEl.textContent = colorDesc;

      if (particleEngine) {
        const rect = swatch.getBoundingClientRect();
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
      }
    });
  });

  // 6. Manejo del Formulario de Asistencia (RSVP)
  const rsvpForm = document.getElementById('rsvp-form');
  const nameInput = document.getElementById('guest-name');
  const errorName = document.getElementById('error-name');
  const passesGroup = document.getElementById('group-passes');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');

  // Alternar campo de pases si asiste o no
  attendingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (passesGroup) {
        passesGroup.style.display = radio.value === 'no' ? 'none' : 'block';
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = nameInput ? nameInput.value.trim() : '';
      if (!guestName) {
        if (errorName) errorName.textContent = 'Por favor, indícanos tu nombre o el de tu familia.';
        if (nameInput) nameInput.focus();
        return;
      }

      if (errorName) errorName.textContent = '';

      const attending = document.querySelector('input[name="attending"]:checked')?.value || 'si';
      const passes = document.getElementById('guest-passes')?.value || '1';
      const wishes = document.getElementById('guest-wishes')?.value || '';

      // Celebración de destellos en el botón y centro de pantalla
      if (particleEngine) {
        const submitBtn = document.getElementById('btn-submit-rsvp');
        const rect = submitBtn ? submitBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
        particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
      }

      // Generar y abrir enlace de WhatsApp
      if (window.Utils) {
        const waUrl = window.Utils.formatWhatsAppRsvpMessage({
          phone: '51999999999', // Número configurable de los anfitriones
          guestName,
          attending,
          passes,
          wishes
        });

        setTimeout(() => {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        }, 350);
      }
    });
  }
});
