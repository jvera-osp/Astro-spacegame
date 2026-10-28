import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { ShieldCheck, X, Heart, Lock, CheckCircle2, Mail, FileText, HelpCircle, Copy, Check } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'support'>('privacy');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const supportEmail = 'comasterclips@gmail.com';

  const handleCopyEmail = () => {
    sounds.playButtonTap();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(supportEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col select-none animate-in fade-in duration-200 text-white">
      <div className="w-full max-w-xl mx-auto h-full flex flex-col p-3 sm:p-5 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
              Políticas y Centro Legal
            </h2>
            <p className="text-xs text-emerald-300 font-medium">
              Programa Familias de Google Play · Privacidad Infantil
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playButtonTap();
            onClose();
          }}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 active:scale-95 transition-transform"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 mt-3 shrink-0">
        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('privacy');
          }}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacidad</span>
        </button>

        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('terms');
          }}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'terms'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Términos</span>
        </button>

        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('support');
          }}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'support'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Soporte</span>
        </button>
      </div>

      {/* Content scroll area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1 text-xs text-slate-300 leading-relaxed">
        {/* TAB 1: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <>
            {/* Badge summary */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-[11px] text-emerald-200 font-semibold leading-snug">
                <strong>Compromiso 100% Infantil Seguro:</strong> Cumplimos de manera estricta con las directrices de Google Play Designed for Families, COPPA (EE. UU.) y RGPD-K (Unión Europea).
              </p>
            </div>

            {/* Section 1: Compromiso con los Niños (COPPA & GDPR-K) */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-300">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>1. Cero Recopilación de Datos Personales</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Astro Esquiva <strong>no recopila, no almacena ni comparte</strong> ningún tipo de información de identificación personal (PII). No solicitamos nombres completos, correos electrónicos de los niños, números de teléfono, ubicación geográfica GPS, fotografías, contactos ni identificadores de publicidad dirigidos a menores.
              </p>
            </div>

            {/* Section 2: Datos y Almacenamiento Local */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h3 className="font-bold text-white text-sm text-cyan-300">
                2. Almacenamiento Exclusivamente Local
              </h3>
              <p className="text-[11px] text-slate-400">
                Todo el progreso del juego —incluyendo los récords de esquiva, monedas espaciales ganadas, naves espaciales desbloqueadas y preferencias de controles— se guarda <strong>únicamente en la memoria local del dispositivo</strong> del jugador (LocalStorage / SharedPreferences). Ningún registro o archivo de partida se transfiere a servidores externos.
              </p>
            </div>

            {/* Section 3: Compras Integradas y Control Parental */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-pink-300">
                <Lock className="w-4 h-4 text-pink-400" />
                <span>3. Facturación Oficial y Barrera Parental (Parental Gate)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Las compras dentro de la aplicación se realizan de forma segura mediante <strong>Google Play Billing</strong> de Google LLC. Para evitar compras involuntarias por parte de menores, la aplicación integra un desafío matemático de verificación para adultos (Parental Gate) antes de desplegar cualquier ventana de pago. Los desarrolladores nunca tienen acceso a datos de tarjetas de crédito o credenciales de pago.
              </p>
            </div>

            {/* Section 4: Publicidad y Rastreo */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h3 className="font-bold text-white text-sm text-amber-300">
                4. Cero Publicidad Engañosa o Inapropiada
              </h3>
              <p className="text-[11px] text-slate-400">
                El juego está completamente libre de redes publicitarias externas no certificadas, banners invasivos o enlaces emergentes hacia sitios web de terceros. El juego es un entorno lúdico protegido.
              </p>
            </div>

            {/* Section 5: Derechos de los Padres y Contacto */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-emerald-300">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>5. Derechos de Padres y Responsable de Privacidad</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Los padres o tutores legales pueden borrar todos los datos del juego en cualquier momento desde el menú de Ajustes utilizando el botón "Reiniciar Datos del Juego". Para cualquier consulta legal o de protección infantil, contáctanos directamente a:
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-mono text-cyan-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  {supportEmail}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
                  title="Copiar correo"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <>
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl space-y-1.5">
              <h3 className="font-bold text-cyan-300 text-sm">Términos de Servicio y Licencia</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Al descargar o jugar Astro Esquiva, aceptas estos Términos de Servicio diseñados para proteger tanto a los usuarios como a los desarrolladores.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-xs">1. Licencia de Uso</h4>
              <p className="text-[11px] text-slate-400">
                Se concede al usuario una licencia personal, no exclusiva, intransferible y revocable para usar y disfrutar de la aplicación con fines recreativos y no comerciales en dispositivos compatibles.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-xs">2. Monedas y Artículos Virtuales</h4>
              <p className="text-[11px] text-slate-400">
                Las monedas cósmicas, gemas y aspectos de naves son bienes virtuales sin valor monetario en el mundo real. No son canjeables por dinero en efectivo, divisas reales o bienes materiales fuera de la aplicación.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-xs">3. Reembolsos y Transacciones</h4>
              <p className="text-[11px] text-slate-400">
                Todas las compras se gestionan conforme a las condiciones de servicio y políticas de reembolso vigentes de Google Play Store. Las compras no consumibles (como naves únicas o packs permanentes) pueden restaurarse mediante el botón "Restaurar Compras" de la Tienda Galáctica.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-xs">4. Modificaciones y Actualizaciones</h4>
              <p className="text-[11px] text-slate-400">
                El desarrollador puede actualizar el balance de juego, agregar nuevas naves o mejorar la compatibilidad del sistema para ofrecer la mejor experiencia de juego a las familias.
              </p>
            </div>
          </>
        )}

        {/* TAB 3: SUPPORT & DEVELOPER CONTACT */}
        {activeTab === 'support' && (
          <div className="space-y-3">
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
              <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Atención al Jugador y Soporte Oficial</span>
              </h3>
              <p className="text-[11px] text-slate-300">
                ¿Tienes alguna sugerencia, consulta sobre compras o requieres asistencia técnica con la aplicación? Nuestro equipo de soporte está a tu disposición:
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Correo Electrónico Oficial:</p>
                <div className="flex items-center justify-between">
                  <a
                    href={`mailto:${supportEmail}?subject=Soporte%20Astro%20Esquiva`}
                    className="text-sm font-mono text-cyan-300 hover:underline font-bold"
                  >
                    {supportEmail}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">Tiempo de Respuesta:</span>
                  <span>Generalmente menos de 24-48 horas laborables.</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">Dispositivos:</span>
                  <span>Android 8.0 Oreo en adelante (Smartphones y Tablets).</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">Detalles de la Aplicación:</p>
              <p>• <strong>Nombre:</strong> Astro Esquiva: Aventura Espacial</p>
              <p>• <strong>Paquete:</strong> com.astroesquiva.spacegame</p>
              <p>• <strong>Versión:</strong> 1.0.0 (Build 100)</p>
              <p>• <strong>Clasificación:</strong> Apto para todo público (PEGI 3 / ESRB Everyone)</p>
            </div>
          </div>
        )}
      </div>

      {/* Close Action Button */}
      <div className="pt-2 border-t border-slate-800 shrink-0">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all"
        >
          Entendido · Volver al Juego
        </button>
      </div>
    </div>
  </div>
);
};
