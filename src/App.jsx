import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext.jsx';
import { useT } from './hooks/useT.js';

const OnboardingPage = lazy(() => import('./pages/OnboardingPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const DeckCreatePage = lazy(() => import('./pages/DeckCreatePage.jsx'));
const DeckStudyPage = lazy(() => import('./pages/DeckStudyPage.jsx'));
const ExamPage = lazy(() => import('./pages/ExamPage.jsx'));
const MathPage = lazy(() => import('./pages/MathPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const StatsPage = lazy(() => import('./pages/StatsPage.jsx'));

function Loader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NavBar() {
  const t = useT();
  const links = [
    { to: '/', label: t('nav.home'), icon: '🏠', end: true },
    { to: '/decks', label: t('nav.decks'), icon: '📚' },
    { to: '/exam', label: t('nav.exam'), icon: '📝' },
    { to: '/math', label: t('nav.math'), icon: '🔢' },
    { to: '/stats', label: t('nav.stats'), icon: '📊' },
    { to: '/settings', label: t('nav.settings'), icon: '⚙️' }
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/90 dark:bg-slate-900/90 bg-white/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 safe-area-b">
      {links.map(({ to, label, icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors text-xs font-medium ${isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`
        }>
          <span className="text-lg leading-none">{icon}</span>
          <span className="hidden sm:block">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen pb-20 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {children}
      <NavBar />
    </div>
  );
}

export default function App() {
  const { state } = useApp();

  if (!state.onboarded) {
    return (
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <OnboardingPage />
        </Suspense>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/decks" element={<DeckCreatePage />} />
              <Route path="/decks/:id/study" element={<DeckStudyPage />} />
              <Route path="/exam" element={<ExamPage />} />
              <Route path="/math" element={<MathPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
