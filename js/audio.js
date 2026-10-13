/**
 * SINTETIZADOR MUSICAL: CAJA DE MÚSICA BEBÉ
 * Optimizaciones críticas para iOS Safari:
 * 1. AudioSession 'playback' (iOS 17+) para ignorar el switch físico de silencio.
 * 2. Truco HTML5 silent buffer para forzar canal de medios en iOS previo a 17.
 * 3. Desbloqueo sincrónico en stack de evento de usuario.
 * 4. Ganancia ajustada y calibrada para parlantes de smartphones.
 */

class MusicBoxSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.schedulerTimer = null;
    this.nextNoteTime = 0;
    this.noteIndex = 0;
    this.silentAudioUnlocked = false;

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
   * Desbloqueo universal para Safari iOS:
   * 1. Solicita AudioSession 'playback' (iOS 17+)
   * 2. Inicia un elemento de audio silencioso para forzar que iOS derive Web Audio
   *    al canal principal de multimedia, ignorando el switch de silencio.
   */
  unlockIOSAudio() {
    if (typeof navigator !== 'undefined' && 'audioSession' in navigator) {
      try {
        navigator.audioSession.type = 'playback';
      } catch (_) {}
    }

    if (!this.silentAudioUnlocked && typeof document !== 'undefined') {
      try {
        const silent = document.createElement('audio');
        silent.setAttribute('x-webkit-airplay', 'deny');
        silent.setAttribute('playsinline', '');
        silent.preload = 'auto';
        // WAV silencioso de 1 sample
        silent.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        const p = silent.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
        this.silentAudioUnlocked = true;
      } catch (_) {}
    }
  }

  /**
   * Inicializa o reanuda el AudioContext sincronamente en el gesto del usuario.
   */
  initContext() {
    this.unlockIOSAudio();

    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) {
        console.warn('[MusicBox] Web Audio API no disponible en este navegador.');
        return false;
      }
      this.ctx = new Ctx();

      // Master Gain para calibración y volumen en móviles
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch (err) {
        console.warn('[MusicBox] Error al reanudar AudioContext:', err);
      }
    }

    // Desbloqueo sincrónico: buffer dummy
    try {
      const dummyBuffer = this.ctx.createBuffer(1, 1, 22050);
      const dummySource = this.ctx.createBufferSource();
      dummySource.buffer = dummyBuffer;
      dummySource.connect(this.ctx.destination);
      dummySource.start(0);
    } catch (_) {}

    return true;
  }

  /**
   * Reproduce una nota individual como caja de música (sine + armónicos con decay percusivo).
   */
  playNote(frequency, startTime, duration) {
    if (!this.ctx || frequency <= 0) return;

    const dest = this.masterGain || this.ctx.destination;

    const createVoice = (freq, vol, decay) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(startTime);
      osc.stop(startTime + decay + 0.05);
    };

    // Calibrado para altavoces móviles (volumen claro y cálido)
    createVoice(frequency,       0.28, duration - 0.04);
    // Octava superior (brillo metálico característico de caja de música)
    createVoice(frequency * 2,   0.09, duration * 0.55);
    // Quinta (armónico dulce)
    createVoice(frequency * 1.5, 0.05, duration * 0.4);
  }

  /** Scheduler de Web Audio con lookahead */
  schedule() {
    if (!this.isPlaying || !this.ctx) return;

    const LOOKAHEAD = 0.20;  // segundos hacia adelante
    const INTERVAL  = 25;    // ms entre llamadas al scheduler

    while (this.nextNoteTime < this.ctx.currentTime + LOOKAHEAD) {
      const note = this.melody[this.noteIndex % this.melody.length];
      this.playNote(note.freq, this.nextNoteTime, note.dur);
      this.nextNoteTime += note.dur + 0.055;
      this.noteIndex++;
    }

    this.schedulerTimer = setTimeout(() => this.schedule(), INTERVAL);
  }

  /**
   * Alternar reproducción/pausa.
   * @returns {Promise<boolean>}
   */
  async toggle() {
    this.initContext();

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (_) {}
    }

    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.schedulerTimer) {
        clearTimeout(this.schedulerTimer);
        this.schedulerTimer = null;
      }
      return false;
    } else {
      this.isPlaying = true;
      this.nextNoteTime = (this.ctx ? this.ctx.currentTime : 0) + 0.08;
      this.schedule();
      return true;
    }
  }

  /** Tañido de chime para modales o eventos */
  playChime() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNote(1046.50, now,         0.5);
    this.playNote(783.99,  now + 0.18,  0.4);
    this.playNote(1046.50, now + 0.38,  0.6);
  }

  /** Latido suave */
  playHeartbeat() {
    if (!this.ctx) this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNote(110, now,        0.18);
    this.playNote(110, now + 0.22, 0.18);
  }
}

if (typeof window !== 'undefined') {
  window.MusicBoxSynthesizer = MusicBoxSynthesizer;
}
