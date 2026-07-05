// Speech Synthesis Utility for Kids-Zone

let availableVoices = [];
let kidFriendlyVoice = null;
let lastSpeakTime = 0;

// Prime the engine with a silent utterance to wake up TTS (specifically for Chrome/Safari)
export function primeEngine() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const prime = new SpeechSynthesisUtterance("");
  prime.volume = 0;
  prime.rate = 10;
  window.speechSynthesis.speak(prime);
}

// Load available voices and select a high-quality child-friendly/female voice
export function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  
  availableVoices = window.speechSynthesis.getVoices();
  if (availableVoices.length === 0) return [];

  // Prioritize "Natural" (Edge), "Google" (Chrome), "Aria", "Samantha" or female voices
  kidFriendlyVoice = 
    availableVoices.find(v => (v.name.includes("Natural") || v.name.includes("Aria") || v.name.includes("Google")) && v.lang.startsWith("en")) ||
    availableVoices.find(v => (v.name.includes("Samantha") || v.name.includes("Female") || v.name.includes("Zira")) && v.lang.startsWith("en")) ||
    availableVoices.find(v => v.lang.startsWith("en")) ||
    availableVoices[0];

  return availableVoices;
}

// Zero-latency speak that cancels any ongoing speech and plays immediately
export function speakImmediate(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0; 
  utterance.pitch = 1.1; // Smoother, child-friendly high pitch

  if (!kidFriendlyVoice && availableVoices.length === 0) {
    loadVoices();
  }

  if (kidFriendlyVoice) {
    utterance.voice = kidFriendlyVoice;
  }

  lastSpeakTime = Date.now();

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// Speak text returning a Promise that resolves when speech finishes
export function speakTextPromise(text, rate = 1.0) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.1; 

    if (!kidFriendlyVoice && availableVoices.length === 0) {
      loadVoices();
    }

    if (kidFriendlyVoice) {
      utterance.voice = kidFriendlyVoice;
    }

    utterance.onend = () => {
      setTimeout(resolve, 100); // Small pause for rhythmic flow
    };
    
    utterance.onerror = () => {
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

// Cancel all active speaking
export function cancelSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

// Setup voice loaded event listeners and routine priming
export function setupSpeechEngine() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  loadVoices();

  // Keep-alive check every 5 seconds to ensure voices are loaded and primed
  const interval = setInterval(() => {
    if (availableVoices.length === 0) {
      loadVoices();
    }
    if (Date.now() - lastSpeakTime > 15000) {
      primeEngine();
    }
  }, 5000);

  return () => clearInterval(interval);
}
