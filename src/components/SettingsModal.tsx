import React, { useState } from 'react';
import { ControlType, DifficultyLevel } from '../types/game';
import { sounds } from '../audio/soundEffects';
import { X, Hand, Gamepad2, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  controlType: ControlType;
  onChangeControlType: (type: ControlType) => void;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onAddTestCoins: () => void;
  onResetProgress: () => void;
  onOpenPrivacy: () => void;
  onOpenPublishingHub: () => void;
  onOpenDownloads?: () => void;
  isDevMode?: boolean;
  onToggleDevMode?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  controlType,
  onChangeControlType,
  difficulty,
  onChangeDifficulty,
  isMuted,
  onToggleMute,
  onAddTestCoins,
  onResetProgress,
  onOpenPrivacy,
  onOpenPublishingHub,
  onOpenDownloads,
  isDevMode = false,
  onToggleDevMode,
  onClose,
}) => {
  const [tapCount, setTapCount] = useState(0);

  const handleVersionClick = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount >= 5) {
      sounds.playPurchaseSuccess();
      onToggleDevMode?.();
      setTapCount(0);
    } else {
      sounds.playButtonTap();
    }
  };
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-5 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h3 className="text-base font-bold text-white">Ajustes del Juego</h3>
          </div>
          <button
            onClick={() => {
              sounds.playButtonTap();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Controles Táctiles */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Modo de Control Táctil</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sounds.playButtonTap();
                onChangeControlType('touch_drag');
              }}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all active:scale-95 ${
                controlType === 'touch_drag'
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Hand className="w-4 h-4 text-cyan-400" />
                <span>Dedo Mágico</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Arrastra tu dedito directo en la pantalla (Fácil)
              </p>
            </button>

            <button
              onClick={() => {
                sounds.playButtonTap();
                onChangeControlType('buttons');
              }}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all active:scale-95 ${
                controlType === 'buttons'
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span>Botones Gigantes</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Flechas táctiles a los lados
              </p>
            </button>
          </div>
        </div>

        {/* Section 2: Dificultad para Niños */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Dificultad Espacial</label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                sounds.playButtonTap();
                onChangeDifficulty('easy');
              }}
              className={`py-2 px-1.5 rounded-xl border text-center font-bold text-xs transition-all ${
                difficulty === 'easy'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              🌱 Pequeñines
            </button>
            <button
              onClick={() => {
                sounds.playButtonTap();
                onChangeDifficulty('normal');
              }}
              className={`py-2 px-1.5 rounded-xl border text-center font-bold text-xs transition-all ${
                difficulty === 'normal'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              🚀 Normal
            </button>
            <button
              onClick={() => {
                sounds.playButtonTap();
                onChangeDifficulty('fast');
              }}
              className={`py-2 px-1.5 rounded-xl border text-center font-bold text-xs transition-all ${
                difficulty === 'fast'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              ⚡ Rápido
            </button>
          </div>
        </div>

        {/* Section 3: Audio Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Efectos de Sonido</span>
          </div>
          <button
            onClick={onToggleMute}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isMuted ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500 text-slate-950'
            }`}
          >
            {isMuted ? 'Silenciado' : 'Activado'}
          </button>
        </div>

        {/* Section 4: Actions & Tools */}
        <div className="pt-1 flex flex-col gap-2">
          {/* Developer only buttons - automatically hidden in production for players */}
          {isDevMode && (
            <>
              <button
                onClick={() => {
                  sounds.playPurchaseSuccess();
                  onAddTestCoins();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+1,000 Monedas Gratis (Modo Pruebas)</span>
              </button>

              {onOpenDownloads && (
                <button
                  onClick={() => {
                    sounds.playButtonTap();
                    onOpenDownloads();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <span>📦 Descargar Archivos Pre-Compilados (.ZIP)</span>
                </button>
              )}

              <button
                onClick={() => {
                  sounds.playButtonTap();
                  onOpenPublishingHub();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-900/60 to-blue-900/60 hover:from-cyan-800 hover:to-blue-800 text-cyan-200 font-bold text-xs border border-cyan-500/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🚀 Publicar en Google Play & Facturación</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenPrivacy();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🛡️ Política de Privacidad (Google Play)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Reiniciar récord y desbloqueos a los valores iniciales?')) {
                sounds.playHurt();
                onResetProgress();
              }
            }}
            className="w-full py-2 rounded-xl text-[11px] text-slate-500 hover:text-rose-400 transition-colors flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reiniciar Datos del Juego</span>
          </button>
        </div>

        {/* Footer: Version & Hidden Developer Unlock (Android Style 5-tap) */}
        <div className="pt-2 border-t border-slate-800/80 text-center flex flex-col items-center">
          <button
            type="button"
            onClick={handleVersionClick}
            className="text-[10px] text-slate-500 hover:text-slate-400 select-none transition-colors active:scale-95 py-1 px-2 rounded-lg hover:bg-slate-800/50"
            title="Toca 5 veces para activar/desactivar opciones de desarrollador"
          >
            Astro Esquiva v1.0.0 · Build 100
          </button>
          {tapCount > 0 && tapCount < 5 && (
            <p className="text-[10px] text-amber-400 animate-pulse mt-0.5">
              Estás a {5 - tapCount} toques de alternar modo desarrollador
            </p>
          )}
          {isDevMode && (
            <div className="mt-1 flex items-center justify-between w-full px-2 py-1 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-[10px]">
              <span className="text-cyan-300 font-medium">🛠️ Modo Desarrollador Activo</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playButtonTap();
                  onToggleDevMode?.();
                }}
                className="text-slate-400 hover:text-rose-400 underline font-semibold transition-colors"
              >
                Ocultar herramientas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
