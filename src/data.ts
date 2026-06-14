import { LetterItem } from './types';

export const ALPHABET_DATA: LetterItem[] = [
  { letter: 'A', word: 'Apel', emoji: '🍎', category: 'Buah-buahan' },
  { letter: 'B', word: 'Buku', emoji: '📘', category: 'Benda' },
  { letter: 'C', word: 'Chat/Cangkir', emoji: '☕', category: 'Benda' },
  { letter: 'D', word: 'Domba', emoji: '🐑', category: 'Hewan' },
  { letter: 'E', word: 'Elang', emoji: '🦅', category: 'Hewan' },
  { letter: 'F', word: 'Feri', emoji: '🚢', category: 'Kendaraan' },
  { letter: 'G', word: 'Gajah', emoji: '🐘', category: 'Hewan' },
  { letter: 'H', word: 'Harimau', emoji: '🐯', category: 'Hewan' },
  { letter: 'I', word: 'Ikan', emoji: '🐟', category: 'Hewan' },
  { letter: 'J', word: 'Jeruk', emoji: '🍊', category: 'Buah-buahan' },
  { letter: 'K', word: 'Kucing', emoji: '🐱', category: 'Hewan' },
  { letter: 'L', word: 'Lemon', emoji: '🍋', category: 'Buah-buahan' },
  { letter: 'M', word: 'Monyet', emoji: '🐒', category: 'Hewan' },
  { letter: 'N', word: 'Nanas', emoji: '🍍', category: 'Buah-buahan' },
  { letter: 'O', word: 'Obat', emoji: '💊', category: 'Benda' },
  { letter: 'P', word: 'Pisang', emoji: '🍌', category: 'Buah-buahan' },
  { letter: 'Q', word: 'Quran', emoji: '📖', category: 'Benda' },
  { letter: 'R', word: 'Roti', emoji: '🍞', category: 'Makanan' },
  { letter: 'S', word: 'Sapi', emoji: '🐄', category: 'Hewan' },
  { letter: 'T', word: 'Topi', emoji: '🎩', category: 'Pakaian' },
  { letter: 'U', word: 'Udang', emoji: '🦐', category: 'Hewan' },
  { letter: 'V', word: 'Vas Bunga', emoji: '🏺', category: 'Benda' },
  { letter: 'W', word: 'Wortel', emoji: '🥕', category: 'Sayuran' },
  { letter: 'X', word: 'Xilofon', emoji: '🪘', category: 'Alat Musik' },
  { letter: 'Y', word: 'Yo-yo', emoji: '🪀', category: 'Mainan' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', category: 'Hewan' },
];

export const FUN_EMOJIS = ['⭐', '🎈', '🎨', '🚀', '🌈', '🧩', '🍓', '🐾', '⚽', '🍦'];

export const CATEGORY_COLORS: Record<string, string> = {
  'Buah-buahan': 'bg-rose-50 text-rose-700 border-rose-100',
  'Sayuran': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Hewan': 'bg-amber-50 text-amber-700 border-amber-100',
  'Benda': 'bg-sky-50 text-sky-700 border-sky-100',
  'Kendaraan': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Makanan': 'bg-orange-50 text-orange-700 border-orange-100',
  'Mainan': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  'Alat Musik': 'bg-violet-50 text-violet-700 border-violet-100',
  'Pakaian': 'bg-teal-50 text-teal-700 border-teal-100',
};
