export default {
  app: { name: 'StudyAce', tagline: 'ללמוד חכם יותר עם AI' },
  nav: { home: 'בית', decks: 'חפיסות', exam: 'מבחן', math: 'MathSnap', stats: 'סטטיסטיקה', settings: 'הגדרות' },
  home: {
    welcome: 'ברוך שובך',
    streakLabel: 'ימי רצף',
    xpLabel: 'נק׳ ניסיון',
    levelLabel: 'דרגה',
    quickStart: 'התחלה מהירה',
    createDeck: 'צור חפיסה',
    takeExam: 'בצע מבחן',
    solveMath: 'פתור תרגיל',
    yourDecks: 'החפיסות שלך',
    noDecks: 'אין עדיין חפיסות — צור את הראשונה!',
    dueToday: 'לתרגול היום',
    cards: 'כרטיסים'
  },
  deck: {
    title: 'חפיסה חדשה',
    topicPlaceholder: 'הדבק טקסט או הקלד נושא (לדוגמה: "סיבות המהפכה הצרפתית")',
    nameLabel: 'שם החפיסה',
    namePlaceholder: 'החפיסה שלי',
    countLabel: 'מספר כרטיסים',
    generate: 'צור כרטיסיות',
    generating: 'יוצר עם Claude…',
    delete: 'מחק חפיסה',
    study: 'לימוד',
    practice: 'מבחן תרגול',
    progress: 'התקדמות',
    back: 'חזרה',
    flip: 'הקש להפיכת הכרטיס',
    again: 'שוב',
    hard: 'קשה',
    good: 'טוב',
    easy: 'קל',
    finished: 'סיימת!',
    finishedSub: 'כל הכבוד — חזור מחר לכרטיסים נוספים.',
    xpEarned: 'נק׳ שהורווחו'
  },
  exam: {
    title: 'מבחן הדמיה',
    pickDeck: 'בחר חפיסה',
    start: 'התחל מבחן',
    generating: 'בונה מבחן…',
    submit: 'שלח',
    next: 'הבא',
    score: 'הציון שלך',
    review: 'סקור תשובות',
    correct: 'נכון',
    incorrect: 'שגוי',
    explanation: 'הסבר',
    finish: 'סיום'
  },
  math: {
    title: 'MathSnap',
    sub: 'צלם תרגיל — Claude יפתור צעד-צעד',
    upload: 'העלה תמונה',
    drop: 'או גרור תמונה לכאן',
    solve: 'פתור',
    solving: 'מנתח תמונה…',
    steps: 'פתרון צעד-צעד',
    answer: 'תשובה סופית',
    clear: 'נקה'
  },
  settings: {
    title: 'הגדרות',
    language: 'שפה',
    theme: 'ערכת נושא',
    dark: 'כהה',
    light: 'בהיר',
    reset: 'איפוס מלא',
    confirmReset: 'פעולה זו תמחק חפיסות, נק׳ ורצפים. להמשיך?'
  },
  onboarding: {
    s1Title: 'ברוך הבא ל-StudyAce',
    s1Body: 'חבר ה-AI ללימודים. צור חפיסות, בצע מבחנים, פתור תרגילים מתמונה.',
    s2Title: 'חזרה מרווחת',
    s2Body: 'תזמון חזרות באלגוריתם SM-2 — תזכור יותר בפחות זמן.',
    s3Title: 'נק׳ ורצפים',
    s3Body: 'תרגל מדי יום ושמור על הרצף שלך.',
    next: 'הבא',
    start: 'יוצאים לדרך'
  },
  levels: { Beginner: 'מתחיל', Scholar: 'תלמיד', Master: 'מאסטר', Legend: 'אגדה' },
  errors: {
    generic: 'אופס, משהו השתבש. נסה שוב.',
    needKey: 'מפתח API לא מוגדר בשרת.'
  }
};
