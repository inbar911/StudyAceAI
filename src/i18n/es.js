export default {
  app: { name: 'StudyAce', tagline: 'Aprende mejor con IA' },
  nav: { home: 'Inicio', decks: 'Mazos', exam: 'Examen', math: 'MathSnap', stats: 'Stats', settings: 'Ajustes' },
  home: {
    welcome: 'Bienvenido',
    streakLabel: 'días seguidos',
    xpLabel: 'XP',
    levelLabel: 'Nivel',
    quickStart: 'Inicio rápido',
    createDeck: 'Crear un mazo',
    takeExam: 'Hacer examen',
    solveMath: 'Resolver mate',
    yourDecks: 'Tus mazos',
    noDecks: '¡Aún no hay mazos — crea el primero!',
    dueToday: 'Para hoy',
    cards: 'tarjetas'
  },
  deck: {
    title: 'Nuevo mazo',
    topicPlaceholder: 'Pega un texto o escribe un tema (ej. "Causas de la Revolución Francesa")',
    nameLabel: 'Nombre del mazo',
    namePlaceholder: 'Mi mazo',
    countLabel: 'Número de tarjetas',
    generate: 'Generar tarjetas',
    generating: 'Generando con Claude…',
    delete: 'Eliminar mazo',
    study: 'Estudiar',
    practice: 'Examen práctica',
    progress: 'Progreso',
    back: 'Atrás',
    flip: 'Toca para girar',
    again: 'Otra',
    hard: 'Difícil',
    good: 'Bien',
    easy: 'Fácil',
    finished: '¡Sesión completa!',
    finishedSub: 'Buen trabajo — vuelve mañana para más tarjetas.',
    xpEarned: 'XP obtenidos'
  },
  exam: {
    title: 'Examen simulado',
    pickDeck: 'Elige un mazo',
    start: 'Empezar examen',
    generating: 'Creando examen…',
    submit: 'Enviar',
    next: 'Siguiente',
    score: 'Tu puntaje',
    review: 'Revisar respuestas',
    correct: 'Correcto',
    incorrect: 'Incorrecto',
    explanation: 'Explicación',
    finish: 'Terminar'
  },
  math: {
    title: 'MathSnap',
    sub: 'Fotografía un problema — Claude lo resuelve paso a paso',
    upload: 'Subir foto',
    drop: 'O suelta una imagen aquí',
    solve: 'Resolver',
    solving: 'Analizando imagen…',
    steps: 'Solución paso a paso',
    answer: 'Respuesta final',
    clear: 'Limpiar'
  },
  settings: {
    title: 'Ajustes',
    language: 'Idioma',
    theme: 'Tema',
    dark: 'Oscuro',
    light: 'Claro',
    reset: 'Restablecer todo',
    confirmReset: 'Esto borra mazos, XP y rachas. ¿Continuar?'
  },
  onboarding: {
    s1Title: 'Bienvenido a StudyAce',
    s1Body: 'Tu compañero de estudio con IA. Genera mazos, haz exámenes, resuelve mate desde una foto.',
    s2Title: 'Repetición espaciada',
    s2Body: 'Programamos repasos con el algoritmo SM-2 para que recuerdes más en menos tiempo.',
    s3Title: 'XP y rachas',
    s3Body: 'Repasa cada día para mantener tu racha y subir de nivel.',
    next: 'Siguiente',
    start: '¡Empezar!'
  },
  levels: { Beginner: 'Principiante', Scholar: 'Estudiante', Master: 'Maestro', Legend: 'Leyenda' },
  errors: {
    generic: 'Algo salió mal. Inténtalo de nuevo.',
    needKey: 'La clave API no está configurada en el servidor.'
  }
};
