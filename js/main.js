/**
 * ORQUESTADOR PRINCIPAL: EXPERIENCIA APPLE LUXURY CREAM
 * Baby Shower de Emma Victoria
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Iniciar Motor de Partículas en Canvas de Fondo
  let particleEngine = null;
  if (window.ParticleEngine) {
    particleEngine = new window.ParticleEngine('canvas-particles');
    particleEngine.init();
    window.particleEngine = particleEngine;
  }

  // 2. Iniciar Sintetizador de Audio Ambiental y Efectos Hápticos
  let musicSynth = null;
  const audioBtn = document.getElementById('btn-audio-toggle');
  if (window.MusicBoxSynthesizer) {
    musicSynth = new window.MusicBoxSynthesizer();
    window.musicSynth = musicSynth;
  }

  if (audioBtn && musicSynth) {
    audioBtn.addEventListener('click', () => {
      const isPlaying = musicSynth.toggle();
      if (isPlaying) {
        audioBtn.classList.add('is-playing');
        audioBtn.setAttribute('aria-label', 'Silenciar música');
        audioBtn.title = 'Silenciar música';
        if (particleEngine) {
          const rect = audioBtn.getBoundingClientRect();
          particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
        }
      } else {
        audioBtn.classList.remove('is-playing');
        audioBtn.setAttribute('aria-label', 'Reproducir melodía de ensueño');
        audioBtn.title = 'Reproducir música';
      }
    });
  }

  // 3. Floating Island Subnav: Sombra y elevación dinámica al hacer scroll
  const appleSubnav = document.getElementById('apple-subnav');
  window.addEventListener('scroll', () => {
    if (appleSubnav) {
      if (window.scrollY > 40) {
        appleSubnav.classList.add('is-scrolled');
      } else {
        appleSubnav.classList.remove('is-scrolled');
      }
    }
  }, { passive: true });

  // 4. Emblema Central Interactivo: Latido Fetal y Campanilla
  const waxSeal = document.getElementById('wax-seal');
  const heartbeatHint = document.getElementById('heartbeat-hint');
  const highlightsSection = document.querySelector('.highlights-section');

  function triggerHeartbeatInteraction() {
    if (!waxSeal) return;

    // Reproducir latido fetal y campanilla etérea
    if (musicSynth) {
      musicSynth.playHeartbeat();
      setTimeout(() => musicSynth.playChime(), 250);
    }

    // Efecto visual de ondas y partículas
    if (particleEngine) {
      const rect = waxSeal.getBoundingClientRect();
      particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
    }

    if (heartbeatHint) {
      heartbeatHint.innerHTML = '<span class="hint-dot" style="background:#4CD964;"></span><span>¡Latido recibido con amor!</span>';
    }

    // Desplazamiento suave hacia lo más destacado después de la interacción
    setTimeout(() => {
      if (highlightsSection) {
        highlightsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', triggerHeartbeatInteraction);
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerHeartbeatInteraction();
      }
    });
  }

  // 5. Carrusel Horizontal de Momentos Destacados con Autoplay y Control Play/Pause
  const carousel = document.getElementById('highlights-carousel');
  const dots = document.querySelectorAll('.carousel-dot');
  const cards = document.querySelectorAll('.highlight-card');
  const playPauseBtn = document.getElementById('btn-carousel-autoplay');
  const playPauseIcon = document.getElementById('play-pause-icon');

  let autoplayTimer = null;
  let isAutoplayActive = true;
  let currentCardIndex = 0;

  function scrollToCard(index) {
    if (cards[index] && carousel) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      currentCardIndex = index;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isAutoplayActive || !carousel) return;
      currentCardIndex = (currentCardIndex + 1) % cards.length;
      scrollToCard(currentCardIndex);
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (carousel && dots.length > 0) {
    // Iniciar autoplay sutil
    startAutoplay();

    // Pausar al interactuar táctilmente
    carousel.addEventListener('touchstart', () => stopAutoplay(), { passive: true });

    // Alternar con botón Play/Pause (exacto al video de Apple en 00:03)
    if (playPauseBtn && playPauseIcon) {
      playPauseBtn.addEventListener('click', () => {
        isAutoplayActive = !isAutoplayActive;
        if (isAutoplayActive) {
          playPauseIcon.textContent = '⏸';
          playPauseBtn.setAttribute('aria-label', 'Pausar carrusel');
          startAutoplay();
        } else {
          playPauseIcon.textContent = '▶';
          playPauseBtn.setAttribute('aria-label', 'Reanudar carrusel');
          stopAutoplay();
        }
      });
    }

    // Clic en los puntos de paginación
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoplay();
        scrollToCard(index);
        if (musicSynth) musicSynth.playChime();
      });
    });

    // Sincronización del punto activo durante el scroll
    let scrollTimeout = null;
    carousel.addEventListener('scroll', () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(() => {
        const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
        let closestIndex = 0;
        let minDiff = Infinity;

        cards.forEach((card, i) => {
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const diff = Math.abs(carouselCenter - cardCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        });

        currentCardIndex = closestIndex;
        dots.forEach((dot, i) => {
          if (i === closestIndex) {
            dot.classList.add('is-active');
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.classList.remove('is-active');
            dot.removeAttribute('aria-current');
          }
        });
      });
    }, { passive: true });
  }

  // 6. Selector de Pestañas Interactivas ("Conoce cada detalle")
  const tabChips = document.querySelectorAll('.tab-chip');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const targetTab = chip.getAttribute('data-tab');
      if (!targetTab) return;

      // Sonido táctil etéreo
      if (musicSynth) musicSynth.playChime();

      // Actualizar chips
      tabChips.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');

      // Actualizar paneles
      tabPanels.forEach(panel => {
        panel.classList.remove('is-active');
      });

      const activePanel = document.getElementById(`tab-panel-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('is-active');
      }

      // Destello en el chip
      if (particleEngine) {
        const rect = chip.getBoundingClientRect();
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
      }
    });
  });

  // 7. Muestras de Vestimenta Interactivas (Dress Code Swatches)
  const swatchButtons = document.querySelectorAll('.swatch-btn');
  const swatchNameEl = document.getElementById('active-swatch-name');
  const swatchDescEl = document.getElementById('active-swatch-desc');
  const swatchBox = document.getElementById('swatch-interactive-box');

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (musicSynth) musicSynth.playChime();

      swatchButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const colorName = btn.getAttribute('data-color') || '';
      const colorDesc = btn.getAttribute('data-desc') || '';
      const glowColor = btn.getAttribute('data-glow') || 'rgba(244, 211, 220, 0.4)';

      if (swatchNameEl) swatchNameEl.textContent = colorName;
      if (swatchDescEl) swatchDescEl.textContent = colorDesc;

      // Transformar aura de la caja
      if (swatchBox) {
        swatchBox.style.boxShadow = `0 8px 24px ${glowColor}`;
      }

      if (particleEngine) {
        const rect = btn.getBoundingClientRect();
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
      }
    });
  });

  // 8. IntersectionObserver para Revelaciones Progresivas Estilo Apple
  const sectionsToReveal = document.querySelectorAll('.apple-section, .editorial-section, .apple-stats-grid');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    sectionsToReveal.forEach(el => sectionObserver.observe(el));
  } else {
    sectionsToReveal.forEach(el => el.classList.add('is-revealed'));
  }

  // 9. Manejo del Formulario de Asistencia (RSVP)
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

      // Tocar campanilla festiva
      if (musicSynth) musicSynth.playChime();

      // Celebración de destellos en el botón y centro de pantalla
      if (particleEngine) {
        const submitBtn = document.getElementById('btn-submit-rsvp');
        const rect = submitBtn ? submitBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
        particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
      }

      // Generar y abrir enlace de WhatsApp
      if (window.Utils) {
        const waUrl = window.Utils.formatWhatsAppRsvpMessage({
          phone: '51999999999', // Configurable
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
