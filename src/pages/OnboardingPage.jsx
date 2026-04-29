import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import Button from '../components/Button.jsx';

const slides = [
  { icon: '🎓', titleKey: 'onboarding.s1Title', bodyKey: 'onboarding.s1Body' },
  { icon: '🧠', titleKey: 'onboarding.s2Title', bodyKey: 'onboarding.s2Body' },
  { icon: '🔥', titleKey: 'onboarding.s3Title', bodyKey: 'onboarding.s3Body' }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const { finishOnboarding } = useApp();
  const t = useT();
  const isLast = step === slides.length - 1;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-sm w-full"
        >
          <div className="text-7xl mb-8">{slides[step].icon}</div>
          <h1 className="text-2xl font-bold mb-3">{t(slides[step].titleKey)}</h1>
          <p className="text-slate-400 leading-relaxed mb-10">{t(slides[step].bodyKey)}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-brand-500' : 'w-2 bg-slate-700'}`} />
        ))}
      </div>

      <Button
        onClick={() => isLast ? finishOnboarding() : setStep(s => s + 1)}
        className="w-full max-w-xs"
      >
        {isLast ? t('onboarding.start') : t('onboarding.next')}
      </Button>
    </div>
  );
}
