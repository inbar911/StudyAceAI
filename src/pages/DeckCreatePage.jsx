import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import { useAI } from '../hooks/useAI.js';
import { generateFlashcards, generateFlashcardsFromImage } from '../api/claude.js';
import { compressImage } from '../utils/image.js';
import Button from '../components/Button.jsx';

export default function DeckCreatePage() {
  const { state, addDeck, deleteDeck } = useApp();
  const { lang } = state;
  const t = useT();
  const navigate = useNavigate();

  const [mode, setMode] = useState('text');
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [count, setCount] = useState(10);
  const [imageData, setImageData] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const gen = useAI(useCallback(generateFlashcards, []));
  const genImg = useAI(useCallback(generateFlashcardsFromImage, []));

  async function handleGenerate(e) {
    e.preventDefault();
    if (mode === 'text') {
      if (!topic.trim()) return;
      const cards = await gen.run({ topic: topic.trim(), count, lang });
      const deck = addDeck(name.trim() || topic.trim().slice(0, 40), cards);
      navigate(`/decks/${deck.id}/study`);
    } else {
      if (!imageData) return;
      const cards = await genImg.run({ ...imageData, count, lang });
      const deck = addDeck(name.trim() || `Photo deck ${new Date().toLocaleDateString()}`, cards);
      navigate(`/decks/${deck.id}/study`);
    }
  }

  async function handleFile(file) {
    const c = await compressImage(file, 1024, 0.85);
    if (c) { setImageData({ base64: c.base64, mediaType: c.mediaType }); setPreview(c.dataUrl); }
  }

  const loading = gen.loading || genImg.loading;
  const error = gen.error || genImg.error;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 pt-10">
      <h1 className="text-2xl font-bold mb-6">{t('deck.title')}</h1>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setMode('text')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'text' ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>📝 From text</button>
        <button onClick={() => setMode('photo')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'photo' ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>📸 From photo</button>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4 mb-10">
        {mode === 'text' ? (
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('deck.topicPlaceholder')}</label>
            <textarea
              rows={4}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder={t('deck.topicPlaceholder')}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        ) : (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {!preview ? (
              <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center py-12 cursor-pointer hover:border-brand-500 transition-colors">
                <span className="text-4xl mb-2">📚</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tap to upload textbook page or notes</p>
              </div>
            ) : (
              <div>
                <img src={preview} alt="" className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 max-h-56 object-contain bg-slate-100 dark:bg-slate-800 mb-2" />
                <button type="button" onClick={() => { setPreview(null); setImageData(null); }} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Clear</button>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('deck.nameLabel')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('deck.namePlaceholder')}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
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
        {error && <p className="text-rose-500 text-sm">{error}</p>}
        <Button type="submit" disabled={(mode === 'text' ? !topic.trim() : !imageData) || loading} className="w-full">
          {loading ? t('deck.generating') : t('deck.generate')}
        </Button>
      </form>

      {state.decks.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t('home.yourDecks')}</div>
          <div className="flex flex-col gap-2">
            {state.decks.map(d => (
              <div key={d.id} className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/decks/${d.id}/study`)}>
                  <div className="font-semibold truncate">{d.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{d.cards.length} {t('home.cards')}</div>
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
