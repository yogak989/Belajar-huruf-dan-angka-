import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, X, Heart, MessageSquare, Award, Shirt, RefreshCw } from 'lucide-react';
import { speakText } from '../utils';

// Mascot moods and respective traits
interface Mood {
  emoji: string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const OUT_FITS: Record<string, Mood> = {
  explorer: { emoji: '🐰🤠', label: 'Petualang', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-800' },
  wizard: { emoji: '🐰🧙‍♂️', label: 'Penyihir Pintar', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-800' },
  astronaut: { emoji: '🐰👨‍🚀', label: 'Astronot', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' },
  starry: { emoji: '🐰✨', label: 'Bintang Berkilau', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-800' },
  default: { emoji: '🐰🎒', label: 'Siswa Rajin', bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-800' },
};

const RANDOM_MOTIVATIONS = [
  "Wah, kamu hebat sekali! Teruskan belajarmu kawan! 💪",
  "Keren! Setiap langkah kecil membuatmu semakin pintar! 🌟",
  "Puji bangga sekali melihatmu tekun belajar hari ini! 💖",
  "Luar biasa! Belajar bersama Pujashanti memang sangat seru, kan? 🎯",
  "Kamu sungguh istimewa! Jangan pernah menyerah belajar ya! ✨",
  "Yippee! Kamu berhak mendapatkan bintang emas atas usahamu! 🏆",
];

export default function MascotCompanion() {
  const [outfit, setOutfit] = useState<keyof typeof OUT_FITS>('default');
  const [speech, setSpeech] = useState<string>("Halo kawan pintar! Puji siap menemanimu belajar huruf dan angka hari ini! Ketuk aku untuk mengobrol ya! 🐰💖");
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [cheering, setCheering] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    // Listen to custom learning events from other components
    const handleMascotTrigger = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { message, triggerSpeak = true, animation = 'cheer' } = customEvent.detail || {};
      
      if (message) {
        setSpeech(message);
        setBubbleVisible(true);
        if (triggerSpeak) {
          // Speak message via TTS
          speakText(message);
        }
      }
      
      if (animation === 'cheer') {
        setCheering(true);
        setTriggerKey(prev => prev + 1);
        setTimeout(() => setCheering(false), 2000);
      }
    };

    window.addEventListener('mascot-trigger', handleMascotTrigger);
    return () => {
      window.removeEventListener('mascot-trigger', handleMascotTrigger);
    };
  }, []);

  const handleMascotClick = () => {
    // Pick unique motivation
    const randText = RANDOM_MOTIVATIONS[Math.floor(Math.random() * RANDOM_MOTIVATIONS.length)];
    setSpeech(randText);
    setBubbleVisible(true);
    speakText(randText);
    setCheering(true);
    setTriggerKey(prev => prev + 1);
    setTimeout(() => setCheering(false), 1500);
  };

  const cycleOutfit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const keys = Object.keys(OUT_FITS) as Array<keyof typeof OUT_FITS>;
    const currentIndex = keys.indexOf(outfit);
    const nextIndex = (currentIndex + 1) % keys.length;
    const nextOutfit = keys[nextIndex];
    setOutfit(nextOutfit);
    
    const reaction = `Hore! Puji sekarang memakai kostum ${OUT_FITS[nextOutfit].label}. Keren sekali kan?`;
    setSpeech(reaction);
    setBubbleVisible(true);
    speakText(reaction);
  };

  const activeMood = OUT_FITS[outfit];

  return (
    <div className="fixed bottom-28 right-4 sm:right-6 z-[60] flex flex-col items-end pointer-events-none" id="companion-mascot-root">
      
      {/* Speech Bubble Container with AnimatePresence */}
      <AnimatePresence>
        {bubbleVisible && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-3 max-w-xs bg-white text-slate-800 p-4 rounded-[22px] rounded-br-[4px] border border-slate-205 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] relative pointer-events-auto"
            style={{ borderBottomRightRadius: '2px' }}
          >
            {/* Close speech bubble button */}
            <button
              onClick={() => setBubbleVisible(false)}
              className="absolute top-2 right-2 p-1 text-slate-350 hover:text-slate-500 rounded-full hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Title Badge representing Character Name */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider">
                Puji Sahabat Pintarmu
              </span>
            </div>

            {/* Motivational message text */}
            <p className="text-xs font-bold leading-relaxed text-slate-705 pr-3">
              {speech}
            </p>

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={handleMascotClick}
                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" /> Suara 🔊
              </button>
              <span className="text-[8px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                Mascot Actif
              </span>
            </div>

            {/* Tail arrow decoration pointing to the mascot below */}
            <div className="absolute right-6 -bottom-2 w-4 h-4 bg-white border-r border-b border-slate-205 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mascot Button Trigger with Rich Micro-animations */}
      <motion.div
        key={triggerKey}
        animate={cheering ? {
          scale: [1, 1.2, 0.95, 1.1, 1],
          rotate: [0, -12, 12, -6, 0],
          y: [0, -20, 5, -5, 0]
        } : {
          y: [0, -5, 0],
        }}
        transition={cheering ? {
          duration: 1.2,
          ease: "easeInOut"
        } : {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={handleMascotClick}
        className={`pointer-events-auto cursor-pointer p-2.5 rounded-full border-2 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.12)] flex items-center justify-center relative group min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] ${activeMood.bgColor} ${activeMood.borderColor}`}
        id="mascot-avatar-button"
        title="Klik Puji untuk motivasi!"
      >
        <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="Rabbit Mascot">
          {activeMood.emoji}
        </span>

        {/* Costume Changer Badge float */}
        <button
          onClick={cycleOutfit}
          className="absolute -top-1 -left-1 p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full shadow-2xs cursor-pointer transition-all active:scale-90"
          title="Ganti pakaian Puji!"
        >
          <Shirt className="w-3.5 h-3.5" />
        </button>

        {/* Ring particles on activity */}
        {cheering && (
          <span className="absolute inset-0 rounded-full border-2 border-pink-400 animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Tiny live heart beacon */}
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 items-center justify-center text-[8px] text-white font-black">
            ♥
          </span>
        </span>
      </motion.div>

    </div>
  );
}
