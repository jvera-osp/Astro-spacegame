import React from 'react';
import { Play, ShoppingBag, Settings, Star, Trophy, Sparkles, Hand, Download, FileArchive } from 'lucide-react';
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
  onOpenPublishingHub: () => void;
  onOpenDownloads: () => void;
  isDevMode?: boolean;
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
  onOpenPublishingHub,
  onOpenDownloads,
  isDevMode = false,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 select-none bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none">
      {/* Top Bar Status */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenLeaderboard();
          }}
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-md active:scale-95 transition-all text-left"
          title="Ver tabla de clasificación"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300 font-medium">Récord:</span>
          <span className="text-xs font-black text-amber-300 tabular-nums">{highScore.toLocaleString()} pts</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenLeaderboard();
            }}
            className="w-9 h-9 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:bg-slate-800 text-amber-300 flex items-center justify-center active:scale-95 transition-all shadow-md"
            aria-label="Tabla de clasificación"
            title="Tabla de clasificación"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1.5 rounded-2xl backdrop-blur-md shadow-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-200 tabular-nums">{totalCoins}</span>
          </div>

          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center active:scale-95 transition-all shadow-md"
            aria-label="Configuración"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Title Lockup & Mascot center */}
      <div className="flex flex-col items-center justify-center text-center my-auto pointer-events-none">
        {/* Floating Cartoon Rocket Icon */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-1 shadow-2xl shadow-cyan-500/30 animate-float-slow mb-4 flex items-center justify-center">
          <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-5xl">
            🚀
          </div>
        </div>

        {/* Bespoke inline SVG Title Lockup */}
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-orange-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
            ASTRO ESQUIVA
          </h1>
          <p className="text-sm sm:text-base font-bold text-cyan-300 tracking-wide mt-1 flex items-center justify-center gap-1.5 drop-shadow">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Aventura Espacial para Niños</span>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </p>
        </div>
      </div>

      {/* Bottom CTA & Controls Area */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-2.5 pointer-events-auto">
        {/* Primary Play Button */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onStartGame();
          }}
          className="w-full py-4 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-xl tracking-wider shadow-xl shadow-teal-500/30 active:scale-98 transition-all flex items-center justify-center gap-3 border-2 border-emerald-200/50"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>¡JUGAR AHORA!</span>
        </button>

        {/* Secondary Store Button */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenShop();
          }}
          className="w-full py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 text-white font-bold text-sm shadow-md backdrop-blur-md active:scale-98 transition-all flex items-center justify-center gap-2 text-amber-300"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Tienda Galáctica & Compras</span>
          <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-bold ml-1">
            Naves & IAP
          </span>
        </button>

        {/* PROMINENT DOWNLOAD PROJECT BUTTON (Pre-compiled without npm) */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenDownloads();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-900/90 to-cyan-950/90 hover:from-emerald-900 hover:to-cyan-900 border-2 border-emerald-400/60 text-emerald-200 font-black text-sm shadow-xl shadow-emerald-950/40 backdrop-blur-md active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>Descargar Proyecto Compilado (.ZIP)</span>
          <span className="text-[10px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
            Sin NPM
          </span>
        </button>

        {/* Single flat control hint line per game guidelines */}
        <div className="text-center pt-0.5 text-[11px] text-slate-400 font-medium">
          {controlType === 'touch_drag' ? (
            <span className="flex items-center justify-center gap-1">
              <Hand className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dedo Mágico: Desliza tu dedo en la pantalla para volar</span>
            </span>
          ) : (
            <span>Botones táctiles en pantalla · Teclado Flechas Izq / Der</span>
          )}
        </div>

        {/* Google Play Publishing & Billing Hub button */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenPublishingHub();
          }}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-indigo-950/85 to-purple-950/80 hover:from-cyan-900 hover:to-purple-900 border border-cyan-500/40 text-cyan-200 font-bold text-xs shadow-md backdrop-blur-md active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-sm">🚀</span>
          <span>Ficha Técnica Google Play & Pagos</span>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-semibold">
            Guía
          </span>
        </button>

        {/* Child Privacy Policy Link required for Google Play Families */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            onOpenPrivacy();
          }}
          className="text-center text-[10px] text-slate-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1 mt-0.5"
        >
          <span>🛡️ Privacidad Infantil (Google Play Families)</span>
        </button>
      </div>
    </div>
  );
};
