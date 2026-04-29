import { useApp } from '../context/AppContext.jsx';
import { todayKey } from '../utils/storage.js';

export function useStreak() {
  const { state } = useApp();
  const active = state.streak.lastDay === todayKey();
  return { count: state.streak.count, active };
}
