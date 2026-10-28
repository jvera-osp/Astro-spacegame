import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Package,
  FileText,
  ShieldCheck,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { googlePlayBilling, GOOGLE_PLAY_PRODUCTS, GooglePlayProduct } from '../services/googlePlayBilling';
import { sounds } from '../audio/soundEffects';

interface PublishingHubModalProps {
  onClose: () => void;
  onOpenPrivacy: () => void;
  onTestPurchase: (product: GooglePlayProduct) => void;
  onRestorePurchases: () => void;
}

export const PublishingHubModal: React.FC<PublishingHubModalProps> = ({
  onClose,
  onOpenPrivacy,
  onTestPurchase,
  onRestorePurchases,
}) => {
  const [activeTab, setActiveTab] = useState<'billing' | 'packaging' | 'listing' | 'datasafety'>('billing');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sounds.playCoin();
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadCsv = () => {
    sounds.playCoin();
    const csvContent = googlePlayBilling.generateGooglePlayCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'google-play-catalog-astro-esquiva.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    sounds.playCoin();
    const jsonContent = googlePlayBilling.generateCatalogJson();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'google-play-catalog.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunRestore = async () => {
    sounds.playButtonTap();
    const result = await googlePlayBilling.restorePurchases();
    if (result.restoredCount > 0) {
      sounds.playPurchaseSuccess();
      setRestoreMessage(`¡Se restauraron ${result.restoredCount} compras correctamente!`);
      onRestorePurchases();
    } else {
      sounds.playCoin();
      setRestoreMessage('Consulta completada. No había compras pendientes por restaurar.');
    }
    setTimeout(() => setRestoreMessage(null), 4000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col text-white select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <CreditCard className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight leading-tight">
                Centro de Publicación Google Play & Facturación
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Play Billing v7.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Guía técnica, empaquetado .aab, catálogo de compras y políticas para niños
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playButtonTap();
            onClose();
          }}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 active:scale-90 transition-transform"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 pt-2 pb-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 shrink-0 overflow-x-auto">
        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('billing');
          }}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'billing'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>1. Pagos Google Play (Billing)</span>
        </button>

        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('packaging');
          }}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'packaging'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>2. Empaquetado Android (.AAB)</span>
        </button>

        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('listing');
          }}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'listing'
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-400/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>3. Ficha de Play Store</span>
        </button>

        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('datasafety');
          }}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'datasafety'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>4. Familias & Seguridad de Datos</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: GOOGLE PLAY BILLING */}
        {activeTab === 'billing' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Status card */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Google Play Billing Client Integrado</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] text-emerald-300 font-semibold">Listo para Producción</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ID de Paquete: <code className="text-amber-300">com.astroesquiva.spacegame</code> ·
                    Permiso: <code className="text-cyan-300">com.android.vending.BILLING</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunRestore}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Restaurar Compras</span>
                </button>
              </div>
            </div>

            {restoreMessage && (
              <div className="p-3 bg-cyan-950/70 border border-cyan-500/50 rounded-2xl text-xs text-cyan-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{restoreMessage}</span>
              </div>
            )}

            {/* Quick Export bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exportar Catálogo para Google Play Console</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Sube este archivo directamente en <em>Google Play Console &gt; Monetización &gt; Productos integrados</em>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCsv}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar .CSV Oficial</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Descargar .JSON</span>
                </button>
              </div>
            </div>

            {/* In-app products table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Catálogo de Productos Configurados ({GOOGLE_PLAY_PRODUCTS.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Precios en USD y micropagos para niños
                </span>
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {GOOGLE_PLAY_PRODUCTS.map((prod) => (
                  <div
                    key={prod.productId}
                    className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-800/90 flex items-center justify-center text-2xl shrink-0">
                        {prod.iconEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-bold text-sm text-white">{prod.title}</h5>
                          {prod.badge && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full font-bold">
                              {prod.badge}
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                            {prod.isConsumable ? 'Consumible' : 'Durable / No Consumible'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{prod.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded font-mono">
                            ID: {prod.productId}
                          </code>
                          <button
                            onClick={() => handleCopy(prod.productId, prod.productId)}
                            className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1"
                            title="Copiar Product ID"
                          >
                            {copiedId === prod.productId ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="text-right mr-2">
                        <span className="text-sm font-black text-emerald-400">{prod.price}</span>
                        <p className="text-[9px] text-slate-500 uppercase">Google Play</p>
                      </div>

                      <button
                        onClick={() => {
                          sounds.playButtonTap();
                          onTestPurchase(prod);
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Probar Compra</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANDROID PACKAGING */}
        {activeTab === 'packaging' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* DIRECT DOWNLOAD CARD (NO NPM NEEDED) */}
            <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      Archivos Pre-Compilados Listos para Descarga
                    </h3>
                    <p className="text-xs text-emerald-300">
                      ¡Ya compilamos todo por ti! No necesitas instalar Node.js ni npm en tu computadora.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  100% Pre-compilado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="/descargas/astro-esquiva-android-completo.zip"
                  download="astro-esquiva-android-completo.zip"
                  onClick={() => sounds.playCoin()}
                  className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-slate-950" />
                    <div className="text-left">
                      <div className="font-black">Proyecto Android Completo (.ZIP)</div>
                      <div className="text-[10px] text-slate-800 font-medium">Listo para Android Studio (479 KB)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">⬇️</span>
                </a>

                <a
                  href="/descargas/astro-esquiva-web-dist.zip"
                  download="astro-esquiva-web-dist.zip"
                  onClick={() => sounds.playCoin()}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <div className="text-left">
                      <div className="text-white font-bold">Web App Compilada (dist .ZIP)</div>
                      <div className="text-[10px] text-slate-400 font-medium">HTML5 + JS + CSS (177 KB)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">⬇️</span>
                </a>

                <a
                  href="/descargas/google-play-catalog.csv"
                  download="google-play-catalog.csv"
                  onClick={() => sounds.playCoin()}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-amber-400" />
                    <div className="text-left">
                      <div className="text-white font-bold">Catálogo Google Play (.CSV)</div>
                      <div className="text-[10px] text-slate-400 font-medium">Importar en Play Console (2 KB)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">⬇️</span>
                </a>

                <a
                  href="/descargas/politica_privacidad.html"
                  download="politica_privacidad.html"
                  onClick={() => sounds.playCoin()}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-400" />
                    <div className="text-left">
                      <div className="text-white font-bold">Política Privacidad (.HTML)</div>
                      <div className="text-[10px] text-slate-400 font-medium">Requerida por Google Play (3.2 KB)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">⬇️</span>
                </a>
              </div>
            </div>

            {/* Steps card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Opcional: Si prefieres compilar por terminal con Node.js / NPM</span>
              </h3>
              <p className="text-xs text-slate-400">
                Solo si deseas modificar el código fuente en tu computadora y recompilarlo manualmente:
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    step: '1. Instalar Capacitor Android',
                    cmd: 'npm install @capacitor/core @capacitor/android && npm install -D @capacitor/cli',
                  },
                  {
                    step: '2. Compilar assets de producción',
                    cmd: 'npm run build',
                  },
                  {
                    step: '3. Sincronizar proyecto nativo',
                    cmd: 'npx cap sync android',
                  },
                  {
                    step: '4. Abrir en Android Studio (Opcional)',
                    cmd: 'npx cap open android',
                  },
                  {
                    step: '5. Compilar Android App Bundle (.aab) por terminal',
                    cmd: 'cd android && ./gradlew bundleRelease',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between gap-3">
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 font-bold block">{item.step}</span>
                      <code className="text-xs text-cyan-300 font-mono block truncate">{item.cmd}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(item.cmd, `cmd-${idx}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
                    >
                      {copiedId === `cmd-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold text-[10px]">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Keystore signing guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generar Clave de Firma (Keystore para Google Play)</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Para subir a la Play Store necesitas firmar tu paquete con una clave privada. Ejecuta este comando una sola vez y guarda el archivo resultante en un lugar seguro:
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between gap-3">
                <code className="text-xs text-amber-200 font-mono truncate">
                  keytool -genkey -v -keystore astro-esquiva.keystore -alias astro_key -keyalg RSA -keysize 2048 -validity 10000
                </code>
                <button
                  onClick={() =>
                    handleCopy(
                      'keytool -genkey -v -keystore astro-esquiva.keystore -alias astro_key -keyalg RSA -keysize 2048 -validity 10000',
                      'keystore-cmd'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 shrink-0"
                >
                  {copiedId === 'keystore-cmd' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STORE LISTING */}
        {activeTab === 'listing' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Ficha de Google Play Store (Store Listing)</h3>
                  <p className="text-[11px] text-slate-400">
                    Textos redactados y optimizados con los límites de caracteres de Google Play
                  </p>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Título de la Aplicación (Máx. 30 caracteres)
                  </label>
                  <button
                    onClick={() => handleCopy('Astro Esquiva: Aventura Espacial', 'title')}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedId === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300">
                  Astro Esquiva: Aventura Espacial
                </div>
              </div>

              {/* Short description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Descripción Breve (Máx. 80 caracteres)
                  </label>
                  <button
                    onClick={() =>
                      handleCopy(
                        '¡Esquiva asteroides en el espacio con controles fáciles! Diseñado para niños.',
                        'short_desc'
                      )
                    }
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedId === 'short_desc' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                  ¡Esquiva asteroides en el espacio con controles fáciles! Diseñado para niños.
                </div>
              </div>

              {/* Full description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Descripción Completa (Para Google Play Store)
                  </label>
                  <button
                    onClick={() =>
                      handleCopy(
                        `🚀 ¡Bienvenido a Astro Esquiva: Aventura Espacial!

Un emocionante y colorido juego arcade diseñado especialmente para niños, donde volarás tu propia nave espacial a través de campos de asteroides, simpáticos ovnis y cometas resplandecientes.

✨ CARACTERÍSTICAS PRINCIPALES:
• 👆 Controles Fáciles y Táctiles: Con la función "Dedo Mágico", tu nave sigue suavemente tu dedo en la pantalla sin tapar el cohete. También incluye botones táctiles gigantes opcionales.
• 🛸 Desbloquea Naves Increíbles: Cohete Arcoíris, Platillo Amistoso, Nave Gatito Cósmico y el legendario Halcón Dorado VIP.
• 🛡️ Potenciadores Cósmicos: Escudos de protección, imanes que atraen estrellas y drones de rescate de vidas extra.
• 🏆 Tabla de Clasificación: Compite sanamente superando tus mejores puntuaciones.
• 🔒 100% Seguro para Familias: Cumple rigurosamente con la Política para Familias de Google Play (COPPA y GDPR-K). No recopila datos personales y cuenta con control parental matemático.

¡Ponte tu traje de astronauta y despega hacia las estrellas!`,
                        'full_desc'
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-800 text-xs text-amber-300 font-bold hover:bg-slate-700 flex items-center gap-1"
                  >
                    {copiedId === 'full_desc' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copiar Descripción Completa</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {`🚀 ¡Bienvenido a Astro Esquiva: Aventura Espacial!

Un emocionante y colorido juego arcade diseñado especialmente para niños, donde volarás tu propia nave espacial a través de campos de asteroides, simpáticos ovnis y cometas resplandecientes.

✨ CARACTERÍSTICAS PRINCIPALES:
• 👆 Controles Fáciles y Táctiles: Con la función "Dedo Mágico", tu nave sigue suavemente tu dedo en la pantalla sin tapar el cohete.
• 🛸 Desbloquea Naves Increíbles: Cohete Arcoíris, Platillo Amistoso, Nave Gatito Cósmico y el legendario Halcón Dorado VIP.
• 🛡️ Potenciadores Cósmicos: Escudos de protección, imanes que atraen estrellas y drones de rescate de vidas extra.
• 🏆 Tabla de Clasificación: Compite sanamente superando tus mejores puntuaciones.
• 🔒 100% Seguro para Familias: Cumple rigurosamente con la Política para Familias de Google Play (COPPA y GDPR-K).`}
                </div>
              </div>
            </div>

            {/* Graphics Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-white">Activos Gráficos Requeridos por Google Play:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-300 block">Icono de la App</span>
                  <span className="text-[11px] text-slate-400">512 x 512 px (PNG 32-bit)</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-cyan-300 block">Gráfico de Funciones</span>
                  <span className="text-[11px] text-slate-400">1024 x 500 px (JPG o PNG)</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-pink-300 block">Capturas de Pantalla</span>
                  <span className="text-[11px] text-slate-400">Mínimo 4 capturas en vertical</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATA SAFETY & FAMILIES POLICY */}
        {activeTab === 'datasafety' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  Formulario de Seguridad de los Datos (Data Safety) para Play Console
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Usa estas respuestas exactas al llenar el cuestionario obligatorio de Google Play Console:
              </p>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block text-[10px]">¿Tu app recopila o comparte datos personales?</span>
                    <span className="text-emerald-400 font-bold">NO (0 datos personales recolectados)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    Aprobado
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block text-[10px]">¿Dónde se almacenan las puntuaciones y compras?</span>
                    <span className="text-white font-bold">En el almacenamiento local del dispositivo (LocalStorage / Keystore)</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                    Local
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block text-[10px]">¿Cumple con la Política para Familias de Google Play?</span>
                    <span className="text-emerald-400 font-bold">SÍ (Directivas COPPA &amp; GDPR-K con Control Parental)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    Familias
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block text-[10px]">¿Contiene SDKs de anuncios de terceros?</span>
                    <span className="text-emerald-400 font-bold">NO (Experiencia 100% limpia sin publicidad)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    Sin Ads
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Política de Privacidad requerida en Google Play:</span>
                <button
                  onClick={() => {
                    sounds.playButtonTap();
                    onOpenPrivacy();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>Ver Política Infantil</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
