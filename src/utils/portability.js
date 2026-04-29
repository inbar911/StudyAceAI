const VERSION = 1;

export function exportToFile(state) {
  const payload = {
    app: 'studyace',
    version: VERSION,
    exportedAt: new Date().toISOString(),
    decks: state.decks,
    xp: state.xp,
    streak: state.streak
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `studyace-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readImportFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (data.app !== 'studyace') throw new Error('Not a StudyAce backup');
  if (!Array.isArray(data.decks)) throw new Error('Missing decks');
  return data;
}
