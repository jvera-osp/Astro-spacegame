import React from 'react';
import { Play, RotateCcw, Home, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onGoHome: () => void;
  onOpenShop: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onGoHome,
  onOpenShop,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-xs max-h-[94dvh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center gap-3 sm:gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl">
          ⏸️
        </div>

        <div>
          <h3 className="text-xl font-black text-white">Juego en Pausa</h3>
          <p className="text-xs text-slate-400 mt-0.5">Respira hondo antes de seguir volando</p>
        </div>

        <div className="w-full flex flex-col gap-2 pt-1">
          {/* Resume */}
          <button
            onClick={() => {
              sounds.playButtonTap();
              onResume();
            }}
            className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Continuar Vuelo</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sounds.playButtonTap();
              onRestart();
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Reiniciar Nivel</span>
          </button>

          {/* Shop */}
          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenShop();
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-amber-300 font-bold text-xs border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Tienda Galáctica</span>
          </button>

          {/* Sound & Home Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onToggleMute}
              className="py-2.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sin Sonido</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sonido ON</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sounds.playButtonTap();
                onGoHome();
              }}
              className="py-2.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Menú</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
