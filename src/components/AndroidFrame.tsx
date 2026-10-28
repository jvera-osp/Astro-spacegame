import React, { useState, useEffect } from 'react';
import { Maximize2, Smartphone } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onAndroidBack?: () => void;
  onAndroidHome?: () => void;
  title?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
}) => {
  const [isFrameMode, setIsFrameMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Default to mobile frame only on large desktop screens (> 1024px)
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Handle auto-switching if window resizes below mobile/tablet breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isFrameMode) {
        setIsFrameMode(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFrameMode]);

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* Background Starfield Glow on Large Screens */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />

      {/* Top desktop control to toggle between Mobile Frame & Fullscreen */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 hidden sm:flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setIsFrameMode((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title="Alternar entre vista celular y pantalla completa"
        >
          {isFrameMode ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pantalla Completa</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Vista Celular</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`relative w-full h-full flex flex-col overflow-hidden bg-slate-950 transition-all duration-300 ${
          isFrameMode
            ? 'sm:max-w-[430px] sm:h-[95dvh] sm:max-h-[900px] sm:rounded-[36px] sm:border-2 sm:border-slate-800/90 sm:shadow-[0_0_50px_rgba(14,165,233,0.15)] sm:ring-1 sm:ring-slate-700/40'
            : 'max-w-none'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
