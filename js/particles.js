/**
 * MOTOR DE PARTÍCULAS CANVA 2D: DESTELLOS Y MARIPOSAS DE ENSUEÑO
 * Optimizado a 60 FPS con pausa en visibilidad oculta y respeto a prefers-reduced-motion.
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = typeof document !== 'undefined' ? document.getElementById(canvasId) : null;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.butterflies = [];
    this.bursts = [];
    this.width = 0;
    this.height = 0;
    this.animationFrameId = null;
    this.isRunning = false;
    this.isReducedMotion = false;
    
    // Paleta de partículas
    this.colors = ['#DFB76C', '#FFEAA7', '#E8BAC9', '#F4D3DC', '#FFFFFF'];
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    // Verificar preferencias de reducción de movimiento
    if (typeof window !== 'undefined' && window.matchMedia) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = motionQuery.matches;
      motionQuery.addEventListener('change', (e) => {
        this.isReducedMotion = e.matches;
        if (this.isReducedMotion) {
          this.pause();
        } else {
          this.start();
        }
      });
    }

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Pausar cuando la pestaña no esté visible para ahorrar batería
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.pause();
      } else if (!this.isReducedMotion) {
        this.start();
      }
    });

    // Crear partículas iniciales
    this.createMotes();
    this.createButterflies();

    if (!this.isReducedMotion) {
      this.start();
    } else {
      this.renderStatic();
    }
  }

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  createMotes() {
    const count = Math.min(Math.floor(this.width * 0.05), 45);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 0.8,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: Math.random() * 0.7 + 0.2,
        alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.4,
        vy: - (Math.random() * 0.5 + 0.2), // Flotan hacia arriba lentamente
        angle: Math.random() * Math.PI * 2,
        angleSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  createButterflies() {
    // 3 a 5 mariposas sutiles
    const count = this.width < 600 ? 3 : 5;
    this.butterflies = [];
    for (let i = 0; i < count; i++) {
      this.butterflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 6 + 10,
        vx: (Math.random() * 0.8 + 0.4) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() - 0.5) * 0.5,
        wingAngle: 0,
        wingSpeed: Math.random() * 0.15 + 0.1,
        color: i % 2 === 0 ? '#DFB76C' : '#E8BAC9',
        targetX: Math.random() * this.width,
        targetY: Math.random() * this.height
      });
    }
  }

  createSparkleBurst(x, y, count = 28) {
    if (this.isReducedMotion) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.2;
      const speed = Math.random() * 4 + 2;
      this.bursts.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        radius: Math.random() * 3 + 1.5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
    if (!this.isRunning) {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      this.update();
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  update() {
    // Actualizar Motes
    for (const p of this.particles) {
      p.y += p.vy;
      p.x += Math.sin(p.angle) * 0.5 + p.vx;
      p.angle += p.angleSpeed;
      p.alpha += p.alphaSpeed;

      if (p.alpha <= 0.15 || p.alpha >= 0.85) {
        p.alphaSpeed *= -1;
      }

      // Reiniciar cuando salen de la pantalla
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
    }

    // Actualizar Mariposas
    for (const b of this.butterflies) {
      b.wingAngle += b.wingSpeed;
      b.x += b.vx;
      b.y += b.vy + Math.sin(b.wingAngle * 0.5) * 0.6;

      // Rebotar o rotar en los bordes
      if (b.x < -30) b.x = this.width + 20;
      if (b.x > this.width + 30) b.x = -20;
      if (b.y < -30) b.y = this.height + 20;
      if (b.y > this.height + 30) b.y = -20;
    }

    // Actualizar Bursts
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.08; // Gravedad suave
      b.vx *= 0.98; // Fricción
      b.alpha -= b.decay;

      if (b.alpha <= 0) {
        this.bursts.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Dibujar Motes (estrellitas y polvo de hadas)
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Dibujar Mariposas
    for (const b of this.butterflies) {
      this.ctx.save();
      this.ctx.translate(b.x, b.y);
      if (b.vx < 0) {
        this.ctx.scale(-1, 1);
      }

      const wingFlap = Math.cos(b.wingAngle);
      this.ctx.fillStyle = b.color;
      this.ctx.globalAlpha = 0.75;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = b.color;

      // Ala superior
      this.ctx.beginPath();
      this.ctx.ellipse(0, -b.size * 0.4, b.size * 0.7 * Math.abs(wingFlap), b.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Ala inferior
      this.ctx.beginPath();
      this.ctx.ellipse(0, b.size * 0.3, b.size * 0.5 * Math.abs(wingFlap), b.size * 0.35, -Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Cuerpo
      this.ctx.fillStyle = '#8B5A6A';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, 1.5, b.size * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    // Dibujar Bursts de confeti/destellos
    for (const b of this.bursts) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, b.alpha);
      this.ctx.fillStyle = b.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = b.color;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  renderStatic() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const p of this.particles.slice(0, 15)) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.4;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

// Inicialización global para el navegador
if (typeof window !== 'undefined') {
  window.ParticleEngine = ParticleEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ParticleEngine };
}
