import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition.js';
import { QUALITY } from '../utils/sm2.js';
import Button from '../components/Button.jsx';

function ProgressBar({ value }) {
  return (
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.4 }}
        className="h-full bg-brand-500 rounded-full"
      />
    </div>
  );
}

function EditCardModal({ card, onSave, onClose }) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="font-bold text-lg mb-4">Edit card</h2>
        <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Front</label>
        <textarea
          rows={2} value={front} onChange={e => setFront(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-brand-500 mb-3"
        />
        <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Back</label>
        <textarea
          rows={3} value={back} onChange={e => setBack(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-brand-500 mb-5"
        />
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={() => onSave(front.trim(), back.trim())}>Save</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DeckStudyPage() {
  const { id } = useParams();
  const { state, reviewCard, editCard: saveCardEdit } = useApp();
  const t = useT();
  const navigate = useNavigate();

  const deck = state.decks.find(d => d.id === id);
  const { dueCards, total, mastered, progress } = useSpacedRepetition(deck);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [editCard, setEditCard] = useState(null);

  if (!deck) return <div className="text-center pt-20 text-slate-400">Deck not found.</div>;

  function handleQuality(q) {
    const card = dueCards[idx];
    reviewCard(id, card.id, q);
    const gain = q === 0 ? 2 : q === 3 ? 5 : q === 4 ? 8 : 10;
    setXpEarned(x => x + gain);
    if (idx + 1 >= dueCards.length) { setDone(true); }
    else { setIdx(i => i + 1); setFlipped(false); }
  }

  if (done || dueCards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm mx-auto px-4 pt-20 text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">{t('deck.finished')}</h2>
        <p className="text-slate-400 mb-4">{t('deck.finishedSub')}</p>
        {xpEarned > 0 && <p className="text-brand-400 font-bold mb-6">+{xpEarned} {t('deck.xpEarned')}</p>}
        <div className="text-sm text-slate-400 mb-8">{mastered}/{total} mastered</div>
        <Button className="w-full" onClick={() => navigate('/')}>{t('nav.home')}</Button>
      </motion.div>
    );
  }

  const card = dueCards[idx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto px-4 pt-8"
    >
      {editCard && (
        <EditCardModal
          card={editCard}
          onSave={(front, back) => {
            saveCardEdit(id, editCard.id, front, back);
            setEditCard(null);
          }}
          onClose={() => setEditCard(null)}
        />
      )}

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-200">‹ {t('deck.back')}</button>
        <div className="flex-1"><ProgressBar value={progress} /></div>
        <span className="text-xs text-slate-400">{mastered}/{total}</span>
      </div>

      <div className="text-center mb-2">
        <span className="text-xs text-slate-500">{idx + 1} / {dueCards.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id + (flipped ? '-b' : '-f')}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={() => setFlipped(f => !f)}
          className="relative bg-slate-800/70 border border-slate-700 rounded-3xl p-8 min-h-[240px] flex flex-col items-center justify-center cursor-pointer select-none mb-4 hover:bg-slate-800 transition-colors"
        >
          <div className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full ${flipped ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-700 text-slate-400'}`}>
            {flipped ? 'Answer' : 'Question'}
          </div>
          <p className="text-xl font-semibold text-center leading-relaxed">
            {flipped ? card.back : card.front}
          </p>
          {!flipped && <p className="text-xs text-slate-500 mt-6">{t('deck.flip')}</p>}
          <button
            onClick={e => { e.stopPropagation(); setEditCard(card); }}
            className="absolute bottom-3 right-3 text-slate-600 hover:text-slate-400 text-xs"
          >✏️</button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-2"
          >
            {[
              { label: t('deck.again'), q: QUALITY.again, cls: 'bg-rose-600 hover:bg-rose-500' },
              { label: t('deck.hard'), q: QUALITY.hard, cls: 'bg-orange-600 hover:bg-orange-500' },
              { label: t('deck.good'), q: QUALITY.good, cls: 'bg-emerald-600 hover:bg-emerald-500' },
              { label: t('deck.easy'), q: QUALITY.easy, cls: 'bg-sky-600 hover:bg-sky-500' }
            ].map(({ label, q, cls }) => (
              <button
                key={q}
                onClick={() => handleQuality(q)}
                className={`${cls} text-white font-semibold rounded-xl py-3 text-sm transition-colors`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
