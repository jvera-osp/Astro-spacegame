import React from 'react';
import { Heart, Shield, Star, Gem, Pause, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface HUDProps {
  score: number;
  dodges: number;
  lives: number;
  maxLives: number;
  shield: number;
  magnetTimer: number;
  turboTimer: number;
  coins: number;
  gems: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  dodges,
  lives,
  maxLives,
  shield,
  magnetTimer,
  turboTimer,
  coins,
  gems,
  isMuted,
  onToggleMute,
  onPause,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-2 sm:p-3.5 select-none">
      {/* Top perimeter status bar */}
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left cluster: Lives & Shields */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pointer-events-auto">
          {/* Heart Lives */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-950/70 border border-slate-800/80 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-2xl shadow-sm backdrop-blur-sm">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform duration-200 ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-slate-600 fill-slate-800'
                } ${lives === 1 && i === 0 ? 'animate-pulse scale-110' : ''}`}
              />
            ))}
          </div>

          {/* Shield Indicator */}
          {shield > 0 && (
            <div className="flex items-center gap-1 bg-cyan-950/80 border border-cyan-500/60 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-2xl shadow-sm shadow-cyan-900/40 animate-pulse backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/40" />
              <span className="text-cyan-300 font-bold text-[10px] sm:text-xs tabular-nums">x{shield}</span>
            </div>
          )}
        </div>

        {/* Center: Score & Dodges */}
        <div className="flex flex-col items-center justify-center pointer-events-auto px-1">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-tight">Puntos</span>
          <span className="text-lg sm:text-2xl font-black text-amber-300 tabular-nums tracking-wide drop-shadow-md leading-none">
            {score.toLocaleString()}
          </span>
          <span className="text-[9px] sm:text-[10px] text-cyan-300 font-medium tabular-nums mt-0.5 whitespace-nowrap">
            🎯 {dodges} esquivados
          </span>
        </div>

        {/* Right cluster: Coins, Gems, Sound & Pause */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pointer-events-auto">
          {/* Coins & Gems pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 border border-slate-800/80 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-2xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-amber-200 font-bold text-[11px] sm:text-xs tabular-nums">{coins}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Gem className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400 fill-pink-400" />
              <span className="text-pink-200 font-bold text-[11px] sm:text-xs tabular-nums">{gems}</span>
            </div>
          </div>

          {/* Sound Toggle button */}
          <button
            onClick={onToggleMute}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center justify-center active:scale-95 transition-all shadow-sm"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              sounds.playButtonTap();
              onPause();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-200 flex items-center justify-center active:scale-95 transition-all shadow-sm"
            aria-label="Pausa"
          >
            <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </button>
        </div>
      </div>

      {/* Active Power-up Timers Bar */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 pointer-events-auto">
        {turboTimer > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-amber-500/90 via-pink-500/90 to-purple-600/90 border border-amber-300/60 text-white text-[10px] sm:text-xs font-bold shadow-lg shadow-amber-500/30 animate-bounce">
            <span>🌈 ¡SÚPER ARCOÍRIS!</span>
            <span className="tabular-nums font-black text-amber-200">{Math.ceil(turboTimer)}s</span>
          </div>
        )}

        {magnetTimer > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-purple-900/90 border border-purple-400/60 text-purple-200 text-[10px] sm:text-xs font-bold shadow-md shadow-purple-900/50">
            <span>🧲 IMÁN ESTELAR</span>
            <span className="tabular-nums font-black text-purple-100">{Math.ceil(magnetTimer)}s</span>
          </div>
        )}
      </div>
    </div>
  );
};
