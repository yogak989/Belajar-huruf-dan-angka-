export interface LetterItem {
  letter: string; // e.g. 'A'
  word: string; // e.g. 'Apel'
  emoji: string; // e.g. '🍎'
  category: string; // e.g. 'Buah' (Fruit), 'Hewan' (Animal)
}

export interface QuizQuestion {
  id: string;
  type: 'LETTER_SOUND' | 'NUMBER_SOUND' | 'LETTER_IMAGE' | 'COUNT_EMOJI' | 'COMPLETE_SEQUENCE';
  questionText: string;
  speakText?: string; // Text to speak via TTS
  options: string[]; // Options to choose from
  correctAnswer: string;
  visualData?: any; // Emojis or patterns to count
}

export type ActiveTab = 'home' | 'letters' | 'numbers' | 'quiz' | 'writing';
export type QuizMode = 'setup' | 'playing' | 'score';
export type QuizCategory = 'all' | 'letters' | 'numbers';
