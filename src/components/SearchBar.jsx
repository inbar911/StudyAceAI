import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function SearchBar() {
  const { state } = useApp();
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const out = [];
    for (const d of state.decks) {
      if (d.name.toLowerCase().includes(query)) {
        out.push({ kind: 'deck', deck: d });
      }
      for (const c of d.cards) {
        if (
          c.front.toLowerCase().includes(query) ||
          c.back.toLowerCase().includes(query)
        ) {
          out.push({ kind: 'card', deck: d, card: c });
          if (out.length >= 20) break;
        }
      }
      if (out.length >= 20) break;
    }
    return out;
  }, [q, state.decks]);

  return (
    <div className="mb-6">
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="🔍 Search decks and cards…"
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
      />
      {q.trim() && (
        <div className="mt-2 max-h-72 overflow-y-auto bg-slate-900/80 border border-slate-700 rounded-xl">
          {results.length === 0 ? (
            <div className="text-xs text-slate-500 p-3">No matches</div>
          ) : (
            results.map((r, i) => (
              <Link
                key={i}
                to={`/decks/${r.deck.id}/study`}
                onClick={() => setQ('')}
                className="block px-3 py-2 border-b border-slate-800 last:border-0 hover:bg-slate-800/50"
              >
                <div className="text-xs text-slate-500 mb-0.5">
                  {r.kind === 'deck' ? '📚 Deck' : '🃏 Card'} · {r.deck.name}
                </div>
                <div className="text-sm truncate">
                  {r.kind === 'deck' ? r.deck.name : r.card.front}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
