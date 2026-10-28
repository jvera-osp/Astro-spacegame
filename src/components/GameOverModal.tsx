import React from 'react';
import { RotateCcw, ShoppingBag, Trophy, Star, Home } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface GameOverModalProps {
  score: number;
  highScore: number;
  dodges: number;
  isNewRecord: boolean;
  coinsEarned: number;
  onPlayAgain: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  dodges,
  isNewRecord,
  coinsEarned,
  onPlayAgain,
  onOpenShop,
  onOpenLeaderboard,
  onGoHome,
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4">
        {/* Friendly Trophy / Mascot Badge */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-1 shadow-lg shadow-amber-500/20 animate-bounce">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl">
            {isNewRecord ? '🏆' : '🌟'}
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-white">
            {isNewRecord ? '¡NUEVO RÉCORD!' : '¡Misión Cumplida!'}
          </h2>
          <p className="text-xs text-cyan-300 font-medium mt-0.5">
            {isNewRecord
              ? '¡Superaste tu mejor marca en la galaxia!'
              : '¡Increíble vuelo cósmico, astronauta!'}
          </p>
        </div>

        {/* Score & Coins Summary Grid */}
        <div className="w-full grid grid-cols-2 gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Puntos Ganados</span>
            <span className="text-xl font-black text-amber-300 tabular-nums">
              {score.toLocaleString()} pts
            </span>
            <div className="text-[10px] text-cyan-400 font-medium mt-0.5">
              🎯 {dodges} esquivados
            </div>
          </div>

          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Monedas</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xl font-black text-yellow-300 tabular-nums">
                +{coinsEarned}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium mt-0.5">¡Añadidas al banco!</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            onClick={() => {
              sounds.playButtonTap();
              onPlayAgain();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Jugar de Nuevo</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sounds.playButtonTap();
                onOpenLeaderboard();
              }}
              className="py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-amber-300 font-bold text-xs border border-slate-700/80 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Clasificación</span>
            </button>

            <button
              onClick={() => {
                sounds.playButtonTap();
                onOpenShop();
              }}
              className="py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-bold text-xs border border-slate-700/80 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tienda</span>
            </button>
          </div>

          {/* Return to Main Menu button */}
          <button
            onClick={() => {
              sounds.playButtonTap();
              onGoHome();
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-850 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>Volver al Menú Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
