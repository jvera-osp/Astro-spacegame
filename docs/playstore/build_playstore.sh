#!/bin/bash
# ==============================================================================
# Script de Compilación y Sincronización para Google Play (Astro Esquiva)
# ==============================================================================

set -e

echo ""
echo "🚀 [1/3] Iniciando compilación de Astro Esquiva para Google Play..."
echo "------------------------------------------------------------------"

# Paso 1: Compilar la versión de producción web con Vite
echo "📦 Generando paquete de producción web (npm run build)..."
npm run build

# Paso 2: Verificar o sincronizar la carpeta de Android
echo ""
echo "🔄 [2/3] Sincronizando assets y plugins con Capacitor Android..."
if [ ! -d "android" ]; then
  echo "⚠️ Carpeta android/ no detectada. Inicializando con Capacitor..."
  npx cap add android
fi

npx cap sync android

echo ""
echo "✅ [3/3] ¡Sincronización completada con éxito!"
echo "------------------------------------------------------------------"
echo "📱 Siguiente paso: Para abrir el proyecto en Android Studio y generar el .aab:"
echo "   👉 Ejecuta: npx cap open android"
echo "   👉 O desde Android Studio: Build > Generate Signed Bundle / APK > Android App Bundle"
echo "------------------------------------------------------------------"
echo ""
