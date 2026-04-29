export default {
  app: { name: 'StudyAce', tagline: 'Learn smarter with AI' },
  nav: { home: 'Home', decks: 'Decks', exam: 'Exam', math: 'MathSnap', stats: 'Stats', settings: 'Settings' },
  home: {
    welcome: 'Welcome back',
    streakLabel: 'day streak',
    xpLabel: 'XP',
    levelLabel: 'Level',
    quickStart: 'Quick start',
    createDeck: 'Create a deck',
    takeExam: 'Take an exam',
    solveMath: 'Solve math',
    yourDecks: 'Your decks',
    noDecks: 'No decks yet — create your first one!',
    dueToday: 'Due today',
    cards: 'cards'
  },
  deck: {
    title: 'New deck',
    topicPlaceholder: 'Paste text or enter a topic (e.g. "French Revolution causes")',
    nameLabel: 'Deck name',
    namePlaceholder: 'My deck',
    countLabel: 'Number of cards',
    generate: 'Generate flashcards',
    generating: 'Generating with Claude…',
    delete: 'Delete deck',
    study: 'Study',
    practice: 'Practice exam',
    progress: 'Progress',
    back: 'Back',
    flip: 'Tap to flip',
    again: 'Again',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
    finished: 'Session complete!',
    finishedSub: 'Great work — come back tomorrow for due cards.',
    xpEarned: 'XP earned'
  },
  exam: {
    title: 'Mock exam',
    pickDeck: 'Pick a deck',
    start: 'Start exam',
    generating: 'Building exam…',
    submit: 'Submit',
    next: 'Next',
    score: 'Your score',
    review: 'Review answers',
    correct: 'Correct',
    incorrect: 'Incorrect',
    explanation: 'Explanation',
    finish: 'Finish'
  },
  math: {
    title: 'MathSnap',
    sub: 'Photograph a problem — Claude solves it step by step',
    upload: 'Upload photo',
    drop: 'Or drop an image here',
    solve: 'Solve',
    solving: 'Analyzing image…',
    steps: 'Step-by-step solution',
    answer: 'Final answer',
    clear: 'Clear'
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    reset: 'Reset all data',
    confirmReset: 'This deletes all decks, XP and streaks. Continue?'
  },
  onboarding: {
    s1Title: 'Welcome to StudyAce',
    s1Body: 'Your AI study buddy. Generate decks, take exams, solve math from a photo.',
    s2Title: 'Spaced repetition',
    s2Body: 'We schedule reviews using the SM-2 algorithm so you remember more in less time.',
    s3Title: 'Earn XP & streaks',
    s3Body: 'Review every day to keep your streak alive and level up.',
    next: 'Next',
    start: "Let's go"
  },
  levels: { Beginner: 'Beginner', Scholar: 'Scholar', Master: 'Master', Legend: 'Legend' },
  errors: {
    generic: 'Something went wrong. Please try again.',
    needKey: 'API key not configured on the server.'
  }
};
