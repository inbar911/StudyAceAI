import { motion } from 'framer-motion';
import { useStreak } from '../hooks/useStreak.js';
import { useT } from '../hooks/useT.js';

export default function Streak({ compact = false }) {
  const { count, active } = useStreak();
  const t = useT();
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${active ? 'bg-orange-500/15 text-orange-400' : 'bg-slate-700/40 text-slate-400'}`}
    >
      <span className={`text-lg ${active ? 'animate-pulse' : 'grayscale opacity-60'}`}>🔥</span>
      <span className="font-semibold tabular-nums">{count}</span>
      {!compact && <span className="text-xs opacity-80">{t('home.streakLabel')}</span>}
    </motion.div>
  );
}
