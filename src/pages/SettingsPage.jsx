import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import Button from '../components/Button.jsx';
import { dictionaries } from '../i18n/index.js';

export default function SettingsPage() {
  const { state, setLang, setTheme, resetAll } = useApp();
  const t = useT();

  function handleReset() {
    if (window.confirm(t('settings.confirmReset'))) resetAll();
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
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${state.lang === l ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
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
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${state.theme === th ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {t(`settings.${th}`)}
            </button>
          ))}
        </div>
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
      <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{label}</div>
      {children}
    </div>
  );
}
