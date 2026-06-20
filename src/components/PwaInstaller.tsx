import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Laptop, Smartphone, Check, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed as PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Capture browser PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Auto open modal after 2 seconds on first experience if not already installed and not dismissed in this session
      const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!isStandalone && !hasDismissed) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
      // Mascot notification
      window.dispatchEvent(new CustomEvent('mascot-trigger', {
        detail: {
          message: "Wah! Kawan pintar sudah berhasil memasang aplikasi Belajar Shanti di Layar Utama! Kini belajar jadi lebih mudah dan cepat setiap hari! 🎒🎉💖",
          triggerSpeak: true,
          animation: 'cheer'
        }
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Also trigger modal after 3 seconds if beforeinstallprompt is not supported or hasn't fired yet
    // but only if standalone is false and not dismissed
    const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (!isStandalone && !hasDismissed) {
      const fallbackTimer = setTimeout(() => {
        setShowModal(true);
      }, 3500);
      return () => {
        clearTimeout(fallbackTimer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setShowModal(false);
      }
    } else {
      // Direct install prompt is not supported, we show instruction tabs inside modal
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    setShowModal(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // If the app is already installed or runs inside standalone mode, completely hide PWA installer
  if (isInstalled) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  return (
    <>
      {/* Floating Action Badge - Non-intrusive launcher button for the install modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-28 left-4 sm:left-6 z-40"
        id="pwa-floating-trigger-container"
      >
        <button
          onClick={() => setShowModal(true)}
          id="btn-pwa-floating-launcher"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-200 transition-all font-black text-xs active:scale-95 cursor-pointer border border-indigo-400/30 group"
        >
          <Smartphone className="w-4 h-4 animate-pulse text-indigo-200 group-hover:scale-110 transition-transform" />
          <span>Pasang Aplikasi</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </span>
        </button>
      </motion.div>

      {/* COMPREHENSIVE NEW POP-UP MODAL OVERLAY */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4" id="pwa-modal-overlay">
            {/* Modal Backdrop Click dismissal */}
            <div className="absolute inset-0 cursor-default" onClick={handleDismiss} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-md w-full relative overflow-hidden z-10 flex flex-col max-h-[90vh]"
              id="pwa-main-modal-content"
            >
              
              {/* Modal Banner Ambient background gradient */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4f46e5] flex items-center justify-center font-bold">
                    <Download className="w-5 h-5 animate-bounce duration-1000" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      Pasang Aplikasi Web
                      <span className="text-[8px] tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                        Mudah
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Belajar Pintar Shanti</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Content with instructions */}
              <div className="p-6 space-y-4 overflow-y-auto flex-grow scrollbar-thin">
                <div className="text-center pb-2">
                  <span className="text-4xl animate-pulse inline-block mb-2">🎯</span>
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed px-2">
                    Ayo pasang aplikasi ke Layar Utama HP atau Laptop kamu agar belajar huruf dan angka jadi lebih cepat tanpa mengetik nama website lagi!
                  </p>
                </div>

                {/* Direct Prompt Trigger Button if browser supports it */}
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    id="pwa-direct-install-btn"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md hover:shadow-indigo-100 transition-all text-xs active:scale-98 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest border border-indigo-400/20"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    Pasang Sekarang Ke Layar
                  </button>
                )}

                {/* Platform Specific Guided Tabs */}
                <div className="space-y-3 pt-2">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    Atau ikuti petunjuk manual:
                  </div>

                  {/* iOS Instruction Panel */}
                  <div className={`p-4 rounded-2xl border ${isIOS ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-150 bg-slate-50/40'}`}>
                    <div className="flex items-center gap-2 mb-2 text-xs font-black text-slate-800">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Langkah untuk iOS (iPhone / iPad):</span>
                      {isIOS && <span className="text-[7.5px] font-bold text-white bg-indigo-600 px-1.5 py-0.5 rounded-full uppercase ml-auto">Ponsel Anda</span>}
                    </div>
                    <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 font-medium pl-1">
                      <li>Buka browser <strong className="font-extrabold text-indigo-600">Safari</strong> dan kunjungi website ini.</li>
                      <li>Ketuk tombol <strong className="font-extrabold text-indigo-600">Bagikan (Share)</strong> di bawah layar 📤.</li>
                      <li>Pilih opsi <strong className="font-extrabold text-indigo-600">Tambahkan ke Layar Utama (Add to Home Screen)</strong> ➕.</li>
                      <li>Ketuk <strong className="font-extrabold text-indigo-600">Tambah (Add)</strong> di kanan atas. Selesai! 🎉</li>
                    </ol>
                  </div>

                  {/* Android Instruction Panel */}
                  <div className={`p-4 rounded-2xl border ${(!isIOS && isChrome) ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-150 bg-slate-50/40'}`}>
                    <div className="flex items-center gap-2 mb-2 text-xs font-black text-slate-800">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Langkah untuk Android (Chrome):</span>
                      {(!isIOS && isChrome) && <span className="text-[7.5px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded-full uppercase ml-auto">Browser Anda</span>}
                    </div>
                    <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 font-medium pl-1">
                      <li>Ketuk ikon <strong className="font-extrabold text-indigo-600">tiga titik (⁝)</strong> di pojok kanan atas Chrome.</li>
                      <li>Pilih menu <strong className="font-extrabold text-indigo-600">Instal aplikasi</strong> atau <strong className="font-extrabold text-indigo-600">Tambahkan ke Layar Utama</strong> 📲.</li>
                      <li>Konfirmasi pemasangan di dialog pop-up.</li>
                    </ol>
                  </div>

                  {/* Desktop / Laptop Instruction Panel */}
                  <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/40">
                    <div className="flex items-center gap-2 mb-2 text-xs font-black text-slate-800">
                      <Laptop className="w-3.5 h-3.5 text-slate-600" />
                      <span>Langkah untuk PC / Laptop (Chrome / Edge):</span>
                    </div>
                    <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 font-medium pl-1">
                      <li>Klik ikon <strong className="font-extrabold text-indigo-600">Instal</strong> di bilah alamat browser (address bar) di bagian kanan atas 🖥️.</li>
                      <li>Atau klik menu browser tiga titik lalu pilih opsi <strong className="font-extrabold text-indigo-600">Instal Belajar Shanti</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleCopyLink}
                  className={`w-full sm:w-auto px-4 py-2 border rounded-full text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    isCopied 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Tautan Disalin!
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      Salin Tautan Website
                    </>
                  )}
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDismiss}
                    className="w-full sm:w-auto text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-transparent hover:bg-slate-100 px-4 py-2 rounded-full cursor-pointer transition-all"
                  >
                    Nanti Saja
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
