// Sound utility for keyboard sounds

// Create audio context
let audioContext: AudioContext | null = null;

// Initialize audio context on user interaction
export const initAudio = (): void => {
  if (audioContext === null) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error('Web Audio API is not supported in this browser', e);
    }
  }
};

// Different keyboard sound types
export type KeyboardSoundType = 'blue' | 'brown' | 'red' | 'silent';

// Sound settings for different keyboard types
const soundSettings = {
  blue: { frequency: 1200, decay: 0.1, volume: 0.2, click: true },
  brown: { frequency: 800, decay: 0.15, volume: 0.15, click: true },
  red: { frequency: 500, decay: 0.2, volume: 0.1, click: false },
  silent: { frequency: 300, decay: 0.05, volume: 0.05, click: false }
};

// Play keyboard sound
export const playKeySound = (type: KeyboardSoundType = 'blue'): void => {
  if (!audioContext) {
    initAudio();
    if (!audioContext) return; // Exit if still null
  }

  const settings = soundSettings[type];
  
  // Create oscillator for the main tone
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(settings.frequency, audioContext.currentTime);
  
  // Create gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(settings.volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + settings.decay);
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Start and stop the sound
  oscillator.start();
  oscillator.stop(audioContext.currentTime + settings.decay);
  
  // Add click sound for clicky switches
  if (settings.click) {
    setTimeout(() => {
      const clickOsc = audioContext!.createOscillator();
      const clickGain = audioContext!.createGain();
      
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(settings.frequency * 2, audioContext!.currentTime);
      
      clickGain.gain.setValueAtTime(settings.volume * 0.7, audioContext!.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, audioContext!.currentTime + 0.03);
      
      clickOsc.connect(clickGain);
      clickGain.connect(audioContext!.destination);
      
      clickOsc.start();
      clickOsc.stop(audioContext!.currentTime + 0.03);
    }, settings.decay * 500);
  }
};

// Play a random variation of the key sound
export const playRandomKeySound = (type: KeyboardSoundType = 'blue'): void => {
  const settings = { ...soundSettings[type] };
  
  // Add slight randomness to frequency and decay
  const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  settings.frequency *= randomFactor;
  
  if (!audioContext) {
    initAudio();
    if (!audioContext) return; // Exit if still null
  }
  
  // Create oscillator for the main tone
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(settings.frequency, audioContext.currentTime);
  
  // Create gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(settings.volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + settings.decay);
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Start and stop the sound
  oscillator.start();
  oscillator.stop(audioContext.currentTime + settings.decay);
  
  // Add click sound for clicky switches
  if (settings.click) {
    setTimeout(() => {
      if (!audioContext) return;
      
      const clickOsc = audioContext.createOscillator();
      const clickGain = audioContext.createGain();
      
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(settings.frequency * 2, audioContext.currentTime);
      
      clickGain.gain.setValueAtTime(settings.volume * 0.7, audioContext.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);
      
      clickOsc.connect(clickGain);
      clickGain.connect(audioContext.destination);
      
      clickOsc.start();
      clickOsc.stop(audioContext.currentTime + 0.03);
    }, settings.decay * 500);
  }
};
