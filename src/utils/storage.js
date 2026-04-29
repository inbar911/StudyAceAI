const KEY = 'studyace.v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function clearState() {
  try { localStorage.removeItem(KEY); } catch {}
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
