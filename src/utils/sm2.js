// SM-2 spaced repetition algorithm.
// quality: 0..5 (0=Again, 3=Hard, 4=Good, 5=Easy in our UI mapping)
const DAY = 24 * 60 * 60 * 1000;

export function defaultCardSR() {
  return {
    interval: 0,
    repetition: 0,
    ef: 2.5,
    due: Date.now()
  };
}

export function reviewCard(sr, quality) {
  let { interval, repetition, ef } = sr;
  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 6;
    else interval = Math.round(interval * ef);
    repetition += 1;
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  return {
    interval,
    repetition,
    ef: +ef.toFixed(2),
    due: Date.now() + interval * DAY
  };
}

export function isDue(sr, now = Date.now()) {
  return !sr || sr.due <= now;
}

export function dueCount(cards, now = Date.now()) {
  return cards.filter(c => isDue(c.sr, now)).length;
}

export const QUALITY = { again: 0, hard: 3, good: 4, easy: 5 };
