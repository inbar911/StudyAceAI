import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useT } from '../hooks/useT.js';
import { useAI } from '../hooks/useAI.js';
import { generateExam, gradeShortAnswer } from '../api/claude.js';
import Button from '../components/Button.jsx';
import { XP_REWARDS } from '../utils/xp.js';

function ScoreDisplay({ score, total, onFinish, t }) {
  const pct = Math.round((score / total) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-sm mx-auto pt-16 px-4"
    >
      <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
      <h2 className="text-3xl font-bold mb-1">{pct}%</h2>
      <p className="text-slate-400 mb-8">{score}/{total} {t('exam.score')}</p>
      <Button className="w-full" onClick={onFinish}>{t('exam.finish')}</Button>
    </motion.div>
  );
}

export default function ExamPage() {
  const { state, awardExamXP } = useApp();
  const t = useT();
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shortInput, setShortInput] = useState('');
  const [graded, setGraded] = useState({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('pick'); // pick | exam | done

  const gen = useAI(useCallback(generateExam, []));
  const gradeAI = useAI(useCallback(gradeShortAnswer, []));

  async function startExam() {
    const deck = state.decks.find(d => d.id === selectedDeck);
    if (!deck) return;
    const qs = await gen.run({ deck, lang: state.lang, count: 5 });
    setQuestions(qs);
    setQIdx(0);
    setAnswers({});
    setGraded({});
    setScore(0);
    setFinished(false);
    setPhase('exam');
  }

  const q = questions[qIdx];

  async function handleAnswer(answer) {
    const key = qIdx;
    let correct = false;
    if (q.type === 'mcq') {
      correct = answer === q.answer;
      setGraded(g => ({ ...g, [key]: { correct, explanation: q.explanation } }));
    } else {
      const result = await gradeAI.run({ question: q.q, answer, expected: q.answer, lang: state.lang });
      correct = result.correct;
      setGraded(g => ({ ...g, [key]: result }));
    }
    setAnswers(a => ({ ...a, [key]: answer }));
    if (correct) setScore(s => s + 1);
  }

  function next() {
    if (qIdx + 1 >= questions.length) {
      const xp = score * XP_REWARDS.examQuestionCorrect + (score === questions.length ? XP_REWARDS.examPerfect : 0);
      awardExamXP(xp);
      setPhase('done');
    } else {
      setQIdx(i => i + 1);
      setShortInput('');
    }
  }

  if (phase === 'pick') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 pt-10">
        <h1 className="text-2xl font-bold mb-6">{t('exam.title')}</h1>
        <p className="text-sm text-slate-400 mb-4">{t('exam.pickDeck')}</p>
        <div className="flex flex-col gap-2 mb-6">
          {state.decks.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDeck(d.id)}
              className={`text-left p-4 rounded-xl border transition-colors ${selectedDeck === d.id ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50'}`}
            >
              <div className="font-semibold">{d.name}</div>
              <div className="text-xs text-slate-400">{d.cards.length} {t('home.cards')}</div>
            </button>
          ))}
          {state.decks.length === 0 && <p className="text-slate-500 text-sm">{t('home.noDecks')}</p>}
        </div>
        {gen.error && <p className="text-rose-400 text-sm mb-3">{gen.error}</p>}
        <Button disabled={!selectedDeck || gen.loading} className="w-full" onClick={startExam}>
          {gen.loading ? t('exam.generating') : t('exam.start')}
        </Button>
      </motion.div>
    );
  }

  if (phase === 'done') {
    return <ScoreDisplay score={score} total={questions.length} onFinish={() => setPhase('pick')} t={t} />;
  }

  const answered = answers[qIdx] !== undefined;
  const result = graded[qIdx];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-slate-400">{qIdx + 1} / {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 w-6 rounded-full ${i < qIdx ? 'bg-brand-500' : i === qIdx ? 'bg-slate-500' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
          <h2 className="text-lg font-semibold mb-5 leading-snug">{q.q}</h2>

          {q.type === 'mcq' ? (
            <div className="flex flex-col gap-2 mb-4">
              {q.choices.map(c => {
                let cls = 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50';
                if (answered) {
                  if (c === q.answer) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                  else if (c === answers[qIdx] && c !== q.answer) cls = 'border-rose-500 bg-rose-500/10 text-rose-400';
                }
                return (
                  <button key={c} disabled={answered} onClick={() => handleAnswer(c)}
                    className={`text-left p-4 rounded-xl border transition-colors ${cls}`}>
                    {c}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mb-4">
              <textarea rows={3} value={shortInput} onChange={e => setShortInput(e.target.value)} disabled={answered}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-brand-500 mb-3"
                placeholder="Type your answer…"
              />
              {!answered && (
                <Button disabled={!shortInput.trim() || gradeAI.loading} onClick={() => handleAnswer(shortInput.trim())} className="w-full">
                  {gradeAI.loading ? 'Grading…' : t('exam.submit')}
                </Button>
              )}
            </div>
          )}

          {result && (
            <div className={`rounded-xl p-4 mb-4 text-sm ${result.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'}`}>
              <span className="font-bold">{result.correct ? t('exam.correct') : t('exam.incorrect')}</span>
              {result.explanation && <p className="mt-1 text-xs opacity-80">{result.explanation}</p>}
            </div>
          )}

          {answered && (
            <Button className="w-full" onClick={next}>
              {qIdx + 1 >= questions.length ? 'See results' : t('exam.next')}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
