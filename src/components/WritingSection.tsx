import React, { useState } from 'react';
import { ALPHABET_DATA } from '../data';
import LetterTracer from './LetterTracer';

export default function WritingSection() {
  const [mode, setMode] = useState<'letters' | 'numbers'>('letters');
  const [selectedItem, setSelectedItem] = useState<string>(ALPHABET_DATA[0].letter);

  const numbersList = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  return (
    <div className="p-6 bg-white rounded-[24px] border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
      <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
        ✏️ Papan Tulis Tracing
      </h2>
      
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => { setMode('letters'); setSelectedItem(ALPHABET_DATA[0].letter); }}
          className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${mode === 'letters' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Huruf
        </button>
        <button 
          onClick={() => { setMode('numbers'); setSelectedItem(numbersList[0]); }}
          className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${mode === 'numbers' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Angka
        </button>
      </div>

      <div className="max-h-40 overflow-y-auto grid grid-cols-6 sm:grid-cols-10 gap-2 mb-6 p-2 bg-slate-50 rounded-xl">
        {(mode === 'letters' ? ALPHABET_DATA.map(l => l.letter) : numbersList).map(item => (
          <button
            key={item}
            onClick={() => setSelectedItem(item)}
            className={`p-1.5 rounded-lg font-bold text-sm transition-all ${
              selectedItem === item 
                ? (mode === 'letters' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm')
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <LetterTracer letter={selectedItem} />
      </div>
    </div>
  );
}
