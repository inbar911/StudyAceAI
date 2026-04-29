import en from './en.js';
import he from './he.js';
import es from './es.js';

export const dictionaries = { en, he, es };
export const rtlLangs = ['he'];

export function t(lang, path) {
  const dict = dictionaries[lang] || dictionaries.en;
  return path.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), dict)
    ?? path.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), dictionaries.en)
    ?? path;
}
