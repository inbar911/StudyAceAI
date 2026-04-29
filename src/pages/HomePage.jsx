import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import LevelBadge from '../components/LevelBadge.jsx';
import Streak from '../components/Streak.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { dueCount } from '../utils/sm2.js';

function QuickCard({ to, icon, label }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex flex-col items-center gap-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors"
      >
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </motion.div>
    </Link>
  );
}

function DeckCard({ deck, t }) {
  const due = dueCount(deck.cards);
  return (
    <Link to={`/decks/${deck.id}/study`}>
      <motion.div
        whileHover={{ x: 2 }}
        className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{deck.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{deck.cards.length} {t('home.cards')}</div>
        </div>
        {due > 0 && (
          <span className="shrink-0 bg-brand-600 text-white text-xs font-bold rounded-full px-2.5 py-1">
            {due} {t('home.dueToday')}
          </span>
        )}
        <span className="text-slate-500">›</span>
      </motion.div>
    </Link>
  );
}

export default function HomePage() {
  const { state } = useApp();
  const t = useT();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto px-4 pt-10 pb-4"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{t('home.welcome')}</div>
          <div className="text-2xl font-bold">{state.user.name}</div>
        </div>
        <Streak />
      </div>

      <div className="mb-6">
        <LevelBadge />
      </div>

      <SearchBar />

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t('home.quickStart')}</div>
        <div className="grid grid-cols-3 gap-3">
          <QuickCard to="/decks" icon="➕" label={t('home.createDeck')} />
          <QuickCard to="/exam" icon="📝" label={t('home.takeExam')} />
          <QuickCard to="/math" icon="🔢" label={t('home.solveMath')} />
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t('home.yourDecks')}</div>
        {state.decks.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">{t('home.noDecks')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {state.decks.map(d => <DeckCard key={d.id} deck={d} t={t} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
