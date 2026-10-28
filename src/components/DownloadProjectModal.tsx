import React, { useState } from 'react';
import {
  X,
  Download,
  FileArchive,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Terminal,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  GitBranch,
} from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface DownloadProjectModalProps {
  onClose: () => void;
  onOpenPublishingHub?: () => void;
}

export const DownloadProjectModal: React.FC<DownloadProjectModalProps> = ({
  onClose,
  onOpenPublishingHub,
}) => {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const files = [
    {
      id: 'github-ready-zip',
      name: 'astro-esquiva-github-ready.zip',
      size: '520 KB',
      badge: '🚀 GitHub CI/CD Nube',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-400/30',
      description:
        'Proyecto completo con GitHub Actions (.github/workflows/) y scripts. Súbelo a GitHub y compila APK y AAB en la nube con un clic sin instalar nada en tu PC.',
      href: '/descargas/astro-esquiva-github-ready.zip',
      fallbackHref: '/astro-esquiva-github-ready.zip',
      icon: <GitBranch className="w-6 h-6 text-indigo-400" />,
      primary: true,
    },
    {
      id: 'android-zip',
      name: 'astro-esquiva-android-completo.zip',
      size: '479 KB',
      badge: 'Android Studio',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description:
        'Proyecto Android nativo pre-compilado con Capacitor y Gradle. NO requiere instalar Node.js ni NPM. Listo para abrir directamente en Android Studio.',
      href: '/descargas/astro-esquiva-android-completo.zip',
      fallbackHref: '/astro-esquiva-android-completo.zip',
      icon: <FileArchive className="w-6 h-6 text-emerald-400" />,
      primary: false,
    },
    {
      id: 'web-dist-zip',
      name: 'astro-esquiva-web-dist.zip',
      size: '177 KB',
      badge: 'Web / HTML5',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      description:
        'Archivos HTML, CSS y JavaScript minificados de producción (carpeta dist). Puedes ejecutarlos en cualquier servidor web o WebView.',
      href: '/descargas/astro-esquiva-web-dist.zip',
      fallbackHref: '/astro-esquiva-web-dist.zip',
      icon: <FileArchive className="w-6 h-6 text-cyan-400" />,
      primary: false,
    },
    {
      id: 'play-csv',
      name: 'google-play-catalog.csv',
      size: '2.0 KB',
      badge: 'Monetización Google Play',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description:
        'Archivo CSV con todos los 6 productos integrados y precios en formato oficial de Google Play Console (Importar en Productos Integrados).',
      href: '/descargas/google-play-catalog.csv',
      fallbackHref: '/google-play-catalog.csv',
      icon: <FileSpreadsheet className="w-6 h-6 text-amber-400" />,
      primary: false,
    },
    {
      id: 'privacy-html',
      name: 'politica_privacidad.html',
      size: '3.2 KB',
      badge: 'Play Families / COPPA',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      description:
        'Página HTML con la política de privacidad obligatoria para Google Play, adaptada a juegos para niños y familias sin recopilación de datos.',
      href: '/descargas/politica_privacidad.html',
      fallbackHref: '/politica_privacidad.html',
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      primary: false,
    },
    {
      id: 'instructions-txt',
      name: 'GUIA_PUBLICACION_PLAYSTORE.txt',
      size: '2.4 KB',
      badge: 'Guía Rápida',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
      description:
        'Instrucciones paso a paso de cómo abrir el proyecto en Android Studio, compilar el .AAB y subirlo a Google Play Console.',
      href: '/descargas/GUIA_PUBLICACION_PLAYSTORE.txt',
      fallbackHref: '/descargas/GUIA_PUBLICACION_PLAYSTORE.txt',
      icon: <Terminal className="w-6 h-6 text-slate-300" />,
      primary: false,
    },
  ];

  const handleDownloadClick = (fileId: string, href: string, fileName: string) => {
    sounds.playCoin();
    setDownloadedItem(fileId);
    
    // Direct anchor trigger to guarantee download starts in browser
    const a = document.createElement('a');
    a.href = href;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadedItem(null);
    }, 4000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    sounds.playCoin();
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex flex-col text-white select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Download className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight leading-tight">
                Centro de Descarga - Archivos Compilados
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Sin NPM ni Node
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Todos los paquetes ya están creados y listos para descargar a tu computadora
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playButtonTap();
            onClose();
          }}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* Banner Announcement */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-200">
                ¡Tu aplicación está 100% pre-compilada y empaquetada!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                No necesitas terminal, ni comandos, ni instalar Node.js. Haz clic en los botones de abajo para descargar los archivos directamente a tu carpeta de Descargas.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleDownloadClick(
                'android-zip',
                '/descargas/astro-esquiva-android-completo.zip',
                'astro-esquiva-android-completo.zip'
              );
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Todo en ZIP</span>
          </button>
        </div>

        {/* Files Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Archivos Disponibles para Descarga Inmediata</span>
            <span className="text-[11px] text-emerald-400 font-medium">
              5 archivos generados
            </span>
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className={`p-4 rounded-2xl border transition-all ${
                  file.primary
                    ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                    {file.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-bold text-sm text-white font-mono">{file.name}</h5>
                      <span className={`text-[10px] border px-2 py-0.5 rounded-full font-bold ${file.badgeColor}`}>
                        {file.badge}
                      </span>
                      <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono font-medium">
                        {file.size}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                      {file.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    href={file.href}
                    download={file.name}
                    onClick={() => {
                      sounds.playCoin();
                      setDownloadedItem(file.id);
                      setTimeout(() => setDownloadedItem(null), 3000);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 ${
                      file.primary
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {downloadedItem === file.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                        <span>¡Descargado!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Descargar</span>
                      </>
                    )}
                  </a>

                  {file.name.endsWith('.html') && (
                    <a
                      href={file.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5"
                      title="Ver en nueva pestaña"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Simple Steps */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>¿Cómo usar el proyecto sin instalar nada de npm? (3 Pasos Fáciles)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h5 className="font-bold text-xs text-white">Descomprime el ZIP</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                Descarga <strong className="text-white">astro-esquiva-android-completo.zip</strong> y descomprímelo en cualquier carpeta de tu computadora.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h5 className="font-bold text-xs text-white">Abre en Android Studio</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                En Android Studio haz clic en <strong>File &gt; Open</strong> y elige la carpeta <code className="text-cyan-300 font-mono">android</code>. Se sincronizará solo.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h5 className="font-bold text-xs text-white">Genera el APK o AAB</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                En el menú de Android Studio pulsa <strong>Build &gt; Generate Signed Bundle / APK</strong>. ¡Listo para subir a Google Play!
              </p>
            </div>
          </div>
        </div>

        {/* Play Store Publishing Hub shortcut */}
        {onOpenPublishingHub && (
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🚀</span>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  ¿Quieres revisar la ficha de Play Store, textos y capturas?
                </p>
                <p className="text-[11px] text-slate-400">
                  Abre la guía completa de publicación y ficha técnica de Google Play.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playButtonTap();
                onOpenPublishingHub();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-bold shrink-0 transition-colors"
            >
              Ver Ficha Técnica
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
        <span className="text-[11px] text-slate-400">
          Ubicación en disco del servidor: <code className="text-cyan-400 font-mono">/public/descargas/</code> y <code className="text-cyan-400 font-mono">/build/</code>
        </span>
        <button
          onClick={() => {
            sounds.playButtonTap();
            onClose();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs active:scale-95 transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
