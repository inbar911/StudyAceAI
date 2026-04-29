import { useApp } from '../context/AppContext.jsx';
import { levelFromXP } from '../utils/xp.js';

export function useXP() {
  const { state } = useApp();
  return { xp: state.xp, level: levelFromXP(state.xp) };
}
