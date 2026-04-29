import { motion } from 'framer-motion';
import { useXP } from '../hooks/useXP.js';
import { useT } from '../hooks/useT.js';

export default function LevelBadge({ showBar = true }) {
  const { xp, level } = useXP();
  const t = useT();
  return (
    <div className="flex flex-col gap-2 min-w-[160px]">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${level.color} text-white text-base shadow`}>
          {level.emoji}
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-xs uppercase tracking-wide text-slate-400">{t('home.levelLabel')}</span>
          <span className="font-semibold text-sm">{t(`levels.${level.key}`)}</span>
        </div>
        <div className="ms-auto text-end">
          <div className="text-xs text-slate-400">{t('home.xpLabel')}</div>
          <div className="font-bold tabular-nums">{xp}</div>
        </div>
      </div>
      {showBar && level.next && (
        <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level.progress * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full ${level.color}`}
          />
        </div>
      )}
    </div>
  );
}
