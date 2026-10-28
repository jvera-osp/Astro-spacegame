import React from 'react';
import { ControlType, DifficultyLevel } from '../types/game';
import { sounds } from '../audio/soundEffects';
import { X, Hand, Gamepad2, Volume2, VolumeX, RefreshCw, ShieldCheck, Mail } from 'lucide-react';

interface SettingsModalProps {
  controlType: ControlType;
  onChangeControlType: (type: ControlType) => void;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetProgress: () => void;
  onOpenPrivacy: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  controlType,
  onChangeControlType,
  difficulty,
  onChangeDifficulty,
  isMuted,
  onToggleMute,
  onResetProgress,
  onOpenPrivacy,
  onClose,
}) => {
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
            aria-label="Cerrar ajustes"
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

        {/* Section 4: Privacy & Progress */}
        <div className="pt-1 flex flex-col gap-2">
          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenPrivacy();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Política de Privacidad y Términos</span>
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

        {/* Footer: Support & Version */}
        <div className="pt-2 border-t border-slate-800/80 text-center flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-slate-400 font-medium">
            Astro Esquiva v1.0.0 · Build 100
          </span>
          <a
            href="mailto:comasterclips@gmail.com"
            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
          >
            <Mail className="w-3 h-3" />
            <span>Soporte: comasterclips@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};
