import { useApp } from '../context/AppContext.jsx';
import { t } from '../i18n/index.js';

export function useT() {
  const { state } = useApp();
  return (path) => t(state.lang, path);
}
