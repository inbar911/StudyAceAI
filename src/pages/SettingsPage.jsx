import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import Button from '../components/Button.jsx';
import { dictionaries } from '../i18n/index.js';
import { exportToFile, readImportFile } from '../utils/portability.js';

export default function SettingsPage() {
  const { state, setLang, setTheme, resetAll, importBackup } = useApp();
  const t = useT();
  const fileRef = useRef();
  const [msg, setMsg] = useState(null);

  function handleReset() {
    if (window.confirm(t('settings.confirmReset'))) resetAll();
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readImportFile(file);
      const replace = window.confirm(`Import ${data.decks.length} decks?\n\nOK = replace existing data\nCancel = merge with existing`);
      importBackup(data, replace ? 'replace' : 'merge');
      setMsg({ kind: 'ok', text: `Imported ${data.decks.length} decks` });
    } catch (err) {
      setMsg({ kind: 'err', text: err.message });
    } finally {
      e.target.value = '';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto px-4 pt-10"
    >
      <h1 className="text-2xl font-bold mb-8">{t('settings.title')}</h1>

      <Section label={t('settings.language')}>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(dictionaries).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${state.lang === l ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </Section>

      <Section label={t('settings.theme')}>
        <div className="flex gap-2">
          {['dark', 'light'].map(th => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${state.theme === th ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
            >
              {t(`settings.${th}`)}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Backup">
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        <div className="flex gap-2 flex-wrap">
          <Button variant="soft" onClick={() => exportToFile(state)}>⬇ Export data</Button>
          <Button variant="soft" onClick={() => fileRef.current.click()}>⬆ Import data</Button>
        </div>
        {msg && (
          <p className={`text-sm mt-3 ${msg.kind === 'ok' ? 'text-emerald-500' : 'text-rose-500'}`}>{msg.text}</p>
        )}
      </Section>

      <Section label="Danger zone">
        <Button variant="danger" onClick={handleReset}>{t('settings.reset')}</Button>
      </Section>
    </motion.div>
  );
}

function Section({ label, children }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-3">{label}</div>
      {children}
    </div>
  );
}
