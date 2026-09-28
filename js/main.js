/**
 * ORQUESTADOR PRINCIPAL — BABY SHOWER EMMA VICTORIA
 * 4 Capítulos: Hero | Fecha | RSVP | Programa
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────────
     1. PARTÍCULAS
  ────────────────────────────────────────────────────────────── */
  let particleEngine = null;
  if (window.ParticleEngine) {
    try {
      particleEngine = new window.ParticleEngine('canvas-particles');
      particleEngine.init();
      window.particleEngine = particleEngine;
    } catch (e) { /* silencioso si canvas no disponible */ }
  }

  /* ──────────────────────────────────────────────────────────────
     2. MÚSICA (Web Audio API — FIX: init solo en click)
  ────────────────────────────────────────────────────────────── */
  let musicSynth = null;
  if (window.MusicBoxSynthesizer) {
    musicSynth = new window.MusicBoxSynthesizer();
    window.musicSynth = musicSynth;
  }

  const audioBtn = document.getElementById('btn-audio-toggle');
  const audioIcon = audioBtn?.querySelector('.music-icon');

  async function handleMusicToggle() {
    if (!musicSynth || !audioBtn) return;
    try {
      const playing = await musicSynth.toggle();
      if (playing) {
        audioBtn.classList.add('is-playing');
        audioBtn.setAttribute('aria-label', 'Silenciar música de cuna');
        if (audioIcon) audioIcon.textContent = '♬';
      } else {
        audioBtn.classList.remove('is-playing');
        audioBtn.setAttribute('aria-label', 'Reproducir música de cuna');
        if (audioIcon) audioIcon.textContent = '♪';
      }
      if (particleEngine) {
        const r = audioBtn.getBoundingClientRect();
        particleEngine.createSparkleBurst(r.left + r.width / 2, r.top + r.height / 2, 16);
      }
    } catch (err) {
      console.warn('[Main] Toggle música falló:', err);
    }
  }

  if (audioBtn) audioBtn.addEventListener('click', handleMusicToggle);

  /* ──────────────────────────────────────────────────────────────
     3. SCROLL UNFOLD (IntersectionObserver)
  ────────────────────────────────────────────────────────────── */
  const unfoldTargets = document.querySelectorAll(
    '.unfold-item, .apple-section, .editorial-section, .apple-stats-grid'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-unfolded', 'is-revealed');
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

    unfoldTargets.forEach(el => io.observe(el));
  } else {
    // Fallback: mostrar todo sin animación
    unfoldTargets.forEach(el => el.classList.add('is-unfolded', 'is-revealed'));
  }

  /* ──────────────────────────────────────────────────────────────
     4. NAV PILL SHADOW en scroll
  ────────────────────────────────────────────────────────────── */
  const navPill = document.getElementById('apple-subnav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navPill) {
      navPill.style.boxShadow = y > 40
        ? '0 8px 28px rgba(196,118,138,.28)'
        : '0 4px 16px rgba(196,118,138,.15)';
    }
    lastScrollY = y;
  }, { passive: true });

  /* ──────────────────────────────────────────────────────────────
     5. MODAL PASE VIP
  ────────────────────────────────────────────────────────────── */
  const btnOpenVip      = document.getElementById('btn-open-vip-pass');
  const vipModal        = document.getElementById('vip-pass-modal');
  const btnCloseModal   = document.getElementById('btn-close-modal');
  const modalBackdrop   = document.getElementById('modal-pass-backdrop');
  const ticketGuestEl   = document.getElementById('ticket-guest-display');
  const ticketPassesEl  = document.getElementById('ticket-passes-display');
  const btnDownloadPass = document.getElementById('btn-download-pass');

  function openVipModal() {
    if (!vipModal) return;
    const name   = document.getElementById('guest-name')?.value?.trim() || 'Estimada Invitada';
    const passes = document.getElementById('guest-passes')?.value || '2';
    if (ticketGuestEl)  ticketGuestEl.textContent  = name;
    if (ticketPassesEl) ticketPassesEl.textContent = `${passes} ${passes === '1' ? 'Persona' : 'Personas'}`;
    vipModal.classList.add('is-open');
    vipModal.setAttribute('aria-hidden', 'false');
    if (musicSynth) musicSynth.playChime();
    if (particleEngine) particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 32);
  }

  function closeVipModal() {
    if (!vipModal) return;
    vipModal.classList.remove('is-open');
    vipModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenVip)    btnOpenVip.addEventListener('click', openVipModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeVipModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeVipModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVipModal(); });

  if (btnDownloadPass) {
    btnDownloadPass.addEventListener('click', () => {
      if (particleEngine) particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
      btnDownloadPass.textContent = '✓ Guardado!';
      setTimeout(() => {
        closeVipModal();
        btnDownloadPass.textContent = 'Guardar Pase 💌';
      }, 1400);
    });
  }

  /* ──────────────────────────────────────────────────────────────
     6. DRESS CODE SWATCHES
  ────────────────────────────────────────────────────────────── */
  const swatchBtns    = document.querySelectorAll('.swatch-btn');
  const swatchNameEl  = document.getElementById('active-swatch-name');
  const swatchDescEl  = document.getElementById('active-swatch-desc');

  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      if (swatchNameEl) swatchNameEl.textContent = btn.dataset.color || '';
      if (swatchDescEl) swatchDescEl.textContent = btn.dataset.desc  || '';
      if (particleEngine) {
        const r = btn.getBoundingClientRect();
        particleEngine.createSparkleBurst(r.left + r.width / 2, r.top + r.height / 2, 12);
      }
    });
  });

  /* ──────────────────────────────────────────────────────────────
     7. FORMULARIO RSVP
  ────────────────────────────────────────────────────────────── */
  const rsvpForm   = document.getElementById('rsvp-form');
  const nameInput  = document.getElementById('guest-name');
  const errorName  = document.getElementById('error-name');
  const groupPasses = document.getElementById('group-passes');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = nameInput?.value?.trim() || '';
      if (!name) {
        if (errorName) errorName.textContent = 'Por favor ingresa tu nombre o familia.';
        nameInput?.focus();
        return;
      }
      if (errorName) errorName.textContent = '';

      const passes = document.getElementById('guest-passes')?.value || '2';
      const wishes = document.getElementById('guest-wishes')?.value?.trim() || '';

      if (particleEngine) {
        particleEngine.createSparkleBurst(window.innerWidth / 2, window.innerHeight * .6, 40);
      }

      // Construir mensaje WhatsApp
      let msg = `¡Hola Maricielo y Arturo! Confirmo mi asistencia al Baby Shower de Sofía 🎀\n\n👤 *${name}*\n👥 Pases: ${passes}`;
      if (wishes) msg += `\n💕 Deseo: ${wishes}`;
      const url = `https://api.whatsapp.com/send?phone=51999999999&text=${encodeURIComponent(msg)}`;

      if (window.Utils?.formatWhatsAppRsvpMessage) {
        // Usar helper de utils.js si existe
        const utilUrl = window.Utils.formatWhatsAppRsvpMessage({
          phone: '51999999999',
          guestName: name,
          attending: 'si',
          passes,
          wishes
        });
        setTimeout(() => window.open(utilUrl, '_blank', 'noopener,noreferrer'), 300);
      } else {
        setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 300);
      }
    });
  }

  // Mostrar/ocultar campo pases según asistencia (radios de compat)
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  attendingRadios.forEach(r => {
    r.addEventListener('change', () => {
      if (groupPasses) groupPasses.style.display = r.value === 'no' ? 'none' : 'block';
    });
  });

  /* ──────────────────────────────────────────────────────────────
     8. COUNTDOWN (delegado a countdown.js o inline)
  ────────────────────────────────────────────────────────────── */
  function startCountdown() {
    const target = new Date('2026-10-24T16:00:00');
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minsEl    = document.getElementById('minutes');
    const secsEl    = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function tick() {
      const now  = new Date();
      const diff = target - now;
      if (diff <= 0) {
        daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);
      daysEl.textContent  = String(d).padStart(2,'0');
      hoursEl.textContent = String(h).padStart(2,'0');
      minsEl.textContent  = String(m).padStart(2,'0');
      secsEl.textContent  = String(s).padStart(2,'0');
    }

    tick();
    setInterval(tick, 1000);
  }

  // Si countdown.js ya existe y hace su trabajo, no sobreescribir
  if (!window.__countdownStarted) {
    startCountdown();
    window.__countdownStarted = true;
  }

  /* ──────────────────────────────────────────────────────────────
     9. COMPATIBILIDAD DE TESTS — Carousel dots & Tabs
  ────────────────────────────────────────────────────────────── */
  // Carousel dots y navegación interactiva — highlights-carousel
  const carousel = document.getElementById('highlights-carousel');
  const dots  = document.querySelectorAll('.carousel-dot');
  const cards = document.querySelectorAll('.highlight-card');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => { d.classList.remove('is-active'); d.setAttribute('aria-selected', 'false'); });
      dot.classList.add('is-active');
      dot.setAttribute('aria-selected', 'true');
      if (cards[i]) {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  });

  if (prevBtn && carousel) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -carousel.offsetWidth * 0.85, behavior: 'smooth' });
    });
  }
  if (nextBtn && carousel) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: carousel.offsetWidth * 0.85, behavior: 'smooth' });
    });
  }

  if (carousel && dots.length > 0) {
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = carousel.scrollLeft;
        const cardWidth = carousel.offsetWidth || 1;
        const activeIndex = Math.min(Math.round(scrollLeft / cardWidth), dots.length - 1);
        dots.forEach((d, i) => {
          if (i === activeIndex) {
            d.classList.add('is-active');
            d.setAttribute('aria-selected', 'true');
          } else {
            d.classList.remove('is-active');
            d.setAttribute('aria-selected', 'false');
          }
        });
      }, 60);
    }, { passive: true });
  }

  // Tab chips
  const tabChips  = document.querySelectorAll('.tab-chip');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const target = chip.getAttribute('data-tab');
      if (!target) return;
      tabChips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-selected','false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected','true');
      tabPanels.forEach(p => p.classList.remove('is-active'));
      const panel = document.getElementById(`tab-panel-${target}`);
      if (panel) panel.classList.add('is-active');
    });
  });

  /* ──────────────────────────────────────────────────────────────
     10. CALENDARIO (ICS)
  ────────────────────────────────────────────────────────────── */
  const btnCal = document.getElementById('btn-add-calendar');
  if (btnCal) {
    btnCal.addEventListener('click', e => {
      e.preventDefault();
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Sofia Baby Shower//ES',
        'BEGIN:VEVENT',
        'DTSTART:20261024T160000',
        'DTEND:20261024T210000',
        'SUMMARY:Baby Shower de Sofía 🎀',
        'DESCRIPTION:¡Una dulce bebé está en camino! Te invitamos a celebrar junto a la Familia Tejada Dávila.',
        'LOCATION:Jardin de Ensueno Las Rosas\\, Av. Los Jazmines 450\\, Valle Hermoso',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'baby-shower-sofia.ics';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

});
