import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Award, RefreshCw, Star, Play, CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { ALPHABET_DATA } from '../data';
import { spelledNumberIndonesian, speakText } from '../utils';
import { QuizQuestion, QuizCategory } from '../types';

export default function QuizSection() {
  const [category, setCategory] = useState<QuizCategory>('all');
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'score'>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Helper to shuffle arrays
  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // Generate 10 smart questions dynamically based on category
  const createQuiz = (selectedCat: QuizCategory) => {
    const generated: QuizQuestion[] = [];
    
    for (let i = 0; i < 10; i++) {
      // Pick random question type based on category
      const types: Array<'LETTER_SOUND' | 'NUMBER_SOUND' | 'LETTER_IMAGE' | 'COUNT_EMOJI' | 'COMPLETE_SEQUENCE'> = [];
      
      if (selectedCat === 'letters' || selectedCat === 'all') {
        types.push('LETTER_SOUND', 'LETTER_IMAGE');
      }
      if (selectedCat === 'numbers' || selectedCat === 'all') {
        types.push('NUMBER_SOUND', 'COUNT_EMOJI', 'COMPLETE_SEQUENCE');
      }

      const chosenType = types[Math.floor(Math.random() * types.length)];
      const id = `q-${i}-${Date.now()}`;

      if (chosenType === 'LETTER_SOUND') {
        // Pick random letter item as answer
        const correctItem = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
        // Grab 3 other letters as distractors
        const filterRest = ALPHABET_DATA.filter(item => item.letter !== correctItem.letter);
        const distractors = shuffleArray(filterRest).slice(0, 3).map(item => item.letter);
        const options = shuffleArray([correctItem.letter, ...distractors]);

        generated.push({
          id,
          type: 'LETTER_SOUND',
          questionText: 'Dengarkan baik-baik. Manakah huruf yang diucapkan?',
          speakText: `Dengar baik-baik. Manakah huruf ${correctItem.letter}?`,
          options,
          correctAnswer: correctItem.letter,
        });

      } else if (chosenType === 'LETTER_IMAGE') {
        const correctItem = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
        const filterRest = ALPHABET_DATA.filter(item => item.letter !== correctItem.letter);
        const distractors = shuffleArray(filterRest).slice(0, 3).map(item => item.letter);
        const options = shuffleArray([correctItem.letter, ...distractors]);

        generated.push({
          id,
          type: 'LETTER_IMAGE',
          questionText: `Huruf apakah yang mengawali kata "${correctItem.word}"?`,
          speakText: `Huruf apa yang mengawali kata ${correctItem.word}? ${correctItem.emoji} ${correctItem.word}`,
          options,
          correctAnswer: correctItem.letter,
          visualData: { emoji: correctItem.emoji, word: correctItem.word },
        });

      } else if (chosenType === 'NUMBER_SOUND') {
        const correctNum = Math.floor(Math.random() * 100) + 1;
        const spelled = spelledNumberIndonesian(correctNum);
        
        // Generate distractors close to the number
        const distractors: string[] = [];
        while (distractors.length < 3) {
          const shift = [1, -1, 10, -10, 5, -5, 2, -2][Math.floor(Math.random() * 8)];
          const candidate = correctNum + shift;
          if (candidate > 0 && candidate <= 100 && candidate !== correctNum && !distractors.includes(String(candidate))) {
            distractors.push(String(candidate));
          }
        }
        const options = shuffleArray([String(correctNum), ...distractors]);

        generated.push({
          id,
          type: 'NUMBER_SOUND',
          questionText: `Dengarkan baik-baik. Angka manakah "${spelled}"?`,
          speakText: `Manakah angka ${correctNum}?`,
          options,
          correctAnswer: String(correctNum),
        });

      } else if (chosenType === 'COUNT_EMOJI') {
        // Limit counting objects to small digits (1 up to 10) for better UI display
        const countNum = Math.floor(Math.random() * 9) + 2; // 2 to 10
        const emojisList = ['🐱', '🍎', '⭐', '🎈', '🚗', '🦁', '🍌', '🥕', '🎨', '🧩'];
        const emoji = emojisList[Math.floor(Math.random() * emojisList.length)];

        // Distractors close counts
        const distractors: string[] = [];
        while (distractors.length < 3) {
          const d = countNum + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
          if (d > 0 && d <= 12 && d !== countNum && !distractors.includes(String(d))) {
            distractors.push(String(d));
          }
        }
        const options = shuffleArray([String(countNum), ...distractors]);

        generated.push({
          id,
          type: 'COUNT_EMOJI',
          questionText: `Ayo menghitung! Ada berapa benda di dalam kotak?`,
          speakText: 'Ada berapa banyak benda di dalam kotak? Mari berhitung bersama.',
          options,
          correctAnswer: String(countNum),
          visualData: { emoji, count: countNum },
        });

      } else if (chosenType === 'COMPLETE_SEQUENCE') {
        // Complete simple mathematical sequences (e.g., 22, 23, ??, 25)
        const startNum = Math.floor(Math.random() * 95) + 1; // 1 to 95
        const missingIndex = Math.floor(Math.random() * 3); // missing element index
        
        const seq = [startNum, startNum + 1, startNum + 2, startNum + 3];
        const missingVal = seq[missingIndex];
        
        const options = shuffleArray([
          String(missingVal),
          String(missingVal + 10),
          String(missingVal - 1),
          String(missingVal + 4),
        ]).filter((val, index, self) => self.indexOf(val) === index).slice(0, 4);
        
        // Safety lock options count
        if (options.indexOf(String(missingVal)) === -1) {
          options[0] = String(missingVal);
        }
        const finalOptions = shuffleArray(options);

        // Printable string display
        const seqDisplay = seq.map((num, idx) => (idx === missingIndex ? '❓' : String(num))).join(', ');

        generated.push({
          id,
          type: 'COMPLETE_SEQUENCE',
          questionText: `Lengkapi barisan angka berikut ini: ${seqDisplay}`,
          speakText: 'Lengkapi barisan angka yang hilang berikut.',
          options: finalOptions,
          correctAnswer: String(missingVal),
          visualData: { display: seqDisplay },
        });
      }
    }

    setQuestions(generated);
    setCurrentIdx(0);
    setScore(0);
    setHasAnswered(false);
    setSelectedAnswer(null);
    setGameState('playing');
  };

  const handleStartGame = () => {
    createQuiz(category);
  };

  const currentQuestion = questions[currentIdx];

  // Auto speaks when a new question loads
  useEffect(() => {
    if (gameState === 'playing' && currentQuestion) {
      const timer = setTimeout(() => {
        playQuestionVoice();
      }, 400); // Small transition buffer for premium feel
      return () => clearTimeout(timer);
    }
  }, [currentIdx, gameState]);

  const playQuestionVoice = () => {
    if (currentQuestion) {
      if (currentQuestion.speakText) {
        speakText(currentQuestion.speakText);
      } else {
        speakText(currentQuestion.questionText);
      }
    }
  };

  const checkAnswer = (option: string) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(option);
    setHasAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      const responses = ['Yay! Jawabanmu benar sekali!', 'Luar biasa! Kamu pintar!', 'Hebat! Terus berkarya!', 'Bagus! Benar!'];
      const resp = responses[Math.floor(Math.random() * responses.length)];
      speakText(resp);
      
      // Notify mascot of the correct answer
      window.dispatchEvent(new CustomEvent('mascot-trigger', {
        detail: {
          message: `Horeee! Jawabanmu BENAR! Kamu keren banget! Tambah satu Bintang lagi kawan! ⭐🎉`,
          triggerSpeak: false,
          animation: 'cheer'
        }
      }));
    } else {
      let speech = 'Ayo coba lagi!';
      if (currentQuestion.type === 'LETTER_SOUND' || currentQuestion.type === 'LETTER_IMAGE') {
        speech = `Kurang tepat. Jawaban yang benar adalah ${currentQuestion.correctAnswer}. Ayo semangat!`;
      } else if (currentQuestion.type === 'NUMBER_SOUND') {
        speech = `Hampir tepat. Jawaban yang benar adalah ${currentQuestion.correctAnswer}.`;
      }
      speakText(speech);
      
      // Notify mascot to encourage after a wrong match
      window.dispatchEvent(new CustomEvent('mascot-trigger', {
        detail: {
          message: `Tidak apa-apa! Jawaban yang benar adalah ${currentQuestion.correctAnswer}. Terus semangat ya, nomor berikutnya pasti benar! 💪🌟`,
          triggerSpeak: false,
          animation: 'bounce'
        }
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < 9) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setGameState('score');
      // Speak final victory feedback
      if (score >= 8) {
        speakText(`Hore! Kamu selesai dengan sangat baik! Kumpulkan ${score} bintang dambaanmu!`);
        window.dispatchEvent(new CustomEvent('mascot-trigger', {
          detail: {
            message: `Luar biasa pintar! Kamu menyelesaikan kuis dengan total ${score * 10} poin! Puji sangat kagum padamu! Juara Bintang sejati! 🏆🐰✨`,
            triggerSpeak: false,
            animation: 'cheer'
          }
        }));
      } else {
        speakText(`Selesai! Kamu mendapatkan ${score} bintang. Berlatih terus makin jago!`);
        window.dispatchEvent(new CustomEvent('mascot-trigger', {
          detail: {
            message: `Hebat! Sesi belajarmu selesai dengan ${score} Bintang! Ayo latihan lagi bersama Puji agar dapat nilai penuh 100! 🎒🌟`,
            triggerSpeak: false,
            animation: 'bounce'
          }
        }));
      }
    }
  };

  // Medal custom coloring based on performance score
  const getScoreCommentary = () => {
    if (score === 10) return { title: 'Sempurna! Sang Juara Bintang! 🏆', desc: 'Kamu menjawab semua pertanyaan dengan benar tanpa kesalahan!', color: 'text-amber-500' };
    if (score >= 8) return { title: 'Sangat Hebat! 🌟', desc: 'Luar biasa pintar! Hampir sempurna, pertahankan semangatmu!', color: 'text-indigo-600' };
    if (score >= 5) return { title: 'Bagus Sekali! 👍', desc: 'Pencapaian yang baik! Sedikit latihan lagi untuk meraih nilai penuh.', color: 'text-emerald-600' };
    return { title: 'Pantang Menyerah! 💪', desc: 'Belajar dan bermain kembali adalah kunci untuk meraih kecerdasan maksimal!', color: 'text-slate-600' };
  };

  return (
    <div className="max-w-xl mx-auto" id="quiz-holder">
      <AnimatePresence mode="wait">
        {/* TAB 1: Setup / Menu */}
        {gameState === 'setup' && (
          <motion.div
            key="setup-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#fdf2f8] p-6 sm:p-8 rounded-[24px] border border-[#fbcfe8] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] text-center space-y-6"
            id="quiz-setup-card"
          >
            <div className="space-y-2">
              <span className="text-5xl animate-pulse block">🎮</span>
              <h2 className="text-2xl font-black text-[#1e293b]">Tantangan Kuis Pintar</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Ayo uji kemampuan belajarmu! Dapatkan Bintang Emas di akhir tantangan ini.
              </p>
            </div>

            {/* Category selection */}
            <div className="space-y-4 text-left">
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider block text-center">
                Pilih Kategori Tantangan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="quiz-category-selectors">
                {[
                  { id: 'all', title: 'Campuran', icon: '💎', desc: 'Huruf & Angka' },
                  { id: 'letters', title: 'Hanya Huruf', icon: '🔤', desc: 'Materi A-Z' },
                  { id: 'numbers', title: 'Hanya Angka', icon: '🧮', desc: 'Materi 1-100' },
                ].map((catOption) => (
                  <button
                    key={catOption.id}
                    onClick={() => setCategory(catOption.id as QuizCategory)}
                    id={`btn-select-quiz-${catOption.id}`}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer ${
                      category === catOption.id
                        ? 'border-[#4f46e5] bg-white text-[#4f46e5] shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-705'
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{catOption.icon}</span>
                    <span className="text-sm font-black block">{catOption.title}</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">{catOption.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartGame}
              id="btn-play-quiz"
              className="w-full py-3.5 bg-slate-905 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Mulai Petualangan Kuis
            </button>
          </motion.div>
        )}

        {/* TAB 2: Active Playing */}
        {gameState === 'playing' && currentQuestion && (
          <motion.div
            key="playing-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] space-y-6"
            id="quiz-active-card"
          >
            {/* Header: Progress, Stars */}
            <div className="flex justify-between items-center bg-[#fdf2f8] px-4 py-2.5 rounded-2xl border border-[#fbcfe8]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                Pertanyaan {currentIdx + 1} / 10
              </span>
              <div className="flex items-center gap-1 text-pink-700 font-extrabold text-xs">
                <Star className="w-4 h-4 fill-pink-550 text-pink-500" />
                {score} ⭐ Bintang
              </div>
            </div>

            {/* Progress indicator thin bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div 
                className="h-full bg-pink-500 transition-all duration-300 rounded-full"
                style={{ width: `${(currentIdx / 10) * 100}%` }}
              />
            </div>

            {/* Question description */}
            <div className="text-center space-y-4 py-4 border-b border-dashed border-slate-100">
              <HelpCircle className="w-6 h-6 text-pink-400 mx-auto" />
              <h3 className="text-base sm:text-lg font-extrabold text-[#1e293b] px-2 leading-snug">
                {currentQuestion.questionText}
              </h3>

              {/* Special interactive audio layout */}
              {(currentQuestion.type === 'LETTER_SOUND' || currentQuestion.type === 'NUMBER_SOUND') && (
                <div className="py-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={playQuestionVoice}
                    id="btn-replay-speech"
                    className="w-20 h-20 rounded-full bg-[#fdf2f8] hover:bg-[#fbcfe8]/40 border border-[#fbcfe8] text-pink-700 flex items-center justify-center mx-auto shadow-inner relative cursor-pointer"
                  >
                    <Volume2 className="w-8 h-8 pointer-events-none" />
                    <span className="absolute -bottom-1 text-[9px] font-bold bg-[#4f46e5] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      Suara
                    </span>
                  </motion.button>
                </div>
              )}

              {/* Special graphical letter preview illustration layout */}
              {currentQuestion.type === 'LETTER_IMAGE' && currentQuestion.visualData && (
                <div className="flex flex-col items-center justify-center space-y-1.5 bg-[#fdf2f8]/55 py-3 px-5 rounded-2xl border border-[#fbcfe8] w-fit mx-auto">
                  <span className="text-5xl animate-bounce duration-1000">{currentQuestion.visualData.emoji}</span>
                  <p className="text-lg font-black text-slate-700 tracking-wide uppercase">
                    _ {currentQuestion.visualData.word.slice(1)}
                  </p>
                </div>
              )}

              {/* Rich visual dots count helper */}
              {currentQuestion.type === 'COUNT_EMOJI' && currentQuestion.visualData && (
                <div className="bg-[#f0fdf4]/50 p-4 rounded-2xl border border-[#bbf7d0] max-w-xs mx-auto">
                  <div className="flex gap-2 flex-wrap justify-center items-center">
                    {Array.from({ length: currentQuestion.visualData.count }).map((_, dIdx) => (
                      <motion.span
                        key={dIdx}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-2xl select-none"
                      >
                        {currentQuestion.visualData.emoji}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Multiple choices options grid */}
            <div className="grid grid-cols-2 gap-3" id="quiz-options-container">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showWrong = isSelected && !isCorrect;
                const showSuccess = hasAnswered && isCorrect;

                return (
                  <motion.button
                    key={option}
                    disabled={hasAnswered}
                    onClick={() => checkAnswer(option)}
                    id={`btn-option-${option.toLowerCase()}`}
                    whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                    whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                    className={`py-4 px-3 rounded-2xl border text-center text-md font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                      hasAnswered
                        ? showSuccess
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-850 shadow-sm'
                          : showWrong
                          ? 'border-rose-500 bg-rose-50 text-rose-850'
                          : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60'
                        : 'border-slate-200 hover:border-slate-355 hover:bg-slate-50/50 bg-white text-slate-700 shadow-2xs'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black">{option}</span>
                    
                    {/* Tiny suffix spelling for numbers to help crosslearning */}
                    {option && !isNaN(Number(option)) && (
                      <span className="text-[9px] font-semibold text-slate-400 mt-1 uppercase max-w-[120px] truncate">
                        {spelledNumberIndonesian(Number(option))}
                      </span>
                    )}

                    {/* Feedback signs */}
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-2 right-2 fill-emerald-50" />
                    )}
                    {hasAnswered && showWrong && (
                      <XCircle className="w-5 h-5 text-rose-600 absolute top-2 right-2 fill-rose-55" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Loading / Next trigger row */}
            {hasAnswered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNextQuestion}
                id="btn-next-question"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs uppercase"
              >
                {currentIdx < 9 ? 'Pertanyaan Berikutnya' : 'Lihat Bintang Perolehan'}
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* TAB 3: Certification / Score result page */}
        {gameState === 'score' && (
          <motion.div
            key="score-screen"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-7 sm:p-10 rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] text-center space-y-6 relative overflow-hidden"
            id="quiz-victory-card"
          >
            {/* Background sparkle shapes */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

            <div className="space-y-3">
              <div className="w-20 h-20 rounded-full bg-yellow-50 border border-yellow-250/50 flex items-center justify-center mx-auto shadow-xs">
                <Award className="w-10 h-10 text-yellow-500 animate-bounce" />
              </div>
              
              <div className="space-y-1">
                <h2 className={`text-xl font-extrabold ${getScoreCommentary().color}`}>
                  {getScoreCommentary().title}
                </h2>
                <p className="text-xs text-slate-500 px-4 font-medium">
                  {getScoreCommentary().desc}
                </p>
              </div>
            </div>

            {/* Score circle certificate displays */}
            <div className="bg-[#fdf2f8] p-5 rounded-2xl border border-[#fbcfe8] max-w-sm mx-auto space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                Bintang Diperoleh
              </p>
              
              {/* Stars sequence visuals */}
              <div className="flex gap-1.5 justify-center" id="score-stars-row">
                {Array.from({ length: 10 }).map((_, index) => {
                  const achieved = index < score;
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          achieved 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-slate-200 fill-slate-100'
                        }`} 
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Score text display */}
              <div className="text-center pt-2">
                <p className="text-4xl font-black text-[#1e293b]">
                  {score * 10} <span className="text-sm font-semibold text-slate-400">/ 100 Poin</span>
                </p>
                <p className="text-[10px] font-semibold text-slate-500 mt-1">
                  ({score} dari 10 jawabanmu benar!)
                </p>
              </div>
            </div>

            {/* Restart Button options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setGameState('setup')}
                id="btn-quiz-back-setup"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-full transition-all cursor-pointer text-xs"
              >
                Ganti Kategori Kuis
              </button>
              <button
                onClick={() => createQuiz(category)}
                id="btn-quiz-retry"
                className="flex-1 py-3 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white font-extrabold rounded-full flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer text-xs uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Main Lagi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
