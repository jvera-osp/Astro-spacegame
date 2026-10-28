import React from 'react';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { ControlType } from '../types/game';

interface TouchControlsProps {
  controlType: ControlType;
  onMoveChange: (dir: number) => void;
  onToggleControlMode: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  controlType,
  onMoveChange,
  onToggleControlMode,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-2 sm:bottom-4 px-3 sm:px-6 flex items-center justify-between pointer-events-none z-20 pb-[env(safe-area-inset-bottom,8px)]">
      {controlType === 'buttons' ? (
        <>
          {/* Big Bouncy Left Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onMoveChange(-1);
            }}
            onPointerUp={() => onMoveChange(0)}
            onPointerCancel={() => onMoveChange(0)}
            className="pointer-events-auto w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-3xl bg-gradient-to-b from-sky-400 to-blue-600 active:from-blue-600 active:to-blue-700 text-white shadow-xl shadow-sky-950/70 flex items-center justify-center border-2 border-sky-300/60 active:scale-95 transition-transform touch-none"
            aria-label="Mover a la izquierda"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
          </button>

          {/* Quick toggle mode pill */}
          <button
            onClick={onToggleControlMode}
            className="pointer-events-auto px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/85 border border-slate-700/60 text-slate-300 hover:text-white text-[10px] sm:text-[11px] font-medium backdrop-blur-md active:scale-95 transition-transform flex items-center gap-1.5 shadow-md"
          >
            <Hand className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span>Modo Botones</span>
          </button>

          {/* Big Bouncy Right Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onMoveChange(1);
            }}
            onPointerUp={() => onMoveChange(0)}
            onPointerCancel={() => onMoveChange(0)}
            className="pointer-events-auto w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-3xl bg-gradient-to-b from-sky-400 to-blue-600 active:from-blue-600 active:to-blue-700 text-white shadow-xl shadow-sky-950/70 flex items-center justify-center border-2 border-sky-300/60 active:scale-95 transition-transform touch-none"
            aria-label="Mover a la derecha"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
          </button>
        </>
      ) : (
        /* Direct Touch Drag: Gentle indicator and toggle */
        <div className="w-full flex items-center justify-center pointer-events-auto">
          <button
            onClick={onToggleControlMode}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] sm:text-xs font-medium backdrop-blur-md active:scale-95 transition-transform flex items-center gap-1.5 sm:gap-2 shadow-lg"
          >
            <Hand className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>Dedo Mágico activado · Toca para botones</span>
          </button>
        </div>
      )}
    </div>
  );
};
