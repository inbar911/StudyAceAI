const LANG_TAG = { en: 'en-US', he: 'he-IL', es: 'es-ES' };

export function speak(text, lang = 'en') {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANG_TAG[lang] || 'en-US';
  u.rate = 1;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

export const ttsAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;
