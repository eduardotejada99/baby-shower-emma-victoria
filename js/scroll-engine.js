/**
 * APPLE-STYLE BIDIRECTIONAL SCROLL ENGINE
 * Pinned stage with smooth continuous scrubbing, scale/opacity morphing, and inertia.
 */

(function () {
  function clamp(val, min = 0, max = 1) {
    return Math.min(Math.max(val, min), max);
  }

  function calculateSceneProgress(scrollProgress, sceneStart, sceneEnd) {
    if (sceneEnd <= sceneStart) return 0;
    const raw = (scrollProgress - sceneStart) / (sceneEnd - sceneStart);
    return clamp(raw, 0, 1);
  }

  function calculateSceneMetrics(localProgress, isFirst = false, isLast = false) {
    let opacity = 0;
    let scale = 0.94;
    let translateY = 25;

    // Primer capítulo: completamente visible desde el inicio (sin fade in)
    if (isFirst) {
      if (localProgress <= 0.6) {
        opacity = 1;
        scale = 1.0;
        translateY = 0;
      } else {
        const t = (localProgress - 0.6) / 0.4;
        opacity = 1 - t;
        scale = 1.0 + 0.08 * t;
        translateY = -30 * t;
      }
      return { opacity, scale, translateY };
    }

    // Último capítulo: permanece visible al final del scroll
    if (isLast) {
      if (localProgress < 0.4) {
        const t = localProgress / 0.4;
        opacity = t;
        scale = 0.94 + 0.06 * t;
        translateY = 25 * (1 - t);
      } else {
        opacity = 1;
        scale = 1.0;
        translateY = 0;
      }
      return { opacity, scale, translateY };
    }

    // Capítulos intermedios: entrada suave, centro estelar y salida elegante
    if (localProgress < 0.28) {
      const t = localProgress / 0.28;
      opacity = t;
      scale = 0.93 + (1.0 - 0.93) * t;
      translateY = 28 * (1 - t);
    } else if (localProgress <= 0.72) {
      opacity = 1;
      scale = 1.0;
      translateY = 0;
    } else {
      const t = (localProgress - 0.72) / 0.28;
      opacity = 1 - t;
      scale = 1.0 + 0.06 * t;
      translateY = -28 * t;
    }

    return { opacity, scale, translateY };
  }

  class AppleScrollEngine {
    constructor() {
      this.scenes = [];
      this.navDots = [];
      this.progressBar = null;
      this.targetScrollY = 0;
      this.currentScrollY = 0;
      this.isTicking = false;
      this.ranges = [
        { start: 0.00, end: 0.18, title: 'Portada' },
        { start: 0.15, end: 0.36, title: 'Emma Victoria' },
        { start: 0.33, end: 0.54, title: 'Cuenta Regresiva' },
        { start: 0.51, end: 0.72, title: 'Lugar' },
        { start: 0.69, end: 0.88, title: 'Dress Code' },
        { start: 0.85, end: 1.00, title: 'RSVP' }
      ];
    }

    init() {
      this.scenes = Array.from(document.querySelectorAll('.scene-panel'));
      this.navDots = Array.from(document.querySelectorAll('.scrub-dot'));
      this.progressBar = document.getElementById('scrub-progress-fill');

      if (!this.scenes.length) return;

      this.targetScrollY = window.scrollY;
      this.currentScrollY = window.scrollY;

      // Evento de scroll pasivo de alto rendimiento
      window.addEventListener('scroll', () => {
        this.targetScrollY = window.scrollY;
        if (!this.isTicking) {
          this.isTicking = true;
          requestAnimationFrame(() => this.onScrollFrame());
        }
      }, { passive: true });

      // Clics en la barra de navegación de puntos estilo Apple
      this.navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const range = this.ranges[index];
          if (!range) return;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const targetY = (range.start + (range.end - range.start) * 0.45) * maxScroll;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
      });

      this.onScrollFrame();
    }

    onScrollFrame() {
      // Suavizado e inercia sutil
      const diff = this.targetScrollY - this.currentScrollY;
      if (Math.abs(diff) > 0.5) {
        this.currentScrollY += diff * 0.22;
        this.isTicking = true;
        requestAnimationFrame(() => this.onScrollFrame());
      } else {
        this.currentScrollY = this.targetScrollY;
        this.isTicking = false;
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = clamp(this.currentScrollY / maxScroll, 0, 1);

      // Actualizar barra de progreso global
      if (this.progressBar) {
        this.progressBar.style.height = `${progress * 100}%`;
      }

      let activeIndex = 0;
      let maxVisibility = -1;

      // Actualizar cada escena
      this.scenes.forEach((scene, index) => {
        const range = this.ranges[index] || { start: 0, end: 1 };
        const isFirst = index === 0;
        const isLast = index === this.scenes.length - 1;
        const localProgress = calculateSceneProgress(progress, range.start, range.end);
        const metrics = calculateSceneMetrics(localProgress, isFirst, isLast);

        scene.style.opacity = metrics.opacity;
        scene.style.transform = `translate3d(0, ${metrics.translateY}px, 0) scale(${metrics.scale})`;

        // Solo la escena más visible acepta eventos del mouse/tacto
        if (metrics.opacity > 0.45) {
          scene.style.pointerEvents = 'auto';
          scene.setAttribute('aria-hidden', 'false');
        } else {
          scene.style.pointerEvents = 'none';
          scene.setAttribute('aria-hidden', 'true');
        }

        if (metrics.opacity > maxVisibility) {
          maxVisibility = metrics.opacity;
          activeIndex = index;
        }
      });

      // Actualizar puntos de navegación activos
      this.navDots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });

      // Efecto interactivo del sello de cera en Scene 0
      const waxSeal = document.getElementById('wax-seal');
      if (waxSeal) {
        if (progress > 0.04) {
          waxSeal.classList.add('is-broken');
        } else {
          waxSeal.classList.remove('is-broken');
        }
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.AppleScrollEngine = AppleScrollEngine;
    document.addEventListener('DOMContentLoaded', () => {
      const engine = new AppleScrollEngine();
      engine.init();
      window.appleScrollEngine = engine;
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      clamp,
      calculateSceneProgress,
      calculateSceneMetrics
    };
  }
})();
