/**
 * ORQUESTADOR PRINCIPAL: EXPERIENCIA CANVA BABY GIRL INTERACTIVA
 * Baby Shower de Emma Victoria
 * 
 * Orquesta:
 * 1. Motor de partículas y destellos dorados/rosados
 * 2. Sintetizador de caja de música de cuna (Web Audio API)
 * 3. Despliegue elástico 3D al hacer scroll (Unfold on scroll)
 * 4. Móvil musical interactivo con animación y sonidos ("Dale play")
 * 5. Sello de cera interactivo con latido fetal y transición suave
 * 6. Tarjeta de fecha de cuna y sincronización de calendario Google
 * 7. Modal de Pase Digital VIP (Acceso Reservado) con llave oscilante
 * 8. Panel desplegable de sugerencia de regalos / sobres
 * 9. Selector interactivo de Dress Code (muestras de color pastel)
 * 10. Formulario RSVP inteligente conectado con WhatsApp (Mamá / Papá)
 * 11. Compatibilidad total con la suite de pruebas unitarias
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Iniciar Motor de Partículas en Canvas de Fondo
  let particleEngine = null;
  if (window.ParticleEngine) {
    particleEngine = new window.ParticleEngine('canvas-particles');
    particleEngine.init();
    window.particleEngine = particleEngine;
  }

  // 2. Iniciar Sintetizador de Audio Ambiental y Melodía de Cuna
  let musicSynth = null;
  const audioBtn = document.getElementById('btn-audio-toggle');
  const babyMobile = document.getElementById('interactive-pocket-watch');

  if (window.MusicBoxSynthesizer) {
    musicSynth = new window.MusicBoxSynthesizer();
    window.musicSynth = musicSynth;
  }

  function toggleMusic(sourceElement) {
    if (!musicSynth) return;
    const isPlaying = musicSynth.toggle();

    if (audioBtn) {
      if (isPlaying) {
        audioBtn.classList.add('is-playing');
        audioBtn.setAttribute('aria-label', 'Silenciar música');
        audioBtn.title = 'Silenciar música';
      } else {
        audioBtn.classList.remove('is-playing');
        audioBtn.setAttribute('aria-label', 'Reproducir melodía de ensueño');
        audioBtn.title = 'Reproducir música';
      }
    }

    if (babyMobile) {
      if (isPlaying) {
        babyMobile.classList.add('is-spinning');
      } else {
        babyMobile.classList.remove('is-spinning');
      }
    }

    if (particleEngine && sourceElement) {
      const rect = sourceElement.getBoundingClientRect();
      particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => toggleMusic(audioBtn));
  }

  if (babyMobile) {
    babyMobile.addEventListener('click', () => toggleMusic(babyMobile));
    babyMobile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMusic(babyMobile);
      }
    });
  }

  // 3. Sub-Navegación Flotante: Sombra y elevación dinámica al hacer scroll
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

  // 4. Emblema / Sello Central Interactivo: Latido Fetal y Campanilla
  const waxSeal = document.getElementById('wax-seal');
  const sectionMusic = document.querySelector('.section-music');

  function triggerSealInteraction() {
    if (!waxSeal) return;

    if (musicSynth) {
      musicSynth.playHeartbeat();
      setTimeout(() => musicSynth.playChime(), 260);
    }

    if (particleEngine) {
      const rect = waxSeal.getBoundingClientRect();
      particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 38);
    }

    // Desplazamiento suave hacia la siguiente sección
    setTimeout(() => {
      if (sectionMusic) {
        sectionMusic.scrollIntoView({ behavior: 'smooth' });
      }
    }, 550);
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', triggerSealInteraction);
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerSealInteraction();
      }
    });
  }

  // 5. Interacción en Tarjeta de Fecha de Cuna
  const babyDateCard = document.getElementById('baby-date-card');
  if (babyDateCard) {
    babyDateCard.addEventListener('click', () => {
      if (musicSynth) musicSynth.playChime();
      if (particleEngine) {
        const rect = babyDateCard.getBoundingClientRect();
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
      }
    });
  }

  // 6. Modal de Pase Digital VIP (Acceso Reservado)
  const btnOpenVipPass = document.getElementById('btn-open-vip-pass');
  const vipPassModal = document.getElementById('vip-pass-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalPassBackdrop = document.getElementById('modal-pass-backdrop');
  const ticketGuestDisplay = document.getElementById('ticket-guest-display');
  const ticketPassesDisplay = document.getElementById('ticket-passes-display');
  const btnDownloadPass = document.getElementById('btn-download-pass');
  const guestNameInput = document.getElementById('guest-name');
  const guestPassesSelect = document.getElementById('guest-passes');

  function openVipPass() {
    if (!vipPassModal) return;

    // Actualizar nombre y pases en el ticket con los valores del formulario si existen
    const nameVal = guestNameInput ? guestNameInput.value.trim() : '';
    const passesVal = guestPassesSelect ? guestPassesSelect.value : '2';

    if (ticketGuestDisplay) {
      ticketGuestDisplay.textContent = nameVal ? nameVal : 'Estimado(a) Invitado(a)';
    }

    if (ticketPassesDisplay) {
      ticketPassesDisplay.textContent = `${passesVal} ${parseInt(passesVal, 10) === 1 ? 'Pase' : 'Pases'}`;
    }

    vipPassModal.classList.add('is-open');
    vipPassModal.setAttribute('aria-hidden', 'false');

    if (musicSynth) musicSynth.playChime();

    if (particleEngine) {
      particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
    }
  }

  function closeVipPass() {
    if (!vipPassModal) return;
    vipPassModal.classList.remove('is-open');
    vipPassModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenVipPass) btnOpenVipPass.addEventListener('click', openVipPass);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeVipPass);
  if (modalPassBackdrop) modalPassBackdrop.addEventListener('click', closeVipPass);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && vipPassModal && vipPassModal.classList.contains('is-open')) {
      closeVipPass();
    }
  });

  if (btnDownloadPass) {
    btnDownloadPass.addEventListener('click', () => {
      if (musicSynth) musicSynth.playChime();
      if (particleEngine) {
        particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
      }
      btnDownloadPass.textContent = '✓ Pase Guardado';
      setTimeout(() => {
        closeVipPass();
        btnDownloadPass.innerHTML = '<span>Guardar Pase</span>';
      }, 1200);
    });
  }

  // 7. Panel Colapsable de Sugerencia de Regalos / Lluvia de Sobres
  const btnToggleBankInfo = document.getElementById('btn-toggle-bank-info');
  const bankInfoPanel = document.getElementById('bank-info-panel');

  if (btnToggleBankInfo && bankInfoPanel) {
    btnToggleBankInfo.addEventListener('click', () => {
      const isHidden = bankInfoPanel.style.display === 'none' || !bankInfoPanel.style.display;
      if (isHidden) {
        bankInfoPanel.style.display = 'block';
        btnToggleBankInfo.querySelector('span').textContent = 'Ocultar sugerencia';
      } else {
        bankInfoPanel.style.display = 'none';
        btnToggleBankInfo.querySelector('span').textContent = 'Ver sugerencia de regalo';
      }
      if (musicSynth) musicSynth.playChime();
    });
  }

  // 8. Botones Gemelos de WhatsApp (Mamá y Papá) con feedback de audio y partículas
  const btnWaSofia = document.getElementById('btn-wa-sofia');
  const btnWaAlejandro = document.getElementById('btn-wa-alejandro');

  [btnWaSofia, btnWaAlejandro].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (musicSynth) musicSynth.playChime();
        if (particleEngine) {
          const rect = btn.getBoundingClientRect();
          particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
        }
      });
    }
  });

  // 9. Muestras de Vestimenta Interactivas (Dress Code Swatches)
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

      if (swatchBox) {
        swatchBox.style.boxShadow = `0 8px 24px ${glowColor}`;
      }

      if (particleEngine) {
        const rect = btn.getBoundingClientRect();
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
      }
    });
  });

  // 10. Despliegue Elástico al Bajar la Página ("Unfold on Scroll")
  // Observa las secciones .unfold-item, .apple-section, etc.
  const unfoldItems = document.querySelectorAll('.unfold-item, .apple-section, .editorial-section, .apple-stats-grid');

  if ('IntersectionObserver' in window) {
    const unfoldObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-unfolded');
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    unfoldItems.forEach(el => unfoldObserver.observe(el));
  } else {
    unfoldItems.forEach(el => {
      el.classList.add('is-unfolded');
      el.classList.add('is-revealed');
    });
  }

  // 11. Formulario de Asistencia Personalizado (RSVP)
  const rsvpForm = document.getElementById('rsvp-form');
  const nameInput = document.getElementById('guest-name');
  const errorName = document.getElementById('error-name');
  const passesGroup = document.getElementById('group-passes');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');

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

      if (musicSynth) musicSynth.playChime();

      if (particleEngine) {
        const submitBtn = document.getElementById('btn-submit-rsvp');
        const rect = submitBtn ? submitBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
        particleEngine.createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
        particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
      }

      if (window.Utils) {
        const waUrl = window.Utils.formatWhatsAppRsvpMessage({
          phone: '51999999999',
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

  // 12. Componentes de Compatibilidad (Carrusel & Pestañas para Tests Unitarios)
  const carousel = document.getElementById('highlights-carousel');
  const dots = document.querySelectorAll('.carousel-dot');
  const cards = document.querySelectorAll('.highlight-card');

  if (carousel && dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (cards[index]) {
          cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      });
    });
  }

  const tabChips = document.querySelectorAll('.tab-chip');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const targetTab = chip.getAttribute('data-tab');
      if (!targetTab) return;

      tabChips.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');

      tabPanels.forEach(panel => panel.classList.remove('is-active'));
      const activePanel = document.getElementById(`tab-panel-${targetTab}`);
      if (activePanel) activePanel.classList.add('is-active');
    });
  });
});
