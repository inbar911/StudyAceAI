import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadState, saveState, clearState, uid, todayKey } from '../utils/storage.js';
import { defaultCardSR, reviewCard } from '../utils/sm2.js';
import { rtlLangs } from '../i18n/index.js';
import { XP_REWARDS, xpForReview } from '../utils/xp.js';

const Ctx = createContext(null);

const initial = {
  user: { name: 'Student' },
  decks: [],
  xp: 0,
  streak: { count: 0, lastDay: null },
  lang: 'en',
  theme: 'dark',
  onboarded: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'setLang': return { ...state, lang: action.lang };
    case 'setTheme': return { ...state, theme: action.theme };
    case 'finishOnboarding': return { ...state, onboarded: true };
    case 'addDeck': return { ...state, decks: [action.deck, ...state.decks], xp: state.xp + XP_REWARDS.deckCreated };
    case 'deleteDeck': return { ...state, decks: state.decks.filter(d => d.id !== action.id) };
    case 'editCard': {
      const { deckId, cardId, front, back } = action;
      return {
        ...state,
        decks: state.decks.map(d => d.id !== deckId ? d : {
          ...d,
          cards: d.cards.map(c => c.id === cardId ? { ...c, front, back } : c)
        })
      };
    }
    case 'deleteCard': {
      const { deckId, cardId } = action;
      return {
        ...state,
        decks: state.decks.map(d => d.id !== deckId ? d : {
          ...d,
          cards: d.cards.filter(c => c.id !== cardId)
        })
      };
    }
    case 'reviewCard': {
      const { deckId, cardId, quality } = action;
      const decks = state.decks.map(d => {
        if (d.id !== deckId) return d;
        return {
          ...d,
          cards: d.cards.map(c => c.id === cardId
            ? { ...c, sr: reviewCard(c.sr || defaultCardSR(), quality), lastReview: Date.now() }
            : c)
        };
      });
      return { ...state, decks, xp: state.xp + xpForReview(quality), streak: bumpStreak(state.streak) };
    }
    case 'examAwardXP': return { ...state, xp: state.xp + action.amount, streak: bumpStreak(state.streak) };
    case 'importBackup': {
      const { data, mode } = action;
      const incoming = (data.decks || []).map(d => ({
        ...d,
        id: d.id || uid(),
        cards: (d.cards || []).map(c => ({
          id: c.id || uid(),
          front: c.front,
          back: c.back,
          sr: c.sr || defaultCardSR(),
          lastReview: c.lastReview || null
        }))
      }));
      if (mode === 'replace') {
        return { ...state, decks: incoming, xp: data.xp ?? state.xp, streak: data.streak ?? state.streak };
      }
      const existingIds = new Set(state.decks.map(d => d.id));
      const merged = [...incoming.filter(d => !existingIds.has(d.id)), ...state.decks];
      return { ...state, decks: merged };
    }
    case 'reset': return { ...initial, lang: state.lang, theme: state.theme, onboarded: true };
    default: return state;
  }
}

function bumpStreak(s) {
  const today = todayKey();
  if (s.lastDay === today) return s;
  const yesterday = todayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const count = s.lastDay === yesterday ? s.count + 1 : 1;
  return { count, lastDay: today };
}

function lazyInit() {
  const s = loadState();
  return s ? { ...initial, ...s } : initial;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, lazyInit);

  useEffect(() => {
    const id = setTimeout(() => saveState(state), 250);
    return () => clearTimeout(id);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', state.theme === 'dark');
    root.dir = rtlLangs.includes(state.lang) ? 'rtl' : 'ltr';
    root.lang = state.lang;
    document.body.classList.toggle('font-heebo', state.lang === 'he');
  }, [state.theme, state.lang]);

  const api = useMemo(() => ({
    state,
    setLang: (lang) => dispatch({ type: 'setLang', lang }),
    setTheme: (theme) => dispatch({ type: 'setTheme', theme }),
    finishOnboarding: () => dispatch({ type: 'finishOnboarding' }),
    addDeck: (name, cards) => {
      const deck = {
        id: uid(),
        name,
        createdAt: Date.now(),
        cards: cards.map(c => ({ id: uid(), front: c.front, back: c.back, sr: defaultCardSR(), lastReview: null }))
      };
      dispatch({ type: 'addDeck', deck });
      return deck;
    },
    deleteDeck: (id) => dispatch({ type: 'deleteDeck', id }),
    editCard: (deckId, cardId, front, back) => dispatch({ type: 'editCard', deckId, cardId, front, back }),
    deleteCard: (deckId, cardId) => dispatch({ type: 'deleteCard', deckId, cardId }),
    reviewCard: (deckId, cardId, quality) => dispatch({ type: 'reviewCard', deckId, cardId, quality }),
    awardExamXP: (amount) => dispatch({ type: 'examAwardXP', amount }),
    importBackup: (data, mode = 'merge') => dispatch({ type: 'importBackup', data, mode }),
    resetAll: () => { clearState(); dispatch({ type: 'reset' }); }
  }), [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside provider');
  return v;
}
