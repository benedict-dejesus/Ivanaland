/**
 * Procedural WebAudio — zero audio files.
 * Soft plinks, warm discovery arpeggios, milestone fanfares.
 */
export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = true;

  /** call on first user gesture */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35;
      this.master.connect(this.ctx.destination);
    } catch { /* no audio available */ }
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 1, glideTo?: number): void {
    if (!this.ctx || !this.master || !this.enabled) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /** gentle world-poke */
  plink(pitch = 1): void {
    this.tone(520 * pitch, 0, 0.14, 'triangle', 0.5);
    this.tone(1040 * pitch, 0, 0.1, 'sine', 0.18);
  }

  /** container/reveal step */
  reveal(): void {
    this.tone(392, 0, 0.16, 'triangle', 0.5);
    this.tone(587, 0.07, 0.2, 'triangle', 0.45);
  }

  /** sequence step n of total */
  step(n: number): void {
    const base = 440 * Math.pow(1.2, n);
    this.tone(base, 0, 0.18, 'triangle', 0.55);
    this.tone(base * 1.5, 0.04, 0.15, 'sine', 0.25);
  }

  /** phone discovered! */
  discovery(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      this.tone(f, i * 0.07, 0.35, 'triangle', 0.55);
      this.tone(f * 2, i * 0.07 + 0.02, 0.2, 'sine', 0.15);
    });
  }

  /** achievement */
  chime(): void {
    this.tone(880, 0, 0.3, 'sine', 0.4);
    this.tone(1318.5, 0.09, 0.4, 'sine', 0.35);
  }

  /** milestone / completion fanfare */
  fanfare(): void {
    const seq = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
    seq.forEach((f, i) => {
      this.tone(f, i * 0.11, 0.5, 'triangle', 0.5);
      this.tone(f / 2, i * 0.11, 0.5, 'sine', 0.22);
    });
    this.tone(1568, 0.68, 1.1, 'sine', 0.35);
  }

  ripple(): void {
    this.tone(300, 0, 0.12, 'sine', 0.22, 240);
  }
}
