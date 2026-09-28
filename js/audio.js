/**
 * SINTETIZADOR MUSICAL: CAJA DE MÚSICA BEBÉ
 * FIX PRINCIPAL: AudioContext se crea SOLO dentro del handler de click
 * para cumplir con la política de autoplay de los navegadores modernos.
 */

class MusicBoxSynthesizer {
  constructor() {
    // AudioContext se inicializa en toggle() — NO en el constructor
    this.ctx = null;
    this.isPlaying = false;
    this.schedulerTimer = null;
    this.nextNoteTime = 0;
    this.noteIndex = 0;

    // Melodía: Twinkle Twinkle / Brahms Lullaby fusion
    this.melody = [
      { freq: 392.00, dur: 0.50 }, // G4
      { freq: 392.00, dur: 0.50 }, // G4
      { freq: 523.25, dur: 0.50 }, // C5
      { freq: 523.25, dur: 0.50 }, // C5
      { freq: 587.33, dur: 0.50 }, // D5
      { freq: 587.33, dur: 0.50 }, // D5
      { freq: 523.25, dur: 0.80 }, // C5
      { freq: 0,      dur: 0.30 }, // rest
      { freq: 493.88, dur: 0.50 }, // B4
      { freq: 493.88, dur: 0.50 }, // B4
      { freq: 440.00, dur: 0.50 }, // A4
      { freq: 440.00, dur: 0.50 }, // A4
      { freq: 392.00, dur: 1.20 }, // G4
      { freq: 0,      dur: 0.50 }, // rest
      { freq: 523.25, dur: 0.50 }, // C5
      { freq: 523.25, dur: 0.50 }, // C5
      { freq: 493.88, dur: 0.50 }, // B4
      { freq: 493.88, dur: 0.50 }, // B4
      { freq: 440.00, dur: 0.50 }, // A4
      { freq: 440.00, dur: 0.80 }, // A4
      { freq: 392.00, dur: 1.20 }, // G4
      { freq: 0,      dur: 0.60 }, // rest
      { freq: 587.33, dur: 0.50 }, // D5
      { freq: 587.33, dur: 0.50 }, // D5
      { freq: 523.25, dur: 0.50 }, // C5
      { freq: 523.25, dur: 0.80 }, // C5
      { freq: 0,      dur: 0.40 }, // rest
      { freq: 493.88, dur: 0.50 }, // B4
      { freq: 440.00, dur: 0.50 }, // A4
      { freq: 392.00, dur: 1.50 }, // G4
      { freq: 0,      dur: 0.60 }, // rest
    ];
  }

  /**
   * Inicializa o reanuda el AudioContext.
   * DEBE llamarse desde dentro de un evento de usuario.
   */
  async initContext() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) {
        console.warn('[MusicBox] Web Audio API no disponible en este navegador.');
        return false;
      }
      this.ctx = new Ctx();
    }
    // Si el contexto fue suspendido por autoplay policy, lo reactivamos
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('[MusicBox] No se pudo reanudar AudioContext:', err);
        return false;
      }
    }
    return this.ctx.state === 'running';
  }

  /**
   * Reproduce una nota individual como caja de música (sine + armónico).
   */
  playNote(frequency, startTime, duration) {
    if (!this.ctx || frequency <= 0) return;

    const createVoice = (freq, vol, decay) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + decay + 0.05);
    };

    // Fundamental (más suave)
    createVoice(frequency,       0.12, duration - 0.04);
    // Octava superior (brillo de caja de música)
    createVoice(frequency * 2,   0.04, duration * 0.55);
    // Quinta (calidez)
    createVoice(frequency * 1.5, 0.025, duration * 0.4);
  }

  /** Scheduler de Web Audio (look-ahead pattern para timing preciso) */
  schedule() {
    if (!this.isPlaying || !this.ctx) return;

    const LOOKAHEAD = 0.15;  // segundos hacia adelante
    const INTERVAL  = 30;    // ms entre llamadas al scheduler

    while (this.nextNoteTime < this.ctx.currentTime + LOOKAHEAD) {
      const note = this.melody[this.noteIndex % this.melody.length];
      this.playNote(note.freq, this.nextNoteTime, note.dur);
      this.nextNoteTime += note.dur + 0.055; // gap mínimo entre notas
      this.noteIndex++;
    }

    this.schedulerTimer = setTimeout(() => this.schedule(), INTERVAL);
  }

  /**
   * Alternar reproducción/pausa.
   * SIEMPRE debe llamarse desde un evento de usuario (click, touch).
   * @returns {Promise<boolean>} true si está reproduciendo, false si pausado
   */
  async toggle() {
    const ready = await this.initContext();

    if (!ready) {
      // Último intento: crear contexto nuevo si el anterior falló
      try {
        this.ctx = null;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
          this.ctx = new Ctx();
          await this.ctx.resume();
        }
      } catch (_) { /* silent */ }
      return false;
    }

    if (this.isPlaying) {
      // Pausar
      this.isPlaying = false;
      if (this.schedulerTimer) {
        clearTimeout(this.schedulerTimer);
        this.schedulerTimer = null;
      }
      return false;
    } else {
      // Iniciar
      this.isPlaying = true;
      this.nextNoteTime = this.ctx.currentTime + 0.08;
      this.schedule();
      return true;
    }
  }

  /** Tañido de chime (se usa en apertura de modal, etc.) */
  playChime() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    this.playNote(1046.50, now,         0.5);
    this.playNote(783.99,  now + 0.18,  0.4);
    this.playNote(1046.50, now + 0.38,  0.6);
  }

  /** Latido de corazón (2 pulsos suaves en bajo) */
  playHeartbeat() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    this.playNote(110, now,        0.18);
    this.playNote(110, now + 0.22, 0.18);
  }
}

if (typeof window !== 'undefined') {
  window.MusicBoxSynthesizer = MusicBoxSynthesizer;
}
