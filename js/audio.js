/**
 * SINTETIZADOR AMBIENTAL WEB AUDIO API: CAJA DE MÚSICA DE ENSUEÑO
 * Genera una dulce melodía de carillón de cuna sin requerir archivos MP3 externos.
 */

class MusicBoxSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.noteIndex = 0;

    // Frecuencias para una melodía de cuna dulce y etérea (Notas musicales en Hz)
    // G4, B4, D5, G5, F#5, E5, D5, B4, C5, D5, B4, G4, A4, D5, G4
    this.melody = [
      { freq: 392.00, dur: 0.6 }, // G4
      { freq: 493.88, dur: 0.6 }, // B4
      { freq: 587.33, dur: 0.8 }, // D5
      { freq: 783.99, dur: 1.0 }, // G5
      { freq: 739.99, dur: 0.5 }, // F#5
      { freq: 659.25, dur: 0.6 }, // E5
      { freq: 587.33, dur: 1.1 }, // D5
      { freq: 493.88, dur: 0.6 }, // B4
      { freq: 523.25, dur: 0.6 }, // C5
      { freq: 587.33, dur: 0.8 }, // D5
      { freq: 493.88, dur: 0.8 }, // B4
      { freq: 392.00, dur: 0.6 }, // G4
      { freq: 440.00, dur: 0.6 }, // A4
      { freq: 587.33, dur: 0.9 }, // D5
      { freq: 392.00, dur: 1.4 }, // G4
      { freq: 0,      dur: 0.8 }  // Silencio sutil
    ];
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(frequency, duration) {
    if (!this.ctx || frequency <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Timbre de caja de música: combinación de armónicos suaves con ataque rápido y decaimiento lento
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    // Envolvente de sonido de campana de caja de música
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration * 1.6);
  }

  step() {
    if (!this.isPlaying) return;

    const note = this.melody[this.noteIndex];
    this.playNote(note.freq, note.dur);

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.timerId = setTimeout(() => this.step(), note.dur * 850);
  }

  start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  // Tono de campana de cristal para interacciones táctiles
  playChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    [587.33, 880.00].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.7);
    });
  }

  // Latido suave emulado (Lub-Dub) como el sensor del video de Apple
  playHeartbeat() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [0, 0.18].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(idx === 0 ? 82 : 72, now + offset);
      osc.frequency.exponentialRampToValueAtTime(38, now + offset + 0.12);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.18);
    });
  }
}

if (typeof window !== 'undefined') {
  window.MusicBoxSynthesizer = MusicBoxSynthesizer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MusicBoxSynthesizer };
}
