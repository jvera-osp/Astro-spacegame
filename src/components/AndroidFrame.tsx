import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2, Download } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onAndroidBack?: () => void;
  onAndroidHome?: () => void;
  onOpenDownloads?: () => void;
  title?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onAndroidBack,
  onAndroidHome,
  onOpenDownloads,
}) => {
  const [currentTime, setCurrentTime] = useState('10:28');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Default to full on real mobile (< 768px), and frame mode on large screens
      return window.innerWidth >= 900;
    }
    return false;
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen h-[100dvh] flex items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* Top control bar on desktop for toggling Android Frame / Fullscreen / Downloads */}
      <div className="absolute top-2 right-3 z-50 flex items-center gap-2 pointer-events-auto">
        {onOpenDownloads && (
          <button
            onClick={onOpenDownloads}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            title="Descargar archivos pre-compilados (.ZIP)"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>Descargar ZIP</span>
          </button>
        )}

        <button
          onClick={() => setIsFrameMode((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 hover:bg-slate-850 text-slate-200 border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Cambiar entre modo celular y pantalla completa"
        >
          {isFrameMode ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pantalla Completa</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Celular Android</span>
            </>
          )}
        </button>
      </div>

      {isFrameMode ? (
        /* Android Phone Frame */
        <div className="relative w-full max-w-[430px] h-[92vh] max-h-[880px] bg-black rounded-[48px] p-3 shadow-2xl shadow-cyan-950/40 border-[8px] border-slate-800 flex flex-col overflow-hidden ring-1 ring-slate-700/50">
          {/* Hardware notch / punch hole */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 border border-slate-800/80 pointer-events-none" />

          {/* Android Status Bar */}
          <div className="relative z-30 h-8 px-5 flex items-center justify-between text-xs text-slate-300 font-medium select-none shrink-0 bg-transparent">
            <span className="font-semibold tracking-wide text-[12px]">{currentTime}</span>
            <div className="flex items-center gap-2 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1 text-[11px]">
                <span>98%</span>
                <BatteryMedium className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Display Area */}
          <div className="relative flex-1 w-full rounded-[36px] overflow-hidden bg-slate-950 flex flex-col">
            {children}
          </div>

          {/* Android Navigation Soft Bar */}
          <div className="relative z-30 h-10 px-12 flex items-center justify-around bg-black text-slate-400 select-none shrink-0">
            <button
              onClick={onAndroidBack}
              className="p-2 hover:text-white active:scale-90 transition-transform"
              aria-label="Atrás"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
            <button
              onClick={onAndroidHome}
              className="p-2 hover:text-white active:scale-90 transition-transform"
              aria-label="Inicio"
            >
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
            </button>
            <button
              className="p-2 hover:text-white active:scale-90 transition-transform"
              aria-label="Apps recientes"
            >
              <div className="w-3 h-3 rounded-sm border-2 border-current" />
            </button>
          </div>
        </div>
      ) : (
        /* Fullscreen Viewport Mode (Ideal for Mobile Devices & Full Window) */
        <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950">
          {children}
        </div>
      )}
    </div>
  );
};
