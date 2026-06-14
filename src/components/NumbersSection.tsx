import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, ChevronLeft, ChevronRight, Hash, Sparkles } from 'lucide-react';
import { spelledNumberIndonesian, speakText } from '../utils';

interface NumbersSectionProps {
  completedNumbers: number[];
  toggleNumberComplete: (num: number) => void;
}

export default function NumbersSection({ completedNumbers, toggleNumberComplete }: NumbersSectionProps) {
  const [selectedNum, setSelectedNum] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'visual'>('grid');

  const numbersList = Array.from({ length: 100 }, (_, i) => i + 1);

  const selectNumber = (num: number) => {
    setSelectedNum(num);
    const spelled = spelledNumberIndonesian(num);
    speakText(`${num}. ${spelled}.`);
    
    // Notify mascot companion with feedback (silent to prevent speaking conflicts)
    window.dispatchEvent(new CustomEvent('mascot-trigger', {
      detail: {
        message: `Angka ${num} dibaca "${spelled}"! Wah, kamu hebat sekali! 🔢⭐`,
        triggerSpeak: false,
        animation: 'bounce'
      }
    }));
  };

  const handleNext = () => {
    if (selectedNum < 100) {
      const nextNum = selectedNum + 1;
      setSelectedNum(nextNum);
      const spelled = spelledNumberIndonesian(nextNum);
      speakText(`${nextNum}. ${spelled}.`);
      
      window.dispatchEvent(new CustomEvent('mascot-trigger', {
        detail: {
          message: `Angka berikutnya adalah ${nextNum} ("${spelled}"). Laju belajarmu cepat! 🚀`,
          triggerSpeak: false,
          animation: 'bounce'
        }
      }));
    }
  };

  const handlePrev = () => {
    if (selectedNum > 1) {
      const prevNum = selectedNum - 1;
      setSelectedNum(prevNum);
      const spelled = spelledNumberIndonesian(prevNum);
      speakText(`${prevNum}. ${spelled}.`);
      
      window.dispatchEvent(new CustomEvent('mascot-trigger', {
        detail: {
          message: `Mundur ke angka ${prevNum} ("${spelled}"). Bagus kawan! 🌈`,
          triggerSpeak: false,
          animation: 'bounce'
        }
      }));
    }
  };

  const speakCurrentNum = () => {
    speakText(`${selectedNum}. ${spelledNumberIndonesian(selectedNum)}.`);
  };

  // Helper to color grid cells based on their decade
  const getDecadeClass = (num: number, isActive: boolean) => {
    if (isActive) {
      return 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-500/15 shadow-md relative z-10 font-black';
    }

    const decade = Math.floor((num - 1) / 10);
    const decadeStyles: Record<number, string> = {
      0: 'bg-rose-50 text-rose-700 hover:bg-rose-100/70 border-rose-100/55',      // 1-10
      1: 'bg-orange-50 text-orange-700 hover:bg-orange-100/70 border-orange-100/55', // 11-20
      2: 'bg-amber-50 text-amber-700 hover:bg-amber-100/70 border-amber-100/55',   // 21-30
      3: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 border-emerald-100/55', // 31-40
      4: 'bg-teal-50 text-teal-700 hover:bg-teal-100/70 border-teal-100/55',      // 41-50
      5: 'bg-sky-50 text-sky-700 hover:bg-sky-100/70 border-sky-100/55',         // 51-60
      6: 'bg-blue-50 text-blue-700 hover:bg-blue-100/70 border-blue-100/55',       // 61-70
      7: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100/70 border-indigo-100/55', // 71-80
      8: 'bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100/70 border-fuchsia-100/55', // 81-90
      9: 'bg-purple-50 text-purple-700 hover:bg-purple-100/70 border-purple-100/55', // 91-100
    };

    return `${decadeStyles[decade] || 'bg-slate-50 text-slate-700'} border`;
  };

  // Calculate decimal grouping for beautiful visualization
  const tens = Math.floor(selectedNum / 10);
  const ones = selectedNum % 10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch" id="numbers-container">
      {/* LEFT COLUMN: Numbers Grid */}
      <div className="lg:col-span-7 flex flex-col gap-5 order-2 lg:order-1">
        {/* Toggle Mode headers within Bento panel */}
        <div className="bg-white p-1.5 rounded-[24px] border border-slate-200/60 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'bg-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            📋 Grid 1 - 100
          </button>
          <button
            onClick={() => setViewMode('visual')}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'bg-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            ⭐ Visual Block Pembelajaran
          </button>
        </div>

        {/* View Mode 1: Grid 1-100 */}
        {viewMode === 'grid' && (
          <div className="bg-[#f0fdf4] p-6 rounded-[24px] border border-[#bbf7d0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-emerald-600" />
                Angka Populer (1 - 100)
              </h3>
              <p className="text-[10px] bg-white text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-[#bbf7d0]">
                Klik angka untuk suara
              </p>
            </div>

            <div className="grid grid-cols-10 gap-1.5 text-center overflow-x-auto" id="numbers-grid-100">
              {numbersList.map((num) => {
                const isActive = num === selectedNum;
                const isCompleted = completedNumbers.includes(num);
                return (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectNumber(num)}
                    id={`btn-num-${num}`}
                    className={`aspect-square min-w-[32px] rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer relative ${getDecadeClass(num, isActive)}`}
                  >
                    {num}
                    {isCompleted && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" id={`dot-completed-${num}`} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 2: Visual Base Tens Block explanation */}
        {viewMode === 'visual' && (
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] space-y-6 flex-grow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Skema Kelompok Angka</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Memahami cara angka puluhan dikoordinasikan</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-[#bbf7d0] px-3 py-1 rounded-full">
                Konsep Puluhan & Satuan
              </span>
            </div>

            {/* Visualizer Blocks representing Decimals */}
            <div className="space-y-4" id="visual-tens-container">
              {/* Decimal Sets (Puluhan) */}
              {tens > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {tens} Blok Puluhan ({tens * 10})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Array.from({ length: tens }).map((_, blockIdx) => (
                      <div 
                        key={blockIdx} 
                        className="bg-[#f0fdf4]/50 border border-[#bbf7d0]/60 rounded-2xl p-3 flex flex-col justify-center"
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-black text-emerald-700">Blok {blockIdx + 1}</span>
                          <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-[#bbf7d0]">10 Item</span>
                        </div>
                        {/* 10 shiny dots representation */}
                        <div className="flex gap-1 flex-wrap">
                          {Array.from({ length: 10 }).map((_, d) => (
                            <span key={d} className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-2xs" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Units Remaining (Satuan) */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Blok Satuan ({ones})
                </h4>
                {ones > 0 ? (
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex flex-col justify-center min-h-[75px]">
                    <div className="flex gap-1.5 flex-wrap">
                      {Array.from({ length: ones }).map((_, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="w-4 h-4 bg-emerald-500 rounded-full shadow-2xs flex items-center justify-center text-[8px] text-white font-bold"
                        >
                          {idx + 1}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50/80 text-center py-4 rounded-xl text-xs text-slate-400 border border-slate-150">
                    Tidak ada satuan tersisa (angka bulat)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Active Number Dashboard */}
      <div className="lg:col-span-5 flex flex-col gap-5 order-1 lg:order-2">
        <motion.div
          key={selectedNum}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between flex-grow"
          id="active-number-card"
        >
          {/* Faint ambient circle background element */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

          {/* Number Navigation steps */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f0fdf4] border border-[#bbf7d0] text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Rentang {Math.floor((selectedNum - 1) / 10) * 10 + 1} - {Math.floor((selectedNum - 1) / 10) * 10 + 10}
              </span>

              <div className="flex gap-1.5">
                <button
                  onClick={handlePrev}
                  disabled={selectedNum <= 1}
                  id="btn-prev-number"
                  className={`p-1.5 rounded-lg active:scale-90 transition-all cursor-pointer border ${
                    selectedNum <= 1
                      ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedNum >= 100}
                  id="btn-next-number"
                  className={`p-1.5 rounded-lg active:scale-90 transition-all cursor-pointer border ${
                    selectedNum >= 100
                      ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Core Display Panel */}
            <div className="flex flex-col items-center text-center space-y-4 mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fokus Angka</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={speakCurrentNum}
                className="w-32 h-32 rounded-full bg-[#f0fdf4] flex items-center justify-center border-4 border-emerald-100 shadow-inner cursor-pointer relative group"
                id="active-number-ball"
              >
                <span className="text-5xl font-black text-emerald-800" id="current-number-display">
                  {selectedNum}
                </span>
                <div className="absolute bottom-1 right-1 p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 text-emerald-700 group-hover:bg-[#4f46e5] group-hover:text-white transition-all">
                  <Volume2 className="w-3 h-3" />
                </div>
              </motion.div>

              <div className="w-full">
                <h3 className="text-xl font-extrabold text-slate-800 capitalize" id="current-number-spelled">
                  {spelledNumberIndonesian(selectedNum)}
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2.5">
                  <button
                    onClick={speakCurrentNum}
                    id="btn-speak-number"
                    className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white font-bold rounded-full flex items-center justify-center gap-1.5 text-xs shadow-xs active:scale-95 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Panggil Angka
                  </button>

                  <button
                    onClick={() => toggleNumberComplete(selectedNum)}
                    className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      completedNumbers.includes(selectedNum)
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
                    }`}
                    id={`btn-toggle-complete-num-${selectedNum}`}
                  >
                    {completedNumbers.includes(selectedNum) ? (
                      <>
                        <span>✓ Sudah Dipelajari</span>
                      </>
                    ) : (
                      <>
                        <span>Tandai Selesai</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Place Value Concept Table inside Bento context */}
          <div className="border-t border-slate-100 pt-5" id="place-value-table">
            <h4 className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>🧮</span> Informasi Nilai Atribut
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                <p className="text-[9px] font-bold text-slate-400">PULUHAN</p>
                <p className="text-xl font-extrabold text-[#1a202c] mt-0.5">{tens}</p>
                <p className="text-[8px] text-slate-400 italic font-medium">Nilai: {tens * 10}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                <p className="text-[9px] font-bold text-slate-400">SATUAN</p>
                <p className="text-xl font-extrabold text-[#1a202c] mt-0.5">{ones}</p>
                <p className="text-[8px] text-slate-400 italic font-medium">Nilai: {ones}</p>
              </div>
            </div>

            {/* Sub mathematical equation text banner */}
            <div className="mt-3 text-center py-1.5 bg-[#f8fafc] rounded-xl border border-dashed border-[#e2e8f0]">
              <span className="font-mono text-xs font-bold text-[#475569]">
                {tens * 10} + {ones} = {selectedNum}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
