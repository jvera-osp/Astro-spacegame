import React from 'react';
import { Play, ShoppingBag, Settings, Star, Trophy, Sparkles, Hand, ShieldCheck } from 'lucide-react';
import { sounds } from '../audio/soundEffects';
import { ControlType } from '../types/game';

interface TitleScreenProps {
  highScore: number;
  totalCoins: number;
  totalGems: number;
  controlType: ControlType;
  onStartGame: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
  onOpenPrivacy: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  highScore,
  totalCoins,
  totalGems,
  controlType,
  onStartGame,
  onOpenShop,
  onOpenSettings,
  onOpenLeaderboard,
  onOpenPrivacy,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 select-none bg-gradient-to-b from-slate-950/20 via-slate-950/50 to-slate-950/95 overflow-y-auto">
      {/* Top Bar Status */}
      <div className="w-full flex items-center justify-between shrink-0 pointer-events-auto">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenLeaderboard();
          }}
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/85 hover:bg-slate-800 border border-slate-800/80 px-2.5 sm:px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-md active:scale-95 transition-all text-left"
          title="Ver tabla de clasificación"
        >
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Récord:</span>
          <span className="text-[11px] sm:text-xs font-black text-amber-300 tabular-nums">
            {highScore.toLocaleString()} pts
          </span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 bg-slate-900/85 border border-slate-800/80 px-2 sm:px-2.5 py-1.5 rounded-2xl backdrop-blur-md shadow-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-amber-200 tabular-nums">{totalCoins}</span>
          </div>

          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenLeaderboard();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900/85 border border-slate-800/80 hover:bg-slate-800 text-amber-300 flex items-center justify-center active:scale-95 transition-all shadow-md shrink-0"
            aria-label="Tabla de clasificación"
            title="Tabla de clasificación"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenSettings();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900/85 border border-slate-800/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center active:scale-95 transition-all shadow-md shrink-0"
            aria-label="Configuración"
            title="Configuración"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Title Lockup & Mascot center */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-2 sm:py-4 shrink-0">
        {/* Floating Cartoon Rocket Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-0.5 sm:p-1 shadow-2xl shadow-cyan-500/20 animate-float-slow mb-2 sm:mb-3 flex items-center justify-center">
          <div className="w-full h-full rounded-[22px] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl md:text-5xl">
            🚀
          </div>
        </div>

        {/* Title Lockup */}
        <div className="relative px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-orange-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)] leading-tight">
            ASTRO ESQUIVA
          </h1>
          <p className="text-xs sm:text-sm font-bold text-cyan-300 tracking-wide mt-1 flex items-center justify-center gap-1.5 drop-shadow">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span>Aventura Espacial para Niños</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          </p>
        </div>
      </div>

      {/* Bottom CTA & Controls Area */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-2 sm:gap-2.5 shrink-0 pt-2">
        {/* Primary Play Button */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onStartGame();
          }}
          className="w-full py-3.5 sm:py-4 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-lg sm:text-xl tracking-wider shadow-xl shadow-teal-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 sm:gap-3 border-2 border-emerald-200/50"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950" />
          <span>¡JUGAR AHORA!</span>
        </button>

        {/* Secondary Store Button */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenShop();
          }}
          className="w-full py-2.5 sm:py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 text-white font-bold text-xs sm:text-sm shadow-md backdrop-blur-md active:scale-98 transition-all flex items-center justify-center gap-2 text-amber-300"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Tienda Galáctica</span>
          <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-bold ml-1">
            Naves & Mejoras
          </span>
        </button>

        {/* Flat control hint line */}
        <div className="text-center text-[10px] sm:text-[11px] text-slate-400 font-medium py-0.5">
          {controlType === 'touch_drag' ? (
            <span className="flex items-center justify-center gap-1">
              <Hand className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Dedo Mágico: Desliza tu dedo en la pantalla para volar</span>
            </span>
          ) : (
            <span>Botones táctiles en pantalla · Teclado Flechas Izq / Der</span>
          )}
        </div>

        {/* Child Privacy & Legal Policies Link */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenPrivacy();
          }}
          className="w-full py-1.5 sm:py-2 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold shadow-sm"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Política de Privacidad y Términos</span>
        </button>
      </div>
    </div>
  );
};
