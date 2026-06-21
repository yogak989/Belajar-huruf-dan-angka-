import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Eraser } from 'lucide-react';

// Audio helper for synthetic sounds
const playAudio = (type: 'success' | 'error') => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'success') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.1); // G5
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } else {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.2); // A2
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }
};

interface LetterTracerProps {
  letter: string;
}

export default function LetterTracer({ letter }: LetterTracerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#6366f1'); // Modern indigo default
  const [brushWidth, setBrushWidth] = useState(16);
  const [guideOpacity, setGuideOpacity] = useState(0.3); // Opacity for the guide letter

  const colors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Flame', value: '#f43f5e' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Violet', value: '#8b5cf6' },
  ];

  // Draw background letter guide and reset user drawing
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save state
    ctx.save();

    // Draw grid lines to feel like writing schoolbook rules
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Horizontal middle line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Vertical middle line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw a big faint dashed reference guide letter in the center
    ctx.fillStyle = `rgba(203, 213, 225, ${guideOpacity})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 150px "Plus Jakarta Sans", sans-serif';
    
    // Render Letter
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2 - 10);
    
    // Restore state
    ctx.restore();
  };

  useEffect(() => {
    initCanvas();
  }, [letter, guideOpacity]);

  // Adjust canvas handling for screen density on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 240;
    initCanvas();
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if TouchEvent
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.nativeEvent.clientX - rect.left,
        y: e.nativeEvent.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushWidth;
    
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm w-full max-w-sm">
      <div className="text-center mb-3">
        <h4 className="text-sm font-semibold text-slate-700">Papan Tulis Tracing</h4>
        <p className="text-xs text-slate-400 mt-0.5">Gambar & ikuti pola huruf di bawah!</p>
      </div>

      {/* Drawing Canvas Box with absolute constraints */}
      <div className="relative border border-slate-100 bg-slate-50/50 rounded-2xl overflow-hidden touch-none" id="drawing-canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair block"
        />
        
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <button
            onClick={() => {
              playAudio('error');
              initCanvas();
            }}
            id="btn-clear-canvas"
            className="p-2 bg-white/95 text-slate-600 hover:text-rose-500 rounded-xl shadow-xs border border-slate-100 active:scale-95 transition-all text-xs flex items-center gap-1 font-semibold select-none cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ulangi
          </button>
          
          <button
            onClick={() => {
              playAudio('success');
              window.dispatchEvent(new CustomEvent('mascot-trigger', {
                detail: {
                  message: `Keren banget kawan! Kamu berhasil latihan menulis ${letter} dengan sangat rapi sekali! ✍️🌟`,
                  triggerSpeak: true,
                  animation: 'cheer'
                }
              }));
              // Success flash event can be added or just trigger mascot
            }}
            id="btn-done-tracing"
            className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs active:scale-95 transition-all text-xs flex items-center gap-1 font-bold select-none cursor-pointer"
          >
            Selesai ⭐
          </button>
        </div>
      </div>

      {/* Brush Settings */}
      <div className="mt-4 w-full text-left space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brushColor }} />
            Warna Tinta:
          </label>
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setBrushColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  brushColor === c.value 
                    ? 'border-slate-800 scale-110 shadow-sm' 
                    : 'border-transparent hover:scale-105'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500">Ukuran Kuas:</label>
          <div className="flex gap-2">
            {[8, 16, 24].map((w) => (
              <button
                key={w}
                onClick={() => setBrushWidth(w)}
                className={`px-2.5 py-0.5 text-xs rounded-md border font-medium transition-all ${
                  brushWidth === w
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {w === 8 ? 'Tipis' : w === 16 ? 'Sedang' : 'Tebal'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500">Tingkat Panduan:</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={guideOpacity}
            onChange={(e) => setGuideOpacity(parseFloat(e.target.value))}
            className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}
