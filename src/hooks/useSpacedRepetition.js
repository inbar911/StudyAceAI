import { useMemo } from 'react';
import { isDue } from '../utils/sm2.js';

export function useSpacedRepetition(deck) {
  return useMemo(() => {
    if (!deck) return { dueCards: [], total: 0, due: 0, mastered: 0, progress: 0 };
    const now = Date.now();
    const dueCards = deck.cards.filter(c => isDue(c.sr, now));
    const mastered = deck.cards.filter(c => (c.sr?.repetition || 0) >= 3).length;
    const total = deck.cards.length;
    const progress = total ? mastered / total : 0;
    return { dueCards, total, due: dueCards.length, mastered, progress };
  }, [deck]);
}
