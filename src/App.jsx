import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext.jsx';
import { useT } from './hooks/useT.js';
import OnboardingPage from './pages/OnboardingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import DeckCreatePage from './pages/DeckCreatePage.jsx';
import DeckStudyPage from './pages/DeckStudyPage.jsx';
import ExamPage from './pages/ExamPage.jsx';
import MathPage from './pages/MathPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import StatsPage from './pages/StatsPage.jsx';

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
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-around items-center h-16 safe-area-b">
      {links.map(({ to, label, icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors text-xs font-medium ${isActive ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'}`
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
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
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
        <OnboardingPage />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  );
}
