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
    <div className="absolute inset-x-0 bottom-4 px-4 flex items-center justify-between pointer-events-none z-20">
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
            className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-b from-sky-450 to-blue-600 active:from-blue-600 active:to-blue-700 text-white shadow-lg shadow-sky-950/60 flex items-center justify-center border-2 border-sky-300/60 active:scale-95 transition-transform"
            aria-label="Mover a la izquierda"
          >
            <ChevronLeft className="w-10 h-10 sm:w-12 sm:h-12" />
          </button>

          {/* Quick toggle mode pill */}
          <button
            onClick={onToggleControlMode}
            className="pointer-events-auto px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] font-medium backdrop-blur-md active:scale-95 transition-transform flex items-center gap-1.5"
          >
            <Hand className="w-3.5 h-3.5 text-amber-400" />
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
            className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-b from-sky-450 to-blue-600 active:from-blue-600 active:to-blue-700 text-white shadow-lg shadow-sky-950/60 flex items-center justify-center border-2 border-sky-300/60 active:scale-95 transition-transform"
            aria-label="Mover a la derecha"
          >
            <ChevronRight className="w-10 h-10 sm:w-12 sm:h-12" />
          </button>
        </>
      ) : (
        /* Direct Touch Drag: Gentle indicator and toggle */
        <div className="w-full flex items-center justify-center pointer-events-auto">
          <button
            onClick={onToggleControlMode}
            className="px-4 py-2 rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium backdrop-blur-md active:scale-95 transition-transform flex items-center gap-2 shadow-lg"
          >
            <Hand className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Dedo Mágico activado · Toca para botones</span>
          </button>
        </div>
      )}
    </div>
  );
};
