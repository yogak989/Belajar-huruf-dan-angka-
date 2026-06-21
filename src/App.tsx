/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, BookOpen, Hash, Award, Sparkles, HelpCircle, RefreshCw, ChevronRight, ArrowLeft, Home } from 'lucide-react';
import AlphabetSection from './components/AlphabetSection';
import NumbersSection from './components/NumbersSection';
import QuizSection from './components/QuizSection';
import WritingSection from './components/WritingSection';
import MascotCompanion from './components/MascotCompanion';
import PwaInstaller from './components/PwaInstaller';
import { speakText } from './utils';
import { ActiveTab } from './types';

const TAB_INDEX: Record<ActiveTab, number> = {
  home: 0,
  letters: 1,
  numbers: 2,
  writing: 3,
  quiz: 4
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [direction, setDirection] = useState<number>(0);

  // Load progress states safely from localStorage
  const [completedLetters, setCompletedLetters] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('completedLetters');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [completedNumbers, setCompletedNumbers] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('completedNumbers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Welcome greeting speech synthesis on mount
  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      greetUser();
    }, 1200);
    return () => clearTimeout(greetingTimer);
  }, []);

  const greetUser = () => {
    speakText("Halo kawan! Selamat datang di aplikasi Belajar Huruf dan Angka bersama Shanti. Ayo kita belajar bersama-sama dengan gembira!");
  };

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === activeTab) return;
    
    const currentIndex = TAB_INDEX[activeTab];
    const targetIndex = TAB_INDEX[tab];
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setActiveTab(tab);

    if (tab === 'home') {
      speakText("Kembali ke menu utama. Ayo kawan, pilih petualangan belajarmu hari ini!");
    } else if (tab === 'letters') {
      speakText("Mari belajar huruf alfabet bersama!");
    } else if (tab === 'numbers') {
      speakText("Mari belajar mengenal angka satu sampai seratus!");
    } else if (tab === 'writing') {
      speakText("Mari berlatih menulis huruf dan angka di papan tulis!");
    } else if (tab === 'quiz') {
      speakText("Saatnya bermain kuis pintar! Ayo uji kemampuanmu!");
    }
  };

  const toggleLetterComplete = (letter: string) => {
    setCompletedLetters(prev => {
      const isRemoving = prev.includes(letter);
      const next = isRemoving
        ? prev.filter(item => item !== letter)
        : [...prev, letter];
      localStorage.setItem('completedLetters', JSON.stringify(next));
      
      if (!isRemoving) {
        window.dispatchEvent(new CustomEvent('mascot-trigger', {
          detail: {
            message: `Hore! Kamu telah menyelesaikan belajar huruf "${letter}"! Hebat kawan! 🥳✨`,
            triggerSpeak: true,
            animation: 'cheer'
          }
        }));
      }
      return next;
    });
  };

  const toggleNumberComplete = (num: number) => {
    setCompletedNumbers(prev => {
      const isRemoving = prev.includes(num);
      const next = isRemoving
        ? prev.filter(item => item !== num)
        : [...prev, num];
      localStorage.setItem('completedNumbers', JSON.stringify(next));
      
      if (!isRemoving) {
        window.dispatchEvent(new CustomEvent('mascot-trigger', {
          detail: {
            message: `Luar biasa! Angka "${num}" sekarang sudah dipelajari! Progresmu bertambah rajin! 🌟🔢`,
            triggerSpeak: true,
            animation: 'cheer'
          }
        }));
      }
      return next;
    });
  };

  const resetAllProgress = () => {
    const confirmed = window.confirm("Apakah kawan pintar yakin ingin menghapus dan mengulang semua progres belajar dari awal?");
    if (confirmed) {
      setCompletedLetters([]);
      setCompletedNumbers([]);
      localStorage.removeItem('completedLetters');
      localStorage.removeItem('completedNumbers');
      speakText("Selesai! Progres belajar diulang kembali dari awal. Mari raih bintang emas kembali!");
      
      window.dispatchEvent(new CustomEvent('mascot-trigger', {
        detail: {
          message: "Ayo kita mulai petualangan baru bersama Shanti! Aku selalu menyemangatimu! 🐰💖🎒",
          triggerSpeak: false,
          animation: 'cheer'
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f5f3ff] via-[#fafaf9] to-[#ecfdf5] relative overflow-hidden flex flex-col font-sans text-[#1c1917] antialiased selection:bg-indigo-100 select-none">
      
      {/* SEAMLESS MODERN AMBIENT GLOW BACKDROPS */}
      <div className="absolute -top-[20%] -right-[15%] w-[500px] h-[500px] rounded-full bg-indigo-300/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[15%] w-[500px] h-[500px] rounded-full bg-emerald-200/10 blur-[130px] pointer-events-none" />

      {/* CORE WEB APP CONTAINER */}
      <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 relative z-10 flex flex-col space-y-6">
        
        {/* CONDITIONAL RENDERING BASED ON HOME vs DETAILED TAB */}
        {activeTab === 'home' ? (
          /* HOME SCREEN */
          <div className="flex flex-col space-y-6" id="home-screen-layout">
            
            {/* 1. BAGIAN ATAS: GRID JUDUL APLIKASI DAN PROGRES BELAJAR */}
            <header className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]" id="app-header">
              {/* Logo / Text Brandings */}
              <div className="flex items-center gap-3.5 w-full lg:w-auto">
                <span className="text-3xl bg-indigo-50 p-2.5 rounded-2xl border border-indigo-100 flex items-center justify-center select-none">🎯</span>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-black text-[#4f46e5] tracking-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    Belajar Huruf &amp; Angka
                    <span className="text-xs tracking-wider bg-[#eff6ff] text-[#4f46e5] border border-[#bfdbfe] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Bersama Shanti
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Media belajar huruf alfabet A-Z dan angka 1-100 interaktif
                  </p>
                </div>
              </div>

              {/* Visual Learning Progress Tracker Widget */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/70 border border-slate-200/50 p-3.5 rounded-[20px] w-full lg:w-auto flex-grow max-w-md lg:mx-4" id="progress-header-widget">
                <div className="flex flex-row justify-around w-full sm:w-auto sm:flex-col gap-3">
                  {/* Letters Progress */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-50 text-[#4f46e5] rounded-xl border border-indigo-100">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-500 text-[9px] uppercase tracking-wider leading-none">Progres Huruf</div>
                      <div className="font-black text-slate-800 text-xs mt-1">
                        {completedLetters.length}/26 <span className="text-[#4f46e5]">({Math.round((completedLetters.length / 26) * 100)}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Numbers Progress */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-500 text-[9px] uppercase tracking-wider leading-none">Progres Angka</div>
                      <div className="font-black text-slate-800 text-xs mt-1">
                        {completedNumbers.length}/100 <span className="text-emerald-600">({Math.round((completedNumbers.length / 100) * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Completion Progress Bar */}
                <div className="flex flex-col justify-center w-full sm:w-auto sm:flex-grow border-t sm:border-y-0 sm:border-l border-slate-200 pt-3.5 sm:pt-0 sm:pl-4">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-500 mb-1">
                    <span>TOTAL BELAJAR PINTAR</span>
                    <span className="text-[#4f46e5] font-black">{Math.round(((completedLetters.length + completedNumbers.length) / 126) * 100)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-indigo-600 rounded-full animate-pulse-slow"
                      animate={{ width: `${((completedLetters.length + completedNumbers.length) / 126) * 100}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* User badge, greet, resets */}
              <div className="flex sm:flex-row lg:flex-col items-center sm:items-center lg:items-end justify-center lg:justify-end gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-750 shadow-3xs select-none">
                  <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[9px] text-white font-black animate-spin-slow">★</div>
                  Level Belajar • {Math.min(10, Math.floor((completedLetters.length + completedNumbers.length) / 12) + 1)}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={greetUser}
                    id="btn-greet-user"
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all active:scale-95 cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs select-none uppercase tracking-wider"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Shanti 👋
                  </button>

                  <button
                    onClick={resetAllProgress}
                    id="btn-reset-progress"
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full border border-rose-200 transition-all active:scale-90 cursor-pointer text-xs"
                    title="Mulai ulang semua progres belajar"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </header>

            {/* COMPREHENSIVE WEB APP INSTALLER (PWA) BANNER */}
            <PwaInstaller />

            {/* 2. BAGIAN BAWAH: TAB MENU BELAJAR */}
            <div className="space-y-4" id="home-study-menu-section">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Pilih Menu Belajar Pintar
                </h2>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 font-black px-2 py-0.5 rounded-md border border-indigo-100">
                  Konsol Belajar v2
                </span>
              </div>

              {/* Grid Bento Menu Belajar - Sized as smaller square buttons in one row */}
              <div className="grid grid-cols-3 gap-4" id="home-bento-grid">
                
                {/* Huruf Card */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange('letters')}
                  className="bg-white hover:bg-slate-50/50 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-slate-100 hover:border-indigo-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-3xs hover:shadow-2xs relative overflow-hidden group aspect-square"
                  id="menu-card-letters"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-indigo-500/[0.05] to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4f46e5] flex items-center justify-center font-black text-lg sm:text-xl mb-1.5 sm:mb-2.5 shadow-3xs group-hover:scale-110 transition-transform">
                    🔤
                  </div>
                  <h3 className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight leading-tight">
                    Belajar Huruf
                  </h3>
                  <div className="mt-1 sm:mt-1.5 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] text-[#4f46e5] font-black bg-indigo-50/80 px-2 sm:px-2.5 py-0.5 rounded-full border border-indigo-100 shadow-3xs whitespace-nowrap">
                      {completedLetters.length}/26
                    </span>
                  </div>
                </motion.div>

                {/* Angka Card */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange('numbers')}
                  className="bg-white hover:bg-slate-50/50 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-slate-100 hover:border-emerald-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-3xs hover:shadow-2xs relative overflow-hidden group aspect-square"
                  id="menu-card-numbers"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-emerald-500/[0.05] to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg sm:text-xl mb-1.5 sm:mb-2.5 shadow-3xs group-hover:scale-110 transition-transform">
                    🔢
                  </div>
                  <h3 className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight leading-tight">
                    Mengenal Angka
                  </h3>
                  <div className="mt-1 sm:mt-1.5 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] text-emerald-600 font-black bg-emerald-50/80 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-100 shadow-3xs whitespace-nowrap">
                      {completedNumbers.length}/100
                    </span>
                  </div>
                </motion.div>

                {/* Kuis Card */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange('quiz')}
                  className="bg-white hover:bg-slate-50/50 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-slate-100 hover:border-amber-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-3xs hover:shadow-2xs relative overflow-hidden group aspect-square"
                  id="menu-card-quiz"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-amber-500/[0.05] to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center font-black text-lg sm:text-xl mb-1.5 sm:mb-2.5 shadow-3xs group-hover:scale-110 transition-transform">
                    ⭐
                  </div>
                  <h3 className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight leading-tight">
                    Kuis Pintar
                  </h3>
                  <div className="mt-1 sm:mt-1.5 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] text-amber-600 font-black bg-amber-50/80 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-150 shadow-3xs whitespace-nowrap">
                      Mulai ➔
                    </span>
                  </div>
                </motion.div>

                {/* Menulis Card */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange('writing')}
                  className="bg-white hover:bg-slate-50/50 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-slate-100 hover:border-violet-200 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-3xs hover:shadow-2xs relative overflow-hidden group aspect-square"
                  id="menu-card-writing"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-violet-500/[0.05] to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center font-black text-lg sm:text-xl mb-1.5 sm:mb-2.5 shadow-3xs group-hover:scale-110 transition-transform">
                    ✏️
                  </div>
                  <h3 className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight leading-tight">
                    Belajar Menulis
                  </h3>
                  <div className="mt-1 sm:mt-1.5 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] text-violet-600 font-black bg-violet-50/80 px-2 sm:px-2.5 py-0.5 rounded-full border border-violet-100 shadow-3xs whitespace-nowrap">
                      Tracing ➔
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        ) : (
          /* DETAILED SPACE (LETTERS, NUMBERS, OR QUIZ) */
          <div className="flex flex-col space-y-5" id="detailed-screen-layout">
            
            {/* COMPACT & MINIMALIST SUBPAGE HEADER (HIDING THE HEAVY APP-HEADER CONTENT AS PER DIRECTIVE) */}
            <div className="flex items-center justify-between bg-white p-4 rounded-[22px] border border-slate-200 shadow-[0_4px_6px_-2px_rgba(0,0,0,0.02)]" id="subpage-header">
              <button
                onClick={() => handleTabChange('home')}
                id="subpage-back-button"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                Kembali ke Menu Utama
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#4f46e5] bg-[#eff6ff] hover:bg-slate-100 px-3.5 py-1.8 border border-indigo-150 rounded-full uppercase tracking-wider select-none">
                  {activeTab === 'letters' && '🔤 Belajar Huruf'}
                  {activeTab === 'numbers' && '🔢 Mengenal Angka'}
                  {activeTab === 'quiz' && '🎮 Tantangan Kuis'}
                </span>
                <div className="hidden sm:flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded-full border border-amber-100 text-[10px] font-black select-none">
                  <span>★</span>
                  <span>Level {Math.min(10, Math.floor((completedLetters.length + completedNumbers.length) / 12) + 1)}</span>
                </div>
              </div>
            </div>

            {/* CORE INTERACTIVE CONTENT SWITCHER WITH SPRING SLIDE DIRECT EFFECTS */}
            <main className="flex-grow overflow-hidden relative w-full" id="main-content-slider-wrapper">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? '100vw' : '-100vw',
                      opacity: 0,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                    },
                    exit: (dir: number) => ({
                      x: dir < 0 ? '100vw' : '-100vw',
                      opacity: 0,
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="w-full"
                >
                  {activeTab === 'letters' && (
                    <AlphabetSection 
                      completedLetters={completedLetters}
                      toggleLetterComplete={toggleLetterComplete}
                    />
                  )}

                  {activeTab === 'numbers' && (
                    <NumbersSection 
                      completedNumbers={completedNumbers}
                      toggleNumberComplete={toggleNumberComplete}
                    />
                  )}

                  {activeTab === 'writing' && (
                    <WritingSection />
                  )}

                  {activeTab === 'quiz' && (
                    <QuizSection />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        )}

        {/* EDUCATION STATS/TIPS NOTIFICATION PANEL */}
        <footer className="bg-white/40 backdrop-blur-md rounded-2xl p-4 text-center border border-white/60 space-y-1 sm:space-y-0 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Tips: Gunakan speaker aktif kawan untuk mendengarkan lafal pengucapan bahasa Indonesia yang baik!
          </p>
          <p className="font-semibold text-[10px] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 mt-2 sm:mt-0">
            Dukung Tracing Tangan & Pelafalan Alami id-ID
          </p>
        </footer>
        
        {/* COMPANION MASCOT HELPER (PUJI SI KELINCI PINTAR) */}
        <MascotCompanion />

        {/* FIXED BOTTOM NAVIGATION BAR WRAPPER FOR CONSTRAINED WIDTH */}
        <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none" id="fixed-bottom-navigation-bar-wrapper">
          <div className="max-w-md mx-auto pointer-events-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pt-2.5 pb-4 md:pb-4" id="fixed-bottom-navigation-bar">
            <div className="px-6 flex justify-around items-center gap-1">
            
            {/* Beranda Tab */}
            <button
              onClick={() => handleTabChange('home')}
              className={`flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              id="bottom-tab-home"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'home' ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-600' : 'bg-transparent text-slate-400'
              }`}>
                <Home className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[10.5px] font-bold mt-1 tracking-wide ${
                activeTab === 'home' ? 'text-indigo-600 font-extrabold' : 'text-slate-500'
              }`}>
                Beranda
              </span>
            </button>

            {/* Huruf Tab */}
            <button
              onClick={() => handleTabChange('letters')}
              className={`flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'letters' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              id="bottom-tab-letters"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'letters' ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-600' : 'bg-transparent text-slate-400'
              }`}>
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[10.5px] font-bold mt-1 tracking-wide ${
                activeTab === 'letters' ? 'text-indigo-600 font-extrabold' : 'text-slate-500'
              }`}>
                Huruf
              </span>
            </button>

            {/* Angka Tab */}
            <button
              onClick={() => handleTabChange('numbers')}
              className={`flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'numbers' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              id="bottom-tab-numbers"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'numbers' ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-600' : 'bg-transparent text-slate-400'
              }`}>
                <Hash className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[10.5px] font-bold mt-1 tracking-wide ${
                activeTab === 'numbers' ? 'text-indigo-600 font-extrabold' : 'text-slate-500'
              }`}>
                Angka
              </span>
            </button>

            {/* Kuis Tab */}
            <button
              onClick={() => handleTabChange('quiz')}
              className={`flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'quiz' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              id="bottom-tab-quiz"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'quiz' ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-600' : 'bg-transparent text-slate-400'
              }`}>
                <Award className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[10.5px] font-bold mt-1 tracking-wide ${
                activeTab === 'quiz' ? 'text-indigo-600 font-extrabold' : 'text-slate-500'
              }`}>
                Kuis
              </span>
            </button>

            {/* Menulis Tab */}
            <button
              onClick={() => handleTabChange('writing')}
              className={`flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'writing' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              id="bottom-tab-writing"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                activeTab === 'writing' ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-600' : 'bg-transparent text-slate-400'
              }`}>
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[10.5px] font-bold mt-1 tracking-wide ${
                activeTab === 'writing' ? 'text-indigo-600 font-extrabold' : 'text-slate-500'
              }`}>
                Menulis
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
);
}
