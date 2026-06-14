export function spelledNumberIndonesian(n: number): string {
  if (n <= 0) return '';
  if (n === 100) return 'seratus';
  
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  
  if (n <= 11) {
    return units[n];
  }
  
  if (n < 20) {
    return units[n - 10] + ' belas';
  }
  
  const tens = Math.floor(n / 10);
  const remaining = n % 10;
  
  return units[tens] + ' puluh' + (remaining > 0 ? ' ' + units[remaining] : '');
}

let idVoiceCache: SpeechSynthesisVoice | null = null;

function findIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (idVoiceCache) return idVoiceCache;
  
  const voices = window.speechSynthesis.getVoices();
  // Find a voice that contains "id-ID" or "id"
  const idVoice = voices.find(v => v.lang.toLowerCase().includes('id-id') || v.lang.toLowerCase().startsWith('id'));
  if (idVoice) {
    idVoiceCache = idVoice;
    return idVoice;
  }
  return null;
}

// Pre-fetch voices on load
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      findIndonesianVoice();
    };
  }
}

export function speakText(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis is not supported on this device/browser');
    return;
  }
  
  // Cancel active speech so clicks response instantaneously without overlapping
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.9;  // Standard warm speed
  utterance.pitch = 1.1; // Friendly warm pitch for children learning
  
  // Try to bind voice
  const voice = findIndonesianVoice();
  if (voice) {
    utterance.voice = voice;
  }
  
  window.speechSynthesis.speak(utterance);
}
