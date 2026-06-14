import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, ArrowLeft, ArrowRight, Award, Sparkles, BookOpen } from 'lucide-react';
import { ALPHABET_DATA, CATEGORY_COLORS } from '../data';
import { speakText } from '../utils';
import LetterTracer from './LetterTracer';

interface AlphabetSectionProps {
  completedLetters: string[];
  toggleLetterComplete: (letter: string) => void;
}

export default function AlphabetSection({ completedLetters, toggleLetterComplete }: AlphabetSectionProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // List of all unique categories
  const categories = ['Semua', ...Array.from(new Set(ALPHABET_DATA.map(item => item.category)))];

  // Filter letters
  const filteredLetters = ALPHABET_DATA.filter(item => {
    return filterCategory === 'Semua' || item.category === filterCategory;
  });

  // Safe navigation index mapper
  const currentLetterItem = ALPHABET_DATA[selectedIdx];

  const selectLetter = (letterChar: string) => {
    const idx = ALPHABET_DATA.findIndex(item => item.letter === letterChar);
    if (idx !== -1) {
      setSelectedIdx(idx);
      const item = ALPHABET_DATA[idx];
      speakText(`Huruf ${item.letter}. ${item.word}.`);
      
      // Notify mascot companion with feedback (silent to prevent speaking conflicts)
      window.dispatchEvent(new CustomEvent('mascot-trigger', {
        detail: {
          message: `Huruf ${item.letter} untuk ${item.word}. Bagus kawan! Teruskan ya! 🌟`,
          triggerSpeak: false,
          animation: 'bounce'
        }
      }));
    }
  };

  const speakCurrent = () => {
    if (currentLetterItem) {
      speakText(`Huruf ${currentLetterItem.letter}. ${currentLetterItem.word}.`);
    }
  };

  const handleNext = () => {
    const nextIdx = (selectedIdx + 1) % ALPHABET_DATA.length;
    setSelectedIdx(nextIdx);
    const nextItem = ALPHABET_DATA[nextIdx];
    speakText(`Huruf ${nextItem.letter}. ${nextItem.word}.`);
    
    window.dispatchEvent(new CustomEvent('mascot-trigger', {
      detail: {
        message: `Ayo lihat huruf ${nextItem.letter} untuk ${nextItem.word}! Gambarnya lucu ya! 😊`,
        triggerSpeak: false,
        animation: 'bounce'
      }
    }));
  };

  const handlePrev = () => {
    const prevIdx = (selectedIdx - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    setSelectedIdx(prevIdx);
    const prevItem = ALPHABET_DATA[prevIdx];
    speakText(`Huruf ${prevItem.letter}. ${prevItem.word}.`);
    
    window.dispatchEvent(new CustomEvent('mascot-trigger', {
      detail: {
        message: `Mundur ke huruf ${prevItem.letter} untuk ${prevItem.word}! Semangat! ✨`,
        triggerSpeak: false,
        animation: 'bounce'
      }
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch" id="alphabet-container">
      {/* LEFT COLUMN: List / Grids in Bento Blue style */}
      <div className="lg:col-span-7 flex flex-col gap-5 order-2 lg:order-1">
        {/* Category filters inside a beautiful Bento block */}
        <div className="bg-[#eff6ff] p-5 rounded-[24px] border border-[#bfdbfe] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex flex-col gap-3">
          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#4f46e5]" />
            Kategori Huruf
          </label>
          <div className="flex flex-wrap gap-1.5" id="category-filters-container">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  filterCategory === cat
                    ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-xs'
                    : 'bg-white text-slate-600 border-[#e2e8f0] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Letters Grid Bento Block */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
              <span>🔤</span> Koleksi Huruf (A - Z)
            </h3>
            <span className="text-[10px] font-bold bg-[#eff6ff] text-[#4f46e5] border border-[#bfdbfe] px-2.5 py-0.5 rounded-full">
              {filteredLetters.length} Huruf
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 flex-grow" id="letters-grid">
            {filteredLetters.map((item) => {
              const globalIdx = ALPHABET_DATA.findIndex(a => a.letter === item.letter);
              const isActive = globalIdx === selectedIdx;
              const isCompleted = completedLetters.includes(item.letter);
              
              return (
                <motion.button
                  key={item.letter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectLetter(item.letter)}
                  id={`btn-letter-${item.letter}`}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2.5 border transition-all relative overflow-hidden cursor-pointer ${
                    isActive
                      ? 'border-[#4f46e5] bg-[#4f46e5] text-white shadow-sm font-black'
                      : 'border-slate-200 bg-white text-slate-850 hover:border-slate-350 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute top-1 left-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-2xs z-10" id={`badge-completed-${item.letter}`}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <span className="text-2xl font-black">{item.letter}</span>
                  <span className={`text-[9px] font-semibold mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.word}
                  </span>
                  {isActive && (
                    <div className="absolute top-1 right-1">
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {filteredLetters.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Belum ada huruf di kategori ini.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Bento Dashboard (Focus Card + Tracing Pad) */}
      <div className="lg:col-span-5 flex flex-col gap-5 order-1 lg:order-2">
        <motion.div 
          key={currentLetterItem.letter}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col flex-grow justify-between"
          id="active-letter-card"
        >
          {/* Subtle accent corner highlights */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

          {/* Upper navigation and Title row */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[currentLetterItem.category] || 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                {currentLetterItem.category}
              </span>

              <div className="flex gap-1">
                <button
                  onClick={handlePrev}
                  id="btn-prev-letter"
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 active:scale-90 transition-all cursor-pointer border border-slate-200"
                  title="Sebelumnya"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  id="btn-next-letter"
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 active:scale-90 transition-all cursor-pointer border border-slate-200"
                  title="Berikutnya"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Core visual display */}
            <div className="flex flex-col items-center text-center space-y-4 mb-5">
              <motion.div
                whileHover={{ scale: 1.06, rotate: [0, -2, 2, -2, 0] }}
                transition={{ duration: 0.3 }}
                onClick={speakCurrent}
                className="w-28 h-28 rounded-[24px] bg-[#eff6ff] flex items-center justify-center text-6xl shadow-inner border border-[#bfdbfe]/60 cursor-pointer relative group"
                id="active-letter-emoji"
              >
                {currentLetterItem.emoji}
                <div className="absolute bottom-1 right-1 p-1 bg-white rounded-lg shadow-sm group-hover:bg-[#4f46e5] group-hover:text-white transition-all border border-slate-100 text-[#4f46e5]">
                  <Volume2 className="w-3 h-3" />
                </div>
              </motion.div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fokus Hari Ini</p>
                <div className="flex items-baseline justify-center gap-2">
                  <h2 className="text-6xl font-black text-[#4f46e5]" id="current-letter-display">
                    {currentLetterItem.letter}
                  </h2>
                  <span className="text-4xl font-extrabold text-[#4f46e5]/70">
                    {currentLetterItem.letter.toLowerCase()}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-700 mt-1.5 flex items-center justify-center gap-1.5">
                  {currentLetterItem.word}
                  <button
                    onClick={speakCurrent}
                    id="btn-speak-word"
                    className="p-1 bg-[#eff6ff] hover:bg-[#bfdbfe]/50 text-[#4f46e5] rounded-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wide">
                  Ejaan: {currentLetterItem.letter} - a - r - i   {currentLetterItem.word}
                </p>

                <button
                  onClick={() => toggleLetterComplete(currentLetterItem.letter)}
                  className={`mt-3 px-4 py-1.5 rounded-full border text-[11px] font-extrabold flex items-center justify-center gap-1.5 mx-auto transition-all duration-200 cursor-pointer ${
                    completedLetters.includes(currentLetterItem.letter)
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
                  }`}
                  id={`btn-toggle-complete-${currentLetterItem.letter}`}
                >
                  {completedLetters.includes(currentLetterItem.letter) ? (
                    <>
                      <span>✓ Sudah Dipelajari</span>
                    </>
                  ) : (
                    <>
                      <span>Tandai Sudah Dipelajari</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Letter tracing whiteboard integrated inside selected Bento Box */}
          <div className="border-t border-slate-100 pt-5 flex justify-center w-full">
            <LetterTracer letter={currentLetterItem.letter} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
