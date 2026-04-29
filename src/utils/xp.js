export const LEVELS = [
  { key: 'Beginner', min: 0, color: 'bg-slate-500', emoji: '🌱' },
  { key: 'Scholar', min: 250, color: 'bg-emerald-500', emoji: '📘' },
  { key: 'Master', min: 1000, color: 'bg-indigo-500', emoji: '🎓' },
  { key: 'Legend', min: 3000, color: 'bg-amber-500', emoji: '👑' }
];

export const XP_REWARDS = {
  reviewAgain: 2,
  reviewHard: 5,
  reviewGood: 8,
  reviewEasy: 10,
  examQuestionCorrect: 12,
  examPerfect: 50,
  deckCreated: 15
};

export function levelFromXP(xp) {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) cur = l;
  const idx = LEVELS.indexOf(cur);
  const next = LEVELS[idx + 1];
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1;
  return { ...cur, next, progress: Math.min(1, progress) };
}

export function xpForReview(quality) {
  if (quality === 0) return XP_REWARDS.reviewAgain;
  if (quality === 3) return XP_REWARDS.reviewHard;
  if (quality === 4) return XP_REWARDS.reviewGood;
  return XP_REWARDS.reviewEasy;
}
