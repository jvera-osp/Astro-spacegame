import React from 'react';
import { sounds } from '../audio/soundEffects';
import { ShieldCheck, X, Heart, Lock, CheckCircle2, Mail } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 sm:p-6 select-none animate-in fade-in duration-200 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
              Política de Privacidad y Protección Infantil
            </h2>
            <p className="text-xs text-emerald-300 font-medium">
              Conforme a las Políticas de Familias de Google Play
            </p>
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

      {/* Content scroll area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1 text-xs text-slate-300 leading-relaxed">
        {/* Badge summary */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-emerald-200 font-semibold leading-snug">
            Esta aplicación está diseñada para ser 100% segura, educativa y divertida para niños de todas las edades. No rastreamos ni vendemos datos personales.
          </p>
        </div>

        {/* Section 1: Compromiso con los Niños (COPPA & GDPR-K) */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-300">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>1. Cumplimiento de Normativas Infantiles (COPPA / GDPR-K)</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Cumplimos estrictamente con la Ley de Protección de la Privacidad Infantil en Línea (COPPA) de EE.UU., el Reglamento General de Protección de Datos (GDPR-K) de la Unión Europea y el programa <em>Designed for Families</em> de Google Play. No solicitamos ni recopilamos nombres reales, direcciones de correo, ubicación GPS, fotos ni ningún dato que identifique a los menores.
          </p>
        </div>

        {/* Section 2: Datos y Almacenamiento Local */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
          <h3 className="font-bold text-white text-sm text-cyan-300">
            2. Datos de Juego y Almacenamiento Local
          </h3>
          <p className="text-[11px] text-slate-400">
            Todo el progreso del juego (puntuaciones máximas alcanzadas, monedas virtuales recolectadas, naves desbloqueadas y apodos de astronauta) se guarda <strong>exclusivamente en la memoria local de tu dispositivo</strong> (LocalStorage). Ningún dato se envía a servidores externos ni a bases de datos de terceros.
          </p>
        </div>

        {/* Section 3: Compras Integradas y Control Parental */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-pink-300">
            <Lock className="w-4 h-4 text-pink-400" />
            <span>3. Compras dentro de la App y Control Parental</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Las compras dentro del juego cuentan con una <strong>Barrera de Control Parental Activa</strong> (Parental Gate) que requiere resolver una operación matemática antes de abrir cualquier pantalla de pago. En esta versión demo de AI Studio, todas las transacciones son completamente simuladas y gratuitas sin cobro real a tarjetas de crédito.
          </p>
        </div>

        {/* Section 4: Publicidad y Rastreo */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
          <h3 className="font-bold text-white text-sm text-amber-300">
            4. Cero Anuncios Inapropiados y Sin Rastreadores
          </h3>
          <p className="text-[11px] text-slate-400">
            El juego no incluye anuncios de redes publicitarias externas no certificadas para niños, ni ventanas emergentes intrusivas, ni rastreo de comportamiento publicitario.
          </p>
        </div>

        {/* Section 5: Contacto para Padres y Tutores */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-emerald-300">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>5. Contacto para Padres y Educadores</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Si tienes dudas o sugerencias sobre la privacidad de la aplicación, puedes escribir al desarrollador en:
          </p>
          <p className="text-xs font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 inline-block">
            privacidad.astroesquiva@gmail.com
          </p>
        </div>
      </div>

      {/* Close Action Button */}
      <div className="pt-2 border-t border-slate-850 shrink-0">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all"
        >
          Entendido · Cerrar
        </button>
      </div>
    </div>
  );
};
