import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import { useAI } from '../hooks/useAI.js';
import { generateFlashcards } from '../api/claude.js';
import Button from '../components/Button.jsx';

export default function DeckCreatePage() {
  const { state, addDeck, deleteDeck } = useApp();
  const { lang } = state;
  const t = useT();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [count, setCount] = useState(10);

  const gen = useAI(useCallback(generateFlashcards, []));

  async function handleGenerate(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    const cards = await gen.run({ topic: topic.trim(), count, lang });
    const deck = addDeck(name.trim() || topic.trim().slice(0, 40), cards);
    navigate(`/decks/${deck.id}/study`);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto px-4 pt-10"
    >
      <h1 className="text-2xl font-bold mb-6">{t('deck.title')}</h1>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4 mb-10">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('deck.topicPlaceholder')}</label>
          <textarea
            rows={4}
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={t('deck.topicPlaceholder')}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('deck.nameLabel')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('deck.namePlaceholder')}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('deck.countLabel')}: {count}</label>
          <input
            type="range" min={5} max={30} value={count}
            onChange={e => setCount(+e.target.value)}
            className="w-full accent-brand-500"
          />
        </div>
        {gen.error && <p className="text-rose-400 text-sm">{gen.error}</p>}
        <Button type="submit" disabled={!topic.trim() || gen.loading} className="w-full">
          {gen.loading ? t('deck.generating') : t('deck.generate')}
        </Button>
      </form>

      {state.decks.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t('home.yourDecks')}</div>
          <div className="flex flex-col gap-2">
            {state.decks.map(d => (
              <div key={d.id} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/decks/${d.id}/study`)}>
                  <div className="font-semibold truncate">{d.name}</div>
                  <div className="text-xs text-slate-400">{d.cards.length} {t('home.cards')}</div>
                </div>
                <button
                  onClick={() => window.confirm(t('deck.delete') + '?') && deleteDeck(d.id)}
                  className="text-rose-500 hover:text-rose-400 text-sm px-2"
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
