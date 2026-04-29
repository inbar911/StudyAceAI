import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../hooks/useT.js';
import { useApp } from '../context/AppContext.jsx';
import { useAI } from '../hooks/useAI.js';
import { solveMathFromImage } from '../api/claude.js';
import Button from '../components/Button.jsx';

export default function MathPage() {
  const t = useT();
  const { state } = useApp();
  const [preview, setPreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  const solver = useAI(useCallback(solveMathFromImage, []));

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];
      setPreview(dataUrl);
      setImageData({ base64, mediaType: file.type });
      setResult(null);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  async function solve() {
    if (!imageData) return;
    const res = await solver.run({ ...imageData, lang: state.lang });
    setResult(res);
  }

  function clear() {
    setPreview(null);
    setImageData(null);
    setResult(null);
    solver.reset();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 pt-10">
      <h1 className="text-2xl font-bold mb-1">{t('math.title')}</h1>
      <p className="text-slate-400 text-sm mb-6">{t('math.sub')}</p>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center py-16 cursor-pointer hover:border-brand-500 transition-colors"
        >
          <span className="text-4xl mb-3">📸</span>
          <Button variant="soft" className="mb-3" onClick={e => { e.stopPropagation(); inputRef.current.click(); }}>
            {t('math.upload')}
          </Button>
          <p className="text-xs text-slate-500">{t('math.drop')}</p>
        </div>
      ) : (
        <div className="mb-4">
          <img src={preview} alt="Math problem" className="w-full rounded-2xl border border-slate-700 mb-4 max-h-64 object-contain bg-slate-800" />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={clear}>{t('math.clear')}</Button>
            <Button className="flex-1" onClick={solve} disabled={solver.loading}>
              {solver.loading ? t('math.solving') : t('math.solve')}
            </Button>
          </div>
        </div>
      )}

      {solver.error && <p className="text-rose-400 text-sm mt-4">{solver.error}</p>}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            {result.problem && (
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-4">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">Problem</div>
                <p className="text-sm leading-relaxed">{result.problem}</p>
              </div>
            )}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-4">
              <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{t('math.steps')}</div>
              <ol className="list-decimal list-inside space-y-1.5">
                {result.steps.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed">{s}</li>
                ))}
              </ol>
            </div>
            {result.answer && (
              <div className="bg-brand-500/10 border border-brand-500/30 rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-brand-400 mb-1">{t('math.answer')}</div>
                <p className="text-lg font-bold text-brand-300">{result.answer}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
