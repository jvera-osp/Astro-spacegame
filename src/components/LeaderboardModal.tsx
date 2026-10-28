import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game';
import { sounds } from '../audio/soundEffects';
import { X, Trophy, Medal, Star, Shield, Edit3, Check } from 'lucide-react';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  playerName,
  onUpdatePlayerName,
  onClose,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdatePlayerName(tempName.trim());
      sounds.playButtonTap();
    }
    setIsEditingName(false);
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col p-4 sm:p-6 select-none animate-in fade-in duration-200 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Trophy className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight leading-tight">Tabla de Clasificación</h2>
            <p className="text-xs text-amber-300/90">Los mejores pilotos de la galaxia</p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playButtonTap();
            onClose();
          }}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 active:scale-95 transition-transform"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Astronaut Nickname Customizer for Kids */}
      <div className="my-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧑‍🚀</span>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tu Nombre de Piloto</span>
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-0.5">
                <input
                  type="text"
                  maxLength={18}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2.5 py-1 bg-slate-950 border border-cyan-400 rounded-lg text-xs font-bold text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <p className="text-sm font-black text-cyan-300">{playerName}</p>
            )}
          </div>
        </div>

        {!isEditingName && (
          <button
            onClick={() => {
              sounds.playButtonTap();
              setIsEditingName(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold active:scale-95 transition-transform border border-slate-750"
          >
            <Edit3 className="w-3 h-3 text-cyan-400" />
            <span>Cambiar</span>
          </button>
        )}
      </div>

      {/* Leaderboard Table List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {entries.map((entry, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          const medalColors = ['#F59E0B', '#94A3B8', '#B45309'];

          return (
            <div
              key={entry.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                entry.isPlayer
                  ? 'bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border-cyan-400/80 shadow-md ring-1 ring-cyan-400/30'
                  : isTop3
                  ? 'bg-slate-900/80 border-slate-800 shadow-sm'
                  : 'bg-slate-900/50 border-slate-850'
              }`}
            >
              {/* Rank & Pilot */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm"
                  style={{
                    backgroundColor: isTop3 ? `${medalColors[index]}22` : '#1E293B',
                    color: isTop3 ? medalColors[index] : '#94A3B8',
                    border: isTop3 ? `1px solid ${medalColors[index]}88` : '1px solid #334155',
                  }}
                >
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-white flex items-center gap-1">
                      <span>{entry.name}</span>
                      {entry.isPlayer && (
                        <span className="text-[10px] bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 px-1.5 py-0.2 rounded-md font-bold">
                          ¡Tú!
                        </span>
                      )}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>🚀 {entry.shipName}</span>
                    <span>·</span>
                    <span>{entry.date}</span>
                  </div>
                </div>
              </div>

              {/* Score & Dodges stats */}
              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-base font-black text-amber-300 tabular-nums">
                    {entry.score.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-0.5">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span className="tabular-nums font-semibold text-cyan-300">
                    {entry.dodges} esquivados
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 text-center text-[11px] text-slate-400 border-t border-slate-850 shrink-0">
        💡 Cada obstáculo que esquivas suma <strong className="text-amber-300">+10 puntos</strong> a tu récord.
      </div>
    </div>
  );
};
