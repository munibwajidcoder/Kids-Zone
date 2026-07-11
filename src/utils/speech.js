// Speech Synthesis Utility for Kids-Zone

let availableVoices = [];
let lastSpeakTime = 0;

function cleanTextForSpeech(text) {
  return text
    .replace(/[\u1000-\uFFFF]+/g, '') // Remove emojis
    .replace(/\[.*?\]/g, '') // Remove bracketed text
    .replace(/\*.*?\*/g, '') // Remove asterisks text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ') // Replace punctuation with space to avoid Chrome cutoff bugs
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

function getVoiceForText(text) {
  if (availableVoices.length === 0) return null;
  
  const lower = text.toLowerCase();
  const isUrdu = ['hai', 'hoon', 'kya', 'kaise', 'mujhe', 'aap', 'bohat', 'acha', 'theek', 'tum', 'karo'].some(w => lower.includes(w));

  if (isUrdu) {
    const desiVoice = availableVoices.find(v => v.lang.includes('hi') || v.lang.includes('ur') || v.name.includes('India') || v.name.includes('Hindi'));
    if (desiVoice) return desiVoice;
  }

  return availableVoices.find(v => (v.name.includes("Natural") || v.name.includes("Aria") || v.name.includes("Google")) && v.lang.startsWith("en")) ||
         availableVoices.find(v => (v.name.includes("Samantha") || v.name.includes("Female") || v.name.includes("Zira")) && v.lang.startsWith("en")) ||
         availableVoices.find(v => v.lang.startsWith("en")) ||
         availableVoices[0];
}

// Prime the engine with a silent utterance to wake up TTS (specifically for Chrome/Safari)
export function primeEngine() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const prime = new SpeechSynthesisUtterance(" ");
  prime.volume = 0;
  prime.rate = 2;
  window.speechSynthesis.speak(prime);
}

export function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  
  availableVoices = window.speechSynthesis.getVoices();
  return availableVoices;
}

// Zero-latency speak that cancels any ongoing speech and plays immediately
export function speakImmediate(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95; 
  utterance.pitch = 1.0; 

  if (availableVoices.length === 0) {
    loadVoices();
  }

  const voice = getVoiceForText(cleanText);
  if (voice) {
    utterance.voice = voice;
  }

  lastSpeakTime = Date.now();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// Speak text returning a Promise that resolves when speech finishes
export function speakTextPromise(text, rate = 0.95) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) {
      resolve();
      return;
    }

    if (availableVoices.length === 0) {
      loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Prevent Chrome garbage collection bug from stopping speech halfway
    if (typeof window !== "undefined") {
       window.__ACTIVE_UTTERANCE__ = utterance;
    }

    utterance.rate = rate;
    utterance.pitch = 1.0; 


    const voice = getVoiceForText(cleanText);
    if (voice) {
      utterance.voice = voice;
    }

    lastSpeakTime = Date.now();

    let hasResolved = false;
    let gcInterval = null;

    const safeResolve = () => {
      if (!hasResolved) {
        hasResolved = true;
        if (gcInterval) clearInterval(gcInterval);
        resolve();
      }
    };

    // Fallback if TTS gets permanently stuck
    const fallbackTimeout = setTimeout(() => {
      console.warn("TTS timeout reached, auto-resolving");
      safeResolve();
    }, 60000);

    utterance.onend = () => {
      clearTimeout(fallbackTimeout);
      setTimeout(safeResolve, 100); 
    };
    
    utterance.onerror = () => {
      clearTimeout(fallbackTimeout);
      safeResolve();
    };

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    window.speechSynthesis.speak(utterance);
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
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
