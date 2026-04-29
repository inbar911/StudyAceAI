import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useXP } from '../hooks/useXP.js';
import { useStreak } from '../hooks/useStreak.js';
import { levelFromXP, LEVELS } from '../utils/xp.js';
import { dueCount } from '../utils/sm2.js';

function StatCard({ label, value, sub, color = 'text-brand-400' }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col gap-1">
      <div className="text-xs uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

function DeckProgress({ deck }) {
  const mastered = deck.cards.filter(c => (c.sr?.repetition || 0) >= 3).length;
  const pct = deck.cards.length ? mastered / deck.cards.length : 0;
  const due = dueCount(deck.cards);
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm truncate flex-1">{deck.name}</span>
        <span className="text-xs text-slate-400 ml-2">{mastered}/{deck.cards.length}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-emerald-500 rounded-full"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{Math.round(pct * 100)}% mastered</span>
        {due > 0 && <span className="text-brand-400">{due} due</span>}
      </div>
    </div>
  );
}

function XPRoadmap({ xp }) {
  return (
    <div className="flex flex-col gap-2">
      {LEVELS.map((lvl, i) => {
        const next = LEVELS[i + 1];
        const reached = xp >= lvl.min;
        const progress = reached && next ? Math.min(1, (xp - lvl.min) / (next.min - lvl.min)) : reached ? 1 : 0;
        return (
          <div key={lvl.key} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${reached ? lvl.color : 'bg-slate-700'}`}>
              {lvl.emoji}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className={reached ? 'text-slate-200' : 'text-slate-500'}>{lvl.key}</span>
                <span className="text-slate-500">{lvl.min} XP</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`h-full rounded-full ${lvl.color}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StatsPage() {
  const { state } = useApp();
  const { xp, level } = useXP();
  const { count: streak, active: streakActive } = useStreak();

  const totalCards = state.decks.reduce((s, d) => s + d.cards.length, 0);
  const masteredCards = state.decks.reduce((s, d) => s + d.cards.filter(c => (c.sr?.repetition || 0) >= 3).length, 0);
  const totalDue = state.decks.reduce((s, d) => s + dueCount(d.cards), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 pt-10">
      <h1 className="text-2xl font-bold mb-6">Stats</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Total XP" value={xp} sub={`Level: ${level.key} ${level.emoji}`} />
        <StatCard label="Streak" value={`${streak}🔥`} sub={streakActive ? 'Active today' : 'Study today!'} color={streakActive ? 'text-orange-400' : 'text-slate-400'} />
        <StatCard label="Cards mastered" value={masteredCards} sub={`of ${totalCards} total`} color="text-emerald-400" />
        <StatCard label="Due today" value={totalDue} sub={totalDue === 0 ? 'All caught up!' : 'Go review'} color={totalDue > 0 ? 'text-brand-400' : 'text-emerald-400'} />
      </div>

      {state.decks.length > 0 && (
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Deck Progress</div>
          <div className="flex flex-col gap-2">
            {state.decks.map(d => <DeckProgress key={d.id} deck={d} />)}
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">XP Roadmap</div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
          <XPRoadmap xp={xp} />
        </div>
      </div>
    </motion.div>
  );
}
